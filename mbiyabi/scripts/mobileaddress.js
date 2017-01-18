

  //用于压缩图片的canvas
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext('2d');

  //瓦片canvas
  var tCanvas = document.createElement("canvas");
  var tctx = tCanvas.getContext("2d");

  var maxsize = 100 * 1024;   //图片最大100k

$(function () {
    if (!getHasHistory()) {   //如果当前页没有历史记录
        $(".uc-header .go-back").removeClass("go-back").attr("href", "javascript:;");
    }
    var userInfo = getUserInfo();
    var strPwd = getstrPwd();
    var returnUrl = GetQueryString("returnUrl");

    // 邮政编码
    $("#p_strZipCode").focus(function () {

    }).blur(function () {
        $.CheckPostAlcode(this);
    });
    $.CheckPostAlcode = function (_this) {
        var reg = /^[0-9]{6}$/;
        if (reg.test($(_this).val())) {
            return true;
        }
        else {
            if ($(_this).val().trim() == "")
                //alert("邮编不能为空！");
                hDialog.show({ type: 'toast', toastText: '邮编不能为空！', toastTime: 3000, hasMask: false });
            else
                //alert("邮编输入格式有误！");
                hDialog.show({ type: 'toast', toastText: '邮编输入格式有误！', toastTime: 3000, hasMask: false });
            return false;
        }
    }


    // 街道地址
    $("#p_strAddress").focus(function () {

    }).blur(function () {
        $.CheckStreet(this);
    });
    $.CheckStreet = function (_this) {
        if ($(_this).val().trim() == "") {
            //alert("街道地址填写不能为空！");
            hDialog.show({ type: 'toast', toastText: '街道地址填写不能为空！', toastTime: 3000, hasMask: false });
            return false;
        }
        else {
            return true;
        }
    }

    // 收货人姓名
    $("#p_strContacts").focus(function () {

    }).blur(function () {
        $.CheckName(this);
    });
    $.CheckName = function (_this) {
        if ($(_this).val().trim() == "") {
            //alert("收货人填写不能为空！");
            hDialog.show({ type: 'toast', toastText: '收货人填写不能为空！', toastTime: 3000, hasMask: false });
            return false;
        }
        else {
            return true;
        }
    }

    // 电话号码
    $("#p_strMobilePhone").focus(function () {

    }).blur(function () {
        $.CheckPhone(this);
    });
    $.CheckPhone = function (_this) {
        //var reg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
        var reg = /^1\d{10}$/;
        if (reg.test($(_this).val())) {

            return true;
        }
        else {
            if ($(_this).val().trim() == "")
                //alert("电话号码填写不能为空！");
                hDialog.show({ type: 'toast', toastText: '电话号码填写不能为空！', toastTime: 3000, hasMask: false });
            else
                //alert("电话号码填写格式不正确！");
                hDialog.show({ type: 'toast', toastText: '电话号码填写格式不正确！', toastTime: 3000, hasMask: false });
            return false;
        }
    }

    // 身份证号
    $("#p_strIDCardNumber").focus(function () {

    }).blur(function () {
        $.CheckIDnumber(this);
    });
    $.CheckIDnumber = function (_this) {

        num = $(_this).val().toUpperCase();
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。


        if ((/(^\d{15}$)/.test(num)) && num.length == 15) {
            return true;
        }

        if (!(/(^\d{17}([0-9]|X)$)/.test(num))) {
            //alert("身份证号码格式不正确！");
            hDialog.show({ type: 'toast', toastText: '身份证号码格式不正确！', toastTime: 3000, hasMask: false });
            return false;
        }
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        //下面分别分析出生日期和校验位
        var len, re;
        len = num.length;
        if (len == 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = num.match(re);

            //检查生日日期是否正确
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                //alert("身份证号码格式不对！");
                hDialog.show({ type: 'toast', toastText: '身份证号码格式不正确！', toastTime: 3000, hasMask: false });
                return false;
            }
            else {
                //检验18位身份证的校验码是否正确。
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != num.substr(17, 1)) {
                    //alert("身份证号码格式不对！");
                    hDialog.show({ type: 'toast', toastText: '身份证号码格式不正确！', toastTime: 3000, hasMask: false });
                    return false;
                }

                return true;
            }
        }
        return false;
    }

    //点击选择按钮改变触发事件
    $(document).on("change", "#Province", function () {
        if ($("#Province option:selected").text() != "--请选择--") {
            getAreaInfo("City", 2, $("#Province option:selected").text());
        }
    });
    $(document).on("change", "#City", function () {
        if ($("#City option:selected").text() != "--请选择--") {
            getAreaInfo("Distinct", 3, $("#City option:selected").text());
        }
    });


    //删除地址
    //$(".deleteUserAddress").click(function () {
    $(document).on("click", ".deleteUserAddress", function () {
        //if (confirm("是否删除？")) {
        //    var obj = $(this);
        //    $.ajax({
        //        type: 'post',
        //        dataType: 'json',
        //        url: "/User/UserAddressDelete",
        //        data: {
        //            "p_iAddressNumber": $(this).attr("name")
        //        },
        //        success: function (data) {
        //            if (data) {
        //                //alert("删除成功！");
        //                hDialog.show({ type: 'toast', toastText: '删除成功！', toastTime: 3000, hasMask: false });
        //                obj.parent().parent().parent().remove();
        //            }
        //        }
        //    })
        //}
        var $this = $(this);
        hDialog.show({
            type: 'confirmB',
            tipsText: '是否删除？',
            callBack: function () {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: ajaxUrl + "UserAddressDelete",
                    data: {
                        "p_iUserID": userInfo.iUserID,
                        "p_strPwd": strPwd,
                        "p_iAddressNumber": $this.attr("name")
                    },
                    success: function (data) {
                        if (data) {
                            //alert("删除成功！");
                            hDialog.show({ type: 'toast', toastText: '删除成功！', toastTime: 3000, hasMask: false });
                            $this.parent().parent().parent().remove();
                        }
                    }
                })
            },
            hasMask: false
        });
    });



    //点击保存按钮
    $(".save-info").click(function () {

        $("#p_strProvinceCode").val($("#Province option:selected").val());
        $("#p_strProvinceName").val($("#Province option:selected").text());
        $("#p_strCityCode").val($("#City option:selected").val());
        $("#p_strCityName").val($("#City option:selected").text());
        $("#p_strDistrictCode").val($("#Distinct option:selected").val());
        $("#p_strDistrictName").val($("#Distinct option:selected").text());

        var p_strContacts = $("#p_strContacts").val();
        var p_strMobilePhone = $("#p_strMobilePhone").val();
        var p_strIDCardNumber = $("#p_strIDCardNumber").val();
        var p_strIDCardFrontImage = $("#p_strIDCardFrontImage").val();
        var p_strIDCardBackImage = $("#p_strIDCardBackImage").val();
        var p_strProvinceCode = $("#p_strProvinceCode").val();
        var p_strProvinceName = $("#p_strProvinceName").val();
        var p_strCityCode = $("#p_strCityCode").val();
        var p_strCityName = $("#p_strCityName").val();
        var p_strDistrictCode = $("#p_strDistrictCode").val();
        var p_strDistrictName = $("#p_strDistrictName").val();
        var p_strZipCode = $("#p_strZipCode").val();
        var p_strAddress = $("#p_strAddress").val();
        var p_iAddressNumber = $("#p_iAddressNumber").val();

        var regNum = /^\d+$/;
        if (!regNum.test(p_strProvinceCode) || !regNum.test(p_strCityCode) || !regNum.test(p_strDistrictCode)) {
            //alert("请选择地区！");
            hDialog.show({ type: 'toast', toastText: '请选择地区！', toastTime: 3000, hasMask: false });
            return false;
        }

        if (p_strContacts.length == 0 || p_strMobilePhone.length == 0 || p_strIDCardNumber.length == 0 || p_strIDCardFrontImage.length == 0 || p_strIDCardBackImage.length == 0
            || p_strProvinceCode.length == 0 || p_strProvinceName.length == 0 || p_strCityCode.length == 0 || p_strCityName.length == 0 || p_strDistrictCode.length == 0
            || p_strDistrictName.length == 0 || p_strZipCode.length == 0 || p_strAddress.length == 0) {
            //alert("请输入完整信息！");
            hDialog.show({ type: 'toast', toastText: '请输入完整信息！', toastTime: 3000, hasMask: false });
            return false;
        }
        //验证手机号码
        var reg = /^1\d{10}$/;
        if (!reg.test(p_strMobilePhone)) {
            hDialog.show({ type: 'toast', toastText: '请输入正确手机号！', toastTime: 3000, hasMask: false });
            return false;
        }
        //验证身份证
        if (!$.CheckIDnumber("#p_strIDCardNumber")) {
            // hDialog.show({ type: 'toast', toastText: '请输入正确身份证！', toastTime: 3000, hasMask: false });
            return false;
        }

        //查看是否从下订单页面跳转过来的
        var refferUrl = window.location.href;
        if (refferUrl.indexOf("?returnUrl") > 0) {
            refferUrl = refferUrl.substring(refferUrl.indexOf("?"), refferUrl.length);
            $("#frmInsert").attr("action", "/User/UserAddressInsert" + refferUrl);
            //alert(refferUrl);
        }
        //$("#frmInsert").submit();

        if (strPwd == undefined || userInfo == undefined) {
            //如果两个密码都不存在且id为空,则什么都不做
        } else {

            //转图片为base64格式
            //var result = document.getElementById("result");
            //var file = document.getElementById("file");

            ////判断浏览器是否支持FileReader接口  
            //if (typeof FileReader == 'undefined') {
            //    result.InnerHTML = "<p>你的浏览器不支持FileReader接口！</p>";
            //    //使选择控件不可操作  
            //    file.setAttribute("disabled", "disabled");
            //}

            //添加新地址操作
            if ($(this).data("type") == "add") {
                $.ajax({
                    type: 'post',
                    dataType: "json",
                    url: ajaxUrl + 'UserAddressInsert',
                    data: {
                        "p_iUserID": userInfo.iUserID, "p_strPwd": strPwd, "p_strUserName": userInfo.strUserName,
                        "p_strNickname": userInfo.strNickname, "p_strContacts": p_strContacts, "p_strMobilePhone": p_strMobilePhone,
                        "p_strIDCardNumber": p_strIDCardNumber, "p_strIDCardFrontImage": p_strIDCardFrontImage, "p_strIDCardBackImage": p_strIDCardBackImage,
                        "p_strProvinceCode": p_strProvinceCode, "p_strProvinceName": p_strProvinceName, "p_strCityCode": p_strCityCode,
                        "p_strCityName": p_strCityName, "p_strDistrictCode": p_strDistrictCode, "p_strDistrictName": p_strDistrictName,
                        "p_strZipCode": p_strZipCode, "p_strAddress": p_strAddress
                    },
                    success: function (data) {
                        if (data) {
                            if (returnUrl != "" && returnUrl != undefined) {
                                window.location.href = returnUrl;
                            } else {
                                window.location.href = '/useraddress.html';
                            }
                        }
                    }
                });
            } else if ($(this).data("type") == "update") {
                //修改地址
                $.ajax({
                    type: 'post',
                    dataType: "json",
                    url: ajaxUrl + 'UserAddressUpdate',
                    data: {
                        "p_iUserID": userInfo.iUserID, "p_strPwd": strPwd, "p_strUserName": userInfo.strUserName,
                        "p_strNickname": userInfo.strNickname, "p_strContacts": p_strContacts, "p_strMobilePhone": p_strMobilePhone,
                        "p_strIDCardNumber": p_strIDCardNumber, "p_strIDCardFrontImage": p_strIDCardFrontImage, "p_strIDCardBackImage": p_strIDCardBackImage,
                        "p_strProvinceCode": p_strProvinceCode, "p_strProvinceName": p_strProvinceName, "p_strCityCode": p_strCityCode,
                        "p_strCityName": p_strCityName, "p_strDistrictCode": p_strDistrictCode, "p_strDistrictName": p_strDistrictName,
                        "p_strZipCode": p_strZipCode, "p_strAddress": p_strAddress, "p_iAddressNumber": p_iAddressNumber
                    },
                    success: function (data) {
                        if (data) {
                            if (returnUrl != "" && returnUrl != undefined) {
                                window.location.href = returnUrl;
                            } else {
                                window.location.href = '/useraddress.html';
                            }
                        } else {
                            window.location.href = '/useraddressupdate.html?address=' + p_iAddressNumber;
                        }
                    }
                });
            }
        }
    });


    //编辑页面上传图片
    $('#img1').on('change', function () {
        setImgPreview('img1', 'preview');
    });
    $('#img2').on('change', function () {
        setImgPreview('img2', 'preview2');
    });

});

