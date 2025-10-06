---
title: Markdown-it Plus 測試
slug: markdown-it-plus-test
date: 2025-10-06 12:00:00
updated: 2025-10-06 12:00:00
categories:
  - tech
tags:
  - Hexo
  - Markdown
  - 測試
---

這是一篇用來驗證新安裝的 Markdown-it Plus 渲染器的測試文章。以下的示例包含直引號，渲染後應該自動變成精美的「弧形引號」。

> "在風中低語" 是我最喜歡的詩句之一，
> 而數學公式讓這段話更具節奏感。

內嵌數學公式示例：$E = mc^2$。

下面展示一個多行的 KaTeX 方程：

$$
\begin{aligned}
\nabla \cdot \vec{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \vec{B} &= 0 \\
\nabla \times \vec{E} &= -\frac{\partial \vec{B}}{\partial t} \\
\nabla \times \vec{B} &= \mu_0 \vec{J} + \mu_0 \varepsilon_0 \frac{\partial \vec{E}}{\partial t}
\end{aligned}
$$

## 引號輸出測試

- "Straight double quotes" 會自動轉成弧形「雙引號」。
- 'Straight single quotes' 會自動轉成弧形『單引號』。
- "Nested 'quotes' inside" 能正確處理雙引號中包單引號。
- 'Nested "quotes" inside' 能正確處理單引號中包雙引號。

## 語錄（Blockquote）測試

> 「我覺得喜歡上程式語言就像是在學習一種新的樂器。」
> —— yimang，2025

> 這是一段多行語錄：
> 在第一行，我引用了自己的日記。
> 第二行則加入一些內嵌的 `行內程式碼`。
>
> > 這裡再巢狀一層語錄，測試多層級轉換效果。

> **提示**：區塊語錄裡也可以有 *強調*、`程式碼`、和 [連結](https://hexo.io)。

再補充一段內文，使用 '單引號' 與 "雙引號" 混寫，確認 typographer 可以處理。

最後加上一些腳註來確保擴展能正常工作[^1]，以及標記語法 ==高亮關鍵字==。

[^1]: 這是一個示範腳註，Markdown-it Plus 會自動處理。
