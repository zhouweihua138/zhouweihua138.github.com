
$(function () {
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".navbar-btn-left").html("").attr("href", "javascript:;");
    }
    var info = GetQueryString("info");  //评论信息id
    if (info != "") {
        info = parseInt(info);
    } else {
        return;
    }
    $("#iInfoID").val(info);

    //获取跟贴评论
    $.ajax({
        type: 'post',
        dataType: 'json',
        data: { "infoID": info, "pageIndex": 1, "pageSize": 300, "clientLanType": 1 },
        url: ajaxUrl + 'GetInfoReviewWithClientLanTypeJson',
        success: function (data) {
            if (data[0].ReviewID != undefined) {
                if (data.length < 1) {
                    $("#gentie-list").hide();
                    $("#gentie-list").siblings(".no-comment").show();
                    return;
                }
                var reviewListHtml = '';
                for (var i = 0; i < data.length; i++) {
                    reviewListHtml += '<li class="ub" ReviewID="' + data[i].ReviewID + '">';
                    reviewListHtml += '<img class="user-face" src="' + data[i].UserHeadImage + '" width="25" />';
                    reviewListHtml += '<div class="ub ub-f1 ub-ver"><p>';
                    reviewListHtml += '<span class="user-name">' + data[i].NickName + '</span>';
                    reviewListHtml += '<span class="pull-right">' + data[i].ReviewTime + '</span></p>';
                    reviewListHtml += '<p>' + data[i].ReviewContent + '</p></div>';
                    reviewListHtml += '<div class="context-menu"><a class="btnAt" href="javascript:;">@TA</a>|';
                    reviewListHtml += '<a class="btnReply" href="javascript:;">回复</a><i class="icon-triangle-down"><i></i></i></div></li>';
                }
                $("#gentie-list").append(reviewListHtml);
            } else {
                //无数据则显示尚无评论
                $("#gentie-list").hide();
                $("#gentie-list").siblings(".no-comment").show();
                return;
            }
        }
    });

    //获取到手评价
    $.ajax({
        type: 'post',
        dataType: 'json',
        data: { "p_iInfoID": info, "p_iPageIndex": 1, "p_iPageSize": 200, "p_iReviewType": 0 },
        url: ajaxUrl + 'OrdersCommodityReviewForInfo',
        success: function (data) {
            if (data) {
                if (data.ReviewInfoList.length < 1) {
                    $("#daoshou-list").hide();
                    $("#daoshou-list").siblings(".no-comment").show();
                    return;
                }
                var reviewListHtml = '';
                for (var i = 0; i < data.ReviewInfoList.length; i++) {
                    reviewListHtml += '<li class="ub">';
                    reviewListHtml += '<img class="user-face" src="' + data.ReviewInfoList[i].strHeadImage + '" width="25" />';
                    reviewListHtml += '<div class="ub ub-f1 ub-ver"><p>';
                    reviewListHtml += '<span class="user-name">' + data.ReviewInfoList[i].strNickname + '</span>';
                    reviewListHtml += '<span class="pull-right">' + data.ReviewInfoList[i].dtReviewTime + '</span></p>';
                    reviewListHtml += '<p>' + data.ReviewInfoList[i].strReviewContent + '</p></div></li>';
                }
                $("#daoshou-list").append(reviewListHtml);
            } else {
                //无数据则显示尚无评价
                $("#daoshou-list").hide();
                $("#daoshou-list").siblings(".no-comment").show();
                return;
            }
        }
    });

    //切换跟贴/评论
    $(document).on("click", ".tabBox .hd ul li", function () {
        var index = $(this).index();
        index == 0 ? $(".footbar").show() : $(".footbar").hide();
        $(this).siblings("li").removeClass("on");
        $(this).addClass("on");
        $(".tabBox .bd .section-box").removeClass("on").hide();
        $(".tabBox .bd .section-box").eq(index).fadeIn(300, function () {
            $(this).addClass("on");
        });
    });

    //点击评论弹出@TA和回复菜单
    $(document).on("click", ".comment-list li .ub-ver", function () {
        $(".comment-list li .context-menu").hide();
        $(this).siblings(".context-menu").fadeIn(300);
    });

    var ReviewID = 0;
    var ReviewType = 0;
    var atName = "";
    //点击@TA菜单
    $(document).on("click", ".context-menu .btnAt", function () {
        $(".comment-list li .context-menu").hide();
        atName = $(this).parents("li").find(".ub-ver .user-name").text();
        $(".footbar input[type=text]").val("@" + atName + " ").focus();
        ReviewID = $(this).parents("li").attr("ReviewID");
        ReviewType = 1;
    });

    //点击回复菜单
    $(document).on("click", ".context-menu .btnReply", function () {
        $(".comment-list li .context-menu").hide();
        atName = $(this).parents("li").find(".ub-ver .user-name").text();
        $(".footbar input[type=text]").val("").attr("placeholder", "回复" + atName + ":").focus();
        ReviewID = $(this).parents("li").attr("ReviewID");
        ReviewType = 2;
    });

    //把评论框位置放在页面上方，防止键盘遮挡输入框
    $("#content").on("focus", function () {
        $('body,html').stop().animate({ scrollTop: ($('body').height()) }, 200);
        $(this).click();
    }).on("blur", function () {
        $('body,html').stop().animate({ scrollTop:0}, 200);
    })

    //发表评论
    //$("#btnPublish").click(function () {
    $("#btnPublish").on("touchstart",function () {
        verifyLogin();
        var userInfo = getUserInfo();
        var _this = $(this);
        var content = $("#content").val().replace(/^\s+|\s+$/g, "");
        if (content.length > 0) {
            if (content.length >= 3) {
                if (ReviewType == 1) {
                    var aite = "@" + atName;
                    var reg = new RegExp(aite);
                    if (!reg.test(content)) {
                        ReviewID = 0;
                        atName = "";
                    }
                    else {
                        //回复谁的时候，判断至少输入三个字符
                        var reMsg = content.replace(aite, "").replace(/^\s+|\s+$/g, "");
                        if (reMsg.length < 3) {
                            hDialog.show({ type: 'toast', toastText: '评论内容至少3个字哦！', toastTime: 3000, hasMask: false });
                            return false;
                        }
                    }
                }
                _this.attr("disabled", "disabled");
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    data: {
                        "infoID": $("#iInfoID").val(), "citeReviewID": ReviewID, "reviewContent": content,
                        "userID": userInfo.iUserID, "nickName": userInfo.strNickname, "userHeadImage": userInfo.strHeadImage,
                        "userName": userInfo.strUserName, "userRank": userInfo.iUserRank, "infoUrl": "",
                        "reviewID": 0, "appID": 26, "appName": "mobile中文", "clientLanType": 1,
                        "isGood": 0, "isBad": 0
                    },
                    url: ajaxUrl + 'ReviewInfoInsertWithAppIDAndAppNameJson',
                    success: function (data) {
                        if (typeof(data) == "number") {        //if (parseInt(data) == 4) {
                            window.location.reload();
                            $('body,html').animate({ scrollTop: 0 }, 200);
                            _this.removeAttr("disabled");
                        }
                    }
                });
            } else {
                hDialog.show({ type: 'toast', toastText: '评论内容至少3个字哦！', toastTime: 3000, hasMask: false });
            }
        }
        else {
            //alert("请输入内容！");
            hDialog.show({ type: 'toast', toastText: '请输入内容！', toastTime: 3000, hasMask: false });
        }
    });

    //滑动页面隐藏菜单
    $(document).on("touchmove", "body", function () {
        $(".comment-list li .context-menu").hide();
    });
});