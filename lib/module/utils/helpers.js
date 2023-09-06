import { Animated, Dimensions, PanResponder } from 'react-native';
export const imageCoordinatesToViewCoordinates = (corner, width, height, viewHeight) => {
  return {
    x: corner.x * Dimensions.get('window').width / width,
    y: corner.y * viewHeight / height
  };
};
export const viewCoordinatesToImageCoordinates = (corner, width, height, viewHeight) => {
  return {
    // @ts-ignore
    x: corner.x._value / Dimensions.get('window').width * width,
    // @ts-ignore
    y: corner.y._value / viewHeight * height
  };
};
export const createAnimatedValueXYForCorner = (corner, width, height, viewHeight) => {
  return new Animated.ValueXY(imageCoordinatesToViewCoordinates(corner, width, height, viewHeight));
};
export const createPanResponder = (corner, updateOverlayString, _zoomOnPoint) => {
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      Animated.event([null, {
        dx: corner.x,
        dy: corner.y
      }], {
        useNativeDriver: false
      })(evt, gestureState);
      Animated.event([null, {
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
//# sourceMappingURL=helpers.js.map