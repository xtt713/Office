
function cxy_drawfloor() {
    this.rapMap = undefined;
    this.width = 0;
    this.height = 0;
    this.drawObj = undefined;
    this._div = undefined;
    this.index = 1;
    this.floorRArr = [];
    this.houseId = "";
    this.getRoomResult = {};
}

cxy_drawfloor.prototype.init = function (parentDiv, px, py, floorno, width, height, houseId) {
    var that = this;
    if (that.rapMap) {
        that.rapMap.remove();
        that.rapMap = null;
        that.index = 1;
    }
    that._div = parentDiv;
    that._div.style.cssText = "position: absolute; font-size: 12px;font-family:'Microsoft Yahei';color: #555;background-color: white;border: 1px solid #cccccc;  -moz-box-shadow: 0 0 5px #000; -webkit-box-shadow: 0 0 5px #000;  box-shadow: 0 0 10px #000;  border-radius: 4px;z-index:99999";
    that.width = width;
    that.height = height;
    that._div.style.width = that.width + "px";
    that._div.style.height = that.height + "px";
    that._div.style.top = px + "px";
    that._div.style.left = py + "px";
    that._div.style.cursor = "default";

    that.drawfloor(that._div, floorno);
    that.houseId = houseId;
}

cxy_drawfloor.prototype.drawfloor = function (parentDiv, floorno) {
    var that = this;
    if (!that.rapMap) {
        that.rapMap = RaMap(parentDiv, that.width, that.height);
    }
    that.drawfloorA(floorno, floorno);


}

cxy_drawfloor.prototype.drawfloorA = function (no, floorno) {
    var that = this;
    var attrArea = {
        fill: "#333",
        'fill-opacity': 0.6,
        stroke: "white",
        'stroke-width': 2
    };
    var dx = 160;
    var dyvalue = (that.height - 120) / floorno * 0.5;
    var dy = no * dyvalue * 2 + 60;

    var cdrawv = "M" + dx + "," + (dy - dyvalue);
    cdrawv += "L" + (that.width - dx * 0.5) + "," + (dy - dyvalue);
    cdrawv += "L" + (that.width - dx) + "," + dy;
    cdrawv += "L" + (dx * 0.5) + "," + dy;
    cdrawv += "Z";
    var drawo = that.rapMap.path(cdrawv).attr(attrArea);
    drawo.id = that.index;
    that.floorRArr.push(drawo);
    var rtxt = that.rapMap.text((that.width - dx * 0.5), dy, that.index + "层");
    rtxt.attr({
        "fill": "rgb(250,168,9)",
        "stroke": "rgb(158,22,38)",
        "stroke-width": "1px",
        "font-size": "14px"
    });
    that.index++;

    var itime = 1000 / floorno;
    if (no > 1) {
        setTimeout(function () {
            no--;
            that.drawfloorA(no, floorno);
        }, itime);
    } else {
        for (let i = 0; i < that.floorRArr.length; i++) {
            that.floorRArr[i][0].style.cursor = "pointer";
            that.floorRArr[i][0].onmouseover = function () {
                that.floorRArr[i].animate({
                    "fill": "blue"
                }, 500)
            };
            that.floorRArr[i][0].onmouseout = function () {
                that.floorRArr[i].animate({
                    "fill": "#333"
                }, 500)
            }
            that.floorRArr[i][0].onclick = function () {
                $.ajax({
                    url: './Svr/HandlerOffice.ashx',
                    data: {
                        cmd: 'getRoomPath',
                        houseId: that.houseId,
                        floor: that.floorRArr[i].id
                    },
                    dataType: 'json',
                    success: function (result) {
                        $("#roomRBox").show();
                        $("#floorRBox").hide();
                        $("#closeFloorRBox").on('click', function (e) {
                            $("#roomRBox").hide();
                            $("#floorRBox").show();
                        })
                        var imgWidth = result.frameInfo[0].width;
                        var imgHeight = result.frameInfo[0].height;
                        var left = (window.innerWidth - imgWidth) / 2;
                        var top = (window.innerHeight - imgHeight) / 2;
                        var imgLeft = (window.innerWidth + Number(imgWidth)) / 2;
                        var imgTop = (window.innerHeight - Number(imgHeight)) / 2 - 130;
                        $("#closeFloorRBox").css({ "left": imgLeft, "top": imgTop });
                        var topnav = imgTop + Number(result.frameInfo[0].height);
                        var leftnav = left - Number(10);
                        $("#nav-chart-raphael").css({ "left": leftnav, "top": topnav });
                        that.type = 2;
                        getPieChart(result.frameInfo[0].HouseID, result.frameInfo[0].FLOOR);
                        getBuildingPercent(drawRoom, result.frameInfo[0].HouseID, result.frameInfo[0].FLOOR);
                        getRoomType(result.frameInfo[0].HouseID, result.frameInfo[0].FLOOR);
                        getDivPerson(result.roomPath, result.frameInfo[0].HouseID, result.frameInfo[0].FLOOR);
                     drawRoom.init(document.getElementById("roomRaphael"), imgTop, left, "", imgWidth, imgHeight, "", result);
                        $("#RoomDistribution").html("二办公楼第" + result.frameInfo[0].FLOOR + "层房间分布情况");
                    }, error: function (e) {
                        console.log(123)
                    }
                })
            }
        }
    }
}

