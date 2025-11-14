---
title: 在 Whonix 顯示中文/安裝注音輸入法
date: 2025-06-02 21:26:39
tags: [Whonix, Tor]
category: '技術'
cover: images/20250602/image-1.webp
---
## 1. 下載並安裝 Whonix
 
到 whonix 官網下載[虛擬機版本](https://www.whonix.org/wiki/VirtualBox#stable_Xfce)或映像檔
![images](images/20250602/image1.webp)
如果沒有安裝 VirtualBox 的下面也有安裝教學，本篇以虛擬機示範
下載後點開.ova檔案就會自動匯入 VirtualBox 了

先啟動 Gateway
![images](images/20250602/image2.webp)
啟動之後他會跳出一些安全提醒，就按 OK 或 yes 就好

啟動 WorkStation
![alt text](images/20250602/image3.webp)
新版本 WorkStation 的 user 可能會沒有 sudo 權限，請依照[此篇文章](https://www.kicksecure.com/wiki/Unrestricted_admin_mode)操作
重新啟動 WorkStation 時一直按 Shift 進入 GRUB，然後選擇 `REMOVE sysmaint-user-split | enable unrestricted admin mode` 就可以了

## 2. 安裝中文繁體字體

在 Terminal 執行以下
```bash
sudo apt update
sudo apt-get install fonts-arphic-ukai
```
然後輸入
```bash
sudo dpkg-reconfigure locales
```
用方向鍵下選到最底選 zh_TW 那個，用空白鍵選定
![alt text](images/20250602/image-2.webp)

按兩次 Enter 就會開始安裝了

然後在 Terminal 輸入 `reboot` 來重啟

如果重啟後有bug無法使用，在 Terminal 輸入
```bash
sudo dpkg-reconfigure debconf
```

然後選擇 `ReadLine` -> `critical` 然後按 Enter即可

現在已經能正常顯示中文字體，但系統語言還不是中文
在 Terminal 輸入
```bash
sudo dpkg-reconfigure locales
```
然後按 Enter 往下滑到底，輸入```zh_TW.UTF-8 UTF-8``` 對應的數字
![alt text](images/20250602/image-4.webp)

然後再選擇 zh_TW 作為預設語言
![alt text](images/20250602/image-5.webp)

重啟後系統就是中文了

如果重啟後又變回英文，可以嘗試
```bash
sudo vim /etc/default/locale
```
輸入
```bash
LANG=zh_TW.UTF-8
LANGUAGE=zh_TW:zh
LC_ALL=zh_TW.UTF-8
```
然後 :wq 儲存，再重新執行一次上面流程後重啟
## 3. 設定注音輸入法

在 Terminal 執行以下
```bash
sudo apt update
sudo apt install ibus ibus-chewing
```
然後輸入
```bash
vim ~/.bashrc
```
在檔案最下面按 I 填入以下:
```bash
export GTK_IM_MODULE=ibus
export QT_IM_MODULE=ibus
export XMODIFIERS=@im=ibus
```
然後按 Esc，再按 :wq 儲存離開
執行
```bash
source ~/.bashrc
```
設定開機自動啟動
```bash
ibus-daemon -drx
```

5. 啟動ibus設定輸入法
輸入
```bash
ibus-setup
```
選擇 Input Method
![alt text](images/20250602/image.webp)
選擇 Add 搜尋 Chinese，然後選擇 Chewing 並按 Add
![alt text](images/20250602/image-1.webp)

這樣就能在 Whonix 輸入注音和顯示繁體中文了，按 `Win + Space` 來切換輸入法

## 參考資料
https://www.youtube.com/watch?v=pBZaFZMM5pI
https://ruanjianlun.xyz/whonix-%E5%AD%97%E4%BD%93%E8%AE%BE%E7%BD%AE/