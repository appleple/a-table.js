import { describe, it, expect } from 'vitest';
import aTable from '../src/index.js';

// navigator.userAgent/appVersion は通常 Navigator.prototype 側の getter で、
// インスタンス自身に own property が無いことが多い。defineProperty で一時的に
// 上書きしたら delete で元の getter に戻す (プロトタイプの記述子は変更しない)。
function withUserAgent(ua, fn) {
  Object.defineProperty(window.navigator, 'userAgent', { value: ua, configurable: true });
  Object.defineProperty(window.navigator, 'appVersion', { value: ua, configurable: true });
  try {
    return fn();
  } finally {
    delete window.navigator.userAgent;
    delete window.navigator.appVersion;
  }
}

describe('isSmartPhone', () => {
  it('スマートフォンの UA ではない場合は false を返す', () => {
    expect(aTable.isSmartPhone()).toBe(false);
  });

  it('iPhone / iPad / ipod / Android の UA なら true を返す', () => {
    expect(withUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)', () => aTable.isSmartPhone())).toBe(true);
    expect(withUserAgent('Mozilla/5.0 (iPad; CPU OS 15_0)', () => aTable.isSmartPhone())).toBe(true);
    expect(withUserAgent('Mozilla/5.0 (ipod touch)', () => aTable.isSmartPhone())).toBe(true);
    expect(withUserAgent('Mozilla/5.0 (Linux; Android 12)', () => aTable.isSmartPhone())).toBe(true);
  });
});

describe('getBrowser', () => {
  it('既知の UA から各ブラウザ名を判定する', () => {
    expect(withUserAgent('mozilla msie 6.0', () => aTable.getBrowser())).toBe('ie6');
    expect(withUserAgent('mozilla msie 7.0', () => aTable.getBrowser())).toBe('ie7');
    expect(withUserAgent('mozilla msie 8.0', () => aTable.getBrowser())).toBe('ie8');
    expect(withUserAgent('mozilla msie 9.0', () => aTable.getBrowser())).toBe('ie9');
    expect(withUserAgent('mozilla msie 10.0', () => aTable.getBrowser())).toBe('ie10');
    expect(withUserAgent('mozilla msie 5.0', () => aTable.getBrowser())).toBe('ie');
    expect(withUserAgent('mozilla trident/7.0', () => aTable.getBrowser())).toBe('ie11');
    expect(withUserAgent('mozilla edge/1.0', () => aTable.getBrowser())).toBe('edge');
    expect(withUserAgent('mozilla chrome/1.0', () => aTable.getBrowser())).toBe('chrome');
    expect(withUserAgent('mozilla safari/1.0', () => aTable.getBrowser())).toBe('safari');
    expect(withUserAgent('mozilla opera/1.0', () => aTable.getBrowser())).toBe('opera');
    expect(withUserAgent('mozilla firefox/1.0', () => aTable.getBrowser())).toBe('firefox');
    expect(withUserAgent('some-unknown-agent', () => aTable.getBrowser())).toBe('unknown');
  });
});

describe('getUniqId', () => {
  it('毎回異なる ID を生成する', () => {
    const a = aTable.getUniqId();
    const b = aTable.getUniqId();
    expect(a).not.toBe(b);
    expect(typeof a).toBe('string');
  });
});
