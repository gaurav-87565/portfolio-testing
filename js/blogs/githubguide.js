document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  // Toggle mobile nav menu
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
  });

  // Close menu if clicking outside
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove("active");
    }
  });

  // Copy to clipboard functionality
  document.querySelectorAll('.copy-btn').forEach(button => {
    let timeoutId;
    button.addEventListener('click', () => {
      const code = button.nextElementSibling.innerText;
      navigator.clipboard.writeText(code).then(() => {
        button.textContent = '✅ Copied!';
        clearTimeout(timeoutId); // Clear any existing timeout
        timeoutId = setTimeout(() => {
          button.textContent = '📋 Copy';
        }, 1500);
      });
    });
  });
});
