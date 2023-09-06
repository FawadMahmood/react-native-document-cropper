import { NativeModules, Platform } from 'react-native';
import ImageCropper from './ImageCropper';

const LINKING_ERROR =
  `The package 'react-native-document-cropper' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const DocumentCropperModule = isTurboModuleEnabled
  ? require('./NativeDocumentCropper').default
  : NativeModules.DocumentCropper;

const DocumentCropper = DocumentCropperModule
  ? DocumentCropperModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return DocumentCropper.multiply(a, b);
}

export function resolveImagePath(image: string): Promise<string> {
  return DocumentCropper.resolveImagePath(image);
}

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

export function cropPhoto(points: IPoints, image: string): Promise<string> {
  return DocumentCropper.crop(points, image);
}

export default ImageCropper;
