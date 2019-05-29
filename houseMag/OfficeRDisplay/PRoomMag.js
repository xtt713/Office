function _pRoomMag() {

}

_pRoomMag.prototype = {
    init: function () {
        common.initHtml("./OfficeRDisplay/unitMag/unitMag.html", $("#RoomPersonMag"), function () {
            //var roomMag1 = new _roomMag();
            unitMag.init();
        });
        //导航栏点击事件
        $(".nav-pills").find("li").on('click', function (e) {
            $(".nav-pills li").removeClass("active");
            $(e.target).parent().addClass("active");
            //$(".data-list>div").hide();
            $("#" + $(e.target).attr("name")).show();
            switch ($(e.target).attr("name")) {
                case "unitManage":
                    $("#addData").show();
                    //表示单位,加载单位的html2018-06-04
                    $("#addData").attr('name', 'Unit');
                    common.initHtml("./OfficeRDisplay/unitMag/unitMag.html", $("#RoomPersonMag"), function () {
                        //var roomMag2 = new _roomMag();
                        unitMag.init();
                    });
                    break;
                case "houseManage":
                    $("#addData").show();
                    //表示大楼,加载大楼的html2018-06-04
                    $("#addData").attr('name', 'House');
                    common.initHtml("./OfficeRDisplay/houseMag/houseMag.html", $("#RoomPersonMag"), function () {
                        //var roomMag2 = new _roomMag();
                        houseMag.init();
                    });
                    break;
                case "housesubManage":
                    $("#addData").show();
                    //表示分区,加载分区的html2018-06-04
                    $("#addData").attr('name', 'HouseSub');
                    common.initHtml("./OfficeRDisplay/housesubMag/housesubMag.html", $("#RoomPersonMag"), function () {
                        //var roomMag2 = new _roomMag();
                        housesubMag.init();
                    });
                    break;
                case "roomManage":
                    $("#addData").show();
                    $("#addData").attr('name', 'Room');
                    //表示房间,加载房间的html2018-04-09
                    common.initHtml("./OfficeRDisplay/RoomMag/RoomMag.html", $("#RoomPersonMag"), function () {
                        //var roomMag2 = new _roomMag();
                        roomMag.init();
                    });
                    break;
                case "personManage":
                    $("#addData").show();
                    $("#addData").attr('name','Person');
                    //表示人员，加载人员的html2018-04-09
                    common.initHtml("./OfficeRDisplay/PersonMag/PersonMag.html", $("#RoomPersonMag"), function () {
                        //var personMag = new _personMag();
                        personMag.init();
                    });
                    break;
                case "personDispatch":
                    $("#addData").hide();
                    //人员新增按钮隐藏

                    //表示加载调度的html
                    common.initHtml("./OfficeRDisplay/Dispatch/Dispatch.html", $("#RoomPersonMag"), function () {
                        //var pRDispatch = new _PRDispatch();
                        pRDispatch.allRoomData();
                    });
                    break;
            }
            //if ($(e.target).attr("name") == "roomManage") {
                
            //} else if ($(e.target).attr("name") == "personManage") {
               
            //} else if ($(e.target).attr("name") == "personDispatch") {
                

            //}
        });

        //新增人员功能
        $("#addData[name='Person']").off('click');
        $("#addData[name='Person']").on('click', function (e) {
            addOrEdit = 0;
            $("input[name='REALNAME']").val("");
            $("input[name=SEX]:eq(0)").attr("checked", 'checked');
            MOBILE = $("#MOBILE").val();
            $("#POSITION").find("option[value='1']").attr("selected", "selected");
            ADDRESS = $("input[name='ADDRESS']").val();
            $(".widget-box  #roomStatus").html("新增");
        });
        $(".required").on("blur", function (e) {
            if ($(e.target).val() && $(e.target).hasClass("border-red")) {
                $(e.target).removeClass("border-red");
            }
        })
    }
}