import { defineConfig } from 'vite';

// root はプロジェクトルートのまま (examples を root にすると
// server.fs.allow の設定に関わらず ../build 等への静的アセット参照が
// SPA フォールバックで index.html に化けてしまう挙動が確認されたため)。
export default defineConfig({
  server: {
    open: '/examples/index.html'
  }
});
