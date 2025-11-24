const images = [
  "images/billu-2.jpg",
  "images/girl-1.jpg",
  "images/girl-2.jpg",
  "images/girl-3.jpg",
  "images/rich-duck.jpg",
  "images/spiderman-2.jpg",
  "images/berlin.jpg",
  "images/johnwick.jpg",
  "images/ironman.jpg",
  "images/loki.jpg",
  "images/thor.jpg",
  "images/tanjiro.jpg",
];
// Preload images
images.forEach((src) => {
  const img = new Image();
  img.src = src;
});

let main = document.querySelector("main");
let btn = document.querySelector(".btn");

btn.addEventListener("click", function () {
    
  let img = document.createElement("img");
  img.src = images[Math.floor(Math.random() * images.length)];

  let x = Math.floor(Math.random() * 100);
  let y = Math.floor(Math.random() * 100);
  let r = Math.floor(Math.random() * 60) - 30; // -30° to +30°
  let radius = Math.floor(Math.random() * 50);

  let scl = Math.random() * 2;
  let minScale = 1;
  scl = Math.max(scl, minScale);

  img.style.left = x + "%";
  img.style.top = y + "%";
  img.style.width = "150px";
  img.style.rotate = r + "deg";
  // img.style.scale = scl;

  img.style.zIndex = Math.floor(Math.random() * 100);
  img.style.opacity = "0";
  img.style.transform = `scale(0.6) rotate(${r}deg)`;

  main.appendChild(img);

  // // Trigger fade-in animation
  requestAnimationFrame(() => {
    img.style.opacity = "1";
    // img.style.scale = 1;
    img.style.transform = `scale(${scl}) rotate(${r}deg)`;
  });
});
