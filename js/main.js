const API_KEY1 = `9487a4535e60442eb301ed9ec7f83dfa`;
let gameList = [];

const callAPI = async () => {
  try {
    let url = new URL(
      `https://api.rawg.io/api/games?key=${API_KEY1}&page_size=20`
    );
    let response = await fetch(url);
    let data = await response.json();
    gameList = data.results;
    renderGameCarousel();
    // 평점순 캐러셀: rating 내림차순 정렬 후 렌더링
    const sortedByRating = [...gameList].sort((a, b) => b.rating - a.rating);
    renderRatingCarousel(sortedByRating);
    console.log("게임 데이터:", gameList);
  } catch (error) {
    console.error("API 요청 실패:", error);
    document.getElementById(
      "game-list"
    ).innerHTML = `<p>게임 데이터를 불러올 수 없습니다.</p>`;
  }
};
callAPI();

const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// 기존 캐러셀 렌더링
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
          <div class="game-card" draggable="true">
            <a href="detail.html?id=${item.id}">
              <img src="${item.background_image}" class="game-thumbnail" alt="${item.name}">
              <p class="game-title">${item.name}</p>
            </a>
          </div>
        `
          )
          .join("")}
      </div>
    </div>`
    )
    .join("");
  document.getElementById("game-list").innerHTML = gameHTML;

  // 드래그 이벤트 부착
  const gameCards = document.querySelectorAll(".game-card");
  gameCards.forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      if (hasDroppedGame) {
        event.preventDefault();
        return;
      }
      event.dataTransfer.setData("text/html", card.outerHTML);
    });
  });
};

// 평점순 캐러셀 렌더링 함수
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
          <div class="game-card" draggable="true">
            <a href="detail.html?id=${item.id}">
              <img src="${item.background_image}" class="game-thumbnail" alt="${item.name}">
              <p class="game-title">${item.name}</p>
              <p class="game-rating">Rating: ${item.rating}</p>
            </a>
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

  // 평점 캐러셀의 드래그 이벤트
  const ratingCards = document.querySelectorAll("#rating-list .game-card");
  ratingCards.forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/html", card.outerHTML);
    });
  });
};

let currentSlide = 0; // 기존 캐러셀 슬라이드 인덱스
let currentSlideRating = 0; // 평점 캐러셀 슬라이드 인덱스
let hasDroppedGame = false; //처음 드랍값
let recommendedShown = false; //처음 추천값

// 슬라이드 전환 함수
const showSlide = (carouselId, index) => {
  const slides = document.querySelectorAll(`#${carouselId} .carousel-item`);
  if (index < 0 || index >= slides.length) return;
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
  return index;
};

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

  // 평점 캐러셀 컨트롤 이벤트
  const prevBtnRating = document.getElementById("prev-btn-rating");
  const nextBtnRating = document.getElementById("next-btn-rating");
  prevBtnRating.addEventListener("click", () => {
    const slides = document.querySelectorAll("#rating-carousel .carousel-item");
    currentSlideRating =
      (currentSlideRating - 1 + slides.length) % slides.length;
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
        // 추천 버튼 기능 (예: 무작위 게임 카드 표시)
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
});

// 여기

const API_KEY = "8150b00e2a1f40e486076b6650624997";
let games = [];
let gameId = "";
let currentIndex = 0;
let autoSlideInterval;

const getGameData = async () => {
  const url =
    new URL(`https://api.rawg.io/api/games?key=${API_KEY}&ordering=-released&dates=2025-01-01,2025-12-31&page_size=21
`);
  const response = await fetch(url);
  const data = await response.json();
  games = data.results;
  // console.log("ddd", data);
  console.log("gggg", games);
  renderBanner();
};
getGameData();

const changeBanner = async (id, element) => {
  const url = new URL(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
  const response = await fetch(url);
  const data = await response.json();
  console.log("dddd", data);
  document.querySelector(
    ".main-banner__banner-img-area"
  ).innerHTML = `<img onclick="gotoDetailPage(${id})" src=${data.background_image}>`;

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
};

const renderBanner = () => {
  let bannerHTML = ``;

  bannerHTML = `<img src=${games[0].background_image} />`;
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
  console.log("input", input);
  const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(
    input
  )}&key=${API_KEY}`;

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
            <div class="search-result col-lg-3">
              <img onclick="gotoDetailPage(${game.id})"src="${game.background_image}" alt="${game.name}">
              <p>${game.name}</p>
            </div>`
          )
          .join("")}
      </div>
    </section>`;

  document.getElementById("search").value = "";
  document.querySelector(".main-banner").innerHTML = searchHTML;

  document.getElementById("game-sys").innerHTML = "";
  document.getElementById("drag-zone").innerHTML = "";
};
