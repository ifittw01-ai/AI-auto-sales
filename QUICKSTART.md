# 🚀 快速入門指南

## 🎯 已完成功能

✅ **完整的銷售頁面框架**
- Hero 區域、視頻展示、目標受眾、前後對比
- 系統演示、學員評價、包含內容
- FAQ 折疊、訂單摘要、Footer

✅ **訂單表單模態框** ⭐ NEW!
- 專業的彈出式表單設計
- 收集客戶基本資料（姓名、郵箱、電話等）
- 多種付款方式選擇
- 完整的表單驗證
- 響應式設計（桌面/移動端）

✅ **互動功能**
- 實時倒計時
- FAQ 問答折疊
- 滾動動畫效果
- 鍵盤快捷鍵支持

## 📂 文件結構

```
AI-auto-sales/
├── index.html              # 主頁面（包含表單模態框）
├── styles.css              # 完整樣式（包含模態框樣式）
├── script.js               # 所有 JavaScript 功能
├── README.md               # 完整文檔
├── 表單功能說明.md         # 表單功能詳細說明
├── QUICKSTART.md           # 本文件
└── git-setup.bat           # Git 初始化腳本
```

## ⚡ 立即開始

### 1. 查看效果
直接雙擊 `index.html` 在瀏覽器中打開

### 2. 測試功能
- 點擊任何「我要優惠」按鈕 → 打開表單
- 填寫表單並提交 → 查看演示提示
- 點擊 FAQ 問題 → 展開答案
- 觀察倒計時 → 動態更新

### 3. 本地運行（推薦）
```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx http-server

# 訪問
http://localhost:8000
```

## 🎨 快速自定義

### 修改公司名稱和產品
搜索並替換 `index.html` 中的：
- "AI自動引客系統" → 你的產品名稱
- "MIGRITY SDN BHD" → 你的公司名稱

### 修改價格
搜索 `index.html` 中的：
- "NT$6,927" → 你的原價
- "NT$1,727" → 你的優惠價

### 修改顏色主題
在 `styles.css` 開頭修改：
```css
:root {
    --primary-color: #你的顏色;
    --secondary-color: #你的顏色;
}
```

### 修改倒計時結束時間
在 `script.js` 的 `initCountdown()` 函數中：
```javascript
const endTime = new Date(年, 月-1, 日, 時, 分, 秒);
```

## 📱 訂單表單使用

### 表單觸發
所有帶有 `.cta-button` class 的按鈕都會打開表單：
```html
<button class="cta-button">點我打開表單</button>
```

### 表單字段
必填字段（帶紅色星號）：
- 姓名
- 電子郵件
- 電話號碼
- 國家/地區
- 行業
- 服務條款勾選

### 關閉表單
三種方式：
1. 點擊右上角 ✕
2. 點擊表單外部
3. 按 ESC 鍵

## 🔌 連接後端

### 方法 1: REST API
在 `script.js` 的 `initOrderForm()` 函數中取消註釋並修改：

```javascript
fetch('https://your-api.com/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => {
    window.location.href = '/thank-you';
});
```

### 方法 2: 電子郵件服務
使用 [EmailJS](https://www.emailjs.com/):

```javascript
emailjs.send('service_id', 'template_id', data)
    .then(() => alert('訂單已發送！'));
```

### 方法 3: Google Sheets
使用 Google Apps Script 或 [SheetDB](https://sheetdb.io/)

### 方法 4: 無代碼工具
- [Zapier](https://zapier.com/)
- [Make.com](https://www.make.com/)
- [Integromat](https://www.integromat.com/)

## 🚢 部署到線上

### GitHub Pages (免費)
```bash
# 運行 git-setup.bat 或手動執行：
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用戶名/你的倉庫.git
git push -u origin main

# 在 GitHub 倉庫設置中啟用 Pages
```

### Netlify (免費)
1. 註冊 [Netlify](https://www.netlify.com/)
2. 拖放整個文件夾
3. 獲得免費域名

### Vercel (免費)
```bash
npm i -g vercel
vercel
```

## 📊 添加分析追蹤

### Google Analytics
在 `index.html` 的 `</head>` 前添加：
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Facebook Pixel
```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

## ✅ 上線前檢查清單

- [ ] 修改所有文字內容為你的產品信息
- [ ] 替換占位圖片和視頻
- [ ] 設置正確的價格
- [ ] 配置後端 API 或表單處理
- [ ] 添加真實的評價和案例
- [ ] 測試所有按鈕和鏈接
- [ ] 測試表單提交流程
- [ ] 添加隱私政策和服務條款頁面
- [ ] 配置 Google Analytics
- [ ] 測試移動端顯示
- [ ] 檢查所有瀏覽器兼容性
- [ ] 設置 SSL 證書 (HTTPS)
- [ ] 優化圖片大小
- [ ] 添加 favicon
- [ ] 設置 SEO meta 標籤

## 🆘 常見問題

### Q: 表單提交後沒反應？
A: 這是演示版本，需要在 `script.js` 中配置實際的後端 API。

### Q: 如何添加更多表單字段？
A: 在 `index.html` 的表單區域添加新的 `form-group`，參考現有字段格式。

### Q: 倒計時不準確？
A: 確保客戶端時間正確，或在後端生成倒計時結束時間。

### Q: 移動端顯示有問題？
A: 檢查 `styles.css` 中的 `@media (max-width: 768px)` 部分。

### Q: 想要不同的配色方案？
A: 修改 `styles.css` 開頭的 CSS 變量。

## 📚 更多資源

- 📖 [README.md](README.md) - 完整項目文檔
- 📝 [表單功能說明.md](表單功能說明.md) - 表單詳細說明
- 💻 [MDN Web Docs](https://developer.mozilla.org/) - Web 開發文檔
- 🎨 [CSS-Tricks](https://css-tricks.com/) - CSS 技巧
- 🚀 [JavaScript.info](https://javascript.info/) - JavaScript 教程

## 🎉 下一步

1. ✅ 自定義內容和樣式
2. ✅ 配置表單後端處理
3. ✅ 添加支付網關集成
4. ✅ 設置郵件通知
5. ✅ 添加更多追蹤和分析
6. ✅ 創建感謝頁面
7. ✅ A/B 測試不同版本
8. ✅ 優化轉化率

---

**祝你成功！** 🚀

如有問題，請查看完整文檔或在 GitHub 上提出 Issue。

