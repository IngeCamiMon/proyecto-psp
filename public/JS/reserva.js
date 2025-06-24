import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("reservaForm");
const status = document.getElementById("reserva-status");
const reservaList = document.getElementById("reserva-list");

// Crear reserva
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const fechaInput = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const personas = parseInt(document.getElementById("personas").value);

  const hoy = new Date();
  const fecha = new Date(fechaInput + "T00:00");
  const fechaValida = fechaInput && fecha > hoy;
  const horaValida = hora >= "12:00" && hora <= "22:00";
  const personasValidas = personas > 0;

  if (fechaValida && horaValida && personasValidas) {
    try {
      await addDoc(collection(db, "reservas"), {
        fecha: fechaInput,
        hora: hora,
        personas: personas,
        createdAt: serverTimestamp()
      });

      showStatus("¡Reserva realizada con éxito!", "success");
      form.reset();
      loadReservas();
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      showStatus("Hubo un error al guardar la reserva.", "error");
    }
  } else {
    showStatus("Verifica la fecha, hora y cantidad de personas.", "error");
  }
});

// Mostrar mensaje
function showStatus(msg, type) {
  status.textContent = msg;
  status.className = `status-message ${type}`;
  status.style.display = "block";
}

// Cargar reservas existentes
async function loadReservas() {
  const q = query(collection(db, "reservas"), orderBy("fecha", "asc"), orderBy("hora", "asc"));
  const snapshot = await getDocs(q);

  reservaList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const r = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${r.fecha}</strong> a las <strong>${r.hora}</strong> – ${r.personas} persona(s)</span>
      <button onclick="deleteReserva('${docSnap.id}')">Cancelar</button>
    `;
    reservaList.appendChild(li);
  });
}

// Eliminar reserva
window.deleteReserva = async (id) => {
  if (confirm("¿Estás seguro de cancelar esta reserva?")) {
    await deleteDoc(doc(db, "reservas", id));
    showStatus("Reserva cancelada.", "success");
    loadReservas();
  }
};

// Inicial
loadReservas();
