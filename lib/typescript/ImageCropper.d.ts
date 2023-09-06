import * as React from 'react';
import { type ImageURISource } from 'react-native';
export interface ImageCropperRefOut {
    crop: () => Promise<string>;
}
interface ImageCropperProps {
    source: ImageURISource;
}
declare const _default: React.ForwardRefExoticComponent<ImageCropperProps & React.RefAttributes<ImageCropperRefOut>>;
export default _default;
//# sourceMappingURL=ImageCropper.d.ts.map