
//加载最新订单列表
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
                data: { "iPageIndex": counter, "iPageSize": num },
                url: ajaxUrl + 'GetNewOrdersCommodityList',
                success: function (data) {
                    if (data.length > 0) {
                        counter++;
                        var result = '';
                        $.each(data, function (index, item) {

                            result += '<li class="pro-item cl">';
                            result += '<a href="/detail/' + item.iInfoID + '">';
                            result += '<div class="img-bg-box ub ub-ac ub-pc">';
                            result += '<img class="ub" src="' + item.strMainImage + '">';
                            result += '</div>';
                            result += '<div class="goods-name-box"><p class="goods-name">' + item.strInfoTitle + '</p></div>';
                            result += '<div class="has-border-top"><span class="text-danger">￥' + item.decMinPriceRMB + '</span>';
                            if (item.OrginalPriceRMB > item.MinPriceRMB && item.OrginalPriceRMB > item.MaxPriceRMB) {
                                //原价大于最小金额才显示原价
                                result += '<del class="light-color">￥' + item.OrginalPriceRMB + '</del>';
                            }
                            result += '</div>';
                            result += '<p class="mallname light-color">' + item.mall.strMallName + '供货</p>';
                            result += '</a>';
                            result += '</li>';
                        });
                        if (data.length < num) {
                            me.lock();
                            me.noData();
                        }
                    } else {
                        me.lock();
                        me.noData();
                    }

                    $('.recommend-lists').append(result);
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

$(document).ready(function () {
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".st-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }
    loadReCommendList();
});