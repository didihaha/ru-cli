(function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var isIphone = function () {
    var deviceType = !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? 'ios' : 'android';

    if (deviceType === 'ios') {
      return true;
    }

    return false;
  }();
  /**
   * 
   * @param {string: require} nativeFuncName 调用的原生方法名
   * @param {any} params 调用原生方法将传入的参数
   * @param {string} callbackName 回调方法名称
   */

  var haddleParams = function haddleParams(nativeFuncName) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var callbackName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    return "jscall://xmly?".concat(nativeFuncName, "&").concat(callbackName, "&").concat(encodeURIComponent(params));
  };
  /**
   * 
   * @param {string: require} functionName 将要调用的native方法的名称
   * @param {object: ?require} params 传入的方法参数
   * @param {object: require} this 调用的方法集合
   */

  function invokeApp(functionName) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    {
      if (!functionName) {
        throw new TypeError('invokeApp方法的第一个参数为调用的方法名，必须传入');
      }

      if (_typeof(params) !== 'object' || Array.isArray(params)) {
        throw new TypeError('invokeApp方法的第二个参数必须为对象，请检出参数');
      }
    }

    var names = functionName.split('.');
    var i = 0,
        willUseFunction = this;

    while (i < names.length) {
      if (willUseFunction.hasOwnProperty(names[i])) {
        willUseFunction = willUseFunction[names[i]];
      } else {
        throw new TypeError('该方法不存在，请检查调用方法');
      }

      i++;
    }

    willUseFunction(params);
  }

  var ui = {
    toast: function toast(params) {
      window.location.href = haddleParams('notificationToast', params.message);
    },
    showLoading: function showLoading() {
      window.location.href = haddleParams('showLoadingView');
    },
    hideLoading: function hideLoading() {
      window.location.href = haddleParams('hideLoadingView');
    }
  };

  var util = {
    // 分享弹窗接口 params {shareData:分享参数,callback:回调函数名称}
    share: function share(params) {
      window.location.href = haddleParams('shareKids', JSON.stringify(params.shareData), params.callback);
    },
    // 播放暂停
    playPause: function playPause() {
      window.location.href = haddleParams('playPause');
    }
  };

  var page = {
    closePage: function closePage() {
      window.location.href = haddleParams('closeWebView');
    },
    // 返回上一页 params {animation:是否需要动画(1 要，0 不要，默认需要)}
    goBack: function goBack() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      window.location.href = haddleParams('back', JSON.stringify({
        animation: params.animation !== undefined ? params.animation : 1
      }));
    },
    // 显示标题栏 params {animation:是否需要动画(1 要，0 不要，默认需要)}
    showTitleBar: function showTitleBar() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      window.location.href = haddleParams('setupNavigationBarShow', JSON.stringify({
        show: 1,
        animation: params.animation !== undefined ? params.animation : 1
      }));
    },
    // 隐藏标题栏 params {animation:是否需要动画(1 要，0 不要，默认需要)}
    hideTilteBar: function hideTilteBar() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      window.location.href = haddleParams('setupNavigationBarShow', JSON.stringify({
        show: 0,
        animation: params.animation !== undefined ? params.animation : 1
      }));
    },
    // 允许滑动关闭页面
    enableSlideClose: function enableSlideClose() {
      window.location.href = haddleParams('setupDragEnable', JSON.stringify({
        dragEnable: 1
      }));
    },
    // 禁用滑动关闭页面
    setupDragEnable: function setupDragEnable() {
      window.location.href = haddleParams('setupDragEnable', JSON.stringify({
        dragEnable: 0
      }));
    }
  };

  var account = {
    // 通知客户端更新VIP信息
    notifyAccountStateChanged: function notifyAccountStateChanged() {
      window.location.href = haddleParams('notifyAccountStateChanged');
    },
    login: function login(params) {
      window.location.href = haddleParams('login', null, params.callback);
    }
  };

  var functionMap = {
    ui: ui,
    util: util,
    page: page,
    account: account
  };

  var createXxm = function createXxm() {
    return {
      invokeApp: invokeApp.bind(functionMap)
    };
  };

  var Ios_xxm = Object.freeze(createXxm());

  var ui$1 = {
    toast: function toast(params) {
      window.native.showToast(params.message);
    },
    showLoading: function showLoading() {
      window.native.showLoadingView();
    },
    hideLoading: function hideLoading() {
      window.native.hideLoadingView();
    }
  };

  var util$1 = {
    // 分享弹窗接口 params {shareData:分享参数,callback:回调函数名称}
    share: function share(params) {
      window.native.shareKids(encodeURIComponent(JSON.stringify(params.shareData)), params.callback);
    },
    // 播放暂停  安卓暂无此功能
    playPause: function playPause() {}
  };

  var page$1 = {
    closePage: function closePage() {
      window.native.closeWebView();
    },
    // 返回上一页 安卓忽略参数
    goBack: function goBack() {
      window.native.closeWebView();
    },
    // 显示标题栏 安卓忽略参数
    showTitleBar: function showTitleBar() {
      window.native.showTitleBar();
    },
    // 隐藏标题栏 安卓忽略参数
    hideTitleBar: function hideTitleBar() {
      window.native.hideTitleBar();
    },
    // 允许滑动关闭页面
    enableSlideClose: function enableSlideClose() {
      window.native.enableSlideClose();
    },
    // 禁用滑动关闭页面
    disableSlideClose: function disableSlideClose() {
      window.native.disableSlideClose();
    }
  };

  var account$1 = {
    // 通知客户端更新VIP信息
    notifyAccountStateChanged: function notifyAccountStateChanged() {
      window.native.notifyVipStateChanged();
    },
    login: function login(params) {
      window.jscall.showLoginView(params.callbackName || null);
    }
  };

  var functionMap$1 = {
    ui: ui$1,
    util: util$1,
    page: page$1,
    account: account$1
  };

  var createXxm$1 = function createXxm() {
    return {
      invokeApp: invokeApp.bind(functionMap$1)
    };
  };

  var Andriod_xxm = Object.freeze(createXxm$1());

  if (isIphone) {
    window.xxm = Ios_xxm;
  } else {
    window.xxm = Andriod_xxm;
  }

}());
