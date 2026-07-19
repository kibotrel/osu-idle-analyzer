import { defineManifest } from '@crxjs/vite-plugin';

import { description, name, version } from './package.json';

export default defineManifest({
  action: {
    default_icon: {
      16: 'public/16.png',
      32: 'public/32.png',
      48: 'public/48.png',
      128: 'public/128.png',
    },
    default_popup: 'src/popup/index.html',
  },
  background: {
    service_worker: 'src/background/main.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://osu.idle.rhythmgamers.net/*'],
      js: ['src/content/main.ts'],
      run_at: 'document_idle',
    },
  ],
  description,
  host_permissions: [
    'https://a.ppy.sh/*',
    'https://api.osu.idle.rhythmgamers.net/*',
    'https://osu.idle.rhythmgamers.net/*',
  ],
  icons: {
    16: 'public/16.png',
    32: 'public/32.png',
    48: 'public/48.png',
    128: 'public/128.png',
  },
  manifest_version: 3,
  name,
  permissions: ['activeTab', 'clipboardWrite', 'scripting', 'storage', 'unlimitedStorage'],
  version,
});
