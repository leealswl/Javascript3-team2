AOS.init();

const API_KEY1 = `537786cf19164215ba386fb47bd70c9c`;


let gameList = [];

const callAPIRelease = async () => {
  try {
    let url = new URL(
      `https://api.rawg.io/api/games?key=${API_KEY1}&ordering=-released&dates=2025-01-01,2025-12-31&page_size=38`
    );
    let response = await fetch(url);
    let data = await response.json();
    gameList = data.results.filter(
      (game) => game.released !== null && game.background_image !== null
    );
    // console.log("Ggg",gameList)
    renderGameCarousel();
    renderGameGrid();
    initAnimations();
  } catch (error) {
    console.error("최신순 API 요청 실패:", error);
    document.getElementById(
      "game-list"
    ).innerHTML = `<p>게임 데이터를 불러올 수 없습니다.</p>`;
  }
};
callAPIRelease();

const callAPIRating = async () => {
  try {
    let url = new URL(
      `https://api.rawg.io/api/games?key=${API_KEY1}&ordering=-rating&page_size=38`
    );
    let response = await fetch(url);
    let data = await response.json();
    const ratingGameList = data.results.filter(
      (game) => game.released !== null && game.background_image !== null
    );
    // console.log("Ggg",ratingGameList)
    renderRatingCarousel(ratingGameList);
  } catch (error) {
    console.error("평점 순 API 요청 실패:", error);
    document.getElementById(
      "rating-list"
    ).innerHTML = `<p>게임 데이터를 불러올 수 없습니다.</p>`;
  }
};
callAPIRating();
// 애니메이션효과 함수로.. api호출후에 나오게하려공
const initAnimations = () => {
  const recTextElements = document.querySelectorAll(".recommend-text");
  const observerOptions = {
    threshold: 0.5,
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate__animated", "animate__fadeInDown");
        entry.target.style.opacity = 1;
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  recTextElements.forEach((el) => observer.observe(el));
};
//배열 5개씩
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};
// released순 캐러셀 렌더링
const renderGameCarousel = () => {
  const chunks = chunkArray(gameList, 5);
  const gameHTML = chunks
    .map(
      (chunk, index) => `
    <div class="carousel-item ${index === 0 ? "active" : ""}">
      <div class="game-container">
        ${chunk
          .map(
            (item) => `
          <div class="game-card flip-card" data-id="${item.id}">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <a href="detail.html?id=${item.id}" class="front-link">
                  <img src="${item.background_image}" class="game-thumbnail" alt="${item.name}">
                </a>
              </div>
              <div class="flip-card-back">
                <a href="detail.html?id=${item.id}" class="back-link">
                  <div class="back-content">
                    <p class="game-title">${item.name}</p>
                    <p class="game-released">${item.released}</p>
                    <p class="game-rating">
                      <i class="fa-solid fa-star"></i> ${item.rating}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `
    )
    .join("");
  document.getElementById("game-list").innerHTML = gameHTML;

  // 마우스 오버 시 카드 뒤집기 이벤트
  const flipCards = document.querySelectorAll(".flip-card");
  flipCards.forEach((card) => {
    card.addEventListener("mouseover", () => {
      card.classList.add("flipped");
    });
    card.addEventListener("mouseout", () => {
      card.classList.remove("flipped");
    });
  });
};
// rating순 캐러셀 렌더링
const renderRatingCarousel = (sortedGames) => {
  const chunks = chunkArray(sortedGames, 5);
  const ratingHTML = chunks
    .map(
      (chunk, index) => `
    <div class="carousel-item ${index === 0 ? "active" : ""}">
      <div class="game-container">
        ${chunk
          .map(
            (item) => `
          <div class="game-card flip-card" draggable="false" data-id="${item.id}">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <a href="detail.html?id=${item.id}" class="front-link">
                  <img src="${item.background_image}" class="game-thumbnail" alt="${item.name}">
                </a>
              </div>
              <div class="flip-card-back">
                <a href="detail.html?id=${item.id}" class="back-link">
                  <div class="back-content">
                    <p class="game-title">${item.name}</p>
                    <p class="game-rating">
                      <i class="fa-solid fa-star"></i> ${item.rating}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `
    )
    .join("");
  document.getElementById("rating-list").innerHTML = ratingHTML;

  // 마우스 오버 시 카드 뒤집기 이벤트 등록
  const flipCards = document.querySelectorAll("#rating-list .flip-card");
  flipCards.forEach((card) => {
    card.addEventListener("mouseover", () => {
      card.classList.add("flipped");
    });
    card.addEventListener("mouseout", () => {
      card.classList.remove("flipped");
    });
  });
};
// 추천게임 랜덤으로 렌더링하는 함수
const renderGameGrid = () => {
  const gridContainer = document.getElementById("game-grid-list");

  if (!gameList || gameList.length === 0) {
    gridContainer.innerHTML = `<p>게임 데이터를 불러올 수 없습니다.</p>`;
    return;
  }

  const cardCount = 5;
  const shuffledGames = [...gameList].sort(() => Math.random() - 0.5);
  const selectedGames = shuffledGames.slice(0, cardCount);

  const gridHTML = selectedGames
    .map(
      (item) => `
    <div class="game-card" data-id="${item.id}">
      <a href="detail.html?id=${item.id}" class="front-link">
        <img src="${item.background_image}" class="game-thumbnail" alt="${item.name}">
        <p class="game-title">${item.name}</p>
        </a>
    </div>
  `
    )
    .join("");

  gridContainer.innerHTML = gridHTML;
};
// 슬라이드 전환 함수
const showSlide = (carouselId, index) => {
  const slides = document.querySelectorAll(`#${carouselId} .carousel-item`);
  if (index < 0 || index >= slides.length) return;
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
  return index;
};
// 페이지 로딩 또는 API 호출 후 처음 렌더링 및 리셋 버튼 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
  const gridResetBtn = document.getElementById("grid-reset-btn");
  gridResetBtn.addEventListener("click", renderGameGrid);
});

