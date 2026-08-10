import { describe, it, expect, afterEach, vi } from 'vitest';
import aTable from '../src/index.js';
import { layoutSimpleTable, mockRect } from './helpers.js';

function createTable(html) {
  document.body.innerHTML = `<table class="table">${html}</table>`;
  return new aTable('.table');
}

const grid2x2 = '<tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr>';

describe('selectRow / selectCol', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('selectRow: 指定インデックスの列全体を選択し col モードにする', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.e = { preventDefault: vi.fn(), clientX: 1, clientY: 2 };
    t.selectRow(0);
    expect(t.data.row[0].col[0].selected).toBe(true);
    expect(t.data.row[1].col[0].selected).toBe(true);
    expect(t.data.row[0].col[1].selected).toBeFalsy();
    expect(t.data.mode).toBe('col');
    expect(t.data.selectedRowNo).toBe(0);
    expect(t.data.showMenu).toBe(true);
  });

  it('selectCol: 指定インデックスの行全体を選択し row モードにする', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.e = { preventDefault: vi.fn(), clientX: 1, clientY: 2 };
    t.selectCol(1);
    expect(t.data.row[1].col[0].selected).toBe(true);
    expect(t.data.row[1].col[1].selected).toBe(true);
    expect(t.data.row[0].col[0].selected).toBeFalsy();
    expect(t.data.mode).toBe('row');
    expect(t.data.selectedColNo).toBe(1);
  });
});

describe('removeCol / removeRow (結合セルあり)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('removeCol: 削除列にかかる colspan > 1 のセルは colspan を減らすだけにする', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(0, 1); // A,B (行0) を colspan=2 の1セルに結合
    t.mergeCells();
    layoutSimpleTable(t, 2, 2);
    t.removeCol(1);
    expect(t.data.row[0].col[0].colspan).toBe(1);
    expect(t.data.row[0].col).toHaveLength(1);
  });

  it('removeRow: 削除行にかかる rowspan > 1 のセルは rowspan を減らして次の行に付け替える', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 0); // A,C (列0) を rowspan=2 の1セルに結合
    t.mergeCells();
    layoutSimpleTable(t, 2, 2);
    t.removeRow(0);
    expect(t.data.row).toHaveLength(1);
    expect(t.data.row[0].col[0].rowspan).toBe(1);
    expect(t.data.row[0].col[0].value).toBe('A');
  });
});

describe('updateTable の残りの分岐', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('mousedown: beingInput 中は選択を変更しない', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.data.beingInput = true;
    t.e = { type: 'mousedown', button: 0, ctrlKey: false };
    t.updateTable(1, 0);
    expect(t.data.row[0].col[1].selected).toBeFalsy();
  });

  it('mousedown: すでに単一選択済みのセルを再クリックしても select しない', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.e = { type: 'mousedown', button: 0, ctrlKey: false };
    t.updateTable(0, 0);
    expect(t.data.row[0].col[0].selected).toBe(true);
  });

  it('mouseup: 複数選択中はキャレットを当てる', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 0);
    t.update();
    const cell = t.getCellByIndex(0, 0);
    const editable = cell.querySelector('.a-table-editable');
    editable.focus = vi.fn();
    editable.scrollIntoView = vi.fn();
    t.e = { type: 'mouseup' };
    t.updateTable(0, 0);
    expect(editable.focus).toHaveBeenCalled();
  });

  it('touchstart: 既に単一選択済みのセルでは選択しない', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.e = { type: 'touchstart' };
    t.updateTable(0, 0);
    expect(t.data.row[0].col[0].selected).toBe(true);
  });

  it('input: 対象セルと data-cell-id が一致しない場合は値を更新しない', () => {
    const t = createTable(grid2x2);
    const cell = t.getCellByIndex(0, 0);
    const editable = cell.querySelector('.a-table-editable');
    editable.innerHTML = 'changed';
    t.e = { type: 'input', target: editable };
    // b,a を実際のセル位置とは異なる値にする
    t.updateTable(1, 1);
    expect(t.data.row[0].col[0].value).toBe('A');
  });
});

