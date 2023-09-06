import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    multiply(a: number, b: number): Promise<number>;
    resolveImagePath(image: string): Promise<string>;
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeDocumentCropper.d.ts.map
