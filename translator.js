(function() {
  'use strict';

  const TARGET_LANG = window.__IELTS_BRO_LANG__ || 'vi';
  let DICT = window.__IELTS_BRO_DICT__ || {};
  let sortedKeys = Object.keys(DICT).sort((a, b) => b.length - a.length);

  // LocalStorage Cache for dynamic translations
  const CACHE_KEY = '__IELTS_BRO_CACHE_' + TARGET_LANG + '__';
  let dynamicCache = {};
  try {
    dynamicCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch (e) {
    dynamicCache = {};
  }

  function saveCache() {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(dynamicCache));
    } catch (e) {}
  }

  const CHINESE_REGEX = /[\u4e00-\u9fa5]/;
  const translationMemory = new Map();

  // Pending queue for batch dynamic translation API
  let pendingQueue = new Set();
  let debounceTimer = null;

  async function fetchTranslations(texts) {
    if (!texts.length) return;
    const combined = texts.join('\n');
    try {
      const targetCode = TARGET_LANG === 'en' ? 'en' : 'vi';
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
        // Re-run DOM pass to apply newly fetched translations
        if (document.body) translateNode(document.body);
      }
    } catch (err) {
      console.warn('[IELTS-Bro-Translator] Dynamic translation notice:', err.message);
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
    if (!text || !CHINESE_REGEX.test(text)) {
      return text;
    }

    if (translationMemory.has(text)) {
      return translationMemory.get(text);
    }

    if (dynamicCache[text]) {
      translationMemory.set(text, dynamicCache[text]);
      return dynamicCache[text];
    }

    // Step 1: Check curated dictionary replacement
    let result = text;
    let matched = false;
    for (const key of sortedKeys) {
      if (result.includes(key)) {
        result = result.replaceAll(key, DICT[key]);
        matched = true;
      }
    }

    // If still contains Chinese characters, queue for dynamic AI/API translation
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

    // Guard: Never translate IELTS test content (Reading, Listening transcripts, etc.)
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

  function startObserver() {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', startObserver);
      return;
    }

    translateNode(document.body);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }

  console.log('[IELTS-Bro-Translator] Dynamic Hybrid Translator loaded. Target:', TARGET_LANG);
})();