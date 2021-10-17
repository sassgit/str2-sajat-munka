var count = 24;
var maxCount = 500;
let balloonGallery = document.querySelector("#balloon-gallery")
balloonGallery.innerHTML = '<div class="balloon"></div>'.repeat(count = Math.min(Math.max(parseInt(balloonGallery.innerHTML) || count, 1), maxCount));
Array.from(document.querySelectorAll(".balloon")).forEach(x => x.onmouseover = () => {
        x.onmouseover = null;
        x.style.background = "transparent";
        x.textContent = "POP!";
        if (!--count) {
            document.querySelector("#yay-no-balloons").style.display = "inline-block";
            document.querySelector("#balloon-gallery").style.display = "none";
        }
});