import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBC3KNykSGTEBzvzJ5FEMV-PlwaPKkXgUk",
  authDomain: "pari-bac.firebaseapp.com",
  projectId: "pari-bac",
  storageBucket: "pari-bac.firebasestorage.app",
  messagingSenderId: "564303747617",
  appId: "1:564303747617:web:04abacb4435c9bb826e160",
  databaseURL: "https://pari-bac.firebaseio.com"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const searchInput = document.getElementById("search");
const results = document.getElementById("results");

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