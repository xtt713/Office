$(function () {
    //读取保存的cookie值
    var userNameValue = getCookieValue("txtUserName");
    $("#txtUserName").val(userNameValue);
    var passwordValue = getCookieValue("txtUserPwd");
    $("#txtUserPwd").val(passwordValue);
    if (userNameValue != "" && passwordValue != "") {
        $('#Repassword').attr("checked", 'true');
    }
    $("#btnUserLogin").click(function () {
        var userName = $("#txtUserName").val();
        var password = $("#txtUserPwd").val();
        if (userName == "" || userName == null) {
            // alert("请输入用户名"); return;
            infoDialog("请输入用户名"); return
        }
        if (password == "" || password == null) {
            // alert("请输入密码"); return;
            infoDialog("请输入密码"); return
        }
        if (password.length > 0 && userName.length > 0) {
            //访问服务端，验证用户名和密码的正确性后登录
            //添加访问服务端的函数
            //添加服务端服务-》验证用户名密码
            $.ajax({
                url: "./Svr/HandlerOffice.ashx",
                data: { cmd: "Office", userName: userName, password: password },
                async: true,
                type: 'post',//HTTP请求类型
                dataType: "json",
                success: function (data) {
                    if (data.length == 0) {
                        alert("您的用户名或密码错误，请重新输入！");
                        return;
                    }
                    else if (data[0].UserState == 200) {
                        //判断用是否点击记住密码
                        if ($('#Repassword').is(':checked')) {
                            setCookie("txtUserName", $("#txtUserName").val(), 24, "/");
                            setCookie("txtUserPwd", $("#txtUserPwd").val(), 24, "/");
                        } else {
                            deleteCookie("txtUserName", "/");
                            deleteCookie("txtUserPwd", "/");
                        }
                        sessionStorage.setItem('permissionID', data[0].PermissionID);
                        window.location.href = 'Default.aspx?adnm=' + data[0].userName;
                    } else {
                    }
                },
                error: function () {
                }
            });
        } else {
            alert("您的输入有误，请重新输入！");
        }
    });

    //回车键
    document.onkeydown = function (event) {
        if (event.keyCode == 13) {
            $("#btnUserLogin").click();
        }
    }

});
//设置cookie
function setCookie(cookieName, cookieValue, cookieExpires, cookiePath) {
    cookieValue = escape(cookieValue);//编码latin-1
    cookieName = escape(cookieName);
    if (cookieExpires == "") {
        var nowDate = new Date();
        nowDate.setMonth(nowDate.getMonth() + 6);
        cookieExpires = nowDate.toGMTString();
    }
    if (cookiePath != "") {
        cookiePath = ";Path=" + cookiePath;
    }
    document.cookie = cookieName + "=" + cookieValue + ";expires=" + cookieExpires + cookiePath;
}
//获取cookie
function getCookieValue(cookieName) {
    var cookieValue = document.cookie;
    var cookieStartAt = cookieValue.indexOf("" + cookieName + "=");
    if (cookieStartAt == -1) {
        cookieStartAt = cookieValue.indexOf(cookieName + "=");
    }
    if (cookieStartAt == -1) {
        cookieValue = null;
    }
    else {
        cookieStartAt = cookieValue.indexOf("=", cookieStartAt) + 1;
        cookieEndAt = cookieValue.indexOf(";", cookieStartAt);
        if (cookieEndAt == -1) {
            cookieEndAt = cookieValue.length;
        }
        cookieValue = unescape(cookieValue.substring(cookieStartAt, cookieEndAt));//解码latin-1
    }
    return cookieValue;
}
function deleteCookie(name) {//为cookie name
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = name + "=a; expires=" + date.toGMTString();
}