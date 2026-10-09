import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Serves Aimaan's static portfolio (plain HTML/CSS/JS) at /aimaanayaz.
// The files live in "Aimaan Portfolio/" at the repo root and are copied there by
// tools/deploy.py in the portfolio project. Deleting that folder removes the page;
// this route just starts 404ing.
const ROOT = path.join(process.cwd(), "Aimaan Portfolio");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff2": "font/woff2",
};

async function readPortfolioFile(relPath: string): Promise<{ data: Buffer; ext: string } | null> {
  const filePath = path.join(ROOT, relPath);
  if (!filePath.startsWith(ROOT)) return null; // guard against path escape
  try {
    return { data: await readFile(filePath), ext: path.extname(filePath).toLowerCase() };
  } catch {
    return null;
  }
}

export async function GET(_req: NextRequest, { params }: { params: { slug?: string[] } }) {
  const relPath = !params.slug || params.slug.length === 0 ? "index.html" : params.slug.join("/");
  const found = await readPortfolioFile(relPath);
  if (!found) return new Response("Not found", { status: 404 });

  const isHtml = found.ext === ".html";
  return new Response(new Uint8Array(found.data), {
    headers: {
      "Content-Type": MIME_TYPES[found.ext] ?? "application/octet-stream",
      // pages always revalidate; images and fonts can be cached for a day
      "Cache-Control": isHtml || found.ext === ".js" || found.ext === ".css" ? "no-cache" : "public, max-age=86400",
    },
  });
}
