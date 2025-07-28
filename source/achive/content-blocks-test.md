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

## Hexo Spoiler 插件測試

### 基本 Spoiler 功能

這個段落包含一些 {% spoiler 劇透內容，點擊查看 %} 的例子。

### 自定義樣式的 Spoiler

這裡有一個模糊效果的劇透：{% spoiler style:blur 電影結局：主角最後拯救了世界 %}

這裡有一個方框效果的劇透：{% spoiler style:box 隱藏的秘密：寶藏在古老的橡樹下 %}

### 帶顏色的方框 Spoiler

紅色方框劇透：{% spoiler style:box color:red 危險警告：不要獨自進入森林 %}

藍色方框劇透：{% spoiler style:box color:blue 提示：答案在書的第42頁 %}

### 段落模式的 Spoiler

{% spoiler p:true style:box color:green 這是一個段落模式的劇透，它會被包裹在 <p> 標籤中，前後會有換行。這種模式適合較長的文本內容。 %}

### 懸停顯示的 Spoiler

將滑鼠懸停在這裡查看內容：{% spoiler hover:true style:blur 懸停即可看到的秘密訊息 %}

### 代碼相關的 Spoiler

問題：如何在 JavaScript 中反轉一個字符串？

{% spoiler style:box color:gray function reverseString(str) { return str.split('').reverse().join(''); } %}

### 組合多種選項的 Spoiler

完整配置的劇透：{% spoiler style:box color:purple p:true hover:true 這個劇透結合了方框樣式、紫色背景、段落模式和懸停顯示功能。滑鼠懸停即可查看內容！ %}

### 多個 Spoiler 組合

劇透警告！以下內容包含多個劇透：

- 第一個劇透：{% spoiler style:blur 角色A在第三章中會離開隊伍 %}
- 第二個劇透：{% spoiler style:box color:orange 在城堡的地下室可以找到傳說中的武器 %}
- 第三個劇透：{% spoiler style:box color:red hover:true 看起來善良的導師實際上是最終Boss %}

## 總結

hexo-content-blocks 插件為您的 Hexo 部落格添加了豐富的內容塊功能，讓您可以：

1. 創建不同類型的內容塊
2. 使用可折疊的內容框
3. 製作切換式的內容卡片
4. 自定義樣式和圖標

這些功能可以讓您的文章更加生動和互動性。
