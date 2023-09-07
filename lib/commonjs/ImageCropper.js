"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _ = require("./");
var _helpers = require("./utils/helpers");
var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const AnimatedPolygon = _reactNative.Animated.createAnimatedComponent(_reactNativeSvg.Polygon);
// { props: { source }, ref }: ImageCropperProps

const ImageCropper = (_ref, ref) => {
  let {
    source
  } = _ref;
  const panResponderTopLeft = React.useRef();
  const panResponderTopRight = React.useRef();
  const panResponderBottomLeft = React.useRef();
  const panResponderBottomRight = React.useRef();
  const [init, setInitalized] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [_imgHeight, setHeight] = React.useState(0);
  const [_imgWidth, setWidth] = React.useState(0);
  const [viewHeight, setViewHeight] = React.useState(0);
  const topLeft = React.useRef();
  const topRight = React.useRef();
  const bottomLeft = React.useRef();
  const bottomRight = React.useRef();
  const zoomOnPoint = React.useRef(new _reactNative.Animated.ValueXY());
  const [_overlayPositions, setOverlayPosition] = React.useState('');
  React.useEffect(() => {
    initiateCropper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewHeight]);
  const updateOverlayString = () => {
    var _topLeft$current, _topLeft$current2, _topLeft$current3, _topLeft$current4, _topRight$current, _topRight$current2, _topRight$current3, _topRight$current4, _bottomRight$current, _bottomRight$current2, _bottomRight$current3, _bottomRight$current4, _bottomLeft$current, _bottomLeft$current2, _bottomLeft$current3, _bottomLeft$current4;
    // @ts-ignore
    let topLeftx = ((_topLeft$current = topLeft.current) === null || _topLeft$current === void 0 ? void 0 : _topLeft$current.x._value) + ((_topLeft$current2 = topLeft.current) === null || _topLeft$current2 === void 0 ? void 0 : _topLeft$current2.x._offset);
    // @ts-ignore
    let topLefty = ((_topLeft$current3 = topLeft.current) === null || _topLeft$current3 === void 0 ? void 0 : _topLeft$current3.y._value) + ((_topLeft$current4 = topLeft.current) === null || _topLeft$current4 === void 0 ? void 0 : _topLeft$current4.y._offset);
    // @ts-ignore
    let topRightx = ((_topRight$current = topRight.current) === null || _topRight$current === void 0 ? void 0 : _topRight$current.x._value) + ((_topRight$current2 = topRight.current) === null || _topRight$current2 === void 0 ? void 0 : _topRight$current2.x._offset);
    // @ts-ignore
    let topRighty = ((_topRight$current3 = topRight.current) === null || _topRight$current3 === void 0 ? void 0 : _topRight$current3.y._value) + ((_topRight$current4 = topRight.current) === null || _topRight$current4 === void 0 ? void 0 : _topRight$current4.y._offset);
    let bottomRightx =
    // @ts-ignore
    ((_bottomRight$current = bottomRight.current) === null || _bottomRight$current === void 0 ? void 0 : _bottomRight$current.x._value) + ((_bottomRight$current2 = bottomRight.current) === null || _bottomRight$current2 === void 0 ? void 0 : _bottomRight$current2.x._offset);
    // @ts-ignore
    let bottomRighty =
    // @ts-ignore
    ((_bottomRight$current3 = bottomRight.current) === null || _bottomRight$current3 === void 0 ? void 0 : _bottomRight$current3.y._value) + ((_bottomRight$current4 = bottomRight.current) === null || _bottomRight$current4 === void 0 ? void 0 : _bottomRight$current4.y._offset);
    // @ts-ignore
    let bottomLeftx =
    // @ts-ignore
    ((_bottomLeft$current = bottomLeft.current) === null || _bottomLeft$current === void 0 ? void 0 : _bottomLeft$current.x._value) + ((_bottomLeft$current2 = bottomLeft.current) === null || _bottomLeft$current2 === void 0 ? void 0 : _bottomLeft$current2.x._offset);
    // @ts-ignore
    let bottomLefty =
    // @ts-ignore
    ((_bottomLeft$current3 = bottomLeft.current) === null || _bottomLeft$current3 === void 0 ? void 0 : _bottomLeft$current3.y._value) + ((_bottomLeft$current4 = bottomLeft.current) === null || _bottomLeft$current4 === void 0 ? void 0 : _bottomLeft$current4.y._offset);
    setOverlayPosition(`${topLeftx},${topLefty} ${topRightx},${topRighty} ${bottomRightx},${bottomRighty} ${bottomLeftx},${bottomLefty}`);
  };
  const initiateCropper = async () => {
    let imagePath = await (0, _.resolveImagePath)(source.uri);
    if (!imageUrl) setImageUrl(imagePath);else imagePath = imageUrl;
    _reactNative.Image.getSize(`file://` + imagePath, (width, height) => {
      setWidth(width);
      setHeight(height);
      setViewHeight(_reactNative.Dimensions.get('window').width * (height / width));
      const topL = (0, _helpers.createAnimatedValueXYForCorner)({
        x: 0,
        y: 0
      }, width, height, viewHeight);
      const topR = (0, _helpers.createAnimatedValueXYForCorner)({
        x: width,
        y: 0
      }, width, height, viewHeight);
      const bottomL = (0, _helpers.createAnimatedValueXYForCorner)({
        x: 0,
        y: height
      }, width, height, viewHeight);
      const bottomR = (0, _helpers.createAnimatedValueXYForCorner)({
        x: width,
        y: height
      }, width, height, viewHeight);
      const zoomOnPointVal = (0, _helpers.createAnimatedValueXYForCorner)({
        x: 0,
        y: 0
      }, width, height, viewHeight);
      topLeft.current = topL;
      topRight.current = topR;
      bottomLeft.current = bottomL;
      bottomRight.current = bottomR;
      zoomOnPoint.current = zoomOnPointVal;
      panResponderTopLeft.current = (0, _helpers.createPanResponder)(topL, updateOverlayString, zoomOnPointVal);
      panResponderTopRight.current = (0, _helpers.createPanResponder)(topR, updateOverlayString, zoomOnPointVal);
      panResponderBottomLeft.current = (0, _helpers.createPanResponder)(bottomL, updateOverlayString, zoomOnPointVal);
      panResponderBottomRight.current = (0, _helpers.createPanResponder)(bottomR, updateOverlayString, zoomOnPointVal);
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
      `${topLeftX._value},${topLeftY._value} ${topRightX._value},${topRightY._value} ${bottomRightX._value},${bottomRightY._value} ${bottomLeftX._value},${bottomLeftY._value}`);
      setInitalized(true);
    });
  };
  const renderPoints = React.useCallback(() => {
    var _panResponderTopLeft$, _topLeft$current5, _panResponderTopRight, _topRight$current5, _panResponderBottomLe, _bottomLeft$current5, _panResponderBottomRi, _bottomRight$current5;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_reactNative.Animated.View, _extends({}, (_panResponderTopLeft$ = panResponderTopLeft.current) === null || _panResponderTopLeft$ === void 0 ? void 0 : _panResponderTopLeft$.panHandlers, {
      style: [(_topLeft$current5 = topLeft.current) === null || _topLeft$current5 === void 0 ? void 0 : _topLeft$current5.getLayout(), styles.imageCropperPointContainer]
    }), /*#__PURE__*/React.createElement(_reactNative.View, {
      style: styles.imageCropperPoint
    })), /*#__PURE__*/React.createElement(_reactNative.Animated.View, _extends({}, (_panResponderTopRight = panResponderTopRight.current) === null || _panResponderTopRight === void 0 ? void 0 : _panResponderTopRight.panHandlers, {
      style: [(_topRight$current5 = topRight.current) === null || _topRight$current5 === void 0 ? void 0 : _topRight$current5.getLayout(), styles.imageCropperPointContainer]
    }), /*#__PURE__*/React.createElement(_reactNative.View, {
      style: styles.imageCropperPoint
    })), /*#__PURE__*/React.createElement(_reactNative.Animated.View, _extends({}, (_panResponderBottomLe = panResponderBottomLeft.current) === null || _panResponderBottomLe === void 0 ? void 0 : _panResponderBottomLe.panHandlers, {
      style: [(_bottomLeft$current5 = bottomLeft.current) === null || _bottomLeft$current5 === void 0 ? void 0 : _bottomLeft$current5.getLayout(), styles.imageCropperPointContainer]
    }), /*#__PURE__*/React.createElement(_reactNative.View, {
      style: styles.imageCropperPoint
    })), /*#__PURE__*/React.createElement(_reactNative.Animated.View, _extends({}, (_panResponderBottomRi = panResponderBottomRight.current) === null || _panResponderBottomRi === void 0 ? void 0 : _panResponderBottomRi.panHandlers, {
      style: [(_bottomRight$current5 = bottomRight.current) === null || _bottomRight$current5 === void 0 ? void 0 : _bottomRight$current5.getLayout(), styles.imageCropperPointContainer]
    }), /*#__PURE__*/React.createElement(_reactNative.View, {
      style: styles.imageCropperPoint
    })));
  }, []);
  const publicRef = {
    crop: () => {
      return new Promise(async (resolve, reject) => {
        const coordinates = {
          topLeft: (0, _helpers.viewCoordinatesToImageCoordinates)(
          // @ts-ignore
          topLeft.current, _imgWidth, _imgHeight, viewHeight),
          topRight: (0, _helpers.viewCoordinatesToImageCoordinates)(
          // @ts-ignore
          topRight.current, _imgWidth, _imgHeight, viewHeight),
          bottomLeft: (0, _helpers.viewCoordinatesToImageCoordinates)(
          // @ts-ignore
          bottomLeft.current, _imgWidth, _imgHeight, viewHeight),
          bottomRight: (0, _helpers.viewCoordinatesToImageCoordinates)(
          // @ts-ignore
          bottomRight.current, _imgWidth, _imgHeight, viewHeight),
          height: _imgHeight,
          width: _imgWidth
        };
        const newPhotoUrl = await (0, _.cropPhoto)(coordinates, imageUrl);
        setImageUrl(newPhotoUrl);
        resolve(newPhotoUrl);
        initiateCropper();
      });
    }
  };
  (0, React.useImperativeHandle)(ref, () => publicRef);
  if (!init) {
    return null;
  }
  const heightStyle = {
    height: viewHeight
  };
  return /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(_reactNative.Image, {
    source: {
      uri: 'file://' + imageUrl
    },
    resizeMode: _reactNative.Platform.OS === 'ios' ? 'stretch' : 'stretch',
    style: {
      ...styles.img,
      ...heightStyle
    },
    fadeDuration: 0
  }), /*#__PURE__*/React.createElement(_reactNativeSvg.default, {
    height: viewHeight,
    width: _reactNative.Dimensions.get('window').width
    // eslint-disable-next-line react-native/no-inline-styles
    ,
    style: {
      position: 'absolute',
      left: 0,
      top: 0
    }
  }, /*#__PURE__*/React.createElement(AnimatedPolygon, {
    fill: 'blue',
    fillOpacity: 0.3,
    stroke: CROPPER_COLOR,
    points: _overlayPositions,
    strokeWidth: 3
  })), renderPoints());
};
var _default = /*#__PURE__*/React.forwardRef(ImageCropper);
exports.default = _default;
const IMAGE_CROPPER_POINT_CONTAINER_SIZE = 100;
const IMAGE_CROPPER_POINT_SIZE = 20;
const CROPPER_COLOR = 'rgba(0,255,0, 0.8)';
const ZOOM_CONTAINER_SIZE = 120;
const ZOOM_CONTAINER_BORDER_WIDTH = 2;
const ZOOM_CURSOR_SIZE = 10;
const ZOOM_CURSOR_BORDER_SIZE = 1;
const styles = _reactNative.StyleSheet.create({
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
    // elevation: 2,
  },

  imageCropperPoint: {
    width: IMAGE_CROPPER_POINT_SIZE,
    height: IMAGE_CROPPER_POINT_SIZE,
    borderRadius: IMAGE_CROPPER_POINT_SIZE / 2,
    backgroundColor: 'rgba(0, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: CROPPER_COLOR
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
    backgroundColor: 'black'
  },
  zoomCursor: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  zoomCursorHorizontal: {
    width: ZOOM_CURSOR_SIZE,
    height: ZOOM_CURSOR_BORDER_SIZE,
    backgroundColor: CROPPER_COLOR
  },
  zoomCursorVertical: {
    width: ZOOM_CURSOR_BORDER_SIZE,
    height: ZOOM_CURSOR_SIZE,
    marginTop: -ZOOM_CURSOR_SIZE / 2,
    backgroundColor: CROPPER_COLOR
  }
});
//# sourceMappingURL=ImageCropper.js.map
