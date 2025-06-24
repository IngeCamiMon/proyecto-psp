// gestiónMenu.js - versión no modular (usando compat)
const form = document.getElementById("menuForm");
const status = document.getElementById("menu-status");
const menuList = document.getElementById("menu-list");

let editId = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);
  const categoria = document.getElementById("categoria").value.trim();

  if (!nombre || isNaN(precio) || precio <= 0 || !categoria) {
    showStatus("Todos los campos son obligatorios y deben ser válidos.", "error");
    return;
  }

  try {
    if (editId) {
      // Actualizar plato existente
      const ref = firebase.firestore().collection("menu").doc(editId);
      await ref.update({ nombre, precio, categoria });
      showStatus("Plato actualizado correctamente.", "success");
      editId = null;
    } else {
      // Crear nuevo plato
      await firebase.firestore().collection("menu").add({
        nombre,
        precio,
        categoria,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showStatus("Plato guardado correctamente.", "success");
    }

    form.reset();
    loadMenu();
  } catch (err) {
    console.error(err);
    showStatus("Error al guardar el plato.", "error");
  }
});

function showStatus(msg, type) {
  status.textContent = msg;
  status.className = `status-message ${type}`;
  status.style.display = "block";
}

async function loadMenu() {
  const snapshot = await firebase.firestore().collection("menu").get();
  menuList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const item = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.nombre}</strong> - $${item.precio.toFixed(2)} (${item.categoria})
      <div>
        <button onclick="editPlato('${docSnap.id}', '${item.nombre}', ${item.precio}, '${item.categoria}')">Editar</button>
        <button onclick="deletePlato('${docSnap.id}')">Eliminar</button>
      </div>
    `;
    menuList.appendChild(li);
  });
}

// Estas funciones se exponen para que funcionen en el HTML
window.editPlato = (id, nombre, precio, categoria) => {
  document.getElementById("nombre").value = nombre;
  document.getElementById("precio").value = precio;
  document.getElementById("categoria").value = categoria;
  editId = id;
};

window.deletePlato = async (id) => {
  if (confirm("¿Seguro que deseas eliminar este plato?")) {
    await firebase.firestore().collection("menu").doc(id).delete();
    loadMenu();
    showStatus("Plato eliminado.", "success");
  }
};

// Cargar lista al iniciar
loadMenu();
