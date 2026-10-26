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
  
    const galleryCarousel = document.getElementById("galleryCarousel");
    const galleryTrack = document.getElementById("galleryTrack");

    if (galleryCarousel && galleryTrack) {
      const gallerySlides = Array.from(galleryTrack.children);
      const previousButton = document.getElementById("galleryPrevious");
      const nextButton = document.getElementById("galleryNext");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      let currentSlide = 0;

      function showSlide(index) {
        currentSlide = (index + gallerySlides.length) % gallerySlides.length;
        const slide = gallerySlides[currentSlide];
        galleryTrack.scrollTo({
          left: galleryTrack.scrollLeft +
            slide.getBoundingClientRect().left -
            galleryTrack.getBoundingClientRect().left,
          behavior: reducedMotion.matches ? "auto" : "smooth"
        });
      }

      function syncCurrentSlide() {
        const trackLeft = galleryTrack.getBoundingClientRect().left;
        const nearestSlide = gallerySlides.reduce((nearest, slide, index) => {
          const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
          return distance < nearest.distance ? { index, distance } : nearest;
        }, { index: 0, distance: Infinity });
        currentSlide = nearestSlide.index;
      }

      previousButton.addEventListener("click", () => showSlide(currentSlide - 1));
      nextButton.addEventListener("click", () => showSlide(currentSlide + 1));
      galleryTrack.addEventListener("scroll", syncCurrentSlide, { passive: true });

      window.setInterval(() => {
        if (
          !document.hidden &&
          !reducedMotion.matches &&
          !galleryCarousel.matches(":hover") &&
          !galleryCarousel.contains(document.activeElement)
        ) {
          showSlide(currentSlide + 1);
        }
      }, 2000);
    }


  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwChlZX9KYcFIQveRtknTzqcT4CheP3bXFHZ7iN5CviSaGX0cYoQLRHij6Y6St8qOZvYA/exec";

  const form = document.getElementById("bookingForm");
  const submitBtn = document.getElementById("submitBtn");
  const statusDiv = document.getElementById("formStatus");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Disable button & show sending message
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Submitting...";
    statusDiv.style.color = "#333";
    statusDiv.textContent = "Processing your request...";

    // Use URLSearchParams to avoid CORS preflight issues with Google Apps Script
    const formData = new URLSearchParams(new FormData(form));

    fetch(SCRIPT_URL, {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          statusDiv.style.color = "green";
          statusDiv.textContent = "Booking request submitted successfully!";
          form.reset();
        } else {
          statusDiv.style.color = "red";
          statusDiv.textContent = data.message || "Failed to submit request. Please try again.";
        }
      })
      .catch(error => {
        console.error("Submission error:", error);
        statusDiv.style.color = "red";
        statusDiv.textContent = "An error occurred. Please try again or call us directly.";
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      });
  });