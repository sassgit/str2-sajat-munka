import { loadImages } from "./lib.js";

loadImages(document.querySelector("#image-gallery"), "./assets/img/gallery/index.txt", "./assets/img/gallery/", ["img-container", "gallery-image-container"], ["work-image","gallery-image"] );

