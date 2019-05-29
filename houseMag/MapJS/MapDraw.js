var cxyNewMap = function () {
    this.map = undefined;
    this.curZoom = undefined;
    this.callback = undefined;
    this.marker = undefined;
    this.localMapType = undefined;
    //距离标记数组
    this.drawingManager = [];
    this.polygonOptionsarr = [];
    this.tempEditObj = [];
    this.arrPolygon = [];
    this.Alllatlngs = "";
    this.id = 0;
    this.AlllatlngsArr = [];
}
cxyNewMap.prototype = {
    initMap: function (map) {
        var cxymap = this;
        cxymap.map = map;
    },
    setPosition: function (latLng,name) {
        var cxymap = this;
        cxymap.map.setZoom(17);
        var beachMarker;
        if (beachMarker) {
            beachMarker.setMap(null);
        }
        beachMarker = new google.maps.Marker({
            //position: obj.pointArray[0],
            title:name,
            position: latLng,
            map: cxymap.map,
            animation: google.maps.Animation.DROP,
            clickable: true,
            draggable: false,
            zIndex: 9999,
            icon: { url: "./images/sp02.svg", size: new google.maps.Size(40, 40), scaledSize: new google.maps.Size(40, 40) }
        });
        cxymap.map.setCenter(latLng);
        google.maps.event.addListener(beachMarker, "click", function (e) {
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
    },

    AddTxt: function (divP, innerText, divid, containerWidth, containerHeight, pointPosition, txtX, txtY, IsAnima) {
        var divText = document.createElement("div");
        divText.style.cssText = "position: absolute; font-size: 12px;font-family:'Microsoft Yahei';color: #555;background-color: white;border: 1px solid #cccccc;padding:10px;  -moz-box-shadow: 0 0 5px #000; -webkit-box-shadow: 0 0 5px #000;  box-shadow: 0 0 10px #000;  border-radius: 4px;z-index:999999";
        divText.id = divid;
        divText.zindex = 999999;
        this.divID = divid;
        divText.style.opacity = 0;
        divText.divtextopa = 0.1;
        divText.divPlay = 0;
        divText.divparent = divP;
        divText.style.minHeight = "50px";
        divText.style.minWidth = "200px";
        divText.style.maxHeight = containerHeight;
        divText.style.maxWidth = containerWidth;
        divText.innerHTML = innerText;
        divP.appendChild(divText);
        var divHeight = divText.clientHeight;
        var divWidth = divText.clientWidth;
        divText.style.left = txtX == undefined ? 30 : txtX + "px";
        divText.style.top = txtY == undefined ? 30 : txtY + "px";


        if (IsAnima == true) {
            if (containerHeight - pointPosition.y - 45 < divHeight) {
                divText.style.top = (-divHeight + 30 - 10) + "px";
            }
            if (containerWidth - pointPosition.x < divWidth) {
                divText.style.left = (-divWidth + 30) + "px";
            }
        } else {
            if (containerHeight - pointPosition.y - 65 < divHeight) {
                divText.style.top = (pointPosition.y - divHeight - 10) + "px";
            }
            if (containerWidth - pointPosition.x < divWidth) {
                divText.style.left = (pointPosition.x - divWidth - 10) + "px";
            }
        }
        this.txtdivArray[divid] = divText;
        this.chartdivArray[this.divnum++] = divText;
        var divanim = this;
        setTimeout(function () { divanim.Divanima(divText); }, 50);
    },
    DrawPaths: function (obj) {
        var cxymap = this;
        if (cxymap.polygonOptionsarr[obj.id] == undefined) {
            if (obj.drawType == "MARKER") {
                if (beachMarker) {
                    beachMarker.setMap(null);
                }
                //var image = new google.maps.MarkerImage({
                //    url: obj.iconUrl,
                //});
                if (obj.iconUrl == "./image/sp02.png") {
                    cxymap.map.setZoom(17);
                    var beachMarker = new google.maps.Marker({
                        //position: obj.pointArray[0],
                        position: obj.pointArray[0],
                        map: cxymap.map,
                        animation: google.maps.Animation.DROP,
                        clickable: true,
                        draggable: false,
                        zIndex: 9999,
                        icon: { url: obj.iconUrl, size: new google.maps.Size(16, 34), scaledSize: new google.maps.Size(16, 34) }

                    });
                } else {
                    var beachMarker = new google.maps.Marker({
                        //position: obj.pointArray[0],
                        position: obj.pointArray[0],
                        map: cxymap.map,
                        icon: { url: obj.iconUrl, size: new google.maps.Size(24, 24), scaledSize: new google.maps.Size(24, 24) }

                    });
                }

                cxymap.polygonOptionsarr[obj.id] = beachMarker;
            }
            if (obj.drawType == "POLYLINE") {
                var line = new google.maps.Polyline({
                    path: obj.pointArray,
                    clickable: true,
                    draggable: false,
                    editable: false,
                    map: cxymap.map,
                    strokeColor: obj.colorType,
                    strokeOpacit: 1,
                    strokeWeight: 2,
                    visible: true,
                    map: cxymap.map
                });
                cxymap.polygonOptionsarr[obj.id] = line;
            }
            if (obj.drawType == "POLYGON") {
                var polygons = new google.maps.Polygon({
                    paths: obj.pointArray,
                    map: cxymap.map,
                    strokeColor: obj.colorType,
                    fillColor: "#e8f24b",
                    fillOpacity: 0.5,
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    clickable: false,
                    draggable: false,
                    editable: false
                });
                cxymap.polygonOptionsarr[obj.id] = polygons;
            }
            //cxymap.bindMarkerClickEve(cxymap.polygonOptionsarr[obj.id], obj.id, obj.callback, obj.drawType, obj.colorType);
        }
    },
    beginDrawPath: function (obj, drawType) {
        var cxymap = this;
        cxymap.drawingManager = new google.maps.drawing.DrawingManager({
            drawingControl: false,
            map: cxymap.map
        });
        if (drawType == "MARKER") {
            var markeroptions = {
                markerOptions: {
                    map: cxymap.map,
                    clickable: true,
                    draggable: false,
                    editable: false,
                    icon: new google.maps.MarkerImage('image/lyr_village_st_norm.png')
                }
            }
            cxymap.drawingManager.setOptions(markeroptions);
            cxymap.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
        }
        if (drawType == "POLYLINE") {
            var lineoptions = {
                polylineOptions: {
                    clickable: true,
                    draggable: false,
                    editable: false,
                    map: cxymap.map,
                    strokeColor: obj.colorType,
                    strokeOpacit: 1,
                    strokeWeight: 2,
                    visible: true
                }
            }
            cxymap.drawingManager.setOptions(lineoptions);
            cxymap.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
        }
        if (drawType == "POLYGON") {
            var polygonoptions = {
                polygonOptions: {
                    strokeColor: "yellow",
                    strokeOpacity: 1.0,
                    map: cxymap.map,
                    strokeWeight: 2,
                    clickable: true,
                    draggable: false,
                    editable: false
                }
            }
            cxymap.drawingManager.setOptions(polygonoptions);
            cxymap.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        }
        cxymap.drawingManager.setMap(cxymap.map);
        google.maps.event.addListener(cxymap.drawingManager, 'overlaycomplete', function (event) {
            var latlngs = "";
            var pointArray = [];
            if (event.type == google.maps.drawing.OverlayType.MARKER) {
                latlngs = "";
                pointArray = [];
                var paths = event.overlay.getPosition();
                latlngs += paths["ob"] + ',' + paths["nb"];
                pointArray.push(new google.maps.LatLng(paths["nb"], paths["ob"]));
            }
            if (event.type == google.maps.drawing.OverlayType.POLYLINE) {
                latlngs = "";
                pointArray = [];
                var path = event.overlay.getPath().getArray();
                //  paths.getArray()[0]["ob"]
                for (var i = 0; i < path.length; i++) {
                    //  latlngs += paths.b[i].toUrlValue() + ":";
                    latlngs += path[i]["ob"] + ',' + path[i]["nb"] + ':';
                    pointArray.push(new google.maps.LatLng(path[i]["nb"], path[i]["ob"]));
                }
            }
            if (event.type == google.maps.drawing.OverlayType.POLYGON) {
                latlngs = "";
                pointArray = [];
                var paths = event.overlay.getPath();
                for (var i = 0; i < paths.length; i++) {
                    latlngs += paths.getAt(i).lng() + ',' + paths.getAt(i).lat() + ':';
                    pointArray.push(new google.maps.LatLng(paths.getAt(i).lat(), paths.getAt(i).lng()));
                }

            }
            event.overlay.setMap(null);
            obj.callback({ latlngs: latlngs, drawType: drawType, pointArray: pointArray, colorType: obj.colorType });
        })
    },
    endDrawPath: function () {
        var cxymap = this;
        for (var i in cxymap.polygonOptionsarr) {
            cxymap.polygonOptionsarr[i].setMap(null);
        }
        cxymap.polygonOptionsarr = [];
        return false;
        // return cxymap.Alllatlngs;
        // return cxymap.AlllatlngsArr;
    },
    finishDrawPath: function () {
        var cxymap = this;
        cxymap.drawingManager.setMap(null);
    },
    bindMarkerClickEve: function (element, id, callback, drawType, lineColor) {
        var cxymap = this;
        //google.maps.event.clearListeners(cxymap.map,"mouseup");
        //google.maps.event.addListener(cxymap.map, "mouseup", function () {
        //    markerInfo.getMapMarker();
        //});

        //google.maps.event.clearListeners(element, "mouseup");
        //google.maps.event.addListener(element, "mouseup", function () {
        //    markerInfo.getMapMarker();
        //});
        //监听cxymap改变时所对应的cxymap.map.getBounds()发生相应的变化

        //点击 编辑

        //google.maps.event.addListener(element, "click", function (event) {
        //    if (cxymap.drawingManager != undefined > 0) {
        //        cxymap.drawingManager.setMap(null);
        //    }
        //    if (cxymap.polygonOptionsarr != undefined > 0) {
        //        for (var name in cxymap.polygonOptionsarr) {
        //            cxymap.polygonOptionsarr[name].setOptions({ editable: false, draggable: false, strokeColor: "yellow" });
        //        }
        //    }
        //    cxymap.tempEditObj = [];
        //    if (drawType == "MARKER") {
        //        cxymap.tempEditObj = element.getPosition();
        //    } else {
        //        var pathArr = element.getPath()["b"];
        //        if (pathArr["length"] > 0) {
        //            for (var i = 0; i < pathArr["length"]; i++) {
        //                cxymap.tempEditObj.push(pathArr[i]);
        //            }
        //        }

        //    }
        //    cxymap.polygonOptionsarr[id].setOptions({ editable: true, draggable: true, strokeColor: "red" });
        //    callback({ id: id, type: "click", drawType: drawType, colorType: lineColor });
        //});
        //右击删除
        google.maps.event.addListener(element, "rightclick", function (event) {
            if (cxymap.polygonOptionsarr != undefined > 0) {
                for (var name in cxymap.polygonOptionsarr) {
                    cxymap.polygonOptionsarr[name].setOptions({
                        editable: false
                        //strokeColor: lineColor//"yellow"
                    });
                }
            } if (cxymap.drawingManager != undefined > 0) {
                cxymap.drawingManager.setMap(null);
            }
            callback({ id: id, type: "rightclick", drawType: drawType, colorType: lineColor });
        });
    },
    bindSetCenterEve: function (type, lttd, lgtd) {
        var cxymap = this;
        google.maps.event.clearListeners(cxymap.map, "bounds_changed");
        google.maps.event.addListener(cxymap.map, "bounds_changed", function () {

            if (type == 0) {
                google.maps.event.clearListeners(cxymap.map, "mouseup");
                google.maps.event.addListener(cxymap.map, "mouseup", function () {
                    markerInfo.getMapMarker(type, lttd, lgtd);
                });
            } else {
                markerInfo.getMapMarker(type, lttd, lgtd);
                type = 0;
            }


        });
    }
}