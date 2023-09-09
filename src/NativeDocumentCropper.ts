import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { CroppedPhotoResponse, IPoints } from './types';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): Promise<number>;
  resolveImagePath(image: string): Promise<string>;
  crop(points: IPoints, image: string): Promise<CroppedPhotoResponse>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('DocumentCropper');
