var capacitorAlternateIcons = (function (exports, core) {
    'use strict';

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

    return exports;

})({}, capacitorExports);
//# sourceMappingURL=plugin.js.map
