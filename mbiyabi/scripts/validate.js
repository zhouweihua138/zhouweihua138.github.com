/*
/ 依赖jquery, jquery.cookie, jsencrypt
/  
*/
//判断用户是否登录
function userloginStatus() {
    var bool = false;
    var userid = $.cookie("iUserID");
    var strPwd = $.cookie("strPassword");
    var strDesTime = $.cookie("strDesTime");

    //RSA加密
    //Encrypt with the public key...
    var timestamp = Math.round(new Date().getTime() / 1000)  //Unix时间戳(Unix timestamp)
    var strPwdTime = strPwd + strDesTime;
    var encrypt = new JSEncrypt();
    var pubkey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDhQg6PquOyX15BywcKQuo1MjihrPEkHw57JbH1PNAFWaMUKgmk8rnb6RQNY4OlyuULBnHEZIbNSJd1sA+FPDZ8n50wvgaZ+ITZG/jhp7lvmFNbt5R69mD3i4GA9BlM2VDeqdrGDw/o+mnD3MxdAFALCmSSTo6W7ohYN5M3ltL4WQIDAQAB";
    encrypt.setPublicKey(pubkey);
    var encrypted = encrypt.encrypt(strPwdTime);
    strPwd = encrypted;

    $.ajax({
        type: 'post',
        dataType: 'json',
        data: { "p_iUserID": userid, "p_strPwd": strPwd, "appID": 26, "appName": "mobile中文" },
        url: ajaxUrl+'GetUserInfo',
        async: false,
        success: function (data) {
            data.iUserID != "" ? bool = true : bool = false;
        }
    });
    return bool;
}