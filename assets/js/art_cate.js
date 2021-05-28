$(function() {

    var layer = layui.layer
    var form = layui.form
    initArtCateLst()

    // 获取文章分类的列表
    function initArtCateLst() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
            }
        })
    }
    // 点击添加类别
    var indexadd = null
    $('#btn_leiming').on('click', function() {
            indexadd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#tangkuank').html()
            });
        })
        // 通过代理的形式，为cate-leib 绑定事件
        // 在添加类别弹出框里天机数据
    $('body').on('submit', '#cate-leib', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增文章失败！');
                }

                initArtCateLst()
                layer.msg('新增成功！')
                    // 关闭弹出层
                layer.close(indexadd)
            }
        })
    })

    // 点击删除键删除对应得到id 文章
    $('tbody').on('click', '.btn-delete', function() {

        var id = $(this).attr('data-id')
            // 删除弹出框
            //eg1
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    layer.close(index);
                    initArtCateLst()

                }
            })


        });

    })

    //点击编辑按钮 更新表单数据
    var artupdate = null
    $('tbody').on('click', '.btn-edit', function() {
        var id = $(this).attr('data-id')
        artupdate = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#tang-update').html()
        });
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章数据失败！')
                }
                // 调用form.val() 快速给表单复制 在layui的内置表单里有一个表单复制、取值
                form.val('formart-update', res.data);
                layer.msg(res.message)
            }
        })

    })

    // 点击弹出框的提交修改按钮，提交数据
    $('body').on('submit', '#art-update', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类信息失败！')
                    }
                    initArtCateLst()
                    layer.msg(res.message);
                    // 关闭弹出层
                    layer.close(artupdate)

                }
            })
        })
        // rebtnupdate-art 弹出框的重置按钮
        // 获取数据的方法





})