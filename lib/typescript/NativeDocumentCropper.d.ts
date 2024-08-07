/// <reference types="react-native/types/modules/codegen" />
import type { TurboModule } from 'react-native';
import type { ConvertedImageResponse, CroppedPhotoResponse } from './types';
import type { UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes';
export interface Spec extends TurboModule {
    multiply(a: number, b: number): Promise<number>;
    resolveImagePath(image: string): Promise<string>;
    crop(points: UnsafeObject, image: string): Promise<CroppedPhotoResponse>;
    svgStringToJpg(svgString: String): Promise<ConvertedImageResponse>;
    bmpFileToJpg(filePath: string): Promise<ConvertedImageResponse>;
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeDocumentCropper.d.ts.map