describe('copyTable: col の無い行はスキップする', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('col が無い行を含んでいても例外を投げない', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 0);
    t.data.row.push({});
    const e = { preventDefault: vi.fn(), clipboardData: { setData: vi.fn() } };
    expect(() => t.copyTable(e)).not.toThrow();
  });
});

describe('insertTable: 行の拡張と複数セルの貼り付け', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('貼り付け先の行数が足りなければ行を拡張してから座標を再計算する', () => {
    // 拡張後の新規セルは DOM 座標をモックしていないため、拡張自体が起きたことを
    // insertRow の呼び出しで検証する (最終結果はズレて alert ロールバックされうる)。
    const t = createTable('<tr><td>A</td><td>B</td></tr>');
    layoutSimpleTable(t, 2, 1);
    t.select(0, 0);
    const insertRowSpy = vi.spyOn(t, 'insertRow');
    const pasted = [
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'X' }] },
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'Y' }] }
    ];
    t.insertTable(pasted, { x: 0, y: 0 });
    expect(insertRowSpy).toHaveBeenCalled();
  });

  it('2x2 の範囲へ 2x2 のデータを貼り付けると全セルが埋まる', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    const pasted = [
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'X' }, { type: 'td', colspan: 1, rowspan: 1, value: 'Y' }] },
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'Z' }, { type: 'td', colspan: 1, rowspan: 1, value: 'W' }] }
    ];
    t.insertTable(pasted, { x: 0, y: 0 });
    expect(t.data.row[0].col.map(c => c.value)).toEqual(['X', 'Y']);
    expect(t.data.row[1].col.map(c => c.value)).toEqual(['Z', 'W']);
  });
});

describe('insertColRight / insertColLeft (結合セルあり)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('insertColRight: 挿入位置を跨ぐ colspan > 1 のセルは colspan を増やす', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(0, 1); // A,B (行0) を colspan=2 の1セルに結合
    t.mergeCells();
    layoutSimpleTable(t, 2, 2);
    t.insertColRight(0);
    expect(t.data.row[0].col[0].colspan).toBe('3');
  });

  it('insertColLeft: 挿入位置を跨ぐ colspan > 1 のセルは colspan を増やす', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(1, 0);
    t.selectRange(1, 1); // C,D (行1) を colspan=2 の1セルに結合
    t.mergeCells();
    layoutSimpleTable(t, 2, 2);
    t.insertColLeft(1);
    expect(t.data.row[1].col[0].colspan).toBe('3');
  });
});

describe('insertRowBelow / insertRowAbove の残りの分岐', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('insertRowBelow: 最終行の下に挿入する場合は単純に新規行を追加する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.insertRowBelow(1);
    expect(t.data.row).toHaveLength(3);
    expect(t.data.row[2].col.every(c => c.value === '')).toBe(true);
  });

  it('insertRowAbove: 先頭以外の行の上に挿入する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.insertRowAbove(1);
    expect(t.data.row).toHaveLength(3);
    expect(t.data.row[1].col.every(c => c.value === '')).toBe(true);
    expect(t.data.row[2].col[0].value).toBe('C');
  });
});

describe('unselect', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('選択とメニュー状態を解除して再描画する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.data.showMenu = true;
    t.data.selectedColNo = 1;
    t.data.selectedRowNo = 1;
    t.unselect();
    expect(t.data.row[0].col[0].selected).toBe(false);
    expect(t.data.showMenu).toBe(false);
    expect(t.data.selectedColNo).toBe(-1);
    expect(t.data.selectedRowNo).toBe(-1);
  });
});

