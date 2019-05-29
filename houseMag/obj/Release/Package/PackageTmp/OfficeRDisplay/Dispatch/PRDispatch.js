function _PRDispatch() {
    //初始单位ID,楼房ID,分区，楼层均为空
    this.unitID = "";
    this.buildingID = "";
    this.houseSub = "";
    this.floor = "";
    //初始房间信息为空
    this.roomData = "";
    //初始选择框信息为空(4级select菜单)
    //this.selectOptionArr = "";
    //记录当前点击所对应的houseId,用于保存
    //this.editHouseId = "";
    //记录房间最后一个ID，用于添加房间
    //this.lastID = "";

    //房间id，用于获取这个房间的所有人
    this.roomID = "";
    //this.roomIDVariable = "";
    //移出某个人保存人名和房间名
    this.PName = "";
    this.RoomName = "";
    this.roomID0 = "";
    this.currentPage = 1;

}


_PRDispatch.prototype = {


    //1.将每个房间的数据都显示出来2018-3-9 wf
    allRoomData: function () {
        var that = this;
        var html = "<tr>";
        //var increment = 0;
        var unitID = that.unitID,
            buildingID = that.buildingID,
            houseSub = that.houseSub,
            floor = that.floor;
        //点击搜索人名的时候2018-04-03 SYF
        $("#searchPersonLeft").off('click');
        //对搜索按钮触发相对应的事件
        $("#searchPersonLeft").on('click', function () {
            var vacantPersonName = $("#personSearchTextLeft").val();
            that.rpRelationSearch(vacantPersonName);
        })
        $.ajax({
            url: './OfficeRDisplay/RoomMag/HandlerRoom.ashx',
            data: {
                cmd: 'roomDataTable',
                unitId: unitID,
                buildId: buildingID,
                houseSub: houseSub,
                floor: floor
            },
            dataType: 'json',
            success: function (result) {
                if (result.length == 0) {
                    $("#PersonDispatchData").html("暂时没有数据");
                    $("#roomShowData").html("暂时没有数据");

                } else {
                    that.dealResultRoom(result);
                    that.getRPersonData(result[0].ID);
                    that.listNullRoomPerson();
                }
            }, error: function () {
                console.log("接口错误，请联系相关开发人员");
            }
        })

    },


    dealResultRoom: function (result) {
       
        var that = this,
            currentPage,
            totalPage = Math.ceil(result.length / 10);//总页数
        //    lastId = result[(result.length - 1)].ID;
        //that.lastID = lastId;
        //把result[result.length-1].ID赋值到新增按钮的name属性上
        //$("#addRoomData").attr("name", (parseInt(lastId) + 1));
        //分页
        $.jqPaginator('#pageRDispatch', {
            totalPages: totalPage,
            visiblePages: 3,
            currentPage: currentPage || 1,
            prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
            next: '<li class="next"><a href="javascript:;">下一页</a></li>',
            page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
            onPageChange: function (num) {
                $('#roomShowData').html(that.paginationRoom(result, num, totalPage));
                $("#roomShowData tr:nth-child(" + 1 + ")").addClass('bg-gray');
            }
        });
        
        //跳页功能
        $("#getIndexDataDispatch").off('click');
        $("#getIndexDataDispatch").on('click',function () {
            currentPage = parseInt($("#numRoom").val());
            if (currentPage > totalPage) {
                currentPage = totalPage;
                $("#numRoom").val(totalPage);
            }
            
            $.jqPaginator('#pageRDispatch', {
                totalPages: totalPage,
                visiblePages: 3,
                currentPage: currentPage || 1,
                prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
                next: '<li class="next"><a href="javascript:;">下一页</a></li>',
                page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                onPageChange: function (num) {
                    $('#roomShowData').html(that.paginationRoom(result, num, totalPage));
                    $("#roomShowData tr:nth-child(" + 1 + ")").addClass('bg-gray');

                }
            });
        });
    },
    //数据分页管理房间
    paginationRoom: function (data, num, totalPage) {

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
                    html += that.personDataHtmlRoom(data[i], i);
                }
            } else {
                for (var i = 10 * (currentPage - 1) ; i < totalData; i++) {
                    html += that.personDataHtmlRoom(data[i], i);
                }
            }
        } else {

            for (var i = 0; i < data.length; i++) {
                html += that.personDataHtmlRoom(data[i], i);
            }

        }
        //totalNumRDispatch
        $("#totalNumRDispatch").html(totalPage);
        return html;
    },
    //表格分页房间
    personDataHtmlRoom: function (data, i) {
        var status,
            num = data.RoomName,
            id = data.ID,
            html1 = "";
        
        html1 = "<tr class='cursor-p' name='" + data.ID + "' onclick=_PRDispatch.prototype.getRPersonData(" + data.ID + ")>" +
            "<td class='roomIndex'>" + (i + 1) + "</td>" +
            "<td>" + data.HouseName + "</td>" +
            "<td>" + data.HouseSUBName + "</td>" +
            "<td>" + data.RoomName + "</td></tr>";
        //"<td>"+ data.ID +"</td></tr>";
        return html1;
    },
    //获取某个房间内的所有人员（即中间的表格）
    getRPersonData: function (roomID) {
        var that = this;
        $("#roomShowData tr").each(function () {
            if ($(this).hasClass('bg-gray')) {
                $(this).removeClass('bg-gray');
            }
        });
        $("#roomShowData").find("tr[name='" + roomID + "']").addClass('bg-gray');
        $.ajax({
            url: './OfficeRDisplay/HandlerData.ashx',
            data: {
                cmd: 'RPersonTable',
                roomID: roomID

            },
            dataType: 'json',
            success: function (data) {
                if (data.length == 0) {
                    $("#PersonDispatchData").html("");
                } else {
                    var html = "<tr>";
                    //因为搜索人员的时候有分页处理，所以现在全部用分页2018-04-08
                    that.dealResultSearch(data);

                    
                }
                roomIDVariable = roomID;

            }
        })
    },


    //人员从房间移出
    removePerson: function (personID) {
        //1、先获取到这个人所在的房间名、房间id和人名
        //getPRname(personID);
        var that = this;
        $.ajax({
            url: './OfficeRDisplay/HandlerData.ashx',
            data: {
                cmd: 'getPRname',
                personID: personID

            },
            dataType: 'json',
            success: function (data) {
                that.PName = data[0].PName;
                that.RoomName = data[0].RoomName;
                that.roomID0 = data[0].ID;//获取到这个人所在的房间id2018-04-25
              

                        //2、将TB_Person表中的RoomID置为null
                        $.ajax({
                            url: './OfficeRDisplay/HandlerData.ashx',
                            data: {
                                cmd: 'RemovePerson',
                                personID: personID
                            },
                            dataType: 'json',
                            success: function (data) {

                                //3、判断这个房间是否只有要移出的这一个人，如果是空房间，需要将sort变成0
                                $.ajax({
                                    url: './OfficeRDisplay/Dispatch/HandlerDispatch.ashx',
                                    data: {
                                        cmd: 'CountPerson',
                                        roomID: that.roomID0

                                    },
                                    dataType: 'json',
                                    success: function (data) {
                                        //如果该房间人数大于1，则重新将sort变成这个房间中人员电话号码最大值
                                        if (data[0].countPerson > 0) {
                                            //3(1)、通过房间名去重新更新sort
                                            $.ajax({
                                                url: './OfficeRDisplay/PersonMag/HandlerPerson.ashx?t=new Date()',
                                                data: {
                                                    cmd: 'updateSort',
                                                    roomID: that.roomID0
                                                },
                                                dataType: 'json',
                                                success: function (data) {
                                                    console.log("重新将sort变成这个房间中人员电话号码最小值");
                                                }
                                            })
                                        } else {//3(2)否则说明这个房间只有一个人，将sort变成99999
                                            $.ajax({
                                                url: './OfficeRDisplay/Dispatch/HandlerDispatch.ashx',
                                                data: {
                                                    cmd: 'changSort',
                                                    roomID: that.roomID0
                                                },
                                                dataType: 'json',
                                                success: function (data) {
                                                    console.log("将该房间sort变成99999");
                                                }
                                            })
                                        }

                                //3、将该操作内容插入到操作表中
                                that.saveRemoveRecord(that.PName, that.RoomName);
                                //4、重新加载这个房间里面的人员信息
                                that.getRPersonData(roomIDVariable);
                                //5、重新加载空置人员列表中的人员信息
                                that.listNullRoomPerson();
                                swal("提示", "移出成功!", "success");

                            }
                        })
                    }
                })        
             
            }
        })
    },

    //人员调度中左侧对人名进行搜索时，如果人员所在roomID为空，
    //则在左侧的房间列表中显示该人员不在办公室内2018-04-03 SYF
    rpRelationSearch: function (PName) {
        var that = this;
        $.ajax({
            url: './OfficeRDisplay/HandlerData.ashx',
            data: {
                cmd: 'RpRelationSearch',
                PName: PName
            },
            dataType: 'json',
            success: function (data) {
                if (data.length == 0) {
                    roomIDVariable = "";
                    $("#PersonDispatchData").html("暂时没有数据");
                    $("#roomShowData").html("暂时没有数据");
                } else {
                    var distinctData = _common.prototype.unique(data, 'ID');
                    //重新加载调度中的房间列表
                    that.dealResultRoom(distinctData);
                    that.getRPersonData(data[0].ID);
                }
              

           
            }

        })
    },
    //对搜索到的人员数据分页处理2018-04-08
    dealResultSearch: function (result) {
        var that = this,
            currentPage,
            totalPage = Math.ceil(result.length / 10);//总页数
        //    lastId = result[(result.length - 1)].ID;
        //that.lastID = lastId;
        //分页
        $.jqPaginator('#pageRDispatchSearch', {
            totalPages: totalPage,
            visiblePages: 3,
            currentPage: currentPage || 1,
            prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
            next: '<li class="next"><a href="javascript:;">下一页</a></li>',
            page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
            onPageChange: function (num) {
                $('#PersonDispatchData').html(that.paginationSearch(result, num, totalPage));
            }
        });
        //跳页功能
        $("#getIndexDispatchSearch").off('click');
        $("#getIndexDispatchSearch").on('click',function () {
            currentPage = parseInt($("#numSearch").val());
            if (currentPage > totalPage) {
                currentPage = totalPage;
                $("#numSearch").val(totalPage);
            }
            
            $.jqPaginator('#pageRDispatchSearch', {
                totalPages: totalPage,
                visiblePages: 3,
                currentPage: currentPage || 1,
                prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
                next: '<li class="next"><a href="javascript:;">下一页</a></li>',
                page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                onPageChange: function (num) {
                    $('#PersonDispatchData').html(that.paginationSearch(result, num, totalPage));

                }
            });
        });
    },
    //数据分页管理搜索到的人员2018-04-08
    paginationSearch: function (data, num, totalPage) {

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
                    html += that.personDataHtmlSearch(data[i], i);
                }
            } else {
                for (var i = 10 * (currentPage - 1) ; i < totalData; i++) {
                    html += that.personDataHtmlSearch(data[i], i);
                }
            }
        } else {

            for (var i = 0; i < data.length; i++) {
                html += that.personDataHtmlSearch(data[i], i);
            }

        }
        //totalNumRDispatch
        $("#totalNumRDispatchSearch").html(totalPage);
        return html;
    },
    //表格分页搜索到的人员2018-04-08
    personDataHtmlSearch: function (data, i) {
        var html = "";
        html += "<tr name='" + data.ID + "'><td>" + data.ID + "</td><td>" + data.PName + "</td><td>" + data.TitleName + "</td><td>" + data.DivisionName + "</td><td><button id='removePerson' class='btn' onclick='_PRDispatch.prototype.removePerson(" + data.ID + ")'>移出</button></td></tr>";
        return html;
    },
    //---------------------------------------------------------------------------------------------------------------------

    //移入人员
    joinPerson: function (PersonID) {
        var that = this;
        //1、先获取到这个房间的房间名
        $.ajax({
            url: './OfficeRDisplay/HandlerData.ashx',
            data: {
                cmd: 'getRoomName',
                roomID:roomIDVariable,
                PersonID: PersonID
            },
            dataType: 'json',
            success: function (result) {
                if (result.length == 0) {
                    swal("提示", "移入房间不能为空!", "error");
                    return false;
                }
                var roomNameInsert = result[0].RoomName;
                var personNameInsert = result[0].PName;
              

                //2、移入某个人到指定房间
                $.ajax({
                    url: './OfficeRDisplay/HandlerData.ashx',
                    data: {
                        cmd: 'JoinPerson',
                        PersonID: PersonID,
                        RoomID: roomIDVariable
                    },
                    dataType: 'json',
                    success: function (data) {
                        //3、更新这个房间的sort(为了房间排序)
                        $.ajax({
                            url: "./OfficeRDisplay/PersonMag/HandlerPerson.ashx?t=new Date()",
                            data: { cmd: "updateSort", roomID: roomIDVariable },
                            dataType: "json",
                            success: function (result) {
                                console.log("移入人员后sort更新成功");
                            }
                        })
                        //4、保存某个人的移入到某个房间的记录

                        $.ajax({
                            url: './OfficeRDisplay/HandlerData.ashx',
                            data: {
                                cmd: 'SaveJoinRecord',
                                PName: personNameInsert,
                                roomName: roomNameInsert,
                                handlerID:handlerID
                            },
                            dataType: 'json',
                            success: function (result) {
                                //5、重新加载某个房间的所有人员
                                that.getRPersonData(roomIDVariable);
                                //6、重新加载空置人员
                                that.listNullRoomPerson();

                                swal("提示", "移入成功!", "success");

                            }, error: function () {
                                console.log("接口出错，请联系相关开发人员")
                            }
                        })
                    }
                })
            }
        })
    },
    //保存某个人从房间移出记录
    saveRemoveRecord: function (PName, RoomName) {
        var that = this;
        $.ajax({
            url: './OfficeRDisplay/HandlerData.ashx',
            data: {
                cmd: 'SaveRemoveRecord',
                PName: PName,
                RoomName: RoomName,
                handlerID:handlerID
            },
            dataType: 'json',
            success: function (data) {
                //重新加载空置人员列表
                that.listNullRoomPerson();
            }, error: function () {
                console.log("接口出错，请联系相关开发人员");
            }
        })
    },
    //列出所有的空置人员
    listNullRoomPerson: function () {
        var that = this;
        $.ajax({
            url: './OfficeRDisplay/HandlerData.ashx',
            data: {
                cmd: 'ListNullRoomPerson'
                //PName: $("#personVacantSearchText").val()
            },
            dataType: 'json',
            success: function (data) {
                that.dealResultVacantP(data);
            }
        })

    },

    dealResultVacantP: function (result) {
        var that = this,
            
            totalPage = Math.ceil(result.length / 10);//总页数
        //    lastId = result[(result.length - 1)].ID;
        //that.lastID = lastId;
        if (that.currentPage > totalPage) {
            that.currentPage = totalPage;
        }
        //分页
        $.jqPaginator('#pageVacant', {
            totalPages: totalPage,
            visiblePages: 3,
            currentPage: that.currentPage || 1,
            prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
            next: '<li class="next"><a href="javascript:;">下一页</a></li>',
            page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
            onPageChange: function (num) {
                that.currentPage = num;
                $('#PersonVacantData').html(that.paginationVacant(result, num, totalPage));
            }
        });
        //跳页功能
        $("#VacantIndexDispatch").off('click');
        $("#VacantIndexDispatch").on('click',function () {
            that.currentPage = parseInt($("#numVacant").val());
            if (that.currentPage > totalPage) {
                that.currentPage = totalPage;
                $("#numVacant").val(that.currentPage);
            }
            
            $.jqPaginator('#pageVacant', {
                totalPages: totalPage,
                visiblePages: 3,
                currentPage: that.currentPage || 1,
                prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
                next: '<li class="next"><a href="javascript:;">下一页</a></li>',
                page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                onPageChange: function (num) {
                    that.currentPage = num;
                    $('#PersonVacantData').html(that.paginationVacant(result, num, totalPage));

                }
            });
        });
    },
    //数据分页管理房间
    paginationVacant: function (data, num, totalPage) {

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
                    html += that.personDataHtmlP(data[i], i);
                }
            } else {
                for (var i = 10 * (currentPage - 1) ; i < totalData; i++) {
                    html += that.personDataHtmlP(data[i], i);
                }
            }
        } else {

            for (var i = 0; i < data.length; i++) {
                html += that.personDataHtmlP(data[i], i);
            }

        }
        //totalNumRDispatch
        $("#totalNumVacant").html(totalPage);
        return html;
    },
    //表格分页房间
    personDataHtmlP: function (data, i) {
        var html = "";
        var that = this;
        //html1 = "<tr name='" + data.ID + "'>" +
        //    "<td class='roomIndex'>" + (i + 1) + "</td>" +
        //    "<td>" + data.HouseID + "号办公楼</td>" +
        //    "<td>" + data.HouseSUBName + "-" + data.FloorNo + "层</td>" +
        //    "<td class='f-green cursor-p' onclick=prDispatch.getRPersonData(" + data.ID + ")>" + data.RoomName + "</td></tr>";


        

        html += "<tr name='" + data.ID + "'><td class='roomIndex'>" + data.ID + "</td><td>" + data.PName + "</td><td>" + data.DivisionName + "</td><td>" + data.TitleName + "</td><td><button id='removePerson' class='btn' onclick='_PRDispatch.prototype.joinPerson(" + data.ID + "," + roomIDVariable + ")'>移入</button></td></tr>"

        //$("#PersonVacantData").html(html);


        return html;
    }



}