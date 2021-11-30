import {
  classNames,
  defStrings,
  translateStrings,
  userTree
} from "./defs.js";

import {
  initDOM,
  refreshAll
} from './dom.js';
import {
  addTranslateObj,
  getTranslateObj,
  initLanguage,
  registerDOM,
  registerStringOjb,
  setLanguage
} from './polyglot.js';

init();

//------------------



async function init() {
  initDOM();
  initLanguage(defStrings.defaultLanguage);
  registerDOM('body', document.querySelector('body'));
  registerStringOjb('translateStrings', translateStrings);
  try {
    await Promise.all(defStrings.languageURL.map(async e => {
      const response = await axios.get(e);
      addTranslateObj(response.data);
    }));
    setLanguage('HU-hu');
  } catch (error) {
    console.log(error);
  }
  refreshAll();
}