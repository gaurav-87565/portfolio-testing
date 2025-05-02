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

    function searchBlogs() {
      let input = document.getElementById('searchInput').value.toLowerCase();
      let blogList = document.getElementById('blogList');
      let blogCards = blogList.getElementsByClassName('blog-card');
      let noMatchesMessage = document.getElementById('noMatchesMessage');
      let hasMatches = false;

      for (let i = 0; i < blogCards.length; i++) {
        let blogTitle = blogCards[i].getElementsByTagName("h2")[0].textContent.toLowerCase();
        if (blogTitle.includes(input)) {
          blogCards[i].style.display = "block";
          hasMatches = true;
        } else {
          blogCards[i].style.display = "none";
        }
      }

      if (!hasMatches) {
        noMatchesMessage.style.display = "block";
      } else {
        noMatchesMessage.style.display = "none";
      }
    }