'use strict';

const className = {
  cardFlip: 'card-flip',
  cardFlipBack: 'card-flipback',
  cardMatched: 'card-matched',
  cardEndGame: 'card-endgame',
};

const defStrings = {
  timeElementDefaultString: 'Click any card to begin',
  animationCardVar: '--card-animation-back',
  animationCardFlipValue: 'animation_flip .5s forwards linear',
  animationCardBackValue: 'animation_flipBack .5s forwards linear',
  backPictureVar: '--back-picture',
  gameDivSelector: '#game',
  timeElementSelector: 'h2',
};

const gameDiv = document.querySelector(defStrings.gameDivSelector);
const timeElement = document.querySelector(defStrings.timeElementSelector);

const defValues = {
  flipBackTimeout: 3000,
  endGameTimeout: 5000,
  endGameAnimationStart: 500,
  cardCount: 10,
  imageCount: 53,
}

const cardTreeObj = {
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

Object.freeze(className);
Object.freeze(cardTreeObj);
Object.freeze(defStrings);

export {
  gameDiv,
  timeElement,
  cardTreeObj,
  className,
  defStrings,
  defValues
};