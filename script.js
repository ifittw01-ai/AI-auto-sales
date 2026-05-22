// ========================================
// 推廣人員郵箱對照表
// ========================================
// 在 email-mapping.html 生成代碼後，將代碼貼在這裡
const EMAIL_MAPPING = {
    // 範例：
    // 'A': 'userA@gmail.com',
    // 'B': 'userB@gmail.com',
    "jordantsai777": "jordantsai777@gmail.com",
    "jordantsai07": "jordantsai07@gmail.com",
    "001": "cchaha888@gmail.com",
    "002": "a0928127137@gmail.com",
    "003": "peter.w2520701@gmail.com",
    "005": "gabi4507@gmail.com",
    "006": "h0917995529@gmail.com",
    "008": "rong20020804@gmail.com",
    "009": "amy75301@gmail.com",
    "010": "sasabreakfast@gmail.com"
};

// 預設郵箱（如果沒有 ref 參數）
const DEFAULT_EMAIL = 'jordantsai777@gmail.com';

// 從 URL 獲取推廣代碼
function getReferralCode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref');
}

// 根據推廣代碼獲取對應郵箱
function getTargetEmail() {
    const refCode = getReferralCode();
    const email = EMAIL_MAPPING[refCode] || DEFAULT_EMAIL;
    console.log('📧 推廣代碼:', refCode || '無');
    console.log('📧 目標郵箱:', email);
    return email;
}

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
        region: 'entry.1586436660',
        lineId: 'entry.1922861190',
        whatsapp: 'entry.1017645638',
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
    'spiritual': '身心靈導師',
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

// 地區對應表
const REGION_NAMES = {
    'north': '北部',
    'central': '中部',
    'south': '南部'
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
            if (bannerEl) bannerEl.textContent = '00:00:00';
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
        
        // 更新横幅倒计时（包含秒数）
        if (bannerEl) {
            bannerEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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

// 显示成功页面
function showSuccessPage(userName, userRegion) {
    const modalContent = document.querySelector('#orderModal .modal-content');
    
    // 保存原始内容
    const originalContent = modalContent.innerHTML;
    
    // 准备地区显示文字
    const regionText = userRegion ? `，評估地區：${userRegion}` : '';
    
    // 显示成功页面内容
    modalContent.innerHTML = `
        <div class="success-page" style="text-align: center; padding: 40px 20px;">
            <div class="success-icon" style="font-size: 80px; margin-bottom: 20px;">
                ✅
            </div>
            <h2 style="color: #2ecc71; margin-bottom: 10px;">提交成功！</h2>
            <p style="font-size: 1.1rem; color: #333; margin-bottom: 30px;">
                感謝 <strong>${userName}</strong>！<br>
                您已成功報名${regionText}，
            </p>
            
            <button onclick="location.reload()" style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; border: none; padding: 15px 40px; font-size: 1.1rem; border-radius: 30px; cursor: pointer; margin-top: 20px; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);">
                關閉
            </button>
        </div>
    `;
    
    // 滾動到彈窗頂部
    setTimeout(() => {
        modalContent.scrollTop = 0;
    }, 100);
}

// 是否為 LINE 內建瀏覽器
function isLineInAppBrowser() {
    const ua = navigator.userAgent || '';
    return /Line\//i.test(ua) || /LIFF/i.test(ua);
}

// LINE / iOS：修復模態框內 select 無法點選
function initLineSelectFix() {
    const modal = document.getElementById('orderModal');
    if (!modal) return;

    const selects = modal.querySelectorAll('select');
    const activate = () => modal.classList.add('select-active');
    const deactivate = () => modal.classList.remove('select-active');

    selects.forEach((select) => {
        ['mousedown', 'touchstart', 'click'].forEach((eventName) => {
            select.addEventListener(eventName, (e) => {
                e.stopPropagation();
                activate();
            }, eventName === 'touchstart' ? { passive: true } : false);
        });

        select.addEventListener('focus', activate);
        select.addEventListener('blur', () => {
            setTimeout(deactivate, 300);
        });
        select.addEventListener('change', deactivate);
    });
}

// 初始化模态框事件
function initModal() {
    const modal = document.getElementById('orderModal');
    const closeBtn = document.querySelector('.close-modal');
    
    // 点击关闭按钮
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // 点击模态框外部关闭（不影響 select 點擊）
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });

    initLineSelectFix();
}

// ========================================
// 資料儲存功能
// ========================================

