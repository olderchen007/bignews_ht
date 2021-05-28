$(function() {
    var layer = layui.layer

    var form = layui.form

    initCate()
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // console.log(res.data);

                //调用模板引xing ,渲染分类的下拉菜单
                var htmlStr = template('tpl-catepub', res)
                $('[name=cate_id]').html(htmlStr)

                //一定要记得调用 form.render()方法
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮 ， 绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()

        })
        // 监听 coverFile 的change 事件，获取用户的选择的文件列表
    $('#coverFile').on('change', function(e) {
        //获取到文件的列表组
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        //根据文件 ，创建对应对应的 url 地址
        var newImgURL = URL.createObjectURL(files[0])

        //为裁剪区重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_satae = '已发布'

    //为存为草稿按钮 ， 绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_satae = '草稿'
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
            // 1、阻止表单提交
            e.preventDefault()
                // 2、基于 form 表单 ， 快速创建一个FormData 对象
            var fd = new FormData($(this)[0])

            // fd 追加发布状态
            fd.append('state', art_satae)
                //  输出为一个图片文件

            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // 5、将文件对象 存储到fd
                    fd.append('cover_img', blob)
                        // 6、发起ajax 请求
                    publishArticle(fd)
                })
        })
        // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如果向服务器提交的是 ForDate 格式的数据
            //必须天机以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg(res.message)
                location.href = '/article/art_list.html'
            }
        })
    }
})