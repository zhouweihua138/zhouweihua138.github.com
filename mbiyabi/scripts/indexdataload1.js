/*
 首页数据加载

*/
function loadRecentOrderDataList() {
    $.ajax({
        type: 'post',
        dataType: 'json',
        //url: ajaxUrl + 'GetNewOrdersCommodityListForH5',
       // url: ajaxUrl + 'GetNewOrdersCommodityList',
        url: ajaxUrl + 'GetNewOrdersCommodityForHomePageShowForM',
        data:{"iPageIndex":1, "iPageSize":10},
        beforeSend: function () {
            var logoImg = '<img src="../images/loanding.gif" class="logo-img2">';
            $('.newList').append(logoImg);
        },
        success: function (data) {
            $('.newList .logo-img2').remove();
            if ( data == null || data.result[0] == undefined ) {
                $("#new-order").hide();  //没有最新订单数据则隐藏该模块
                return;
            };
            var result = '<ul>';
            $.each(data.result, function (index, item) {
                result += '<li><a href="/detail/' + item.iInfoID + '"><div class="img-box ub ub-ac ub-pc"><img class="ub" src="' + item.strMainImage + '" /></div>';
                //result += '<p>' + item.strCommodityPrice + '</p></a>';
                //if (item.decMinPriceRMB == 0) {
                //    result += '<p>￥' + item.decMinPriceRMB + '</p></a>';
                //}
                //else {
                //    result += '<div class="has-border-top"><p class="text-danger">￥' + item.decMinPriceRMB;
                //    if (item.decOrginalPriceRMB > item.decMinPriceRMB) {
                //        //原价大于最小金额才显示原价
                //        result += '<del class="light-color">￥' + item.decOrginalPriceRMB + '</del>';
                //    }
                //}
                result += '<p>￥' + item.decMinPriceRMB + '</p></a>';
                result += '</li>';

            });
            result += '<li><a href="/home/recentorder"><div class="look-more" style="text-align:center;"><img src="../../images/more.png"><p>查看全部</p></div><a></li></ul>';
            $('.newList').append(result);
        }

    });
}

function loadSpecialDataList() {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: ajaxUrl+'SpecialListQueryHomePageShowForM',
        success: function (data) {
            data = data.result;
            var result = '';
            $.each(data, function (index, item) {
                result += '<li>';
                //result += '<a href="/specialperson/' + item.iParentSpecialID + '"><img src="' + item.strSpecialImage + '"><img class="specialIcon" src="' + item.strSpecialIcon + '"></a>';
                result += '<a href="/specialperson/' + item.iParentSpecialID + '"><img class="lazy" data-original="' + item.strSpecialImage + '"><img class="specialIcon" data-original="' + item.strSpecialIcon + '"></a>';
                result += '<li>';
            });
            $('.rm-lists').append(result);
            $('.rm-lists .lazy,.rm-lists .specialIcon').lazyload({
                effect: "fadeIn"
            });
        }
    });
}

