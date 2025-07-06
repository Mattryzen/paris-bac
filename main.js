import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBC3KNykSGTEBzvzJ5FEMV-PlwaPKkXgUk",
  authDomain: "pari-bac.firebaseapp.com",
  projectId: "pari-bac",
  storageBucket: "pari-bac.firebasestorage.app",
  messagingSenderId: "564303747617",
  appId: "1:564303747617:web:04abacb4435c9bb826e160",
  databaseURL: "https://pari-bac-default-rtdb.europe-west1.firebasedatabase.app/"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const searchInput = document.getElementById("search");
const results = document.getElementById("results");
const leaderboardList = document.getElementById("leaderboard-list");

const participants = ["Alice", "Bastien", "Camille", "David"];

searchInput.addEventListener("input", () => {
  const val = searchInput.value.toLowerCase();
  results.innerHTML = "";
  participants.filter(p => p.toLowerCase().startsWith(val)).forEach(p => {
    const div = document.createElement("div");
    div.textContent = p;
    div.onclick = () => window.location.href = `participant.html?id=${p.toLowerCase()}`;
    results.appendChild(div);
  });
});

async function chargerLeaderboard() {
  const dataRef = ref(db, "paris");
  const snapshot = await get(dataRef);
  if (!snapshot.exists()) return;
  const data = snapshot.val();
  const classement = [];

  for (const participant in data) {
    const notes = Object.values(data[participant]);
    if (notes.length === 0) continue;
    const moyenne = notes.reduce((a, b) => a + b, 0) / notes.length;
    classement.push({ nom: participant, moyenne });
  }

  classement.sort((a, b) => b.moyenne - a.moyenne);

  leaderboardList.innerHTML = "";
  classement.forEach((e, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${e.nom} — Moyenne prédite : ${e.moyenne.toFixed(2)}/20`;
    leaderboardList.appendChild(li);
  });
}

chargerLeaderboard();