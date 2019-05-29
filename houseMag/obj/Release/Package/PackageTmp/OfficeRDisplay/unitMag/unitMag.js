function _unitMag() {
    //初始单位ID为空
    this.unitID = "";
    this.currentPage = 1;
}
_unitMag.prototype = {
    init: function () {
        var that = this;
        that.unitID = "";
        $("#modals").hide();
        $("#searchUnitName").off('click');
        that.unitDataTable();
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

            },
            error:function(e){
                console.log("接口错误");
            }
        });
        //通过单位名搜索单位
        $("#searchUnitName").on('click', function (e) {
            var unitName = $("#inputUnitName").val();
            $.ajax({
                url: './OfficeRDisplay/unitMag/HandlerUnit.ashx',
                data: {
                    cmd: 'unitDataTable',
                    UnitName: unitName,
                    UnitID:$("#unitSelect").find("option:selected").attr("name")
                },
                dataType: 'json',
                success: function (data) {
                    that.currentPage = 1;
                    that.dealResult(data);
                }
            })
        });
        //修改后点击确定按钮（提交）
        $("#submitEditUnit").off('click');
        $("#submitEditUnit").on('click', function (e) {
            swal({
                title: "",
                text: "确定修改单位信息？",
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
                    var area = $("#area").val(),
                        unitName = $("#unitName").val(),
                        shortName = $("#shortName").val(),
                        address = $("#address").val(),
                        unitInfo = $("#unitInfo").val();
                    if (unitName == "" || regNoVal.test(unitName)) {
                        swal("提示", "单位名不能为空", "error");
                        $("#unitName").addClass("border-red");
                        return false;
                    } else if (area == "" || regNoVal.test(area) || !reg.test(area)) {
                        swal("提示", "单位面积只能为非负数", "error");
                        $("#area").addClass("border-red");
                        return false;
                    } else if (address == "" || regNoVal.test(address)) {
                        swal("提示", "地址不能为空", "error");
                        $("#address").addClass("border-red");
                        return false;
                    }  else if (unitInfo == "" || regNoVal.test(unitInfo)) {
                        swal("提示", "单位介绍不能为空", "error");
                        $("#unitInfo").addClass("border-red");
                        return false;
                    }   else if(shortName = ""||regNoVal.test(shortName))  {
                        swal("提示","单位简称不能为空","error");
                        $("#shortName").addClass("border-red");
                        return false
                    }
                    else {
                        that.EditUnitData($(e.target).attr("name"));
                        $("#unitName").removeClass("border-red");
                        $("#area").removeClass("border-red");
                        $("#shortName").removeClass("border-red");
                        return false;//防止页面强制刷新
                    }                      
                } else{
                    
                }
            });
            return false;
        });
        //新增单位点击确定按钮
        $("#submitAddUnit").off('click');
        $("#submitAddUnit").on('click', function (e) {
            swal({
                title: "",
                text: "确定增加该单位？",
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
                       unitName = $("#unitName").val(),
                       address = $("#address").val(),
                       shortName = $("#shortName").val(),
                       unitInfo = $("#unitInfo").val();
                    //console.log("单位名为："+UnitName+"单位面积为："+Area +"单位长："+Height+"单位宽："+Width);
                    if (unitName == "" || regNoVal.test(unitName)) {
                        swal("提示", "单位名不能为空", "error");
                        $("#unitName").addClass("border-red");
                        return false;
                    } else if (area == "" || regNoVal.test(area) || !reg.test(area)) {
                        swal("提示", "单位面积只能为非负数", "error");
                        $("#area").addClass("border-red");
                        return false;
                    } else if (address == "" || regNoVal.test(address)) {
                        swal("提示", "地址不能为空", "error");
                        $("#address").addClass("border-red");
                        return false;
                    }  else if (unitInfo == "" || regNoVal.test(unitInfo)) {
                        swal("提示", "单位介绍不能为空", "error");
                        $("#unitInfo").addClass("border-red");
                        return false;
                    }  else if(shortName = ""||regNoVal.test(shortName))  {
                        swal("提示","单位简称不能为空","error");
                        $("#shortName").addClass("border-red");
                        return false
                    }
                    else {
                        that.addUnitData();
                        $("#unitName").removeClass("border-red");
                        $("#area").removeClass("border-red");
                        $("#shortName").removeClass("border-red");
   
                        return false;//防止页面强制刷新
                    }
                } else {

                }
            });
            return false;

        });

        //新增单位功能（点击新增按钮）
        $("#addData[name='Unit']").on('click', function (e) {
            $("#submitEditUnit").hide();
            $("#submitAddUnit").show();
            $("#modals").show();
            $("#detailMsg").show();
            that.editUnitId = "";
            $("#UnitType option").each(function () {
                $(this).removeAttr("selected");
            });
            $("#unitStatus").html("新增");
            $("#unitName").val("");
            $("#address").val("");
            $("#zlanduse").val("");
            $("#jlanduse").val("");
            $("#area").val("");
            $("#shortName").val("");
            $("#unitInfo").val("");
            $("img[src='images/closeModal.png']").on('click', function () {
                $("#modals").hide();
            });
        });
    },
    //1.将每栋大楼的数据都显示出来2018-6-14 wf
    unitDataTable: function () {
        var that = this;
        $.ajax({
            url: './OfficeRDisplay/unitMag/HandlerUnit.ashx',
            data: {
                cmd: 'unitDataTable'
            },
            dataType: 'json',
            success: function (result) {
                that.editUnitId = result[0].ID;
                $("#unitName").val(result[0].UnitName);
                $("#area").val(parseFloat(result[0].area));
                $("#shortName").val(result[0].shortName);
                $("#unitInfo").val(result[0].info);
                $("#address").val(result[0].address);
                $("#zlanduse").val(result[0].ZLandUse);
                $("#jlanduse").val(result[0].JLandUse);
                that.unitData = result;
                that.oldEditUnit = result[0].UnitName;
                //四级select菜单
                that.dealResult(result);
            },
            error: function () {
                console.log("接口错误，请联系相关人员");
            }
        })
    },
    dealResult: function (result) {
        if (result.length === 0) {
            $("#unitDetailData").html("暂无数据");
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
                    $('#unitDetailData').html(that.pagination(result, num, totalPage));
                    $("#unitDetailData tr:nth-child(" + 1 + ")").addClass('bg-gray');
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
                        $('#unitDetailData').html(that.pagination(result, num, totalPage));
                        $("#unitDetailData tr:nth-child(" + 1 + ")").addClass('bg-gray');

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
            num = data.UnitName,
            id = data.ID,
            html1 = "";
        //"<button id='deleteData' class='btn btn-danger' onclick='unitMag.deleteData(this);'>删除</button>" +

        html1 = "<tr name='" + data.ID + "'  class='cursor-p'  >" +
                    "<td class='unitIndex'>" + (i + 1) + "</td>" +
                    "<td name='" + data.ID + "'>" + data.UnitName + "</td>" +
                    "<td name='" + data.address + "'>" + data.address + "</td>" +
                    "<td>" + data.ZLandUse + "</td>" +
                    "<td>" + data.JLandUse + "</td>" +
                    "<td>" + data.area + "</td>" +
                    "<td>" + data.shortName + "</td>" +
                    "<td title='"+ data.info +"'>" + data.info +"</td>" +
                    "<td>" +
                        "<button id='deleteData' name='" + data.ID + "' class='btn btn-success' onclick='unitMag.showUnitData(this);'>修改</button>" +
                    "</td>" +
                "</tr>";

        return html1;
    },
    deleteData: function (e) {
        //var that = this;
        //swal({
        //    title: "删除单位",
        //    text: "删除后单位无法还原！",
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
        //            url: './OfficeRDisplay/UnitMag/HandlerUnit.ashx',
        //            data: { cmd: 'deleteUnitData', ID: $(e).parent().parent().attr("name") },
        //            dataType: 'json',
        //            success: function (result) {
        //                that.deleteUnit(result, $(e).parent().parent().attr("name"));
        //            }
        //        });
        //    } else {
        //    }
        //});
        //return false;

    },
    showUnitData: function (e) {
        $("#submitEditUnit").show();
        $("#submitAddUnit").hide();
        $("#modals").show();
        var that = this;
        var unitDataArr = that.unitData;
        //that.lastID = "";
        $("#unitDetailData tr").each(function () {
            if ($(this).hasClass('bg-gray')) {
                $(this).removeClass('bg-gray');
            }
        });
        $("#unitDetailData").find("tr[name='" + $(e).attr("name") + "']").addClass('bg-gray');
        $("#unitStatus").html("编辑");
        //获取当前点击房间数据
        var thisUnit = unitDataArr.filter(findTheUnit);
        function findTheUnit(unitDataArr) {
            return unitDataArr.ID == $(e).attr("name");
        }
        that.unitID = thisUnit[0].UnitID;
        that.editUnitId = thisUnit[0].ID;
        that.oldEditUnit = thisUnit[0].UnitName;
        $("#unitName").val(thisUnit[0].UnitName);
        //$("#buildArea").val(parseInt(thisUnit[0].BuildArea));
        $("#area").val(parseFloat(thisUnit[0].area || 0));
        $("#shortName").val(thisUnit[0].shortName);
        $("#address").val(thisUnit[0].address);
        $("#zlanduse").val(thisUnit[0].ZLandUse);
        $("#jlanduse").val(thisUnit[0].JLandUse);
        $("#unitInfo").val(thisUnit[0].info);
        $("img[src='images/closeModal.png']").on('click', function (e) {
            $("#modals").hide();
        });
    },
    EditUnitData: function () {
        var that = this,
            area = $("#area").val(),
            shortName = $("#shortName").val(),
            address = $("#address").val(),
            zlanduse = $("#zlanduse").val(),
            UnitName = $("#unitName").val(),
            jlanduse = $("#jlanduse").val(),
            info = $("#unitInfo").val();
        //判断单元内是否有重名大楼，有则出现提示，没有则保存到数据库
        let ifUnitName = new Promise((resolve,reject)=>{
            $.ajax({
                url:'./OfficeRDisplay/unitMag/HandlerUnit.ashx',
                type:'post',
                data:{
                    cmd:'testUnitName',
                    oldUnitName:that.oldEditUnit,
                    unitName:UnitName
                },
                dataType:'json',
                success:function(data){
                    if(data.length==0){
                        resolve(data);
                        
                    }else{
                        swal("提示", "单位内不允许存在同名单位，请更换单位名称!", "error");
                    }
                },
                error:function(e){
                    console.log("接口出现问题，请联系相关开发人员");
                    reject(e);
                }
            })
        });
        let updateUnitData = ifUnitName.then(function(value){
            $.ajax({
                url: './OfficeRDisplay/unitMag/HandlerUnit.ashx',
                type: 'post',
                data: {
                    cmd: 'editUnitData',
                    UnitID: that.editUnitId,
                    Area: area,
                    shortName:shortName,
                    UnitName: UnitName,
                    address: address,
                    zlanduse: zlanduse,
                    jlanduse: jlanduse,
                    info:info
                },
                dataType: 'json',
                success: function (result) {
                    if (result == "1") {
                        //alert("保存成功");
                        that.unitDataTable();
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
            });
        });
    },
    addUnitData: function () {
        var that = this,
            area = $("#area").val(),
            shortName = $("#shortName").val(),
            address = $("#address").val(),
            zlanduse = $("#zlanduse").val(),
            UnitName = $("#unitName").val(),
            jlanduse = $("#jlanduse").val(),
            info = $("#unitInfo").val();
        let ifUnitName = new Promise((resolve,reject)=>{
            $.ajax({
                url:'./OfficeRDisplay/UnitMag/HandlerUnit.ashx',
                data:{
                    cmd:'testUnitName',
                    unitName:UnitName
                },
                dataType:'json',
                success:function(data){
                    console.log(data);
                    if(data.length==0){
                        resolve(data)
                    }else{
                        swal("提示", "单位内不允许出现同名单位，请更换单位名称!", "error");
                    }
                },
                error:function(){
                    console.log("接口错误，请联系相关开发人员");
                }
            })
        });
        ifUnitName.then(function(value){
            $.ajax({
                url: './OfficeRDisplay/UnitMag/HandlerUnit.ashx',
                data: {
                    cmd: 'addUnitData',
                    Area: area,
                    shortName:shortName,
                    UnitName: UnitName,
                    address: address,
                    zlanduse: zlanduse,
                    jlanduse: jlanduse,
                    info:info
                },
                dataType: 'json',
                success: function (result) {
                    console.log(result);
                    if (result == "1") {
                        swal("提示", "添加单位成功", "success");
                        that.unitDataTable();
                        $("#modals").hide();

                    } else {
                        swal("提示", "单位接口出现错误", "error");
                    }
                },
                error: function (e) {
                    console.log("接口出错，请联系相关人员");
                }
            });
        });
    }
};
