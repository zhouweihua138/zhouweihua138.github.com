
$(function () {
    verifyLogin();
    var userInfo = getUserInfo();
    var WeiXinPayUrl;    //微信支付链接

    var strOrderList = "";

    AddOrderWithCoupon();
    //提交订单
    function AddOrderWithCoupon() {
        ////localStorage方式
        //var listCommodity = localStorage.listCommodity;  //商品列表
        //if (listCommodity != "" && listCommodity != undefined) {
        //    localStorage.removeItem("listCommodity");
        //}
        //var iAddressNumber = localStorage.iAddressNumber;  //收货地址
        //if (iAddressNumber != "" && iAddressNumber != undefined) {
        //    iAddressNumber = parseInt(iAddressNumber);  //接收的参数类型是整型
        //    localStorage.removeItem("iAddressNumber");
        //}
        //var type = localStorage.type;
        //var DiscountType = localStorage.DiscountType;
        //var DisCountPrice = localStorage.DisCountPrice;

        //form表单get提交获取参数方式
        var listCommodity = decodeURI(GetQueryString('listCommodity'));  //商品列表
        listCommodity = listCommodity.replace(/%3A/g, ':');
        listCommodity = listCommodity.replace(/%2C/g, ',');

        var iAddressNumber = GetQueryString('iAddressNumber');  //收货地址
        var type = GetQueryString('type');
        var DiscountType = GetQueryString('DiscountType');
        var DisCountPrice = GetQueryString('DisCountPrice');

        //如果没有取得数据，则不提交订单
        if (listCommodity == undefined || iAddressNumber == undefined) {
            $(".navbar-box h1").text("提交订单失败，请重试");
            $('<p style="text-align:center;"><a href="javascript:history.back();" style="display:inline-block;padding:20px 0;color:#333;">返回下单页面</a></p>').insertBefore(".tips");
            $(".section-box,.section-box-title").hide();
            return;
        }

        //提交订单
        $.ajax({
            type: 'post',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: apiUrl + 'AddOrderWithCoupon',
            data: "{\"mUser\":{\"iUserID\":" + userInfo.iUserID + ",\"strAppPwd\":\"" + getstrPwd() + "\"},\"mApp\":{\"iAppID\":0,\"strAppName\":\"\",\"strAppVersion\":\"\",\"iClientLanType\":1},\"listCommodity\":" + listCommodity + ",\"iAddressNumber\":" + iAddressNumber + ",\"strVerCode\":\"\",\"iRequstType\":1}",
            success: function (data) {
                if (data.code == 200) {
                    var listOrders = data.result.orderlist;
                    var allOrdersPrice = 0;
                    for (var i = 0; i < listOrders.length; i++) {
                        allOrdersPrice += listOrders[i].modelOrderCost.decTotalPrice;
                        if (i < listOrders.length - 1) {
                            strOrderList += listOrders[i].iOrderID + ",";
                        } else {
                            strOrderList += listOrders[i].iOrderID;  //最后一项不添加逗号
                        }
                    }
                    $("#orderlist").val(strOrderList);   //保存订单号

                    //H5第一步获取微信授权Url
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        data: { "strOrderList": strOrderList },
                        url: payUrl + 'GetH5WeiXinPayUrl',
                        success: function (data) {
                            if (data.code == 200) {
                                WeiXinPayUrl = data.result;
                            }
                        }
                    });



                    //渲染页面显示信息
                    var orderInfo = '';
                    for (var i = 0; i < listOrders.length; i++) {
                        orderInfo += '<li><span>订单号：</span>' + listOrders[i].iOrderID + '<span class="pull-right">￥<label>' + listOrders[i].modelOrderCost.decTotalPrice + '</label></span></li>';
                    }
                    $(".order-info>ul").append(orderInfo);  //订单列表
                    $("#allOrdersPrice").text(allOrdersPrice);  //订单总金额

                    var viewOrder = '';
                    if (strOrderList != "") {
                        viewOrder += '<a class="link-order" href="/orderdetail.html?order=' + strOrderList.split(',')[0] + '">查看订单</a>';
                    } else {
                        viewOrder += '<a class="link-order" href="/user/userorder">查看订单</a>';
                    }
                    $(".dialog-bottom-left").append(viewOrder);

                }
                else if (data.code == -1) {
                    $(".navbar-box h1").text("提交订单失败，请重试");
                    $('<p style="text-align:center;"><a href="javascript:history.back();" style="display:inline-block;padding:20px 0;color:#333;">返回下单页面</a></p>').insertBefore(".tips");
                    $(".section-box,.section-box-title").hide();
                    hDialog.show({ type: 'toast', toastText: data.message, toastTime: 3000, hasMask: false });
                }
            }
        });
    }

    //根据浏览器显示相应的支付项， isWeiXin是public.js的公共方法
    if (!isWeiXin()) {
        //不是在微信中打开
        $("#alipay-item").show();
        $("#wxpay-item").hide();
    } else {
        //在微信中打开
        $("#wxpay-item").show();
        $("#alipay-item").hide();
    }

    //打开提示框
    $(document).on("click", ".navbar-btn-left", function () {
        $("body").css({ "height": "100%", "overflow": "hidden" });
        $(".dialog-mask, .dialog").show();
    });

    //点击"去意已决"按钮，遮罩关闭提示框
    $(document).on("click", ".link-cancle,.dialog-mask", function () {
        closePopup(function () {
            //TODO: 跳转到首页
            window.location.href = "/index.html";
        });
    });

    //查看订单按钮
    //$(document).on("click", ".link-order", function () {
    //    closePopup(function () {
    //        //TODO: 查看订单操作，跳转到订单页面
    //        window.location.href = "";
    //    });
    //});

    //我要付款按钮
    $(document).on("click", ".link-pay", function () {
        closePopup(function () {
            //TODO: 付款操作

        });
    });



    function closePopup(callBack) {
        $(".dialog-mask, .dialog").fadeOut(300, function () {
            $("body").css({ "height": "auto", "overflow": "visible" });
            if (typeof (callBack) === "function") {
                callBack();
            }
        });
    };

    //支付宝支付
    $("#alipay").click(function () {
        var orderlist = $("#orderlist").val();
        var paytype = $(this).attr("paytype");

        //var f = document.createElement("form");
        //document.body.appendChild(f);
        //f.method = "POST";
        //f.action = "/User/OrdersPayPost/?orderlist=" + orderlist + "&&paytype=" + paytype;
        //f.submit();

        $.ajax({
            url: payUrl + "GetH5PayInfo",  //支付宝和银联支付信息接口1支付宝，2银联
            type: 'post',
            data: { "orderlist": strOrderList, "iUserID": userInfo.iUserID, "paytype": 1 },
            success: function (data) {
                if (data.code == 200) {
                    $("body").append(data.result);
                } else if (data.code == 500) {
                    hDialog.show({ type: 'toast', toastText: data.result, toastTime: 3000, hasMask: false });
                } else {
                    hDialog.show({ type: 'toast', toastText: data.result, toastTime: 3000, hasMask: false });
                }
            }
        })
    });


    //银联支付
    $("#gnetepay").click(function () {
        var orderlist = $("#orderlist").val();
        var paytype = $(this).attr("paytype");

        //var f = document.createElement("form");
        //document.body.appendChild(f);
        //f.method = "POST";
        //f.action = "/User/OrdersPayPost/?orderlist=" + orderlist + "&&paytype=" + paytype;
        //f.submit();

        $.ajax({
            url: payUrl + "GetH5PayInfo",
            type: 'post',
            data: { "orderlist": strOrderList, "iUserID": userInfo.iUserID, "paytype": 2 },
            success: function (data) {
                if (data.code == 200) {
                    $("body").append(data.result);
                } else if (data.code == 500) {
                    hDialog.show({ type: 'toast', toastText: data.result, toastTime: 3000, hasMask: false });
                } else {
                    hDialog.show({ type: 'toast', toastText: data.result, toastTime: 3000, hasMask: false });
                }
            }
        })
    });

    //微信支付
    $("#weixinPay").click(function () {
        //var orderlist = $("#orderlist").val();
        //var paytype = $(this).attr("paytype");
        //var strWeiXinPayUrl = $("#strWeiXinPayUrl").val();
        //var f = document.createElement("form");
        //document.body.appendChild(f);
        //f.method = "POST";
        //f.action ="http://weixinpay.biyabi.com/MobilePayPage.aspx?orderlist=" + orderlist + "&paytype=" + paytype;
        //f.submit();
        // window.location.href = "http://weixinpay.biyabi.com/MobilePayPage.aspx?orderlist=" + orderlist + "&paytype=" + paytype;
        //window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7cba0b40f7237475&redirect_uri=http%3a%2f%2fm.biyabi.com%2fUser%2fWeiXinPay%3forderlist%3d20201679%2c20201680%26paytype%3d4&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";

        window.location.href = WeiXinPayUrl;
    });

});