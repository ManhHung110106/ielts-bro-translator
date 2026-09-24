const http = require('http');
const fs = require('fs');
const path = require('path');
const { patch, restore, getStatus, launchApp } = require('./patcher');

const PORT = 38292;

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
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
      --surface: #f8fafc;
      --danger: #dc2626;
      --danger-hover: #b91c1c;
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
      max-width: 480px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
    }

    .brand-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
    }

    .app-logo {
      width: 44px;
      height: 44px;
      object-fit: contain;
      border-radius: 10px;
      border: 1px solid var(--card-border);
      padding: 2px;
      background: #ffffff;
    }

    .header-text h1 {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.3px;
    }

    .section-label {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .lang-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }

    .btn-lang {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 16px;
      background: #ffffff;
      border: 1.5px solid var(--accent);
      border-radius: 10px;
      color: var(--accent);
      font-family: inherit;
      font-size: 14.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      outline: none;
    }

    .btn-lang .flag {
      font-size: 18px;
      line-height: 1;
    }

    .btn-lang:hover {
      background: var(--accent);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
    }

    .btn-lang:active {
      transform: scale(0.98);
    }

    .restore-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 28px;
    }

    .btn-restore {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 18px;
      background: #ffffff;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: var(--danger);
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      outline: none;
    }

    .btn-restore:hover {
      background: var(--danger-bg);
      border-color: #f87171;
    }

    .btn-restore:active {
      transform: scale(0.98);
    }

    .footer-divider {
      border-top: 1px solid var(--card-border);
      padding-top: 20px;
      display: flex;
      justify-content: center;
    }

    .github-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: color 0.15s ease;
    }

    .github-link:hover {
      color: var(--accent);
    }

    .github-icon {
      width: 17px;
      height: 17px;
      fill: currentColor;
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
      background: #f0fdf4;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }

    .toast.error {
      background: #fef2f2;
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
      <img src="/logo.png" alt="Logo" class="app-logo">
      <div class="header-text">
        <h1>IELTS Bro UI Translator</h1>
      </div>
    </div>

    <div class="section-label">Chọn ngôn ngữ:</div>

    <div class="lang-row">
      <button class="btn-lang" onclick="applyLang('vi')">
        <span class="flag">🇻🇳</span>
        <span>Tiếng Việt</span>
      </button>

      <button class="btn-lang" onclick="applyLang('en')">
        <span class="flag">🇬🇧</span>
        <span>Tiếng Anh</span>
      </button>
    </div>

    <div class="restore-wrap">
      <button class="btn-restore" onclick="restoreOriginal()">
        <span>Khôi phục cài đặt gốc</span>
      </button>
    </div>

    <div class="footer-divider">
      <a href="https://github.com/ManhHung110106/ielts-bro-translator" target="_blank" class="github-link">
        <svg class="github-icon" viewBox="0 0 16 16">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        <span>Tìm hiểu thêm về tôi?</span>
      </a>
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
          showToast('Đã áp dụng thành công! Đang tự động mở IELTS Bro...', 'success', 3500);
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
          showToast('Đã khôi phục cài đặt gốc! Đang tự động mở IELTS Bro...', 'success', 3500);
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
  if (req.method === 'GET' && req.url === '/logo.png') {
    const filePath = path.join(__dirname, 'logo.png');
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
        setTimeout(() => {
          launchApp();
        }, 600);
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
      setTimeout(() => {
        launchApp();
      }, 600);
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
