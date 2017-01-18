/**
 * Created by Zhang on 2016/4/13.
 */

$(document).ready(function () {
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".uc-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }

    //防止键盘挡住输入框
    //$('input[type=text], input[type=password]').on('focus', function () {
    //    var inputTop = $(this)[0].offsetTop;
    //    var targetTop = -(inputTop - $(".header").height() - 15);
    //    $(this).parents("body").css({ "position": "fixed", "top": targetTop + "px", "z-index": "999" });
    //}).on('blur', function () {
    //    $(this).parents("body").css({ "position": "static", "top": "auto" });
    //});

    var userInfo = getUserInfo();
    if (userInfo != undefined) {
        window.location.href = "/index.html";
        return false;
    }

    //匹配手机登录号码是否完全输入
    $('#mobile').on('input change blur', function () {
        var inputObj = $(this);
        var val = inputObj.val();
        if (/^1[\d]{10}$/.test(val)) {
            //已经获取验证码在倒计时就不可点击
            if (inputObj.siblings('.get-code').text() == "获取验证码") {
                inputObj.siblings('.get-code').addClass('active');
            }
            inputObj.siblings('.code').prop('readonly', false);
            if (/^[\d]{4}$/.test($('#validateCode').val())) {
                $('#validateCode').siblings('.login-btn').addClass('valid');
            }
        } else {
            inputObj.siblings('.get-code').removeClass('active');
            inputObj.siblings('.code').prop('readonly', 'readonly');
            $('#validateCode').siblings('.login-btn').removeClass('valid');
        }
    });
    $('#validateCode').on('input change blur', function () {
        var codeObj = $(this);
        var codeNum = codeObj.val();
        if (/^[\d]{4}$/.test(codeNum)) {
            codeObj.siblings('input[type=submit]').prop('disabled', false);
            //codeObj.siblings('input[type=submit]').addClass('valid');
            codeObj.siblings('.login-btn').addClass('valid');
        } else {
            codeObj.siblings('input[type=submit]').prop('disabled', 'disabled');
            //codeObj.siblings('input[type=submit]').removeClass('valid');
            codeObj.siblings('.login-btn').removeClass('valid');
        }
    });

    //匹配账号密码是否输入
    $('#username').on('input change blur', function () {
        var unObj = $(this);
        var str = unObj.val();
        if (str != '') {
            //unObj.siblings('input[type=password]').prop('readonly', false);
            if ($('#password').val() != '') {    //用户名和密码都不为空则登录按钮加激活可点击状态
                $('.login-btn').addClass('valid');
            } else {
                $('.login-btn').removeClass('valid');
            }
        } else {
            //unObj.siblings('input[type=password]').prop('readonly', true);
            $('.login-btn').removeClass('valid');
        }
    });
    $('#password').on('input change blur', function () {
        var pwObj = $(this);
        var pwNum = pwObj.val();
        if (pwNum != '') {
            //pwObj.siblings('input[type=submit]').prop('disabled', false);
            //pwObj.siblings('input[type=submit]').addClass('valid');
            if ($('#username').val() != '') {
                pwObj.siblings('.login-btn').addClass('valid');
            } else {
                pwObj.siblings('.login-btn').removeClass('valid');
            }
        } else {
            pwObj.siblings('.login-btn').removeClass('valid');
        }
    });

    //手机登录获取验证码
    $(".get-code").click(function () {
        //获取验证码按钮可以点击
        //if (!$(this).prop('readonly')) 
        //    MobileSendCaptcha($("#mobile").val(), 2);
        if ($(this).hasClass("active")) {
            getValidImage($("#mobile").val());
            $(".sendcode-dialog-box").css({ "opacity": "1", "visibility": "visible" }); //.addClass("show");  //弹出验证框

            $("body").on("touchmove", function (e) {
                e.preventDefault();
            });
        }
    });

    //点击验证码图片
    $(".valid-img").on("click", function () {
        getValidImage($("#mobile").val());
    });

    //点击确认按钮
    $(".sendcode-btn-ok").on('click', function () {
        var $this = $(this);
        if ($this.hasClass("disabled")) {

        } else {
            $this.addClass("disabled").text("正在处理...");
            if ($(".textvalidcode").val() != "") {
                var mobile = $("#mobile").val();
                var validCode = $(".textvalidcode").val();

                //RSA加密
                //Encrypt with the public key...
                var timestamp = Math.round(new Date().getTime() / 1000)  //Unix时间戳(Unix timestamp)
                var validStr = mobile + "|" + validCode + "|" + timestamp;
                var encrypt = new JSEncrypt();
                var pubkey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDhQg6PquOyX15BywcKQuo1MjihrPEkHw57JbH1PNAFWaMUKgmk8rnb6RQNY4OlyuULBnHEZIbNSJd1sA+FPDZ8n50wvgaZ+ITZG/jhp7lvmFNbt5R69mD3i4GA9BlM2VDeqdrGDw/o+mnD3MxdAFALCmSSTo6W7ohYN5M3ltL4WQIDAQAB";
                encrypt.setPublicKey(pubkey);
                var encrypted = encrypt.encrypt(validStr);
                validCode = encrypted;

                //验证码输入是否有效
                $.ajax({
                    url: ajaxUrl + 'ValidPhoneCode',
                    type: 'post',
                    data: { "validCode": validCode, "captchaType": 2 },
                    dataType: 'json',
                    success: function (data) {
                        //验证失败 {"iResultCode":102,"strResultDescription":"验证码不正确"}
                        //验证成功 {"iResultCode":0,"strResultDescription":"验证码发送成功"}
                        if (data.iResultCode == 0) {
                            hDialog.show({ type: 'toast', toastText: '短信发送成功！', toastTime: 3000, toastBottom: '58%', hasMask: false });
                            $this.removeClass("disabled").text("确认");
                            closeDialogImage();
                            //倒数六十秒
                            i = 61;
                            fnCountdown();
                        }
                        else {
                            hDialog.show({ type: 'toast', toastText: '验证码不正确！', toastTime: 3000, toastBottom: '58%', hasMask: false });
                            //getValidImage($(".textvalidcode").val());
                            getValidImage($("#mobile").val());
                            $this.removeClass("disabled").text("确认");
                            $(".textvalidcode").select().focus();
                        }
                    }
                });

                ////发送验证码
                //$.ajax({
                //    type: 'post',
                //    dataType: "json",
                //    url: '/Validation/MobileSendCaptcha',
                //    data: { "mobile": mobile, "captchaType": captchaType },
                //    success: function (data) {
                //        if (data.iResultCode == 0) {
                //            //alert("发送成功！");
                //            hDialog.show({ type: 'toast', toastText: '发送成功！', toastTime: 2000, hasMask: false });
                //        }
                //        else {
                //            //alert(data.strResultDescription);
                //            hDialog.show({ type: 'toast', toastText: data.strResultDescription, toastTime: 3000, hasMask: false });
                //        }
                //    }
                //});
            } else {
                hDialog.show({ type: 'toast', toastText: '验证码不能为空！', toastTime: 3000, toastBottom: '58%', hasMask: false });
                $(".textvalidcode").focus();
                $this.removeClass("disabled").text("确认");
            }
        }
    });
    //关闭验证框
    $(".sendcode-btn-close, .sendcode-dialog-mask").on("touchend", function () {
        closeDialogImage();
    });


    //点击手机登录
    $("#btnLogin").click(function () {
        if ($(this).hasClass("valid")) {
            var mobile = $("#mobile").val();
            var captcha = $("#validateCode").val();
            if (mobile.length == 0 || captcha.length == 0) {
                //alert("请输入验证码");
                return false;
            }
            $.ajax({
                type: 'post',
                dataType: "json",
                url: ajaxUrl + 'MobileLogin',
                data: { "mobile": mobile, "captcha": captcha, "appID": 26, "appName": "mobile中文" },
                success: function (data) {
                    //成功！
                    if (data.appResult.iResultCode == 0) {
                        //保存cookie保持登录
                        //$.cookie("iUserID", null);
                        //$.cookie("strPassword", null);
                        //$.cookie("strDesTime", null);
                        //$.cookie("iUserID", data.iUserID, { expires: 365, path: '/' });
                        //$.cookie("strPassword", data.strPassword, { expires: 365, path: '/' });
                        //$.cookie("strDesTime", data.strDesTime, { expires: 365, path: '/' });


                        $.cookie("iUserID", null);
                        $.cookie("strAPPPwd", null);
                        $.cookie("iUserID", data.iUserID, { expires: 365, path: '/' });
                        $.cookie("strAPPPwd", data.strAPPPwd, { expires: 365, path: '/' });

                        //alert("登录成功！");
                        hDialog.show({ type: 'toast', toastText: '登录成功！', toastTime: 1000, hasMask: false });
                        var returnUrl = localStorage.returnUrl;
                        if (returnUrl != "" && returnUrl != undefined) {
                            //localStorage.returnUrl = "";
                            localStorage.removeItem("returnUrl");
                            window.location.href = returnUrl;
                        }
                        else {
                            window.location.href = "/index.html";
                        }
                    }
                    else {
                        //alert(data.appResult.strResultDescription);
                        hDialog.show({ type: 'alert', tipsText: data.appResult.strResultDescription, hasMask: false });
                    }
                }
            });
        }
    });


    //点击账号登录
    $("#btnLogin2").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
        if (username.length == 0 || password.length == 0) {
            //alert("请输入完整信息！");
            //hDialog.show({ type: 'alert', tipsText: '请输入完整信息！', hasMask: false });
            return false;
        }

        //RSA加密
        //Encrypt with the public key...
        var timestamp = Math.round(new Date().getTime() / 1000)  //Unix时间戳(Unix timestamp)
        var strPwd = password + timestamp;
        var encrypt = new JSEncrypt();
        var pubkey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDhQg6PquOyX15BywcKQuo1MjihrPEkHw57JbH1PNAFWaMUKgmk8rnb6RQNY4OlyuULBnHEZIbNSJd1sA+FPDZ8n50wvgaZ+ITZG/jhp7lvmFNbt5R69mD3i4GA9BlM2VDeqdrGDw/o+mnD3MxdAFALCmSSTo6W7ohYN5M3ltL4WQIDAQAB";
        encrypt.setPublicKey(pubkey);
        var encrypted = encrypt.encrypt(strPwd);
        enPassword = encrypted;

        $.ajax({
            type: 'post',
            dataType: "json",
            url: ajaxUrl + 'APPVerifyLogin',
            data: { "userNameOrEmail": username, "password": enPassword, "appID": 26, "appName": "mobile中文" },
            success: function (data) {
                //成功！
                if (data.appResult.iResultCode == 0) {
                    //保存cookie保持登录
                    $.cookie("iUserID", null);
                    //$.cookie("userNameOrEmail", null);
                    $.cookie("strPassword", null);
                    $.cookie("iUserID", data.iUserID, { expires: 365, path: '/' });
                    //$.cookie("userNameOrEmail", username, { expires: 365, path: '/' });
                    //$.cookie("strPassword", enPassword, { expires: 365, path: '/' });  //直接加密的方式不正确
                    //$.cookie("strPassword", password, { expires: 365, path: '/' });
                    //$.cookie("strDesTime", data.strDesTime, { expires: 365, path: '/' });  //保存原始密码和desTime的方式能看到明文密码不安全

                    //var strPwdTime = password + data.strDesTime;
                    //var encrypt = new JSEncrypt();
                    //var pubkey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDhQg6PquOyX15BywcKQuo1MjihrPEkHw57JbH1PNAFWaMUKgmk8rnb6RQNY4OlyuULBnHEZIbNSJd1sA+FPDZ8n50wvgaZ+ITZG/jhp7lvmFNbt5R69mD3i4GA9BlM2VDeqdrGDw/o+mnD3MxdAFALCmSSTo6W7ohYN5M3ltL4WQIDAQAB";
                    //encrypt.setPublicKey(pubkey);
                    //var encrypted = encrypt.encrypt(strPwdTime);
                    //$.cookie("strPassword", encrypted, { expires: 365, path: '/' });

                    $.cookie("strPassword", data.strAPPPwd, { expires: 365, path: '/' });
                    


                    //测试用杨旭的账号看下单优惠券可选列表，物流信息
                    //$.cookie("iUserID", 18150006, { expires: 365, path: '/' });
                    //$.cookie("strPassword", "gPUUbysvG3lIxc0KLAPA0munwykNBTOd9vmeMwIPPMk1V/jM3bgnoUEO7zAu8fQqBpA2xxu+C2DElv/OrEGXkpFyNbVuljkV6+5iQgqet/Nd5SYFaLiXftVf7/i6uKqXbqAYhb4fwANNqsmcI9sMLKImH6z3k+dNkydGdfPsLxo=", { expires: 365, path: '/' });
                    //以上是测试代码，上线要清除


                    //alert("登录成功！");
                    hDialog.show({ type: 'toast', toastText: '登录成功！', toastTime: 2000, hasMask: false });
                    var returnUrl = localStorage.returnUrl;
                    if (returnUrl != "" && returnUrl != undefined) {
                        //localStorage.returnUrl = "";
                        localStorage.removeItem("returnUrl");
                        window.location.href = returnUrl;
                    }
                    else {
                        window.location.href = "/index.html";
                    }
                }
                else {
                    //alert(data.appResult.strResultDescription);
                    hDialog.show({ type: 'alert', tipsText: data.appResult.strResultDescription, hasMask: false });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                hDialog.show({ type: 'toast', toastText: '账号或密码错误！', toastTime: 2000, hasMask: false });
            }
        });
    });
});

