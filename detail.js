const API_KEY=`4176b6ce7c8f4fbbb6e6aab8fbc37635`;
let gameList=[]
let detailInfo=[]
let recoGames=[]
let id = 3328
let menus = document.querySelectorAll(".detail-menu div")
let underLine = document.getElementById("under-line")

menus.forEach(menu => menu.addEventListener("click", (e)=>underlineIndicator(e)))

function underlineIndicator(e) {
  underLine.style.left = e.currentTarget.offsetLeft + "px";
  underLine.style.width = e.currentTarget.offsetWidth + "px";
  underLine.style.top = e.currentTarget.offsetTop + e.currentTarget.offsetHeight + "px";
}


const moreGame = async () => {
  try{
    let url = new URL (`https://api.rawg.io/api/games?key=${API_KEY}`)
    let response = await fetch(url)
    let data = await response.json()
    gameList = data.results
    console.log("게임리스트:", gameList)  
  } catch(error) {
    console.error("API 요청 실패:", error)
  }
  }

  moreGame()

const getInfo = async () => {
    try{
        let url = new URL(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
        let response = await fetch(url)
        let data = await response.json()
        detailInfo = data
        console.log("디테일데이터:", detailInfo)
        render()
    } catch(error) {
        console.error("API 요청 실패:", error)
    }
}

getInfo()

const render = () => {
    const resultHTML =
     `
        <div>
          <h2 class="game-name">${detailInfo.name}</h2>
          <div>${detailInfo.rating}</div>
        </div>`

    const imgHTML = `
        <div>
          <!--이미지 슬라이드-->
          <div id="carouselExample" class="carousel slide detail-foto-slide">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="${detailInfo.background_image}" class="d-block w-100">
              </div>
              <div class="carousel-item">
                <img src="${detailInfo.background_image_additional}" class="d-block w-100">
              </div>
            </div>
            <div class="slide-button">
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
          </div>
        </div>
        <!--이미지 슬라이드 pagination-->
        <div class="image-pagination mt-3">
            <ul class="pagination">
              <button class="pagination-button me-5">&lt;</button>
              <li class="page-item"><a class="page-link game-image" href="#"><img src="${detailInfo.background_image}" class="d-block w-100 images"></a></li>
              <li class="page-item"><a class="page-link game-image" href="#"><img src="${detailInfo.background_image_additional}" class="d-block w-100 images"></a></li>
              <button class="pagination-button ms-5">&gt;</button>
            </ul>
        </div>
        `

     document.getElementById("game-title").innerHTML = resultHTML
     document.getElementById("game-img").innerHTML = imgHTML
}


