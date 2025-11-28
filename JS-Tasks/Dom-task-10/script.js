const p = document.querySelector(".text");
const text = p.innerText;
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

let iteration = 0;
let interval = null;
let isAnimating = false;

// keep track of running sounds
let activeSounds = [];

function playSound() {
  const s = new Audio("./keyboard.mp3");
  s.volume = 0.2;
  s.play();
  activeSounds.push(s);
}

function stopAllSounds() {
  activeSounds.forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
  activeSounds = [];
}

p.addEventListener("mouseenter", function () {
  if (isAnimating) return;
  isAnimating = true;

  clearInterval(interval);
  stopAllSounds();  // prevent leftovers from previous runs
  iteration = 0;

  interval = setInterval(() => {

    playSound();   // 🔊 sound plays for each frame

    const result = text
      .split("")
      .map((char, idx) => {
        if (iteration > idx) return char;
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join("");

    p.innerText = result;
    iteration += 0.25;

    if (iteration >= text.length) {
      clearInterval(interval);
      stopAllSounds(); // 🔥 instantly stop all playing sounds
      isAnimating = false;
    }
  }, 40);
});
