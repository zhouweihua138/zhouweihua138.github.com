
$(function () {
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".st-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }
    var id = '';
    var indexQuestion = window.location.href.lastIndexOf('?');  //http://m.biyabi.com/specialperson/10?from=timeline
    var indexQuestion2 = window.location.href.lastIndexOf("/?");  //http://m.biyabi.com/specialperson/10418/?from=timeline

    if (indexQuestion < 0) {
        id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    } else {
        if (indexQuestion2 < 0) {
            var afterUrl = window.location.href.substring(0, indexQuestion);
            //id = afterUrl.substring(afterUrl.lastIndexOf('/') + 1);
        } else {
            var afterUrl = window.location.href.substring(0, indexQuestion2);
            //id = afterUrl.substring(afterUrl.lastIndexOf('/') + 1);
        }

        //循环读出url中的数字id
        for (var i = 0; i < afterUrl.length; i++) {
            if (!isNaN(afterUrl[i])) {
                id += afterUrl[i];
            }
        }
    }
    if (id == '') {  //没有id则跳转到专场首页
        window.location.href = '/specials';
        return false;
    }

    //加载
    var counter = 1;  //当前页
    // 每页展示10个
    var num = 10;
    // dropload
    var dropload = $('.st-lists').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $.ajax({
                type: 'post',
                dataType: 'json',
                data: { "p_iPageIndex": counter, "p_iPageSize": num, "p_iParentSpecialID": id, "p_btSpecialType": 2 },
                url: ajaxUrl + 'SpecialListQuery',
                success: function (data) {
                    //如果查询后台数据为空，则返回了 [{}]
                    if (data.length > 0) {
                        $(".header h4").text(data[0].strParentSpecialName);
                        $("title").text(data[0].strParentSpecialName + " - 比呀比海外购");
                        counter++;
                        var result = '';
                        $.each(data, function (index, item) {
                            result += '<li class="st-list-item">';
                            result += '<a href="/special/' + item.iSpecialID + '">';
                            result += '<img src="' + item.strSpecialImage + '">';
                            result += '</a>';
                            result += '</li>';
                        });
                        if (data.length < num) {
                            me.lock();
                            me.noData();
                        }
                        $('.st-lists ul').append(result);
                    } else {
                        if (counter <= 2) {
                            //没有数据的时候
                            $(".header h4").text("oh oo~未找到相关专场");
                            me.lock();
                            me.noData();
                            $(".st-lists").hide();
                            $("<p style='margin-top:50px;text-align:center;'>未找到相关专场，<a href='/index.html' style='color:#e72b41'>去首页逛逛</a></p>").insertAfter(".st-lists");
                        } else {
                            me.lock();
                            me.noData();
                        }
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
    })
});