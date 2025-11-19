let btn = document.querySelector(".btn");
let inner = document.querySelector(".inner");
let percent = document.querySelector(".percentage")
let bar = 0;

btn.addEventListener("click", function() {
    btn.style.pointerEvents = "none";
    btn.style.opacity = 0.6
    
    let num = 50 + Math.floor(Math.random() * 50);
    console.log(num);

    let int = setInterval(() => {
        bar++;
        percent.innerHTML = bar + "%"
        inner.style.width = bar + "%"
    }, num);

    setTimeout(()=> {
        clearInterval(int);
        btn.innerHTML = "Downloaded"
    }, num*100)
})