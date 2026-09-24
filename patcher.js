const fs = require('fs');
const path = require('path');
const asar = require('@electron/asar');
const { exec } = require('child_process');

const DEFAULT_APP_PATH = 'C:\\Program Files\\yasige\\resources\\app.asar';

function killApp() {
  return new Promise((resolve) => {
    const cmd = `powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.ExecutablePath -like '*yasige*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"`;
    exec(cmd, () => {
      setTimeout(resolve, 800);
    });
  });
}

async function patch(asarPath = DEFAULT_APP_PATH, lang = 'vi') {
  console.log(`[Patcher] Closing running IELTS Bro instances...`);
  await killApp();

  if (!fs.existsSync(asarPath)) {
    throw new Error(`Khong tim thay file app.asar tai: ${asarPath}`);
  }

  const backupPath = asarPath + '.bak';
  if (!fs.existsSync(backupPath)) {
    console.log(`[Patcher] Tao file sao luu tai ${backupPath}...`);
    fs.copyFileSync(asarPath, backupPath);
  }

  const tempExtractDir = path.join(__dirname, 'temp_patch');
  if (fs.existsSync(tempExtractDir)) {
    fs.rmSync(tempExtractDir, { recursive: true, force: true });
  }

  console.log(`[Patcher] Dang giai nen app.asar...`);
  asar.extractAll(asarPath, tempExtractDir);

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
  const exists = fs.existsSync(asarPath);
  const hasBackup = fs.existsSync(asarPath + '.bak');
  let currentLang = 'unknown';

  if (exists) {
    try {
      const header = fs.readFileSync(asarPath, { encoding: 'utf8', flag: 'r' }).slice(0, 5000);
      // We can also inspect backup status
    } catch {}
  }

  return {
    appInstalled: exists,
    hasBackup: hasBackup,
    appPath: asarPath
  };
}

module.exports = {
  patch,
  restore,
  getStatus,
  killApp
};

if (require.main === module) {
  const action = process.argv[2] || 'patch';
  const lang = process.argv[3] || 'vi';
  if (action === 'restore') {
    restore().catch(err => {
      console.error(err);
      process.exit(1);
    });
  } else {
    patch(DEFAULT_APP_PATH, lang).catch(err => {
      console.error(err);
      process.exit(1);
    });
  }
}