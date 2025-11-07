const wrapper = document.querySelector(".wrapper"),
  selectBtn = wrapper.querySelector(".select-btn"),
  options = wrapper.querySelector(".options"),
  arrowIcon = selectBtn.querySelector("i");

let languages = [ "Dansk", "Deutsch", "English", "English (UK)", "Italiano",  "Español","Français","Português","Русский","日本語","한국어",
];

// 👇 ye function har language ke liye <li> banata hai aur list me add karta hai
function addLanguage() {
    
    languages.forEach(language => {
        // har language ke liye ek <li> banaya jisme click hone par updateName() chalega
        let li = `<li onclick="updateName(this)">${language}</li>`;
        // existing chilrdren ke end me wo <li> add kar diya
        options.insertAdjacentHTML("beforeend", li); 
    });
}
addLanguage();

// 👇 ye function tab chalta hai jab koi <li> select hota hai
function updateName(selectedLang) {
    wrapper.classList.remove("active");
     // button ke span me clicked language ka naam daal do
  selectBtn.firstElementChild.innerText = selectedLang.innerText;
  arrowIcon.classList.replace("fa-angle-up", "fa-angle-down");
}

selectBtn.addEventListener("click", () => {
  wrapper.classList.toggle("active");

  if (wrapper.classList.contains("active")) {
    arrowIcon.classList.replace("fa-angle-down", "fa-angle-up");
  } else {
    arrowIcon.classList.replace("fa-angle-up", "fa-angle-down");
  }
});


// Select all dropdown sections
const footerDropdowns = document.querySelectorAll(".footerDropdown");

// Loop through each dropdown
footerDropdowns.forEach((dropdown, index) => {
  const selectBtn = dropdown.querySelector(".select-btn");
  const arrowIcon = selectBtn.querySelector("i");

  selectBtn.addEventListener("click", () => {

    if (window.innerWidth >= 1080) return;

    // Toggle active class on the specific dropdown
    dropdown.classList.toggle("active");

    // Toggle arrow direction
    arrowIcon.classList.toggle("fa-angle-up");
    arrowIcon.classList.toggle("fa-angle-down");

    // Toggle border styling
    if (dropdown.classList.contains("active")) {
      selectBtn.style.borderBottom = "none";
    } else if (index < 3) {
      selectBtn.style.borderBottom = "2px solid #ffffff1a";
    }

  });
});
