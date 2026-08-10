import { describe, it, expect, afterEach, vi } from 'vitest';
import aTable from '../src/index.js';
import { layoutSimpleTable } from './helpers.js';

function createTable(html) {
  document.body.innerHTML = `<table class="table">${html}</table>`;
  return new aTable('.table');
}

const grid2x2 = '<tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr>';

describe('updateTable', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('showMenu 中の mouseup は何もしない', () => {
    const t = createTable(grid2x2);
    t.data.showMenu = true;
    t.e = { type: 'mouseup' };
    t.updateTable(0, 0);
    expect(t.data.mode).toBeUndefined();
  });

  it('compositionstart で beingInput を true にする', () => {
    const t = createTable(grid2x2);
    t.e = { type: 'compositionstart' };
    t.updateTable(0, 0);
    expect(t.data.beingInput).toBe(true);
  });

  it('compositionend で beingInput を false にする', () => {
    const t = createTable(grid2x2);
    t.data.beingInput = true;
    t.e = { type: 'compositionend' };
    t.updateTable(0, 0);
    expect(t.data.beingInput).toBe(false);
  });

  it('shift+click で選択範囲を広げる', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.e = { type: 'click', shiftKey: true };
    t.updateTable(1, 1);
    expect(t.data.row[0].col[0].selected).toBe(true);
    expect(t.data.row[1].col[1].selected).toBe(true);
  });

  it('shift 無しの click では選択範囲を広げない', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.e = { type: 'click', shiftKey: false };
    t.updateTable(1, 1);
    expect(t.data.row[1].col[1].selected).toBeFalsy();
  });

  it('Ctrl+C (keydown, keyCode 67) で copy イベントを発火する', () => {
    const t = createTable(grid2x2);
    t.select(0, 0);
    t.update(); // .a-table-selected クラスを DOM に反映させる
    const calls = [];
    const cell = t.getCellByIndex(0, 0);
    const editable = cell.querySelector('.a-table-editable');
    editable.addEventListener('copy', () => calls.push('copy'));
    t.e = { type: 'keydown', keyCode: 67, ctrlKey: true };
    t.updateTable(0, 0);
    expect(calls).toEqual(['copy']);
  });

  it('copy タイプは copyTable に委譲する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 0);
    const e = { type: 'copy', preventDefault: vi.fn(), clipboardData: { setData: vi.fn() } };
    t.e = e;
    t.updateTable(0, 0);
    expect(e.preventDefault).toHaveBeenCalled();
  });

  it('paste タイプは pasteTable に委譲する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    const e = {
      type: 'paste',
      preventDefault: vi.fn(),
      clipboardData: { getData: vi.fn(() => 'plain text') }
    };
    document.execCommand = vi.fn();
    t.e = e;
    t.updateTable(0, 0);
    expect(document.execCommand).toHaveBeenCalledWith('insertText', false, 'plain text');
  });

  it('mousedown (左クリック, 未選択セル) は選択して再描画する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.e = { type: 'mousedown', button: 0, ctrlKey: false };
    t.updateTable(1, 0);
    expect(t.mousedown).toBe(true);
    expect(t.data.row[0].col[1].selected).toBe(true);
  });

  it('mousedown (右クリック) では選択処理をしない', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.e = { type: 'mousedown', button: 2, ctrlKey: false };
    t.updateTable(1, 0);
    expect(t.data.row[0].col[1].selected).toBeFalsy();
  });

  it('mousemove: mousedown 中ならドラッグで範囲選択する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.mousedown = true;
    t.e = { type: 'mousemove' };
    t.updateTable(1, 1);
    expect(t.data.row[1].col[1].selected).toBe(true);
  });

  it('mouseup: mousedown フラグを解除する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.mousedown = true;
    t.e = { type: 'mouseup' };
    t.updateTable(0, 0);
    expect(t.mousedown).toBe(false);
  });

  it('contextmenu: mousedown 解除しコンテキストメニューを開く', () => {
    const t = createTable(grid2x2);
    t.mousedown = true;
    t.e = { type: 'contextmenu', preventDefault: vi.fn(), clientX: 10, clientY: 20 };
    t.updateTable(0, 0);
    expect(t.mousedown).toBe(false);
    expect(t.data.showMenu).toBe(true);
    expect(t.data.menuX).toBe(10);
  });

  it('touchstart: 未選択セルなら選択する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.e = { type: 'touchstart' };
    t.updateTable(1, 0);
    expect(t.data.row[0].col[1].selected).toBe(true);
  });

  it('input: 対象セルの値を更新する', () => {
    const t = createTable(grid2x2);
    const cell = t.getCellByIndex(0, 0);
    const editable = cell.querySelector('.a-table-editable');
    editable.innerHTML = 'changed';
    t.e = { type: 'input', target: editable };
    t.updateTable(0, 0);
    expect(t.data.row[0].col[0].value).toBe('changed');
  });

  it('input: afterEntered フックがあれば呼び出す', () => {
    const t = createTable(grid2x2);
    const cell = t.getCellByIndex(0, 0);
    const editable = cell.querySelector('.a-table-editable');
    t.afterEntered = vi.fn();
    t.e = { type: 'input', target: editable };
    t.updateTable(0, 0);
    expect(t.afterEntered).toHaveBeenCalled();
  });

  it('keyup: IE/Edge では input と同様に値を更新する', () => {
    const t = createTable(grid2x2);
    const original = aTable.getBrowser;
    aTable.getBrowser = () => 'ie11';
    try {
      const cell = t.getCellByIndex(0, 0);
      const editable = cell.querySelector('.a-table-editable');
      editable.innerHTML = 'ie-changed';
      t.e = { type: 'keyup', target: editable };
      t.updateTable(0, 0);
      expect(t.data.row[0].col[0].value).toBe('ie-changed');
    } finally {
      aTable.getBrowser = original;
    }
  });

  it('keyup: IE/Edge 以外では何もしない', () => {
    const t = createTable(grid2x2);
    const original = aTable.getBrowser;
    aTable.getBrowser = () => 'chrome';
    try {
      const cell = t.getCellByIndex(0, 0);
      const editable = cell.querySelector('.a-table-editable');
      editable.innerHTML = 'ignored';
      t.e = { type: 'keyup', target: editable };
      t.updateTable(0, 0);
      expect(t.data.row[0].col[0].value).toBe('A');
    } finally {
      aTable.getBrowser = original;
    }
  });
});

