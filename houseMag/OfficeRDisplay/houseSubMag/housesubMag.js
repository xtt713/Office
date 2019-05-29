function _housesubMag() {
    //初始单位ID为空
    this.unitID = "";
    this.currentPage = 1;
}
_housesubMag.prototype = {
    init: function () {
        var that = this;
        that.unitID = "";
        $("#modals").hide();
        $("#searchHouseSubName").off('click');
        that.housesubDataTable();
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
        $("#searchHouseSubName").on('click', function (e) {
            var housesubName = $("#inputHouseSubName").val();
            $.ajax({
                url: './OfficeRDisplay/houseSubMag/HandlerHouseSub.ashx',
                data: {
                    cmd: 'housesubDataTable',
                    HouseSubName: housesubName,
                    UnitID:$("#unitSelect").find("option:selected").attr("name"),
                    HouseID:$("#houseSelect").find("option:selected").attr("name"),
                    HouseSubID:$("#housesubSelect").find("option:selected").attr("name")
                },
                dataType: 'json',
                success: function (data) {
                    that.currentPage = 1;
                    that.dealResult(data);
                }
            });
        });
        //修改后点击确定按钮（提交）
        $("#submitEditHouseSub").off('click');
        $("#submitEditHouseSub").on('click', function (e) {
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
                    var reg = /^\d+(\.\d+)?$/;
                    var regNoVal = /^\s*$/g;      //空值正则表达式
                    var area = $("#area").val(),
                        startTime = $("#startTime").val(),
                        completeTime = $("#completeTime").val(),
                        housesubName = $("#housesubName").val();
                        floorNo = $("#floorNo").val();
                    if ($("#housesubName").val() == "" || regNoVal.test($("#housesubName").val())) {
                        swal("提示", "楼房名不能为空", "error");
                        $("#housesubName").addClass("border-red");
                        return false;
                    } else if ($("#area").val() == "" || regNoVal.test($("#area").val()) || !reg.test($("#area").val())) {
                        swal("提示", "楼房面积只能为非负整数", "error");
                        $("#area").addClass("border-red");
                        return false;
                    } else if ($("#floorNo").val() == "" || regNoVal.test($("#floorNo").val()) || !reg.test($("#floorNo").val())) {
                        swal("提示", "楼层只能为非负整数", "error");
                        $("#floorNo").addClass("border-red");
                        return false;
                    }   
                    else {
                        that.EditHouseSubData();
                        $("#housesubName").removeClass("border-red");
                        $("#area").removeClass("border-red");
                        return false;//防止页面强制刷新
                    }                      
                } else{
                    
                }
            });
            return false;
        });
        //新增楼房点击确定按钮
        $("#submitAddHouseSub").off('click');
        $("#submitAddHouseSub").on('click', function (e) {
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
                         housesubName = $("#housesubName").val();
                    //console.log("楼房名为："+HouseSubName+"楼房面积为："+Area +"楼房长："+Height+"楼房宽："+Width);
                    if (housesubName == "" || regNoVal.test(housesubName)) {
                        swal("提示", "楼房号不能为空", "error");
                        $("#housesubName").addClass("border-red");
                        return false;
                    } else if (area == "" || regNoVal.test(area) || !reg.test(area)) {
                        swal("提示", "楼房面积只能为非负整数", "error");
                        $("#standardArea").addClass("border-red");
                        return false;
                    } else {
                        that.addHouseSubData();
                        $("#housesubName").removeClass("border-red");
                        $("#area").removeClass("border-red");
   
                        return false;//防止页面强制刷新
                    }
                } else {

                }
            });
            return false;

        });

        //新增楼房功能（点击新增按钮）
        $("#addData[name='HouseSub']").on('click', function (e) {
            $("#submitEditHouseSub").hide();
            $("#submitAddHouseSub").show();
            $("#modals").show();
            $("#detailMsg").show();
            that.editHouseSubId = "";
            $("#HouseSubType option").each(function () {
                $(this).removeAttr("selected");
            });
            $("#housesubStatus").html("新增");
            $("#housesubName").val("");
            $("#area").val("");
            $("#startTime").val(common.formatTime(new Date()));
            $("#completeTime").val(common.formatTime(new Date()));
            $("#floorNo").val("");
            $("img[src='images/closeModal.png']").on('click', function () {
                $("#modals").hide();
            });
            that.setDateTimePicker();
        });
    },
    getHouseOption1:function(unitID){
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
                
                that.getHouseSubOption1(data[0].ID);
               
            },
            error:function(e){
                console.log("接口错误");
            }
        });
    },
    getHouseSubOption1:function(houseID){
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
                $("#unitSelect").off('change');
                $("#unitSelect").on('change',function(e){
                    that.getHouseOption1($("#unitSelect").find("option:selected").attr("name"));
                });
                $("#houseSelect").off('change');
                $("#houseSelect").on('change',function(e){
                    that.getHouseSubOption1($("#houseSelect").find("option:selected").attr("name"));
                });

            },
            error:function(e){
                console.log("接口错误");
            }
        });
    },
    //1.将每栋大楼的数据都显示出来2018-6-14 wf
    housesubDataTable: function () {
        var that = this;
        $.ajax({
            url: './OfficeRDisplay/housesubMag/HandlerHouseSub.ashx',
            data: {
                cmd: 'housesubDataTable'
            },
            dataType: 'json',
            success: function (result) {
                that.editHouseSubId = result[0].ID;
                $("#housesubName").val(result[0].HouseSubName);
                $("#area").val(parseFloat(result[0].area));
                $("#startTime").val(result[0].StartTime);
                $("#completeTime").val(result[0].CompleteTime);
                $("#housesubInfo").val(result[0].Info);
                $("#unit").val(result[0].UnitName);
                that.housesubData = result;
                that.oldEditHouseSub = result[0].HouseSubName;
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
            $("#housesubDetailData").html("暂无数据");
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
                    $('#housesubDetailData').html(that.pagination(result, num, totalPage));
                    $("#housesubDetailData tr:nth-child(" + 1 + ")").addClass('bg-gray');
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
                        $('#housesubDetailData').html(that.pagination(result, num, totalPage));
                        $("#housesubDetailData tr:nth-child(" + 1 + ")").addClass('bg-gray');

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
            num = data.HouseSUBName,
            id = data.ID,
            html1 = "";
        //"<button id='deleteData' class='btn btn-danger' onclick='housesubMag.deleteData(this);'>删除</button>" +

        html1 = "<tr name='" + data.ID + "'  class='cursor-p'  >" +
                    "<td class='housesubIndex'>" + (i + 1) + "</td>" +
                    "<td>" + data.UnitName + "</td>" +
                    "<td>" + data.HouseName + "</td>" +
                    "<td name='" + data.ID + "'>" + data.HouseSUBName + "</td>" +
                    "<td>" + data.StartTime + "</td>" +
                    "<td>" + data.CompleteTime + "</td>" +
                    "<td>" + data.area + "</td>" +
                    "<td title='"+ data.floor +"'>" + data.floor +"</td>" +
                    "<td>" +
                        
                        "<button id='deleteData' name='" + data.ID + "' class='btn btn-success' onclick='housesubMag.showHouseSubData(this);'>修改</button>" +
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
        //            url: './OfficeRDisplay/HouseSubMag/HandlerHouseSub.ashx',
        //            data: { cmd: 'deleteHouseSubData', ID: $(e).parent().parent().attr("name") },
        //            dataType: 'json',
        //            success: function (result) {
        //                that.deleteHouseSub(result, $(e).parent().parent().attr("name"));
        //            }
        //        });
        //    } else {
        //    }
        //});
        //return false;

    },
    showHouseSubData: function (e) {
        $("#submitEditHouseSub").show();
        $("#submitAddHouseSub").hide();
        $("#modals").show();
        var that = this;
        var housesubDataArr = that.housesubData;
        //that.lastID = "";
        $("#housesubDetailData tr").each(function () {
            if ($(this).hasClass('bg-gray')) {
                $(this).removeClass('bg-gray');
            }
        });
        $("#housesubDetailData").find("tr[name='" + $(e).attr("name") + "']").addClass('bg-gray');
        $("#housesubStatus").html("编辑");
        //获取当前点击房间数据
        var thisHouseSub = housesubDataArr.filter(findTheHouseSub);
        function findTheHouseSub(housesubDataArr) {
            return housesubDataArr.ID == $(e).attr("name");
        }
        that.unitID = thisHouseSub[0].UnitID;
        that.editHouseSubId = thisHouseSub[0].ID;
        that.oldEditHouseSub = thisHouseSub[0].HouseSUBName;
        that.multMenu(thisHouseSub, 0);
        $("#housesubName").val(thisHouseSub[0].HouseSUBName);
        //$("#buildArea").val(parseInt(thisHouseSub[0].BuildArea));
        $("#area").val(parseFloat(thisHouseSub[0].area || 0));
        $("#startTime").val(thisHouseSub[0].StartTime);
        $("#completeTime").val(thisHouseSub[0].CompleteTime);
        $("#floorNo").val(thisHouseSub[0].floor);
        $("img[src='images/closeModal.png']").on('click', function (e) {
            $("#modals").hide();
        });
    },
    multMenu: function (result) {
        var that = this;
        $.ajax({
            url: './OfficeRDisplay/housesubMag/HandlerHouseSub.ashx',
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
                var unitID = $("#unit").find("option:selected").attr("name");
                that.getHouseOption(unitID);
                $("#unit").off('change');
                $("#unit").on('change',function(){
                    unitID = $("#unit").find("option:selected").attr("name");
                    that.getHouseOption(unitID);
                });
            }
        });
       
    },
    getHouseOption:function(unitID){
        $.ajax({
            url: './OfficeRDisplay/housesubMag/HandlerHouseSub.ashx',
            data: {
                cmd: 'getHouseOption',
                unitID:unitID
            },
            dataType: 'json',
            success: function (data) {
                var html1 = "";
                for (var i = 0; i < data.length; i++) {
                    html1 += "<option name='"+ data[i].ID +"'>"+ data[i].HouseName +"</option>";
                }
                $("#house").html(html1);
                $("#house").val(data[0].HouseName);
            }
        });
    },
    EditHouseSubData: function () {
        var that = this,
            area = $("#area").val(),
            startTime = $("#startTime").val(),
            completeTime = $("#completeTime").val(),
            HouseSubName = $("#housesubName").val(),
            HouseID = $("#house").find("option:selected").attr("name"),
            UnitID = $("#unit").find("option:selected").attr("name"),
            floorNo = $("#floorNo").val();
        //判断单元内是否有重名大楼，有则出现提示，没有则保存到数据库
        let ifHouseSubName = new Promise((resolve,reject)=>{
            $.ajax({
                url:'./OfficeRDisplay/housesubMag/HandlerHouseSub.ashx',
                type:'post',
                data:{
                    cmd:'testHouseSubName',
                    oldHouseSubName:that.oldEditHouseSub,
                    housesubName:HouseSubName,
                    HouseID:HouseID
                },
                dataType:'json',
                success:function(data){
                    if(data.length==0){
                        resolve(data);
                        
                    }else{
                        swal("提示", "楼房内不允许有同名分区，请更换分区名称!", "error");
                    }
                },
                error:function(e){
                    console.log("接口出现问题，请联系相关开发人员");
                    reject(e);
                }
            })
        });
        let updateHouseSubData = ifHouseSubName.then(function(value){
            $.ajax({
                url: './OfficeRDisplay/housesubMag/HandlerHouseSub.ashx',
                type: 'post',
                data: {
                    cmd: 'editHouseSubData',
                    HouseSubID: that.editHouseSubId,
                    Area: area,
                    HouseSubName: HouseSubName,
                    startTime: startTime,
                    completeTime: completeTime,
                    HouseID: HouseID,
                    floorNo:floorNo
                },
                dataType: 'json',
                success: function (result) {
                    if (result == "1") {
                        //alert("保存成功");
                        that.housesubDataTable();
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
    addHouseSubData: function () {
        var that = this,
            area = $("#area").val(),
            startTime = $("#startTime").val(),
            completeTime = $("#completeTime").val(),
            HouseSubName = $("#housesubName").val(),
            HouseID = $("#house").find("option:selected").attr("name"),
            floorNo = $("#floorNo").val();
        let ifHouseSubName = new Promise((resolve,reject)=>{
            $.ajax({
                url:'./OfficeRDisplay/HouseSubMag/HandlerHouseSub.ashx',
                data:{
                    cmd:'testHouseSubName',
                    housesubName:HouseSubName,
                    HouseID:HouseID
                },
                dataType:'json',
                success:function(data){
                    console.log(data);
                    if(data.length==0){
                        resolve(data)
                    }else{
                        swal("提示", "楼房内不允许有同名分区，请更换分区名称!", "error");
                    }
                },
                error:function(){
                    console.log("接口错误，请联系相关开发人员");
                }
            })
        });
        ifHouseSubName.then(function(value){
            $.ajax({
                url: './OfficeRDisplay/HouseSubMag/HandlerHouseSub.ashx',
                data: {
                    cmd: 'addHouseSubData',
                    Area: area,
                    HouseSubName: HouseSubName,
                    startTime: startTime,
                    completeTime: completeTime,
                    HouseID: HouseID,
                    floorNo:floorNo
                },
                dataType: 'json',
                success: function (result) {
                    console.log(result);
                    if (result == "1") {
                        swal("提示", "添加分区成功", "success");
                        that.housesubDataTable();
                        $("#modals").hide();

                    } else {
                        swal("提示", "分区接口出现错误", "error");
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
