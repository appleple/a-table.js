import { describe, it, expect, vi } from 'vitest';
import {
  before, removeElement, offset, parseHTML, hasClass,
  replaceSelectionWithHtml, triggerEvent, removeIndentNewline
} from '../src/util.js';

describe('before', () => {
  it('指定要素の直前に html を挿入する', () => {
    document.body.innerHTML = '<div id="target"></div>';
    const target = document.getElementById('target');
    before(target, '<span id="inserted"></span>');
    expect(document.body.innerHTML).toBe('<span id="inserted"></span><div id="target"></div>');
  });
});

describe('removeElement', () => {
  it('親要素から要素を取り除く', () => {
    document.body.innerHTML = '<div id="target"></div>';
    const target = document.getElementById('target');
    removeElement(target);
    expect(document.getElementById('target')).toBeNull();
  });

  it('要素が null の場合は何もしない', () => {
    expect(() => removeElement(null)).not.toThrow();
  });

  it('親を持たない要素の場合は何もしない', () => {
    const orphan = document.createElement('div');
    expect(() => removeElement(orphan)).not.toThrow();
  });
});

describe('offset', () => {
  it('getBoundingClientRect と body のスクロール位置から top/left を算出する', () => {
    document.body.innerHTML = '<div id="target"></div>';
    const target = document.getElementById('target');
    target.getBoundingClientRect = () => ({ top: 10, left: 20 });
    expect(offset(target)).toEqual({ top: 10, left: 20 });
  });
});

describe('parseHTML', () => {
  it('html 文字列をパースして最初の要素を返す', () => {
    const el = parseHTML('<table class="a"><tr><td>x</td></tr></table>');
    expect(el.tagName).toBe('TABLE');
    expect(el.getAttribute('class')).toBe('a');
  });
});

describe('hasClass', () => {
  it('classList が使える場合はそれで判定する', () => {
    document.body.innerHTML = '<div id="target" class="foo bar"></div>';
    const target = document.getElementById('target');
    expect(hasClass(target, 'foo')).toBe(true);
    expect(hasClass(target, 'baz')).toBe(false);
  });

  it('classList が使えない場合は className を正規表現で判定する (フォールバック)', () => {
    const target = { classList: null, className: 'foo bar' };
    expect(hasClass(target, 'foo')).toBe(true);
    expect(hasClass(target, 'baz')).toBe(false);
  });
});

describe('replaceSelectionWithHtml', () => {
  it('現在の選択範囲を html で置き換える', () => {
    document.body.innerHTML = '<div id="editable" contenteditable>hello</div>';
    const editable = document.getElementById('editable');
    const range = document.createRange();
    range.selectNodeContents(editable);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    replaceSelectionWithHtml('<b>world</b>');
    expect(editable.innerHTML).toBe('<b>world</b>');
  });

  it('どちらの API も使えない環境では何もしない', () => {
    const original = window.getSelection;
    window.getSelection = undefined;
    try {
      expect(() => replaceSelectionWithHtml('<b>world</b>')).not.toThrow();
    } finally {
      window.getSelection = original;
    }
  });

  it('window.getSelection が使えない環境では document.selection を使う (フォールバック)', () => {
    const pasteHTML = vi.fn();
    const original = window.getSelection;
    window.getSelection = undefined;
    document.selection = { createRange: () => ({ pasteHTML }) };
    try {
      replaceSelectionWithHtml('<b>world</b>');
      expect(pasteHTML).toHaveBeenCalledWith('<b>world</b>');
    } finally {
      window.getSelection = original;
      delete document.selection;
    }
  });
});

describe('triggerEvent', () => {
  it('window.CustomEvent が使える場合はそれで発火する', () => {
    document.body.innerHTML = '<div id="target"></div>';
    const target = document.getElementById('target');
    const calls = [];
    target.addEventListener('custom', e => calls.push(e.type));
    triggerEvent(target, 'custom');
    expect(calls).toEqual(['custom']);
  });

  it('window.CustomEvent が使えない環境では document.createEvent を使う (フォールバック)', () => {
    document.body.innerHTML = '<div id="target"></div>';
    const target = document.getElementById('target');
    const calls = [];
    target.addEventListener('custom', e => calls.push(e.type));
    const original = window.CustomEvent;
    window.CustomEvent = undefined;
    try {
      triggerEvent(target, 'custom', { foo: 'bar' });
      expect(calls).toEqual(['custom']);
    } finally {
      window.CustomEvent = original;
    }
  });
});

describe('removeIndentNewline', () => {
  it('改行とタブ文字を取り除く', () => {
    expect(removeIndentNewline('a\n\tb\nc')).toBe('abc');
  });
});
