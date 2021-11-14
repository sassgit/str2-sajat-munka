'use strict';

const gameDiv = document.querySelector("#game");
const timeElement = document.querySelector('h2');
const className  = {
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
};

const defValues = {
  flipBackTimeout: 3000,
  endGameTimeout: 5000,
  endGameAnimationStart: 500,
  cardCount: 10,
  imageCount: 53,
}

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

Object.freeze(className);
Object.freeze(cardTree);
Object.freeze(defStrings);

export { gameDiv, timeElement, cardTree, className, defStrings, defValues };