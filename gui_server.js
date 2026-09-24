const http = require('http');
const fs = require('fs');
const path = require('path');
const { patch, restore, getStatus } = require('./patcher');

const PORT = 38291;

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.ico': return 'image/x-icon';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

const HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IELTS Bro UI Translator</title>
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #ffffff;
      --card-bg: #ffffff;
      --card-border: #e2e8f0;
      --accent: #ea580c;
      --accent-hover: #c2410c;
      --accent-subtle: #fff7ed;
      --accent-border: #fed7aa;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-light: #94a3b8;
      --surface: #f8fafc;
      --success: #15803d;
      --success-bg: #f0fdf4;
      --danger: #b91c1c;
      --danger-bg: #fef2f2;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      -webkit-font-smoothing: antialiased;
    }

    .app-card {
      width: 100%;
      max-width: 520px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
    }

    .brand-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--card-border);
    }

    .app-logo {
      width: 48px;
      height: 48px;
      object-fit: contain;
      border-radius: 8px;
      border: 1px solid var(--card-border);
      padding: 4px;
      background: #ffffff;
    }

    .header-text h1 {
      font-size: 19px;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.3px;
    }

    .header-text p {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .info-callout {
      background: var(--surface);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      font-size: 13px;
    }

    .info-callout .path {
      color: var(--text-muted);
      font-size: 12px;
      font-family: monospace;
      margin-top: 2px;
    }

    .status-tag {
      font-size: 12px;
      font-weight: 600;
      color: var(--accent);
      background: var(--accent-subtle);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--accent-border);
    }

    .action-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 24px;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-radius: 8px;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
      border: 1px solid transparent;
      outline: none;
    }

    .btn:active {
      transform: scale(0.99);
    }

    .btn-accent {
      background: var(--accent);
      color: #ffffff;
      border-color: var(--accent);
    }

    .btn-accent:hover {
      background: var(--accent-hover);
    }

    .btn-secondary {
      background: #ffffff;
      color: var(--text-main);
      border: 1px solid var(--card-border);
    }

    .btn-secondary:hover {
      background: var(--surface);
      border-color: #cbd5e1;
    }

    .btn-restore {
      background: #ffffff;
      color: var(--danger);
      border: 1px solid #fee2e2;
    }

    .btn-restore:hover {
      background: var(--danger-bg);
      border-color: #fca5a5;
    }

    .btn-title {
      font-size: 14px;
      font-weight: 600;
      display: block;
    }

    .btn-desc {
      font-size: 12px;
      opacity: 0.85;
      font-weight: 400;
      margin-top: 1px;
    }

    .btn-icon {
      font-size: 16px;
      opacity: 0.7;
      margin-left: 12px;
    }

    .notice-box {
      font-size: 12.5px;
      color: var(--text-muted);
      border-top: 1px solid var(--card-border);
      padding-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .notice-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .notice-bullet {
      color: var(--accent);
      font-weight: bold;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      opacity: 0;
      pointer-events: none;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 1000;
    }

    .toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .toast.success {
      background: var(--success-bg);
      color: var(--success);
      border: 1px solid #bbf7d0;
    }

    .toast.error {
      background: var(--danger-bg);
      color: var(--danger);
      border: 1px solid #fecaca;
    }

    .toast.loading {
      background: var(--surface);
      color: var(--text-main);
      border: 1px solid var(--card-border);
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid #cbd5e1;
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>

  <div id="toast" class="toast"></div>

  <div class="app-card">
    <div class="brand-header">
      <img src="/logo_white.png" alt="Logo" class="app-logo" onerror="this.src='/logo.png'">
      <div class="header-text">
        <h1>IELTS Bro UI Translator</h1>
        <p>Bản dịch giao diện ứng dụng 雅思哥 (IELTS Bro Desktop)</p>
      </div>
    </div>

    <div class="info-callout">
      <div>
        <div style="font-weight: 600;">Ứng dụng mục tiêu</div>
        <div class="path">C:\\Program Files\\yasige\\resources\\app.asar</div>
      </div>
      <div class="status-tag">Sẵn sàng</div>
    </div>

    <div class="action-group">
      <button class="btn btn-accent" onclick="applyLang('vi')">
        <div>
          <span class="btn-title">Cài đặt giao diện Tiếng Việt</span>
          <span class="btn-desc">Dịch toàn bộ Menu, Nút bấm & Bảng điều khiển sang Tiếng Việt</span>
        </div>
        <span class="btn-icon">→</span>
      </button>

      <button class="btn btn-secondary" onclick="applyLang('en')">
        <div>
          <span class="btn-title">Cài đặt giao diện Tiếng Anh</span>
          <span class="btn-desc">Translate application interface and controls to English</span>
        </div>
        <span class="btn-icon">→</span>
      </button>

      <button class="btn btn-restore" onclick="restoreOriginal()">
        <div>
          <span class="btn-title">Khôi phục giao diện gốc</span>
          <span class="btn-desc">Quay lại bản tiếng Trung nguyên bản ban đầu</span>
        </div>
        <span class="btn-icon">↺</span>
      </button>
    </div>

    <div class="notice-box">
      <div class="notice-row">
        <span class="notice-bullet">•</span>
        <span><strong>Tự động dịch thông minh:</strong> Tích hợp dịch kết hợp (Hybrid Dictionary + Cloud Translation API).</span>
      </div>
      <div class="notice-row">
        <span class="notice-bullet">•</span>
        <span><strong>Bảo vệ đề thi:</strong> Giữ nguyên 100% đề thi tiếng Anh (Reading, Listening, câu hỏi trắc nghiệm).</span>
      </div>
      <div class="notice-row">
        <span class="notice-bullet">•</span>
        <span><strong>An toàn tuyệt đối:</strong> Tự động sao lưu <code>app.asar.bak</code> trước khi áp dụng.</span>
      </div>
    </div>
  </div>

  <script>
    const toast = document.getElementById('toast');

    function showToast(msg, type = 'success', duration = 3000) {
      toast.className = 'toast ' + type + ' show';
      if (type === 'loading') {
        toast.innerHTML = '<div class="spinner"></div> ' + msg;
      } else {
        toast.innerText = msg;
      }

      if (duration > 0) {
        setTimeout(() => {
          toast.className = 'toast';
        }, duration);
      }
    }

    async function applyLang(lang) {
      showToast('Đang áp dụng bản dịch...', 'loading', 0);
      try {
        const res = await fetch('/api/patch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Đã áp dụng bản dịch thành công! Hãy mở IELTS Bro.', 'success', 3500);
        } else {
          showToast('Lỗi: ' + (data.error || 'Thao tác không thành công'), 'error', 4500);
        }
      } catch (err) {
        showToast('Lỗi kết nối: ' + err.message, 'error', 4500);
      }
    }

    async function restoreOriginal() {
      showToast('Đang khôi phục bản gốc...', 'loading', 0);
      try {
        const res = await fetch('/api/restore', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          showToast('Đã khôi phục giao diện gốc thành công!', 'success', 3500);
        } else {
          showToast('Lỗi: ' + (data.error || 'Thất bại'), 'error', 4500);
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error', 4500);
      }
    }
  </script>
</body>
</html>
`;

const server = http.createServer(async (req, res) => {
  // Static logo routes
  if (req.method === 'GET' && (req.url === '/logo.png' || req.url === '/logo_white.png')) {
    const filename = req.url.slice(1);
    const filePath = path.join(__dirname, filename);
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

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
  console.log(`[GUI Server] Running at http://127.0.0.1:${PORT}`);
});