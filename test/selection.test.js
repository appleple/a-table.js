import { describe, it, expect, afterEach } from 'vitest';
import aTable from '../src/index.js';
import { layoutSimpleTable } from './helpers.js';

function createTable(html) {
  document.body.innerHTML = `<table class="table">${html}</table>`;
  const t = new aTable('.table');
  return t;
}

const grid2x2 = '<tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr>';

describe('highestRow / _getTableLength 系', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('highestRow: 最初の行の colspan 合計だけインデックス配列を作る', () => {
    const t = createTable(grid2x2);
    expect(t.highestRow()).toEqual([0, 1]);
  });

  it('highestRow: 行が無ければ空配列を返す', () => {
    const t = createTable(grid2x2);
    t.data.row = [];
    expect(t.highestRow()).toEqual([]);
  });

  it('_getTableLength: x/y のサイズを算出する', () => {
    const t = createTable(grid2x2);
    expect(t._getTableLength(t.data.row)).toEqual({ x: 2, y: 2 });
  });
});

describe('hitTest', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('矩形が重なっていれば true を返す', () => {
    const t = createTable(grid2x2);
    const p1 = { x: 0, y: 0, width: 2, height: 1 };
    const p2 = { x: 1, y: 0, width: 1, height: 1 };
    expect(t.hitTest(p1, p2)).toBe(true);
  });

  it('矩形が重なっていなければ false を返す', () => {
    const t = createTable(grid2x2);
    const p1 = { x: 0, y: 0, width: 1, height: 1 };
    const p2 = { x: 5, y: 5, width: 1, height: 1 };
    expect(t.hitTest(p1, p2)).toBe(false);
  });
});

describe('getLargePoint', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('複数の point を包含する最小の矩形を返す', () => {
    const t = createTable(grid2x2);
    const p1 = { x: 0, y: 0, width: 1, height: 1 };
    const p2 = { x: 1, y: 1, width: 1, height: 1 };
    expect(t.getLargePoint(p1, p2)).toEqual({ x: 0, y: 0, width: 2, height: 2 });
  });
});

describe('座標系メソッド (getCellInfoByIndex 経由)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('getCellInfoByIndex: セルの位置とサイズを DOM から算出する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    expect(t.getCellInfoByIndex(0, 0)).toEqual({ x: 0, y: 0, width: 1, height: 1 });
    expect(t.getCellInfoByIndex(1, 1)).toEqual({ x: 1, y: 1, width: 1, height: 1 });
  });

  it('getCellInfoByIndex: 対象セルが存在しなければ false を返す', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    expect(t.getCellInfoByIndex(9, 9)).toBe(false);
  });

  it('select: 指定セルのみ selected になり point が更新される', () => {
    const t = createTable(grid2x2);
    t.select(0, 1);
    expect(t.data.point).toEqual({ x: 1, y: 0 });
    expect(t.data.row[0].col[1].selected).toBe(true);
    expect(t.data.row[0].col[0].selected).toBeFalsy();
  });

  it('unselectCells: すべての selected を false にする', () => {
    const t = createTable(grid2x2);
    t.select(0, 0);
    t.unselectCells();
    expect(t.data.row[0].col[0].selected).toBe(false);
  });

  it('getSelectedPoints / getSelectedPoint / getAllPoints', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    const points = t.getSelectedPoints();
    expect(points).toHaveLength(1);
    expect(t.getSelectedPoint()).toEqual(points[0]);
    expect(t.getAllPoints()).toHaveLength(4);
  });

  it('getSelectedPoint: 選択が無ければ undefined を返す', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    expect(t.getSelectedPoint()).toBeUndefined();
  });

  it('selectRange: 開始点から範囲選択する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 1);
    expect(t.data.row[0].col[0].selected).toBe(true);
    expect(t.data.row[0].col[1].selected).toBe(true);
    expect(t.data.row[1].col[0].selected).toBe(true);
    expect(t.data.row[1].col[1].selected).toBe(true);
  });

  it('markup: 選択範囲の外周セルに mark を付与する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 1);
    t.markup();
    expect(t.data.row[0].col[0].mark).toEqual({ left: true, top: true });
    expect(t.data.row[1].col[1].mark).toEqual({ right: true, bottom: true });
  });

  it('markup: splited フラグが立っていれば処理をスキップして解除する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.data.splited = true;
    t.markup();
    expect(t.data.splited).toBe(false);
  });

  it('isSelectedCellsRectangle: 矩形選択なら true', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.selectRange(1, 1);
    expect(t.isSelectedCellsRectangle()).toBe(true);
  });

  it('isSelectedCellsRectangle: 矩形でない選択なら false', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    t.select(0, 0);
    t.data.row[1].col[1].selected = true;
    expect(t.isSelectedCellsRectangle()).toBe(false);
  });

  it('getCellByPos / getCellIndexByPos: 座標からセル・インデックスを取得する', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    const index = t.getCellIndexByPos(1, 0);
    expect(index).toEqual({ row: 0, col: 1 });
    expect(t.getCellByPos(1, 0)).toBe(t.data.row[0].col[1]);
  });

  it('getCellByPos: 対象行が存在しない場合は undefined を返す', () => {
    const t = createTable(grid2x2);
    layoutSimpleTable(t, 2, 2);
    expect(t.getCellByPos(99, 99)).toBeUndefined();
  });

  it('removeCell: 指定セルを行データから取り除く', () => {
    const t = createTable(grid2x2);
    const cell = t.data.row[0].col[0];
    t.removeCell(cell);
    expect(t.data.row[0].col).not.toContain(cell);
  });

  it('removeSelectedCellExcept: 指定セル以外の selected セルを取り除く', () => {
    const t = createTable(grid2x2);
    t.data.row[0].col[0].selected = true;
    t.data.row[0].col[1].selected = true;
    const keep = t.data.row[1].col[0];
    t.removeSelectedCellExcept(keep);
    expect(t.data.row[0].col).toHaveLength(0);
    expect(t.data.row[1].col).toContain(keep);
  });
});
