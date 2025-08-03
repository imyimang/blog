---
title: 如何架設自己的 Tor Relay
date: 2025-08-01 14:43:19
tags: [Tor]
category: '資訊'
cover: images/20250801/image.webp
description: 詳細教學如何架設 Tor Relay 節點，包含中繼節點、出口節點和橋接節點的完整設定指南
---
這篇文章會教大家如何架設一個自己的 Tor Relay，首先，你應該了解 Tor Network 是什麼

## Tor 是什麼
Tor(The Onion Router) 是一種保護網路隱私的技術。它會把你的網路流量加密，並透過三個節點傳送，每個節點只知道上下游節點的資訊，而無法同時知道整個路徑和來源/目的地，這樣可以保護使用者的身份不被追蹤，對於一些網路審查嚴重的國家（Ex.伊朗, 俄羅斯, 中國 {% spoiler style:blur 雖然中國好像把所有公開的 Tor 節點都牆了 %}），或是重視隱私的使用者，Tor 是一個很有用的工具
![alt text](images/20250801/Tor-onion-network-zh.webp)
<div style="text-align: center; font-size: 0.7em;">講解 Tor 網路如何運作 圖源 電子前哨基金會</div>

## 動機
那我們為什麼要架設 Tor Relay 呢？

Tor 網路歡迎所有人來架設 Tor Relay 增加整體網路的匿名性和對抗審查
每個人都有權保護自己的瀏覽行為不被追蹤，當你架設一個 Tor Relay，就讓用戶的流量更分散更不容易被追蹤，也減少了用戶連接到[蜜罐節點](https://www.reddit.com/r/TOR/comments/wdegi/what_are_honeypots/?tl=zh-hant)（由政府或惡意單位設置以監控流量的節點）的機率
只要用閒置的 VPS 或主機進行簡單幾步設定，就能為網路隱私貢獻一份心力

## 準備
首先我們需要準備一台 Linux 環境的機器，以下用 Ubuntu 舉例

如果你沒有閒置機器想買台 VPS 的話，可以考慮用 [Google Cloud Platform](https://console.cloud.google.com/?hl=zh-tw)，有 90 天 300 美金的滿免費額度，需要信用卡驗證
如果沒有信用卡，推薦用 [MoonX](https://paywithmoon.com/) 這張卡，支援加密貨幣加值，可以加個 5 美金進去(建議不要當日常使用，這張卡手續費高得離譜，但是卡頭是 credit 所以拿來驗證很方便)

{% contentblock 警告 type:warning %}
購買前請先確認您的 VPS 廠商是否允許架設 Tor 節點，如果是出口節點可能會承受法律風險，或導致 VPS 遭到封禁(請見 [節點類型](#節點類型))
{% endcontentblock %}

你可以參考[這篇文章](https://community.torproject.org/relay/community-resources/good-bad-isps/)，介紹了一些對 Tor Relay 友善的 VPS 廠商

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
- **Bridge(橋接節點)** - 不公開的節點，提供給無法使用公開節點的用戶

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
儲存後記得讓防火牆允許 `ORPort`
```bash
sudo ufw allow 9001
```
然後輸入
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

{% contentblock 警告 type:warning %}
使用 Ubuntu 可能會出現 Tor 版本過舊的問題，請見 [FAQ](#FAQ)
{% endcontentblock %}


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
儲存後記得讓防火牆允許 Directory Port 和你要開放的端口
```bash
sudo ufw allow 9001
sudo ufw allow 9030

#假設只有開放80/443
sudo ufw allow 80
sudo ufw allow 443
```
重新啟動 Tor 即可
```bash
sudo systemctl restart tor@default
```

大概過幾個小時後你就可以到 [Tor Metrics](https://metrics.torproject.org/rs.html#search) 查詢你的 Relay 了！

### 橋接節點
有些地區(例如中國)，把所有公開的 Tor Relay 都封鎖了，所以百姓無法通過一般的方式連入洋蔥網路，只能通過 Bridge Relay 這類不公開且有像 `obfs4` 之類的混淆協議的方法

先下載 obfs4proxy
```bash
sudo apt update
sudo apt install obfs4proxy
```

你可以把配置文件改成這樣
```bash
BridgeRelay 1
Nickname MyBridgeRelay
ORPort 9001
ExtORPort auto
Exitpolicy reject *:*
ServerTransportPlugin obfs4 exec /usr/bin/obfs4proxy
#meek、scramblesuit 等其他橋接協議，可以根據需求啟用

ServerTransportListenAddr obfs4 0.0.0.0:8888
```
{% contentblock 提示 type:tip %}
obfs4 的端口可以自己改成其他的
{% endcontentblock %}
儲存後記得允許 `ORPort` 和 obfs4 的 Port
```bash
#假設 obfs4 的端口是 8888
sudo ufw allow 9001
sudo ufw allow 8888
```

重新啟動節點
```bash
sudo systemctl restart tor@default
```
查看啟動狀態
```bash
sudo systemctl status tor@default
```
看到 running 就成功了
接下來要獲得 Bridge 連線資訊給別人連線

先查看 `obfs4_bridgeline.txt`
```bash
sudo cat /var/lib/tor/pt_state/obfs4_bridgeline.txt
```

最後一行會顯示你的 Bridge 連線資訊
![alt text](images/20250801/image1.webp)

然後我們查看我們的 fingerprint
```bash
sudo cat /var/lib/tor/fingerprint
```
這串 HEX 就是了
![alt text](images/20250801/imagee.webp)

最後把 Bridge 資訊組起來應該長這樣
```conf
Bridge obfs4 你的IP:obfs4設定的port <你的fingerprint> cert=你的cert iat-mode=0
```
EX:
```conf
Bridge obfs4 193.57.136.119:443 922FC5AF7C91143E6B8FA3420F732FC63374A32B cert=pBkF+6bD/GVe2hmYc/gp0wH7hnLFWLU8OJJLI2AxNNZTl6xPnrii5fZ/ebX8jsgS88gBbQ iat-mode=0
```
{% contentblock 提示 type:tip %}
私人架設的 Bridge Relay 不會被收錄到 [Tor Metrics](https://metrics.torproject.org/rs.html#)
{% endcontentblock %}

那別人如何透過你架的 Bridge 連入洋蔥網路呢
可以進入 [Tor Browser](https://www.torproject.org/download/) 的右邊三條線
![alt text](images/20250801/image3.webp)
選擇**設定**->**連線**
選擇橋接器 -> **新增新的橋接器**
![alt text](images/20250801/image2.webp)
把你的那段 Bridge 連線資訊貼上去後連結就可以了
![alt text](images/20250801/image4.webp)

## Flags
一個 Tor 節點會根據情況獲得不同的 Flag，你可以在 [Tor Metrics](https://metrics.torproject.org/rs.html#search) 或 nyx 查看你的 flags
![alt text](images/20250801/image-2.webp)
以下是各個常見 flag 代表的意思
- **Running** - 節點目前在線並正常運作
- **Valid** - 	節點通過驗證，可以被用於 Tor 網路的路由選擇
- **Bridge** - 節點為 Bridge Relay(私人架設的 Bridge Relay 不會被收錄到網站)
- **V2Dir** - 節點提供舊版 v2 onion service 描述符資料
- **Guard** - 節點被選為入口節點，需要該節點長期穩定且表現良好
- **Exit** - 節點為出口節點
- **Fast** - 節點的速度和穩定性在一定水準
- **Stable** - 節點為長期穩定在線的節點
- **HSDir** - 節點可以作為 Hidden Service 目錄伺服器

## FAQ
### Tor 版本過舊
當你使用 Ubuntu 用 APT 下載 Tor 時，有時候會遇到 Tor 版本過舊而不被網路接納的問題
你可以等待節點運行一段時間後使用
```bash
sudo nyx
```
如果出現 **obsolete** 標記，就代表你的 Tor 版本過舊，可以參考以下步驟(以 Ubuntu 22.04 舉例)
![alt text](images/20250801/image-3.webp)

先移除舊版 Tor
```bash
sudo apt remove tor tor-geoipdb
sudo apt autoremove
```
修改設定檔
```bash
sudo vim /etc/tor/torrc
```
把 `SocksPort` 改成 **9050**

安裝套件
```bash
sudo apt update
sudo apt install apt-transport-https curl gnupg
```
匯入官方公鑰
```bash
curl -fsSL https://deb.torproject.org/torproject.org/A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89.asc | gpg --dearmor | sudo tee /usr/share/keyrings/deb.torproject.org-keyring.gpg > /dev/null
```
新增官方 Tor 軟體庫
```bash
echo "deb [signed-by=/usr/share/keyrings/deb.torproject.org-keyring.gpg] https://deb.torproject.org/torproject.org jammy main" | sudo tee /etc/apt/sources.list.d/tor.list
```
安裝最新版 Tor
```bash
sudo apt update
sudo apt install tor deb.torproject.org-keyring
```
重啟 Tor
```bash
sudo systemctl restart tor@default
sudo nyx
```
出現 **recommended** 標記就代表更新成功了
![alt text](images/20250801/image-4.webp)