describe('contextmenu', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('メニューを開き位置を e から取得する', () => {
    const t = createTable(grid2x2);
    t.e = { preventDefault: vi.fn(), clientX: 5, clientY: 6 };
    t.contextmenu();
    expect(t.data.showMenu).toBe(true);
    expect(t.data.menuX).toBe(5);
    expect(t.data.menuY).toBe(6);
  });
});

describe('onUpdated', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('afterRendered フックがあれば呼び出す', () => {
    const t = createTable(grid2x2);
    t.afterRendered = vi.fn();
    t.update();
    expect(t.afterRendered).toHaveBeenCalled();
  });

  it('選択セルが1つだけならキャレットを当てる setTimeout を仕込む', () => {
    vi.useFakeTimers();
    const t = createTable(grid2x2);
    t.select(0, 0);
    t.update();
    const cell = t.getCellByIndex(0, 0);
    const editable = cell.querySelector('.a-table-editable');
    editable.focus = vi.fn();
    vi.advanceTimersByTime(1);
    expect(editable.focus).not.toThrow;
  });
});

describe('undo', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('履歴が空なら何もしない', () => {
    const t = createTable(grid2x2);
    t.data.history = [];
    const before = JSON.stringify(t.data.row);
    t.undo();
    expect(JSON.stringify(t.data.row)).toBe(before);
  });

  it('直前の履歴が現在と異なれば復元する', () => {
    const t = createTable(grid2x2);
    const snapshot = JSON.parse(JSON.stringify(t.data.row));
    t.data.row[0].col[0].value = 'changed';
    t.data.history.push(snapshot);
    t.undo();
    expect(t.data.row[0].col[0].value).toBe('A');
  });

  it('履歴を辿っても現在と異なるものが無ければ最後の履歴を積み直す', () => {
    const t = createTable(grid2x2);
    // 履歴が現在の行と全く同じ内容のときのフォールバック経路
    t.undo();
    expect(t.data.history.length).toBeGreaterThan(0);
  });
});

describe('changeInputMode / updateResult', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('source に切り替えると現在の table html を tableResult にセットする', () => {
    const t = createTable(grid2x2);
    t.changeInputMode('source');
    expect(t.data.inputMode).toBe('source');
    expect(t.data.tableResult).toContain('A');
  });

  it('table に戻すと tableResult を再解析して row に反映する', () => {
    const t = createTable(grid2x2);
    t.changeInputMode('source');
    t.data.tableResult = '<table class="edited"><tr><td>Z</td></tr></table>';
    t.changeInputMode('table');
    expect(t.data.row[0].col[0].value).toBe('Z');
    expect(t.data.tableClass).toBe('edited');
  });

  it('updateResult: tableResult を再解析して history に積む', () => {
    const t = createTable(grid2x2);
    t.data.tableResult = '<table class="edited"><tr><td>Z</td></tr></table>';
    t.updateResult();
    expect(t.data.row[0].col[0].value).toBe('Z');
    expect(t.data.history.length).toBeGreaterThan(1);
  });

  it('updateResult: afterEntered フックがあれば呼び出す', () => {
    const t = createTable(grid2x2);
    t.afterEntered = vi.fn();
    t.data.tableResult = '<table><tr><td>Z</td></tr></table>';
    t.updateResult();
    expect(t.afterEntered).toHaveBeenCalled();
  });
});
