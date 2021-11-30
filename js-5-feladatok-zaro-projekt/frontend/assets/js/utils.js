const convertName = name => {
  if (!name)
    return name;
  let array = name.split(' ');
  if (array.length < 2)
    return name;
  let lastName = array.pop();
  return [lastName, ...array].join(' ');
}

const nameCompare = (name1, name2) => {
  return name1 ? convertName(name1).localeCompare(convertName(name2)) : name2 ? -1 : 0;
}

const downloadJSON = (obj, name)  => {
  let a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([JSON.stringify(obj)], {
      type: "text/plain"
    }));
    a.download = name;
    a.click();
}

export { nameCompare, downloadJSON };
