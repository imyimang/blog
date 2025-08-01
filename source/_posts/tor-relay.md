---
title: 如何架設自己的 Tor Relay
date: 2025-08-01 14:43:19
tags: [Tor]
category: '資訊'
cover: images/20250801/image.webp
---
這篇文章會教大家如何架設一個自己的 Tor Relay，首先，你應該了解 Tor Network 是什麼

## Tor 是什麼
Tor 是一種保護網路隱私的技術。它會把你的網路流量加密，並透過三個節點傳送，每個節點只知道前一個節點是誰，這樣可以保護使用者的身份不被追蹤，對於一些網路審查嚴重的國家（Ex.伊朗, 俄羅斯, 中國 {% spoiler style:blur 雖然中國好像把所有公開的 Tor 節點都牆了 %}），或是重視隱私的使用者，Tor 是一個很有用的工具
![alt text](images/20250801/Tor-onion-network-zh.webp)
<div style="text-align: center; font-size: 0.7em;">講解 Tor 網路如何運作 圖源 電子前哨基金會</div>

## 動機
那我們為什麼要架設 Tor Relay 呢？

Tor 網路歡迎所有人來架設 Tor Relay 增加整體網路的匿名性和對抗審查
每個人都有權保護自己的瀏覽行為不被追蹤，當你架設一個 Tor Relay，就讓用戶的流量更分散更不容易被追蹤，也減少了用戶連接到[蜜罐節點](https://www.reddit.com/r/TOR/comments/wdegi/what_are_honeypots/?tl=zh-hant)（由政府或惡意單位設置以監控流量的節點）的機率
只要用閒置的 VPS 或主機進行簡單幾步設定，就能為網路隱私貢獻一份心力

## 準備
首先我們需要準備一台 Linux 環境的機器，以下用 Ubuntu舉例

如果你沒有閒置機器想買台 VPS 的話，可以考慮用 [Google Cloud Platform](https://console.cloud.google.com/?hl=zh-tw)，有 90 天 300 美金的滿免費額度，需要信用卡驗證
如果沒有信用卡，推薦用 [MoonX](https://paywithmoon.com/) 這張卡，支援加密貨幣加值，可以加個 5 美金進去(建議不要當日常使用，這張卡手續費高得離譜，但是卡頭是 credit 所以拿來驗證很方便)

{% contentblock 警告 type:warning %}
購買前請先確認您的 VPS 廠商是否允許架設 Tor 節點，如果是出口節點可能會承受法律風險，或導致 VPS 遭到封禁(請見 [節點類型](#節點類型))
{% endcontentblock %}

## 架設
安裝 Tor
```bash
sudo apt update
sudo apt install tor
```
安裝好之後編輯設定檔
```bash
sudo vim /etc/tor/torrc
```
### 節點類型
這邊就要說到 Relay 的類型了
- **Guard(入口節點)** - 運行 Tor Relay 夠久夠穩定就有機會被選為入口節點，可以看到用戶 IP，無法自行選擇擔任 Guard Relay
- **Middle(中繼節點)** - 擔任網路中間的節點，看不到用戶 IP，也看不到用戶目標網站
- **Exit(出口節點)** - 擔任網路的出口，目標主機看到的會是這台的 IP，所以法律風險最大

### 中繼節點
我們先以中繼節點為例，配置文件可以寫成這樣
```bash
Nickname MyTorRelay #你的名字
ContactInfo your_email@example.com #你的聯絡信箱
ORPort 9001

#這兩行是為了安裝監控工具 nyx
ControlPort 9051
CookieAuthentication 1

ExitRelay 0
SocksPort 0
```
儲存後輸入
```bash
sudo systemctl restart tor@default
```
查看運行狀態，看到 running 就代表啟動成功了
```bash
sudo systemctl status tor@default
```
![alt text](images/20250801/image.webp)

我們可以安裝 **nyx** 這個工具來更詳細的查看我們的 Relay 狀態
```bash
sudo apt install nyx
```
然後輸入
```bash
sudo nyx
```
可以查看更詳細的節點狀態
![alt text](images/20250801/image-1.webp)

### 出口節點
{% contentblock 警告 type:warning %}
出口節點法律風險高，需承擔一定風險
{% endcontentblock %}
你可以把配置文件修改成這樣
```bash
Nickname MyTorRelay #你的名字
ContactInfo your_email@example.com #你的聯絡信箱
ORPort 9001
DirPort 9030
ExitRelay 1
ExitPolicy accept *:* #允許所有端口
ControlPort 9051
CookieAuthentication 1
```

你也可以只開放幾個端口
修改 ExitPolicy 這行即可
EX:
```bash
ExitPolicy accept *:80,443 #只開放80, 443端口
ExitPolicy reject *:*
```

保存後重新啟動 Tor 即可
```bash
sudo systemctl restart tor@default
```

大概過幾個小時後你就可以到 [Tor Metrics](https://metrics.torproject.org/rs.html#search) 查詢你的 Relay 了！

## Flags
一個 Tor 節點會根據情況獲得不同的 Flag，你可以在 [Tor Metrics](https://metrics.torproject.org/rs.html#search) 或 nyx 查看你的 flags
![alt text](images/20250801/image-2.webp)
以下是各個常見 flag 代表的意思
- **Running** - 節點目前在線並正常運作
- **Vaild** - 	節點通過驗證，可以被用於 Tor 網路的路由選擇
- **V2Dir** - 節點提供舊版 v2 onion service 描述符資料
- **Guard** - 節點被選為入口節點，需要該節點長期穩定且表現良好
- **Exit** - 節點為出口節點
- **Fast** - 節點的速度和穩定性在一定水準
- **Stable** - 節點為長期穩定在線的節點
- **HSDir** - 節點可以作為 Hidden Service 目錄伺服器