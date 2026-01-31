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
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc
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
const log = document.getElementById("log");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("send");

// ===== ユーザー名 =====
let username = localStorage.getItem("username");
if (!username) {
  username = "名無し-" + Math.floor(Math.random() * 10000);
  localStorage.setItem("username", username);
}

// ===== 時刻整形 =====
function formatTime(ts) {
  if (!ts) return "";
  const d = ts.toDate();
  return d.getHours().toString().padStart(2, "0") + ":" +
         d.getMinutes().toString().padStart(2, "0");
}

// ===== チャット開始 =====
startChat();

function startChat() {
  const q = query(collection(db, "messages"), orderBy("time"));

  onSnapshot(q, (snap) => {
    log.innerHTML = "";

    snap.forEach(docu => {
      const d = docu.data();

      const wrap = document.createElement("div");
      wrap.className = d.name === username ? "msg me" : "msg other";

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = d.name;

      const text = document.createElement("div");
      text.className = "bubble";
      text.textContent = d.text;

      const time = document.createElement("div");
      time.className = "time";
      time.textContent = formatTime(d.time);

      wrap.append(name, text, time);
      log.appendChild(wrap);
    });

    log.scrollTop = log.scrollHeight;
  });
}

// ===== コマンド処理 =====
async function handleCommand(cmd) {
  switch (cmd) {
    case "/help":
      await addDoc(collection(db, "messages"), {
        name: "system",
        text: "使えるコマンド:\n/clear 履歴削除\n/help ヘルプ表示",
        time: serverTimestamp()
      });
      break;

    case "/clear":
      const snap = await getDocs(collection(db, "messages"));
      snap.forEach(d => deleteDoc(doc(db, "messages", d.id)));
      break;

    default:
      await addDoc(collection(db, "messages"), {
        name: "system",
        text: `不明なコマンド: ${cmd}`,
        time: serverTimestamp()
      });
  }
}

// ===== 送信処理 =====
sendBtn.onclick = async () => {
  const text = msgInput.value.trim();
  if (!text) return;

  // コマンド判定
  if (text.startsWith("/")) {
    await handleCommand(text);
  } else {
    await addDoc(collection(db, "messages"), {
      name: username,
      text: text,
      time: serverTimestamp()
    });
  }

  msgInput.value = "";
};

// Enterキー送信
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
