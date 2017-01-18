
$(function () {
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".st-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }

    var id = '';
    var indexQuestion = window.location.href.lastIndexOf("?");
    var indexQuestion2 = window.location.href.lastIndexOf("/?");

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

    $.ajax({
        type: 'post',
        dataType: 'json',
        data: { "p_iSpecialID": id },
        url: ajaxUrl + 'SpecialInfoBySpecialID',
        beforeSend: function () {
            var logoImg = '<div class="loading-box cl"><img src="../images/loanding.gif" class="logo-img2"><span>加载中</span></div>';
            $(logoImg).insertAfter('.header-box');
        },
        success: function (json) {
            $('#main .loading-box').remove();
            $('.article').show();
            if (json == null) {
                $(".header h4").text("oh oo~ 未找到相关专场");
                $("<p style='margin-top:50px;text-align:center;'>未找到相关专场，<a href='/index.html' style='color:#e72b41'>去首页逛逛</a></p>").insertBefore(".sd-big-img");
                $(".sd-big-img,.se-text").hide();
                return;
            }
            //如果查询后台数据为空，则返回了 [{}]
            //if (json.result.infoList.length > 0) {
            $(".header h4").text(json.strSpecialName);
            $("title").text(json.strSpecialName + " - 比呀比海外购");
            $(".sd-big-img").attr("src", json.strSpecialDetailImage);
            $("#se-text").text(json.strSpecialContent);
            var data = json.listRecommendInfo;
            var result = '';
            $.each(data, function (index, item) {
                result += '<div class="pro-item cl">';
                result += '<a href="/detail/' + item.iInfoID + '">';
                result += '<div class="ub ub-ac ub-pc img-bg-box">';
                result += '<img src="' + item.strMainImage + '">';
                result += '</div>';
                result += '<div class="goods-name-box"><p class="goods-name">' + item.strInfoTitle + '</p></div>';
                result += '<div class="has-border-top">';
                if (item.decMinPriceRMB == 0) {
                    result += '<span class="text-danger">' + item.strCommodityPrice + '</span>';
                } else {
                    result += '<span class="text-danger">￥' + item.decMinPriceRMB + '</span>';
                }
                if (item.decOrginalPriceRMB > item.decMinPriceRMB && item.decOrginalPriceRMB > item.decMaxPriceRMB) {
                    result += '<del class="light-color">￥' + item.decOrginalPriceRMB + '</del>';
                }
                result += '</div>';
                result += '<p class="mallname light-color">' + item.mall.strMallName + '</p>';
                result += '</a>';
                result += '</div>';
            });
            $('.recommend-lists').append(result);
            //}
        },
        error: function (xhr, type) {
            $(".header h4").text("oh oo~ 未找到相关专场");
            $("<p style='margin-top:50px;text-align:center;'>未找到相关专场，<a href='/index.html' style='color:#e72b41'>去首页逛逛</a></p>").insertBefore(".sd-big-img");
            $(".sd-big-img,.se-text").hide();
            return;
        }
    });
});