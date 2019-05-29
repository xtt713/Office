//var panorama = new panorama_cxy();
function _showRoom() {
    this.unitID = "";
    this.buildingID = "";
    this.houseSubID = "";
    this.floor = "";
    this.divisionID = "";
    this.titleID = "";
    this.RoomID = "";
    this.state = "";
    this.type = "";
    this.roomType="1";
}
_showRoom.prototype = {
    init: function (unitID, buildingID,type) {
        var that = this;    
        that.unitID = unitID;
        that.buildingID = buildingID;
        that.houseSubID = "";
        that.floor = "";
        that.divisionID = "";
        that.titleID = "";
        that.RoomID = "";
        that.state = "";
        //that.roomType="1";
        that.type = type;
        $("#buildingImgList").hide();
        $("#otherHouseDistribute").hide();

        $("#RoomDetail").stop(true, true).slideDown();
        $(".user-manage").stop(true, true).slideDown();
        $("#office_pieChart").stop(true, true).slideDown();
        $("#people_chart").stop(true, true).slideDown();
        $(".button-group").fadeIn();
        
        that.getHouse(unitID);
        that.getJobArea();
        that.searchContent(that.buildingID);
        
        that.changeSearchGroup();
        that.getRoomType(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,that.titleID,that.state,that.roomType);
        that.getOtherRoomType(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,that.titleID,that.state,that.roomType);
        $("#generate_excel").click(function () {
            //获取当前处室/办公室数据，并导出到excel中
            that.exportExcel();
            //将后台的内容以table形式添加到table表中2018-03-28 SYF
        });
        $(".nav-pills1").find("li").on('click', function (e) {
            $(".nav-pills.nav-pills1 li").removeClass("active");
            $(e.target).parent().addClass("active");
            $("#buildingImgList").hide();
            $("#roomTable").hide();
            $("#" + $(e.target).attr("name")).show();
            
        });
        //导航栏点击事件
        $(".nav-pills2").find("li").on('click', function (e) {
            $(".nav-pills.nav-pills2 li").removeClass("active");
            $(e.target).parent().addClass("active");
            $(".center-bottom .center-bottom-L p").hide();
            $("#" + $(e.target).attr("name")).show();
            
        });
        
        //公有房产分布tab切换事件
        $(".nav-pills3").find("li").on('click', function (e) {
            $(".nav-pills.nav-pills3 li").removeClass("active");
            $(e.target).parent().addClass("active");
            $(".tableClass  table").hide();
            $("#" + $(e.target).attr("name")).show();
            
        });

        //返回键点击
        $("#gobackToMap").off("click");
        $("#gobackToMap").on('click', function () {
            //that.buildingID = $("#button_group ").find("li span.opacity1").attr("name");
            //$(".button-group").fadeOut();
            //$("#RoomDetail").stop(true, true).slideUp();
            //$(".user-manage").stop(true, true).slideUp();
            //$("#divround").stop(true, true).animate({ 'top': that.animateHeight });
            //$(".button-group li").find("span").removeClass("opacity1");
            //$("#office_pieChart").stop(true, true).slideUp();
            //$("#people_chart").stop(true, true).slideUp();

            //var drawEdit = new cxy_drawEdit();
            //var cxymap = new cxygoogleMap();
            //var drawFloor = new cxy_drawfloor();
            //var drawRoom = new cxy_drawRoom();
            //var scale = 1.5;


            //cxymap.init(document.getElementById("DMapContiner"), 'http://192.168.3.107/csmap/', 'http://192.168.3.117/csDx/', 6, 18, 15, 112.9832970673, 28.1142209008);
            //var showOrHide = 0;
            //$("#leftDivHide").click(function () {
            //    if (showOrHide == 0) {
            //        $("#divList").hide();
            //        showOrHide++;
            //    } else {
            //        $("#divList").show();
            //        showOrHide = 0;
            //    }
            //});


            //var showUnit = new _showUnit();
            //showUnit.init();
           
            ////点击房间界面的返回按钮
            //common.initHtml("html/homePage.html", $("body"), function () {
            //    showUnit.init();
            //});
            $("#room-detail-show").hide();
            //if ($(this).hasClass('toggle')) {
            //    $(this).attr("title", "收起侧边面板");
            //    $(this).removeClass('toggle');
            //    $("#main_left").animate({ left: '0' });
            //    $("#toggleBox").animate({ left: that.left });
            //} else {
            //    $(this).attr("title", "展开侧边面板");
            //    $(this).addClass('toggle');
            //    $("#main_left").animate({ left: "-"+that.left });
            //    $("#toggleBox").animate({ left: '0' });
            //}
            $("#main_left").show();
            $("#main_left").css({"z-index": 99999});
            $("#divCenter").show();
        });
        //获取楼层搜索内容
        //当分区搜索或楼层搜索发生变化时，触发搜索功能
        $(".build-search").find("select").off('change');
        $(".build-search").find("select").on("change", function (e) {
            $("#searchGroup>input").val("");
            that.getData(1);
        });
    },
    getHouse:function(unitID){
        var that = this;
        $.ajax({
            url:'./Svr/HandlerOffice.ashx',
            data:{
                cmd:'getHouseName',
                unitID:unitID,
                type:that.type
            },
            dataType:'json',
            success:function(data){
                $.ajax({
                    url:'./Svr/HandlerOffice.ashx',
                    data:{
                        cmd:'getColor',
                        top:data.length
                    },
                    dataType:'json',
                    success:function(result){
                        var html = "";
                        for(var i = 0;i<data.length;i++){
                            html+="<li title='"+ data[i].HouseName +"'><span name='"+ data[i].ID +"' style='background-color:"+ result[i].Color +"'>"+ data[i].HouseName.substring(0,2) +"</span></li>";
                        }
                        $("#houseButton").html(html);
                        $(".button-group").find("span[name=" + that.buildingID + "]").addClass("opacity1");
                        //办公楼点击
                        $("#houseButton li").find("span").off("click")
                        $("#houseButton li").find("span").on('click', function (e) {
                            $("#houseButton li").find("span").removeClass("opacity1");
                            $("#houseButton").find("span[name=" + $(e.target).attr("name") + "]").addClass("opacity1");
                            $("#housesubSearch").find("option[name='']").attr("selected",true);
                            $("#floorSearch").find("option[name='']").attr("selected",true);
                            $("#divisionSearch").find("option[name='']").attr("selected",true);
                            $("#searchGroup>input").val("");
                            that.buildingID = $(e.target).attr("name");
                            that.roomType="1";
                            that.divisionID = "";
                            that.titleID = "";
                            that.state = "";
                            //搜索内容会发生相应的改变
                            $("#center_title").html($(e.target).parent().attr("title") + "详细信息");
                            that.searchContent(that.buildingID);
                            that.getData(1);
                            that.getRoomType(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,that.titleID,that.state,that.roomType);
                            that.getOtherRoomType(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,that.titleID,that.state,that.roomType);
                            
                        });
                        that.getData(1);
                    },error:function(e){
                        console.log("接口错误，请联系相关开发人员。");
                    }
                })
                

            },error:function(e){
                console.log("接口错误，请联系相关开发人员");
            }
        })
    },
    getData:function(type){
        var that = this;
        that.buildingID = $("#button_group ").find("li span.opacity1").attr("name");
        
        that.houseSubID = $("#housesubSearch").find("option:selected").attr("name");
        that.floor = $("#floorSearch").find("option:selected").attr("name");
        that.divisionID = $("#divisionSearch").find("option:selected").attr("name");
        that.PName = $("#searchGroup>input").val();
        
        that.getRoomTable(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,that.titleID,that.state,that.roomType);
        if(type==0){

        }else{
            that.getPieChart(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,that.titleID,that.roomType);
            that.getBuildingPercent(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,that.state,that.roomType);
        }
    },
    //左上角饼状图
    getPieChart: function (buildingID, houseSubID, floor, divisionID, PName,titleID,roomType) {
        var that = this;
        $.ajax({
            url:'./Svr/HandlerOffice.ashx',
            data:{
                cmd:'getPieChart',
                buildingID:buildingID,
                houseSubID:houseSubID,
                floor:floor,
                divisionID:divisionID,
                PName:PName,
                titleID:titleID,
                roomType:roomType
            },
            dataType:'json',
            success:function(data){
                if(data.length==0){
                    $("#office_pieChart").html("<span class='red'>无相关数据</span>");
                }else{
                    var html = "";
                    //m,n,l分别代表达标和超标房间,空置房间出现次数已经空置房间总面积和超标，达标房间总面积
                    var m = 0,
                        n = 0,
                        l = 0,
                        mArea=0,
                        nArea=0,
                        fullArea =0;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].barea == null || data[i].barea == "") {
                            l++;
                            fullArea=parseInt((fullArea+parseFloat(data[i].Area))*100)/100;
                        }
                        else if (parseFloat(data[i].Area) <= scale * parseFloat(data[i].barea)) {
                            m++;
                            mArea=parseInt((mArea+parseFloat(data[i].Area))*100)/100;
                        } else {
                            n++;
                            nArea=parseInt((nArea+parseFloat(data[i].Area))*100)/100;
                        }
                    }
                    //console.log(mArea,nArea);
                    //左上角饼状图
                    $('#office_pieChart').highcharts({
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
                                if(this.x==0){
                                    return "空置率："+(this.y / data.length * 100).toFixed(2) + "%,<br/>房间数：" + this.y + "间,<br/>总面积："+mArea+"平方米";
                                }else if(this.x==1){
                                    return "空置率："+(this.y / data.length * 100).toFixed(2) + "%,<br/>房间数：" + this.y + "间,<br/>总面积："+nArea+"平方米";
                                }else if(this.x==2){
                                    return "空置率："+(this.y / data.length * 100).toFixed(2) + "%,<br/>房间数：" + this.y + "间,<br/>总面积："+fullArea+"平方米";
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
                                            that.pieChartClick(e);
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
            error:function(e){
                console.log("接口出错，请联系相关人员");
            }
        });     
    },
    //饼状图点击事件
    pieChartClick:function(e){
        var that = this;
        var  statusHTML;
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
        that.getBuildingPercent(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName ,that.state,that.roomType);
        that.getRoomTable(that.buildingID, that.houseSubID, that.floor, that.divisionID, that.PName,"",that.state,that.roomType);
    },
    //办公楼人员职称分布情况(左下角柱状图)
    getBuildingPercent: function (buildingID,houseSubID,floor,divisionID,PName ,state,roomType) {
        var that = this;
        $.ajax({
            url: './Svr/HandlerOffice.ashx',
            data: { cmd: 'personSpread', buildingId: buildingID, houseSubID:houseSubID,floor:floor,divisionID:divisionID, state: state,PName:PName ,scale:scale,roomType:roomType },
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
                chart = Highcharts.chart('people_chart', {
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
                        allowDecimals:false
                    },
                    tooltip: {
                        pointFormat: ' <b>{point.y}</b> ' + "人",
                        shared: true
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                color:'#84d8e6'
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
                                    that.columnChartClick(e);
                            
                                }
                            }
                        }
                    }]
                });
            },
            error:function(e){
                console.log("接口出错，请联系相关开发人员");
            }
        })
    },
    //柱状图点击事件
    columnChartClick:function(e){
        var that = this;
        switch (e.point.category) {
            case "省级正职":
                that.getPieChart(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'1',that.roomType);
                that.getRoomTable(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'1',that.state,that.roomType);                
                break;
            case "省级副职":
                that.getPieChart(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'2',that.roomType);
                that.getRoomTable(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'2',that.state,that.roomType);
                                  
                break;
            case "正厅级":
                that.getPieChart(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'3',that.roomType);
                that.getRoomTable(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'3',that.state,that.roomType);
                                 
                break;
            case "副厅级":
                that.getPieChart(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'4',that.roomType);
                that.getRoomTable(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'4',that.state,that.roomType);
                                   
                break;
            case "正处级":
                that.getPieChart(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'5',that.roomType);
                that.getRoomTable(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'5',that.state,that.roomType);
                                  
                break;
            case "副处级":
                that.getPieChart(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'6',that.roomType);
                that.getRoomTable(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'6',that.state,that.roomType);
                                   
                break;
            case "处级以下":
                that.getPieChart(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'7',that.roomType);
                that.getRoomTable(that.buildingID,that.houseSubID,that.floor,that.divisionID,that.PName,'7',that.state,that.roomType); 
                break;
        }
    },
    //导出功能
    exportExcel: function (data) {
        var type = $("#myModal input[type='radio']:checked").val();
        var that = this;
        $.ajax({
            url: './Svr/HandlerOffice.ashx',
            data: {
                cmd: 'getExcelData',
                type: type,
                unitID: that.unitID
            },
            dataType: 'json',
            success: function (data) {
                if (data.length === 0) {
                    return;
                } else {
                    var htmlHead = "",
                        htmlTbody = "";
                    if (type === '0') {
                        htmlHead += "<tr><th>单位</th><th>大楼</th><th>处室</th><th>房间编号</th><th>面积</th><th>人员姓名</th><th>职称</th></tr>";
                        for (var i = 0; i < data.length; i++) {
                            htmlTbody += "<tr><td>" + data[i].UnitName + " </td><td>" + data[i].HouseName + data[i].HouseSUBName + " </td><td>" + data[i].DivisionName + " </td><td>" + data[i].RoomName + "</td><td>" + data[i].Area + "</td><td>" + data[i].PName + "</td><td>" + data[i].TitleName + "</td></tr>";
                        }
                    } else if (type === '1') {
                        htmlHead += "<tr><th>单位</th><th>大楼</th><th>办公室编号</th><th>面积</th><th>人员姓名</th><th>职称</th><th>处室</th></tr>";
                        for (var i = 0; i < data.length; i++) {
                            htmlTbody += "<tr><td>" + data[i].UnitName + " </td><td>" + data[i].HouseName + data[i].HouseSUBName + " </td><td>" + data[i].RoomName + " </td><td>" + data[i].Area + "</td><td>" + data[i].PName + "</td><td>" + data[i].DivisionName + "</td><td>" + data[i].TitleName + "</td></tr>";
                        }
                    }
                    $("#exportHeadData").html(htmlHead);
                    $("#exportTbodyData").html(htmlTbody);
                    var houseID = $(".button-group ul li ").find(".opacity1").attr("name")
                   , houseSubID = $("#housesubSearch").val()
                   , Floor = $("#floorSearch").val();
                    excel = new ExcelGen({
                        "src_id": "exportTableData",
                        "show_header": true
                    });
                    excel.generate(houseID, houseSubID, Floor);
                }
                $('#myModal').modal('hide')
            }
        })
    },
    //搜索内容(中上)
    searchContent: function (buildingId) {
        var that = this;
        //获取分区搜索内容
        $.ajax({
            url: './Svr/HandlerOffice.ashx',
            data: { cmd: 'searchContent', buildingId: buildingId },
            dataType: 'json',
            success: function (result) {
                //html,html1分别代表分区内容和楼层内容
                var html = "<option name=''>全部</option>",
                    html1 = "<option name=''>全部</option>",
                html2 = "<option name=''>全部</option>";
                for (var i = 0; i < result[0].HouseSUBName.length; i++) {
                    html += "<option name='" + result[0].HouseSUBName[i].ID + "'>" + result[0].HouseSUBName[i].HouseSUBName + "</option>";
                }
                for (var j = 0; j < result[0].floorName.length; j++) {
                    html1 += "<option name='" + result[0].floorName[j].FloorNo + "'>" + result[0].floorName[j].FloorNo + "</option>";
                }
                for (var k = 0; k < result[0].divisionName.length; k++) {
                    html2 += "<option name='" + result[0].divisionName[k].ID + "'>" + result[0].divisionName[k].DivisionName + "</option>";
                }
                $("#housesubSearch").html(html);
                $("#floorSearch").html(html1);
                $("#divisionSearch").html(html2);
            }
        })
        
    },
    //获取房间列表(中间)
    getRoomTable:function(buildingID,houseSubID,floor,divisionID,PName,titleID,state,roomType){
        var that = this;
        var getRoomDataPromise = new Promise((resolve,reject)=>{
            $.ajax({
                url:'./Svr/HandlerOffice.ashx',
                data:{
                    cmd:'getRoomData',
                    buildingID:buildingID,
                    houseSubID:houseSubID,
                    floor:floor,
                    divisionID:divisionID,
                    PName:PName,
                    titleID:titleID,
                    state:state,
                    scale:scale,
                    roomType:roomType
                },
                dataType:'json',
                success:function(data){
                    if(data.length==0){
                        $("#RoomImg").html("<div style='font-size:16px;line-height: 22.7vh;'>当前房间图片未保存</div>");
                        $("#officeMsg").html("");
                        $("#personData").html("");
                        
                       
                        totalPage = 0;
                        $(".paginationDiv").css('opacity', '0');
                        $("#buildingImgList").html("当前无相关图片信息");
                        return;
                    }else{
                        var arr = [];
                        copyArrObj(data,arr);
                        function copyArrObj(data,arr){
                            for (let i = 0; i < data.length; i++) {
                                data[i].PName="";
                                data[i].DivisionName="";
                                let Obj = shallowCopy(data[i]);
                                arr.push(Obj);
                            }
                            function shallowCopy(src) {
                                let dst = {};
                                for (let prop in src) {
                                    if (src.hasOwnProperty(prop)) {
                                        dst[prop] = src[prop];
                                    }
                                }
                                return dst;
                            }
                        }
                        var uniqueArr = common.unique(arr,'ID');
                        $("#center_title").html(uniqueArr[0].HouseName + "详细信息");
                        that.getTableHtml(uniqueArr);
                        //that.message(uniqueArr[0].RoomName,uniqueArr[0].ID);
                        //that.getRoomType(uniqueArr);
                        that.getImgList(uniqueArr); 
                        resolve(uniqueArr);
                    }
                },error:function(e){
                    console.log("房间数据接口错误，请联系相关开发人员");
                    reject(e);
                }
            })
        });
    },
    //获取人员列表
    getRoomPerson:function(roomID){
        $.ajax({
            url:'./Svr/HandlerOffice.ashx',
            data:{
                cmd:'getRoomPerson',
                roomID:roomID
            },
            dataType:'json',
            success:function(data){
                if(data.length>0){
                    var html = "";
                    if(!data[0].PName){
                        $("#person"+roomID).html(data[0].users);
                        $("#person"+roomID).attr("title",data[0].users);
                    }else{
                        for(var i =0;i<data.length;i++){
                        
                            html+= data[i].PName + " ";
                        }
                        $("#person"+roomID).html(html);
                        $("#person"+roomID).attr("title",html);
                    }
                    
                }
            },
            error:function(e){
                console.log("接口错误，请联系相关开发人员");
            }
        });
    },
    //获取房间处室
    getRoomDivision:function(roomID){
        $.ajax({
            url:'./Svr/HandlerOffice.ashx',
            data:{
                cmd:'getRoomDivision',
                roomID:roomID
            },
            dataType:'json',
            success:function(data){
                if(data.length>0){
                    var html = "";
                    for(var i = 0;i<data.length;i++){
                        html += data[i].DivisionName + " ";
                    }
                    $("#division"+roomID).html(html)
                    $("#division"+roomID).attr("title",html);
                }
            }
        });
    },
    //分页
    getTableHtml:function(data){
        if (data == "") {
            $("#RoomImg").html("<div style='font-size:16px;line-height: 17.7vh;'>当前房间图片未保存</div>");
            $("#officeMsg").html("");
            $("#personData").html("");
            $("#office_pieChart").html("<span class='red'>无相关数据</span>");
            
            totalPage = 0;
            $(".paginationDiv").css('opacity', '0');
            $("#buildingImgList").html("当前无相关图片信息");
        }else{
            var that = this;
            var currentPage=1;
            var totalPage = Math.ceil(data.length/8);
            $(".paginationDiv").css('opacity', '1');
            //分页
            $.jqPaginator('#pagination', {
                totalPages: totalPage,
                visiblePages: 3,
                currentPage: currentPage || 1,
                prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
                next: '<li class="next"><a href="javascript:;">下一页</a></li>',
                page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                onPageChange: function (num) {
                    that.message(data[8 * (parseInt(num) - 1)].RoomName, data[8 * (parseInt(num) - 1)].ID);
                    $('#officeMsg').html(that.pagination(data, num, totalPage));
                    $("#officeMsg tr:nth-child(" + 1 + ")").addClass('bg-lightblue');
                }
            });
            $(".totalNum").html(totalPage);

            //跳页功能
            $("#getIndexData").off('click');
            $("#getIndexData").on('click',function () {
                currentPage = parseInt($("#num").val());
                if (currentPage > totalPage) {
                    currentPage=totalPage;
                    $("#num").val(totalPage);
                }
               
                $.jqPaginator('#pagination', {
                    totalPages: totalPage,
                    visiblePages: 3,
                    currentPage: currentPage || 1,
                    prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
                    next: '<li class="next"><a href="javascript:;">下一页</a></li>',
                    page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                    onPageChange: function (num) {

                        that.message(data[8 * (parseInt(num) - 1)].RoomName, data[8 * (parseInt(num) - 1)].ID);
                        $('#officeMsg').html(that.pagination(data, num, totalPage));
                        $("#officeMsg tr:nth-child(" + 8 * num + 1 + ")").addClass('bg-lightblue');
                        
                    }
                });
            });
        }
    },
    //数据分页管理
    pagination: function (data, num, totalPage) {
        var that = this;
        var totalData = data.length;//数据总数       
        var currentPage = num;//当前页           
        //拼接字符串
        var html = "";
        //1.当数据总数小于8，总页数为1，在前台全部渲染出来；
        //2.当数据总数大于8，且当前页数不在总页数上(最后一页)，则渲染8条数据;
        //3.当数据总数大于8，且当前页数在最后一页，则渲染从倒数第二页的最后一个数据的下一条数据到数据总数;
        if (totalPage >= 2) {
            if (currentPage != totalPage) {
                for (var i = 8 * (currentPage - 1) ; i < 8 * (currentPage) ; i++) {
                    html += that.personDataHtml(data[i], i);
                }
            } else {
                for (var i = 8 * (currentPage - 1) ; i < totalData; i++) {
                    html += that.personDataHtml(data[i], i);
                }
            }
        } else {

            for (var i = 0; i < data.length; i++) {
                html += that.personDataHtml(data[i], i);
            }

        }
        return html;
    },
    //表格分页html
    personDataHtml: function (data, i) {
        var status,
            num = data.RoomName,
            id = data.ID,
            html1 = "",
            roomDivision = data.DivisionName,
            that = this;
        var message = "showRoom.message('" + num + "','" + id + "')";
        if (data.barea == "无" || data.barea == "") {
            status = "<span class='gray'>空置</span>";
            data.barea = "无";
        }
        else if (parseFloat(data.Area) <= scale * parseFloat(data.barea)) {
            status = "<span class='green'>达标</span>";

        } else {
            status = "<span class='red'>超标</span>";
        }

        html1 = "<tr name='" + id + "' onclick=" + message + ">" +
        "<td>" + (i + 1) + "</td>" +
        "<td>" + data.HouseSUBName + "-" + data.RoomName + "</td>" +
        "<td id='person" + id + "'></td>" +
        "<td id='division" + id + "'></td>" +
        "<td>" + data.Area + "</td>" +
        "<td>" + status + "</td>" +
    "</tr>";
        that.getRoomPerson(id);
        that.getRoomDivision(id);
        return html1;
    },
    //点击房间号获取房间详情
    message: function (roomName, id) {
        var that = this;
        //获取全景图片
        $.ajax({
            url: './Svr/HandlerOffice.ashx',
            data: {
                cmd: 'getPano',
                RoomID: id
            },
            dataType: 'json',
            success: function (data) {
                if (data.length == 0) {
                    $("#panorama").html("当前房间没有全景图片");
                } else {
                    $("#panorama").html("");
                    $("#panorama>canvas").remove();
                    panorama.init('panorama', data[0].ImgPath);
                    panorama.setAutorun(true);
                }

            }
           , error: function (e) {
               console.log("联系相关开发人员吧");
           }
        })
        $("#officeMsg tr").each(function () {
            if ($(this).hasClass('bg-lightblue')) {
                $(this).removeClass('bg-lightblue');
            }
        });
        $("#officeMsg").find("tr[name='" + id + "']").addClass('bg-lightblue');
        $("#officeID").html(roomName);
        $(".center-bottomTable").hide();
        $("#main_center .center-bottom").show();
        $(".Message").removeClass("onMessage");
        $(".office-center-L").addClass("onMessage");
        $.ajax({
            url: "./Svr/HandlerOffice.ashx",
            data: {
                cmd: "findRoomPerson",
                roomId: id
            },
            dataType: 'json',
            success: function (result) {
                var html = "";
                var job;
                if (result.length == 0) {
                    $(".center-bottom-R table").hide();
                    $(".center-bottom-R>div").show();
                    $(".center-bottom-R>div").html("无相关人员")
                } else {
                    $(".center-bottom-R table").show();
                    $(".center-bottom-R>div").hide();
                    for (var i = 0; i < result.length; i++) {
                        html += "<tr>" +
                                "<td>" + result[i].PName + "</td>" +
                                "<td>" + result[i].TitleName + "</td>" +
                                "<td>" + result[i].DivisionName + "</td>"
                        "</tr>";
                    }
                    $("#personData").html(html);
                }
            }
        })
        //介绍图片 轮播
        $.ajax({
            url: "./Svr/HandlerOffice.ashx",
            data: { cmd: 'getlunboImg', Type: "4", SID: id },
            dataType: 'json',
            success: function (result) {
                if (result.length != 0) {
                    var html = "<img style='width:100%;height:16vh;' src='" + result[0].ImgPath + "'/>";
                    //that.watchImg(html);
                    $("#RoomImg").html(html);
                } else {
                    $("#RoomImg").html("<div style='font-size:16px;line-height: 17.7vh;'>当前房间图片未保存</div>")
                }
            }
        })
        //返回按钮
        $(".return").click(function () {
            $(".center-bottomTable").show();
            $("#main_center .center-bottom").hide();
            //that.lunbo("#buildingInfo .slideShow",buildingId);
        });

    },
    //获取办公室图片列表
    getImgList: function (data) {
        var that = this;
        var buildingImgHTML = "", status = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].ImgPath == "") {
                data[i].ImgPath = './images/NoImg.jpg';
            }
            if (data[i].barea == "无" || data[i].barea == "") {
                status = "<p class='gray f-bold col-lg-5'>面积：" + data[i].Area + "</p>";
                data[i].barea = "无";
            }
            else if (parseFloat(data[i].Area) <= scale * parseFloat(data[i].barea)) {
                status = "<p class='green f-bold col-lg-5'>面积：" + data[i].Area + "</p>";

            } else {
                status = "<p class='red f-bold col-lg-5'>面积：" + data[i].Area + "</p>";
            }
            buildingImgHTML += "<div class='col-lg-6'>" +
                "<img src='" + data[i].ImgPath + "' class='col-lg-12' onclick='showRoom.watchImg(this)' style='width:100%;height:200px;'/>"
                    + "<div class='col-lg-12'>" 
                        + "<div class=''>"
                            +"<div class='row'  style='margin-top:20px;'>"
                                + "<p class='col-lg-7 f-bold bg-roomname'>编号：<span class='room-name' name='" + data[i].ID      + "' onclick='showRoom.watchPano(this)'>" + data[i].HouseSUBName + "-" + data                [i].RoomName + "</span></p>"
                                + status
                            + "</div>"
                        + "</div>"
                    + "<p class='f-bold'>姓名：<span id='"+ data[i].ID +"'></span></p>"
                + "</div>"
            + "</div>";
            that.getPNameDivision(data[i].ID);
        }
        $("#buildingImgList").html(buildingImgHTML);
    },
    //获取人员处室
    getPNameDivision:function(roomID){
        $.ajax({
            url:'./Svr/HandlerOffice.ashx',
            data:{
                cmd:'getPNameDivision',
                roomID:roomID
            },
            dataType:'json',
            success:function(data){
                var ret = "";
                for (var i = 0; i < data.length; i++) {
                    ret += data[i].PName + "(" + data[i].TitleName + ")";
                    ret += " ";
                }
                $('#' +  roomID).html(ret);
            },
            error:function(){
                console.log("接口错误，请联系相关开发人员");
            }
        })
    },
    //查看照片
    watchImg: function (e) {
        $("#originImgDiv").fadeIn();
        var html = "<img width='550' height='350' src=" + $(e).attr("src") + ">"
        $("#originalImg").html(html);
        $("img[src='images/close.png']").click(function () {
            $("#originImgDiv").fadeOut();
        })
    },
    //查看全景图片
    watchPano: function (e) {
        $.ajax({
            url: './Svr/HandlerOffice.ashx',
            data: {
                cmd: 'getPano',
                roomID: $(e).attr("name")
            },
            dataType: 'json',
            success: function (data) {
                $("#originalImg1").empty();
                if (data.length > 0) {
                    $("#originImgDiv1").fadeIn();
                    $("img[src='images/close.svg']").click(function () {
                        $("#originImgDiv1").fadeOut();
                    });
                    panorama.init('originalImg1', data[0].ImgPath);
                    panorama.setAutorun(true);
                } else {
                    alert("该房间无全景图片！");
                    
                }

            }, error: function (e) {
                console.log("接口出问题啦，联系相关人员吧");
            }
        })
       
    },
    //获取房间类型(只有办公室，服务用房，设备用房，附属用房四种）
    getRoomType:function(buildingID,houseSubID,floor,divisionID,PName,titleID,state,roomType){
        var that = this;
        $.ajax({
            url:'Svr/HandlerOffice.ashx',
            data:{
                cmd:'getRoomNum',
                buildingID:buildingID,
                houseSubID:houseSubID,
                floor:floor,
                divisionID:divisionID,
                PName:PName,
                titleID:titleID,
                state:state,
                scale:scale
            },
            dataType:'json',
            success:function(data){
                $.ajax({
                    url:'Svr/HandlerOffice.ashx',
                    data:{
                        cmd:'getRoomType',
                        houseType:1
                    },
                    dataType:'json',
                    success:function(result){
                        if(result.length>0){
                            var html = "";
                            $("#roomTypeNum").html("");
                            for(var i=0;i<result.length;i++){
                                var filterData;
                                filterData = data.filter(getTheTypeData)||0;
                                getUseNum(filterData, result[i].Type,result[i].ID);
                                function getTheTypeData(data) {
                                    return data.Type == result[i].Type;
                                }
                            }                          
                            //获取已用房间数量
                            function getUseNum(data, type, roomType) {
                                var useRoomNum = 0;
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].barea == "无" || data[i].barea == "") {

                                    } else {
                                        useRoomNum++;
                                    }
                                }
            
                                //var getRTypeData = "showRoom.getRTypeData('"+ roomType +"')";
                                $("#roomTypeNum").append("<tr name='"+ roomType +"' ><td>" + type + "</td><td>" + data.length + "</td><td>"+ useRoomNum +"</td></tr>");
                            }
                            $("#roomTypeNum tr").each(function () {
                                if ($(this).hasClass('bg-lightblue')) {
                                    $(this).removeClass('bg-lightblue');
                                }
                            });
                            $("#roomTypeNum").find("tr").on('click',function(){
                                that.roomType = $(this).attr("name");
                                $("#housesubSearch").val("全部");
                                $("#floorSearch").val("全部");
                                $("#divisionSearch").val("全部");
                                $("#searchGroup>input").val("");
                                that.titleID = "";
                                that.state = "";
                                that.getData(0);
                                $("#roomTypeNum tr").each(function () {
                                    if ($(this).hasClass('bg-lightblue')) {
                                        $(this).removeClass('bg-lightblue');
                                    }
                                });
                                $("#roomTypeNum").find("tr[name='" + that.roomType + "']").addClass('bg-lightblue');
                            });
                            $("#roomTypeNum").find("tr[name='" + that.roomType + "']").addClass('bg-lightblue');
                        }
                    },error:function(e){
                        console.log("接口出错，请联系相关开发人员");
                    }
                })
                
                
             
                
            },error:function(){
                console.log("接口错误，请联系相关开发人员");
            }
        });
    },

    //获取房间类型(只有门面，公有住房两种）
    getOtherRoomType:function(buildingID,houseSubID,floor,divisionID,PName,titleID,state,roomType){
        var that = this;
        $.ajax({
            url:'Svr/HandlerOffice.ashx',
            data:{
                cmd:'getRoomNum',
                buildingID:buildingID,
                houseSubID:houseSubID,
                floor:floor,
                divisionID:divisionID,
                PName:PName,
                titleID:titleID,
                state:state,
                scale:scale
            },
            dataType:'json',
            success:function(data){
                $.ajax({
                    url:'Svr/HandlerOffice.ashx',
                    data:{
                        cmd:'getRoomType',
                        houseType:0
                    },
                    dataType:'json',
                    success:function(result){
                        if(result.length>0){
                            var html = "";
                            $("#otherRoomTypeNum").html("");
                            for(var i=0;i<result.length;i++){
                                var filterData;
                                filterData = data.filter(getOtherTypeData)||0;
                                getOtherUseNum(filterData, result[i].Type,result[i].ID);
                                function getOtherTypeData(data) {
                                    return data.Type == result[i].Type;
                                }
                            }                          
                            //获取已用房间数量
                            function getOtherUseNum(data, type, roomType) {
                                var useRoomNum = 0;
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].barea == "无" || data[i].barea == "") {

                                    } else {
                                        useRoomNum++;
                                    }
                                }
            
                                //var getRTypeData = "showRoom.getRTypeData('"+ roomType +"')";
                                $("#otherRoomTypeNum").append("<tr name='"+ roomType +"' ><td>" + type + "</td><td>" + data.length + "</td><td>"+ useRoomNum +"</td></tr>");
                            }
                            $("#otherRoomTypeNum tr").each(function () {
                                if ($(this).hasClass('bg-lightblue')) {
                                    $(this).removeClass('bg-lightblue');
                                }
                            });
                            $("#otherRoomTypeNum").find("tr").on('click',function(){
                                that.roomType = $(this).attr("name");
                                $("#housesubSearch").val("全部");
                                $("#floorSearch").val("全部");
                                $("#divisionSearch").val("全部");
                                $("#searchGroup>input").val("");
                                that.titleID = "";
                                that.state = "";
                                that.getData(0);
                                $("#otherRoomTypeNum tr").each(function () {
                                    if ($(this).hasClass('bg-lightblue')) {
                                        $(this).removeClass('bg-lightblue');
                                    }
                                });
                                $("#otherRoomTypeNum").find("tr[name='" + that.roomType + "']").addClass('bg-lightblue');
                            });
                            $("#otherRoomTypeNum").find("tr[name='" + that.roomType + "']").addClass('bg-lightblue');
                        }
                    },error:function(e){
                        console.log("接口出错，请联系相关开发人员");
                    }
                })
                
                
             
                
            },error:function(){
                console.log("接口错误，请联系相关开发人员");
            }
        });
    },
    //房间类型点击事件
    //getRTypeData:function(roomType){
    //    var that = this;
    //    that.roomType = roomType;
        
    //},
    //按房间状态，职称搜索
    changeSearchGroup: function () {
        var that = this;
        $("#search").off("click");
        //搜索点击功能
        $("#search").on('click', function () {
            that.getData(1);
        });
    },
    
    //不同职称所分配的办公室面积不同(右下角)
    getJobArea: function () {
        $.ajax({
            url: "./Svr/HandlerOffice.ashx",
            data: { cmd: "OfficeUsing" },
            dataType: 'json',
            success: function (data) {
                //定义级别，面积数组
                var rank = [],
                    area = [];
                for (var i = 0; i < data.length; i++) {
                    rank.push(data[i].TitleName);
                    area.push(parseInt(data[i].Area));
                }
                console.log(area);
                $('#area_container').highcharts({
                    chart: {
                        type: 'bar',
                        backgroundColor: 'rgba(4,27,83,0)',
                        borderRadius: 10
                    },
                    title: {
                        text: '',
                        style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                    },
                    xAxis: {
                        categories: rank,
                        title: {
                            text: null
                        },
                        labels: {
                            style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '面积 (平方米)',
                            align: 'high',
                            style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                        },
                        labels: {
                            overflow: 'justify',
                            style: { color: '#84d8e6', fontFamily: 'Microsoft YaHei' }
                        }
                    },
                    tooltip: {
                        valueSuffix: ' 平方米',
                        pointFormat: ' <b>{point.y}</b> ',
                    },
                    //图例
                    legend: {
                        itemStyle: {
                            color: '#84d8e6'
                        }
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true,
                                color:'#84d8e6',
                                allowOverlap: true
                            }
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [
                        {
                            data: area,
                            colorByPoint: true,
                            //color: "#55BEC2",
                            showInLegend: false
                        }
                    ]
                });
            }
        });
    }
    
};