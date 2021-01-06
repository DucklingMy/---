$(function () {
  // ====================== 添加昵称的自定义校验规则 ======================

  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    /* nickname: function (value, item) {
      //value：表单的值、item：表单的DOM对象
    }, */

    // 昵称
    nickname: (value) => {
      // console.log(value);

      if (value.length > 6) {
        return "昵称的长度需要在1-6字符之间";
      }
    },
  });

  // ==================  发送ajax请求， 获取用户的基本信息 ==================
  function getInfo() {
    $.ajax({
      url: "/my/userinfo",
      success: function (res) {
        // console.log(res);

        // 给表单赋值
        // form 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
        // 注意点：第二个参数，数据需要和表单中的name进行一一对应，这样才能正确的给表单赋值
        form.val("form", res.data);
      },
    });
  }
  getInfo();

  // ----------------------------------表单重置,重置的是默认值------------
  $("#resetBtn").on("click", function (e) {
    // 阻止表单默认重置功能，我们要的是显示之前的用户名和昵称
    e.preventDefault();
    // 从新发送请求，获取我们自己设置的表单默认值
    getInfo();
  });

  // ---------------------实现表单的修改功能---------
  $("#form").on("submit", function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "/my/userinfo",
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改用户信息失败!");
        }
        // 因为修改信息界面是在iframe中显示出来的，不能直接获取到index后台页面的数据，通过window的方法访问到父页面中window，所以父页面的数据也必须是全局的，可以被访问到
        window.parent.getUserInfo();
        layer.msg("修改用户信息成功!");
      },
    });
  });
});