let currentSlide = 0; // 기존 캐러셀 슬라이드 인덱스
let currentSlideRating = 0; // 평점 캐러셀 슬라이드 인덱스
let hasDroppedGame = false; //처음 드랍값
let recommendedShown = false; //처음 추천값

document.addEventListener("DOMContentLoaded", () => {
  // 기존 캐러셀 컨트롤 이벤트
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  prevBtn.addEventListener("click", () => {
    const slides = document.querySelectorAll("#game-carousel .carousel-item");
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide("game-carousel", currentSlide);
  });
  nextBtn.addEventListener("click", () => {
    const slides = document.querySelectorAll("#game-carousel .carousel-item");
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide("game-carousel", currentSlide);
  });
});
// 평점 캐러셀 컨트롤 이벤트
const prevBtnRating = document.getElementById("prev-btn-rating");
const nextBtnRating = document.getElementById("next-btn-rating");
prevBtnRating.addEventListener("click", () => {
  const slides = document.querySelectorAll("#rating-carousel .carousel-item");
  currentSlideRating = (currentSlideRating - 1 + slides.length) % slides.length;
  showSlide("rating-carousel", currentSlideRating);
});
nextBtnRating.addEventListener("click", () => {
  const slides = document.querySelectorAll("#rating-carousel .carousel-item");
  currentSlideRating = (currentSlideRating + 1) % slides.length;
  showSlide("rating-carousel", currentSlideRating);
});

// 드롭존
const dropZone = document.getElementById("drop-zone");
const recommendBtn = document.getElementById("recommend-btn");

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("drop-zone-active");
});
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drop-zone-active");
});
dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  if (hasDroppedGame) return;
  dropZone.classList.remove("drop-zone-active");
  const gameCardHTML = event.dataTransfer.getData("text/html");
  dropZone.innerHTML = gameCardHTML;
  hasDroppedGame = true;
});
if (recommendBtn) {
  recommendBtn.addEventListener("click", () => {
    if (!hasDroppedGame) return;
    if (!recommendedShown) {
      // 추천 버튼 기능 (랜덤임)
      const randomIndex = Math.floor(Math.random() * gameList.length);
      const randomGame = gameList[randomIndex];
      const randomGameHTML = `
          <div class="game-card">
            <a href="detail.html?id=${randomGame.id}">
              <img src="${randomGame.background_image}" class="game-thumbnail" alt="${randomGame.name}">
              <p class="game-title">${randomGame.name}</p>
              <p class="game-rating">Rating: ${randomGame.rating}</p>
            </a>
          </div>
        `;
      document.getElementById("drop-zone").innerHTML = randomGameHTML;
      recommendedShown = true;
      recommendBtn.disabled = true;
    }
  });
}
// 리셋 버튼 이벤트
const resetBtn = document.getElementById("reset-btn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    document.getElementById("drop-zone").innerHTML = "";
    hasDroppedGame = false;
    recommendedShown = false;
    document.getElementById("recommend-btn").disabled = false;
    showSlide("game-carousel", 0);
  });
}

// 여기

// const API_KEY = "8150b00e2a1f40e486076b6650624997";
let games = [];
let gameId = "";
let currentIndex = 0;
let autoSlideInterval;

const getGameData = async () => {
  const url = new URL(`https://api.rawg.io/api/games?key=${API_KEY1}
`);
  const response = await fetch(url);
  const data = await response.json();
  games = data.results;
  // console.log("ddd", data);
  // console.log("gggg", games);
  renderBanner();
};
getGameData();

