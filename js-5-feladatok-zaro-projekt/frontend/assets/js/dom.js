import {
  classNames,
  userTree,
  selectors,
  translateStrings,
  userTreeIdx,
  tagNames,
  eventNames,
  validate,
  keyCodes,
  userTreeButtonIdx,
  userKeys,
} from "./defs.js";

import {
  createDOMTree,
  appendChildren,
  flatDOM,
} from './object2DOM.js';

import {
  Read,
  Delete,
  Update,
  Create
} from './crud.js';

import {
  Message
} from './message.js';

const tbody = document.querySelector(selectors.userTable);
let editRow = null;

const addInputValidator = input =>
  input.addEventListener(eventNames.input, () => validate(input.value, input.dataset.dataKey) ? input.classList.remove(classNames.invalidInputCN) : input.classList.add(classNames.invalidInputCN));

const addEnterEscapeHandler = (input, button_enter, button_escape) =>
  input.addEventListener(eventNames.keyup, event =>
    event.code === keyCodes.enter ? button_enter.click() :
    event.code === keyCodes.esc ? button_escape.click() :
    undefined);

const user2DOM = user => {
  const tree = createDOMTree(userTree)[0];
  const elements = flatDOM(tree);
  tree.dataset.id = user.id;
  userTreeIdx.dataIndices.forEach((idx, i) => {
    const key = userTreeIdx.dataKeys[i];
    elements[idx].textContent = user[key];
    elements[idx].dataset.dataKey = key;
  });
  elements[userTreeIdx.edit].textContent = translateStrings.edit;
  elements[userTreeIdx.delete].textContent = translateStrings.delete;
  elements[userTreeIdx.delete].addEventListener(eventNames.click, deleteOrUndoClick);
  elements[userTreeIdx.edit].addEventListener(eventNames.click, editOrSaveClick);
  return tree;
};

const initDOM = () => {
  const newUserButton = document.querySelector(selectors.newUserButton);
  const newUserForm = document.querySelector(selectors.newUserForm);
  const newUserFormInputs = Array.from(document.querySelectorAll(selectors.newUserInput));
  const newUserAddButton = document.querySelector(selectors.newUserAdd)
  const newUserCancelButton = document.querySelector(selectors.newUserCancel)
  const showNewUserForm = () => {
    newUserFormInputs.forEach(input => input.value = '');
    newUserButton.classList.add(classNames.hideCN);
    newUserForm.classList.remove(classNames.hideCN);
  }
  const hideNewUserForm = () => {
    newUserFormInputs.forEach(input => input.value = '');
    newUserButton.classList.remove(classNames.hideCN);
    newUserForm.classList.add(classNames.hideCN);
  }
  newUserFormInputs.forEach((input, i) => {
    input.dataset.dataKey = userKeys()[i];
    addEnterEscapeHandler(input, newUserAddButton, newUserCancelButton);
    addInputValidator(input);
  });
  newUserButton.addEventListener(eventNames.click, showNewUserForm);
  newUserAddButton.addEventListener(eventNames.click, ev => {
    if (newUserFormInputs.every(e => validate(e.value, e.dataset.dataKey))) {
      Create({
        ...Object.fromEntries(newUserFormInputs.map(e => [e.dataset.dataKey, e.value]))
      }).then(user => tbody.prepend(user2DOM(user)));
      hideNewUserForm();
    } else {
      Message.error(translateStrings.validateError);
    }
  });
  newUserCancelButton.addEventListener(eventNames.click, hideNewUserForm);
}

const refreshAll = async () => {
  const table = document.querySelector(selectors.table);
  table.classList.add(classNames.hideCN);
  const users = await Read();
  editRow = null;
  tbody.innerHTML = '';
  appendChildren(tbody, ...Array.from(users).map(user => user2DOM(user)));
  table.classList.remove(classNames.hideCN);
}

const createInputElement = (row, dataKey, value) => {
  const input = document.createElement(tagNames.input);
  input.classList.add(classNames.inputCN);
  input.dataset.dataKey = dataKey;
  input.value = value;
  addInputValidator(input);
  const buttons = flatDOM(row).filter(e => e.classList.contains(classNames.buttonCN));
  addEnterEscapeHandler(input, buttons[userTreeButtonIdx.save], buttons[userTreeButtonIdx.undo]);
  return input;
}

const convertEditMode = row => {
  const elements = flatDOM(row);
  userTreeIdx.dataIndices.forEach(e => {
    const element = elements[e];
    const value = element.textContent;
    const input = createInputElement(row, element.dataset.dataKey, value);
    element.dataset.value = value;
    element.textContent = '';
    element.appendChild(input);
    if (e == userTreeIdx.focusIdx)
      input.focus();
  });
  elements[userTreeIdx.edit].textContent = translateStrings.save;
  elements[userTreeIdx.delete].textContent = translateStrings.undo;
  editRow = row;
  row.dataset.edit = true;
}

const convertShowMode = (row, update = false) => {
  const elements = flatDOM(row, e => !e.classList.contains(classNames.inputCN));
  userTreeIdx.dataIndices.forEach(e => {
    const element = elements[e];
    const input = element.querySelector(selectors.tableInputs);
    const value = update ? input.value : element.dataset.value;
    delete element.dataset;
    element.removeChild(input);
    element.textContent = value;
  });
  elements[userTreeIdx.save].textContent = translateStrings.edit;
  elements[userTreeIdx.undo].textContent = translateStrings.delete;
  delete row.dataset.edit;
  editRow = null;
}

const tryUpdate = row => {
  const inputs = flatDOM(row).filter(e => e.classList.contains(classNames.inputCN));
  if (inputs.every(e => validate(e.value, e.dataset.dataKey))) {
    Update({
      id: row.dataset.id,
      ...Object.fromEntries(inputs.map(e => [e.dataset.dataKey, e.value]))
    });
    return true;
  } else {
    Message.error(translateStrings.validateError);
    return false;
  }
}

function editOrSaveClick(ev) {
  const element = ev.target;
  const row = ev.target.parentElement.parentElement;
  if (row.dataset.edit) {
    if (tryUpdate(row))
      convertShowMode(row, true);
  } else {
    if (editRow) {
      Message.error(translateStrings.doubleEditedError);
      editRow.scrollIntoView();
    } else
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
  refreshAll,
  initDOM,
};