document.addEventListener("DOMContentLoaded", function () {
    const modeToggle = document.getElementById("modeToggle");
    const body = document.body;

    
    if (localStorage.getItem("theme") === "light") {
        body.classList.add("light-mode");
        modeToggle.classList.remove("btn-light");
        modeToggle.classList.add("btn-dark");
        modeToggle.textContent = "다크 모드";
    }

    
    modeToggle.addEventListener("click", function () {
        body.classList.toggle("light-mode");

        if (body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
            modeToggle.classList.remove("btn-light");
            modeToggle.classList.add("btn-dark");
            modeToggle.textContent = "다크 모드";
        } else {
            localStorage.setItem("theme", "dark");
            modeToggle.classList.remove("btn-dark");
            modeToggle.classList.add("btn-light");
            modeToggle.textContent = "라이트 모드";
        }
    });
});

window.addEventListener('scroll', function () {
    let stickyBar = document.getElementById("stickyBar");
    let scrollTop = window.scrollY;
    let maxScroll = document.body.scrollHeight - window.innerHeight;

    if (scrollTop > 100) {
        stickyBar.classList.add("fixed");
    } else {
        stickyBar.classList.remove("fixed");
    }

    if (scrollTop >= maxScroll - 50) {
        stickyBar.classList.add("hidden");
    } else {
        stickyBar.classList.remove("hidden");
    }
});