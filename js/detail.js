const API_KEY = "537786cf19164215ba386fb47bd70c9c"; // API 키

// URL에서 gameId 가져오기
const getGameIdFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
};

const gameId = getGameIdFromURL();

let gameData = []; // 게임 데이터를 저장할 변수
let gameTags = []; // 해당 게임의 태그 데이터를 저장할 변수
let publisherData = []; // 게임의 게시자 데이터를 저장할 변수
let creatorData = []; // 게임의 크리에이터 데이터를 저장할 변수
let redditData = []; // 게임의 레딧 데이터를 저장할 변수

let mode = "overview";

let url = new URL(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`); // url 주소소

let recommendList = [];
let screenShotList = [];
let screenShotSrc = [];

//상세페이지 이동
const gotoDetailPage = (id) => {
  window.location.href = `detail.html?id=${id}`;
};

// category underline
let menus = document.querySelectorAll(".detail-menu div");
let underLine = document.getElementById("under-line");

menus.forEach((menu) =>
  menu.addEventListener("click", (e) => underlineIndicator(e))
);

for (let i = 1; i < menus.length; i++) {
  menus[i].addEventListener("click", function (event) {
    page(event);
  });
}

function underlineIndicator(e) {
  underLine.style.left = e.currentTarget.offsetLeft + "px";
  underLine.style.width = e.currentTarget.offsetWidth + "px";
  underLine.style.top =
    e.currentTarget.offsetTop + e.currentTarget.offsetHeight + "px";
}

function page(event) {
  mode = event.target.id;
  // group 정보 숨기기, 정보 보이기
  const groups = document.querySelectorAll(".group-information, .group-reddit, .group-tag");

  if (mode === "more") {
    document.getElementById("game-img").classList.remove("active");
    document.getElementById("more-game").classList.add("active");
    groups.forEach(group => {
      group.style.display = "none";
    });
  } else if (mode === "overview") {
    document.getElementById("more-game").classList.remove("active");
    document.getElementById("game-img").classList.add("active");
    groups.forEach(group => {
      group.style.display = "block";
    });
  }
}

// 별점 생성 함수
const generateStars = () => {
  const ratingElement = document.querySelector(".rating-display");
  if (!ratingElement) return;

  const rating = parseFloat(ratingElement.getAttribute("data-rating"));
  const maxStars = 5;
  let starsHTML = "";

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<span class="star"><i class="fa-solid fa-star full"></i></span>`;
  }
  if (halfStar) {
    starsHTML += `<span class="star"><i class="fa-solid fa-star-half-stroke half"></i></span>`;
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<span class="star"><i class="fa-regular fa-star empty"></i></span>`;
  }

  ratingElement.innerHTML = starsHTML;
};

// 게임의 세부 정보와 태그를 받아오는 함수
const fetchGameDetails = async (gameId) => {
  try {
    // 게임 정보 API 호출
    const gameResponse = await fetch(`
      https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);

    gameData = await gameResponse.json();
    // 게임의 태그 목록을 가져옵니다.
    gameTags = gameData.tags || [];

    // 게임의 게시자 정보를 가져옵니다.
    if (gameData.publishers && gameData.publishers.length > 0) {
      publisherData = gameData.publishers[0];
    }

    // 게임의 크리에이터 정보를 가져옵니다.
    if (gameData.developers && gameData.developers.length > 0) {
      creatorData = gameData.developers[0];
    }
    console.log("게임정보:", gameData);

    // 데이터를 받아온 후 화면을 다시 렌더링
    render();
  } catch (error) {
    console.error("게임 정보와 태그를 가져오는 중 오류 발생:", error);
  }
};
// 초기 데이터 요청
fetchGameDetails(gameId);

