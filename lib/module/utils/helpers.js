import { Animated, Dimensions } from 'react-native';
export const imageCoordinatesToViewCoordinates = (corner, width, height, viewHeight) => {
  return {
    x: corner.x * Dimensions.get('window').width / width,
    y: corner.y * viewHeight / height
  };
};
export const viewCoordinatesToImageCoordinates = (corner, width, height, viewHeight) => {
  return {
    // @ts-ignore
    x: corner.x / Dimensions.get('window').width * width,
    // @ts-ignore
    y: corner.y / viewHeight * height
  };
};
export const createAnimatedValueXYForCorner = (corner, width, height, viewHeight) => {
  return new Animated.ValueXY(imageCoordinatesToViewCoordinates(corner, width, height, viewHeight));
};
export const getInitialValues = (corner, width, height, viewHeight) => {
  return imageCoordinatesToViewCoordinates(corner, width, height, viewHeight);
};
//# sourceMappingURL=helpers.js.map