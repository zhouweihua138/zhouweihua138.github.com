
$(function () {
    verifyLogin();
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".navbar-btn-left").html("").attr("href", "javascript:;");
    }
    var userInfo = getUserInfo();

    getLogistics();
    //获取物流信息
    function getLogistics() {
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: {
                "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd(), "p_iOrderID": 0, "p_iOrdersCommodityID": 0,
                "strFremdness": GetQueryString("fremdness"), "strFremdnessNumber": parseInt(GetQueryString("fremdnessnumber"))
            },
            url: ajaxUrl + "OrdersFremdnessLogisticsListQuery",
            beforeSend: function () {
                var logoImg = '<div id="loading-box">努力加载中...<img src="../images/loanding.gif" style="height:16px;"></div>';
                $(logoImg).insertBefore('.timeline>ul');
            },
            success: function (data) {
                $("#loading-box").remove();
                if (data[0].time != "") {

                    //冒泡排序，将物流信息按时间倒序排序
                    for (var m = 0; m < data.length - 1; m++) {
                        for (var n = 0; n < data.length - 1 - m; n++) {
                            //需要先排序
                            var time1 = data[n].time;
                            var time2 = data[n + 1].time;
                            time1 = time1.replace(/-/g, "/");
                            time2 = time2.replace(/-/g, "/");
                            var date1 = new Date(time1);
                            var date2 = new Date(time2);

                            if (date1 < date2) {
                                var tmp = data[n];
                                data[n] = data[n + 1];
                                data[n + 1] = tmp;
                            }
                        }
                    }

                    var timelineListhtml = '';
                    //再进行以下判断
                    for (var j = 0; j < data.length; j++) {

                        if (j == 0) {
                            timelineListhtml += '<li><div class="ub timeline-title timeline-title-first"><div class="timeline-circle">';
                            timelineListhtml += '<i class="icon-circle icon-circle-green"></i></div><div class="ub-f1 timeline-info">';
                            timelineListhtml += '<p>' + data[j].content + '</p>';
                            timelineListhtml += '<p>' + data[j].time + '</p>';
                            timelineListhtml += '</div></div></li>';
                        } else {
                            timelineListhtml += '<li><div class="ub timeline-title"><div class="timeline-circle">';
                            timelineListhtml += '<i class="icon-circle"></i></div><div class="ub-f1 timeline-info">';
                            timelineListhtml += '<p>' + data[j].content + '</p>';
                            timelineListhtml += '<p>' + data[j].time + '</p>';
                            timelineListhtml += '</div></div></li>';
                        }
                    }
                    $(".timeline-box").append(timelineListhtml);
                }
            }
        });
    }
})