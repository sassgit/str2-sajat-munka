import {
  classNames,
  defStrings,
  userTree
} from "./defs.js";

import { Read } from './crud.js';

import {showUsers} from './dom.js';

init();

//------------------



async function init() {
  showUsers(await Read());
}