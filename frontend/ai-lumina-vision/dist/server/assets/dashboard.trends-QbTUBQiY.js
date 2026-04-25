import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-CCute6b2.js";
import { r as reactDomExports, u as useRole, R as ROLE_META } from "./router-CPi72iO1.js";
import { B as Brain } from "./brain-CldqVx3I.js";
import { M as resolveDefaultProps, c as clsx, a1 as adaptEventsOfChild, bk as Surface, bl as Symbols, P as useAppSelector, bm as selectLegendPayload, aO as propsAreEqual, bn as useLegendPortal, bo as useMargin, bp as useElementOffset, bq as useChartWidth, br as useChartHeight, N as useAppDispatch, bs as setLegendSettings, bt as setLegendSize, bu as getUniqPayload, a as createSelector, i as selectChartLayout, bv as selectChartDataWithIndexesIfNotInPanoramaPosition4, aK as selectAxisWithScale, aL as selectTicksOfGraphicalItem, aM as selectUnfilteredCartesianItems, af as isCategoricalAxis, ag as getBandSizeOfAxis, at as DefaultZIndexes, V as useIsPanorama, aq as RegisterGraphicalItemId, aP as SetLegendPayload, aQ as SetCartesianGraphicalItem, az as getTooltipNameProp, aw as SetTooltipEntrySettings, Q as noop, aT as useNeedsClip, aU as usePlotArea, aR as useChartLayout, aV as getRadiusAndStrokeWidthFromDot, aW as isClipDot, Z as ZIndexLayer, W as Layer, aX as GraphicalItemClipPath, aY as ActivePoints, B as getValueByDataKey, aZ as getCateCoordinateOfLine, aa as isNullish, aA as useAnimationId, aB as JavascriptAnimate, aC as interpolate, aE as LabelListFromLabelProp, b1 as CartesianLabelListContextProvider, s as svgPropertiesAndEvents, a8 as Shape, Y as svgPropertiesNoEvents, b3 as Dots, bc as CartesianChart, bd as arrayTooltipSearcher, bf as ResponsiveContainer, bg as CartesianGrid, bh as XAxis, bi as YAxis, bj as Tooltip, be as ArrowUpRight } from "./CartesianChart-Ca-qlkki.js";
import { m as motion } from "./proxy-AGUjS2rb.js";
import { T as TrendingUp } from "./trending-up-CSlYU9Ah.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-BfcRJH-_.js";
function _extends$2() {
  return _extends$2 = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$2.apply(null, arguments);
}
function ownKeys$2(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$2(Object(t), true).forEach(function(r2) {
      _defineProperty$2(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$2(e, r, t) {
  return (r = _toPropertyKey$2(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$2(t) {
  var i = _toPrimitive$2(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$2(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var SIZE = 32;
var defaultLegendContentDefaultProps = {
  align: "center",
  iconSize: 14,
  inactiveColor: "#ccc",
  layout: "horizontal",
  verticalAlign: "middle",
  labelStyle: {}
};
function getStrokeDasharray$1(input) {
  if (typeof input === "object" && input !== null && "strokeDasharray" in input) {
    return String(input.strokeDasharray);
  }
  return void 0;
}
function Icon(_ref) {
  var {
    data,
    iconType,
    inactiveColor
  } = _ref;
  var halfSize = SIZE / 2;
  var sixthSize = SIZE / 6;
  var thirdSize = SIZE / 3;
  var color = data.inactive ? inactiveColor : data.color;
  var preferredIcon = iconType !== null && iconType !== void 0 ? iconType : data.type;
  if (preferredIcon === "none") {
    return null;
  }
  if (preferredIcon === "plainline") {
    return /* @__PURE__ */ reactExports.createElement("line", {
      strokeWidth: 4,
      fill: "none",
      stroke: color,
      strokeDasharray: getStrokeDasharray$1(data.payload),
      x1: 0,
      y1: halfSize,
      x2: SIZE,
      y2: halfSize,
      className: "recharts-legend-icon"
    });
  }
  if (preferredIcon === "line") {
    return /* @__PURE__ */ reactExports.createElement("path", {
      strokeWidth: 4,
      fill: "none",
      stroke: color,
      d: "M0,".concat(halfSize, "h").concat(thirdSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(2 * thirdSize, ",").concat(halfSize, "\n            H").concat(SIZE, "M").concat(2 * thirdSize, ",").concat(halfSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(thirdSize, ",").concat(halfSize),
      className: "recharts-legend-icon"
    });
  }
  if (preferredIcon === "rect") {
    return /* @__PURE__ */ reactExports.createElement("path", {
      stroke: "none",
      fill: color,
      d: "M0,".concat(SIZE / 8, "h").concat(SIZE, "v").concat(SIZE * 3 / 4, "h").concat(-SIZE, "z"),
      className: "recharts-legend-icon"
    });
  }
  if (/* @__PURE__ */ reactExports.isValidElement(data.legendIcon)) {
    var iconProps = _objectSpread$2({}, data);
    delete iconProps.legendIcon;
    return /* @__PURE__ */ reactExports.cloneElement(data.legendIcon, iconProps);
  }
  return /* @__PURE__ */ reactExports.createElement(Symbols, {
    fill: color,
    cx: halfSize,
    cy: halfSize,
    size: SIZE,
    sizeType: "diameter",
    type: preferredIcon
  });
}
function Items(props) {
  var {
    payload,
    iconSize,
    layout,
    formatter,
    inactiveColor,
    iconType,
    labelStyle
  } = props;
  var viewBox = {
    x: 0,
    y: 0,
    width: SIZE,
    height: SIZE
  };
  var itemStyle = {
    display: layout === "horizontal" ? "inline-block" : "block",
    marginRight: 10
  };
  var svgStyle = {
    display: "inline-block",
    verticalAlign: "middle",
    marginRight: 4
  };
  return payload.map((entry, i) => {
    var finalFormatter = entry.formatter || formatter;
    var className = clsx({
      "recharts-legend-item": true,
      ["legend-item-".concat(i)]: true,
      inactive: entry.inactive
    });
    if (entry.type === "none") {
      return null;
    }
    var finalLabelStyle = typeof labelStyle === "object" ? _objectSpread$2({}, labelStyle) : {};
    finalLabelStyle.color = entry.inactive ? inactiveColor : finalLabelStyle.color || entry.color;
    var finalValue = finalFormatter ? finalFormatter(entry.value, entry, i) : entry.value;
    return /* @__PURE__ */ reactExports.createElement("li", _extends$2({
      className,
      style: itemStyle,
      key: "legend-item-".concat(i)
    }, adaptEventsOfChild(props, entry, i)), /* @__PURE__ */ reactExports.createElement(Surface, {
      width: iconSize,
      height: iconSize,
      viewBox,
      style: svgStyle,
      "aria-label": "".concat(entry.value, " legend icon")
    }, /* @__PURE__ */ reactExports.createElement(Icon, {
      data: entry,
      iconType,
      inactiveColor
    })), /* @__PURE__ */ reactExports.createElement("span", {
      className: "recharts-legend-item-text",
      style: finalLabelStyle
    }, finalValue));
  });
}
var DefaultLegendContent = (outsideProps) => {
  var props = resolveDefaultProps(outsideProps, defaultLegendContentDefaultProps);
  var {
    payload,
    layout,
    align
  } = props;
  if (!payload || !payload.length) {
    return null;
  }
  var finalStyle = {
    padding: 0,
    margin: 0,
    textAlign: layout === "horizontal" ? align : "left"
  };
  return /* @__PURE__ */ reactExports.createElement("ul", {
    className: "recharts-default-legend",
    style: finalStyle
  }, /* @__PURE__ */ reactExports.createElement(Items, _extends$2({}, props, {
    payload
  })));
};
function useLegendPayload() {
  return useAppSelector(selectLegendPayload);
}
var _excluded$2 = ["contextPayload"];
function _extends$1() {
  return _extends$1 = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$1.apply(null, arguments);
}
function ownKeys$1(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$1(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$1(Object(t), true).forEach(function(r2) {
      _defineProperty$1(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$1(e, r, t) {
  return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$1(t) {
  var i = _toPrimitive$1(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$1(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties$2(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose$2(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose$2(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function defaultUniqBy(entry) {
  return entry.value;
}
function LegendContent(props) {
  var {
    contextPayload
  } = props, otherProps = _objectWithoutProperties$2(props, _excluded$2);
  var finalPayload = getUniqPayload(contextPayload, props.payloadUniqBy, defaultUniqBy);
  var contentProps = _objectSpread$1(_objectSpread$1({}, otherProps), {}, {
    payload: finalPayload
  });
  if (/* @__PURE__ */ reactExports.isValidElement(props.content)) {
    return /* @__PURE__ */ reactExports.cloneElement(props.content, contentProps);
  }
  if (typeof props.content === "function") {
    return /* @__PURE__ */ reactExports.createElement(props.content, contentProps);
  }
  return /* @__PURE__ */ reactExports.createElement(DefaultLegendContent, contentProps);
}
function getDefaultPosition(style, props, margin, chartWidth, chartHeight, box) {
  var {
    layout,
    align,
    verticalAlign
  } = props;
  var hPos, vPos;
  if (!style || (style.left === void 0 || style.left === null) && (style.right === void 0 || style.right === null)) {
    if (align === "center" && layout === "vertical") {
      hPos = {
        left: ((chartWidth || 0) - box.width) / 2
      };
    } else {
      hPos = align === "right" ? {
        right: margin && margin.right || 0
      } : {
        left: margin && margin.left || 0
      };
    }
  }
  if (!style || (style.top === void 0 || style.top === null) && (style.bottom === void 0 || style.bottom === null)) {
    if (verticalAlign === "middle") {
      vPos = {
        top: ((chartHeight || 0) - box.height) / 2
      };
    } else {
      vPos = verticalAlign === "bottom" ? {
        bottom: margin && margin.bottom || 0
      } : {
        top: margin && margin.top || 0
      };
    }
  }
  return _objectSpread$1(_objectSpread$1({}, hPos), vPos);
}
function LegendSettingsDispatcher(props) {
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    dispatch(setLegendSettings(props));
  }, [dispatch, props]);
  return null;
}
function LegendSizeDispatcher(props) {
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    dispatch(setLegendSize(props));
    return () => {
      dispatch(setLegendSize({
        width: 0,
        height: 0
      }));
    };
  }, [dispatch, props]);
  return null;
}
function getWidthOrHeight(layout, height, width, maxWidth) {
  if (layout === "vertical" && height != null) {
    return {
      height
    };
  }
  if (layout === "horizontal") {
    return {
      width: width || maxWidth
    };
  }
  return null;
}
var legendDefaultProps = {
  align: "center",
  iconSize: 14,
  inactiveColor: "#ccc",
  itemSorter: "value",
  layout: "horizontal",
  verticalAlign: "bottom"
};
function LegendImpl(outsideProps) {
  var props = resolveDefaultProps(outsideProps, legendDefaultProps);
  var contextPayload = useLegendPayload();
  var legendPortalFromContext = useLegendPortal();
  var margin = useMargin();
  var {
    width: widthFromProps,
    height: heightFromProps,
    wrapperStyle,
    portal: portalFromProps
  } = props;
  var [lastBoundingBox, updateBoundingBox] = useElementOffset([contextPayload]);
  var chartWidth = useChartWidth();
  var chartHeight = useChartHeight();
  if (chartWidth == null || chartHeight == null) {
    return null;
  }
  var maxWidth = chartWidth - ((margin === null || margin === void 0 ? void 0 : margin.left) || 0) - ((margin === null || margin === void 0 ? void 0 : margin.right) || 0);
  var widthOrHeight = getWidthOrHeight(props.layout, heightFromProps, widthFromProps, maxWidth);
  var outerStyle = portalFromProps ? wrapperStyle : _objectSpread$1(_objectSpread$1({
    position: "absolute",
    width: (widthOrHeight === null || widthOrHeight === void 0 ? void 0 : widthOrHeight.width) || widthFromProps || "auto",
    height: (widthOrHeight === null || widthOrHeight === void 0 ? void 0 : widthOrHeight.height) || heightFromProps || "auto"
  }, getDefaultPosition(wrapperStyle, props, margin, chartWidth, chartHeight, lastBoundingBox)), wrapperStyle);
  var legendPortal = portalFromProps !== null && portalFromProps !== void 0 ? portalFromProps : legendPortalFromContext;
  if (legendPortal == null || contextPayload == null) {
    return null;
  }
  var legendElement = /* @__PURE__ */ reactExports.createElement("div", {
    className: "recharts-legend-wrapper",
    style: outerStyle,
    ref: updateBoundingBox
  }, /* @__PURE__ */ reactExports.createElement(LegendSettingsDispatcher, {
    layout: props.layout,
    align: props.align,
    verticalAlign: props.verticalAlign,
    itemSorter: props.itemSorter
  }), !portalFromProps && /* @__PURE__ */ reactExports.createElement(LegendSizeDispatcher, {
    width: lastBoundingBox.width,
    height: lastBoundingBox.height
  }), /* @__PURE__ */ reactExports.createElement(LegendContent, _extends$1({}, props, widthOrHeight, {
    margin,
    chartWidth,
    chartHeight,
    contextPayload
  })));
  return /* @__PURE__ */ reactDomExports.createPortal(legendElement, legendPortal);
}
var Legend = /* @__PURE__ */ reactExports.memo(LegendImpl, propsAreEqual);
Legend.displayName = "Legend";
var _excluded$1 = ["children"];
function _objectWithoutProperties$1(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose$1(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose$1(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
var initialContextState = {
  data: [],
  xAxisId: "xAxis-0",
  yAxisId: "yAxis-0",
  dataPointFormatter: () => ({
    x: 0,
    y: 0,
    value: 0
  }),
  errorBarOffset: 0
};
var ErrorBarContext = /* @__PURE__ */ reactExports.createContext(initialContextState);
function SetErrorBarContext(props) {
  var {
    children
  } = props, rest = _objectWithoutProperties$1(props, _excluded$1);
  return /* @__PURE__ */ reactExports.createElement(ErrorBarContext.Provider, {
    value: rest
  }, children);
}
var selectXAxisWithScale = (state, xAxisId, _yAxisId, isPanorama) => selectAxisWithScale(state, "xAxis", xAxisId, isPanorama);
var selectXAxisTicks = (state, xAxisId, _yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, "xAxis", xAxisId, isPanorama);
var selectYAxisWithScale = (state, _xAxisId, yAxisId, isPanorama) => selectAxisWithScale(state, "yAxis", yAxisId, isPanorama);
var selectYAxisTicks = (state, _xAxisId, yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, "yAxis", yAxisId, isPanorama);
var selectBandSize = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
  if (isCategoricalAxis(layout, "xAxis")) {
    return getBandSizeOfAxis(xAxis, xAxisTicks, false);
  }
  return getBandSizeOfAxis(yAxis, yAxisTicks, false);
});
var pickLineId = (_state, _xAxisId, _yAxisId, _isPanorama, id) => id;
function isLineSettings(item) {
  return item.type === "line";
}
var selectSynchronisedLineSettings = createSelector([selectUnfilteredCartesianItems, pickLineId], (graphicalItems, id) => graphicalItems.filter(isLineSettings).find((x) => x.id === id));
var selectLinePoints = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks, selectSynchronisedLineSettings, selectBandSize, selectChartDataWithIndexesIfNotInPanoramaPosition4], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, lineSettings, bandSize, _ref) => {
  var {
    chartData,
    dataStartIndex,
    dataEndIndex
  } = _ref;
  if (lineSettings == null || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null || layout !== "horizontal" && layout !== "vertical") {
    return void 0;
  }
  var {
    dataKey,
    data
  } = lineSettings;
  var displayedData;
  if (data != null && data.length > 0) {
    displayedData = data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null) {
    return void 0;
  }
  return computeLinePoints({
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataKey,
    bandSize,
    displayedData
  });
});
var _excluded = ["id"], _excluded2 = ["type", "layout", "connectNulls", "needClip", "shape"], _excluded3 = ["activeDot", "animateNewValues", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "hide", "isAnimationActive", "label", "legendType", "xAxisId", "yAxisId", "id"];
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
var computeLegendPayloadFromAreaData = (props) => {
  var {
    dataKey,
    name,
    stroke,
    legendType,
    hide
  } = props;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: stroke,
    value: getTooltipNameProp(name, dataKey),
    payload: props
  }];
};
var SetLineTooltipEntrySettings = /* @__PURE__ */ reactExports.memo((_ref) => {
  var {
    dataKey,
    data,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    unit,
    tooltipType,
    id
  } = _ref;
  var tooltipEntrySettings = {
    dataDefinedOnItem: data,
    getPosition: noop,
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      nameKey: void 0,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: tooltipType,
      color: stroke,
      unit,
      graphicalItemId: id
    }
  };
  return /* @__PURE__ */ reactExports.createElement(SetTooltipEntrySettings, {
    tooltipEntrySettings
  });
});
var generateSimpleStrokeDasharray = (totalLength, length) => {
  return "".concat(length, "px ").concat(totalLength, "px");
};
function repeat(lines, count) {
  var linesUnit = lines.length % 2 !== 0 ? [...lines, 0] : lines;
  var result = [];
  for (var i = 0; i < count; ++i) {
    result.push(...linesUnit);
  }
  return result;
}
var getStrokeDasharray = (length, totalLength, lines) => {
  var lineLength = lines.reduce((pre, next) => pre + next, 0);
  if (!lineLength) {
    return generateSimpleStrokeDasharray(totalLength, length);
  }
  var count = Math.floor(length / lineLength);
  var remainLength = length % lineLength;
  var remainLines = [];
  for (var i = 0, sum = 0; i < lines.length; sum += (_lines$i = lines[i]) !== null && _lines$i !== void 0 ? _lines$i : 0, ++i) {
    var _lines$i;
    var lineValue = lines[i];
    if (lineValue != null && sum + lineValue > remainLength) {
      remainLines = [...lines.slice(0, i), remainLength - sum];
      break;
    }
  }
  var emptyLines = remainLines.length % 2 === 0 ? [0, totalLength] : [totalLength];
  return [...repeat(lines, count), ...remainLines, ...emptyLines].map((line) => "".concat(line, "px")).join(", ");
};
function LineDotsWrapper(_ref2) {
  var {
    clipPathId,
    points,
    props
  } = _ref2;
  var {
    dot,
    dataKey,
    needClip
  } = props;
  var {
    id
  } = props, propsWithoutId = _objectWithoutProperties(props, _excluded);
  var lineProps = svgPropertiesNoEvents(propsWithoutId);
  return /* @__PURE__ */ reactExports.createElement(Dots, {
    points,
    dot,
    className: "recharts-line-dots",
    dotClassName: "recharts-line-dot",
    dataKey,
    baseProps: lineProps,
    needClip,
    clipPathId
  });
}
function LineLabelListProvider(_ref3) {
  var {
    showLabels,
    children,
    points
  } = _ref3;
  var labelListEntries = reactExports.useMemo(() => {
    return points === null || points === void 0 ? void 0 : points.map((point) => {
      var _point$x, _point$y;
      var viewBox = {
        x: (_point$x = point.x) !== null && _point$x !== void 0 ? _point$x : 0,
        y: (_point$y = point.y) !== null && _point$y !== void 0 ? _point$y : 0,
        width: 0,
        lowerWidth: 0,
        upperWidth: 0,
        height: 0
      };
      return _objectSpread(_objectSpread({}, viewBox), {}, {
        value: point.value,
        payload: point.payload,
        viewBox,
        /*
         * Line is not passing parentViewBox to the LabelList so the labels can escape - looks like a bug, should we pass parentViewBox?
         * Or should this just be the root chart viewBox?
         */
        parentViewBox: void 0,
        fill: void 0
      });
    });
  }, [points]);
  return /* @__PURE__ */ reactExports.createElement(CartesianLabelListContextProvider, {
    value: showLabels ? labelListEntries : void 0
  }, children);
}
function StaticCurve(_ref4) {
  var {
    clipPathId,
    pathRef,
    points,
    strokeDasharray,
    props
  } = _ref4;
  var {
    type,
    layout,
    connectNulls,
    needClip,
    shape
  } = props, others = _objectWithoutProperties(props, _excluded2);
  var curveProps = _objectSpread(_objectSpread({}, svgPropertiesAndEvents(others)), {}, {
    fill: "none",
    className: "recharts-line-curve",
    clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : void 0,
    points,
    type,
    layout,
    connectNulls,
    strokeDasharray: strokeDasharray !== null && strokeDasharray !== void 0 ? strokeDasharray : props.strokeDasharray
  });
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /* @__PURE__ */ reactExports.createElement(Shape, _extends({
    shapeType: "curve",
    option: shape
  }, curveProps, {
    pathRef
  })), /* @__PURE__ */ reactExports.createElement(LineDotsWrapper, {
    points,
    clipPathId,
    props
  }));
}
function getTotalLength(mainCurve) {
  try {
    return mainCurve && mainCurve.getTotalLength && mainCurve.getTotalLength() || 0;
  } catch (_unused) {
    return 0;
  }
}
function CurveWithAnimation(_ref5) {
  var {
    clipPathId,
    props,
    pathRef,
    previousPointsRef,
    longestAnimatedLengthRef
  } = _ref5;
  var {
    points,
    strokeDasharray,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    animateNewValues,
    width,
    height,
    onAnimationEnd,
    onAnimationStart
  } = props;
  var prevPoints = previousPointsRef.current;
  var animationId = useAnimationId(points, "recharts-line-");
  var animationIdRef = reactExports.useRef(animationId);
  var [isAnimating, setIsAnimating] = reactExports.useState(false);
  var showLabels = !isAnimating;
  var handleAnimationEnd = reactExports.useCallback(() => {
    if (typeof onAnimationEnd === "function") {
      onAnimationEnd();
    }
    setIsAnimating(false);
  }, [onAnimationEnd]);
  var handleAnimationStart = reactExports.useCallback(() => {
    if (typeof onAnimationStart === "function") {
      onAnimationStart();
    }
    setIsAnimating(true);
  }, [onAnimationStart]);
  var totalLength = getTotalLength(pathRef.current);
  var startingPointRef = reactExports.useRef(0);
  if (animationIdRef.current !== animationId) {
    startingPointRef.current = longestAnimatedLengthRef.current;
    animationIdRef.current = animationId;
  }
  var startingPoint = startingPointRef.current;
  return /* @__PURE__ */ reactExports.createElement(LineLabelListProvider, {
    points,
    showLabels
  }, props.children, /* @__PURE__ */ reactExports.createElement(JavascriptAnimate, {
    animationId,
    begin: animationBegin,
    duration: animationDuration,
    isActive: isAnimationActive,
    easing: animationEasing,
    onAnimationEnd: handleAnimationEnd,
    onAnimationStart: handleAnimationStart,
    key: animationId
  }, (t) => {
    var lengthInterpolated = interpolate(startingPoint, totalLength + startingPoint, t);
    var curLength = Math.min(lengthInterpolated, totalLength);
    var currentStrokeDasharray;
    if (isAnimationActive) {
      if (strokeDasharray) {
        var lines = "".concat(strokeDasharray).split(/[,\s]+/gim).map((num) => parseFloat(num));
        currentStrokeDasharray = getStrokeDasharray(curLength, totalLength, lines);
      } else {
        currentStrokeDasharray = generateSimpleStrokeDasharray(totalLength, curLength);
      }
    } else {
      currentStrokeDasharray = strokeDasharray == null ? void 0 : String(strokeDasharray);
    }
    if (t > 0 && totalLength > 0) {
      previousPointsRef.current = points;
      longestAnimatedLengthRef.current = Math.max(longestAnimatedLengthRef.current, curLength);
    }
    if (prevPoints) {
      var prevPointsDiffFactor = prevPoints.length / points.length;
      var stepData = t === 1 ? points : points.map((entry, index) => {
        var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
        if (prevPoints[prevPointIndex]) {
          var prev = prevPoints[prevPointIndex];
          return _objectSpread(_objectSpread({}, entry), {}, {
            x: interpolate(prev.x, entry.x, t),
            y: interpolate(prev.y, entry.y, t)
          });
        }
        if (animateNewValues) {
          return _objectSpread(_objectSpread({}, entry), {}, {
            x: interpolate(width * 2, entry.x, t),
            y: interpolate(height / 2, entry.y, t)
          });
        }
        return _objectSpread(_objectSpread({}, entry), {}, {
          x: entry.x,
          y: entry.y
        });
      });
      previousPointsRef.current = stepData;
      return /* @__PURE__ */ reactExports.createElement(StaticCurve, {
        props,
        points: stepData,
        clipPathId,
        pathRef,
        strokeDasharray: currentStrokeDasharray
      });
    }
    return /* @__PURE__ */ reactExports.createElement(StaticCurve, {
      props,
      points,
      clipPathId,
      pathRef,
      strokeDasharray: currentStrokeDasharray
    });
  }), /* @__PURE__ */ reactExports.createElement(LabelListFromLabelProp, {
    label: props.label
  }));
}
function RenderCurve(_ref6) {
  var {
    clipPathId,
    props
  } = _ref6;
  var previousPointsRef = reactExports.useRef(null);
  var longestAnimatedLengthRef = reactExports.useRef(0);
  var pathRef = reactExports.useRef(null);
  return /* @__PURE__ */ reactExports.createElement(CurveWithAnimation, {
    props,
    clipPathId,
    previousPointsRef,
    longestAnimatedLengthRef,
    pathRef
  });
}
var errorBarDataPointFormatter = (dataPoint, dataKey) => {
  var _dataPoint$x, _dataPoint$y;
  return {
    x: (_dataPoint$x = dataPoint.x) !== null && _dataPoint$x !== void 0 ? _dataPoint$x : void 0,
    y: (_dataPoint$y = dataPoint.y) !== null && _dataPoint$y !== void 0 ? _dataPoint$y : void 0,
    value: dataPoint.value,
    // getValueByDataKey does not validate the output type
    errorVal: getValueByDataKey(dataPoint.payload, dataKey)
  };
};
class LineWithState extends reactExports.Component {
  render() {
    var {
      hide,
      dot,
      points,
      className,
      xAxisId,
      yAxisId,
      top,
      left,
      width,
      height,
      id,
      needClip,
      zIndex
    } = this.props;
    if (hide) {
      return null;
    }
    var layerClass = clsx("recharts-line", className);
    var clipPathId = id;
    var {
      r,
      strokeWidth
    } = getRadiusAndStrokeWidthFromDot(dot);
    var clipDot = isClipDot(dot);
    var dotSize = r * 2 + strokeWidth;
    var activePointsClipPath = needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : void 0;
    return /* @__PURE__ */ reactExports.createElement(ZIndexLayer, {
      zIndex
    }, /* @__PURE__ */ reactExports.createElement(Layer, {
      className: layerClass
    }, needClip && /* @__PURE__ */ reactExports.createElement("defs", null, /* @__PURE__ */ reactExports.createElement(GraphicalItemClipPath, {
      clipPathId,
      xAxisId,
      yAxisId
    }), !clipDot && /* @__PURE__ */ reactExports.createElement("clipPath", {
      id: "clipPath-dots-".concat(clipPathId)
    }, /* @__PURE__ */ reactExports.createElement("rect", {
      x: left - dotSize / 2,
      y: top - dotSize / 2,
      width: width + dotSize,
      height: height + dotSize
    }))), /* @__PURE__ */ reactExports.createElement(SetErrorBarContext, {
      xAxisId,
      yAxisId,
      data: points,
      dataPointFormatter: errorBarDataPointFormatter,
      errorBarOffset: 0
    }, /* @__PURE__ */ reactExports.createElement(RenderCurve, {
      props: this.props,
      clipPathId
    }))), /* @__PURE__ */ reactExports.createElement(ActivePoints, {
      activeDot: this.props.activeDot,
      points,
      mainColor: this.props.stroke,
      itemDataKey: this.props.dataKey,
      clipPath: activePointsClipPath
    }));
  }
}
var defaultLineProps = {
  activeDot: true,
  animateNewValues: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  connectNulls: false,
  dot: true,
  fill: "#fff",
  hide: false,
  isAnimationActive: "auto",
  label: false,
  legendType: "line",
  stroke: "#3182bd",
  strokeWidth: 1,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: DefaultZIndexes.line,
  type: "linear"
};
function LineImpl(props) {
  var _resolveDefaultProps = resolveDefaultProps(props, defaultLineProps), {
    activeDot,
    animateNewValues,
    animationBegin,
    animationDuration,
    animationEasing,
    connectNulls,
    dot,
    hide,
    isAnimationActive,
    label,
    legendType,
    xAxisId,
    yAxisId,
    id
  } = _resolveDefaultProps, everythingElse = _objectWithoutProperties(_resolveDefaultProps, _excluded3);
  var {
    needClip
  } = useNeedsClip(xAxisId, yAxisId);
  var plotArea = usePlotArea();
  var layout = useChartLayout();
  var isPanorama = useIsPanorama();
  var points = useAppSelector((state) => selectLinePoints(state, xAxisId, yAxisId, isPanorama, id));
  if (layout !== "horizontal" && layout !== "vertical" || points == null || plotArea == null) {
    return null;
  }
  var {
    height,
    width,
    x: left,
    y: top
  } = plotArea;
  return /* @__PURE__ */ reactExports.createElement(LineWithState, _extends({}, everythingElse, {
    id,
    connectNulls,
    dot,
    activeDot,
    animateNewValues,
    animationBegin,
    animationDuration,
    animationEasing,
    isAnimationActive,
    hide,
    label,
    legendType,
    xAxisId,
    yAxisId,
    points,
    layout,
    height,
    width,
    left,
    top,
    needClip
  }));
}
function computeLinePoints(_ref7) {
  var {
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataKey,
    bandSize,
    displayedData
  } = _ref7;
  return displayedData.map((entry, index) => {
    var value = getValueByDataKey(entry, dataKey);
    if (layout === "horizontal") {
      var _x = getCateCoordinateOfLine({
        axis: xAxis,
        ticks: xAxisTicks,
        bandSize,
        entry,
        index
      });
      var _y = isNullish(value) ? null : yAxis.scale.map(value);
      return {
        x: _x,
        y: _y !== null && _y !== void 0 ? _y : null,
        value,
        payload: entry
      };
    }
    var x = isNullish(value) ? null : xAxis.scale.map(value);
    var y = getCateCoordinateOfLine({
      axis: yAxis,
      ticks: yAxisTicks,
      bandSize,
      entry,
      index
    });
    if (x == null || y == null) {
      return null;
    }
    return {
      x,
      y,
      value,
      payload: entry
    };
  }).filter(Boolean);
}
function LineFn(outsideProps) {
  var props = resolveDefaultProps(outsideProps, defaultLineProps);
  var isPanorama = useIsPanorama();
  return /* @__PURE__ */ reactExports.createElement(RegisterGraphicalItemId, {
    id: props.id,
    type: "line"
  }, (id) => /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(SetLegendPayload, {
    legendPayload: computeLegendPayloadFromAreaData(props)
  }), /* @__PURE__ */ reactExports.createElement(SetLineTooltipEntrySettings, {
    dataKey: props.dataKey,
    data: props.data,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    name: props.name,
    hide: props.hide,
    unit: props.unit,
    tooltipType: props.tooltipType,
    id
  }), /* @__PURE__ */ reactExports.createElement(SetCartesianGraphicalItem, {
    type: "line",
    id,
    data: props.data,
    xAxisId: props.xAxisId,
    yAxisId: props.yAxisId,
    zAxisId: 0,
    dataKey: props.dataKey,
    hide: props.hide,
    isPanorama
  }), /* @__PURE__ */ reactExports.createElement(LineImpl, _extends({}, props, {
    id
  }))));
}
var Line = /* @__PURE__ */ reactExports.memo(LineFn, propsAreEqual);
Line.displayName = "Line";
var allowedTooltipTypes = ["axis"];
var LineChart = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  return /* @__PURE__ */ reactExports.createElement(CartesianChart, {
    chartName: "LineChart",
    defaultTooltipEventType: "axis",
    validateTooltipEventTypes: allowedTooltipTypes,
    tooltipPayloadSearcher: arrayTooltipSearcher,
    categoricalChartProps: props,
    ref
  });
});
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ROLE_TRENDS = {
  "Institute Owner": [{
    name: "AI Tutoring",
    growth: 312,
    confidence: 96,
    color: "oklch(0.7 0.24 255)",
    desc: "Personalized AI tutors for K-12 and competitive exam prep"
  }, {
    name: "Hybrid Learning",
    growth: 187,
    confidence: 91,
    color: "oklch(0.72 0.27 340)",
    desc: "Blended online-offline models gaining traction in tier-2 cities"
  }, {
    name: "LMS Adoption",
    growth: 142,
    confidence: 88,
    color: "oklch(0.85 0.18 200)",
    desc: "School management + LMS integration demand accelerating"
  }, {
    name: "Vernacular EdTech",
    growth: 248,
    confidence: 94,
    color: "oklch(0.78 0.2 155)",
    desc: "Regional language content demand surging in rural markets"
  }, {
    name: "Gamification",
    growth: 96,
    confidence: 79,
    color: "oklch(0.82 0.17 75)",
    desc: "Engagement mechanics driving retention in competitive exam apps"
  }, {
    name: "Parent Analytics",
    growth: 64,
    confidence: 71,
    color: "oklch(0.65 0.28 300)",
    desc: "Parent-facing dashboards for student progress tracking"
  }],
  "Backend Developer": [{
    name: "Edge Runtimes",
    growth: 287,
    confidence: 94,
    color: "oklch(0.7 0.24 255)",
    desc: "Bun, Deno, and Cloudflare Workers replacing Node.js for new projects"
  }, {
    name: "AI Inference APIs",
    growth: 342,
    confidence: 97,
    color: "oklch(0.72 0.27 340)",
    desc: "Serverless AI inference demand exploding across all verticals"
  }, {
    name: "TypeScript-First",
    growth: 156,
    confidence: 92,
    color: "oklch(0.85 0.18 200)",
    desc: "Full-stack TypeScript adoption accelerating in enterprise"
  }, {
    name: "WebSockets/SSE",
    growth: 198,
    confidence: 89,
    color: "oklch(0.78 0.2 155)",
    desc: "Real-time streaming APIs becoming standard for AI-powered apps"
  }, {
    name: "Rust for APIs",
    growth: 124,
    confidence: 83,
    color: "oklch(0.82 0.17 75)",
    desc: "Rust backend adoption growing for performance-critical services"
  }, {
    name: "GraphQL Decline",
    growth: -34,
    confidence: 76,
    color: "oklch(0.65 0.28 300)",
    desc: "REST + tRPC replacing GraphQL in new projects"
  }],
  "Data Engineer": [{
    name: "Streaming-First",
    growth: 298,
    confidence: 95,
    color: "oklch(0.7 0.24 255)",
    desc: "Real-time data pipelines replacing batch as the default architecture"
  }, {
    name: "Lakehouse Pattern",
    growth: 234,
    confidence: 93,
    color: "oklch(0.72 0.27 340)",
    desc: "Unified storage + compute replacing separate data lake and warehouse"
  }, {
    name: "AI/ML Pipelines",
    growth: 312,
    confidence: 96,
    color: "oklch(0.85 0.18 200)",
    desc: "Feature stores and ML pipeline tooling demand accelerating"
  }, {
    name: "Data Contracts",
    growth: 178,
    confidence: 87,
    color: "oklch(0.78 0.2 155)",
    desc: "Schema enforcement and data quality contracts becoming standard"
  }, {
    name: "Reverse ETL",
    growth: 142,
    confidence: 84,
    color: "oklch(0.82 0.17 75)",
    desc: "Syncing warehouse data back to operational tools growing fast"
  }, {
    name: "dbt Adoption",
    growth: 267,
    confidence: 94,
    color: "oklch(0.65 0.28 300)",
    desc: "dbt becoming the standard transformation layer across all stacks"
  }],
  "Founder / Entrepreneur": [{
    name: "AI-Native SaaS",
    growth: 387,
    confidence: 97,
    color: "oklch(0.7 0.24 255)",
    desc: "Products built AI-first from day one commanding premium valuations"
  }, {
    name: "Vertical AI",
    growth: 312,
    confidence: 95,
    color: "oklch(0.72 0.27 340)",
    desc: "Domain-specific AI tools outperforming horizontal platforms"
  }, {
    name: "B2B EdTech",
    growth: 234,
    confidence: 92,
    color: "oklch(0.85 0.18 200)",
    desc: "Enterprise learning platforms growing 67% ARR YoY"
  }, {
    name: "Vernacular Markets",
    growth: 198,
    confidence: 89,
    color: "oklch(0.78 0.2 155)",
    desc: "$2.1B untapped vernacular EdTech opportunity in India"
  }, {
    name: "Creator Economy",
    growth: 156,
    confidence: 84,
    color: "oklch(0.82 0.17 75)",
    desc: "Individual educators building $1M+ businesses on owned platforms"
  }, {
    name: "Micro-SaaS",
    growth: 124,
    confidence: 81,
    color: "oklch(0.65 0.28 300)",
    desc: "Niche, high-margin SaaS products with low CAC gaining traction"
  }],
  "Product Builder": [{
    name: "AI Agents",
    growth: 412,
    confidence: 97,
    color: "oklch(0.7 0.24 255)",
    desc: "Autonomous AI agents completing multi-step tasks becoming standard"
  }, {
    name: "Voice Interfaces",
    growth: 287,
    confidence: 93,
    color: "oklch(0.72 0.27 340)",
    desc: "Voice-first UX patterns emerging in mobile and desktop apps"
  }, {
    name: "No-Code AI",
    growth: 234,
    confidence: 91,
    color: "oklch(0.85 0.18 200)",
    desc: "AI-assisted no-code tools enabling non-technical product builders"
  }, {
    name: "Gamification",
    growth: 178,
    confidence: 87,
    color: "oklch(0.78 0.2 155)",
    desc: "Streak mechanics and habit loops driving retention across categories"
  }, {
    name: "Collaborative AI",
    growth: 198,
    confidence: 89,
    color: "oklch(0.82 0.17 75)",
    desc: "Real-time AI collaboration features in productivity tools"
  }, {
    name: "Micro-Interactions",
    growth: 124,
    confidence: 82,
    color: "oklch(0.65 0.28 300)",
    desc: "Delightful micro-animations and feedback loops improving UX scores"
  }]
};
function buildForecast(trends) {
  return MONTHS.map((m, i) => {
    const row = {
      m
    };
    trends.slice(0, 4).forEach((t, j) => {
      row[t.name] = Math.round(40 + i * (15 + j * 4) + Math.sin(i + j) * 10);
    });
    return row;
  });
}
const CHART_COLORS = ["oklch(0.7 0.24 255)", "oklch(0.72 0.27 340)", "oklch(0.85 0.18 200)", "oklch(0.78 0.2 155)"];
function Trends() {
  const {
    role
  } = useRole();
  const meta = ROLE_META[role];
  const trends = ROLE_TRENDS[role] ?? ROLE_TRENDS["Institute Owner"];
  const forecast = buildForecast(trends);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "flex items-end justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-[0.25em]", style: {
        color: meta.color
      }, children: [
        meta.icon,
        " ",
        role,
        " · Forecast Engine"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold md:text-4xl", children: "Trend Forecast" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "12-month projected demand for your role's key signals." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass neon-border rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "Demand Forecast · 12-Month Horizon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-full bg-[oklch(0.7_0.24_255/0.15)] px-3 py-1 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-3 w-3 text-[oklch(0.85_0.18_200)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "94% model confidence" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[360px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: forecast, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "oklch(1 0 0 / 0.05)", vertical: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "m", tick: {
          fill: "oklch(0.7 0.04 260)",
          fontSize: 11
        }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
          fill: "oklch(0.7 0.04 260)",
          fontSize: 11
        }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
          background: "oklch(0.16 0.04 265 / 0.95)",
          border: "1px solid oklch(1 0 0 / 0.1)",
          borderRadius: 12
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: {
          fontSize: 12
        } }),
        trends.slice(0, 4).map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: t.name, stroke: CHART_COLORS[i], strokeWidth: i === 0 ? 3 : 2.5, dot: false }, t.name))
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: trends.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: i * 0.06
    }, className: "glass tilt-card neon-border relative overflow-hidden rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-3xl", style: {
        background: t.color
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-lg font-semibold", children: t.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t.desc })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 shrink-0", style: {
          color: t.color
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-4xl font-bold", style: {
          color: t.color,
          textShadow: `0 0 20px ${t.color}`
        }, children: [
          t.growth > 0 ? "+" : "",
          t.growth,
          "%"
        ] }),
        t.growth > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "mb-1 h-5 w-5", style: {
          color: t.color
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Confidence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            t.confidence,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          width: 0
        }, animate: {
          width: `${t.confidence}%`
        }, transition: {
          delay: i * 0.1,
          duration: 1
        }, className: "h-full rounded-full", style: {
          background: t.color,
          boxShadow: `0 0 8px ${t.color}`
        } }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex h-12 items-end gap-1", children: Array.from({
        length: 12
      }).map((_, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 rounded-sm", style: {
        height: `${20 + (j * 7 + i * 3) % 80}%`,
        background: `linear-gradient(to top, ${t.color}, transparent)`,
        opacity: 0.4 + j / 24
      } }, j)) })
    ] }, t.name)) })
  ] });
}
export {
  Trends as component
};
