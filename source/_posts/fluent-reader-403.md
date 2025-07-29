---
title: 如何解決 Fluent Reader 新增 FeedBurner RSS 時遇到 403 錯誤的問題?
date: 2025-07-28 23:34:34
category: '資訊'
tag: [Fluent Reader, Cloudflare Workers]
excerpt: '用 Cloudflare Workers 解決用 Fluent Reader 新增 FeedBurner RSS 時遇到 403 錯誤的問題'
---
## 前言
最近看到 [編程隨想的博客](https://program-think.blogspot.com/)，想要用 Fluent Reader 訂閱他的 RSS，{% spoiler style:blur 當然他不會再更新了QQ 只是無聊訂閱看看 %}

新增時卻出現 403 Error
![alt text](images/20250728/image.webp)

在測試了多個網站後發現只要是 FeedBurner 的 RSS 都會有這個問題，今天就來示範如何用 Cloudflare Workers 繞過 FeedBurner 的限制
## 部屬 Worker
先到 [Cloudflare 的 Dash](https://dash.cloudflare.com/)

選擇左邊的 計算(Workers) -> Workers 和 Pages
![alt text](images/20250728/image-1.webp)

選擇**建立**
![alt text](images/20250728/image-2.webp)

選最下面的**開始使用**
![alt text](images/20250728/image-3.webp)

為 Worker 取個名字然後點**部屬**
![alt text](images/20250728/image-4.webp)

他就部屬好了 我們點擊**編輯代碼**
![alt text](images/20250728/image-5.webp)

把下面這段程式貼上
```js
export default {
  async fetch(request, env, ctx) {
    const targetUrl = 'https://feeds2.feedburner.com/programthink'
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    })
    return new Response(await response.text(), {
      headers: { 'Content-Type': 'application/xml' },
    })
  },
}
```
{% contentblock 提示 type:tip %}
可以把第三行 targetUrl 換成你要訂閱的 FeedBurner RSS 網址
{% endcontentblock %}

然後點擊**部屬**
![alt text](images/20250728/image-6.webp)

點擊重整按鈕後就能看到 RSS 內容了，這串 Workers 的網址就是我們要訂閱的網址
透過 Cloudflare Workers 轉發請求來繞過 FeedBurner 對 User-Agent 的檢查
![alt text](images/20250728/image-7.webp)

我們回到 Fluent Reader 用這串網址新增 RSS 訂閱就能成功訂閱 FeedBurner 的 RSS 了
![alt text](images/20250728/image-8.webp)
![alt text](images/20250728/image-9.webp)