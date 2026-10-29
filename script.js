const roundLength = 30;
const cleanDropChance = 0.8;
const difficulties = {
  easy: { label: "Easy", target: 12 },
  normal: { label: "Normal", target: 20 },
  hard: { label: "Hard", target: 28 }
};
const milestones = [
  { percent: 25, message: "Quarter of the way there! Keep collecting!" },
  { percent: 50, message: "Halfway there!" },
  { percent: 75, message: "75% there! The goal is in sight!" },
  { percent: 100, message: "Target reached! Keep collecting until time runs out!" }
];
const winningMessages = [
  "Amazing work! You caught enough clean water drops.",
  "You did it! Every point brings clean water closer.",
  "A wonderful round! You reached the clean-water goal."
];
const losingMessages = [
  "Good try! Every drop helps. Give it another go.",
  "So close! Try again and see how many you can catch.",
  "Keep going! You can reach the goal next round."
];

let gameRunning = false;
let roundHasEnded = false;
let score = 0;
let timeLeft = roundLength;
let roundDeadline = 0;
let reachedMilestones = new Set();
let dropMaker = null;
let bonusDropMaker = null;
let countdown = null;
let deadlineTimer = null;
let milestoneTimeout = null;

const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameMessage = document.getElementById("game-message");
const milestoneMessage = document.getElementById("milestone-message");
const difficultySelector = document.getElementById("difficulty");
const modeDisplay = document.getElementById("mode-display");
const targetDisplay = document.getElementById("target");
const soundToggle = document.getElementById("sound-toggle");
const collectionSound = document.getElementById("collection-sound");
const winSound = document.getElementById("win-sound");
const errorSound = document.getElementById("error-sound");

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", resetGame);
difficultySelector.addEventListener("change", updateDifficultyDisplay);
soundToggle.addEventListener("change", () => {
  if (!soundToggle.checked) stopSounds();
});
updateDifficultyDisplay();

function startGame() {
  if (gameRunning) return;

  if (roundHasEnded) resetGame();

  reachedMilestones = new Set();
  clearMilestoneTimeout();
  milestoneMessage.textContent = "";
  gameRunning = true;
  roundHasEnded = false;
  difficultySelector.disabled = true;
  roundDeadline = Date.now() + roundLength * 1000;
  gameMessage.textContent = "Catch clean drops and avoid the dirty ones!";
  createDrop();
  dropMaker = setInterval(createDrop, 550);
  bonusDropMaker = setInterval(createBonusDrop, 5000);
  countdown = setInterval(updateCountdown, 100);
  deadlineTimer = setTimeout(endRound, roundLength * 1000);
}

function createDrop() {
  if (!gameRunning) return;
  if (Date.now() >= roundDeadline) {
    endRound();
    return;
  }

  const drop = document.createElement("button");
  const isClean = Math.random() < cleanDropChance;
  const size = Math.round(Math.random() * 24 + 48);
  const maxLeft = Math.max(0, gameContainer.clientWidth - size);

  drop.type = "button";
  drop.className = isClean ? "water-drop" : "water-drop bad-drop";
  drop.textContent = "";
  drop.setAttribute("aria-label", isClean ? "Clean water drop, add 1 point" : "Dirty water drop, subtract 2 points");
  drop.style.width = `${size}px`;
  drop.style.height = `${size}px`;
  drop.style.left = `${Math.random() * maxLeft}px`;
  drop.style.setProperty("--drop-start", `${-size}px`);
  drop.style.setProperty("--fall-distance", `${gameContainer.clientHeight}px`);
  drop.style.animationDuration = "4s";

  drop.addEventListener("click", () => collectDrop(drop, isClean));
  drop.addEventListener("animationend", () => drop.remove());
  gameContainer.appendChild(drop);
}

function createBonusDrop() {
  if (!gameRunning) return;
  if (Date.now() >= roundDeadline) {
    endRound();
    return;
  }

  const size = 64;
  const bonusDrop = document.createElement("button");
  const canImage = document.createElement("img");
  const maxLeft = Math.max(0, gameContainer.clientWidth - size);

  bonusDrop.type = "button";
  bonusDrop.className = "bonus-drop";
  bonusDrop.setAttribute("aria-label", "Bonus water can, add 2 points");
  bonusDrop.style.width = `${size}px`;
  bonusDrop.style.height = `${size}px`;
  bonusDrop.style.left = `${Math.random() * maxLeft}px`;
  bonusDrop.style.setProperty("--drop-start", `${-size}px`);
  bonusDrop.style.setProperty("--fall-distance", `${gameContainer.clientHeight}px`);
  bonusDrop.style.animationDuration = "4s";

  canImage.src = "img/water-can.png";
  canImage.alt = "";
  canImage.setAttribute("aria-hidden", "true");
  bonusDrop.appendChild(canImage);
  bonusDrop.addEventListener("click", () => collectDrop(bonusDrop, true, true));
  bonusDrop.addEventListener("animationend", () => bonusDrop.remove());
  gameContainer.appendChild(bonusDrop);
}

