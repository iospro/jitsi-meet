/* eslint-disable */

const fs = require('fs');
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const {
    resolver: {
        sourceExts,
        assetExts
    }
} = getDefaultConfig();

/**
 * Source of truth for the bundled languages is `lang/languages.json`: the same
 * file that drives the language picker and the native locale detector. Only the
 * languages listed there are bundled as `lang/main-<lang>.json`; the rest use
 * Metro's built-in empty module and fall back to 'en' (i18next fallbackLng).
 * Adding a language to `languages.json` and rebuilding the bundle picks it up.
 *
 * With the default (full) languages list this is a no-op; the cut only takes
 * effect for custom builds that trim `languages.json`, keeping the mobile SDK
 * bundle in sync with the languages the product actually offers.
 */
const allowedLangs = readLanguagesList();

/**
 * Resolves a request while replacing excluded language bundles with Metro's
 * built-in empty module. `lang/main.json` (English, always required by i18next) and
 * `lang/languages.json` (language picker list) are never touched.
 *
 * @param {*} context - Metro resolution context.
 * @param {string} moduleName - Requested module specifier.
 * @param {string | null} platform - Target platform.
 * @returns {*} Metro resolution result.
 */
function resolveRequest(context, moduleName, platform) {
    if (allowedLangs) {
        const m = /(^|\/)lang\/main-([a-zA-Z-]+)(\.json)?$/.exec(moduleName);

        if (m && !allowedLangs.includes(m[2])) {
            return { type: 'empty' };
        }
    }

    return context.resolveRequest(context, moduleName, platform);
}

/**
 * Reads the list of bundled languages from `lang/languages.json`. Returns null
 * when the file is missing or unreadable, in which case all languages stay in
 * the bundle (default upstream behavior).
 *
 * @returns {string[]|null}
 */
function readLanguagesList() {
    try {
        const langs = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'lang', 'languages.json'), 'utf8'));

        return Object.keys(langs);
    } catch (e) {
        return null;
    }
}

const config = {
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer')
    },
    resolver: {
        assetExts: assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [ ...sourceExts, 'svg' ],
        resolveRequest
    }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
