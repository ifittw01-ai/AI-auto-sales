// ========================================
// Google 表單設定
// ========================================
// 從 localStorage 載入設定，如果沒有則使用預設值

// 預設設定（後備用）
const DEFAULT_GOOGLE_FORM_CONFIG = {
    enabled: true,
    formId: '1FAIpQLSfgpRp3GyT27oanx3_pLwAlGVgCGdvH-gPnyS_fW-LsueGpFw',
    fields: {
        fullName: 'entry.1124417422',
        email: 'entry.1571446378',
        phone: 'entry.51167075',
        country: 'entry.251150813',
        industry: 'entry.828038711',
        newsletter: 'entry.1980319875'
    }
};

// 從 localStorage 載入設定
function loadGoogleFormConfig() {
    try {
        const savedConfig = localStorage.getItem('googleFormConfig');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            console.log('✅ 已載入自訂設定');
            return config;
        }
    } catch (error) {
        console.warn('⚠️ 載入設定失敗，使用預設設定:', error);
    }
    console.log('ℹ️ 使用預設設定');
    return DEFAULT_GOOGLE_FORM_CONFIG;
}

// 載入設定
const GOOGLE_FORM_CONFIG = loadGoogleFormConfig();

// 國家對應表（確保與 Google 表單的選項一致）
const COUNTRY_NAMES = {
    'TW': '台灣',
    'HK': '香港',
    'SG': '新加坡',
    'MY': '馬來西亞',
    'CN': '中國',
    'US': '美國',
    'other': '其他'
};

// 行業對應表（確保與 Google 表單的選項一致）
const INDUSTRY_NAMES = {
    'spiritual': '身心靈導師 / 玄學',
    'beauty': '美容 / 美髮',
    'education': '教育 / 培訓',
    'insurance': '保險 / 金融',
    'realestate': '房地產',
    'consultant': '諮詢顧問',
    'freelancer': '自由工作者',
    'coach': '個人教練',
    'ecommerce': '電商 / 微商',
    'other': '其他'
};

// ========================================
// 頁面功能
// ========================================

// 倒计时功能
function initCountdown() {
    // 设置倒计时结束时间（例如：今天晚上11:59pm）
    const now = new Date();
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    // 如果已经过了今天的11:59pm，设置为明天的11:59pm
    if (now > endTime) {
        endTime.setDate(endTime.getDate() + 1);
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
            // 倒计时结束
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            const bannerEl = document.getElementById('countdown-banner');
            
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            if (bannerEl) bannerEl.textContent = '00:00';
            return;
        }

        // 计算天、时、分、秒
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // 更新显示（添加空值检查）
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        const bannerEl = document.getElementById('countdown-banner');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        
        // 更新横幅倒计时
        if (bannerEl) {
            bannerEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
    }

    // 初始化并每秒更新
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// FAQ折叠功能
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // 关闭其他打开的FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 切换当前FAQ
            item.classList.toggle('active');
        });
    });
}

// CTA按钮点击处理 - 打开模态框
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    const modal = document.getElementById('orderModal');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            openModal();
        });
    });
}

// 打开模态框
function openModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // 恢复滚动
}

