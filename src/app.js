// ---------------------------
// 🔥 Inicialización Firebase
// ---------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

console.log("📥 Importando Firebase...");

// Configuración de Firebase (tuya)
const firebaseConfig = {
  apiKey: "AIzaSyAj19b4CcAkbqMj87MtJ4aPY93S1Uw_Ar8",
  authDomain: "parchadoss.firebaseapp.com",
  projectId: "parchadoss",
  storageBucket: "parchadoss.firebasestorage.app",
  messagingSenderId: "398426404477",
  appId: "1:398426404477:web:731e968b9e0a45f2976314"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("✅ Firebase conectado correctamente");

// ---------------------------
// 🧪 Lógica del prototipo
// ---------------------------

// Mensaje de prueba inicial
console.log("PARCHADOSS prototype loaded");

// Evento: botón login (luego conectaremos con Firebase Auth)
document.getElementById('btn-login').addEventListener('click', () => {
  alert('Aquí irá la autenticación con Firebase.');
});

// Evento: botón "Plan rápido"
document.getElementById('btn-plan-rapido').addEventListener('click', () => {
  const out = document.getElementById('plan-result');
  out.innerHTML = '<h3>Plan rápido de ejemplo</h3><p>Paseo corto + café</p>';
});

