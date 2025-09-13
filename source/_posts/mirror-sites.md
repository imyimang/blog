---
title: 如何透過 Github Actions 在 Tor 和 I2P 建立鏡像站並自動更新 Hexo blog
date: 2025-09-13 16:14:51
tags: [Github-Actions, Tor, I2P, Hexo]
---
最近剛好看到 I2P 技術，就心血來潮想要在 Tor 和 I2P 網路上架設自己部落格的鏡像站，並且讓他能同步更新本站，這篇文就要示範如何透過 Github Actions 完成以上操作
## 什麼是 I2P/Tor

**I2P（Invisible Internet Project）** 是一個專注於匿名通訊的分散式網路協議，讓使用者可以在網路上隱藏自己的身分與位置。I2P 主要用於建立匿名網站（稱為 eepsites），以及點對點的加密通訊，適合需要高度隱私的應用場景。

**Tor（The Onion Router）** 則是一個全球知名的匿名網路，透過多層加密（像洋蔥一樣）將流量在多個節點間轉發，讓使用者難以被追蹤。Tor 常用於瀏覽 .onion 網站（暗網），或是在公開網路上保護個人隱私。

這兩種技術都能讓你架設只有特定網路能存取的鏡像站，提升部落格的可用性與抗審查能力。
\- by ChatGPT
## 事前準備
需要準備一台支援 SSH 的 Linux 主機(其他系統也可以，但本篇以 Ubuntu 24.04 示範)，配置最低 1C/1G/10G 也可以跑起來，我是用 [IONOS](https://my.ionos.com/)，一個月2美元

## 設定 Github Actions
首先我們要先設定 GitHub Secrets，到 **你的專案 >> Settings >> Secrets and variables >> Actions**
選擇 **New repository secret**
![alt text](images/20250913/image-1.webp)

我們需要新增四個 Secret，分別是
VPS_USER - 登入 SSH 的 Username(預設應該是 root)
VPS_HOST - VPS 的 IP
VPS_PORT - VPS SSH 的端口(預設是22)
VPS_SSH_KEY - Actions 要連接 SSH 的 Private Key
![alt text](images/20250913/image.webp)

如果沒有 VPS_SSH_KEY 的話可以在電腦 CMD 或 VPS 打以下指令
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions" -f github_actions_key
```

他就會生成一對公鑰(Public Key)和私鑰(Private Key)
Windows 會生成在 `C:\Users\Username` 下
然後把公鑰放入 VPS
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
vim ~/.ssh/authorized_keys
```
把 `github_actions_key.pub` 的內容貼進去儲存後
```bash
chmod 600 ~/.ssh/authorized_keys
```
把私鑰照上面步驟放到 Secrets

然後在專案創建 .github/workflows 資料夾，在裡面創建 deploy.yml
```yml
name: Deploy Hexo to VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'

    - name: Install Hexo
      run: |
        npm install -g hexo-cli
        npm install

    - name: Generate site
      run: hexo generate

    - name: Deploy to VPS
      uses: appleboy/scp-action@v0.1.6
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.VPS_SSH_KEY }}
        port: ${{ secrets.VPS_PORT }}
        source: "public/*"
        target: "/var/www/hexo/"

    - name: Reload Nginx
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.VPS_SSH_KEY }}
        port: ${{ secrets.VPS_PORT }}
        script: "sudo systemctl reload nginx"
```
讓他會先生成 public 資料夾後部屬到 VPS 的 /var/www/hexo/ 資料夾

## 部屬 Nginx 伺服器
先安裝 nginx
```bash
sudo apt update
sudo apt install nginx -y
```
編輯 nginx 配置
```bash
vim /etc/nginx/sites-available/default
```
你也可以新增一個設定檔
```bash
vim /etc/nginx/sites-available/hexo #名字自己取
```
把他修改成
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/hexo/public;
    index index.html;

    server_name _;

    location / {
        try_files $uri $uri/ =404;
    }
}
```
然後啟動 nginx 服務
如果你是新增設定檔要先打
```bash
sudo ln -s /etc/nginx/sites-available/hexo /etc/nginx/sites-enabled/
```
然後
```bash
sudo nginx -t  # 測試配置是否正確
sudo systemctl restart nginx
```
你可以用瀏覽器訪問 `http://vps的ip:80` 來看看網站有沒有成功部屬
![alt text](images/20250913/image-2.webp)

