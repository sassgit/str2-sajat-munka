import {
  defStrings
} from './defs.js';

import {
  nameCompare
} from './utils.js';

import {
  Message
} from './message.js';

async function Create(user) {
  try {
    let response = await axios.post(defStrings.dataURL(), user);
    console.log(response.data);
    return response.data;
  } catch (error) {
    Message.syserror(error);
  }
}

async function Read() {
  try {
    let response = await axios.get(defStrings.dataURL());
    return [
      ...response.data,
    ].sort((a, b) => nameCompare(a.name, b.name));
  } catch (error) {
    Message.syserror(error);
  }
}

async function Update(user) {
  try {
    let response = await axios.put(defStrings.dataURL(user.id), user);
  } catch (error) {
    Message.syserror(error);
  }
}

async function Delete(userID) {
  try {
    let response = await axios.delete(defStrings.dataURL(userID));
  } catch (error) {
    Message.syserror(error);
  }
}

export {
  Create,
  Read,
  Update,
  Delete,
};