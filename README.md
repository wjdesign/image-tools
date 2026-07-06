# 🪄 WebP 圖片轉換器 (image-tools)

一個 **100% 在瀏覽器本地執行** 的圖片格式轉換工具。所有運算都透過瀏覽器原生 Canvas API 完成,圖片**永遠不會上傳到任何伺服器**——沒有後端、沒有追蹤、完全離線可用。

## ✨ 功能特色

- **格式互轉**:WebP ⇄ JPG ⇄ PNG,輸入端支援自動偵測(JPG/PNG/WebP/GIF/BMP 等)
- **大圖示格式選擇**:左「輸入格式」、右「輸出格式」,點擊卡片跳出彈窗選擇;輸入=輸出同格式時自動鎖定轉換按鈕防呆
- **品質調整**:五段品質下拉選單(100% 超高品質 → 20% 極大壓縮),PNG 輸出時自動停用(無損格式)
- **批次處理**:一次拖放多張圖,顯示每張轉換前後的檔案大小與增減百分比
- **打包下載**:
  - **ZIP**(內建極簡 ZIP writer,store 模式 + CRC32 + UTF-8 檔名,中文檔名不亂碼)
  - **TAR.GZ**(內建 ustar 打包 + 瀏覽器原生 `CompressionStream` gzip 壓縮)
  - 重複檔名自動加 `(1)` 後綴防覆蓋;轉換後檔名保留原名、僅更換副檔名
- **多語系 (i18n)**:繁體中文/简体中文/English/日本語,自動偵測瀏覽器語言,選擇記憶於 localStorage
- **PWA**:可安裝到桌面/手機主畫面,Service Worker 預載全部資源,**完全離線運行**
- **隱私權政策 / 使用條款** 頁面(四語系)

## 🛠 技術說明

**零框架、零依賴、零建置**——純 HTML + CSS + Vanilla JavaScript,不需要 npm install,clone 下來直接開 `index.html` 就能跑。

| 核心機制 | 實作方式 |
|---|---|
| 圖片轉換 | `canvas.toBlob(callback, mimeType, quality)` |
| 透明轉 JPG | 先填白底再繪製,避免透明區變黑 |
| ZIP 打包 | 手寫 ZIP 格式(local header / central directory / EOCD) |
| GZIP 壓縮 | 原生 `CompressionStream("gzip")` |
| 離線支援 | Service Worker cache-first + 背景更新 |
| 多語系 | `data-i18n` 屬性 + 字典替換,無函式庫 |

```
├── index.html          # 轉換器主頁
├── privacy.html        # 隱私權政策
├── terms.html          # 使用條款
├── manifest.json       # PWA 安裝資訊
├── sw.js               # Service Worker(離線快取)
└── assets/
    ├── styles.css      # 共用樣式(深色主題)
    ├── i18n.js         # 四語系字典與切換引擎
    ├── app.js          # 轉換器邏輯
    └── img/            # 圖示與 favicon
```

## 🚀 本地開發

因為 Service Worker 需要 HTTP 環境,建議用任一靜態伺服器:

```bash
npx http-server . -p 8899 -c-1
# 開啟 http://localhost:8899
```

> 改版時記得將 `sw.js` 內的 `CACHE` 版號 +1(例如 `webp-tools-v16` → `v17`),使用者才會拿到新版而非舊快取。

## 📦 部署到 GitHub Pages

1. Push 到 GitHub
2. Repo → **Settings → Pages** → Source 選擇 `master` 分支、`/ (root)` 目錄
3. 完成後網址為 `https://<帳號>.github.io/<repo 名稱>/`

純靜態檔案,無需任何 CI/建置流程。

## 🔒 隱私

- 圖片僅存在於當前瀏覽器分頁,關閉即消失
- 不收集任何個人資料、無追蹤 Cookie、無分析工具
- localStorage 僅儲存語言偏好

詳見 [隱私權政策](privacy.html) 與 [使用條款](terms.html)。

## 🙏 圖示來源

介面圖示來自 [Icons8](https://icons8.com)。

## ✍️ 作者

**Wayne** — [wayne-blog.com](https://wayne-blog.com)

---

© 2026 [Wayne](https://wayne-blog.com). All rights reserved.
