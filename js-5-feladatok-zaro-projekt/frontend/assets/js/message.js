import {
  classNames,
  defValues,
  eventNames,
  tagNames
} from "./defs.js";

import {
  selectors
} from "./defs.js";

const footer = document.querySelector(selectors.footerMessages);
const messages = new Set();

class MessageObject {
  constructor(msg, className) {
    this.msg = msg;
    this.className = className;
    this.messageDiv = document.createElement(tagNames.div);
    this.messageDiv.addEventListener(eventNames.click, this.messageDiv.remove);
    this.messageDiv.textContent = msg;
    this.messageDiv.classList.add(classNames.messageCN, className)
    footer.prepend(this.messageDiv);
    this.timeoutId = setTimeout(() => this.delete(), defValues.messageTime);
    window.requestAnimationFrame(() => this.messageDiv.classList.add(classNames.messageShowCN));
  }
  sameMessage(other) {
    return this.msg == other.msg && this.className == other.className;
  }
  delete() {
    messages.delete(this);
    this.messageDiv.remove();
    clearTimeout(this.timeoutId);
  }
}

const Message = {
  showMessage(msg, className) {
    const mobj = new MessageObject(msg, className);
    messages.forEach(e => !e.sameMessage(mobj) || e.delete());
    messages.add(mobj);
    return mobj.messageDiv;
  },
  info(msg) {
    return this.showMessage(msg, classNames.infoMessageCN);
  },
  warning(msg) {
    return this.showMessage(msg, classNames.warningMessageCN);
  },
  error(msg) {
    return this.showMessage(msg, classNames.errorMessageCN);
  },
  syserror(msg) {
    return this.showMessage(msg, classNames.errorMessageCN);
  },
};

export {
  Message
};