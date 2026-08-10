import { describe, it, expect, afterEach } from 'vitest';
import aTable from '../src/index.js';

function setupTable(html) {
  document.body.innerHTML = `<table class="table">${html}</table>`;
  return document.querySelector('.table');
}

describe('constructor', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('セレクタ文字列から構築できる', () => {
    setupTable('<tr><td>A</td><td>B</td></tr>');
    const t = new aTable('.table');
    expect(t).toBeInstanceOf(aTable);
    expect(t.data.row).toHaveLength(1);
    expect(t.data.row[0].col).toHaveLength(2);
    expect(t.data.row[0].col[0].value).toBe('A');
    expect(t.data.row[0].col[1].value).toBe('B');
  });

  it('DOM要素から構築できる', () => {
    const el = setupTable('<tr><td>A</td></tr>');
    const t = new aTable(el);
    expect(t.data.row[0].col[0].value).toBe('A');
  });

  it('元のテーブルの class を保持する', () => {
    setupTable('<tr><td>A</td></tr>');
    const t = new aTable('.table');
    expect(t.data.tableClass).toBe('table');
  });

  it('class 属性がなければ空文字になる', () => {
    document.body.innerHTML = '<table id="notable"><tr><td>A</td></tr></table>';
    const t = new aTable('#notable');
    expect(t.data.tableClass).toBe('');
  });

  it('元のテーブル要素を DOM から取り除き、コンテナに差し替える', () => {
    setupTable('<tr><td>A</td></tr>');
    new aTable('.table');
    expect(document.querySelector('table.table')).toBeNull();
    expect(document.querySelector('.a-table-container')).not.toBeNull();
  });

  it('デフォルト設定を option でオーバーライドできる', () => {
    setupTable('<tr><td>A</td></tr>');
    const t = new aTable('.table', { lang: 'ja', showBtnList: false });
    expect(t.data.lang).toBe('ja');
    expect(t.data.showBtnList).toBe(true); // showBtnList は constructor 内で常に true に上書きされる
  });

  it('履歴の初期状態に現在の行データのスナップショットが積まれる', () => {
    setupTable('<tr><td>A</td></tr>');
    const t = new aTable('.table');
    expect(t.data.history).toHaveLength(1);
    expect(t.data.history[0][0].col[0].value).toBe('A');
  });
});

describe('destroy', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('編集結果を元の table 要素に書き戻して DOM に復帰させる', () => {
    // 初期状態の data.tableResult は data.tableClass 確定前に作られるため
    // class は未反映になる (constructor 実装のそのままの振る舞い)。
    setupTable('<tr><td>A</td><td>B</td></tr>');
    const t = new aTable('.table');
    t.destroy();
    const restored = document.querySelector('table');
    expect(restored).not.toBeNull();
    expect(restored.innerHTML).toContain('<td>A</td>');
    expect(restored.innerHTML).toContain('<td>B</td>');
    expect(document.querySelector('.a-table-container')).toBeNull();
  });

  it('編集後の table class を復元する', () => {
    setupTable('<tr><td>A</td></tr>');
    const t = new aTable('.table');
    t.data.tableClass = 'edited';
    t.data.tableResult = t.getTable();
    t.destroy();
    const restored = document.querySelector('table');
    expect(restored.getAttribute('class')).toBe('edited');
  });

  it('編集後 class が空になっていれば class 属性を除去する', () => {
    setupTable('<tr><td>A</td></tr>');
    const t = new aTable('.table');
    t.data.tableClass = '';
    t.data.tableResult = t.getTable();
    t.destroy();
    const restored = document.querySelector('table');
    expect(restored.hasAttribute('class')).toBe(false);
  });

  it('history をクリアし、二重に destroy しても例外を投げない', () => {
    setupTable('<tr><td>A</td></tr>');
    const t = new aTable('.table');
    t.destroy();
    expect(t.data.history).toEqual([]);
    expect(() => t.destroy()).not.toThrow();
  });

  it('super.destroy() 経由で this.e を手放す (a-template 0.8 の後片付けに委譲)', () => {
    setupTable('<tr><td>A</td></tr>');
    const t = new aTable('.table');
    t.e = { type: 'click' };
    t.destroy();
    expect(t.e).toBeNull();
  });

  it('a-template から継承した [Symbol.dispose] 経由でも同じ後片付けが走る (using 宣言対応)', () => {
    setupTable('<tr><td>A</td><td>B</td></tr>');
    const t = new aTable('.table');
    expect(document.querySelector('.a-table-container')).not.toBeNull();
    t[Symbol.dispose]();
    expect(document.querySelector('.a-table-container')).toBeNull();
    expect(document.querySelector('table')).not.toBeNull();
  });
});
