const video = document.querySelector(".bg-video");
const masks = document.querySelectorAll(".mask-box");
const soundBtn = document.querySelector(".sound-toggle");
const grab = document.querySelector(".grab");

soundBtn.addEventListener("click", () => {
  if (video.muted) {
    video.muted = false;
    soundBtn.textContent = "🔊";
  } else {
    video.muted = true;
    soundBtn.textContent = "🔇";
  }
});

function draw() {
    masks.forEach((mask) => {
        const canvas = mask.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        const rect = mask.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            video,
            -rect.left,
            -rect.top,
            window.innerWidth,
            window.innerHeight
        )
    })
    requestAnimationFrame(draw);
}

video.addEventListener("canplay", ()=>{
    video.play();    
    draw();
})

let topZ = 10;
let isHoveringMask = false;

document.addEventListener("mousemove", (e) => {
    
    grab.style.display = "block";
    grab.style.left = e.clientX + 10 + "px";
    grab.style.top  = e.clientY + 10 + "px";

    if(!isHoveringMask){
        grab.innerHTML =
     `X:${e.clientX}px <br> Y:${e.clientY}px`;
    }
});

masks.forEach((mask) => {
    mask.addEventListener("mouseenter", () => {
        isHoveringMask = true;
        grab.innerHTML = "grab";
        mask.style.cursor = "grab"; 
    });

    mask.addEventListener("mouseleave", () => {
        isHoveringMask = false;
        grab.innerHTML = "";
    });
    let isDragging = false;
    let offsetX, offsetY;

    mask.addEventListener("mousedown", (e) => {
        isDragging = true;
        mask.style.cursor = "grabbing";
        mask.style.zIndex = ++topZ;

        offsetX = e.clientX - mask.offsetLeft;
        offsetY = e.clientY - mask.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        mask.style.left = e.clientX - offsetX + "px";
        mask.style.top  = e.clientY - offsetY + "px";
    });

    document.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        mask.style.cursor = "grab";
    });
});
