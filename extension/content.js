// IELTS Bro Web Translator Content Script
(function() {
  'use strict';

  const DICTS = {
    vi: {
  "听力": "Nghe (Listening)",
  "阅读": "Đọc (Reading)",
  "写作": "Viết (Writing)",
  "口语": "Nói (Speaking)",
  "口语练习": "Luyện Speaking",
  "剑雅写作": "Luyện Writing Cam",
  "听力机经": "Đề dự đoán Listening",
  "阅读机经": "Đề dự đoán Reading",
  "写作机经": "Đề dự đoán Writing",
  "口语机经": "Đề dự đoán Speaking",
  "机经": "Đề dự đoán / Forecast",
  "练机经题库": "Luyện bộ đề dự đoán",
  "套题": "Bộ đề thi",
  "模考": "Thi thử (Mock Exam)",
  "全真模考": "Mô phỏng thi thật",
  "练习": "Luyện tập",
  "错题": "Câu làm sai",
  "错题本": "Sổ tay câu sai",
  "收藏": "Đã lưu / Yêu thích",
  "历史": "Lịch sử làm bài",
  "记录": "Bản ghi",
  "答题卡": "Phiếu trả lời",
  "交卷": "Nộp bài thi",
  "解析": "Giải thích chi tiết",
  "查看详情": "Xem chi tiết",
  "去练习": "Vào luyện tập",
  "开通会员": "Nâng cấp VIP",
  "会员": "Hội viên VIP",
  "雅思哥": "IELTS Bro",
  "个人中心": "Tài khoản cá nhân",
  "设置": "Cài đặt",
  "退出": "Thoát",
  "确定": "Xác nhận",
  "取消": "Hủy bỏ",
  "提示": "Thông báo",
  "警告": "Cảnh báo",
  "保存": "Lưu lại",
  "提交": "Nộp bài",
  "重做": "Làm lại",
  "下一题": "Câu tiếp",
  "上一题": "Câu trước",
  "开始答题": "Bắt đầu làm bài",
  "开始考试": "Bắt đầu thi",
  "暂停": "Tạm dừng",
  "继续": "Tiếp tục",
  "完成": "Hoàn thành",
  "已完成": "Đã hoàn thành",
  "未完成": "Chưa hoàn thành",
  "正确": "Đúng",
  "错误": "Sai",
  "正确率": "Tỷ lệ đúng",
  "得分": "Điểm số",
  "分数": "Điểm số",
  "总分": "Tổng điểm",
  "大作文": "Task 2 (Nghị luận)",
  "小作文": "Task 1 (Biểu đồ/Thư)",
  "填空题": "Điền vào chỗ trống",
  "选择题": "Trắc nghiệm",
  "匹配题": "Nối thông tin (Matching)",
  "判断题": "Dạng Đúng/Sai/Không có",
  "地图题": "Dạng bản đồ (Map)",
  "流程图": "Dạng lưu đồ (Flowchart)",
  "单选": "Chọn 1 đáp án",
  "多选": "Chọn nhiều đáp án",
  "词汇": "Từ vựng",
  "语法": "Ngữ pháp",
  "发音": "Phát âm",
  "流利度": "Độ lưu loát",
  "连贯性": "Tính mạch lạc",
  "倒计时": "Đếm ngược",
  "剩余时间": "Thời gian còn lại",
  "已用时间": "Thời gian đã làm",
  "请输入": "Vui lòng nhập",
  "请选择": "Vui lòng chọn",
  "搜索": "Tìm kiếm",
  "筛选": "Lọc",
  "全部": "Tất cả",
  "默认排序": "Sắp xếp mặc định",
  "最新": "Mới nhất",
  "最热": "Xem nhiều nhất",
  "难度": "Độ khó",
  "简单": "Dễ",
  "中等": "Trung bình",
  "困难": "Khó",
  "高频": "Tần suất cao",
  "考题": "Câu hỏi thi",
  "真题": "Đề thi thật",
  "剑桥雅思": "Cambridge IELTS",
  "剑雅": "Cambridge IELTS",
  "官方": "Chính thức",
  "模拟": "Mô phỏng",
  "考试": "Kỳ thi",
  "测试": "Kiểm tra",
  "音频": "Âm thanh",
  "录音": "Ghi âm",
  "播放": "Phát",
  "停止": "Dừng",
  "重新录音": "Ghi âm lại",
  "试听": "Nghe thử",
  "音量": "Âm lượng",
  "语速": "Tốc độ đọc",
  "字体大小": "Cỡ chữ",
  "背景颜色": "Màu nền",
  "夜间模式": "Chế độ tối",
  "日间模式": "Chế độ sáng",
  "快捷键": "Phím tắt",
  "帮助": "Trợ giúp",
  "反馈": "Góp ý",
  "关于": "Giới thiệu",
  "版本": "Phiên bản",
  "更新": "Cập nhật",
  "下载": "Tải xuống",
  "上传": "Tải lên",
  "复制": "Sao chép",
  "粘贴": "Dán",
  "删除": "Xóa",
  "清空": "Xóa hết",
  "撤销": "Hoàn tác",
  "刷新": "Làm mới",
  "重试": "Thử lại",
  "登录": "Đăng nhập",
  "注册": "Đăng ký",
  "密码": "Mật khẩu",
  "账号": "Tài khoản",
  "手机号": "Số điện thoại",
  "验证码": "Mã xác nhận",
  "获取验证码": "Lấy mã OTP",
  "忘记密码": "Quên mật khẩu",
  "用户协议": "Điều khoản sử dụng",
  "隐私政策": "Chính sách bảo mật",
  "暂无数据": "Không có dữ liệu",
  "暂无记录": "Chưa có bản ghi nào",
  "加载中": "Đang tải...",
  "请稍候": "Vui lòng chờ...",
  "成功": "Thành công",
  "失败": "Thất bại",
  "操作成功": "Thao tác thành công",
  "操作失败": "Thao tác thất bại",
  "确定要退出吗": "Bạn có chắc chắn muốn thoát không?",
  "确定要退出本次考试吗": "Bạn có chắc muốn thoát bài thi này không?",
  "测试环境": "Kiểm tra môi trường thi",
  "考场电脑网络状态": "Trạng thái mạng phòng thi",
  "真实机考": "Mô phỏng thi máy thật",
  "本月已练习": "Đã luyện trong tháng này",
  "小时": "giờ",
  "分钟": "phút",
  "秒": "giây"
},
    en: {
  "听力": "Listening",
  "阅读": "Reading",
  "写作": "Writing",
  "口语": "Speaking",
  "口语练习": "Speaking Practice",
  "剑雅写作": "Cambridge Writing",
  "听力机经": "Listening Forecast",
  "阅读机经": "Reading Forecast",
  "写作机经": "Writing Forecast",
  "口语机经": "Speaking Forecast",
  "机经": "Forecast / Real Questions",
  "练机经题库": "Practice Forecast Questions",
  "套题": "Test Sets",
  "模考": "Mock Exam",
  "全真模考": "Full Mock Exam",
  "练习": "Practice",
  "错题": "Mistakes / Incorrect",
  "错题本": "Mistake Notebook",
  "收藏": "Bookmarks / Favorites",
  "历史": "Test History",
  "记录": "Records",
  "答题卡": "Answer Sheet",
  "交卷": "Submit Exam",
  "解析": "Explanation & Analysis",
  "查看详情": "View Details",
  "去练习": "Start Practice",
  "开通会员": "Upgrade VIP",
  "会员": "VIP Member",
  "雅思哥": "IELTS Bro",
  "个人中心": "User Center",
  "设置": "Settings",
  "退出": "Exit / Logout",
  "确定": "Confirm",
  "取消": "Cancel",
  "提示": "Notice",
  "警告": "Warning",
  "保存": "Save",
  "提交": "Submit",
  "重做": "Redo",
  "下一题": "Next",
  "上一题": "Previous",
  "开始答题": "Start Answering",
  "开始考试": "Start Exam",
  "暂停": "Pause",
  "继续": "Continue",
  "完成": "Finished",
  "已完成": "Completed",
  "未完成": "Incomplete",
  "正确": "Correct",
  "错误": "Incorrect",
  "正确率": "Accuracy Rate",
  "得分": "Score",
  "分数": "Score",
  "总分": "Overall Score",
  "大作文": "Task 2 (Essay)",
  "小作文": "Task 1 (Report/Letter)",
  "填空题": "Fill in Blanks",
  "选择题": "Multiple Choice",
  "匹配题": "Matching",
  "判断题": "True/False/Not Given",
  "地图题": "Map / Diagram",
  "流程图": "Flowchart",
  "单选": "Single Choice",
  "多选": "Multiple Choice",
  "词汇": "Vocabulary",
  "语法": "Grammar",
  "发音": "Pronunciation",
  "流利度": "Fluency",
  "连贯性": "Coherence",
  "倒计时": "Countdown",
  "剩余时间": "Time Remaining",
  "已用时间": "Time Spent",
  "请输入": "Please enter",
  "请选择": "Please select",
  "搜索": "Search",
  "筛选": "Filter",
  "全部": "All",
  "默认排序": "Default Order",
  "最新": "Latest",
  "最热": "Popular",
  "难度": "Difficulty",
  "简单": "Easy",
  "中等": "Medium",
  "困难": "Hard",
  "高频": "High Frequency",
  "考题": "Exam Questions",
  "真题": "Past Exams",
  "剑桥雅思": "Cambridge IELTS",
  "剑雅": "Cambridge IELTS",
  "官方": "Official",
  "模拟": "Simulation",
  "考试": "Exam",
  "测试": "Test",
  "音频": "Audio",
  "录音": "Recording",
  "播放": "Play",
  "停止": "Stop",
  "重新录音": "Re-record",
  "试听": "Preview",
  "音量": "Volume",
  "语速": "Speed",
  "字体大小": "Font Size",
  "背景颜色": "Background Color",
  "夜间模式": "Dark Mode",
  "日间模式": "Light Mode",
  "快捷键": "Shortcuts",
  "帮助": "Help",
  "反馈": "Feedback",
  "关于": "About",
  "版本": "Version",
  "更新": "Update",
  "下载": "Download",
  "上传": "Upload",
  "复制": "Copy",
  "粘贴": "Paste",
  "删除": "Delete",
  "清空": "Clear",
  "撤销": "Undo",
  "刷新": "Refresh",
  "重试": "Retry",
  "登录": "Login",
  "注册": "Register",
  "密码": "Password",
  "账号": "Account",
  "手机号": "Phone Number",
  "验证码": "Verification Code",
  "获取验证码": "Get Code",
  "忘记密码": "Forgot Password",
  "用户协议": "User Agreement",
  "隐私政策": "Privacy Policy",
  "暂无数据": "No Data",
  "暂无记录": "No Records",
  "加载中": "Loading...",
  "请稍候": "Please wait...",
  "成功": "Success",
  "失败": "Failed",
  "操作成功": "Successful",
  "操作失败": "Operation Failed",
  "确定要退出吗": "Are you sure you want to exit?",
  "确定要退出本次考试吗": "Are you sure you want to leave this exam?",
  "测试环境": "Test Environment",
  "考场电脑网络状态": "Exam Network Status",
  "真实机考": "Real Computer Exam",
  "本月已练习": "Practiced this month",
  "小时": "hours",
  "分钟": "mins",
  "秒": "secs"
}
  };

  let currentLang = 'vi'; // default
  let isEnabled = true;

  // LocalStorage Cache
  function getCacheKey() {
    return '__IELTS_BRO_WEB_CACHE_' + currentLang + '__';
  }

  let dynamicCache = {};
  function loadCache() {
    try {
      dynamicCache = JSON.parse(localStorage.getItem(getCacheKey()) || '{}');
    } catch (e) {
      dynamicCache = {};
    }
  }

  function saveCache() {
    try {
      localStorage.setItem(getCacheKey(), JSON.stringify(dynamicCache));
    } catch (e) {}
  }

  const CHINESE_REGEX = /[\u4e00-\u9fa5]/;
  const translationMemory = new Map();
  let pendingQueue = new Set();
  let debounceTimer = null;

  async function fetchTranslations(texts) {
    if (!texts.length) return;
    const combined = texts.join('\n');
    try {
      const targetCode = currentLang === 'en' ? 'en' : 'vi';
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=${targetCode}&dt=t&q=${encodeURIComponent(combined)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json && json[0]) {
        const translatedCombined = json[0].map(x => x[0]).join('');
        const results = translatedCombined.split('\n');
        texts.forEach((orig, idx) => {
          if (results[idx]) {
            const clean = results[idx].trim();
            dynamicCache[orig] = clean;
            translationMemory.set(orig, clean);
          }
        });
        saveCache();
        if (document.body) translateNode(document.body);
      }
    } catch (err) {
      console.warn('[IELTS-Bro-Web-Translator] Translation error:', err.message);
    }
  }

  function queueForTranslation(text) {
    if (!text || !CHINESE_REGEX.test(text)) return;
    if (dynamicCache[text] || translationMemory.has(text) || pendingQueue.has(text)) return;
    pendingQueue.add(text);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const list = Array.from(pendingQueue).slice(0, 30);
      list.forEach(item => pendingQueue.delete(item));
      fetchTranslations(list);
    }, 400);
  }

  function translateText(text) {
    if (!text || !CHINESE_REGEX.test(text) || !isEnabled) {
      return text;
    }

    if (translationMemory.has(text)) {
      return translationMemory.get(text);
    }

    if (dynamicCache[text]) {
      translationMemory.set(text, dynamicCache[text]);
      return dynamicCache[text];
    }

    const dict = DICTS[currentLang] || {};
    const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);

    let result = text;
    for (const key of sortedKeys) {
      if (result.includes(key)) {
        result = result.replaceAll(key, dict[key]);
      }
    }

    if (CHINESE_REGEX.test(result)) {
      queueForTranslation(text.trim());
    }

    translationMemory.set(text, result);
    return result;
  }

  function shouldSkipNode(node) {
    if (!node) return true;
    const parent = node.parentElement;
    if (!parent) return true;

    const tag = parent.tagName ? parent.tagName.toUpperCase() : '';
    if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT', 'TEXTAREA'].includes(tag)) {
      return true;
    }

    // Crucial rule: Never translate IELTS Exam Questions / Passages
    const className = (parent.className && typeof parent.className === 'string') ? parent.className : '';
    if (
      className.includes('passage-content') ||
      className.includes('article-content') ||
      className.includes('reading-article') ||
      className.includes('question-text')
    ) {
      return true;
    }

    return false;
  }

  function translateNode(node) {
    if (!isEnabled) return;

    if (node.nodeType === Node.TEXT_NODE) {
      if (shouldSkipNode(node)) return;
      const original = node.nodeValue;
      if (original && CHINESE_REGEX.test(original)) {
        const translated = translateText(original);
        if (translated !== original) {
          node.nodeValue = translated;
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (const attr of ['placeholder', 'title', 'aria-label']) {
        const val = node.getAttribute(attr);
        if (val && CHINESE_REGEX.test(val)) {
          node.setAttribute(attr, translateText(val));
        }
      }

      for (let child = node.firstChild; child; child = child.nextSibling) {
        translateNode(child);
      }
    }
  }

  const observer = new MutationObserver((mutations) => {
    if (!isEnabled) return;
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        const target = mutation.target;
        if (!shouldSkipNode(target)) {
          const original = target.nodeValue;
          if (original && CHINESE_REGEX.test(original)) {
            const translated = translateText(original);
            if (translated !== original) {
              target.nodeValue = translated;
            }
          }
        }
      } else if (mutation.type === 'childList') {
        for (const addedNode of mutation.addedNodes) {
          translateNode(addedNode);
        }
      }
    }
  });

  function init() {
    loadCache();
    if (document.body) {
      translateNode(document.body);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Read config from chrome storage
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['targetLang', 'enabled'], (data) => {
      if (data.targetLang) currentLang = data.targetLang;
      if (typeof data.enabled !== 'undefined') isEnabled = data.enabled;
      loadCache();
      if (document.body && isEnabled) translateNode(document.body);
    });

    // Listen to messages from popup
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.action === 'changeLang') {
        currentLang = msg.lang;
        isEnabled = true;
        translationMemory.clear();
        loadCache();
        if (document.body) translateNode(document.body);
        sendResponse({ success: true });
      } else if (msg.action === 'toggleEnable') {
        isEnabled = msg.enabled;
        if (!isEnabled) {
          location.reload();
        } else {
          if (document.body) translateNode(document.body);
        }
        sendResponse({ success: true });
      }
    });
  }

  console.log('[IELTS-Bro-Web-Translator] Extension content script active.');
})();
