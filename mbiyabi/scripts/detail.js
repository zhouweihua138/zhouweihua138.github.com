
$(function () {
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".navbar-btn-left").html("").attr("href", "javascript:;");
    }

    var productId = "";
    var indexQuestion = window.location.href.lastIndexOf('?');
    if (indexQuestion > 0) {
        var url = window.location.href.substring(0, indexQuestion);
    } else {
        var url = window.location.href
    }

    //if (temProductId == "" || isNaN(temProductId)) {  //处理id后的斜杠如：/8001/ 处理为 /8001
    //    var afterUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    //    productId = afterUrl.substring(afterUrl.lastIndexOf('/') + 1);
    //} else {
    //    productId = temProductId;
    //}

    //var indexQuestion = window.location.href.lastIndexOf('?');
    //var indexQuestion2 = window.location.href.lastIndexOf("/?");

    //if (indexQuestion < 0) {
    //    id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    //} else {
    //    if (indexQuestion2 < 0) {
    //        var afterUrl = window.location.href.substring(0, indexQuestion);
    //        id = afterUrl.substring(afterUrl.lastIndexOf('/') + 1);
    //    } else {
    //        var afterUrl = window.location.href.substring(0, indexQuestion2);
    //        id = afterUrl.substring(afterUrl.lastIndexOf('/') + 1);
    //    }
    //}

    
    p = url.match(/detail\/([^\/]*)/);
    url = p != null ? p[1] : "";

    for (var i = 0; i < url.length; i++) {
        if (!isNaN(url[i])) {
            productId += url[i];
        }
    }

    productId = productId == "" ? 0 : parseInt(productId);
    var userInfo = getUserInfo();
    var infoId;  //点赞所需参数，从商品信息返回结果取得
    var strCatUrl = "";  //类别url，用于判断是否鞋子类，以显示尺码说明

    if (productId != 0) {
        getProductInfo(productId);
    }
    //获取商品信息
    function getProductInfo(productid) {
        $.ajax({
            type: "post",
            dataType: 'json',
            data: { "iInfoID": productid },
            url: ajaxUrl + "GetNewInfoDetial",
            async: false,
            success: function (data) {
                //设置title标签
                $("title").text(data.GetInfoData.result.strInfoTitle + " - 比呀比海外购");
                //帖子类商品
                if (data.GetInfoData.result.infoType != "7") {
                    //window.location.href = "/detailtopic/" + productid;
                    //return;
                    $(".home-banner2,.info-content-box,.recommend-man,.info-content-bottom").show();
                    $("#homeBanner2").html('<img src="' + data.GetInfoData.result.strMainImage + '" />');
                    if (data.GetInfoData.result.btSaleStatus == 2) {
                        $("#homeBanner2").append("<i>售完</i>");
                    }
                    //供货
                    $("p.source").html('<img src="http://pic.biyabi.com/country_icon/' + data.GetInfoData.result.btCountry + 'icon.jpg" />' + data.GetInfoData.result.mall.strMallName + ' 供货 <span>海外直发</span>');

                    //帖子内容
                    $(".info-content-box").html(data.GetInfoData.result.strInfoContent);
                    $(".recommend-man>p").text("推荐人：" + data.GetInfoData.result.user.strNickname);
                    $(".info-content-bottom>a").attr("href", data.GetInfoData.result.strSourceUrl);

                    if (data.GetInfoData.result.iIsPurchasing == 1) {
                        if (data.GetInfoData.result.btSaleStatus == 2 || data.GetInfoData.result.btSaleStatus == 3) {
                            $('.footbar-right').html('<a class="ub ub-ac ub-pc ub-f1 btnFindLike" href="#recommend">售光了，找相似</a>');
                        }
                        else {
                            $('.footbar-right').html('<a class="ub ub-ac ub-pc ub-f1 btnAddCart" id="btnAddCart" href="javascript:;">加入购物车</a> <a class="ub ub-ac ub-pc ub-f1 btnAddCart" id="btnBuy" href="javascript:;">立即购买</a>');
                        }
                    }
                    else if (data.GetInfoData.result.iIsPurchasing == 2 && data.GetInfoData.result.btSaleStatus == 2 || data.GetInfoData.result.iIsPurchasing == 2 && data.GetInfoData.result.btSaleStatus == 3) {
                        $('.footbar-right').html('<a class="ub ub-ac ub-pc ub-f1 btnFindLike" href="#recommend">售光了，找相似</a>');
                    }
                    else {
                        $('.footbar-right').html('<a class="ub ub-ac ub-pc ub-f1 btnLink" href="' + data.GetInfoData.result.strSourceUrl + '" target="_blank">商品原链接</a>');
                    }

                } else {  //专场类型商品
                    $(".home-banner1,.text-advance").show();
                    //设置商品图片轮播
                    var strImageArray = data.GetInfoData.result.strImageArray;
                    var arrImageArray = strImageArray.split(',');
                    var str = '';
                    for (var i = 0; i < arrImageArray.length; i++) {
                        str += '<li class="ub-ac ub-pc">';
                        str += '<img src="' + arrImageArray[i] + '" />';
                        str += '</li>';
                    }
                    $("#homeBanner>.bd>ul").append(str);
                    if (data.GetInfoData.result.btSaleStatus == 2) {
                        $("#homeBanner>.bd").append("<i>售完</i>");
                        $(".footbar-right").html('<a class="ub ub-ac ub-pc ub-f1 btnFindLike" href="#recommend">售光了，找相似</a>');
                    }

                    //供货
                    $("p.source").html('<img src="http://pic.biyabi.com/country_icon/' + data.GetInfoData.result.btCountry + 'icon.jpg" />' + data.GetInfoData.result.mall.strMallName + ' 供货');

                    $(".editor-box,.summary-box").show();

                    //小编评语
                    $(".editor-box>p").text(data.GetInfoData.result.strEditorRemark);

                    //商品概述
                    $(".summary-box .info-content").text(data.GetInfoData.result.strInfoContent);

                    //品牌信息
                    if (data.GetInfoBrandData.result != null) {
                        var brandHtml = '<div class="section-box brand-box"><h1>品牌</h1><div class="ub brand-logo">';
                        brandHtml += '<img src="' + data.GetInfoBrandData.result.strBrandLogo + '" width="42" /><div class="ub ub-f1 ub-ver">';
                        brandHtml += '<h1>' + data.GetInfoBrandData.result.strBrandName + '</h1>';
                        brandHtml += '<p>著名品牌</p></div>';
                        brandHtml += '<a href="' + data.GetInfoData.result.strSourceUrl + '">商品原链接</a></div>';
                        brandHtml += '<p>' + data.GetInfoBrandData.result.strBrandDes + '</p></div>';
                        $(brandHtml).insertAfter(".comment-box");
                    }

                    //bannner切换
                    TouchSlide({
                        slideCell: 'homeBanner',
                        titCell: ".hd ul",
                        mainCell: ".bd ul",
                        autoPage: "true",
                        autoPlay: "false",
                        effect: "leftLoop",
                        delayTime: 500,
                        interTime: 4000
                    });
                }

                //设置商品基本信息
                $("#info-title").text(data.GetInfoData.result.strInfoTitle);
                var priceHtml = '';
                if (data.GetInfoData.result.decMinPriceRMB == 0 && data.GetInfoData.result.decMaxPriceRMB == 0 && data.GetInfoData.result.decOrginalPriceRMB != 0) {
                    priceHtml = '<label class="defaultPrice"><label>' + data.GetInfoData.result.decOrginalPriceRMB + '</label></label>';
                }
                else if (data.GetInfoData.result.decMinPriceRMB == 0 && data.GetInfoData.result.decMaxPriceRMB == 0 && data.GetInfoData.result.decOrginalPriceRMB == 0) {
                    priceHtml = '<label class="defaultPrice"><label>' + data.GetInfoData.result.strCommodityPrice + '</label></label>';
                }
                else if (data.GetInfoData.result.decMinPriceRMB == data.GetInfoData.result.decMaxPriceRMB) {
                    priceHtml = '<label class="defaultPrice"><label>￥</label><label>' + data.GetInfoData.result.decMinPriceRMB + '</label></label>';
                    if (data.GetInfoData.result.decOrginalPriceRMB > data.GetInfoData.result.decMinPriceRMB && data.GetInfoData.result.decOrginalPriceRMB > data.GetInfoData.result.decMaxPriceRMB) {
                        priceHtml += '<del style="color: #888;font-size: 12px;margin-left: 5px;">￥' + data.GetInfoData.result.decOrginalPriceRMB + '</del>';
                    }
                }
                else if (data.GetInfoData.result.decMinPriceRMB < data.GetInfoData.result.decMaxPriceRMB) {
                    priceHtml = '<label class="defaultPrice"><label>￥</label><label>' + data.GetInfoData.result.decMinPriceRMB + '</label><label>～</label><label>' + data.GetInfoData.result.decMaxPriceRMB + '</label></label>';
                }
                //商品价格
                $(".price.text-red").html(priceHtml);


                //跟贴评论
                $(".comment-box .head-right").attr("href", '/inforeviewlist.html?info=' + data.GetInfoData.result.iInfoID);                
                if (data.GetInfoReview.result != undefined && data.GetInfoReview.rowscount != 0) {
                    //java接口中评论数据为空时GetInfoReview是一个空对象{}，所以判断result是否为undefined
                    var listInfoReview = data.GetInfoReview.result;   //.Take(6).ToList();                    
                    var reviewHtml = '';
                    //最多显示6条评论
                    for (var i = 0; i < (listInfoReview.length > 6 ? 6 : listInfoReview.length) ; i++) {
                        reviewHtml += '<li class="ub">';
                        reviewHtml += '<img class="user-face" src="' + listInfoReview[i].user.strHeadImage + '" width="25" />';
                        reviewHtml += '<div class="ub ub-f1 ub-ver">';
                        reviewHtml += '<p>' + listInfoReview[i].user.strNickname + '</p>';
                        reviewHtml += '<p>' + listInfoReview[i].dtReviewTime + '</p>';
                        reviewHtml += '<p>' + listInfoReview[i].strReviewContent + '</p></div></li>';
                    }
                }
                $(".comment-box .comment-list").append(reviewHtml);
                //跟贴评论/到手评价数量
                var reviewCountHtml = '<a href="/inforeviewlist.html?info=' + data.GetInfoData.result.iInfoID + '">比友跟帖（' + (data.GetInfoReview.rowscount == undefined ? "0" : data.GetInfoReview.rowscount) + '）</a> ';  //无数据则为0
                reviewCountHtml += '<a href="/inforeviewlist.html?info=' + data.GetInfoData.result.iInfoID + '">到手评价（' + data.GetOrdersCommodityReviewCountByInfoID.result + '）</a>';
                $(".comment-box .comment-bottom").append(reviewCountHtml);

                $("#ClickPraiseNum").text(data.GetInfoData.result.iIsGood);
                infoId = data.GetInfoData.result.iInfoID;
                strCatUrl = data.GetInfoData.result.strCatUrl.split(',')[0];  //类别url用于判断是否鞋子类以显示尺寸说明
            }
        });
    }

    getCartCount();
    //获取购物车商品个数
    function getCartCount() {
        if (userInfo != undefined) {
            //$.ajax({
            //    type: "Post",
            //    dataType: 'json',
            //    contentType: "application/json; charset=utf-8",
            //    data: "{\"mUser\":{\"iUserID\":" + userInfo.iUserID + ",\"strAppPwd\":\"" + getstrPwd() + "\"},\"mApp\":{\"iAppID\":0,\"strAppName\":\"\",\"strAppVersion\":\"\",\"iClientLanType\":1},\"strVerCode\":\"\",\"iRequstType\":1}",
            //    url: apiUrl + "GetCartCommodityListQuery",
            //    success: function (data) {
            //        if (data.result.length > 0) {
            //            $("#cart-badge").text(data.result.length);
            //        } else {
            //            $("#cart-badge").text(0);
            //        }
            //    }
            //});
            $.ajax({
                type: "post",
                dataType: 'json',
                data: {
                    "p_iUserID": userInfo.iUserID,
                    "p_strPwd": getstrPwd()
                },
                url: ajaxUrl + "GetCartCount",
                success: function (data) {
                    if (data) {
                        $("#cart-badge").text(data);
                    } else {
                        $("#cart-badge").text(0);
                    }
                },
                error: function () {
                    $("#cart-badge").text(0);
                }
            });
        }
        else {
            $("#cart-badge").text(0);
        }
    }

    //滑动商品属性防止详情页面跟随滚动
    $(".popup-layer .p-container").on("touchmove", function (e) {
        e.stopPropagation();   //阻止事件冒泡
    });

    //翻译
    $(document).on("click", ".btn-translate", function () {
        var $this = $(this);
        $this.text("努力翻译中...");
        $.ajax({
            type: "post",
            dataType: 'json',
            data: { "infoID": productId },
            url: ajaxUrl + "TransLateContent",
            success: function (data) {
                if (parseInt(data.code) == 200) {
                    $(".translate-result").text(data.result.Content);
                    $(".summary-bottom").hide();
                    $(".translate-box").show();
                } else if (parseInt(data.code) == 201) {
                    $this.text("翻译失败，请重试");
                }
            }
        });
    });


    //点击加入购物车
    $("#btnAddCart").on("click", function () {
        $(".popup-layer-mask").fadeIn(300);
        $("body,html").css({ "overflow": "hidden" });
        $(".popup-layer").addClass("show");
        //设置是加入购物车方式
        $(".p-footer .btn-danger").attr("methodType", "1");
        //异步请求加载商品标签属性
        loadTag();
    });


    //点击立即购买
    $("#btnBuy").on("click", function () {
        $(".popup-layer-mask").fadeIn(300);
        $("body,html").css({ "overflow": "hidden" });
        $(".popup-layer").addClass("show");
        //设置是立即购买方式
        $(".p-footer .btn-danger").attr("methodType", "2");
        //异步请求加载商品标签属性
        loadTag();
    });




    //点击确认，做业务处理，关闭弹出层
    $(document).on("click", ".popup-layer .p-footer .btn-danger", function () {
        verifyLogin();
        var iCommodityTagID = $("#CommodityTagID").val();
        var icount = $("#quantity").val();
        if (iCommodityTagID != "0") {
            if ($(this).attr("methodType") == "1") {
                //加入购物车
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: "{\"mUser\":{\"iUserID\":" + userInfo.iUserID + ",\"strAppPwd\":\"" + getstrPwd() + "\"},\"mApp\":{\"iAppID\":0,\"strAppName\":\"\",\"strAppVersion\":\"\",\"iClientLanType\":1},\"iCommodityTagID\":" + iCommodityTagID + ",\"iCount\":" + icount + ",\"strVerCode\":\"\",\"iRequstType\":1}",
                    url: apiUrl + 'GetAddCart',
                    success: function (data) {
                        //data:         {"code":200,"message":"success","result":{"CartCommodityID":263832}}
                        //{"code":1,"message":"库存数量不足","result":{"CartCommodityID":0}}
                        if (data.code == 200) {
                            //alert("成功加入购物车！");
                            hDialog.show({ type: 'toast', toastText: '成功加入购物车！', toastTime: 2000, hasMask: false });
                            closePopup();
                            getCartCount();   //获取购物车商品个数
                        }
                        else {
                            //alert(data.message);
                            hDialog.show({ type: 'toast', toastText: data.message, toastTime: 2000, hasMask: false });
                        }
                    }
                });
            }
            else if ($(this).attr("methodType") == "2") {
                //点击立即购买
                window.location.href = '/neworders.html?commoditylist=' + iCommodityTagID + "_" + icount;
            }
        }
        else {
            //alert("请选择标签！");
            hDialog.show({ type: 'toast', toastText: '请选择标签！', toastTime: 2000, hasMask: false });
        }
    });



    //记录有多少类标签属性
    var typeLength = 0;
    //存标签种类数组
    var arrAllTagName = new Array();
    //记录返回的数据
    var infoData;
    //记录刚开始展示的图片
    var defaultImg = "";
    //记录默认价格
    //var defaultPrice=$(".goods-info .price").text();
    var defaultPrice = $(".goods-info .defaultPrice").text();
    //新旧标签列表
    var isNew = true;//true为new
    //异步请求加载商品标签属性
    function loadTag() {
        //异步请求获取数据
        $.ajax({
            type: 'post',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: "{\"mApp\":{\"iAppID\":0,\"strAppName\":\"\",\"strAppVersion\":\"\",\"iClientLanType\":1},\"iInfoID\":" + productId + ",\"strVerCode\":\"\",\"iRequstType\":2}",
            url: apiUrl + 'GetInfoWithCommodityTagListQuery',
            beforeSend: function () {
                var logoImg = '<img src="../images/loanding.gif" class="logo-img2">';
                $(logoImg).insertBefore('.box-quantity');
            },
            success: function (returnData) {
                $('.p-container .logo-img2').remove();
                var data = returnData.result;

                //记录返回的数据
                infoData = data;
                //设置默认显示图片
                defaultImg = data.strMainImage;
                $("#showImg").attr("src", defaultImg);
                $("#selectPrice").text(defaultPrice);

                //鞋子类别
                var arrShoeCat = [
                    "buxiexiuhuaxie",
                    "chuantongbuxie",
                    "danxie",
                    "dengshanxie",
                    "dingzhixie",
                    "ertongliangxie",
                    "fanbuxie",
                    "gaogenxie",
                    "gongnengxie",
                    "gongzhuangxie",
                    "huaixue",
                    "huwaiwa",
                    "liangxie",
                    "liangxieshatanxie",
                    "madingxue",
                    "nanfanbuxie",
                    "nangongnengxie",
                    "nanxiepeijian",
                    "nanxiuxianxie",
                    "nanxue",
                    "neizenggao",
                    "pixiefanbuxie",
                    "pogenxie",
                    "renzituo",
                    "shatanliangtuo",
                    "songgaoxie",
                    "suxixie",
                    "tongxue",
                    "tubuxie",
                    "tuoxierenzituo",
                    "xiepeijian",
                    "xiuxianxie",
                    "xuebuxie",
                    "xuedexue",
                    "xuezi",
                    "yueyepaoxie",
                    "yundongxie",
                    "yuxie",
                    "yuxieyuxue",
                    "zenggaoxie",
                    "zhengzhuangxie",
                    "nanxie",
                    "huwaixiewa",
                    "nvxie",
                    "tongxie",
                    "yundongxiewa",
                    "banxie",
                    "lanqiuxie",
                    "paobuxie",
                    "pingyuwangxie",
                    "xunlianxie",
                    "yundongbao",
                    "zuqiuxie"
                ];

                //只有默认没有标签
                if (data.AttributeTagFormatJson.length == 0) {
                    isNew = false;//旧的标签处理
                    var InfoCommodityTagList = data.InfoCommodityTagList;
                    var str = '';

                    str += '<div class="p-box tag">';
                    if (arrShoeCat.indexOf(strCatUrl) > 0) {  //鞋子类别则显示尺码参考说明
                        str += '<div class="p-title">商品属性<a class="btn-show-size" href="javascript:void(0);">尺码参考 ></a></div>';
                    } else {
                        str += '<div class="p-title">商品属性</div>';
                    }
                    str += '<div class="p-item">';
                    str += ' <ul class="clearfix">';
                    for (var i = 0; i < InfoCommodityTagList.length; i++) {
                        str += ' <li iCommodityTagID="' + InfoCommodityTagList[i].iCommodityTagID + '" strMainImage="' + InfoCommodityTagList[i].strMainImage + '"  decTagPrice="' + InfoCommodityTagList[i].decChinaPrice + '" >' + InfoCommodityTagList[i].strCommodityTagName + '</li>';
                    }
                    str += ' </ul>';
                    str += ' </div>';
                    str += ' </div>';

                    if (str != "") {
                        $(".tag").remove();
                        $(str).insertBefore(".box-quantity");
                    }

                    //标签种类只有一个标签的时候设置已选
                    $(".tag").each(function () {
                        if ($(this).find("li").length == 1) {
                            $(this).find("li").removeClass("disabled");
                            $(this).find("li").removeClass("selected");
                            $(this).find("li").addClass("selected");
                            $("#showImg").attr("src", $(this).find("li").attr("strmainimage"));
                            $("#CommodityTagID").val($(this).find("li").attr("icommoditytagid"));
                            $("#selectPrice").text('¥' + $(this).find("li").attr("dectagprice"));
                            //设置已选标题
                            msgShow();
                        }
                    });

                }
                else {
                    // 只有标签
                    var AttributeTagFormatJson = data.AttributeTagFormatJson;

                    //记录有多少类标签属性
                    typeLength = AttributeTagFormatJson.length;

                    //存标签种类数组
                    for (var i = 0; i < typeLength; i++) {
                        arrAllTagName[i] = AttributeTagFormatJson[i].TagDisplay;
                    }

                    //1.把所有标签属性显示
                    var str = '';
                    for (var i = 0; i < AttributeTagFormatJson.length; i++) {
                        str += '<div class="p-box tag ' + AttributeTagFormatJson[i].TagDisplay + '">';
                        //str+='<div class="p-title">'+AttributeTagFormatJson[i].TagDisplay+'<a href="javascript:;">'+AttributeTagFormatJson[i].TagDisplayCN+'参考></a></div>';

                        //显示中文标签
                        if (AttributeTagFormatJson[i].TagDisplayCN != "") {
                            if (i == 0 && arrShoeCat.indexOf(strCatUrl) > 0) {   //第一个属性标签、类别为鞋子的 标题加上尺寸参考说明
                                str += '<div class="p-title">' + AttributeTagFormatJson[i].TagDisplayCN + '<a class="btn-show-size" href="javascript:void(0);">尺码参考 ></a></div>';
                            } else {
                                str += '<div class="p-title">' + AttributeTagFormatJson[i].TagDisplayCN + '</div>';
                            }
                        }
                        //显示外文标签名
                        else {
                            if (i == 0 && arrShoeCat.indexOf(strCatUrl) > 0) {   //第一个属性标签、类别为鞋子的 标题加上尺寸参考说明
                                str += '<div class="p-title">' + AttributeTagFormatJson[i].TagDisplay + '<a class="btn-show-size" href="javascript:void(0);">尺码参考 ></a></div>';
                            } else {
                                str += '<div class="p-title">' + AttributeTagFormatJson[i].TagDisplay + '</div>';
                            }
                        }

                        str += '<div class="p-item">';
                        str += ' <ul class="clearfix">';
                        var TagValueData = AttributeTagFormatJson[i].TagValueData;
                        for (var j = 0; j < TagValueData.length; j++) {
                            str += ' <li name="' + AttributeTagFormatJson[i].TagDisplay + '" value="' + TagValueData[j] + '">' + TagValueData[j] + '</li>';
                        }
                        str += ' </ul>';
                        str += ' </div>';
                        str += ' </div>';
                    }


                    if (str != "") {
                        $(".tag").remove();
                        $(str).insertBefore(".box-quantity");

                        //2.设置所有li为不可选
                        $(".ub-f1 li").addClass("disabled");
                        //3.设置所有可选和不可选的状态
                        var InfoCommodityTagList = data.InfoCommodityTagList;

                        for (var i = 0; i < InfoCommodityTagList.length; i++) {
                            //遍历数组
                            for (var j in arrAllTagName) {
                                if ($(".ub-f1 li[value=\"" + InfoCommodityTagList[i].AttributeTagColJson[arrAllTagName[j]] + "\"]").length > 0) {

                                    $(".ub-f1 li[value=\"" + InfoCommodityTagList[i].AttributeTagColJson[arrAllTagName[j]] + "\"]").removeClass("disabled");
                                }
                            }
                        }
                        //标签种类只有一个标签的时候设置已选

                        $(".tag").each(function () {
                            if ($(this).find("li").length == 1) {
                                $(this).find("li").click();
                            }
                        });

                        //设置显示已选标题
                        msgShow();
                        //没有全选的时候设置默认图片，商品标签ID为0，全选后设置图片,tagID,价格
                        setDefaultThings();

                    }
                }

                //显示尺码参考选项
                $(document).on("click", ".btn-show-size", function () {
                    $(".size-mask,.shoe-size-menu").show();
                });

            }
        });
    }

    //关闭尺码参考弹出层
    $(".size-mask").on("click", function () {
        $(".shoe-size-menu,.size-mask").hide();
    });

    //点击选择一种尺码后关闭弹窗
    $(".shoe-size-menu a").on("click", function () {
        $(".shoe-size-menu,.size-mask").hide();
    });

    //关闭弹出层
    $(".popup-layer-mask, .popup-layer .p-header .btn-close").on("click", function () {
        closePopup();
    });

    function closePopup() {
        $(".popup-layer").removeClass("show");
        $("body,html").css({ "overflow": "visible" });
        $(".popup-layer-mask").fadeOut(300);
    };

    //禁止滑动冒泡
    $(".popup-layer-mask").on("touchmove", function (e) {
        e.stopPropagation();   //阻止事件冒泡
    });

    //选择商品属性
    $(document).on("click", ".p-item>ul>li", function () {

        if (!$(this).hasClass("disabled")) {

            $(this).siblings().removeClass("selected");
            $(this).toggleClass("selected");

            //新的标签
            if (isNew) {
                var InfoCommodityTagList = infoData.InfoCommodityTagList;
                //记录该商品拥有的种类标签
                var allTagName = "";
                for (var i = 0; i < infoData.AttributeTagFormatJson.length; i++) {
                    allTagName += infoData.AttributeTagFormatJson[i].TagDisplay + ",";
                }
                allTagName = allTagName.substring(allTagName, allTagName.length - 1);

                //已选择的个数
                var selectedLength = $(".p-box .clearfix li.selected").length;



                //1.如果选中标签只有1个,重新遍历所有标签，遍历当前标签所属种类哪个能选，再由选中的标签去决定其他种类未选中的标签是否可选
                if (selectedLength == 1) {

                    var $selectedOne = $(".p-box .clearfix li.selected");
                    var selectedOneName = $selectedOne.attr("name");
                    var selectedOneValue = $selectedOne.attr("value");

                    //遍历当前标签所属种类哪个能选
                    $(".ub-f1 .clearfix li").addClass("disabled");

                    for (var i = 0; i < InfoCommodityTagList.length; i++) {
                        $(".ub-f1 li[value=\"" + InfoCommodityTagList[i].AttributeTagColJson[selectedOneName] + "\"]").removeClass("disabled");
                    }
                    //再遍历除去选中标签的种类，其他种类标签存在选中标签相等的值，设置可选
                    for (var i = 0; i < InfoCommodityTagList.length; i++) {
                        //遍历数组
                        for (var j in arrAllTagName) {
                            if (arrAllTagName[j] != selectedOneName) {
                                var nextOneSelectedTagValue = InfoCommodityTagList[i].AttributeTagColJson[selectedOneName];
                                if (nextOneSelectedTagValue == selectedOneValue) {
                                    $(".ub-f1 li[value=\"" + InfoCommodityTagList[i].AttributeTagColJson[arrAllTagName[j]] + "\"]").removeClass("disabled");
                                }
                            }
                        }
                    }
                }


                //2.当选中的标签是两个以上的时候，就循环遍历选中标签，根据当前遍历的标签的值去改变其他种类标签的可选性
                if (selectedLength > 1) {
                    //这不很重要，要先设置所有标签可选,因为下面遍历的时候会设置标签不可选
                    $(".ub-f1 .clearfix li").removeClass("disabled");

                    var tagName = "";  //已经选中标签的名称
                    var tagValue = "";//已经选中标签的值
                    $(".ub-f1 li.selected").each(function () {
                        tagName += $(this).attr("name") + "|";
                        tagValue += $(this).text() + "|";
                    });
                    tagName = tagName.substring(tagName, tagName.length - 1);
                    tagValue = tagValue.substring(tagValue, tagValue.length - 1);
                    var arrTagName = tagName.split("|");
                    var arrTagValue = tagValue.split("|");
                    //遍历选中的标签种类组，由选中组去决定其他组标签值的可选性
                    for (var x = 0; x < arrTagName.length; x++) {
                        var selectedOneName = arrTagName[x];
                        var selectedOneValue = arrTagValue[x];
                        //遍历所有标签种类
                        for (var y in arrAllTagName) {
                            //如果是其他种类标签则执行下一步
                            if (arrAllTagName[y] != selectedOneName) {
                                //遍历其他组标签的 li
                                $(".ub-f1 li[name=\"" + arrAllTagName[y] + "\"]").each(function () {
                                    var thisName = $(this).attr("name");
                                    var thisValue = $(this).attr("value");
                                    var isCan = false;
                                    //循环所有标签List
                                    for (var i = 0; i < InfoCommodityTagList.length; i++) {

                                        if (InfoCommodityTagList[i].AttributeTagColJson[thisName] == thisValue && InfoCommodityTagList[i].AttributeTagColJson[selectedOneName] == selectedOneValue) {
                                            isCan = true;//找到相等的就设置true
                                        }
                                        //最后执行
                                        if (i == (InfoCommodityTagList.length - 1)) {
                                            if (isCan) {
                                            }
                                            else {
                                                $(this).addClass("disabled");
                                            }
                                        }
                                    }
                                });
                            }

                        }

                    }
                }


                //没有全选的时候设置默认图片，商品标签ID为0，全选后设置图片,tagID,价格
                setDefaultThings();


                //5.如果没有选中就重新加载
                if (selectedLength == 0) {
                    loadTag();
                }
            }
            else {
                //旧的标签
                //如果没有选中，则重新加载
                if ($(".tag li[class='selected']").length == 0) {
                    loadTag();
                }
                else {
                    $("#showImg").attr("src", $(this).attr("strmainimage"));
                    $("#CommodityTagID").val($(this).attr("icommoditytagid"));
                    $("#selectPrice").text('¥' + $(this).attr("dectagprice"));

                }
            }

        }
        //设置已选标题
        msgShow();
    });

    //设置已选标题
    function msgShow() {
        var msg = "";
        $(".ub-f1 li[class='selected']").each(function () {
            msg += '"' + $(this).text() + '"';
        });
        $("#msg").text(msg);
    }



    //如果属性只有一个选项，则默认选中。
    function setTagDefault() {

        $(".tag").each(function () {
            if ($(this).find("li").length == 1) {
                $(this).find("li").removeClass("disabled");
                $(this).find("li").removeClass("selected");
                $(this).find("li").addClass("selected");
            }
        });
    }

    //没有全选的时候设置默认图片，商品标签ID为0，全选后设置图片,tagID,价格
    function setDefaultThings() {
        //已选择的个数
        var selectedLength = $(".p-box .clearfix li.selected").length;
        $("#showImg").attr("src", defaultImg);
        $("#CommodityTagID").val(0);
        $("#selectPrice").text(defaultPrice);
        //4.全选，则设置对应的图片，和商品标签ID
        if (selectedLength == typeLength) {

            //找出所有选中的name和value
            var selectedTagName = "";//记录已经选择的标签名
            var selectedTagValue = "";//记录已经选择的标签值
            $(".ub-f1 li.selected").each(function () {
                selectedTagName += $(this).attr("name") + "|";
                selectedTagValue += $(this).attr("value") + "|";
            });

            selectedTagName = selectedTagName.substring(selectedTagName, selectedTagName.length - 1);
            selectedTagValue = selectedTagValue.substring(selectedTagValue, selectedTagValue.length - 1);
            var arrSelectedTagName = selectedTagName.split("|");
            var arrSelectedTagValue = selectedTagValue.split("|");
            var InfoCommodityTagList = infoData.InfoCommodityTagList;
            for (var z = 0; z < InfoCommodityTagList.length; z++) {
                var num = 0;
                var isCan = false;
                for (var i = 0; i < selectedLength; i++) {

                    if (InfoCommodityTagList[z].AttributeTagColJson[arrSelectedTagName[i]] == arrSelectedTagValue[i]) {
                        num++;
                        if (num == selectedLength) {
                            isCan = true;
                        }
                    }
                }
                if (isCan) {
                    $("#showImg").attr("src", InfoCommodityTagList[z].strMainImage);
                    $("#CommodityTagID").val(InfoCommodityTagList[z].iCommodityTagID);
                    $("#selectPrice").text("¥" + InfoCommodityTagList[z].decChinaPrice);
                }

            }
        }

    }

    //去除左右逗号方法
    function trimStr(str) { return str.replace(/(^,)|(,$)/g, ""); }

    //数量+
    $(".popup-layer .p-container .p-box .p-item .icon-plus").on("click", function () {
        var input = $(this).siblings("input");
        var val = parseInt(input.val()) + 1;
        if (val > 5) {
            hDialog.show({ type: 'toast', toastText: '单个商品最多可以购买5件', toastTime: 3000, hasMask: false });
            return;
        }
        input.val(val);
    });

    //数量-
    $(".popup-layer .p-container .p-box .p-item .icon-minus").on("click", function () {
        var input = $(this).siblings("input");
        var val = parseInt(input.val());
        if (val > 1) {
            val = val - 1;
        }
        else {
            val = 1;
        }
        input.val(val);
    });



    loadMayLikeCatInfoList(productId);

    //加载猜你喜欢
    function loadMayLikeCatInfoList(infoID) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: {
                "infoID": infoID, "homeShow": 1, "infoType": 0, "mayLikeCatCount": 9, "keyWord": "", "catUrl": ""
            },
            url: ajaxUrl + 'MayLikeCatInfoListQueryJson_V2',
            success: function (data) {
                var str = '';
                for (var i = 0; i < data.length; i++) {
                    str += '<li>';
                    str += '<a href="/detail/' + data[i].InfoID + '"><div class="ub ub-ac ub-pc recommend-imgbox">';
                    str += '  <img src="' + data[i].MainImage + '" />';
                    str += '  </div></a>';
                    str += '<a> <h1 class="text-ellipsis">' + data[i].InfoTitle + '</h1></a>';
                    if (data[i].MinPriceRMB == 0) {
                        str += '  <p class="text-ellipsis">' + data[i].CommodityPrice + '</p>';
                    }
                    else {
                        str += '  <p>￥' + data[i].MinPriceRMB + '</p>';
                    }
                    str += ' </li>';
                }
                $(".recommend-list").html(str);
            }
        });
    }

    //点赞
    $("#ClickPraise").click(function (data) {
        verifyLogin();
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: { "infoID": infoId, "userID": userInfo.iUserID, "userName": userInfo.strUserName, "voteRate": 1 },
            url: ajaxUrl + 'VoteJsonV2',
            success: function (data) {
                if (data.code == 200) {
                    //alert("加"+data.result.scores+"积分!");
                    if (parseInt(data.result.scores) == 0) {
                        hDialog.show({ type: 'toast', toastText: '点赞成功！', toastTime: 2000, hasMask: false });
                    }
                    else {
                        hDialog.show({ type: 'toast', toastText: '点赞成功！加' + data.result.scores + '积分！', toastTime: 2000, hasMask: false });
                    }

                    var ClickPraiseNum = parseInt($("#ClickPraiseNum").text());
                    $("#ClickPraiseNum").text(ClickPraiseNum + 1);
                }
                else {
                    //alert(data.message);
                    hDialog.show({ type: 'toast', toastText: data.message, toastTime: 2000, hasMask: false });
                }
                $("#imgClickPraise").attr("src", $("#imgClickPraise").attr("src").replace("icon_like.png", "icon_like_on.png"));
            }
        })
    });

    //收藏
    $("#CollectInfo").click(function (data) {
        verifyLogin();
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: { "infoID": infoId, "userID": userInfo.iUserID, "userName": userInfo.strUserName },
            url: ajaxUrl + 'SetCollectInfoJson',
            success: function (data) {
                if (data == 1) {
                    //不收藏
                    //alert("取消收藏！");
                    hDialog.show({ type: 'toast', toastText: '取消收藏！', toastTime: 2000, hasMask: false });
                    $("#imgCollectInfo").attr("src", $("#imgCollectInfo").attr("src").replace("icon_favor_on.png", "icon_favor.png"));
                    $("#lbCollectInfo").text("收藏");
                }
                else if (data == 0) {
                    //收藏
                    //alert("收藏成功！");
                    hDialog.show({ type: 'toast', toastText: '收藏成功！', toastTime: 2000, hasMask: false });
                    $("#imgCollectInfo").attr("src", $("#imgCollectInfo").attr("src").replace("icon_favor.png", "icon_favor_on.png"));
                    $("#lbCollectInfo").text("已收藏");
                }
            }
        })
    });



});