describe('putCaret', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('要素が無ければ何もしない', () => {
    const t = createTable(grid2x2);
    expect(() => t.putCaret(null)).not.toThrow();
  });

  it('window.getSelection / document.createRange が無い環境では body.createTextRange を使う (フォールバック)', () => {
    const t = createTable(grid2x2);
    const cell = t.getCellByIndex(0, 0);
    const editable = cell.querySelector('.a-table-editable');
    editable.focus = vi.fn();
    const originalGetSelection = window.getSelection;
    const originalCreateRange = document.createRange;
    window.getSelection = undefined;
    document.createRange = undefined;
    const select = vi.fn();
    const collapse = vi.fn();
    const moveToElementText = vi.fn();
    document.body.createTextRange = () => ({ moveToElementText, collapse, select });
    try {
      t.putCaret(editable);
      expect(moveToElementText).toHaveBeenCalledWith(editable);
      expect(collapse).toHaveBeenCalledWith(false);
      expect(select).toHaveBeenCalled();
    } finally {
      window.getSelection = originalGetSelection;
      document.createRange = originalCreateRange;
      delete document.body.createTextRange;
    }
  });
});

describe('processPaste: window.clipboardData 経由のフォールバック', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('e.clipboardData が無く window.clipboardData がある場合はそちらを使う', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    document.body.innerHTML += ''; // no-op, keep table reference fresh
    const range = document.createRange();
    range.selectNodeContents(t.getCellByIndex(0, 0).querySelector('.a-table-editable'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    window.clipboardData = { getData: vi.fn(() => 'plain text') };
    t.e = { preventDefault: vi.fn() };
    try {
      t.processPaste('plain text');
      expect(window.clipboardData.getData).toHaveBeenCalledWith('Text');
    } finally {
      delete window.clipboardData;
    }
  });
});

describe('updateTable: keyup での afterEntered フック', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('IE/Edge の keyup でも afterEntered フックを呼び出す', () => {
    const t = createTable(grid2x2);
    const original = aTable.getBrowser;
    aTable.getBrowser = () => 'ie11';
    t.afterEntered = vi.fn();
    try {
      const cell = t.getCellByIndex(0, 0);
      const editable = cell.querySelector('.a-table-editable');
      t.e = { type: 'keyup', target: editable };
      t.updateTable(0, 0);
      expect(t.afterEntered).toHaveBeenCalled();
    } finally {
      aTable.getBrowser = original;
    }
  });
});

describe('mergeCells / splitCell: 複数列にまたがるケース', () => {
  const grid4x2 = '<tr><td>A</td><td>B</td><td>C</td><td>D</td></tr><tr><td>E</td><td>F</td><td>G</td><td>H</td></tr>';

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('分割対象が先頭列以外にあり、同じ行に複数の対象セルがある場合も正しく分割する', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid4x2);
    layoutSimpleTable(t, 4, 2);
    // C,G (3列目) を縦結合
    t.select(0, 2);
    t.selectRange(1, 2);
    t.mergeCells();
    layoutSimpleTable(t, 4, 2);
    t.select(0, 2); // 結合セルを選択
    t.splitCell();
    expect(t.data.row[0].col).toHaveLength(4);
    expect(t.data.row[1].col).toHaveLength(4);
    expect(t.data.row[0].col[2].value).toBe('C');
  });
});

describe('insertRowBelow / insertRowAbove: 挿入行にかかる rowspan > 1 のセル', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('insertRowBelow: 挿入行を跨ぐ結合セルは rowspan を増やす', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 0); // A,C (列0) を rowspan=2 の1セルに結合
    t.mergeCells();
    layoutSimpleTable(t, 2, 2);
    t.insertRowBelow(0);
    expect(t.data.row[0].col[0].rowspan).toBe('3');
  });

  it('insertRowAbove: 挿入行を跨ぐ結合セルは rowspan を増やす', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 0); // A,C (列0) を rowspan=2 の1セルに結合
    t.mergeCells();
    layoutSimpleTable(t, 2, 2);
    t.insertRowAbove(1);
    expect(t.data.row[0].col[0].rowspan).toBe('3');
  });
});

