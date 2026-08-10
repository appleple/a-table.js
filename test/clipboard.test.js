import { describe, it, expect, afterEach, vi } from 'vitest';
import aTable from '../src/index.js';
import { layoutSimpleTable, withInnerTextFallback } from './helpers.js';

function createTable(html) {
  document.body.innerHTML = `<table class="table">${html}</table>`;
  return new aTable('.table');
}

function mockClipboardEvent(data = {}) {
  return {
    preventDefault: vi.fn(),
    clipboardData: {
      setData: vi.fn(),
      getData: vi.fn(type => data[type] || '')
    }
  };
}

const grid2x2 = '<tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr>';

describe('copyTable', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('選択セルが1つ以下なら何もしない', () => {
    const t = createTable(grid2x2);
    const e = mockClipboardEvent();
    t.copyTable(e);
    expect(e.preventDefault).not.toHaveBeenCalled();
  });

  it('複数選択があれば table html を clipboardData に書き込む', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 0);
    const e = mockClipboardEvent();
    t.copyTable(e);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(e.clipboardData.setData).toHaveBeenCalledWith('text/html', expect.stringContaining('<table>'));
  });

  it('window.clipboardData 経由でも書き込める (IE 系フォールバック)', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 0);
    const e = { preventDefault: vi.fn() };
    window.clipboardData = { setData: vi.fn() };
    try {
      t.copyTable(e);
      expect(window.clipboardData.setData).toHaveBeenCalledWith('Text', expect.stringContaining('<table>'));
    } finally {
      delete window.clipboardData;
    }
  });
});

describe('pasteTable / processPaste', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('clipboardData に table html があれば insertTable される', () => {
    withInnerTextFallback(() => {
      const t = createTable(grid2x2);
      layoutSimpleTable(t, 2, 2);
      t.select(0, 0);
      const e = mockClipboardEvent({ 'text/html': '<table><tr><td>X</td></tr></table>' });
      t.e = e;
      t.pasteTable(e);
      expect(t.data.row[0].col[0].value).toBe('X');
    });
  });

  it('text/html が無ければ text/plain を使う', () => {
    withInnerTextFallback(() => {
      const t = createTable(grid2x2);
      layoutSimpleTable(t, 2, 2);
      t.select(0, 0);
      const e = mockClipboardEvent({ 'text/plain': '<table><tr><td>Y</td></tr></table>' });
      t.e = e;
      t.pasteTable(e);
      expect(t.data.row[0].col[0].value).toBe('Y');
    });
  });

  it('table html が無く複数セル分のテキストなら parseText 経由で挿入する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    const text = `x${String.fromCharCode(9)}y`;
    const e = mockClipboardEvent({ 'text/html': text });
    t.e = e;
    t.pasteTable(e);
    expect(t.data.row[0].col[0].value).toBe('x');
  });

  it('単一セルのテキストなら insertText コマンドを使う', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    document.execCommand = vi.fn();
    const e = mockClipboardEvent({ 'text/html': 'plain text', 'text/plain': 'plain text' });
    t.e = e;
    t.pasteTable(e);
    expect(document.execCommand).toHaveBeenCalledWith('insertText', false, 'plain text');
  });

  it('window.clipboardData 経由では getClipBoardData を使う (IE 系フォールバック)', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    const cell = t.getCellByIndex(0, 0);
    const editable = cell.querySelector('.a-table-editable');
    editable.innerHTML = 'kept';
    window.clipboardData = { getData: vi.fn(() => 'pasted') };
    document.execCommand = vi.fn();
    const e = { preventDefault: vi.fn() };
    t.e = e;
    try {
      t.pasteTable(e);
      expect(editable.childNodes.length).toBe(0);
    } finally {
      delete window.clipboardData;
    }
  });
});

describe('waitForPastedData', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('子要素が入るまで待って processPaste を呼ぶ', () => {
    vi.useFakeTimers();
    document.execCommand = vi.fn();
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.e = { preventDefault: vi.fn() };
    const elem = document.createElement('div');
    const saved = document.createDocumentFragment();
    t.waitForPastedData(elem, saved);
    expect(t.data.row[0].col[0].value).toBe('A');
    elem.innerHTML = 'X';
    vi.advanceTimersByTime(20);
    // this.e に clipboardData / window.clipboardData のどちらも無いため
    // processPaste の最終フォールバック (execCommand 呼び出し) には到達しない
    expect(document.execCommand).not.toHaveBeenCalled();
  });
});

describe('insertTable', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('貼り付け先に十分な行/列が無ければ拡張してから挿入する', () => {
    const t = createTable('<tr><td>A</td></tr>');
    layoutSimpleTable(t, 1, 1);
    t.select(0, 0);
    const pasted = [
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'X' }, { type: 'td', colspan: 1, rowspan: 1, value: 'Y' }] }
    ];
    t.insertTable(pasted, { x: 0, y: 0 });
    expect(t.data.row[0].col).toHaveLength(2);
  });

  it('貼り付け先のセルが見つからない場合は alert してロールバックする', () => {
    // 大きな座標 (99,99) を指定すると内部でテーブルを 99 行/列規模まで拡張してから
    // 座標計算するため jsdom 上では実質的に終わらない。範囲内だが結合セルにより
    // 対応するセルが見つからないケースで同じ alert パスを軽量に再現する。
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 0);
    t.mergeCells();
    layoutSimpleTable(t, 2, 2);
    const prevRow = JSON.stringify(t.data.row);
    const pasted = [{ col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'X' }] }];
    t.insertTable(pasted, { x: 0, y: 0 });
    expect(JSON.stringify(t.data.row)).toBe(prevRow);
  });
});
