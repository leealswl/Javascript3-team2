const API_KEY=`9487a4535e60442eb301ed9ec7f83dfa`;
let gameList=[];

const callAPI = async() => {
    try {
        let url = new URL(`https://api.rawg.io/api/games?key=${API_KEY}`);
        let response = await fetch(url);
        let data = await response.json();
        gameList = data.results;
        render();
        console.log("게임 데이터:", gameList);
      } catch (error) {
        console.error("API 요청 실패:", error);
        document.getElementById('game-list').innerHTML = `<p>게임 데이터를 불러올 수 없습니다.</p>`;
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

const render =()=> {
    const chunks = chunkArray(gameList, 5);
    const gameHTML = chunks.map((chunk, index) => `
    <div class="carousel-item ${index === 0 ? 'active' : ''}">
      <div class="d-flex justify-content-around">
        ${chunk.map(item => `
          <div class="game-card">
            <img src="${item.background_image}" class="img-fluid game-thumbnail">
            <p class="mt-2">${item.name}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `).join("");

  document.getElementById('game-list').innerHTML = gameHTML;
};
