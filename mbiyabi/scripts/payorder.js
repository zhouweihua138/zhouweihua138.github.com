
$(function () {
    verifyLogin();
    var userInfo = getUserInfo();
    var decTotalPrice = GetQueryString("decTotalPrice");  //获取订单总金额

    var strOrderList = GetQueryString("order");  //从地址栏读取orderList

    var WeiXinPayUrl;
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

    renderPage();
    //渲染页面元素
    function renderPage() {
        var orderInfo = '<li><span>订单号：</span>' + strOrderList + '</li>';
        $(".order-info>ul").append(orderInfo);  //订单列表
        $("#allOrdersPrice").text(decTotalPrice);  //订单总金额

        var viewOrder = '';
        if (strOrderList != "") {
            viewOrder += '<a class="link-order" href="/orderdetail.html?order=' + strOrderList.split(',')[0] + '">查看订单</a>';
        } else {
            viewOrder += '<a class="link-order" href="/user/userorder">查看订单</a>';
        }
        $(".dialog-bottom-left").append(viewOrder);


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
    $(document).on("click", ".link-order", function () {
        closePopup(function () {
            //TODO: 查看订单操作，跳转到订单页面
            window.location.href = "";
        });
    });

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
            url: payUrl + "GetH5PayInfo",
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


        window.location.href = WeiXinPayUrl;    //支付链接
    });

});