"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cropPhoto = cropPhoto;
exports.default = void 0;
exports.multiply = multiply;
exports.resolveImagePath = resolveImagePath;
var _reactNative = require("react-native");
var _ImageCropper = _interopRequireDefault(require("./ImageCropper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const LINKING_ERROR = `The package 'react-native-document-cropper' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;
const DocumentCropperModule = isTurboModuleEnabled ? require('./NativeDocumentCropper').default : _reactNative.NativeModules.DocumentCropper;
const DocumentCropper = DocumentCropperModule ? DocumentCropperModule : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
function multiply(a, b) {
  return DocumentCropper.multiply(a, b);
}
function resolveImagePath(image) {
  return DocumentCropper.resolveImagePath(image);
}
function cropPhoto(points, image) {
  return DocumentCropper.crop(points, image);
}
var _default = _ImageCropper.default;
exports.default = _default;
//# sourceMappingURL=index.js.map