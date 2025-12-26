'use strict';

var core = require('@capacitor/core');

const AlternateIcons = core.registerPlugin('AlternateIcons', {
    web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.AlternateIconsWeb()),
});

class AlternateIconsWeb extends core.WebPlugin {
    async changeIcon() {
        throw this.unimplemented('Not implemented on web.');
    }
    async resetIcon() {
        throw this.unimplemented('Not implemented on web.');
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AlternateIconsWeb: AlternateIconsWeb
});

exports.AlternateIcons = AlternateIcons;
//# sourceMappingURL=plugin.cjs.js.map
