import { classNames, defValues, eventNames, tagNames } from "./defs.js";

import { selectors } from "./defs.js";

const footer = document.querySelector(selectors.footerMessages);

const Message = {
  showMessage(msg, className) {
    const messageDiv = document.createElement(tagNames.div);
    messageDiv.addEventListener(eventNames.click, messageDiv.remove);
    messageDiv.classList.add(classNames.messageCN, className);
    messageDiv.textContent = msg;
    footer.prepend(messageDiv);
    setTimeout(() => {
      messageDiv.remove();
    }, defValues.messageTime);
    window.messageDiv = messageDiv;
    return messageDiv;
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