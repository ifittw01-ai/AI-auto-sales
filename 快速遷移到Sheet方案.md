# ⚡ 快速遷移到 Google Sheet 方案

只需 **5 分鐘**，讓你的系統升級到更靈活的管理方式！

---

## 📋 快速步驟

### 1️⃣ 創建 Google Sheet（2 分鐘）

**方法 A：使用 CSV 快速導入**

1. 前往 [Google Sheets](https://sheets.google.com)
2. 點擊「空白」創建新試算表
3. 命名為：`推廣人員郵箱管理`
4. 點擊「檔案」→「匯入」→「上傳」
5. 上傳專案中的 `推廣人員郵箱範本.csv` 文件
6. 選擇「取代目前的工作表」→「匯入資料」
7. 將分頁名稱改為：`推廣人員`

**方法 B：手動建立**

1. 前往 [Google Sheets](https://sheets.google.com)
2. 創建新試算表，命名為：`推廣人員郵箱管理`
3. 將分頁名稱改為：`推廣人員`
4. 在第一列輸入標題：

| A | B | C |
|---|---|---|
| 推廣代碼 | 郵箱 | 姓名 |

5. 從第二列開始填入你現有的推廣人員資料

**✅ 取得 Sheet ID：**

查看網址列：
```
https://docs.google.com/spreadsheets/d/【複製這段ID】/edit
```

📝 **複製並保存這個 ID！**

---

### 2️⃣ 更新 Google Apps Script（2 分鐘）

1. 前往 [Google Apps Script](https://script.google.com)
2. 打開你的專案
3. **完整複製** `google-apps-script-updated.js` 的內容
4. 貼到 `Code.gs` 中（覆蓋舊代碼）
5. 找到第 22 行，修改 `SPREADSHEET_ID`：

```javascript
// 修改前：
const SPREADSHEET_ID = '請替換成你的SHEET_ID';

// 修改後（填入你的 Sheet ID）：
const SPREADSHEET_ID = '你剛才複製的ID';
```

6. 點擊「儲存」💾

---

### 3️⃣ 授權並部署（1 分鐘）

**授權 Sheet 存取權限：**

1. 點擊上方函數選擇器，選擇 `getEmailMapping`
2. 點擊「執行」▶️
3. 會彈出授權視窗：
   - 點擊「審查權限」
   - 選擇你的 Google 帳戶
   - 點擊「進階」→「前往（專案名稱）」
   - 點擊「允許」

**重新部署：**

1. 點擊「部署」→「管理部署」
2. 點擊「✏️ 編輯」
3. 版本：選擇「新增版本」
4. 說明：`改用 Google Sheet + 緩存方案`
5. 點擊「部署」

✅ **完成！**

---

### 4️⃣ 測試（可選）

在 Google Apps Script 中：

1. 選擇函數：`getEmailMapping`
2. 點擊執行 ▶️
3. 點擊左側「執行作業」查看記錄
4. 應該顯示：`✅ 成功讀取 X 個推廣代碼`

---

## 🎉 遷移完成！現在你可以：

### ✅ 添加新推廣人員
→ 直接在 Google Sheet 新增一列，**無需重新部署**！

### ✅ 修改郵箱
→ 直接在 Google Sheet 修改，10 分鐘內生效！

### ✅ 授權他人管理
→ 只需分享 Google Sheet 編輯權限！

### ✅ 隨時查看所有推廣人員
→ 打開 Google Sheet 一目了然！

---

## 📚 更多資訊

- **完整設定指南：** `Google-Sheet-郵箱管理設定.md`
- **CSV 範本：** `推廣人員郵箱範本.csv`
- **疑難排解：** 查看 `Google-Sheet-郵箱管理設定.md` 的「常見問題」章節

---

## 🔄 回滾方案（如果需要）

如果遇到問題想回到舊版本：

1. 前往 Google Apps Script
2. 點擊「部署」→「管理部署」
3. 選擇之前的版本
4. 點擊「還原」

**或者：**

查看 git 歷史記錄，找到上一個版本的 `google-apps-script-updated.js`

---

## 💡 溫馨提示

- 緩存時間為 10 分鐘，更新 Sheet 後最多 10 分鐘生效
- 想要立即生效？執行 `clearCache` 函數
- 建議定期匯出 Sheet 為 CSV 備份

---

🚀 **準備好了嗎？開始遷移吧！**

