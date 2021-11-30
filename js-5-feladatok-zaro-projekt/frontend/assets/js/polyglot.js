import { classNames, tagNames } from "./defs.js";

const registeredObjects = [];

const translateObjects = [];

const createTranslateObj = (language) => {
  return {
    language,
    data: {},
  }
}

const getElementString = element => Array.from(element.classList).reduce((prev, e) => prev += '.' + e, element.tagName.toLowerCase()) + (element.id && '#' + element.id);

const walkElementTree = (element, parentStr, callBack, skipCallBack) => {
  const idString = (parentStr ? parentStr + ' ' : '') + getElementString(element);
  Array.from(element.childNodes).forEach((e, i) => {
    if (e.nodeType == 3) {
      callBack(`${idString} ${i}:`, e, i);
    } else if (e.nodeType == 1 && (!skipCallBack || !skipCallBack(e, i))) {
      walkElementTree(e, `${idString} ${i}:`, callBack);
    }
  });
}

const elementsStartString = elementIndex => elementIndex + ':';

const getText = (element, startStr, array = [], filterCallBack, skipCallBack) => {
  walkElementTree(element, startStr, (str, textNode) => !filterCallBack || filterCallBack(textNode) ? array.push([str, textNode.textContent]) : 0, skipCallBack);
  return array;
}

const getTextElements = (filterCallBack, skipCallBack, ...elements) => {
  const array = [];
  elements.forEach((element, i) => getText(element, elementsStartString(i), array, filterCallBack, skipCallBack));
  return array;
}

const setText = (element, startStr, array, startindex = 0) => {
  let i = startindex;
  walkElementTree(element, startStr, (str, textNode) => i < array.length && str == array[i][0] ? textNode.textContent = array[i++][1] : 0);
  return i;
}

const setTextElements = (array, ...elements) => {
  let startidx = 0;
  elements.forEach((e, i) => startidx = setText(e, elementsStartString(i), array, startidx));
  return startidx;
}

let filterFunc = textNode => /\w/.test(textNode.textContent);
let skipFunc = element => element.tagName.toLowerCase() == tagNames.script || element.classList.contains(classNames.notranslateCN);

const createDOMregisterObj = (...elements) => {
  return getTextElements(filterFunc, skipFunc, ...elements);
}


const initLanguage = (defaultLanguage) => {
  translateObjects.push(createTranslateObj(defaultLanguage));
}


const registerStringOjb = (name, obj) => {
  registeredObjects.push({
    name,
    obj,
  });
  const td = translateObjects[0].data;
  td[name] = {};
  for (let e in obj)
    td[name][e] = obj[e];
}

const registerDOM = (name, ...elements) => {
  registeredObjects.push({
    name,
    DOM: elements,
  })
  const td = translateObjects[0].data;
  td[name] = createDOMregisterObj(...elements);
}

const getTranslateObjects = () => translateObjects;


const addTranslateObjects = tobj => !tobj || !tobj.forEach || tobj.forEach(tobjElem => translateObjects.some(e => e.language == tobjElem.language) || translateObjects.push(tobjElem));

const setLanguage = language => {
  const tobj = translateObjects.find(o => o.language == language);
  if (tobj) {
    registeredObjects.forEach(ro => {
      const translate = tobj.data[ro.name];
      if (ro.obj) {
        for (let e in translate) {
          ro.obj[e] = translate[e];
        }
      } else if (ro.DOM) {
        const elements = ro.DOM;
        const array = translate;
        setTextElements(array, ...elements);
      }
    })
  }
}



export {
  initLanguage,
  registerStringOjb,
  registerDOM,
  getTranslateObjects,
  addTranslateObjects,
  setLanguage,
}