// ========================================
// Google Apps Script - 處理表單提交並發送郵件 (使用 Google Sheet + 緩存)
// ========================================
// 部署說明：
// 1. 創建 Google Sheet，命名為「推廣人員郵箱管理」
//    第一列為標題：推廣代碼 | 郵箱 | 姓名（選填）
//    從第二列開始填入資料
// 2. 前往 https://script.google.com
// 3. 找到你現有的專案（或創建新專案）
// 4. 將此代碼複製到 Code.gs 中
// 5. 修改下方的 SPREADSHEET_ID 為你的 Google Sheet ID
// 6. 部署為網頁應用程式
// 7. 授權存取權限
// 8. 複製網頁應用程式 URL 到 script.js 的 GOOGLE_SCRIPT_URL

// ========================================
// 配置設定
// ========================================
// ⚠️ 請將下方的 SPREADSHEET_ID 改為你的 Google Sheet ID
// 如何取得？打開你的 Google Sheet，網址中的長串英數字即為 ID
// 例如：https://docs.google.com/spreadsheets/d/【這裡就是ID】/edit
const SPREADSHEET_ID = '1tvKaa07m-lxqyF4ZWgpOsC2ESiXBvNeN5IbA013lEf0';  // ⚠️ 必須修改
const SHEET_NAME = '推廣人員';  // Sheet 分頁名稱
const DEFAULT_EMAIL = 'jordantsai777@gmail.com';  // 預設郵箱（找不到推廣代碼時使用）
const CACHE_DURATION = 600;  // 緩存時間（秒）- 10 分鐘

// ========================================
// 從 Google Sheet 讀取郵箱映射表（含緩存）
// ========================================
function getEmailMapping() {
  try {
    // 1. 先嘗試從緩存讀取
    const cache = CacheService.getScriptCache();
    const cachedData = cache.get('EMAIL_MAPPING');
    
    if (cachedData) {
      Logger.log('✅ 從緩存讀取郵箱映射表');
      return JSON.parse(cachedData);
    }
    
    // 2. 緩存過期，從 Sheet 讀取
    Logger.log('📊 從 Google Sheet 讀取郵箱映射表...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      Logger.log('❌ 找不到工作表: ' + SHEET_NAME);
      return {};
    }
    
    const data = sheet.getDataRange().getValues();
    const mapping = {};
    
    // 從第二列開始讀取（第一列是標題）
    for (let i = 1; i < data.length; i++) {
      const refCode = String(data[i][0]).trim();  // 第一欄：推廣代碼
      const email = String(data[i][1]).trim();     // 第二欄：郵箱
      
      if (refCode && email) {
        mapping[refCode] = email;
      }
    }
    
    Logger.log('✅ 成功讀取 ' + Object.keys(mapping).length + ' 個推廣代碼');
    
    // 3. 存入緩存（10 分鐘）
    cache.put('EMAIL_MAPPING', JSON.stringify(mapping), CACHE_DURATION);
    
    return mapping;
    
  } catch (error) {
    Logger.log('❌ 讀取郵箱映射表失敗: ' + error);
    Logger.log('⚠️ 請檢查 SPREADSHEET_ID 是否正確');
    return {};
  }
}

// ========================================
// 根據推廣代碼獲取目標郵箱
// ========================================
function getTargetEmail(refCode) {
  const emailMapping = getEmailMapping();
  const targetEmail = emailMapping[refCode] || DEFAULT_EMAIL;
  
  Logger.log('🔍 推廣代碼: ' + (refCode || '無'));
  Logger.log('📧 目標郵箱: ' + targetEmail);
  
  return targetEmail;
}

// ========================================
// 手動清除緩存（用於測試）
// ========================================
function clearCache() {
  const cache = CacheService.getScriptCache();
  cache.remove('EMAIL_MAPPING');
  Logger.log('🗑️ 緩存已清除');
}

