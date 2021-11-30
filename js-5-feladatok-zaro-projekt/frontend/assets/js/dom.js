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

const validateInputVisual = input => !validate(input.value, input.dataset.dataKey) ? input.classList.add(classNames.invalidInputCN) : input.classList.remove(classNames.invalidInputCN);

const addInputValidator = input =>
  input.addEventListener(eventNames.input, () => validateInputVisual(input));


const addEnterEscapeHandler = (input, button_enter, button_escape) =>
  input.addEventListener(eventNames.keyup, event =>
    (event.code === keyCodes.enter || event.code === keyCodes.numpadEnter ) ? button_enter.click() :
    event.code === keyCodes.esc ? button_escape.click() :
    0);

const user2DOM = user => {
  const row = createDOMTree(userTree)[0];
  const elements = flatDOM(row);
  elements[userTreeIdx.id].textContent = row.dataset.id = user.id;
  userTreeIdx.dataIndices.forEach((idx, i) => {
    const key = userTreeIdx.dataKeys[i];
    elements[idx].textContent = user[key];
    elements[idx].dataset.dataKey = key;
  });
  const editButton = elements[userTreeIdx.edit];
  const delButton = elements[userTreeIdx.delete];
  editButton.textContent = translateStrings.edit;
  editButton.addEventListener(eventNames.click, ev => editOrSave(row, elements[userTreeIdx.focusIdx]));
  delButton.textContent = translateStrings.delete;
  delButton.addEventListener(eventNames.click, ev => deleteOrUndo(row));
  row.addEventListener(eventNames.dblclick, ev => (editRow ? 0 : editOrSave(row, ev.target)));
  return row;
};

const initDOM = () => {
  const newUserButton = document.querySelector(selectors.newUserButton);
  const newUserForm = document.querySelector(selectors.newUserForm);
  const newUserFormInputs = Array.from(document.querySelectorAll(selectors.newUserInput));
  const newUserAddButton = document.querySelector(selectors.newUserAdd)
  const newUserCancelButton = document.querySelector(selectors.newUserCancel)
  const showNewUserForm = () => {
    newUserFormInputs.forEach(input => (input.value = '', input.classList.remove(classNames.invalidInputCN)));
    newUserButton.classList.add(classNames.hideCN);
    newUserForm.classList.remove(classNames.hideCN);
  }
  const hideNewUserForm = () => {
    newUserFormInputs.forEach(input => input.value = '');
    newUserButton.classList.remove(classNames.hideCN);
    newUserForm.classList.add(classNames.hideCN);
  }
  newUserForm.addEventListener(eventNames.submit, ev => ev.preventDefault());
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
      newUserFormInputs.forEach(e => validateInputVisual(e));
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

const convertEditMode = (row, focusTd) => {
  row.classList.add(classNames.editRowCN);
  const elements = flatDOM(row);
  userTreeIdx.dataIndices.forEach(e => {
    const element = elements[e];
    const value = element.textContent;
    const input = createInputElement(row, element.dataset.dataKey, value);
    element.dataset.value = value;
    element.textContent = '';
    element.prepend(input);
    if (element == focusTd)
      input.focus();
  });
  elements[userTreeIdx.edit].textContent = translateStrings.save;
  elements[userTreeIdx.delete].textContent = translateStrings.undo;
  editRow = row;
  row.dataset.edit = true;
}

const convertShowMode = (row, update = false) => {
  row.classList.remove(classNames.editRowCN);
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
    }).then(Message.info(translateStrings.succssUpdate));
    return true;
  } else {
    Message.error(translateStrings.validateError);
    return false;
  }
}

function editOrSave(row, focusTd) {
  if (row.dataset.edit) {
    if (tryUpdate(row))
      convertShowMode(row, true);
  } else {
    if (editRow) {
      Message.error(translateStrings.doubleEditedError);
      editRow.scrollIntoView();
    } else {
      convertEditMode(row, focusTd);
    }
  }
}

function deleteOrUndo(row) {
  if (row.dataset.edit) {
    convertShowMode(row);
  } else {
    if (editRow) {
      Message.error(translateStrings.doubleEditedError);
    } else {
      const id = row.dataset.id;
      row.remove();
      Delete(id);
    }
  }
}

export {
  refreshAll,
  initDOM,
};