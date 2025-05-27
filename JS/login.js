
// Configuración básica de validación
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
            weakPassword: 'La contraseña debe incluir mayúsculas, minúsculas, números y símbolos especiales'
        },
        success: {
            validField: 'Campo válido'
        }
    }
};

class ValidationSystem {
    validateUsername(username) {
        if (!username || username.length === 0)
            return { isValid: false, message: CONFIG.messages.error.emptyUsername };

        if (username.length < CONFIG.validation.minUsernameLength)
            return { isValid: false, message: CONFIG.messages.error.shortUsername };

        if (username.length > CONFIG.validation.maxUsernameLength)
            return { isValid: false, message: CONFIG.messages.error.longUsername };

        if (username.includes('@')) {
            if (!CONFIG.validation.emailRegex.test(username))
                return { isValid: false, message: CONFIG.messages.error.invalidEmail };
        } else {
            if (!CONFIG.validation.usernameRegex.test(username))
                return { isValid: false, message: CONFIG.messages.error.invalidUsernameFormat };
        }

        return { isValid: true, message: CONFIG.messages.success.validField };
    }

    validatePassword(password) {
        if (!password || password.length === 0)
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

// Inicialización simple
document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    const form = document.getElementById('loginForm');

    const validator = new ValidationSystem();

    usernameInput.addEventListener('blur', () => {
        const result = validator.validateUsername(usernameInput.value.trim());
        usernameError.textContent = result.isValid ? '' : result.message;
    });

    passwordInput.addEventListener('blur', () => {
        const result = validator.validatePassword(passwordInput.value);
        passwordError.textContent = result.isValid ? '' : result.message;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const userResult = validator.validateUsername(usernameInput.value.trim());
        const passResult = validator.validatePassword(passwordInput.value);

        usernameError.textContent = userResult.isValid ? '' : userResult.message;
        passwordError.textContent = passResult.isValid ? '' : passResult.message;

        if (userResult.isValid && passResult.isValid) {
            alert('Formulario validado correctamente.');
        } else {
            alert('Por favor corrige los errores.');
        }
    });
});
