// 客戶端動態顏色提取
function extractImageColors(callback) {
  // 創建 canvas 來分析圖片
  function getImageData(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 縮小圖片尺寸以提高效能
    const maxSize = 100;
    const ratio = Math.min(maxSize / img.width, maxSize / img.height);
    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  // 計算主要顏色 - 改進版算法
  function getDominantColor(imageData) {
    const data = imageData.data;
    const colorMap = new Map();
    const step = 4; // 每個像素4個值 (r,g,b,a)
    
    // 分析每個像素
    for (let i = 0; i < data.length; i += step) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];
      
      // 忽略透明和太接近白色/黑色的像素
      if (alpha < 128) continue;
      if (r > 240 && g > 240 && b > 240) continue; // 忽略白色
      if (r < 15 && g < 15 && b < 15) continue;   // 忽略黑色
      
      // 將顏色量化以減少變化
      const qR = Math.round(r / 17) * 17;
      const qG = Math.round(g / 17) * 17;
      const qB = Math.round(b / 17) * 17;
      
      const colorKey = `${qR},${qG},${qB}`;
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }
    
    // 找出最常出現的顏色
    let maxCount = 0;
    let dominantColor = null;
    
    for (const [color, count] of colorMap) {
      if (count > maxCount) {
        maxCount = count;
        dominantColor = color.split(',').map(Number);
      }
    }
    
    if (dominantColor && maxCount > 50) { // 確保有足夠的像素支持
      // 調整顏色飽和度和亮度，使其更適合作為主題色
      let [r, g, b] = dominantColor;
      
      // 增加飽和度
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      
      if (delta > 0) {
        const factor = 1.2; // 增加飽和度
        const avg = (r + g + b) / 3;
        r = Math.min(255, Math.round(avg + (r - avg) * factor));
        g = Math.min(255, Math.round(avg + (g - avg) * factor));
        b = Math.min(255, Math.round(avg + (b - avg) * factor));
      }
      
      // 確保顏色不會太暗
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      if (brightness < 60) {
        const boost = 60 / brightness;
        r = Math.min(255, Math.round(r * boost));
        g = Math.min(255, Math.round(g * boost));
        b = Math.min(255, Math.round(b * boost));
      }
      
      // 轉換為十六進位
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    return '#5865F2'; // 預設顏色
  }

  // 尋找頁面中的圖片
  function findPageImage() {
    // 優先尋找封面圖片或第一張內容圖片
    const contentImages = document.querySelectorAll('.post-content img, article img');
    return contentImages.length > 0 ? contentImages[0] : null;
  }

  const img = findPageImage();
  if (!img) {
    callback('#5865F2');
    return;
  }

  // 確保圖片已載入
  if (img.complete && img.naturalHeight !== 0) {
    try {
      const imageData = getImageData(img);
      const color = getDominantColor(imageData);
      callback(color);
    } catch (error) {
      console.warn('Failed to extract color:', error);
      callback('#5865F2');
    }
  } else {
    img.onload = function() {
      try {
        const imageData = getImageData(img);
        const color = getDominantColor(imageData);
        callback(color);
      } catch (error) {
        console.warn('Failed to extract color:', error);
        callback('#5865F2');
      }
    };
    
    img.onerror = function() {
      callback('#5865F2');
    };
  }
}

// 更新 meta 標籤
function updateThemeColor(color) {
  let themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) {
    themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    document.head.appendChild(themeColorMeta);
  }
  themeColorMeta.content = color;
  
  console.log('Theme color updated to:', color);
}

// 當頁面載入時執行
document.addEventListener('DOMContentLoaded', function() {
  // 檢查是否已經有手動設定的 theme color
  const existingThemeColor = document.querySelector('meta[name="theme-color"]');
  const hasManualColor = existingThemeColor && existingThemeColor.dataset.manual === 'true';
  
  if (!hasManualColor) {
    extractImageColors(updateThemeColor);
  }
});
