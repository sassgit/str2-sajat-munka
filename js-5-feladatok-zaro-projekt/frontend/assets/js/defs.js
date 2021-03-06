'use strict';

const classNames = {
  trUserCN: 'tr-user',
  tdCN: 'td-any',
  tdDataCN: 'td-data',
  tdIdCN: 'td-id',
  tdNameCN: 'td-name',
  tdEmailCN: 'td-email',
  tdAddressCN: 'td-address',
  tdButtonsCN: 'td-buttons',
  editSaveButtonCN: 'edit-save-button',
  deleteUndoButtonCN: 'delete-undo-button',
  inputCN: 'user-input',
  editRowCN: 'edit-row',
  buttonCN: 'button',
  infoMessageCN: 'message-info',
  warningMessageCN: 'message-warning',
  errorMessageCN: 'message-error',
  invalidInputCN: 'invalid-input',
  userTableCN: 'users-tbody',
  tableCN: 'users-table',
  hideCN: 'hide',
  createUserButtonCN: 'create-user-button',
  createUserFormCN: 'create-user-form',
  createUserFormAddButtonCN: 'create-user-form-adduser',
  createUserFormCancelButtonCN: 'create-user-form-cancel',
  createUserFormInputCN: 'create-user-form-input',
  footerMessagesCN: 'footer-messages',
  messageCN: 'message',
  messageShowCN: 'message-show',
  notranslateCN: 'notranslate', 
};

const selectors = {
  classSelector: className => `.${className}`,
  tagClassSelector: (tagName, classname) => `${tagName}.${className}`,
  get table() {
    return this.classSelector(classNames.tableCN);
  },
  get tableInputs() {
    return this.classSelector(classNames.inputCN);
  },
  get userTable() {
    return this.classSelector(classNames.userTableCN);
  },
  get newUserButton() {
    return this.classSelector(classNames.createUserButtonCN);
  },
  get newUserForm() {
    return this.classSelector(classNames.createUserFormCN);
  },
  get newUserInput() {
    return this.classSelector(classNames.createUserFormInputCN);
  },
  get newUserAdd() {
    return this.classSelector(classNames.createUserFormAddButtonCN);
  },
  get newUserCancel() {
    return this.classSelector(classNames.createUserFormCancelButtonCN);
  },
  get footerMessages() {
    return this.classSelector(classNames.footerMessagesCN);
  },
}

const defStrings = {
  serverURL: 'http://localhost:3000/users/',
  dataURL(id) {
    return this.serverURL + (id || '');
  },
  pageLanguage: 'EN-us',
  defaultLanguage: 'HU-hu',
  languageURL: 'assets/localization/lang.json',
  localStorageLanguage: 'Language',
  hashLang: '#lang=',
  hashLangDownload: '#langObjSave',
  LangDownloadFname: 'lang.json',
  bodyTranslateName: 'body',
  translateStringsTranslateName: 'translateStrings',
};

const defValues = {
  messageTime: 5000,
}

const keyCodes = {
  enter: 'Enter',
  numpadEnter: 'NumpadEnter',
  tab: 'Tab',
  esc: 'Escape',
}

const tagNames = {
body: 'body',
html: 'html',
input: 'input',
button: 'button',
div: 'div',
tr: 'tr',
td: 'td',
script: 'script',
}

const eventNames = {
  dblclick: 'dblclick',
  click: 'click',
  input: 'input',
  keyup: 'keyup',
  submit: 'submit',
  hashchange: 'hashchange',
}

const validatorRegex = {
  name: /^(?:[\u00c0-\u01ffa-zA-Z'-]){2,}(?:\s[\u00c0-\u01ffa-zA-Z'-]{2,})+$/i,
  emailAddress: /^\S+@\S+\.\S+$/,
  address: /^[\w]+.*$/,
};

const userTree = {
  [`${tagNames.tr}.${classNames.trUserCN}`]: {
    [`${tagNames.td}.${classNames.tdCN}.${classNames.tdDataCN}.${classNames.tdIdCN}`]: {div : ''},
    [`${tagNames.td}.${classNames.tdCN}.${classNames.tdDataCN}.${classNames.tdNameCN}`]: {div : ''},
    [`${tagNames.td}.${classNames.tdCN}.${classNames.tdDataCN}.${classNames.tdEmailCN}`]: {div : ''},
    [`${tagNames.td}.${classNames.tdCN}.${classNames.tdDataCN}.${classNames.tdAddressCN}`]: {div : ''},
    [`${tagNames.td}.${classNames.tdCN}.${classNames.tdButtonsCN}`]: {
      [`${tagNames.button}.${classNames.buttonCN}.${classNames.editSaveButtonCN}`]: '',
      [`${tagNames.button}.${classNames.buttonCN}.${classNames.deleteUndoButtonCN}`]: '',
    }
  }
}

const userKeys = () => Object.keys(validatorRegex);

const userTreeIdx = {
  id: 2,
  name: 4,
  focusIdx: 4,
  email: 6,
  address: 8,
  get dataIndices() {
    return [this.name, this.email, this.address];
  },
  get dataKeys() {
    return userKeys();
  },
  edit: 10,
  delete: 11,
  save: 10,
  undo: 11,
}

const userTreeButtonIdx = {
  save: 0,
  undo: 1,
}

const validate = (value, dataKey) => validatorRegex[dataKey].test(value);

// do not freeze!
const translateStrings = {
  edit: 'Edit',
  delete: 'Delete',
  save: 'Save',
  undo: 'Undo',
  doubleEditedError: 'You must first finish the current edit!',
  validateError: 'Please check the data entered!',
  succssUpdate: 'The data successfully updated.',
  langPropertyOfHtmlTag: 'en',
}

const freezeObjects = () => {
  [classNames, defStrings, selectors, userTree, userTreeIdx, validatorRegex].forEach(e => Object.freeze(e));
}

freezeObjects();

export {
  classNames,
  selectors,
  defStrings,
  defValues,
  keyCodes,
  tagNames,
  eventNames,
  userTree,
  userKeys,
  translateStrings,
  userTreeIdx,
  userTreeButtonIdx,
  validate,
};