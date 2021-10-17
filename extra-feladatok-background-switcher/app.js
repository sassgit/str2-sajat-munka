Array.from(document.querySelectorAll(".button")).forEach(x => x.onclick = e => {
    document.body.style.background = window.getComputedStyle(e.target).backgroundColor
});