package com.documentcropper;

import androidx.annotation.NonNull;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Picture;
import android.os.Environment;
import android.util.Base64;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

import java.io.ByteArrayOutputStream;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PointF;
import android.os.Bundle;
import android.util.Log;

import com.caverock.androidsvg.SVG;
import com.caverock.androidsvg.SVGParseException;

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
  public void svgStringToJpg(String svgString, Promise promise) {
    Bitmap bitmap = this.convertSvgToBitmap(svgString);

    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
    byte[] byteArray = byteArrayOutputStream.toByteArray();

    // Generate a random file name
    String randomFileName = UUID.randomUUID().toString() + ".jpg";
    File imageFile = new File(this.context.getExternalFilesDir(Environment.DIRECTORY_PICTURES), randomFileName);

    try {
      FileOutputStream fileOutputStream = new FileOutputStream(imageFile);

      // Write the byte array to the FileOutputStream
      fileOutputStream.write(byteArray);

      // Close the FileOutputStream
      fileOutputStream.close();

      // Get the absolute file path of the created image file
      String imagePath = imageFile.getAbsolutePath();

      promise.resolve(imagePath);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public Bitmap convertSvgToBitmap(String svgContent) {
    try {
      SVG svg = SVG.getFromString(svgContent);
      Picture picture = svg.renderToPicture();
      Bitmap bitmap = Bitmap.createBitmap(picture.getWidth(), picture.getHeight(), Bitmap.Config.ARGB_8888);
      Canvas canvas = new Canvas(bitmap);
      canvas.drawColor(Color.WHITE);
      canvas.drawPicture(picture);
      return bitmap;
    } catch (SVGParseException e) {
      e.printStackTrace();
      return null;
    }
  }

  @ReactMethod
  public void crop(ReadableMap points, String imageUri, Promise promise) {
    // Log.d("PATH", imageUri);
    // Assuming you have your points as PointF objects
    PointF tl = new PointF((float) points.getMap("topLeft").getDouble("x"),
        (float) points.getMap("topLeft").getDouble("y"));
    PointF tr = new PointF((float) points.getMap("topRight").getDouble("x"),
        (float) points.getMap("topRight").getDouble("y"));
    PointF bl = new PointF((float) points.getMap("bottomLeft").getDouble("x"),
        (float) points.getMap("bottomLeft").getDouble("y"));
    PointF br = new PointF((float) points.getMap("bottomRight").getDouble("x"),
        (float) points.getMap("bottomRight").getDouble("y"));

    // Load the image
    Bitmap srcBitmap = BitmapFactory.decodeFile(imageUri.replace("file://", ""));

    // Define the new dimensions of the transformed image
    int newWidth = (int) Math.max(Math.hypot(tr.x - tl.x, tr.y - tl.y), Math.hypot(br.x - bl.x, br.y - bl.y));
    int newHeight = (int) Math.max(Math.hypot(bl.x - tl.x, bl.y - tl.y), Math.hypot(br.x - tr.x, br.y - tr.y));
    // Log.d("PATH", newWidth + "");
    // Log.d("PATH", newHeight + "");

    // Create a new Bitmap for the transformed image
    Bitmap dstBitmap = Bitmap.createBitmap(newWidth, newHeight, Bitmap.Config.ARGB_8888);

    // Create a Canvas to draw on the new Bitmap
    Canvas canvas = new Canvas(dstBitmap);

    // Create a Path representing the quadrilateral
    Path path = new Path();
    path.moveTo(tl.x, tl.y);
    path.lineTo(tr.x, tr.y);
    path.lineTo(br.x, br.y);
    path.lineTo(bl.x, bl.y);
    path.close();

    // Create a Paint object for drawing
    Paint paint = new Paint();
    paint.setAntiAlias(true);

    // Create a Matrix for perspective transformation
    Matrix matrix = new Matrix();
    matrix.setPolyToPoly(new float[] {
        tl.x, tl.y,
        tr.x, tr.y,
        br.x, br.y,
        bl.x, bl.y
    }, 0,
        new float[] {
            0, 0,
            newWidth, 0,
            newWidth, newHeight,
            0, newHeight
        }, 0, 4);

    // Apply the perspective transformation to the canvas
    canvas.concat(matrix);

    // Draw the original image onto the transformed canvas
    canvas.drawBitmap(srcBitmap, 0, 0, paint);

    // Now, 'dstBitmap' contains the perspective-transformed image
    // You can convert it to a byte array if needed
    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    dstBitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);

    byte[] byteArray = byteArrayOutputStream.toByteArray();

    // Generate a random file name
    String randomFileName = UUID.randomUUID().toString() + ".jpg";
    File imageFile = new File(this.context.getExternalFilesDir(Environment.DIRECTORY_PICTURES), randomFileName);

    try {
      // Create a FileOutputStream for the image file
      FileOutputStream fileOutputStream = new FileOutputStream(imageFile);

      // Write the byte array to the FileOutputStream
      fileOutputStream.write(byteArray);

      // Close the FileOutputStream
      fileOutputStream.close();

      // Get the absolute file path of the created image file
      String imagePath = imageFile.getAbsolutePath();

      WritableMap imageInfo = Arguments.createMap();
      imageInfo.putString("uri", imagePath);
      imageInfo.putDouble("width", newWidth);
      imageInfo.putDouble("height", newHeight);

      promise.resolve(imageInfo);
      // Now, 'imagePath' contains the absolute file path of the image file
    } catch (IOException e) {
      e.printStackTrace();
      // Handle any exceptions that may occur during file creation
    }
  }

  @ReactMethod
  public void resolveImagePath(String imageInput, Promise promise) {
    try {
      if (imageInput == null || imageInput.isEmpty()) {
        promise.resolve(imageInput);
      }

      // Check if the input is a base64 encoded string
      if (imageInput.startsWith("data:image")) {
        // Generate a random file name
        String randomFileName = UUID.randomUUID().toString() + ".jpg";
        File imagePath = new File(this.context.getExternalFilesDir(Environment.DIRECTORY_PICTURES), randomFileName);

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
      promise.resolve(imageInput);
    } catch (IOException e) {
      e.printStackTrace();
      promise.resolve("");
    }
  }
}
