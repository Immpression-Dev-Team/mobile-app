const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    // Ensure Metro Bundler watches .env files
    config.resolver.assetExts.push('env');

    return config;
})();
