const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 20;
const BLOCK_SPEED = 3;

const COLORS = ["red", "green", "blue", "yellow"];

let stack = [];
let currentBlock;
let score = 0;
let gameOver = false;

class Block {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.movingRight = true;
  }

  move() {
    if (this.movingRight) {
      this.x += BLOCK_SPEED;
      if (this.x + BLOCK_WIDTH >= WIDTH) {
        this.movingRight = false;
      }
    } else {
      this.x -= BLOCK_SPEED;
      if (this.x <= 0) {
        this.movingRight = true;
      }
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, BLOCK_WIDTH, BLOCK_HEIGHT);
  }
}

function spawnBlock() {
  const y = HEIGHT - 50 - stack.length * 30;
  return new Block(WIDTH / 2 - BLOCK_WIDTH / 2, y, COLORS[Math.floor(Math.random() * COLORS.length)]);
}

function resetGame() {
  stack = [];
  currentBlock = spawnBlock();
  score = 0;
  gameOver = false;
  document.getElementById("gameOverModal").style.display = "none";
}

function dropBlock() {
  if (gameOver) return;

  if (
    stack.length === 0 ||
    Math.abs(stack[stack.length - 1].x - currentBlock.x) <= 20
  ) {
    stack.push(currentBlock);
    score += 10;
    currentBlock = spawnBlock();
  } else {
    gameOver = true;
    setTimeout(() => {
      document.getElementById("finalScore").innerText = score;
      document.getElementById("gameOverModal").style.display = "flex";
    }, 300);
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

function gameLoop() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  for (let b of stack) {
    b.draw();
  }

  if (!gameOver) {
    currentBlock.move();
    currentBlock.draw();
  }

  drawScore();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    dropBlock();
  }
});

canvas.addEventListener("click", () => {
  dropBlock();
});

document.getElementById("restartBtn").addEventListener("click", () => {
  resetGame();
});

resetGame();
gameLoop();
