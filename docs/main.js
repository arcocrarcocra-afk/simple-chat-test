// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ★ここを自分のに差し替え
const firebaseConfig = {
  apiKey: "AIzaSyDnktM_novhLMeX0DakzdIG7cqHBB2k00s",
  authDomain: "chat-ddf32.firebaseapp.com",
  projectId: "chat-ddf32",
  storageBucket: "chat-ddf32.firebasestorage.app",
  messagingSenderId: "598902187318",
  appId: "1:598902187318:web:51a08ecdccb55947d37f97"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const nameArea = document.getElementById("nameArea");
const chatArea = document.getElementById("chatArea");
const log = document.getElementById("log");

const nameInput = document.getElementById("nameInput");
const msgInput = document.getElementById("msgInput");

let username = localStorage.getItem("username");

if (username) {
  startChat();
}

document.getElementById("setName").onclick = () => {
  username = nameInput.value.trim();
  if (!username) return;
  localStorage.setItem("username", username);
  startChat();
};

function startChat() {
  nameArea.style.display = "none";
  chatArea.style.display = "block";

  const q = query(
    collection(db, "messages"),
    orderBy("time")
  );

  onSnapshot(q, (snap) => {
    log.innerHTML = "";
    snap.forEach(doc => {
      const d = doc.data();
      const div = document.createElement("div");
      div.textContent = `${d.name}: ${d.text}`;
      log.appendChild(div);
    });
  });
}

document.getElementById("send").onclick = async () => {
  const text = msgInput.value.trim();
  if (!text) return;

  await addDoc(collection(db, "messages"), {
    name: username,
    text: text,
    time: serverTimestamp()
  });

  msgInput.value = "";
};
