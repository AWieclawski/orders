const isUndef = (value) => {
  return typeof value == 'undefined' || value == null || value.toString().toLowerCase() === 'null' || value.toString().length === 0;
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
const rollDownCustomers = elements => {
  elements.forEach((elName) => {
    try {
      switchHideBySelector(elName)
    } catch (err) {
      console.error(`Element ${elName} error! `, err.message)
    }
  });
}

function switchHideBySelector(selector) {
  let found = findBySelector(selector);
  if (Array.isArray(found)) {
    found.forEach(el =>
      switchHiddenAttribute(el)
    );
  } else {
    switchHiddenAttribute(found)
  }
}

const switchHiddenAttribute = element => {
  element.hidden = !element.hidden;
}

function findBySelector(selector) {
  let elements = [];
  let found = document.querySelector(selector);
  if (found) {
    if (Array.isArray(found)) {
      found.forEach(ff => elements.push(ff));
    } else {
      elements.push(found);
    }
  }
  return elements;
}

function validateNumber(value) {
  console.log('validate start! ', value);
  let result = value?.toString();
  const commas = (result?.match(/,/g) || [])?.length;
  const dots = (result?.match(/\./g) || [])?.length;
  if (dots === 0 && commas === 1) {
    result = result.replace(',', '.');
  }
  if (Number.isNaN(result)) {
    console.error("Input value is not correct Number!", value);
    window.alert("Input value is not correct Number!");
    return null;
  }
  console.log('validate finish! ', result);
  return result;
}

function getNearestAncestorByTag(htmlElementNode, tagName) {
  while (htmlElementNode) {
    htmlElementNode = htmlElementNode.parentNode;
    if (htmlElementNode?.tagName?.toLowerCase() === tagName) {
      return htmlElementNode;
    }
  }
  return undefined;
}

export {isUndef, rollDownCustomers, validateNumber, getNearestAncestorByTag};
