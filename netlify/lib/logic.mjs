// Rotation rules. Pure functions, no storage, so they are easy to test.
// State shape: { loads: [{ n, who, createdAt, doneAt }] }  (times in ms since epoch)

export const DAY = 86400000;

export function emptyState() {
  return { loads: [] };
}

export function derive(state) {
  const loads = state.loads;
  const last = loads.length ? loads[loads.length - 1] : null;
  const pending = last && last.doneAt == null ? last : null;
  const next = last ? (last.who === "kamran" ? "abid" : "kamran") : "kamran";
  return { last, pending, next };
}

// Returns { state } on success or { error, status } on refusal.
export function apply(state, action, now) {
  const s = structuredClone(state);
  const d = derive(s);

  if (action === "new") {
    if (d.pending) return { error: "A load is already open.", status: 409 };
    s.loads.push({ n: (d.last ? d.last.n : 0) + 1, who: d.next, createdAt: now, doneAt: null });
    return { state: s };
  }
  if (action === "done") {
    if (!d.pending) return { error: "No load is waiting.", status: 409 };
    d.pending.doneAt = now;
    return { state: s };
  }
  if (action === "remove") {
    if (!d.pending) return { error: "No open load to remove.", status: 409 };
    s.loads.pop();
    return { state: s };
  }
  if (action === "reopen") {
    if (!d.last || d.last.doneAt == null) return { error: "Nothing to reopen.", status: 409 };
    d.last.doneAt = null;
    return { state: s };
  }
  return { error: "Unknown action.", status: 400 };
}
