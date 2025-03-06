const API_KEY = "537786cf19164215ba386fb47bd70c9c"; // API 키
const gameId = '4291'; // 게임 ID

let gameData = []; // 게임 데이터를 저장할 변수
let gameTags = []; // 해당 게임의 태그 데이터를 저장할 변수
let publisherData = []; // 게임의 게시자 데이터를 저장할 변수
let creatorData = []; // 게임의 크리에이터 데이터를 저장할 변수

// 게임의 세부 정보와 태그를 받아오는 함수
const fetchGameDetails = async (gameId) => {
    try {
        // 게임 정보 API 호출
        const gameResponse = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
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

        // 데이터를 받아온 후 화면을 다시 렌더링
        render();
    } catch (error) {
        console.error("게임 정보와 태그를 가져오는 중 오류 발생:", error);
    }
};

// 게임 세부 정보를 HTML에 표시하는 함수
const render = () => {
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
        <h3 class="information-title">${game.name}</h3>
        <ul class="information-list">
            <li><strong>Description :</strong> <em>${game.description_raw || "No description available."}</em></li>
            <li><strong>Platforms :</strong>&nbsp;&nbsp;<em>${game.platforms ? game.platforms.map(platform => platform.platform.name).join(", ") : "Information not available"}</em></li>
            <li><strong>Game Series :</strong>&nbsp;&nbsp;<em>${game.game_series_count || "None"}</em></li>
            <li><strong>Release Date :</strong>&nbsp;&nbsp;<em>${game.released || "TBD"}</em></li>
            <li><strong>Metacritic Score :</strong>&nbsp;&nbsp;<em>${game.metacritic || "Information not available"}</em></li>
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

// 게임 태그 목록을 HTML에 표시하는 함수
const renderTags = (tags) => {
    const tagList = document.querySelector(".tag-list");
    tagList.innerHTML = "";

    tags.forEach(tag => {
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
                <li class="publisher-item"><strong>Publisher Description :</strong>&nbsp;&nbsp;<em>${publisher.description || "No description available."}</em></li>
                <li class="publisher-item"><strong>Games Published :</strong>&nbsp;&nbsp;<em>${publisher.games_count || "No games available"}</em></li>
            </ul>
        `;
    } else {
        publisherWrap.innerHTML = `<p>No publisher data available.</p>`;
    }
};

// 크리에이터 정보를 HTML에 표시하는 함수
const displayCreator = (creator) => {
    const creatorWrap = document.querySelector(".creator-wrap");

    if (creator && creator.name) {
        creatorWrap.innerHTML = `
            <ul class="creator-list">
                <li class="creator-item"><strong>Creator Description :</strong>&nbsp;&nbsp;<em>${creator.description || "No description available."}</em></li>
                <li class="creator-item"><strong>Games Created :</strong>&nbsp;&nbsp;<em>${creator.games_count || "No games available"}</em></li>
            </ul>
        `;
    } else {
        creatorWrap.innerHTML = `<p>No creator data available.</p>`;
    }
};

// 초기 데이터 요청
fetchGameDetails(gameId);
