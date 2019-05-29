function _houseMag() {
    //初始单位ID为空
    this.unitID = "";
    this.currentPage = 1;
}
_houseMag.prototype = {
    init: function () {
        var that = this;
        that.unitID = "";
        $("#modals").hide();
        $("#searchHouseName").off('click');
        that.houseDataTable();
        that.currentPage = 1;
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
                that.getHouseOption1(data[0].ID);
            },
            error:function(e){
                console.log("接口错误");
            }
        });
        //通过楼房名搜索楼房
        $("#searchHouseName").on('click', function (e) {
            var houseName = $("#inputHouseName").val();
            $.ajax({
                url: './OfficeRDisplay/houseMag/HandlerHouse.ashx',
                data: {
                    cmd: 'houseDataTable',
                    HouseName: houseName,
                    UnitID:$("#unitSelect").find("option:selected").attr("name"),
                    HouseID:$("#houseSelect").find("option:selected").attr("name")
                },
                dataType: 'json',
                success: function (data) {
                    that.currentPage = 1;
                    that.dealResult(data);
                }
            })
        });
        //修改后点击确定按钮（提交）
        $("#submitEditHouse").off('click');
        $("#submitEditHouse").on('click', function (e) {
            swal({
                title: "",
                text: "确定修改楼房信息？",
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
                    var area = $("#area").val(),
                        startTime = $("#startTime").val(),
                        completeTime = $("#completeTime").val(),
                        houseName = $("#houseName").val();
                   
                    if ($("#houseName").val() == "" || regNoVal.test($("#houseName").val())) {
                        swal("提示", "楼房名不能为空", "error");
                        $("#houseName").addClass("border-red");
                        return false;
                    } else if ($("#area").val() == "" || regNoVal.test($("#area").val()) || !reg.test($("#area").val())) {
                        swal("提示", "楼房面积只能为非负整数", "error");
                        $("#area").addClass("border-red");
                        return false;
                    }  else {
                        
                        that.EditHouseData($(e.target).attr("name"));
                        $("#houseName").removeClass("border-red");
                        $("#area").removeClass("border-red");
                        
                        return false;//防止页面强制刷新
                    }                      
                } else{
                    
                }
            });
            return false;
        });
        //新增楼房点击确定按钮
        $("#submitAddHouse").off('click');
        $("#submitAddHouse").on('click', function (e) {
            swal({
                title: "",
                text: "确定增加该楼房？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    var reg = /^\d+(\.\d+)?$/;   //非负整数正则表达式
                    var regNoVal = /^\s*$/g;      //空值正则表达式
                    var area = $("#area").val(),
                         startTime = $("#startTime").val(),
                         completeTime = $("#completeTime").val(),
                         houseName = $("#houseName").val();
                    //console.log("楼房名为："+HouseName+"楼房面积为："+Area +"楼房长："+Height+"楼房宽："+Width);
                    if (houseName == "" || regNoVal.test(houseName)) {
                        swal("提示", "楼房号不能为空", "error");
                        $("#houseName").addClass("border-red");
                        return false;
                    } else if (area == "" || regNoVal.test(area) || !reg.test(area)) {
                        swal("提示", "楼房面积只能为非负整数", "error");
                        $("#standardArea").addClass("border-red");
                        return false;
                    } else {
                        that.addHouseData();
                        $("#houseName").removeClass("border-red");
                        $("#area").removeClass("border-red");
   
                        return false;//防止页面强制刷新
                    }
                } else {

                }
            });
            return false;

        });

        //新增楼房功能（点击新增按钮）
        $("#addData[name='House']").on('click', function (e) {
            $("#submitEditHouse").hide();
            $("#submitAddHouse").show();
            $("#modals").show();
            $("#detailMsg").show();
            that.editHouseId = "";
            $("#HouseType option").each(function () {
                $(this).removeAttr("selected");
            });
            $("#houseStatus").html("新增");
            $("#houseName").val("");
            $("#area").val("");
            $("#startTime").val(common.formatTime(new Date()));
            $("#completeTime").val(common.formatTime(new Date()));
            $("#houseInfo").val("");
            $("img[src='images/closeModal.png']").on('click', function () {
                $("#modals").hide();
            });
            that.setDateTimePicker();
        });
    },
    getHouseOption1:function(unitID){
        var that = this;
        if(unitID==""){
            $("#houseSelect").html("<option name=''>全部</option>");
            $("#unitSelect").on('change',function(e){
                that.getHouseOption1($("#unitSelect").find("option:selected").attr("name"));
            });
            return;
        }
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
                $("#unitSelect").off('change');
                $("#unitSelect").on('change',function(e){
                    that.getHouseOption1($("#unitSelect").find("option:selected").attr("name"));
                });
            },
            error:function(e){
                console.log("接口错误");
            }
        });
    },
    //1.将每栋大楼的数据都显示出来2018-6-14 wf
    houseDataTable: function () {
        var that = this;
        $.ajax({
            url: './OfficeRDisplay/houseMag/HandlerHouse.ashx',
            data: {
                cmd: 'houseDataTable'
            },
            dataType: 'json',
            success: function (result) {
                that.editHouseId = result[0].ID;
                $("#houseName").val(result[0].HouseName);
                $("#area").val(parseFloat(result[0].area));
                $("#startTime").val(result[0].StartTime);
                $("#completeTime").val(result[0].CompleteTime);
                $("#houseInfo").val(result[0].Info);
                $("#unit").val(result[0].UnitName);
                that.houseData = result;
                that.oldEditHouse = result[0].HouseName;
                //四级select菜单
                that.multMenu(result, 0);
                that.dealResult(result);
                that.setDateTimePicker();
            },
            error: function () {
                console.log("接口错误，请联系相关人员");
            }
        })
    },
    dealResult: function (result) {
        if (result.length === 0) {
            $("#houseDetailData").html("暂无数据");
            $("#paginationDiv").hide();
            $("#detailMsg").hide();
            return
        } else {
            $("#paginationDiv").show();
            $("#detailMsg").show();
            var that = this,
            totalPage = Math.ceil(result.length / 10);//总页数
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
                    $('#houseDetailData').html(that.pagination(result, num, totalPage));
                    $("#houseDetailData tr:nth-child(" + 1 + ")").addClass('bg-gray');
                }
            });
            //跳页功能
            $("#getIndexData").off('click');
            $("#getIndexData").on('click', function () {
                that.currentPage = parseInt($("#num").val());
                if (that.currentPage > totalPage) {
                    that.currentPage = totalPage;
                    $("#num").val(totalPage);
                }

                $.jqPaginator('#pagination', {
                    totalPages: totalPage,
                    visiblePages: 4,
                    currentPage: that.currentPage || 1,
                    prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
                    next: '<li class="next"><a href="javascript:;">下一页</a></li>',
                    page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                    onPageChange: function (num) {
                        that.currentPage = num;
                        $('#houseDetailData').html(that.pagination(result, num, totalPage));
                        $("#houseDetailData tr:nth-child(" + 1 + ")").addClass('bg-gray');

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
    //表格分页html
    personDataHtml: function (data, i) {
        var status,
            num = data.HouseName,
            id = data.ID,
            html1 = "";
        //"<button id='deleteData' class='btn btn-danger' onclick='houseMag.deleteData(this);'>删除</button>" +

        html1 = "<tr name='" + data.ID + "'  class='cursor-p'  >" +
                    "<td class='houseIndex'>" + (i + 1) + "</td>" +
                    "<td name='" + data.UnitID + "'>" + data.UnitName + "</td>" +
                    "<td name='" + data.HouseID + "'>" + data.HouseName + "</td>" +
                    "<td>" + data.StartTime + "</td>" +
                    "<td>" + data.CompleteTime + "</td>" +
                    "<td>" + data.area + "</td>" +
                    "<td title='"+ data.Info +"'>" + data.Info +"</td>" +
                    "<td>" +
                        
                        "<button id='deleteData' name='" + data.ID + "' class='btn btn-success' onclick='houseMag.showHouseData(this);'>修改</button>" +
                    "</td>" +
                "</tr>";

        return html1;
    },
    deleteData: function (e) {
        //var that = this;
        //swal({
        //    title: "删除楼房",
        //    text: "删除后楼房无法还原！",
        //    type: "warning",
        //    showCancelButton: true,
        //    confirmButtonColor: "#DD6B55",
        //    confirmButtonText: "是的，删除！",
        //    cancelButtonText: "不，取消",
        //    closeOnConfirm: false,
        //    closeOnCancel: true
        //}, function (isConfirm) {
        //    if (isConfirm) {

        //        $.ajax({
        //            url: './OfficeRDisplay/HouseMag/HandlerHouse.ashx',
        //            data: { cmd: 'deleteHouseData', ID: $(e).parent().parent().attr("name") },
        //            dataType: 'json',
        //            success: function (result) {
        //                that.deleteHouse(result, $(e).parent().parent().attr("name"));
        //            }
        //        });
        //    } else {
        //    }
        //});
        //return false;

    },
    showHouseData: function (e) {
        $("#submitEditHouse").show();
        $("#submitAddHouse").hide();
        $("#modals").show();
        var that = this;
        var houseDataArr = that.houseData;
        //that.lastID = "";
        $("#houseDetailData tr").each(function () {
            if ($(this).hasClass('bg-gray')) {
                $(this).removeClass('bg-gray');
            }
        });
        $("#houseDetailData").find("tr[name='" + $(e).attr("name") + "']").addClass('bg-gray');
        $("#houseStatus").html("编辑");
        //获取当前点击房间数据
        var thisHouse = houseDataArr.filter(findTheHouse);
        function findTheHouse(houseDataArr) {
            return houseDataArr.ID == $(e).attr("name");
        }
        that.unitID = thisHouse[0].UnitID;
        that.editHouseId = thisHouse[0].ID;
        that.oldEditHouse = thisHouse[0].HouseName;
        that.multMenu(thisHouse, 0);
        $("#houseName").val(thisHouse[0].HouseName);
        //$("#buildArea").val(parseInt(thisHouse[0].BuildArea));
        $("#area").val(parseFloat(thisHouse[0].area || 0));
        $("#startTime").val(thisHouse[0].StartTime);
        $("#completeTime").val(thisHouse[0].CompleteTime);
        $("#houseInfo").val(thisHouse[0].Info);
        $("img[src='images/closeModal.png']").on('click', function (e) {
            $("#modals").hide();
        })
    },
    multMenu: function (result) {
        var that = this;
        $.ajax({
            url: './OfficeRDisplay/houseMag/HandlerHouse.ashx',
            data: {
                cmd: 'getUnitOption'
            },
            dataType: 'json',
            success: function (data) {
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    html += "<option name='"+ data[i].ID +"'>"+ data[i].UnitName +"</option>";
                }
                $("#unit").html(html);
                $("#unit").val(result[0].UnitName);
            }
        })
    },
    EditHouseData: function () {
        var that = this,
            area = $("#area").val(),
            startTime = $("#startTime").val(),
            completeTime = $("#completeTime").val(),
            HouseName = $("#houseName").val(),
            UnitID = $("#unit").find("option:selected").attr("name"),
            info = $("#houseInfo").val();
        //判断单元内是否有重名大楼，有则出现提示，没有则保存到数据库
        let ifHouseName = new Promise((resolve,reject)=>{
            $.ajax({
                url:'./OfficeRDisplay/houseMag/HandlerHouse.ashx',
                type:'post',
                data:{
                    cmd:'testHouseName',
                    oldHouseName:that.oldEditHouse,
                    houseName:HouseName,
                    UnitID:UnitID
                },
                dataType:'json',
                success:function(data){
                    if(data.length==0){
                        resolve(data);
                        
                    }else{
                        swal("提示", "单位内不允许存在同名楼房，请更换楼房名称!", "error");
                    }
                },
                error:function(e){
                    console.log("接口出现问题，请联系相关开发人员");
                    reject(e);
                }
            })
        });
        let updateHouseData = ifHouseName.then(function(value){
            $.ajax({
                url: './OfficeRDisplay/houseMag/HandlerHouse.ashx',
                type: 'post',
                data: {
                    cmd: 'editHouseData',
                    HouseID: that.editHouseId,
                    Area: area,
                    HouseName: HouseName,
                    startTime: startTime,
                    completeTime: completeTime,
                    UnitID: UnitID,
                    info:info
                },
                dataType: 'json',
                success: function (result) {
                    if (result == "1") {
                        //alert("保存成功");
                        that.houseDataTable();
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
    addHouseData: function () {
        var that = this,
            area = $("#area").val(),
            startTime = $("#startTime").val(),
            completeTime = $("#completeTime").val(),
            HouseName = $("#houseName").val(),
            UnitID = $("#unit").find("option:selected").attr("name"),
            info = $("#houseInfo").val();
        let ifHouseName = new Promise((resolve,reject)=>{
            $.ajax({
                url:'./OfficeRDisplay/HouseMag/HandlerHouse.ashx',
                data:{
                    cmd:'testHouseName',
                    houseName:HouseName,
                    UnitID:UnitID
                },
                dataType:'json',
                success:function(data){
                    console.log(data);
                    if(data.length==0){
                        resolve(data)
                    }else{
                        swal("提示", "单位内不允许出现同名楼房，请更换楼房名称!", "error");
                    }
                },
                error:function(){
                    console.log("接口错误，请联系相关开发人员");
                }
            })
        });
        ifHouseName.then(function(value){
            $.ajax({
                url: './OfficeRDisplay/HouseMag/HandlerHouse.ashx',
                data: {
                    cmd: 'addHouseData',
                    Area: area,
                    HouseName: HouseName,
                    startTime: startTime,
                    completeTime: completeTime,
                    UnitID: UnitID,
                    info:info
                },
                dataType: 'json',
                success: function (result) {
                    console.log(result);
                    if (result == "1") {
                        swal("提示", "添加楼房成功", "success");
                        that.houseDataTable();
                        $("#modals").hide();

                    } else {
                        swal("提示", "楼房接口出现错误", "error");
                    }
                },
                error: function (e) {
                    console.log("接口出错，请联系相关人员");
                }
            })
        })
    },
    setDateTimePicker:function(){

        $("#startTime").datetimepicker({
            formatter:'yyyy-mm-dd',
            minView:2,
            autoclose: true
        }).on('changeDate',function(){
            var startTime =  $("#startTime").val();
            $("#completeTime").datetimepicker('setStartDate',startTime);
        });
        $("#startTime").datetimepicker('setEndDate',$("#completeTime").val());
        
        $("#completeTime").datetimepicker({
            formatter:'yyyy-mm-dd',
            minView:2,
            autoclose: true
        }).on('changeDate',function(){
            var completeTime =  $("#completeTime").val();
            $("#startTime").datetimepicker('setEndDate',completeTime);
        });
        $("#completeTime").datetimepicker('setStartDate',$("#startTime").val());
    }
};
