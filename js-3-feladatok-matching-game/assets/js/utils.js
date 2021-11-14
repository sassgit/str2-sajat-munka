'use strict';

const pad00 = (n) => n.toString().padStart(2, '0');

const getImageUrl = (idx) => `assets/cardimages/image0${pad00(idx + 1)}.png`;

const randomSort = (length) => [...Array(length)].map((e, i) => [i, Math.random()]).sort((a, b) => a[1] - b[1]).map(e => e[0]);

export {
  pad00,
  getImageUrl,
  randomSort
};