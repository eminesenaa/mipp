/* ============================================================
   REVEAL — IntersectionObserver scroll-triggered fade-in
   Elements must carry the class "reveal" in HTML.
   The "visible" class is added once they enter the viewport;
   the CSS transition in base.css handles the animation.
   ============================================================ */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));
