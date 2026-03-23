module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@services': './services',
            '@components': './components',
            '@utils': './utils',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
