import { WebPlugin } from '@capacitor/core';
import type { AlternateIconsPlugin } from './definitions';

export class AlternateIconsWeb extends WebPlugin implements AlternateIconsPlugin {
  async changeIcon(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async resetIcon(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }
}