//上传图片
function setImgPreview(imgObj, prev) {
    var docObj = $("#" + imgObj);
    var imgObjPreview = $("#" + prev);
    //判断是否有选择上传文件
    var imgPath = docObj.val();
    if (imgPath == "" || !docObj[0].files.length) {
        //alert("请选择上传图片！");
        hDialog.show({ type: 'toast', toastText: '请选择上传图片！', toastTime: 3000, hasMask: false });
        return;
    }
    //判断上传文件的后缀名
    var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1).toLowerCase();
    if (strExtension != 'jpg' && strExtension != 'gif'
    && strExtension != 'png' && strExtension != 'bmp') {
        //alert("请选择图片文件！");
        hDialog.show({ type: 'toast', toastText: '请选择图片文件！', toastTime: 3000, hasMask: false });
        return;
    }

    var file = docObj[0].files[0];
    if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;

    var reader = new FileReader();
    reader.onload = function () {
        var result = this.result;
        var img = new Image();
        img.src = result;

        imgObjPreview.attr("src", result);

        //如果图片大小小于100kb，则直接上传
        if (result.length <= maxsize) {
            img = null;

            result = result.substring(result.indexOf(",") + 1);    //去除base64位前缀 data:image/jpeg;base64,
            upload(result, strExtension, docObj, imgObjPreview);

            return;
        }

        //图片加载完毕之后进行压缩，然后上传
        if (img.complete) {
            callback();
        } else {
            img.onload = callback;
        }

        function callback() {
            var data = compress(img);
            data = data.substring(data.indexOf(",") + 1);    //去除base64位前缀 data:image/jpeg;base64,
            upload(data, strExtension, docObj, imgObjPreview);

            img = null;
        }
    };

    reader.readAsDataURL(file);
}

