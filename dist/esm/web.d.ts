import { WebPlugin } from '@capacitor/core';
import type { AlternateIconsPlugin } from './definitions';
export declare class AlternateIconsWeb extends WebPlugin implements AlternateIconsPlugin {
    changeIcon(): Promise<void>;
    resetIcon(): Promise<void>;
}
