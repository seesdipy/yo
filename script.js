const confettiCanvas = document.getElementById("confetti-canvas");
const fireworksCanvas = document.getElementById("fireworks-canvas");
const countdownValue = document.getElementById("countdown-value");
const birthdayTimeInput = document.getElementById("birthday-time");
const blowButton = document.getElementById("blow-button");
const flame = document.getElementById("flame");
const surprise = document.getElementById("surprise");
const galleryInput = document.getElementById("gallery-input");
const galleryGrid = document.getElementById("gallery-grid");
const guestbookForm = document.getElementById("guestbook-form");
const guestbookEntries = document.getElementById("guestbook-entries");
const giftBox = document.getElementById("gift-box");
const giftMessage = document.getElementById("gift-message");

const confettiCtx = confettiCanvas.getContext("2d");
const fireworksCtx = fireworksCanvas.getContext("2d");

const confettiPieces = [];
const fireworks = [];

const resizeCanvas = () => {
  [confettiCanvas, fireworksCanvas].forEach((canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
};

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const createConfetti = () => {
  confettiPieces.length = 0;
  for (let i = 0; i < 180; i += 1) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      size: 6 + Math.random() * 8,
      color: `hsl(${Math.random() * 360}, 90%, 70%)`,
      speed: 2 + Math.random() * 3,
      tilt: Math.random() * 10,
    });
  }
};

const drawConfetti = () => {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach((piece) => {
    confettiCtx.fillStyle = piece.color;
    confettiCtx.save();
    confettiCtx.translate(piece.x, piece.y);
    confettiCtx.rotate(piece.tilt);
    confettiCtx.fillRect(0, 0, piece.size, piece.size / 2);
    confettiCtx.restore();
    piece.y += piece.speed;
    if (piece.y > confettiCanvas.height + 20) {
      piece.y = -20;
    }
  });
};

const launchConfetti = () => {
  createConfetti();
  let frames = 0;
  const interval = setInterval(() => {
    drawConfetti();
    frames += 1;
    if (frames > 180) {
      clearInterval(interval);
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }, 16);
};

const updateCountdown = () => {
  const target = new Date(birthdayTimeInput.value);
  if (Number.isNaN(target.getTime())) {
    countdownValue.textContent = "Cada vez mas cerca...";
    return;
  }
  const now = new Date(2026-04-02T00:00:00)
  const diff = target - now;
  if (diff <= 0) {
    countdownValue.textContent = "It is celebration time!";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownValue.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

birthdayTimeInput.addEventListener("change", updateCountdown);
setInterval(updateCountdown, 1000);

blowButton.addEventListener("click", () => {
  flame.style.opacity = 0;
  flame.style.animation = "none";
  surprise.hidden = false;
});


const triggerFireworks = () => {
  fireworksCanvas.style.opacity = "1";
  for (let i = 0; i < 15; i += 1) {
    fireworks.push({
      x: Math.random() * fireworksCanvas.width,
      y: Math.random() * fireworksCanvas.height * 0.6,
      radius: 2 + Math.random() * 3,
      color: `hsl(${Math.random() * 360}, 90%, 60%)`,
    });
  }
  let frame = 0;
  const fireworksInterval = setInterval(() => {
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    fireworks.forEach((spark) => {
      fireworksCtx.beginPath();
      fireworksCtx.arc(
        spark.x,
        spark.y,
        spark.radius + frame * 0.3,
        0,
        Math.PI * 2
      );
      fireworksCtx.strokeStyle = spark.color;
      fireworksCtx.stroke();
    });
    frame += 1;
    if (frame > 35) {
      clearInterval(fireworksInterval);
      fireworks.length = 0;
      fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
      fireworksCanvas.style.opacity = "0";
    }
  }, 30);
};

let guestbookCount = 0;

guestbookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("guest-name").value.trim();
  const message = document.getElementById("guest-message").value.trim();
  const sticker = document.getElementById("guest-sticker").value;
  if (!name || !message) {
    return;
  }
  const entry = document.createElement("li");
  entry.innerHTML = `<strong>${name}</strong> ${sticker}<br />${message}`;
  guestbookEntries.prepend(entry);
  guestbookForm.reset();
  guestbookCount += 1;
  if (guestbookCount === 10) {
    triggerFireworks();
  }
});

giftBox.addEventListener("click", () => {
  giftBox.classList.toggle("unwrapped");
  giftMessage.hidden = !giftBox.classList.contains("unwrapped");
});

window.addEventListener("load", () => {
  launchConfetti();
  const now = new Date();
  now.setHours(now.getHours() + 1);
  birthdayTimeInput.value = now.toISOString().slice(0, 16);
  updateCountdown();
});
