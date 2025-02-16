---
title: 利用MicroPython在Pi Pico W部屬簡單靜態網站
date: 2025-02-17 00:26:58
tags: '資訊'
---
今天嘗試了使用MicroPython在Pi Pico W部屬靜態網站
![alt text](images/20250217/image.png)
![alt text](images/20250217/image2.png)

詳細部屬過程可以參閱我的 [Github專案](https://github.com/imyimang/PiPicoW-WebServer)
這塊開發版是好幾個月前買的，之前是拿來玩 [HID攻擊](https://github.com/imyimang/HID-Script)
看到別人用其他開發版部屬Docker就想拿出來玩玩
但Pi Pico W的配置實在太低(133 MHz CPU/264KB RAM)
只好用他的WIFI模組架一個簡單的Web Server

中間內網穿透搞了超久，結果發現是我自己response格式寫錯導致cloudflared tunnel會502 error