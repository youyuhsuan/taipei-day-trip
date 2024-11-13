let allCards = [];

// 圖片加載系統
const ImageLoadingSystem = {
  async loadBatch(items) {
    if (!items.length) return;

    try {
      // 預加載所有圖片
      const loadPromises = items.map((item) =>
        this.loadImage(item.image).catch((err) => {
          console.error(`圖片加載失敗: ${item.image}`, err);
          return null;
        })
      );

      // 等待所有圖片加載完成
      const results = await Promise.all(loadPromises);

      // 一次性更新所有DOM
      requestAnimationFrame(() => {
        items.forEach((item, index) => {
          if (results[index]) {
            const { img, cardName, cardMrt, cardCategory } = item.elements;
            img.src = item.image;
            img.classList.remove("loading");
            img.classList.add("loaded");
            cardName.style.display = "";
            cardMrt.style.display = "";
            cardCategory.style.display = "";
          }
        });
      });
    } catch (error) {
      console.error("批次處理出錯:", error);
    }
  },

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(
        () => reject(new Error("圖片加載超時")),
        20000
      );

      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`加載失敗: ${src}`));
      };

      img.src = src;
    });
  },
};

function createAttractionCard(name, category, mrt, image, id) {
  const attractionsCard = document.createElement("figure");
  attractionsCard.className = "attractions-card";

  const cardLink = document.createElement("a");
  cardLink.className = "card-link";
  cardLink.dataset.attractionId = id;
  cardLink.href = `/attraction/${id}`;

  const cardImg = document.createElement("div");
  cardImg.className = "card-img";

  const img = document.createElement("img");
  img.dataset.src = image;
  img.alt = name;
  img.className = "loading";

  const cardContent = document.createElement("div");
  cardContent.className = "card-content font-content regular";

  const cardName = document.createElement("p");
  cardName.className = "card-name font-content bold ";
  cardName.textContent = name;
  cardName.style.display = "none";

  const cardMrt = document.createElement("p");
  cardMrt.className = "card-mrt";
  cardMrt.textContent = mrt;
  cardMrt.style.display = "none";

  const cardCategory = document.createElement("p");
  cardCategory.className = "card-category";
  cardCategory.textContent = category;
  cardCategory.style.display = "none";

  // 組裝 DOM
  cardImg.appendChild(img);
  cardImg.appendChild(cardName);
  cardLink.appendChild(cardImg);
  cardContent.appendChild(cardMrt);
  cardContent.appendChild(cardCategory);
  attractionsCard.appendChild(cardLink);
  attractionsCard.appendChild(cardContent);

  // 保存卡片信息
  allCards.push({
    image,
    elements: { img, cardName, cardMrt, cardCategory },
    card: attractionsCard,
  });

  return attractionsCard;
}

// 當所有卡片創建完成後調用此函數
function initializeAllCards() {
  // 使用 IntersectionObserver 監控所有卡片
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleCards = allCards.filter(({ card }) =>
        entries.some((entry) => entry.target === card && entry.isIntersecting)
      );

      if (visibleCards.length > 0) {
        ImageLoadingSystem.loadBatch(visibleCards);
        // 移除已處理的卡片
        allCards = allCards.filter((card) => !visibleCards.includes(card));
      }
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.1,
    }
  );

  // 開始監控所有卡片
  allCards.forEach(({ card }) => observer.observe(card));
}

// 在頁面卸載時清理
function cleanup() {
  allCards = [];
}

export { createAttractionCard, initializeAllCards, cleanup };
