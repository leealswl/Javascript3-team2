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

const getGameData = async () => {
  const url =
    new URL(`https://api.rawg.io/api/games?key=${API_KEY}&ordering=-added
`);
  const response = await fetch(url);
  const data = await response.json();
  games = data.results;
  console.log("ddd", data);
  console.log("gggg", games);
  renderBanner();
};
getGameData();

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
      (game) => ` <div class="main-banner__sub-area__item">
              <img
                src=${game.background_image}
              />
              <span>${game.name}</span>
            </div>`
    )
    .join("");
  document.querySelector(".main-banner__sub-area").innerHTML = subHTML;
};

const getGameTrailer = async () => {
  let gameId = "";
  const url = new URL(
    `https://api.rawg.io/api/games/${gameId}/movies?key=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("movie", data);
};
