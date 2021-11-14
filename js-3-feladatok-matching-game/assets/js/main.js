'use strict';

import {
  createDOMTree,
  appendChildren
} from "./object2DOM.js";

import * as game from "./game.js";

import {
  getImageUrl,
  pad00,
  randomSort,
} from "./utils.js";

import {
  cardTreeObj,
  gameDiv,
  timeElement,
  defStrings,
  defValues,
} from "./defs.js";

const createCards = (count) => {
  gameDiv.innerHTML = '';
  game.cards.length = 0;
  game.cardImg.length = 0;
  appendChildren(gameDiv, ...createDOMTree(Array(count).fill(cardTreeObj)));
  game.cards.push(...gameDiv.querySelectorAll('.card'));
  game.cardImg.push(...gameDiv.querySelectorAll('.card-image'));
  game.cards.forEach(e => e.addEventListener('click', game.cardClick));
}

const initImages = () => {
  const imgRand = randomSort(defValues.imageCount);
  const cardRand = randomSort(defValues.cardCount);
  document.documentElement.style.setProperty(defStrings.backPictureVar, `url('../../${getImageUrl(imgRand[defValues.cardCount / 2])}'`);
  game.cardImg.forEach((e, i) => {
    const idx = Math.floor(cardRand[i] / 2);
    e.src = getImageUrl(imgRand[idx]);
    e.alt = idx;
  });
  document.documentElement.style.setProperty(defStrings.animationCardBackVar, defStrings.animationCardBackValue);
}

const init = () => {
  if (defValues.cardCount != game.cards.length) createCards(defValues.cardCount);
  timeElement.textContent = defStrings.timeElementDefaultString;
  initImages();
}

init();

export default init;