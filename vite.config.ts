import { crx } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { defineConfig } from 'vite';
import zip from 'vite-plugin-zip-pack';

import { chromeManifest, firefoxManifest } from './manifest.config.ts';
import { name, version } from './package.json';

const browser = process.env.BROWSER as 'chrome' | 'firefox';
const manifest = browser === 'firefox' ? firefoxManifest : chromeManifest;

export default defineConfig({
  resolve: { alias: { '#': `${path.resolve(__dirname, 'src')}` } },
  plugins: [
    vue(),
    tailwindcss(),
    crx({ manifest, browser }),
    zip({ outDir: 'release', outFileName: `${name}-${version}-${browser}.zip` }),
  ],
  server: { cors: { origin: [/chrome-extension:\/\//, /moz-extension:\/\//] } },
});
