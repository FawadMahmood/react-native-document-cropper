import * as React from 'react';
import {
  Animated as RNAnimated,
  type ImageURISource,
  type PanResponderInstance,
} from 'react-native';
import { View, StyleSheet, Platform, Image, Dimensions } from 'react-native';
import { cropPhoto, resolveImagePath } from './';
import {
  createAnimatedValueXYForCorner,
  createPanResponder,
  viewCoordinatesToImageCoordinates,
} from './utils/helpers';
import Svg, { Polygon } from 'react-native-svg';
import { useImperativeHandle } from 'react';

const AnimatedPolygon = RNAnimated.createAnimatedComponent(Polygon);

export interface ImageCropperRefOut {
  crop: () => Promise<string>;
}

interface ImageCropperProps {
  source: ImageURISource;
}
// { props: { source }, ref }: ImageCropperProps

const ImageCropper = (
  { source }: ImageCropperProps,
  ref: React.Ref<ImageCropperRefOut>
) => {
  const panResponderTopLeft = React.useRef<PanResponderInstance | undefined>();
  const panResponderTopRight = React.useRef<PanResponderInstance | undefined>();
  const panResponderBottomLeft = React.useRef<
    PanResponderInstance | undefined
  >();
  const panResponderBottomRight = React.useRef<
    PanResponderInstance | undefined
  >();

  const [init, setInitalized] = React.useState<boolean>(false);
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [_imgHeight, setHeight] = React.useState(0);
  const [_imgWidth, setWidth] = React.useState(0);
  const [viewHeight, setViewHeight] = React.useState(0);

  const topLeft = React.useRef<RNAnimated.ValueXY | undefined>();
  const topRight = React.useRef<RNAnimated.ValueXY | undefined>();
  const bottomLeft = React.useRef<RNAnimated.ValueXY | undefined>();
  const bottomRight = React.useRef<RNAnimated.ValueXY | undefined>();
  const zoomOnPoint = React.useRef<RNAnimated.ValueXY>(
    new RNAnimated.ValueXY()
  );

  const [_overlayPositions, setOverlayPosition] = React.useState<string>('');

  React.useEffect(() => {
    initiateCropper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewHeight]);

  const updateOverlayString = () => {
    // @ts-ignore
    let topLeftx = topLeft.current?.x._value + topLeft.current?.x._offset;
    // @ts-ignore
    let topLefty = topLeft.current?.y._value + topLeft.current?.y._offset;
    // @ts-ignore
    let topRightx = topRight.current?.x._value + topRight.current?.x._offset;
    // @ts-ignore
    let topRighty = topRight.current?.y._value + topRight.current?.y._offset;

    let bottomRightx = // @ts-ignore
      bottomRight.current?.x._value + bottomRight.current?.x._offset;
    // @ts-ignore
    let bottomRighty = // @ts-ignore
      bottomRight.current?.y._value + bottomRight.current?.y._offset;
    // @ts-ignore
    let bottomLeftx = // @ts-ignore
      bottomLeft.current?.x._value + bottomLeft.current?.x._offset;
    // @ts-ignore
    let bottomLefty = // @ts-ignore
      bottomLeft.current?.y._value + bottomLeft.current?.y._offset;

    setOverlayPosition(
      `${topLeftx},${topLefty} ${topRightx},${topRighty} ${bottomRightx},${bottomRighty} ${bottomLeftx},${bottomLefty}`
    );
  };

  const initiateCropper = async () => {
    let imagePath = await resolveImagePath(source.uri as string);
    if (!imageUrl) setImageUrl(imagePath);
    else imagePath = imageUrl;

    Image.getSize(`file://` + imagePath, (width, height) => {
      setWidth(width);
      setHeight(height);
      setViewHeight(Dimensions.get('window').width * (height / width));

      const topL = createAnimatedValueXYForCorner(
        { x: 0, y: 0 },
        width,
        height,
        viewHeight
      );
      const topR = createAnimatedValueXYForCorner(
        { x: width, y: 0 },
        width,
        height,
        viewHeight
      );
      const bottomL = createAnimatedValueXYForCorner(
        { x: 0, y: height },
        width,
        height,
        viewHeight
      );
      const bottomR = createAnimatedValueXYForCorner(
        { x: width, y: height },
        width,
        height,
        viewHeight
      );

      const zoomOnPointVal = createAnimatedValueXYForCorner(
        { x: 0, y: 0 },
        width,
        height,
        viewHeight
      );

      topLeft.current = topL;
      topRight.current = topR;
      bottomLeft.current = bottomL;
      bottomRight.current = bottomR;
      zoomOnPoint.current = zoomOnPointVal;

      panResponderTopLeft.current = createPanResponder(
        topL,
        updateOverlayString,
        zoomOnPointVal
      );

      panResponderTopRight.current = createPanResponder(
        topR,
        updateOverlayString,
        zoomOnPointVal
      );

      panResponderBottomLeft.current = createPanResponder(
        bottomL,
        updateOverlayString,
        zoomOnPointVal
      );

      panResponderBottomRight.current = createPanResponder(
        bottomR,
        updateOverlayString,
        zoomOnPointVal
      );
      // Access values directly
      const topLeftX = topL.x;
      const topLeftY = topL.y;
      const topRightX = topR.x;
      const topRightY = topR.y;
      const bottomLeftX = bottomL.x;
      const bottomLeftY = bottomL.y;
      const bottomRightX = bottomR.x;
      const bottomRightY = bottomR.y;

      setOverlayPosition(
        // @ts-ignore
        `${topLeftX._value},${topLeftY._value} ${topRightX._value},${topRightY._value} ${bottomRightX._value},${bottomRightY._value} ${bottomLeftX._value},${bottomLeftY._value}`
      );

      setInitalized(true);
    });
  };

  const renderPoints = React.useCallback(() => {
    return (
      <>
        <RNAnimated.View
          {...panResponderTopLeft.current?.panHandlers}
          style={[
            topLeft.current?.getLayout(),
            styles.imageCropperPointContainer,
          ]}
        >
          <View style={styles.imageCropperPoint} />
        </RNAnimated.View>

        <RNAnimated.View
          {...panResponderTopRight.current?.panHandlers}
          style={[
            topRight.current?.getLayout(),
            styles.imageCropperPointContainer,
          ]}
        >
          <View style={styles.imageCropperPoint} />
        </RNAnimated.View>

        <RNAnimated.View
          {...panResponderBottomLeft.current?.panHandlers}
          style={[
            bottomLeft.current?.getLayout(),
            styles.imageCropperPointContainer,
          ]}
        >
          <View style={styles.imageCropperPoint} />
        </RNAnimated.View>

        <RNAnimated.View
          {...panResponderBottomRight.current?.panHandlers}
          style={[
            bottomRight.current?.getLayout(),
            styles.imageCropperPointContainer,
          ]}
        >
          <View style={styles.imageCropperPoint} />
        </RNAnimated.View>
      </>
    );
  }, []);

  const publicRef: ImageCropperRefOut = {
    crop: () => {
      return new Promise(async () => {
        const coordinates = {
          topLeft: viewCoordinatesToImageCoordinates(
            // @ts-ignore
            topLeft.current,
            _imgWidth,
            _imgHeight,
            viewHeight
          ),
          topRight: viewCoordinatesToImageCoordinates(
            // @ts-ignore
            topRight.current,
            _imgWidth,
            _imgHeight,
            viewHeight
          ),
          bottomLeft: viewCoordinatesToImageCoordinates(
            // @ts-ignore
            bottomLeft.current,
            _imgWidth,
            _imgHeight,
            viewHeight
          ),
          bottomRight: viewCoordinatesToImageCoordinates(
            // @ts-ignore
            bottomRight.current,
            _imgWidth,
            _imgHeight,
            viewHeight
          ),
          height: _imgHeight,
          width: _imgWidth,
        };

        const newPhotoUrl = await cropPhoto(coordinates, imageUrl);
        console.log('newPhotoUrl', newPhotoUrl);
        setImageUrl(newPhotoUrl);
        initiateCropper();
      });
    },
  };

  useImperativeHandle(ref, () => publicRef);

  if (!init) {
    return null;
  }

  const heightStyle = {
    height: viewHeight,
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'file://' + imageUrl }}
        resizeMode={Platform.OS === 'ios' ? 'stretch' : 'stretch'}
        style={{ ...styles.img, ...heightStyle }}
        fadeDuration={0}
      />

      <Svg
        height={viewHeight}
        width={Dimensions.get('window').width}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        <AnimatedPolygon
          fill={'blue'}
          fillOpacity={0.3}
          stroke={CROPPER_COLOR}
          points={_overlayPositions}
          strokeWidth={3}
        />
      </Svg>

      {renderPoints()}
    </View>
  );
};

