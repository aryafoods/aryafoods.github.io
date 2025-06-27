import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from './firebase.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("app").style.display = "block";
    document.getElementById("userEmail").textContent = "Login sebagai: " + auth.currentUser.email;
    loadPosts(); // tampilkan semua posting
  } catch (e) {
    alert("Login gagal: " + e.message);
  }
};

document.getElementById("postBtn").onclick = async () => {
  const text = document.getElementById("postInput").value.trim();
  if (!text) return;

  await addDoc(collection(db, "posts"), {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    text,
    time: Date.now()
  });

  document.getElementById("postInput").value = "";
};

function loadPosts() {
  const postList = document.getElementById("postList");
  const q = query(collection(db, "posts"), orderBy("time", "desc"));

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
