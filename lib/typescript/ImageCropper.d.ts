import * as React from 'react';
import type { ImageURISource } from 'react-native';
import type { CroppedPhotoResponse } from './types';
export interface ImageCropperRefOut {
    crop: () => Promise<CroppedPhotoResponse>;
}
interface ImageCropperProps {
    source: ImageURISource;
    cropperSignColor?: string;
    pointSize?: number;
    fillColor?: string;
    handleBgColor?: string;
    handleBorderColor?: string;
}
declare const _default: React.ForwardRefExoticComponent<ImageCropperProps & React.RefAttributes<ImageCropperRefOut>>;
export default _default;
//# sourceMappingURL=ImageCropper.d.ts.map