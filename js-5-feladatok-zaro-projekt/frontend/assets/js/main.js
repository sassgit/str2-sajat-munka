import {
  classNames,
  defStrings,
  userTree
} from "./defs.js";

import { Read } from './crud.js';

import {initDOM, refreshAll} from './dom.js';

init();

//------------------



async function init() {
  initDOM();
  refreshAll();
}