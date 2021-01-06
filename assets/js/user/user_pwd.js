$(function () {
  // 定义校验规则
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 判断新老密码是否相同；
    newPwd: function (value) {
      //value：表单的值、item：表单的DOM对象
      let oldPwd = $("#oldPwd").val();
      if (value === oldPwd) {
        return "新老密码不能相同";
      }
    },
    // 确认新密码是否相同；
    samPwd: function (value) {
      let newPwd = $("#newPwd").val();
      if (newPwd !== value) {
        return "两次输入的新密码不一致";
      }
    },
  });

  // 发送ajax请求，让服务器判断密码是否更新成功
  $("#pwdForm").on("submit", function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "/my/updatepwd",
      data,
      success: function (res) {
        if (res.status != 0) {
          return layer.msg("更新密码失败");
        }
        layer.msg("更改密码成功");
      },
    });
  });


});
