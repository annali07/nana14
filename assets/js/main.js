const header = document.querySelector("[data-header]");
const nav = document.querySelector("#site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const sections = Array.from(document.querySelectorAll(".section-observed"));
const parallaxLayers = document.querySelectorAll("[data-parallax]");

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isMatch);
  });
};

const closeMenu = () => {
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 720) {
      closeMenu();
    }
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.dataset.section);
      }
    });
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: 0.01,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const handleScroll = () => {
  const scrollY = window.scrollY;
  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const scrollProgress = Math.min(1, scrollY / maxScroll);
  header.classList.toggle("is-scrolled", scrollY > 24);
  document.body.style.setProperty("--scroll-depth", scrollProgress.toFixed(3));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth <= 720) {
    return;
  }

  parallaxLayers.forEach((layer, index) => {
    const depth = (index + 1) * 0.045;
    layer.style.transform = `translate3d(0, ${scrollY * depth}px, 0)`;
  });
};

document.addEventListener("click", (event) => {
  if (window.innerWidth > 720 || !nav.classList.contains("is-open")) {
    return;
  }

  if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 720) {
    closeMenu();
  }
});

handleScroll();
setActiveLink("about");
