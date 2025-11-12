// ========================================
// Google Apps Script - 简化版（只加载地址）
// ========================================
// 功能：从 Google Sheet 读取评估地点并返回
// 不包含：日期过滤、容量限制、剩余名额显示

// ========================================
// 配置设置
// ========================================
const SPREADSHEET_ID = '1tvKaa07m-lxqyF4ZWgpOsC2ESiXBvNeN5IbA013lEf0';  // 你的 Google Sheet ID
const SHEET_NAME_PROMOTERS = '推廣人員';  // 推广人员工作表
const SHEET_NAME_REGIONS = '評估地點';    // 评估地点工作表
const SHEET_NAME_CUSTOMERS = '客戶報名記錄';  // 客户报名记录工作表
const DEFAULT_EMAIL = 'jordantsai777@gmail.com';
const CACHE_DURATION = 600;  // 缓存时间（秒）- 10 分钟

// ========================================
// 从 Google Sheet 读取推广人员信息（含缓存）
// ========================================
function getPromoterMapping() {
  try {
    const cache = CacheService.getScriptCache();
    const cachedData = cache.get('PROMOTER_MAPPING');
    
    if (cachedData) {
      Logger.log('✅ 从缓存读取推广人员信息');
      return JSON.parse(cachedData);
    }
    
    Logger.log('📊 从 Google Sheet 读取推广人员信息...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME_PROMOTERS);
    
    if (!sheet) {
      Logger.log('❌ 找不到工作表: ' + SHEET_NAME_PROMOTERS);
      return {};
    }
    
    const data = sheet.getDataRange().getValues();
    const mapping = {};
    
    for (let i = 1; i < data.length; i++) {
      const refCode = String(data[i][0]).trim();
      const email = String(data[i][1]).trim();
      const name = String(data[i][2] || '').trim() || 'AI+自媒體創業系統';  // C列：姓名，如果没有则使用默认值
      
      if (refCode && email) {
        mapping[refCode] = {
          email: email,
          name: name
        };
      }
    }
    
    Logger.log('✅ 成功读取 ' + Object.keys(mapping).length + ' 个推广人员信息');
    cache.put('PROMOTER_MAPPING', JSON.stringify(mapping), CACHE_DURATION);
    
    return mapping;
    
  } catch (error) {
    Logger.log('❌ 读取推广人员信息失败: ' + error);
    return {};
  }
}

// ========================================
// 获取评估地点列表（简化版 - 只读取数据）
// ========================================
function getRegionList() {
  try {
    Logger.log('📍 正在读取评估地点列表...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME_REGIONS);
    
    if (!sheet) {
      Logger.log('❌ 找不到工作表: ' + SHEET_NAME_REGIONS);
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    const regions = [];
    
    // 从第二列开始读取（第一列是标题）
    for (let i = 1; i < data.length; i++) {
      const id = String(data[i][0]).trim();        // A列：选项ID
      const sortOrder = data[i][1] || 999;         // B列：排序
      const fullDesc = String(data[i][2]).trim();  // C列：完整描述
      const enabled = String(data[i][3]).trim();   // D列：是否启用
      
      // 只检查是否启用
      if (enabled === '是' && id && fullDesc) {
        regions.push({
          id: id,
          text: fullDesc,
          sortOrder: sortOrder
        });
      }
    }
    
    // 按排序顺序排列
    regions.sort((a, b) => a.sortOrder - b.sortOrder);
    
    Logger.log('✅ 成功读取 ' + regions.length + ' 个评估地点');
    return regions;
    
  } catch (error) {
    Logger.log('❌ 读取评估地点失败: ' + error);
    Logger.log('详细错误: ' + error.stack);
    return [];
  }
}

// ========================================
// 根据推广代码获取推广人员信息
// ========================================
function getPromoterInfo(refCode) {
  const promoterMapping = getPromoterMapping();
  const defaultInfo = {
    email: DEFAULT_EMAIL,
    name: 'AI+自媒體創業系統'
  };
  
  const promoterInfo = promoterMapping[refCode] || defaultInfo;
  
  Logger.log('🔍 推广代码: ' + (refCode || '无'));
  Logger.log('📧 推广人员邮箱: ' + promoterInfo.email);
  Logger.log('👤 推广人员姓名: ' + promoterInfo.name);
  
  return promoterInfo;
}

// ========================================
// 保存客户资料到 Google Sheet
// ========================================
function saveCustomerToSheet(customerData) {
  try {
    Logger.log('💾 正在保存客户资料到 Google Sheet...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME_CUSTOMERS);
    
    // 如果工作表不存在，创建它并添加标题行
    if (!sheet) {
      Logger.log('📝 创建新工作表: ' + SHEET_NAME_CUSTOMERS);
      sheet = spreadsheet.insertSheet(SHEET_NAME_CUSTOMERS);
      
      // 添加标题行（加粗、背景色）
      const headers = [
        '報名時間', '客戶姓名', '電話號碼', '電子郵件', 
        '國家地區', '行業', '評估地區', 
        'LINE ID', 'WhatsApp', '訂閱電子報',
        '推廣代碼', '推廣人員姓名', '推廣人員郵箱'
      ];
      
      sheet.appendRow(headers);
      
      // 设置标题行格式
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
      
      // 冻结标题行
      sheet.setFrozenRows(1);
      
      // 自动调整列宽
      for (let i = 1; i <= headers.length; i++) {
        sheet.autoResizeColumn(i);
      }
    }
    
    // 添加客户数据
    const timestamp = new Date();
    const rowData = [
      timestamp,                      // 报名时间
      customerData.customerName,      // 客户姓名
      customerData.customerPhone,     // 电话号码
      customerData.customerEmail,     // 电子邮件
      customerData.customerCountry,   // 国家地区
      customerData.customerIndustry,  // 行业
      customerData.customerRegion,    // 评估地区
      customerData.customerLineId,    // LINE ID
      customerData.customerWhatsapp,  // WhatsApp
      customerData.newsletter,        // 訂閱電子報
      customerData.refCode || '無',   // 推廣代碼
      customerData.promoterName || 'AI+自媒體創業系統',  // 推廣人員姓名
      customerData.targetEmail        // 推廣人員郵箱
    ];
    
    sheet.appendRow(rowData);
    
    Logger.log('✅ 成功保存客户资料到 Google Sheet');
    return true;
    
  } catch (error) {
    Logger.log('❌ 保存客户资料失败: ' + error);
    Logger.log('详细错误: ' + error.stack);
    return false;
  }
}

// ========================================
// 处理 GET 请求 - 提供评估地点 API
// ========================================
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    // 获取评估地点列表
    if (action === 'getRegions') {
      const regions = getRegionList();
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        regions: regions,
        count: regions.length
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 默认响应
    return ContentService.createTextOutput(
      'Google Apps Script 正在运行！\n\n' +
      '可用的 API：\n' +
      '- ?action=getRegions - 获取评估地点列表'
    );
    
  } catch (error) {
    Logger.log('❌ GET 请求处理失败: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ========================================
// 处理 POST 请求 - 处理表单提交
// ========================================
function doPost(e) {
  try {
    const params = e.parameter;
    
    // 获取推广代码和推广人员信息
    const refCode = params.ref || params['推廣代碼'] || '';
    const promoterInfo = getPromoterInfo(refCode);
    
    // 获取客户资料
    const customerName = params['姓名'] || '';
    const customerEmail = params['電子郵件'] || '';
    const customerPhone = params['電話號碼'] || params['電話'] || '';
    const customerCountry = params['國家地區'] || '';
    const customerIndustry = params['行業'] || '';
    const customerRegion = params['評估地區'] || '';
    const customerLineId = params['LINE_ID'] || params['LINE ID'] || '未提供';
    const customerWhatsapp = params['WhatsApp號碼'] || params['WhatsApp'] || '未提供';
    const newsletter = params['訂閱電子報'] === 'on' ? '是' : '否';
    
    Logger.log('📧 准备发送邮件...');
    Logger.log('推广代码: ' + refCode);
    Logger.log('推广人员: ' + promoterInfo.name + ' (' + promoterInfo.email + ')');
    Logger.log('客户姓名: ' + customerName);
    Logger.log('客户邮箱: ' + customerEmail);
    Logger.log('客户电话: ' + customerPhone);
    Logger.log('评估地区: ' + customerRegion);
    
    // 💾 保存客户资料到 Google Sheet
    const customerData = {
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      customerCountry: customerCountry,
      customerIndustry: customerIndustry,
      customerRegion: customerRegion,
      customerLineId: customerLineId,
      customerWhatsapp: customerWhatsapp,
      newsletter: newsletter,
      refCode: refCode,
      targetEmail: promoterInfo.email,
      promoterName: promoterInfo.name
    };
    
    saveCustomerToSheet(customerData);
    
    // 發送通知郵件給推廣人員
    const promoterSubject = `🎯 新客戶報名通知 - ${customerName}`;
    const promoterBody = `
親愛的 ${promoterInfo.name}，

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
請儘快聯繫這位客戶，提供優質的服務體驗！

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
        to: promoterInfo.email,
        subject: promoterSubject,
        body: promoterBody
      });
      Logger.log('✅ 已发送邮件给推广人员: ' + promoterInfo.email);
    } catch (error) {
      Logger.log('❌ 发送推广人员邮件失败: ' + error);
    }
    
    // 發送確認郵件給報名客戶
    if (customerEmail) {
      const customerSubject = `感謝您報名「AI+自媒體創業系統」`;
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
您的專屬服務顧問：
👤 姓名：${promoterInfo.name}
📧 郵箱：${promoterInfo.email}

如有任何疑問，歡迎直接聯繫您的顧問！

---
AI+自媒體創業系統 團隊
      `.trim();
      
      try {
        MailApp.sendEmail({
          to: customerEmail,
          subject: customerSubject,
          body: customerBody
        });
        Logger.log('✅ 已发送确认邮件给客户: ' + customerEmail);
      } catch (error) {
        Logger.log('❌ 发送客户确认邮件失败: ' + error);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: '提交成功！',
      targetEmail: promoterInfo.email,
      promoterName: promoterInfo.name
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('❌ 处理失败: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: '处理失败: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ========================================
// 手动清除缓存（用于测试）
// ========================================
function clearCache() {
  const cache = CacheService.getScriptCache();
  cache.remove('EMAIL_MAPPING');
  cache.remove('PROMOTER_MAPPING');
  Logger.log('🗑️ 缓存已清除');
}

// ========================================
// 调试函数：查看推广人员数据（用于排查问题）
// ========================================
function debugPromoterData() {
  try {
    Logger.log('=== 开始调试推广人员数据 ===');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME_PROMOTERS);
    
    if (!sheet) {
      Logger.log('❌ 找不到工作表: ' + SHEET_NAME_PROMOTERS);
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    
    Logger.log('📊 工作表总行数: ' + data.length);
    Logger.log('📋 标题行 (第1行): ' + JSON.stringify(data[0]));
    Logger.log('');
    
    // 显示所有推广人员数据
    for (let i = 1; i < data.length; i++) {
      const refCode = String(data[i][0]).trim();
      const email = String(data[i][1]).trim();
      const name = String(data[i][2] || '').trim();
      
      Logger.log(`第 ${i+1} 行数据:`);
      Logger.log(`  推广代码 (A列): "${refCode}"`);
      Logger.log(`  邮箱 (B列): "${email}"`);
      Logger.log(`  姓名 (C列): "${name}"`);
      Logger.log(`  是否有效: ${refCode && email ? '✅' : '❌'}`);
      Logger.log('');
    }
    
    // 测试读取函数
    Logger.log('=== 测试 getPromoterMapping() 函数 ===');
    const mapping = getPromoterMapping();
    Logger.log('读取到的映射表:');
    for (let code in mapping) {
      Logger.log(`  "${code}" => { email: "${mapping[code].email}", name: "${mapping[code].name}" }`);
    }
    
    Logger.log('=== 调试完成 ===');
    
  } catch (error) {
    Logger.log('❌ 调试失败: ' + error);
    Logger.log('详细错误: ' + error.stack);
  }
}

// ========================================
// 测试函数：测试特定推广代码
// ========================================
function testPromoterCode() {
  // 👇 在这里输入您要测试的推广代码
  const testCode = '001';  // 修改为您实际使用的推广代码
  
  Logger.log('=== 测试推广代码: ' + testCode + ' ===');
  
  const promoterInfo = getPromoterInfo(testCode);
  
  Logger.log('📧 推广人员邮箱: ' + promoterInfo.email);
  Logger.log('👤 推广人员姓名: ' + promoterInfo.name);
  
  if (promoterInfo.name === 'AI+自媒體創業系統') {
    Logger.log('⚠️ 警告：使用的是默认值，说明推广代码 "' + testCode + '" 没有在 Sheet 中找到！');
  } else {
    Logger.log('✅ 成功找到推广人员信息！');
  }
}

// ========================================
// 测试函数：模拟客户邮件内容
// ========================================
function testCustomerEmail() {
  // 👇 修改这里来测试不同的推广代码
  const testRefCode = '001';  // 测试推广代码，留空则测试无推广代码的情况
  const testCustomerName = '測試客戶';
  const testCustomerRegion = '台北市信義區 - 1月15日 下午2:00';
  
  Logger.log('=== 模拟客户确认邮件 ===');
  Logger.log('测试推广代码: ' + (testRefCode || '无（直接访问）'));
  Logger.log('');
  
  // 获取推广人员信息
  const promoterInfo = getPromoterInfo(testRefCode);
  
  Logger.log('读取到的推广人员信息:');
  Logger.log('  姓名: ' + promoterInfo.name);
  Logger.log('  邮箱: ' + promoterInfo.email);
  Logger.log('');
  
  // 生成郵件內容
  const regionInfo = testCustomerRegion ? `\n\n記得您的時間與地址：${testCustomerRegion}` : '';
  
  const customerBody = `
${testCustomerName}，

感謝您對「AI+自媒體創業系統」有興趣！${regionInfo}

歡迎您的到來！

如欲詢問問題，請點選以下連結加入官方社群：
👉 https://line.me/ti/g2/lwbHM8cXtERXRSpCKRNz1q7769jgTxzsKA7iTw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default

🔑 密碼：13579

我們期待與您在社群中見面，一起探索 AI 創業的無限可能！🚀

---
您的專屬服務顧問：
👤 姓名：${promoterInfo.name}
📧 郵箱：${promoterInfo.email}

如有任何疑問，歡迎直接聯繫您的顧問！

---
AI+自媒體創業系統 團隊
  `.trim();
  
  Logger.log('=== 客户将收到的邮件内容 ===');
  Logger.log(customerBody);
  Logger.log('');
  Logger.log('=== 测试完成 ===');
  
  // 检查是否使用默认值
  if (promoterInfo.name === 'AI+自媒體創業系統') {
    Logger.log('');
    Logger.log('⚠️⚠️⚠️ 警告 ⚠️⚠️⚠️');
    Logger.log('客户邮件中显示的是默认值 "AI+自媒體創業系統"');
    Logger.log('原因：推广代码 "' + testRefCode + '" 在 Google Sheet 中找不到匹配项');
    Logger.log('');
    Logger.log('请检查：');
    Logger.log('1. 客户访问的 URL 是否包含正确的 ?ref=' + testRefCode);
    Logger.log('2. Google Sheet 中是否有 "' + testRefCode + '" 这个推广代码');
    Logger.log('3. 推广代码是否完全一致（区分大小写）');
  } else {
    Logger.log('✅ 推广人员信息显示正常！');
  }
}

