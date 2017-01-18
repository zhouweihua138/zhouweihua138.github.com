//使用 md5 戳
//fis.match('*.{js,css,png}', {
//    useHash: true
//});
fis.match('*.js', {
    //fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js')
});
fis.match('*.css', {
    //fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css')
});
//fis.match('*.png', {
//    //fis-optimizer-png-compressor 插件进行压缩，已内置
//    optimizer: fis.plugin('png-compressor')
//});
////cssSprite图片合并
////启用 fis-spriter-csssprites 插件
//fis.match('::package', {
//    spriter: fis.plugin('csssprites')
//});
////对css进行图片合并
//fis.match('*.css', {
//    //给匹配到的文件分配属性 'useSprite'
//    useSprite: true
//});


//fis3 release 时添加 md5、静态资源压缩、css 文件引用图片进行合并
//fis3 release -d ../output

//可能有时候开发的时候不需要压缩、合并图片、也不需要 hash。
//那么给上面配置追加如下配置；
//fis.media('debug').match('*.{js,css,png}', {
//    useHash: false,
//    useSprite: false,
//    optimizer: null
//});
////fis3 release debug 启用 media debug 的配置，覆盖上面的配置，把诸多功能关掉。
