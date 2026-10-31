import { NextRequest } from "next/server";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

// DSA Quest (Aimaan's study app) at /dsa, locked behind a PIN.
//
// - The app's files live in "DSA Quest/" at the repo root. They are copied there by tools/publish-web.js in the
//   DSA Quest project. Deleting that folder removes the page; this route just starts 404ing.
// - The PIN is the DSA_PIN environment variable on Hostinger. It is never in the code. Without it nothing opens.
// - The right PIN sets a cookie signed with a random server secret, renewed on every visit, so a device asks once.
//   Wrong PINs are rate limited per IP and overall.
// - Progress is saved as one JSON file in a data folder outside the deployed code (DSA_DATA_DIR, or
//   ~/dsa-quest-data), so a deploy never touches it. One snapshot per day is kept for 30 days.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const APP_DIR = path.join(process.cwd(), "DSA Quest");
const COOKIE = "dsa_pass";
const COOKIE_MAX_AGE = 400 * 24 * 3600; // browsers cap cookies at 400 days; every visit renews it
const MAX_BODY = 5 * 1024 * 1024;
const SNAPSHOTS_KEPT = 30;

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff2": "font/woff2",
};

type Ctx = { params: { slug?: string[] } };
type Stored = { rev: number; savedAt: number; state: unknown };

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers } });

// ───────────────────────── Data folder (first writable candidate wins)

let dirPromise: Promise<string> | null = null;
function dataDir(): Promise<string> {
  if (!dirPromise) {
    dirPromise = (async () => {
      const candidates = [
        process.env.DSA_DATA_DIR,
        path.join(os.homedir(), "dsa-quest-data"),
        path.join(process.cwd(), "..", "dsa-quest-data"),
        path.join(process.cwd(), ".dsa-quest-data"), // last resort: inside the app folder, may not survive a deploy
      ].filter((d): d is string => !!d);
      for (const dir of candidates) {
        try {
          await mkdir(dir, { recursive: true });
          const probe = path.join(dir, ".write-test");
          await writeFile(probe, "ok");
          await unlink(probe);
          return dir;
        } catch {
          // not writable here, try the next one
        }
      }
      throw new Error("No writable folder for DSA Quest data");
    })().catch((e) => {
      dirPromise = null;
      throw e;
    });
  }
  return dirPromise;
}

// ───────────────────────── PIN and cookie

let secretPromise: Promise<string> | null = null;
function serverSecret(): Promise<string> {
  if (!secretPromise) {
    secretPromise = (async () => {
      const file = path.join(await dataDir(), "secret.key");
      try {
        const s = (await readFile(file, "utf8")).trim();
        if (s.length >= 32) return s;
      } catch {
        // no secret yet
      }
      const s = randomBytes(32).toString("hex");
      await writeFile(file, s, { mode: 0o600 });
      return s;
    })().catch((e) => {
      secretPromise = null;
      throw e;
    });
  }
  return secretPromise;
}

// The cookie value depends on the PIN and a random secret only the server knows, so it cannot be guessed,
// and changing DSA_PIN signs every device out.
async function sessionToken(): Promise<string | null> {
  const pin = process.env.DSA_PIN;
  if (!pin) return null;
  return createHmac("sha256", await serverSecret()).update("dsa-quest:" + pin).digest("base64url");
}

const sameText = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

async function isUnlocked(req: NextRequest): Promise<boolean> {
  const got = req.cookies.get(COOKIE)?.value;
  if (!got) return false;
  const want = await sessionToken().catch(() => null);
  return !!want && sameText(got, want);
}

