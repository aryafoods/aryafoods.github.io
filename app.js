import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from './firebase.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function renderPosts() {
  const q = query(collection(db, "posts"), orderBy("time", "desc"));
  const postList = document.getElementById("postList");

  onSnapshot(q, (snapshot) => {
    postList.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement("li");
      li.textContent = `${data.email}: ${data.text}`;
      postList.appendChild(li);
    });
  });
}

// ------------------------------
// Login Page
// ------------------------------
if (location.pathname.endsWith("index.html") || location.pathname === "/") {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.onclick = async () => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        location.href = "home.html";
      } catch (e) {
        alert("Login gagal: " + e.message);
      }
    };
  }
}

// ------------------------------
// Home Page
// ------------------------------
if (location.pathname.endsWith("home.html")) {
  onAuthStateChanged(auth, (user) => {
    if (!user) return location.href = "index.html";

    document.getElementById("userEmail").textContent = `Login sebagai: ${user.email}`;

    document.getElementById("postBtn").onclick = async () => {
      const text = document.getElementById("postInput").value.trim();
      if (!text) return;
      await addDoc(collection(db, "posts"), {
        uid: user.uid,
        email: user.email,
        text,
        time: Date.now()
      });
      document.getElementById("postInput").value = "";
    };

    // Panggil render post setelah user terautentikasi
    renderPosts();
  });
}

// ------------------------------
// Profil Page
// ------------------------------
if (location.pathname.endsWith("profil.html")) {
  onAuthStateChanged(auth, (user) => {
    if (!user) return location.href = "index.html";

    document.getElementById("userInfo").textContent =
      `Email: ${user.email}\nNama: ${user.displayName || "(belum diatur)"}`;

    document.getElementById("updateNameBtn").onclick = async () => {
      const newName = document.getElementById("displayName").value.trim();
      if (newName) {
        await updateProfile(user, { displayName: newName });
        alert("Nama berhasil diperbarui!");
        location.reload();
      }
    };
  });
}
