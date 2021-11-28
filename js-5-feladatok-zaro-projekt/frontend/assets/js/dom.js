import {
  classNames,
  defStrings,
  userTree,
  selectors,
  translateStrings,
  userTreeIdx,
} from "./defs.js";

import {
  createDOMTree,
  appendChildren,
  createElementFromString,
  createElementWithClasses,
  flatDOM,
} from './object2DOM.js';

import {
  Delete, Update
} from './crud.js';

const tbody = document.querySelector(selectors.userTable);

const user2DOM = user => {
  const tree = createDOMTree(userTree)[0];
  const elements = flatDOM(tree);
  tree.dataset.id = user.id;
  elements[userTreeIdx.name].textContent = user.name;
  elements[userTreeIdx.email].textContent = user.emailAddress;
  elements[userTreeIdx.address].textContent = user.address;
  elements[userTreeIdx.edit].textContent = translateStrings.edit;
  elements[userTreeIdx.delete].textContent = translateStrings.delete;
  elements[userTreeIdx.delete].addEventListener('click', deleteOrUndoClick);
  elements[userTreeIdx.edit].addEventListener('click', editOrSaveClick);
  return tree;
};

const showUsers = users => {
  tbody.innerHTML = '';
  appendChildren(tbody, ...Array.from(users).map(user => user2DOM(user)));
}

const createInputElement = (value) => {
  const input = document.createElement('input');
  input.classList.add(classNames.inputCN);
  input.value = value;
  return input;
}

const convertEditMode = row => {
  const elements = flatDOM(row);
  [userTreeIdx.name, userTreeIdx.email, userTreeIdx.address].forEach(e => {
    const element = elements[e];
    const value = element.textContent;
    element.dataset.value = value;
    element.textContent = '';
    element.appendChild(createInputElement(value));
  });
  row.dataset.edit = true;
}

const convertShowMode = (row, update = false) => {
  const elements = flatDOM(row).filter(e => e.nodeName != 'INPUT');
  [userTreeIdx.name, userTreeIdx.email, userTreeIdx.address].forEach(e => {
    const element = elements[e];
    const input = element.children[0];
    const value = update ? input.value : element.dataset.value;
    delete element.dataset;
    element.removeChild(input)
    element.textContent = value;
  });
  delete row.dataset.edit;
}

function editOrSaveClick(ev) {
  const element = ev.target;
  const row = ev.target.parentElement.parentElement;
  if (row.dataset.edit) {
    const id = row.dataset.id;
    convertShowMode(row, true);
  } else {
    convertEditMode(row);
  }
}

function deleteOrUndoClick(ev) {
  const element = ev.target;
  const row = ev.target.parentElement.parentElement;
  if (row.dataset.edit) {
    convertShowMode(row);
  } else {
    const id = row.dataset.id;
    row.parentElement.removeChild(row);
    Delete(id);
  }
}

export {
  showUsers
};