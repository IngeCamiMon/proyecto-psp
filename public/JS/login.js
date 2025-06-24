import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const CONFIG = {
  validation: {
    minPasswordLength: 8,
    maxPasswordLength: 128,
    minUsernameLength: 3,
    maxUsernameLength: 50,
    passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    usernameRegex: /^[a-zA-Z0-9._-]+$/
  },
  messages: {
    error: {
      emptyUsername: 'El usuario es requerido',
      emptyPassword: 'La contraseña es requerida',
      invalidEmail: 'Por favor ingresa un email válido',
      shortUsername: 'El usuario debe tener al menos 3 caracteres',
      longUsername: 'El usuario no puede exceder 50 caracteres',
      invalidUsernameFormat: 'El usuario solo puede contener letras, números, puntos, guiones y guiones bajos',
      shortPassword: 'La contraseña debe tener al menos 8 caracteres',
      longPassword: 'La contraseña no puede exceder 128 caracteres',
      weakPassword: 'La contraseña debe incluir mayúsculas, minúsculas, números y símbolos especiales',
      loginFailed: 'Credenciales incorrectas. Intenta de nuevo.'
    },
    success: {
      validField: 'Campo válido',
      loginSuccess: 'Inicio de sesión exitoso. ¡Bienvenido!'
    }
  }
};

class ValidationSystem {
  validateUsername(username) {
    if (!username)
      return { isValid: false, message: CONFIG.messages.error.emptyUsername };

    if (username.length < CONFIG.validation.minUsernameLength)
      return { isValid: false, message: CONFIG.messages.error.shortUsername };

    if (username.length > CONFIG.validation.maxUsernameLength)
      return { isValid: false, message: CONFIG.messages.error.longUsername };

    if (!CONFIG.validation.emailRegex.test(username))
      return { isValid: false, message: CONFIG.messages.error.invalidEmail };

    return { isValid: true, message: CONFIG.messages.success.validField };
  }

  validatePassword(password) {
    if (!password)
      return { isValid: false, message: CONFIG.messages.error.emptyPassword };

    if (password.length < CONFIG.validation.minPasswordLength)
      return { isValid: false, message: CONFIG.messages.error.shortPassword };

    if (password.length > CONFIG.validation.maxPasswordLength)
      return { isValid: false, message: CONFIG.messages.error.longPassword };

    if (!CONFIG.validation.passwordRegex.test(password))
      return { isValid: false, message: CONFIG.messages.error.weakPassword };

    return { isValid: true, message: CONFIG.messages.success.validField };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const usernameError = document.getElementById('username-error');
  const passwordError = document.getElementById('password-error');
  const form = document.getElementById('loginForm');
  const statusMessage = document.getElementById('statusMessage');
  const submitButton = document.getElementById('submitButton');
  const loadingSpinner = submitButton.querySelector(".loading-spinner");
  const togglePasswordBtn = document.querySelector(".toggle-password");
  const eyeOpen = togglePasswordBtn.querySelector(".eye-open");
  const eyeClosed = togglePasswordBtn.querySelector(".eye-closed");

  const validator = new ValidationSystem();

  usernameInput.addEventListener('blur', () => {
    const result = validator.validateUsername(usernameInput.value.trim());
    usernameError.textContent = result.isValid ? '' : result.message;
  });

  passwordInput.addEventListener('blur', () => {
    const result = validator.validatePassword(passwordInput.value);
    passwordError.textContent = result.isValid ? '' : result.message;
  });

  togglePasswordBtn.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    eyeOpen.style.display = type === "text" ? "none" : "inline";
    eyeClosed.style.display = type === "text" ? "inline" : "none";
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    const userResult = validator.validateUsername(username);
    const passResult = validator.validatePassword(password);

    usernameError.textContent = userResult.isValid ? '' : userResult.message;
    passwordError.textContent = passResult.isValid ? '' : passResult.message;

    if (userResult.isValid && passResult.isValid) {
      submitButton.disabled = true;
      loadingSpinner.style.display = "inline-flex";

      try {
        await signInWithEmailAndPassword(auth, username, password);

        statusMessage.style.display = "block";
        statusMessage.className = "status-message success";
        statusMessage.textContent = CONFIG.messages.success.loginSuccess;
        form.reset();
      } catch (error) {
        console.error("Error de login:", error);
        statusMessage.style.display = "block";
        statusMessage.className = "status-message error";
        statusMessage.textContent = CONFIG.messages.error.loginFailed;
      } finally {
        loadingSpinner.style.display = "none";
        submitButton.disabled = false;
      }
    } else {
      statusMessage.style.display = "block";
      statusMessage.className = "status-message error";
      statusMessage.textContent = "Por favor corrige los errores antes de continuar.";
    }
  });
});
