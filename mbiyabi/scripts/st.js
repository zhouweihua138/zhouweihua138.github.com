/**
 * Created by Zhang on 2016/3/19.
 */
$(document).ready(function(){
    //完成tab切换操作
    $('.tab-title li a').on('click',function(){
        var obj = $(this).attr('data-click').substring(1);
        $('#'+obj).addClass('on');
        $('#'+obj).siblings('.content-box').removeClass('on');
        $(this).addClass('on');
        $(this).parent().siblings('li').children('a').removeClass('on');
    });

    //个人中心点击下滑菜单列表
    $('.uc-header .other-control').on('touchstart', function (e) {
        if ($(this).attr('data-type') == 0) {
            $(".user-mask").stop().css({ "opacity": "0.2" }).show();

            //if ($(".down-app").length > 0) {
            //    var targetHeight = 49;
            //    if (typeof($(".down-app").attr("style")) == "undefined") {
            //        targetHeight = $(".down-app").height() + 49;
            //    }else{
            //        if ($(".down-app").css("display") == "none") {
            //            targetHeight = 49;
            //        }
            //    }
            //    $(".select-list").css({ "top": targetHeight });
            //}

            $('#selectList').stop().slideDown(350);
            $(this).attr('data-type', 1);
        } else {
            $(".user-mask").stop().fadeOut(800);
            $('#selectList').stop().slideUp(350);
            $(this).attr('data-type', 0);
        }
        e.stopPropagation();   //阻止事件冒泡
    });
    $(".select-list .list-box a").on("touchstart", function (e) {
        e.stopPropagation();   //阻止事件冒泡
    });

    //个人中心点击页面收起下滑菜单列表
    $('body').on('touchstart', function () {
        if ($(".select-list").css("display") == "block") {
            $(".user-mask").fadeOut(800);
            $('.select-list').slideUp(350);
            $(".uc-header .other-control").attr('data-type', 0);
        }
    });

    $(document).on("click", ".lay-out", function () {
        hDialog.show({
            type: 'confirmB',
            tipsText: '是否退出登录？',
            callBack: function () {
                $.cookie("iUserID", null, { expires: -1, path: '/' });
                $.cookie("strPassword", null, { expires: -1, path: '/' });
                $.cookie("strAPPPwd", null, { expires: -1, path: '/' });
                localStorage.removeItem("returnUrl");   //移除掉因为验证登录保存的页面url
                window.location.href = "/login.html";
                //$.ajax({
                //    type: 'post',
                //    dataType: 'json',
                //    data: {},
                //    url: '/User/UserSignOut',
                //    success: function (json) {
                //        if (json) {
                //            window.location.href = '/user/userlogin';
                //        }
                //        else {
                //            //alert("网络错误，请稍后再试！");
                //            hDialog.show({ type: 'toast', toastText: '网络错误，请稍后再试！', toastTime: 3000, hasMask: false });
                //        }
                //    }
                //});
            },
            hasMask: false
        });
    });

});

