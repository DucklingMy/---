// getUserInfo 函数可以来获取到用户的头像和昵称
let layer = layui.layer;

getUserInfo();
function getUserInfo() {
  $.ajax({
    url: "/my/userinfo",
    /* headers: {
      // 设置请求头(带上token信息，token之前在登录成功的时候，存储到本地了，只需要从本地获取到token即可)
      Authorization: localStorage.getItem("token"),
    }, */
    success: function (res) {
      console.log(res);

      if (res.status !== 0) {
        // 获取用户信息失败
        return layer.msg("获取用户信息失败");
      }

      // 通过renderUserInfo函数可以将头像和昵称渲染出来
      renderUserInfo(res.data);
    },
    /* complete: function (xhr) {
      // 请求完成（不论是成功还是失败都会执行该函数）
      // xhr.responseJSON; 这就是服务器响应回来的数据
      // console.log("complete 执行了", xhr.responseJSON);
      if (
        xhr.responseJSON.status === 1 &&
        xhr.responseJSON.message === "身份认证失败！"
      ) {
        // token有问题，身份认证失败！
        // 跳转回login页面，需要重新登录才能进入到index页面
        location.href = "/home/login.html";
      }
    }, */
  });
}

// renderUserInfo 函数可以实现将用户的头像和昵称渲染到页面中
function renderUserInfo(data) {
  console.log(data);
  // 先处理名字
  // 需要将登录名称和昵称做优先级的处理，优先展示昵称
  let name = data.nickname || data.username;

  // 把名字中的第一个字符取出来转大写，作为文字头像
  let first = name[0].toUpperCase();
  console.log(name, first);

  // 显示名字
  $("#welcome").text("欢迎 " + name);

  // 在处理头像
  // 如果data.user_pic 存在的话，就展示用户的图片头像，如果不存在，就展示文字头像
  if (data.user_pic) {
    // 展示用户的图片头像, 隐藏文字头像
    $(".layui-nav-img").attr("src", data.user_pic).show();
    $(".text-avatar").hide();
  } else {
    // 说明没有用户的图片头像，需要隐藏用户的图片头像，显示出文字头像
    $(".layui-nav-img").hide();
    $(".text-avatar").text(first).show();
  }
}

// =========================== 实现退出功能 =================

$("#logoutBtn").click(function () {
  layer.confirm("确认退出吗?", { icon: 3, title: "提示" }, function (index) {
    // 点击确认按钮会执行该函数
    // console.log(index); // 弹出层的索引

    // 退出登录要做啥：就是和当初登录做的事情反过来即可
    // 1. 删除本地存储的token
    // 2. 跳转回登录页面

    // 1.
    localStorage.removeItem("token");

    // 2.
    location.href = "/home/login.html";

    layer.close(index); // 按照index索引来关闭对应的弹出层
  });
});