const render = () => {
  const resultHTML = `
       <div>
         <h2 class="game-name">${gameData?.name || "game"}</h2>
         <span>${gameData?.rating}</span>
         <span class="rating-display" data-rating="${gameData.rating}"></span>

         <span class="tags"># ${gameData?.tags[0]?.name || ""}</span>
         <span class="tags"># ${gameData?.tags[1]?.name || ""}</span>
         </div>`;

  const imgHTML = `
       <div id="carouselExampleIndicators" class="carousel slide detail-foto-slide">
         <div class="carousel-inner">
           <div class="carousel-item active">
             <img src="${
               gameData.background_image
             }" class="d-block w-100" alt="...">
           </div>
           ${screenShotSrc
             .map(
               (screen) => `
               <div class="carousel-item">
                 <img src="${screen}" class="d-block w-100" alt="...">
               </div>`
             )
             .join("")}
         </div>
     
         <div class="slide-button">
           <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
             <span class="carousel-control-prev-icon" aria-hidden="true"></span>
             <span class="visually-hidden">Previous</span>
           </button>
           <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
             <span class="carousel-control-next-icon" aria-hidden="true"></span>
             <span class="visually-hidden">Next</span>
           </button>
         </div>
     
         <div class="carousel-indicators change-page">
           <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" class="active" aria-current="true" aria-label="Slide 1">
           <img src="${
             gameData.background_image
           }" class="d-block w-100" alt="...">
            </button>
            ${screenShotSrc
              .map(
                (screen, index) => `
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${
                  index + 1
                }" aria-label="Slide ${index + 2}">
                  <img src="${screen}" class="d-block w-100" alt="...">
                  </button>`
              )
              .join("")}
                </div>
                </div>
                `;

  let moreHTML = `<div class="row row-cols-3 g-3 more-games-container">`;

  if (recommendList.length < 12) {
    for (let i = 0; i < recommendList.length; i++) {
      moreHTML += `
    <div class="col">
      <div class="card">
        <img src="${recommendList[i].background_image}" class="card-img-top" onclick="gotoDetailPage(${recommendList[i].id})">
        <div class="card-body">
          <h5 class="card-title">${recommendList[i].name}</h5>
        </div>
      </div>
    </div>
  `;
    }
  } else {
    for (let i = 0; i < 12; i++) {
      moreHTML += `
      <div class="col">
        <div class="card">
          <img src="${recommendList[i].background_image}" class="card-img-top" onclick="gotoDetailPage(${recommendList[i].id})">

          <div class="card-body">
            <h5 class="card-title">${recommendList[i].name}</h5>
          </div>
        </div>
      </div>
    `;
    }
  }
  moreHTML += `</div>`;

  document.getElementById("game-title").innerHTML = resultHTML;
  document.getElementById("game-img").innerHTML = imgHTML;
  document.getElementById("more-game").innerHTML = moreHTML;
  generateStars();

  //

  displayGameDetails(gameData);
  displayGenres(gameData.genres);
  renderTags(gameTags);
  displayPublisher(publisherData);
  displayCreator(creatorData);
};

// 게임 세부 정보를 HTML에 표시하는 함수
const displayGameDetails = (game) => {
  const gameInformation = document.getElementById("game-information");

  gameInformation.innerHTML = `
        
        <ul class="information-list">
            <li><strong>Platforms :</strong>&nbsp;&nbsp;<em>${
              game.platforms
                ? game.platforms
                    .map((platform) => platform.platform.name)
                    .join(", ")
                : "Information not available"
            }</em></li>
            <li><strong>Game Series :</strong>&nbsp;&nbsp;<em>${
              game.game_series_count || "None"
            }</em></li>
            <li><strong>Release Date :</strong>&nbsp;&nbsp;<em>${
              game.released || "TBD"
            }</em></li>
            <li><strong>Metacritic Score :</strong>&nbsp;&nbsp;<em>${
              game.metacritic || "Information not available"
            }</em></li>
            <li><strong>Description :</strong> <em>${
              game.description_raw || "No description available."
            }</em></li>

            </ul>`;
};

// 장르 정보를 HTML에 표시하는 함수
const displayGenres = (genres) => {
  const genreList = document.querySelector(".genre-list");
  genreList.innerHTML = "";

  genres.forEach((genre) => {
    const genreItem = document.createElement("li");
    genreItem.classList.add("genre-item");

    const genreLink = document.createElement("a");
    genreLink.href = "#";
    genreLink.textContent = genre.name;

    genreItem.appendChild(genreLink);
    genreList.appendChild(genreItem);
  });
};

// 게임 태그 목록을 HTML에 표시하는 함수
const renderTags = (tags) => {
  const tagList = document.querySelector(".tag-list");
  tagList.innerHTML = "";

  tags.forEach((tag) => {
    const tagItem = document.createElement("li");
    tagItem.classList.add("tag-item");

    const tagLink = document.createElement("a");
    tagLink.href = "#";
    tagLink.textContent = tag.name;

    tagItem.appendChild(tagLink);
    tagList.appendChild(tagItem);
  });
};

// 게시자 정보를 HTML에 표시하는 함수
const displayPublisher = (publisher) => {
  const publisherWrap = document.querySelector(".publisher-wrap");

  if (publisher && publisher.name) {
    publisherWrap.innerHTML = `
            <ul class="publisher-list">
                <li class="publisher-item"><strong>Publisher Description :</strong>&nbsp;&nbsp;<em>${
                  publisher.description || ""
                }</em></li>
                <li class="publisher-item"><strong>Games Published :</strong>&nbsp;&nbsp;<em>${
                  publisher.games_count || ""
                }</em></li>

            </ul>`;
  } else {
    publisherWrap.innerHTML = `<p>No publisher data available.</p>;`;
  }
};

// 크리에이터 정보를 HTML에 표시하는 함수
const displayCreator = (creator) => {
  const creatorWrap = document.querySelector(".creator-wrap");

  if (creator && creator.name) {
    creatorWrap.innerHTML = `
            <ul class="creator-list">
                <li class="creator-item"><strong>Creator Description :</strong>&nbsp;&nbsp;<em>${
                  creator.description || ""
                }</em></li>
                <li class="creator-item"><strong>Games Created :</strong>&nbsp;&nbsp;<em>${
                  creator.games_count || ""
                }</em></li>

            </ul>`;
  } else {
    creatorWrap.innerHTML = `<p>No creator data available.</p>`;
  }
};

