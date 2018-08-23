import _ from 'lodash'
/**
 * 根据多边形坐标点获取多边形中心点
 * @param  {[type]} lnglatarr [description]
 * @return {[type]}           [description]
 */
export const getPolygonCenter = (lnglatarr) => {
  var total = lnglatarr.length
  var X = 0
  var Y = 0
  var Z = 0
  lnglatarr.forEach((lnglat, index) => {
    var lng = (lnglat.lng || lnglat[0]) * Math.PI / 180
    var lat = (lnglat.lat || lnglat[1]) * Math.PI / 180
    var x, y, z
    x = Math.cos(lat) * Math.cos(lng)
    y = Math.cos(lat) * Math.sin(lng)
    z = Math.sin(lat)
    X += x
    Y += y
    Z += z
  })

  X = X / total
  Y = Y / total
  Z = Z / total

  var Lng = Math.atan2(Y, X)
  var Hyp = Math.sqrt(X * X + Y * Y)
  var Lat = Math.atan2(Z, Hyp)
  return new AMap.LngLat(Lng * 180 / Math.PI, Lat * 180 / Math.PI)
}
/**
 * [description]
 * 获取信息窗口对象
 * @return {[type]} [description]
 */
export const getInfoWindow = (settings) => {
  var options = {
    isCustom: true,
    offset: new AMap.Pixel(45, -32)
  }
  typeof settings == 'object' && Object.assign(options, settings)
  return new AMap.InfoWindow(options)
}
/**
 * [description]
 * 绘制点标注
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const getMark = (pos, extData, settings) => {
  // var infoWindow = getInfoWindow();
  var options = {
    position: pos,
    icon: (settings && settings.icon) || 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
    cursor: 'pointer',
    zIndex: (settings && settings.zIndex) || 100,
    extData: extData
  }
  return new AMap.Marker(options)
}
/**
 * 绘制围栏
 * @param  {[type]} data [description]
 * @param  {[type]} map  [description]
 * @return {[type]}      [description]
 */
export const getRailArea = (paths, extData, fillOpacity) => {
  return new AMap.Polygon({
    path: paths, // 设置多边形边界路径
    strokeColor: '#fff706', // 线颜色
    strokeOpacity: 1, // 线透明度
    strokeWeight: 3, // 线宽
    fillColor: '#1791fc', // 填充色
    fillOpacity: fillOpacity || 0.35, // 填充透明度
    zIndex: 1,
    extData: extData
  })
}

/**
 * 绘制海量数据
 * @param  {[type]} data     [description]
 * @param  {[type]} settings [description]
 * @return {[type]}          [description]
 */
export const getMassMarks = (data, settings) => {
  const options = {
    url: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
    anchor: new AMap.Pixel(9, 31),
    size: new AMap.Size(19, 31),
    opacity: 1,
    // cursor:'pointer',
    zIndex: 200
  }
  return new AMap.MassMarks(data, options)
}
