const width = 8;
const candies = ["🍒","🍋","🍇","🍏","🍊","🍓"];
let board = [];
let boardEl = document.getElementById("board");
let score = 0;
let level = 1;
let timer = 60;
let gameInterval, timerInterval;
let draggedId, replacedId;

// MENU AU DEMARRAGE
document.getElementById("menu").style.display = "block";

function startGame() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  initBoard();
  startTimer();
  gameInterval = setInterval(() => {
    checkMatches();
    dropCandies();
  }, 200);
}

function initBoard() {
  boardEl.innerHTML = "";
  board = [];
  for (let i = 0; i < width*width; i++) {
    const candy = document.createElement("div");
    const type = candies[Math.floor(Math.random()*candies.length)];
    candy.textContent = type;
    candy.className = "candy";
    candy.setAttribute("draggable", true);
    candy.setAttribute("data-id", i);
    board[i] = candy;
    boardEl.appendChild(candy);
  }
  addDragEvents();
}

function addDragEvents() {
  board.forEach(candy => {
    candy.addEventListener("dragstart", dragStart);
    candy.addEventListener("dragover", e => e.preventDefault());
    candy.addEventListener("drop", dragDrop);
    candy.addEventListener("dragend", dragEnd);
  });
}

function dragStart() { draggedId = parseInt(this.dataset.id); }
function dragDrop() { replacedId = parseInt(this.dataset.id); }
function dragEnd() {
  if (replacedId !== undefined) {
    let draggedCandy = board[draggedId].textContent;
    let replacedCandy = board[replacedId].textContent;
    board[draggedId].textContent = replacedCandy;
    board[replacedId].textContent = draggedCandy;

    let validMoves = [draggedId-1, draggedId+1, draggedId-width, draggedId+width];
    if (!validMoves.includes(replacedId) || !checkMatches()) {
      board[draggedId].textContent = draggedCandy;
      board[replacedId].textContent = replacedCandy;
    }
    replacedId = undefined;
  }
}

// Vérifier alignements
function checkMatches() {
  let found = false;

  // Lignes
  for (let i = 0; i < width*width; i++) {
    if (i % width < width-2) {
      let c1 = board[i].textContent;
      let c2 = board[i+1].textContent;
      let c3 = board[i+2].textContent;
      if (c1 && c1 === c2 && c1 === c3) {
        board[i].classList.add("pop");
        board[i+1].classList.add("pop");
        board[i+2].classList.add("pop");
        setTimeout(() => {
          board[i].textContent = "";
          board[i+1].textContent = "";
          board[i+2].textContent = "";
          board[i].classList.remove("pop");
          board[i+1].classList.remove("pop");
          board[i+2].classList.remove("pop");
        }, 400);
        score += 30; found = true;
      }
    }
  }

  // Colonnes
  for (let i = 0; i < width*(width-2); i++) {
    let c1 = board[i].textContent;
    let c2 = board[i+width].textContent;
    let c3 = board[i+2*width].textContent;
    if (c1 && c1 === c2 && c1 === c3) {
      board[i].classList.add("pop");
      board[i+width].classList.add("pop");
      board[i+2*width].classList.add("pop");
      setTimeout(() => {
        board[i].textContent = "";
        board[i+width].textContent = "";
        board[i+2*width].textContent = "";
        board[i].classList.remove("pop");
        board[i+width].classList.remove("pop");
        board[i+2*width].classList.remove("pop");
      }, 400);
      score += 30; found = true;
    }
  }

  document.getElementById("score").textContent = "Score : " + score;
  return found;
}

// Faire tomber les bonbons
function dropCandies() {
  for (let i = width*(width-1); i >= 0; i--) {
    if (board[i].textContent === "") {
      if (i < width) {
        board[i].textContent = candies[Math.floor(Math.random()*candies.length)];
      } else {
        board[i].textContent = board[i-width].textContent;
        board[i-width].textContent = "";
      }
    }
  }
}

// Gestion du temps
function startTimer() {
  timer = 60;
  document.getElementById("timer").textContent = "Temps : " + timer + "s";
  timerInterval = setInterval(() => {
    timer--;
    document.getElementById("timer").textContent = "Temps : " + timer + "s";
    if (timer <= 0) {
      clearInterval(timerInterval);
      clearInterval(gameInterval);
      endGame();
    }
  }, 1000);
}

// Fin de partie
function endGame() {
  document.getElementById("game").style.display = "none";
  document.getElementById("gameover").style.display = "block";
  let goal = level * 200;
  if (score >= goal) {
    document.getElementById("endMessage").textContent = "🎉 Bravo ! Niveau " + level + " terminé !";
    level++;
  } else {
    document.getElementById("endMessage").textContent = "💀 Game Over ! Score : " + score;
    level = 1; score = 0;
  }
}

function restartGame() {
  document.getElementById("gameover").style.display = "none";
  document.getElementById("game").style.display = "block";
  score = 0;
  document.getElementById("score").textContent = "Score : 0";
  document.getElementById("level").textContent = "Niveau : " + level;
  initBoard();
  startTimer();
  gameInterval = setInterval(() => {
    checkMatches();
    dropCandies();
  }, 200);
}

function backToMenu() {
  document.getElementById("gameover").style.display = "none";
  document.getElementById("menu").style.display = "block";
  score = 0; level = 1;
}