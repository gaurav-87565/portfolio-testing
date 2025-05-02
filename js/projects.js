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

    function searchProjects() {
      let input = document.getElementById('searchInput').value.toLowerCase();
      let projectsContainer = document.getElementById('projectsContainer');
      let projectCards = projectsContainer.getElementsByClassName('project-card');
      let noMatchesMessage = document.getElementById('noMatchesMessage');
      let hasMatches = false;

      for (let i = 0; i < projectCards.length; i++) {
        let projectTitle = projectCards[i].getElementsByTagName("h2")[0].textContent.toLowerCase();
        let projectDescription = projectCards[i].getElementsByTagName("p")[0].textContent.toLowerCase();
        
        if (projectTitle.includes(input) || projectDescription.includes(input)) {
          projectCards[i].style.display = "block";
          hasMatches = true;
        } else {
          projectCards[i].style.display = "none";
        }
      }

      if (!hasMatches) {
        noMatchesMessage.style.display = "block";
      } else {
        noMatchesMessage.style.display = "none";
      }
    }