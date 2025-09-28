// ---------------------------
// 🔥 Inicialización Firebase
// ---------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Configuración de Firebase (tuya)
const firebaseConfig = {
  apiKey: "AIzaSyAj19b4CcAkbqMj87MtJ4aPY93S1Uw_Ar8",
  authDomain: "parchadoss.firebaseapp.com",
  projectId: "parchadoss",
  storageBucket: "parchadoss.firebasestorage.app",
  messagingSenderId: "398426404477",
  appId: "1:398426404477:web:731e968b9e0a45f2976314"
};

// Inicializar Firebase y servicios
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

console.log("✅ Firebase conectado correctamente");

// ---------------------------
// 🔥 Firebase Auth (Google Sign-In)
// ---------------------------

// Botón: iniciar sesión
document.getElementById('btn-login').addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("✅ Usuario autenticado:", user);

    // Guardar usuario en Firestore
    await addDoc(collection(db, "users"), {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      createdAt: new Date()
    });

    cargarUsuarios();
  } catch (error) {
    console.error("❌ Error en login:", error);
  }
});

// Botón: cerrar sesión
document.getElementById('btn-logout').addEventListener('click', async () => {
  try {
    await signOut(auth);
    console.log("👋 Sesión cerrada");
  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error);
  }
});

// Detectar cambios de sesión y actualizar UI
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("🔵 Usuario conectado:", user.email);

    // Mostrar botones
    document.getElementById('btn-login').style.display = "none";
    document.getElementById('btn-logout').style.display = "inline-block";

    // Mostrar info del usuario
    document.getElementById('user-info').style.display = "inline-flex";
    document.getElementById('user-name').textContent = user.displayName;
    document.getElementById('user-photo').src = user.photoURL;

  } else {
    console.log("⚪ Ningún usuario conectado");

    // Resetear botones
    document.getElementById('btn-login').style.display = "inline-block";
    document.getElementById('btn-logout').style.display = "none";

    // Ocultar info del usuario
    document.getElementById('user-info').style.display = "none";
  }
});

// ---------------------------
// 🧪 Lógica del prototipo
// ---------------------------

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
  console.log("👉 Botón clickeado, intentando agregar usuario...");
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "Usuario Demo",
      email: "demo@parchadoss.com",
      mood: "😎 motivado",
      createdAt: new Date()
    });

    console.log("✅ Usuario agregado con ID:", docRef.id);
    cargarUsuarios();
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
    html += `<li><b>${data.name}</b> (${data.email}) — ${data.mood ?? "🤔"}</li>`;
  });
  html += "</ul>";
  document.getElementById('user-result').innerHTML = html;
}

// Ejecutar carga inicial
cargarUsuarios();