const renderBanner = () => {
  let bannerHTML = ``;

  // <img src=${games[0].background_image} />
  bannerHTML = `
  <div id="banner-img" 
       style="background-image: 
       linear-gradient(90deg, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 0)), 
       url('${games[0].background_image}');">
       <p>${games[0].name}</p>
  </div>
`;
  document.querySelector(".main-banner__banner-img-area").innerHTML =
    bannerHTML;

  document.querySelector(".main-banner__banner-img-area").innerHTML =
    bannerHTML;

  let subHTML = ``;
  let top5 = [];
  for (i = 0; i < 5; i++) {
    top5.push(games[i]);
  }
  subHTML = top5
    .map(
      (game, index) => `
      <div class="main-banner__sub-area__item ${index === 0 ? "focus" : ""}" 
           onclick="manualChangeBanner(${game.id}, ${index}, this)">
        <img src=${game.background_image} />
        <span>${game.name}</span>
      </div>
    `
    )
    .join("");
  document.querySelector(".main-banner__sub-area").innerHTML = subHTML;

  startAutoSlide(); // 페이지 로드 후 자동 슬라이드 시작
};

async function changeBanner(id, element) {
  const url = new URL(`https://api.rawg.io/api/games/${id}?key=${API_KEY1}`);
  const response = await fetch(url);
  const data = await response.json();
  document.querySelector(".main-banner__banner-img-area").innerHTML = ` <div
    data-aos="fade-right"
    onclick="gotoDetailPage('${id}')"
    style="background-image: 
      linear-gradient(90deg, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 0)), 
      url('${data.background_image}');">
      <p>${data.name}</p>
  </div>
`;

  // 기존 active 클래스스가 적용된 모든 요소에서 active 제거
  document
    .querySelectorAll(".main-banner__sub-area__item")
    .forEach((item) => item.classList.remove("focus"));

  // 현재 클릭한 요소에 active 추가 (자동 슬라이드일 경우 element가 null일수도 있음)
  if (element) {
    element.classList.add("focus");
  } else {
    document
      .querySelector(".main-banner__sub-area__item")
      [currentIndex].classList.add("focus");
  }
}

// ✅ 수동 클릭 시 자동 슬라이드 리셋
const manualChangeBanner = (id, index, element) => {
  currentIndex = index; // 클릭한 인덱스로 업데이트
  changeBanner(id, element);
  restartAutoSlide(); // 수동 클릭 시 자동 슬라이드 재시작

  // ✅ 클릭한 요소에 'clicked' 클래스 추가 후 일정 시간 뒤 제거
  const img = element.querySelector("img");
  img.classList.add("clicked");
  setTimeout(() => {
    img.classList.remove("clicked");
  }, 300); // 0.2초 후 원래 크기로 복귀
};

// ✅ 자동 슬라이드 기능
const autoSlide = () => {
  currentIndex = (currentIndex + 1) % 5; // 0~4 사이에서 순환
  let nextGame = games[currentIndex];
  changeBanner(
    nextGame.id,
    document.querySelectorAll(".main-banner__sub-area__item")[currentIndex]
  );
};

// ✅ 자동 슬라이드 시작
const startAutoSlide = () => {
  autoSlideInterval = setInterval(autoSlide, 3000); // 3초마다 실행
};

// ✅ 수동 클릭 시 자동 슬라이드 리셋
const restartAutoSlide = () => {
  clearInterval(autoSlideInterval); // 기존 자동 슬라이드 정지
  startAutoSlide(); // 새로운 자동 슬라이드 시작
};

const gotoDetailPage = (id) => {
  window.location.href = `detail.html?id=${id}`;
};

const getSearchGames = async (event) => {
  event.preventDefault();
  let input = document.getElementById("search").value.toLowerCase().trim();
  if (!input) {
    console.log("검색어를 입력하세요.");
    return;
  }

  const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(
    input
  )}&key=${API_KEY1}`;
  let games = [];

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("검색 요청 실패");
    const data = await response.json();
    games = data.results;
    console.log("search-data", games);
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    return;
  }

  let searchHTML = `
    <section class="search-container container">
      <div class="row">
        ${games
          .map(
            (game) => `
            <div class="search-result col-md-6 col-lg-3" data-aos="fade-up">
              <img  onclick="gotoDetailPage(${game.id})"src="${game.background_image}" alt="${game.name}">
              <p>${game.name}</p>
            </div>`
          )
          .join("")}
      </div>
    </section>`;

  document.getElementById("search").value = "";
  document.querySelector(".main-banner").innerHTML = searchHTML;
  AOS.init(); // AOS를 다시 초기화해서 검색 결과에도 적용되도록 함
  // document.getElementById("game-sys").innerHTML = "";
  // document.getElementById("drag-zone").innerHTML = "";
  document.getElementById("for-delete").innerHTML = "";
  document.querySelector(".footer-container").innerHTML = "";
};
