/**
 * Created by Zhang on 2016/3/25.
 */
$(document).ready(function(){

    //晒单列表页面运行插件
    new AnimOnScroll( document.getElementById( 'grid' ), {
        minDuration : 0.4,
        maxDuration : 0.7,
        viewportFactor : 0.2
    } );


    $('.tab-title li a').on('click',function(){
        var obj = $(this).attr('data-click').substring(1);
        $('#'+obj).addClass('on');
        $('#'+obj).siblings('.content-box').removeClass('on');
        if(obj=='tabContentTwo'){
            new AnimOnScroll( document.getElementById( 'grid2' ), {
                minDuration : 0.4,
                maxDuration : 0.7,
                viewportFactor : 0.2
            });
        }
       $(this).addClass('on');
       $(this).parent().siblings('li').children('a').removeClass('on');
    });
});