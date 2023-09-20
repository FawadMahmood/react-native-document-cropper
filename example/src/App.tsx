import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageCropper, { svgStringToJpg } from 'react-native-document-cropper';
import type { ImageCropperRefOut } from 'src/ImageCropper';
import { imageBase64, svgContent } from './constants';

export default function App() {
  const cropperRef = React.useRef<ImageCropperRefOut | undefined>();

  React.useEffect(() => {
    testSvgConversion();
  }, []);

  const testSvgConversion = async () =>{
    const svgConv = await svgStringToJpg(svgContent);
    console.log('svg', svgConv);
  };

  const onPressCrop = () => {
    cropperRef.current?.crop();
  };

  return (
    <View style={styles.container}>
      <ImageCropper
        ref={cropperRef as React.Ref<ImageCropperRefOut>}
        cropperSignColor="green"
        pointSize={20}
        source={{
          uri: imageBase64,
        }}
      />
      <TouchableOpacity onPress={onPressCrop}>
        <Text>CROP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
