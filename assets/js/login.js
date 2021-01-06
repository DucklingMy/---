$(function () {
  // ========================= 登录 注册的切换效果 =========================
  // 去注册账号
  $("#gotoRegi").click(function () {
    // 显示注册
    $(".register").show();

    // 隐藏登录
    $(".login").hide();
  });

  // 去登录
  $("#gotoLogin").click(function () {
    // 隐藏注册
    $(".register").hide();

    // 显示登录
    $(".login").show();
  });

  // ========================== 添加自定义校验规则 ==========================
  // form.verify layui提供的用来自定义校验规则
  // 注意：form.verify 不能直接去使用，需要从layui中获取到form的功能（layui.form），才可以添加自定义校验规则
  let form = layui.form;
  form.verify({
    // 我们既支持上述函数式的方式，也支持下述数组的形式
    // 数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    // pass 是密码的校验
    // 注意：pass名字需要将其写到密码的输入框的lay-verify属性中
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],

    // 在来添加两次输入的密码必须一致的校验规则
    // repwd 需要对谁做校验：需要对再次输入的密码框做校验
    repwd: function (value, item) {
      // value：表单的值（再次输入密码框的值）、item：表单的DOM对象
      // console.log(value);
      // console.log(item);

      // 步骤
      // 1. 需要获取到注册表单中的密码框的值
      // 2. 将两次输入的密码进行比较,如果两次的密码不一致,就需要出现提示框

      // 1.
      let pwd = $(".register [name=password]").val(); // 需要注意的点：要的密码框是 .register 注册表单中，一定要精确获取元素
      // console.log(pwd);

      // 2.
      if (value !== pwd) {
        // 两次输入的密码不一致
        // 函数内的return返回值就是提示框的信息
        return "密码不一致";
      }
    },
  });

  // ========================== 实现注册功能 ==========================
  // 从layui中获取到layer
  let layer = layui.layer;

  $("#regiForm").on("submit", function (e) {
    // 1. 阻止表单的默认行为
    // 2. 获取到表单的数据
    // 3. 发送ajax实现注册功能
    // 4. 弹框提示注册如何

    // 1.
    e.preventDefault();

    // 2.
    let data = $(this).serialize();
    // console.log(data);

    // 3.
    $.ajax({
      type: "POST",
      // url: "http://ajax.frontend.itheima.net/api/reguser",
      url: "/api/reguser",
      data,
      success: function (res) {
        // console.log(res);

        if (res.status !== 0) {
          // 注册失败
          // return console.log("注册失败");
          // return layer.msg("注册失败");
          return layer.msg(res.message);
        }

        // console.log("注册成功");
        layer.msg("注册成功");

        // 注册成功之后，需要出发去登录的点击事件
        $("#gotoLogin").click();
      },
    });
  });

  // ========================== 实现登录功能 ==========================
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();

    let data = $(this).serialize();

    $.ajax({
      type: "POST",
      // url: "http://ajax.frontend.itheima.net/api/login",
      url: "/api/login",
      data,
      success: function (res) {
        console.log(res);

        if (res.status !== 0) {
          // 登录失败
          return layer.msg("登录失败");
        }

        /* // 登录成功
        layer.msg("登录成功, 即将跳转到首页");
        // 跳转页面
        location.href = "/home/index.html"; */

        // 登录成功，还需要把服务器给的token信息给存储起来
        localStorage.setItem("token", res.token);

        // 延时跳转：等弹出框关闭了才去跳转
        layer.msg("登录成功, 即将跳转到首页", function () {
          // 弹出框关闭了才会执行该函数
          // 跳转页面
          location.href = "/home/index.html";
        });
      },
    });
  });
});
