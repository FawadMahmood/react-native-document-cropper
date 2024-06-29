import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { ConvertedImageResponse, CroppedPhotoResponse } from './types';
import type { UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): Promise<number>;
  resolveImagePath(image: string): Promise<string>;
  crop(points: UnsafeObject, image: string): Promise<CroppedPhotoResponse>;
  svgStringToJpg(svgString: String): Promise<ConvertedImageResponse>;
  bmpFileToJpg(filePath: string): Promise<ConvertedImageResponse>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('DocumentCropper');
