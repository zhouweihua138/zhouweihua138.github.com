
$(document).ready(function () {
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".st-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }
    //verifyLogin();
    var userInfo = getUserInfo();  //获取用户信息(public公共方法)
    if (userInfo == undefined) {
        localStorage.returnUrl = window.location.href;
        window.location.href = '/userlogin';
        return;
    }

    //没数据就锁住，有数据就不锁住
    var idx = 0;
    var tab1LoadEnd = false;
    var tab2LoadEnd = false;
    var counter1 = 1;  //商品当前页
    var counter2 = 1;  //晒单当前页

    $(document).on("click", ".tabnav a", function () {
        idx = $(this).index();
        $(this).siblings("a").removeClass("active");
        $(this).addClass("active");
        $(".latest-recommended .recommend-lists").removeClass("active");
        $(".latest-recommended .recommend-lists").eq(idx).addClass("active");
        // 如果选中菜单一
        if (idx == 0) {//加载收藏
            counter1 = 1;  //商品当前页
            // 如果数据没有加载完
            if (!tab1LoadEnd) {
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }
            // 如果选中菜单二
        } else if (idx == 1) {
            counter2 = 1;  //晒单当前页
            if (!tab2LoadEnd) {
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }
        }
        // 重置
        dropload.resetload();
    });

    // 每页展示10个
    var num = 10;
    // dropload
    var dropload = $('.latest-recommended').dropload({
        scrollArea: window,
        loadDownFn: function (me) {

            // 加载菜单一的数据
            if (idx == 0) {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    data: { "pageIndex": counter1, "pageSize": num, "userID": userInfo.iUserID, "infoType": 0 },
                    url: ajaxUrl + 'GetCollectInfoJson',
                    success: function (data) {
                        //如果查询后台数据为空，则返回了 [{}]
                        if (data[0].InfoID != undefined) {
                            counter1++;
                            var result = '';
                            $.each(data, function (index, item) {
                                result += '<li class="pro-item cl">';
                                result += '<a href="/detail/' + item.InfoID + '">';
                                result += '<div class="img-bg-box ub ub-ac ub-pc">';
                                result += '<img class="ub" src="' + item.InfoImage + '">';
                                result += '</div>';
                                result += '<div class="goods-name-box"><p class="goods-name">' + item.InfoTitle + '</p></div>';
                                if (item.decMinPriceRMB == 0) {
                                    result += '<span class="text-danger">' + item.CommodityPrice + '</span>';
                                }
                                else {
                                    result += '<span class="text-danger">￥' + item.decMinPriceRMB + '</span>';
                                }

                                //result += '<p class="text-danger">' + item.CommodityPrice + '</p>';
                                result += '</a>';
                                result += '</li>';

                            });
                            //if (data.length==0) {
                            if (data.length < num) {
                                tab1LoadEnd = true;
                                me.lock();
                                me.noData();
                            }
                            if (counter1 <= 2) {
                                $('.product-list').html(result);
                            } else {
                                $('.product-list').append(result);
                            }
                        }
                        else {
                            tab1LoadEnd = true;
                            me.lock();
                            me.noData();
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
                //加载菜单二的数据
            else if (idx == 1) {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: ajaxUrl + 'GetCollectInfoByUserID',
                    data: { "Page": counter2, "PageSize": num, "UserID": userInfo.iUserID, "InfoType": 3 },
                    success: function (data) {
                        //为空的时候返回 [{infocount: 0, infolist: []}]
                        if (data[0].infocount > 0) {

                            data = data[0].infolist;
                            if (data.length > 0) {
                                counter2++;
                                var result = '';
                                $.each(data, function (index, item) {
                                    result += '<li class="pro-item cl">';
                                    result += '<a href="/mshareshoppingdetail/' + item.InfoID + '">';
                                    result += '<div class="img-bg-box ub ub-ac ub-pc">';
                                    result += '<img class="ub" src="' + item.InfoImage + '">';
                                    result += '</div>';
                                    result += '<div class="shaidan-info ub"><div class="ub ub-ac ub-pc face-box"><img src="' + item.postHeadImage + '"></div>'
                                    result += '<div class="ub-f1"><p>' + item.PostNickName + '</p>';
                                    result += '<p class="light-color">' + item.CollectTime + '</p></div>';
                                    result += '</div>';
                                    result += '</a>';
                                    result += '</li>';
                                });

                                //if (data.length == 0) {
                                if (data.length < num) {
                                    tab2LoadEnd = true;
                                    me.lock();
                                    me.noData();
                                }
                                if (counter2 <= 2) {
                                    $('.shaidan-list').html(result);
                                } else {
                                    $('.shaidan-list').append(result);
                                }
                            }
                        }
                        else {
                            tab2LoadEnd = true;
                            me.lock();
                            me.noData();
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
        }
    });
});