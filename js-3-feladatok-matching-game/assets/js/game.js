'use strict';

import {
  timeElement,
  className,
  defValues,
} from "./defs.js";

import {
  pad00,
} from "./utils.js";
import init from "./main.js";

const cards = [];
const cardImg = [];
let endGame = false;

let timestart = 0;
let timeHandler = 0;
let flipBackTimerHander = 0;

const printTime = () => {
  const sec = Math.floor((Date.now() - timestart) / 1000);
  timeElement.textContent = `${pad00(Math.floor(sec / 60))}:${ pad00(sec % 60)}`;
};

const classRemove = (elem, ...classes) => classes.forEach(c => elem.classList.remove(c));
const isMatched = card => card.classList.contains(className.cardMatched);
const isFlipped = card => card.classList.contains(className.cardFlip) && !isMatched(card);
const flip = card => (card.classList.remove(className.cardFlipBack), card.classList.add(className.cardFlip));
const flipback = card => (card.classList.remove(className.cardFlip), card.classList.add(className.cardFlipBack));
const flipbackAllExceptOf = (noflipbackCard) => (cards.forEach(e => e != noflipbackCard && isFlipped(e) ? flipback(e) : 0), stopFlipBackTimer());
const stopFlipBackTimer = () => flipBackTimerHander ? (clearTimeout(flipBackTimerHander), flipBackTimerHander = 0, true) : false;
const startFlipBackTimer = () => (stopFlipBackTimer(), flipBackTimerHander = setTimeout(flipbackAllExceptOf, defValues.flipBackTimeout));
const initTime = () => {
  timestart = Date.now();
  printTime();
  timeHandler = setInterval(printTime, 1000);
}

const checkEndGame = () => {
  if (endGame = cards.every(e => isMatched(e))) {
    clearInterval(timeHandler);
    timestart = 0;
    setTimeout(() => {
      cards.forEach(e => {
        classRemove(e, className.cardMatched, className.cardFlip, className.cardFlipBack);
        e.classList.add(className.cardEndGame);
      });
    }, defValues.endGameAnimationStart);
    setTimeout(() => {
      cards.forEach(e => e.classList.remove(className.cardEndGame));
      init();
      endGame = false;
    }, defValues.endGameTimeout);
  }
}

const cardClick = ev => {
  const card = ev.target;
  if (!endGame && !isMatched(card)) {
    if (!timestart) initTime();
    const idx = cards.indexOf(card);
    if (isFlipped(card)) {
      flipbackAllExceptOf();
    } else {
      const imgid = cardImg[idx].alt;
      const matchedIdx = cards.findIndex((e, i) => isFlipped(e) && cardImg[i].alt == imgid);
      flip(card);
      const flipCount = cards.reduce((prev, e) => isFlipped(e) ? prev + 1 : prev, 0);
      if (flipCount > 2) flipbackAllExceptOf(card);
      else {
        if (flipCount == 2) {
          if (matchedIdx >= 0) {
            card.classList.add(className.cardMatched);
            cards[matchedIdx].classList.add(className.cardMatched);
            checkEndGame();
          } else
            startFlipBackTimer();
        } else
          stopFlipBackTimer();
      }
    }
  }
}


export {
  cards,
  cardImg,
  timestart,
  cardClick,
};