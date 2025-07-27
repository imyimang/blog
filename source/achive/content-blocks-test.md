---
title: Content Blocks 測試
date: 2025-07-27 10:00:00
tags: [測試, content-blocks]
---

# Content Blocks 插件測試

這篇文章用來測試 hexo-content-blocks 插件的功能。

## 基本 Content Block 示例

{% contentblock 注意事項 type:note %}
這是一個注意事項的內容塊。您可以在這裡放置重要的提醒訊息。
{% endcontentblock %}

{% contentblock 提示 type:tip %}
這是一個提示內容塊，用於顯示有用的小貼士。
{% endcontentblock %}

{% contentblock 警告 type:warning %}
這是一個警告內容塊，用於提醒用戶注意潛在的問題。
{% endcontentblock %}

{% contentblock 成功 type:success %}
這是一個成功內容塊，用於顯示操作成功的訊息。
{% endcontentblock %}

## 可折疊的 Content Box 示例

{% contentbox 點擊展開詳細說明 type:info %}
這是一個可以折疊和展開的內容框。默認情況下它是折疊的，用戶需要點擊標題來展開內容。

這裡可以放置詳細的說明或額外的資訊，當用戶需要時才展開查看。
{% endcontentbox %}

{% contentbox 默認展開的內容 type:example open %}
這個內容框默認是展開的，因為我們添加了 `open` 參數。

用戶仍然可以點擊標題來折疊它。
{% endcontentbox %}

## Content Cards 示例

{% contentcards 選項A 選項B 選項C type:abstract %}
這是第一個選項卡的內容。

您可以在這裡放置任何 Markdown 內容，包括：
- 列表項目
- **粗體文字**
- `程式碼`

<!--card-break-->

這是第二個選項卡的內容。

您可以放置圖片、連結或其他媒體內容。

<!--card-break-->

這是第三個選項卡的內容。

每個選項卡都是獨立的內容區域。
{% endcontentcards %}

## 更多類型示例

{% contentblock 資訊 type:info %}
這是資訊類型的內容塊，通常用於提供一般性的資訊。
{% endcontentblock %}

{% contentblock 問題 type:question %}
這是問題類型的內容塊，可以用來提出問題或疑問。
{% endcontentblock %}

{% contentblock 失敗 type:failure %}
這是失敗類型的內容塊，用於顯示錯誤或失敗的訊息。
{% endcontentblock %}

{% contentblock 危險 type:danger %}
這是危險類型的內容塊，用於警告用戶嚴重的風險。
{% endcontentblock %}

{% contentblock 錯誤 type:bug %}
這是錯誤類型的內容塊，用於報告程式錯誤或問題。
{% endcontentblock %}

{% contentblock 引用 type:quote %}
這是引用類型的內容塊，用於顯示引言或引用的內容。
{% endcontentblock %}

## 總結

hexo-content-blocks 插件為您的 Hexo 部落格添加了豐富的內容塊功能，讓您可以：

1. 創建不同類型的內容塊
2. 使用可折疊的內容框
3. 製作切換式的內容卡片
4. 自定義樣式和圖標

這些功能可以讓您的文章更加生動和互動性。
