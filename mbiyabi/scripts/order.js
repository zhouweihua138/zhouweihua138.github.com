
$(function () {
    verifyLogin();
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".uc-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }
    var userInfo = getUserInfo();

    var index = 0;
    //绑定数据
    var counter = 1;  //当前页
    // 每页展示8个
    var num = 8;
    var tab1LoadEnd = false;
    var tab2LoadEnd = false;
    var tab3LoadEnd = false;
    var tab4LoadEnd = false;
    var tab5LoadEnd = false;
    var iOrderStatus = 0;  //订单状态：0全部 、100进行中、1待付款、6已完成、7已关闭

    $(document).on("click", ".segmented-control .control-item", function () {
        $(".segmented-control .control-item").removeClass("active");
        $(this).addClass("active");
        index = $(this).index();
        counter = 1;
        //$(".order-content .control-content").hide();

        //$(".order-content .control-content").eq(index).show(function () {
        //    $(".order-content .control-content").removeClass("active");
        //    $(this).addClass("active");
        //});

        $(".order-content .control-content").removeClass("active");
        $(".order-content .control-content").eq(index).addClass("active");
        // 如果选中菜单一
        if (index == 0) {//加载全部
            counter = 1;
            iOrderStatus = 0;
            // 如果数据没有加载完
            if (!tab1LoadEnd) {
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }
            // 如果选中菜单二
        } else if (index == 1) {
            counter = 1;
            iOrderStatus = 100;
            if (!tab2LoadEnd) {
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }
        } else if (index == 2) {
            counter = 1;
            iOrderStatus = 6;
            if (!tab3LoadEnd) {
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }
        } else if (index == 3) {
            counter = 1;
            iOrderStatus = 1;
            if (!tab4LoadEnd) {
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }
        } else if (index == 4) {
            counter = 1;
            iOrderStatus = 7;
            if (!tab5LoadEnd) {
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }
        }
        // 重置
        dropload.resetload();
    });

    var dropload = $('.order-content').dropload({
        scrollArea: window,
        //threshold: 2,  //提前加载距离
        //distance: 50,  //拉动距离
        loadDownFn: function (me) {
            $.ajax({
                type: 'post',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{\"mUser\":{\"iUserID\":" + userInfo.iUserID + ",\"strAppPwd\":\"" + getstrPwd() + "\"},\"mApp\":{\"iAppID\":0,\"strAppName\":\"\",\"strAppVersion\":\"\",\"iClientLanType\":1},\"iOrderStatus\":" + iOrderStatus + ",\"iPageIndex\":" + counter + ",\"iPageSize\":" + num + ",\"strVerCode\":\"\",\"iRequstType\":1}",
                async: false,
                url: apiUrl + 'GetOrderListByUser',
                success: function (json) {
                    var str = "";
                    var unPayOrdersCount = 0;
                    if (json.code == 200 && json.result.length > 0) {
                        counter++;
                        ////加载全部
                        //if (index == 0) {
                        //    for (var i = 0; i < json.result.length; i++) {
                        //        //没有统计未付款订单数量的接口，之前是获取1000条之后做统计的，现在改成分页方式不能进行操作
                        //        //if (json.result[i].iOrderStatus == 1) {
                        //        //    unPayOrdersCount++;
                        //        //}
                        //        //$("#unPayOrdersCount").text(unPayOrdersCount);
                        //        //if (unPayOrdersCount == 0) {
                        //        //    $("#unPayOrdersCount").hide();
                        //        //}
                        //        //else {
                        //        //    $("#unPayOrdersCount").show();
                        //        //}
                        //        str += bindOrdersString(json.result[i]);
                        //    }
                        //}
                        //else if (index == 1) {
                        //    for (var i = 0; i < json.result.length; i++) {
                        //        if (parseInt(json.result[i].iOrderStatus) == 2 || parseInt(json.result[i].iOrderStatus) == 4 || parseInt(json.result[i].iOrderStatus) == 5) {
                        //            str += bindOrdersString(json.result[i]);
                        //        }
                        //    }
                        //}
                        //else if (index == 2) {
                        //    for (var i = 0; i < json.result.length; i++) {
                        //        if (parseInt(json.result[i].iOrderStatus) == 6) {
                        //            str += bindOrdersString(json.result[i]);
                        //        }
                        //    }
                        //}
                        //else if (index == 3) {
                        //    for (var i = 0; i < json.result.length; i++) {
                        //        if (parseInt(json.result[i].iOrderStatus) == 1) {
                        //            str += bindOrdersString(json.result[i]);
                        //        }
                        //    }
                        //}
                        //else if (index == 4) {
                        //    for (var i = 0; i < json.result.length; i++) {
                        //        if (parseInt(json.result[i].iOrderStatus) == 7) {
                        //            str += bindOrdersString(json.result[i]);
                        //        }
                        //    }
                        //}

                        for (var i = 0; i < json.result.length; i++) {
                            str += bindOrdersString(json.result[i]);
                        }

                        //分页单页数量少于分页size时则数据已加载完
                        if (json.result.length < num) {
                            if (index == 0) {
                                tab1LoadEnd = true;
                            }
                            else if (index == 1) {
                                tab2LoadEnd = true;
                            }
                            else if (index == 2) {
                                tab3LoadEnd = true;
                            }
                            else if (index == 3) {
                                tab4LoadEnd = true;
                            }
                            else if (index == 4) {
                                tab5LoadEnd = true;
                            }
                            me.lock();
                            me.noData();
                        }
                        if (counter <= 2) {
                            $(".order-content .control-content").eq(index).html(str);
                        } else {
                            $(".order-content .control-content").eq(index).append(str);
                        }
                    } else {
                        me.lock();
                        me.noData();
                    }
                    // 每次数据加载完，必须重置
                    me.resetload();

                    //等异步拼接字符串完成后，注册点击事件
                    loadEvent();
                }
            });
        }
    });


    //绑定
    function bindOrdersString(data) {
        var str = '';
        str += '<li class="order-item">';
        str += ' <div class="item-title"><span>订单号：' + data.iOrderID + '</span><a class="color-red" href="/orderdetail.html?order=' + data.iOrderID + '">订单详情></a></div>';
        str += '<a href="/orderdetail.html?order=' + data.iOrderID + '">';
        //循环商品信息
        for (var i = 0; i < data.listOrdersCommodity.length; i++) {
            str += ' <div class="item-detail ub">';
            str += '<div class="order-img-box">';
            str += ' <img src="' + data.listOrdersCommodity[i].strMainImage + '">';
            str += '</div>';
            str += '<div class="order-text ub-f1">';
            str += '<p>' + data.listOrdersCommodity[i].strInfoTitle + '</p>';
            str += '<p><span>' + data.listOrdersCommodity[i].strCommodityTagName + '</span><span class="pull-right">x' + data.listOrdersCommodity[i].iQuantity + '</span></p>';
            str += '<p>￥' + data.listOrdersCommodity[i].decChinaPrice + '</p>';
            str += '</div>';
            str += '</div>';
        }
        str += '</a>';
        str += '<div class="order-money clearfix">';
        str += '<span>合计：￥' + data.modelOrderCost.decTotalPrice + '</span>';
        str += '</div>';
        str += '<div class="order-money clearfix" style="border-top:1px solid #f2f2f2;">';
        //未付款
        if (data.iOrderStatus == 1) {
            str += '<a href="/payorder.html?order=' + data.iOrderID + '&decTotalPrice=' + data.modelOrderCost.decTotalPrice + '" class="qx-pay">马上付款</a>';
            str += '<a class="qx-pay btn-cancel ke-btnCancel" href="javascript:;" OrderID="' + data.iOrderID + '">取消订单</a>';
        } //已付款
        else if (data.iOrderStatus == 2) {
            str += '<a class="qx-pay btn-cancel ke-btnCancel" href="javascript:;" OrderID="' + data.iOrderID + '">取消订单</a>';
        }//待发货
        else if (data.iOrderStatus == 4) {

        } //已发货
        else if (data.iOrderStatus == 5) {
            str += '<a class="qx-pay btn-delivery ke-btnTransport" href="javascript:;" OrderID="' + data.iOrderID + '" OrdersCommodityID="' + data.listOrdersCommodity[0].iOrdersCommodityID + '"  >查看物流</a>';
            str += '<a class="qx-pay btn-shouhuo ke-btnReceiptOrder" href="javascript:;" OrderID="' + data.iOrderID + '"  OrdersCommodityID="' + data.listOrdersCommodity[0].iOrdersCommodityID + '">确认收货</a>';
        } //交易成功
        else if (data.iOrderStatus == 6) {
            str += '<a class="qx-pay btn-delete ke-btnDelete" href="javascript:;"  OrderID="' + data.iOrderID + '">删除订单</a>';
            str += '<a class="qx-pay btn-delivery ke-btnTransport" href="javascript:;" OrderID="' + data.iOrderID + '" OrdersCommodityID="' + data.listOrdersCommodity[0].iOrdersCommodityID + '"  >查看物流</a>';
            if (data.listOrdersCommodity[0].iIsReview == 2) {
                str += '<a href="/revieworder.html?order=' + data.iOrderID + '" class="qx-pay btn-comment ke-btnReviewOrder" OrderID="' + data.iOrderID + '" OrdersCommodityID="' + data.listOrdersCommodity[0].iOrdersCommodityID + '">评价订单</a>';
            }
        }//交易关闭
        else if (data.iOrderStatus == 7) {
            str += '<a class="qx-pay btn-delete ke-btnDelete" href="javascript:;" OrderID="' + data.iOrderID + '">删除订单</a>';
        }
        str += '</div>';
        str += '</li>';
        return str;
    }

    //刚加载的时候，触发全部订单点击事件
    //$(".control-item").first().click();

    //等异步拼接字符串完成后，注册点击事件
    function loadEvent() {


        //点击取消订单
        $(document).on("click", ".order-money .qx-pay.btn-cancel", function () {
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
                                var str = '<a class="qx-pay btn-delete ke-btnDelete" href="javascript:;"  OrderID="' + obj.attr("OrderID") + '">删除订单</a>';
                                obj.parent().html(str);
                                window.location.href = "/user/userorder";
                            }
                            else {
                                alert("网络错误，请稍后再试！");
                                //hDialog.show({ type: 'toast', toastText: '网络错误，请稍后再试！', toastTime: 2000, hasMask: false });
                            }

                        }
                    });

                },
                clickDomCancel: true
            })
        });


        //点击删除订单
        $(document).on("click", ".ke-btnDelete", function () {
            var obj = $(this);
            //if (confirm("是否删除订单?")) {
            //    $.ajax({
            //        type: 'post',
            //        dataType: 'json',
            //        data: { "iOrderID": obj.attr("OrderID") },
            //        url: '/User/UserDeleteOrder',
            //        success: function (json) {
            //            //返回  true 或 false
            //            if (json) {
            //                obj.parents("li").remove();
            //            }
            //            else {
            //                alert("网络错误，请稍后再试！");
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
                                obj.parents("li").remove();
                            }
                            else {
                                //alert("网络错误，请稍后再试！");
                                hDialog.show({ type: 'toast', toastText: '网络错误，请稍后再试！', toastTime: 2000, hasMask: false });
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
            //                var OrdersCommodityID = obj.attr("OrdersCommodityID");
            //                var str = ' <a href="javascript:;" class="qx-pay btn-delete ke-btnDelete" OrderID="' + OrderID + '">删除订单</a>';
            //                str += '<a href="javascript:;" class="qx-pay btn-delivery ke-btnTransport" OrderID="' + OrderID + '" OrdersCommodityID="' + OrdersCommodityID + '">查看物流</a>';
            //                //str += '<a href="javascript:;">评价订单</a>';
            //                obj.parent().html(str);
            //            }
            //            else {
            //                alert("网络错误，请稍后再试！");
            //            }

            //        }
            //    });
            //}
            hDialog.show({
                type: 'confirmB',
                tipsText: '是否确认收货?',
                callBack: function () {
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        data: {
                            "p_CloseMark": "", "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd(),
                            "p_OrderID": obj.attr("OrderID")
                        },
                        url: ajaxUrl + 'ReceiptOrder',
                        success: function (json) {
                            //返回  true 或 false
                            if (json) {
                                var OrderID = obj.attr("OrderID");
                                var OrdersCommodityID = obj.attr("OrdersCommodityID");
                                var str = ' <a href="javascript:;" class="qx-pay btn-delete ke-btnDelete" OrderID="' + OrderID + '">删除订单</a>';
                                str += '<a href="javascript:;" class="qx-pay btn-delivery ke-btnTransport" OrderID="' + OrderID + '" OrdersCommodityID="' + OrdersCommodityID + '">查看物流</a>';
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
            var count = $(this).parents("li").find(".item-detail").length;
            var link = '';
            var OrderID = $(this).attr("OrderID");
            if (count > 1) {
                //跳到订单商品查看列表
                link = '/logisticslist.html?order=' + OrderID;
            }
            else {
                var OrdersCommodityID = $(this).attr("OrdersCommodityID");
                //跳到单个商品物流信息页面
                link = '/logistics.html?order=' + OrderID + '&commodity=' + OrdersCommodityID + '';
            }
            window.location.href = link;
        });
    }
});