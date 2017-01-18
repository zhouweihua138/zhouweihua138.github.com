
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
                "p_iOrderID": GetQueryString("order"), "p_iUserID": userInfo.iUserID, "p_strPwd": getstrPwd()
            },
            url: ajaxUrl + "OrdersLogisticsListQuery",
            beforeSend: function () {
                var logoImg = '<div id="loading-box">努力加载中...<img src="../images/loanding.gif" style="height:16px;"></div>';
                $(logoImg).insertBefore('.tips .ub-f1');
            },
            success: function (data) {
                $("#loading-box").remove();
                if (data.iOrderID != 0) {
                    var iOrdersCommodityID = parseInt(GetQueryString("commodity"));   //订单商品id
                    for (var i = 0; i < data.listOrdersCommodity.length; i++) {
                        //根据iOrdersCommodityID 查找匹配商品的物流
                        if (data.listOrdersCommodity[i].iOrdersCommodityID == iOrdersCommodityID) {
                            $("#transport-company").text("转运公司：" + data.listOrdersCommodity[i].ordersLogistics.strTransportCompanyName);
                            $(".delivery-id").text("转运单号：" + data.listOrdersCommodity[i].ordersLogistics.strTransportNumber);

                            //冒泡排序，将物流信息按时间倒序排序
                            for (var m = 0; m < data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList.length - 1; m++) {
                                for (var n = 0; n < data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList.length - 1 - m; n++) {
                                    //需要先排序
                                    var time1 = data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList[n].time;
                                    var time2 = data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList[n + 1].time;
                                    time1 = time1.replace(/-/g, "/");
                                    time2 = time2.replace(/-/g, "/");
                                    var date1 = new Date(time1);
                                    var date2 = new Date(time2);

                                    if (date1 < date2) {
                                        var tmp = data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList[n];
                                        data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList[n] = data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList[n + 1];
                                        data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList[n + 1] = tmp;
                                    }
                                }
                            }

                            var timelineListhtml = '';
                            //再进行以下判断
                            for (var j = 0; j < data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList.length; j++) {

                                if (j == 0) {
                                    timelineListhtml += '<li><div class="ub timeline-title timeline-title-first"><div class="timeline-circle">';
                                    timelineListhtml += '<i class="icon-circle icon-circle-green"></i></div><div class="ub-f1 timeline-info">';
                                    timelineListhtml += '<p>' + data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList[j].content + '</p>';
                                    timelineListhtml += '<p>' + data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList[j].time + '</p>';
                                    timelineListhtml += '</div></div></li>';
                                } else if (j == data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList.length - 1) {
                                    timelineListhtml += '<li><div class="timeline-title ub"><div class="timeline-circle">';
                                    timelineListhtml += '<i class="icon-circle"></i></div><div class="ub-f1 timeline-info">';
                                    timelineListhtml += '<a href="/fremdnesslogistics.html?fremdness=' + data.listOrdersCommodity[i].ordersLogistics.strFremdness + '&fremdnessnumber=' + data.listOrdersCommodity[i].ordersLogistics.strFremdnessNumber + '">';
                                    timelineListhtml += '<div class="ub has-angle">';
                                    timelineListhtml += '<p class="ub-f1">商家（' + data.strMallName + '）已发货，发往转运公司仓库（' + data.listOrdersCommodity[i].ordersLogistics.strFremdness + ':' + data.listOrdersCommodity[i].ordersLogistics.strFremdnessNumber + '）</p>';
                                    timelineListhtml += '<span class="ub ub-ac ub-pc"><i class="fa fa-angle-right fa-2x"></i></span></div></a></div></div></li>';
                                } else {
                                    timelineListhtml += '<li><div class="ub timeline-title"><div class="timeline-circle">';
                                    timelineListhtml += '<i class="icon-circle"></i></div><div class="ub-f1 timeline-info">';
                                    timelineListhtml += '<p>' + data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList[j].content + '</p>';
                                    timelineListhtml += '<p>' + data.listOrdersCommodity[i].ordersLogistics.logisticsInfoList[j].time + '</p>';
                                    timelineListhtml += '</div></div></li>';
                                }
                            }
                            $(".timeline-box").append(timelineListhtml);
                        }
                    }
                }
            }
        });
    }
})