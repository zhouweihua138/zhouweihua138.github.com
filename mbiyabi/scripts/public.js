/**
 * Created by Zhang on 2016/3/19. 
 */

//百度统计
var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?7566abf7fed47f35fbc01a9e11deb788";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

//百度链接自动提交工具代码
(function () {
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();

$(document).ready(function () {
    //下载app用户关闭之后一天内不再显示
    if ($.cookie("isDownloadClosed")) {
        $('.down-app').css('display', 'none');
    }
    //关闭下载app
    $('.down-app .close-download').on('click', function () {
        $('.down-app').css('display', 'none');
        $(".select-list").removeAttr("style");
        $.cookie("isDownloadClosed", true, { expires: 1, path: '/' });
    });

    //返回顶部
    $(document).on("touchstart", '.back-up', function () {
        $('body,html').animate({ scrollTop: 0 }, 200);
    })
    //滚动位置判断收起返回顶部按钮
    $(document).on("scroll", function (e) {
        if ($(document).scrollTop() > $(window).height() / 3) {
            $(".back-up").show();
        } else {
            $(".back-up").hide();
        }
        //滑动页面固定顶部导航栏
        if ($(".header-box").length > 0) {    //导航写法1
            if ($(document).scrollTop() >= $(".header-box").offset().top) {
                $(".header").css({ "position": "fixed", "top": "0" });
            } else {
                $(".header").removeAttr("style");
            }
        }
        if ($(".navbar-box").length > 0) {   //导航写法2
            if ($(document).scrollTop() >= $(".navbar-box").offset().top) {
                $(".navbar").css({ "position": "fixed", "top": "0" });
            } else {
                $(".navbar").removeAttr("style");
            }
        }
    })
});

//图片大小处理
function drawImg(img, type) {
    var image = new Image();
    image.src = img.src;
    var naturalWidth = image.width;
    var naturalHeight = image.height;
    if (type == 1) {
        if (naturalWidth < naturalHeight) {
            img.style.width = "60%";
        }
    } else if (type == 2) {
        if (naturalHeight / naturalWidth > 1.3) {
            img.style.width = "83%";
        }
    } else if (type == 3) {
        if (naturalWidth < naturalHeight) {
            img.style.width = "54%";
        }
    }
}


//webservice接口地址
//var ajaxUrl = "http://211.151.52.200:8082/WebService.asmx/";
//支付接口地址
//var payUrl = "http://211.151.52.139:9899/webservice.asmx/";

//API接口地址
//var apiUrl = "http://211.151.52.139:8087/api/Page/App/";

////测试版
//var ajaxUrl = "http://123.207.96.81:7000/webservice.asmx/";
//var apiUrl = "http://123.207.96.81:7000/api/Page/App/";
//var payUrl = "http://123.207.96.81:7000/webservice.asmx/";

////java版
//var ajaxUrl = "http://api.bybhwg.com/webservice.asmx/";
//var apiUrl = "http://api.bybhwg.com/api/Page/App/";
//var payUrl = "http://api.bybhwg.com/webservice.asmx/";

//新版
var ajaxUrl = "https://openapi.biyabi.com/webservice.asmx/";
var apiUrl = "https://openapi.biyabi.com/api/Page/App/";
var payUrl = "https://openapi.biyabi.com/webservice.asmx/";

////39
//var ajaxUrl = "http://192.168.3.39:8080/webservice.asmx/";
//var apiUrl = "http://192.168.3.39:8080/api/Page/App/";
//var payUrl = "http://192.168.3.39:8080/webservice.asmx/";




/*
/ 依赖jquery, jquery.cookie
/ 
*/

//判断用户是否登录
function userloginStatus() {
    var bool = false;
    //var userid = $.cookie("iUserID");
    //var strPwd = $.cookie("strPassword");
    //var strDesTime = $.cookie("strDesTime");

    ////RSA加密
    ////Encrypt with the public key...
    //var timestamp = Math.round(new Date().getTime() / 1000)  //Unix时间戳(Unix timestamp)
    //var strPwdTime = strPwd + strDesTime;
    //var encrypt = new JSEncrypt();
    //var pubkey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDhQg6PquOyX15BywcKQuo1MjihrPEkHw57JbH1PNAFWaMUKgmk8rnb6RQNY4OlyuULBnHEZIbNSJd1sA+FPDZ8n50wvgaZ+ITZG/jhp7lvmFNbt5R69mD3i4GA9BlM2VDeqdrGDw/o+mnD3MxdAFALCmSSTo6W7ohYN5M3ltL4WQIDAQAB";
    //encrypt.setPublicKey(pubkey);
    //var encrypted = encrypt.encrypt(strPwdTime);
    //strPwd = encrypted;

    var userid = $.cookie("iUserID");
    var strPwd = getstrPwd();
    if (typeof (strPwd) == "undefined" || typeof (userid) == "undefined") {

    } else {

        $.ajax({
            type: 'post',
            dataType: 'json',
            data: { "p_iUserID": userid, "p_strPwd": strPwd, "appID": 26, "appName": "mobile中文" },
            url: ajaxUrl + 'GetUserInfo',
            async: false,
            success: function (data) {
                data.iUserID != "" ? bool = true : bool = false;
            }
        });
    }
    return bool;
}

//需登录权限验证，未登录则跳转到登录页面
function verifyLogin() {
    var boolUserLogin = userloginStatus();
    if (!boolUserLogin) {
        localStorage.returnUrl = window.location.href;
        window.location.href = '/userlogin';
        return false;
    }
}

//获取用户信息
function getUserInfo() {
    var userInfo;
    var userid = $.cookie("iUserID");
    var strPwd = getstrPwd();


    if (typeof (strPwd) == "undefined" || typeof (userid) == "undefined" && userid != null) {

    } else {
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: { "p_iUserID": userid, "p_strPwd": strPwd, "appID": 26, "appName": "mobile中文" },
            url: ajaxUrl + 'GetUserInfo',
            async: false,
            success: function (data) {
                //成功！
                if (data.appResult.iResultCode == 0) {
                    userInfo = data;
                }
            }
        });
    }
    return userInfo;
}

