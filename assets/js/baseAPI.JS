// ajaxPrefilter 是jquery 原生的 
// 每次调用 请求的时候就会先带调用 $.ajaxPrefilter() 函数
$.ajaxPrefilter(function(option) {
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url


    // 统一为有权的接口,设置 header请求头
    if (option.url.indexOf('/my/') !== -1) { //index 不等负一
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    // 无论成功还是失败都会调用 complete 函数
    option.complete = function(res) {
        console.log(res)
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1、强制清空token
            localStorage.removeItem('token')
                // 2、强制跳转到登录页面
            location.href = '/login.html'
        }
    }


})