
$(function () {
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".st-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }
    $(document).on("click", '.back-up', function () {
        $('body,html').animate({ scrollTop: 0 }, 200);
    })

    var userInfo = getUserInfo();  //获取用户信息

    var infoTitle = "";  //点赞需要传的参数
    var infoImage = "";  //点赞需要传的参数
    var praiscount = 0;  //点赞数
    var collectionCount = 0;  //收藏数

    var ssid = 0;
    var indexQuestion = window.location.href.lastIndexOf("/?");
    var indexSharp = window.location.href.lastIndexOf("/#");

    if (indexSharp < 0) {
        if (indexQuestion < 0) {
            ssid = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        } else {
            var afterUrl = window.location.href.substring(0, indexQuestion);
            ssid = afterUrl.substring(afterUrl.lastIndexOf('/') + 1);
        }
    } else {
        if (indexQuestion < 0) {
            var afterUrl = window.location.href.substring(0, indexSharp);
            ssid = afterUrl.substring(afterUrl.lastIndexOf('/') + 1);
        } else {
            var afterUrl = window.location.href.substring(0, indexQuestion);
            ssid = afterUrl.substring(afterUrl.lastIndexOf('/') + 1);
        }
    }

    if (ssid == undefined || ssid == "") {
        return false;
    }
    //获取晒单详情
    $.ajax({
        type: 'post',
        dataType: 'json',
        data: { "SSID": ssid, "UserID": 0 },
        url: ajaxUrl + 'GetShareShoppingInfoBySSIDToRead',
        success: function (data) {
            if (data.length > 0) {
                data = data[0]; //返回的是数组包裹的对象
                //设置title标签
                $("title").text(data.InfoTitle + " - 比呀比海外购");
                $("#headImage").attr("src", data.HeadImage);
                $("#nickName").text(data.NickName);
                //截短时间
                var infoTime = data.InfoTime;
                var strShortTime = infoTime.substring(infoTime.indexOf('/') + 1, infoTime.lastIndexOf('/'));
                strShortTime += "-" + infoTime.substring(infoTime.lastIndexOf('/') + 1, infoTime.indexOf(' ')) + " ";
                strShortTime += infoTime.substring(infoTime.indexOf(' ') + 1, infoTime.lastIndexOf(':'));
                $("#infoTime").text("编辑精选 " + strShortTime);

                //用户是否已关注晒单人
                var isGuanZhuHtml = '';
                if (userInfo != undefined) {
                    if (userInfo.iUserID != data.UserID) {
                        isGuanZhuHtml = '<a class="ke-focus btn-needfocus" href="javascript:;" BeUserID="' + data.UserID + '">+关注</a>';
                    }
                } else {
                    isGuanZhuHtml = '<a class="ke-focus btn-needfocus" href="javascript:;" BeUserID="' + data.UserID + '">+关注</a>';
                }
                $(isGuanZhuHtml).insertAfter(".author-info>.thumb-name");

                var strFansJson = getFansJson(); //获取用户关注json
                if (strFansJson != undefined) {
                    var iBeUserID = data.UserID;  //晒单用户ID
                    if (strFansJson[0].infocount > 0) {
                        for (var x = 0; x < strFansJson[0].infolist.length; x++) {
                            if (strFansJson[0].infolist[x].BeUserID == iBeUserID) {
                                $('a[BeUserID=' + iBeUserID + ']').addClass("btn-cancelfocus");
                                $('a[BeUserID=' + iBeUserID + ']').removeClass("btn-needfocus");
                                $(".ke-focus").text("已关注");
                                break;
                            }
                        }
                    }
                }


                //晒单图片
                var imgListHtml = "";
                for (var i = 0; i < data.ImageTags.length ; i++) {
                    imgListHtml += '<img src="' + data.ImageTags[i].imgname + '" class="sd-big-img">';
                }
                $(imgListHtml).insertAfter(".author-info");  //晒单详情图片

                infoTitle = data.InfoTitle;
                infoImage = data.MainImage;
                praiscount = data.praiscount;
                collectionCount = data.CollectionCount;
                $(".article .title").text(data.InfoTitle);
                $(".content-show>p").text(data.InfoContent);

                //点赞收藏显示
                if (userInfo != undefined) {
                    if (userInfo.iUserID != data.UserID) {
                        //晒单发起人不是当前登录用户
                        var isPraise = false;
                        for (var i = 0; i < data.praiseinfolist.length; i++) {
                            if (data.praiseinfolist[i].UserID == userInfo.iUserID) {
                                //点赞用户ID与当前登录用户ID相同则已点赞
                                isPraise = true;
                            }
                        }
                        if (!isPraise) {
                            $(".share-article").append('<a class="ke-dianzan" href="javascript:;"><i class="fa fa-heart"></i>' + data.praiscount + '</a>');
                        } else {
                            $(".share-article").append('<a class="active" href="javascript:;"><i class="fa fa-heart"></i>' + data.praiscount + '</a>');
                        }

                        //判断用户是否收藏了该晒单
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            data: { "UserID": userInfo.iUserID, "Page": 1, "PageSize": 2000, "InfoType": 3 },
                            url: ajaxUrl + 'GetCollectInfoByUserID',
                            success: function (dataCollect) {
                                dataCollect = dataCollect[0];
                                var isCollection = false;
                                if (dataCollect.infocount > 0) {
                                    for (var i = 0; i < dataCollect.infolist.length; i++) {
                                        if (dataCollect.infolist[i].InfoID == ssid) {
                                            //收藏ID和晒单详细ID一致则已收藏
                                            isCollection = true;
                                        }
                                    }
                                }
                                if (!isCollection) {
                                    $(".share-article").append('<a class="ke-shoucang" href="javascript:;"><i class="fa fa-star"></i>' + data.CollectionCount + '</a>');
                                } else {
                                    $(".share-article").append('<a class="ke-shoucang active" href="javascript:;"><i class="fa fa-star"></i>' + data.CollectionCount + '</a>');
                                }
                            }
                        });

                    }
                } else {
                    $(".share-article").append('<a class="ke-dianzan" href="javascript:;"><i class="fa fa-heart"></i>' + data.praiscount + '</a>');
                    $(".share-article").append('<a class="ke-shoucang" href="javascript:;"><i class="fa fa-star"></i>' + data.CollectionCount + '</a>');
                }

                //相关商品
                if (data.InfoID != 0) {
                    $(".product-item").attr("href", "/detail/" + data.InfoID);
                    $(".product-item .img-box img").attr("src", data.CMainImage);
                    $(".product-item .ub-f1 h5").text(data.InfoTitle);
                    $(".product-item .ub-f1 p").text(data.CommodityPrice);
                    loadMayLikeCatInfoList(data.InfoID);  //根据相关商品ID
                } else {
                    $("#product-box").hide();  //没有商品则隐藏模块
                }
            } else {
                $('<div style="text-align:center;padding:15px 0 0;">未找到相关晒单，<a href="/home/showofforder" style="color:#e7354a;">返回晒单列表</a></div>').insertBefore(".author-info");
                $(".article,#product-box,.split,.recommend-box").hide();
            }
        }
    });


    //获取晒单详情评论
    $.ajax({
        type: 'post',
        dataType: 'json',
        data: { "SSID": ssid, "Page": 1, "PageSize": 1000, "InfoType": 3 },
        url: ajaxUrl + 'GetReviewAndFloodInfoJson',
        success: function (data) {
            data = data[0];
            if (data.infocount < 1) {
                $(".comment-list").hide();
                $("#commentcount").text(0);
                return false;
            }
            $("#commentcount").text(data.infocount);
            var infoListHtml = '';
            for (var i = 0; i < data.infolist.length; i++) {
                infoListHtml += '<p><span>' + data.infolist[i].nickname + '：</span>';
                infoListHtml += data.infolist[i].reviewContent + "</p>";
            }
            $(".comment-list").append(infoListHtml);    //加载评论列表
        }
    });

    //判断用户是否登录设置评论框
    setCommentBox();
    function setCommentBox() {
        var commentUserHtml = '';
        if (userInfo != undefined) {
            commentUserHtml += '<img src="' + userInfo.strHeadImage + '" alt="" width="45">';
            commentUserHtml += '<input type="hidden" id="UserID" value="' + userInfo.iUserID + '">';
        } else {
            commentUserHtml += '<a href="/login.html"><img src="../images/img_user_no_login.png" alt="" width="45"></a>';
            commentUserHtml += '<input type="hidden" id="UserID" value="0">';
        }
        $(commentUserHtml).insertBefore(".comment-box>.ub-f1");
    }

    //设置登录用户是否关注了该晒单用户
    //SetGuanZhu();
    //function SetGuanZhu() {
    //    var strFansJson = getFansJson(); //获取用户关注json
    //    var iBeUserID = UserID;  //晒单用户ID
    //    if (strFansJson[0].infocount > 0) {
    //        for (var x = 0; x < strFansJson[0].infolist.length; x++) {
    //            if (strFansJson[0].infolist[x].BeUserID == iBeUserID) {
    //                $('a[BeUserID=' + iBeUserID + ']').addClass("btn-cancelfocus");
    //                $('a[BeUserID=' + iBeUserID + ']').removeClass("btn-needfocus");
    //                $(".ke-focus").text("已关注");
    //                break;
    //            }
    //        }
    //    }
    //}

    //点击关注
    $(document).on("click", ".btn-needfocus", function () {
        verifyLogin();  //登录验证
        var BeUserID = $(this).attr("BeUserID");
        var $this = $(this);
        var strPwd = getstrPwd();
        if (typeof (strPwd) == "undefined") {
            //如果两个密码都不存在且id为空,则什么都不做
        } else {
            $.post(ajaxUrl + "InsertFans", { "UserID": userInfo.iUserID, "pwd": strPwd, "BeUserID": BeUserID }, function (data) {
                //{\"bool\":\"" + _strbool + "\",\"errormessage\":\"" + _errorMessage + "\"}
                if (data.bool) {
                    $('a[BeUserID=' + BeUserID + ']').addClass("btn-cancelfocus");
                    $('a[BeUserID=' + BeUserID + ']').removeClass("btn-needfocus");
                    $this.text("已关注");
                }
            }, "json");
        }
    });

    //点击取消关注
    $(document).on("click", ".btn-cancelfocus", function () {
        verifyLogin();  //登录验证
        var BeUserID = $(this).attr("BeUserID");
        var $this = $(this);
        var strPwd = getstrPwd();
        if (typeof (strPwd) == "undefined") {
            //如果两个密码都不存在且id为空,则什么都不做
        } else {
            $.post(ajaxUrl + "CancelFans", { "UserID": userInfo.iUserID, "pwd": strPwd, "BeUserID": BeUserID }, function (data) {
                //{\"bool\":\"" + _strbool + "\",\"errormessage\":\"" + _errorMessage + "\"}
                if (data.bool) {
                    $('a[BeUserID=' + BeUserID + ']').removeClass("btn-cancelfocus");
                    $('a[BeUserID=' + BeUserID + ']').addClass("btn-needfocus");
                    $('a[BeUserID=' + BeUserID + ']').text("+关注");
                    //$this.text("已关注");
                }
            }, "json");
        }
    });


    //点击点赞
    $(document).on("click", ".ke-dianzan", function () {
        verifyLogin();  //登录验证
        var $this = $(this);
        $.post(ajaxUrl + "InsertPraiseV2", { "InfoID": ssid, "InfoTitle": "", "InfoImage": infoImage, "UserID": userInfo.iUserID, "InfoType": 3, "PraiseVal": 1 }, function (data) {
            //{code: 200, message: "success", result: {scores: 1, gold: 0, experience: 1}}
            if (data.code == 200) {

                var num = praiscount + 1;
                $this.html('<i class="fa fa-heart"></i>' + num + '');
                //alert("点赞成功！");
                if (data.result.scores == 0) {
                    hDialog.show({ type: 'toast', toastText: '点赞成功！', toastTime: 3000, hasMask: false });
                }
                else {
                    hDialog.show({ type: 'toast', toastText: '点赞成功！加' + data.result.scores + '积分', toastTime: 3000, hasMask: false });
                }

                $this.addClass("active");
                $this.removeClass("ke-dianzan");
            }
            else {
                //alert("您已经点赞过了！");
                hDialog.show({ type: 'toast', toastText: '您已经点赞过了！', toastTime: 3000, hasMask: false });
            }
        }, "json");
    });

    //var collectionCount = 5;

    //点击收藏
    $(document).on("click", ".ke-shoucang", function () {
        verifyLogin();  //登录验证
        var $this = $(this);

        $.post(ajaxUrl + "CollectInfoInsertOrDel", { "InfoID": ssid, "InfoType": 3, "UserID": userInfo.iUserID, "UserName": userInfo.strUserName }, function (data) {
            //{"method":"del","bool":"true","errormessage":""}
            if (data.bool == "true" || data.bool == true) {
                if (data.method == "add") {
                    collectionCount = collectionCount + 1;
                    $this.html('<i class="fa fa-star"></i>' + collectionCount + '');
                    //alert("收藏成功！");
                    hDialog.show({ type: 'toast', toastText: '收藏成功！', toastTime: 3000, hasMask: false });
                    $this.addClass("active");
                }
                else if (data.method == "del") {
                    collectionCount = collectionCount - 1;
                    $this.html('<i class="fa fa-star"></i>' + collectionCount + '');
                    //alert("取消收藏！");
                    hDialog.show({ type: 'toast', toastText: '取消收藏！', toastTime: 3000, hasMask: false });
                    $this.removeClass("active");
                }

            }
            else {
                //alert("网络错误，请稍后再试！");
                hDialog.show({ type: 'toast', toastText: '网络错误，请稍后再试！', toastTime: 3000, hasMask: false });
            }
        }, "json");
    });


    //点击发送评论
    $(document).on("click", ".btn-send", function () {
        verifyLogin();  //登录验证
        var $this = $(this);
        var commentVal = $("#comment").val().replace(/^\s+|\s+$/g, "");  //评论内容去除空格
        if ($this.hasClass("disabled")) {
            return false;
        }
        if (commentVal.length == 0) {
            //alert("请输入评论内容！");
            hDialog.show({ type: 'toast', toastText: '请输入评论内容！', toastTime: 3000, hasMask: false });
            return false;
        }
        if (commentVal.length < 3) {
            hDialog.show({ type: 'toast', toastText: '评论内容不少于3个字哦！', toastTime: 3000, hasMask: false });
            return false;
        }
        $this.addClass("disabled");
        $.post(ajaxUrl + "InsertReviewShareShopping",
            { "SSID": ssid, "UserID": userInfo.iUserID, "ReviewContent": commentVal, "CiteReviewID": 0, "AppID": 26, "AppName": "mobile中文", "InfoType": 3 }, function (data) {
                //{\"bool\":\"" + _strbool + "\",\"errormessage\":\"" + _errorMessage + "\"}
                if (data.bool == "true" || data.bool == true) {
                    var str = ' <p><span>' + userInfo == undefined ? '游客' : userInfo.strNickname + '：</span>' + commentVal + '</p>';
                    $(".comment-list").append(str);
                    var commentcount = parseInt($("#commentcount").text()) + 1;  //评论成功评论数量显示加1
                    $("#commentcount").text(commentcount);
                    $(".comment-list").show();
                    $("#comment").val("");
                    $this.removeClass("disabled");
                }
                else {
                    //alert("网络错误，请稍后再试！");
                    hDialog.show({ type: 'toast', toastText: '网络错误，请稍后再试！', toastTime: 3000, hasMask: false });
                }
            }, "json");
    });



    //加载猜你喜欢
    function loadMayLikeCatInfoList(infoID) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: ajaxUrl + 'MayLikeCatInfoListQueryJson_V2',
            data: { "infoID": infoID, "infoType": 0, "homeShow": 1, "mayLikeCatCount": 9, "catUrl": "", "keyWord": "" },
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
});