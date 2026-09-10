const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const navLinks = mobileMenu.querySelectorAll("a");
    const themeSwitch = document.getElementById("themeSwitch");
    const body = document.body;

    const savedTheme = localStorage.getItem("miraya-theme") || "a";
    body.dataset.theme = savedTheme;
    themeSwitch.textContent = savedTheme === "b" ? "Theme A" : "Theme B";
    themeSwitch.setAttribute("aria-pressed", String(savedTheme === "b"));

    function closeMenu() {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("open");
    }

    function applyTheme(nextTheme) {
      body.dataset.theme = nextTheme;
      themeSwitch.textContent = nextTheme === "b" ? "Theme A" : "Theme B";
      themeSwitch.setAttribute("aria-pressed", String(nextTheme === "b"));
      localStorage.setItem("miraya-theme", nextTheme);
    }

    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.classList.toggle("open");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });

    themeSwitch.addEventListener("click", () => {
      const nextTheme = body.dataset.theme === "a" ? "b" : "a";
      applyTheme(nextTheme);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
