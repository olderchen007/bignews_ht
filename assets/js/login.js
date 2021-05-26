$(function() {
    // 点击注册链接账号
    $('#link_reg').on('click', function() {
            $('.reg-box').show();
            $('.login-box').hide();
        })
        // 点击登录链接，显示登录页面
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // layui获取一个form 对象
    var form = layui.form
        // layui获取一个layer对象
    var layer = layui.layer
        // 通过form.verify() 函数自定义规则
    form.verify({
            // 自定义username校验规则
            username: [
                    /^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$/, '用户名不能有特殊字符'
                ]
                // 自定义 pwd 校验规则
                ,
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            repwd: function(value) {
                //vaule 确认密码框的内容
                //还需要拿到密码框的中的内容
                // 然后进行判断
                // 如果失败就return一个消息
                var pwd = $('.reg-box [name=password]').val();
                if (pwd !== value) {
                    return '两次密码不一致！'
                }
            }
        })
        // 监注册表单提价事件
        // var data = 
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        $.post('/api/reguser', {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            function(res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message);
                }
                // console.log('ok');
                layer.msg('注册成功！')
                    // 默认人的点击行为
                $('#link_login').click()
            })
    })

    // 登录表单事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        // $.post('http://api-breakingnews-web.itheima.net/api/login', {
        //     username: $('#form_login [name=username]').val(),
        //     password: $('#form_login [name=password]').val()
        // }, function(res) {
        //     if (res.status !== 0) {
        //         return layer.msg(res.message);
        //     }
        //     layer.msg('登录成功！');
        // })
        $.ajax({
            url: "/api/login",
            method: "POST",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败!');
                }
                layer.msg('登录成功!');
                // console.log(res.token);
                // 登录成功后将得到的 token 字符串 ，保存到本地
                localStorage.setItem('token', res.token);
                location.href = '/index.html'
            }
        })
    })
})