describe('insertTable: 同じ行に複数の対象セルがあり並べ替えが発生する場合', () => {
  const grid4x2 = '<tr><td>A</td><td>B</td><td>C</td><td>D</td></tr><tr><td>E</td><td>F</td><td>G</td><td>H</td></tr>';

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('bound.width が複数列に及ぶと同じ行内の並べ替え (sort) が発生する', () => {
    const t = createTable(grid4x2);
    layoutSimpleTable(t, 4, 2);
    t.select(0, 2); // C を起点に選択
    const pasted = [
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'X' }, { type: 'td', colspan: 1, rowspan: 1, value: 'Y' }] },
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'Z' }, { type: 'td', colspan: 1, rowspan: 1, value: 'W' }] }
    ];
    t.insertTable(pasted, { x: 2, y: 0 });
    expect(t.data.row[0].col.map(c => c.value)).toEqual(['A', 'B', 'X', 'Y']);
    expect(t.data.row[1].col.map(c => c.value)).toEqual(['E', 'F', 'Z', 'W']);
  });
});

describe('insertTable: 3列以上にまたがる並べ替え', () => {
  const grid5x2 = '<tr><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td></tr><tr><td>F</td><td>G</td><td>H</td><td>I</td><td>J</td></tr>';

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('同じ行に3つ以上の対象セルがあっても正しい順序で並べ替える', () => {
    const t = createTable(grid5x2);
    layoutSimpleTable(t, 5, 2);
    t.select(0, 3); // D を起点に選択
    const pasted = [
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'X' }, { type: 'td', colspan: 1, rowspan: 1, value: 'Y' }] },
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'Z' }, { type: 'td', colspan: 1, rowspan: 1, value: 'W' }] }
    ];
    t.insertTable(pasted, { x: 3, y: 0 });
    expect(t.data.row[0].col.map(c => c.value)).toEqual(['A', 'B', 'C', 'X', 'Y']);
    expect(t.data.row[1].col.map(c => c.value)).toEqual(['F', 'G', 'H', 'Z', 'W']);
  });
});

describe('insertTable: 結合セルの開始行が貼り付け範囲より上にある場合', () => {
  const grid4x3 = '<tr><td>A</td><td>B</td><td>C</td><td>D</td></tr>'
    + '<tr><td>E</td><td>F</td><td>G</td><td>H</td></tr>'
    + '<tr><td>I</td><td>J</td><td>K</td><td>L</td></tr>';

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('列0の rowspan=2 セルは開始行が貼り付け行より上のため対象から除外される', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid4x3);
    layoutSimpleTable(t, 4, 3);
    t.select(0, 0);
    t.selectRange(1, 0); // A,E (列0) を rowspan=2 の1セルに結合
    t.mergeCells();
    layoutSimpleTable(t, 4, 3);
    // 結合で E が削除された分、行1 の col 配列インデックスは1つ左にシフトしている
    // (F が idx0 になる) が論理 x 座標は変わらないため、モックを手動で補正する
    mockRect(t.getCellByIndex(0, 1), { left: 200, top: 50 }); // F -> x=1
    mockRect(t.getCellByIndex(1, 1), { left: 300, top: 50 }); // G -> x=2
    mockRect(t.getCellByIndex(2, 1), { left: 400, top: 50 }); // H -> x=3
    t.select(1, 0); // F (行1, col配列インデックス0) を選択
    const pasted = [{ col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'X' }] }];
    t.insertTable(pasted, { x: 1, y: 1 });
    expect(t.data.row[1].col[0].value).toBe('X');
    expect(t.data.row[0].col[0].rowspan).toBe(2); // 結合セルは対象から除外され不変のまま
  });
});

describe('insertTable: 貼り付け先が左端以外の列にある場合', () => {
  const grid3x2 = '<tr><td>A</td><td>B</td><td>C</td></tr><tr><td>D</td><td>E</td><td>F</td></tr>';

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('bound.width > 0 となり対象セルの探索・並べ替えが行われる', () => {
    const t = createTable(grid3x2);
    layoutSimpleTable(t, 3, 2);
    t.select(0, 1); // B を起点に選択
    const pasted = [
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'X' }, { type: 'td', colspan: 1, rowspan: 1, value: 'Y' }] },
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'Z' }, { type: 'td', colspan: 1, rowspan: 1, value: 'W' }] }
    ];
    t.insertTable(pasted, { x: 1, y: 0 });
    expect(t.data.row[0].col[0].value).toBe('A');
    expect(t.data.row[0].col[1].value).toBe('X');
    expect(t.data.row[0].col[2].value).toBe('Y');
  });
});

