
$(function () {
    verifyLogin();
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".navbar-btn-left").html("").attr("href", "javascript:;");
    }
    var userInfo = getUserInfo();

    var orderId = GetQueryString("order");
    if (orderId == "") {
        return;
    }
    orderId = parseInt(orderId);

    $.ajax({
        type: 'post',
        async: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{\"mUser\":{\"iUserID\":" + userInfo.iUserID + ",\"strAppPwd\":\"" + getstrPwd() + "\"},\"mApp\":{\"iAppID\":0,\"strAppName\":\"\",\"strAppVersion\":\"\",\"iClientLanType\":1},\"iOrderID\":" + orderId + ",\"strVerCode\":\"\",\"iRequstType\":1}",
        url: apiUrl + "GetOrdersByOrderID",
        success: function (data) {
            if (data.code == 200) {
                data = data.result;
                $("#iOrderIDText").text(orderId);
                $("#iOrderID").val(orderId);
                var clist = '';
                for (var i = 0; i < data.listOrdersCommodity.length; i++) {
                    clist += '<li class="item-detail ub">';
                    clist += '<div class="goods-img-box">';
                    clist += '<img src="' + data.listOrdersCommodity[i].strMainImage + '">';
                    clist += '</div>';
                    clist += '<div class="goods-text ub-f1">';
                    clist += '<p>' + data.listOrdersCommodity[i].strInfoTitle + '</p>';
                    clist += '<p><span>' + data.listOrdersCommodity[i].strCommodityTagName + '</span><span class="pull-right">x<label>' + data.listOrdersCommodity[i].iQuantity + '</label></span></p>';
                    clist += '<p>￥<label>' + data.listOrdersCommodity[i].decChinaPrice + '</label></p>';
                    clist += '</div></li>';
                }
                $(".goods-item>ul").append(clist);  //商品列表
            }
        }
    });

    //好中差评
    $(document).on("click", ".leavel li", function () {
        $(".leavel li a").removeClass("active");
        $(this).find("a").addClass("active");
        $("#iReviewType").val($(this).attr("iReviewType"));

    });

    //星级联动
    $(document).on("click", ".star-list li img", function () {
        var idx = $(this).index();
        var imgList = $(this).parents("li").find("img");
        var idxLi = $(this).parents("li").index();
        if (idxLi == 0) {
            $("#decAccordWithDescription").val((idx + 1) * 0.5);
        } else if (idxLi == 1) {
            $("#decService").val((idx + 1) * 0.5);
        } else if (idxLi == 2) {
            $("#decDeliverySpeed").val((idx + 1) * 0.5);
        } else if (idxLi == 3) {
            $("#decLogisticsSpeed").val((idx + 1) * 0.5);
        }
        for (var i = 0; i < imgList.length; i++) {
            if (i <= idx) {
                var _src = imgList.eq(i).attr("src");
                if (_src.substring(_src.length - 6, _src.length - 4) != "on") {
                    var newSrc = _src.substring(0, _src.length - 4) + "_on.png";
                    imgList.eq(i).attr("src", newSrc);
                }
            } else {
                var _src = imgList.eq(i).attr("src");
                if (_src.substring(_src.length - 6, _src.length - 4) == "on") {
                    var newSrc = _src.substring(0, _src.length - 7) + ".png";
                    imgList.eq(i).attr("src", newSrc);
                }
            }
        }
    });

    //提交评价
    $(document).on("click", ".navbar .navbar-btn-right", function () {
        var strReviewContent = $("#strReviewContent").val();
        var iReviewType = $("#iReviewType").val();
        var decAccordWithDescription = $("#decAccordWithDescription").val();
        var decService = $("#decService").val();
        var decDeliverySpeed = $("#decDeliverySpeed").val();
        var decLogisticsSpeed = $("#decLogisticsSpeed").val();
        if (strReviewContent.length == 0 || strReviewContent.length > 500) {
            //alert("评论字数不多于500！");
            hDialog.show({ type: 'toast', toastText: '评论字数不能为0且不多于500！', toastTime: 2000, hasMask: false });

            return false;
        }
        if (iReviewType.length == 0) {
            //alert("请选择评价！");
            hDialog.show({ type: 'toast', toastText: '请选择评价！', toastTime: 2000, hasMask: false });
            return false;
        }
        if (decAccordWithDescription.length == 0) {
            //alert("请给描述相符评分！");
            hDialog.show({ type: 'toast', toastText: '请给描述相符评分！', toastTime: 2000, hasMask: false });
            return false;
        }
        if (decService.length == 0) {
            //alert("请给服务态度评分！");
            hDialog.show({ type: 'toast', toastText: '请给服务态度评分！', toastTime: 2000, hasMask: false });
            return false;
        }
        if (decDeliverySpeed.length == 0) {
            //alert("请给发货速度评分！");
            hDialog.show({ type: 'toast', toastText: '请给发货速度评分！', toastTime: 2000, hasMask: false });
            return false;
        }
        if (decLogisticsSpeed.length == 0) {
            //alert("请给物流速度评分！");
            hDialog.show({ type: 'toast', toastText: '请给物流速度评分！', toastTime: 2000, hasMask: false });
            return false;
        }

        var formData = $("#frm").serialize() + '&p_iUserID=' + userInfo.iUserID + '&p_strPwd=' + getstrPwd();
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: formData,
            url: ajaxUrl + 'OrdersCommodityReviewInsert',
            success: function (data) {
                if (data) {
                    window.location.href = '/user/userorder';
                }
            }
        });

    });
});