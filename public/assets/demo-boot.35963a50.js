(() => {
  if (new URLSearchParams(window.location.search).get("demo") !== "1") return;
  document.documentElement.classList.add("demo-mode");
  document.title = "Demo — Review Backlog Forecast";
})();
