window.google = window.google || {};
google.maps = google.maps || {};
var cxymapload;
var cxytime = (new Date).getTime();

(function () {
    function getScript(src) {
        document.write('<' + 'script src="' + src + '"' +
                   ' type="text/javascript"><' + '/script>');
    }

    google.maps.Load = function (apiLoad) {
        cxymapload = apiLoad;
    };

    getScript("MapJS/mapfiles/api-3/15/5/main.js");
})();

function extend(a, b) {
    var n;
    if (!a) {
        a = {};
    }
    for (n in b) {
        a[n] = b[n];
    }
    return a;
};

var cxygoogleMap = function () {
    this.map = undefined;
    this.curZoom = undefined;
    this.callback = undefined;
    this.marker = undefined;
    this.localMapType = undefined;
    this.PathData = [];
}

cxygoogleMap.prototype = {
    /*
    div:地图显示div
    srcUrl:地图数据源
    minlv:地图最小显示级别
    maxlv:地图最大显示级别
    defaultlv:地图默认显示级别
    centerx:中心点经度
    centery:中心点纬度
    */
    init: function (div, srcUrl, srcUrl1, minlv, maxlv, defaultlv, centerx, centery, callback) {
        var cxymap = this;
        cxymap.callback = callback;
        cxymapload([null, [[[srcUrl, srcUrl], [srcUrl1, srcUrl1]]], ["zh-CN", "US", null, null, null, null, "MapJS/mapfiles/", null, null, null], ["MapJS/mapfiles/api-3/15/5", "3.15.5"], null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], cxytime);
        cxymap.curZoom = defaultlv;
        var myOptions = {
            maxZoom: maxlv,
            minZoom: minlv,
            center: new google.maps.LatLng(centery, centerx),
            draggableCursor: 'default',
            zoom: defaultlv,
            streetViewControl: false,
            mapTypeControl: false,
            overviewMapControl: false,
            panControl: false,
            zoomControl: false,
            noClear: false
        };
        //mapTypeId:google.maps.MapTypeId.ROADMAP
        cxymap.map = new google.maps.Map(div, myOptions);
        if (!cxymap.map) {
            alert('加载失败');
        }

        google.maps.event.addListener(cxymap.map, 'idle', function () {
            if (cxymap.callback) {
                var center = cxymap.map.getCenter();
                curcenterX = center.lng();
                curcenterY = center.lat();
                curZoomLevelDefault = cxymap.map.getZoom();
                var bounds = cxymap.map.getBounds();
                var maxX = bounds.getNorthEast().lng(); //经度
                var maxY = bounds.getNorthEast().lat(); //纬度
                var minX = bounds.getSouthWest().lng(); //经度
                var minY = bounds.getSouthWest().lat(); //纬度
                cxymap.callback(bounds, minX, minY, maxX, maxY);
            }
        });

        google.maps.event.addListener(cxymap.map, 'zoom_changed', function () {
            if (cxymap.map.getZoom() < minlv) cxymap.map.setZoom(minlv);
            if (cxymap.map.getZoom() > maxlv) cxymap.map.setZoom(maxlv);
            cxymap.curZoom = cxymap.map.getZoom();
        });
        google.maps.event.addListener(cxymap.map,'click',function(e){
            console.log(e.latLng);
        })
    },

    getcurZoom: function () {
        var that = this;
        return that.curZoom;
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    setMapPosition: function () {
        var that = this;
        var point = new google.maps.LatLng(centerY, centerX);
        that.map.panTo(point);
        that.map.setZoom(ZoomLevelDefault);
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    setPosition: function (lng, lat, callback) {
        var that = this;
        var point = new google.maps.LatLng(lat, lng);
        that.map.panTo(point);
        posMarker.setMap(that.map);
        posMarker.setPosition(point);
        google.maps.event.addListener(posMarker, "dragend", function (event) {
            callback(event.latLng);
        });
    },

    ////////////////////////////////////////////////////////////定位///////////////////////////////// LGTD,LTTD
    SetPersonPosition: function (latLng, name) {
        var that = this;
        that.ClearPosition();
        that.map.setZoom(16);

        //添加标记
        var marker = new google.maps.Marker({
            position: latLng,
            map: that.map,
            clickable: true,
            draggable: false,
            title: name,
            animation: google.maps.Animation.DROP,
            //setZoom:1,
            icon: { url: './images/sp02.svg', size: new google.maps.Size(40, 40), anchor: new google.maps.Point(20, 20) }//,
        });
        that.map.setCenter(latLng);
        google.maps.event.addListener(marker, "click", function (e) {
            console.log(e.latLng);
            $("#houseRBox").show();
            $.ajax({
                url: './OfficeRDisplay/HandlerData.ashx',
                data: {
                    cmd: 'getUnitImg',
                    unitName: this.title
                },
                dataType: 'json',
                success: function (result) {
                    showUnit.popupBox(result);
                }, error: function (e) {
                    console.log(e);
                }
            });
        });
        google.maps.event.addListener(cxymap.map, 'zoom_changed', function () {
           
        });
        //google.maps.event.addListener(that.map, "zoom_changed", function (event) {
        //   
        //});
    },

    DrawPath: function (pointArray, color) {
        var that = this;
        polygons = new google.maps.Polygon(
                {
                    clickable: true,
                    draggable: true,
                    editablle: true,
                    fillColor: color,
                    fillOpacity: 0.8,
                    geodesic: true,
                    map: that.map,
                    paths: pointArray,
                    strokeColor: color,
                    strokeOpacity: 0.8,
                    strokeWeight: 0,
                    visible: true,
                    zIndex: 999999
                }
        );
        that.PathData.push(polygons);
    },

    clearAllPath: function () {
        var that = this;
        for (var i = 0, polygons; polygons = that.PathData[i]; i++) {
            polygons.setMap(null);
        }
        that.PathData = [];
    },

    ClearPosition: function () {
        var that = this;
        if (that.marker != null)
            that.marker.setMap(null);
    }
};
