
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNDocumentCropperSpec.h"

@interface DocumentCropper : NSObject <NativeDocumentCropperSpec>
#else
#import <React/RCTBridgeModule.h>

@interface DocumentCropper : NSObject <RCTBridgeModule>
#endif

@end
