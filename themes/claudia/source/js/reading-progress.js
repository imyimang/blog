/**
 * Reading Progress Bar
 * 閱讀進度條功能
 */
(function() {
  'use strict';

  // 檢查是否啟用閱讀進度條
  const config = window.readingProgressConfig || {};
  if (!config.enable) {
    return;
  }

  // 創建進度條元素
  function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', '閱讀進度');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.setAttribute('aria-valuenow', '0');
    
    // 應用自定義樣式
    if (config.height) {
      progressBar.style.height = config.height;
    }
    if (config.color) {
      progressBar.style.background = config.color;
    }
    if (config.position === 'bottom') {
      progressBar.style.top = 'auto';
      progressBar.style.bottom = '0';
    }
    
    document.body.appendChild(progressBar);
    return progressBar;
  }

  // 計算閱讀進度
  function calculateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 計算可滾動的總高度
    const scrollableHeight = documentHeight - windowHeight;
    
    if (scrollableHeight <= 0) {
      return 0;
    }
    
    // 計算百分比
    const progress = (scrollTop / scrollableHeight) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  // 更新進度條
  function updateProgressBar(progressBar) {
    const progress = calculateProgress();
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(progress));
    
    // 添加動畫類
    if (config.smooth !== false) {
      progressBar.classList.add('animating');
    }
  }

  // 節流函數
  function throttle(func, wait) {
    let timeout;
    let lastRan;
    
    return function executedFunction() {
      const context = this;
      const args = arguments;
      
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          if ((Date.now() - lastRan) >= wait) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, wait - (Date.now() - lastRan));
      }
    };
  }

  // 初始化
  function init() {
    // 確保在文章頁面
    const isPostPage = document.querySelector('.post-page, .post-content, article.post');
    if (!isPostPage && config.postOnly !== false) {
      return;
    }

    // 等待 DOM 完全載入
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    const progressBar = createProgressBar();
    
    // 初始更新
    updateProgressBar(progressBar);
    
    // 監聽滾動事件（使用節流優化性能）
    const throttledUpdate = throttle(function() {
      updateProgressBar(progressBar);
    }, 50);
    
    window.addEventListener('scroll', throttledUpdate, { passive: true });
    
    // 監聽視窗大小改變
    window.addEventListener('resize', throttledUpdate, { passive: true });
    
    // 監聽頁面載入完成（圖片等資源載入完成後重新計算）
    window.addEventListener('load', function() {
      updateProgressBar(progressBar);
    });

    // 監聽圖片載入（動態調整進度）
    if (config.adjustOnImageLoad !== false) {
      const images = document.querySelectorAll('img');
      images.forEach(function(img) {
        if (!img.complete) {
          img.addEventListener('load', function() {
            updateProgressBar(progressBar);
          });
        }
      });
    }
  }

  // 啟動
  init();
})();
