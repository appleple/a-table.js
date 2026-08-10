export const before = (el, html) => {
  el.insertAdjacentHTML('beforebegin', html);
};

export const removeElement = (el) => {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
};

export const offset = (el) => {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  };
};

export const parseHTML = (string) => {
  const tmp = document.implementation.createHTMLDocument('');
  tmp.body.innerHTML = string;
  return tmp.body.children[0];
};

export const hasClass = (el, className) => {
  if (el.classList) {
    return el.classList.contains(className);
  }
  return new RegExp(`(^| )${className}( |$)`, 'gi').test(el.className);
};

export const replaceSelectionWithHtml = (html) => {
  let range;
  if (window.getSelection && window.getSelection().getRangeAt) {
    range = window.getSelection().getRangeAt(0);
    range.deleteContents();
    const div = document.createElement('div');
    div.innerHTML = html;
    const frag = document.createDocumentFragment();
    let child;
    while ((child = div.firstChild)) {
      frag.appendChild(child);
    }
    range.insertNode(frag);
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    range.pasteHTML(html);
  }
};

export const triggerEvent = (el, eventName, options) => {
  let event;
  if (window.CustomEvent) {
    event = new CustomEvent(eventName, { cancelable: true });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, false, false, options);
  }
  el.dispatchEvent(event);
};

export const removeIndentNewline = str => str.replace(/(\n|\t)/g, '');

// deep-extend 相当のシンプルな再帰マージ。deep-extend 自体は Buffer の
// クローンに対応するため `instanceof Buffer` を参照しており、Buffer が
// 存在しないブラウザではその式自体が ReferenceError になる。
// aTable のデフォルト設定マージは Buffer を含まないプレーンオブジェクトのみ
// なので、その分岐を持たない最小実装で十分。
export const extend = (out, ...sources) => {
  const target = out || {};
  sources.forEach((obj) => {
    if (!obj) {
      return;
    }
    Object.keys(obj).forEach((key) => {
      target[key] = typeof obj[key] === 'object' && obj[key] !== null
        ? extend(target[key], obj[key])
        : obj[key];
    });
  });
  return target;
};
