const fs = require('fs');
const path = require('path');
const asar = require('@electron/asar');

// Default install path for yasige
const DEFAULT_APP_PATH = 'C:\\Program Files\\yasige\\resources\\app.asar';

async function patch(asarPath = DEFAULT_APP_PATH, lang = 'vi') {
  console.log('=== IELTS Bro Translator Patcher ===');
  console.log('Target app.asar:', asarPath);
  console.log('Language chosen:', lang);

  if (!fs.existsSync(asarPath)) {
    console.error('Error: Could not find app.asar at', asarPath);
    process.exit(1);
  }

  const backupPath = asarPath + '.bak';
  if (!fs.existsSync(backupPath)) {
    console.log('Creating backup at', backupPath, '...');
    fs.copyFileSync(asarPath, backupPath);
    console.log('Backup created successfully!');
  } else {
    console.log('Existing backup found at', backupPath);
  }

  const tempExtractDir = path.join(__dirname, 'temp_patch');
  if (fs.existsSync(tempExtractDir)) {
    fs.rmSync(tempExtractDir, { recursive: true, force: true });
  }

  console.log('Extracting app.asar...');
  asar.extractAll(asarPath, tempExtractDir);

  const preloadPath = path.join(tempExtractDir, '.webpack', 'renderer', 'main_window', 'preload.js');
  if (!fs.existsSync(preloadPath)) {
    console.error('Error: preload.js not found in extracted archive!');
    process.exit(1);
  }

  // Read dictionary
  const dictFile = lang === 'en' ? 'dict_en.json' : 'dict_vi.json';
  const dictData = fs.readFileSync(path.join(__dirname, dictFile), 'utf8');

  // Read translator script
  const translatorCode = fs.readFileSync(path.join(__dirname, 'translator.js'), 'utf8');

  const injection = 
// === [START IELTS BRO TRANSLATOR INJECTION] ===
try {
  window.__IELTS_BRO_LANG__ = "";
  window.__IELTS_BRO_DICT__ = ;
  
} catch (err) {
  console.error('[IELTS-Bro-Translator] Injection error:', err);
}
// === [END IELTS BRO TRANSLATOR INJECTION] ===
;

  console.log('Injecting translator into preload.js...');
  let preloadContent = fs.readFileSync(preloadPath, 'utf8');

  // Remove existing injection if previously patched
  const startMarker = '// === [START IELTS BRO TRANSLATOR INJECTION] ===';
  const endMarker = '// === [END IELTS BRO TRANSLATOR INJECTION] ===';
  if (preloadContent.includes(startMarker) && preloadContent.includes(endMarker)) {
    const regex = new RegExp(${startMarker}[\\s\\S]*?, 'g');
    preloadContent = preloadContent.replace(regex, '');
  }

  preloadContent = preloadContent + '\n' + injection;
  fs.writeFileSync(preloadPath, preloadContent, 'utf8');

  console.log('Repacking app.asar...');
  const tempOutputAsar = path.join(__dirname, 'app_patched.asar');
  if (fs.existsSync(tempOutputAsar)) {
    fs.unlinkSync(tempOutputAsar);
  }
  await asar.createPackage(tempExtractDir, tempOutputAsar);

  console.log('Replacing app.asar in IELTS Bro installation...');
  try {
    fs.copyFileSync(tempOutputAsar, asarPath);
    console.log('Successfully applied patch!');
  } catch (err) {
    console.error('Permission error while overwriting app.asar:', err.message);
    console.log('Note: If IELTS Bro is open, please close it first.');
  }

  // Cleanup
  fs.rmSync(tempExtractDir, { recursive: true, force: true });
  if (fs.existsSync(tempOutputAsar)) {
    fs.unlinkSync(tempOutputAsar);
  }

  console.log('Done! You can now launch IELTS Bro.');
}

function restore(asarPath = DEFAULT_APP_PATH) {
  console.log('=== IELTS Bro Translator Restore ===');
  const backupPath = asarPath + '.bak';
  if (!fs.existsSync(backupPath)) {
    console.error('Error: No backup file found at', backupPath);
    return;
  }
  try {
    fs.copyFileSync(backupPath, asarPath);
    console.log('Successfully restored original app.asar from backup!');
  } catch (err) {
    console.error('Error restoring app.asar:', err.message);
    console.log('Please ensure IELTS Bro is closed.');
  }
}

const action = process.argv[2] || 'patch';
const argLang = process.argv[3] || 'vi';

if (action === 'restore') {
  restore();
} else {
  patch(DEFAULT_APP_PATH, argLang);
}
