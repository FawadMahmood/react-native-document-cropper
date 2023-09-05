import * as React from 'react';
import type { ImageURISource } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';

interface ImageCropperProps {
  source: ImageURISource;
}

const ImageCropper = ({ source }: ImageCropperProps) => {
  console.log(source);
  return (
    <View style={styles.container}>
      <Text>{ImageCropper}</Text>
    </View>
  );
};

export default ImageCropper;

const styles = StyleSheet.create({
  container: {},
});