// Google Apps Script 部署 URL（全局变量）
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw0pq-8iRPIThxKibSEuRCV6i4I-xigvVv1ZxFVOJ93_st2jaxrda4-8kE8S4iaURuy/exec';

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
        
        // 添加必填欄位資料
        if (GOOGLE_FORM_CONFIG.fields.fullName && data.fullName) {
            formData.append(GOOGLE_FORM_CONFIG.fields.fullName, data.fullName);
        }
        if (GOOGLE_FORM_CONFIG.fields.email && data.email) {
            formData.append(GOOGLE_FORM_CONFIG.fields.email, data.email);
        }
        if (GOOGLE_FORM_CONFIG.fields.phone && data.phone) {
            formData.append(GOOGLE_FORM_CONFIG.fields.phone, data.phone);
        }
        if (GOOGLE_FORM_CONFIG.fields.country && data.country) {
            formData.append(GOOGLE_FORM_CONFIG.fields.country, COUNTRY_NAMES[data.country] || data.country);
        }
        if (GOOGLE_FORM_CONFIG.fields.industry && data.industry) {
            formData.append(GOOGLE_FORM_CONFIG.fields.industry, INDUSTRY_NAMES[data.industry] || data.industry);
        }
        
        // 添加選填字段：地區、LINE ID 和 WhatsApp
        if (GOOGLE_FORM_CONFIG.fields.region && data.region) {
            formData.append(GOOGLE_FORM_CONFIG.fields.region, REGION_NAMES[data.region] || data.region);
        }
        if (GOOGLE_FORM_CONFIG.fields.lineId && data.lineId && data.lineId !== '未提供') {
            formData.append(GOOGLE_FORM_CONFIG.fields.lineId, data.lineId);
        }
        if (GOOGLE_FORM_CONFIG.fields.whatsapp && data.whatsapp && data.whatsapp !== '未提供') {
            formData.append(GOOGLE_FORM_CONFIG.fields.whatsapp, data.whatsapp);
        }
        
        // 訂閱電子報（核取方塊）- 只有勾選時才傳送
        if (GOOGLE_FORM_CONFIG.fields.newsletter && data.newsletter) {
            formData.append(GOOGLE_FORM_CONFIG.fields.newsletter, '是');
        }
        
        console.log('📤 正在提交資料到 Google 表單...');
        console.log('表單 URL:', formUrl);
        
        // 打印所有要提交的資料（用於調試）
        console.log('=== 📋 提交的表單資料 ===');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: "${value}"`);
        }
        console.log('========================');
        
        // 使用 no-cors 模式提交（Google Forms 不允許讀取回應，但會正常提交）
        await fetch(formUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });
        
        console.log('✅ 資料已成功提交到 Google 表單！');
        return { success: true };
    } catch (error) {
        console.error('❌ Google 表單提交失敗:', error);
        return { success: false, error: error.message };
    }
}

// 處理表單提交（使用 Google Apps Script，支援動態推廣郵箱）
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
        
        // 獲取用戶名稱
        const userName = form.querySelector('[name="姓名"]').value;
        
        // 🎯 添加推廣代碼到表單（Google Script 會根據此判斷目標郵箱）
        const refCode = getReferralCode();
        const targetEmail = getTargetEmail();
        
        console.log('🔖 推廣代碼:', refCode || '無');
        console.log('📧 目標郵箱:', targetEmail);
        
        // 準備表單資料
        const formData = new FormData(form);
        
        // 🔄 獲取下拉選單的完整文字（而不是只有 value）
        // 國家地區
        const countrySelect = document.getElementById('country');
        if (countrySelect && countrySelect.selectedIndex > 0) {
            const countryText = countrySelect.options[countrySelect.selectedIndex].text;
            formData.set('國家地區', countryText);
        }
        
        // 行業
        const industrySelect = document.getElementById('industry');
        if (industrySelect && industrySelect.selectedIndex > 0) {
            const industryText = industrySelect.options[industrySelect.selectedIndex].text;
            formData.set('行業', industryText);
        }
        
        // 評估地區（時間地點）
        const regionSelect = document.getElementById('region');
        let userRegion = '';
        if (regionSelect && regionSelect.selectedIndex > 0) {
            const selectedOption = regionSelect.options[regionSelect.selectedIndex];
            const regionText = selectedOption.text;
            
            formData.set('評估地區', regionText);
            userRegion = regionText; // 保存用于显示
        }
        
        // 添加推廣代碼
        if (refCode) {
            formData.append('推廣代碼', refCode);
        }
        formData.append('ref', refCode || '');
        
        // 🔍 調試：打印所有提交的資料
        console.log('=== 📋 準備提交的表單資料 ===');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: "${value}"`);
        }
        console.log('========================');
        
        try {
            console.log('📤 正在提交到 Google Apps Script...');
            
            // 提交到 Google Apps Script
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ 提交成功！郵件已發送到:', result.targetEmail || targetEmail);
                
                // 顯示成功頁面
                showSuccessPage(userName, userRegion);
                form.reset();
            } else {
                console.error('❌ 提交失敗:', result.message);
                alert('❌ 提交失敗，請稍後再試或直接聯繫我們的 WhatsApp/LINE\n\n錯誤: ' + result.message);
            }
        } catch (error) {
            console.error('⚠️ 提交錯誤:', error);
            alert('❌ 網路錯誤，請檢查網路連接後重試');
        } finally {
            // 恢復按鈕狀態
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>📝 提交資料</span>';
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

// 添加视频播放追踪和覆盖层控制
function initVideoTracking() {
    const video = document.getElementById('mainVideo');
    const overlay = document.getElementById('videoOverlay');
    
    if (video && overlay) {
        // 視頻開始播放時隱藏覆蓋層
        video.addEventListener('play', () => {
            console.log('Video started playing');
            overlay.classList.add('hidden');
            // 这里可以添加分析追踪代码
        });

        // 視頻暫停時顯示覆蓋層
        video.addEventListener('pause', () => {
            console.log('Video paused');
            overlay.classList.remove('hidden');
        });

        // 視頻結束時顯示覆蓋層
        video.addEventListener('ended', () => {
            console.log('Video finished');
            overlay.classList.remove('hidden');
            // 视频结束后可以显示特别优惠等
        });

        // 當視頻從頭開始時確保覆蓋層可見
        video.addEventListener('loadeddata', () => {
            overlay.classList.remove('hidden');
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
    
    // 🆕 載入動態評估地點
    loadRegionOptions();
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

// ========================================
// 動態加載評估地點（從 Google Apps Script 獲取）
// ========================================

const DEFAULT_REGION_OPTIONS = [
    { id: '2', text: '11/3 星期一 晚上 7:00~9:00 捷運新店區公所站一號出口1分鐘到 北新路一段159號2樓' },
    { id: '3', text: '11/5 星期三 下午 2:00~4:00 捷運新店區公所站一號出口1分鐘到 北新路一段159號2樓' }
];

function populateRegionSelect(regionSelect, regions) {
    regionSelect.innerHTML = '<option value="">請選擇...</option>';
    regions.forEach((region) => {
        const option = document.createElement('option');
        option.value = region.id;
        option.textContent = region.text;
        regionSelect.appendChild(option);
    });
    regionSelect.disabled = false;
    regionSelect.removeAttribute('aria-busy');
}

function fetchRegionsJsonp() {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonpRegions_' + Date.now();
        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error('JSONP timeout'));
        }, 8000);

        function cleanup() {
            clearTimeout(timeout);
            delete window[callbackName];
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        }

        window[callbackName] = (data) => {
            cleanup();
            resolve(data);
        };

        const script = document.createElement('script');
        script.src = GOOGLE_SCRIPT_URL + '?action=getRegions&lang=zh-TW&callback=' + callbackName;
        script.onerror = () => {
            cleanup();
            reject(new Error('JSONP load error'));
        };
        document.body.appendChild(script);
    });
}

