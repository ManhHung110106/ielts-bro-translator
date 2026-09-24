const fs = require('fs');
const path = require('path');
const asar = require('@electron/asar');
const { exec, spawn } = require('child_process');

const DEFAULT_APP_PATH = 'C:\\Program Files\\yasige\\resources\\app.asar';

function resolveAsarPath(inputPath) {
  if (!inputPath || typeof inputPath !== 'string' || !inputPath.trim()) {
    return DEFAULT_APP_PATH;
  }
  let p = inputPath.trim().replace(/^["']|["']$/g, '');
  if (fs.existsSync(p)) {
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      const inRes = path.join(p, 'resources', 'app.asar');
      if (fs.existsSync(inRes)) return inRes;
      const inDir = path.join(p, 'app.asar');
      if (fs.existsSync(inDir)) return inDir;
      return inRes;
    } else {
      if (p.toLowerCase().endsWith('.asar')) {
        return p;
      }
      if (p.toLowerCase().endsWith('.exe')) {
        const inRes = path.join(path.dirname(p), 'resources', 'app.asar');
        return inRes;
      }
      return p;
    }
  } else {
    if (p.toLowerCase().endsWith('app.asar')) {
      return p;
    }
    if (p.toLowerCase().endsWith('.exe')) {
      return path.join(path.dirname(p), 'resources', 'app.asar');
    }
    return path.join(p, 'resources', 'app.asar');
  }
}

function killApp() {
  return new Promise((resolve) => {
    // Kill IELTS Bro and any lingering updater or node processes running in yasige
    const ps = `Get-CimInstance Win32_Process | Where-Object { $_.ExecutablePath -like '*yasige*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`;
    exec(`powershell -NoProfile -Command "${ps}"`, () => {
      setTimeout(resolve, 1000);
    });
  });
}

function launchApp(targetPath = DEFAULT_APP_PATH) {
  try {
    const resolvedAsar = resolveAsarPath(targetPath);
    let installDir = path.dirname(resolvedAsar);
    if (path.basename(installDir).toLowerCase() === 'resources') {
      installDir = path.dirname(installDir);
    }
    if (!fs.existsSync(installDir)) {
      console.warn('[Patcher] Install directory does not exist:', installDir);
      return false;
    }
    const files = fs.readdirSync(installDir);
    const exe = files.find(f => f.endsWith('.exe') && !f.toLowerCase().includes('uninstall'));
    if (!exe) {
      console.warn('[Patcher] No executable found in:', installDir);
      return false;
    }
    const exePath = path.join(installDir, exe);
    const child = spawn(exePath, [], {
      cwd: installDir,
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    console.log('[Patcher] IELTS Bro launched automatically from ' + exePath);
    return true;
  } catch (err) {
    console.error('[Patcher] Failed to launch IELTS Bro:', err.message);
    return false;
  }
}

async function patch(asarPath = DEFAULT_APP_PATH, lang = 'vi') {
  asarPath = resolveAsarPath(asarPath);
  console.log(`[Patcher] Closing running IELTS Bro instances...`);
  await killApp();

  const backupPath = asarPath + '.bak';
  if (!fs.existsSync(backupPath)) {
    if (!fs.existsSync(asarPath)) {
      throw new Error(`Khong tim thay file app.asar tai: ${asarPath}`);
    }
    console.log(`[Patcher] Tao file sao luu tai ${backupPath}...`);
    fs.copyFileSync(asarPath, backupPath);
  }

  // ALWAYS extract from the pristine clean backup to prevent file degradation
  const sourceToExtract = fs.existsSync(backupPath) ? backupPath : asarPath;

  const tempExtractDir = path.join(__dirname, 'temp_patch');
  if (fs.existsSync(tempExtractDir)) {
    fs.rmSync(tempExtractDir, { recursive: true, force: true });
  }

  console.log(`[Patcher] Dang giai nen app.asar...`);
  asar.extractAll(sourceToExtract, tempExtractDir);

  const preloadPath = path.join(tempExtractDir, '.webpack', 'renderer', 'main_window', 'preload.js');
  if (!fs.existsSync(preloadPath)) {
    throw new Error('Khong tim thay preload.js trong goi ung dung!');
  }

  const dictFile = lang === 'en' ? 'dict_en.json' : 'dict_vi.json';
  const dictData = fs.readFileSync(path.join(__dirname, dictFile), 'utf8');
  const translatorCode = fs.readFileSync(path.join(__dirname, 'translator.js'), 'utf8');

  const injection = `
// === [START IELTS BRO TRANSLATOR INJECTION] ===
try {
  window.__IELTS_BRO_LANG__ = "${lang}";
  window.__IELTS_BRO_DICT__ = ${dictData.trim()};
  ${translatorCode}
} catch (err) {
  console.error('[IELTS-Bro-Translator] Injection error:', err);
}
// === [END IELTS BRO TRANSLATOR INJECTION] ===
`;

  let preloadContent = fs.readFileSync(preloadPath, 'utf8');
  const startMarker = '// === [START IELTS BRO TRANSLATOR INJECTION] ===';
  const endMarker = '// === [END IELTS BRO TRANSLATOR INJECTION] ===';
  if (preloadContent.includes(startMarker) && preloadContent.includes(endMarker)) {
    const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
    preloadContent = preloadContent.replace(regex, '');
  }

  preloadContent = preloadContent + '\n' + injection;
  fs.writeFileSync(preloadPath, preloadContent, 'utf8');

  console.log(`[Patcher] Dang dong goi lai app.asar...`);
  const tempOutputAsar = path.join(__dirname, 'app_patched.asar');
  if (fs.existsSync(tempOutputAsar)) {
    fs.unlinkSync(tempOutputAsar);
  }
  await asar.createPackage(tempExtractDir, tempOutputAsar);

  console.log(`[Patcher] Dang ghi de app.asar vao thu muc cai dat...`);
  fs.copyFileSync(tempOutputAsar, asarPath);

  // Clean up
  fs.rmSync(tempExtractDir, { recursive: true, force: true });
  if (fs.existsSync(tempOutputAsar)) {
    fs.unlinkSync(tempOutputAsar);
  }

  console.log(`[Patcher] Hoan tat cai dat ngon ngu: ${lang}`);
  return true;
}

async function restore(asarPath = DEFAULT_APP_PATH) {
  asarPath = resolveAsarPath(asarPath);
  console.log(`[Restore] Closing running IELTS Bro instances...`);
  await killApp();

  const backupPath = asarPath + '.bak';
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Khong tim thay file sao luu goc tai: ${backupPath}`);
  }

  fs.copyFileSync(backupPath, asarPath);
  console.log(`[Restore] Da khoi phuc app.asar goc thanh cong!`);
  return true;
}

function getStatus(asarPath = DEFAULT_APP_PATH) {
  const resolved = resolveAsarPath(asarPath);
  const exists = fs.existsSync(resolved);
  const hasBackup = fs.existsSync(resolved + '.bak');
  let installDir = path.dirname(resolved);
  if (path.basename(installDir).toLowerCase() === 'resources') {
    installDir = path.dirname(installDir);
  }
  return {
    appInstalled: exists,
    hasBackup: hasBackup,
    appPath: resolved,
    installDir: installDir
  };
}

module.exports = {
  DEFAULT_APP_PATH,
  resolveAsarPath,
  patch,
  restore,
  getStatus,
  killApp,
  launchApp
};

if (require.main === module) {
  const action = process.argv[2] || 'patch';
  const lang = process.argv[3] || 'vi';
  const customPath = process.argv[4];
  if (action === 'restore') {
    restore(customPath).catch(err => {
      console.error(err);
      process.exit(1);
    });
  } else {
    patch(customPath || DEFAULT_APP_PATH, lang).catch(err => {
      console.error(err);
      process.exit(1);
    });
  }
}