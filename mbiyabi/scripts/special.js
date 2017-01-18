

//tabContentOne
//加载首页显示的热门专场
function loadSpecialDataList() {
    $.ajax({
        type: 'get',
        dataType: 'json',
        //data: { "iPageIndex": 1, "iPageSize": 20, "iParentSpecialID": 1 },
        url: ajaxUrl + 'SpecialListQueryHomePageShowForM',
        success: function (data) {
            data = data.result;
            var result = '';
            $.each(data, function (index, item) {
                result += '<a href="/specialperson/' + item.iParentSpecialID + '">';
                result += '<div class="newStyle content-item" style="position: relative;overflow:visible;"> <img src="' + item.strSpecialImage + '" ><img style="width: auto; position: absolute;left: -5px;top: 20px;height: 28px;" src="' + item.strSpecialIcon + '"></div>';
                result += '</a>';
            });
            $('#tabContentOne').append(result);
        }
    });
}

function loadBrandDataList() {
    //加载
    var counter = 1;  //当前页
    // 每页展示3个
    var num = 3;
    // dropload
    var dropload = $('#tabContentTwo').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: ajaxUrl + 'BrandExclusiveListQueryWithInfo',
                data: { "p_iPageIndex": counter, "p_iPageSize": num },
                success: function (data) {
                    //如果查询后台数据为空，则返回了 [{}]
                    if (data.length > 1) {
                        counter++;
                        var result = '';
                        $.each(data, function (index, item) {
                            result += '<li class="content-item">';
                            result += '<a href="/brandexclusive/' + item.iBrandExclusiveID + '"><img src = "' + item.strBrandImage + '" /><span>查看全部</span><i></i></a>';
                            result += '<div class="scroller"><ul class="pp-list">';

                            $.each(item.listRecommendInfo, function (index, subitem) {
                                result += '<li><a href="/detail/' + subitem.iInfoID + '">';
                                result += '<div class="ub ub-ac ub-pc pp-imgBox">';
                                result += '<img src="' + subitem.strMainImage + '">';
                                result += '</div>';

                                result += '<p>' + subitem.strInfoTitle + '</p>';
                                result += '<p class="color-red">￥' + subitem.decMinPriceRMB + '</p>';
                                result += '</a></li>';
                            });
                            result += '<li><a href="/brandexclusive/' + item.iBrandExclusiveID + '"><div class="look-more"><img src="../../images/more.png"><p>查看全部</p></div></a></li>';
                            result += '</ul></div>'
                            result += '</li>';
                        });
                        if (data.length < num) {
                            tab2LoadEnd = true;
                            me.lock();
                            me.noData();
                        }
                        $('#tabContentTwo>ul').append(result);
                    }
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
    loadSpecialDataList();
    loadBrandDataList();
    if (localStorage.isBrandSpecail != undefined) {
        $('#tabContentTwo').addClass('on');
        $('#tabContentOne').removeClass('on');
        $('#tabnav2').addClass('on');
        $('#tabnav1').removeClass('on');
    }
    //点击返回
    $(".st-header .go-back").on("click", function () {

    });

    //完成tab切换操作
    $('.spacial-title li a').on('click', function () {
        var obj = $(this).attr('data-click').substring(1);
        $('#' + obj).addClass('on');
        $('#' + obj).siblings('.content-box').removeClass('on');
        $(this).addClass('on');
        $(this).parent().siblings('li').children('a').removeClass('on');
        if (obj == "tabContentTwo") {
            localStorage.isBrandSpecail = true;
        } else {
            localStorage.removeItem("isBrandSpecail");
        }
    });
});