//左上角饼状图
function getPieChart(buildingID, roomType) {
    var that = this;
    $.ajax({
        url: './Svr/HandlerOffice.ashx',
        data: {
            cmd: 'getPieChartHouse',
            buildingID: buildingID,
            roomType: roomType
        },
        dataType: 'json',
        success: function (data) {
            if (data.length == 0) {
                $("#office_pieChart2").html("<span class='red'>无相关数据</span>");
            } else {
                var html = "";
                //m,n,l分别代表达标和超标房间,空置房间出现次数已经空置房间总面积和超标，达标房间总面积
                var m = 0,
                    n = 0,
                    l = 0,
                    mArea = 0,
                    nArea = 0,
                    fullArea = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].barea == null || data[i].barea == "") {
                        l++;
                        fullArea = parseInt((fullArea + parseFloat(data[i].Area)) * 100) / 100;
                    }
                    else if (parseFloat(data[i].Area) <= scale * parseFloat(data[i].barea)) {
                        m++;
                        mArea = parseInt((mArea + parseFloat(data[i].Area)) * 100) / 100;
                    } else {
                        n++;
                        nArea = parseInt((nArea + parseFloat(data[i].Area)) * 100) / 100;
                    }
                }
                //console.log(mArea,nArea);
                //左上角饼状图
                $('#office_pieChart2').highcharts({
                    //整个饼状图图表样式
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        backgroundColor: 'rgba(4,27,83,0)',
                        borderRadius: 10
                    },
                    //版权信息:隐藏左下角版权信息图片
                    credits: {
                        enabled: false
                    },
                    //标题栏
                    title: {
                        text: '',
                        style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' },
                        margin: 50,
                        y: 40
                    },
                    //数据提示框
                    tooltip: {
                        //pointFormat: '{point.percentage:.1f} %'+'{point.y}'
                        pointFormatter: function () {
                            if (this.x == 0) {
                                return "空置率：" + (this.y / data.length * 100).toFixed(2) + "%,<br/>房间数：" + this.y + "间,<br/>总面积：" + mArea + "平方米";
                            } else if (this.x == 1) {
                                return "空置率：" + (this.y / data.length * 100).toFixed(2) + "%,<br/>房间数：" + this.y + "间,<br/>总面积：" + nArea + "平方米";
                            } else if (this.x == 2) {
                                return "空置率：" + (this.y / data.length * 100).toFixed(2) + "%,<br/>房间数：" + this.y + "间,<br/>总面积：" + fullArea + "平方米";
                            }
                        }
                    },
                    //图例
                    legend: {
                        itemStyle: {
                            color: '#84d8e6'
                        }
                    },
                    //数据列配置
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            colors: ["#5ec063", "#fc695c", "#555"],
                            dataLabels: {
                                distance: 10,
                                overflow: 'none',
                                enabled: true,
                                format: '{point.percentage:.1f} %',
                                style: {
                                    color: '#84d8e6'
                                }
                            }
                        },
                        series: {
                            point: {
                                events: {
                                    //饼状图点击事件
                                    click: function (e) {
                                        that.pieChartClick(e, buildingID, roomType);
                                    }
                                }
                            }
                        }
                    },
                    //数据列
                    series: [{
                        type: 'pie',
                        size: 150,
                        name: '办公用房使用情况:',
                        data: [
                            ['达标', m],
                            ['超标', n],
                            ['空置', l]
                        ],
                        showInLegend: true
                    }]
                });
            }
        },
        error: function (e) {
            console.log("接口出错，请联系相关人员");
        }
    });
}
//饼状图点击事件
function pieChartClick(e, buildingID, roomType) {
    var that = this;
    var statusHTML;
    if (e.point.name == "达标") {
        that.state = 1;
        statusHTML = "<span class='green'>达标</span>";
    } else if (e.point.name == "超标") {
        that.state = 0;
        statusHTML = "<span class='red'>超标</span>";
    } else {
        that.state = 2;
        statusHTML = "<span class='gray'>空置</span>";
    }
    $.ajax({
        url: './Svr/HandlerOffice.ashx',
        data: { cmd: 'getOfficeRoomHouse', rName: e.point.name, buildingId: buildingID, roomType: roomType },
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                var path = document.getElementById("roomRaphael").getElementsByTagName("path");
                var links = document.getElementById("roomRaphael").getElementsByTagName("tspan");
                for (var j = 0; j < links.length; j++) {
                    //if (getColor == "#fe0808" && data[i].RoomName != links[j].innerHTML) {
                    path[j].setAttribute("fill", "#01588E");
                    //}
                }
                for (var i = 0; i < data.length; i++) {
                    if (data[i].RoomName != undefined) {
                        for (var j = 0; j < links.length; j++) {
                            var getColor = path[j].getAttribute("fill");
                            if (data[i].RoomName == links[j].innerHTML) {
                                path[j].setAttribute("fill", "#fe0808");
                            }
                            //if (getColor == "#fe0808" && data[i].RoomName != links[j].innerHTML) {
                            //    path[j].setAttribute("fill", "#01588E");
                            //}
                        }
                    }
                }
            }
            else {
                clickBackGroup();
            }
        },
        error: function (e) {
            console.log("接口出错，请联系相关人员");
        }
    });
}

