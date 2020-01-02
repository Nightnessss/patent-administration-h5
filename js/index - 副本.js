$(function(){

    var url = 'http://127.0.0.1';
    /**
     * 初始化勾选框
     */
    function initTableCheckbox() {
        var $thr = $('table thead tr');
        var $checkAllTh = $('<th><input class="checkbox" style="display:none" type="checkbox" id="checkAll" name="checkAll" /></th>');
        /*将全选/反选复选框添加到表头最前，即增加一列*/
        $thr.prepend($checkAllTh);
        /*“全选/反选”复选框*/
        var $checkAll = $thr.find('input');
        
        $checkAll.click(function(event){
            /*将所有行的选中状态设成全选框的选中状态*/
            $tbr.find('input').prop('checked',$(this).prop('checked'));
            /*并调整所有选中行的CSS样式*/
            if ($(this).prop('checked')) {
            $tbr.find('input').parent().parent().addClass('warning');
            } else{
            $tbr.find('input').parent().parent().removeClass('warning');
            }
            /*阻止向上冒泡，以防再次触发点击操作*/
            event.stopPropagation();
        });
        /*点击全选框所在单元格时也触发全选框的点击操作*/
        $checkAllTh.click(function(){
            $(this).find('input').click();
        });
        var $tbr = $('table tbody tr');
        var $checkItemTd = $('<td><input class="checkbox" style="display:none" type="checkbox" name="checkItem" /></td>');
        /*每一行都在最前面插入一个选中复选框的单元格*/
        $tbr.prepend($checkItemTd);
        /*点击每一行的选中复选框时*/
        $tbr.find('input').click(function(event){
            /*调整选中行的CSS样式*/
            $(this).parent().parent().toggleClass('warning');
            /*如果已经被选中行的行数等于表格的数据行数，将全选框设为选中状态，否则设为未选中状态*/
            $checkAll.prop('checked',$tbr.find('input:checked').length == $tbr.length ? true : false);
            /*阻止向上冒泡，以防再次触发点击操作*/
            event.stopPropagation();
        });
    }
    function initTableRadio() {
        
        // $tbr.find('input').click(function(event){
        //     /*调整选中行的CSS样式*/
        //     $(this).parent().parent().toggleClass('warning');
        //     $tbr.find('input').each(function() {
        //         if($(this).get(0).checked == true) {
        //             $(this).parent().parent().toggleClass('warning');
        //         } else {
        //             $(this).parent().parent().removeClass('warning');
        //         }
        //     })
        //     /*阻止向上冒泡，以防再次触发点击操作*/
        //     event.stopPropagation();
        // });
    }
    /**
     * 清空勾选框
     */
    function clearTableCheckbox() {
        var $thr = $('table thead tr');
        var $checkAll = $thr.find('input');
        /*将全选框的设为未选中状态*/
        $checkAll.prop('checked', false);
        var $tbr = $('table tbody tr');
        /*清除CSS样式*/
        $tbr.find('input').parent().parent().removeClass('warning');
        /*将选中框设置为未选中*/
        $tbr.find('input').prop('checked', false);
        /*阻止向上冒泡，以防再次触发点击操作*/
        event.stopPropagation();
    }


    function initTable() {
        $.ajax({
            //请求方式
            type: "GET",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url : url + "/patent/getPatents",
            //请求成功
            success : function(result) {
                console.log(result);
                // console.log(result.data.length);
                if(result.status == 'success') {
                    for(let i = result.data.length -1; i >= 0 ; i--) {
                        $('table tbody').prepend('<tr><td>' + result.data[i].id + '</td>' +
                                                    '<td>' + result.data[i].code + '</td>' + 
                                                    '<td>' + result.data[i].name + '</td>' +
                                                    '<td>' + result.data[i].inventor + '</td>' +
                                                    '<td>' + result.data[i].applicant + '</td>' +
                                                    '<td>' + result.data[i].publicationTime + '</td></tr>');
                    }
                }
                initTableCheckbox();
                initTableRadio();
                    //点击每一行时也触发该行的选中操作
                $('table tbody tr').click(function(){
                    if($.trim($(".delete").css('display')) == $.trim('block')) {
                        $(this).find('input').click();
                    }
                });
            },
            //请求失败，包含具体的错误信息
            error : function(e){
                console.log(e.status);
                console.log(e.responseText);
            }
        })
    }
    initTable();
    


    /**
     * 点击删除按钮禁用除 取消 删除 外其他按钮，显示勾选框
     * */
    $("#btn_delete").click(function(){
        console.log("--------------delete--------------");
        $(".checkbox").css('display', 'block');
        $(".delete").css('display', 'block');
        $(".btn").attr('disabled', true);
        $("#btn_default").attr('disabled', false);
        $("#btn_danger").attr('disabled', false);
    });
    /**
     * 点击修改按钮弹出修改框
     */
    $("#btn_update").click(function(){
        console.log("--------------update--------------");
        $(".radio").css('display', 'block');
        $(".update").css('display', 'block');
        $(".btn").attr('disabled', true);
        $("#btn_default").attr('disabled', false);
        $("#btn_primary").attr('disabled', false);
    });
    /**
     * 点击取消按钮解除按钮禁用，隐藏 取消 删除 按钮，清空勾选框
     * */
    $("#btn_default").click(function() {
        console.log("--------------delete cancel--------------");
        $(".checkbox").css('display', 'none');
        $(".radio").css('display', 'none');
        $(".delete").css('display', 'none');
        $(".update").css('display', 'none');
        $(".btn").attr('disabled', false);
        clearTableCheckbox();
    });
    /**
     * 点击删除按钮弹出确认框
     * */
    $("#btn_danger").click(function() {
        console.log("--------------make sure if delete--------------");
        //取表格的选中行数据
        var arrselections = [];
        var ids = [];
        $('table tbody tr input[name="checkItem"]').each(function(i){
            // console.log($(this).get(0).checked == true);
            if($(this).get(0).checked == true) {
                // console.log(i);
                arrselections.push($(this).val());
                // console.log("id:" + $('table tbody').find('tr').eq(i).find('td').eq(1).text());
                ids.push($('table tbody').find('tr').eq(i).find('td').eq(1).text());
            }
        });
        console.log(ids);
        if (arrselections.length <= 0) {
            alert("请选择有效数据", null, function () {
            }, {type: 'warning', confirmButtonText: 'OK'});
        } else {
            confirm("删除确认", "你将无法复原该操作", function (isConfirm) {

                if (isConfirm) {
                    //after click the confirm
                    console.log(ids);
                    $.ajax({
                        type: "POST",
                        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                        url: url + "/patent/deletePatents",
                        data: {
                            "ids": JSON.stringify(ids)
                        },
                        dataType: "json",
                        success: function (result) {
                            if (result.status == "success") {
                                alert("删除成功", null, function () {
                                }, {type: 'success', confirmButtonText: 'OK'});
                                window.location.reload()
                            } else {
                                alert(result.data.errorMsg, null, function () {
                                }, {type: 'error', confirmButtonText: 'OK'});
                            }
                        },
                        error: function () {
                            toastr.error('Error');
                        },
                        complete: function () {
        
                        }
        
                    });
                } else {
                    //after click the cancel
                }
            }, {confirmButtonText: '确认', cancelButtonText: '取消', width: 400});
                
        }

        
    });
    /**
     * 点击添加按钮弹出新增框
     * */
    $("#btn_add").click(function(){
        console.log("--------------add--------------");
        $('#myModalLabel').text("新增")
        $('#btn_submit').text("增加")
        $('#myModal').modal();
    });
    $("#btn_submit").click(function() {
        console.log("--------------do it--------------")
        var id = 0;
        var code = $('#code').val();
        // console.log(code);
        var name = $('#name').val();
        var inventor = $('#inventor').val();
        var applicant = $('#applicant').val();
        var publication_time = $('#publication_time').val();

        var uri = "";
        var ret = "";
        if($('#myModalLabel').text() == "新增") {
            uri = "/patent/addPatent";
            ret = "新增成功";
        } else if($('#myModalLabel').text() == "修改") {
            uri = "/patent/updatePatent";
            ret = "更新成功";
        } else {
            alert("操作异常", null, function () {
            }, {type: 'error', confirmButtonText: 'OK'});
        }

        $.ajax({
            type: "POST",
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            url: url + uri,
            data: {
                "id": id,
                "code": code,
                "name": name,
                "inventor": inventor,
                "applicant": applicant,
                "publication_time": publication_time
            },
            dataType: "json",
            success: function (result) {
                if (result.status == "success") {
                    alert(ret, null, function () {
                    }, {type: 'success', confirmButtonText: 'OK'});
                    window.location.reload();
                } else {
                    alert(result.data.errorMsg, null, function () {
                    }, {type: 'error', confirmButtonText: 'OK'});
                }
            },
            error: function () {
                toastr.error('Error');
            },
            complete: function () {

            }

        });
    })
    /**
     * 点击修改按钮弹出修改框
     */
    $("#btn_update").click(function(){
        console.log("--------------update--------------");
        // $('#myModalLabel').text("修改")
        // $('#btn_submit').text("修改")
        // $('#myModal').modal();
    });
    /**
     * 时间选择框格式设定
     */
    $(".time input").datepicker({
        formate: "yyyy-mm-dd",
        language: "zh-CN"
    })
    

});