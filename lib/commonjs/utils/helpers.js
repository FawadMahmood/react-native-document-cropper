"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewCoordinatesToImageCoordinates = exports.imageCoordinatesToViewCoordinates = exports.getInitialValues = exports.createAnimatedValueXYForCorner = void 0;
var _reactNative = require("react-native");
const imageCoordinatesToViewCoordinates = (corner, width, height, viewHeight) => {
  return {
    x: corner.x * _reactNative.Dimensions.get('window').width / width,
    y: corner.y * viewHeight / height
  };
};
exports.imageCoordinatesToViewCoordinates = imageCoordinatesToViewCoordinates;
const viewCoordinatesToImageCoordinates = (corner, width, height, viewHeight) => {
  return {
    // @ts-ignore
    x: corner.x / _reactNative.Dimensions.get('window').width * width,
    // @ts-ignore
    y: corner.y / viewHeight * height
  };
};
exports.viewCoordinatesToImageCoordinates = viewCoordinatesToImageCoordinates;
const createAnimatedValueXYForCorner = (corner, width, height, viewHeight) => {
  return new _reactNative.Animated.ValueXY(imageCoordinatesToViewCoordinates(corner, width, height, viewHeight));
};
exports.createAnimatedValueXYForCorner = createAnimatedValueXYForCorner;
const getInitialValues = (corner, width, height, viewHeight) => {
  return imageCoordinatesToViewCoordinates(corner, width, height, viewHeight);
};
exports.getInitialValues = getInitialValues;
//# sourceMappingURL=helpers.js.map