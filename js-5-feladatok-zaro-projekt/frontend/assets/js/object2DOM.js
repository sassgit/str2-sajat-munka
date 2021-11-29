'use strict';

const createElementWithClasses = (tag, ...classnames) => {
  const elem = document.createElement(tag);
  if (classnames.length)
    elem.classList.add(...classnames);
  return elem;
}

const createElementFromString = str => {
  if (!str)
    return null;
  else {
    const arr = str.split('.');
    return createElementWithClasses(arr.shift() || 'div', ...arr);
  }
}

const appendChildren = (element, ...children) => children.forEach(e => e ? element.appendChild(e) : 0);

const createDOMTree = (treeObj) => {
  const retElements = [];
  if (treeObj) {
    if (typeof treeObj == 'string')
      retElements.push(createElementFromString(treeObj));
    else if (typeof treeObj == 'object') {
      if (Array.isArray(treeObj))
        treeObj.forEach(e => retElements.push(...createDOMTree(e)));
      else
        for (let e in treeObj) {
          const elem = createElementFromString(e);
          const inner = treeObj[e]
          if (typeof inner != 'object' && typeof inner != 'undefined')
            elem.textContent = inner.toString();
          else
            appendChildren(elem, ...createDOMTree(treeObj[e]));
          retElements.push(elem);
        }
    }
  }
  return retElements;
}

const flatDOM = (element, predicate) =>
  !predicate || predicate(element) ? [element, ...Array.from(element.children).map(e => flatDOM(e, predicate)).filter(e => e.length > 0).flat()] : [];

export {
  createDOMTree,
  appendChildren,
  createElementFromString,
  createElementWithClasses,
  flatDOM,
};