module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // react-native-reanimated v4 requires the worklets babel plugin.
    // It must be listed last. (Provided by react-native-worklets.)
    plugins: ['react-native-worklets/plugin'],
  };
};
