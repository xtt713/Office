function _roomMag() {
    //初始单位ID,楼房ID,分区，楼层均为空
    this.unitID = "";
    this.buildingID = "";
    this.houseSubID = "";
    this.floorID = "";
    //初始房间信息为空
    this.roomData = "";
    //初始选择框信息为空(4级select菜单)
    this.selectOptionArr = "";
    //记录当前点击所对应的houseId,用于保存
    this.editHouseId = "";
    //记录房间最后一个ID，用于添加房间
    //this.lastID = "";
    this.oldEditRoom = "";
    this.currentPage = 1;
}

var roomOrPerson = 0;
var addOrEdit;
_roomMag.prototype = {
    init: function () {
        var that = this;
        that.roomDataTable();
    
        that.unitID = "";
        that.buildingID = "";
        that.houseSubID = "";
        that.editHouseId = "";
        that.currentPage = 1;
        $("#modals").hide();
        
        $.ajax({
            url:'./OfficeRDisplay/RoomMag/HandlerRoom.ashx',
            data:{
                cmd:'getUnitOption'
            },
            dataType:'json',
            success:function(data){
                var html = "<option name=''>全部</option>";
                for(var i = 0;i<data.length;i++){
                    html+="<option name='"+ data[i].ID +"'>" + data[i].UnitName + "</option>";
                }
                $("#unitSelect").html(html);
                
                that.getHouseOption(data[0].ID);
                
            },
            error:function(e){
                console.log("接口错误");
            }
        });
        $("#searchRoomName").off('click');
        //通过房间名搜索房间
        $("#searchRoomName").on('click', function (e) {
            var roomName = $("#inputRoomName").val();
            $.ajax({
                url: './OfficeRDisplay/RoomMag/HandlerRoom.ashx',
                data: {
                    cmd: 'roomDataTable',
                    roomName: roomName,
                    UnitID:$("#unitSelect").find("option:selected").attr("name"),
                    HouseID:$("#houseSelect").find("option:selected").attr("name"),
                    HouseSubID:$("#housesubSelect").find("option:selected").attr("name"),
                    Floor:$("#floorSelect").find("option:selected").attr("name")
                },
                dataType: 'json',
                success: function (data) {
                    that.currentPage = 1;
                    that.dealResult(data);
                }
            })
        });
        //修改后点击确定按钮（提交）
        $("#submitEditRoom").off('click');
        $("#submitEditRoom").on('click', function (e) {
            swal({
                title: "",
                text: "确定修改房间信息？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: true
            }, function(isConfirm) {
                if (isConfirm) {
                    ///^\d+(\.{0,1}\d+){0,1}$/  非负整数正则表达式
                    var reg = /^\d+(\.\d+)?$/;
                    var regNoVal = /^\s*$/g;      //空值正则表达式
                    var Area = $("#standardArea").val(),
                        Width = $("#roomWidth").val(),
                        Height = $("#roomLength").val(),
                        RoomName = $("#roomName").val();
                    //console.log("房间名为：" + $("#roomName").val() + "房间面积为：" + $("#standardArea").val() + "房间长：" + $("#roomLength").val() + "房间宽：" + $("#roomWidth").val());
                    if ($("#roomName").val() == "" || regNoVal.test($("#roomName").val())) {
                        swal("提示", "房间号不能为空", "error");
                        $("#roomName").addClass("border-red");
                        return false;
                    } else if ($("#standardArea").val() == "" || regNoVal.test($("#standardArea").val()) || !reg.test($("#standardArea").val())) {
                        swal("提示", "房间面积只能为非负整数", "error");
                        $("#standardArea").addClass("border-red");
                        return false;
                    } else if (reg.test($("#roomWidth").val()) < 0) {
                        swal("提示", "房间宽度只能为非负整数", "error");
                        $("#roomWidth").addClass("border-red");
                        return false;
                    } else if (reg.test($("#roomLength").val()) < 0) {
                        swal("提示", "房间长度只能为非负整数", "error");
                        $("#roomLength").addClass("border-red");
                        return false;
                    } else {
                        that.EditRoomData($(e.target).attr("name"));
                        $("#roomName").removeClass("border-red");
                        $("#standardArea").removeClass("border-red");
                        $("#roomWidth").removeClass("border-red");
                        $("#roomLength").removeClass("border-red");
                        return false;//防止页面强制刷新
                    }                      
                } else{
                    
                }
            });
            return false;
        });

        //新增房间点击确定按钮
        $("#submitAddRoom").off('click');
        $("#submitAddRoom").on('click', function (e) {
            swal({
                title: "",
                text: "确定增加该房间？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: true
            }, function(isConfirm) {
                if (isConfirm) {
                    var reg = /^\d+(\.\d+)?$/;   //非负整数正则表达式
                    var regNoVal = /^\s*$/g;      //空值正则表达式
                    var Area = $("#standardArea").val(),
                        Width = $("#roomWidth").val(),
                        Height = $("#roomLength").val(),
                        RoomName = $("#roomName").val();
                    //console.log("房间名为："+RoomName+"房间面积为："+Area +"房间长："+Height+"房间宽："+Width);
                    if (RoomName == "" || regNoVal.test(RoomName) ) {
                        swal("提示", "房间号不能为空", "error");
                        $("#roomName").addClass("border-red");
                        return false;
                    } else if (Area == "" || regNoVal.test(Area) || !reg.test(Area)) {
                        swal("提示", "房间面积只能为非负数", "error");
                        $("#standardArea").addClass("border-red");
                        return false;
                    } else if (reg.test(Width) < 0) {
                        swal("提示", "房间宽度只能为非负数", "error");
                        $("#roomWidth").addClass("border-red");
                        return false;
                    } else if (reg.test(Height) < 0) {
                        swal("提示", "房间长度只能为非负数", "error");
                        $("#roomLength").addClass("border-red");
                        return false;
                    } else {
                        that.AddRoomData();
                        $("#roomName").removeClass("border-red");
                        $("#standardArea").removeClass("border-red");
                        $("#roomWidth").removeClass("border-red");
                        $("#roomLength").removeClass("border-red");
                        
                    }         
                } else{
                   
                }
            });
            return false;
           
        });

        //新增房间功能（点击新增按钮）
        $("#addData[name='Room']").on('click', function (e) {
            $("#submitEditRoom").hide();
            $("#imgUpload").hide();
            $("#submitAddRoom").show();
            $("#modals").show();
            $("#detailMsg").show();
            that.editHouseId = "";
            $("#roomType option").each(function () {
                $(this).removeAttr("selected");
            });
            $("#roomStatus").html("新增");
            $("#roomType").find("option[name='1']").attr("selected", "selected");
            $("#roomName").val("");
            //$("#buildArea").val("");
            $("#standardArea").val("");
            $("#roomLength").val("");
            $("#roomWidth").val("");
            $("#theRoomImg").html("");
            $("#theRoomPano").html("");
            $("img[src='images/closeModal.png']").on('click', function () {
                $("#modals").hide();
            });


        });
        //全景图片上传
        $("#panoramaImg").off('change');
        $("#panoramaImg").on('change', function (e) {
            var panoramaImg = $("#panoramaImg");
            var panoFileName = common.getFileName($(e.target).val());//获取上传图片名称
            var uploadTime = common.formatTime(new Date());
            var panoImgObj = {
                fileName: panoFileName,
                fileType: "pano",
                sType: 4,
                SID: that.editHouseId,
                uploadTime: uploadTime,
                ID: "panoramaImg"
            };
            common.fileUpload(panoImgObj);

        });
        //房间图片上传
        $("#fuFileImg").off('change');
        $("#fuFileImg").on('change', function (e) {
            var fuFileImg = $("#fuFileImg");
            var imgFileName = common.getFileName($(e.target).val());//获取上传图片名称
            var uploadTime = common.formatTime(new Date());
            var roomImgObj = {
                fileName: imgFileName,
                fileType: "img",
                sType: 4,
                SID: that.editHouseId,
                uploadTime: uploadTime,
                ID: "fuFileImg"
            };
            common.fileUpload(roomImgObj);
        });
    },

    getHouseOption:function(unitID){
        var that = this;
        $.ajax({
            url:'./OfficeRDisplay/RoomMag/HandlerRoom.ashx',
            data:{
                cmd:'getHouseOption',
                unitID:unitID
            },
            dataType:'json',
            success:function(data){
                var html = "<option name=''>全部</option>";
                for(var i = 0;i<data.length;i++){
                    html+="<option name='"+ data[i].ID +"'>" + data[i].HouseName + "</option>";
                }
                $("#houseSelect").html(html);
                
                that.getHouseSubOption(data[0].ID);
            },
            error:function(e){
                console.log("接口错误");
            }
        });
    },
    getHouseSubOption:function(houseID){
        var that = this;
        $.ajax({
            url:'./OfficeRDisplay/RoomMag/HandlerRoom.ashx',
            data:{
                cmd:'getHouseSubOption',
                HouseID:houseID
            },
            dataType:'json',
            success:function(data){
                var html = "<option name=''>全部</option>";
                for(var i = 0;i<data.length;i++){
                    html+="<option name='"+ data[i].ID +"'>" + data[i].HouseSUBName + "</option>";
                }
                $("#housesubSelect").html(html);
                
                that.getFloorOption(data[0].ID);
            },
            error:function(e){
                console.log("接口错误");
            }
        });
    },
    getFloorOption:function(housesubID){
        var that = this;
        $.ajax({
            url:'./OfficeRDisplay/RoomMag/HandlerRoom.ashx',
            data:{
                cmd:'getFloorOption',
                housesubID:housesubID
            },
            dataType:'json',
            success:function(data){
                var html = "<option name=''>全部</option>";
                for(var i = 0;i<data[0].floor;i++){
                    html+="<option name='"+ (i+1) +"'>" + (i+1) + "</option>";
                }
                $("#floorSelect").html(html);
                $("#unitSelect").off('change');
                $("#unitSelect").on('change',function(e){
                    that.getHouseOption($("#unitSelect").find("option:selected").attr("name"));
                });
                $("#houseSelect").off('change');
                $("#houseSelect").on('change',function(e){
                    that.getHouseSubOption($("#houseSelect").find("option:selected").attr("name"));
                });
                $("#housesubSelect").off('change');
                $("#housesubSelect").on('change',function(e){
                    that.getFloorOption($("#housesubSelect").find("option:selected").attr("name"));
                });
            },
            error:function(e){
                console.log("接口错误");
            }
        });
    },
    //1.将每个房间的数据都显示出来2018-3-9 wf
    roomDataTable: function () {
        var that = this;
        $.ajax({
            url: './OfficeRDisplay/RoomMag/HandlerRoom.ashx',
            data: {
                cmd: 'roomDataTable'
            },
            dataType: 'json',
            success: function (result) {
                that.editHouseId = result[0].ID;
                $("#roomType").find("option[name='" + result[0].RoomType + "']").attr("selected", "selected");
                $("#roomName").val(result[0].RoomName);
                $("#users").val(result[0].Users);
                //$("#buildArea").val(parseInt(result[0].BuildArea));
                $("#standardArea").val(parseFloat(result[0].Area));
                that.roomData = result;
                that.oldEditRoom = result[0].RoomName;
                //四级select菜单
                that.multMenu(result, 0);
                that.dealResult(result);
                that.getImgList("theRoomImg", that.editHouseId);
                that.getImgList("theRoomPano", that.editHouseId);
                //当房间数据全部都渲染时，开始调用人员接口，这样就避免了房间数据获取过慢的问题
                //personMag.init();
            },
            error: function () {
                console.log("接口错误，请联系相关人员");
            }
        })
    },
    dealResult: function (result) {
        if (result.length === 0) {
            $("#roomDetailData").html("暂无数据");
            $("#paginationDiv").hide();
            $("#detailMsg").hide();
            return
        } else {
            $("#paginationDiv").show();
            $("#detailMsg").show();
            var that = this,
            totalPage = Math.ceil(result.length / 10);//总页数
            //lastId = result[(result.length - 1)].ID;
            //that.lastID = lastId;
            //把result[result.length-1].ID赋值到新增按钮的name属性上
            //$("#addRoomData").attr("name", (parseInt(lastId) + 1));
            //分页
            $.jqPaginator('#pagination', {
                totalPages: totalPage,
                visiblePages: 4,
                currentPage: that.currentPage || 1,
                prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
                next: '<li class="next"><a href="javascript:;">下一页</a></li>',
                page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                onPageChange: function (num) {
                    that.currentPage = num;
                    $('#roomDetailData').html(that.pagination(result, num, totalPage));
                    $("#roomDetailData tr:nth-child(" + 1 + ")").addClass('bg-gray');
                }
            });
            //跳页功能
            $("#getIndexData").off('click');
            $("#getIndexData").on('click',function () {
                that.currentPage = parseInt($("#num").val());
                if ( that.currentPage > totalPage) {
                    that.currentPage = totalPage;
                    $("#num").val(totalPage);
                }
                
                $.jqPaginator('#pagination', {
                    totalPages: totalPage,
                    visiblePages: 4,
                    currentPage:  that.currentPage || 1,
                    prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
                    next: '<li class="next"><a href="javascript:;">下一页</a></li>',
                    page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                    onPageChange: function (num) {
                        that.currentPage = num;
                        $('#roomDetailData').html(that.pagination(result, num, totalPage));
                        $("#roomDetailData tr:nth-child(" + 1 + ")").addClass('bg-gray');

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
        //2.当数据总数大于10，且当前页数不在总页数上(最后一页)，则渲染9条数据;
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
        $("#totalNum").html(totalPage);
        return html;
    },
    //获取房间人员信息
    getRoomPerson: function(id){
        $.ajax({
            url: './OfficeRDisplay/RoomMag/HandlerRoom.ashx',
            data: {
                cmd: 'getRoomPerson',
                RoomID: id
            },
            async: true,
            dataType: 'json',
            success: function (result) {
                var ret = "";
                for (var i = 0; i < result.length; i++) {
                    ret += result[i].PName + "(" + result[i].TitleName + ")";
                    ret += " ";
                }
                $('#' + id).html(ret);
            },
            error: function () {
                console.log("接口错误，请联系相关人员");
            }
        })
    },
    //表格分页html
    personDataHtml: function (data, i) {
        var status,
            num = data.RoomName,
            id = data.ID,
            html1 = "";
        

        html1 = "<tr name='" + data.ID + "'  class='cursor-p'  >" +
                    "<td class='roomIndex'>" + (i + 1) + "</td>" +
                    "<td name='" + data.UnitID + "'>" + data.UnitName + "</td>" +
                    "<td name='" + data.HouseID + "'>" + data.HouseName + "</td>" +
                    "<td name='" + data.HouseSUBID + "' floor='" + data.FloorNo + "' >" + data.HouseSUBName + "-" + data.FloorNo + "层</td>" +
                    "<td name='" + data.ID + "'>" + data.RoomName + "</td>" +
                    "<td>" + data.Area + "</td>" +
                    "<td><span id='" + data.ID + "'></span></td>" +
                    "<td>" +
                        "<button id='deleteData' class='btn btn-danger' onclick='roomMag.deleteData(this);'>删除</button>" +
                        "<button id='deleteData' name='" + data.ID + "' class='btn btn-success' onclick='roomMag.showRoomData(this);'>修改</button>" +
                    "</td>" +
                "</tr>";

        this.getRoomPerson(id);

        return html1;
    },
    deleteData: function (e) {
        var that = this;
        swal({
            title: "删除房间",
            text: "删除后房间无法还原！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是的，删除！",
            cancelButtonText: "不，取消",
            closeOnConfirm: false,
            closeOnCancel: true
        }, function(isConfirm) {
            if (isConfirm) {
                
                $.ajax({
                    url: './OfficeRDisplay/RoomMag/HandlerRoom.ashx',
                    data: { cmd: 'deleteRoomData', ID: $(e).parent().parent().attr("name") },
                    dataType: 'json',
                    success: function (result) {
                        that.deleteRoomPerson(result,$(e).parent().parent().attr("name"));
                    }
                });                      
            } else{
            }
        });
        return false;
       
    },
    deleteRoomPerson:function(result,ID){
        var that = this;
        $.ajax({
            url:'./OfficeRDisplay/RoomMag/HandlerRoom.ashx',
            data:{
                cmd:'deleteRoomPerson',
                ID: ID
            },
            dataType:'json',
            success:function(data){
                if (result == "1") {
                    swal("提示", "删除成功!", "success");
                    that.roomDataTable();
                } else {
                    swal("提示", "删除接口出现错误!", "error");

                }
            },error:function(){

            }
        })
    },
    showRoomData: function (e) {
        $("#submitEditRoom").show();
        $("#submitAddRoom").hide();
        $("#imgUpload").show();
        $("#modals").show();
        var that = this;
        var roomDataArr = that.roomData;
        //that.lastID = "";
        $("#roomDetailData tr").each(function () {
            if ($(this).hasClass('bg-gray')) {
                $(this).removeClass('bg-gray');
            }
        });
        $("#roomDetailData").find("tr[name='" + $(e).attr("name") + "']").addClass('bg-gray');
        $("#roomStatus").html("编辑");
        //获取当前点击房间数据
        var thisRoom = roomDataArr.filter(findTheRoom);
        function findTheRoom(roomDataArr) {
            return roomDataArr.ID == $(e).attr("name");
        }
        that.unitID = thisRoom[0].UnitID;
        that.buildingID = thisRoom[0].HouseID;
        that.houseSubID = thisRoom[0].HouseSUBID;
        that.floorID = thisRoom[0].FloorNo;
        that.editHouseId = thisRoom[0].ID;
        that.oldEditRoom = thisRoom[0].RoomName;
        that.multMenu(thisRoom, 0);
        $("#roomType").find("option[name='" + thisRoom[0].RoomType + "']").prop("selected", true);
        $("#roomName").val(thisRoom[0].RoomName);
        //$("#buildArea").val(parseInt(thisRoom[0].BuildArea));
        $("#standardArea").val(parseFloat(thisRoom[0].Area || 0));
        $("#roomLength").val(parseFloat(thisRoom[0].Height) || 0);
        $("#roomWidth").val(parseFloat(thisRoom[0].Width || 0));
        $("#users").val(thisRoom[0].users);
        $("#roomLength").val(thisRoom[0].Width);
        $("#roomWidth").val(thisRoom[0].Height);
        that.getImgList("theRoomImg", that.editHouseId);
        that.getImgList("theRoomPano", that.editHouseId);
        $("img[src='images/closeModal.png']").on('click', function (e) {
            $("#modals").hide();
        })
    },
    //四级菜单，默认选中第一个select框
    multMenu: function (data, index) {
        var that = this;
        //菜单数据接口以[{unit:[{unitId:1,unitName:'1'}],build:[{unitId:1,buildName:'qu',buildId:1}],houseSub:[{buildId:1,houseSubId:1,houseSubName:'1'}],floor:[{houseSubId:1,floorId:1,floorName:'1层'}]}]的形式
        $.ajax({
            url: './OfficeRDisplay/RoomMag/HandlerRoom.ashx',
            data: { cmd: 'getMultMenu' },
            dataType: 'json',
            success: function (result) {
                that.selectOptionArr = result;
                var unitHtml = "",
                    houseHtml = "",
                    houseSubHtml = "",
                    floorHtml = "";
                for (var i = 0; i < result[0].Unit.length; i++) {
                    unitHtml += "<option name='" + result[0].Unit[i].ID + "'>" + result[0].Unit[i].UnitName + "</option>"
                }
                $("#unitSearch").html("<option name='0'>全部</option>" + unitHtml);
                $("#unit").html(unitHtml);
                $("#unit option[name='" + data[index].UnitID + "']").attr("selected", "selected");
                //大楼option内容(result经过filter筛选得到)
                var buildArr = result[0].build;
                var thisBuildArr = buildArr.filter(findBuild);
                function findBuild(buildArr) {
                    return buildArr.UnitID == data[index].UnitID;
                }
                //分区option内容(result经过filter筛选得到)
                var houseSubArr = result[0].houseSub;
                var thisHouseSubArr = houseSubArr.filter(findHouseSub);
                function findHouseSub(houseSubArr) {
                    return houseSubArr.HouseID == data[index].HouseID;
                }
                //楼层option内容(result经过filter筛选得到)
                var floorArr = result[0].houseSub;
                var thisFloorArr = floorArr.filter(findFloor);
                function findFloor(floorArr) {
                    return floorArr.ID == data[index].HouseSUBID;
                }
                //分别将筛选出来的大楼，分区，楼层进行遍历
                for (var j = 0; j < thisBuildArr.length; j++) {
                    houseHtml += "<option name='" + thisBuildArr[j].ID + "'>" + thisBuildArr[j].HouseName + "</option>"
                }
                $("#buildingSearch").html("<option name='0'>全部</option>" + houseHtml);
                $("#building").html(houseHtml);
                $("#building option[name='" + data[index].HouseID + "']").attr("selected", "selected");


                for (var k = 0; k < thisHouseSubArr.length; k++) {
                    houseSubHtml += "<option name='" + thisHouseSubArr[k].ID + "'>" + thisHouseSubArr[k].HouseSUBName + "</option>"
                }
                $("#houseSubSearch").html("<option name='0'>全部</option>" + houseSubHtml);
                $("#houseSub").html(houseSubHtml);
                $("#houseSub option[name='" + data[index].HouseSUBID + "']").attr("selected", "selected");


                for (var m = 0; m < parseInt(thisFloorArr[thisFloorArr.length - 1].floor) ; m++) {
                    floorHtml += "<option name='" + (m + 1) + "'>" + (m + 1) + "</option>"
                }
                $("#floorSearch").html("<option name='0'>全部</option>" + floorHtml);
                $("#floor").html(floorHtml);
                $("#floor option[name='" + data[index].FloorNo + "']").attr("selected", "selected");
            }
        });

        //当四级菜单中某个选项发生改变时
        $("#selectGroup").find("select").on('change', function (e) {
            that.changeNextSelect(e);
        });
        $("#searchGroup select").off('change');
    },
    //四级菜单,当前三个select框发生改变时，从下一个select框内容后都会发生相应的改变
    changeNextSelect: function (e) {
        var that = this;
        //判断是哪个select发生改变，如果是第一个的话，后面三个select框的内容需要发生相应的变化；第二个的话，后面两个select框内容
        switch ($(e.target).attr("name")) {
            case "1":
                //根据select选择的option,查找下个select的内容是否存在
                var selectArr = that.selectOptionArr[0].build;
                var selectUnitArr = selectArr.filter(getUnitChangeOption);
                function getUnitChangeOption(selectArr) {
                    return selectArr.UnitID == $(e.target).find("option:selected").attr("name");
                }
                if (selectUnitArr == "") {
                    $("#building").html("");
                    $("#houseSub").html("");
                    $("#floor").html("");
                } else {
                    var houseHtml = "",
                    houseSubHtml = "",
                    floorHtml = "";
                    //大楼option内容(result经过filter筛选得到)
                    for (var j = 0; j < selectUnitArr.length; j++) {
                        houseHtml += "<option name='" + selectUnitArr[j].ID + "'>" + selectUnitArr[j].HouseName + "</option>"
                    }
                    $("#building").html(houseHtml);
                    //分区option内容(result经过filter筛选得到)
                    var houseSubArr = that.selectOptionArr[0].houseSub;
                    var thisHouseSubArr = houseSubArr.filter(findHouseSub);
                    function findHouseSub(houseSubArr) {
                        return houseSubArr.HouseID == selectUnitArr[0].ID;
                    }
                    for (var k = 0; k < thisHouseSubArr.length; k++) {
                        houseSubHtml += "<option name='" + thisHouseSubArr[k].ID + "'>" + thisHouseSubArr[k].HouseSUBName + "</option>"
                    }
                    $("#houseSub").html(houseSubHtml);
                    console.log(thisHouseSubArr);
                    //楼层option内容(result经过filter筛选得到)
                    var floorArr = that.selectOptionArr[0].houseSub;
                    var thisFloorArr = floorArr.filter(findFloor);
                    function findFloor(floorArr) {
                        return floorArr.ID == thisHouseSubArr[0].ID;
                    }
                    for (var m = 0; m < thisFloorArr[thisFloorArr.length - 1].floor; m++) {
                        floorHtml += "<option name='" + (m + 1) + "'>" + (m + 1) + "</option>"
                    }
                    $("#floor").html(floorHtml);
                }
                break;
            case "2":
                //根据select选择的option,查找下个select的内容是否存在
                var selectArr = that.selectOptionArr[0].houseSub;
                var selectHouseArr = selectArr.filter(getHouseChangeOption);
                function getHouseChangeOption(selectArr) {
                    return selectArr.HouseID == $(e.target).find("option:selected").attr("name");
                }
                if (selectHouseArr == "") {
                    $("#houseSub").html("");
                    $("#floor").html("");
                } else {
                    var houseSubHtml = "",
                    floorHtml = "";
                    //分区option内容(result经过filter筛选得到)
                    for (var j = 0; j < selectHouseArr.length; j++) {
                        houseSubHtml += "<option name='" + selectHouseArr[j].ID + "'>" + selectHouseArr[j].HouseSUBName + "</option>"
                    }
                    $("#houseSub").html(houseSubHtml);
                    //楼层option内容(result经过filter筛选得到)
                    var floorArr = that.selectOptionArr[0].houseSub;
                    var thisFloorArr = floorArr.filter(findFloor);
                    function findFloor(floorArr) {
                        return floorArr.ID == selectHouseArr[0].ID;
                    }
                    for (var m = 0; m < thisFloorArr[thisFloorArr.length - 1].floor; m++) {
                        floorHtml += "<option name='" + (m + 1) + "'>" + (m + 1) + "</option>"
                    }
                    $("#floor").html(floorHtml);
                }
                break;
            case "3":
                //根据select选择的option,查找下个select的内容是否存在
                var selectArr = that.selectOptionArr[0].houseSub;
                var selectHouseSubArr = selectArr.filter(getHouseSubChangeOption);
                function getHouseSubChangeOption(selectArr) {
                    return selectArr.ID == $(e.target).find("option:selected").attr("name");
                }
                if (selectHouseSubArr == "") {
                    $("#floor").html("");
                } else {
                    var floorHtml = "";
                    //分区option内容(result经过filter筛选得到)
                    console.log(selectHouseSubArr);
                    for (var j = 0; j < parseInt(selectHouseSubArr[selectHouseSubArr.length - 1].floor) ; j++) {
                        floorHtml += "<option name='" + (j + 1) + "'>" + (j + 1) + "</option>"
                    }
                    $("#floor").html(floorHtml);
                }
                break;
        }
    },
    EditRoomData: function () {
        var that = this,

            Area = $("#standardArea").val(),
            Users = $("#users").val(),
            //BuildArea = $("#buildArea").val(),
            FloorNo = $("#floor").val(),
            Width = $("#roomWidth").val() || 0,
            Height = $("#roomLength").val() || 0,
            HouseID = $("#building").find("option:selected").attr("name"),
            HouseSUBID = $("#houseSub").find("option:selected").attr("name"),
            RoomName = $("#roomName").val(),
            RoomType = $("#roomType").find("option:selected").attr("name"),
            UnitID = $("#unit").find("option:selected").attr("name");
        let ifRoomName = new Promise((resolve,reject)=>{
            $.ajax({
                url:'./OfficeRDisplay/RoomMag/HandlerRoom.ashx',
                type:'post',
                data:{
                    cmd:'testRoomName',
                    oldRoomName:that.oldEditRoom,
                    roomName:RoomName,
                    HouseID:HouseID
                },
                dataType:'json',
                success:function(data){
                    console.log(data);
                    if(data.length==0){
                        resolve(data);
                        
                    }else{
                        swal("提示", "办公楼内不允许存在相同房间号，请更换房间号!", "error");
                    }
                    
                },
                error:function(e){
                    console.log("接口出现问题，请联系相关开发人员");
                    reject(e);
                }
            })
        });
        let updateRoomData = ifRoomName.then(function(value){
            $.ajax({
                url: './OfficeRDisplay/RoomMag/HandlerRoom.ashx',
                type: 'post',
                data: {
                    cmd: 'editRoomData',

                    RoomID: that.editHouseId,
                    Area: Area,
                    Users:Users,
                    FloorNo: FloorNo,
                    Width: Width,
                    Height: Height,
                    HouseID: HouseID,
                    HouseSUBID: HouseSUBID,
                    RoomName: RoomName,
                    RoomType: RoomType,
                    UnitID: UnitID
                },
                dataType: 'json',
                success: function (result) {

                    if (result == "1") {


                        //alert("保存成功");
                        that.roomDataTable();
                        $("#modals").hide();
                        swal("提示", "修改成功", "success");
                    } else {
                        $("#modals").hide();
                        swal("提示", "接口错误", "error");
                    }
                },
                error: function () {
                    console.log("接口错误，请联系相关开发人员")
                }
            })
        })
        
    },
    AddRoomData: function () {
        var that = this,
            Area = $("#standardArea").val(),
            Users = $("#users").val(),
            //BuildArea = $("#buildArea").val(),
            FloorNo = $("#floor").val(),
            Width = $("#roomWidth").val() || 0,
            Height = $("#roomLength").val() || 0,
            HouseID = $("#building").find("option:selected").attr("name"),
            HouseSUBID = $("#houseSub").find("option:selected").attr("name"),
            RoomName = $("#roomName").val(),
            RoomType = $("#roomType").find("option:selected").attr("name"),
            UnitID = $("#unit").find("option:selected").attr("name");
        let ifRoomName = new Promise((resolve,reject)=>{
            $.ajax({
                url:'./OfficeRDisplay/RoomMag/HandlerRoom.ashx',
                data:{
                    cmd:'testRoomName',
                    roomName:RoomName,
                    HouseID:HouseID
                },
                dataType:'json',
                success:function(data){
                    console.log(data);
                    if(data.length==0){
                        resolve(data)
                    }else{
                        swal("提示", "办公楼内不允许存在相同房间号，请更换房间号!", "error");
                    }
                },
                error:function(){
                    console.log("接口错误，请联系相关开发人员");
                }
            })
        });
        ifRoomName.then(function(value){
            $.ajax({
                url: './OfficeRDisplay/RoomMag/HandlerRoom.ashx',
                data: {
                    cmd: 'addRoomData',
                    Area: Area,
                    Users:Users,
                    FloorNo: FloorNo,
                    Width: Width,
                    Height: Height,
                    HouseID: HouseID,
                    HouseSUBID: HouseSUBID,
                    RoomName: RoomName,
                    RoomType: RoomType,
                    UnitID: UnitID
                },
                dataType: 'json',
                success: function (result) {
                    console.log(result);
                    if (result == "1") {
                        swal("提示", "添加房间成功", "success");
                        that.roomDataTable();
                        $("#modals").hide();

                    } else {
                        swal("提示", "房间接口出现错误", "error");
                    }
                },
                error: function (e) {
                    console.log("接口出错，请联系相关人员");
                }
            })
        })
    },
    getImgList: function (imgType, roomID) {
        $.ajax({
            url: './OfficeRDisplay/RoomMag/HandlerRoom.ashx',
            data: { cmd: 'getRoomImg', roomID: roomID, imgType: imgType },
            dataType: 'json',
            success: function (result) {
                if (result.length == 0) {
                    if (imgType == "theRoomImg") {
                        $("#" + imgType).html("当前房间无图片");
                    } else {
                        $("#" + imgType).html("当前房间无全景图片");
                    }

                } else {
                    var html = "<ul>";
                    if (imgType == "theRoomImg") {

                        for (var i = 0; i < result.length; i++) {
                            html += "<li><img src='" + result[i].ImgPath + "' class='img' onclick = 'roomMag.watchImg(this)' />" +
                                "<img src='images/delete.svg' class='delete'  name='" + result[i].ID + "' roomID='" + roomID + "' onclick='roomMag.deleteImg(this)' TYPE='" + imgType + "'/></li>";

                        }
                    } else {
                        for (var i = 0; i < result.length; i++) {
                            html += "<li><img src='" + result[i].ImgPath + "' onclick='roomMag.getPano(this)' class='img' id='swiper-wrapper' />" +
                                "<img src='images/delete.svg' class='delete' onclick='roomMag.deleteImg(this)' roomID='" + roomID + "'  name='" + result[i].ID + "' TYPE='" + imgType + "'/></li>"
                        }
                    }
                    html += "</ul>";
                    $("#" + imgType).html(html);

                }
            },
            error: function (e) {
                console.log("图片怎么不见了(╯°Д°)╯");
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
    getPano: function (e) {
        $("#originImgDiv1").show();
        var panorama = new panorama_cxy();
        panorama.init('originalImg1', $(e).attr("src"));
        panorama.setAutorun(true);
        $("img[src='images/close.svg']").on('click', function () {
            $("#originImgDiv1").hide();
        });
    },
    deleteImg: function (e) {
        var that = this;
        var imgID = $(e).attr("name");
        var roomID = $(e).attr("roomID");
        var imgType = $(e).attr("TYPE");
        $.ajax({
            url: './OfficeRDisplay/RoomMag/HandlerRoom.ashx',
            data: { cmd: 'deleteImg', ID: imgID },
            dataType: 'json',
            success: function (result) {
                if (result === true) {
                    swal("提示", "删除图片成功", "success");
                    that.getImgList(imgType, roomID);
                }
            }, error: function (e) {
                console.log("删除图片失败了，还是去问问相关开发人员吧");
            }
        })
    }
}