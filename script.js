const ALL_COLORS = [
  "red", "blue", "green", "yellow", "orange", "purple", "cyan", "pink"
];

let level = 1;
let attempts = 0;
let hiddenOrder = [];
let currentColors = [];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function updateUI() {
  document.getElementById("level").textContent = `Nivel: ${level}`;
  document.getElementById("attempts").textContent = `Intentos: ${attempts}`;
}

function generateHiddenOrder() {
  currentColors = shuffle([...ALL_COLORS]).slice(0, level + 2);
  hiddenOrder = shuffle([...currentColors]);
  console.log("Orden oculto:", hiddenOrder); // Para pruebas
}

function renderOptions() {
  const container = document.getElementById("options-container");
  container.innerHTML = "";
  shuffle([...currentColors]).forEach(color => {
    const div = document.createElement("div");
    div.classList.add("bottle");
    div.style.backgroundColor = color;
    div.setAttribute("draggable", true);
    div.dataset.color = color;
    div.addEventListener("dragstart", dragStart);
    container.appendChild(div);
  });
}

function setupDropzone() {
  const zone = document.getElementById("bottle-container");
  zone.innerHTML = "";
  for (let i = 0; i < currentColors.length; i++) {
    const dropSlot = document.createElement("div");
    dropSlot.classList.add("bottle");
    dropSlot.ondragover = e => e.preventDefault();
    dropSlot.ondrop = e => {
      e.preventDefault();
      const color = e.dataTransfer.getData("color");
      dropSlot.style.backgroundColor = color;
      dropSlot.dataset.color = color;
    };
    zone.appendChild(dropSlot);
  }
}

function dragStart(e) {
  e.dataTransfer.setData("color", e.target.dataset.color);
}

function checkGuess() {
  const zone = document.getElementById("bottle-container");
  const guess = Array.from(zone.children).map(el => el.dataset.color);
  if (guess.includes(undefined)) {
    alert("Debes llenar todas las botellas antes de verificar.");
    return;
  }

  let correct = 0;
  for (let i = 0; i < hiddenOrder.length; i++) {
    if (guess[i] === hiddenOrder[i]) correct++;
  }

  attempts++;
  updateUI();

  document.getElementById("result").textContent = `✔️ Botellas en posición correcta: ${correct}`;

  if (correct === hiddenOrder.length) {
    document.getElementById("next-btn").style.display = "inline-block";
    document.getElementById("result").textContent += " 🎉 ¡Completado!";
  }
}

function nextLevel() {
  level++;
  attempts = 0;
  generateHiddenOrder();
  renderOptions();
  setupDropzone();
  updateUI();
  document.getElementById("result").textContent = "";
  document.getElementById("next-btn").style.display = "none";
}

generateHiddenOrder();
renderOptions();
setupDropzone();
updateUI();
