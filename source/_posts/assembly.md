---
title: 在Windows VSCode上執行32-bit x86 Assembly程式
date: 2025-02-20 22:56:14
tag: [Assembly]
category: '技術'
---
我們需要安裝兩個東西，NASM 和 GCC，用來將 .asm 程式編譯成 Object file，並連結成可執行檔案

## NASM
到 [NASM](https://www.nasm.us/) 網站上下載並安裝 NASM
將 NASM 的路徑加入[系統環境變數Path](https://medium.com/@roan6903/windows-%E5%AE%89%E8%A3%9D-python-%E5%BE%8C-%E9%82%84%E9%9C%80%E8%A6%81%E8%A8%AD%E7%BD%AE%E7%92%B0%E5%A2%83%E8%AE%8A%E6%95%B8-217143b51344) (預設應該是安裝在 `C:\Users\用戶名\AppData\Local\bin\NASM`)
加入後可以在 CMD 輸入
```cmd
nasm -v
```
來查看是否設定成功
如果設定成功應該如下
![alt text](images/20250220/image.webp)

## GCC
下載並安裝 [MSYS2](https://www.msys2.org/)
進入 MSYS2 MINGW64
輸入
```cmd
pacman -Syu
pacman -S mingw-w64-i686-gcc
```
然後將 mingw32 加入系統環境變數Path(預設是安裝在 `C:\msys64\mingw32\bin`)
加入後重啟電腦
然後在 CMD 輸入
```cmd
gcc --version
```
成功安裝應該顯示如下
![alt text](images/20250220/image2.webp)

## VSCode
進入 VSCode 並新增一個資料夾(路徑不要有中文)
按 `Ctrl+Shift+B` 選擇 **設定建置工作** >> **從範本建立 task.json 檔案** >> **Others**
將 `task.json` 更改為如下
```json
// task.json

{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build, Link and Run (NASM + GCC)",
            "type": "shell",
            "command": "cmd",
            "args": [
                "/c",
                "nasm -f win32 ${file} -o ${fileDirname}/${fileBasenameNoExtension}.o && gcc \"${fileDirname}/${fileBasenameNoExtension}.o\" -o \"${fileDirname}/${fileBasenameNoExtension}.exe\" -m32 -nostartfiles -lmsvcrt && \"${fileDirname}/${fileBasenameNoExtension}.exe\""
            ],
            "problemMatcher": [],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

## 執行
我們創建一個 `hello.asm` 檔案
```asm
; hello.asm

section .data
    msg db "Hello World!", 0xd, 0xa, 0

section .text
    global _main
    extern _printf

_main:
    push msg
    call _printf
    add esp, 4
    
    xor eax, eax
    ret
```
按下 `Ctrl+Shift+B` 他就會自動編譯並執行了
![alt text](images/20250220/image3.webp)