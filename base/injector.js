function inject() {
  let injectable_header = document.getElementById("injectable-header");
  let injectable_footer = document.getElementById("injectable-footer");

  let header;
  let footer;

  fetch("base/header.html")
    .then((response) => response.text())
    .then((data) => {
      header = data;
      injectable_header.innerHTML = header;
    });
  fetch("base/footer.html")
    .then((response) => response.text())
    .then((data) => {
      footer = data;
      injectable_footer.innerHTML = footer;
    });
}
document.addEventListener("DOMContentLoaded", inject)