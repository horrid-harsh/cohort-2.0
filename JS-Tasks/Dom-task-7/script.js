let voices = {
  A: [
    "./audio/Amber/amber-2.ogg",
    "./audio/Amber/amber-3.ogg",
    "./audio/Amber/amber-4.ogg",
  ],

  B: [
    "./audio/Bea/bea-1.ogg",
    "./audio/Bea/bea-2.ogg",
    "./audio/Bea/bea-3.ogg",
    "./audio/Bea/bea-4.ogg",
  ],

  C: [
    "./audio/Colt/colt-1.ogg",
    "./audio/Colt/colt-2.ogg",
    "./audio/Colt/colt-3.ogg",
    "./audio/Colt/colt-4.ogg",
  ],

  D: [
    "./audio/Draco/draco-1.ogg",
    "./audio/Draco/draco-2.ogg",
    "./audio/Draco/draco-3.ogg",
  ],

  E: [
    "./audio/Edgar/edgar-1.ogg",
    "./audio/Edgar/edgar-2.ogg",
    "./audio/Edgar/edgar-3.ogg",
  ],

  F: [
    "./audio/Fang/fang-1.ogg",
    "./audio/Fang/fang-2.ogg",
    "./audio/Fang/fang-3.ogg",
  ],

  G: [
    "./audio/Griff/griff-1.ogg",
    "./audio/Griff/griff-2.ogg",
    "./audio/Griff/griff-3.ogg",
  ],

  H: [
    "./audio/Hank/hank-1.ogg",
    "./audio/Hank/hank-2.ogg",
    "./audio/Hank/hank-3.ogg",
  ],
  I: [
    "./audio/BGM/loading-bgm.mp3",
  ], 

  J: [
    "./audio/Janet/janet-1.ogg",
    "./audio/Janet/janet-2.ogg",
    "./audio/Janet/janet-3.ogg",
  ],

  K: [
    "./audio/Kaze/kaze-1.ogg",
    "./audio/Kaze/kaze-2.ogg",
    "./audio/Kaze/kaze-3.ogg",
    "./audio/Kaze/kaze-4.ogg",
  ],

  L: [
    "./audio/Leon/leon-1.ogg",
    "./audio/Leon/leon-2.ogg",
    "./audio/Leon/leon-3.ogg",
  ],

  M: [
    "./audio/Melodie/melodie-1.ogg",
    "./audio/Melodie/melodie-2.ogg",
    "./audio/Melodie/melodie-3.ogg",
    "./audio/Melodie/melodie-4.ogg",
  ],

  N: ["./audio/Nita/nita-1.ogg", "./audio/Nita/nita-2.ogg"],

  O: ["./audio/BGM/takedown-bgm.mp3"],
  P: [
    "./audio/Piper/piper-1.ogg",
    "./audio/Piper/piper-2.ogg",
    "./audio/Piper/piper-3.ogg",
    "./audio/Piper/piper-4.ogg",
  ],
  Q: ["./audio/BGM/supercell-jingle.mp3"],
  R: [
    "./audio/Ruffs/ruffs-1.ogg",
    "./audio/Ruffs/ruffs-2.ogg",
    "./audio/Ruffs/ruffs-3.ogg",
  ],

  S: [
    "./audio/Surge/surge-1.ogg",
    "./audio/Surge/surge-2.ogg",
    "./audio/Surge/surge-3.ogg",
  ],

  T: [
    "./audio/Trunk/trunk-1.ogg",
    "./audio/Trunk/trunk-2.ogg",
    "./audio/Trunk/trunk-3.ogg",
  ],

  U: ["./audio/BGM/victory-bgm.mp3"],
  V: ["./audio/Nita/nita-bgm.ogg"],
  W: [
    "./audio/Willow/willow-1.ogg",
    "./audio/Willow/willow-2.ogg",
    "./audio/Willow/willow-3.ogg",
  ],
  X: ["./audio/Surge/surge-bgm.ogg"],

  Y: ["./audio/Griff/griff-bgm.ogg"],
  Z: [
    "./audio/Ziggy/ziggy-1.ogg",
    "./audio/Ziggy/ziggy-2.ogg",
    "./audio/Ziggy/ziggy-3.ogg",
  ],
};
let main = document.querySelector("main");
let cursor = document.querySelector(".cursor");

main.addEventListener("mousemove", function(dets){
  cursor.style.left = dets.x + "px";
  cursor.style.top = dets.y + "px";
})

function playVoice(letter) {
  let list = voices[letter.toUpperCase()];
  if (!list) return;

  let random = Math.floor(Math.random() * list.length);
  new Audio(list[random]).play();
}

function pressAnimation(keyDiv) {
  keyDiv.style.transform = "scale(0.92)";
  setTimeout(() => {
    keyDiv.style.transform = "scale(1)";
  }, 120);
}

// CLICK
document.querySelectorAll(".key").forEach((key) => {
  key.addEventListener("click", () => {
    let letter = key.textContent.trim().toUpperCase();
    playVoice(letter);
    pressAnimation(key); // <-- added
  });
});

// KEYDOWN
document.addEventListener("keydown", (e) => {
  let letter = e.key.toUpperCase();

  let keyDiv = document.querySelector(`.key-${letter}`);
  if (!keyDiv) return;

  playVoice(letter);
  pressAnimation(keyDiv); // <-- same animation
});
