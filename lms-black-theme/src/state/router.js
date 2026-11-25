import { useSyncExternalStore } from "react";

const subscribe = (cb) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); };
const read = () => window.location.hash.replace(/^#\/?/, "") || "dashboard";

export function useRoute() {
  const path = useSyncExternalStore(subscribe, read);
  return path.split("/").filter(Boolean);
}

export const go = (path) => { window.location.hash = `/${path}`; };
