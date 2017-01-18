

//加载最新列表
function loadReCommendList() {
    //加载推荐
    var counter = 1;
    // 每页展示10个
    var num = 10;
    // dropload
    var dropload = $('.latest-recommended').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $.ajax({
                type: 'get',
                dataType: 'json',
                data: { "infoType": 5, "homeShow": 0, "pageIndex": counter, "pageSize": num, "isTop": 1, "catUrl": "", "tagUrl": "", "brightUrl": "", "keyWord": "", "mallUrl": "", "exceptMallUrl": "", "infoNation": 0 },
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
                        result += '<p class="mallname light-color">' + item.MallName + '供货</p>';
                        result += '</a>';
                        result += '</li>';
                    });

                    $('.recommend-lists').append(result);
                    // 每次数据加载完，必须重置
                    me.resetload();
                },
                error: function (xhr, type) {
                    me.resetload();
                }
            });
        }
    });
}

$(document).ready(function () {
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".st-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }
    loadReCommendList();
});