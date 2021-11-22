import {
  createDOMTree,
  appendChildren
} from "./object2DOM.js";

const gotHeader = document.querySelector('.aside-header h1');
const mainDiv = document.querySelector('.main');
const mainInside = mainDiv.querySelector('.main-inside');
const pictureImg = document.querySelector('.picture');
const personDiv = document.querySelector('.person');
const nameDiv = document.querySelector('.name');
const bioDiv = document.querySelector('.bio');
const houseImg = document.querySelector('.house');
const searchInput = document.querySelector('.search__input');
const searchButton = document.querySelector('.search__btn');
const gotInfoUrl = './json/got.json'
const consoleErrorEnabled = true;
const got = [];
const imgDivs = [];
const imgDOMTree = {
  '.card': {
    'img.card-image': '',
    '.card-name': ''
  },
};
const imgIdx = 0;
const nameIdx = 1;
const selectedCN = 'selected';
const hideCN = 'hidden';

const cnfString = 'Character not found';

init();

//---------------

function init() {
  loadImg();
  searchInput.addEventListener('input', searchInputChange);
  gotHeader.addEventListener('click', gotHeaderClick);
}

function gotHeaderClick() {
  mainDiv.scrollIntoView(true);
}

function selectPerson(person) {
  imgDivs.forEach((e, i) => {
    if (got[i] == person)
      e.classList.add(selectedCN)
    else
      e.classList.remove(selectedCN);
  });
}

function hide(element) {
  element.classList.add(hideCN);
}

function show(element) {
  element.classList.remove(hideCN);
}


function searchInputChange(ev) {
  const str = searchInput.value.toLowerCase();
  if (str == '') {
    selectPerson(null);
    hide(personDiv);
  } else {
    loadPerson(got.find(e => e.name.toLowerCase() == str));
  }
}

function fillImages() {
  imgDivs.push(...createDOMTree(Array(got.length).fill(imgDOMTree)))
  imgDivs.forEach((e, i) => {
    e.children[imgIdx].src = got[i].portrait;
    e.children[imgIdx].alt = got[i].name;
    e.children[nameIdx].textContent = got[i].name;
    e.addEventListener('click', ev => imgClick(ev, got[i]));
  });
  appendChildren(mainInside, ...imgDivs);
}

function imgClick(ev, person) {
  searchInput.value = person.name;
  loadPerson(person);
}

function loadPerson(person) {
  selectPerson(person);
  if (person) {
    pictureImg.src = person.picture;
    pictureImg.alt = person.name;
    nameDiv.textContent = person.name;
    bioDiv.textContent = person.bio;
    setHouse(person.house);
    show(pictureImg);
    setTimeout(() => gotHeader.scrollIntoView(true), 200);
  } else {
    hide(pictureImg);
    nameDiv.textContent = cnfString;
    bioDiv.textContent = '';
    setHouse(null);
  }
  show(personDiv);
}

function setHouse(house) {
  if (house) {
    houseImg.src = `assets/houses/${house}.png`;
    houseImg.alt = house;
    show(houseImg);
  } else {
    hide(houseImg);
  }
}


function dataWork(data) {
  got.push(...data.filter(e => !e.dead && e.picture).sort((a, b) => a.name.localeCompare(b.name)));
  fillImages();
}

function errorHandle(error) {
  if (consoleErrorEnabled)
    console.error(error);
}

function loadImg() {
  try {
    fetch(gotInfoUrl)
      .then(response => response.json())
      .then(dataWork)
      .catch(errorHandle);
  } catch (error) {
    errorHandle(error);
  }
}