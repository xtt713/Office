function _common() {

}
_common.prototype = {
    //加载html文本
    initHtml: function (src, target, callback) {
        $.get(src, function (data, textStatus) {
            var result = data;
            target.empty().html(result);
            callback();
        });
    },
    //对象去重
    unique: function (arr, key) {
        if (arr[0].ImgType == 5) {
            arr[0].ImgPath = "";
        }
        var n = [arr[0]];//数组对象中第一个值
        //遍历数组，

        for (var i = 1; i < arr.length; i++) {
            //如果传参为空，就把整个数组arr传给n;反之，则
            if (key === undefined) {
                if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
            } else {
                inner: {
                    
                    var has = false;
                    for (var j = 0; j < n.length; j++) {
                        if (arr[i].ImgType == '5') {
                            arr[i].ImgPath = "";
                        }
                        if (arr[i][key] == n[j][key]) {
                            has = true;
                            if (arr[i].ImgType == '4') {
                                n[j].ImgPath = arr[i].ImgPath;
                            }
                            break inner;
                        }
                    }
                }
                if (!has) {
                    n.push(arr[i]);
                }
            }
        }
        return n;
    },
    //1为主页，2为退出点击
    clickEvent: function (type, permissionStr) {
        switch (type) {
            case "1":
                window.location.href = 'home.html';
                break;
            case "2":
                
                $(function () {
                    if (window.history && window.history.pushState) {
                        $(window).on('popstate', function () {
                            window.history.pushState('forward', null, '#');
                            window.history.forward(1);
                        });
                    }
                    window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
                    window.history.forward(1);
                    window.location.href = 'login.html';
                })
                
                break;
            case '3':
                sessionStorage.setItem("permissionID", permissionStr);
                window.location.href = 'PRoomMag.html';

        }
    },
    //获取文件名
    getFileName: function (filePath) {
        var index1 = filePath.length;
        var index2 = filePath.lastIndexOf("\\");
        var index3 = filePath.substring(index2+1, index1);
        return index3;
    },
    //文件上传功能
    fileUpload: function (file) {
        $.ajaxFileUpload({
            type:'POST',
            url: './Svr/HandlerCommon.ashx',
            data: { cmd: 'fileUpload', fileType: file.fileType, sType:file.sType,SID:file.SID, uploadTime: file.uploadTime, fileName: file.fileName },
            dataType: 'json',
            fileElementId:[file.ID],
            success: function (result) {
                swal("提示", "添加图片成功", "success");
                if (file.fileType == "img") {
                    roomMag.getImgList("theRoomImg", file.SID);
                } else if (file.fileType == "pano") {
                    roomMag.getImgList("theRoomPano", file.SID);
                } else {

                }
            }, error: function (error) {
                console.log(error);
            }
        })
    },
    //时间格式转换
    formatTime: function (date) {
        //获取传参的年月日
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
        var day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
        var hour = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
        var minute = date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
        var second = date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }
    
}
var common = new _common();