export default React.forwardRef(ImageCropper);

const IMAGE_CROPPER_POINT_CONTAINER_SIZE = 100;
const IMAGE_CROPPER_POINT_SIZE = 20;

const CROPPER_COLOR = 'rgba(0,255,0, 0.8)';

const ZOOM_CONTAINER_SIZE = 120;
const ZOOM_CONTAINER_BORDER_WIDTH = 2;
const ZOOM_CURSOR_SIZE = 10;
const ZOOM_CURSOR_BORDER_SIZE = 1;

const styles = StyleSheet.create({
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
    // elevation: 2,
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
    top: -100,
    left: 0,
    width: ZOOM_CONTAINER_SIZE,
    height: ZOOM_CONTAINER_SIZE,
    borderRadius: ZOOM_CONTAINER_SIZE / 2,
    borderColor: 'white',
    borderWidth: ZOOM_CONTAINER_BORDER_WIDTH,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  zoomCursor: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  zoomCursorHorizontal: {
    width: ZOOM_CURSOR_SIZE,
    height: ZOOM_CURSOR_BORDER_SIZE,
    backgroundColor: CROPPER_COLOR,
  },
  zoomCursorVertical: {
    width: ZOOM_CURSOR_BORDER_SIZE,
    height: ZOOM_CURSOR_SIZE,
    marginTop: -ZOOM_CURSOR_SIZE / 2,
    backgroundColor: CROPPER_COLOR,
  },
});
