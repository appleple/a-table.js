import { describe, it, expect, afterEach, vi } from 'vitest';
import aTable from '../src/index.js';
import { layoutSimpleTable, mockRect } from './helpers.js';

function createTable(html) {
  document.body.innerHTML = `<table class="table">${html}</table>`;
  return new aTable('.table');
}

const grid3x3 = '<tr><td>A</td><td>B</td><td>C</td></tr>'
  + '<tr><td>D</td><td>E</td><td>F</td></tr>'
  + '<tr><td>G</td><td>H</td><td>I</td></tr>';

// _withGeometryCache を素通しにすると _geoDepth が 0 のままになり、
// getCellInfoByIndex は毎回ヘッダー座標を読み直す (= キャッシュ導入前と同じ経路)
function withoutGeometryCache(instance, fn) {
  const original = instance._withGeometryCache;
  instance._withGeometryCache = f => f();
  try {
    return fn();
  } finally {
    instance._withGeometryCache = original;
  }
}

// ヘッダー / サイドに対する getBoundingClientRect の呼び出し回数を数える。
// layoutSimpleTable が差し替えたモックの戻り値はそのまま使う
function countGeometryReads(instance) {
  const counter = { calls: 0 };
  const elements = [
    ...instance._getElementsByQuery('.js-table-header th'),
    ...instance._getElementsByQuery('.js-table-side')
  ];
  elements.forEach((element) => {
    const original = element.getBoundingClientRect.bind(element);
    element.getBoundingClientRect = () => {
      counter.calls += 1;
      return original();
    };
  });
  counter.size = elements.length;
  return counter;
}

describe('座標キャッシュ: 結果が変わらないこと', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('getAllPoints: キャッシュの有無で同じ結果を返す', () => {
    const t = createTable(grid3x3);
    layoutSimpleTable(t, 3, 3);
    const cached = t.getAllPoints();
    const uncached = withoutGeometryCache(t, () => t.getAllPoints());
    expect(cached).toHaveLength(9);
    expect(cached).toEqual(uncached);
  });

  it('getAllPoints: 結合セルを含む表でもキャッシュの有無で同じ結果を返す', () => {
    const t = createTable('<tr><td colspan="2">A</td><td>C</td></tr>'
      + '<tr><td>D</td><td>E</td><td>F</td></tr>');
    layoutSimpleTable(t, 3, 2);
    // C は colspan=2 の A の右隣なので論理 x は 2 (left = 300)
    mockRect(t.getCellByIndex(1, 0), { left: 300, top: 0 });
    const cached = t.getAllPoints();
    const uncached = withoutGeometryCache(t, () => t.getAllPoints());
    expect(cached).toEqual([
      { x: 0, y: 0, width: 2, height: 1 },
      { x: 2, y: 0, width: 1, height: 1 },
      { x: 0, y: 1, width: 1, height: 1 },
      { x: 1, y: 1, width: 1, height: 1 },
      { x: 2, y: 1, width: 1, height: 1 }
    ]);
    expect(cached).toEqual(uncached);
  });

  it('getCellIndexByPos: キャッシュの有無で同じ結果を返す', () => {
    const t = createTable(grid3x3);
    layoutSimpleTable(t, 3, 3);
    for (let y = 0; y < 3; y += 1) {
      for (let x = 0; x < 3; x += 1) {
        const cached = t.getCellIndexByPos(x, y);
        const uncached = withoutGeometryCache(t, () => t.getCellIndexByPos(x, y));
        expect(cached).toEqual({ row: y, col: x });
        expect(cached).toEqual(uncached);
      }
    }
  });

  it('一連の編集操作の結果 (getTable) がキャッシュの有無で一致する', () => {
    const scenario = (disableCache) => {
      const t = createTable(grid3x3);
      if (disableCache) {
        t._withGeometryCache = f => f();
      }
      layoutSimpleTable(t, 3, 3);
      t.select(0, 0);
      t.selectRange(1, 1);
      layoutSimpleTable(t, 3, 3);
      t.insertColRight(1);
      layoutSimpleTable(t, 4, 3);
      t.insertRowBelow(0);
      layoutSimpleTable(t, 4, 4);
      // selectRow は contextmenu() 経由でイベントを参照する
      t.e = { preventDefault: () => {}, clientX: 0, clientY: 0 };
      t.selectRow(2);
      layoutSimpleTable(t, 4, 4);
      t.removeCol(3);
      const html = t.getTable();
      document.body.innerHTML = '';
      return html;
    };
    const withCache = scenario(false);
    const withoutCache = scenario(true);
    expect(withCache).toBe(withoutCache);
    expect(withCache).toContain('<td>A</td>');
  });
});

