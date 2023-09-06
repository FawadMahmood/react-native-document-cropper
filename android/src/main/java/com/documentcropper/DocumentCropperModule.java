package com.documentcropper;

import androidx.annotation.NonNull;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Environment;
import android.util.Base64;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;


import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

import org.opencv.android.OpenCVLoader;
import org.opencv.android.Utils;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Point;
import org.opencv.core.Size;
import org.opencv.imgcodecs.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;



public class DocumentCropperModule extends DocumentCropperSpec {
  public static final String NAME = "DocumentCropper";
  ReactApplicationContext context;

  DocumentCropperModule(ReactApplicationContext context) {
    super(context);
    this.context = context;
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  public void multiply(double a, double b, Promise promise) {
    promise.resolve(a * b);
  }

  @ReactMethod
  public void resolveImagePath(String imageInput, Promise promise) {
      try {
        if (imageInput == null || imageInput.isEmpty()) {
            promise.resolve(imageInput);
        }

        // Generate a random file name
        String randomFileName = UUID.randomUUID().toString() + ".jpg";
        File imagePath = new File(this.context.getExternalFilesDir(Environment.DIRECTORY_PICTURES), randomFileName);

        // Check if the input is a base64 encoded string
        if (imageInput.startsWith("data:image")) {
            // Decode the base64 string and save it as a file
            String[] parts = imageInput.split(",");
            if (parts.length == 2) {
                String data = parts[1];
                byte[] imageData = Base64.decode(data, Base64.DEFAULT);

                FileOutputStream outputStream = new FileOutputStream(imagePath);
                outputStream.write(imageData);
                outputStream.close();

                promise.resolve(imagePath.getAbsolutePath());
            }
        } else if (imageInput.startsWith("file://")) {
            // Handle file paths directly
             promise.resolve(imageInput.replace("file://", ""));
        }

        // Handle other cases or return null if the input is not recognized
        promise.resolve("");
    } catch (IOException e) {
        e.printStackTrace();
        promise.resolve("");
    }
  }
}
