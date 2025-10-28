// ========================================
// Google Apps Script - 處理表單提交並發送郵件
// ========================================
// 部署說明：
// 1. 前往 https://script.google.com
// 2. 找到你現有的專案（或創建新專案）
// 3. 將此代碼複製到 Code.gs 中
// 4. 部署為網頁應用程式
// 5. 授權存取權限
// 6. 複製網頁應用程式 URL 到 script.js 的 GOOGLE_SCRIPT_URL

// ========================================
// 推廣人員郵箱對照表（與 script.js 保持一致）
// ========================================
const EMAIL_MAPPING = {
    "jordantsai777": "jordantsai777@gmail.com",
    "jordantsai07": "jordantsai07@gmail.com",
    "001": "cchaha888@gmail.com",
    "002": "a0928127137@gmail.com",
    "003": "peter.w2520701@gmail.com"
};

const DEFAULT_EMAIL = 'jordantsai777@gmail.com';

// ========================================
// 主函數 - 處理 POST 請求
// ========================================
function doPost(e) {
  try {
    // 解析表單數據
    const params = e.parameter;
    
    // 獲取推廣代碼和目標郵箱
    const refCode = params.ref || params['推廣代碼'] || '';
    const targetEmail = EMAIL_MAPPING[refCode] || DEFAULT_EMAIL;
    
    // 獲取客戶資料
    const customerName = params['姓名'] || '';
    const customerEmail = params['電子郵件'] || '';
    const customerPhone = params['電話'] || '';
    const customerCountry = params['國家地區'] || '';
    const customerIndustry = params['行業'] || '';
    const customerRegion = params['評估地區'] || '';
    const customerLineId = params['LINE ID'] || '未提供';
    const customerWhatsapp = params['WhatsApp'] || '未提供';
    const newsletter = params['訂閱電子報'] === 'on' ? '是' : '否';
    
    Logger.log('📧 準備發送郵件...');
    Logger.log('推廣代碼: ' + refCode);
    Logger.log('目標郵箱: ' + targetEmail);
    Logger.log('客戶郵箱: ' + customerEmail);
    Logger.log('客戶姓名: ' + customerName);
    Logger.log('評估地區: ' + customerRegion);
    
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

