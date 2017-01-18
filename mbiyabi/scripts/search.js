//加载推荐列表
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
                type: 'post',
                dataType: 'json',
                data: { "pageIndex": counter, "pageSize": num, "keyWord": decodeURI(GetQueryString("keyword")), "infoType": 0, "homeShow": 1, "isTop": 1, "isPurchasing": 1, "catUrl": "", "brandUrl": "", "tagUrl": "", "brightUrl": "", "mallUrl": "", "exceptMallUrl": "", "infoNation": 0, "smallPrice": 0, "bigPrice": 0, "orderBy": 0 },
                url: ajaxUrl + 'GetInfoListWithBrandJson_V2',
                success: function (json) {
                    if (json.code == 200) {

                        var data = json.result.infoList;
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
                            }
                            else {
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

                        if (data != undefined) {
                            if (data.length < num) {
                                tab1LoadEnd = true;
                                me.lock();
                                me.noData();
                            }
                        }


                        if (data == undefined) {
                            tab1LoadEnd = true;
                            me.lock();
                            me.noData();
                        }

                        $('.recommend-lists').append(result);
                    }
                    else {
                        //搜索不到数据时
                        tab1LoadEnd = true;
                        me.lock();
                        me.noData();
                    }
                    // 每次数据加载完，必须重置
                    me.resetload();

                },
                error: function (xhr, type) {
                    // 即使加载出错，也得重置
                    //me.resetload();
                    tab1LoadEnd = true;
                    me.lock();
                    me.noData();
                }
            });
        }
    });
}
$(document).ready(function () {
    //防止首页点击搜索按钮，会点到下载
    setTimeout(function () { $(".download-img").attr("href", "/down"); }, 3000);

    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".uc-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }
    $(".uc-header h4").text("搜索“" + decodeURI(GetQueryString("keyWord") == "" ? "所有" : GetQueryString("keyWord")) + "”的结果");  //decodeURI()解决中文编码问题
    loadReCommendList();
});