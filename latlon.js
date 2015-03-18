/*
这里有个科普文 《如何解决坐标转换，坐标偏移？》 http://bbs.amap.com/thread-18617-1-1.html 

最近有个需求，大致就是需要用JS API获取到当前的位置，然后再显示出当前位置 

但是如果直接用navigator.geolocation.getCurrentPosition，配合soso map，显示是有偏移的：“在各种web端平台，或者高德、腾讯、百度上取到的坐标，都不是GPS坐标，都是GCJ-02坐标，或者自己的偏移坐标系。”所以需要对相关信息进行转换。 

网上有很多其他语言的版本，这个是JavaScript的版本 

这个就是最后显示的样子： 
http://st.map.soso.com/api?size=320*165&center=113.93387328665031,22.540569860210557&zoom=15&markers=113.93387328665031,22.540569860210557 

为了方便运行，代码没有用模块化写法，实际使用中建议做相应更改。
*/


//将GPS纬度信息转换为“火星坐标”的纬度
function latToGcj02(lon, lat) {
	var c = Math.PI,
		d = Math.sin,
		e = -100 + 2 * lon + 3 * lat + 0.2 * lat * lat + 0.1 * lon * lat + 0.2 * Math.sqrt(Math.abs(lon)),
		e = e + 2 * (20 * d(6 * lon * c) + 20 * d(2 * lon * c)) / 3,
		e = e + 2 * (20 * d(lat * c) + 40 * d(lat / 3 * c)) / 3;
	return e += 2 * (160 * d(lat / 12 * c) + 320 * d(lat * c / 30)) / 3
}

//将GPS经度信息转换为“火星坐标”的纬度
function lonToGcj02(lon, lat) {
	var c = Math.PI,
		d = Math.sin,
		e = 300 + lon + 2 * lat + 0.1 * lon * lon + 0.1 * lon * lat + 0.1 * Math.sqrt(Math.abs(lon)),
		e = e + 2 * (20 * d(6 * lon * c) + 20 * d(2 * lon * c)) / 3,
		e = e + 2 * (20 * d(lon * c) + 40 * d(lon / 3 * c)) / 3;
	return e += 2 * (150 * d(lon / 12 * c) +
		300 * d(lon / 30 * c)) / 3
}

//将经纬度信息转换为“火星坐标”体系
function GPSToGcj02(lon, lat) {
	var a = 6378245,
		ee = 0.006693421622965823;

	var d = Math.PI,
		e = lonToGcj02(lon - 105, lat - 35),
		f = latToGcj02(lon - 105, lat - 35),
		h = lat / 180 * d,
		k = Math.sin(h),
		k = 1 - ee * k * k,
		l = Math.sqrt(k),
		e = 180 * e / (a / l * Math.cos(h) * d),
		f = 180 * f / (a * (1 - ee) / (k * l) * d);
	return [lon + e, lat + f]
}

//例子
navigator.geolocation.getCurrentPosition(function(e) {
	console.log(GPSToGcj02(e.coords.longitude, e.coords.latitude));
}, function() {

}, {
	enableHighAccuracy: true,
	timeout : 10000
});
