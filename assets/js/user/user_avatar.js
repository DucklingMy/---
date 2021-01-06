$(function () {

  let layer = layui.layer;
  // 1.1 获取裁剪区域的 DOM 元素
  let $image = $("#image");

  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  // 模拟点击文件域
  $("#chooseBtn").on("click", function () {
    $("#file").click();
  });

  // 文件域有一个事件，选择的文件发生改变就促发
  $("#file").on("change", function () {
    let file = this.files[0];
    // console.log(file);

    if (!file) {
      //没有选择图片报错
      return;
    }
    let newImgURL = URL.createObjectURL(file);

    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  $("#sureBtn").on("click", function () {
    let dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    //ajax请求，更换头像，凡是要更新的设置的都要向后台请求数据
    $.ajax({
      type: "POST",
      url: "/my/update/avatar",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
       if(res.status != 0) {
         return layer.msg('头像设置失败')
       }
       window.parent.getUserInfo();
       layer.msg('头像设置成功')
      },
    });
  });
});
