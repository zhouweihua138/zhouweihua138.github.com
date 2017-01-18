/**
 * Created by Zhang on 2016/3/29.
 */
$(document).ready(function () {
    var userInfo = getUserInfo();
    //点击选择按钮时，变色
    $(document).on('touchstart', '.address-info .ai-edit .s1-sel', function () {
        var $this = $(this);
        var p_iAddressNumber = $(this).attr("data-type");
        var strPwd = getstrPwd();
        if (typeof (strPwd) == "undefined") {
            //如果两个密码都不存在且id为空,则什么都不做
        } else {
            $.ajax({
                type: 'post',
                dataType: "json",
                url: ajaxUrl + 'UserAddressSetDefault',
                data: { "p_iUserID": userInfo.iUserID, "p_strPwd": strPwd, "p_iAddressNumber": p_iAddressNumber },
                success: function (data) {
                    if (data) {
                        $(".address-info .ai-edit .s1-sel").removeClass('on');
                        $this.addClass('on');
                    }
                }
            });
        }
    });
});
