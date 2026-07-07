// Mock for react-native-svg
// Its Fabric native components aren't available under the jsdom-based Jest
// environment, so we render plain View stand-ins instead.
const React = require('react');
const { View } = require('react-native');

function passthrough(name) {
  const Comp = props => React.createElement(View, { ...props, testID: name });
  Comp.displayName = name;
  return Comp;
}

module.exports = {
  __esModule: true,
  default: passthrough('Svg'),
  Svg: passthrough('Svg'),
  Circle: passthrough('Circle'),
  Ellipse: passthrough('Ellipse'),
  Rect: passthrough('Rect'),
  Line: passthrough('Line'),
  Path: passthrough('Path'),
  Polygon: passthrough('Polygon'),
  G: passthrough('G'),
};