## 架設 Tor 鏡像站
Tor 的部分比較簡單
先安裝 Tor
```bash
sudo apt install -y tor
```
修改設定檔
```bash
vim /etc/tor/torrc
```
新增這兩行
```conf
HiddenServiceDir /var/lib/tor/hexo_hidden_service/
HiddenServicePort 80 127.0.0.1:80
```
重啟 Tor
```bash
sudo systemctl restart tor
```
查看 .onion 網址
```bash
sudo cat /var/lib/tor/hexo_hidden_service/hostname
```
這樣就部屬好了，訪問網站請見[教學](#如何訪問鏡像網站)

## 架設 I2P 鏡像站
我們先安裝 Java(建議用17或以上)
```bash
sudo apt update
sudo apt install openjdk-17-jre -y
```
然後下載 I2P
```bash
cd /opt
sudo wget https://github.com/i2p/i2p.i2p/releases/download/i2p-2.7.0/i2pinstall_2.7.0-0.jar -O i2pinstall.jar
sudo java -jar i2pinstall.jar
```
他會叫我們選語言，我們選繁體中文(twn)就好
![alt text](images/20250913/image-4.webp)
之後就照著他的指示繼續

然後我們先創建一個專用的用戶
```bash
sudo useradd -r -m -d /home/i2puser -s /usr/sbin/nologin i2puser
sudo mkdir -p /home/i2puser
sudo chown i2puser:i2puser /home/i2puser
```

設定 I2P 目錄權限
```bash
sudo chown -R i2puser:i2puser /usr/local/i2p
sudo -u i2puser mkdir -p /home/i2puser/.i2p
```

然後先修改 I2P設定檔
```bash
sudo vim /usr/local/i2p/i2prouter
```
把 `I2P_CONFIG_DIR` 改成
```bash
I2P_CONFIG_DIR="/home/i2puser/.i2p"
```
下面一點的 `RUN_AS_USER`改成
```bash
RUN_AS_USER=i2puser
```
![alt text](images/20250913/image-7.webp)

設定 Systemctl 自動啟動
```bash
sudo vim /etc/systemd/system/i2p.service
```
改成
```conf
[Unit]
Description=I2P Router
After=network.target

[Service]
Type=forking
User=i2puser
Environment="I2P_CONFIG_DIR=/home/i2puser/.i2p"
WorkingDirectory=/usr/local/i2p
ExecStart=/usr/local/i2p/i2prouter start
ExecStop=/usr/local/i2p/i2prouter stop
Restart=on-failure
RestartSec=5s
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

啟動 I2P
```bash
sudo systemctl daemon-reload
sudo systemctl enable i2p
sudo systemctl start i2p
```

可以輸入
```bash
sudo systemctl status i2p
```
來查看狀態，看到 running 就代表運行成功了
![alt text](images/20250913/image-9.webp)

再來我們要從自己電腦連上 I2P 的 Web Console，在 CMD 或 Powershell 輸入
```bash
ssh -L 9765:127.0.0.1:7657 你的username@VPS IP #不要用 i2puser，這個用戶是 nologin 模式沒辦法用 SSH 登入
```
7657 端口我們自己可能會用，所以把 VPS 的 7657 端口代理到本地的 8765 端口(9765 要改其他的也可以)

如果 SSH 登入要私鑰可以用以下指令指定私鑰
```bash
ssh -i 私鑰路徑 -L 9765:127.0.0.1:7657 你的username@VPS IP
```
{% contentblock 注意事項 type:note %}
CMD/Powershell 的視窗不要關掉，關掉 SSH 的 Session 就斷了，要關設定完再關
{% endcontentblock %}
我們現在到瀏覽器輸入 `http://127.0.0.1:9765` 就能看到 VPS 的 I2P Web Console 了
![alt text](images/20250913/image-10.webp)
我們選好語言後，帶寬設定可以先略過

然後我們就會進入他的控制台，選隱藏服務管理器
![alt text](images/20250913/image-12.webp)

選擇創建一個新的 HTTP 隱身服務
![alt text](images/20250913/image-13.webp)

名稱跟描述可以自己寫，目標選 127.0.0.1 端口 80 然後保存就好
![alt text](images/20250913/image-14.webp)

點啟動
![alt text](images/20250913/image-15.webp)
重整一下網頁看到他變綠燈就可以用他下面**目標**的網址連線了

## 如何訪問鏡像網站
Tor 和 I2P 都無法用一般瀏覽器從表網連線，我們需要額外進行一些動作
### Tor
Tor 比較簡單，下載 [Tor Browser](https://www.torproject.org/download/)
然後連上 Tor 網路輸入網址就能訪問了
![alt text](images/20250913/image-3.webp) 
### I2P
訪問 I2P 最簡單的方法是透過 FoxyProxy 通過 I2P 代理 HTTP 流量
我們要下載 [I2P](https://geti2p.net/zh-tw/download) 並安裝(以下用 Windows 示範)
開啟 I2P 後可以訪問 `http://127.0.0.1:7657` 來驗證有沒有啟動成功，有的話會看到跟 VPS 的 I2P Web Console 一樣的畫面

然後在瀏覽器安裝 [FoxyProxy](https://chromewebstore.google.com/detail/foxyproxy/gcknhkkoolaabfmlnjonogaaifnjlfnp?hl=zh-TW)，Chrome/Edge/Firefox 都有這個擴充功能

進入 FoxyProxy 的設定
![alt text](images/20250913/image-16.webp)
到 Poxies 新增一個 Proxy ，類型選擇 HTTP，代理到 127.0.0.1 的 4444 端口
![alt text](images/20250913/image-17.webp)
儲存後把 FoxyProxy 固定，然後選擇我們剛剛創的那個 Proxy，就能直接切換到 I2P 網路並訪問網站了
![alt text](images/20250913/image-18.webp)

#### 地址簿
I2P 的域名預設是一長串 base32 的網址，我們可以通過自己新增地址簿來用自訂的 .i2p 域名訪問網站
先到 `http://127.0.0.1:7657/` 選擇地址簿
![alt text](images/20250913/image-19.webp)

I2P 的地址簿有兩種，你可以自己新增地址簿或訂閱其他人的地址簿，自己新增地址簿就只能自己用自訂域名訪問，本質上他就是把比較短的域名再導向 base32 格式的域名
付費訂閱(不知道為什麼這樣翻譯，他沒有付費的東西，只是自動訂閱別人的地址簿)的部分官方的地址簿更新很慢，這邊推薦幾個地址簿，讓你可以用短域名訪問比較多網站
```
http://identiguy.i2p/hosts.txt
http://notbob.i2p/hosts.txt
http://reg.i2p/export/hosts.txt
http://scanner.linuxfarm.i2p/hosts.txt
http://skank.i2p/hosts.txt
http://stats.i2p/cgi-bin/newhosts.txt
```

我們可以設定本地地址簿來讓我們能用短網址訪問網站
選擇本地地址簿，目標填入我們的 base32 網址，主機名可以自己取一個 .i2p 結尾的
![alt text](images/20250913/image-20.webp)

新增之後我們就能用短域名訪問了
![alt text](images/20250913/image-21.webp)