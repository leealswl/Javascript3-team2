const imgList = [];

document.querySelectorAll(".page-item a").forEach(item => {
    const img = item.querySelector("img");
    const video = item.querySelector("video");

    if (img) {
        imgList.push(img.src+img.tagName);
    }
    if (video) {
        imgList.push(video.src+video.tagName);
    }
});

console.log(imgList);