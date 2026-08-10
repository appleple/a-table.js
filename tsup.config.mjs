import { readFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'tsup';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

const banner = `/*!
 * a-table v${pkg.version}
 * (c) ${pkg.author}
 * Released under the MIT License.
 */`;

// esbuild has no built-in concept of Vite's `?raw` suffix; this plugin
// resolves `*.html?raw` imports to the file's raw text content so the
// same import syntax works under both tsup (build) and vitest (test).
const rawTextPlugin = {
  name: 'raw-text',
  setup(build) {
    build.onResolve({ filter: /\?raw$/ }, args => ({
      path: path.resolve(args.resolveDir, args.path.replace(/\?raw$/, '')),
      namespace: 'raw-text'
    }));
    build.onLoad({ filter: /.*/, namespace: 'raw-text' }, args => ({
      contents: readFileSync(args.path, 'utf8'),
      loader: 'text'
    }));
  }
};

export default defineConfig([
  {
    entry: { index: 'src/index.js' },
    outDir: 'lib',
    format: ['cjs', 'esm'],
    target: 'es2020',
    clean: true,
    sourcemap: false,
    dts: false,
    esbuildPlugins: [rawTextPlugin],
    // esbuild's cjs output keeps `export default` under `.default`;
    // unwrap it so `require('a-table')` returns the class directly.
    footer: ctx => (ctx.format === 'cjs' ? { js: 'module.exports = module.exports.default;' } : undefined)
  },
  {
    entry: { 'a-table': 'src/index.js' },
    outDir: 'build',
    format: ['iife'],
    globalName: 'aTable',
    target: 'es2017',
    clean: false,
    minify: false,
    sourcemap: false,
    dts: false,
    esbuildPlugins: [rawTextPlugin],
    banner: { js: banner },
    footer: { js: 'aTable = aTable.default;' },
    outExtension: () => ({ js: '.js' })
  },
  {
    entry: { 'a-table.min': 'src/index.js' },
    outDir: 'build',
    format: ['iife'],
    globalName: 'aTable',
    target: 'es2017',
    clean: false,
    minify: true,
    sourcemap: false,
    dts: false,
    esbuildPlugins: [rawTextPlugin],
    banner: { js: banner },
    footer: { js: 'aTable = aTable.default;' },
    outExtension: () => ({ js: '.js' })
  }
]);