describe('座標キャッシュ: 計測回数', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('getAllPoints 中のヘッダー座標の計測は 1 巡だけになる', () => {
    const t = createTable(grid3x3);
    layoutSimpleTable(t, 3, 3);
    const counter = countGeometryReads(t);

    t.getAllPoints();
    const cachedCalls = counter.calls;

    counter.calls = 0;
    withoutGeometryCache(t, () => t.getAllPoints());
    const uncachedCalls = counter.calls;

    // キャッシュあり: ヘッダー + サイドを 1 回ずつ
    expect(cachedCalls).toBe(counter.size);
    // キャッシュなし: セル 9 個ぶん繰り返す
    expect(uncachedCalls).toBe(counter.size * 9);
    expect(cachedCalls).toBeLessThan(uncachedCalls);
  });

  it('入れ子で呼ばれてもスナップショットは 1 回しか作られない', () => {
    const t = createTable(grid3x3);
    layoutSimpleTable(t, 3, 3);
    const counter = countGeometryReads(t);
    // isSelectedCellsRectangle は getSelectedPoints / getAllPoints / getCellByPos を
    // まとめて呼ぶので、入れ子のスコープでキャッシュが共有されることを確認する
    t.select(0, 0);
    counter.calls = 0;
    t.isSelectedCellsRectangle();
    expect(counter.calls).toBe(counter.size);
  });
});

describe('座標キャッシュ: 破棄のタイミング', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('スコープを抜けたらキャッシュは破棄される', () => {
    const t = createTable(grid3x3);
    layoutSimpleTable(t, 3, 3);
    t.getAllPoints();
    expect(t._geo).toBeNull();
    expect(t._geoDepth).toBe(0);
  });

  it('スコープ内ではキャッシュを保持し、最も外側を抜けたときに破棄する', () => {
    const t = createTable(grid3x3);
    layoutSimpleTable(t, 3, 3);
    let geoInScope = null;
    let depthInScope = -1;
    t._withGeometryCache(() => {
      t.getAllPoints();
      geoInScope = t._geo;
      depthInScope = t._geoDepth;
    });
    expect(depthInScope).toBe(1);
    expect(geoInScope).not.toBeNull();
    expect(geoInScope.headerLefts).toEqual([0, 100, 200, 300]);
    expect(geoInScope.sideTops).toEqual([0, 50, 100]);
    expect(t._geo).toBeNull();
  });

  it('例外が投げられてもキャッシュとスコープの深さは元に戻る', () => {
    const t = createTable(grid3x3);
    layoutSimpleTable(t, 3, 3);
    expect(() => {
      t._withGeometryCache(() => {
        t.getAllPoints();
        throw new Error('boom');
      });
    }).toThrow('boom');
    expect(t._geo).toBeNull();
    expect(t._geoDepth).toBe(0);
  });

  it('update() は DOM を作り直すのでキャッシュを破棄する', () => {
    const t = createTable(grid3x3);
    layoutSimpleTable(t, 3, 3);
    t.update();
    expect(t._geo).toBeNull();

    // スコープの内側で update() が走った場合も破棄され、以降は測り直す
    const build = vi.spyOn(t, '_buildGeometryCache');
    t._withGeometryCache(() => {
      t.getAllPoints();
      expect(t._geo).not.toBeNull();
      const buildsBeforeUpdate = build.mock.calls.length;
      t.update();
      expect(t._geo).toBeNull();
      t.getAllPoints();
      expect(build.mock.calls.length).toBeGreaterThan(buildsBeforeUpdate);
    });
    build.mockRestore();
  });

  it('呼び出しをまたいでキャッシュが残らず、レイアウト変更後は測り直す', () => {
    const t = createTable(grid3x3);
    layoutSimpleTable(t, 3, 3);
    expect(t.getCellInfoByIndex(1, 1)).toEqual({ x: 1, y: 1, width: 1, height: 1 });

    // 行の高さが変わった状況 (top が 50 刻みから 80 刻みへ) を模す
    const sides = t._getElementsByQuery('.js-table-side');
    [].forEach.call(sides, (side, index) => {
      mockRect(side, { top: index * 80 });
    });
    for (let y = 0; y < 3; y += 1) {
      for (let x = 0; x < 3; x += 1) {
        mockRect(t.getCellByIndex(x, y), { left: (x + 1) * 100, top: y * 80 });
      }
    }
    expect(t.getCellInfoByIndex(1, 1)).toEqual({ x: 1, y: 1, width: 1, height: 1 });
  });
});
