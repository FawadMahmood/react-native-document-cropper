import { NativeModules, Platform } from 'react-native';
import ImageCropper from './ImageCropper';
const LINKING_ERROR = `The package 'react-native-document-cropper' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;
const DocumentCropperModule = isTurboModuleEnabled ? require('./NativeDocumentCropper').default : NativeModules.DocumentCropper;
const DocumentCropper = DocumentCropperModule ? DocumentCropperModule : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
export function multiply(a, b) {
  return DocumentCropper.multiply(a, b);
}
export function resolveImagePath(image) {
  return DocumentCropper.resolveImagePath(image);
}
export function cropPhoto(points, image) {
  return DocumentCropper.crop(points, image);
}
export function svgStringToJpg(svgString) {
  return DocumentCropper.svgStringToJpg(svgString);
}
export function bmpFileToJpg(filePath) {
  return DocumentCropper.bmpFileToJpg(filePath);
}
export default ImageCropper;
//# sourceMappingURL=index.js.map