//办公楼人员职称分布情况(柱状图)
function getBuildingPercent(drawRoom, buildingID, roomType) {
    var that = this;
    $.ajax({
        url: './Svr/HandlerOffice.ashx',
        data: { cmd: 'personSpreadHouse', buildingId: buildingID, roomType: roomType },
        dataType: 'json',
        success: function (data) {
            var TitleArr = [],
        TitleNumArr = [],
        peopleNum = [];
            var titleArr = ["省级正职", "省级副职", "正厅级", "副厅级", "正处级", "副处级", "处级以下"];
            //处理数组返回的数据,先将data数据中的数值分别放到2个数组中，然后再将职称数组toString()化，再通过titleArr.indexOf()判断接口返回数据中是否存在职称，如果存在，则将对应的人数加入到TitleArr数组中，如果不存在，则加0

            for (var i = 0; i < data.length; i++) {
                TitleNumArr.push(data[i].TitleName);
                peopleNum.push(data[i].num);
            }
            for (var i = 0; i < titleArr.length; i++) {
                if (TitleNumArr.toString().indexOf(titleArr[i]) == -1) {
                    TitleArr.push(0);
                } else {
                    for (var j = 0; j < peopleNum.length; j++) {
                        if (TitleNumArr[j] == titleArr[i]) {
                            TitleArr.push(parseInt(peopleNum[j]));
                            break;
                        }
                    }
                }
            }
            chart = Highcharts.chart('people_chart2', {
                chart: {
                    type: 'column',
                    backgroundColor: 'rgba(4,27,83,0)',
                    borderRadius: 10
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: '',
                    style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                },
                xAxis: {
                    categories: titleArr,
                    labels: {
                        style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '人数',
                        style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                    },
                    labels: {
                        overflow: 'justify',
                        style: { color: '#84d8e6' }
                    },
                    allowDecimals: false
                },
                tooltip: {
                    pointFormat: ' <b>{point.y}</b> ' + "人",
                    shared: true
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            color: '#84d8e6'
                        }
                    }
                },
                //图例
                legend: {
                    itemStyle: {
                        color: '#84d8e6'
                    }
                },
                series: [{
                    data: TitleArr,
                    colorByPoint: true,
                    showInLegend: false,
                    point: {
                        events: {
                            click: function (e) {
                                columnChartClick(drawRoom, e, buildingID, roomType);
                            }
                        }
                    }
                }]
            });
        },
        error: function (e) {
            console.log("接口出错，请联系相关开发人员");
        }
    })
}
//办公人员职称统计（点击方法）
function columnChartClick(drawRoom, e, buildingID, roomType) {
    switch (e.point.category) {
        case "省级正职":
            getOfficeRoomHouseClick(drawRoom, "1", buildingID,roomType);
            break;
        case "省级副职":
            getOfficeRoomHouseClick(drawRoom, "2", buildingID, roomType);
            break;
        case "正厅级":
            getOfficeRoomHouseClick(drawRoom, "3", buildingID, roomType);
            break;
        case "副厅级":
            getOfficeRoomHouseClick(drawRoom, "4", buildingID, roomType);
            break;
        case "正处级":
            getOfficeRoomHouseClick(drawRoom, "5", buildingID, roomType);
            break;
        case "副处级":
            getOfficeRoomHouseClick(drawRoom, "6", buildingID, roomType);
            break;
        case "处级以下":
            getOfficeRoomHouseClick(drawRoom, "7", buildingID, roomType);
            break;
    }

}
//办公人员职称统计（点击方法,改变对应房间背景）
function getOfficeRoomHouseClick(drawRoom, titleID, buildingID, roomType) {
    $.ajax({
        url: './Svr/HandlerOffice.ashx',
        data: { cmd: 'getOfficeRoomHouseClick', titleId: titleID, buildingId: buildingID, roomType: roomType },
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                drawRoom.clearColor();
                for (var i = 0; i < data.length; i++) {
                    drawRoom.setRoomColor(data[i].ID, 'red');
                }
            }
            else {
                clickBackGroup();
            }
        },
        error: function (e) {
            console.log("接口出错，请联系相关人员");
        }
    });
}
//办公室分类统计(只有办公室，服务用房，设备用房，附属用房四种）
function getRoomType(buildingID, floor) {
    var that = this;
    $.ajax({
        url: 'Svr/HandlerOffice.ashx',
        data: {
            cmd: 'getRoomNumHouse',
            buildingID: buildingID,
            floor: floor
        },
        dataType: 'json',
        success: function (data) {
            $.ajax({
                url: 'Svr/HandlerOffice.ashx',
                data: {
                    cmd: 'getRoomType',
                    houseType: 1
                },
                dataType: 'json',
                success: function (result) {
                    if (result.length > 0) {
                        var html = "";
                        $("#roomTypeNum").html("");
                        for (var i = 0; i < result.length; i++) {
                            var filterData;
                            filterData = data.filter(getTheTypeData) || 0;
                            //getUseNum(filterData, result[i].Type, result[i].ID);
                            function getTheTypeData(data) {
                                return data.Type == result[i].Type;
                            }
                        }
                        var TitleArr = [],
                        TitleNumArr = [],
                        peopleNum = [];
                        var titleArr = result;//X轴
                        //处理数组返回的数据,先将data数据中的数值分别放到2个数组中，然后再将职称数组toString()化，再通过titleArr.indexOf()判断接口返回数据中是否存在职称，如果存在，则将对应的人数加入到TitleArr数组中，如果不存在，则加0

                        for (var i = 0; i < result.length; i++) {
                            var useRoomNum = 0;
                            //获取已用房间数量
                            for (var j = 0; j < data.length; j++) {
                                if (data[j].barea == "无" || data[j].barea == "") {

                                } else {
                                    if (result[i].Type == data[j].Type)
                                    {
                                        useRoomNum++;
                                    }
                                }
                            }
                            //var getRTypeData = "showRoom.getRTypeData('"+ roomType +"')";
                            //$("#roomTypeNum").append("<tr name='"+ roomType +"' ><td>" + type + "</td><td>" + data.length + "</td><td>"+ useRoomNum +"</td></tr>");
                            TitleNumArr.push(result[i].Type);
                            peopleNum.push(useRoomNum);
                        }
                        //for (var i = 0; i < titleArr.length; i++) {
                        //    //if (TitleNumArr.toString().indexOf(titleArr[i]) == -1) {
                        //    //    TitleArr.push(0);
                        //    //} else {
                        //    for (var j = 0; j < peopleNum.length; j++) {
                        //        TitleArr.push(parseInt(peopleNum[j]));
                        //        break;
                        //    }
                        //    // }
                        //}
                        chart = Highcharts.chart('people_navchart', {
                            chart: {
                                type: 'column',
                                backgroundColor: 'rgba(4,27,83,0)',
                                borderRadius: 10
                            },
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: '',
                                style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                            },
                            xAxis: {
                                categories: TitleNumArr,
                                labels: {
                                    style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                                }
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: '数量',
                                    style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                                },
                                labels: {
                                    overflow: 'justify',
                                    style: { color: '#84d8e6' }
                                },
                                allowDecimals: false
                            },
                            tooltip: {
                                pointFormat: ' <b>{point.y}</b> ' + "个",
                                shared: true
                            },
                            plotOptions: {
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        color: '#84d8e6'
                                    }
                                }
                            },
                            //图例
                            legend: {
                                itemStyle: {
                                    color: '#84d8e6'
                                }
                            },
                            series: [{
                                data: peopleNum,
                                colorByPoint: true,
                                showInLegend: false,
                                point: {
                                    events: {
                                        click: function (e) {
                                            RoomTypeClick(e, buildingID, floor);
                                        }
                                    }
                                }
                            }]
                        });
                    }
                }, error: function (e) {
                    console.log("接口出错，请联系相关开发人员");
                }
            })
        }, error: function () {
            console.log("接口错误，请联系相关开发人员");
        }
    });
}
//办公室分类统计图形点击（显示房间背景方法）
function RoomTypeClick(e, houseId, floorId) {
    switch (e.point.category) {
        case "办公室":
            RoomTypeInfoShow("1", houseId, floorId);
            break;
        case "服务用房":
            RoomTypeInfoShow("2", houseId, floorId);
            break;
        case "设备用房":
            RoomTypeInfoShow("3", houseId, floorId);
            break;
        case "附属用房":
            RoomTypeInfoShow("4", houseId, floorId);
            break;
    }
}
function RoomTypeInfoShow(roomTypeId, houseId, floorId) {
    $.ajax({
        url: './Svr/HandlerOffice.ashx',
        data: { cmd: 'getRoomTypeClick', roomTypeId: roomTypeId, houseId: houseId, floor: floorId },
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                var links = document.getElementById("roomRaphael").getElementsByTagName("tspan");
                var path = document.getElementById("roomRaphael").getElementsByTagName("path");
                for (var j = 0; j < links.length; j++) {
                    //if (getColor == "#fe0808" && data[i].RoomName != links[j].innerHTML) {
                    path[j].setAttribute("fill", "#01588E");
                    //}
                }
                for (var i = 0; i < data.length; i++) {
                    if (data[i].RoomName != undefined) {
                        for (var k = 0; k < links.length; k++) {
                            var getColor = path[k].getAttribute("fill");
                            if (data[i].RoomName == links[k].innerHTML) {
                                path[k].setAttribute("fill", "#fe0808");
                            }
                            //if (getColor == "#fe0808" && data[i].RoomName != links[j].innerHTML) {
                            //    path[j].setAttribute("fill", "#01588E");
                            //}
                        }
                    }
                }
            }
            else {
                clickBackGroup();
            }
        },
        error: function (e) {
            console.log("接口出错，请联系相关人员");
        }
    });
}




