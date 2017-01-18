
$(function () {
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".uc-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }
    //var giftID = parseInt(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));

    var giftID = "";
    var indexQuestion = window.location.href.lastIndexOf('?');
    if (window.location.href.lastIndexOf('/')+1 == window.location.href.length) {
        
    }
    if (indexQuestion > 0) {
        var url = window.location.href.substring(0, indexQuestion);
    } else {
        var url = window.location.href
    }
    for (var i = 0; i < url.length; i++) {
        if (!isNaN(url[i])) {
            giftID += url[i];
        }
    }
    if (giftID == "") {
        window.location.href = "/coupon.html";
    }

    var userInfo = getUserInfo();
    var reduceScore, //兑换的时候需要的参数
        reduceGold,
        giftID2,
        giftName,
        discounts,
        startTime,
        endTime,
        giftType,
        reduceScore,
        reduceGold,
        mallUrl,
        mallName;

    //优惠券ID转化成数字不成功
    if (isNaN(giftID)) {
        return;
    }
    $.ajax({
        type: 'post',
        dataType: 'json',
        data: { "giftID": giftID, "giftName": "", "giftType": 0 },
        url: ajaxUrl + 'GetGiftDetailJson',
        success: function (data) {
            if (data.length > 0) {
                data = data[0];
                if (data.GiftID == undefined) {
                    $("#gift-detail-box").append('<p style="text-align:center;">未查到相关优惠券详情，请重试</p>');
                    $(".yhq-item,.bottom").hide();
                    return;
                }
                var giftHtml = '';
                giftHtml += '<div class="lbq-box cl"><span>￥</span>';
                giftHtml += '<span>' + formatDiscountsExceptComma(data.Discounts) + '</span>';
                giftHtml += '<div class="xr-lbq"><p></p>';
                giftHtml += '<p>' + data.GiftName + '</p></div></div>';
                //giftHtml += '<p>' + formatDateForCoupon(data.StartTime) + '-' + formatDateForCoupon(data.EndTime) + '</p>';
                giftHtml += '<p>' + data.StartTime + '-' + data.EndTime + '</p>';
                $(".yhq-item .yhq-detail").append(giftHtml);

                var giftDetailHtml = '';
                giftDetailHtml += '<p>优惠额度：' + data.Discounts + '</p>';
                //giftDetailHtml += '<p>有效日期：' + formatDateForCoupon(data.StartTime) + '-' + formatDateForCoupon(data.EndTime) + '</p>';
                giftDetailHtml += '<p>有效日期：' + data.StartTime + '-' + data.EndTime + '</p>';
                giftDetailHtml += '<p>优惠劵数：' + data.GiftCount + '</p>';
                giftDetailHtml += '<h1>使用说明：</h1>';
                giftDetailHtml += '<p>' + data.GiftContent + '</p>';
                $("#gift-detail-box").append(giftDetailHtml);

                var recieveHtml = '';
                recieveHtml += '<p><span>兑换积分：<i>' + data.ReduceScore + '</i></span><span>金币：<i>' + data.ReduceGold + '</i></span></p>';
                if (userInfo != undefined) {
                    recieveHtml += '<p><span>我的积分：<i>' + userInfo.iUserScore + '</i></span><span>金币：<i>' + userInfo.iUserGold + '</i></span></p>';
                }
                $(".bottom .desc").append(recieveHtml);


                reduceScore = data.ReduceScore;
                reduceGold = data.ReduceGold;
                giftID2 = data.GiftID;
                giftName = data.GiftName;
                discounts = data.Discounts;
                startTime = data.StartTime;
                endTime = data.EndTime;
                giftType = data.GiftType;
                reduceScore = data.ReduceScore;
                reduceGold = data.ReduceGold;
                mallUrl = data.MallUrl;
                mallName = data.MallName;
            } else {
                $(".yhq-item,.section-box,.bottom").hide();
            }
        }
    });

    //点击兑换
    $("#btnRecieve").click(function () {
        verifyLogin();
        hDialog.show({
            type: 'confirmB',
            tipsText: '兑换将扣取积分：' + reduceScore + ' 和金币：' + reduceGold,
            callBack: function () {
                $.ajax({
                    type: "post",
                    dataType: 'json',
                    data: {
                        "userID": userInfo.iUserID, "userName": userInfo.strUserName, "nickName": userInfo.strNickname,
                        "giftID": giftID2, "giftName": giftName, "discounts": discounts,
                        "startTime": startTime, "endTime": endTime, "giftType": giftType,
                        "reduceScore": reduceScore, "reduceGold": reduceGold,
                        "mallUrl": mallUrl, "mallName": "", "mobile": userInfo.strMobile
                    },
                    url: ajaxUrl + 'UserExchangeApplyJson',
                    success: function (data) {
                        //[{"result":"True","CouponCode":"FC889412","statusCode":"0","CouponPwd":""}]
                        if (data[0].result == "True") {
                            //alert("兑换成功！");
                            hDialog.show({ type: 'toast', toastText: '兑换成功！', toastTime: 3000, hasMask: false });
                            window.location.href = "/usercoupon.html";
                        }
                        else {
                            //alert("兑换失败！");
                            hDialog.show({ type: 'alert', tipsText: '对不起，优惠券兑换失败，可能原因：1、优惠券已被兑换完或兑换次数限制 2、您的积分或金币不足。如有疑问，请联系比呀比微信客服：buyerbi', hasMask: false });

                        }
                    }
                });
            },
            hasMask: false
        });
    });
});