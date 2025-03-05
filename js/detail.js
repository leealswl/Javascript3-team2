const API_KEY = "537786cf19164215ba386fb47bd70c9c"; // API 키
const gameId = '4291'; // 게임 ID

let gameData = [];

// 게임의 세부 정보와 장르를 받아오는 함수
const fetchGameDetails = async (gameId) => {
    try {
        // 게임 정보 API 호출
        const gameResponse = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
        gameData = await gameResponse.json();

        // 데이터를 받아온 후 화면을 다시 렌더링
        render();
    } catch (error) {
        console.error("게임 정보와 장르를 가져오는 중 오류 발생:", error);
    }
};

// 게임 세부 정보를 HTML에 표시하는 함수 (render 함수 내에서 호출)
const render = () => {
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