//处室人员统计
function getDivPerson(roomPath,houseId,floor) {
    var roomID = "";
    for (var i = 0; i < roomPath.length; i++) {
        roomID += "'" + roomPath[i].ID + "',";
    }
    roomID = roomID.substring(0, roomID.length - 1);
    var that = this;
    $.ajax({
        url: './Svr/HandlerOffice.ashx',
        data: { cmd: 'getDivPerson', roomID: roomID },
        dataType: 'json',
        success: function (data) {
            var TitleArr = [],
        TitleNumArr = [],
        peopleNum = [];
            var titleArr = [];
            //处理数组返回的数据,先将data数据中的数值分别放到2个数组中，然后再将职称数组toString()化，再通过titleArr.indexOf()判断接口返回数据中是否存在职称，如果存在，则将对应的人数加入到TitleArr数组中，如果不存在，则加0
            for (var i = 0; i < data.length; i++) {
                titleArr.push(data[i].DivisionName);
                TitleArr.push(parseInt(data[i].Total));
            }
            chart = Highcharts.chart('office_navpieChart', {
                chart: {
                    type: 'column',
                    backgroundColor: 'rgba(4,27,83,0)',
                    borderRadius: 10
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: '',
                    style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                },
                xAxis: {
                    categories: titleArr,
                    labels: {
                        style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '人数',
                        style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                    },
                    labels: {
                        overflow: 'justify',
                        style: { color: '#84d8e6' }
                    },
                    allowDecimals: false
                },
                tooltip: {
                    pointFormat: ' <b>{point.y}</b> ' + "人",
                    shared: true
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            color: '#84d8e6'
                        }
                    }
                },
                //图例
                legend: {
                    itemStyle: {
                        color: '#84d8e6'
                    }
                },
                series: [{
                    data: TitleArr,
                    colorByPoint: true,
                    showInLegend: false,
                    point: {
                        events: {
                            click: function (e) {
                                columnChartClickHouse(e, houseId, floor);
                            }
                        }
                    }
                }]
            });
        },
        error: function (e) {
            console.log("接口出错，请联系相关开发人员");
        }
    })
}
//处室分布情况（点击方法）
function columnChartClickHouse(e, buildingID, floor) {
    var divName = e.point.category;
    $.ajax({
        url: './Svr/HandlerOffice.ashx',
        data: { cmd: 'getColumnChartmHouseClick', divName: divName, buildingId: buildingID, roomType: floor },
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                var links = document.getElementById("roomRaphael").getElementsByTagName("tspan");
                var path = document.getElementById("roomRaphael").getElementsByTagName("path");
                for (var j = 0; j < links.length; j++) {
                    //if (getColor == "#fe0808" && data[i].RoomName != links[j].innerHTML) {
                    path[j].setAttribute("fill", "#01588E");
                    //}
                }
                for (var i = 0; i < data.length; i++) {
                    if (data[i].RoomName != undefined) {
                        for (var j = 0; j < links.length; j++) {
                            var getColor = path[j].getAttribute("fill");
                            if (data[i].RoomName == links[j].innerHTML) {
                                path[j].setAttribute("fill", "#fe0808");
                            }
                            //if (getColor == "#fe0808" && data[i].RoomName != links[j].innerHTML) {
                            //    path[j].setAttribute("fill", "#01588E");
                            //}
                        }
                    }
                }
            }
            else {
                clickBackGroup();
            }
        },
        error: function (e) {
            console.log("接口出错，请联系相关人员");
        }
    });
}
//清除上一次点击事件所显示的房间背景
function clickBackGroup() {
    var links = document.getElementById("roomRaphael").getElementsByTagName("tspan");
    var path = document.getElementById("roomRaphael").getElementsByTagName("path");
    for (var j = 0; j < links.length; j++) {
        //if (getColor == "#fe0808" && data[i].RoomName != links[j].innerHTML) {
        path[j].setAttribute("fill", "#01588E");
        //}
    }
}

