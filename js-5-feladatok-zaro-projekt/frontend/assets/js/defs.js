'use strict';

const classNames = {
  inputCN: 'user-input',
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
  }
};

const defValues = {
  messageTime: 5000,
}

const keyCodes = {
  enter: 'Enter',
  tab: 'Tab',
  esc: 'Escape',
}

const tagNames = {
input: 'input',
button: 'button',
div: 'div',
}

const eventNames = {
  click: 'click',
  input: 'input',
  keyup: 'keyup',
}

const validatorRegex = {
  name: /^(?:[\u00c0-\u01ffa-zA-Z'-]){2,}(?:\s[\u00c0-\u01ffa-zA-Z'-]{2,})+$/i,
  emailAddress: /^\S+@\S+\.\S+$/,
  address: /^[\w]+.*$/,
};

const userTree = {
  'tr.tr-user': {
    'td.td-user-name': '',
    'td.td-user-email': '',
    'td.td-user-address': '',
    'td.td-buttons': {
      'button.button.edit': '',
      'button.button.delete': '',
    }
  }
}

const userKeys = () => Object.keys(validatorRegex);

const userTreeIdx = {
  name: 1,
  focusIdx: 1,
  email: 2,
  address: 3,
  get dataIndices() {
    return [this.name, this.email, this.address];
  },
  get dataKeys() {
    return userKeys();
  },
  edit: 5,
  delete: 6,
  save: 5,
  undo: 6,
}

const userTreeButtonIdx = {
  save: 0,
  undo: 1,
}

const validate = (value, dataKey) => validatorRegex[dataKey].test(value);

// do not freeze!
const translateStrings = {
  edit: 'edit',
  delete: 'delete',
  save: 'save',
  undo: 'undo',
  doubleEditedError: 'You must first finish the current edit',
  validateError: 'Please check the data entered!',
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