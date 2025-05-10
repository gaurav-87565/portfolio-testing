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

// Copy button logic
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const codeContainer = btn.closest('.code-container');
    const codeBlock = codeContainer?.querySelector('.code-content');

    if (!codeBlock) {
      console.warn('No code block found for this button.');
      return;
    }

    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 1500);
    }).catch(() => {
      btn.textContent = 'Failed!';
    });
  });
});
