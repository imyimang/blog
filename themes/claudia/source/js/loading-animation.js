// Netflix 風格載入動畫控制
document.addEventListener('DOMContentLoaded', function() {
    // 檢查主題配置（這個值會在模板中注入）
    const loadingConfig = window.loadingAnimationConfig || { enable: false };
    
    // 檢查全域是否啟用載入動畫
    if (!loadingConfig.enable) return;
    
    // 偵測當前網域並選擇對應的設定
    const domainConfig = detectDomainAndGetConfig(loadingConfig);
    
    // 檢查當前網域是否啟用載入動畫
    if (!domainConfig.domainEnabled) {
        console.log(`Loading animation disabled for ${domainConfig.networkType} network`);
        return;
    }
    
    // 檢查是否已經顯示過載入動畫（避免重複播放）
    const hasShownLoading = domainConfig.skipOnReturn ? sessionStorage.getItem('hasShownLoading') : null;
    
    if (!hasShownLoading) {
        createLoadingScreen(domainConfig);
        if (domainConfig.skipOnReturn) {
            sessionStorage.setItem('hasShownLoading', 'true');
        }
    }
});

// 偵測網域並返回對應的配置
function detectDomainAndGetConfig(baseConfig) {
    const hostname = window.location.hostname.toLowerCase();
    const fullUrl = window.location.href.toLowerCase();
    let config = {};
    let networkType = 'regular';
    let domainEnabled = false;
    
    // 詳細的網域類型偵測
    if (hostname.endsWith('.onion') || fullUrl.includes('.onion')) {
        // Tor 網域偵測
        networkType = 'tor';
        domainEnabled = baseConfig.onion && baseConfig.onion.enable;
        config = {
            ...baseConfig,
            blogName: baseConfig.onion.blogName || baseConfig.onion.blog_name || 'TOR YIMANG',
            textColor: baseConfig.onion.textColor || baseConfig.onion.text_color || '#7d4698',
            icon: baseConfig.onion.icon || { enable: true, image: 'images/tor.webp', animate: true }
        };
        
        console.log('Tor network detected:', hostname, 'Animation enabled:', domainEnabled);
        
    } else if (hostname.endsWith('.i2p') || fullUrl.includes('.i2p')) {
        // I2P 網域偵測
        networkType = 'i2p';
        domainEnabled = baseConfig.i2p && baseConfig.i2p.enable;
        config = {
            ...baseConfig,
            blogName: baseConfig.i2p.blogName || baseConfig.i2p.blog_name || 'I2P YIMANG',
            textColor: baseConfig.i2p.textColor || baseConfig.i2p.text_color || '#0066cc',
            icon: baseConfig.i2p.icon || { enable: true, image: 'images/i2p.webp', animate: true }
        };
        
        console.log('I2P network detected:', hostname, 'Animation enabled:', domainEnabled);
        
    } else {
        // 所有其他網域（yimang.tw, localhost, vercel.app, 等等）
        networkType = 'regular';
        domainEnabled = baseConfig.default && baseConfig.default.enable;
        config = {
            ...baseConfig,
            blogName: baseConfig.default.blogName || baseConfig.default.blog_name || 'YIMANG',
            textColor: baseConfig.default.textColor || baseConfig.default.text_color || '#e50914',
            icon: baseConfig.default.icon || { enable: true, image: 'images/avatar.webp', animate: true }
        };
        
        console.log('Regular network detected:', hostname, 'Animation enabled:', domainEnabled);
    }
    
    // 添加網路類型和啟用狀態到配置中
    config.networkType = networkType;
    config.domainEnabled = domainEnabled;
    
    // 在控制台顯示完整配置信息（僅在開發模式）
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        console.log('Loading animation config:', config);
    }
    
    return config;
}

