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
