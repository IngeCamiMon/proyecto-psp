// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD79umLr6iHPqM6f_IzSVgeEu3qopxqTCw",
  authDomain: "restaturante-psp.firebaseapp.com",
  projectId: "restaturante-psp",
  storageBucket: "restaturante-psp.firebasestorage.app",
  messagingSenderId: "180701892199",
  appId: "1:180701892199:web:3f71488b64af85c1b20ec2",
  measurementId: "G-60LENBP3CH"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics(); // Opcional: solo si realmente necesitas Analytics

// No necesitas exportar nada; firebase queda disponible globalmente
