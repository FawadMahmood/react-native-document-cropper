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


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;


import org.opencv.android.OpenCVLoader;
import org.opencv.android.Utils;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Point;
import org.opencv.core.Size;
import org.opencv.imgcodecs.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

import java.io.ByteArrayOutputStream;



public class DocumentCropperModule extends DocumentCropperSpec {
  public static final String NAME = "DocumentCropper";
  ReactApplicationContext context;

  static {
    System.loadLibrary("opencv_java3");
  }

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
  public void crop(ReadableMap points, String imageUri, Promise promise) {

      Point tl = new Point(points.getMap("topLeft").getDouble("x"), points.getMap("topLeft").getDouble("y"));
      Point tr = new Point(points.getMap("topRight").getDouble("x"), points.getMap("topRight").getDouble("y"));
      Point bl = new Point(points.getMap("bottomLeft").getDouble("x"), points.getMap("bottomLeft").getDouble("y"));
      Point br = new Point(points.getMap("bottomRight").getDouble("x"), points.getMap("bottomRight").getDouble("y"));

      Mat src = Imgcodecs.imread(imageUri.replace("file://", ""), Imgproc.COLOR_BGR2RGB);
      Imgproc.cvtColor(src, src, Imgproc.COLOR_BGR2RGB);
      Imgproc.resize(src, src, new Size(points.getDouble("width"), points.getDouble("height")));

      boolean ratioAlreadyApplied = tr.x * (src.size().width / 500) < src.size().width;
      double ratio = ratioAlreadyApplied ? src.size().width / 500 : 1;

      double widthA = Math.sqrt(Math.pow(br.x - bl.x, 2) + Math.pow(br.y - bl.y, 2));
      double widthB = Math.sqrt(Math.pow(tr.x - tl.x, 2) + Math.pow(tr.y - tl.y, 2));

      double dw = Math.max(widthA, widthB);
      int maxWidth = Double.valueOf(dw).intValue();

      double heightA = Math.sqrt(Math.pow(tr.x - br.x, 2) + Math.pow(tr.y - br.y, 2));
      double heightB = Math.sqrt(Math.pow(tl.x - bl.x, 2) + Math.pow(tl.y - bl.y, 2));

      double dh = Math.max(heightA, heightB);
      int maxHeight = Double.valueOf(dh).intValue();

      Mat doc = new Mat(maxHeight, maxWidth, CvType.CV_8UC4);

      Mat src_mat = new Mat(4, 1, CvType.CV_32FC2);
      Mat dst_mat = new Mat(4, 1, CvType.CV_32FC2);

      src_mat.put(0, 0, tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y);
      dst_mat.put(0, 0, 0.0, 0.0, dw, 0.0, dw, dh, 0.0, dh);

      Mat m = Imgproc.getPerspectiveTransform(src_mat, dst_mat);

      Imgproc.warpPerspective(src, doc, m, doc.size());

      Bitmap bitmap = Bitmap.createBitmap(doc.cols(), doc.rows(), Bitmap.Config.ARGB_8888);
      Utils.matToBitmap(doc, bitmap);

      ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
      bitmap.compress(Bitmap.CompressFormat.JPEG, 70, byteArrayOutputStream);
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

        promise.resolve(imagePath);
        // Now, 'imagePath' contains the absolute file path of the image file
      } catch (IOException e) {
          e.printStackTrace();
          // Handle any exceptions that may occur during file creation
      }

      m.release();
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
