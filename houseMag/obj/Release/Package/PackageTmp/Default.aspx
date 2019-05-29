<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="houseMag.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="./MapJS/mapfiles/css/default.css" rel="stylesheet" />
    <link href="./Tools/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" media="screen and (min-width:320px) and (max-width:767px)" href="./css/default320.css" />
    <link rel="stylesheet" type="text/css" media="screen and (min-width:768px) and (max-width:1199px)" href="./css/default768.css" />
    <link rel="stylesheet" type="text/css" media="screen and (min-width:1200px)" href="./css/default1200.css" />
    <link href="./css/font-awesome.min.css" rel="stylesheet" />
    <link href="./css/Default.css" rel="stylesheet" />
    <link href="css/public.css" rel="stylesheet" />
    <link href="css/reset.css" rel="stylesheet" />
    <script src="./Tools/js/jquery.min.js"></script>
     <script src="./MapJS/cxygooglemap.js"></script>
    <script src="./MapJS/mapfiles/api-3/15/5/main.js"></script>
    <script src="./MapJS/mapfiles/api-3/15/5/map.js"></script>
    <script src="./MapJS/mapfiles/api-3/15/5/drawing.js"></script>
    <script src="./MapJS/mapfiles/api-3/15/5/common.js"></script>
    <script src="./Tools/js/bootstrap.min.js"></script>
    <script src="./js/showUnit.js"></script>
    <script src="./js/showRoom.js"></script>
    <script src="js/common.js"></script>
    <script src="./Tools/js/highcharts.js"></script>
    <script src="Tools/js/pagination.js"></script>
    <%--FSS用于背景颜色--%>
    <script src="Tools/js/FSS.js"></script>
    <script>
        var scale = <%=ConfigurationManager.AppSettings["scale"]%>;//地图显示默认级别
    </script>
