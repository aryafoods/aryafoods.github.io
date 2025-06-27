import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from './firebase.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Login
document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    alert("Login sukses!");
    document.getElementById("app").style.display = "block";
  } catch (e) {
    alert("Login gagal: " + e.message);
  }
};

// Posting
const postBtn = document.getElementById("postBtn");
postBtn.onclick = async () => {
  const text = document.getElementById("postInput").value;
  if (text.trim()) {
    await addDoc(collection(db, "posts"), {
      text,
      time: Date.now()
    });
    document.getElementById("postInput").value = "";
  }
};

// Tampilkan posting
const postList = document.getElementById("postList");
const q = query(collection(db, "posts"), orderBy("time", "desc"));
onSnapshot(q, (snapshot) => {
  postList.innerHTML = "";
  snapshot.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data().text;
    postList.appendChild(li);
  });
});
