const API_KEY = "537786cf19164215ba386fb47bd70c9c"; // API 키

const gameId = '4291'; // 게임 ID
let url = new URL(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`); // url 주소소

let gameData = []

// category underline
let menus = document.querySelectorAll(".detail-menu div")
let underLine = document.getElementById("under-line")

menus.forEach(menu => menu.addEventListener("click", (e)=>underlineIndicator(e)))

function underlineIndicator(e) {
  underLine.style.left = e.currentTarget.offsetLeft + "px";
  underLine.style.width = e.currentTarget.offsetWidth + "px";
  underLine.style.top = e.currentTarget.offsetTop + e.currentTarget.offsetHeight + "px";
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


// 게임의 세부 정보와 장르를 받아오는 함수
const fetchGameDetails = async (gameId) => {
    try {
        // 게임 정보 API 호출
        const gameResponse = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
        gameData = await gameResponse.json();

        // 데이터를 받아온 후 화면을 다시 렌더링
        render();

        console.log("게임정보:", gameData)
    } catch (error) {
        console.error("게임 정보와 장르를 가져오는 중 오류 발생:", error);
    }
};


// 게임 세부 정보를 HTML에 표시하는 함수 (render 함수 내에서 호출)
const render = () => {

    const resultHTML =
    `
       <div>
         <h2 class="game-name">${gameData.name}</h2>
         <span>${gameData.rating}</span>
         <span class="rating-display" data-rating="${gameData.rating}"></span>
         <span class="tags">${gameData.tags[0].name}</span>
         <span class="tags">${gameData.tags[1].name}</span>
       </div>`


       const imgHTML = `
    <div id="carouselExampleIndicators" class="carousel slide detail-foto-slide" style="width: 600px; height: 100px;">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="${gameData.background_image}" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="${gameData.background_image_additional}" class="d-block w-100" alt="...">
          </div>
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
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1">
            <img src="${gameData.background_image}" class="d-block w-100" alt="...">
          </button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2">
                <img src="${gameData.background_image_additional}" class="d-block w-100" alt="...">
            </button>
          </div>
       `


       document.getElementById("game-title").innerHTML = resultHTML
       document.getElementById("game-img").innerHTML = imgHTML
       generateStars();

       //

    displayGameDetails(gameData);
    displayGenres(gameData.genres);
};

// 게임 세부 정보를 HTML에 표시하는 함수
const displayGameDetails = (game) => {
    const gameInformation = document.getElementById("game-information");

    gameInformation.innerHTML = `
        <h3 class="information-title">${game.name}</h3>
        <ul class="information-list">
            <li><strong>Description&nbsp;:</strong> ${game.description_raw || "No description available."}</li>
            <li><strong>Platforms&nbsp;:</strong>&nbsp;&nbsp;${game.platforms ? game.platforms.map(platform => platform.platform.name).join(", ") : "Information not available"}</li>
            <li><strong>Game Series&nbsp;:</strong>&nbsp;&nbsp;${game.game_series_count || "None"}</li>
            <li><strong>Release Date&nbsp;:</strong>&nbsp;&nbsp;${game.released || "TBD"}</li>
            <li><strong>Metacritic Score&nbsp;:</strong>&nbsp;&nbsp;${game.metacritic || "Information not available"}</li>
        </ul>
    `;
};

// 장르 정보를 HTML에 표시하는 함수
const displayGenres = (genres) => {
    const genreList = document.querySelector(".genre-list");
    genreList.innerHTML = "";

    genres.forEach(genre => {
        const genreItem = document.createElement("li");
        genreItem.classList.add("genre-item");
        

        const genreLink = document.createElement("a");
        genreLink.href = "#";
        genreLink.textContent = genre.name;

        genreItem.appendChild(genreLink);
        genreList.appendChild(genreItem);

    });
};

fetchGameDetails(gameId);