import { registerPlugin } from '@capacitor/core';

import type { AlternateIconsPlugin } from './definitions';

const AlternateIcons = registerPlugin<AlternateIconsPlugin>('AlternateIcons', {
  web: () => import('./web').then((m) => new m.AlternateIconsWeb()),
});

export * from './definitions';
export { AlternateIcons };
