const roundLength = 30;
const winningScore = 20;
const cleanDropChance = 0.8;
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
let dropMaker = null;
let countdown = null;

const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameMessage = document.getElementById("game-message");

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", resetGame);

function startGame() {
  // Guard against multiple spawn and countdown intervals.
  if (gameRunning) return;

  if (roundHasEnded) resetGame();

  gameRunning = true;
  roundHasEnded = false;
  gameMessage.textContent = "Catch clean drops and avoid the dirty ones!";
  createDrop();
  dropMaker = setInterval(createDrop, 550);
  countdown = setInterval(updateCountdown, 1000);
}

function createDrop() {
  if (!gameRunning) return;

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

function collectDrop(drop, isClean) {
  if (!gameRunning || !drop.isConnected) return;

  score = Math.max(0, score + (isClean ? 1 : -2));
  scoreDisplay.textContent = score;
  gameMessage.textContent = isClean ? "Clean drop caught!" : "Dirty drop! Two points deducted; score cannot go below zero.";
  drop.remove();
}

function updateCountdown() {
  if (!gameRunning) return;

  timeLeft -= 1;
  timeDisplay.textContent = timeLeft;

  if (timeLeft <= 0) {
    endRound();
  }
}

function endRound() {
  if (!gameRunning) return;

  gameRunning = false;
  roundHasEnded = true;
  clearGameTimers();
  removeDrops();

  if (score >= winningScore) {
    gameMessage.textContent = `${randomMessage(winningMessages)} Final score: ${score}.`;
    addConfetti();
  } else {
    gameMessage.textContent = `${randomMessage(losingMessages)} Final score: ${score}.`;
  }
}

function resetGame() {
  gameRunning = false;
  roundHasEnded = false;
  clearGameTimers();
  removeDrops();
  score = 0;
  timeLeft = roundLength;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  gameMessage.textContent = "Ready when you are.";
}

function clearGameTimers() {
  clearInterval(dropMaker);
  clearInterval(countdown);
  dropMaker = null;
  countdown = null;
}

function removeDrops() {
  gameContainer.querySelectorAll(".water-drop, .confetti-piece").forEach((item) => item.remove());
}

function randomMessage(messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

function addConfetti() {
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
