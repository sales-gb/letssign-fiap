function loadHeader(basePath) {
  fetch(basePath + "src/components/header.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("header").innerHTML = html;
      const logo = document.getElementById("logo");
      if (logo) {
        logo.src = basePath + logo.getAttribute("data-src");
      }
      document.querySelectorAll("#header a[data-href]").forEach((link) => {
        link.href = basePath + link.getAttribute("data-href");
      });
    });
}
