$(function() {
    var layer = layui.layer

    var form = layui.form
        // 分页区
    var laypage = layui.laypage;

    initEditor()

    // 定义美化时间的过滤器 (模板引xing的)
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()

        var m = dt.getMonth() + 1
        m = m < 10 ? '0' + m : m
        var d = dt.getDate()
        d = d < 10 ? '0' + d : d

        var hh = dt.getHours()
        hh = hh < 10 ? '0' + hh : hh
        var mm = dt.getMinutes()
        mm = mm < 10 ? '0' + mm : mm
        var ss = dt.getSeconds()
        ss = ss < 10 ? '0' + ss : ss

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }


    // q定义一个查询的参数对象，将来请求的数据的时候
    // 需要将请求的对象提交到服务器
    var q = {
            pagenum: 1, //页数默认为第一页
            pagesize: 2, //列表数默认为2条数据
            cate_id: '', //文章id
            state: '' //文章发布的状态
        }
        // 获取文章的数据的方法
    initTable()
    initCate()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                console.log(res);
                // 使用模板引xing 渲染页面数据
                var htmlStr = template('artlist-table', res);
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)

            }
        })
    }

    // 获取文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引xing 渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 通知layui 重新渲染表单区
                form.render()
            }
        })
    }

    // 筛选表单
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
                // 获取表单中的选中的值
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
                // 为查询的参数对象 q 中对应的属性赋值
            q.cate_id = cate_id
            q.state = state
                // 根据最新的筛选数据
            initTable()
        })
        // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //页面的id
            count: total, //总条数
            limit: q.pagesize, //每页显示的几条数据
            curr: q.pagenum, //这是第几页
            layout: ['count', 'limit', 'prev', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 切换跳转页面 ，触发jump 回调函数
            //触发jump 回调的方式有两种
            //1、点击页码的时候，会触发jump 回调
            //2、只要调用了 laypage.render() 的方法，就会触发jump 
            jump: function(obj, first) {
                //把最新的页面值赋值到 q 的查询对象中
                q.pagenum = obj.curr
                    // 根据最新的q 渲染页面数据
                    // initTable()
                    // 拿到每页的条数据
                q.pagesize = obj.limit

                // 在jump回调函数添加一个参数first 的布尔值 如果是第一只调就是2方法触发的，
                //否则就是1触发的
                if (!first) {
                    initTable()
                }

            }
        })

    }
    $('tbody').on('click', '.btn-delete', function() {

        // 拿到页面上的删除按钮个数
        var len = $('.btn-delete').length

        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    //但数据删除后，判断是否还有数据
                    //如果没有了就 页面 -1
                    //在重新调用initTable 方法

                    if (len === 1) {
                        //如果 len d的值等于 1 ，证明删除完毕之后，页面没有数据了

                        // 页面值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    initTable()


                }
            })

            layer.close(index);
        });
    })



    // 为选择封面按钮 ， 绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()

    })



    // 点击编辑按钮 click 事件
    $('tbody').on('click', '.btn-edit', function() {
        $('#pub_edit').show();
        $('#art_listcart').hide()
        var id = $(this).attr('data-id')

        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取文章内容失败！')
                }
                $('[name=title]').val(res.data.title)
                layer.msg('获取文章内容成功！')
                    //调用模板引xing ,渲染分类的下拉菜单
                var htmlStr = template('tpl-catepub', res)
                $('#pub_cate_id').html(htmlStr)
                    // form.render()

            }
        })

        // 1. 初始化图片裁剪器
        var $image = $('#image')

        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }

        // 3. 初始化裁剪区域
        $image.cropper(options)

        initEditor()
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
                //必须天添加以下两个配置项
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

})