---
title: Strike Finance 是什麼?如何做為 Liquidity providers 獲取收益
date: 2025-11-01 21:11:14
tags: [Cardano]
category: '幣圈'
description: 詳細介紹 Cardano 上的去中心化永續合約交易所 Strike Finance,以及如何成為流動性提供者(LP)賺取收益,包含完整操作教學、風險分析和實用工具推薦
---
## Strike Finance 是什麼
Strike Finance 是一個在 Cardano 上的去中心化永續合約交易所(Perp DEX)，類似 Hyperliquid，但和 Hyperliquid 的訂單簿機制不同(但 Strike v2 會有訂單簿機制)，Strike 是採用 AMM 機制，當交易者開倉時，系統會用流動性池（LP Pool）的資金做為交易者的對手盤，盈虧由整個池子承擔，並且交易者開設倉位會有每小時借貸費用，類似其他交易所的 Funding rate，以平衡多空倉比例。

## Liquidity providers 是什麼
Strike 上的 Liquidity providers 是平台流動性池的提供者，將資金（如 ADA、SNEK 等）存入平台的保證金池，該池作為所有倉位的對手資金來源，並且從每小時借貸費用或交易者的止損和清算獲利，相反的，當交易者賺錢時 LP Pool 也會相對虧損

## 提供流動性
{% contentblock 免責聲明 type:warning %}
所有 DeFi 項目都有風險，請自行評估後再進行操作
{% endcontentblock %}

首先，你需要有一個 Cardano 的錢包(例如 Eternl、Vesper)，並且將你的資產放在裡面，如果你是持有 ADA 以外的幣種，錢包必須有一點 ADA 作為 Gas Fee(可以放大約 10 ADA)

到 Strike 的[官網](https://app.strikefinance.org/)

選擇右上角的 **Connect Wallet**
![alt text](images/20251101/image.webp)

然後選擇你的錢包
![alt text](images/20251101/image-1.webp)

第一次連結網站會出現彈窗，點擊 **Grant access**(以 Eternl 為例)
![alt text](images/20251101/image-2.webp)

連接後到左上方的 **LIQUIDITY** 介面

右側可以選擇你要放入流動池賺取收益的幣種
![alt text](images/20251101/image-3.webp)

然後填入數量，以 ADA 來說最少要 5,000 ADA，SNEK 則是最少 10 萬顆(*以官方界面顯示為準)
填入後選擇 **Provide Liquidity**，他會跳出簽署交易的彈窗
![alt text](images/20251101/image-4.webp)

等待幾分鐘，刷新畫面後就會顯示你已經提供了流動性，並且獲得他的 LP 代幣
![alt text](images/20251101/image-5.webp)

回到錢包也能看到你獲得了 LP 代幣
![alt text](images/20251101/image-6.webp)

LP 代幣的價值是浮動的，當流動性池賺錢時，LP 代幣就會變的更有價值

左邊可以看到不同幣種的收益，可以選不同時間跨度
![alt text](images/20251101/imagee.webp)

## 撤出流動性
當你想要把錢從流動性池撤出時，只要到 **LIQUIDITY** 介面選擇 **Withdraw**
![alt text](images/20251101/image-7.webp)

輸入你要兌換的 LP 代幣數量然後選擇 **Withdraw Liquidity**，他會跳出彈窗讓你簽名轉帳 LP 代幣，然後按照當前 LP 代幣兌換率兌換回資產
![alt text](images/20251101/image-10.webp)

等待幾分鐘原始資產就會轉到你的錢包(下圖以我之前 Withdraw 為例)
![alt text](images/20251101/image-8.webp)
![alt text](images/20251101/image-9.webp)

## 風險
Strike 主要風險來自交易者營利，如果交易者大幅營利，LP Pool 就會承擔大量損失，所以提供流動性屬於高風險操作，長期統計上 LP 多數時候盈利，但短期 LP 代幣可能有較大波動，需要自行評估

例如在 2025/7/11 日 Strike就曾單日承受 60 萬美金的損失
![alt text](images/20251101/image-13.webp)
據創始人 Shan 所說是因為當天 Strike 上 ADA 有大量的作多倉位，加上 ADA 大幅上漲，交易者倉位大賺導致 LP Pool 承擔損失
![alt text](images/20251101/image-14.webp)

## bending\.ai 實用小工具
[bending.ai](https://bending.ai) 是一個 Cardano 鏈上數據的小工具，我們可以透過它來查看 Strike 上的倉位和 LP Pool 情況

我們連結錢包後就能在左側 **Strike Leaderboard** 的頁面查看各幣種在 Strike 上的倉位現況
![alt text](images/20251101/image-11.webp)
![alt text](images/20251101/image-12.webp)

## 資料來源
[Strike Finance 官方文檔](https://docs.strikefinance.org)
[Strike 中文社區](t.me/Strike_CN)
[加密說書人📖](https://www.youtube.com/watch?v=0ERCXxubvf8)