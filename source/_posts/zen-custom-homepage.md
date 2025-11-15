---
title: 如何在 Zen 瀏覽器中設定自訂首頁
date: 2025-11-16 00:03:04
tags: [Zen-Browser]
category: '技術'
cover: images/20251116/image-7.webp
description: 教你如何在 Zen Browser 中啟用首頁設定，並將新分頁從懸浮搜尋框改為傳統的獨立頁面
---
平常我們在使用 Zen Browser 的時候，點擊新增分頁出來的都是像這樣的懸浮搜尋框
![alt text](images/20251116/image-1.webp)
那我們該如何把他設定成像 Chrome 那樣有獨立 New Tab 頁面並且開啟首頁功能呢

在目前的版本(v1.17.6b)，預設是沒有 Homepage 設定的
我們要要在網址欄輸入 `about:config`，選擇接受風險並繼續
![alt text](images/20251116/image-2.webp)

搜尋 `zen.urlbar.replace-newtab` 這個設定，把他從 true 改成 **false**
![alt text](images/20251116/image-3.webp)

回到設定(`about:preferences`)，你可以看到左邊出現首頁的設定選項了
![alt text](images/20251116/image-4.webp)

我們進入首頁設定，把首頁和新分頁改成自定義網址
![alt text](images/20251116/image-5.webp)

你可以設定你要的首頁，比如說 google.com，或是你自己有架首頁
![alt text](images/20251116/image-6.webp)

現在點擊左上角的首頁按鈕就會導向你設定的網站了，重新啟動瀏覽器也會導向首頁
![alt text](images/20251116/image-7.webp)

並且 New Tab 也會是獨立頁面而不是之前的懸浮搜尋框
![alt text](images/20251116/image-8.webp)