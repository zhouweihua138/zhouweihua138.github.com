//
// 修改密码页面脚本
//

var i = 0;  //倒计时-倒数秒数

$(function () {
    $.ajax({
        url: ajaxUrl + "VarifyValidateCode",
        type: 'POST',
        data: {
            id: GetQueryString("id"),
            validateCode: GetQueryString("code")
        },
        dataType: "json",
        success: function (data) {
            if (parseInt(data.code) == 200) {
                $(".expired-box").hide();
                $(".register-form").show();
                hDialog.show({ type: 'toast', toastText: data.message, toastTime: 3000, hasMask: false });
            } else {
                $(".register-form").hide();
                $(".expired-box").show();
                i = 6;
                fnCountdown();
                hDialog.show({ type: 'toast', toastText: data.message, toastTime: 3000, hasMask: false });
            }
        },
        error: function (xhrRes) {
            $(".register-form").hide();
            var data = eval('(' + xhrRes.responseText + ')');
            if (data != undefined) {
                hDialog.show({ type: 'toast', toastText: data.message, toastTime: 3000, hasMask: false });
            }
        }
    });

    $("#btnSetPassword").on("click", function () {
        $(this).removeClass("valid");
        var pwd = $("#password").val();  //新密码
        var repwd = $("#repassword").val();  //确认密码
        if (pwd == "") {
            hDialog.show({ type: 'toast', toastText: '请输入密码！', toastTime: 3000, hasMask: false });
            $("#password").focus();
            $(this).addClass("valid");
            return;
        }
        if (pwd.length < 6) {
            hDialog.show({ type: 'toast', toastText: '密码不能少于6个字符！', toastTime: 3000, hasMask: false });
            $("#password").focus();
            $(this).addClass("valid");
            return;
        }
        if (repwd == "") {
            hDialog.show({ type: 'toast', toastText: '请输入确认密码！', toastTime: 3000, hasMask: false });
            $("#repassword").focus();
            $(this).addClass("valid");
            return;
        }

        if (pwd != repwd) {
            hDialog.show({ type: 'toast', toastText: '两次输入的密码不一致！', toastTime: 3000, hasMask: false });
            $("#repassword").focus();
            $(this).addClass("valid");
            return;
        }

        //RSA加密
        //Encrypt with the public key...
        var timestamp = Math.round(new Date().getTime() / 1000)  //Unix时间戳(Unix timestamp)
        var strPwd = repwd + timestamp;
        var encrypt = new JSEncrypt();
        var pubkey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDhQg6PquOyX15BywcKQuo1MjihrPEkHw57JbH1PNAFWaMUKgmk8rnb6RQNY4OlyuULBnHEZIbNSJd1sA+FPDZ8n50wvgaZ+ITZG/jhp7lvmFNbt5R69mD3i4GA9BlM2VDeqdrGDw/o+mnD3MxdAFALCmSSTo6W7ohYN5M3ltL4WQIDAQAB";
        encrypt.setPublicKey(pubkey);
        var encrypted = encrypt.encrypt(strPwd);
        var rsaPassword = encrypted;

        $.ajax({
            url: ajaxUrl + "ResetPasswordByValidateCode",
            type: 'POST',
            data: {
                id: GetQueryString("id"),
                validateCode: GetQueryString("code"),
                rsaPassword: rsaPassword
            },
            dataType: "json",
            success: function (data) {
                if (parseInt(data.code) == 200) {
                    hDialog.show({ type: 'toast', toastText: data.message, toastTime: 3000, hasMask: false });
                    window.location.href = "/userlogin";
                } else {
                    $(".register-form").hide();
                    $(".expired-box").show();
                    i = 6;
                    fnCountdown();
                    hDialog.show({ type: 'toast', toastText: data.message, toastTime: 3000, hasMask: false });
                }

                $(this).addClass("valid");
            },
            error: function (xhrRes) {
                var data = eval('(' + xhrRes.responseText + ')');
                if (data != undefined) {
                    hDialog.show({ type: 'toast', toastText: data.message, toastTime: 3000, hasMask: false });
                }

                $(this).addClass("valid");
            }
        });
    })
});

//倒计时
function fnCountdown() {
    i--;
    if (i == 0) {
        window.location.href = "/forgetpassword.html";
    }
    else {
        $("#countDown").text(i);
        setTimeout("fnCountdown()", 1000);
    }
}
