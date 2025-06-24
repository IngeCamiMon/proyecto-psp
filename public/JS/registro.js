import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email");
  const password = document.getElementById("register-password");
  const emailError = document.getElementById("email-error");
  const passError = document.getElementById("register-password-error");
  const status = document.getElementById("register-status");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  const passValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password.value);

  emailError.textContent = emailValid ? "" : "Correo no válido";
  passError.textContent = passValid ? "" : "Contraseña débil";

  if (!emailValid || !passValid) {
    status.style.display = "block";
    status.className = "status-message error";
    status.textContent = "Corrige los errores antes de continuar.";
    return;
  }

  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    // Guardar datos en Firestore
    await addDoc(collection(db, "usuarios"), {
      uid: user.uid,
      email: user.email,
      createdAt: serverTimestamp()
    });

    status.style.display = "block";
    status.className = "status-message success";
    status.textContent = "Registro exitoso.";
    document.getElementById("registerForm").reset();
  } catch (error) {
    console.error("Error de registro:", error);
    status.style.display = "block";
    status.className = "status-message error";

    if (error.code === "auth/email-already-in-use") {
      status.textContent = "El correo ya está registrado.";
    } else {
      status.textContent = "Ocurrió un error. Intenta de nuevo.";
    }
  }
});
