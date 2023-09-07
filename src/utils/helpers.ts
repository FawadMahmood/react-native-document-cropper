import { Animated, Dimensions } from 'react-native';

type Coordinates = {
  x: number;
  y: number;
};

export const imageCoordinatesToViewCoordinates = (
  corner: Coordinates,
  width: number,
  height: number,
  viewHeight: number
): Coordinates => {
  return {
    x: (corner.x * Dimensions.get('window').width) / width,
    y: (corner.y * viewHeight) / height,
  };
};

export const viewCoordinatesToImageCoordinates = (
  corner: Coordinates,
  width: number,
  height: number,
  viewHeight: number
): Coordinates => {
  return {
    // @ts-ignore
    x: (corner.x / Dimensions.get('window').width) * width,
    // @ts-ignore
    y: (corner.y / viewHeight) * height,
  };
};

export const createAnimatedValueXYForCorner = (
  corner: Coordinates,
  width: number,
  height: number,
  viewHeight: number
) => {
  return new Animated.ValueXY(
    imageCoordinatesToViewCoordinates(corner, width, height, viewHeight)
  );
};

export const getInitialValues = (
  corner: Coordinates,
  width: number,
  height: number,
  viewHeight: number
) => {
  return imageCoordinatesToViewCoordinates(corner, width, height, viewHeight);
};
