function _personMag() {
    //初始单位ID,楼房ID均为空
    //this.unitID = "";
    //this.buildingID = "";
    //this.houseSubId = "";
    //this.floorNo = "";
    ////初始人员信息为空
    //this.personData = "";
    ////初始选择框信息为空(5级select菜单)
    //this.selectOptionArr = "";
    ////记录人员的最后一个ID，用于添加人员
    //this.lastID = "";
    this.addOrEdit = 0;
    this.userName = "";
    this.oldPersonName='';
}


_personMag.prototype = {
    init: function () {
        var that = this;
        that.showPersonInfo();
        //点击
        $("#submitEditPerson").off('click');
        //that.personMultMenu
        $("#submitEditPerson").on('click', function (e) {
            swal({
                title: "",
                text: "确定修改该人员信息？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    var REALNAME = $("input[name='REALNAME']").val(),
                 LoginUser = $("input[name='LoginUser']").val(),
                 LoginPwd = $("input[name='LoginPwd']").val();
                    //判断登录账号是否已经在entryUser表中存在 2018-04-27添加
                    $.ajax({
                        url: "./OfficeRDisplay/PersonMag/HandlerPerson.ashx",
                        data: { cmd: 'IfLoginUserExist', userName: LoginUser, oldUserName: that.userName },
                        dataType:'json',
                        anysc: false,
                        success: function (data) {
                            /*如果该登录账号已经存在，则提示该登录账号已存在*/
                            if (data.length==0) {
                                if (REALNAME == "" || REALNAME == null) {
                                    $("input[name='REALNAME']").addClass("border-red");

                                    swal("提示!", "用户名不能为空", "error");
                                } else if (LoginUser == "" || LoginUser == null) {
                                    $("input[name='LoginUser']").addClass("border-red");
                                    swal("提示!", "登录账户不能为空", "error");
                                } else if (LoginPwd == "" || LoginPwd == null) {
                                    $("input[name='LoginPwd']").addClass("border-red");
                                    swal("提示!", "登录密码不能为空", "error");
                                } else {
                                    that.updatePersonInfo();
                            
                                    $("input[name='REALNAME']").remove("border-red");
                                    $("input[name='LoginUser']").remove("border-red");
                                    $("input[name='LoginPwd']").remove("border-red");
                                }
                            } else {
                                $("input[name='LoginUser']").addClass("border-red");
                                swal("提示!", "系统中已经存在该登录账户名", "error");
                               
                        
                            }
                        }
                    });                     
                } else{
                }
            });
            return false;
        });
        //点击
        $("#submitAddPerson").off('click');
        //that.personMultMenu
        $("#submitAddPerson").on('click', function (e) {
            swal({
                title: "添加人员",
                text: "确定添加该人员信息？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定！",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    $("input[name='REALNAME']").removeClass("border-red");
                    $("input[name='LoginUser']").removeClass("border-red");
                    $("input[name='LoginPwd']").removeClass("border-red");
                    $("input[name='MOBILE']").removeClass("border-red");

                    var reg = /^[1-9]\d*$/;
                    var regNoVal = /^\s*$/g;
                    var REALNAME = $("input[name='REALNAME']").val(),
                        PPhone = $("input[name='MOBILE']").val(),
                        LoginUser = $("input[name='LoginUser']").val(),
                        LoginPwd = $("input[name='LoginPwd']").val();
            
                    //判断登录账号是否已经在entryUser表中存在 2018-04-27添加
                    $.ajax({
                        url: "./OfficeRDisplay/PersonMag/HandlerPerson.ashx",
                        data: { cmd: 'IfLoginUserExist', userName: LoginUser},
                        dataType:'json',
                        anysc: false,
                        success: function (data) {
                            /*如果该登录账号已经存在，则提示该登录账号已存在*/
                            if (data.length==0) {
                                if (REALNAME == "" || regNoVal.test(REALNAME)) {
                                    $("input[name='REALNAME']").addClass("border-red");
                                    swal("提示!", "姓名不能为空", "error");
                                    return false;
                                } else if (!reg.test(PPhone) || regNoVal.test(PPhone)) {
                                    $("input[name='MOBILE']").addClass("border-red");
                                    swal("提示!", "电话号码只能为正整数", "error");
                                    return false;
                                } else if (LoginUser == "" || regNoVal.test(LoginUser)) {
                                    $("input[name='LoginUser']").addClass("border-red");
                                    swal("提示!", "登录账户不能为空", "error");
                                    return false;
                                } else if (LoginPwd == "" || regNoVal.test(LoginPwd)) {
                                    $("input[name='LoginPwd']").addClass("border-red");
                                    swal("提示!", "登录密码不能为空", "error");
                                    return false;
                                } else {
                                    that.insertPersonInfo();
                                    that.showPersonInfo();
                                    $("input[name='REALNAME']").removeClass("border-red");
                                    $("input[name='LoginUser']").removeClass("border-red");
                                    $("input[name='LoginPwd']").removeClass("border-red");
                                    $("input[name='MOBILE']").removeClass("border-red");
                                    swal("提示!", "添加人员成功", "success");
                                    return false;//防止页面强制刷新
                                }
                            } else {
                                $("input[name='LoginUser']").addClass("border-red");
                                swal("提示!", "系统中已经存在该登录账户名", "error");
                                return false;
                        
                            }
                        }
                    });                     
                } else{
                }
            });
            return false;
        });


        $("#addPersonData").off('click');
        //点击新增按钮的时候
        $("#addData[name='Person']").on('click', function (e) {
            $("#submitAddPerson").show();
            $("#submitEditPerson").hide();
            //$("#btnSavePerson").attr("name", (parseInt(that.lastID) + 1));
            $("#Personstatus").html("新增");
            //$("#ifshowAdd").style.display = 'block';
            that.addOrEdit = 0;
            //text文本框中的内容清空
            $("input[name='REALNAME']").val("");
            $("input[name=SEX]:eq(0)").attr("checked", 'checked');
            $("#personRoomID").find("option[value='1']").attr("selected", "selected");
            $("#DIVISION").find("option[value='1']").attr("selected", "selected");

            $("input[name='MOBILE']").val("");
            $("input[name='LoginUser']").val("");
            $("input[name='LoginPwd']").val("");
            //$("#Authority").find("option[value='1']").attr("selected", "selected");
        });
        $("#searchPersonGroup").find("select").on('change', function (e) {
            that.personChangeNextSearch(e);
        });

        //点击搜索人名的时候2018-04-02 SYF
        $("#searchPerson").off('click');
        //对搜索按钮触发相对应的事件
        $("#searchPerson").on('click', function () {
            var personName = $("#personSearchText").val()
            that.showPersonInfo(personName);
        })


        $.ajax({
            url: './OfficeRDisplay/PersonMag/HandlerPerson.ashx',
            data: {
                cmd: 'getDivisionContent'
            },
            dataType: 'json',
            success: function (result) {
                var html = "<option name='Null'></option>";
                for (var i = 0; i < result.length; i++) {
                    html += "<option name='" + result[i].ID + "'>" + result[i].DivisionName + "</option>"
                }
                $("#DIVISION").html(html);
            }, error: function (e) {
                console.log("接口错误");
            }
        });
        $.ajax({
            url:'./OfficeRDisplay/PersonMag/HandlerPerson.ashx',
            data:{
                cmd:'getPositionContent'
            },
            dataType:'json',
            success:function(data){
                var html = "<option name='Null'></option>";
                for(var i=0;i<data.length;i++){
                    html+="<option value='" + data[i].ID + "'>"+ data[i].TitleName +"</option>";
                }
                $("#POSITION").html(html);
            }
        });
    },


    //1.人员数据查询功能2018-03-10SHIYUNFANG
    //1.查询所有人员信息 2018-03-29 WF
    showPersonInfo: function (personName) {
        var that = this;
        //var personDataArr = that.personData;
        //$("#personStatus").html("编辑");
        // var personName = $("#personSearchText").val();
        //需要先清空tbody中的数据2018-04-04 SYF
        $("#personDetailData").html("");
        $.ajax({
            url: "./OfficeRDisplay/PersonMag/HandlerPerson.ashx?t=new Date()",
            data: {
                cmd: "showAllPersonInfo",
                personName: $("#personSearchText").val()
            },
            dataType: "json",
            success: function (result) {
                if (result.length > 0) {
                    that.addOrEdit = result[0].ID;

                    $("input[name='REALNAME']").val(result[0].PName);
                    that.oldPersonName = result[0].PName;
                    $("#personRoomID").val(result[0].titleID);
                    $("#DIVISION").val(result[0].DivisionName);
                    $("input[name='LoginUser']").val(result[0].userName);
                    $("input[name='LoginPwd']").val(result[0].password);
                    $("#Authority").find("input").attr("checked", false);
                    var permissionArr = result[0].PermissionID.split(",");
                    
                    for (let i = 0; i < permissionArr.length; i++) {
                        $("#Authority").find("input[value='" + permissionArr[i] + "']").prop("checked", "checked");
                    }
                    $("input[name=SEX]:eq(" + result[0].Sex + ")").prop("checked", 'checked');
                    that.dealResult(result);
                    that.userName = result[0].userName;
                    that.personData = result;
                }
                //console.log(result);

            },
            error: function (e) {
            }
        });


    },
    //2.修改人员信息
    updatePersonInfo: function () {

        $("input[name='REALNAME']").removeClass("border-red");
        $("input[name='LoginUser']").removeClass("border-red");
        $("input[name='LoginPwd']").removeClass("border-red");
        $("input[name='MOBILE']").removeClass("border-red");
        var reg = /^[+]{0,1}(\d+)$/;
        var regNoVal = /^\s*$/g;

        var that = this,
        REALNAME = $("input[name='REALNAME']").val(),
        SEX = $("input[name='SEX']:checked ").val(),
        //MOBILE = $("input[name='MOBILE']").val(),
        POSITION = $("#POSITION option:selected").attr("value") || "Null",
        //Location = $("input[name='ADDRESS']").val();
        DivisionID = $("#DIVISION option:selected").attr("name") || "Null",
         PPhone = $("input[name='MOBILE']").val(),
        userName = $("input[name='LoginUser']").val(),
        password = $("input[name='LoginPwd']").val(),
        PermissionID = "";

        $("#Authority>input").each(function () {
            if ($(this).prop("checked")) {
                PermissionID += $(this).val() + ",";
            }
        });
        if (PermissionID != "") {
            PermissionID = PermissionID.substring(0, PermissionID.length - 1);
        }



        //先判断姓名、电话、登录账户、登录密码是否为空
        if (REALNAME == "" || regNoVal.test(REALNAME)) {
            $("input[name='REALNAME']").addClass("border-red");
            swal("提示!", "姓名不能为空", "error");
            return false;
        } else if (!reg.test(PPhone) || regNoVal.test(PPhone)) {
            $("input[name='MOBILE']").addClass("border-red");
            swal("提示!", "电话号码只能为正整数", "error");
            return false;
        } else if (userName == "" || regNoVal.test(userName)) {
            $("input[name='LoginUser']").addClass("border-red");
            swal("提示!", "登录账户不能为空", "error");
            return false;
        } else if (password == "" || regNoVal.test(password)) {
            $("input[name='LoginPwd']").addClass("border-red");
            swal("提示!", "登录密码不能为空", "error");
            return false;
        } else {
            //把border-red全部去掉2018-04-27       
            $("input[name='REALNAME']").removeClass("border-red");
            $("input[name='LoginUser']").removeClass("border-red");
            $("input[name='LoginPwd']").removeClass("border-red");
            $("input[name='MOBILE']").removeClass("border-red");

            //PermissionID = $("#Authority option:selected").attr("value");
            //console.log(SEX + "sex的值为");
            let ifDivisionPerson = new Promise((resolve,reject)=>{
                $.ajax({
                    url:'./OfficeRDisplay/PersonMag/HandlerPerson.ashx?t=new Date()',
                    data:{
                        cmd:'testPersonName',
                        personName:REALNAME,
                        oldPersonName:that.oldPersonName,
                        divisionID:DivisionID
                    }
                    ,dataType:'json'
                    ,success:function(data){
                        if(data.length==0){
                            resolve(data);
                        }else{
                            swal("提示", "处室内人员姓名不能一样，请修改人员姓名!", "error");
                        }
                    }
                    ,error:function(){
                        console.log("接口错误，请联系相关开发人员");
                    }
                })
            });
            ifDivisionPerson.then(function(value){
                //1、先判断这个修改信息的人员是否有房间
                $.ajax({
                    url: "./OfficeRDisplay/PersonMag/HandlerPerson.ashx?t=new Date()",
                    data: { cmd: "getIfHasRoom", addOrEdit: that.addOrEdit },
                    dataType: "json",
                    success: function (result) {
                        if (result.length > 0) {
                            //2、通过所在房间按照修改好的电话号码更新sort
                            //var RoomID = result[0].RoomID;
                            $.ajax({
                                url: "./OfficeRDisplay/PersonMag/HandlerPerson.ashx?t=new Date()",
                                data: { cmd: "roomID", roomID: that.addOrEdit },
                                dataType: "json",
                                success: function (result) {
                                    console.log("sort更新成功");
                                }
                            })

                        } else {
                            //说明这个人没有房间,该怎么处理？？？？？？？？？？？
                        }
                        //3、更新人员信息并且更新用户登录账户及密码的entryUser表
                        $.ajax({
                            url: "./OfficeRDisplay/PersonMag/HandlerPerson.ashx?t=new Date()",
                            data: { cmd: "UpdateOnePerson", addOrEdit: that.addOrEdit, PName: REALNAME, Sex: SEX, TitleID: POSITION, DivisionID: DivisionID, PPhone: PPhone, userName: userName, password: password, PermissionID: PermissionID },
                            dataType: "json",
                            success: function (result) {
                                if (result) {
                                    $("#modals").hide();
                                    //_personManager.showPersonInfo();
                                    swal("提示", "人员信息修改成功！", "success");
                                    that.showPersonInfo();
                                } else {
                                    $("#modals").hide();
                                    swal("提示", "服务器出现未知错误，修改失败!", "error");

                                }
                            },
                            error: function (e) {
                                console.log("接口错误");
                            }
                        });
                    },
                    error: function (e) {
                        console.log("接口错误");
                    }
                });
            })
        }
    },

    //3.插入人员数据
    insertPersonInfo: function () {
        var that = this;
        var REALNAME = $("input[name='REALNAME']").val(),
            SEX = $('input[name="SEX"]:checked ').val(),
            POSITION = $("#POSITION option:selected").attr("value"),
            DivisionID = $("#DIVISION").find("option:selected").attr("name") || "Null",
            PPhone = $("input[name='MOBILE']").val(),
             userName = $("input[name='LoginUser']").val(),
        password = $("input[name='LoginPwd']").val(),
        PermissionID = "";
        $("#Authority>input").each(function () {
            if ($(this).prop("checked")) {
                PermissionID += $(this).val() + ",";
            }
        });
        if (PermissionID != "") {
            PermissionID = PermissionID.substring(0, PermissionID.length - 1);
        }
        let ifDivisionPerson = new Promise((resolve,reject)=>{
            $.ajax({
                url:"./OfficeRDisplay/PersonMag/HandlerPerson.ashx",
                data:{
                    cmd:'testPersonName',
                    personName:REALNAME,
                    divisionID:DivisionID
                },
                dataType:'json',
                success:function(data){
                    if(data.length==0){
                        resolve(data);
                    }else{
                        swal("提示", "处室内人员姓名不能一样，请修改人员姓名!", "error");
                    }
                },
                error:function(e){
                    console.log("接口出现问题，请联系相关开发人员");
                }
            })
        });
        ifDivisionPerson.then(function(value){
            $.ajax({
                url: "./OfficeRDisplay/PersonMag/HandlerPerson.ashx?t=new Date()",
                data: { cmd: "AddOnePerson", PName: REALNAME, Sex: SEX, TitleID: POSITION, DivisionID: DivisionID, PPhone: PPhone, userName: userName, password: password, PermissionID: PermissionID },
                dataType: "json",
                success: function (result) {
                    if (result) {
                        that.saveAddPersonRecord(REALNAME);//新增 2018-04-02
                        //_personManager.showPersonInfo();
                        $("#modals").hide();
                        swal("提示!", "添加人员成功", "success");
                    } else {
                        $("#modals").hide();
                        //swal("服务器出现未知错误，插入失败!");
                        swal("错误!", "服务器出现未知错误，插入失败!", "success");
                        //alert("服务器出现未知错误，插入失败");
                    }
                }, error: function (e) {
                    console.log("接口问题");
                }
            });
        })
        
    },
    //保存新增人员记录2018-04-02 SYF
    saveAddPersonRecord: function (PName) {
        $.ajax({
            url: "./OfficeRDisplay/PersonMag/HandlerPerson.ashx?t=new Date()",
            data: { cmd: "SaveAddPersonRecord", PName: PName, handlerID: handlerID },
            dataType: "json",
            success: function (result) {
                if (result > 0) {

                    console.log("添加人员记录保存成功");

                } else {
                    console.log("添加人员记录保存失败");
                }
            }, error: function (e) {
                console.log("接口问题");
            }
        });
    },

    dealResult: function (result) {
        var that = this,
            currentPage,
            totalPage = Math.ceil(result.length / 10);//总页数
        //    lastId = result[(result.length - 1)].ID;
        //that.lastID = lastId,

        //把result[result.length-1].ID赋值到新增按钮的name属性上
        //$("#addRoomData").attr("name", (parseInt(lastId) + 1));
        //分页
        $.jqPaginator('#pagination1', {
            totalPages: totalPage,
            visiblePages: 3,
            currentPage: currentPage || 1,
            prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
            next: '<li class="next"><a href="javascript:;">下一页</a></li>',
            page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
            onPageChange: function (num) {
                $('#personDetailData').html(that.pagination(result, num, totalPage));
                $("#personDetailData tr:nth-child(" + 1 + ")").addClass('bg-gray');
            }
        });
        //跳页功能
        $("#getIndexData1").off('click');
        $("#getIndexData1").on('click',function () {
            currentPage = parseInt($("#num1").val());
            if (currentPage > totalPage) {
                currentPage=totalPage; 
                $("#num1").val(totalPage);
            }
            
            $.jqPaginator('#pagination1', {
                totalPages: totalPage,
                visiblePages: 3,
                currentPage: currentPage || 1,
                prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
                next: '<li class="next"><a href="javascript:;">下一页</a></li>',
                page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                onPageChange: function (num) {

                    $('#personDetailData').html(that.pagination(result, num, totalPage));
                    $("#roomDetailData tr:nth-child(" + 1 + ")").addClass('bg-gray');
                }
            });
        });
    },
    //数据分页管理
    pagination: function (data, num, totalPage, buildingId) {
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
        $("#totalNum1").html(totalPage);
        return html;
    },
    //表格分页html
    personDataHtml: function (data, i) {
        var status,
            html1 = "";
        var that = this;
        var clickData = "personMag.showOnePersonInfo('" + data.ID + "','" + data.PName + "','" + data.Sex + "','" + data.TitleName + "','" + data.TitleID + "','" + data.DivisionName + "','" + data.PPhone + "','" + data.userName + "','" + data.password + "','" + data.PermissionID + "')";
        html1 = "<tr id=tr" + data.ID + " class='cursor-p'>" +
         "<td >" + (i + 1) + "</td>" +//序号（非编号）
         "<td>" + data.PName + "</td>" +
         "<td>" + data.TitleName + "</td>" +
         "<td>" + data.DivisionName + "</td>" +
         "<td>" + data.PPhone + "</td>" +
          "<td>" + data.userName + "</td>" +
           "<td>" + data.password + "</td>" +
         "<td class='center'>"
         +"<button id='btnOK' class='btn btn-danger'  onclick=personMag.delPersonInfo(" + data.ID + ")>删除</button>"
         +"<button id='' name='" + data.ID + "' class='btn btn-success' onclick="+ clickData +">修改</button>"
         " </td></tr>";
        return html1;
    },

    showOnePersonInfo: function (id, PName, Sex, TitleName, titleID, DivisionName, PPhone, userName, password, PermissionID) {
        var that = this;
        that.oldPersonName = PName;
        $("#modals").show();
        if ($("input[name='REALNAME']").hasClass("border-red")) {
            $("input[name='REALNAME']").removeClass("border-red");
        }
        $("#submitAddPerson").hide();
        $("#submitEditPerson").show();
        $("#Personstatus").html("编辑");
        $("#personDetailData").find('tr.bg-gray').removeClass('bg-gray');
        $("#personDetailData").find("tr[id='tr" + id + "']").addClass('bg-gray');
        //personManager.lastID = "";
        that.addOrEdit = id;
        //console.log("现在获取到的值有：" + id + PName + Sex + PPhone + titleID, TitleName + Location);
        $("input[name='REALNAME']").val(PName);
        //$("input[name='MOBILE']").val(PPhone);
        //$("input[name='ADDRESS']").val(Location);
        $("input[name=SEX]").removeProp('checked');
        if (Sex == 0) {
            $("input[name=SEX]:eq(0)").prop("checked", 'checked');
        }
        else {
            $("input[name=SEX]:eq(1)").prop("checked", 'checked');
        }
        $("#POSITION").val(titleID);
        $("#DIVISION").val(DivisionName);

        $("input[name='MOBILE']").val(PPhone);
        $("input[name='LoginUser']").val(userName);
        that.userName = userName;
        $("input[name='LoginPwd']").val(password);
        $("#Authority").find("input[type='checkbox']").attr("checked", false);
        var permissionArr = PermissionID.split(",");
        for (let i = 0; i < permissionArr.length; i++) {
            $("#Authority").find("input[value='" + permissionArr[i] + "']").prop("checked", "checked");
        }
        $("img[src='images/closeModal.png']").on('click', function (e) {
            $("#modals").hide();
        })
    },
    delPersonInfo: function (id) {
        var that = this;
        swal({
            title: "删除人员",
            text: "您将无法恢复该人员信息",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "删除！",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: true
        }, function(isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: "./OfficeRDisplay/PersonMag/HandlerPerson.ashx?t=new Date()",
                    data: { cmd: "DelOnePerson", id: id },
                    dataType: "json",
                    success: function (result) {
                        // console.log("result的值为：" + result);
                        if (result == 1) {
                            that.saveDelPersonRecord(id);
                            //重新加载所有人员信息
                            that.showPersonInfo();
                            //_personManager.showPersonInfo();
                            swal("提示", "删除成功", "success");
                            //alert("删除成功!");
                        } else {
                            swal("提示", "服务器出现未知错误，删除失败!", "success");
                            //alert("服务器出现未知错误，删除失败");
                        }
                    }
                });                 
            } else{
            }
        })
        
    },
    saveDelPersonRecord: function (id) {
        $.ajax({
            url: "./OfficeRDisplay/PersonMag/HandlerPerson.ashx?t=new Date()",
            data: { cmd: "GetPName", ID: id },
            dataType: "json",
            success: function (result) {
                var PName = result[0].PName;
                $.ajax({
                    url: "./OfficeRDisplay/PersonMag/HandlerPerson.ashx?t=new Date()",
                    data: { cmd: "SaveDelPersonRecord", PName: PName, handlerID: handlerID },
                    dataType: "json",
                    success: function (data) {

                        console.log("保存删除记录成功！");
                    },
                    error: function (e) {
                        console.log("接口出错，请联系相关开发人员");
                    }
                })
            }
        })
    },

}







