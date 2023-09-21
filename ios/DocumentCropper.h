
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNDocumentCropperSpec.h"

@interface DocumentCropper : NSObject <NativeDocumentCropperSpec>
#else
#import <React/RCTBridgeModule.h>
#import <Foundation/Foundation.h>

#import "React/RCTConvert.h"
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <React/RCTImageLoader.h>
#import <SVGKit/SVGKit.h>

@interface DocumentCropper : NSObject <RCTBridgeModule>
#endif

@end
