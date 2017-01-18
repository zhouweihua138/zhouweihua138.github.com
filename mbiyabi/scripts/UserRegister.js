
$(function () {
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
        } else {
            inputObj.siblings('.get-code').removeClass('active');
            inputObj.siblings('.code').prop('readonly', 'readonly');
        }
    });
    $('#validateCode').on('input change blur', function () {
        var codeObj = $(this);
        var codeNum = codeObj.val();
        if (/^[\d]{4}$/.test(codeNum)) {
            codeObj.siblings('input[type=submit]').prop('disabled', false);
            //codeObj.siblings('input[type=submit]').addClass('valid');
            if ($('#password').val() != '' && $("#username").val() != '') {
                codeObj.siblings('.login-btn').addClass('valid');
            }
        } else {
            codeObj.siblings('input[type=submit]').prop('disabled', 'disabled');
            //codeObj.siblings('input[type=submit]').removeClass('valid');
            codeObj.siblings('.login-btn').removeClass('valid');
        }
    });
    $('#password').on('input change blur', function () {
        var pwObj = $(this);
        var pwNum = pwObj.val();
        var mobile = $("#mobile").val();
        var captcha = $("#validateCode").val();
        var nickname = $("#username").val();
        var password = $("#password").val();
        if (pwNum != '') {
            pwObj.siblings('input[type=submit]').prop('disabled', false);
            //pwObj.siblings('input[type=submit]').addClass('valid');
            if (mobile.length == 0 || captcha.length == 0 || nickname.length == 0) {
                pwObj.siblings('.login-btn').removeClass('valid');
            } else {
                pwObj.siblings('.login-btn').addClass('valid');
            }
        } else {
            pwObj.siblings('.login-btn').removeClass('valid');
        }
    });

    //发送验证码
    $(".get-code").click(function () {
        var mobile = $("#mobile").val();
        if (mobile.length == 0) {
            //alert("请输入手机号!");
            //hDialog.show({ type: 'toast', toastText: '请输入手机号!', toastTime: 3000, hasMask: false });
            return;
        }
        if ($(this).hasClass("active")) {
            getValidImage(mobile);
            $(".sendcode-dialog-box").css({ "opacity": "1", "visibility": "visible" }); //弹出验证框
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
                //验证码输入是否有效
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

                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    data: { "validCode": validCode, "captchaType": 1 },
                    url: ajaxUrl + 'ValidPhoneCode',
                    success: function (data) {
                        //验证失败 {"iResultCode":102,"strResultDescription":"验证码不正确"}
                        //验证成功 {"iResultCode":0,"strResultDescription":"验证码发送成功"}
                        if (data.iResultCode == 0) {
                            hDialog.show({ type: 'toast', toastText: '验证码发送成功！', toastTime: 3000, toastBottom: '58%', hasMask: false });
                            $this.removeClass("disabled").text("确认");
                            closeDialogImage();
                            //倒数六十秒
                            i = 61;
                            fnCountdown();
                        }
                        else {
                            hDialog.show({ type: 'toast', toastText: data.strResultDescription, toastTime: 3000, toastBottom: '58%', hasMask: false });
                            //getValidImage($(".textvalidcode").val());
                            getValidImage($("#mobile").val());
                            $this.removeClass("disabled").text("确认");
                            $(".textvalidcode").select().focus();
                        }
                    }
                });
            } else {
                //alert("验证码不正确");
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


    //注册
    $("#btnRegister").click(function () {
        var mobile = $("#mobile").val();
        var captcha = $("#validateCode").val();
        var nickname = $("#username").val();
        var password = $("#password").val();
        if (mobile.length == 0 || captcha.length == 0 || nickname.length == 0 || password.length == 0) {
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
        password = encrypted;

        $.ajax({
            type: 'post',
            dataType: "json",
            url: ajaxUrl + 'MobileRegister',
            //data: $("#frm").serialize(),
            data: { "mobile": mobile, "password": password, "captcha": captcha, "nickname": nickname, "appName": "mobile中文", "appID": 26 },
            success: function (data) {
                //alert(data.appResult.strResultDescription);
                hDialog.show({ type: 'toast', toastText: data.appResult.strResultDescription, toastTime: 3000, hasMask: false });
                //成功！
                if (data.appResult.iResultCode == 0) {
                    window.location.href = "/index.html";
                }

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
    //$("#phoneImage").attr("src", ajaxUrl + 'GetPhoneValidCodeForH5?MobilePhone=' + mobile + '&n=' + Math.random(1, 10000));    //.net版本专门为h5写的返回图片接口
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
