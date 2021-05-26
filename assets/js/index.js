$(function() {
    // 调用 getUserInfo() 获取用户基本信息
    getUserInfo()

    var layer = layui.layer

    // 绑定退出 按钮事件
    $('#btnLogout').on('click', function() {
        // console.log('ok');
        //eg1 layer 弹出框
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' },
            function(index) {
                //do something
                // 1、要清空登录进来是本地保存的token
                localStorage.removeItem('token')
                    // 2、重新跳转到登录页面
                location.href = './login.html'
                    // 关闭confirm 弹出框
                layer.close(index);
            });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {

                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                // console.log(res.data);
                // 调用函数renderAvatar() 渲染用户头像
                renderAvatar(res.data)
            }
            // // 无论成功还是失败都会调用 complete 函数
            // complete: function(res) {
            //     console.log(res)
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 1、强制清空token
            //         localStorage.removeItem('token')
            //             // 2、强制跳转到登录页面
            //         location.href = '/login.html'
            //     }
            // }

    })
}
// 1、渲染用户头像
function renderAvatar(user) {
    //  1、获取用户的名称
    var name = user.nickname || user.username
        // 2、欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 3、按需渲染头像
    if (user.user_pic !== null) {
        // 3.1渲染头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var firstname = name[0].toUpperCase()
        $('.text-avatar').html(firstname).show();

    }

}