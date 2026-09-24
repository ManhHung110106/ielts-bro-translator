const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const {
  patch,
  restore,
  getStatus,
  launchApp,
  resolveAsarPath,
  DEFAULT_APP_PATH
} = require('./patcher');

const PORT = 38292;
const CONFIG_FILE = path.join(__dirname, 'config.json');

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      if (data && data.appPath) return data;
    }
  } catch (e) {}
  return { appPath: 'C:\\Program Files\\yasige' };
}

function saveConfig(cfg) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf8');
  } catch (e) {}
}

function openWindowsDialog(type = 'file') {
  return new Promise((resolve) => {
    let script = '';
    if (type === 'folder') {
      script = `
        Add-Type -AssemblyName System.Windows.Forms
        $fbd = New-Object System.Windows.Forms.FolderBrowserDialog
        $fbd.Description = "Chọn thư mục cài đặt IELTS Bro (yasige)"
        $fbd.ShowNewFolderButton = $false
        if ($fbd.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
          [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
          Write-Output $fbd.SelectedPath
        }
      `;
    } else {
      script = `
        Add-Type -AssemblyName System.Windows.Forms
        $ofd = New-Object System.Windows.Forms.OpenFileDialog
        $ofd.Title = "Chọn tệp app.asar hoặc yasige.exe"
        $ofd.Filter = "IELTS Bro Files (*.asar;*.exe)|*.asar;*.exe|All Files (*.*)|*.*"
        $ofd.InitialDirectory = "C:\\Program Files\\yasige"
        if ($ofd.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
          [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
          Write-Output $ofd.FileName
        }
      `;
    }
    const child = spawn('powershell', ['-NoProfile', '-STA', '-Command', script]);
    let stdout = '';
    child.stdout.on('data', d => stdout += d.toString());
    child.on('close', () => {
      resolve(stdout.trim());
    });
    child.on('error', () => resolve(''));
  });
}

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
  <title>IELTS Bro Translator</title>
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
      --surface-border: #e2e8f0;
      --danger: #dc2626;
      --danger-hover: #b91c1c;
      --danger-bg: #fef2f2;
      --success: #16a34a;
      --success-bg: #f0fdf4;
      --warning: #d97706;
      --warning-bg: #fffbeb;
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
      max-width: 500px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
    }

    .brand-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 22px;
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

    /* Path Configuration Section */
    .path-section {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 22px;
    }

    .section-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .path-input-wrap {
      margin-bottom: 10px;
    }

    .path-input {
      width: 100%;
      padding: 8px 12px;
      background: #ffffff;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      font-family: inherit;
      font-size: 12.5px;
      color: var(--text-main);
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      user-select: text;
    }

    .path-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
    }

    .path-btn-row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    .btn-action-small {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      background: #ffffff;
      border: 1px solid var(--card-border);
      border-radius: 6px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
      outline: none;
    }

    .btn-action-small:hover {
      border-color: var(--accent);
      color: var(--accent);
      background: var(--accent-subtle);
    }

    .btn-action-small:active {
      transform: scale(0.98);
    }

    .path-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
    }

    .status-dot.ok {
      background: var(--success);
      box-shadow: 0 0 6px rgba(22, 163, 74, 0.4);
    }

    .status-dot.warn {
      background: var(--warning);
      box-shadow: 0 0 6px rgba(217, 119, 6, 0.4);
    }

    .status-text.ok {
      color: var(--success);
    }

    .status-text.warn {
      color: var(--warning);
    }

    /* Action Buttons */
    .action-label {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .lang-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 18px;
    }

    .btn-lang {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 16px;
      background: #ffffff;
      border: 1.5px solid var(--accent);
      border-radius: 10px;
      color: var(--accent);
      font-family: inherit;
      font-size: 14px;
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
      margin-bottom: 24px;
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
      padding-top: 18px;
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
      max-width: 90%;
      text-align: center;
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
        <h1>IELTS Bro Translator</h1>
      </div>
    </div>

    <!-- Path Selector Section -->
    <div class="path-section">
      <div class="section-label">
        <span>Đường dẫn cài đặt IELTS Bro (yasige):</span>
      </div>
      <div class="path-input-wrap">
        <input type="text" id="pathInput" class="path-input" placeholder="C:\\Program Files\\yasige" spellcheck="false">
      </div>
      <div class="path-btn-row">
        <button type="button" class="btn-action-small" id="btnBrowseFolder" title="Duyệt thư mục yasige">📁 Chọn thư mục</button>
        <button type="button" class="btn-action-small" id="btnBrowseFile" title="Chọn tệp app.asar hoặc yasige.exe">📂 Chọn tệp</button>
        <button type="button" class="btn-action-small" id="btnDefaultPath" title="Khôi phục đường dẫn mặc định">↺ Mặc định</button>
      </div>
      <div class="path-status">
        <span id="statusDot" class="status-dot ok"></span>
        <span id="statusText" class="status-text ok">Đang kiểm tra đường dẫn...</span>
      </div>
    </div>

    <div class="action-label">Chọn ngôn ngữ:</div>

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
    const pathInput = document.getElementById('pathInput');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const btnBrowseFolder = document.getElementById('btnBrowseFolder');
    const btnBrowseFile = document.getElementById('btnBrowseFile');
    const btnDefaultPath = document.getElementById('btnDefaultPath');

    let defaultPathVal = 'C:\\\\Program Files\\\\yasige';

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

    async function checkPathStatus(customPath) {
      try {
        const p = customPath || pathInput.value.trim();
        const res = await fetch('/api/status?path=' + encodeURIComponent(p));
        const data = await res.json();
        if (data.appInstalled) {
          statusDot.className = 'status-dot ok';
          statusText.className = 'status-text ok';
          statusText.innerText = '✓ Đã tìm thấy tệp cài đặt IELTS Bro (app.asar)';
        } else {
          statusDot.className = 'status-dot warn';
          statusText.className = 'status-text warn';
          statusText.innerText = '⚠ Không tìm thấy app.asar tại đường dẫn này';
        }
        // Save path to server config
        fetch('/api/save-path', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: p })
        }).catch(() => {});
      } catch (err) {
        statusDot.className = 'status-dot warn';
        statusText.className = 'status-text warn';
        statusText.innerText = 'Không thể kiểm tra đường dẫn';
      }
    }

    let debounceTimer = null;
    pathInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        checkPathStatus(pathInput.value.trim());
      }, 350);
    });

    btnBrowseFolder.addEventListener('click', async () => {
      showToast('Đang mở hộp thoại chọn thư mục...', 'loading', 2000);
      try {
        const res = await fetch('/api/browse-folder');
        const data = await res.json();
        if (data && data.path) {
          pathInput.value = data.path;
          checkPathStatus(data.path);
          showToast('Đã chọn thư mục!', 'success', 2000);
        }
      } catch (err) {
        showToast('Lỗi chọn thư mục: ' + err.message, 'error', 3000);
      }
    });

    btnBrowseFile.addEventListener('click', async () => {
      showToast('Đang mở hộp thoại chọn tệp...', 'loading', 2000);
      try {
        const res = await fetch('/api/browse-file');
        const data = await res.json();
        if (data && data.path) {
          pathInput.value = data.path;
          checkPathStatus(data.path);
          showToast('Đã chọn tệp!', 'success', 2000);
        }
      } catch (err) {
        showToast('Lỗi chọn tệp: ' + err.message, 'error', 3000);
      }
    });

    btnDefaultPath.addEventListener('click', () => {
      pathInput.value = defaultPathVal;
      checkPathStatus(defaultPathVal);
      showToast('Đã đặt lại đường dẫn mặc định', 'success', 2000);
    });

    // Init config on load
    fetch('/api/config')
      .then(res => res.json())
      .then(cfg => {
        if (cfg.appPath) pathInput.value = cfg.appPath;
        if (cfg.defaultPath) defaultPathVal = 'C:\\\\Program Files\\\\yasige';
        checkPathStatus(pathInput.value);
      })
      .catch(() => {
        checkPathStatus();
      });

    async function applyLang(lang) {
      showToast('Đang áp dụng bản dịch...', 'loading', 0);
      const appPath = pathInput.value.trim();
      try {
        const res = await fetch('/api/patch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang, appPath })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Đã áp dụng thành công! Đang tự động mở IELTS Bro...', 'success', 3500);
          checkPathStatus(appPath);
        } else {
          showToast('Lỗi: ' + (data.error || 'Thao tác không thành công'), 'error', 5000);
        }
      } catch (err) {
        showToast('Lỗi kết nối: ' + err.message, 'error', 5000);
      }
    }

    async function restoreOriginal() {
      showToast('Đang khôi phục bản gốc...', 'loading', 0);
      const appPath = pathInput.value.trim();
      try {
        const res = await fetch('/api/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appPath })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Đã khôi phục cài đặt gốc! Đang tự động mở IELTS Bro...', 'success', 3500);
          checkPathStatus(appPath);
        } else {
          showToast('Lỗi: ' + (data.error || 'Thất bại'), 'error', 5000);
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error', 5000);
      }
    }
  </script>
