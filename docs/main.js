console.log("main.js 読み込まれた");

// ===== Firebase SDK =====
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

// ===== Firebase設定 =====
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

// ===== DOM =====
const chatArea = document.getElementById("chatArea");
const log = document.getElementById("log");
const msgInput = document.getElementById("msgInput");

// ===== ユーザー名自動生成 =====
let username = localStorage.getItem("username");

if (!username) {
  username = "名無し-" + Math.floor(Math.random() * 10000);
  localStorage.setItem("username", username);
}

// ===== チャット開始 =====
startChat();

function startChat() {
  const q = query(
    collection(db, "messages"),
    orderBy("time")
  );

  onSnapshot(q, (snap) => {
    log.innerHTML = "";

    snap.forEach(doc => {
      const d = doc.data();

      const wrap = document.createElement("div");
      wrap.className = d.name === username ? "msg me" : "msg other";

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = d.name;

      const text = document.createElement("div");
      text.className = "bubble";
      text.textContent = d.text;

      wrap.appendChild(name);
      wrap.appendChild(text);
      log.appendChild(wrap);
    });

    log.scrollTop = log.scrollHeight;
  });
}

// ===== 送信処理 =====
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
