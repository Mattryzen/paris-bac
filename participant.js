import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, onValue, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
document.getElementById("participant-name").textContent = id;

const form = document.getElementById("pari-form");
const coteEl = document.getElementById("cote");

function calculerCote(paris) {
  const notes = Object.values(paris);
  if (notes.length === 0) return "Pas encore de paris.";
  const moy = notes.reduce((a, b) => a + b, 0) / notes.length;
  return `Cote actuelle : moyenne ${moy.toFixed(2)}/20 (basée sur ${notes.length} pari(s))`;
}

const parisRef = ref(db, `paris/${id}`);
onValue(parisRef, snapshot => {
  const data = snapshot.val() || {};
  coteEl.textContent = calculerCote(data);
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  const pseudo = document.getElementById("pseudo").value.trim();
  const note = parseFloat(document.getElementById("note").value);
  if (!pseudo || isNaN(note)) return alert("Champs invalides.");

  const userRef = ref(db, `paris/${id}/${pseudo}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    alert("Tu as déjà parié pour ce participant avec ce pseudo !");
    return;
  }

  set(userRef, note).then(() => {
    alert("Pari enregistré !");
    form.reset();
  });
});