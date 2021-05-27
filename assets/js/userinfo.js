$(function() {
    var form = layui.form
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 位！'
            }
        }

    })
    getuserInfoId()
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
            // post获取表单数据
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('修改成功！')
                    // 调用父页面的index.html的方法
                window.parent.getUserInfo();
            }
        })
    })

    // 重置按钮
    $('.layui-btn').on('click', function(e) {
        e.preventDefault;
        getuserInfoId()
    })

    // get获取数据
    function getuserInfoId() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {

                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                // console.log(res.data);
                // 调用form.val() 快速给表单复制 在layui的内置表单里有一个表单复制、取值
                form.val('formUserInfo', res.data);
            }
        })

    }


})