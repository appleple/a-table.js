import { describe, it, expect, afterEach } from 'vitest';
import aTable from '../src/index.js';
import { withInnerTextFallback } from './helpers.js';

function createTable(html) {
  document.body.innerHTML = `<table class="table">${html}</table>`;
  return new aTable('.table');
}

describe('parse', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('th/td を type つきで解析する', () => {
    const t = createTable('<tr><th>H</th><td>D</td></tr>');
    expect(t.data.row[0].col[0].type).toBe('th');
    expect(t.data.row[0].col[1].type).toBe('td');
  });

  it('colspan/rowspan が無ければ既定値 1 (数値) になる', () => {
    const t = createTable('<tr><td>A</td></tr>');
    expect(t.data.row[0].col[0].colspan).toBe(1);
    expect(t.data.row[0].col[0].rowspan).toBe(1);
  });

  it('colspan/rowspan 属性の値を読み取る', () => {
    const t = createTable('<tr><td colspan="2" rowspan="3">A</td></tr>');
    expect(t.data.row[0].col[0].colspan).toBe('2');
    expect(t.data.row[0].col[0].rowspan).toBe('3');
  });

  it('align に対応する class は align として抽出し cellClass から除く', () => {
    const t = createTable('<tr><td class="right foo">A</td></tr>');
    expect(t.data.row[0].col[0].align).toBe('right');
    expect(t.data.row[0].col[0].cellClass).toBe('foo');
  });

  it('末尾の } を &rcub; にエスケープする (先頭の { 側の置換は上書きされて残らない実装)', () => {
    const t = createTable('<tr><td>{x}</td></tr>');
    expect(t.data.row[0].col[0].value).toBe('{x&rcub;');
  });

  it('バックスラッシュを &#92; にエスケープする', () => {
    const t = createTable('<tr><td>a\\b</td></tr>');
    expect(t.data.row[0].col[0].value).toBe('a&#92;b');
  });

  it('セルが空なら value は空文字になる', () => {
    const t = createTable('<tr><td></td></tr>');
    expect(t.data.row[0].col[0].value).toBe('');
  });

  it('format="text" のときは innerText を使う', () => {
    withInnerTextFallback(() => {
      const t = createTable('<tr><td>A</td></tr>');
      const parsed = t.parse('<table><tr><td><b>bold</b></td></tr></table>', 'text');
      expect(parsed[0].col[0].value).toBe('bold');
    });
  });
});

describe('parseText (Excel 等からの貼り付け)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('タブ区切り/CR 区切りのテキストを行列に変換する', () => {
    const t = createTable('<tr><td>A</td></tr>');
    const text = `a${String.fromCharCode(9)}b${String.fromCharCode(13)}c${String.fromCharCode(9)}d`;
    const rows = t.parseText(text);
    expect(rows).toHaveLength(2);
    expect(rows[0].col.map(c => c.value)).toEqual(['a', 'b']);
    expect(rows[1].col.map(c => c.value)).toEqual(['c', 'd']);
  });

  it('ダブルクオート内の改行は <br> に変換する', () => {
    const t = createTable('<tr><td>A</td></tr>');
    const text = '"a\nb"';
    const rows = t.parseText(text);
    expect(rows[0].col[0].value).toBe('a<br>b');
  });

  it('末尾の } を &rcub; にエスケープする (先頭の { 側の置換は上書きされて残らない実装)', () => {
    const t = createTable('<tr><td>A</td></tr>');
    const rows = t.parseText('{x}');
    expect(rows[0].col[0].value).toBe('{x&rcub;');
  });
});

describe('getTableClass / toMarkdown / getTable / getMarkdown', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('getTableClass: html の table 要素から class を取り出す', () => {
    const t = createTable('<tr><td>A</td></tr>');
    expect(t.getTableClass('<table class="foo"><tr><td>x</td></tr></table>')).toBe('foo');
  });

  it('toMarkdown: table html を Markdown テーブルに変換する', () => {
    const t = createTable('<tr><td>A</td></tr>');
    const md = t.toMarkdown('<table><tr><td>a</td><td>b</td></tr><tr><td>c</td><td>d</td></tr></table>');
    expect(md).toBe('| a | b | \n| --- | --- | \n| c | d | \n');
  });

  it('getTable: 現在の行データから table html を再構築する', () => {
    const t = createTable('<tr><td>A</td><td>B</td></tr>');
    const html = t.getTable();
    expect(html).toContain('<td');
    expect(html).toContain('A');
    expect(html).toContain('B');
  });

  it('getMarkdown: getTable の結果を Markdown に変換する', () => {
    const t = createTable('<tr><td>A</td><td>B</td></tr>');
    const md = t.getMarkdown();
    expect(md).toContain('| A | B |');
  });
});
