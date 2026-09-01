(() => {
  if (new URLSearchParams(window.location.search).get("demo") !== "1") return;
  document.documentElement.classList.add("demo-mode");
  document.title = "Demo — Review Backlog Forecast";
  const replaceHeading = (element, tagName) => {
    if (!element || element.tagName.toLowerCase() === tagName) return;
    const replacement = document.createElement(tagName);
    for (const attribute of element.attributes) replacement.setAttribute(attribute.name, attribute.value);
    replacement.innerHTML = element.innerHTML;
    element.replaceWith(replacement);
  };
  document.getElementById("results").hidden = false;
  replaceHeading(document.getElementById("page-title"), "p");
  replaceHeading(document.getElementById("results-title"), "h1");
})();