function collectDrop(drop, isClean, isBonus = false) {
  if (!gameRunning || !drop.isConnected) return;
  if (Date.now() >= roundDeadline) {
    endRound();
    return;
  }

  score = Math.max(0, score + (isBonus ? 2 : isClean ? 1 : -2));
  scoreDisplay.textContent = score;
  gameMessage.textContent = isBonus ? "Bonus water can! Two points added." : isClean ? "Clean drop caught!" : "Dirty drop! Two points deducted; score cannot go below zero.";
  drop.remove();
  if (isClean) {
    playSound(collectionSound);
    checkMilestones();
  } else {
    playSound(errorSound);
  }
}

function updateCountdown() {
  if (!gameRunning) return;

  timeLeft = Math.max(0, Math.ceil((roundDeadline - Date.now()) / 1000));
  timeDisplay.textContent = timeLeft;

  if (timeLeft <= 0) {
    endRound();
  }
}

function endRound() {
  if (!gameRunning) return;

  gameRunning = false;
  roundHasEnded = true;
  timeLeft = 0;
  timeDisplay.textContent = timeLeft;
  clearGameTimers();
  clearMilestoneTimeout();
  milestoneMessage.textContent = "";
  removeDrops();
  difficultySelector.disabled = false;

  if (score >= difficulties[difficultySelector.value].target) {
    gameMessage.textContent = `${randomMessage(winningMessages)} Final score: ${score}.`;
    playSound(winSound);
    addConfetti();
  } else {
    gameMessage.textContent = `${randomMessage(losingMessages)} Final score: ${score}.`;
  }
}

function resetGame() {
  gameRunning = false;
  roundHasEnded = false;
  clearGameTimers();
  clearMilestoneTimeout();
  removeDrops();
  stopSounds();
  score = 0;
  timeLeft = roundLength;
  roundDeadline = 0;
  reachedMilestones = new Set();
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  milestoneMessage.textContent = "";
  difficultySelector.disabled = false;
  gameMessage.textContent = "Ready when you are.";
}

function clearGameTimers() {
  clearInterval(dropMaker);
  clearInterval(bonusDropMaker);
  clearInterval(countdown);
  clearTimeout(deadlineTimer);
  dropMaker = null;
  bonusDropMaker = null;
  countdown = null;
  deadlineTimer = null;
}

function updateDifficultyDisplay() {
  const difficulty = difficulties[difficultySelector.value];
  modeDisplay.textContent = difficulty.label;
  targetDisplay.textContent = difficulty.target;
}

function checkMilestones() {
  const target = difficulties[difficultySelector.value].target;
  const milestone = milestones.find((item) => {
    const threshold = Math.ceil((target * item.percent) / 100);
    return score >= threshold && !reachedMilestones.has(item.percent);
  });

  if (!milestone) return;

  reachedMilestones.add(milestone.percent);
  clearMilestoneTimeout();
  milestoneMessage.textContent = milestone.message;
  milestoneTimeout = setTimeout(() => {
    milestoneMessage.textContent = "";
    milestoneTimeout = null;
  }, 3500);
}

function clearMilestoneTimeout() {
  clearTimeout(milestoneTimeout);
  milestoneTimeout = null;
}

function stopSounds() {
  document.querySelectorAll("audio").forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function playSound(sound) {
  if (!soundToggle.checked) return;

  try {
    sound.pause();
    sound.currentTime = 0;
    const playback = sound.play();
    if (playback && typeof playback.catch === "function") playback.catch(() => {});
  } catch {
    // Audio playback must never interrupt the game.
  }
}

function removeDrops() {
  gameContainer.querySelectorAll(".water-drop, .bonus-drop, .confetti-piece").forEach((item) => item.remove());
}

function randomMessage(messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

function addConfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#FFC907", "#2E9DF7", "#4FCB53", "#F16061"];
  const pieceCount = 32;

  for (let index = 0; index < pieceCount; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.setAttribute("aria-hidden", "true");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.addEventListener("animationend", () => piece.remove());
    gameContainer.appendChild(piece);
  }
}
