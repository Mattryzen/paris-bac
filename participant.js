import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, onValue, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
document.getElementById("participant-name").textContent = id;

const form = document.getElementById("pari-form");
const coteEl = document.getElementById("cote");
const listeParis = document.getElementById("liste-paris");
const canvas = document.getElementById("chart-notes");
let chart = null;

function calculerCote(paris) {
  const notes = Object.values(paris);
  if (notes.length === 0) return "Pas encore de paris.";
  const moy = notes.reduce((a, b) => a + b, 0) / notes.length;
  return `Cote actuelle : moyenne ${moy.toFixed(2)}/20 (basée sur ${notes.length} pari(s))`;
}

function ecartType(notes, moyenne) {
  const variance = notes.reduce((acc, val) => acc + Math.pow(val - moyenne, 2), 0) / notes.length;
  return Math.sqrt(variance);
}

const parisRef = ref(db, `paris/${id}`);
onValue(parisRef, snapshot => {
  const data = snapshot.val() || {};
  coteEl.textContent = calculerCote(data);

  listeParis.innerHTML = "<h3>Paris enregistrés :</h3>";
  for (const [pseudo, note] of Object.entries(data)) {
    const p = document.createElement("p");
    p.textContent = `${pseudo} : ${note}/20`;
    listeParis.appendChild(p);
  }

  if (chart) chart.destroy();
  const notesList = Object.values(data);
  if (notesList.length > 0) {
    const labels = [...new Set(notesList)].sort((a, b) => a - b);
    const frequencies = labels.map(n => notesList.filter(x => x === n).length);
    const moyenne = notesList.reduce((a, b) => a + b, 0) / notesList.length;
    const stddev = ecartType(notesList, moyenne);

    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels.map(l => `${l}/20`),
        datasets: [{
          label: `Notes (${notesList.length}) - Moyenne : ${moyenne.toFixed(2)} - Écart-type : ${stddev.toFixed(2)}`,
          data: frequencies,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderRadius: 5,
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  const pseudo = document.getElementById("pseudo").value.trim();
  const note = parseFloat(document.getElementById("note").value);
  if (!pseudo || isNaN(note)) return alert("Champs invalides.");

  const regexPseudo = /^[a-zA-Z0-9]+$/;
  if (!regexPseudo.test(pseudo)) {
    alert("Le pseudo ne doit contenir que des lettres et des chiffres (sans espaces ni symboles).");
    return;
  }

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