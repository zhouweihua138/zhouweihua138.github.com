
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

    var strFansJson = [];  //获取用户关注Json
    if (typeof (userInfo) != "undefined") {
        $.ajax({
            type: 'post',
            dataType: 'json',
            //data: { "loguserid": "18453936", "pwd": "", "userid": "18453936", "page": 1, "pagesize": 1000 },
            data: { "loguserid": userInfo.iUserID, "pwd": "", "userid": userInfo.iUserID, "page": 1, "pagesize": 1000 },
            url: ajaxUrl + 'GetFansByUserID',
            async: false,
            success: function (data) {
                //成功！
                strFansJson = data;
            }
        });
    }

    $(document).on("click", '.back-up', function () {
        $('body,html').animate({ scrollTop: 0 }, 200);
    })

    //没数据就锁住，有数据就不锁住
    var idx = 0;
    var tab1LoadEnd = false;
    var tab2LoadEnd = false;
    var counter1 = 1;
    var counter2 = 1;
    //tab
    $(document).on("click", ".tab-title li", function () {
        $(".tab-title li a").removeClass('on');
        $(this).find("a").addClass('on');
        idx = $(this).index();
        $(".content-list .content-item").removeClass("on");
        $(".content-list .content-item").eq(idx).addClass("on");

        // 如果选中菜单一
        if (idx == 0) {
            counter1 = 1;
            // 如果数据没有加载完
            if (!tab1LoadEnd) {
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }
            //else {
            //    // 锁定
            //    dropload.lock('down');
            //    dropload.noData();

            //}
            // 如果选中菜单二
        } else if (idx == 1) {
            counter2 = 1;
            if (!tab2LoadEnd) {
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }
            //else {
            //    // 锁定
            //    dropload.lock('down');
            //    dropload.noData();

            //}
        }
        // 重置
        dropload.resetload();
    });

    // 每页展示10个
    var num = 10;


    // dropload
    var dropload = $('.content-list').dropload({
        scrollArea: window,
        loadDownFn: function (me) {

            // 加载菜单一的数据
            if (idx == 0) {
                $.ajax({
                    type: 'post',
                    url: ajaxUrl + 'GetShareShoppingInfoByBeUserIDs',
                    dataType: 'json',
                    data: { "LogUserID": userInfo.iUserID, "Page": counter1, "PageSize": num },
                    success: function (data) {
                        counter1++;

                        var infolist = data[0].infolist;
                        var result = '';
                        for (var i = 0; i < infolist.length; i++) {
                            result += '<li>';
                            result += '<a href="/mshareshoppingdetail/' + infolist[i].SSID + '">';
                            result += '<div class="img-box ub ub-ac ub-pc">';
                            result += '<img src="' + infolist[i].MainImage + '" width="160">';
                            result += '</div>';
                            result += '<div class="desc-box"><p class="ub desc">' + infolist[i].InfoTitle + '</p></div>';
                            result += '</a>';
                            result += '<div class="ub thumb-name">';
                            result += '<img src="' + infolist[i].HeadImage + '" width="45">';
                            result += '<div class="ub-f1">';
                            result += '<p>' + infolist[i].NickName + '</p>';
                            if (strFansJson[0].infocount > 0) {
                                var flag = false;
                                for (var x = 0; x < strFansJson[0].infolist.length; x++) {
                                    if (strFansJson[0].infolist[x].BeUserID == infolist[i].UserID) {
                                        result += '<a class="btn-focus btn-cancelfocus" href="javascript:;" BeUserID="' + infolist[i].UserID + '">已关注</a>';
                                        flag = true;
                                        break;
                                    }
                                }
                                if (!flag) {
                                    result += '<a class="btn-focus btn-needfocus" href="javascript:;" BeUserID="' + infolist[i].UserID + '">+关注</a>';
                                }
                            }
                            else {
                                result += '<a class="btn-focus btn-needfocus" href="javascript:;" BeUserID="' + infolist[i].UserID + '">+关注</a>';
                            }

                            result += '</div>';
                            result += '</div>';
                            result += '</li>';

                        }
                        if (infolist.length < num) {
                            tab1LoadEnd = true;
                            me.lock();
                            me.noData();
                        }
                        if (counter1 <= 2) {
                            $('.content-item.on>ul').html(result);
                        } else {
                            $('.content-item.on>ul').append(result);
                        }
                        // $('.content-item.on>ul').append(result);

                        // 每次数据加载完，必须重置
                        me.resetload();
                    },
                    error: function (xhr, type) {
                        //alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
                //加载菜单二的数据
            }
            else if (idx == 1) {
                $.ajax({
                    type: 'post',
                    url: ajaxUrl + 'GetShareShoppingInfoByUserIDs',
                    dataType: 'json',
                    data: { "UserID": userInfo.iUserID, "LogUserID": userInfo.iUserID, "Status": 3, "ShowFlag": 1, "Page": counter2, "PageSize": num },
                    success: function (data) {
                        counter2++;
                        var infolist = data[0].infolist;
                        var result = '';
                        for (var i = 0; i < infolist.length; i++) {
                            result += '<li>';
                            result += '<a href="/usershareshoppinginfo.html?share=' + infolist[i].SSID + '">';
                            result += '<div class="img-box ub ub-ac ub-pc">';
                            result += '<img src="' + infolist[i].MainImage + '" width="160">';
                            result += '</div>';
                            result += '<div class="desc-box"><p class="ub desc">' + infolist[i].InfoTitle + '</p></div>';
                            result += '</a>';
                            //result += '<div class="ub thumb-name">';
                            //result += '<img src="' + infolist[i].HeadImage + '" width="45">';
                            //result += '<div class="ub-f1">';
                            //result += '<p>' + infolist[i].NickName + '</p>';
                            ////设置是否关注了用户
                            //if (strFansJson[0].infocount > 0) {
                            //    var flag = false;
                            //    for (var x = 0; x < strFansJson[0].infolist.length; x++) {
                            //        if (strFansJson[0].infolist[x].BeUserID == infolist[i].UserID) {
                            //            result += '<a class="btn-focus btn-cancelfocus" href="javascript:;" BeUserID="' + infolist[i].UserID + '">已关注</a>';
                            //            flag = true;
                            //            break;
                            //        }
                            //    }
                            //    if (!flag) {
                            //        result += '<a class="btn-focus btn-needfocus"" href="javascript:;" BeUserID="' + infolist[i].UserID + '">+关注</a>';
                            //    }
                            //}
                            //else {
                            //    result += '<a class="btn-focus btn-needfocus"" href="javascript:;" BeUserID="' + infolist[i].UserID + '">+关注</a>';
                            //}

                            //result += '</div>';
                            //result += '</div>';
                            result += '</li>';
                        }

                        if (infolist.length < num) {
                            tab1LoadEnd = true;
                            me.lock();
                            me.noData();
                        }
                        if (counter2 <= 2) {
                            $('.content-item.on>ul').html(result);
                        } else {
                            $('.content-item.on>ul').append(result);
                        }
                        // $('.content-item.on>ul').append(result);

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
        }
    });

    //点击关注
    $(document).on("click", ".btn-needfocus", function () {
        verifyLogin();
        var BeUserID = $(this).attr("BeUserID");
        var $this = $(this);
        var userid = $.cookie("iUserID");
        var strPwd = getstrPwd();
        if (typeof (strPwd) == "undefined" || typeof (userid) == "undefined") {
            //如果两个密码都不存在且id为空,则什么都不做
        } else {
            $.post(ajaxUrl + "InsertFans", { "UserID": userid, "pwd": strPwd, "BeUserID": BeUserID }, function (data) {
                //{\"bool\":\"" + _strbool + "\",\"errormessage\":\"" + _errorMessage + "\"}
                if (data.bool) {
                    $('a[BeUserID=' + BeUserID + ']').addClass("btn-cancelfocus");
                    $('a[BeUserID=' + BeUserID + ']').removeClass("btn-needfocus");
                    $('a[BeUserID=' + BeUserID + ']').text("已关注");
                    //$this.text("已关注");
                }
            }, "json");
        }
    });

    //点击取消关注
    $(document).on("click", ".btn-cancelfocus", function () {
        var boolUserLogin = userloginStatus();
        if (!boolUserLogin) {
            window.location.href = '/login.html';
            return false;
        }
        var BeUserID = $(this).attr("BeUserID");
        var $this = $(this);
        var userid = $.cookie("iUserID");
        var strPwd = getstrPwd();
        if (typeof (strPwd) == "undefined" || typeof (userid) == "undefined") {
            //如果两个密码都不存在且id为空,则什么都不做
        } else {
            $.post(ajaxUrl + "CancelFans", { "UserID": userid, "pwd": strPwd, "BeUserID": BeUserID }, function (data) {
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

});