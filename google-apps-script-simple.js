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
const DEFAULT_EMAIL = 'jordantsai777@gmail.com';
const CACHE_DURATION = 600;  // 缓存时间（秒）- 10 分钟

// ========================================
// 从 Google Sheet 读取邮箱映射表（含缓存）
// ========================================
function getEmailMapping() {
  try {
    const cache = CacheService.getScriptCache();
    const cachedData = cache.get('EMAIL_MAPPING');
    
    if (cachedData) {
      Logger.log('✅ 从缓存读取邮箱映射表');
      return JSON.parse(cachedData);
    }
    
    Logger.log('📊 从 Google Sheet 读取邮箱映射表...');
    
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
      
      if (refCode && email) {
        mapping[refCode] = email;
      }
    }
    
    Logger.log('✅ 成功读取 ' + Object.keys(mapping).length + ' 个推广代码');
    cache.put('EMAIL_MAPPING', JSON.stringify(mapping), CACHE_DURATION);
    
    return mapping;
    
  } catch (error) {
    Logger.log('❌ 读取邮箱映射表失败: ' + error);
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
// 根据推广代码获取目标邮箱
// ========================================
function getTargetEmail(refCode) {
  const emailMapping = getEmailMapping();
  const targetEmail = emailMapping[refCode] || DEFAULT_EMAIL;
  
  Logger.log('🔍 推广代码: ' + (refCode || '无'));
  Logger.log('📧 目标邮箱: ' + targetEmail);
  
  return targetEmail;
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
    
    // 获取推广代码和目标邮箱
    const refCode = params.ref || params['推廣代碼'] || '';
    const targetEmail = getTargetEmail(refCode);
    
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
    Logger.log('目标邮箱: ' + targetEmail);
    Logger.log('客户姓名: ' + customerName);
    Logger.log('客户邮箱: ' + customerEmail);
    Logger.log('客户电话: ' + customerPhone);
    Logger.log('评估地区: ' + customerRegion);
    
    // 发送通知邮件给推广人员
    const promoterSubject = `🎯 新客户报名通知 - ${customerName}`;
    const promoterBody = `
亲爱的推广伙伴，

恭喜！您有一位新客户报名了！

=== 📋 客户资讯 ===
姓名：${customerName}
电子邮件：${customerEmail}
电话：${customerPhone}
国家地区：${customerCountry}
行业：${customerIndustry}
评估地区：${customerRegion}
LINE ID：${customerLineId}
WhatsApp：${customerWhatsapp}
订阅电子报：${newsletter}

推广代码：${refCode || '无（预设）'}

=== 📞 下一步行动 ===
请尽快联系这位客户，提供优质的服务体验！

建议联系方式：
📧 Email: ${customerEmail}
📱 WhatsApp: ${customerWhatsapp !== '未提供' ? customerWhatsapp : customerPhone}
💬 LINE: ${customerLineId}

祝您成交顺利！🎉

---
AI+自媒体创业系统
自动通知系统
    `.trim();
    
    try {
      MailApp.sendEmail({
        to: targetEmail,
        subject: promoterSubject,
        body: promoterBody
      });
      Logger.log('✅ 已发送邮件给推广人员: ' + targetEmail);
    } catch (error) {
      Logger.log('❌ 发送推广人员邮件失败: ' + error);
    }
    
    // 发送确认邮件给报名客户
    if (customerEmail) {
      const customerSubject = `感谢您报名「AI+自媒体创业系统」`;
      const regionInfo = customerRegion ? `\n\n记得您的时间与地址：${customerRegion}` : '';
      
      const customerBody = `
${customerName}，

感谢您对「AI+自媒体创业系统」有兴趣！${regionInfo}

欢迎您的到来！

如欲询问问题，请点选以下连结加入官方社群：
👉 https://line.me/ti/g2/lwbHM8cXtERXRSpCKRNz1q7769jgTxzsKA7iTw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default

🔑 密码：13579

我们期待与您在社群中见面，一起探索 AI 创业的无限可能！🚀

---
AI+自媒体创业系统 团队
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
      targetEmail: targetEmail
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
  Logger.log('🗑️ 缓存已清除');
}

