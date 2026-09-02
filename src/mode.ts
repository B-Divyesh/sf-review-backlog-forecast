export function isDemoLocation(location: Location = window.location): boolean {
  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  return pathname === "/demo" || new URLSearchParams(location.search).get("demo") === "1";
}
