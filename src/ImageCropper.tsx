import * as React from 'react';
import { type ImageURISource } from 'react-native';
import { View, StyleSheet, Platform, Image, Dimensions } from 'react-native';
import { cropPhoto, resolveImagePath } from './';
import {
  getInitialValues,
  viewCoordinatesToImageCoordinates,
} from './utils/helpers';
import { useImperativeHandle } from 'react';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

const WINDOW_WIDTH = Dimensions.get('window').width;
export interface ImageCropperRefOut {
  crop: () => Promise<string>;
}
interface ImageCropperProps {
  source: ImageURISource;
  cropperSignColor?: string;
  pointSize?: number;
}

const ImageCropper = (
  { source, cropperSignColor, pointSize }: ImageCropperProps,
  ref: React.Ref<ImageCropperRefOut>
) => {
  const [init, setInit] = React.useState(false);
  const TOP_LEFT = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const TOP_RIGHT = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const BOTTOM_LEFT = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const BOTTOM_RIGHT = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const ZOOM_CONTAINER = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const ZOOM_SIGN_OPACITY_ANIM = useSharedValue(0);

  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [_imgHeight, setHeight] = React.useState(0);
  const [_imgWidth, setWidth] = React.useState(0);
  const [viewHeight, setViewHeight] = React.useState(0);

  React.useEffect(() => {
    initiateCropper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewHeight]);

  const initiateCropper = async () => {
    let imagePath = await resolveImagePath(source.uri as string);
    if (!imageUrl) setImageUrl(imagePath);
    else imagePath = imageUrl;
    Image.getSize(`file://` + imagePath, (width, height) => {
      setWidth(width);
      setHeight(height);
      setViewHeight(Dimensions.get('window').width * (height / width));

      // setting top left initial values
      const topLeftValues = getInitialValues(
        { x: 0, y: 0 },
        width,
        height,
        viewHeight
      );
      const topRightValues = getInitialValues(
        { x: width, y: 0 },
        width,
        height,
        viewHeight
      );
      const bottomLeftValues = getInitialValues(
        { x: 0, y: height },
        width,
        height,
        viewHeight
      );
      const bottomRightValues = getInitialValues(
        { x: width, y: height },
        width,
        height,
        viewHeight
      );
      TOP_LEFT.x.value = topLeftValues.x;
      TOP_LEFT.y.value = topLeftValues.y;
      TOP_RIGHT.x.value = topRightValues.x;
      TOP_RIGHT.y.value = topRightValues.y;
      BOTTOM_LEFT.x.value = bottomLeftValues.x;
      BOTTOM_LEFT.y.value = bottomLeftValues.y;
      BOTTOM_RIGHT.x.value = bottomRightValues.x;
      BOTTOM_RIGHT.y.value = bottomRightValues.y;
      // setting top left initial values

      setInit(true);
    });
  };

  const createAnimatedPanGesture = (node: any) => {
    return Gesture.Pan()
      .onChange((event) => {
        node.x.value += event.changeX;
        node.y.value += event.changeY;

        ZOOM_CONTAINER.x.value = node.x.value;
        ZOOM_CONTAINER.y.value = node.y.value;
      })
      .onBegin(() => {
        ZOOM_SIGN_OPACITY_ANIM.value = withTiming(1);
      })
      .onFinalize(() => {
        ZOOM_SIGN_OPACITY_ANIM.value = withTiming(0);
      });
  };

  const renderPoints = React.useCallback((nodes: any) => {
    return nodes.map((node: any, index: number) => {
      return (
        <GestureDetector
          key={index + 'pointer'}
          gesture={createAnimatedPanGesture(node)}
        >
          <Animated.View
            style={[
              {
                transform: [
                  { translateX: node.x as any },
                  { translateY: node.y as any },
                ],
              },
              styles.imageCropperPointContainer,
            ]}
          >
            <View style={styles.imageCropperPoint} />
          </Animated.View>
        </GestureDetector>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const publicRef: ImageCropperRefOut = {
    crop: () => {
      return new Promise(async () => {
        const coordinates = {
          topLeft: viewCoordinatesToImageCoordinates(
            // @ts-ignore
            { x: TOP_LEFT.x.value, y: TOP_LEFT.y.value },
            _imgWidth,
            _imgHeight,
            viewHeight
          ),
          topRight: viewCoordinatesToImageCoordinates(
            // @ts-ignore
            { x: TOP_RIGHT.x.value, y: TOP_RIGHT.y.value },
            _imgWidth,
            _imgHeight,
            viewHeight
          ),
          bottomLeft: viewCoordinatesToImageCoordinates(
            // @ts-ignore
            { x: BOTTOM_LEFT.x.value, y: BOTTOM_LEFT.y.value },
            _imgWidth,
            _imgHeight,
            viewHeight
          ),
          bottomRight: viewCoordinatesToImageCoordinates(
            // @ts-ignore
            { x: BOTTOM_RIGHT.x.value, y: BOTTOM_RIGHT.y.value },
            _imgWidth,
            _imgHeight,
            viewHeight
          ),
          height: _imgHeight,
          width: _imgWidth,
        };

        const newPhotoUrl = await cropPhoto(coordinates, imageUrl);
        setImageUrl(newPhotoUrl);
        initiateCropper();
      });
    },
  };

  useImperativeHandle(ref, () => publicRef);

  const heightStyle = {
    height: viewHeight,
  };

  const color = 'rgba(97, 218, 251, .5)';

  const path = useDerivedValue(() => {
    const p = Skia.Path.Make();
    p.moveTo(TOP_LEFT.x.value, TOP_LEFT.y.value);
    p.lineTo(BOTTOM_LEFT.x.value, BOTTOM_LEFT.y.value);
    p.lineTo(BOTTOM_RIGHT.x.value, BOTTOM_RIGHT.y.value);
    p.lineTo(TOP_RIGHT.x.value, TOP_RIGHT.y.value);
    p.lineTo(TOP_LEFT.x.value, TOP_LEFT.y.value);
    p.close();

    return p;
  });

  const animatedZoomImage = useAnimatedStyle(() => {
    const adjustment = ZOOM_CONTAINER_SIZE / 2;

    return {
      marginLeft:
        -ZOOM_CONTAINER.x.value + adjustment - ZOOM_CURSOR_BORDER_SIZE,
      marginTop: -ZOOM_CONTAINER.y.value + adjustment - ZOOM_CURSOR_SIZE / 2,
    };
  });

  const animatedZoomImageContainer = useAnimatedStyle(() => {
    const adjustment = ZOOM_CONTAINER_SIZE / 2;
    const leftVaue = ZOOM_CONTAINER.x.value - adjustment - 50;
    return {
      left: leftVaue < 0 ? 0 : leftVaue,
      top: ZOOM_CONTAINER.y.value + 4,
      opacity: ZOOM_SIGN_OPACITY_ANIM.value,
    };
  });

  if (!init) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.containerT}>
      <View style={styles.containerT}>
        <View style={styles.container}>
          {imageUrl && (
            <Image
              source={{ uri: 'file://' + imageUrl }}
              resizeMode={Platform.OS === 'ios' ? 'stretch' : 'stretch'}
              style={{ ...styles.img, ...heightStyle }}
              fadeDuration={0}
            />
          )}

          {imageUrl && (
            <Canvas style={dynamicStyles({ viewHeight }).canvas}>
              <Path path={path} color={color} />
            </Canvas>
          )}

          {renderPoints([TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT])}
        </View>
        {imageUrl && (
          <Animated.View
            style={[styles.zoomContainer, animatedZoomImageContainer]}
          >
            <Animated.Image
              source={{ uri: imageUrl }}
              resizeMode={Platform.OS === 'ios' ? 'stretch' : 'cover'}
              style={[
                {
                  width: WINDOW_WIDTH,
                  height: viewHeight,
                },
                animatedZoomImage,
              ]}
            />
            {/* Cursor */}
            <View style={styles.zoomSign}>
              <View
                style={
                  dynamicStyles({ cropperSignColor, pointSize })
                    .zoomSignHorizontal
                }
              />
              <View
                style={
                  dynamicStyles({ cropperSignColor, pointSize })
                    .zoomSignVertical
                }
              />
            </View>
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default React.forwardRef(ImageCropper);

const IMAGE_CROPPER_POINT_CONTAINER_SIZE = 100;
const IMAGE_CROPPER_POINT_SIZE = 20;

const CROPPER_COLOR = 'rgba(255,90,90, 0.8)';

const ZOOM_CONTAINER_SIZE = 120;
const ZOOM_CONTAINER_BORDER_WIDTH = 2;
const ZOOM_CURSOR_SIZE = 20;
const ZOOM_CURSOR_BORDER_SIZE = 2;

const dynamicStyles = ({ viewHeight, cropperSignColor, pointSize }: any) => {
  return StyleSheet.create({
    canvas: { height: viewHeight, position: 'absolute', width: '100%' },
    zoomSignHorizontal: {
      width: pointSize || ZOOM_CURSOR_SIZE,
      height: ZOOM_CURSOR_BORDER_SIZE,
      backgroundColor: cropperSignColor || CROPPER_COLOR,
    },
    zoomSignVertical: {
      width: ZOOM_CURSOR_BORDER_SIZE,
      height: pointSize || ZOOM_CURSOR_SIZE,
      marginTop: -(pointSize || ZOOM_CURSOR_SIZE) / 2,
      backgroundColor: cropperSignColor || CROPPER_COLOR,
    },
  });
};

const styles = StyleSheet.create({
  containerT: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    transform: [
      {
        scale: 0.95,
      },
    ],
  },
  img: {
    width: '100%',
  },
  handler: {
    height: 20,
    width: 140,
    overflow: 'visible',
    marginLeft: -70,
    marginTop: -70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  handlerI: {
    borderRadius: 0,
    height: 20,
    width: 20,
    backgroundColor: 'blue',
  },
  handlerIExtras: { left: -10, top: -10 },
  handlerRound: {
    width: 39,
    position: 'absolute',
    height: 39,
    borderRadius: 100,
    backgroundColor: 'blue',
  },
  handlerRoundExtras: { left: 31, top: 31 },
  imageCropperPointContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: IMAGE_CROPPER_POINT_CONTAINER_SIZE,
    height: IMAGE_CROPPER_POINT_CONTAINER_SIZE,
    marginTop: -IMAGE_CROPPER_POINT_CONTAINER_SIZE / 2,
    marginLeft: -IMAGE_CROPPER_POINT_CONTAINER_SIZE / 2,
    zIndex: 2,
  },
  imageCropperPoint: {
    width: IMAGE_CROPPER_POINT_SIZE,
    height: IMAGE_CROPPER_POINT_SIZE,
    borderRadius: IMAGE_CROPPER_POINT_SIZE / 2,
    backgroundColor: 'rgba(0, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: CROPPER_COLOR,
  },
  zoomContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    width: ZOOM_CONTAINER_SIZE,
    height: ZOOM_CONTAINER_SIZE,
    borderRadius: ZOOM_CONTAINER_SIZE / 2,
    borderColor: 'white',
    borderWidth: ZOOM_CONTAINER_BORDER_WIDTH,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  zoomSign: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});
