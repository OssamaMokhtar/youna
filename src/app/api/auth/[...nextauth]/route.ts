import { NextRequest } from "next/server";

// Lazy-load the NextAuth handlers only when the route is actually called.
// This prevents the static build from crashing when DATABASE_URL is not set
// (PrismaClient constructor fails during page collection if no DB URL is available).
//
// In production (Vercel/Node.js), the env var will be set and this works normally.
// During `next build` without a .env.local DATABASE_URL, the import is skipped
// and the route returns a 503 — which is fine because auth isn't available yet
// until the database is provisioned (Phase 3+).

type Handler = (req: NextRequest) => Promise<Response>;

let handlers: { GET: Handler; POST: Handler } | null = null;

async function getHandlers(): Promise<{ GET: Handler; POST: Handler }> {
  if (handlers) return handlers;
  try {
    const { handlers: h } = await import("@/lib/auth");
    handlers = h as { GET: Handler; POST: Handler };
    return handlers;
  } catch {
    // No DATABASE_URL — return a minimal handler that tells the client
    // auth isn't available yet (expected during early dev / before DB provisioning).
    const notAvailable: Handler = async (_req) =>
      new Response(
        JSON.stringify({ error: "Authentication not available — database not provisioned yet" }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        },
      );
    handlers = { GET: notAvailable, POST: notAvailable };
    return handlers;
  }
}

export async function GET(req: NextRequest) {
  const h = await getHandlers();
  return h.GET(req);
}

export async function POST(req: NextRequest) {
  const h = await getHandlers();
  return h.POST(req);
}
