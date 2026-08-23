# Z Agency — zaid.agency

Marketing site for Z Agency (AI-native product studio). Routes:
- `/` — landing page (hero, services showcase, about, trust bar, contact CTA)
- `/chat` — Z assistant chat UI, backed by `/api/z-chat`
- `/contact` — Formspree contact form

# Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- Framer Motion, Lenis (smooth scroll)
- Google Gemini 2.5 Flash for the Z assistant — free Google AI Studio (`GEMINI_API_KEY`)

# Commands
- Dev: npm run dev
- Build: npm run build
- Lint: npm run lint
- Typecheck: npm run typecheck   # run this after a series of changes

# Hard rules
- All AI calls go through Next.js API routes. NEVER put API keys in client code.
- NEVER use generic AI aesthetics (Inter/Roboto/Arial/system fonts, purple gradients, cookie-cutter layouts). Use distinctive fonts, a cohesive theme, and micro-interactions.
- Keep it simple — no unnecessary "production-grade" complexity. Simplest approach that looks premium.
- Must look and perform well on mobile.

# Deployment
Hostinger (Node 22), deployed from GitHub `main`. The app needs a manual restart after a deploy.
