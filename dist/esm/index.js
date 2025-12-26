import { registerPlugin } from '@capacitor/core';
const AlternateIcons = registerPlugin('AlternateIcons', {
    web: () => import('./web').then((m) => new m.AlternateIconsWeb()),
});
export * from './definitions';
export { AlternateIcons };
//# sourceMappingURL=index.js.map