# 🔧 GitHub Pages 表單問題排查

## 問題：網站沒有出現表單

Repository: https://github.com/ifittw01-ai/AI-auto-sales/

---

## 立即檢查清單

### ✅ 步驟 1：確認 GitHub Pages 狀態

1. **前往 Settings**
   - 打開：https://github.com/ifittw01-ai/AI-auto-sales/settings/pages
   - 或：Repository → Settings → Pages

2. **檢查部署狀態**
   - 是否看到：「Your site is published at...」？
   - 網址應該是：`https://ifittw01-ai.github.io/AI-auto-sales/`

3. **如果沒有啟用**
   - Source: 選擇「Deploy from a branch」
   - Branch: 選擇「main」
   - Folder: 選擇「/ (root)」
   - 點擊「Save」
   - **等待 1-2 分鐘**

---

### ✅ 步驟 2：檢查部署狀態

1. **查看 Actions**
   - 前往：https://github.com/ifittw01-ai/AI-auto-sales/actions
   - 查看最新的 workflow run
   - 應該看到綠色勾勾（✓）表示成功

2. **如果看到紅色 X**
   - 點擊進去查看錯誤訊息
   - 可能需要修正某些問題

---

### ✅ 步驟 3：訪問正確的網址

您的 GitHub Pages 網址是：
```
https://ifittw01-ai.github.io/AI-auto-sales/
```

**注意事項：**
- ✅ 用戶名全小寫：`ifittw01-ai`
- ✅ Repository 名稱：`AI-auto-sales`
- ✅ 結尾有斜線：`/`

**錯誤的網址（不要使用）：**
- ❌ `https://github.com/ifittw01-ai/AI-auto-sales/` （這是 repository，不是網站）
- ❌ `https://ifittw01-ai.github.io/ai-auto-sales/` （大小寫錯誤）

---

### ✅ 步驟 4：測試網站

1. **開啟正確網址**
   ```
   https://ifittw01-ai.github.io/AI-auto-sales/
   ```

2. **等待載入**
   - 第一次訪問可能需要幾秒鐘

3. **檢查頁面**
   - 應該看到銷售頁面
   - 有「我要優惠」按鈕
   - 點擊後應該出現表單彈窗

---

### ✅ 步驟 5：檢查瀏覽器控制台

如果網站能開啟但表單不出現：

1. **按 F12** 開啟開發者工具
2. **點擊 Console 標籤**
3. **查看是否有錯誤訊息**

常見錯誤：
- `Failed to load script.js` → JavaScript 檔案沒有載入
- `Uncaught ReferenceError` → 程式碼有錯誤
- `404 Not Found` → 檔案路徑錯誤

---

## 🔧 可能的問題和解決方案

### 問題 1：GitHub Pages 沒啟用

**症狀：**
- 訪問網址顯示 404
- 或顯示「There isn't a GitHub Pages site here.」

**解決：**
1. Settings → Pages
2. Source: 選擇「Deploy from a branch」
3. Branch: main, Folder: / (root)
4. Save
5. 等待 1-2 分鐘

---

### 問題 2：檔案沒有正確上傳

**症狀：**
- 網站顯示但樣式錯亂
- 點擊按鈕沒反應

**檢查：**
1. 前往 Repository 主頁
2. 確認這些檔案存在：
   - ✅ index.html
   - ✅ script.js
   - ✅ styles.css
   - ✅ records.html

**解決：**
如果檔案缺失，重新上傳：
```bash
git add index.html script.js styles.css records.html
git commit -m "Add missing files"
git push origin main
```

---

### 問題 3：瀏覽器快取

**症狀：**
- 看到舊版本的頁面
- 修改後沒有更新

**解決：**
- 按 **Ctrl + F5** 強制重新載入
- 或清除瀏覽器快取

---

### 問題 4：JavaScript 錯誤

**症狀：**
- 頁面載入但按鈕點擊沒反應
- Console 有錯誤訊息

**解決：**
1. 檢查 Console 的錯誤訊息
2. 確認 script.js 沒有語法錯誤
3. 確認所有必要的配置都已設定

---

### 問題 5：路徑問題

**症狀：**
- CSS 或 JS 沒有載入
- Console 顯示 404 錯誤

**檢查 index.html：**
```html
<!-- 應該是相對路徑 -->
<link rel="stylesheet" href="styles.css">
<script src="script.js"></script>

<!-- 不應該是絕對路徑 -->
<link rel="stylesheet" href="/styles.css">  ❌
<script src="/script.js"></script>  ❌
```

---

## 🧪 完整測試流程

### 1. 確認部署
```
https://github.com/ifittw01-ai/AI-auto-sales/actions
```
→ 最新的 workflow 應該是綠色 ✓

### 2. 訪問網站
```
https://ifittw01-ai.github.io/AI-auto-sales/
```
→ 應該看到銷售頁面

### 3. 測試表單
- 點擊「我要優惠」按鈕
- 表單彈窗應該出現
- 填寫資料並提交

### 4. 驗證 Google 表單
- 開啟 Google 表單
- 查看「回應」
- 確認資料有進入

---

## 📞 如果還是不行

### 提供以下資訊：

1. **GitHub Pages 狀態**
   - Settings → Pages 頁面的截圖

2. **Actions 狀態**
   - https://github.com/ifittw01-ai/AI-auto-sales/actions
   - 最新 workflow 的狀態

3. **瀏覽器 Console**
   - 訪問網站後按 F12
   - Console 的錯誤訊息截圖

4. **Network 標籤**
   - F12 → Network 標籤
   - 重新載入頁面
   - 看看哪些檔案載入失敗（紅色）

---

## 🎯 最可能的原因

根據經驗，90% 的問題是：

### 原因 1：GitHub Pages 沒啟用
→ 去 Settings → Pages 啟用

### 原因 2：等待時間不夠
→ 第一次部署需要 2-5 分鐘，要有耐心

### 原因 3：網址錯誤
→ 使用正確網址：`https://ifittw01-ai.github.io/AI-auto-sales/`

### 原因 4：瀏覽器快取
→ 按 Ctrl + F5 強制重新載入

---

## ✅ 快速解決步驟

1. **啟用 GitHub Pages**（如果還沒有）
2. **等待 2 分鐘**
3. **清除快取**（Ctrl + F5）
4. **訪問正確網址**：`https://ifittw01-ai.github.io/AI-auto-sales/`
5. **按 F12 查看 Console**
6. **測試表單功能**

完成！