describe('col の無い/存在しない行に対する防御的分岐', () => {
  // update() は beforeUpdated -> changeSelectOption で無条件に item.col.forEach するため
  // col の無い行を含む状態で再描画すると例外になる。ここでは update() を経由しない
  // メソッド単体を対象に、防御的なガード分岐 (`if (!item || !item.col) return`) を検証する。
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('getAllPoints: col の無い行は無視する', () => {
    const t = createTable(grid2x2);
    t.data.row.push({});
    expect(() => t.getAllPoints()).not.toThrow();
    expect(t.getAllPoints()).toHaveLength(4);
  });

  it('getCellIndexByPos: col の無い行は無視する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.data.row.push({});
    expect(() => t.getCellIndexByPos(0, 0)).not.toThrow();
  });

  it('markup: col の無い行は無視する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.data.row.push({});
    expect(() => t.markup()).not.toThrow();
  });

  it('selectRange: data.point が無ければ何もしない', () => {
    const t = createTable(grid2x2);
    t.data.point = null;
    expect(() => t.selectRange(0, 0)).not.toThrow();
    expect(t.data.row[0].col[0].selected).toBeFalsy();
  });

  it('selectRange: col の無い行は無視する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.data.row.push({});
    expect(() => t.selectRange(0, 0)).not.toThrow();
  });

  it('select: col の無い行は無視する', () => {
    const t = createTable(grid2x2);
    t.data.row.push({});
    expect(() => t.select(0, 0)).not.toThrow();
  });

  it('unselectCells: col の無い行は無視する', () => {
    const t = createTable(grid2x2);
    t.data.row.push({});
    expect(() => t.unselectCells()).not.toThrow();
  });
});

describe('insertRowBelow / insertRowAbove: 対象セルが見つからない場合', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('insertRowBelow: getCellByPos が見つからない対象点は無視する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    vi.spyOn(t, 'getCellByPos').mockReturnValue(undefined);
    expect(() => t.insertRowBelow(0)).not.toThrow();
    vi.restoreAllMocks();
  });

  it('insertRowAbove: getCellByPos が見つからない対象点は無視する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    vi.spyOn(t, 'getCellByPos').mockReturnValue(undefined);
    expect(() => t.insertRowAbove(1)).not.toThrow();
    vi.restoreAllMocks();
  });
});

describe('splitCell: 3列以上にまたがる並べ替えと結合セルの除外', () => {
  const grid5x2 = '<tr><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td></tr>'
    + '<tr><td>F</td><td>G</td><td>H</td><td>I</td><td>J</td></tr>';

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('同じ行に3つ以上の対象セルがあっても正しい順序で分割する', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid5x2);
    layoutSimpleTable(t, 5, 2);
    t.select(0, 3); // D,I (4列目) を rowspan=2 の1セルに結合
    t.selectRange(1, 3);
    t.mergeCells();
    layoutSimpleTable(t, 5, 2);
    t.select(0, 3); // 結合セルを選択
    t.splitCell();
    // mergeCells 時点で結合前の左上セル (D) の値のみが残り、I の値は失われる仕様
    expect(t.data.row[0].col.map(c => c.value)).toEqual(['A', 'B', 'C', 'D', 'E']);
    expect(t.data.row[1].col.map(c => c.value)).toEqual(['F', 'G', 'H', '', 'J']);
  });

  it('開始行が selectedPoint より上にある結合セルは分割対象から除外される', () => {
    const grid4x3 = '<tr><td>A</td><td>B</td><td>C</td><td>D</td></tr>'
      + '<tr><td>E</td><td>F</td><td>G</td><td>H</td></tr>'
      + '<tr><td>I</td><td>J</td><td>K</td><td>L</td></tr>';
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid4x3);
    layoutSimpleTable(t, 4, 3);
    t.select(0, 0);
    t.selectRange(1, 0); // A,E (列0) を rowspan=2 の1セルに結合
    t.mergeCells();
    layoutSimpleTable(t, 4, 3);
    // 結合で col インデックスがシフトした行1 の座標を手動補正する
    // (F は idx0 になるが論理 x は 1 のまま、G は idx1/x=2、H は idx2/x=3)
    mockRect(t.getCellByIndex(0, 1), { left: 200, top: 50 }); // F -> x=1
    mockRect(t.getCellByIndex(1, 1), { left: 300, top: 50 }); // G -> x=2
    mockRect(t.getCellByIndex(2, 1), { left: 400, top: 50 }); // H -> x=3
    t.select(1, 1); // G (行1, col配列インデックス1) を選択
    t.selectRange(1, 2); // G,H を colspan=2 の1セルに結合 (selectedPoint.x=2)
    t.mergeCells();
    layoutSimpleTable(t, 4, 3);
    mockRect(t.getCellByIndex(0, 1), { left: 200, top: 50 }); // F -> x=1 (再モック)
    mockRect(t.getCellByIndex(1, 1), { left: 300, top: 50 }); // 結合セル (G,H) -> x=2 (再モック)
    t.select(1, 1); // 結合セル (G,H) を選択して分割
    t.splitCell();
    expect(t.data.row[0].col[0].rowspan).toBe(2); // A,E の結合セルは除外され不変
    expect(t.data.row[1].col.map(c => c.value)).toEqual(['F', 'G', '']);
  });
});

