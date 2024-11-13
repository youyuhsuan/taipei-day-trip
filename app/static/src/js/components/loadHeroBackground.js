function initHeroImage() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const img = new Image();

  img.onload = () => {
    requestAnimationFrame(() => {
      hero.classList.add("loaded");
    });
  };

  img.src = "../static/src/image/welcome.png";
}

// 使用 Intersection Observer 優化載入時機
function initHeroWithObserver() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        initHeroImage();
        observer.unobserve(hero);
      }
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.1,
    }
  );

  observer.observe(hero);
}

document.addEventListener("DOMContentLoaded", initHeroWithObserver);
