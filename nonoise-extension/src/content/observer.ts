/**
 * Debounced MutationObserver: batches DOM bursts and triggers the sweeper at
 * most every 400ms, so heavy SPAs don't pay a per-mutation cost.
 */
export function startObserver(onMutations: () => void): () => void {
  let scheduled = false;
  let lastRun = 0;
  const MIN_INTERVAL = 400;

  const run = () => {
    scheduled = false;
    lastRun = Date.now();
    onMutations();
  };

  const observer = new MutationObserver(() => {
    if (scheduled) return;
    const elapsed = Date.now() - lastRun;
    scheduled = true;
    setTimeout(run, Math.max(0, MIN_INTERVAL - elapsed));
  });

  const start = () => {
    if (!document.documentElement) return;
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  return () => observer.disconnect();
}
