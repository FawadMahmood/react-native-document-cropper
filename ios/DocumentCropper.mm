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

RCT_EXPORT_METHOD(svgStringToJpg:(NSString *)svgString
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    SVGKImage *svgImage = [SVGKImage imageWithSource:[SVGKSourceString sourceFromContentsOfString:svgString]];
        UIImage *image = svgImage.UIImage;

        NSData *imageData = UIImageJPEGRepresentation(image, 1.0);
        NSString *randomFileName = [[NSUUID UUID] UUIDString];
        NSString *imagePath = [NSTemporaryDirectory() stringByAppendingPathComponent:[randomFileName stringByAppendingString:@".jpg"]];

        BOOL success = [imageData writeToFile:imagePath atomically:YES];

        if (success) {
            NSMutableDictionary *imageInfo = [[NSMutableDictionary alloc] init];
            [imageInfo setObject:imagePath forKey:@"uri"];
            [imageInfo setObject:@("image/jpg") forKey:@"type"];

            resolve(imageInfo);
        } else {
            reject(@"CONVERSION_FAILED", @"Failed to convert SVG to JPG", nil);
        }
}

RCT_EXPORT_METHOD(bmpFileToJpg:(NSString *)filePath
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSString *parsedImageUri = [filePath stringByReplacingOccurrencesOfString:@"file://" withString:@""];
        // Load the BMP image
        UIImage *srcImage = [UIImage imageWithContentsOfFile:parsedImageUri];

        // Ensure the image loaded successfully
        if (srcImage) {
            // Convert UIImage to JPG data
            NSData *jpegData = UIImageJPEGRepresentation(srcImage, 1.0);

            // Generate a random file name
            NSString *randomFileName = [[NSUUID UUID] UUIDString];
            NSString *jpgFilePath = [NSTemporaryDirectory() stringByAppendingPathComponent:[randomFileName stringByAppendingString:@".jpg"]];

            // Save the JPEG data to a file
            BOOL success = [jpegData writeToFile:jpgFilePath atomically:YES];

            if (success) {
                NSDictionary *imageInfo = @{
                    @"uri": jpgFilePath,
                    @"type": @"image/jpg"
                };
                resolve(imageInfo);
            } else {
                reject(@"CONVERSION_FAILED", @"Failed to save JPEG file", nil);
            }
        } else {
            reject(@"CONVERSION_FAILED", @"Failed to load BMP image", nil);
        }
    } @catch (NSException *exception) {
        reject(@"CONVERSION_FAILED", @"Error converting file type.", nil);
    }
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


RCT_EXPORT_METHOD(crop:(NSDictionary *)points imageUri:(NSString *)imageUri
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSString *parsedImageUri = [imageUri stringByReplacingOccurrencesOfString:@"file://" withString:@""];
    NSURL *fileURL = [NSURL fileURLWithPath:parsedImageUri];
    CIImage *ciImage = [CIImage imageWithContentsOfURL:fileURL];

    CGPoint newLeft = CGPointMake([points[@"topLeft"][@"x"] floatValue], [points[@"topLeft"][@"y"] floatValue]);
    CGPoint newRight = CGPointMake([points[@"topRight"][@"x"] floatValue], [points[@"topRight"][@"y"] floatValue]);
    CGPoint newBottomLeft = CGPointMake([points[@"bottomLeft"][@"x"] floatValue], [points[@"bottomLeft"][@"y"] floatValue]);
    CGPoint newBottomRight = CGPointMake([points[@"bottomRight"][@"x"] floatValue], [points[@"bottomRight"][@"y"] floatValue]);

    newLeft = [self cartesianForPoint:newLeft height:[points[@"height"] floatValue] ];
    newRight = [self cartesianForPoint:newRight height:[points[@"height"] floatValue] ];
    newBottomLeft = [self cartesianForPoint:newBottomLeft height:[points[@"height"] floatValue] ];
    newBottomRight = [self cartesianForPoint:newBottomRight height:[points[@"height"] floatValue] ];

    NSMutableDictionary *rectangleCoordinates = [[NSMutableDictionary alloc] init];

    rectangleCoordinates[@"inputTopLeft"] = [CIVector vectorWithCGPoint:newLeft];
    rectangleCoordinates[@"inputTopRight"] = [CIVector vectorWithCGPoint:newRight];
    rectangleCoordinates[@"inputBottomLeft"] = [CIVector vectorWithCGPoint:newBottomLeft];
    rectangleCoordinates[@"inputBottomRight"] = [CIVector vectorWithCGPoint:newBottomRight];

    ciImage = [ciImage imageByApplyingFilter:@"CIPerspectiveCorrection" withInputParameters:rectangleCoordinates];

    CIContext *context = [CIContext contextWithOptions:nil];
    CGImageRef cgimage = [context createCGImage:ciImage fromRect:[ciImage extent]];
    UIImage *image = [UIImage imageWithCGImage:cgimage];

    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSString *documentsDirectory = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
    NSString *imageSubdirectory = [documentsDirectory stringByAppendingPathComponent:@"DocumentCropper"];

    if (![fileManager fileExistsAtPath:imageSubdirectory]) {
      [fileManager createDirectoryAtPath:imageSubdirectory withIntermediateDirectories:YES attributes:nil error:nil];
    }

    // Generate a random file name
    NSString *randomFileName = [[NSUUID UUID] UUIDString];
    randomFileName = [randomFileName stringByAppendingString:@".jpg"];

    NSString *filePath = [imageSubdirectory stringByAppendingPathComponent:randomFileName];
    NSData *imageToEncode = UIImageJPEGRepresentation(image, 1);
    CGFloat newWidth = image.size.width;
    CGFloat newHeight = image.size.height;

    [imageToEncode writeToFile:filePath atomically:YES];

    NSMutableDictionary *imageInfo = [[NSMutableDictionary alloc] init];
    [imageInfo setObject:filePath forKey:@"uri"];
    [imageInfo setObject:@(newWidth) forKey:@"width"];
    [imageInfo setObject:@(newHeight) forKey:@"height"];

    // Now, 'imagePath' contains the absolute file path of the image file
    resolve(imageInfo);
}

- (CGPoint)cartesianForPoint:(CGPoint)point height:(float)height {
    return CGPointMake(point.x, height - point.y);
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