//倒计时
function fnCountdown() {
    i--;
    if (i == -1) {
        $(".login-form .get-code").addClass("active");
        $(".login-form .get-code").text("获取验证码");
        i = 61;
    }
    else {
        $(".login-form .get-code").removeClass("active");
        $(".login-form .get-code").text("已发送" + i + "秒");
        setTimeout("fnCountdown()", 1000);
    }
}


//发送同步请求获取手机验证码
function getValidImage(mobile) {
    //$("#phoneImage").attr("src", ajaxUrl + 'GetPhoneValidCodeForH5?MobilePhone=' + mobile + '&n='+ Math.random(1,10000));    //.net为h5版专门写的返回图片接口
    $.ajax({
        type: 'post',
        dataType: 'json',
        data: { "MobilePhone": mobile },
        url: ajaxUrl + 'GetPhoneValidCode',
        asnyc: false,
        success: function (data) {
            //{"iResultCode":0,"strResultDescription":"验证码发送成功","strPhoneValidUrl":"http://pic.biyabi.com/validcode_image/2016/7/9/20160709104503_2289_5041.jpg"}
            if (data.iResultCode == 0) {
                $("#phoneImage").attr("src", data.strPhoneValidUrl);
            }
            else {
                hDialog.show({ type: 'toast', toastText: '网络错误，请稍后再试！', toastTime: 3000, toastBottom: '58%', hasMask: false });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            /*弹出jqXHR对象的信息*/
            var data = jqXHR.responseText;
            if (data) {
                $("#phoneImage").attr("src", data);
            }
            else {
                hDialog.show({ type: 'toast', toastText: '网络错误，请稍后再试！', toastTime: 3000, toastBottom: '58%', hasMask: false });
            }
        }
    });
}
//关闭验证码弹窗
function closeDialogImage() {
    $(".sendcode-dialog-box").css({ "-webkit-transition": "all .5s ease", "transition": "all .5s ease", "opacity": "0" });  //.removeClass("show");
    $("body").off("touchmove");
    setTimeout(function () {
        $(".sendcode-dialog-box").css({ "visibility": "hidden" });  //防止点击“取消”关闭按钮时按到其他按钮
        $(".sendcode-dialog-box").css({ "-webkit-transition": "none", "transition": "none", "opacity": "1" });
        //$(".sendcode-dialog-box").remove();
    }, 800);
}
