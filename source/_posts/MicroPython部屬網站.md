---
title: 利用MicroPython在Pi Pico W部屬簡單靜態網站
date: 2025-02-17 00:26:58
tags: '資訊'
---

![alt text](images/20250217/imagee.webp)
## 環境安裝

### MicroPython
先至 [MicroPython](https://micropython.org/download/RPI_PICO_W/) 的網站下載固件

按住板子上的Boot按鈕然後將USB插入電腦

將固件放入板子的硬碟中

### Thonny
至 [Thonny官網](https://thonny.org/) 下載並安裝 Thonny

將右下角的解釋器更改為板子的

![alt text](images/20250217/1.webp)

## 部屬Web Server
到我的 [Github](https://github.com/imyimang/PiPicoW-WebServer) 下載專案
選擇左上角檔案 >> 開啟舊檔 >> 選擇專案的main.py

填入wifi名稱和密碼

點擊上方的運行

現在網站應該成功部屬在內網了

![alt text](images/20250217/image2.webp)

將網址輸入瀏覽器就能查看

![alt text](images/20250217/image.webp)

> [!NOTE]  
> HTML的內容都能自行更改

## 內網穿透
我們可以使用 Cloudflared Tunnel 來構建免費的內網穿透

在 CMD 輸入 `winget install --id Cloudflare.cloudflared` 來下載 Cloudflared

下載後在 CMD 輸入 `cloudflared tunnel --url http://你的內網ip:80`

他就會給你一個臨時的網址能夠訪問內網服務

![alt text](images/20250217/image3.webp)

這樣我們就能在外網看到我們的網站了

![alt text](images/20250217/image4.webp)

更多應用可以至 Github 專案查看