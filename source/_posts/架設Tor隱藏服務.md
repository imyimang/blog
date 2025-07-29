---
title: 架設 Tor 隱藏服務
date: 2025-06-03 22:48:18
tags: 'Tor'
category: '資訊'
excerpt: '在洋蔥網路裡建立自己的 Hidden service'
cover: images/20250603/image-2.webp
---

## 安裝環境
以 Debian / Ubuntu 為例
先安裝 Tor
```bash
sudo apt update
sudo apt install tor
```

## 部屬靜態網站
如果你的主機還沒有部屬服務，可以參考以下方法部屬一個靜態網站，如果已經有部屬服務可以跳過
建立一個資料夾
創建一個最簡單的`index.html`
```html
<html>
<h1>
Hello World!
</h1>
</html>
```
輸入
```bash
nohup python3 -m http.server 8080 > server.log 2>&1 &
```
這樣你就有一個最簡單的靜態網頁部屬在 http://127.0.0.1:8080 了
![alt text](images/20250603/image.webp)

## 部屬 Tor 隱藏服務
編輯設定檔
```bash
sudo vim /etc/tor/torrc
```

加入這兩行
```bash
HiddenServiceDir /var/lib/tor/hidden_service/
HiddenServicePort 80 127.0.0.1:8080
```
127.0.0.1:8080是你內網的服務的端口


重啟 Tor
```bash
sudo systemctl restart tor
```

顯示你的.onion網址
```bash
sudo cat /var/lib/tor/hidden_service/hostname
```
出現的一串亂碼.onion就是你的 Tor 服務網址了

**注意**如果你是用 vite 或 nginx 之類的部屬，要設定 **server_name** 或 **allowedHosts** 為你的 Tor 服務網域
否則會無法連線
舉例:

```js
//Vite
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    allowedHosts: ['your domain.onion'],
  },
});
```

```nginx
#nginx
server {
    listen 80;
    server_name your domain.onion;

    location / {
        proxy_pass http://127.0.0.1:5173;
        # 其他 proxy 設定
    }
}
```

## 部屬多個 Tor 隱藏服務
你也可以在一台主機上部屬多個 Tor 隱藏服務

編輯 Tor 設定檔案
```bash
sudo vim /etc/tor/torrc
```
可以像下面這樣寫
```bash
# 第一個 .onion 網站（假設是本地服務在 127.0.0.1:5173）
HiddenServiceDir /var/lib/tor/hidden_service1/
HiddenServicePort 80 127.0.0.1:5173

# 第二個 .onion 網站（假設是另一個在 127.0.0.1:8080）
HiddenServiceDir /var/lib/tor/hidden_service2/
HiddenServicePort 80 127.0.0.1:8080
```
如果要查看服務的網址
```bash
sudo cat /var/lib/tor/hidden_service1/hostname
sudo cat /var/lib/tor/hidden_service2/hostname
```

## 訪問 Tor 隱藏服務
下載 [Tor Browser](https://www.torproject.org/download/)
選擇連接到 Tor 網路
![alt text](images/20250603/image-1.webp)
連上之後輸入剛剛的.onion網址就可以訪問了
![alt text](images/20250603/image-2.webp)