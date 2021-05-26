// ajaxPrefilter 是jquery 原生的 
// 每次调用 请求的时候就会先带调用 $.ajaxPrefilter() 函数
$.ajaxPrefilter(function(option) {
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url
})