const cookieHeader = (value: string, maxAge: number) =>
  `${COOKIE}=${value}; Path=/dsa; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;

// Wrong PINs: 5 per IP, then a 15 minute lock; 30 per hour overall, then everyone waits.
const IP_LIMIT = 5, IP_LOCK_MS = 15 * 60_000, GLOBAL_LIMIT = 30, GLOBAL_WINDOW_MS = 60 * 60_000;
const ipFails = new Map<string, { n: number; until: number }>();
let globalFails: number[] = [];

const clientIp = (req: NextRequest) =>
  (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";

function lockedForMs(ip: string): number {
  const now = Date.now();
  globalFails = globalFails.filter((t) => now - t < GLOBAL_WINDOW_MS);
  const overall = globalFails.length >= GLOBAL_LIMIT ? GLOBAL_WINDOW_MS - (now - globalFails[0]) : 0;
  const e = ipFails.get(ip);
  const mine = e && e.until > now ? e.until - now : 0;
  return Math.max(overall, mine);
}

function recordFail(ip: string): number {
  const now = Date.now();
  globalFails.push(now);
  if (ipFails.size > 1000) ipFails.forEach((v, k) => { if (v.until && v.until < now) ipFails.delete(k); });
  const e = ipFails.get(ip) || { n: 0, until: 0 };
  if (e.until && e.until <= now) { e.n = 0; e.until = 0; }
  e.n += 1;
  if (e.n >= IP_LIMIT) e.until = now + IP_LOCK_MS;
  ipFails.set(ip, e);
  return Math.max(0, IP_LIMIT - e.n);
}

// Every write must come from the app's own scripts (a custom header cannot be sent cross-site without permission).
const fromApp = (req: NextRequest) => req.headers.get("x-dq") === "1";

// ───────────────────────── Progress storage

let cache: Stored | null | undefined; // undefined: not read yet
let queue: Promise<unknown> = Promise.resolve();
const serial = <T,>(fn: () => Promise<T>): Promise<T> => {
  const p = queue.then(fn);
  queue = p.catch(() => undefined);
  return p;
};

async function loadState(): Promise<Stored | null> {
  if (cache !== undefined) return cache;
  try {
    cache = JSON.parse(await readFile(path.join(await dataDir(), "state.json"), "utf8")) as Stored;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    cache = null;
  }
  return cache;
}

const istDay = (ms: number) => new Date(ms + 5.5 * 3600_000).toISOString().slice(0, 10);

async function saveState(next: Stored): Promise<void> {
  const dir = await dataDir();
  const file = path.join(dir, "state.json");
  await writeFile(file + ".tmp", JSON.stringify(next));
  await rename(file + ".tmp", file); // atomic: a crash mid-write never leaves half a file
  cache = next;
  const snaps = path.join(dir, "snapshots");
  await mkdir(snaps, { recursive: true });
  await writeFile(path.join(snaps, `${istDay(next.savedAt)}.json`), JSON.stringify(next));
  const days = (await readdir(snaps)).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
  for (const old of days.slice(0, Math.max(0, days.length - SNAPSHOTS_KEPT))) await unlink(path.join(snaps, old)).catch(() => undefined);
}

// ───────────────────────── Files

async function readAppFile(relPath: string): Promise<{ data: Buffer; ext: string } | null> {
  const filePath = path.join(APP_DIR, relPath);
  if (!filePath.startsWith(APP_DIR + path.sep) && filePath !== APP_DIR) return null; // guard against path escape
  try {
    return { data: await readFile(filePath), ext: path.extname(filePath).toLowerCase() };
  } catch {
    return null;
  }
}

function fileResponse(found: { data: Buffer; ext: string }, extra: Record<string, string> = {}) {
  const isFont = found.ext === ".woff2";
  return new Response(new Uint8Array(found.data), {
    headers: {
      "Content-Type": MIME_TYPES[found.ext] ?? "application/octet-stream",
      "Cache-Control": isFont ? "public, max-age=86400" : "private, no-cache",
      "X-Robots-Tag": "noindex, nofollow",
      ...extra,
    },
  });
}

async function gate(): Promise<Response> {
  const found = await readAppFile("gate.html");
  if (!found) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(found.data), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

// ───────────────────────── Handlers

export async function GET(req: NextRequest, { params }: Ctx) {
  const slug = params.slug ?? [];
  const relPath = slug.length === 0 ? "index.html" : slug.join("/");

  // The PIN screen's fonts are the only files served before unlocking.
  if (relPath.startsWith("assets/fonts/")) {
    const font = await readAppFile(relPath);
    return font ? fileResponse(font) : new Response("Not found", { status: 404 });
  }

  const unlocked = await isUnlocked(req);

  if (slug[0] === "api") {
    if (!unlocked) return json({ error: "locked" }, 401);
    if (slug[1] === "state") {
      const cur = await loadState();
      if (!cur) return json({ empty: true });
      const have = Number(req.nextUrl.searchParams.get("have"));
      if (have && have === cur.rev) return json({ rev: cur.rev, savedAt: cur.savedAt, same: true });
      return json(cur);
    }
    if (slug[1] === "health") {
      const cur = await loadState();
      return json({ ok: true, dataDir: await dataDir(), rev: cur ? cur.rev : 0, savedAt: cur ? cur.savedAt : null });
    }
    return json({ error: "not found" }, 404);
  }

  if (!unlocked) {
    const isPage = relPath === "index.html" || !path.extname(relPath);
    return isPage ? gate() : new Response("Locked", { status: 401 });
  }

  const found = await readAppFile(relPath);
  if (!found) return new Response("Not found", { status: 404 });
  // Opening the app renews the cookie, so a device that is used at least once a year is never asked again.
  const renew = relPath === "index.html" ? { "Set-Cookie": cookieHeader(req.cookies.get(COOKIE)!.value, COOKIE_MAX_AGE) } : undefined;
  return fileResponse(found, renew);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const action = (params.slug ?? []).join("/");
  if (!fromApp(req)) return json({ error: "forbidden" }, 403);

  if (action === "unlock") {
    const ip = clientIp(req);
    const wait = lockedForMs(ip);
    if (wait > 0) return json({ error: "locked", minutes: Math.ceil(wait / 60_000) }, 429);
    let token: string | null;
    try {
      token = await sessionToken();
    } catch {
      return json({ error: "storage" }, 500);
    }
    if (!token) return json({ error: "not-configured" }, 503);
    const body = (await req.json().catch(() => ({}))) as { pin?: unknown };
    const pin = typeof body.pin === "string" ? body.pin.trim() : "";
    if (!pin || !sameText(pin, process.env.DSA_PIN || "")) {
      const left = recordFail(ip);
      return json({ error: "wrong", left }, 401);
    }
    return json({ ok: true }, 200, { "Set-Cookie": cookieHeader(token, COOKIE_MAX_AGE) });
  }

  if (action === "lock") return json({ ok: true }, 200, { "Set-Cookie": cookieHeader("", 0) });

  return json({ error: "not found" }, 404);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  if ((params.slug ?? []).join("/") !== "api/state") return json({ error: "not found" }, 404);
  if (!fromApp(req)) return json({ error: "forbidden" }, 403);
  if (!(await isUnlocked(req))) return json({ error: "locked" }, 401);

  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ error: "too large" }, 413);
  let body: { state?: { v?: number; items?: unknown }; baseRev?: number };
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "bad json" }, 400);
  }
  const state = body.state;
  if (!state || typeof state !== "object" || state.v !== 2 || typeof state.items !== "object") return json({ error: "not a DSA Quest state" }, 400);

  return serial(async () => {
    const cur = await loadState();
    // Another device saved since this one last synced: send back the newer copy and let the app decide.
    if (cur && (body.baseRev ?? 0) !== cur.rev) return json(cur, 409);
    const next: Stored = { rev: (cur ? cur.rev : 0) + 1, savedAt: Date.now(), state };
    await saveState(next);
    return json({ rev: next.rev, savedAt: next.savedAt });
  });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if ((params.slug ?? []).join("/") !== "api/state") return json({ error: "not found" }, 404);
  if (!fromApp(req)) return json({ error: "forbidden" }, 403);
  if (!(await isUnlocked(req))) return json({ error: "locked" }, 401);
  return serial(async () => {
    const cur = await loadState();
    if (cur) {
      const dir = await dataDir();
      // Keep a copy of what was deleted, just in case.
      await mkdir(path.join(dir, "snapshots"), { recursive: true }).catch(() => undefined);
      await writeFile(path.join(dir, "snapshots", `deleted-${Date.now()}.json`), JSON.stringify(cur)).catch(() => undefined);
      await unlink(path.join(dir, "state.json")).catch(() => undefined);
      cache = null;
    }
    return json({ ok: true });
  });
}
