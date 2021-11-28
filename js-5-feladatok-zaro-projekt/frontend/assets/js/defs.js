'use strict';

const classNames = {
  inputCN: 'user-input',
};

const defStrings = {
  serverURL: 'http://localhost:3000/users/',
};

const selectors = {
  userTable: '.users-tbody',
}

const userTree = {
  'tr.tr-user': {
    'td.td-user-name': '',
    'td.td-user-email': '',
    'td.td-user-address': '',
    'td.td-buttons': {
      'button.edit': '',
      'button.delete': '',
    }
  }
}

const userTreeIdx = {
  name: 1,
  email: 2,
  address: 3,
  edit: 5,
  delete: 6,
  save: 5,
  undo: 6,
}

const translateStrings = {
  edit: 'edit',
  delete: 'delete',
  save: 'save',
  undo: 'undo',
}


export {
  classNames,
  defStrings,
  selectors,
  userTree,
  translateStrings,
  userTreeIdx
};