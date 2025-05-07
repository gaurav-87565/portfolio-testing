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

document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
      const code = button.nextElementSibling.innerText;
      navigator.clipboard.writeText(code).then(() => {
        button.textContent = '✅ Copied!';
        setTimeout(() => (button.textContent = '📋 Copy'), 1500);
      });
    });
  });
