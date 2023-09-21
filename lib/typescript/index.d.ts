import ImageCropper from './ImageCropper';
import type { ConvertedImageResponse, CroppedPhotoResponse, IPoints } from './types';
export declare function multiply(a: number, b: number): Promise<number>;
export declare function resolveImagePath(image: string): Promise<string>;
export declare function cropPhoto(points: IPoints, image: string): Promise<CroppedPhotoResponse>;
export declare function svgStringToJpg(svgString: String): Promise<ConvertedImageResponse>;
export declare function bmpFileToJpg(filePath: String): Promise<ConvertedImageResponse>;
export default ImageCropper;
//# sourceMappingURL=index.d.ts.map