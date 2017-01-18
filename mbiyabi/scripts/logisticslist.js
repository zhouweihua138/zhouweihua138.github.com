
$(function () {
    verifyLogin();
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".navbar-btn-left").html("").attr("href", "javascript:;");
    }
    var userInfo = getUserInfo();
    var orderId = GetQueryString("order");  //获取地址栏订单ID

    getLogisticsList();
    //获取物流列表
    function getLogisticsList() {
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: {
                "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd(), "p_iOrderID": orderId
            },
            url: ajaxUrl + 'OrdersLogisticsListQuery',
            success: function (data) {
                if (data.iOrderID != 0) {
                    $(".delivery-top-id").text("订单编号：" + data.iOrderID);

                    var cl = '';
                    for (var i = 0; i < data.listOrdersCommodity.length; i++) {
                        cl += '<li class="item-detail ub ub-ver">';
                        cl += '<div class="ub">';
                        cl += '<div class="order-img-box">';
                        cl += '<img src="' + data.listOrdersCommodity[i].strMainImage + '">';
                        cl += '</div>';
                        cl += '<div class="order-text ub-f1">';
                        cl += '<p>' + data.listOrdersCommodity[i].strInfoTitle + '</p>';
                        cl += '<p><span>' + data.listOrdersCommodity[i].strCommodityTagName + '</span></p>';
                        cl += '<p>￥' + Math.round(data.listOrdersCommodity[i].decCommodityPrice * data.modelOrderCost.decExchangeRate * 100) / 100 + ' x ' + data.listOrdersCommodity[i].iQuantity + '</p>';
                        cl += '</div>';
                        cl += '</div>';
                        cl += '<a class="ub has-angle" href="/logistics.html?order=' + data.iOrderID + '&commodity=' + data.listOrdersCommodity[i].iOrdersCommodityID + '">';
                        cl += '<p class="ub-f1">查看物流信息</p>';
                        cl += '<span class="ub ub-ac ub-pc">';
                        cl += '<i class="fa fa-angle-right fa-2x"></i>';
                        cl += '</span>';
                        cl += '</a>';
                        cl += '</li>';
                    }
                    $(".order-item-style2>ul").append(cl);
                } else {
                    $(".delivery-top-id").text("ooo oh~  暂无物流信息~");
                }
            }
        });
    }
})