#import "DocumentCropper.h"

@implementation DocumentCropper

RCT_EXPORT_MODULE()

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_EXPORT_METHOD(multiply:(double)a
                  b:(double)b
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSNumber *result = @(a * b);

    resolve(result);
}

RCT_EXPORT_METHOD(resolveImagePath:(NSString *)imageInput
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    if ([imageInput isEqualToString:@""]) {
        reject(@"INVALID_INPUT", @"Empty input", nil);
        return;
    }

    // Generate a random file name
    NSString *randomFileName = [[NSUUID UUID] UUIDString];
    randomFileName = [randomFileName stringByAppendingString:@".jpg"];

    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths firstObject];
    NSString *imagePath = [documentsDirectory stringByAppendingPathComponent:randomFileName];

    // Check if the input is a base64 encoded string
    if ([imageInput hasPrefix:@"data:image"]) {
        // Decode the base64 string and save it as a file
        NSArray *parts = [imageInput componentsSeparatedByString:@","];
        if (parts.count == 2) {
            NSData *data = [[NSData alloc] initWithBase64EncodedString:parts[1] options:NSDataBase64DecodingIgnoreUnknownCharacters];
            if (data) {
                NSError *error;
                if ([data writeToFile:imagePath options:NSDataWritingAtomic error:&error]) {
                    resolve(imagePath);
                } else {
                    reject(@"SAVE_ERROR", [NSString stringWithFormat:@"Error saving image: %@", error], nil);
                }
                return;
            }
        }
    } else if ([imageInput hasPrefix:@"file://"]) {
        // Handle file paths directly
        resolve([imageInput stringByReplacingOccurrencesOfString:@"file://" withString:@""]);
        return;
    }

    // Handle other cases or return nil if the input is not recognized
    reject(@"INVALID_INPUT", @"Invalid input format", nil);
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeDocumentCropperSpecJSI>(params);
}
#endif

@end