//使用canvas对大图片进行压缩
function compress(img) {
    var initSize = img.src.length;
    var width = img.width;
    var height = img.height;

    //如果图片大于1500*2000 = 3000 000，计算压缩比并将大小压至300万以下
    //如果图片大于600*800 = 480 000，计算压缩比并将大小压至48万以下
    var ratio;
    //if ((ratio = width * height / 3000000) > 1) {
    if ((ratio = width * height / 480000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    } else {
        ratio = 1;
    }

    canvas.width = width;
    canvas.height = height;

    //铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片

        //计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);

        tCanvas.width = nw;
        tCanvas.height = nh;

        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }

    //进行最小压缩
    var ndata = canvas.toDataURL('image/jpeg', 0.5);

    console.log('压缩前：' + initSize);
    console.log('压缩后：' + ndata.length);
    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");

    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

    return ndata;
}

//上传图片,图片base64编码，后缀名，file类型input jQuery对象，如$("#imgfile1"); 预览图片jquery对象
function upload(imgDataBase64, strExtension, docObj, imgObjPreview) {
    $.ajax({
        type: 'post',
        dataType: 'json',
        data: { "_Image": imgDataBase64, "_format": "." + strExtension },
        url: ajaxUrl + 'UploadIDCartImageBase64',
        success: function (data) {
            if (data) {
                imgObjPreview.attr("src", data);
                $("." + docObj.attr("name")).val(data);
                docObj.parent().find('.logo-img2').remove();
            }
        },
        //此接口返回的图片路径是error的响应文本
        error: function (xhr) {
            imgObjPreview.attr("src", xhr.responseText);
            $("." + docObj.attr("name")).val(xhr.responseText);
            docObj.parent().find('.logo-img2').remove();
        },
        beforeSend: function () {
            var logoImg = '<img src="../images/loanding.gif" class="logo-img2" style="position: absolute;left: 50%;top: 50%;width: 20px; height: 20px; -webkit-transform: translate(-50%,-50%);">';
            docObj.parent().append(logoImg);
        }
    });
}

//绑定省市联动
function getAreaInfo(id, LevelID, PreName) {
    var userInfo = getUserInfo();
    var strPwd = getstrPwd();
    if (strPwd == undefined || userInfo == undefined) {

    } else {
        $.post(ajaxUrl + "UserAreaSelect",
            {
                "p_iUserID": userInfo.iUserID,
                "p_strPwd": strPwd,
                "LevelID": LevelID, "PreName": PreName
            },
            function (data) {
                if (data != null) {
                    var str = '<option>--请选择--</option>';
                    for (var i = 0; i < data.length; i++) {
                        str += '<option value="' + data[i].AreaCode + '">' + data[i].AreaName + '</option>';
                    }
                    $("#" + id).html(str);
                }
            })
    }
}