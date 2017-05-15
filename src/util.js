module.exports.before = (el, html) => {
  el.insertAdjacentHTML('beforebegin', html);
}

module.exports.removeElement = (el) => {
  if(el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

module.exports.offset = (el) => {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  }
}

module.exports.parseHTML = (string) => {
  const tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = string;
  return tmp.body.children[0];
}

module.exports.hasClass = (el, className) => {
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
}

function deepExtend(out){

  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];
    if (!obj) {
      continue;
    }

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object')
          out[key] = deepExtend(out[key], obj[key]);
        else
          out[key] = obj[key];
      }
    }
  }

  return out;
};

module.exports.extend = deepExtend;
