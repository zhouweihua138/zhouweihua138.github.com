$(function () {

    ////省市联动给修改页面用
    //$("#Province").one("click", function () {
    //    getAreaInfo("Province", 1, "中国");
    //})

    var hasClicked = false;
    //省市联动给修改页面用
    $(document).on("click", "#Province", function () {
        if(!hasClicked){
            getAreaInfo("Province", 1, "中国");
            hasClicked = true;
        }
    })
});