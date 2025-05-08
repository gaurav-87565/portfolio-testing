const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
});
document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove("active");
    }
});