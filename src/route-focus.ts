/**
 * Give a full-page navigation the same clear destination as an in-app route.
 * `pageshow` also runs when a browser restores a page from its back/forward
 * cache, which is the case that otherwise leaves focus on the document body.
 */
function focusRouteHeading(): void {
  const heading = document.querySelector<HTMLElement>("main h1");
  const announcement = document.querySelector<HTMLElement>("#route-announcement");
  if (!heading) return;

  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  if (announcement) announcement.textContent = `${heading.textContent?.trim() ?? "Page"} loaded.`;
}

window.addEventListener("pageshow", () => {
  window.requestAnimationFrame(focusRouteHeading);
});