</head>
<body>
    <header id="navbar">
        <img src="images/gh.png" style="height: 30px;" /><span>湖南省政府大院办公用房综合管理系统</span>
        <button class="fr btn btn-danger" id="existLogin" ontouchstart="common.clickEvent('1')" onclick="    common.clickEvent('1')"><i class="icon iconfont icon-zhuye"></i>主页</button>
    </header>
    <div id="content" style="background-color: #fff; padding-top: 5px; padding-bottom: 5px; height: 93vh;">
       <%-- <div id="divRight" class="pa div-right" style="width: 25%; border: 1px #cccccc solid; height: 100%; z-index: 10; right: 0; height: calc(93vh - 10px); background-image: url('../images/bgm.jpg');">

            <div class="house-div">
                <div class="left-title">办公大楼</div>
                <ul id="house"></ul>
            </div>
            <div class="house-div otherHouse-div">
                <div class="left-title">附属大楼</div>
                <ul id="otherHouse"></ul>
            </div>

        </div>--%>
        <div id="main_left" class="map-left  pa" style="background-color: #F5F5F5;">
            <div id="output" class="output">
                <div id="unitBox">
                    <div class="search-group">
                        <input type="text" id="searchContent" placeholder="搜单位" autocomplete="off"/><%-- 
                       --%><span id="clearSearch" title="清空"></span><%-- 
                       --%><button id="searchUnit" title="搜索"></button>
                    </div>
                    <ul id="unitList" class="poilist"></ul>
                    <div class="paginationDiv">
                        <ul id="pagination" class="pagination"></ul>
                        <p>共<span class="totalNum"></span>页</p>
                        <p>到第<input type="text" id="num" />页</p>
                        <button id="getIndexData">确定</button>
                    </div>
                </div>
                <div id="unitDetail" class="unit-detail" style="display:none;">
                    <div id='getBack' class='get-back'><i class='icon-reply'></i>&nbsp;&nbsp;&nbsp;&nbsp;返回</div>
                    <ul class="nav nav-pills nav-pillsUnit" id="nav-pillsUnit">
                        <li role="presentation" class="active"><a name="unitDetailInfo" href="#">详细信息</a></li>
                        <li role="presentation"><a name="houseInfo" href="#">办公楼</a></li>
                        <li role="presentation"><a name="otherHouseInfo" href="#">附属大楼</a></li>
                    </ul>
                    <%--某单位详细信息--%>
                    <div id="unitDetailInfo" >
                        <div class='photoTitle'>相册</div>
                        <%--横线--%>
                        <div class='c-line-top'></div>
                        <%--相册缩略图--%>
                        <ul id='unitImgList' class="unitImgList"></ul>
                        <%--横线--%>
                        <div class='c-line-top'></div>
                        <%--介绍--%>
                        <div class='unitNameDiv' style="font-weight: 700;font-size:14px;"></div><div class='c-line-top'"></div>
                        <div style='text-indent:28px;height: 25vh;margin-top:2vh;line-height:2;' class='unit-info'></div>
                        <button id='watchChart' style='float:right;'>查看房间类型</button>
                    </div>
                    <%--某单位办公大楼列表--%>
                    <div id="houseInfo" style="display:none;" class="house-div">

                    </div>
                    <%--某单位附属大楼列表--%>
                    <div id="otherHouseInfo" style="display:none;" class="otherHouse-div">

                    </div>
                </div>
            </div>
        </div>
        <div id="divCenter" style="border: 1px #cccccc solid; height: 100%;">
            <div class="toggle-box" id="toggleBox">
                <p id="toggle_button" class="toggle-button" title="收起侧边面板">
                    <span class="toggle-icon"></span>
                </p>

            </div>
            <div style="height: 100%;">
                <div id="DMapContiner" style="border: 1px #cccccc solid; height: 100%; z-index: 0;"></div>
            </div>
            <%-- <div id="leftDivHide" title="收起左栏"></div>--%>
        </div>
    </div>
    <div class="img-lunbo" id="imgLunbo">
        <div class="button return">返回</div>
        <div class="img-lunbo-content">
            <div class="swiper-wrapper" id="swiper_wrapper">
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        </div>
    </div>
    <div class="originImgDiv" id="originImgDiv">
        <div class="button return">返回</div>
        <div class="getOriginalImg" id="getOriginalImg">
            <div id="originalImg" class="originalImg">
                <h4></h4>
                <div id="other_area_column"></div>
            </div>
        </div>
    </div>
    <div id="popBox" style="display:none;position:absolute;width:100vw;height:100vh;top:0;z-index:20;">
        <div id="houseRBox" class="dn">
            <img src="./images/close.png" class="close-img" id="closePopBox"/>
            <h3></h3>
            <div id="svgImg"></div>
        </div>
        <div id="floorRBox" class="dn">
            <img src="./images/close.png" class="close-img" id="closeHouseRBox"/>
            <h4></h4>
            <div id="floorRaphael"></div>
        </div>
        <div id="roomRBox" class="dn">
            <img src="./images/close.png" class="close-img" id="closeFloorRBox"/>
            <h4></h4>
            <div class="nav-chart">
               <div class="leftnav" id="leftnav2">
                    <div class="left-title3" id="RoomDistribution">办公用房二楼分布情况</div>
                     <div id="roomRaphael"></div>
               </div>
                <div class="col-xs-12 col-sm-6 col-lg-3 " id="nav-chart-raphael">
                    <div>
                        <div class="charts2">
                            <div class="leftnav" >
                                <div class="left-title2">办公用房使用情况</div>
                                <div id="office_pieChart2" class="office-pieChart"  style="background-image:url(./images/bgm.jpg)"></div>
                            </div>
                            <div class="leftnav" >
                                <div class="left-title2">办公人员职称分布</div>
                                <div id="people_chart2"  class="office-pieChart" style="background-image:url(./images/bgm.jpg)"></div>
                            </div>
                            <div class="leftnav" >
                                <div class="left-title2">处室分布情况</div>
                                <div id="office_navpieChart"  class="office-pieChart" style="background-image:url(./images/bgm.jpg)"></div>
                            </div>
                            <div class="leftnav" >
                                <div class="left-title2">办公分类统计</div>
                                <div id="people_navchart"  class="office-pieChart" style="background-image:url(./images/bgm.jpg)"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="roomInfoBox" class="dn" style="display:none;width:200px;height:140px;position:absolute;left:40%;top:40%;background-color:#F5F5F5">
            <h4></h4>
            <div id="roomInfoRaphael" style="color:#fff;">
               <%-- <lable style="text-align:right;">房间编号：</lable><lable class="roomCode" style="text-align:right;"></lable>
                <lable style="text-align:right;">房间面积：</lable><lable class="roomSize" style="text-align:right;"></lable>
                <lable style="text-align:right;">房间名称：</lable><lable class="roomName" style="text-align:right;"></lable>
                <lable style="text-align:right;">使用者：</lable><lable class="roomUser" style="text-align:right;"></lable>--%>
                <ul>
                    <li style="width:160px;height:30px;">
                        房间编号：<lable class="roomCode" >
                    </li>
                    <li style="width:140px;height:30px;">
                        房间面积：<lable class="roomSize">
                    </li>
                    <li style="width:140px;height:30px;">
                        房间名称：<lable class="roomName">
                    </li>
                    <li style="width:140px;height:90px;">
                        使用者：<lable class="roomUser" >
                    </li>
                </ul>
            </div>
        </div>
        
    <style>
        li {
            list-style: none;
        }

        #roomInfoRaphael ul li {
            color: #000000;
        }
    </style>
    </div>

    <div class="room-detail-show" style="display:none;position:absolute;left:0%;top:0%;background-image: url(images/bgm.jpg)" id="room-detail-show">
        <header>
            <img src="images/gh.png" style="height: 30px;" /><span>湖南省政府大院公有房产综合管理系统</span>
            <div class="button-group" id="button_group">
                <ul id="houseButton">
          
                </ul>
       
                <div>
                    <button class="btn btn-danger" id="existLogin" onclick="common.clickEvent('1')"><i class="icon iconfont icon-zhuye"></i>主页</button>
                    <button id="gobackToMap" class="btn btn-success"><i class="icon iconfont icon-return"></i>返回</button>
                </div>
            </div>
        </header>
        <main id="main">
            <div id="main_left" class="col-xs-12 col-sm-6 col-lg-3 main-left">
                <div>

                    <div class="charts">
                        <div class="left-top">
                            <div class="left-title">办公用房使用情况</div>
                            <div id="office_pieChart" class="office-pieChart"></div>
                        </div>
                        <div class="left-bottom">
                            <div class="left-title">办公人员职称分布</div>
                            <div id="people_chart" class="people-chart"></div>
                        </div>
                    </div>
                </div>

            </div>

            <div id="main_center" class="col-xs-12 col-sm-12 col-lg-6 main-center">
                <div class="choose-build">
                    <div id="RoomDetail" class="room-detail">
                        <!--<div class="gov-info" id="govInfo" style="background:rgba(98, 176, 243, 0.2)">
                            <h3>湖南省政府详细信息</h3>
                        </div>-->



                        <div class="main-center-top"><div id="center_title"></div></div>
                        <div class="fr build-search">
                            分区搜索:
                            <label><select id="housesubSearch"></select></label>
                            楼层搜索:
                            <label><select id="floorSearch"></select></label>
                            处室搜索:
                            <label><select id="divisionSearch"></select></label>
                        </div>
                        <ul class="nav nav-pills nav-pills1">
                            <li role="presentation" class="active"><a name="roomTable" href="#">办公室列表</a></li>
                            <li role="presentation"><a name="buildingImgList" href="#">办公室图片</a></li>
                        </ul>
                        <div class="buildingImgList" id="buildingImgList">
                            <!--<img class="col-lg-6" src="images/1.jpg" />
                            <div class="col-lg-6">
                                <p>办公室编号:南栋-205</p>
                                <p>房内人员姓名：杨芳 曾庆虎 洪堃伟 陈卓懿	</p>
                                <p>处室：杨芳 曾庆虎 洪堃伟 陈卓懿	</p>
                                <p>使用面积：32.48m<sup>2</sup></p>
                            </div>-->
                        </div>
                        <div class="room-table" id="roomTable">
                            <div class="center-top">
                                <div id="buildPersonData" class="build-person-data">
                                    <table class="table table-bordered table-style">
                                        <colgroup>
                                            <col style="width: 60px;" />
                                            <col />
                                        </colgroup>
                                        <thead class="table-head" id="table_head">
                                            <tr>
                                                <th style='width:50px;height:4.7vh;'>序号</th>
                                                <th style='width:120px;height:4.7vh;'>办公室编号</th>
                                                <th style='width:130px;height:4.7vh;'>姓名</th>
                                                <th style='width:110px;height:4.7vh;'>处室</th>
                                                <th style='width:80px;height:4.7vh;'>使用面积</th>
                                                <th style='width:58px;height:4.7vh;'>状态</th>
                                            </tr>
                                        </thead>
                                        <tbody id="officeMsg"></tbody>

                                    </table>
                                </div>

                                <div class="paginationDiv">
                                    <ul id="pagination" class="pagination"></ul>
                                    <p>共<span class="totalNum"></span>页</p>
                                    <p>到第<input type="number" id="num" />页</p>
                                    <button id="getIndexData">确定</button>
                                </div>
                            </div>
                            <div id="export_excel" class="fr" style="margin-top: 7px;">
                                <button class="btn btn-success" data-toggle="modal" data-target="#myModal">导出</button>
                            </div>
                            <div class="center-bottom">
                                <ul class="nav nav-pills nav-pills2">
                                    <li role="presentation" class="active"><a name="panorama" href="#">全景照片</a></li>
                                    <li role="presentation"><a name="RoomImg" href="#">照片</a></li>
                                </ul>
                                <div class="center-bottom-L office-center-L" id="roomMessage">
                                    <p id="panorama" class="panorama"></p>
                                    <p id="RoomImg" class="room_img"></p>
                                </div>
                                <div class="center-bottom-R" id="roomPeople">
                                    <table class="table table-bordered table-style">
                                        <thead class="table-head">
                                            <tr id="Tr">
                                                <th style="width:180px;">姓名</th>
                                                <th style="width:180px;">职称</th>
                                                <th style="width:285px;">处室</th>
                                            </tr>
                                        </thead>
                                        <tbody id="personData"></tbody>

                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div id="main_right" class="col-xs-12 col-sm-6 col-lg-3 main-right">
                <div>
                    <div class="user-manage">
                        <div class="search">
                            <div class="left-title">姓名搜索</div>
                            <div id="searchGroup" class="search-group">
                                <input type='text' placeholder='请输入姓名' />
                                <!--去除inline-block元素之间的间距
                                -->
                                <button class="btn-success" id="search"><img src="images/search.svg" />搜索</button>
                            </div>
                        </div>
                        <div class="right-top">
                            <div class="left-title">公有房产分布</div>
                            <ul class="nav nav-pills nav-pills3">
                                <li role="presentation" class="active"><a name="houseDistribute" href="#">办公用房</a></li>
                                <li role="presentation"><a name="otherHouseDistribute" href="#">其他</a></li>
                            </ul>
                            <div class="tableClass">
                                <table class="table table-bordered table-style" id="houseDistribute">
                                    <thead class="table-head">
                                        <tr>
                                            <th>办公室类型</th>
                                            <th>总房间数</th>
                                            <th>已用房间数</th>
                                        </tr>
                                    </thead>
                                    <tbody id="roomTypeNum"></tbody>
                                </table>
                                <table class="table table-bordered table-style" id="otherHouseDistribute" style="display:none;">
                                    <thead class="table-head">
                                        <tr>
                                            <th>房产类型</th>
                                            <th>总房间数</th>
                                            <th>已用房间数</th>
                                        </tr>
                                    </thead>
                                    <tbody id="otherRoomTypeNum"></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="right-bottom">
                            <div class="left-title">党政机关办公室面积标准</div>
                            <div id="area_container" class="area-container"></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <!--点击图片放大-->
        <div class="originImgDiv" id="originImgDiv">
            <div class="getOriginalImg" id="getOriginalImg">
                <img src="images/close.png" width="30" height="30" />
                <div id="originalImg" class="originalImg">
                </div>
            </div>
        </div>
        <!--vr-->
        <div class="originImgDiv1" id="originImgDiv1">
            <div class="getOriginalImg1" id="getOriginalImg1">
                <img src="images/close.svg" width="30" height="30" />
                <div id="originalImg1" class="originalImg1">
                </div>
            </div>
        </div>
        <!-- 模态框 -->
        <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="myModalLabel">导出数据类型</h4>
                    </div>
                    <div class="modal-body t-center">
                        <label><input type="radio" name="generateExcelType" id="generate_division" value="0" checked="checked" />处室</label>
                        <label><input type="radio" name="generateExcelType" id="generate_room" value="1" />办公室</label>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="generate_excel">提交</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>
        <!-- 导出表格 -->
        <table style="display: none;" id="exportTableData">
            <thead id="exportHeadData">

            </thead>
            <tbody id="exportTbodyData"></tbody>
        </table>
    </div>

    <script src="Tools/js/rapmin.js"></script>
    <script src="MapJS/cxy_drawEdit.js"></script>
    <script src="MapJS/cxy_drawFloor.js"></script>
    <script src="MapJS/cxy_drawRoom.js"></script>
<script>
    var drawEdit = new cxy_drawEdit();
    var cxymap = new cxygoogleMap();
    var drawFloor = new cxy_drawfloor();
    var drawRoom = new cxy_drawRoom();
    cxymap.init(document.getElementById("DMapContiner"), 'http://192.168.3.107/csmap/', 'http://192.168.3.112/csDx/', 6, 18, 15, 112.9832970673, 28.1142209008);
    var showOrHide = 0;
    $("#leftDivHide").click(function () {
        if (showOrHide == 0) {
            $("#divList").hide();
            showOrHide++;
        } else {
            $("#divList").show();
            showOrHide = 0;
        }
    });
    var showUnit = new _showUnit();
    showUnit.init();
</script>
</body>
</html>

