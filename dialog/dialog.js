/**
 * @method dialog组件
 */

var dialog = (function() {
  // 节点类型
  var element, dialog, comfirmBtn, cancelBtn;

  /**
   * @method getNeedElement 获取所需节点 
   */
  var getNeedElement = function() {
    element = document.querySelector('.dialog-wrapper');
    dialog = document.querySelector('.dialog');
    cancelBtn = document.querySelector('.cancel-btn');
    comfirmBtn = document.querySelector('.comfirm-btn');
  }

  /**
   * @method init 初始化dialog组件
   * @param {Object} options 设置参数(title, content, btns, comfirm, cancel, shadeClose) 
   * @paramMap title 标题
   * @paramMap content dialog插值，innerHTML和innerText皆可
   * @paramMap btns 底部按钮文案集合
   * @paramMap comfirm 确定按钮回调
   * @paramMap cancel 取消按钮回调
   * @paramMap shadeClose 是否开启点击关闭遮罩
   */
  var init = function(options = {}) {
    // 默认参数
    var {
      title = '',
      content = '提示内容',
      btns = ['取消', '确定'],
      comfirm = null,
      cancel = null,
      shadeClose = true
    } = options;

    // 生成按钮
    var btnTemp = '';
    for (var i = 0, len = btns.length; i < len; i++) {
      if (i < 2) {
        var btnClass = i === 0 ? 'cancel-btn' : 'comfirm-btn';
        var temp = '<div class="btn ' + btnClass + '">' + btns[i] + '</div>';
        btnTemp += temp;
      }
    }

    // 最终生成的html
    var html = '<div class="dialog-wrapper">' +
              '<div class="dialog">' +
                '<div class="dialog-title">' +
                  '<span>' + title + '</span>' +
                  '<button class="dialog_close_icon"></button>' +
                '</div>' +
                '<div class="dialog-content">' + content + '</div>' +
                '<div class="dialog-footer">' +
                  '<span class="dialog-footer-right">' + btnTemp + '</span>' +
                '</div>' +
              '</div>' +
            '</div>';
  
    // 添加到body
    document.body.innerHTML += html;

    // 获取所需节点
    getNeedElement();

    // 绑定事件
    bindEvent(comfirm, cancel, shadeClose);

    return element;
  };

  /**
   * @method 绑定事件
   * @param comfirm 确定回调
   * @param cancel 取消回调
   * @param shadeClose 是否开启点击关闭遮罩
   */
  var bindEvent = function(comfirm, cancel, shadeClose) {
    comfirmBtn && comfirmBtn.addEventListener('click', function() {
      hide();
      comfirm && comfirm();
    }, false)

    cancelBtn && cancelBtn.addEventListener('click', function() {
      hide();
      cancel && cancel();
    }, false)

    // 是否开启点击关闭遮罩
    if (shadeClose) {
      element.addEventListener('click', function(event) {
        var event = window.event || event;
        var target = event.target || event.srcElement;

        if (target.className.indexOf('dialog-wrapper') > -1) {
          hide();
        }
      }, false)
    }
  }

  /**
   * @method 隐藏dialog 
   */
  var hide = function() {
    var timer = setTimeout(function() {
      element.style.display = 'none';
      clearTimeout(timer);
    });
    dialog.className.replace(/slideDown/g, 'slideUp');
    element.className = element.className.replace(/fadeIn/g, 'fadeOut');
  }

  /**
   * @method 显示dialog
   */
  var show = function() {
    element.style.display = 'flex';
    element.className.indexOf('fadeOut') > -1 ? element.className = element.className.replace(/fadeOut/g, 'fadeIn') : element.classList.add('fadeIn');
    dialog.className.indexOf('slideUp') > -1 ? dialog.className.replace(/slideUp/g, 'slideDown') : dialog.classList.add('slideDown');
  }

  /**
   * @method replaceContent 替换dialog内容
   * @param {HTML} html 自定义内容
   */
  var replaceContent = function(html) {
    var content = document.querySelector('.dialog-content');

    if (!content) {
      console.log('请先初始化dialog组件');
      return false;
    }

    content.innerHTML = html;
  }

  return {
    init,
    show,
    hide,
    replaceContent
  }

})();
