export interface AlternateIconsPlugin {
    changeIcon(options: {
        alias: string;
        aliases: string[];
        defaultAlias: string;
        cloneDefaultAlias: string;
    }): Promise<void>;
    resetIcon(options: {
        aliases: string[];
        defaultAlias: string;
        cloneDefaultAlias: string;
    }): Promise<void>;
}
