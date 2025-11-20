const img = document.querySelector(".image"); // the element you double-click
const love = document.querySelector("#love");

// helper: pick random start rotation
function randomRotation() {
  const deg = ["-60deg", "0deg", "60deg"];
  return deg[Math.floor(Math.random() * deg.length)];
}

// set a random hidden starting state (scale 0, random rotation)
function setRandomHiddenState() {
  const startRot = randomRotation();
  // keep translate(-50%, -50%) so it's positioned centered but rotated & scaled down
  love.style.transform = `translate(-50%, -50%) scale(0) rotate(${startRot})`;
  love.style.opacity = 0;
}

// call once on load so initial state is random
setRandomHiddenState();

img.addEventListener("dblclick", function () {
  // 1) Appear & rotate to 0deg (pop-in). This will animate because of CSS transition.
  love.style.opacity = 1;
  love.style.transform = `translate(-50%, -50%) scale(1) rotate(0deg)`;

  // 2) After a short delay, move up while staying straight (0deg)
  setTimeout(() => {
    love.style.transform = `translate(-50%, -350%) scale(1) rotate(0deg)`;
  }, 800);

  // 3) Fade out
  setTimeout(() => {
    love.style.opacity = 0;
  }, 1000);

  // 4) After fully hidden, reset to a NEW random hidden state so next double-click starts tilted
  setTimeout(() => {
    setRandomHiddenState();
  }, 1200);
});
