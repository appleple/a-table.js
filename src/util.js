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

module.exports.parseHTML = (markup) => {
  if (markup.toLowerCase().trim().indexOf('<!doctype') === 0) {
    const doc = document.implementation.createHTMLDocument("");
    doc.documentElement.innerHTML = markup;
    return doc;
  } else if ('content' in document.createElement('template')) {
    // Template tag exists!
    const el = document.createElement('template');
    el.innerHTML = markup;
    return el.content;
  } else {
    // Template tag doesn't exist!
    const docfrag = document.createDocumentFragment();
    const el = document.createElement('body');
    el.innerHTML = markup;
    for (i = 0; 0 < el.childNodes.length;) {
        docfrag.appendChild(el.childNodes[i]);
    }
    return docfrag;
  }
}