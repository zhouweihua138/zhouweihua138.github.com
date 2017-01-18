/**
 * Created by Zhang on 2016/3/17.
 */
$(document).ready(function(){
    //导航侧滑效果
    $(document).on("click", ".menu-list-btn", function () {
        var sliderObj = document.getElementById('menu');
        if ($(this).attr('data-click') == 0) {
            sliderObj.style.webkitTransform ="translate(0,0)";
            $(".index-mask").fadeIn(100);
            $(this).attr('data-click',1);
        } else if ($(this).attr('data-click') == 1) {
            $(".index-mask").fadeOut(500);
            sliderObj.style.webkitTransform = "translate(-100%,0)";
            $(this).attr('data-click',0);
        }
    });

    //点击遮罩隐藏导航侧滑效果
    $(document).on('touchstart', '.index-mask', function () {
        var sliderObj = document.getElementById('menu');
        sliderObj.style.webkitTransform = "translate(-100%,0)";
        $(".index-mask").fadeOut(500);
        $(".menu-list-btn").attr('data-click', 0);
    });

    //点击遮罩隐藏导航侧滑效果
    $(document).on('touchmove', '.index-mask', function (e) {
        e.preventDefault();
    });

    //禁止侧滑菜单滚动
    $('#menu').on('touchmove',function(evt){
        evt.preventDefault();
    });
});