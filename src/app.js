// ---------------------------
// 🔥 Inicialización Firebase
// ---------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Botón login (más adelante conectamos Firebase Auth)
document.getElementById('btn-login').addEventListener('click', () => {
  alert('Aquí irá la autenticación con Firebase.');
});

// Botón Plan Rápido
document.getElementById('btn-plan-rapido').addEventListener('click', () => {
  const out = document.getElementById('plan-result');
  out.innerHTML = '<h3>Plan rápido de ejemplo</h3><p>Paseo corto + café</p>';
});

// ---------------------------
// 🔥 Firestore: Users
// ---------------------------

// Agregar usuario de prueba
document.getElementById('btn-add-user').addEventListener('click', async () => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "Usuario Demo",
      email: "demo@parchadoss.com",
      mood: "😎 motivado",
      createdAt: new Date()
    });

    console.log("✅ Usuario agregado con ID:", docRef.id);
    cargarUsuarios(); // recargamos lista después de agregar
  } catch (e) {
    console.error("❌ Error al agregar usuario:", e);
  }
});

// Cargar usuarios de Firestore y mostrarlos
async function cargarUsuarios() {
  const querySnapshot = await getDocs(collection(db, "users"));
  let html = "<ul>";
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    html += `<li><b>${data.name}</b> (${data.email}) — ${data.mood}</li>`;
  });
  html += "</ul>";
  document.getElementById('user-result').innerHTML = html;
}

// Ejecutar carga inicial al abrir la página
cargarUsuarios();


