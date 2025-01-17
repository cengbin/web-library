(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Awesome = factory());
})(this, (function () { 'use strict';

  var name = "awesome.ts";
  var version = "0.0.1";

  /**
   * 常用工具函数模块
   * @module util
   * */

  /**
   * 递归 深拷贝
   * @param data {Object} 拷贝的数据
   */
  function deepCopyBy(data) {
    var t = getType(data);
    var o;
    if (t === 'array') {
      o = [];
    } else if (t === 'object') {
      o = {};
    } else {
      return data;
    }
    if (t === 'array') {
      for (var i = 0; i < data.length; i++) {
        o.push(deepCopy(data[i]));
      }
    } else if (t === 'object') {
      for (var _i in data) {
        o[_i] = deepCopy(data[_i]);
      }
    }
    return o;
  }

  /**
   * JSON 深拷贝
   * @param data {Object} 拷贝的数据
   * @return data {Object} 复制后生成的对象
   */
  function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * 将手机号中间部分替换为星号
   * @param phone {String}: 手机号码
   */
  function formatPhone(phone) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  /**
   * 防抖
   * @param func {Function}  执行函数
   * @param wait {Number}  防抖时间（毫秒）
   */
  function debounce(func, wait) {
    var id;
    return function () {
      var _this = this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      id && clearTimeout(id);
      id = setTimeout(function () {
        func.apply(_this, args);
      }, wait);
    };
  }

  /**
   * 节流
   * @param func {Function}  执行函数
   * @param wait {Number}  节流时间（毫秒）
   */
  function throttle(func, wait) {
    var lastTime = Date.now();
    return function () {
      var now = Date.now();
      if (now - lastTime > wait) {
        lastTime = now;
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        func.apply(this, args);
      }
    };
  }

  /**
   * 检测对象是否含有某组属性
   * @param obj {Object} 检测对象
   * @param keys {Array} 属性列表
   * @example
   * var obj={name:"test",age:18};
   * hasKey(obj,["name","age"]) // true
   * hasKey(obj,["name","age","sex"]); // false
   */
  function hasKeys(obj, keys) {
    if (obj instanceof Object && keys instanceof Array) {
      var ble = false;
      for (var i = 0, n = keys.length; i < n; i++) {
        if (Object.prototype.hasOwnProperty.call(obj, keys[i])) {
          ble = true;
        } else {
          ble = false;
          break;
        }
      }
      return ble;
    }
  }

  /**
   * 格式化字符串成数字，保留2位小数
   * @param value 格式化的字符串
   * */
  function formatToNum(value) {
    value = value.toString();
    // 只能输入"数字"和"."
    value = value.replace(/[^\d.]/g, '');
    // 第一位字符不能为"."
    value = value.replace(/^\./g, '');
    // 只能输入一个小数点且只保留一个
    value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    // 只能输入1位小数
    // value = value.replace(/^(\-)*(\d+)\.(\d).*$/, "$1$2.$3");
    // 只能输入两个小数
    // eslint-disable-next-line
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    return value;
  }

  /**
   * 格式化现在的已过时间
   * @param {Date} startTime
   * @return {String}
   * @example
   *
   * formatPassTime(new Date(2022-01-01 00:00:00)) ===> 1年前
   * formatPassTime(new Date(2021-21-01 10:00:00)) ===> 2月前
   */
  function formatPassTime(startTime) {
    var currentTime = Date.parse(new Date()),
      time = currentTime - startTime,
      day = parseInt(time / (1000 * 60 * 60 * 24)),
      hour = parseInt(time / (1000 * 60 * 60)),
      min = parseInt(time / (1000 * 60)),
      month = parseInt(day / 30),
      year = parseInt(month / 12);
    if (year) return year + '年前';
    if (month) return month + '个月前';
    if (day) return day + '天前';
    if (hour) return hour + '小时前';
    if (min) return min + '分钟前';else return '刚刚';
  }

  /**
   * 格式化时间戳
   * @param {number} time 时间戳
   * @param {string} fmt 格式
   * @return {String}
   * @example
   * formatTime(1700152449834) ===> 2023-11-17 00:34:09
   */
  function formatTime(time) {
    var fmt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-MM-dd hh:mm:ss';
    var ret;
    var date = new Date(time);
    var opt = {
      'y+': date.getFullYear().toString(),
      'M+': (date.getMonth() + 1).toString(),
      // 月份
      'd+': date.getDate().toString(),
      // 日
      'h+': date.getHours().toString(),
      // 小时
      'm+': date.getMinutes().toString(),
      // 分
      's+': date.getSeconds().toString() // 秒
    };

    for (var k in opt) {
      ret = new RegExp('(' + k + ')').exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
      }
    }
    return fmt;
  }

  /**
   * 添加script
   * @param {string} url js url
   * @param {function} [onload] 加载成功回调
   * @param {function} [onerror] 加载失败回调
   * @return {HTMLElement} script引用
   */
  function addScript(url, onload, onerror) {
    var script = document.createElement('script');
    if (onload) {
      script.onload = function () {
        onload(script);
      };
    }
    script.onerror = function () {
      if (onerror) {
        onerror(script);
      } else if (onload) {
        onload(script);
      }
    };
    script.src = url;
    document.head.appendChild(script);
    return script;
  }

  /**
   * DOM添加类
   * @param {HTMLElement} element - DOM元素
   * @param {string} className - 类名
   * */
  function addClass(element, className) {
    var regClassName = new RegExp('(^| )' + className + '( |$)');
    // ( /\s+/ 匹配任何空白符，包括\n,\r,\f,\t,\v等（换行、回车、空格、tab等）})
    if (!regClassName.test(element.className)) {
      element.className = element.className.split(/\s+/).concat(className).join(' ');
    }
  }

  /**
   * DOM删除类
   * @param {HTMLElement} element - DOM元素
   * @param {string} className - 类名
   * */
  function removeClass(element, className) {
    var regClassName = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
    element.className = element.className.replace(regClassName, '');
  }

  /**
   * 判断DOM是否有某个类名
   * @param {HTMLElement} element - DOM元素
   * @param {string} className - 类名
   * @return {Boolean} 判断后的值
   * */
  function hasClass(element, className) {
    return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  }

  /**
   * DOM添加/删除类的切换操作
   * @param {HTMLElement} element - DOM元素
   * @param {string} className - 类名
   * */
  function toggleClass(element, className) {
    if (hasClass(element, className)) {
      removeClass(element, className);
    } else {
      addClass(element, className);
    }
  }
  function secondToHour(second) {
    return second / 60 / 60;
  }
  function secondToMinute(second) {
    return second / 60;
  }
  function secondsToHms(seconds) {
    // 定义时分秒变量
    var h = Math.floor(seconds / 3600); // 计算小时数
    var m = Math.floor(seconds % 3600 / 60); // 计算分钟数
    var s = seconds % 60; // 计算秒数

    // 格式化时分秒为两位数（如果需要）
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    // 返回时分秒字符串
    return h + ':' + m + ':' + s;
  }

  /**
   * 在小于10的数字之前补0
   * @param {Number} num
   * @return {String} 补0之后的值
   * */
  function padZero(num) {
    return num < 10 ? '0' + num : num.toString();
  }

  /**
   * HSL颜色值转换为RGB.
   * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
   * h, s, 和 1 设定在 [0,1] 之间
   * 返回的 r, g, 和 b 在 [0,255] 之间
   *
   * @param Number h 色相
   * @param Number s 饱和度
   * @param Number 1 亮度
   * @return Array RGB色值数值
   */
  function hslToRgb(h, s, l) {
    var r, g, b;
    if (s == 0) {
      r = g = b = 1; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      var q = l < 0.5 ? 1 * (1 + s) : 1 + s - 1 * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
  }

  var util = /*#__PURE__*/Object.freeze({
    __proto__: null,
    deepCopyBy: deepCopyBy,
    deepCopy: deepCopy,
    formatPhone: formatPhone,
    debounce: debounce,
    throttle: throttle,
    hasKeys: hasKeys,
    formatToNum: formatToNum,
    formatPassTime: formatPassTime,
    formatTime: formatTime,
    addScript: addScript,
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    toggleClass: toggleClass,
    secondToHour: secondToHour,
    secondToMinute: secondToMinute,
    secondsToHms: secondsToHms,
    padZero: padZero,
    hslToRgb: hslToRgb
  });

  /**
   * 正则模块
   * @module regexp
   * */

  /**
   * 检测是否是ip地址
   * @param {String} value 检测的值
   * @return {Boolean} true|false
   * */
  function isIP(val) {
    return /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/.test(val);
  }

  /**
   * 检测是否是手机号
   * @param {String} value 检测的值
   * @return {Boolean} true|false
   * */
  function isPhone(val) {
    return /^1[3|4|5|6|7|8][0-9]{9}$/.test(val);
  }

  /**
   * 检测是否是邮箱
   * @param {String} value 检测的值
   * @return {Boolean} true|false
   * */
  function isEmail(val) {
    return /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(val);
  }

  /**
   * 检测是否是身份证号
   * @param {String} value 检测的值
   * @return {Boolean} true|false
   * */
  function isIdCard(val) {
    return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(val);
  }

  /**
   * 检测是否是URL
   * @param {String} value 检测的值
   * @return {Boolean} true|false
   * */
  function isUrl(val) {
    return /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i.test(val);
  }

  var regexp = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isIP: isIP,
    isPhone: isPhone,
    isEmail: isEmail,
    isIdCard: isIdCard,
    isUrl: isUrl
  });

  /**
   * OS模块，获取系统/平台信息
   * @module os
   * */

  /**
   * 是否是 window 系统
   * */
  function isWindows() {}

  /**
   * 是否是 MacOS 系统
   * */
  function isMacOS() {}

  /**
   * 是否是 Android 系统
   * */
  function isAndroid() {}

  /**
   * 是否是 IOS 系统
   * */
  function isIOS() {}

  /**
   * 是否是团子出行App
   * */
  function isTuanZiApp() {}

  var os = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isWindows: isWindows,
    isMacOS: isMacOS,
    isAndroid: isAndroid,
    isIOS: isIOS,
    isTuanZiApp: isTuanZiApp
  });

  /**
   * wxp模块，对wx api的扩展
   * @module wxp
   * */

  /**
   * 跳转到指定路径
   * @param url {String} 路径
   * @param queryObj {Object} 路径参数
   * */
  function navigateToUrl(url) {
    var queryObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var queryString = Object.keys(queryObj).filter(function (key) {
      return queryObj[key] != null || queryObj[key] != undefined;
    }).map(function (key) {
      return "".concat(key, "=").concat(queryObj[key]);
    }).join('&');
    url = "".concat(url, "?").concat(queryString);
    wx.navigateTo({
      url: url
    });
  }

  var wxp = /*#__PURE__*/Object.freeze({
    __proto__: null,
    navigateToUrl: navigateToUrl
  });

  var index = {
    version: version,
    name: name,
    util: util,
    regexp: regexp,
    os: os,
    wxp: wxp
  };

  return index;

}));
