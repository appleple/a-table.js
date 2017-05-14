'use strict';

module.exports.before = function (el, html) {
  el.insertAdjacentHTML('beforebegin', html);
};

module.exports.removeElement = function (el) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
};

module.exports.offset = function (el) {
  var rect = el.getBoundingClientRect();
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  };
};