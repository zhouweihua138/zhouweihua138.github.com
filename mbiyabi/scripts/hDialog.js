/*  
 * @弹出提示层
 * @method  hDialog.show();
 * @description 默认配置参数   
 * @time    2016-6-16    
 * @param {String} str -默认文字   
 * @param {Boolean} hasMask -是否显示遮罩  
 * @param {Boolean} clickDomCancel -点击空白取消  
 * @param {Function} callBack -回调函数 (点击提交生效)
 * @param {String} type -弹窗类型 (confirm类型确认取消订单专用, toast类型弹出提示, alert类型提示框)
 * @example   
 * hDialog.show();   
 * hDialog.show({type:'confirm',callBack:function(){ alert(..) }});
 */

var hDialog = {
    show: function (cfg) {
        this.config = {
            title: '提示',
            tipsText: '正在处理',
            toastText: '默认的toast',
            toastTime: 2000,
            toastBottom:'100px',
            options: [{ value: "0", text: "不想买" }, { value: "1", text: "重复下单" }, { value: "2", text: "信息错误" }, { value: "3", text: "其他原因" }],
            windowDom: window,
            setTime: 0,
            hasMask: true,
            hasMaskWhite: false,
            clickDomCancel: false,
            callBack: null,
            hasBtn: false,
            type: 'confirm',
            strBottomRight1: "提交"
        }
        $.extend(this.config, cfg);

        //存在就retrun  
        //if (this.boundingBox) return;

        //初始化  
        this.render(this.config.type);
        return this;
    },

    //外层box
    boundingBox: null,

    //渲染  
    render: function (tipType, container) {
        this.renderUI(tipType);

        //绑定事件  
        this.bindUI();

        //初始化UI  
        //this.syncUI();
        $(container || this.config.windowDom.document.body).append(this.boundingBox);
    },

    //渲染UI  
    renderUI: function (tipType) {
        if (tipType == 'confirm') {
            this.boundingBox = $("<div class='dialog'></div>");
        } else if (tipType == 'toast') {
            this.boundingBox = $("body");
        } else if (tipType == 'alert') {
            this.boundingBox = $("body");
        } else if (tipType == 'confirmB') {
            this.boundingBox = $("body");
        }
        tipType == 'confirm' && this.confirmRenderUI();
        tipType == 'toast' && this.toastRenderUI();
        tipType == 'alert' && this.alertRenderUI();
        tipType == 'confirmB' && this.confirmBRenderUI();
        this.boundingBox.appendTo(this.config.windowDom.document.body);

        //是否显示遮罩
        if (this.config.hasMask) {
            this.config.hasMaskWhite ? this._mask = $("<div class='dialog-mask-white'></div>") : this._mask = $("<div class='dialog-mask'></div>");
            this._mask.appendTo(this.config.windowDom.document.body);
            $("body,html").css({ "height": "100%", "overflow": "hidden" });
        }
        if (tipType == 'confirm') {
            $(".dialog-bottom-right .btn-cancle").on('click', function () {
                _this.close();
            });
            $(".dialog-bottom-right .btn-submit").on('click', function () {
                if (typeof _this.config.callBack === "function") {
                    _this.config.callBack();
                }
                _this.close();
            });
        }
        if (tipType == 'toast') {
            setTimeout(function () {
                $(".toast").hide();
                _this.close();
            }, this.config.toastTime);
        }
    },

    bindUI: function () {
        _this = this;

        //点击空白立即取消  
        this.config.clickDomCancel && this._mask && this._mask.click(function () { _this.close(); });

        //点击“好”按钮关闭提示框
        if (_this.config.type == "alert") {
            $(".alert-btn-ok,.alert-dialog-mask").on("touchend", function () {
                if (typeof _this.config.callBack === "function") {
                    _this.config.callBack();
                }
                _this.close();
            });
        }

        if (_this.config.type == "confirmB") {
            //确认框点击“取消”按钮关闭提示框
            $(".confirm-btn-cancle, .confirm-dialog-mask").on("touchend", function () {
                _this.close();
            });
            $(".confirm-btn-ok").on('click', function () {
                if (typeof _this.config.callBack === "function") {
                    _this.config.callBack();
                }
                _this.close();
            });
        }
    },

    confirmRenderUI: function () {
        var strConfirm = "<h1>" + this.config.title + "</h1>";
        strConfirm += " <p>" + this.config.tipsText + "</p>";
        strConfirm += "<select class='select-reason'>"
        for (var i = 0; i < this.config.options.length; i++) {
            strConfirm += "<option value='" + this.config.options[i].value + "'>" + this.config.options[i].text + "</option>";
        }
        strConfirm += "</select>";
        strConfirm += "<input class='input-reason' type='text' name='reason' placeholder='补充原因'/>";
        strConfirm += "<div class='dialog-bottom clearfix'>";
        strConfirm += "<div class='dialog-bottom-right'>";
        strConfirm += "<a class='btn-cancle' href='javascript:;'>取消</a>";
        strConfirm += "<a class='btn-submit' href='javascript:;'>" + this.config.strBottomRight1 + "</a>";
        strConfirm += "</div>";
        strConfirm += "</div>";
        this.boundingBox.append(strConfirm);
    },
    toastRenderUI: function () {
        var strToast = "<div class='toast'>" + this.config.toastText + "</div>";
        this.boundingBox.append(strToast);
        $(".toast").css("bottom", this.config.toastBottom);
        if (this.config.toastBottom == "100px") {
            $(".toast").css({ "-webkit-animation": "slideUpOutDefault 2s 1", "animation": "slideUpOutDefault 2s 1", "-webkit-animation-duration": this.config.toastTime / 1000 + "s", "animation-duration": this.config.toastTime / 1000 + "s" });
        } else {
            $(".toast").css({ "-webkit-animation": "slideUpOut 2s 1", "animation": "slideUpOut 2s 1", "-webkit-animation-duration": this.config.toastTime / 1000 + "s", "animation-duration": this.config.toastTime / 1000 + "s" });
        }
    },
    alertRenderUI: function () {
        var strAlert = "<div class='alert-dialog-box'>";
        strAlert += "<div class='alert-dialog-mask'></div>";
        strAlert += "<div class='alert-dialog'>";
        strAlert += "<div class='alert-content'>";
        strAlert += "<p>" + this.config.tipsText + "</p>";
        strAlert += "</div>";
        strAlert += "<div class='alert-btn-box'>";
        strAlert += "<a class='alert-btn-ok' href='javascript:;'>好</a>";
        strAlert += "</div>";
        strAlert += "</div>";
        strAlert += "</div>";
        this.boundingBox.append(strAlert);
        $(".alert-dialog-box").css({ "opacity": "1", "visibility": "visible" }); //.addClass("show");  //弹出提示框
        $("body").on("touchmove", function (e) {
            e.preventDefault();
        });
    },
    confirmBRenderUI: function () {
        var strConfirmB = "<div class='confirm-dialog-box'>";
        strConfirmB += "<div class='confirm-dialog-mask'></div>";
        strConfirmB += "<div class='confirm-dialog'>";
        strConfirmB += "<div class='confirm-content'>";
        strConfirmB += "<p>" + this.config.tipsText + "</p>";
        strConfirmB += "</div>";
        strConfirmB += "<div class='confirm-btn-box'>";
        strConfirmB += "<a class='confirm-btn-cancle' href='javascript:;'>取消</a>";
        strConfirmB += "<a class='confirm-btn-ok' href='javascript:;'>确认</a>";
        strConfirmB += "</div>";
        strConfirmB += "</div>";
        strConfirmB += "</div>";
        this.boundingBox.append(strConfirmB);
        $(".confirm-dialog-box").css({ "opacity": "1", "visibility": "visible" }); //.addClass("show");  //弹出提示框
        $("body").on("touchmove", function (e) {
            e.preventDefault();
        });
    },

    //关闭  
    close: function () {
        var t = this;
        //取消订单确认框
        if ($(".dialog-mask,.dialog").length > 0 && $(".dialog").css("display")=="block") {
            $(".dialog-mask,.dialog").fadeOut(300, function () {
                t.destroy();
                $("body,html").css({ "height": "auto", "overflow": "visible" });
            })
        }
        //toast提示
        if (t.config.type == 'toast') {
            $(".toast").remove();
            t.boundingBox = null;
        }
        //alert提示
        if (t.config.type == 'alert') {
            $(".alert-dialog-box").css({ "-webkit-transition": "all .5s ease", "transition": "all .5s ease", "opacity": "0" });  //.removeClass("show");
            $("body").off("touchmove");
            setTimeout(function () {
                $(".alert-dialog-box").css({ "visibility": "hidden" });  //防止点击“好”关闭按钮时按到其他按钮
                $(".alert-dialog-box").css({ "-webkit-transition": "none", "transition": "none", "opacity": "1" });
                $(".alert-dialog-box").remove();
                t.boundingBox = null;
            }, 800);
        }
        //confirmB提示
        if (t.config.type == 'confirmB') {
            $(".confirm-dialog-box").css({ "-webkit-transition": "all .5s ease", "transition": "all .5s ease", "opacity": "0" });  //.removeClass("show");
            $("body").off("touchmove");
            setTimeout(function () {
                $(".confirm-dialog-box").css({ "visibility": "hidden" });  //防止点击“取消”关闭按钮时按到其他按钮
                $(".confirm-dialog-box").css({ "-webkit-transition": "none", "transition": "none", "opacity": "1" });
                $(".confirm-dialog-box").remove();
                t.boundingBox = null;
            }, 800);
        }
    },

    //销毁  
    destroy: function () {
        this._mask && this._mask.remove();
        this.boundingBox && this.boundingBox.remove();
        this.boundingBox = null;
    }
}