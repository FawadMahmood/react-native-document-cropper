import { Animated } from 'react-native';
type Coordinates = {
    x: number;
    y: number;
};
export declare const imageCoordinatesToViewCoordinates: (corner: Coordinates, width: number, height: number, viewHeight: number) => Coordinates;
export declare const viewCoordinatesToImageCoordinates: (corner: Coordinates, width: number, height: number, viewHeight: number) => Coordinates;
export declare const createAnimatedValueXYForCorner: (corner: Coordinates, width: number, height: number, viewHeight: number) => Animated.ValueXY;
export declare const getInitialValues: (corner: Coordinates, width: number, height: number, viewHeight: number) => Coordinates;
export {};
//# sourceMappingURL=helpers.d.ts.map