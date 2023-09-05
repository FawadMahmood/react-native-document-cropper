import * as React from 'react';
import type { ImageURISource } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';

interface DocumentCropperProps {
  source: ImageURISource;
}

const DocumentCropper = ({ source  }: DocumentCropperProps) => {
  console.log(source);
  return (
    <View style={styles.container}>
      <Text>DocumentCropper</Text>
    </View>
  );
};

export default DocumentCropper;

const styles = StyleSheet.create({
  container: {}
});
