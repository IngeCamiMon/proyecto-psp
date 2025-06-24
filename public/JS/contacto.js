// contacto.js
import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const contactForm = document.getElementById("contactForm");
const status = document.getElementById("contact-status");

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (nombre && mensaje && emailValido) {
    try {
      await addDoc(collection(db, "contactos"), {
        nombre,
        email,
        mensaje,
        timestamp: serverTimestamp()
      });

      status.className = "status-message success";
      status.textContent = "Mensaje enviado correctamente.";
      contactForm.reset(); // Limpia el formulario
    } catch (error) {
      console.error("Error al guardar el mensaje:", error);
      status.className = "status-message error";
      status.textContent = "Hubo un error al enviar tu mensaje. Intenta más tarde.";
    }
  } else {
    status.className = "status-message error";
    status.textContent = "Todos los campos son obligatorios y el email debe ser válido.";
  }

  status.style.display = "block";
});