// 初始化模态框事件
function initModal() {
    const modal = document.getElementById('orderModal');
    const closeBtn = document.querySelector('.close-modal');
    
    // 点击关闭按钮
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

// ========================================
// 資料儲存功能
// ========================================

// LocalStorage 資料管理
const STORAGE_KEY = 'customerLeads';

// 儲存資料到 localStorage（本地備份）
function saveToLocalStorage(data) {
    try {
        // 取得現有資料
        let leads = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        
        // 加入新資料
        const newLead = {
            id: Date.now(), // 使用時間戳作為 ID
            ...data,
            createdAt: new Date().toISOString()
        };
        
        leads.push(newLead);
        
        // 儲存回 localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
        
        return { success: true, data: newLead };
    } catch (error) {
        console.error('本地儲存失敗:', error);
        return { success: false, error: error.message };
    }
}

// 提交資料到 Google 表單
async function submitToGoogleForm(data) {
    try {
        // 建立表單提交網址（使用 /d/e/ 格式，因為 Form ID 是從預填連結取得）
        const formUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_CONFIG.formId}/formResponse`;
        
        // 準備表單資料
        const formData = new FormData();
        
        // 添加所有欄位資料
        formData.append(GOOGLE_FORM_CONFIG.fields.fullName, data.fullName);
        formData.append(GOOGLE_FORM_CONFIG.fields.email, data.email);
        formData.append(GOOGLE_FORM_CONFIG.fields.phone, data.phone);
        formData.append(GOOGLE_FORM_CONFIG.fields.country, COUNTRY_NAMES[data.country] || data.country);
        formData.append(GOOGLE_FORM_CONFIG.fields.industry, INDUSTRY_NAMES[data.industry] || data.industry);
        
        // 訂閱電子報（核取方塊）- 值必須是「是」
        if (data.newsletter) {
            formData.append(GOOGLE_FORM_CONFIG.fields.newsletter, '是');
        }
        
        // Google Forms 需要的額外參數
        formData.append('fvv', '1');
        formData.append('partialResponse', '[null,null,"0"]');
        formData.append('pageHistory', '0');
        
        // 使用 fetch 提交（no-cors 模式）
        await fetch(formUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Google Forms 需要使用 no-cors
        });
        
        console.log('✅ 資料已成功提交到 Google 表單');
        return { success: true };
    } catch (error) {
        console.error('❌ Google 表單提交失敗:', error);
        return { success: false, error: error.message };
    }
}

// 處理表單提交
function initOrderForm() {
    const form = document.getElementById('orderForm');
    const submitBtn = document.getElementById('submitBtn');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 驗證表單
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // 顯示載入狀態
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳ 處理中...</span>';
        
        // 獲取表單資料
        const formData = new FormData(form);
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            industry: formData.get('industry'),
            newsletter: formData.get('newsletter') === 'on'
        };
        
        console.log('客戶資料:', data);
        
        let googleResult = { success: true };
        let localResult = { success: true };
        
        // 如果啟用 Google 表單，提交到 Google
        if (GOOGLE_FORM_CONFIG.enabled) {
            googleResult = await submitToGoogleForm(data);
            
            if (!googleResult.success) {
                console.warn('Google 表單提交失敗，將儲存到本地');
            }
        }
        
        // 同時也儲存到本地作為備份
        localResult = saveToLocalStorage(data);
        
        // 恢復按鈕狀態
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>📝 提交資料</span>';
        
        // 判斷結果並顯示訊息
        if (GOOGLE_FORM_CONFIG.enabled && googleResult.success) {
            // Google 表單模式成功
            alert(`✅ 資料已成功提交！\n\n感謝 ${data.fullName}！\n您的資料已傳送完成。\n我們的客服會盡快與您聯繫。`);
            closeModal();
            form.reset();
        } else if (localResult.success) {
            // 本地儲存模式成功
            alert(`✅ 資料已成功儲存！\n\n感謝 ${data.fullName}！\n您的資料已安全儲存在本設備中。\n\n您可以點擊「查看已儲存的資料」來查看或匯出 Excel 檔案。`);
            closeModal();
            form.reset();
        } else {
            // 失敗
            alert(`❌ 儲存失敗\n\n請稍後再試，或聯繫客服。`);
        }
    });
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 滚动动画效果
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 为各个区块添加动画
    const animatedElements = document.querySelectorAll(
        '.audience-card, .case-card, .testimonial-card, .included-item, .scenario-item'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 添加视频播放追踪（可选）
function initVideoTracking() {
    const video = document.querySelector('video');
    if (video) {
        video.addEventListener('play', () => {
            console.log('Video started playing');
            // 这里可以添加分析追踪代码
        });

        video.addEventListener('ended', () => {
            console.log('Video finished');
            // 视频结束后可以显示特别优惠等
        });
    }
}

// 页面加载时初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initFAQ();
    initCTAButtons();
    initModal();
    initOrderForm();
    initSmoothScroll();
    initScrollAnimations();
    initVideoTracking();
});

// 监听页面可见性变化，暂停/恢复倒计时
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page is hidden');
    } else {
        console.log('Page is visible');
        // 重新初始化倒计时以确保准确性
        initCountdown();
    }
});

// 添加急迫感效果
function addUrgencyEffect() {
    const urgencyElements = document.querySelectorAll('.urgency-text, .urgency-badge');
    
    setInterval(() => {
        urgencyElements.forEach(el => {
            el.style.transform = 'scale(1.05)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 500);
        });
    }, 3000);
}

// 初始化急迫感效果
addUrgencyEffect();

