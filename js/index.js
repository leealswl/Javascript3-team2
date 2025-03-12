const API_KEY1 = `537786cf19164215ba386fb47bd70c9c`;
let gameList = [];

const indexApi = async () => {
  try {
    let url = new URL(`https://api.rawg.io/api/games?key=${API_KEY1}`);
    let response = await fetch(url);
    let data = await response.json();
    gameList = data.results;
    console.log("ggg", gameList);
    render();
    initCarousel();
  } catch (error) {
    console.error(error);
  }
};
document.getElementById("loginBtn").addEventListener("click", function () {
  window.location.href = "login.html";
});
document.getElementById("loginBtn").addEventListener("click", function () {
  window.location.href = "login.html";
});

let loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  loginBtn.classList.toggle("clicked");
});

const popularApi = async (limit) => {
  try {
    document.getElementById("image-container").innerText = "로딩 중...";
    let url = new URL(
      `https://api.rawg.io/api/developers?limit=${limit}&key=${API_KEY1}`
    );
    let response = await fetch(url);
    let data = await response.json();
    popularList = data.results.slice(1, 5);
    console.log("여기기", popularList);
    document.getElementById("image-container").innerText = "";
    popularRender();
  } catch (error) {
    console.error(error);
  }
};
const popularApi2 = async (limit) => {
  try {
    document.getElementById("image2-container").innerText = "로딩 중...";
    let url = new URL(
      `https://api.rawg.io/api/developers?limit=${limit}&key=${API_KEY1}`
    );
    let response = await fetch(url);
    let data = await response.json();

    popularList2 = data.results.slice(5, 16);

    console.log("여기2", popularList2);
    document.getElementById("image2-container").innerText = "";
    popularRender2();
  } catch (error) {
    console.error(error);
  }
};

const initCarousel = () => {
  const carouselItems = document.querySelectorAll(".carousel-item");
  let currentIndex = 0;

  setInterval(() => {
    carouselItems[currentIndex].classList.remove("active");

    currentIndex = (currentIndex + 1) % carouselItems.length;

    carouselItems[currentIndex].classList.add("active");
  }, 3000);
};

const render = () => {
  let carouselItem = document.getElementById("carousel-inner");

  let bannerGameList = gameList
    .map((game) => {
      return `<div class="carousel-item">
            <img src="${game.background_image}" class="d-block w-500" alt="..."/>
            <div class="carousel-caption d-block">
                <h1>🎮</h1>
                <h1>BIG EVENT !!!!</h1>
                <h2 class="font">Noona Game 연간 멤버십 40% 할인</h2>
                <div>새로운 게임을 출시일에 가장 먼저 플레이하세요. 이에 더해 콘솔, PC, 클라우드에서 수백 가지 고품질 게임을 즐기세요.</div>
                <p class="lineP">*기간 한정 첫 1년간 연간 구독 할인 혜택: 2025/3/31 오후 3:59 혜택 종료. 19+ 구독 가능. 신규 및 현재 유효 멤버십 없는 재구독자 대상 한정 혜택. 추가 약관 적용
                    발로란트 시즌 1은 3월 5일, Activision Blizzard 는 3월 12일, 리그 오브 레전드 시즌 3은 3월 19일 공개 예정입니다</p>
                <p>A game is an interactive entertainment where players follow set rules to achieve objectives and have fun. </p>
            </div>
        </div>`;
    })
    .join("");

  carouselItem.innerHTML += bannerGameList;
};

const popularRender = () => {
  let imageContainer = document.getElementById("image-container");

  if (!popularList || popularList.length === 0) {
    console.warn("렌더링할 데이터가 없습니다.");
    imageContainer.innerHTML = "데이터 없음";
    return;
  }
  let popularGameList = popularList
    .map((game) => {
      return `<img src="${game.image_background}" alt="콘텐츠">`;
    })
    .join("");

  imageContainer.innerHTML = popularGameList; // 기존 += 제거하여 중복 방지
};

popularApi(10).then(() => {
  console.log("popularList:", popularList);
  popularRender(); // API 호출 후 렌더링 실행
});
const popularRender2 = () => {
  let imageContainer2 = document.getElementById("image2-container");

  if (!popularList2 || popularList2.length === 0) {
    console.warn("렌더링할 데이터가 없습니다.");
    imageContainer2.innerHTML = "데이터 없음";
    return;
  }
  let popularGameList2 = popularList2
    .map((game) => {
      return `<img src="${game.image_background}" alt="콘텐츠">`;
    })
    .join("");

  imageContainer2.innerHTML = popularGameList2; // 기존 += 제거하여 중복 방지
};
popularApi2(10).then(() => {
  console.log("popularList2:", popularList2);
  popularRender2(); // API 호출 후 렌더링 실행
});

// document.addEventListener("DOMContentLoaded", function () {
//   const modeToggle = document.getElementById("modeToggle");
//   const body = document.body;

//   if (localStorage.getItem("theme") === "light") {
//     body.classList.add("light-mode");
//     modeToggle.classList.remove("btn-light");
//     modeToggle.classList.add("btn-dark");
//     modeToggle.textContent = "다크 모드";
//   }

//   modeToggle.addEventListener("click", function () {
//     body.classList.toggle("light-mode");

//     if (body.classList.contains("light-mode")) {
//       localStorage.setItem("theme", "light");
//       modeToggle.classList.remove("btn-light");
//       modeToggle.classList.add("btn-dark");
//       modeToggle.textContent = "다크 모드";
//     } else {
//       localStorage.setItem("theme", "dark");
//       modeToggle.classList.remove("btn-dark");
//       modeToggle.classList.add("btn-light");
//       modeToggle.textContent = "라이트 모드";
//     }
//   });
// });

indexApi();
popularApi(6);
popularApi2();
