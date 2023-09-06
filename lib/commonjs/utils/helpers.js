"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewCoordinatesToImageCoordinates = exports.imageCoordinatesToViewCoordinates = exports.createPanResponder = exports.createAnimatedValueXYForCorner = void 0;
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
    x: corner.x._value / _reactNative.Dimensions.get('window').width * width,
    // @ts-ignore
    y: corner.y._value / viewHeight * height
  };
};
exports.viewCoordinatesToImageCoordinates = viewCoordinatesToImageCoordinates;
const createAnimatedValueXYForCorner = (corner, width, height, viewHeight) => {
  return new _reactNative.Animated.ValueXY(imageCoordinatesToViewCoordinates(corner, width, height, viewHeight));
};
exports.createAnimatedValueXYForCorner = createAnimatedValueXYForCorner;
const createPanResponder = (corner, updateOverlayString, _zoomOnPoint) => {
  return _reactNative.PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      _reactNative.Animated.event([null, {
        dx: corner.x,
        dy: corner.y
      }], {
        useNativeDriver: false
      })(evt, gestureState);
      _reactNative.Animated.event([null, {
        dx: _zoomOnPoint.x,
        dy: _zoomOnPoint.y
      }], {
        useNativeDriver: false
      })(evt, gestureState);
      updateOverlayString();
    },
    onPanResponderRelease: () => {
      corner.flattenOffset();
      updateOverlayString();
    },
    onPanResponderGrant: () => {
      // @ts-ignore
      corner.setOffset({
        x: corner.x._value,
        y: corner.y._value
      });
      corner.setValue({
        x: 0,
        y: 0
      });
    }
  });
};
exports.createPanResponder = createPanResponder;
//# sourceMappingURL=helpers.js.map