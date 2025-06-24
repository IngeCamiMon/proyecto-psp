// JS/plantilla.js
document.addEventListener("DOMContentLoaded", () => {
  includeHTML("header", "header.html");
  includeHTML("footer", "footer.html");
});

function includeHTML(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    })
    .catch(err => console.error(`Error cargando ${file}:`, err));
}