describe('insertTable / splitCell: 対象行の歯抜けと3要素以上の並べ替え', () => {
  const grid4x3 = '<tr><td>A</td><td>B</td><td>C</td><td>D</td></tr>'
    + '<tr><td>E</td><td>F</td><td>G</td><td>H</td></tr>'
    + '<tr><td>I</td><td>J</td><td>K</td><td>L</td></tr>';

  // getCellInfoByIndex の行1 (row index === 1) の結果だけを一時的にバウンディング
  // ボックス外へ偽装し、targets 構築時のその行をまるごと「対象セルなし」にする。
  // getAllPoints 呼び出し中だけ有効にすることで、selectRange 等の他の座標計算には
  // 影響させない。結合セルを積み重ねて再現するより遥かに単純かつ確実。
  function stubRowGap(t, rowIndex) {
    const original = t.getCellInfoByIndex.bind(t);
    const originalGetAllPoints = t.getAllPoints.bind(t);
    vi.spyOn(t, 'getAllPoints').mockImplementation(() => {
      const spy = vi.spyOn(t, 'getCellInfoByIndex').mockImplementation((x, y) => {
        if (y === rowIndex) {
          return { x: 999, y: 999, width: 1, height: 1 };
        }
        return original(x, y);
      });
      const result = originalGetAllPoints();
      spy.mockRestore();
      return result;
    });
  }

  // getAllPoints が返す、対象行内の点の並び順を x 降順に入れ替える。
  // targets は points の走査順そのままで rows[row] に積まれるため、
  // 通常の (常に列の昇順で構築される) 操作では sort の比較関数が
  // 「すでに昇順」のペアしか受け取らず、a.col > b.col の false 分岐
  // (return -1) に到達しない。並びを逆転させることでその分岐を踏ませる。
  function stubRowOrder(t, rowIndex) {
    const originalGetAllPoints = t.getAllPoints.bind(t);
    vi.spyOn(t, 'getAllPoints').mockImplementation(() => {
      const points = originalGetAllPoints();
      const before = points.filter(p => p.y < rowIndex);
      const target = points.filter(p => p.y === rowIndex).sort((a, b) => b.x - a.x);
      const after = points.filter(p => p.y > rowIndex);
      return [...before, ...target, ...after];
    });
  }

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('insertTable: 対象セルの走査順が降順でも並べ替えて正しい順序にする', () => {
    // rows[0] は並べ替えループの対象外 (for は i=1 から) なので、行1 (E,F,G) を
    // 逆転させてソート対象にする
    const t = createTable(grid4x3);
    layoutSimpleTable(t, 4, 3);
    t.select(0, 3); // D を起点に選択
    stubRowOrder(t, 1);
    const pasted = [
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'X' }] },
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'Y' }] }
    ];
    t.insertTable(pasted, { x: 3, y: 0 });
    expect(t.data.row[1].col.map(c => c.value)).toEqual(['E', 'F', 'G', 'Y']);
  });

  it('splitCell: 対象セルの走査順が降順でも並べ替えて正しい順序にする', () => {
    // rows[0] (結合セルの開始行) は並べ替えループの対象外なので、行1 (E,F,G) を
    // 逆転させてソート対象にする
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid4x3);
    layoutSimpleTable(t, 4, 3);
    t.select(0, 3);
    t.selectRange(2, 3); // D,H,L (4列目) を rowspan=3 の1セルに結合
    t.mergeCells();
    layoutSimpleTable(t, 4, 3);
    t.select(0, 3);
    stubRowOrder(t, 1);
    t.splitCell();
    expect(t.data.row[1].col.map(c => c.value)).toEqual(['E', 'F', 'G', '']);
  });

  it('insertTable: 対象範囲の中間行に対象セルが無ければ continue でスキップし、3列以上は正しく並べ替える', () => {
    const t = createTable(grid4x3);
    layoutSimpleTable(t, 4, 3);
    t.select(0, 3); // D を起点に選択
    stubRowGap(t, 1); // 行1 (E,F,G) を対象から除外する
    const pasted = [
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'X' }] },
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'Y' }] },
      { col: [{ type: 'td', colspan: 1, rowspan: 1, value: 'Z' }] }
    ];
    t.insertTable(pasted, { x: 3, y: 0 });
    expect(t.data.row[0].col.map(c => c.value)).toEqual(['A', 'B', 'C', 'X']);
    // 行1 は continue で対象から除外されるが、選択範囲としては H が削除され、
    // 後段のプレースホルダー補完によって先頭に Y が挿入される
    expect(t.data.row[1].col.map(c => c.value)).toEqual(['Y', 'E', 'F', 'G']);
    expect(t.data.row[2].col.map(c => c.value)).toEqual(['I', 'J', 'K', 'Z']);
  });

  it('splitCell: 対象範囲の中間行に対象セルが無ければ continue でスキップし、3列以上は正しく並べ替える', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid4x3);
    layoutSimpleTable(t, 4, 3);
    t.select(0, 3);
    t.selectRange(2, 3); // D,H,L (4列目) を rowspan=3 の1セルに結合
    t.mergeCells();
    layoutSimpleTable(t, 4, 3);
    t.select(0, 3); // 結合セルを選択
    stubRowGap(t, 1); // 行1 (E,F,G) を分割対象から除外する
    t.splitCell();
    expect(t.data.row[0].col.map(c => c.value)).toEqual(['A', 'B', 'C', 'D']);
    // 行1 は continue で対象から除外されるが、プレースホルダー補完で空文字が先頭に挿入される
    expect(t.data.row[1].col.map(c => c.value)).toEqual(['', 'E', 'F', 'G']);
    expect(t.data.row[2].col.map(c => c.value)).toEqual(['I', 'J', 'K', '']);
  });
});

describe('align 関連ヘルパー', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('getStyleByAlign: 既定の align ならスタイルを付与しない', () => {
    const t = createTable(grid2x2);
    expect(t.getStyleByAlign('left')).toBe('');
  });

  it('getStyleByAlign: 既定以外の align はスタイル文字列を返す', () => {
    const t = createTable(grid2x2);
    expect(t.getStyleByAlign('right')).toBe(t.data.mark.align.right);
  });

  it('getAlignByStyle: center / left / 不明な style を判定する', () => {
    const t = createTable(grid2x2);
    expect(t.getAlignByStyle(t.data.mark.align.center)).toBe('center');
    expect(t.getAlignByStyle(t.data.mark.align.left)).toBe('left');
    expect(t.getAlignByStyle('unknown')).toBeUndefined();
  });
});
