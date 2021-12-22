'use strict';
const scrollAnimationTime = 300;

const modalPrivacy = new bootstrap.Modal(document.querySelector('#privacyModal'));
const modalTerms = new bootstrap.Modal(document.querySelector('#termsModal'));
const modalFaq = new bootstrap.Modal(document.querySelector('#faqModal'));

[modalPrivacy, modalTerms, modalFaq].forEach(modal => Array.from(modal._element.querySelectorAll('button')).forEach(button => button.addEventListener('click', ev => modal.hide())));

//window.addEventListener('hashchange', hashChange);
Array.from(document.querySelectorAll('a')).forEach(a => a.addEventListener('click', ev => aClick(a, ev)));

document.addEventListener('DOMContentLoaded', function () {
  window.onscroll = myFunction;

  var navbar = document.querySelector(".navcontainer");
  var sticky = navbar.offsetTop;

  function myFunction(ev) {
    if (window.scrollY > sticky) {
      navbar.classList.add("sticky")
    } else {
      navbar.classList.remove("sticky");
    }
  }
})

const hashFunctions = {
  'modal-privacy': () => {
    modalPrivacy.show();
  },
  'modal-terms': () => {
    modalTerms.show();
  },
  'modal-faq': () => {
    modalFaq.show();
  },
}

function aClick(a, ev) {
  const harr = a.href.split('#');
  const site = harr.shift();
  if (site == window.location.href.split('#')[0]) {
    const hash = harr.join('#');
    if (hash) {
      for (let e in hashFunctions) {
        if (e == hash) {
          hashFunctions[e]();
          ev.preventDefault();
          break;
        }
      }
      const hashSelector = `#${hash}`;
      const element = document.querySelector(hashSelector);
      if (element) {
        const maxScrollPos = (document.documentElement.scrollHeight - document.documentElement.clientHeight);
        const scrollPos = Math.min(maxScrollPos, findPos(element));
        const easeFunc = scrollPos >= maxScrollPos || Math.abs(window.scrollY - scrollPos) > document.documentElement.clientHeight ? easeInOutCubic : easeOutBack;
        //console.log(scrollPos);
        scrollTo(scrollPos, scrollAnimationTime, easeFunc, () => window.location.hash = hashSelector);
        ev.preventDefault();
      }
    }
  }
  //console.log(window.location.hash);
}

function findPos(obj) {
  var curtop = 0;
  if (obj.offsetParent) {
    do {
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return curtop;
  }
}

function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2);
}

function easeLinear(x) {
  return x;
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOutBack(x) {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return x < 0.5 ?
    (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 :
    (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

let currentScrollAnimation = null;

function scrollTo(ypos, duration, easeFunc, endfunc) {
  const startTime = Date.now();
  const endTime = startTime + duration;
  const startPos = window.scrollY;
  const delta = ypos - startPos;
  const aFunc = () => {
    if (currentScrollAnimation === aFunc) {
      const time = Date.now();
      if (time >= endTime) {
        window.scroll(0, ypos);
        if (endfunc)
          endfunc();
      } else {
        requestAnimationFrame(aFunc);
        window.scroll(0, startPos + delta * easeFunc((time - startTime) / duration));
      }
    }
  }
  requestAnimationFrame(currentScrollAnimation = aFunc);
}