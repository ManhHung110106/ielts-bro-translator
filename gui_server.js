const http = require('http');
const fs = require('fs');
const path = require('path');
const { patch, restore, getStatus } = require('./patcher');

const PORT = 38291;

const HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IELTS Bro UI Translator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: rgba(22, 30, 49, 0.75);
      --card-border: rgba(255, 255, 255, 0.08);
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --primary-glow: rgba(59, 130, 246, 0.35);
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.25);
      --danger: #ef4444;
      --warning: #f59e0b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
    }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background: radial-gradient(circle at 50% 0%, #172554 0%, var(--bg) 75%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow-x: hidden;
    }

    .container {
      width: 100%;
      max-width: 580px;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      padding: 36px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 60px rgba(59, 130, 246, 0.15);
      position: relative;
    }

    .header {
      text-align: center;
      margin-bottom: 28px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #93c5fd;
      padding: 5px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      background: #3b82f6;
      border-radius: 50%;
      box-shadow: 0 0 8px #3b82f6;
    }

    h1 {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 30%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 6px;
    }

    .subtitle {
      color: var(--text-muted);
      font-size: 13.5px;
      line-height: 1.5;
    }

    .status-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 14px;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .status-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 10px var(--success-glow);
    }

    .status-text {
      font-size: 13px;
      font-weight: 600;
    }

    .status-sub {
      font-size: 11px;
      color: var(--text-muted);
    }

    .grid-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }

    .btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-radius: 16px;
      border: 1px solid transparent;
      font-family: inherit;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    .btn-primary {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      box-shadow: 0 8px 24px var(--primary-glow);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(37, 99, 235, 0.5);
      background: linear-gradient(135deg, #3b82f6, #2563eb);
    }

    .btn-secondary {
      background: rgba(30, 41, 59, 0.7);
      color: #e2e8f0;
      border: 1px solid var(--card-border);
    }

    .btn-secondary:hover {
      background: rgba(51, 65, 85, 0.8);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .btn-restore {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.25);
      color: #fca5a5;
    }

    .btn-restore:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
      transform: translateY(-2px);
    }

    .btn:active {
      transform: translateY(0);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .btn-label {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .btn-title {
      font-size: 15px;
      font-weight: 700;
    }

    .btn-desc {
      font-size: 12px;
      opacity: 0.8;
      font-weight: 500;
      margin-top: 2px;
    }

    .btn-icon {
      font-size: 20px;
    }

    .features-list {
      background: rgba(15, 23, 42, 0.4);
      border-radius: 14px;
      padding: 16px;
      font-size: 12.5px;
      color: var(--text-muted);
      line-height: 1.7;
    }

    .features-list strong {
      color: #cbd5e1;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .feature-item::before {
      content: '✓';
      color: var(--success);
      font-weight: 800;
    }

    .notification {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      padding: 12px 24px;
      border-radius: 999px;
      font-size: 13.5px;
      font-weight: 600;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      z-index: 100;
    }

    .notification.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .notification.success {
      background: #059669;
      box-shadow: 0 10px 25px rgba(5, 150, 105, 0.4);
    }

    .notification.error {
      background: #dc2626;
      box-shadow: 0 10px 25px rgba(220, 38, 38, 0.4);
    }

    .notification.loading {
      background: #2563eb;
      box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>

  <div id="toast" class="notification"></div>

  <div class="container">
    <div class="header">
      <div class="badge">
        <span class="badge-dot"></span>
        IELTS Bro Translation Mod
      </div>
      <h1>IELTS Bro UI Translator</h1>
      <p class="subtitle">Chuyển đổi giao diện IELTS Bro (雅思哥) sang Tiếng Việt & Anh.<br>Tự động giữ nguyên 100% đề thi tiếng Anh nguyên bản.</p>
    </div>

    <div class="status-card">
      <div class="status-left">
        <div class="status-indicator"></div>
        <div>
          <div class="status-text" id="status-text">Đã phát hiện ứng dụng IELTS Bro</div>
          <div class="status-sub" id="status-path">C:\\Program Files\\yasige\\resources\\app.asar</div>
        </div>
      </div>
      <div id="backup-badge" style="font-size: 11px; padding: 4px 10px; background: rgba(16, 185, 129, 0.15); color: #34d399; border-radius: 6px; font-weight: 600;">
        Đã sẵn sàng
      </div>
    </div>

    <div class="grid-actions">
      <button class="btn btn-primary" onclick="applyLang('vi')">
        <div class="btn-label">
          <span class="btn-title">🇻🇳 Cài đặt Giao diện Tiếng Việt</span>
          <span class="btn-desc">Dịch toàn bộ Menu, Nút bấm, Cài đặt sang Tiếng Việt</span>
        </div>
        <span class="btn-icon">→</span>
      </button>

      <button class="btn btn-secondary" onclick="applyLang('en')">
        <div class="btn-label">
          <span class="btn-title">🇬🇧 Cài đặt Giao diện Tiếng Anh</span>
          <span class="btn-desc">Translate navigation and UI components into English</span>
        </div>
        <span class="btn-icon">→</span>
      </button>

      <button class="btn btn-restore" onclick="restoreOriginal()">
        <div class="btn-label">
          <span class="btn-title">↺ Khôi phục giao diện gốc</span>
          <span class="btn-desc">Quay về tiếng Trung nguyên bản ban đầu</span>
        </div>
        <span class="btn-icon">↻</span>
      </button>
    </div>

    <div class="features-list">
      <div class="feature-item"><strong>An toàn tuyệt đối:</strong> Tự động backup <code>app.asar.bak</code> trước khi sửa đổi.</div>
      <div class="feature-item"><strong>Bảo vệ bài thi:</strong> Không dịch bài Reading, Listening, hay câu hỏi trắc nghiệm tiếng Anh.</div>
      <div class="feature-item"><strong>Hoàn tác 1-Click:</strong> Trở về ứng dụng gốc bất cứ khi nào bạn muốn.</div>
    </div>
  </div>

  <script>
    const toast = document.getElementById('toast');

    function showToast(msg, type = 'success', duration = 3500) {
      toast.className = 'notification ' + type + ' show';
      if (type === 'loading') {
        toast.innerHTML = '<div class="spinner"></div> ' + msg;
      } else {
        toast.innerText = msg;
      }

      if (duration > 0) {
        setTimeout(() => {
          toast.className = 'notification';
        }, duration);
      }
    }

    async function applyLang(lang) {
      showToast('Đang áp dụng bản dịch, vui lòng chờ...', 'loading', 0);
      try {
        const res = await fetch('/api/patch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang })
        });
        const data = await res.json();
        if (data.success) {
          showToast('✓ Cài đặt thành công! Bạn có thể mở IELTS Bro ngay.', 'success', 4000);
        } else {
          showToast('✕ Lỗi: ' + (data.error || 'Thất bại'), 'error', 5000);
        }
      } catch (err) {
        showToast('✕ Lỗi kết nối: ' + err.message, 'error', 5000);
      }
    }

    async function restoreOriginal() {
      showToast('Đang khôi phục bản gốc...', 'loading', 0);
      try {
        const res = await fetch('/api/restore', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          showToast('✓ Đã khôi phục giao diện gốc thành công!', 'success', 4000);
        } else {
          showToast('✕ Lỗi: ' + (data.error || 'Thất bại'), 'error', 5000);
        }
      } catch (err) {
        showToast('✕ Lỗi: ' + err.message, 'error', 5000);
      }
    }
  </script>
</body>
</html>
`;

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML);
    return;
  }

  if (req.method === 'GET' && req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getStatus()));
    return;
  }

  if (req.method === 'POST' && req.url === '/api/patch') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { lang } = JSON.parse(body || '{}');
        await patch(undefined, lang || 'vi');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/restore') {
    try {
      await restore();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[GUI Server] Server running at http://127.0.0.1:${PORT}`);
});