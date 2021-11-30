import {
  classNames,
  defStrings,
  eventNames,
  translateStrings,
  userTree
} from "./defs.js";

import {
  initDOM,
  refreshAll
} from './dom.js';
import {
  addTranslateObjects,
  getTranslateObjects,
  initLanguage,
  registerDOM,
  registerStringOjb,
  setLanguage
} from './polyglot.js';

import {
  downloadJSON
} from './utils.js';

init();

//------------------
async function init() {
  initDOM();
  initLanguage(defStrings.pageLanguage);
  registerDOM('body', document.querySelector('body'));
  registerStringOjb('translateStrings', translateStrings);
  try {
      const response = await axios.get(defStrings.languageURL);
      addTranslateObjects(response.data);
  } catch (error) {
    console.log(error);
  }
  const lang = getLanguageFromHash() || localStorage.getItem(defStrings.localStorageLanguage);
  if (lang) {
    setLanguage(lang);
  } else {
    setLanguage(defStrings.defaultLanguage);
  }
  document.querySelector('html').lang = translateStrings.langPropertyOfHtmlTag;
  window.addEventListener(eventNames.hashchange, hashChange);
  refreshAll();
}

function getLanguageFromHash() {
  return window.location.hash.startsWith(defStrings.hashLang) ? window.location.hash.split('=')[1] : '';
}


function hashChange(ev) {
  const hash = window.location.hash;
  if (hash.startsWith(defStrings.hashLang)) {
    const lang = getLanguageFromHash();
    localStorage.setItem(defStrings.localStorageLanguage, lang);
    refreshAll();
    window.location.reload();
  } else if (hash.startsWith(defStrings.hashLangDownload)) {
    downloadJSON(getTranslateObjects(), defStrings.LangDownloadFname);
  }
}