async function fetchRegionsWithTimeout(timeoutMs = 8000) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

    try {
        const response = await fetch(
            GOOGLE_SCRIPT_URL + '?action=getRegions&lang=zh-TW',
            controller ? { signal: controller.signal } : undefined
        );
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        return await response.json();
    } finally {
        if (timer) clearTimeout(timer);
    }
}

async function loadRegionOptions() {
    const regionSelect = document.getElementById('region');

    if (!regionSelect) {
        console.warn('⚠️ 找不到評估地區選單元素');
        return;
    }

    console.log('📍 正在載入評估地點選項...');

    // LINE 內建瀏覽器：切勿 disabled，否則選單無法操作
    regionSelect.disabled = false;
    regionSelect.setAttribute('aria-busy', 'true');

    // 先顯示可選的預設選項，確保即使 API 失敗也能報名
    populateRegionSelect(regionSelect, DEFAULT_REGION_OPTIONS);

    let result = null;

    try {
        result = await fetchRegionsWithTimeout(8000);
    } catch (fetchError) {
        console.warn('⚠️ fetch 載入失敗，嘗試 JSONP:', fetchError);
        try {
            result = await fetchRegionsJsonp();
        } catch (jsonpError) {
            console.warn('⚠️ JSONP 也失敗，使用預設選項:', jsonpError);
        }
    }

    if (result && result.success && result.regions && result.regions.length > 0) {
        populateRegionSelect(regionSelect, result.regions);
        console.log('✅ 成功載入 ' + result.regions.length + ' 個評估地點');
    } else if (isLineInAppBrowser()) {
        console.log('ℹ️ LINE 瀏覽器：使用預設評估地點選項');
    }
}

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