function loadBrandDataList() {

    $.ajax({
        type: 'get',
        dataType: 'json',
        url: ajaxUrl + 'BrandExclusiveListQueryWithInfoHomePageShowForM',
        data: { "p_iPageIndex": 1, "p_iPageSize": 10 },
        success: function (data) {
            data = data.result;
            var result = '';
            $.each(data, function (index, item) {
                result += '<div class="content-item">';

                result += '<a href="/brandexclusive/' + item.iBrandExclusiveID + '">';
                //result += '<img src = "' + item.strBrandImage + '" /><span>查看全部</span><i></i>';
                result += '<img class="lazy" data-original="' + item.strBrandImage + '" /><span>查看全部</span><i></i>';
                result += '</a>';

                result += '<div class="scroller"><ul class="pp-list">';

                $.each(item.listRecommendInfo, function (index, subitem) {
                    result += '<li><a href="/detail/' + subitem.iInfoID + '">';
                    result += '<div class="pp-imgBox ub ub-ac ub-pc">';
                    //result += '<img class="ub" src="' + subitem.strMainImage + '"/>';
                    result += '<img class="ub lazy" data-original="' + subitem.strMainImage + '"/>';
                    result += '</div>';

                    result += '<p>' + subitem.strInfoTitle + '</p>';
                    result += '<p class="color-red">￥' + subitem.decMinPriceRMB + '</p>';
                    result += '</a></li>'


                });
                result += '<li><a href="/brandexclusive/' + item.iBrandExclusiveID + '"><div class="look-more"><img src="../../images/more.png"><p>查看全部</p></div><a></li>';
                result += '</ul></div>'
                result += '</div>'


            });

            $('#tabContentTwo').append(result);
            $('#tabContentTwo .lazy').lazyload({
                effect: "fadeIn",
                threshold: 500
            });

            //加载完品牌列表再显示全部专场动图
            $('.all-special img').lazyload({
                effect: "fadeIn"
            });
            //$('#tabContentTwo .lazy').lazyload({
            //    effect: "fadeIn",
            //    threshold: 200,
            //    failurelimit : 10,
            //    container: $(".scroller")
            //});
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
                data: { "pageIndex": counter, "pageSize": num, "infoType": 0, "homeShow": 1, "isTop": 1, "catUrl": "", "tagUrl": "", "brightUrl": "", "keyWord": "", "mallUrl": "", "exceptMallUrl": "", "infoNation": 0 },
                url: ajaxUrl + 'GetInfoListWithHomeshowAndIstop_exceptMallUrlJson',
                success: function (data) {
                    counter++;
                    var result = '';
                    $.each(data, function (index, item) {

                        result += '<li class="pro-item cl">';
                        result += '<a href="/detail/' + item.InfoID + '">';

                        result += '<div class="img-bg-box ub ub-ac ub-pc">';
                        //result += '<img class="ub" src="' + item.MainImage + '">';
                        result += '<img class="ub lazy" data-original="' + item.MainImage + '">';

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

                        //result += '<p class="text-danger">' + item.CommodityPrice + '</p>';
                        if (item.MinPriceRMB == 0) {
                            result += '<div class="has-border-top"><span class="text-danger">' + item.CommodityPrice + '</span>';
                        }
                        else {
                            result += '<div class="has-border-top"><span class="text-danger">￥' + item.MinPriceRMB + '</span>';
                            if (item.OrginalPriceRMB > item.MinPriceRMB && item.OrginalPriceRMB > item.MaxPriceRMB) {
                                //原价大于最小金额才显示原价
                                result += '<del class="light-color">￥' + item.OrginalPriceRMB + '</del>';
                            }
                        }
                        result += '</div>';
                        if (item.MallName != ""){
                            result += '<p class="mallname light-color">' + item.MallName + '供货</p>';
                        }
                        result += '</a>';
                        result += '</li>';
                    });
                    //if ((i + 1) >= infolist.length) {
                    //    alert(111111111);
                    //   
                    //    // 锁定
                    //    me.lock();
                    //    // 无数据
                    //    me.noData();
                    //    break;
                    //}

                    $('.recommend-lists').append(result);
                    $('.recommend-lists .lazy').lazyload({
                        effect: "fadeIn",
                        threshold: 200
                    });
                    // 每次数据加载完，必须重置
                    me.resetload();
                },
                error: function (xhr, type) {
                    //alert('Ajax error!');
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });

        }

    });
}

function loadHeaderBanner() {    
    var userInfo = getUserInfo();  //获取用户信息(public公共方法)
    if (userInfo != undefined) {
        var userHtml = '<a href="/user/index">' + userInfo.strNickname + '</a>';
        $(".sing-in").html(userHtml);
    }
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: ajaxUrl+'GetPromotionsListWithInfoNationJsonHomePageShowForM',
        data: { mallUrl: '', infoNation: 0 },
        success: function (data) {
            data = data.result;
            var isLogin = false;            
            if (userInfo != undefined) {
                isLogin = true;
            }
            var result = '<ul>';
            $.each(data, function (index, item) {
                //地址是活动地址
                if (item.ProWebsite == "http://user.biyabi.com/userlogin" && isLogin) {

                }
                else {
                    result += '<li><a href="' + item.ProWebsite + '"><img src="' + item.ProImage + '" ></a></li>';
                }
               
            });
            result += '</ul>';
            $('.bd').append(result);
            //bannner切换
            TouchSlide({
                slideCell: 'homeBanner',
                titCell: ".hd ul",
                mainCell: ".bd ul",
                autoPage: "true",
                autoPlay: "true",
                effect: "leftLoop",
                delayTime: 500,
                interTime: 4000
            });
            $('#homeBanner .hd ul li').each(function () {
                $(this).html('');
            });
        }
    });
}



$(document).ready(function () {
    loadHeaderBanner();
    loadRecentOrderDataList();
    loadSpecialDataList();
    loadBrandDataList();
    loadReCommendList();

    //bannner切换
    //setTimeout(function () {
    //    TouchSlide({
    //        slideCell: 'homeBanner',
    //        titCell: ".hd ul",
    //        mainCell: ".bd ul",
    //        autoPage: "true",
    //        autoPlay: "true",
    //        effect: "leftLoop",
    //        delayTime: 500,
    //        interTime: 4000
    //    });
    //    $('#homeBanner .hd ul li').each(function () {
    //        $(this).html('');
    //    });
    //}, 1000);
});