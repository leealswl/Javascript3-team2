// 로그인 버튼 클릭 이벤트
document.querySelector(".btn-login").addEventListener("click", signIn);

// 엔터키로 로그인 처리 (비밀번호 입력 후 엔터키 눌렀을 때 로그인)
document
  .querySelector("input[type='password']")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") signIn();
  });

// 로그인 함수
function signIn() {
  const username = document.querySelector("input[type='text']").value;
  const password = document.querySelector("input[type='password']").value;

  const validUsername = "noonagame2";
  const validPassword = "1234";

  if (username !== validUsername) {
    alert("아이디가 틀렸습니다.");
    return;
  }

  if (password !== validPassword) {
    alert("비밀번호가 틀렸습니다.");
    return;
  }

  localStorage.setItem("username", validUsername);

  // 로그인 후 main.html 페이지로 이동
  window.location.href = "main.html";
}
