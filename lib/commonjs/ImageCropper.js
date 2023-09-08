"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _ = require("./");
var _helpers = require("./utils/helpers");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeSvg = require("react-native-svg");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const AnimatedPath = _reactNativeReanimated.default.createAnimatedComponent(_reactNativeSvg.Path);
const WINDOW_WIDTH = _reactNative.Dimensions.get('window').width;
const ImageCropper = (_ref, ref) => {
  let {
    source,
    cropperSignColor,
    pointSize,
    fillColor,
    handleBgColor,
    handleBorderColor,
    noPreview
  } = _ref;
  const [init, setInit] = React.useState(false);
  const viewScaleX = (0, _reactNativeReanimated.useSharedValue)(0.9);
  const viewScaleY = (0, _reactNativeReanimated.useSharedValue)(0.95);
  const maxWidth = (0, _reactNativeReanimated.useSharedValue)(0);
  const maxHeight = (0, _reactNativeReanimated.useSharedValue)(0);
  const minWidth = (0, _reactNativeReanimated.useSharedValue)(0);
  const minHeight = (0, _reactNativeReanimated.useSharedValue)(0);
  const TOP_LEFT = {
    x: (0, _reactNativeReanimated.useSharedValue)(0),
    y: (0, _reactNativeReanimated.useSharedValue)(0)
  };
  const TOP_RIGHT = {
    x: (0, _reactNativeReanimated.useSharedValue)(0),
    y: (0, _reactNativeReanimated.useSharedValue)(0)
  };
  const BOTTOM_LEFT = {
    x: (0, _reactNativeReanimated.useSharedValue)(0),
    y: (0, _reactNativeReanimated.useSharedValue)(0)
  };
  const BOTTOM_RIGHT = {
    x: (0, _reactNativeReanimated.useSharedValue)(0),
    y: (0, _reactNativeReanimated.useSharedValue)(0)
  };
  const ZOOM_CONTAINER = {
    x: (0, _reactNativeReanimated.useSharedValue)(0),
    y: (0, _reactNativeReanimated.useSharedValue)(0)
  };
  const ZOOM_SIGN_OPACITY_ANIM = (0, _reactNativeReanimated.useSharedValue)(0);
  const [imageUrl, setImageUrl] = React.useState('');
  const [_imgHeight, setHeight] = React.useState(0);
  const [_imgWidth, setWidth] = React.useState(0);
  const [viewHeight, setViewHeight] = React.useState(0);
  React.useEffect(() => {
    initiateCropper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewHeight]);
  const initiateCropper = async () => {
    let imagePath = await (0, _.resolveImagePath)(source.uri);
    if (!imageUrl) setImageUrl(imagePath);else imagePath = imageUrl;
    _reactNative.Image.getSize(`file://` + imagePath, (width, height) => {
      setWidth(width);
      setHeight(height);
      setViewHeight(_reactNative.Dimensions.get('window').width * (height / width));

      // setting top left initial values
      const topLeftValues = (0, _helpers.getInitialValues)({
        x: 0,
        y: 0
      }, width, height, viewHeight);
      const topRightValues = (0, _helpers.getInitialValues)({
        x: width,
        y: 0
      }, width, height, viewHeight);
      const bottomLeftValues = (0, _helpers.getInitialValues)({
        x: 0,
        y: height
      }, width, height, viewHeight);
      const bottomRightValues = (0, _helpers.getInitialValues)({
        x: width,
        y: height
      }, width, height, viewHeight);
      minWidth.value = topLeftValues.x;
      maxWidth.value = bottomRightValues.x;
      minHeight.value = topRightValues.y;
      maxHeight.value = bottomRightValues.y;
      TOP_LEFT.x.value = (0, _reactNativeReanimated.withTiming)(topLeftValues.x);
      TOP_LEFT.y.value = (0, _reactNativeReanimated.withTiming)(topLeftValues.y);
      TOP_RIGHT.x.value = (0, _reactNativeReanimated.withTiming)(topRightValues.x);
      TOP_RIGHT.y.value = (0, _reactNativeReanimated.withTiming)(topRightValues.y);
      BOTTOM_LEFT.x.value = (0, _reactNativeReanimated.withTiming)(bottomLeftValues.x);
      BOTTOM_LEFT.y.value = (0, _reactNativeReanimated.withTiming)(bottomLeftValues.y);
      BOTTOM_RIGHT.x.value = (0, _reactNativeReanimated.withTiming)(bottomRightValues.x);
      BOTTOM_RIGHT.y.value = (0, _reactNativeReanimated.withTiming)(bottomRightValues.y);
      // setting top left initial values

      setInit(true);
    });
  };
  const createAnimatedPanGesture = node => {
    return _reactNativeGestureHandler.Gesture.Pan().onChange(event => {
      node.x.value += event.changeX;
      node.y.value += event.changeY;
      if (node.x.value > maxWidth.value) {
        node.x.value = maxWidth.value;
      }
      if (node.x.value < minWidth.value) {
        node.x.value = minWidth.value;
      }
      if (node.y.value > maxHeight.value) {
        node.y.value = maxHeight.value;
      }
      if (node.y.value < minHeight.value) {
        node.y.value = minHeight.value;
      }
      ZOOM_CONTAINER.x.value = node.x.value;
      ZOOM_CONTAINER.y.value = node.y.value;
    }).onBegin(() => {
      ZOOM_SIGN_OPACITY_ANIM.value = (0, _reactNativeReanimated.withTiming)(1);
    }).onFinalize(() => {
      ZOOM_SIGN_OPACITY_ANIM.value = (0, _reactNativeReanimated.withTiming)(0);
    });
  };
  const renderPoints = React.useCallback(nodes => {
    return nodes.map((node, index) => {
      return /*#__PURE__*/React.createElement(_reactNativeGestureHandler.GestureDetector, {
        key: index + 'pointer',
        gesture: createAnimatedPanGesture(node)
      }, /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
        style: [{
          transform: [{
            translateX: node.x
          }, {
            translateY: node.y
          }]
        }, styles.imageCropperPointContainer]
      }, /*#__PURE__*/React.createElement(_reactNative.View, {
        style: dynamicStyles({
          handleBgColor,
          handleBorderColor
        }).imageCropperPoint
      })));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const publicRef = {
    crop: () => {
      return new Promise(async resolve => {
        const coordinates = {
          topLeft: (0, _helpers.viewCoordinatesToImageCoordinates)(
          // @ts-ignore
          {
            x: TOP_LEFT.x.value,
            y: TOP_LEFT.y.value
          }, _imgWidth, _imgHeight, viewHeight),
          topRight: (0, _helpers.viewCoordinatesToImageCoordinates)(
          // @ts-ignore
          {
            x: TOP_RIGHT.x.value,
            y: TOP_RIGHT.y.value
          }, _imgWidth, _imgHeight, viewHeight),
          bottomLeft: (0, _helpers.viewCoordinatesToImageCoordinates)(
          // @ts-ignore
          {
            x: BOTTOM_LEFT.x.value,
            y: BOTTOM_LEFT.y.value
          }, _imgWidth, _imgHeight, viewHeight),
          bottomRight: (0, _helpers.viewCoordinatesToImageCoordinates)(
          // @ts-ignore
          {
            x: BOTTOM_RIGHT.x.value,
            y: BOTTOM_RIGHT.y.value
          }, _imgWidth, _imgHeight, viewHeight),
          height: _imgHeight,
          width: _imgWidth
        };
        const newPhotoUrl = await (0, _.cropPhoto)(coordinates, imageUrl);
        if (!noPreview) setImageUrl(newPhotoUrl);
        resolve(newPhotoUrl);
        initiateCropper();
      });
    }
  };
  (0, React.useImperativeHandle)(ref, () => publicRef);
  const heightStyle = {
    height: viewHeight
  };
  const color = 'rgba(97, 218, 251, .5)';
  const animatedZoomImage = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const adjustment = ZOOM_CONTAINER_SIZE / 2;
    return {
      marginLeft: -ZOOM_CONTAINER.x.value + adjustment - ZOOM_CURSOR_BORDER_SIZE,
      marginTop: -ZOOM_CONTAINER.y.value + adjustment - ZOOM_CURSOR_SIZE / 2
    };
  });
  const animatedProps = (0, _reactNativeReanimated.useAnimatedProps)(() => {
    // draw a circle
    const path = `
      M ${TOP_LEFT.x.value}, ${TOP_LEFT.y.value}
      L${BOTTOM_LEFT.x.value}, ${BOTTOM_LEFT.y.value}
      L${BOTTOM_RIGHT.x.value}, ${BOTTOM_RIGHT.y.value}
      L${TOP_RIGHT.x.value}, ${TOP_RIGHT.y.value}
      L${TOP_LEFT.x.value}, ${TOP_LEFT.y.value}
    `;
    return {
      d: path
    };
  });
  const animatedZoomImageContainer = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const adjustment = ZOOM_CONTAINER_SIZE / 2;
    const leftVaue = ZOOM_CONTAINER.x.value - adjustment - 50;
    return {
      left: leftVaue < 0 ? 0 : leftVaue,
      top: ZOOM_CONTAINER.y.value - 50,
      opacity: ZOOM_SIGN_OPACITY_ANIM.value
    };
  });
  const onLayout = React.useCallback(_ref2 => {
    let {
      nativeEvent
    } = _ref2;
    const {
      height
    } = nativeEvent.layout;
    if (height < viewHeight) {
      viewScaleY.value = (0, _reactNativeReanimated.withTiming)(0.72);
      viewScaleX.value = (0, _reactNativeReanimated.withTiming)(0.72);
    }
  }, [viewHeight, viewScaleX, viewScaleY]);
  const viewScaleAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      transform: [{
        scaleX: viewScaleX.value
      }, {
        scaleY: viewScaleY.value
      }]
    };
  });
  if (!init) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_reactNativeGestureHandler.GestureHandlerRootView, {
    style: styles.containerT,
    onLayout: onLayout
  }, /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.containerT
  }, /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
    style: [styles.container, viewScaleAnimatedStyle]
  }, imageUrl && /*#__PURE__*/React.createElement(_reactNative.Image, {
    source: {
      uri: 'file://' + imageUrl
    },
    resizeMode: _reactNative.Platform.OS === 'ios' ? 'stretch' : 'stretch',
    style: {
      ...styles.img,
      ...heightStyle
    },
    fadeDuration: 0
  }), imageUrl && /*#__PURE__*/React.createElement(_reactNativeSvg.Svg, {
    style: dynamicStyles({
      viewHeight
    }).canvas
  }, /*#__PURE__*/React.createElement(AnimatedPath, {
    fill: fillColor || color,
    animatedProps: animatedProps
  })), renderPoints([TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT])), imageUrl && /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
    style: [styles.zoomContainer, animatedZoomImageContainer]
  }, /*#__PURE__*/React.createElement(_reactNativeReanimated.default.Image, {
    source: {
      uri: 'file://' + imageUrl
    },
    resizeMode: _reactNative.Platform.OS === 'ios' ? 'stretch' : 'cover',
    style: [{
      width: WINDOW_WIDTH,
      height: viewHeight
    }, animatedZoomImage]
  }), /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.zoomSign
  }, /*#__PURE__*/React.createElement(_reactNative.View, {
    style: dynamicStyles({
      cropperSignColor,
      pointSize
    }).zoomSignHorizontal
  }), /*#__PURE__*/React.createElement(_reactNative.View, {
    style: dynamicStyles({
      cropperSignColor,
      pointSize
    }).zoomSignVertical
  })))));
};
var _default = /*#__PURE__*/React.forwardRef(ImageCropper);
exports.default = _default;
const IMAGE_CROPPER_POINT_CONTAINER_SIZE = 130;
const IMAGE_CROPPER_POINT_SIZE = 30;
const CROPPER_COLOR = 'rgba(255,90,90, 0.8)';
const ZOOM_CONTAINER_SIZE = 120;
const ZOOM_CONTAINER_BORDER_WIDTH = 2;
const ZOOM_CURSOR_SIZE = 20;
const ZOOM_CURSOR_BORDER_SIZE = 2;
const dynamicStyles = _ref3 => {
  let {
    viewHeight,
    cropperSignColor,
    pointSize,
    handleBgColor,
    handleBorderColor
  } = _ref3;
  return _reactNative.StyleSheet.create({
    canvas: {
      height: viewHeight,
      position: 'absolute',
      width: '100%'
    },
    zoomSignHorizontal: {
      width: pointSize || ZOOM_CURSOR_SIZE,
      height: ZOOM_CURSOR_BORDER_SIZE,
      backgroundColor: cropperSignColor || CROPPER_COLOR
    },
    zoomSignVertical: {
      width: ZOOM_CURSOR_BORDER_SIZE,
      height: pointSize || ZOOM_CURSOR_SIZE,
      marginTop: -(pointSize || ZOOM_CURSOR_SIZE) / 2,
      backgroundColor: cropperSignColor || CROPPER_COLOR
    },
    imageCropperPoint: {
      width: IMAGE_CROPPER_POINT_SIZE,
      height: IMAGE_CROPPER_POINT_SIZE,
      borderRadius: IMAGE_CROPPER_POINT_SIZE / 2,
      backgroundColor: handleBgColor || 'rgba(0, 255, 255, 0.5)',
      borderWidth: 1,
      borderColor: handleBorderColor || CROPPER_COLOR
    }
  });
};
const styles = _reactNative.StyleSheet.create({
  containerT: {
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    width: '100%',
    transform: [{
      scale: 0.95
    }]
  },
  img: {
    width: '100%'
  },
  handler: {
    height: 20,
    width: 140,
    overflow: 'visible',
    marginLeft: -70,
    marginTop: -70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  handlerI: {
    borderRadius: 0,
    height: 20,
    width: 20,
    backgroundColor: 'blue'
  },
  handlerIExtras: {
    left: -10,
    top: -10
  },
  handlerRound: {
    width: 39,
    position: 'absolute',
    height: 39,
    borderRadius: 100,
    backgroundColor: 'blue'
  },
  handlerRoundExtras: {
    left: 31,
    top: 31
  },
  imageCropperPointContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: IMAGE_CROPPER_POINT_CONTAINER_SIZE,
    height: IMAGE_CROPPER_POINT_CONTAINER_SIZE,
    marginTop: -IMAGE_CROPPER_POINT_CONTAINER_SIZE / 2,
    marginLeft: -IMAGE_CROPPER_POINT_CONTAINER_SIZE / 2,
    zIndex: 2
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
    backgroundColor: 'black'
  },
  zoomSign: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  }
});
//# sourceMappingURL=ImageCropper.js.map