function createLoadingScreen(config) {
    // 創建載入畫面元素
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.id = 'loadingScreen';
    
    // 使用配置中的博客名稱
    const blogName = config.blogName || document.title.split(' - ')[0] || 'YIMANG';
    
    // 創建網路類型提示（可選）
    const networkHintHTML = createNetworkHintHTML(config.networkType);
    
    // 創建主容器
    const containerHTML = `
        <div class="loading-container">
            ${createIconHTML(config.icon)}
            ${createLogoHTML(blogName.toUpperCase())}
        </div>
    `;
    
    // 創建進度條
    const progressHTML = `
        <div class="loading-progress">
            <div class="loading-progress-bar"></div>
        </div>
    `;
    
    // 創建粒子效果
    const particlesHTML = `
        <div class="loading-particles">
            ${Array.from({length: 9}, (_, i) => `<div class="particle"></div>`).join('')}
        </div>
    `;
    
    // 組合所有元素
    loadingScreen.innerHTML = networkHintHTML + containerHTML + progressHTML + particlesHTML;
    
    // 添加到頁面
    document.body.appendChild(loadingScreen);
    
    // 應用自定義顏色
    applyCustomColors(config.textColor || '#e50914');
    
    // 隱藏主要內容
    document.body.style.overflow = 'hidden';
    
    // 設置動畫結束後的處理
    setTimeout(() => {
        hideLoadingScreen();
    }, config.duration || 4000);
    
    // 監聽頁面加載完成
    window.addEventListener('load', () => {
        // 如果頁面加載完成且動畫還在播放，確保至少播放 3 秒
        setTimeout(() => {
            if (document.getElementById('loadingScreen')) {
                hideLoadingScreen();
            }
        }, Math.min(3000, config.duration * 0.75));
    });
}

function createNetworkHintHTML(networkType) {
    // 不顯示任何網路提示，只顯示用戶配置的內容
    return '';
}

function createIconHTML(iconConfig) {
    if (!iconConfig || !iconConfig.enable || !iconConfig.image) {
        return '';
    }
    
    const animateClass = iconConfig.animate ? 'animate' : '';
    return `<img src="${iconConfig.image}" alt="Loading Icon" class="loading-icon ${animateClass}">`;
}

function createLogoHTML(blogName) {
    const letters = blogName.split('').map(letter => {
        // 如果是空格，保持空格但不包裝在 span 中
        if (letter === ' ') {
            return ' ';
        }
        return `<span class="letter">${letter}</span>`;
    }).join('');
    
    return `<div class="loading-logo">${letters}</div>`;
}

function applyCustomColors(color) {
    // 創建動態樣式
    const style = document.createElement('style');
    style.id = 'loading-custom-colors';
    style.innerHTML = `
        .loading-logo {
            color: ${color} !important;
        }
        
        .loading-logo::after {
            color: ${color} !important;
        }
        
        .loading-progress-bar {
            background: linear-gradient(90deg, ${color}, ${color}) !important;
        }
        
        .particle {
            background: ${color} !important;
        }
        
        .loading-icon {
            border-color: ${color} !important;
        }
        
        @keyframes glow {
            from {
                text-shadow: 
                    0 0 5px ${color},
                    0 0 10px ${color},
                    0 0 15px ${color};
            }
            to {
                text-shadow: 
                    0 0 10px ${color},
                    0 0 20px ${color},
                    0 0 30px ${color},
                    0 0 40px ${color};
            }
        }
    `;
    
    document.head.appendChild(style);
}



function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hide');
        
        // 恢復主要內容
        document.body.style.overflow = '';
        
        // 完全移除元素和動態樣式
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
            
            // 移除動態樣式
            const customColorStyle = document.getElementById('loading-custom-colors');
            if (customColorStyle && customColorStyle.parentNode) {
                customColorStyle.parentNode.removeChild(customColorStyle);
            }
        }, 800);
    }
}

// 添加一些額外的控制功能
document.addEventListener('keydown', function(e) {
    // 按 ESC 鍵可以跳過動畫
    if (e.key === 'Escape') {
        hideLoadingScreen();
    }
});

// 點擊載入畫面也可以跳過
document.addEventListener('click', function(e) {
    if (e.target.closest('#loadingScreen')) {
        hideLoadingScreen();
    }
});

// 防止在載入動畫期間滾動
function preventScroll(e) {
    if (document.getElementById('loadingScreen')) {
        e.preventDefault();
    }
}

document.addEventListener('wheel', preventScroll, { passive: false });
document.addEventListener('touchmove', preventScroll, { passive: false });