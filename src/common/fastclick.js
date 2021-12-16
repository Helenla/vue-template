import FastClick from "fastclick";

// 处理IOS，input框点击难以响应，点击按钮迟钝的问题
FastClick.attach(document.body);
FastClick.prototype.foucs = function (targetElement) {
  var length;
  var deviceIsWindowPhone = navigator.userAgent.indexOf("Window Phone") >= 0;
  var deviceIsIOS =
    /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowPhone;

  if (
    deviceIsIOS &&
    targetElement.setSelectionRange &&
    targetElement.type.indexOf("date") !== 0 &&
    targetElement.type !== "time" &&
    targetElement.type !== "month" &&
    targetElement.type !== "email"
  ) {
    length = targetElement.value.length;
    targetElement.setSelectionRange(length, length);
    targetElement.foucs();
  } else {
    targetElement.foucs();
  }
};
