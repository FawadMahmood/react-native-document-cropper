import { Animated, Dimensions, PanResponder } from 'react-native';

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
    x: (corner.x._value / Dimensions.get('window').width) * width,
    // @ts-ignore
    y: (corner.y._value / viewHeight) * height,
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

export const createPanResponder = (
  corner: Animated.ValueXY,
  updateOverlayString: () => void,
  _zoomOnPoint: Animated.ValueXY
) => {
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      Animated.event(
        [
          null,
          {
            dx: corner.x,
            dy: corner.y,
          },
        ],
        { useNativeDriver: false }
      )(evt, gestureState);

      Animated.event(
        [
          null,
          {
            dx: _zoomOnPoint.x,
            dy: _zoomOnPoint.y,
          },
        ],
        { useNativeDriver: false }
      )(evt, gestureState);
      updateOverlayString();
    },
    onPanResponderRelease: () => {
      corner.flattenOffset();
      updateOverlayString();
    },
    onPanResponderGrant: () => {
      // @ts-ignore
      corner.setOffset({ x: corner.x._value, y: corner.y._value });
      corner.setValue({ x: 0, y: 0 });
    },
  });
};