</body>
</html>
`;

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const pathname = parsedUrl.pathname;

  if (req.method === 'GET' && pathname === '/logo.png') {
    const filePath = path.join(__dirname, 'logo.png');
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML);
    return;
  }

  if (req.method === 'GET' && pathname === '/api/config') {
    const cfg = loadConfig();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ...cfg, defaultPath: DEFAULT_APP_PATH }));
    return;
  }

  if (req.method === 'GET' && pathname === '/api/status') {
    const targetPath = parsedUrl.searchParams.get('path');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getStatus(targetPath || loadConfig().appPath)));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/save-path') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { path: newPath } = JSON.parse(body || '{}');
        if (newPath) {
          const cfg = loadConfig();
          cfg.appPath = newPath;
          saveConfig(cfg);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/browse-folder') {
    try {
      const chosenPath = await openWindowsDialog('folder');
      if (chosenPath) {
        const cfg = loadConfig();
        cfg.appPath = chosenPath;
        saveConfig(cfg);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ path: chosenPath }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (req.method === 'GET' && pathname === '/api/browse-file') {
    try {
      const chosenPath = await openWindowsDialog('file');
      if (chosenPath) {
        const cfg = loadConfig();
        cfg.appPath = chosenPath;
        saveConfig(cfg);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ path: chosenPath }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/patch') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { lang, appPath } = JSON.parse(body || '{}');
        const targetPath = appPath || loadConfig().appPath;
        await patch(targetPath, lang || 'vi');
        setTimeout(() => {
          launchApp(targetPath);
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

  if (req.method === 'POST' && pathname === '/api/restore') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { appPath } = JSON.parse(body || '{}');
        const targetPath = appPath || loadConfig().appPath;
        await restore(targetPath);
        setTimeout(() => {
          launchApp(targetPath);
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

  res.writeHead(404);
  res.end();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[GUI Server] Running at http://127.0.0.1:${PORT}`);
});
