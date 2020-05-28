/**
 * @method 分页器组件
 */

 var pagination = (function() {

  var sizesModel, firstPageNode, pagerWrapper, _total, _pageSize, _layout, prevNode, lastPageNode, nextNode, jumperNode;

  /**
   * @method 组件初始化
   * @param {Object} options 初始化参数 
   */
  var init = function(options) {

    // 默认参数
    /** @callback sizeChange size改变回调 */
    /** @callback gotoFirst 跳转到首页回调 */
    /** @callback handlePagerJumper 页码跳转回调 */
    /** @callback handlePrevJumper 跳转到上一页回调 */
    /** @callback handleNextJumper 跳转到下一页回调 */
    /** @callback gotoLast 跳转到首页回调 */
    /** @callback handleCustomJumper 跳转到指定页回调 */
    var {
      total = 0,
      sizes = [5, 10, 20, 30, 40, 50, 100],
      pageSize = 10,
      currentPage = 1,
      sizeChange = null,
      gotoFirst = null,
      handlePagerJumper = null,
      handlePrevJumper = null,
      handleNextJumper = null,
      gotoLast = null,
      handleCustomJumper = null,
      layout = 'total, sizes, first, prev, pager, next, last, pages, jumper'
    } = options;

    _total = total;
    _pageSize = pageSize;
    _layout = layout;

    /**
     * @method 初始化组件模板
     */
    var initModel = function() {
      var node = document.createElement('div');
      node.className = 'pagination-wrapper';

      // 左侧总计和选择pages节点
      var pageSizeNode = document.createElement('div');
      pageSizeNode.className = 'page-sizes';

      if (/total/.test(layout)) {
        var totalHtml = '<span class="total-wrapper">总共<span class="total">' + total + '</span>条</span>, ';
        pageSizeNode.innerHTML += totalHtml;
      }

      if (/sizes/.test(layout)) {
        var options = '';
        for (var i = 0, len = sizes.length; i < len; i++) {
          if (pageSize === sizes[i]) {
            options += '<option value="' + sizes[i] + '" selected>' + sizes[i] + '</option>';
          } else {
            options += '<option value="' + sizes[i] + '">' + sizes[i] + '</option>';
          }
        }
        var sizesHtml = '<span class="sizes-wrapper">每页显示&nbsp;&nbsp;<select name="sizes" id="sizes-selector" value="' + pageSize + '">' + options + '</select>';
        pageSizeNode.innerHTML += sizesHtml;
      }

      // 右侧pagination节点
      var paginationNode = document.createElement('div');
      paginationNode.className = 'pagination';

      if (/first/.test(layout)) {
        paginationNode.innerHTML += '<div class="first-page">首页</div>';
      }

      if (/prev/.test(layout)) {
        paginationNode.innerHTML += '<div class="prev">上一页</div>';
      }

      if (/pager/.test(layout)) {
        var pages = total % pageSize > 0 ? parseInt(total / pageSize) + 1 : parseInt(total / pageSize);
        var lists = '';
        var len = pages > 7 ? 8 : pages + 1;
        for (var i = 1; i < len; i++) {
          if (i < 8) {
            var active =  i === currentPage ? 'yes' : 'no';
            if (pages > 7 && i === 7) {
              lists += '<li class="page" active="' + active + '" isClick="no">...</li>';
            } else {
              lists += '<li class="page" active="' + active + '" isClick="yes">' + i + '</li>';
            }
          }
        }

        var pagesNode = '<ul class="pages">' + lists + '</ul>';
        paginationNode.innerHTML += pagesNode;
      }

      if (/next/.test(layout)) {
        paginationNode.innerHTML += '<div class="next">下一页</div>';
      }

      if (/last/.test(layout)) {
        paginationNode.innerHTML += '<div class="last-page">末页</div>';
      }

      if (/jumper/.test(layout)) {
        paginationNode.innerHTML += '&nbsp;&nbsp;<input type="number" value="' + currentPage + '" id="jumper">&nbsp;&nbsp;<div class="jumper">确定</div>';
      }

      node.appendChild(pageSizeNode);
      node.appendChild(paginationNode);

      document.body.appendChild(node);

      return node;
    };

    initModel();

    // 获取元素节点
    getNeedNode();

    // 绑定size改变事件
    bindSizeChangeEvent(sizeChange, sizesModel);
    // 绑定跳转首页事件
    bindGotoFirstEvent(firstPageNode, gotoFirst);
    // 跳转到当前页
    handleJumperPage(currentPage);
    // 绑定pager跳转事件
    bindPagerJumperEvent(pagerWrapper, handlePagerJumper);
    // 绑定跳转到上一页事件
    bindPrevJumper(prevNode, handlePrevJumper);
    // 绑定跳转到下一页事件
    bindNextJumper(nextNode, handleNextJumper);
    // 绑定跳转末页事件
    bindGotoLastEvent(lastPageNode, gotoLast);
    // 绑定跳转到指定页事件
    bindCustomJumper(jumperNode, handleCustomJumper);
  };

  /**
   * @method bindPagerJumperEvent pager绑定事件
   * @param {Element} node 绑定事件节点
   * @param {Func} callback 事件回调
   */
  var bindPagerJumperEvent = function(node, callback) {
    if (node) {
      node.addEventListener('click', function(e) {
        var event = e || window.event;
        var target = event.target || event.srcElement;

        if (target.className === 'page') {
          // 若存在回调执行回调
          callback && callback(target);
          // 当前节点 attr[isclick=='yes'] 时执行跳转
          if (target.getAttribute('isClick') === 'yes') {
            handleJumperPage(target.innerHTML);
          }
        }
      }, false)
    }
  }

  /**
   * @method getNeedNode 获取所需节点
   */
  var getNeedNode = function() {
    element = document.querySelector('.pagination-wrapper');
    totalModel = document.querySelector('.total-wrapper');
    sizesModel = document.querySelector('#sizes-selector');
    firstPageNode = document.querySelector('.first-page');
    pagerWrapper = document.querySelector('.pagination .pages');
    prevNode = document.querySelector('.pagination .prev');
    nextNode = document.querySelector('.pagination .next');
    lastPageNode = document.querySelector('.last-page');
    jumperNode = document.querySelector('.pagination .jumper');
  };

  /**
   * @method bindSizeChangeEvent 改变绑定事件
   * @param {Func} sizeChange 回调函数
   * @param {Element} node 绑定节点
   */
  var bindSizeChangeEvent = function(callback, node) {
    if (node) {
      node.addEventListener('change', function(e) {
        var event = window.event || e;
        var target = event.target || event.srcElement;
        _pageSize = target.value;
        handleJumperPage(1);
        callback && callback(target);
      }, false)
    }
  };

  /**
   * @method bindCustomJumper 跳转到指定页事件
   * @param {Element} node 绑定事件节点 
   * @param {Func} callback 绑定回调
   */
  var bindCustomJumper = function(node, callback) {
    if (node) {
      node.addEventListener('click', function() {
        var page = jumperNode.previousElementSibling.value
        var pages = _total % _pageSize > 0 ? parseInt(_total / _pageSize) + 1 : parseInt(_total / _pageSize);
        if (page < 1 && page > pages) return false;
        handleJumperPage(page);
        callback && callback(page);
      }, false);
    }
  }

  /**
   * @method bindPrevJumper 绑定跳转到上一页回调
   * @param {Element} node 绑定事件节点
   * @param {Func} callback 绑定回调函数
   */
  var bindPrevJumper = function(node, callback) {
    node.addEventListener('click', function() {
      console.log(currentPage);
      if (currentPage === 1) return false;
      handleJumperPage(currentPage - 1);
      callback && callback(currentPage - 1);
    }, false);
  }

  /**
   * @method bindNextJumper 绑定跳转到下一页回调
   * @param {Element} node 绑定事件节点
   * @param {Func} callback 绑定回调函数
   */
  var bindNextJumper = function(node, callback) {
    node.addEventListener('click', function() {
      var pages = _total % _pageSize > 0 ? parseInt(_total / _pageSize) + 1 : parseInt(_total / _pageSize);
      if (currentPage === pages) return false;
      handleJumperPage(currentPage + 1);
      callback && callback(currentPage + 1);
    }, false);
  }

  /**
   * @method bindGotoFirstEvent 跳转到首页回调
   * @param {Element} node 绑定节点
   * @param {Func} callback 绑定回调
   */
  var bindGotoFirstEvent = function(node, callback) {
    if (node) {
      node.addEventListener('click', function() {
        handleJumperPage(1);
        callback && callback();
      }, false);
    }
  }

  /**
   * @method bindGotoFirstEvent 跳转到末页回调
   * @param {Element} node 绑定节点
   * @param {Func} callback 绑定回调
   */
  var bindGotoLastEvent = function(node, callback) {
    if (node) {
      node.addEventListener('click', function() {
        var pages = _total % _pageSize > 0 ? parseInt(_total / _pageSize) + 1 : parseInt(_total / _pageSize);
        handleJumperPage(pages);
        callback && callback();
      }, false);
    }
  }

  /**
   * @method handleJumperPage 跳转到相关页面逻辑
   * @param {Number || String} page 页码
   */
  var handleJumperPage = function(page) {
    if (typeof page !== 'number') page = Number(page);

    if (page < 1 || page > pages) return false;

    var pages = _total % _pageSize > 0 ? parseInt(_total / _pageSize) + 1 : parseInt(_total / _pageSize);
    var list = document.querySelectorAll('.page');

    if (pages < 8) {
      // 页码不超过7页时
      for (var i = 0; i < pages; i++) {
        list[i].setAttribute('active', 'no');
      }
      list[page + 1].setAttribute('active', 'yes');
    } else {
      // 超过7页时
      var temp = [];
      if (pages - page < 5) {
        // 当前页在页码前段时
        temp.push('...');
        for (var i = 0; i < pages + 1; i++) {
          if (i > pages - 6) {
            temp.push(i);
          }
        }
      } else if (page < 6) {
        // 当前页在页码后段时
        for (var i = 1; i < 7; i++) {
          temp.push(i);
        }
        temp.push('...');
      } else {
        // 当前页码在中间时
        temp = [1, '...', page -1, page, page + 1, '...', pages];
      }

      // 处理pager
      for (var i = 0, len = temp.length; i < len; i++) {
        list[i].innerHTML = temp[i];

        var activeVal = page === temp[i] ? 'yes' : 'no';
        list[i].setAttribute('active', activeVal);

        var isClickVal = temp[i] === '...' ? 'no' : 'yes';
        list[i].setAttribute('isClick', isClickVal);
      }
    }

    // 如果存在输入框，则赋值输入框
    if (_layout && /jumper/.test(_layout)) {
      document.querySelector('#jumper').value = page;
    }

    currentPage = page;
  }

  return {
    init
  };
 })();
