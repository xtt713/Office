function _showUnit() {
    //默认单位
    this.focusUnit = "省政府机关院";
    this.unitID = '1',
    //默认楼房
    this.focusBuilding = "1";
    this.unitDataArr = "";
    this.drilldownSeries = [];
    //左侧内容根据不同屏幕宽度进行自动调节
    this.imgWidth = 0;
    this.imgHeight = 0;
    var width = window.innerWidth;
    if(width>1200 && width<1420){
        this.left = "33%";
    }else if(width>=1420 && width<1800){
        this.left = "30%";
    }else if(width>=1800){
        this.left = "25%";
    }
}
_showUnit.prototype = {
    init: function (unitID) {
        var that = this;
        if (arguments[0]) {
            that.unitID = unitID;
        }
        that.getGovData();
        //返回上级点击事件
        $("#goBack").on('click', function (e) {
            $("#divround").stop(true, true).animate({ "top": "100vh" });
            $(".charts").stop(true, true).slideUp();
            $("#buildData").stop(true, true).slideUp();
            $("#content").stop(true, true).slideUp();
            $("#govBtn").stop(true, true).animate({ 'top': '50%' });
            //$("header .btn").hide();
            window.location.href = "Default.aspx";
            e.preventDefault();
        });
        $("#toggle_button").on('click', function () {
            if ($(this).hasClass('toggle')) {
                $(this).attr("title", "收起侧边面板");
                $(this).removeClass('toggle');
                $("#main_left").animate({ left: '0' });
                $("#toggleBox").animate({ left: that.left });
            } else {
                $(this).attr("title", "展开侧边面板");
                $(this).addClass('toggle');
                $("#main_left").animate({ left: "-"+that.left });
                $("#toggleBox").animate({ left: '0' });
            }

        });
        $("#imgLunbo>.button").on('click', function () {
            $("#imgLunbo").removeClass("active");
        });
        $("#originImgDiv .return").on('click',function(){
            $("#originImgDiv").hide();
        });
        $("#searchUnit").off('click');
        $("#searchUnit").on('click',function(e){
            that.getGovData();
        });
        $("#clearSearch").on('click',function(){
            $("#searchContent").val(null);
        });
        //$("#UnitInfoUL li").off("click");
        $(".nav-pillsUnit").find("li").on('click', function (e) {
       
            $(".nav-pillsUnit li").removeClass("active");
            $(e.target).parent().addClass("active");
            switch($(e.target).attr("name")){
                case "unitDetailInfo":
                    $("#unitDetailInfo").show();
                    $("#houseInfo").hide();
                    $("#otherHouseInfo").hide();
                    break;
                case "houseInfo":
                    $("#houseInfo").show();
                    $("#unitDetailInfo").hide();
                    $("#otherHouseInfo").hide();
                    break;
                case "otherHouseInfo":
                    $("#otherHouseInfo").show();
                    $("#unitDetailInfo").hide();
                    $("#houseInfo").hide();
                    break;
            }
            $("#" + $(e.target).attr("name")).show();
        });
        $("#searchContent").off('keyup')
        $("#searchContent").on('blur',function(e){
            $.ajax({
                url:'./Svr/HandlerOffice.ashx',
                data:{
                    cmd:'searchName',
                    txt:$(e.target).val()
                },
                dataType:'json',
                success:function(result){
                    console.log(result);
                },
                error:function(e){
                    console.log(123);
                }
            })
        });

    },
    getGovData: function () {
        var that = this;
        $(".govTxt").stop().slideDown();
        $("#govBtn li:first-child").addClass("bg-gradient");
        var txtSearch = $("#searchContent").val();
        $.ajax({
            url: './Svr/HandlerOffice.ashx',
            data: {
                cmd: 'getUnitName',
                txtSearch: txtSearch
            },
            dataType: 'json',
            success: function (data) {
                that.unitDataArr = data;
                if (data.length > 0) {
                    var unitArr = [];
                    unitArr.push(data[0]);
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < unitArr.length; j++) {
                            if (data[i].ID == unitArr[j].ID) {
                                break;
                            }
                            if (j == unitArr.length - 1) {
                                unitArr.push(data[i]);
                            }
                        }
                    }
                    that.getTableHtml(unitArr);
                    //$("a[int='ck']").on('click', function () {
                    //    cxymap.setPosition($(this).attr("lgtd"), $(this).attr("lttd"));
                    //});
                }
            },
            error: function (e) {
                console.log("接口错误，请联系相关开发人员");
            }
        });

        getImg(that.unitID);
        //单位图片获取
        function getImg(a) {
            $.ajax({
                url: './Svr/HandlerOffice.ashx',
                data: { cmd: 'getGovData', UnitID: a },
                dataType: 'json',
                success: function (data) {
                    $("#Get_img").stop(true, true).animate({ 'margin-top': '15vh' });
                    var Rhtml = "";
                    $("#govInfo").html(data[0].unitName[0].Info);
                }
            });
        }
    },
    showUnitDetail:function(e){
        var that = this;
        $("#unitDetail").show();
        $("#unitBox").hide();
        //$("#divRight").addClass("active");
        var thatEvent = e;
        var theUnitData = that.unitDataArr.filter(
            function (item) {
                return item.ID == $(thatEvent).attr("name");
            }
        );
        var unitID = $(thatEvent).attr("name");
        that.getHouse(unitID);
        that.getOtherHouse(unitID);
        that.unitID = unitID;
        that.focusUnit = theUnitData[0].UnitName;
        var ulhtml = "";
        $(".unitNameDiv").html(theUnitData[0].UnitName+"介绍");
        $(".unit-info").html(theUnitData[0].info);
        //$("#unitDetail").html(html);
        for (var i = 0; i < theUnitData.length; i++) {
            ulhtml += "<li index='"+ i +"'>"
                    + "<img src='" + theUnitData[i].ImgPath + "' style='width:100%;height: 20vh' >"
                + "</li>";
        }
        $("#unitImgList").html(ulhtml);
        var lgtd = $(e).attr("LGTD");
        var lttd = $(e).attr("LTTD");
        var unitName = $(e).attr("ck");
        var latLng = new google.maps.LatLng(lttd, lgtd);
        cxymap.SetPersonPosition(latLng,unitName);

        $("#unitImgList li:first-child").addClass("active");
        //将该单位下的所有办公楼全部显示出来
        $("#getBack").on('click', function () {
            $("#unitDetail").hide();
            $("#unitBox").show();
            //$("#divRight").removeClass("active");
        });
        $("#watchChart").on('click', function (e) {
            $("#originImgDiv").show();
            $("#originImgDiv h4").html(that.focusUnit);
            that.getRoomTypeArea(that.unitID);
        });
        $("#unitImgList").find("li").on('click', function (e) {
            var thatImg = this;
            $("#unitImgList").find(".active").removeClass("active");
            that.lunbo(theUnitData,Number($(thatImg).attr("index")));
            $("#imgLunbo").addClass('active');
            $("#unitImgSrc").attr("src", $(thatImg).find("img").attr("src"));
            $(thatImg).addClass("active");
        });
    },
    //分页
    getTableHtml:function(data){
        if (data == "") {
            $("#RoomImg").html("<div style='font-size:16px;line-height: 17.7vh;'>当前房间图片未保存</div>");
            $("#officeMsg").html("");
            $("#personData").html("");
            $("#office_pieChart").html("<span class='red'>无相关数据</span>");
            //$("#roomTypeNum").html("");
            totalPage = 0;
            $(".paginationDiv").css('opacity', '0');
            $("#buildingImgList").html("当前无相关图片信息");
        }else{
            var that = this;
            var currentPage=1;
            var totalPage = Math.ceil(data.length/10);
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
                    $('#unitList').html(that.pagination(data, num, totalPage));
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
                        $('#unitList').html(that.pagination(data, num, totalPage));
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
        //1.当数据总数小于10，总页数为1，在前台全部渲染出来；
        //2.当数据总数大于10，且当前页数不在总页数上(最后一页)，则渲染8条数据;
        //3.当数据总数大于10，且当前页数在最后一页，则渲染从倒数第二页的最后一个数据的下一条数据到数据总数;
        if (totalPage >= 2) {
            if (currentPage != totalPage) {
                for (var i = 10 * (currentPage - 1) ; i < 10 * (currentPage) ; i++) {
                    html += that.personDataHtml(data[i], i);
                }
            } else {
                for (var i = 10 * (currentPage - 1) ; i < totalData; i++) {
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
        html1 += "<li name='" + data.ID + "' ck='"+ data.UnitName +"' lgtd= '" + data.LGTD +"' lttd='" + data.LTTD + "' onclick='showUnit.showUnitDetail(this)'>"
                        + "<div class='cf'>"
                            + "<div class='col-1'>"
                                + "<a href='javascript:void(0)' class='no" + (i%10 + 1) + "'></a>"
                            + "</div>"
                            + "<div class='col-r'>"
                                + "<div class='img-wrap'>"
                                    + "<img src='" + data.ImgPath + "' style='width:71px;height:58px;' />"
                                + "</div>"

                            + "</div>"
                            + "<div class='ml_30 mr_90'>"
                                + "<div class='f-blue'>"
                                + data.UnitName
                                + "</div>"
                                + "<div>"
                                    + data.address
                                + "</div>"
                                +"<div>"
                                    +"<p title=\"定位\" class=\"blue\" int='ck' type='op'   name='"+ data.UnitName +"' ><i class=\"icon-globe blue bigger-130\"></i>"
                                    +"</p>"
                                +"</div>"
                            + "</div>"
                        + "</div>"
                    + "</li>";

        return html1;
    },
    //弹出框
    popupBox:function(result){
        var that = this;
        if(!result){
            return;
        }
        that.imgWidth = result[0].ImgWidth;
        that.imgHeight = result[0].ImgHeight;
        $("#popBox").show();
        var clientWidth = window.innerWidth;
        var clientHeight = window.innerHeight;
        var left = (clientWidth - Number(result[0].ImgWidth))/2;
        var top = (clientHeight - Number(result[0].ImgHeight))/2;
        var imgLeft = (clientWidth + Number(result[0].ImgWidth))/2 - 40;
        var imgTop = (clientHeight - Number(result[0].ImgHeight))/2 - 40;
        $("#popBox>div>#svgImg").css({"width":Number(result[0].ImgWidth)+4,"height":Number(result[0].ImgHeight)+4,"position":"absolute","top":top,"left":left,"background-color":"#fff","padding":"2px"});
        $("#houseRBox>h3").css({"width":Number(result[0].ImgWidth)+4,"height":"50px","position":"absolute","top":top-50,"left":left,"background-color":"#f5f5f5","padding":"2px","line-height":"50px","padding-left":"20px","font-weight":"bold"});
        $("#houseRBox>h3").html(result[0].UnitName+"平面展示图");
        $("#closePopBox").css({"left":imgLeft,"top":imgTop,"z-index":2});
        drawEdit.init('svgImg', result[0].UnitImgName, result[0].ImgWidth, result[0].ImgHeight,result[0].UnitID);
        $("#closePopBox").off('click');
        $("#closePopBox").on('click',function(e){
            $("#popBox").hide();
        });
        $("#houseRBox").show();
        $("#floorRBox").hide();
        $("#roomRBox").hide();
        //$("#closePopBox").on('click',function(e){
        //    $("#popBox").hide();
        //});
        //$("#closePopBox").on('click',function(e){
        //    $("#popBox").hide();
        //});
    },
    //点击Raphael大楼图，显示楼层信息;
    getFloorRObj:function(houseId){
        var that = this;
        $.ajax({
            url:'./Svr/HandlerOffice.ashx',
            data:{
                cmd:'getFloorData',
                houseId:houseId
            },
            dataType:'json',
            success:function(result){
                $("#floorRBox").show();
                $("#houseRBox").hide();
                $("#roomRBox").hide();
                $("#closeHouseRBox").on('click',function(){
                    $("#floorRBox").hide();
                    $("#houseRBox").show();
                });
                var maxFloor = result[0].Floor;
                if(result.length>1){
                    for(var i = 0;i<result.length;i++){
                        if(maxFloor<result[i].Floor){
                            maxFloor = result[i].Floor;
                        }
                    }
                }else{
                    maxFloor = result[0].Floor;
                }
                var left = (window.innerWidth-that.imgWidth)/2;
                var top = (window.innerHeight-that.imgHeight)/2;
                var imgLeft = (window.innerWidth + Number(that.imgWidth))/2 - 40;
                var imgTop = (window.innerHeight - Number(that.imgHeight))/2 - 40;
                $("#closeHouseRBox").css({"left":imgLeft,"top":imgTop,"z-index":2});
                drawFloor.init(document.getElementById("floorRaphael"),top,left,maxFloor,that.imgWidth,that.imgHeight,houseId);
                $("#floorRBox>h4").css({"width":Number(that.imgWidth),"height":"50px","position":"absolute","top":top-50,"left":left,"background-color":"#f5f5f5","padding":"2px","line-height":"50px","padding-left":"20px","font-weight":"bold","-moz-box-shadow": "0 0 5px #000","-webkit-box-shadow": "0 0 5px #000","box-shadow": "0 0 10px #000"});
                $("#floorRBox>h4").html(result[0].HouseName+"平面展示图");
            },error:function(e){
                console.log("123");
            }
        })
    },
    showRRoomData:function(roomID){
        $.ajax({
            url:'./Svr/HandlerOffice.ashx',
            data:{
                cmd:'getRRoomData',
                roomID:roomID
            },
            dataType:'json',
            success:function(result){
                //$("#floorRBox").hide();
                //$("#houseRBox").hide();
                //$("#roomRBox").hide();
                //$("#roomInfoBox").show();
                $(".roomCode").html(result[0].RoomName);
                $(".roomSize").html(result[0].Area);
                //$(".roomName").html(result[0].DivisionName);
                $(".roomUser").html(result[0].Users);

                //var imgLeft = window.innerWidth + Number(document.getElementById("roomInfoBox").style.width+ parseInt(400));
                //var imgTop = (window.innerHeight - Number(document.getElementById("roomInfoBox").style.height));

                //$("#closeRoomRBox").css({"left":imgLeft,"top":imgTop,"z-index":2});
                //$("#closeRoomRBox").off('click');
                //$("#closeRoomRBox").on('click',function(e){
                //    $("#roomInfoBox").hide();
                //    $("#roomRBox").show();
                //});
                console.log(result);
            },
            error:function(e){
                console.log("接口错误，请联系相关开发人员");
            }
        })
    },
    getHouse: function (unitID) {
        var that = this;
        $.ajax({
            url: './Svr/HandlerOffice.ashx',
            data: {
                cmd: 'getHouseName',
                unitID: unitID,
                type: 0
            },
            dataType: 'json',
            success: function (data) {
                $.ajax({
                    url: './Svr/HandlerOffice.ashx',
                    data: {
                        cmd: 'getBuildColor',
                        top: data.length
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.length == 0) {
                            //console.log("result的值为：" + result.length);
                            $("#houseInfo").html("当前单位没有大楼");
                      
                            return;
                        }
                        var html = "";
                        if (data.length <= 5) {
                            $("#houseInfo").css("padding-top", "2vh");
                            //$("#houseInfo").css("text-align", "center");
                            for (var i = 0; i < data.length; i++) {
                                html += "<li name='" + data[i].ID + "' class='" + result[i].class + "' style='line-height:7vh;height:7vh;width:32%;display:inline-block;text-align:center;border-radius: 20px;background-color:white;margin-left:1%;margin-top:2vh;font-size:15px;font-weight:bold;color:" + result[i].Color + "'>" + data[i].HouseName + "</li>";
                            }
                        } else {
                            $("#houseInfo").css("padding-top", "2vh");
                            $("#houseInfo").css("text-align", "left");
                            for (var i = 0; i < data.length; i++) {
                                html += "<li name='" + data[i].ID + "' class='" + result[i].class + "' style='text-align:center;line-height:7vh;height:7vh;width:32%;display:inline-block;text-align:center;border-radius: 20px;background-color:white;margin-left:1%;margin-top:2vh;font-size:15px;font-weight:bold;color:" + result[i].Color + "'>" + data[i].HouseName + "</li>";
                            }
                        }

                        $("#houseInfo").html(html);

                        $("#houseInfo").find("li[name='" + data[0].ID + "']").addClass("active");
                        that.buildingID = data[0].ID;


                        //点击（一办公楼、二办公楼等）事件
                        $("#houseInfo").find("li").off('click');
                        $("#houseInfo").find("li").on("click", function (e) {
                            //highcharts的div只有先显示后移动，这样获取svg图片的高度和设置高度相同
                            //$("#content").stop(true, true).slideUp();
                            //$("#buildData").stop(true, true).slideUp();
                            //$("#building_area_column").stop(true, true).slideUp();
                            //$("#other_area_column").stop(true, true).slideUp();
                            //$("header .btn").hide();
                            that.buildingID = $(e.target).attr("name");
                            //common.initHtml("html/showRoom.html", $("body"), function () {
                            $("#room-detail-show").show();
                            $("#main_left").hide();
                            $("#divCenter").hide();
                            var showRoom = new _showRoom();
                            showRoom.init(that.unitID, that.buildingID,0);
                            //});
                        });


                        $("#houseInfo").find("li").off("mouseenter");
                        $("#houseInfo").find("li").on("mouseenter", function (e) {
                            if (that.focusBuilding == $(e.target).attr('name')) { return }
                            else {
                                $("#buildInfo1 h3").html($("#buildInfo h3").html());
                                $("#buildInfo1 p").html($("#buildInfo p").html());
                                $("#buildImg1").html($("#buildImg").html());
                                $("#buildInfo").stop(true, true).slideUp();
                                $("#buildImg").stop(true, true).slideUp();

                                $("#otherHouseInfo li").removeClass("active");
                                $(e.target).addClass("active").siblings().removeClass("active");

                                that.focusBuilding = $(e.target).attr('name');
                            }
                        });
                    }, error: function () {
                        console.log("接口错误,请联系相关开发人员");
                    }
                });

            }, error: function (e) {
                console.log("接口错误，请联系相关开发人员");
            }
        });
    },
    getOtherHouse: function (unitID) {
        var that = this;
        $.ajax({
            url: './Svr/HandlerOffice.ashx',
            data: {
                cmd: 'getHouseName',
                unitID: unitID,
                type: 1
            },
            dataType: 'json',
            success: function (data) {
                $.ajax({
                    url: './Svr/HandlerOffice.ashx',
                    data: {
                        cmd: 'getBuildColor',
                        top: data.length
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.length == 0) {
                            $("#otherHouseInfo").html("当前单位没有附属大楼。");
                            return;
                        }
                        var html = "";
                        if (data.length <= 5) {
                            $("#otherHouseInfo").css("padding-top", "2vh");
                            $("#otherHouseInfo").css("text-align", "left");
                            for (var i = 0; i < data.length; i++) {
                              
                                html += "<li name='" + data[i].ID + "' class='" + result[i].class + "' style='text-align:center;line-height:7vh;height:7vh;width:32%;display:inline-block;border-radius: 20px;color:#FFFFFF;margin-left:1%;margin-top:1vh;font-size:15px;font-weight:bold;background-color:" + result[i].Color + "'>" + data[i].HouseName + "</li>";
                            }
                        } else {
                            $("#otherHouseInfo").css("padding-top", "2vh");
                            $("#otherHouseInfo").css("text-align", "left");
                            for (var i = 0; i < data.length; i++) {
                   
                                html += "<li name='" + data[i].ID + "' class='" + result[i].class + "' style='text-align:center;line-height:7vh;height:7vh;width:" + that.left +";display:inline-block;text-align:center;border-radius: 20px;margin-left:1%;margin-top:1vh;color:#FFFFFF;margin:2px;font-size:15px;font-weight:bold;background-color:" + result[i].Color + "'>" + data[i].HouseName + "</li>";
                            }
                        }
                        $("#otherHouseInfo").html(html);
                        that.buildingID = data[0].ID;
                        $("#otherHouseInfo").find("li").off("mouseenter");
                        $("#otherHouseInfo").find("li").on("mouseenter", function (e) {
                            if (that.focusBuilding == $(e.target).attr('name')) { return }
                            else {
                                $("#buildInfo1 h3").html($("#buildInfo h3").html());
                                $("#buildInfo1 p").html($("#buildInfo p").html());
                                $("#buildImg1").html($("#buildImg").html());
                                $("#buildInfo").stop(true, true).slideUp();
                                $("#buildImg").stop(true, true).slideUp();

                                $(e.target).addClass("active").siblings().removeClass("active");
                                $("#houseInfo li").removeClass("active");
                               
                                that.focusBuilding = $(e.target).attr('name');
                            }
                        });

                    }
                })

            }, error: function () {
                console.log("接口错误，请联系相关开发人员");
            }

        });
    },
    //轮播图
    lunbo: function (data,index) {
        $("#swiper_wrapper").html("<img src='" + data[index].ImgPath + "' />");
        
        $(".swiper-button-prev").on('click', function () {
            if (index == 0) {
                return;
            } else {
                index--;
                $("#swiper_wrapper").html("<img src='" + data[index].ImgPath + "' />");
            }
        });
      
        $(".swiper-button-next").on('click', function () {
            if (index == data.length-1) {
                return;
            } else {
                index++
                $("#swiper_wrapper").html("<img src='" + data[index].ImgPath + "' />");
            }
        });
        
    },
    getRoomTypeArea: function (unitID) {
        var that = this;
        
        //seriesArr: 1.获取不同类型中已用房间面积
        var unitUseArea = new Promise((resolve,reject)=>{
            $.ajax({
                url:'./Svr/HandlerOffice.ashx',
                data:{cmd:'getRTypeArea',unitID:that.unitID,areaType: 1},
                dataType:'json',
                success:function(result){
                    var seriesArr = [];
                    var seriesObj = {};
                    seriesObj.name="已用面积";
                    seriesObj.data = result;
                    seriesArr.push(seriesObj);
                    resolve(seriesArr);
                },
                error:function(){
                    console.log("接口出错,请联系相关开发人员");
                }
            })
        });
        //2.获取未用房间面积
        var unitFullArea = function(seriesArr){
            return new Promise((resolve,reject)=>{
                $.ajax({
                    url:'./Svr/HandlerOffice.ashx',
                    data:{cmd:'getRTypeArea',unitID:that.unitID,areaType: 0},
                    dataType:'json',
                    success:function(data){
                        var seriesObj1 = {};
                        seriesObj1.name = "空置面积";
                        seriesObj1.data = data;
                        seriesArr.push(seriesObj1);
                        resolve(seriesArr);
                    },error:function(){
                        console.log("接口出错，请联系相关开发人员");
                    }
                })
            });
        };
        
        //3.获取附属用房面积
        var dependentsArea = function(seriesArr){
            return new Promise((resolve,reject)=>{
                $.ajax({
                    url:'./Svr/HandlerOffice.ashx',
                    data:{cmd:'getDependentsArea',unitID:that.unitID,type:1},
                    dataType:'json',
                    success:function(data){
                        if(that.unitID==1){
                            var totalArea=0;
                            for(let i =0;i<data.length;i++){
                                totalArea+=parseInt(parseFloat(data[i].y)*100)/100;
                            }
                        
                            seriesArr[1].data.push({RoomType:'4',name:'附属用房',y:totalArea});
                            
                        }
                        for(let i=0;i<seriesArr[0].data.length;i++){
                            seriesArr[0].data[i].y=parseInt(parseFloat(seriesArr[0].data[i].y)*100)/100;
                            seriesArr[0].data[i].drilldown="drilldown"+seriesArr[0].data[i].RoomType;
                            
                        }
                        for(let i=0;i<seriesArr[1].data.length;i++){
                            seriesArr[1].data[i].y=parseInt(parseFloat(seriesArr[1].data[i].y)*100)/100;
                            seriesArr[1].data[i].drilldown = "drilldown1"+seriesArr[1].data[i].RoomType;
                            seriesArr[1].data[i].color='#5182E4';
                        }
                        resolve(seriesArr);
                    },
                    error:function(){
                        reject("dependentsArea错误，请联系相关开发人员");
                    }
                })
            });
        };

        //drilldownSeriesArr:1.遍历房间类型(附属用房除外)，获取1,2,3办公楼已用面积
        var getTheRTypeUseArea = function(seriesArr){
            return new Promise(function(resolve,reject){
                for(let i=0;i<seriesArr.length;i++){
                    $.ajax({
                        url:'./Svr/HandlerOffice.ashx',
                        data:{cmd: 'getTheRTypeArea', unitID: that.unitID, RoomType: seriesArr[1].data[i].RoomType,areaType:1},
                        dataType:'json',
                        success:function(result){
                            if(result.length>0){
                                for(var j=0;j<result.length;j++){
                                    result[j].y = parseInt(parseFloat(result[j].y)*100)/100;
                                }
                                var drilldownSeriesObj = {};
                                drilldownSeriesObj.id = "drilldown"+result[0].RoomType;
                                drilldownSeriesObj.name = "已用面积";
                                drilldownSeriesObj.data = result;
                                that.drilldownSeries.push(drilldownSeriesObj);

                            }
                            if(i==seriesArr.length-1){
                                resolve(seriesArr);
                            }
                        },
                        error:function(){
                            reject("getTheRTypeUseArea错误，请联系相关开发人员");
                        }
                    })
                }
            });
        }
        //2.遍历房间类型，获取1,2,3办公楼空置面积
        var getTheRTypeFullArea = function(seriesArr){
            return new Promise(function(resolve,reject){
                for(let i=0;i<seriesArr[1].data.length;i++){   
                    if (i == seriesArr[1].data.length-1) {
                        $.ajax({
                            url:'./Svr/HandlerOffice.ashx',
                            data:{cmd:'getDependentsArea',unitID:that.unitID,type:1},
                            dataType:'json',
                            success:function(data){
                                if(data.length>0){
                                    var drilldownSeriesObj={};
                                    drilldownSeriesObj.id = "drilldown1"+seriesArr[1].data[i].RoomType;
                                    drilldownSeriesObj.name = "空置面积";
                                    drilldownSeriesObj.data = data;
                                    that.drilldownSeries.push(drilldownSeriesObj);
                                    for(let i=0;i<that.drilldownSeries.length;i++){
                                        for(let j=0;j<that.drilldownSeries[i].data.length;j++){
                                            that.drilldownSeries[i].data[j].y=parseInt(parseFloat(that.drilldownSeries[i].data[j].y)*100)/100;
                                        }
                                    }
                                }
                                Highcharts.setOptions({
                                    lang: {
                                        drillUpText: '返回'
                                    }
                                });
                                $("#other_area_column").highcharts({
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
                                        style: { color: '#000000', fontFamily: 'Microsoft YaHei' }
                                    },
                                    xAxis: {
                                        labels: {
                                            style: { fontSize: '13px', color: '#000000', fontFamily: 'Microsoft YaHei' }
                                        },
                                        type: 'category'
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: '面积(m<sup>2</sup>)',
                                            style: { color: '#000000', fontFamily: 'Microsoft YaHei' }
                                        },
                                        stackLabels: {  // 堆叠数据标签
                                            enabled: false,
                                            style: {
                                                fontWeight: 'bold',
                                                color: '#000000'
                                            }
                                        },
                                        labels:{
                                            style:{
                                                color:'#000000'
                                            }
                                        }
                                    },
                                    tooltip: {
                                        formatter: function () {
                                            return this.series.name + ': ' + this.y + '<br/>' +
                                                    '总量: ' + this.point.stackTotal;
                                        }
                                    },
                                    plotOptions: {
                                        column:{
                                            dataLabels: {
                                                enabled: true,
                                                allowOverlap: true,
                                                color:'#84d8e6'
                                            },
                                            stacking: 'normal'
                                        },
                                        series: {
                                            dataLabels: {
                                                enabled: true,
                                                //柱状图中的字的颜色
                                                color:'#ffffff',
                                                        
                                            }
                                        }
                                    },
                                    //图例
                                    legend: {
                                        itemStyle: {
                                            color: '#84d8e6'
                                        },
                                        enabled: false
                                    },
                                    series: seriesArr,
                                    drilldown: {
                                        drillUpButton: {
                                            position: {
                                                y: -10,
                                                x: 0
                                            },
                                            theme: {
                                                fill: '#F7CB4A',
                                                'stroke-width': 1,
                                                stroke: 'silver',
                                                r: 0,
                                                height: 14,
                                                states: {
                                                    select: {
                                                        stroke: '#039',
                                                        fill: '#red'
                                                    }
                                                }
                                            }
                                        },
                                        activeAxisLabelStyle: { color: '#333', fontWeight: 'formal', textDecoration: 'none' },
                                        series: that.drilldownSeries
                                    }
                                });
                            },
                            error:function(){
                                reject("getTheRTypeFullArea错误，请联系相关开发人员");
                            }
                        })
                    }else{
                        $.ajax({
                            url: './Svr/HandlerOffice.ashx',
                            data: { cmd: 'getTheRTypeArea', unitID: that.unitID, RoomType: seriesArr[1].data[i].RoomType ,areaType:0},
                            dataType: 'json',
                            success: function (data) {
                                if(data.length>0){
                                    var drilldownSeriesObj = {};
                                    drilldownSeriesObj.id = "drilldown1"+data[0].RoomType;
                                    drilldownSeriesObj.name = "空置面积";
                                    drilldownSeriesObj.data = data;
                                    for(var i=0;i<data.length;i++){
                                        data[i].y=parseInt(parseFloat(data[i].y)*100)/100;
                                    }
                                    that.drilldownSeries.push(drilldownSeriesObj);
                                }
                            }
                        });
                    }
                }
            });
        }
        unitUseArea.then(unitFullArea).then(dependentsArea).then(getTheRTypeUseArea).then(getTheRTypeFullArea).catch(function(error){console.log(error)});
    }
};