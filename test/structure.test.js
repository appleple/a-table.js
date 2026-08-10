import { describe, it, expect, afterEach, vi } from 'vitest';
import aTable from '../src/index.js';
import { layoutSimpleTable } from './helpers.js';

function createTable(html) {
  document.body.innerHTML = `<table class="table">${html}</table>`;
  return new aTable('.table');
}

const grid2x2 = '<tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr>';

describe('insertRow / insertCellAt (低レベル操作)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('insertRow: 既存インデックスなら splice で挿入する', () => {
    const t = createTable(grid2x2);
    const newRow = [{ type: 'td', colspan: 1, rowspan: 1, value: 'X' }];
    t.insertRow(1, newRow);
    expect(t.data.row[1].col).toEqual(newRow);
    expect(t.data.row).toHaveLength(3);
  });

  it('insertRow: 末尾インデックスなら push する', () => {
    const t = createTable(grid2x2);
    const newRow = [{ type: 'td', colspan: 1, rowspan: 1, value: 'X' }];
    t.insertRow(2, newRow);
    expect(t.data.row[2].col).toEqual(newRow);
  });

  it('insertCellAt: 対象行が存在すればセルを挿入する', () => {
    const t = createTable(grid2x2);
    const item = { type: 'td', colspan: 1, rowspan: 1, value: 'X' };
    t.insertCellAt(0, 1, item);
    expect(t.data.row[0].col[1]).toBe(item);
  });

  it('insertCellAt: 対象行が存在しなければ何もしない', () => {
    const t = createTable(grid2x2);
    expect(() => t.insertCellAt(99, 0, { value: 'X' })).not.toThrow();
  });
});

describe('列の挿入・削除', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('insertColRight: 指定列の右に新しい列を挿入する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.insertColRight(0);
    expect(t.data.row[0].col).toHaveLength(3);
    expect(t.data.row[0].col[1].value).toBe('');
    expect(t.data.row[1].col).toHaveLength(3);
  });

  it('insertColLeft: selectedno=0 のときは先頭に列を挿入する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.insertColLeft(0);
    expect(t.data.row[0].col).toHaveLength(3);
    expect(t.data.row[0].col[0].value).toBe('');
    expect(t.data.row[0].col[1].value).toBe('A');
  });

  it('insertColLeft: selectedno>0 のときは該当列の左に挿入する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.insertColLeft(1);
    expect(t.data.row[0].col).toHaveLength(3);
    expect(t.data.row[0].col.map(c => c.value)).toEqual(['A', '', 'B']);
  });

  it('removeCol: colspan が 1 のセルは行データから削除する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.removeCol(0);
    expect(t.data.row[0].col).toHaveLength(1);
    expect(t.data.row[0].col[0].value).toBe('B');
  });
});

describe('行の挿入・削除', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('insertRowBelow: 対象行の下に新しい行を挿入する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.insertRowBelow(0);
    expect(t.data.row).toHaveLength(3);
    expect(t.data.row[1].col.every(c => c.value === '')).toBe(true);
  });

  it('insertRowAbove: selectedno=0 のときは先頭に行を挿入する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.insertRowAbove(0);
    expect(t.data.row).toHaveLength(3);
    expect(t.data.row[0].col.every(c => c.value === '')).toBe(true);
    expect(t.data.row[1].col[0].value).toBe('A');
  });

  it('removeRow: rowspan が 1 のセルは行ごと削除する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.removeRow(0);
    expect(t.data.row).toHaveLength(1);
    expect(t.data.row[0].col[0].value).toBe('C');
  });
});

describe('mergeCells / splitCell', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('矩形でない選択では alert して何もしない', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.data.row[1].col[1].selected = true;
    t.mergeCells();
    expect(t.data.row[0].col[0].colspan).toBe(1);
  });

  it('選択が無ければ何もしない', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.mergeCells();
    expect(t.data.history).toHaveLength(1);
  });

  it('confirm がキャンセルされれば何もしない', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 1);
    t.mergeCells();
    expect(t.data.row[0].col[0].colspan).toBe(1);
  });

  it('confirm を承認すると選択範囲を 1 セルにマージする', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 1);
    t.mergeCells();
    expect(t.data.row[0].col).toHaveLength(1);
    expect(t.data.row[0].col[0].colspan).toBe(2);
    expect(t.data.row[0].col[0].rowspan).toBe(2);
  });

  it('splitCell: 選択が無ければ alert して何もしない', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.splitCell();
    expect(t.data.row[0].col).toHaveLength(2);
  });

  it('splitCell: 選択が複数あれば alert して何もしない', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 1);
    t.splitCell();
    expect(t.data.row[0].col).toHaveLength(2);
  });

  it('splitCell: colspan=rowspan=1 のセルは分割できず alert する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.splitCell();
    expect(t.data.row[0].col).toHaveLength(2);
  });

  it('mergeCells してから splitCell すると分割される', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 1);
    t.mergeCells();
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.splitCell();
    expect(t.data.row[0].col).toHaveLength(2);
    expect(t.data.row[1].col).toHaveLength(2);
  });
});

describe('セル属性の変更', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('changeCellTypeTo: 選択セルの type を変更する', () => {
    const t = createTable(grid2x2);
    t.select(0, 0);
    t.changeCellTypeTo('th');
    expect(t.data.row[0].col[0].type).toBe('th');
    expect(t.data.row[0].col[1].type).toBe('td');
  });

  it('align: 選択セルの align を変更する', () => {
    const t = createTable(grid2x2);
    t.select(0, 0);
    t.align('center');
    expect(t.data.row[0].col[0].align).toBe('center');
  });

  it('changeCellClass: 選択セルの cellClass を変更する', () => {
    const t = createTable(grid2x2);
    t.select(0, 0);
    t.data.cellClass = 'foo';
    t.changeCellClass();
    expect(t.data.row[0].col[0].cellClass).toBe('foo');
  });

  it('changeSelectOption: 選択セルの cellClass が同一なら反映する', () => {
    const t = createTable(grid2x2);
    t.data.row[0].col[0].selected = true;
    t.data.row[0].col[0].cellClass = 'foo';
    t.data.row[1].col[0].selected = true;
    t.data.row[1].col[0].cellClass = 'foo';
    t.changeSelectOption();
    expect(t.data.cellClass).toBe('foo');
  });

  it('changeSelectOption: 選択セルの cellClass が異なれば空文字にする', () => {
    const t = createTable(grid2x2);
    t.data.row[0].col[0].selected = true;
    t.data.row[0].col[0].cellClass = 'foo';
    t.data.row[1].col[0].selected = true;
    t.data.row[1].col[0].cellClass = 'bar';
    t.changeSelectOption();
    expect(t.data.cellClass).toBe('');
  });
});
