// jsdom はレイアウトを計算しないため getBoundingClientRect は常に 0 を返す。
// aTable は th/td の offset 比較で論理座標 (x, y) を復元するので、
// テストでは colspan/rowspan なしの単純なテーブルを前提に、DOM 構造から
// 導ける位置をそのまま getBoundingClientRect へ焼き込んでレイアウトを模倣する。
export function mockRect(el, { top = 0, left = 0 } = {}) {
  el.getBoundingClientRect = () => ({
    top, left, bottom: top, right: left, width: 0, height: 0, x: left, y: top
  });
}

// colspan/rowspan を使わない cols x rows の単純なテーブルに対して、
// ヘッダー / サイド / 各セルの座標を一貫した格子状にモックする。
export function layoutSimpleTable(instance, cols, rows) {
  const headers = instance._getElementsByQuery('.js-table-header th');
  [].forEach.call(headers, (header, index) => {
    mockRect(header, { left: index * 100 });
  });
  const sides = instance._getElementsByQuery('.js-table-side');
  [].forEach.call(sides, (side, index) => {
    mockRect(side, { top: index * 50 });
  });
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const cell = instance.getCellByIndex(x, y);
      if (cell) {
        mockRect(cell, { left: (x + 1) * 100, top: y * 50 });
      }
    }
  }
}

// jsdom は innerText を計算しない (常に空文字) ため、textContent を
// フォールバックとして使うように一時的に差し替えるヘルパー。
// aTable#parse(html, 'text') や processPaste の一部経路が innerText に依存する。
export function withInnerTextFallback(fn) {
  const original = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerText');
  Object.defineProperty(window.HTMLElement.prototype, 'innerText', {
    configurable: true,
    get() {
      return this.textContent;
    }
  });
  try {
    return fn();
  } finally {
    if (original) {
      Object.defineProperty(window.HTMLElement.prototype, 'innerText', original);
    } else {
      delete window.HTMLElement.prototype.innerText;
    }
  }
}
