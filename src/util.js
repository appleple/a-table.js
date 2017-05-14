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