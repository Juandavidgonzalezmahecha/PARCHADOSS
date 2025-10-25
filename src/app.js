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

// Configuración de Firebase
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
// 🔐 Autenticación con Google
// ---------------------------

const btnLogin = document.getElementById("btn-login");
const btnLogout = document.getElementById("btn-logout");
const userInfo = document.getElementById("user-info");
const userName = document.getElementById("user-name");
const userPhoto = document.getElementById("user-photo");

// Iniciar sesión
btnLogin.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("✅ Usuario autenticado:", user.email);

    // Guardar en Firestore (si no existe)
    await addDoc(collection(db, "users"), {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      createdAt: new Date()
    });

    cargarUsuarios();
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
  }
});

// Cerrar sesión
btnLogout.addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("👋 Sesión cerrada correctamente");
  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error);
  }
});

// Detectar sesión activa
onAuthStateChanged(auth, (user) => {
  if (user) {
    btnLogin.style.display = "none";
    btnLogout.style.display = "inline-block";
    userInfo.style.display = "inline-flex";
    userName.textContent = user.displayName;
    userPhoto.src = user.photoURL;
  } else {
    btnLogin.style.display = "inline-block";
    btnLogout.style.display = "none";
    userInfo.style.display = "none";
  }
});

// ---------------------------
// 🧠 Lógica básica del prototipo
// ---------------------------

document.getElementById("btn-plan-rapido").addEventListener("click", () => {
  const out = document.getElementById("plan-result");
  out.innerHTML = "<h3>Plan rápido de ejemplo</h3><p>Paseo corto + café ☕</p>";
});

// ---------------------------
// 🔥 Firestore: Usuarios
// ---------------------------

document.getElementById("btn-add-user").addEventListener("click", async () => {
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

async function cargarUsuarios() {
  const querySnapshot = await getDocs(collection(db, "users"));
  let html = "<ul>";
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    html += `<li><b>${data.name}</b> (${data.email}) — ${data.mood ?? "🤔"}</li>`;
  });
  html += "</ul>";
  document.getElementById("user-result").innerHTML = html;
}
cargarUsuarios();

// ---------------------------
// 🌍 Firestore: Planes
// ---------------------------

// Referencias
const formAddPlan = document.getElementById("form-add-plan");
const plansList = document.getElementById("plans-list");

// Agregar plan
formAddPlan.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("plan-title").value;
  const description = document.getElementById("plan-description").value;
  const location = document.getElementById("plan-location").value;
  const category = document.getElementById("plan-category").value;
  const mood = document.getElementById("plan-mood").value;
  const duration = document.getElementById("plan-duration").value;
  const cost = document.getElementById("plan-cost").value;

  try {
    await addDoc(collection(db, "plans"), {
      title,
      description,
      location,
      category,
      mood,
      duration,
      cost,
      createdAt: new Date()
    });
    alert("✅ Plan publicado correctamente 🎉");
    formAddPlan.reset();
    cargarPlanes();
  } catch (error) {
    console.error("❌ Error al agregar plan:", error);
  }
});

// Cargar planes
async function cargarPlanes() {
  const querySnapshot = await getDocs(collection(db, "plans"));
  let html = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    html += `
      <div class="plan-card">
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <p><b>Ubicación:</b> ${data.location}</p>
        <p><b>Categoría:</b> ${data.category}</p>
        <p><b>Ánimo:</b> ${data.mood}</p>
        <p><b>Duración:</b> ${data.duration}</p>
        <p><b>Costo:</b> ${data.cost}</p>
      </div>
      <hr>
    `;
  });

  plansList.innerHTML = html || "<p>No hay planes disponibles aún.</p>";
}

cargarPlanes();

