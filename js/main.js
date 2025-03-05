const API_KEY1 = `9487a4535e60442eb301ed9ec7f83dfa`;
let gameList = [];

const callAPI = async () => {
  try {
    let url = new URL(`https://api.rawg.io/api/games?key=${API_KEY1}`);
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
// 배열을 일정 크기(chunkSize)로 그룹화하는 함수
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
      (chunk, index) => `
    <div class="carousel-item ${index === 0 ? "active" : ""}">
      <div class="d-flex justify-content-around">
        ${chunk
          .map(
            (item) => `
          <div class="game-card">
            <img src="${item.background_image}" class="img-fluid game-thumbnail">
            <p class="mt-2">${item.name}</p>
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
};

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
  // console.log("gggg", games);
  renderBanner();
};
getGameData();

const changeBanner = async (id, element) => {
  const url = new URL(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
  const response = await fetch(url);
  const data = await response.json();
  document.querySelector(
    ".main-banner__banner-img-area"
  ).innerHTML = `<img src=${data.background_image}>`;

  // 기존 active 클랫흐가 적용된 모든 요소에서 active 제거
  document
    .querySelectorAll(".main-banner__sub-area__item")
    .forEach((item) => item.classList.remove("active"));

  // 현재 클릭한 요소에 active 추가 (자동 슬라이드일 경우 element가 null일수도 있음)
  if (element) {
    element.classList.add("active");
  } else {
    document
      .querySelector(".main-banner__sub-area__item")
      [currentIndex].classList.add("active");
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
      (
        game
      ) => ` <div class="main-banner__sub-area__item" onclick="changeBanner(${game.id}, this)">
              <img
                src=${game.background_image}
              />
              <span>${game.name}</span>
            </div>`
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
