
function cxy_drawRoom() {
    this.rapMap = undefined;
    this.width = 0;
    this.height = 0;
    this.drawObj = undefined;
    this._div = undefined;
    this.index = 1;
    this.floorRArr = [];
    this.houseId = "";
    this.type = "";
    this.getRoomResult = {};
    this.roomArr = [];
    this.id = [];
}

cxy_drawRoom.prototype.init = function (parentDiv, px, py, floorno, width, height, houseId, result) {
    var that = this;
    if (that.rapMap) {
        that.rapMap.remove();
        that.rapMap = null;
        that.index = 1;
    }
    that._div = parentDiv;
    that.getRoomResult = result;
    that._div.style.cssText = "font-size: 12px;font-family:'Microsoft Yahei';color: #555;background-color: white;border: 1px solid #cccccc;padding:10px;  -moz-box-shadow: 0 0 5px #000; -webkit-box-shadow: 0 0 5px #000;  box-shadow: 0 0 10px #000;  border-radius: 4px;z-index:99999";
    that.width = width;
    that.height = height;
    that._div.style.width = that.width + "px";
    //that._div.style.height = that.height + "px";
    //that._div.style.top = px + "px";
    //that._div.style.left = py + "px";
    that._div.style.cursor = "default";

    that.drawfloor(that._div, floorno);
    that.houseId = houseId;
}

cxy_drawRoom.prototype.drawfloor = function (parentDiv, floorno) {
    var that = this;
    if (!that.rapMap) {
        that.rapMap = RaMap(parentDiv, that.width, that.height);
    }
    that.drawRoomR(that.getRoomResult.frameInfo[0].BoundaryPath);
    for (var i = 0; i < that.getRoomResult.roomPath.length; i++) {
        if (that.getRoomResult.roomPath[i].BoundaryPosition != "" && that.getRoomResult.roomPath[i].textPosition != "") {
            that.drawRoomR(that.getRoomResult.roomPath[i].BoundaryPosition, that.getRoomResult.roomPath[i].ID);
            that.drawRoomR(that.getRoomResult.roomPath[i].textPosition, that.getRoomResult.roomPath[i].ID, that.getRoomResult.roomPath[i].RoomName);
        }
    }
    for (let j = 0; j < that.roomArr.length; j++) {
        that.roomArr[j][0].style.cursor = "pointer";
        that.roomArr[j][0].onmouseover = function () {
            if (!that.roomArr[j].id) {
            } else if (that.roomArr[j].type == "path") {
                that.roomArr[j].animate({
                    "fill": "green"
                }, 100)
            } else {
                that.id = that.roomArr[j].id;
                var theSt = that.roomArr.filter(getPathObj);
                theSt[0].animate({
                    "fill": "green"
                }, 100)
            }
            show(this, "roomInfoBox");
            showUnit.showRRoomData(that.roomArr[j].id);
        },
        that.roomArr[j][0].onmouseout = function () {
            if (!that.roomArr[j].id) {
                return
            }
            else if (that.roomArr[j].type == "path") {
                that.roomArr[j].animate({
                    "fill": "#01588E"
                }, 100)
            } else {
                that.id = that.roomArr[j].id;
                var theSt = that.roomArr.filter(getPathObj);
                theSt[0].animate({
                    "fill": "#01588E"
                }, 100)
            }
            $(this).css({ opacity: '1' });
            $("#roomInfoBox").hide();
        },
        that.roomArr[j][0].onclick = function (e) {
            if (that.roomArr[j].id) {
                //showUnit.showRRoomData(that.roomArr[j].id);
            }
        }
    }
    function getPathObj(item) {
        return item.id == that.id && item.type == "path";
    }
},
cxy_drawRoom.prototype.drawRoomR = function (str, roomId, roomName) {
    var that = this;

    //将"124,12|124,12|145,12|54,12"转换为[[124,12],[124,12],[145,12],[54,12]]
    if (roomName) {
        var pointArr = str.split(",");
        var rtxt = that.rapMap.text(pointArr[0], pointArr[1], roomName);
        rtxt.attr({
            //"fill": "rgb(255,255,255)",
            "stroke": "rgb(255,255,255)",
            //"stroke-width": "1px",
            "font-size": "12px",
            "font-family": "Microsoft YaHei",
        })
        rtxt.id = roomId;
        that.roomArr.push(rtxt);
    } else {
        var splitArr = str.split(".");
        var pathArr = [];
        for (var i = 0; i < splitArr.length; i++) {
            var arr = splitArr[i].split(",");
            for (var j = 0; j < arr.length; j++) {
                arr[j] = parseInt(arr[j]);
            }
            pathArr.push(arr);
        }
        var attrArea = {
            fill: "#01588E",
            'fill-opacity': 0.6,
            stroke: "white",
            'stroke-width': 2
        };
        var cdrawv = "M" + pathArr[0][0] + "," + pathArr[0][1];
        for (var j = 1; j < pathArr.length; j++) {
            cdrawv += "L" + pathArr[j][0] + "," + pathArr[j][1];
        }
        cdrawv += "Z";
        var drawo = that.rapMap.path(cdrawv).attr(attrArea);
        drawo.id = roomId;
        that.roomArr.push(drawo);
    }
}

cxy_drawRoom.prototype.clearColor = function () {
    var that = this;
    var attrArea = {
        fill: "#01588E",
        'fill-opacity': 0.6,
        stroke: "white",
        'stroke-width': 2
    };

    for (let j = 0; j < that.roomArr.length; j++) {
        that.roomArr[j].attr(attrArea);
    }
}

cxy_drawRoom.prototype.setRoomColor = function (roomId, color) {
    var that = this;

    for (let j = 0; j < that.roomArr.length; j++) {
        if (that.roomArr[j].id == roomId) {
            that.roomArr[j].attr({ fill: color });
        }
    }
}
/**  * 鼠标移上去显示层  * @param divId 显示的层ID  * @returns  */
function show(obj, id) {

    var objDiv = $("#" + id + "");

    $(objDiv).css("display", "block");

    $(objDiv).css("z-index", "99999");

    $(objDiv).css("left", event.clientX);

    $(objDiv).css("top", event.clientY + 10);

}



