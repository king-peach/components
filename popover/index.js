/**
 * @method Popover 弹框组件
 */
var popover = (function () {
  // 组件需要获得元素
  var element, comfirmBtn, cancelBtn;

  /**
   * @method getNeedElement 获取必要元素
   */
  var getNeedElement = function () {
    element = document.querySelector('#popover');
    comfirmBtn = element.querySelector('.comfirm-btn');
    cancelBtn = element.querySelector('.cancel-btn');
  };

  /**
   * @method show 组件展示方法
   * @param {Object} options 组件展示参数
   */
  var show = function (options) {
    var {
      labelElement = 'body',
      customeClassName = '',
      title = '标题',
      template = '内容',
      comfirmCallback = null,
      cancelCallback = null,
      blurClose = true,
      position = 'bottom',
      footerBtns = ['确定', '取消'],
      zIndex = '99999'
    } = options;

    if (document.querySelector('#popover')) return false;

    // footer模板处理
    var footerTemplate = '';
    if (footerBtns && Object.prototype.toString.call(footerBtns) === '[object Array]') {
      if (footerBtns.length > 0) {
        var temp = '';

        for (var i = 0, len = footerBtns.length; i < len; i++) {
          if (footerBtns[i] === '确定') {
            temp += '<div class="comfirm-btn">确定</div>';
          } else if (footerBtns[i] === '取消') {
            temp += '<div class="cancel-btn">取消</div>';
          };
        };

        // footer中存在按钮
        if (temp.length > 0) {
          footerTemplate = '<div class="footer">' + temp + '</div>'
        };
      }
    };

    // node模板渲染
    var html = '<div class="popover-arrow"></div>' +
               '<div class="popover-wrapper">' +
                '<div class="title">' + title + '</div>' +
                '<div class="slot-scope">' + template + '</div>' +
                  footerTemplate +
               '</div>';

    var node = document.createElement('div');
    node.id = 'popover';
    node.className = customeClassName;
    node.innerHTML = html;

    document.body.appendChild(node);

    var labelNode = document.querySelector(labelElement);

    if (position === 'bottom') {
      node.querySelector('.popover-arrow').classList.add('top')
      var labelNodeLeft = labelNode.offsetLeft + labelNode.offsetWidth;
      var left = labelNodeLeft - (node.offsetWidth / 2);
      var top = labelNode.offsetTop + labelNode.offsetHeight + 10;
      node.style.cssText = 'top: ' + top + 'px; left: ' + (left > 0 ? left : 0) + 'px; z-index:' + zIndex + ';';
    } else if (position === 'top') {
      node.querySelector('.popover-arrow').classList.add('bottom');
      var labelNodeLeft = labelNode.offsetLeft + labelNode.offsetWidth;
      var left = labelNodeLeft - (node.offsetWidth / 2);
      var top = labelNode.offsetTop - node.offsetHeight - 10;
      node.style.cssText = 'top: ' + top + 'px; left: ' + (left > 0 ? left : 0) + 'px; z-index:' + zIndex + ';';
    }

    getNeedElement();

    bindEvent(comfirmCallback, cancelCallback, blurClose, labelNode);
  };

  /**
   * @method bindEvent 绑定事件
   * @param {Callback} comfirm 确认回调函数
   * @param {Callback} cancel 取消回调函数
   * @param {Callback} blurClose 失去焦点时是否关闭组件
   */
  var bindEvent = function (comfirm, cancel, blurClose, labelNode) {
    // 确定按钮处理逻辑
    comfirmBtn && comfirmBtn.addEventListener('click', function () {
      comfirm && comfirm();
    }, false)

    // 取消按钮处理逻辑
    cancelBtn && cancelBtn.addEventListener('click', function () {
      hide();
      cancel && cancel();
    }, false)

    // 组件失去焦点时是否关闭组件
    if (blurClose) {
      setTimeout(function() {
        var handleClose = function(e) {
          var event = e || window.event;
  
          var rect = element.getBoundingClientRect();
          var landscapeRect = [rect.left, rect.right];
          var verticalRect = [rect.y, rect.y + rect.height];
  
          if (event.clientX < landscapeRect[0] || event.clientX > landscapeRect[1] || event.clientY < verticalRect[0] || event.clientY > verticalRect[1]) {
            hide();
            cancel && cancel();
            document.removeEventListener('click', handleClose);
          }
        };
        document.addEventListener('click', handleClose, false);
      }, 100);
    }
  }

  /**
   * @method hide 组件关闭函数
   */
  var hide = function () {
    element.remove();
  }

  return {
    show,
    hide
  }
})();