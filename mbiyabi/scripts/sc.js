/**
 * Created by Zhang on 2016/3/22.
 * 购物车操作
 */
$(document).ready(function () {
    //verifyLogin();
    var userInfo = getUserInfo();
    //需登录权限验证，未登录则跳转到登录页面，不用公用方法，以减少请求接口次数
    if (typeof (userInfo) == 'undefined' || userInfo == undefined) {
        localStorage.returnUrl = window.location.href;
        window.location.href = '/userlogin';
        return false;
    }

    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".uc-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }

    $.ajax({
        url: apiUrl + "GetCartCommodityListQuery",
        type: "Post",
        //async: false,
        contentType: "application/json; charset=utf-8",
        data: "{\"mUser\":{\"iUserID\":" + userInfo.iUserID + ",\"strAppPwd\":\"" + getstrPwd() + "\"},\"mApp\":{\"iAppID\":0,\"strAppName\":\"\",\"strAppVersion\":\"\",\"iClientLanType\":1},\"strVerCode\":\"\",\"iRequstType\":1}",
        beforeSend: function () {
            var logoImg = '<div class="loading-box cl"><img src="../images/loanding.gif" class="logo-img2"><span>加载中</span></div>';
            $('.shopping-lists').html(logoImg);
        },
        success: function (data) {
            $('.shopping-lists .loading-box').remove();
            var data = data.result;  //商品项数组

            //电商名称
            var mallList = [];
            for (var i = 0; i < data.length; i++) {
                if ($.inArray(data[i].strMallName, mallList) == -1) {
                    mallList.push(data[i].strMallName);  //如果电商列表中没有则添加
                }
            }

            var cartListHtml = '';
            //有电商名称项，则拼接列表
            if (mallList.length > 0) {
                for (var i = 0; i < mallList.length; i++) {
                    cartListHtml += '<div class="slc cl"><div class="source-type cl">';
                    cartListHtml += '<span class="sel-btn sel-all" data-type="0"></span>';
                    cartListHtml += '<span class="source-text">商品来源：<span style="color:red;">' + mallList[i] + '</span></span></div>';

                    for (var j = 0; j < data.length; j++) {
                        if (data[j].strMallName == mallList[i]) {
                            //拼接同一电商的所有商品
                            cartListHtml += '<div class="scroller"><div class="commodity-info cl" id="abc">';
                            cartListHtml += '<div class="commodity-info-detail cl">';
                            cartListHtml += '<p><a style="color:#333;" href="/detail/' + data[j].iInfoID + '">' + data[j].strInfoTitle + '</a></p>';
                            cartListHtml += '<p class="light-color">' + data[j].strCommodityTagName + '</p><p class="count-money">';
                            cartListHtml += '<span class="color-red">单价：¥<i>' + data[j].decChinaPrice + '</i> </span><span>';
                            cartListHtml += '<span class="num-minus"><i class="fa fa-minus"></i></span>';
                            cartListHtml += '<input type="text" readonly="readonly" value="' + data[j].iQuantity + '">';
                            cartListHtml += '<span class="num-plus"><i class="fa fa-plus"></i></span></span></p></div><div class="ub aside">';
                            cartListHtml += '<span class="ub sel-btn sel-obj" data-type="0" CartCommodityID="' + data[j].iCartCommodityID + '" CommodityTagID="' + data[j].iCommodityTagID + '"></span>';
                            cartListHtml += '<div class="ub-f1 sc-content-img">';
                            cartListHtml += '<a class="ub ub-ac ub-pc" href="/detail/' + data[j].iInfoID + '">';
                            cartListHtml += '<img src="' + data[j].strMainImage + '">';
                            cartListHtml += '</a></div></div></div>';
                            cartListHtml += '<div class="delete-btn">删除</div></div>';
                        }
                    }
                    cartListHtml += '</div>';
                }
            }
            else {
                //购物车为空
                cartListHtml = '<div class="empty-car cl">';
                cartListHtml += '<img src="../images/empty-car.png">';
                cartListHtml += '</div>';
            }
            $(".shopping-lists").append(cartListHtml);
            bindOperate();
        },
        error: function () {
            hDialog.show({ type: 'toast', toastText: 'oops~网络错误，请重试~', toastTime: 3000, hasMask: false });
            $('.shopping-lists .loading-box').remove();
        }
    })

    //加载推荐列表
    loadReCommendList();

    //购物车列表加载完后绑定操作到列表对象
    function bindOperate() {
        //选择商品并计算价格
        //本身选择--每次选择都要进行遍历一次
        var count = 0;
        var sourceSum = $('.shopping-lists').find('.sel-all').length;
        var num = 0;
        var countLess = 0;

        if ($(".shopping-lists .slc").length < 1) {
            $(".header .nav-btn-rigt").html("").removeClass("nav-btn-rigt").css({ "cursor": "default" });
            $(".sc-foot").hide();
        }

        $(document).on('touchstart', '.commodity-info .sel-obj', function () {
            var outboxObj = $(this).parents('.slc');
            var sum = outboxObj.find('.sel-obj').length;
            var selAll = outboxObj.find('.source-type').find('.sel-all');
            countLess = sourceSum;
            num = 0;
            if ($(this).attr('data-type') == 0) {
                $(this).addClass('on');
                $(this).attr('data-type', 1);
            } else if ($(this).attr('data-type') == 1) {
                $(this).removeClass('on');
                $(this).attr('data-type', 0);
                selAll.removeClass('on');
                selAll.attr('data-type', 0);
                $('.sc-foot .sel-all').removeClass('on');
                $('.sc-foot .sel-all').attr('data-type', 0);

                $('.shopping-lists').find('.sel-all').each(function () {
                    if ($(this).attr('data-type') == 0) {
                        countLess--;
                        count = countLess;
                    }
                });

            }
            var _tempList = outboxObj.find('.sel-obj');
            var newList = [];
            for (var i = 0; i < _tempList.length; i++) {
                var _item = $(_tempList[i]);
                newList.push(_item);
            }
            for (s in newList) {
                if (newList[s].attr('data-type') == 1) {
                    num++;
                    if (num == sum) {
                        selAll.addClass('on');
                        selAll.attr('data-type', 1);
                        count++;
                        if (count == sourceSum) {
                            $('.sc-foot .sel-all').addClass('on');
                            $('.sc-foot .sel-all').attr('data-type', 1);
                        }
                    }
                }
            }
        });

        //全选按钮点击时选择下面的选项
        $(document).on('touchstart', '.source-type .sel-all', function () {
            //var num = 0;
            var outboxObj = $(this).parents('.slc');
            if ($(this).attr('data-type') == 0) {
                $(this).addClass('on');
                $(this).attr('data-type', 1);
                outboxObj.find('.commodity-info').find('.sel-obj').each(function () {
                    if ($(this).attr('data-type') == 1) {
                        //num++;
                    } else {
                        $(this).addClass('on');
                        $(this).attr('data-type', 1);
                    }
                });
                count++;
                if (count == sourceSum) {
                    $('.sc-foot .sel-all').addClass('on');
                    $('.sc-foot .sel-all').attr('data-type', 1);
                }
            } else {
                $(this).removeClass('on');
                $(this).attr('data-type', 0);
                outboxObj.find('.commodity-info').find('.sel-obj').each(function () {
                    if ($(this).attr('data-type') == 0) {
                        //num--;
                    } else {
                        $(this).removeClass('on');
                        $(this).attr('data-type', 0);
                    }
                });
                $('.sc-foot .sel-all').removeClass('on');
                $('.sc-foot .sel-all').attr('data-type', 0);
                count--;
            }
        });

        //最底部选择所有
        $('.sc-foot .sel-all').on('touchstart', function () {
            var outboxObj = $('.shopping-lists');
            if ($(this).attr('data-type') == 0) {
                outboxObj.find('.sel-btn').addClass('on');
                outboxObj.find('.sel-btn').attr('data-type', 1);
                $(this).addClass('on');
                $(this).attr('data-type', 1);
            } else {
                outboxObj.find('.sel-btn').removeClass('on');
                outboxObj.find('.sel-btn').attr('data-type', 0);
                $(this).attr('data-type', 0);
                $(this).removeClass('on');
            }
        });

        //加减数量
        //增加
        $(document).on('touchstart', '.count-money .num-plus', function () {
            var valObj = $(this).siblings('input[type="text"]');
            var val = parseInt(valObj.val());
            val = val + 1;
            if (val <= 5) {
                valObj.val(val);
                $(this).parents('.count-money').find('.buy-num').html(val);
            } else {
                //alert("单个商品最多可以购买5件");
                hDialog.show({ type: 'toast', toastText: '单个商品最多可以购买5件', toastTime: 3000, hasMask: false });
                return;
            }
        });

        //减少
        $(document).on('touchstart', '.count-money .num-minus', function () {
            var valObj = $(this).siblings('input[type="text"]');
            var val = parseInt(valObj.val());
            val = val - 1;
            if (val > 0) {
                valObj.val(val);
                $(this).parents('.count-money').find('.buy-num').html(val);
            } else if (val > 5) {
                valObj.val(5);
                $(this).parents('.count-money').find('.buy-num').html(5);
            } else {
                return;
            }
        });

        //购物车滑动效果
        var target = document.getElementById('abc');
        if (target != undefined) {
            target.style.webkitTransition = 'all ease 0.35s';
        }

        touch.on('.commodity-info', 'swipeleft', function () {
            $(this).parents(".commodity-info").siblings('.delete-btn').css('webkitTransform', 'translate3d(-58px,0,0)');
            $(this).parents(".commodity-info").css('webkitTransform', 'translate3d(-58px,0,0)');
        });
        touch.on('.commodity-info', 'swiperight', function () {
            $(this).parents(".commodity-info").css('webkitTransform', 'translate3d(0,0,0)');
            $(this).parents(".commodity-info").siblings('.delete-btn').css('webkitTransform', 'translate3d(0,0,0)');
        });

        //点击删除按钮，提示用户信息
        $(document).on('touchstart', '.scroller .delete-btn', function () {
            var obj = $(this);
            var selObj = obj.siblings('.commodity-info').find('.sel-obj');
            var d = dialog({
                title: '提示',
                content: '您确定要删除该商品吗？',
                okValue: '确定',
                cancelValue: '取消',
                ok: function () {
                    var that = this;
                    this.title('正在删除..');
                    setTimeout(function () {
                        var parentsObj = obj.parents('.slc');
                        if (parentsObj.children('.scroller').length <= 1) {
                            parentsObj.remove();
                            sourceSum--;
                            if (sourceSum == 0) {
                                $('.sc-foot .sel-all').removeClass('on');
                                $('.sc-foot .sel-all').attr('data-type', 0);
                                $('.empty-car').css('display', 'block');
                            }
                        }
                        obj.parent().remove();
                        that.close().remove();

                        var CartIDList = selObj.attr("CartCommodityID");
                        if (CartIDList != "") {
                            CancelCart(CartIDList);
                        }

                    }, 200);
                },
                cancel: function () { }
            });
            d.showModal();

        });

        //点击右上角编辑按钮
        $(document).on("touchstart", ".header .nav-btn-rigt", function () {
            var t = $(this);
            if (t.data("status") == 0) {
                t.text("完成").data("status", "1");
                $(".sc-foot .pay-btn").css("display", "none");
                $(".sc-foot .delete-btn").css("display", "inline-block");
            } else {
                t.text("编辑").data("status", "0");
                $(".sc-foot .delete-btn").css("display", "none");
                $(".sc-foot .pay-btn").css("display", "inline-block");
            }
        });

        //点击底部删除按钮，提示用户信息
        $(document).on('touchstart', '.sc-foot .delete-btn', function () {
            var obj = $(".shopping-lists");
            var selObj = obj.find('.sel-obj[data-type=1]');
            var len = selObj.length;
            var c = dialog({
                title: '提示',
                content: '您确定要删除这' + len + '种商品吗？',
                okValue: '确定',
                cancelValue: '取消',
                ok: function () {
                    var that = this;
                    setTimeout(function () {
                        if ($(".sel-all").hasClass("on")) {
                            $(".sel-all.on").parents(".slc").remove();  //删掉同一店铺项
                            sourceSum--;
                            if (sourceSum == 0) {
                                $('.sc-foot .sel-all').removeClass('on');  //底部全选按钮置为不选
                                $('.sc-foot .sel-all').attr('data-type', 0);
                                $('.empty-car').css('display', 'block');
                            }
                        }
                        selObj.parents(".scroller").remove();  //删掉本项
                        that.close().remove();  //删掉确认框

                        var CartIDList = "";
                        $(selObj).each(function () {
                            CartIDList += $(this).attr("CartCommodityID") + ',';
                        });
                        //去逗号

                        CartIDList = CartIDList.substring(0, CartIDList.length - 1);
                        if (CartIDList != "") {
                            CancelCart(CartIDList);
                        }


                    }, 200)
                },
                cancel: function () { }
            });
            c.showModal();
        });







        //点击结算
        $(".pay-btn").click(function () {

            var obj = $(".shopping-lists");
            var selObj = obj.find('.sel-obj[data-type=1]');
            var len = selObj.length;
            if (len > 0) {
                var CartIDCountList = "";//格式：购物车商品ID_商品数量,购物车商品ID_商品数量
                var CommodityList = "";      //格式：iCommodityTagID_iQuantity

                $(selObj).each(function () {
                    var iCartCommodityID = $(this).attr("CartCommodityID");
                    var iQuantity = $(this).parent().parent().find('input[type="text"]').val();
                    var iCommodityTagID = $(this).attr("CommodityTagID");

                    CartIDCountList += iCartCommodityID + "_" + iQuantity + ",";
                    CommodityList += iCommodityTagID + "_" + iQuantity + ",";
                });

                //去逗号
                CartIDCountList = CartIDCountList.substring(0, CartIDCountList.length - 1);
                CommodityList = CommodityList.substring(0, CommodityList.length - 1);
                //更新购物车商品数量，并跳转结算页面
                if (CartIDCountList != "" && CommodityList != "") {
                    //更新购物车商品数量
                    UpdateCart(CartIDCountList);

                    //跳转结算页面
                    window.location.href = '/neworders.html?commoditylist=' + CommodityList;


                }
            }
            else {
                //alert("请选择结算商品！");
                hDialog.show({ type: 'toast', toastText: '请选择结算商品！', toastTime: 3000, hasMask: false });
            }
        });
    }



    //删除购物车商品  格式：购物车商品ID,购物车商品ID
    function CancelCart(CartIDList) {
        $.ajax({
            type: 'post',
            dataType: "json",
            url: ajaxUrl + 'CancelCart',
            data: { "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd(), "CartIDList": CartIDList },
            success: function (data) {

            }
        });
    }

    //更新购物车商品数量
    function UpdateCart(CartIDCountList) {
        $.ajax({
            type: 'post',
            dataType: "json",
            url: '/User/UpdateCart',
            data: { "CartIDCountList": CartIDCountList },
            success: function (data) {

            }
        });
    }

    //加载推荐列表
    function loadReCommendList() {
        //加载推荐
        var counter = 1;
        // 每页展示10个
        var num = 10;
        // dropload
        var dropload = $('.recommend-box').dropload({
            scrollArea: window,
            loadDownFn: function (me) {
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    data: {
                        "pageIndex": counter, "pageSize": num, "infoType": 5, "isTop": 1, "homeShow": 0, "infoNation": 0,
                        "brightUrl": "", "catUrl": "", "exceptMallUrl": "", "keyWord": "", "mallUrl": "", "tagUrl": ""
                    },
                    url: ajaxUrl + 'GetInfoListWithHomeshowAndIstop_exceptMallUrlJson',
                    success: function (data) {
                        counter++;
                        var result = '';
                        $.each(data, function (index, item) {
                            result += '<li class="pro-item cl">';
                            result += '<a href="/detail/' + item.InfoID + '">';
                            result += '<div class="img-bg-box ub ub-ac ub-pc">';
                            result += '<img class="ub" src="' + item.MainImage + '">';
                            if (item.SaleStatus == 1) {
                                result += '<i class="pink">涨价</i>';
                            }
                            else if (item.SaleStatus == 2) {
                                result += '<i>售完</i>';
                            }
                            else if (item.SaleStatus == 3) {
                                result += '<i>过期</i>';
                            }
                            result += '</div>';
                            result += '<div class="goods-name-box"><p class="goods-name">' + item.InfoTitle + '</p></div>';
                            if (item.MinPriceRMB == 0) {
                                result += '<div class="has-border-top"><span class="text-danger">' + item.CommodityPrice + '</span>';
                            } else {
                                result += '<div class="has-border-top"><span class="text-danger">￥' + item.MinPriceRMB + '</span>';
                                if (item.OrginalPriceRMB > item.MinPriceRMB && item.OrginalPriceRMB > item.MaxPriceRMB) {
                                    //原价大于最小金额才显示原价
                                    result += '<del class="light-color">￥' + item.OrginalPriceRMB + '</del>';
                                }
                            }
                            result += '</div>';
                            if (item.MallName != "") {
                                result += '<p class="mallname light-color">' + item.MallName + '供货</p>';
                            }
                            result += '</a>';
                            result += '</li>';
                        });
                        $('.recommend-lists>ul').append(result);
                        // 每次数据加载完，必须重置
                        me.resetload();
                    },
                    error: function (xhr, type) {
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
            }
        });
    }

});