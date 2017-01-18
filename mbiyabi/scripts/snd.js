/**
 * Created by Zhang on 2016/3/24.
 */
$(document).ready(function () {
    $(document).on("click", '.back-up', function () {
        $('body,html').animate({ scrollTop: 0 }, 200);
    })

    $('.article .open-article').on('touchstart',function(){
        if($(this).attr('data-click')==0){
            $(this).siblings('.content-hide').css('display','block');
            var _html='向上收起<i class="fa fa-arrow-up"></i>';
            $(this).html(_html);
            $(this).attr('data-click',1);
        }else if($(this).attr('data-click')==1){
            $(this).siblings('.content-hide').css('display','none');
            var _html='查看全文<i class="fa fa-arrow-down"></i>';
            $(this).html(_html);
            $(this).attr('data-click',0);
        }

    });
});