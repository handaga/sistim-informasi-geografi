/*
 WMSUntiledOptions = {
    baseUrl : 'http://demo.cubewerx.com/cubewerx/cubeserv.cgi?',
    layers: 'Foundation.GTOPO30',
    version: '1.3.0',
    styles: 'default',
    format: 'image/png'
 }
 */

function WMSUntiled (map, wmsUntiledOptions) {
    this.map_ = map;
    this.options = wmsUntiledOptions;
    this.div_ = null;
    this.image_ = null;
    this.setMap(map);
}

WMSUntiled.prototype = new google.maps.OverlayView();
WMSUntiled.prototype.draw = function() {
    var overlayProjection = this.getProjection();

    var sw = overlayProjection.fromLatLngToDivPixel(this.map_.getBounds().getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.map_.getBounds().getNorthEast());

    var div = this.div_;
    if (this.image_ != null)
        div.removeChild(this.image_);

    // Create an IMG element and attach it to the DIV.
    var img = document.createElement('img');
    img.src = this.prepareWMSUrl();
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';
    img.style.opacity = 0.6;
    this.image_ = img;
    div.appendChild(this.image_);

    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
};

WMSUntiled.prototype.onAdd = function() {
    var that = this;
    var div = document.createElement('div');
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';

    this.div_ = div;
    this.getPanes().floatPane.appendChild(this.div_);

    google.maps.event.addListener(this.map_, 'dragend', function() {
        that.draw();
    });
};

WMSUntiled.prototype.onRemove = function () {
    this.menuDiv.parentNode.removeChild(this.div_);
    this.div_ = null;
};

WMSUntiled.prototype.prepareWMSUrl = function () {
    var baseUrl = this.options.baseUrl;
    baseUrl += 'Service=WMS&request=GetMap&CRS=EPSG:3857&';
    baseUrl += 'version=' + this.options.version;
    baseUrl += '&layers=' + this.options.layers;
    baseUrl += '&styles=' + this.options.styles;
    baseUrl += '&format=' + this.options.format;

    var bounds = this.map_.getBounds();
    var sw = this.toMercator(bounds.getSouthWest());
    var ne = this.toMercator(bounds.getNorthEast());

    var mapDiv = this.map_.getDiv();
    baseUrl += '&BBOX=' + sw.x + ',' + sw.y + ',' + ne.x + ',' + ne.y;
    baseUrl += '&width=' + mapDiv.clientWidth + '&height=' + mapDiv.clientHeight;
    return baseUrl;
};

WMSUntiled.prototype.toMercator = function(coord) {
    var lat = coord.lat();
    var lng = coord.lng();
    if ((Math.abs(lng) > 180 || Math.abs(lat) > 90))
        return;

    var num = lng * 0.017453292519943295;
    var x = 6378137.0 * num;
    var a = lat * 0.017453292519943295;

    var merc_lon = x;
    var merc_lat = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));

    return { x: merc_lon, y: merc_lat };
};

WMSUntiled.prototype.changeOpacity = function(opacity) {
    if (opacity >= 0 && opacity <= 1){
        this.image_.style.opacity = opacity;
    }
};