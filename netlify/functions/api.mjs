import { getStore } from "@netlify/blobs";
import { apply, emptyState } from "../lib/logic.mjs";

// Served at /api/* (Netlify Functions v2).
export const config = { path: "/api/*" };

const HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const send = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: HEADERS });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async (req) => {
  const route = new URL(req.url).pathname.replace(/^\/api\/?/, "").replace(/\/$/, "");
  const store = getStore({ name: "binduty", consistency: "strong" });

  const read = async () => (await store.get("state", { type: "json" })) || emptyState();
  const view = (state) => ({ now: Date.now(), loads: state.loads });

  async function mutate(action) {
    const state = await read();
    const result = apply(state, action, Date.now());
    if (result.error) return send({ error: result.error, ...view(state) }, result.status || 400);
    await store.setJSON("state", result.state);
    return send(view(result.state));
  }

  if (req.method === "GET" && route === "state") return send(view(await read()));
  if (req.method !== "POST") return send({ error: "Not found." }, 404);

  // Anyone with the link can mark the current load as done.
  if (route === "done") return mutate("done");

  // Everything else needs the admin PIN (the ADMIN_PIN environment variable).
  if (["auth", "new", "remove", "reopen"].includes(route)) {
    const pin = process.env.ADMIN_PIN;
    if (!pin) return send({ error: "ADMIN_PIN is not set on the server yet." }, 500);
    if (req.headers.get("x-admin-pin") !== pin) {
      await sleep(600); // slows down guessing
      return send({ error: "Wrong PIN." }, 401);
    }
    if (route === "auth") return send({ ok: true });
    return mutate(route);
  }

  return send({ error: "Not found." }, 404);
};