const moreGames = async () => {
  let genre = "";
  let gameList = [];

  try {
    let response = await fetch(url);
    let data = await response.json();
    if (data.genres && data.genres.length > 0) {
      genre = data.genres[0].name;
    }
  } catch (error) {
    console.error("게임 추천 에러:", error);
    return; // 에러 발생 시 함수 종료
  }

  try {
    const gameListUrl = new URL(
      `https://api.rawg.io/api/games?key=${API_KEY}&page_size=100`
    );
    let response = await fetch(gameListUrl);
    let data = await response.json();
    gameList = data.results;

    for (let i = 0; i < gameList.length; i++) {
      let game = gameList[i];

      // genres 배열이 있는지 체크 후 비교
      if (game.genres && game.genres.length > 0 && gameId != game.id) {
        for (let j = 0; j < game.genres.length; j++) {
          // `j`로 변경
          if (game.genres[j].name === genre) {
            if (!recommendList.some((g) => g.id === game.id)) {
              // 중복 방지
              recommendList.push(game);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("게임 리스트 에러:", error);
  }

  console.log("추천 장르:", genre);
  console.log("추천 게임 리스트:", recommendList);
  render();
};

moreGames();

const urlParams = new URLSearchParams(window.location.search);
const gameIdForMainHtml = urlParams.get("id");

if (!gameIdForMainHtml) {
  console.error("게임 ID가 URL에 제공되지 않았습니다.");
} else {
  fetchGameDetails(gameIdForMainHtml);
}

document.addEventListener("DOMContentLoaded", () => {
  const posts = [
    {
      title: "Title of the Reddit Post",
      url: "https://example.com",
      image: "https://via.placeholder.com/350x200",
      created: "2025-03-08",
      username: "username",
      description: "This is the description of the post...",
    },
  ];

  const redditList = document.querySelector(".reddit-list");

  posts.forEach((post) => {
    const postItem = document.createElement("li");
    postItem.classList.add("reddit-item");

    postItem.innerHTML = `
          <a href="${post.url}" target="_blank" class="post-link">
              <p class="post-title">${post.title}</p>
          </a>
          <img class="post-img" src="${post.image}" alt="${post.title}" />
          <div class="post-info">
              <p><strong>Created:</strong> ${new Date(
                post.created
              ).toLocaleString()}</p>
              <p><strong>Posted by:</strong> ${post.username}</p>
          </div>
          <div class="post-text">${post.description}</div>
          <div class="post-more">
              <a href="${post.url}" target="_blank">More</a>
          </div>
      `;

    redditList.appendChild(postItem);
  });
});

const getRedditPosts = async () => {
  if (typeof gameId === "undefined" || typeof API_KEY === "undefined") {
    console.error("gameId 또는 API_KEY가 정의되지 않았습니다.");
    return;
  }

  console.log("게임 ID:", gameId);
  const url = `https://api.rawg.io/api/games/${gameId}/reddit?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Reddit Posts:", data.results);

    const postsContainer = document.querySelector(".reddit-list");
    postsContainer.innerHTML = ""; // 기존 내용 초기화

    data.results.slice(0, 8).forEach((post) => {
      // 최대 9개만 표시
      const postElement = document.createElement("li");
      postElement.classList.add("reddit-item");

      // 전체 포스트를 감싸는 a 태그
      const linkElement = document.createElement("a");
      linkElement.href = post.url;
      linkElement.target = "_blank";
      linkElement.classList.add("post-link");

      // 링크 안에 포스트 내용 넣기
      linkElement.innerHTML = `
              <p class="post-title">${post.name}</p>
              ${
                post.image
                  ? `<img class="post-img" src="${post.image}" alt="${post.name}" />`
                  : ""
              }
              <div class="post-info">
                  <p><strong>Created:</strong> ${new Date(
                    post.created
                  ).toLocaleString()}</p>
                  <p><strong>Posted by:</strong> ${post.username}</p>
              </div>
          `;

      // 전체 포스트를 linkElement 안에 삽입
      postElement.appendChild(linkElement);
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("데이터 가져오기 실패:", error);
  }
};

getRedditPosts();


const screenShot = async () => {
  const screenShotUrl = new URL(
    `https:api.rawg.io/api/games/${gameId}/screenshots?key=${API_KEY}`
  );
  let response = await fetch(screenShotUrl);
  let shots = await response.json();
  screenShotList = shots.results;

  for (let i = 0; i < screenShotList.length; i++) {
    screenShotSrc.push(screenShotList[i].image);
  }
  console.log(screenShotSrc);
  render();
};
    

screenShot();
