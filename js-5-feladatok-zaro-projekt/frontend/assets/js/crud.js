import {
  defStrings
} from './defs.js';

import {
  nameCompare
} from './utils.js';

function Create(user) {

}

async function Read() {
  try {
    let response = await axios.get(`${defStrings.serverURL}`);
    return [
      ...response.data,
    ].sort((a, b) => nameCompare(a.name, b.name));
  } catch (error) {

  }
}

function Update(user) {

}

async function Delete(userID) {
  try {
    let response = await axios.delete(`${defStrings.serverURL}${userID}`);
  } catch (error) {

  }
}

export {
  Create,
  Read,
  Update,
  Delete,
};