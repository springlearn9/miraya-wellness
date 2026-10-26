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
  const responseFrame = document.querySelector('iframe[name="bookingResponse"]');
  let submissionPending = false;
  const originalBtnText = submitBtn.textContent;

  form.action = SCRIPT_URL;
  form.method = "POST";

  form.addEventListener("submit", function () {
    submissionPending = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    statusDiv.style.color = "#333";
    statusDiv.textContent = "Processing your request...";
  });

  responseFrame.addEventListener("load", function () {
    if (!submissionPending) {
      return;
    }

    submissionPending = false;
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    statusDiv.style.color = "green";
    statusDiv.textContent = "Your request was sent. We will contact you to confirm.";
  });
