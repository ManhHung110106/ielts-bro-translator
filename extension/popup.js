document.addEventListener('DOMContentLoaded', () => {
  const btnVi = document.getElementById('btn-vi');
  const btnEn = document.getElementById('btn-en');
  const btnRestore = document.getElementById('btn-restore');

  chrome.storage.sync.get(['targetLang', 'enabled'], (data) => {
    const lang = data.targetLang || 'vi';
    const enabled = typeof data.enabled !== 'undefined' ? data.enabled : true;

    if (enabled) {
      if (lang === 'vi') btnVi.classList.add('active');
      else btnEn.classList.add('active');
    }
  });

  function setLang(lang) {
    chrome.storage.sync.set({ targetLang: lang, enabled: true }, () => {
      btnVi.classList.toggle('active', lang === 'vi');
      btnEn.classList.toggle('active', lang === 'en');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'changeLang', lang: lang });
        }
      });
    });
  }

  btnVi.addEventListener('click', () => setLang('vi'));
  btnEn.addEventListener('click', () => setLang('en'));

  btnRestore.addEventListener('click', () => {
    chrome.storage.sync.set({ enabled: false }, () => {
      btnVi.classList.remove('active');
      btnEn.classList.remove('active');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleEnable', enabled: false });
        }
      });
    });
  });

  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', (e) => {
      const url = link.getAttribute('href');
      if (url && url.startsWith('http')) {
        e.preventDefault();
        chrome.tabs.create({ url });
      }
    });
  });
});