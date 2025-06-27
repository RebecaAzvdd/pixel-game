const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const modal = document.getElementById("startModal");
const startButton = document.getElementById("startButton");
const playerNameInput = document.getElementById("playerNameInput");
const gameOverModal = document.getElementById("gameOverModal");
const gameOverMessage = document.getElementById("gameOverMessage");
const restartButton = document.getElementById("restartButton");
const scoreDisplay = document.getElementById("score");
const playerNameTag = document.getElementById("player-name");
const bgMusic = document.getElementById("bgMusic");

let score = 0;
let scoreInterval;

let nomeDoJogador = "";
let jogoAtivo = false;

// Função para iniciar ou reiniciar o jogo
function iniciarJogo() {
  jogoAtivo = true;
  score = 0;
  scoreDisplay.style.display = "block";
  scoreDisplay.innerText = "Pontos: 0";

  // Aumenta o score a cada 100ms
  scoreInterval = setInterval(() => {
    if (jogoAtivo) {
      score++;
      scoreDisplay.innerText = `Pontos: ${score}`;
    }
  }, 100);

  gameOverModal.style.display = "none";
  playerNameTag.innerText = nomeDoJogador;

  // Reinicia a animação do obstáculo
  obstacle.style.animation = "none"; // remove a animação atual
  void obstacle.offsetWidth; // força reflow para resetar
  const velocidade = window.innerWidth < 600 ? "0.8s" : "2s";
  obstacle.style.animation = `moveObstacle ${velocidade} linear infinite`;

  obstacle.style.animationPlayState = "running";

  // Garante imagem normal da personagem
  player.src = "personagem.png";
  bgMusic.volume = 0.5; // opcional: ajuste de volume
  bgMusic.play().catch((e) => {
    console.warn("O navegador bloqueou a reprodução automática de áudio.", e);
  });
}

// Impede pulo até o jogo começar
document.addEventListener("keydown", function (e) {
  if (!jogoAtivo) return;

  if (e.code === "Space") {
    if (!player.classList.contains("jump")) {
      player.src = "personagem-pulando.png";
      player.classList.add("jump");

      setTimeout(() => {
        player.src = "personagem.png";
        player.classList.remove("jump");
      }, 400);
    }
  }
});

// Início do jogo pelo modal
startButton.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (name === "") {
    alert("Por favor, digite seu nome.");
    return;
  }

  nomeDoJogador = name;
  modal.style.display = "none";
  iniciarJogo();
});

// Recomeçar após Game Over
restartButton.addEventListener("click", () => {
  iniciarJogo();
});

// Detecção de colisão
setInterval(() => {
  if (!jogoAtivo) return;

  const playerBottom =
    parseInt(window.getComputedStyle(player).getPropertyValue("bottom")) || 0;
  const obstacleLeft =
    parseInt(window.getComputedStyle(obstacle).getPropertyValue("left")) || 0;

  if (obstacleLeft > 40 && obstacleLeft < 90 && playerBottom <= 90) {
    jogoAtivo = false;
    clearInterval(scoreInterval); // para a contagem
    gameOverMessage.innerText = `Que pena, ${
      nomeDoJogador || "jogador"
    }! Você fez ${score} pontos.`;

    obstacle.style.animationPlayState = "paused";

    gameOverMessage.innerText = `Que pena, ${
      nomeDoJogador || "jogador"
    }! Tente novamente.`;
    gameOverModal.style.display = "flex";
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
}, 10);

// Pulo por toque em mobile
document.addEventListener("touchstart", () => {
  if (!jogoAtivo) return;

  if (!player.classList.contains("jump")) {
    player.src = "personagem-pulando.png";
    player.classList.add("jump");

    setTimeout(() => {
      player.src = "personagem.png";
      player.classList.remove("jump");
    }, 400);
  }
});


