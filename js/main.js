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
    render();
    console.log("게임 데이터:", gameList);
  } catch (error) {
    console.error("API 요청 실패:", error);
    document.getElementById(
      "game-list"
    ).innerHTML = `<p>게임 데이터를 불러올 수 없습니다.</p>`;
  }
};
callAPI();

// 배열 그룹화하는 함수
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};
const render = () => {
  const chunks = chunkArray(gameList, 5);
  const gameHTML = chunks
    .map(
      (chunk) => `
    <div class="game-container">
      ${chunk
        .map(
          (item) => `
        <div class="game-card" draggable="true">
          <img src="${item.background_image}" class="img-fluid game-thumbnail">
          <p class="game-title">${item.name}</p>
        </div>`
        )
        .join("")}
    </div>`
    )
    .join("");
  document.getElementById("game-list").innerHTML = gameHTML;

  // 각 게임 카드에 드래그 시작 이벤트 부착
  const gameCards = document.querySelectorAll(".game-card");
  gameCards.forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/html", card.outerHTML);
    });
  });
};

let hasDroppedGame = false; // 게임이 드롭되었는지 여부
let recommendedShown = false; // 추천 게임이 표시되었는지 여부

const recommendRandomGame = () => {
  if (gameList && gameList.length > 0) {
    const randomIndex = Math.floor(Math.random() * gameList.length);
    const randomGame = gameList[randomIndex];
    const randomGameHTML = `
      <div class="game-card">
        <img src="${randomGame.background_image}" class="img-fluid game-thumbnail">
        <p class="game-title">${randomGame.name}</p>
      </div>
    `;
    const dropZone = document.getElementById("drop-zone");
    // 드래그 영역의 기존 데이터를 제거 후 추천 게임만 표시
    dropZone.innerHTML = randomGameHTML;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  render();

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
    dropZone.classList.remove("drop-zone-active");
    // 드래그한 게임 카드 HTML 가져오기
    const gameCardHTML = event.dataTransfer.getData("text/html");
    dropZone.innerHTML += gameCardHTML;
    hasDroppedGame = true; // 드랍되었음을 표시
  });

  // 추천 버튼 클릭 시: 게임이 드롭된 경우에만 추천 진행
  if (recommendBtn) {
    recommendBtn.addEventListener("click", () => {
      // 드래그해서 게임이 drop-zone에 없으면 아무 동작도 하지 않음
      if (!hasDroppedGame) return;
      if (!recommendedShown) {
        // 드래그 영역의 기존 데이터 제거 후 추천 게임 추가
        recommendRandomGame();
        recommendedShown = true;
        // 버튼 비활성화하여 추가 추천 방지
        recommendBtn.disabled = true;
      }
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
    new URL(`https://api.rawg.io/api/games?key=${API_KEY}&ordering=-added
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
  console.log("gameId", id);
  window.location.href = `detail.html?id=${id}`;
};

const getSearchGames = async (event) => {
  event.preventDefault();
  const input = document.getElementById("search").value.toLowerCase().trim();
  if (!input) {
    console.log("검색어를 입력하세요.");
    return;
  }
  console.log("input", input);
  const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(
    input
  )}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("검색 요청 실패");
    const data = await response.json();
    console.log("search-data", data);
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
  }
};
