// Mock for lottie-react-native
// Its native/web player implementations aren't available under the
// jsdom-based Jest environment, so we render a plain View stand-in instead
// (same pattern as __mocks__/@shopify/react-native-skia.js and
// __mocks__/react-native-svg.js).
const React = require('react');
const { View } = require('react-native');

const LottieView = React.forwardRef((props, ref) =>
  React.createElement(View, { ...props, testID: props.testID ?? 'lottie-view', ref }),
);
LottieView.displayName = 'LottieView';

module.exports = {
  __esModule: true,
  default: LottieView,
};
