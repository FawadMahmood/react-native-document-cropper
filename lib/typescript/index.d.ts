import ImageCropper from './ImageCropper';
export declare function multiply(a: number, b: number): Promise<number>;
export declare function resolveImagePath(image: string): Promise<string>;
export interface IPoints {
    topLeft: {
        x: number;
        y: number;
    };
    topRight: {
        x: number;
        y: number;
    };
    bottomLeft: {
        x: number;
        y: number;
    };
    bottomRight: {
        x: number;
        y: number;
    };
    height: number;
    width: number;
}
export declare function cropPhoto(points: IPoints, image: string): Promise<string>;
export default ImageCropper;
//# sourceMappingURL=index.d.ts.map