// Service Worker registration with strict preview/dev guards.
// Registers /sw.js only in production on the real domain — never in the
// Lovable editor iframe, preview subdomains, dev, or when ?sw=off is set.

const APP_SW_URL = "/sw.js";
const LEGACY_SW_URLS = ["/service-worker.js"];

function isRefusedContext(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get("sw") === "off") return true;
    if (window.top !== window.self) return true; // iframe (editor preview)
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return true;
    if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
    if (host === "lovableproject.com" || host.endsWith(".lovableproject.com")) return true;
    if (host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com")) return true;
    if (host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev")) return true;
  } catch {
    return true;
  }
  return false;
}

async function unregisterAppWorkers() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      regs
        .filter((r) => {
          const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || "";
          return [APP_SW_URL, ...LEGACY_SW_URLS].some((p) => url.endsWith(p));
        })
        .map((r) => r.unregister()),
    );
  } catch {
    /* ignore */
  }
}

export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  if (isRefusedContext()) {
    void unregisterAppWorkers();
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(APP_SW_URL, { scope: "/" })
      .catch((err) => console.warn("[sw] register failed:", err));
  });
}
