
function cxydrawmeta() {
    this.drawObj = [];
    this.minzoom = undefined;
    this.map = undefined;
    this.rapMap = undefined;
    this.containerDiv = document.createElement("div");
    this.containerDiv.style.cssText = "position: absolute; display: none;";
    this.stcdType = undefined;
    this.bounds = undefined;
    this.lgtdMax = undefined;
    this.lgtdMin = undefined;
    this.lttdMax = undefined;
    this.lttdMin = undefined;
    this.width = undefined;
    this.height = undefined;
    this.lastZoom = undefined;
}

cxydrawmeta.prototype.init = function (map, minzoom, width, height) {
    var that = this;
    that.setMap(map);
    that.map = map;
    that.minzoom = minzoom;
    if (!that.rapMap) {
        that.rapMap = RaMap(that.containerDiv, width, height);
    }
    that.width = width;
    that.height = height;
    google.maps.event.addListener(that.map, 'idle', function () {
        that.bounds = that.map.getBounds();
        that.lgtdMax = that.bounds.getNorthEast().lng(); //经度
        that.lttdMax = that.bounds.getNorthEast().lat(); //纬度
        that.lgtdMin = that.bounds.getSouthWest().lng(); //经度
        that.lttdMin = that.bounds.getSouthWest().lat(); //纬度
        var nw = new google.maps.LatLng(that.lttdMax, that.lgtdMin);
        var pp = that.getProjection().fromLatLngToDivPixel(nw);
        that.containerDiv.style.left = pp.x + "px";
        that.containerDiv.style.top = pp.y + "px";
        that.containerDiv.style.display = "block";
        that.showMate();
    });
}

cxydrawmeta.prototype.resetwindow = function (width, height) {
    var that = this;
    that.width = width;
    that.height = height;
}

cxydrawmeta.prototype.onAdd = function () {
    this.getPanes().overlayImage.appendChild(this.containerDiv);
};

cxydrawmeta.prototype.addMeta = function (obj) {
    var that = this;
    var newObj = new Object();
      
    newObj.id = obj.id;
    newObj.name = obj.name;
    newObj.boundsV = new Object();
    newObj.boundsV.leftx = 180;
    newObj.boundsV.topy = 90;
    newObj.boundsV.rightx = 0;
    newObj.boundsV.botoomy = 0;
    newObj.boundsV.point = [];


    var pointArray = obj.path.split(',');

    for (i = 0; i < pointArray.length / 2; i++) {
        var nw = new google.maps.LatLng(pointArray[i * 2 + 1], pointArray[i * 2]);
        newObj.boundsV.point[i] = nw;
        if (newObj.boundsV.leftx > pointArray[i * 2]) {
            newObj.boundsV.leftx = pointArray[i * 2];
        }
        if (newObj.boundsV.topy > pointArray[i * 2 + 1]) {
            newObj.boundsV.topy = pointArray[i * 2 + 1];
        }
        if (newObj.boundsV.rightx < pointArray[i * 2]) {
            newObj.boundsV.rightx = pointArray[i * 2];
        }
        if (newObj.boundsV.botoomy < pointArray[i * 2 + 1]) {
            newObj.boundsV.botoomy = pointArray[i * 2 + 1];
        }
    }

    newObj.color = obj.color;
    newObj.type = obj.type;
    newObj.drawValue = undefined;
    newObj.ani1;
    newObj.ani2;
    newObj.stylebe = obj.stylebe;
    newObj.styleend = obj.styleend;
    that.drawObj.push(newObj);
}

cxydrawmeta.prototype.showMate = function () {
    var that = this;
    for (var i = 0; i < that.drawObj.length; i++) {
        var dObj = that.drawObj[i];
        if (dObj.drawValue) {
            /*var x = (dObj.boundsV.cv - that.lgtdMin) / (that.lgtdMax - that.lgtdMin) * that.width;
            var y = (that.lttdMax - dObj.lttd) / (that.lttdMax - that.lttdMin) * that.height;
            var tranx, trany;
            tranx = x - dObj.x;
            trany = y - dObj.y;
            dObj.drawValue.transform("t" + [tranx, trany]);*/
        } else {
            //if (dObj.lgtd > that.lgtdMin && dObj.lgtd < that.lgtdMax && dObj.lttd > that.lttdMin && dObj.lttd < that.lttdMax) {
                that.drawMate(dObj);
            //}
        }        
    }
}

cxydrawmeta.prototype.drawMate = function (obj) {
    var that = this;
    

    var attr = {
        fill: "#333",
        'fill-opacity': 0.6,
        stroke: "white",
        'stroke-width': 2
    };

    var attrText = { font: "12px 微软雅黑", opacity: 1, fill: "white" };

    var current = null;
    for (var i = 0; i < that.drawObj.length; i++) {
        var drawM = that.drawObj[i];

        var dp = this.getProjection().fromLatLngToDivPixel(drawM.boundsV.point[0]);
        var cdrawv = "M" + dp.x + "," + dp.y;
        for(var j = 1; j < drawM.boundsV.point.length; j++){
            dp = this.getProjection().fromLatLngToDivPixel(drawM.boundsV.point[j]);
            cdrawv += "L" + dp.x + "," + dp.y;
        }
        cdrawv += "Z";

        drawM.drawValue = that.rapMap.path(cdrawv).attr(attr);
        drawM.drawValue.drawText = that.rapMap.text((drawM.boundsV.leftx + drawM.boundsV.rightx) / 2, (drawM.boundsV.topy + drawM.boundsV.botoomy) / 2, drawM.name).attr(attrText);
        drawM.drawValue.color = RaMap.getColor();

        (function (st, state) {
            st[0].style.cursor = "pointer";
            st[0].onmouseover = function () {                
                current && st.animate({ fill: "#333", stroke: "white" }, 500);
                st.animate({ fill: st.color, stroke: "#ccc", 'fill-opacity': 1 }, 500);
                //st.toFront();
                that.rapMap.safari();
                
                current = state;
            };
            st[0].onmouseout = function () {                
                st.animate({ fill: "#333", stroke: "white", 'fill-opacity': 0.6 }, 500);                
                //st.toFront();
                that.rapMap.safari();
            };
            st[0].onclick = function (event) {
                //AddTxt(document.getElementById("paper"), 600, 300, event, 3);
            }
            if (state == "nsw") {
                st[0].onmouseover();
            }
        })(drawM.drawValue, drawM.id);
    }
}

cxydrawmeta.prototype.draw = function () {
    var that = this;
    var zoom = that.map.getZoom();

    if (that.lastZoom == zoom) {
        if (that.lttdMax != undefined) {
            var nw = new google.maps.LatLng(that.lttdMax, that.lgtdMin);
            var pp = that.getProjection().fromLatLngToDivPixel(nw);
            that.containerDiv.style.left = pp.x + "px";
            that.containerDiv.style.top = pp.y + "px";
        }
        return;
    }
    that.lastZoom = zoom;
    if (that.containerDiv != undefined) {
        that.containerDiv.style.display = "none";
    }
};

cxydrawmeta.prototype.clearmeta = function () {
    var that = this;

    for (var i = 0; i < that.drawObj.length; i++) {
        var dObj = drawObj.drawObj[i];
        if (dObj.drawValue) {
            dObj.drawValue.remove();
        }
    }
};
