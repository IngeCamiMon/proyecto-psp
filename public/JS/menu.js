import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("menuForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);
  const categoria = document.getElementById("categoria").value.trim();
  const status = document.getElementById("menu-status");

  const camposValidos = nombre !== "" && !isNaN(precio) && precio > 0 && categoria !== "";

  if (camposValidos) {
    try {
      await addDoc(collection(db, "menu"), {
        nombre,
        precio,
        categoria,
        createdAt: serverTimestamp()
      });

      status.className = "status-message success";
      status.textContent = "Plato guardado correctamente.";
      document.getElementById("menuForm").reset();
    } catch (error) {
      console.error("Error al guardar el plato:", error);
      status.className = "status-message error";
      status.textContent = "Hubo un error al guardar el plato.";
    }
  } else {
    status.className = "status-message error";
    status.textContent = "Todos los campos son obligatorios y deben ser válidos.";
  }

  status.style.display = "block";
});
