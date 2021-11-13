'use strict';
import {
  createElementTree,
  appendChildren
} from "./objectElement.js";

const gameDiv = document.querySelector("#game");
const timeElement = document.querySelector('h2');
const cardTree = {
  '.card': {
    '.card-inner': {
      '.card-front': {
        '.image-wrapper': {
          'img.card-image': ''
        }
      },
      '.card-back': '',
    }
  }
};
const cards = [];
const cardImg = [];
const imageCount = 53;

/**
 * Maximális értéke Math.floor(imageCount / 2), vagyis 104
 */
let cardCount = 10;

let timestart = 0;
let timeHandler = 0;

const pad00 = (n) => n.toString().padStart(2, '0');

/**
 * 
 * @param {zero based index} idx
 * @returns url of idx-th image
 */

const getImageUrl = (idx) => `assets/cardimages/image0${pad00(idx + 1)}.png`;

const printTime = () => {
  const sec = Math.floor((Date.now() - timestart) / 1000);
  timeElement.textContent = `${pad00(Math.floor(sec / 60))}:${ pad00(sec % 60)}`;
};

const initTime = () => {
  timestart = Date.now();
  printTime();
  timeHandler = setInterval(printTime, 1000);

}

const cardClick = ev => {

  let card = ev.target;
  if (!card.classList.contains('card-flipped')) {
    if (!timestart) initTime();
  }

  if (card.classList.contains('card-flipped'))
  card.classList.remove('card-flipped');
  else
  card.classList.add('card-flipped');
  const checkArr = [...Array(cardCount / 2)].fill(0);
  cards.forEach((e, i) => {
    if (e.classList.contains('card-flipped'))
    checkArr[cardImg[i].alt]++;
  });
  cardImg.forEach((e, i) => {
    if (checkArr[e.alt] == 2)
      cards[i].classList.add('card-disabled');
  });
}

const createCards = (count) => {
  gameDiv.innerHTML = '';
  cards.length = 0;
  cardImg.length = 0;
  appendChildren(gameDiv, ...createElementTree(Array(count).fill(cardTree)));
  cards.push(...gameDiv.querySelectorAll('.card'));
  cardImg.push(...gameDiv.querySelectorAll('.card-image'));
  cards.forEach(e => e.addEventListener('click', cardClick));
}

const randomSort = (length) => [...Array(length)].map((e, i) => [i, Math.random()]).sort((a, b) => a[1] - b[1]).map(e => e[0]);

const initImages = () => {
  const imgRand = randomSort(imageCount);
  const cardRand = randomSort(cardCount);
  document.documentElement.style.setProperty('--back-picture', `url('../../${getImageUrl(imgRand[cardCount / 2])}'`);
  // document.documentElement.style.setProperty('--back-color', `hsla(${Math.floor(Math.random() * 360)}, 50%, 35%, .75)`);
  cardImg.forEach((e, i) => {
    const idx = Math.floor(cardRand[i] / 2);
    e.src = getImageUrl(imgRand[idx]);
    e.alt = idx;
  });
}

const init = () => {
  if (cardCount != cards.length) createCards(cardCount);
  initImages();
}

init();