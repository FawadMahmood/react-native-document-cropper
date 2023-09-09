import ImageCropper from './ImageCropper';
import type { CroppedPhotoResponse, IPoints } from './types';
export declare function multiply(a: number, b: number): Promise<number>;
export declare function resolveImagePath(image: string): Promise<string>;
export declare function cropPhoto(points: IPoints, image: string): Promise<CroppedPhotoResponse>;
export default ImageCropper;
//# sourceMappingURL=index.d.ts.map