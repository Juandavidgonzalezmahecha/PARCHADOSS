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
  const formAddPlan = document.getElementById("form-add-plan");
  const loginMsg = document.getElementById("login-msg");

  if (user) {
    btnLogin.style.display = "none";
    btnLogout.style.display = "inline-block";
    userInfo.style.display = "inline-flex";
    userName.textContent = user.displayName;
    userPhoto.src = user.photoURL;

    formAddPlan.style.display = "block";
    if (loginMsg) loginMsg.style.display = "none";
  } else {
    btnLogin.style.display = "inline-block";
    btnLogout.style.display = "none";
    userInfo.style.display = "none";

    formAddPlan.style.display = "none";
    if (loginMsg) loginMsg.style.display = "block";
  }
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
// 🌍 Firestore: Planes (con filtros y búsqueda)
// ---------------------------
const formAddPlan = document.getElementById("form-add-plan");
const plansList = document.getElementById("plans-list");

// Agregar plan
formAddPlan.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("⚠️ Debes iniciar sesión para publicar un plan.");
    return;
  }

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
      createdAt: new Date(),
      createdBy: {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      }
    });

    alert("✅ Plan publicado correctamente 🎉");
    formAddPlan.reset();
    cargarPlanes();
  } catch (error) {
    console.error("❌ Error al agregar plan:", error);
  }
});

// ---------------------------
// 🔎 Cargar y filtrar planes
// ---------------------------
let todosLosPlanes = [];

async function cargarPlanes() {
  const querySnapshot = await getDocs(collection(db, "plans"));
  todosLosPlanes = [];
  querySnapshot.forEach((doc) => {
    todosLosPlanes.push(doc.data());
  });
  mostrarPlanes(todosLosPlanes);
}

function mostrarPlanes(planes) {
  let html = "";
  planes.forEach((data) => {
    html += `
      <div class="plan-card">
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <p><b>Ubicación:</b> ${data.location}</p>
        <p><b>Categoría:</b> ${data.category}</p>
        <p><b>Ánimo:</b> ${data.mood}</p>
        <p><b>Duración:</b> ${data.duration}</p>
        <p><b>Costo:</b> ${data.cost}</p>
        ${data.createdBy ? `
          <div class="autor">
            <img src="${data.createdBy.photo}" alt="foto" class="autor-foto">
            <small><b>${data.createdBy.name}</b> (${data.createdBy.email})</small>
          </div>` : ""}
      </div>
      <hr>
    `;
  });
  plansList.innerHTML = html || "<p>No hay planes disponibles aún.</p>";
}

// ---------------------------
// 🧭 Filtros dinámicos
// ---------------------------
const searchBar = document.getElementById("search-bar");
const filterCategory = document.getElementById("filter-category");
const filterMood = document.getElementById("filter-mood");
const filterCost = document.getElementById("filter-cost");

function aplicarFiltros() {
  const texto = searchBar.value.toLowerCase();
  const categoria = filterCategory.value.toLowerCase();
  const animo = filterMood.value.toLowerCase();
  const costo = filterCost.value.toLowerCase();

  const filtrados = todosLosPlanes.filter(p => {
    const coincideTexto = p.title.toLowerCase().includes(texto) ||
                          p.description.toLowerCase().includes(texto);
    const coincideCategoria = !categoria || p.category.toLowerCase().includes(categoria);
    const coincideAnimo = !animo || p.mood.toLowerCase().includes(animo);
    const coincideCosto = !costo || p.cost.toLowerCase().includes(costo);
    return coincideTexto && coincideCategoria && coincideAnimo && coincideCosto;
  });

  mostrarPlanes(filtrados);
}

searchBar.addEventListener("input", aplicarFiltros);
filterCategory.addEventListener("change", aplicarFiltros);
filterMood.addEventListener("change", aplicarFiltros);
filterCost.addEventListener("change", aplicarFiltros);

// Carga inicial
cargarPlanes();




