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

const words = ["Web Developer", "Freelancer", "Open Source Contributor", "Bot Developer"];
let currentWordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let delay = 100;

const element = document.getElementById("typewriter");

function type() {
  const currentWord = words[currentWordIndex];
  const displayedText = isDeleting
    ? currentWord.substring(0, charIndex--)
    : currentWord.substring(0, charIndex++);

  element.textContent = displayedText;

  if (!isDeleting && charIndex === currentWord.length + 1) {
    delay = 1500; // pause after full word is typed
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    currentWordIndex = (currentWordIndex + 1) % words.length;
    delay = 500; // pause before typing next word
  } else {
    delay = isDeleting ? 80 : 120; // type slow, delete a bit faster
  }

  setTimeout(type, delay);
}

       // Add ripple effect to social buttons
       const socialBtns = document.querySelectorAll('.social-btn');
        
       socialBtns.forEach(btn => {
           btn.addEventListener('click', function(e) {
               const platform = this.getAttribute('data-platform');
               console.log(`Clicked on ${platform}`);
               
               // Create ripple effect
               const ripple = document.createElement('span');
               ripple.classList.add('ripple');
               this.appendChild(ripple);
               
               const x = e.clientX - e.target.getBoundingClientRect().left;
               const y = e.clientY - e.target.getBoundingClientRect().top;
               
               ripple.style.left = `${x}px`;
               ripple.style.top = `${y}px`;
               
               setTimeout(() => {
                   ripple.remove();
               }, 600);
           });
       });
       
type(); // start typing