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

export { nameCompare };
