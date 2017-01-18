
$(function () {
    verifyLogin();
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".uc-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }
    var userInfo = getUserInfo();

    var orderId = GetQueryString("order");
    if (orderId == "") {
        return;
    }
    orderId = parseInt(orderId);

    var iOrderID, commodityCount, iOrdersCommodityID;

    //获取订单信息
    getOrderInfo();
    function getOrderInfo() {
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

                    //查看物流需要的数据
                    iOrderID = data.iOrderID;
                    commodityCount = data.listOrdersCommodity.length;
                    iOrdersCommodityID = data.listOrdersCommodity[0].iOrdersCommodityID;

                    var orderIdHtml = '订单编号：' + data.iOrderID + '<span class="pull-right">' + formatDateNormal(data.dtOrderTime) + '</span>';
                    $(".order-info .order-id").html(orderIdHtml);
                    $(".order-info .order-status").html(data.strOrderStatusDes);

                    var addr = '';
                    addr += '<p>' + data.strContacts + '<span>' + data.strIDCardNumber + '</span></p>';
                    addr += '<p>' + data.strMobilePhone + '</p>';
                    addr += '<p>' + data.strProvinceName + data.strCityName + data.strDistrictName + '</p>';
                    addr += '<p>' + data.strAddress + '</p>';
                    $("#address-info").html(addr);
                    $("#strMallName").text(data.strMallName);
                    $("#transferLine").text(data.strChannelNickName);  //转运线路

                    //商品列表
                    var goodsList = '';
                    for (var i = 0; i < data.listOrdersCommodity.length; i++) {
                        goodsList += '<li class="ub">';
                        goodsList += '<a class="ub ub-ac ub-pc" href="/detail/' + data.listOrdersCommodity[i].iInfoID + '">';
                        goodsList += '<img src="' + data.listOrdersCommodity[i].strMainImage + '" width="74" /></a>';
                        goodsList += '<div class="ub-f1">';
                        goodsList += '<a href="/detail/' + data.listOrdersCommodity[i].iInfoID + '"><h4>' + data.listOrdersCommodity[i].strInfoTitle + '</h4></a>';
                        goodsList += '<p>' + data.listOrdersCommodity[i].strCommodityTagName + '<span class="pull-right">x<label>' + data.listOrdersCommodity[i].iQuantity + '</label></span></p>';
                        goodsList += '<p>￥<label>' + data.listOrdersCommodity[i].decChinaPrice + '</label></p></div></li>';
                    }
                    $(".goods-list").append(goodsList);
                    //费用列表
                    $("#decCommodityPrice").text(data.modelOrderCost.decCommodityPrice);
                    $("#decFremdnessFee").text(data.modelOrderCost.decFremdnessFee);
                    $("#decPurchasingFee").text(data.modelOrderCost.decPurchasingFee);
                    $("#decTax").text(data.modelOrderCost.decTax);
                    $("#decDiscounts").text(data.modelOrderCost.decDiscounts);
                    $("#decTotalPrice").text(data.modelOrderCost.decTotalPrice);
                    //根据订单状态显示操作按钮
                    var btnList = '';
                    switch (parseInt(data.iOrderStatus)) {
                        case 1:
                            btnList += '<a href="javascript:;" class="ke-btnCancel" OrderID="' + data.iOrderID + '">取消订单</a> ';
                            btnList += '<a href="/payorder.html?order=' + data.iOrderID + '&decTotalPrice=' + data.modelOrderCost.decTotalPrice + '">马上付款</a>';
                            break;
                        case 2:
                            btnList += '<a href="javascript:;" class="ke-btnCancel" OrderID="' + data.iOrderID + '">取消订单</a>';
                            break;
                        case 4:
                            break;
                        case 5:
                            btnList += '<a href="javascript:;" class="ke-btnTransport">查看物流</a> ';
                            btnList += '<a href="javascript:;" class="ke-btnReceiptOrder" OrderID="' + data.iOrderID + '">确认收货</a>';
                            break;
                        case 6:
                            btnList += '<a href="javascript:;" class="ke-btnDelete" OrderID="@Model.iOrderID">删除订单</a> ';
                            btnList += '<a href="javascript:;" class="ke-btnTransport">查看物流</a> ';
                            if (Model.listOrdersCommodity[0].iIsReview == 2) {
                                btnList += '<a href="/revieworder.html?order=' + data.iOrderID + '">评价订单</a>';
                            }
                            break;
                        case 7:
                            btnList += '<a href="javascript:;" class="ke-btnDelete" OrderID="' + data.iOrderID + '">删除订单</a>';
                            break;
                        default:
                            break;
                    }
                    $(".footbar").append(btnList);

                }
            }
        });
    }

    //点击取消订单
    $(document).on("click", ".ke-btnCancel", function () {
        var obj = $(this);
        //调用弹出框插件
        hDialog.show({
            type: 'confirm',
            title: '取消订单',
            tipsText: '选择原因',
            options: [
                { value: "不想买", text: "不想买" },
                { value: "重复下单", text: "重复下单" },
                { value: "信息错误", text: "信息错误" },
                { value: "其他原因", text: "其他原因" }],
            strBottomRight1: '提交',
            callBack: function () {  //点击提交的操作
                var reasonType = $(".select-reason").val();  //取消原因
                var reasonBuchong = $(".input-reason").val();  //补充原因
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    data: {
                        "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd(),
                        "p_OrderID": obj.attr("OrderID"), "p_CloseMark": reasonType + ":" + reasonBuchong
                    },
                    url: ajaxUrl + 'CancelOrder',
                    success: function (json) {
                        if (json) {
                            //取消订单成功后，按钮只剩下删除订单按钮
                            var str = '<a href="javascript:;" class="ke-btnDelete"  OrderID="' + obj.attr("OrderID") + '">删除订单</a>';
                            obj.parent().html(str);
                        }
                        else {
                            //alert("网络错误，请稍后再试！");
                            hDialog.show({ type: 'toast', toastText: '网络错误，请稍后再试！', toastTime: 3000, hasMask: false });
                        }
                    }
                });

            },
            clickDomCancel: true
        })
    });


    ////点击取消订单
    //$(".ke-btnCancel").click(function () {
    //    var obj = $(this);
    //    if (confirm("是否取消订单?")) {
    //        $.ajax({
    //            type: 'post',
    //            dataType: 'json',
    //            data: { "iOrderID": obj.attr("OrderID") },
    //            url: '/User/UserCancelOrder',
    //            success: function (json) {
    //                if (json) {
    //                    //取消订单成功后，按钮变成删除订单按钮
    //                    obj.attr("class", "qx-pay btn-delete ke-btnDelete");
    //                    obj.text("删除订单");
    //                }
    //                else {
    //                    alert("网络错误，请稍后再试！");
    //                }
    //            }
    //        });
    //    }
    //});




    //点击删除订单
    $(document).on("click", ".ke-btnDelete", function () {
        var obj = $(this);
        //if (confirm("是否删除订单?")) {
        //    $.ajax({
        //        type: 'post',
        //        dataType: 'json',
        //        data: { "iOrderID":obj.attr("OrderID") },
        //        url: '/User/UserDeleteOrder',
        //        success: function (json) {
        //            //返回  true 或 false
        //            if (json) {
        //                //alert("删除成功！");
        //                hDialog.show({ type: 'toast', toastText: '删除成功！', toastTime: 3000, hasMask: false });
        //                window.location.href = '/user/userorder';
        //            }
        //            else {
        //                //alert("网络错误，请稍后再试！");
        //                hDialog.show({ type: 'toast', toastText: '网络错误，请稍后再试！', toastTime: 3000, hasMask: false });
        //            }
        //        }
        //    });
        //}

        hDialog.show({
            type: 'confirmB',
            tipsText: '是否删除订单?',
            callBack: function () {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    data: {
                        "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd(),
                        "p_OrderID": obj.attr("OrderID")
                    },
                    url: ajaxUrl + 'DeleteOrder',
                    success: function (json) {
                        //返回  true 或 false
                        if (json) {
                            //alert("删除成功！");
                            hDialog.show({ type: 'toast', toastText: '删除成功！', toastTime: 3000, hasMask: false });
                            window.location.href = '/user/userorder';
                        }
                        else {
                            //alert("网络错误，请稍后再试！");
                            hDialog.show({ type: 'toast', toastText: '网络错误，请稍后再试！', toastTime: 3000, hasMask: false });
                        }

                    }
                });
            },
            hasMask: false
        });
    });

    //点击确认收货
    $(document).on("click", ".ke-btnReceiptOrder", function () {
        var obj = $(this);
        //if (confirm("是否确认收货?")) {
        //    $.ajax({
        //        type: 'post',
        //        dataType: 'json',
        //        data: { "iOrderID": obj.attr("OrderID") },
        //        url: '/User/UserReceiptOrder',
        //        success: function (json) {
        //            //返回  true 或 false
        //            if (json) {
        //                var OrderID = obj.attr("OrderID");
        //                var str = ' <a href="javascript:;" class="ke-btnDelete" OrderID="' + OrderID + '">删除订单</a>';
        //                str += '<a href="javascript:;" class="ke-btnTransport">查看物流</a>';
        //                //str += '<a href="javascript:;">评价订单</a>';
        //                obj.parent().html(str);
        //            }
        //            else {
        //                //alert("网络错误，请稍后再试！");
        //                hDialog.show({ type: 'toast', toastText: '网络错误，请稍后再试！', toastTime: 3000, hasMask: false });
        //            }
        //        }
        //    });
        //}

        hDialog.show({
            type: 'confirmB',
            tipsText: '是否确认收货？',
            callBack: function () {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    data: {
                        "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd(), "p_CloseMark": "",
                        "p_OrderID": obj.attr("OrderID")
                    },
                    url: ajaxUrl + 'ReceiptOrder',
                    success: function (json) {
                        //返回  true 或 false
                        if (json) {
                            var OrderID = obj.attr("OrderID");
                            var str = ' <a href="javascript:;" class="ke-btnDelete" OrderID="' + OrderID + '">删除订单</a>';
                            str += '<a href="javascript:;" class="ke-btnTransport">查看物流</a>';
                            //str += '<a href="javascript:;">评价订单</a>';
                            obj.parent().html(str);
                        }
                        else {
                            //alert("网络错误，请稍后再试！");
                            hDialog.show({ type: 'toast', toastText: '网络错误，请稍后再试！', toastTime: 3000, hasMask: false });
                        }
                    }
                });
            },
            hasMask: false
        });
    });


    //点击查看物流
    $(document).on("click", ".ke-btnTransport", function () {
        var count = commodityCount;
        var link = '';
        if (count > 1) {
            //跳到订单商品查看列表
            link = '/logisticslist.html?order=' + iOrderID;
        }
        else {
            //跳到单个商品物流信息页面
            link = '/logistics.html?order=' + iOrderID + '&commodity=' + iOrdersCommodityID;
        }
        window.location.href = link;
    });


});