// ========================================
// 主函數 - 處理 POST 請求
// ========================================
function doPost(e) {
  try {
    // 解析表單數據
    const params = e.parameter;
    
    // 獲取推廣代碼和目標郵箱（從 Google Sheet 讀取）
    const refCode = params.ref || params['推廣代碼'] || '';
    const targetEmail = getTargetEmail(refCode);
    
    // 獲取客戶資料
    const customerName = params['姓名'] || '';
    const customerEmail = params['電子郵件'] || '';
    const customerPhone = params['電話號碼'] || params['電話'] || '';
    const customerCountry = params['國家地區'] || '';
    const customerIndustry = params['行業'] || '';
    const customerRegion = params['評估地區'] || '';
    const customerLineId = params['LINE_ID'] || params['LINE ID'] || '未提供';
    const customerWhatsapp = params['WhatsApp號碼'] || params['WhatsApp'] || '未提供';
    const newsletter = params['訂閱電子報'] === 'on' ? '是' : '否';
    
    Logger.log('📧 準備發送郵件...');
    Logger.log('推廣代碼: ' + refCode);
    Logger.log('目標郵箱: ' + targetEmail);
    Logger.log('客戶姓名: ' + customerName);
    Logger.log('客戶郵箱: ' + customerEmail);
    Logger.log('客戶電話: ' + customerPhone);
    Logger.log('國家地區: ' + customerCountry);
    Logger.log('行業: ' + customerIndustry);
    Logger.log('評估地區: ' + customerRegion);
    Logger.log('LINE ID: ' + customerLineId);
    Logger.log('WhatsApp: ' + customerWhatsapp);
    
    // ========================================
    // 1. 發送通知郵件給推廣人員
    // ========================================
    const promoterSubject = `🎯 新客戶報名通知 - ${customerName}`;
    const promoterBody = `
親愛的推廣夥伴，

恭喜！您有一位新客戶報名了！

=== 📋 客戶資訊 ===
姓名：${customerName}
電子郵件：${customerEmail}
電話：${customerPhone}
國家地區：${customerCountry}
行業：${customerIndustry}
評估地區：${customerRegion}
LINE ID：${customerLineId}
WhatsApp：${customerWhatsapp}
訂閱電子報：${newsletter}

推廣代碼：${refCode || '無（預設）'}

=== 📞 下一步行動 ===
請盡快聯繫這位客戶，提供優質的服務體驗！

建議聯繫方式：
📧 Email: ${customerEmail}
📱 WhatsApp: ${customerWhatsapp !== '未提供' ? customerWhatsapp : customerPhone}
💬 LINE: ${customerLineId}

祝您成交順利！🎉

---
AI+自媒體創業系統
自動通知系統
    `.trim();
    
    try {
      MailApp.sendEmail({
        to: targetEmail,
        subject: promoterSubject,
        body: promoterBody
      });
      Logger.log('✅ 已發送郵件給推廣人員: ' + targetEmail);
    } catch (error) {
      Logger.log('❌ 發送推廣人員郵件失敗: ' + error);
    }
    
    // ========================================
    // 2. 發送確認郵件給報名客戶
    // ========================================
    if (customerEmail) {
      const customerSubject = `感謝您報名「AI+自媒體創業系統」`;
      
      // 準備地區信息顯示
      const regionInfo = customerRegion ? `\n\n記得您的時間與地址：${customerRegion}` : '';
      
      const customerBody = `
${customerName}，

感謝您對「AI+自媒體創業系統」有興趣！${regionInfo}

歡迎您的到來！

如欲詢問問題，請點選以下連結加入官方社群：
👉 https://line.me/ti/g2/lwbHM8cXtERXRSpCKRNz1q7769jgTxzsKA7iTw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default

🔑 密碼：13579

我們期待與您在社群中見面，一起探索 AI 創業的無限可能！🚀

---
AI+自媒體創業系統 團隊
      `.trim();
      
      try {
        MailApp.sendEmail({
          to: customerEmail,
          subject: customerSubject,
          body: customerBody
        });
        Logger.log('✅ 已發送確認郵件給客戶: ' + customerEmail);
      } catch (error) {
        Logger.log('❌ 發送客戶確認郵件失敗: ' + error);
      }
    }
    
    // 返回成功響應
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: '提交成功！',
      targetEmail: targetEmail
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('❌ 處理失敗: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: '處理失敗: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ========================================
// 測試函數（可選）
// ========================================
function doGet(e) {
  return ContentService.createTextOutput('Google Apps Script 正在運行！請使用 POST 方法提交表單。');
}
