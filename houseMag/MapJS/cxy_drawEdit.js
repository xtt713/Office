
function cxy_drawEdit() {
    this.rapMap = undefined;
    this.width = 0;
    this.height = 0;
    this.drawObj = undefined;
    this.beDraw = false;
    this.pointObject = [];
    this.pointArr = [];
    this.id = "";
}

cxy_drawEdit.prototype.init = function (pdiv, imgPath, width, height,unitID) {
    var that = this;
    if (!that.rapMap) {
        that.rapMap = RaMap(pdiv, width, height);
    }
    that.width = width;
    that.height = height;

    that.drawObj = [];

    var img = that.rapMap.image(imgPath, 0, 0, width, height);

    var mousedown = false;
    //var pointArr = [];
    var ino = 0;

    $.ajax({
        url: './Svr/HandlerOffice.ashx',
        data: {
            cmd: 'getHousePath',
            unitID: unitID
        },
        dataType: 'json',
        success: function (result) {
            console.log(result);
            for (var i = 0; i < result.length; i++) {
                that.readPath(result[i].HousePosition, result[i].HouseID);
                that.readPath(result[i].pointPosition, result[i].HouseID, result[i].HouseName);
            }
            var current = null;
            for (var i = 0;i<that.pointArr.length;i++) {
                //that.pointArr[i].color = Raphael.getColor();
                (function (st, state) {
                    st[0].style.cursor = "pointer";
                    st[0].onmouseover = function () {
                        if (st.type == "path") {
                            st.animate({ fill: "purple", stroke: "#ccc", 'fill-opacity': 0.6}, 200);
                            //st.toFront();
                            that.rapMap.safari();
                        } else {
                            that.id = st.id;
                            var theSt = that.pointArr.filter(getPathObj);
                            theSt[0].animate({ fill: "purple", stroke: "#ccc" }, 200);
                        }
                        current = state;
                    };
                    st[0].onmouseout = function () {
                        if (st.type == "path") {
                            st.animate({ fill: "#333", stroke: "#fff", 'fill-opacity': 0.1 }, 100);
                            //st.toFront();
                            that.rapMap.safari();
                        } else {
                            that.id = st.id;
                            var theSt = that.pointArr.filter(getPathObj);
                            theSt[0].animate({ fill: "#333", stroke: "#fff" }, 100);
                        
                        }
                    };
                    st[0].onclick = function (event) {
                        showUnit.getFloorRObj(st.id);
                    }
                })(that.pointArr[i], that.pointArr[i].id);
            }
            function getPathObj(item) {
                return item.id == that.id && item.type == "path";
            }
        }, error: function (e) {
            console.log("123");
        }
    })
},
//删除某个raphael对象
cxy_drawEdit.prototype.deleteObj = function () {
    var that = this;
    that.beDraw = false;
    that.rapMap.forEach(function (el) {
        if (el.type == "path") {
            el.unclick();
        }
        
        el.click(function (event) {
            if (this.type == "path") {
                this.remove();
            }

        })
    });
}
//监听所有raphael对象
cxy_drawEdit.prototype.listenObj = function () {
    var that = this;
    that.rapMap.forEach(function (el) {
        el.click(function (event) {

        })
    });
},
cxy_drawEdit.prototype.setBeDraw = function (bedraw) {
    this.beDraw = bedraw;
},
cxy_drawEdit.prototype.saveObj = function () {
    var that = this;
    that.rapMap.forEach(function (el) {
        console.log(el);
    });
    for (var i = 0; i < that.pointObject.length; i++) {
        pointStr += that.pointObject[i].toString() + ".";
    }
    var str = pointStr.slice(0, pointStr.length - 1);

    //var pointStr = that.pointObject.slice(0, that.pointObject.length - 1);

    //$.ajax({
    //    type: 'post',
    //    url: 'HandlerSavePosition.ashx',
    //    data: { cmd: 'addHousePosition', UnitID: '1', HouseName: '一办公楼', HousePosition: str, HouseColor: color },
    //    dataType: 'json',
    //    success: function (data) {
    //        if (data == "1") {
    //            alert("数据保存成功");
    //            console.log("数据保存成功");
    //        } else {
    //            alert("数据保存失败")
    //        }
    //    },
    //    error: function (e) {
    //        console.log(e);
    //    }
    //});
},
cxy_drawEdit.prototype.drawPath = function (obj) {
    var that = this;
    if (obj.length > 3) {
        that.rapMap.top.remove();
    }
    var attrArea = {
        fill: color,
        'fill-opacity': 0.6,
        stroke: "white",
        'stroke-width': 2
    };

    //var cdrawv = "M" + obj[0].x + "," + obj[0].y;
    //for (var j = 1; j < obj.length; j++) {
    //	cdrawv += "L" + obj[j].x + "," + obj[j].y;
    //}
    var cdrawv = "M" + obj[0][0] + "," + obj[0][1];
    for (var j = 1; j < obj.length; j++) {
        cdrawv += "L" + obj[j][0] + "," + obj[j][1];
    }
    cdrawv += "Z";
    var drawo = that.rapMap.path(cdrawv).attr(attrArea);
},
cxy_drawEdit.prototype.readPath = function (str, houseID, houseName) {
    var that = this;

    //将"124,12|124,12|145,12|54,12"转换为[[124,12],[124,12],[145,12],[54,12]]
    if (houseName) {
        var pointArr = str.split(",");
        var rtxt = that.rapMap.text(pointArr[0], pointArr[1], houseName);
        rtxt.attr({
            "fill": "rgb(255,255,255)",
            //"stroke": "rgb(255,255,255)",
            "stroke-width":"1px",
            "font-size": "12px"
        })
        //rtxt.transform("r45");
        rtxt.id = houseID;
        that.pointArr.push(rtxt);
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
            fill: "#333",
            'fill-opacity': 0.1,
            stroke: "white",
            'stroke-width': 1,
            'stroke-dasharray': 2
        };
        var cdrawv = "M" + pathArr[0][0] + "," + pathArr[0][1];
        for (var j = 1; j < pathArr.length; j++) {
            cdrawv += "L" + pathArr[j][0] + "," + pathArr[j][1];
        }
        cdrawv += "Z";
        var drawo = that.rapMap.path(cdrawv).attr(attrArea);
        drawo.id = houseID;
        that.pointArr.push(drawo);
    }
},
cxy_drawEdit.prototype.drawAllPath = function (obj) {
    var that = this;
    var attrArea = {
        fill: "#333",
        'fill-opacity': 0.6,
        stroke: "white",
        'stroke-width': 2
    };
    for (var i = 0; i < that.drawObj.length; i++) {
        var drawM = that.drawObj[i];

        var cdrawv = "M" + drawM[0].x + "," + drawM[0].y;
        for (var j = 1; j < drawM.length; j++) {
            cdrawv += "L" + drawM[j].x + "," + drawM[j].y;
        }
        cdrawv += "Z";
        that.rapMap.path(cdrawv).attr(attrArea);
    }
}
cxy_drawEdit.prototype.EndDraw = function () {
    var that = this;
    var pointStr = "";
    
    drawEdit.setBeDraw(false);
    that.pointObject = [];
    pointArr = [];
}

