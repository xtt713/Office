function _permissionManage() {
    this.unitID = "1";
    this.buildingID = "";
    this.houseSubID = "";
    this.houseName = "";
    this.houseSubName = "";
}
_permissionManage.prototype = {
    init: function () {
        
        var that = this;
        that.getBuilding("1");
        that.getBuilding("2");
        
        that.getImgList("1", "1","11","省政府机关院","一办公楼","A座");
        $("#unitList").find("li").on('click', function (e) {
            $("#unitList").find("li.background-black").removeClass('background-black');
            $(e.target).addClass("background-black");
            that.unitID = $(e.target).attr("name");
            if ($(e.target).attr("name") === "1") {
                $("#buildingList1").show();
                $("#buildingList2").hide();
            } else {

                $("#buildingList1").hide();
                $("#buildingList2").show();
            }
        });
    },
    //获取单位下所有办公楼
    getBuilding: function (e) {
        var that = this;
        $.ajax({
            url: 'HandlerPermission.ashx',
            data: { cmd: 'getBuilding', unitID: e,type:0 },
            dataType: 'json',
            success: function (data) {
                //html，html1分别是办公楼内容和分区内容的父级ul标签
                var html = "";
                var html1 = "";
                var thisTime;
                for (var i = 0; i < data.length; i++) {
                    that.getHouseSub(e,data[i].ID);
                    html += "<li name='" + data[i].HouseName + "'><a href='#' name='" + data[i].ID + "'><i class='icon iconfont icon-bangonglou' ></i>" + data[i].HouseName + "</a></li>";
                    html1 += "<div id='building" + data[i].ID + "' class='nav-slide-o'></div>";
                }
                if (e === "1") {
                    $("#buildingList1").html(html);
                    $("#unit1HouseSub").html(html1);
                    $(".nav-slide>div:first-child li:first-child a").addClass('background-blue');
                } else {
                    $("#buildingList2").html(html);
                    $("#unit2HouseSub").html(html1);
                }
                $('.nav-ul li').mouseleave(function (even) {
                    thisTime = setTimeout(thisMouseOut, 1000);
                })
                $('.nav-ul li').mouseenter(function (e) {
                    clearTimeout(thisTime);
                    var thisUB = $('.nav-ul li').index($(this));
                    $('.nav-slide').addClass('hover');
                    $('.nav-slide-o').hide();
                    $('.nav-slide-o').eq(thisUB).show();
                    $('.nav-ul>li>a').css({ "background-color": "#111213" });
                    $(e.target).css({ "background-color": "#357dd7" });
                    that.unitID = $("#unitList").find(".background-black").attr("name");
                    that.buildingID = $(e.target).attr("name");
                    that.houseName = $(e.target).parent().attr("name");
                    $(".nav-slide-o>ul>li>a").off('click');
                    $(".nav-slide-o>ul>li>a").on('click', function (e) {
                        $("#nav_slide").find("a").removeClass("background-blue");
                        $(this).addClass('background-blue');
                        that.houseSubID = $(e.target).attr("name");
                        that.houseSubName = $(e.target).html();
                        var unitName = "";
                        if (that.unitID == "1") {
                            unitName = "省政府机关院";
                        } else {
                            unitName = "省政府机关二院";
                        }
                        that.getImgList(that.unitID, that.buildingID, that.houseSubID,unitName,that.houseName,that.houseSubName);
                    })
                })
                function thisMouseOut() {
                    $('.nav-slide').removeClass('hover');
                }
                $('.nav-slide').mouseenter(function () {
                    clearTimeout(thisTime);
                    $('.nav-slide').addClass('hover');
                })
                $('.nav-slide').mouseleave(function () {
                    $('.nav-slide').removeClass('hover');
                })
                
            },
            error: function (e) {
                console.log("怎么回事，又不显示了...")
            }
        })
    },
    //获取大楼下的分区内容(侧边栏)
    getHouseSub: function(unitID,buildingID){
        var that = this;
        $.ajax({
            url: 'HandlerPermission.ashx',
            data: { cmd: 'getHouseSub',unitID:unitID, buildingID: buildingID },
            dataType: 'json',
            success: function (result) {
                var html = "<ul>";
                for (var i = 0; i < result.length; i++) {
                    html += "<li><a href='#' name='" + result[i].ID + "'><span name='" + result[i].ID + "'>" + result[i].HouseSUBName + "</span></a></li>";
                }
                html += "</ul>";
                $("#building" + buildingID).html(html);
                if (buildingID == "1") {
                    $("#building1 ul li:first-child a").addClass('background-blue');
                }
                $("#buildingList2").hide();
                //$("#unit2HouseSub").hide();

                //二级菜单所对应的内容
                
            }
        })
    },
    //获取文件列表(前台以图片的形式显示出来)
    getImgList: function (unitID, buildingID, houseSubID,unitName,houseName,houseSubName) {
        $("#fileTitle>span").html(unitName + houseName + houseSubName);
        $.ajax({
            url: 'HandlerPermission.ashx',
            data: { cmd: 'getImgList', unitID: unitID, buildingID: buildingID, houseSubID: houseSubID },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    var oploadFile = "http://192.168.1.177/officeSystem/" + data[i].FilePath;
                    html += '<div class="col-lg-4">' +
                        '<div><img class="lazy-load" src="../images/loading.gif" data-original="' + data[i].FileImg + '" onclick ="permissionManage.getFileImg(this)" /></div>' +
                        '<div>' +
                            '<p class="col-lg-5">土地证号:<span>' + data[i].FileName + '</span></p>' +
                            '<p class="col-lg-7">房屋坐落:<span>长沙市湘府西路8号</span></p>' +
                        '</div>' +
                        '<div>' +
                            '<p class="col-lg-5">房屋号:<span>' + data[i].HouseName + '</span></p>' +
                            '<p class="col-lg-7">使用单位:<span>' + data[i].UnitName + '</span></p>' +
                        '</div>' +
                        '<div>' +
                            '<p class="col-lg-5">所在分区:<span>' + data[i].HouseSUBName + '</span></p>' +
                            '<p class="col-lg-7"><a class="btn btn-success" href ="'+ oploadFile +'" download="' + oploadFile + '" ><i class="icon iconfont icon-icon"></i>下载</a></p>' +
                        '</div>' +
                    '</div>';

                    
                }
                $("#fileList").html(html);
                $("img.lazy-load").lazyload({
                    effect : "fadeIn", //渐现，show(直接显示),fadeIn(淡入),slideDown(下拉)
                    threshold : 0, //预加载，在图片距离屏幕180px时提前载入
                    event: 'scroll',  // 事件触发时才加载，click(点击),mouseover(鼠标划过),sporty(运动的),默认为scroll（滑动）
                    container: $("#fileList"), // 指定对某容器中的图片实现效果
                    failure_limit:0 //加载2张可见区域外的图片,lazyload默认在找到第一张不在可见区域里的图片时则不再继续加载,但当HTML容器混乱的时候可能出现可见区域内图片并没加载出来的情况
                })
                
            }, error: function (e) {
                console.log("接口出错。。。联系开发人员吧");
            }
        })
        
    },
    //获取文件图片(前台)
    getFileImg: function (e) {
        $("#originImgDiv").fadeIn();
        var html = "<img src=" + $(e).attr("src") + ">"
        $("#originalImg").html(html);
        $("img[src='../images/close.png']").click(function () {
            $("#originImgDiv").fadeOut();
        })
    }
}
