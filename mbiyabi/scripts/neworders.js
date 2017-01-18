
$(function () {
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".st-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }
    //verifyLogin();
    var userInfo = getUserInfo();
    if (userInfo == undefined) {
        localStorage.returnUrl = window.location.href;
        window.location.href = '/userlogin';
        return false;
    }
    var commoditylist = GetQueryString("commoditylist").split(',');
    var listCommodity = "[";
    //商品列表解析
    for (var i = 0; i < commoditylist.length; i++) {
        var cArr = commoditylist[i].split('_');
        listCommodity += "{\"iCommodityTagID\":" + cArr[0] + ",\"iTraderID\":0,\"iQuantity\":" + cArr[1] + ",\"strFremdnessCoupon\":\"\",\"strCashCoupon\":\"\",\"strBybCoupon\":\"\",\"iTransferLineID\":0}";
        if (i < commoditylist.length - 1) {   //分隔每一项
            listCommodity += ",";
        }
    }
    listCommodity += "]";

    getOrderList();
    //获取订单商品列表
    function getOrderList() {
        $.ajax({
            type: "post",
            dataType: 'json',
            async: false,
            contentType: "application/json; charset=utf-8",
            data: "{\"mUser\":{\"iUserID\":" + userInfo.iUserID + ",\"strAppPwd\":\"" + getstrPwd() + "\"},\"mApp\":{\"iAppID\":0,\"strAppName\":\"\",\"strAppVersion\":\"\",\"iClientLanType\":1},\"listCommodity\":" + listCommodity + ",\"strVerCode\":\"\",\"iRequstType\":1,\"strOrderCarlist\":\"\"}",
            url: apiUrl + "GetOrderTransferLineFeeByCommodityList",
            async: false,
            success: function (data) {
                if (data.code == -1) {   //接口返回非正常数据
                    $("#frmCommitOrder").hide();
                    hDialog.show({ type: 'toast', toastText: data.message, toastTime: 3000, hasMask: false });
                    var errorTips = '<div style="padding:10px 0;text-align:center;">' + data.message + '<a href="javascript:history.back();">返回重试</a></div>';
                    $(errorTips).insertBefore("#frmCommitOrder");
                } else if (data.code == 200) {
                    data = data.result.orderlist;
                    var allOrdersPrice = 0;
                    //页面元素渲染
                    for (var i = 0; i < data.length; i++) {
                        //allOrdersPrice += data[i].modelOrderCost.decTotalPrice;  //总计
                        //allOrdersPrice = Math.round(allOrdersPrice * 100) / 100 + Math.round(data[i].modelOrderCost.decTotalPrice * 100) / 100;  //总计
                        allOrdersPrice = Math.round((allOrdersPrice + data[i].modelOrderCost.decTotalPrice) * 100) / 100;  //总计
                        var totalWeight = 0;  //总重量

                        var divGoods = '';
                        divGoods += '<div class="div-goods">';
                        divGoods += '<div class="goods-box">';
                        divGoods += '<div class="g-header clearfix">商家：<h1>' + data[i].strMallName + '</h1></div>';
                        divGoods += '<ul class="ul-product">';
                        var commodityList = data[i].listOrdersCommodity;
                        for (var j = 0; j < commodityList.length; j++) {
                            //totalWeight += commodityList[j].decWeight * commodityList[j].iQuantity;
                            totalWeight = Math.round((totalWeight + commodityList[j].decWeight * commodityList[j].iQuantity) * 1000) / 1000;  //重量
                            divGoods += '<li class="ub" CommodityTagID="' + commodityList[j].iCommodityTagID + '" Quantity="' + commodityList[j].iQuantity + '" TraderID="' + data[i].iTraderID + '" TransferLineID="' + data[i].iTransferLineID + '">';
                            divGoods += '<div class="left">';
                            divGoods += '<a href="#"><img src="' + commodityList[j].strMainImage + '" alt=""></a>';
                            divGoods += '</div>';
                            divGoods += '<div class="ub-f1">';
                            divGoods += '<a href="#"><h1>' + commodityList[j].strInfoTitle + '</h1></a>';
                            divGoods += '<p>';
                            divGoods += '<span>' + commodityList[j].strCommodityTagName + '</span>';
                            divGoods += '<span>X<label>' + commodityList[j].iQuantity + '</label></span>';
                            divGoods += '</p>';
                            divGoods += '<p>￥<label>' + commodityList[j].decChinaPrice + '</label></p>';
                            divGoods += '</div>';
                            divGoods += '</li>';
                        }
                        divGoods += '</ul>';
                        divGoods += '</div>';
                        divGoods += '<div class="summary">';
                        divGoods += '<p class="ub">';
                        divGoods += '<span class="ub ub-f1">商品价格：</span>';
                        divGoods += '<b>￥<label>' + Math.round(data[i].modelOrderCost.decCommodityPrice * 100) / 100 + '</label></b>';
                        divGoods += '</p>';
                        divGoods += '<p class="ub">';
                        divGoods += '<span class="ub ub-f1">本土运费：</span>';
                        divGoods += '<span>￥<label>' + Math.round(data[i].modelOrderCost.decFremdnessFee * 100) / 100 + '</label></span>';
                        divGoods += '</p>';
                        divGoods += '<p class="ub">';
                        divGoods += '<span class="ub ub-f1">国际运费和税费 （商品重量 ' + Math.round(totalWeight * 100) / 100 + 'kg）</span>';
                        divGoods += '</p>';
                        divGoods += '<div class="delivery-line">';
                        divGoods += '<i class="icon-angle-up"></i>';
                        divGoods += '<input type="hidden" id="type" name="type" value="" />';
                        divGoods += '<ul>';
                        for (var k = 0; k < data[i].listModelTransferLineFee.length; k++) {
                            var feelist = data[i].listModelTransferLineFee[k];

                            divGoods += '<li class="ub " data-line="' + feelist.iTransferLineID + '">';
                            divGoods += '<h6 class="ub ub-f1 ub-ac">';

                            if (feelist.iTransferLineID == data[i].iTransferLineID) {
                                divGoods += '<i class="ub icon-radio checked" data-line="' + feelist.iTransferLineID + '"></i>';
                            }
                            else {
                                divGoods += '<i class="icon-radio" data-line="' + feelist.iTransferLineID + '"></i>';
                            }

                            divGoods += feelist.strChannelTypeName;
                            divGoods += '<span>' + feelist.strArrivalTimeRang + '</span>';
                            if (!feelist.strTransferLineIconPath == "" && feelist.strChannelTypeName == "标准线路") {
                                divGoods += '<img class="ub" src="../images/LineJinji.png" alt="" />';
                            }
                            divGoods += '</h6>';
                            divGoods += '<div>';
                            divGoods += '<p>运费：￥ ' + Math.round(feelist.modelOrderCost.decPurchasingFee * 100) / 100 + '</p>';
                            if (feelist.strChannelTypeName == "邮政线路") {
                                divGoods += '<p>海关抽查,自行缴税</p>';
                            }
                            else {
                                divGoods += '<p>税费：￥ ' + Math.round(feelist.modelOrderCost.decTax * 100) / 100 + '</p>';
                            }
                            divGoods += '</div></li>';
                        }
                        divGoods += '</ul></div>';

                        var line;
                        for (var m = 0; m < data[i].listModelTransferLineFee.length; m++) {
                            if (data[i].listModelTransferLineFee[m].iTransferLineID == data[i].iTransferLineID) {
                                line = data[i].listModelTransferLineFee[m];
                            }
                        }
                        if (line != undefined) {
                            if (line.strTransferLineDesc != "") {
                                divGoods += '<p class="tips delivery-line-tips">';
                                divGoods += '提示：<label>' + line.strTransferLineDesc + '</label></p>';
                            }

                            divGoods += '<p class="ub pos-r ubb sc-border upad btn-open-yhq">';
                            divGoods += '<span class="ub ub-f1">';
                            divGoods += '<input type="hidden" class="coupon" value="" />';
                            divGoods += '<i class="icon-cny"></i>';
                            divGoods += '<input type="hidden" id="DiscountType" name="DiscountType" value="' + data[i].modelOrderCost.strDiscountType + '" />';
                            divGoods += '<input type="hidden" id="DisCountPrice" name="DisCountPrice" value="' + data[i].modelOrderCost.decDisCountPrice + '" />';
                            if (data[i].modelOrderCost.strDiscountType == 1 && data[i].modelOrderCost.decDisCountPrice > 0) {
                                divGoods += '<label class="ke-show1" style="display:inline-block;">' + data[i].modelOrderCost.strDiscountName + '</label>';
                                divGoods += '<label class="ke-show2" style="display:none;">';
                                divGoods += '优惠方式 <span class="text-muted">';
                                divGoods += '（优惠券/红包）';
                                divGoods += '</span>';
                                divGoods += '</label>';
                            }
                            else {
                                divGoods += '<label class="ke-show1" style="display:none;">' + data[i].modelOrderCost.strDiscountName + '</label>';
                                divGoods += '<label class="ke-show2" style="display:inline-block;">';
                                divGoods += '优惠方式 <span class="text-muted">';
                                divGoods += '（优惠券/红包）';
                                divGoods += '</span>';
                                divGoods += '</label>';
                            }

                            divGoods += '</span>';
                            divGoods += '<span class="yhq-jine">-￥<label class="orderDiscounts">' + Math.round(data[i].modelOrderCost.decDiscounts * 100) / 100 + '</label></span>';
                            divGoods += '<i class="icon-angle-right"></i>';
                            divGoods += '</p>';
                            divGoods += '<p class="upad text-right total">';
                            var OrdersCommodityQuantity = 0;   //该电商商品数量
                            for (var n = 0; n < data[i].listOrdersCommodity.length; n++) {
                                OrdersCommodityQuantity += data[i].listOrdersCommodity[n].iQuantity;
                            }
                            divGoods += '共' + OrdersCommodityQuantity + '<label>件商品，合计</label>';
                            divGoods += '<b>￥<label class="orderPrice">' + data[i].modelOrderCost.decTotalPrice + '</label></b></p>';

                        }

                        divGoods += '</div></div>';
                        $(divGoods).insertAfter(".address-box");
                    }
                    //总计
                    $(".allOrdersTotal").text(allOrdersPrice);
                }
            }
        })
    }



    //弹出选择地址页面
    $(document).on("click", ".address-box", function () {
        $(".o-bd").css({ "width": "100%", "height": "100%", "overflow": "hidden" });
        $(".o-bd").scrollTop(0);
        $(".win-address").css({ "display": "block" }).animate({ right: 0 }, 300);
        $(".win-address header").animate({ right: 0 }, 300);

        //加载用户所有地址
        loadUserAllAddress();
    });

    //加载用户所有地址
    function loadUserAllAddress() {
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: { "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd() },
            url: ajaxUrl + 'UserAddressListQuery',
            success: function (data) {

                if (data) {
                    //如果存在地址
                    $(".no-address").css({ "display": "none" });
                    $(".addr-list").css({ "display": "block" });


                    var str = "";
                    for (var i = 0; i < data.length; i++) {
                        str += '<li>' +
           ' <div class="info-box clearfix" AddressNumber="' + data[i].iAddressNumber + '">' +
               ' <div class="info-content pull-left">' +
                  '  <p><b class="contacts">' + data[i].strContacts + '</b><b class="idcard">' + data[i].strIDCardNumber + '</b></p>' +
                   ' <p class="mobile">' + data[i].strMobilePhone + '</p>' +
                   ' <p class="address">' + data[i].strProvinceName + data[i].strCityName + data[i].strDistrictName + data[i].strAddress + '</p>' +
               ' </div>' +
           ' </div>' +
          '  <div class="opear-box clearfix">' +
              '  <div class="pull-left">' +
                    '<label class="has-radio" AddressNumber="' + data[i].iAddressNumber + '">';

                        if (data[i].iIsDefault == 1) {
                            str += ' <i class="icon-radio checked" ></i><span>设为默认</span>';
                        }
                        else {
                            str += ' <i class="icon-radio" AddressNumber="' + data[i].iAddressNumber + '"></i><span>设为默认</span>';
                        }

                        str += ' </label>';
                        str += '   </div>';
                        str += '  <div class="pull-right">';
                        //str += '   <a class="ke-editor" AddressNumber="' + data[i].iAddressNumber + '"  href="/User/UserAddressUpdate?p_iAddressNumber=' + data[i].iAddressNumber + '">';
                        str += '   <a class="ke-editor" AddressNumber="' + data[i].iAddressNumber + '"  href="javascript:;">';
                        str += ' <img src="../../images/icon_edit.png" width="16" alt="编辑" />编辑';
                        str += '  </a>';
                        // if (data.length>1) {
                        str += ' <a  class="deleteUserAddress"  AddressNumber="' + data[i].iAddressNumber + '" >';
                        str += '  <img src="../../images/icon_delete.png" width="16" alt="删除"  />删除';
                        str += '</a>';
                        //  }
                        str += ' </div>';
                        str += ' </div>';
                        str += ' </li>';
                    }

                    $("#addlist").html(str);

                    //删除地址注册事件
                    $(document).on('click', '.deleteUserAddress', function () {

                        //if (confirm("是否删除？")) {
                        //    var obj = $(this);
                        //    $.ajax({
                        //        type: 'post',
                        //        dataType: 'json',
                        //        url: "/User/UserAddressDelete",
                        //        data: {
                        //            "p_iAddressNumber": $(this).attr("AddressNumber")
                        //        },
                        //        success: function (data) {
                        //            if (data) {
                        //                //alert("删除成功！");
                        //                hDialog.show({ type: 'toast', toastText: '删除成功！', toastTime: 3000, hasMask: false });
                        //                obj.parents("li").remove();
                        //            }
                        //        }
                        //    })
                        //}

                        var obj = $(this);
                        hDialog.show({
                            type: 'confirmB',
                            tipsText: '是否删除？',
                            callBack: function () {
                                $.ajax({
                                    type: 'post',
                                    dataType: 'json',
                                    url: ajaxUrl + "UserAddressDelete",
                                    data: {
                                        "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd(), "p_iAddressNumber": obj.attr("AddressNumber")
                                    },
                                    success: function (data) {
                                        if (data) {
                                            //alert("删除成功！");

                                            //如果删除的地址是订单里面选择的地址
                                            if ($("#hide_AddressNumber").val() == obj.attr("AddressNumber")) {
                                                $(".unselected").css({ "display": "block" });
                                                $(".onselected").css({ "display": "none" });

                                                $("#contacts").html();
                                                $("#mobile").html();
                                                $("#idcard").html();
                                                $("#district").html();
                                                $("#address").html();
                                                $("#hide_AddressNumber").val("");
                                            }

                                            hDialog.show({ type: 'toast', toastText: '删除成功！', toastTime: 3000, hasMask: false });
                                            obj.parents("li").remove();
                                        }
                                    }
                                })
                            },
                            hasMask: false
                        });

                    });

                }
                else {
                    //如果不存在地址
                    $(".no-address").css({ "display": "block" });
                    $(".addr-list").css({ "display": "none" });
                }
            }
        });
    }



    //点选择优惠券页面返回，关闭页面
    $(document).on("click", ".win-address header .navbar-btn-left", function () {
        closeAddressWin();
    });

    function closeAddressWin() {
        $(".o-bd").css({ "height": "auto", "overflow": "visible" });
        $(".win-address,.win-address header").animate({ right: "-100%" }, 300, function () {
            $(".win-address").css({ "display": "none" });
        });
    }

    //选择地址 - 设为默认
    $(document).on("click", ".addr-list .opear-box .has-radio", function () {
        var $this = $(this);
        var p_iAddressNumber = $(this).attr("AddressNumber");
        var strPwd = getstrPwd();
        if (typeof (strPwd) == "undefined") {
            //如果两个密码都不存在且id为空,则什么都不做
        } else {
            $.ajax({
                type: 'post',
                dataType: "json",
                url: ajaxUrl + 'UserAddressSetDefault',
                data: { "p_iUserID": userInfo.iUserID, "p_strPwd": strPwd, "p_iAddressNumber": p_iAddressNumber },
                success: function (data) {
                    $(".opear-box .has-radio").find(".icon-radio").removeClass("checked");
                    $this.find(".icon-radio").addClass("checked");
                }
            });
        }
    });

    //选择地址 - 点击地址选择，关闭页面
    $(document).on("click", ".addr-list .info-box", function () {
        //TODO:选好地址后的操作

        var p_iAddressNumber = $(this).attr("AddressNumber");
        loadUserSelectAddress(p_iAddressNumber);

        closeAddressWin();
    });


    //弹出选择优惠券页面
    $(document).on("click", ".btn-open-yhq", function () {
        $(".o-bd").css({ "width": "100%", "height": "100%", "overflow": "hidden" });
        $(".o-bd").scrollTop(0);
        $(".win-yhfs").css({ "display": "block" }).animate({ right: 0 }, 300);
        $(".win-yhfs header").animate({ right: 0 }, 300);


        //设置父div加一个class="couponSelected" ，传入到弹出的优惠券里面，用于选择优惠券时确定返回能够找到对应的哪个订单使用或者不使用优惠券
        $(".div-goods").removeClass("couponSelected");//清除选择
        $(this).parents(".div-goods").addClass("couponSelected");

        //遍历
        var p_Commoditylist = ""; //格式：代购商家ID_信息商品ID_数量,代购商家ID_信息商品ID_数量
        $(".div-goods.couponSelected .ul-product li").each(function () {
            p_Commoditylist += $(this).attr("TraderID") + "_" + $(this).attr("CommodityTagID") + "_" + $(this).attr("Quantity") + ",";
        });
        p_Commoditylist = p_Commoditylist.substring(0, p_Commoditylist.length - 1);
        var fremdnessCouponList = ""; //除了当前订单外，其他订单使用的国外公码,券码之间逗号分隔
        var bybCouponList = "";
        $(".couponSelected").siblings(".div-goods").each(function () {
            if ($(this).find(".coupon").val().length > 0) {
                bybCouponList += $(this).find(".coupon").val() + ",";
            }
        });
        bybCouponList = bybCouponList.substring(0, bybCouponList.length - 1);
        var cashCouponList = "";


        //优惠券列表
        $.ajax({
            type: 'post',
            dataType: "json",
            url: ajaxUrl + 'GetCouponListByCommodity',
            data: {
                "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd(),
                "AppID": 26, "AppName": "mobile中文", "ClientLanType": 1,
                "cashCouponList": "", "fremdnessCouponList": "", "p_AddressNumber": 0,
                "p_Commoditylist": p_Commoditylist, "bybCouponList": bybCouponList
            },
            success: function (data) {
                if (data != null) {
                    var str = "";
                    for (var i = 0; i < data.BybCouponList.length; i++) {
                        str += '<li class="has-yhq-radio">' +
              '  <label><input type="radio" name="yhq" value="' + data.BybCouponList[i].strCouponCode + '" /><i class="icon-radio"></i><span>' + data.BybCouponList[i].gift.strGiftName + '</span></label>' +
                        ' </li>';
                    }
                    $(".ul-listCoupon").html(str);
                }
            }
        });

    });

    //点选择优惠券页面返回，关闭页面
    $(document).on("click", ".win-yhfs header .navbar-btn-left", function () {
        closeYhqWin();
    });

    //选择优惠券 确认按钮
    $(document).on("click", ".win-yhfs .footer a", function () {
        // alert("你选择的value是：" + $("input[name=yhq]:checked").val());

        //选择优惠券后设置到对应订单的优惠码
        $(".couponSelected .coupon").val($("input[name=yhq]:checked").val());

        var p_AddressNumber = $("#hide_AddressNumber").val();
        if (p_AddressNumber.length == 0) {
            //alert("请选择地址！");
            hDialog.show({ type: 'toast', toastText: '请选择地址！', toastTime: 3000, hasMask: false });
            return false;
        }

        //选择优惠券后，更改单个订单价格，还有总价格
        var listCommodity = "";
        //        "listCommodity": [
        //      {
        //    "iCommodityTagID": 293854,
        //    "iTraderID": 168922,
        //    "iQuantity": 1,
        //    "strFremdnessCoupon": "100",
        //    "strCashCoupon": "100",
        //    "strBybCoupon": "100",
        //    "iTransferLineID": 21
        //       }
        //        ]
        $(".div-goods.couponSelected .ul-product li").each(function () {
            listCommodity += '{';
            listCommodity += '"iCommodityTagID":' + $(this).attr("CommodityTagID") + ',"iTraderID":' + $(this).attr("TraderID") +
                ',"iQuantity":' + $(this).attr("Quantity") + ',"strFremdnessCoupon":""' + ',"strCashCoupon":""' + ',"strBybCoupon":"' +
                $(".couponSelected .coupon").val() + '","iTransferLineID":' + $(this).attr("TransferLineID");
            listCommodity += '},';
        });
        listCommodity = listCommodity.substring(0, listCommodity.length - 1);
        listCommodity = "[" + listCommodity + "]";

        //使用优惠券异步请求更新价格
        $.ajax({
            type: 'post',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: apiUrl + 'GetOrderPriceWithCoupon',
            data: "{\"mUser\":{\"iUserID\":" + userInfo.iUserID + ",\"strAppPwd\":\"" + getstrPwd() + "\"},\"mApp\":{\"iAppID\":0,\"strAppName\":\"\",\"strAppVersion\":\"\",\"iClientLanType\":1},\"listCommodity\":" + listCommodity + ",\"iAddressNumber\":" + p_AddressNumber + ",\"strVerCode\":\"\",\"iRequstType\":1}",
            success: function (data) {
                if (data.code == 200) {
                    var decDiscounts = data.result[0].modelOrderCost.decDiscounts;//使用券后的折扣
                    $(".couponSelected .orderDiscounts").text(decDiscounts);  //设置新的折扣显示
                    //单订单价格
                    $(".couponSelected .orderPrice").text(data.result[0].modelOrderCost.decTotalPrice);
                    //总订单价格
                    var allOrdersTotal = 0;
                    $(".orderPrice").each(function () {
                        allOrdersTotal += parseFloat($(this).text());
                    });

                    $(".allOrdersTotal").text(allOrdersTotal);

                }
            }
        });



        //关闭遮盖层
        closeYhqWin();
    });

    function closeYhqWin() {
        //1如果出现符合满减情况的订单，则会出现ke-show1，才继续做这样的判断：如果选择了优惠券则隐藏 class="ke-show1" ,如果不选择优惠券则显示 class="ke-show2"
        showDiscount()

        $(".o-bd").css({ "height": "auto", "overflow": "visible" });
        $(".win-yhfs, .win-yhfs header").animate({ right: "-100%" }, 300, function () {
            $(".win-yhfs").css({ "display": "none" });
        });
    }

    //1如果出现符合满减情况的订单，则会出现ke-show1，才继续做这样的判断：如果选择了优惠券则隐藏 class="ke-show1" ,如果不选择优惠券则显示 class="ke-show2"
    function showDiscount() {

        $(".couponSelected .coupon").each(function () {
            var DisCountPrice = $(this).siblings('input[name="DisCountPrice"]').val();
            //alert(DisCountPrice==0);
            //如果存在满减条件，且当前选择了优惠券，就让ke-show2显示 ke-show1隐藏。否则让ke-show2 隐藏，让ke-show1显示
            if (DisCountPrice > 0 && $(this).val().length > 0) {
                $(this).parent().find(".ke-show2").css({ "display": "inline-block" });
                $(this).parent().find(".ke-show1").css({ "display": "none" });
            }
            else if (DisCountPrice > 0 && $(this).val().length == 0) {
                $(this).parent().find(".ke-show1").css({ "display": "inline-block" });
                $(this).parent().find(".ke-show2").css({ "display": "none" });
            }
            else {
                $(this).parent().find(".ke-show2").css({ "display": "inline-block" });
                $(this).parent().find(".ke-show1").css({ "display": "none" });
            }
        });
        //$(".couponSelected .coupon").val()
    }


    //打开输入优惠码输入框
    $(document).on("click", ".open-popup", function () {
        $(".win-yhfs").css({ "height": "100%", "overflow": "hidden" });
        $(".win-yhfs .win-mask, .win-yhfs .popup-input").show();
    });

    //选择优惠券点击选中单选框
    $(document).on("click", ".has-yhq-radio", function () {
        $(this).find("label")[0].click();
        $(".has-yhq-radio").find(".icon-radio").removeClass("checked");
        $(this).find(".icon-radio").addClass("checked");
    });

    //选择优惠券 输入优惠码 取消按钮，点击遮罩关闭输入框
    $(document).on("click", ".link-cancle,.win-yhfs .win-mask", function () {
        closePopup();
    });

    //选择优惠券 输入优惠码 兑换按钮
    $(document).on("click", ".link-duihuan", function () {
        //TODO: 兑换操作
        if ($("#code").val().length == 0) {
            //alert("请输入优惠码!");
            hDialog.show({ type: 'toast', toastText: '请输入优惠码!', toastTime: 3000, hasMask: false });
            return false;
        }
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: {
                "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd(), "AppID": 26, "AppName": "mobile中文", "ClientLanType": 1,
                "couponCode": $("#code").val()
            },
            url: ajaxUrl + 'BindUserAndCouponCode',
            success: function (data) {
                //alert(data.CouponReturnDes)
                hDialog.show({ type: 'toast', toastText: data.CouponReturnDes, toastTime: 3000, hasMask: false });
                if (data.CouponReturnResult) {
                    window.location.reload();
                }
            }
        });
        closePopup();
    });


    function closePopup() {
        $(".win-yhfs .win-mask, .win-yhfs .popup-input").fadeOut(300, function () {
            $(".win-yhfs").css({ "height": "auto", "overflow": "visible" });
        });
    };


    //选择物流线路
    $(".delivery-line ul > li").on("click", function () {
        var t = $(this);
        t.find(".icon-radio").addClass("checked");
        t.siblings("li").find(".icon-radio").removeClass("checked");
        $("input[name=type]").val(t.data("line"));
        //alert("你选择了运线：" + $("input[name=type]").val());

        //设置线路
        $(this).parents(".div-goods ul-product li").attr("transferlineid", $("input[name=type]").val());

        var p_AddressNumber = $("#hide_AddressNumber").val();
        if (p_AddressNumber.length == 0) {
            //alert("请选择地址！");
            hDialog.show({ type: 'toast', toastText: '请选择地址！', toastTime: 3000, hasMask: false });
            return false;
        }

        //选择优惠券后，更改单个订单价格，还有总价格
        var listCommodity = "";
        //        "listCommodity": [
        //      {
        //    "iCommodityTagID": 293854,
        //    "iTraderID": 168922,
        //    "iQuantity": 1,
        //    "strFremdnessCoupon": "100",
        //    "strCashCoupon": "100",
        //    "strBybCoupon": "100",
        //    "iTransferLineID": 21
        //       }
        //        ]
        var obj = $(this).parents(".div-goods");
        obj.find(".ul-product li").attr("transferlineid", $("input[name=type]").val());

        obj.find(".ul-product li").each(function () {
            //listCommodity += "{";
            //listCommodity += "'iCommodityTagID':" + $(this).attr("CommodityTagID") + ",'iTraderID':" + $(this).attr("TraderID") +
            //    ",'iQuantity':" + $(this).attr("Quantity") + ",'strFremdnessCoupon':''" + ",'strCashCoupon':''" + ",'strBybCoupon':'" +
            //    obj.find(".coupon").val() + "','iTransferLineID':" + $(this).attr("TransferLineID");
            //listCommodity += "},";
            listCommodity += '{';
            listCommodity += '"iCommodityTagID":' + $(this).attr("CommodityTagID") + ',"iTraderID":' + $(this).attr("TraderID") +
                ',"iQuantity":' + $(this).attr("Quantity") + ',"strFremdnessCoupon":""' + ',"strCashCoupon":""' + ',"strBybCoupon":"' +
                obj.find(".coupon").val() + '","iTransferLineID":' + $(this).attr("TransferLineID");
            listCommodity += '},';
        });

        listCommodity = listCommodity.substring(0, listCommodity.length - 1);
        listCommodity = "[" + listCommodity + "]";
        //  alert(listCommodity);
        //使用优惠券异步请求更新价格
        $.ajax({
            type: 'post',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: apiUrl + 'GetOrderPriceWithCoupon',
            data: "{\"mUser\":{\"iUserID\":" + userInfo.iUserID + ",\"strAppPwd\":\"" + getstrPwd() + "\"},\"mApp\":{\"iAppID\":0,\"strAppName\":\"\",\"strAppVersion\":\"\",\"iClientLanType\":1},\"listCommodity\":" + listCommodity + ",\"iAddressNumber\":" + p_AddressNumber + ",\"strVerCode\":\"\",\"iRequstType\":1}",
            success: function (data) {
                if (data.code == 200) {
                    //alert(data.result[0].modelOrderCost.decDiscounts);

                    var decDiscounts = data.result[0].modelOrderCost.decDiscounts;//使用券后的折扣
                    obj.find(".orderDiscounts").text(decDiscounts);  //设置新的折扣显示
                    //单订单价格
                    obj.find(".orderPrice").text(data.result[0].modelOrderCost.decTotalPrice);
                    //总订单价格
                    var allOrdersTotal = 0;
                    $(".orderPrice").each(function () {
                        //allOrdersTotal += parseFloat($(this).text());    //会出现多个小数位
                        allOrdersTotal = Math.round((allOrdersTotal + parseFloat($(this).text())) * 100) / 100;
                    });

                    $(".allOrdersTotal").text(allOrdersTotal);
                }
            }
        });
    });


    //提交订单
    $(".btn-danger").click(function () {

        var p_AddressNumber = $("#hide_AddressNumber").val();
        if (p_AddressNumber.length == 0 || p_AddressNumber == "0") {
            //alert("请选择地址！");
            hDialog.show({ type: 'toast', toastText: '请选择地址！', toastTime: 3000, hasMask: false });
            return false;
        }

        var listCommodity = "";
        //        "listCommodity": [
        //      {
        //    "iCommodityTagID": 293854,
        //    "iTraderID": 168922,
        //    "iQuantity": 1,
        //    "strFremdnessCoupon": "100",
        //    "strCashCoupon": "100",
        //    "strBybCoupon": "100",
        //    "iTransferLineID": 21
        //       }
        //        ]
        $(".div-goods .ul-product li").each(function () {
            listCommodity += "{";
            listCommodity += '"iCommodityTagID":' + $(this).attr("CommodityTagID") + ',"iTraderID":' + $(this).attr("TraderID") +
                ',"iQuantity":' + $(this).attr("Quantity") + ',"strFremdnessCoupon":""' + ',"strCashCoupon":""' + ',"strBybCoupon":"' +
                $(this).parents(".div-goods").find(".coupon").val() + '","iTransferLineID":' + $(this).attr("TransferLineID");
            listCommodity += '},';
        });
        listCommodity = listCommodity.substring(0, listCommodity.length - 1);
        listCommodity = "[" + listCommodity + "]";

        // alert(listCommodity);
        $("#listCommodity").val(listCommodity);
        $("#frmCommitOrder").submit();   //提交表单，请求参数在url中，createorders页面获取url参数decode后得不到正确数据

        ////保存到 localStorage中，在createorders页面获取
        //localStorage.listCommodity = listCommodity;

        ////localStorage.iAddressNumber = 24045;  //测试，因为调用的是真实接口，地址需要用真实数据库里的
        //localStorage.iAddressNumber = $("#hide_AddressNumber").val();

        //localStorage.type = $("#type").val();
        //localStorage.DiscountType = $("#DiscountType").val();
        //localStorage.DisCountPrice = $("#DisCountPrice").val() == "undefined" ? "" : $("#DisCountPrice").val();
        //window.location.href = "/createorders.html";
    });








    //设置商品列表左侧图片容器宽高一致
    setHeightEqWidth(".goods-box .left,.goods-box .left a");
    //窗口宽度变化时重新调整商品列表左侧图片容器宽高
    window.onresize = function () {
        setHeightEqWidth(".goods-box .left, .goods-box .left a");
    }

    //设置元素高度与宽度一致
    function setHeightEqWidth(el) {
        $(el).height($(el).width());
    }



    //开始加载用户地址
    loadUserSelectAddress(0);

    //加载用户地址
    function loadUserSelectAddress(iAddressNumber) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: { "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd() },
            url: ajaxUrl + 'UserAddressListQuery',
            success: function (data) {
                if (data.length > 0) {
                    //如果为0则加载默认地址
                    if (iAddressNumber == 0) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].iIsDefault == 1) {
                                data = data[i];
                            }
                        }
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].iAddressNumber == iAddressNumber) {
                                data = data[i];
                            }
                        }
                    }
                    //如果存在地址
                    $(".unselected").css({ "display": "none" });
                    $(".onselected").css({ "display": "block" });

                    $("#contacts").html(data.strContacts);
                    $("#mobile").html(data.strMobilePhone);
                    $("#idcard").html(data.strIDCardNumber);
                    $("#district").html(data.strProvinceName + data.strCityName + data.strDistrictName);
                    $("#address").html(data.strAddress);
                    $("#hide_AddressNumber").val(data.iAddressNumber);
                }
                else {
                    //如果不存在地址
                    $(".unselected").css({ "display": "block" });
                    $(".onselected").css({ "display": "none" });
                    $("#hide_AddressNumber").val(0);
                }
            }
        });
    }




    //点击新增地址按钮传递回调页面参数
    $(document).on("click", '.navbar-btn-right', function () {
        window.location.href = '/useraddressadd.html?returnUrl=' + window.location;
    });

    //点击编辑地址按钮传递回调页面参数
    $(document).on("click", '.ke-editor', function () {
        window.location.href = "/useraddressupdate.html?address=" + $(this).attr("AddressNumber") + "&returnUrl=" + window.location;
    });


});