//获取cookie记录的密码
function getstrPwd() {
    var strPwd = $.cookie("strPassword");  //账号登录的密码
    var strAPPPwd = $.cookie("strAPPPwd"); //手机登录的密码
    if (typeof (strPwd) != "undefined") {
        //如果有账号登录的密码则使用它
    }
    else if (typeof (strAPPPwd) != "undefined") {  //strAPPPwd != ""
        strPwd = strAPPPwd;
    }
    return strPwd;
}

//获取用户关注Json
function getFansJson() {
    var fans;
    var userInfo = getUserInfo();
    if (typeof (userInfo) != "undefined") {
        $.ajax({
            type: 'post',
            dataType: 'json',
            //data: { "loguserid": "18453936", "pwd": "", "userid": "18453936", "page": 1, "pagesize": 1000 },
            data: { "loguserid": userInfo.iUserID, "pwd": "", "userid": userInfo.iUserID, "page": 1, "pagesize": 1000 },
            url: ajaxUrl + 'GetFansByUserID',
            async: false,
            success: function (data) {
                //成功！
                fans = data;
            }
        });
    }
    return fans
}

//获取url参数：参数为参数名称
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}

// 求两个时间的天数差 日期格式为 YYYY-MM-dd
function daysBetween(DateOne, DateTwo) {
    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
    var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
    var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
    var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

    var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
    return Math.abs(cha);
}

//把接口返回的日期时间格式化为优惠券列表专用格式
function formatDateForCoupon(strDateTime) {
    var strDate = strDateTime.substring(0, strDateTime.indexOf(" "));
    strDate = strDate.replace(/\//g, ".");
    return strDate;
}

//把接口返回的日期时间格式化为：yyyy-MM-dd hh:mm:ss
function formatDateNormal(strDateTime) {
    var strDate = strDateTime.substring(0, strDateTime.indexOf("T"));
    var strTime = " " + strDateTime.substring(strDateTime.indexOf("T") + 1, strDateTime.indexOf("."));
    strDate = strDate.replace(/\//g, "-");
    return strDate + strTime;
}

//把优惠券满100-10的数据100,10格式化为10
function formatDiscountsExceptComma(strDiscounts) {
    var douhao = ",";  //优惠额包含逗号,
    var reg = new RegExp(douhao);
    var discounts = strDiscounts;
    if (reg.test(strDiscounts)) {
        discounts = strDiscounts.substring(strDiscounts.lastIndexOf(",") + 1, strDiscounts.length);  //截取最后一个逗号后的字符
    }
    return discounts;
}

//判断是否在微信内置浏览器打开
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

//获取浏览器当前页是否含历史记录，没有前一页历史，则返回false
function getHasHistory() {
    var hasHistory = false;
    if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE 
        if (history.length > 0) {  //当前窗口包含的历史记录条数 
            hasHistory = true;
        } else {
            hasHistory = false;
        }
    } else { //非IE浏览器 
        if (navigator.userAgent.indexOf('Firefox') >= 0 ||
        navigator.userAgent.indexOf('Opera') >= 0 ||
        navigator.userAgent.indexOf('Safari') >= 0 ||
        navigator.userAgent.indexOf('Chrome') >= 0 ||
        navigator.userAgent.indexOf('WebKit') >= 0) {
            if (window.history.length > 1) {
                hasHistory = true;
            } else {
                hasHistory = false;
            }
        }
    }
    return hasHistory;
}

function getIdFromUrl(strUrl) {
    var id = 0;
    var indexQuestion1 = strUrl.lastIndexOf('?');
    var indexQuestion2 = strUrl.lastIndexOf('/?');
    var indexQuestion3 = strUrl.lastIndexOf('/#');

    //if (indexQuestion < 0) {
    //    id = strUrl.substring(strUrl.lastIndexOf('/') + 1);
    //} else {
    //    id = strUrl.substring(0, indexQuestion).substring(strUrl.lastIndexOf('/') + 1);
    //}

    var indexQuestion = -1;

    if (indexQuestion1 > 0) {
        if (indexQuestion2 > 0) {
            indexQuestion = indexQuestion2;
        }
    }

    if (indexQuestion < 0) {
        id = strUrl.substring(strUrl.lastIndexOf('/') + 1);
    } else {
        var afterUrl = strUrl.substring(0, indexQuestion);
        id = strUrl.substring(0, indexQuestion).substring(afterUrl.lastIndexOf('/') + 1);
    }
    
    return id;
}