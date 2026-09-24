(function() {
  'use strict';

  // Config: 'vi' or 'en'
  const TARGET_LANG = window.__IELTS_BRO_LANG__ || 'vi';

  // Dictionary loaded in runtime
  let DICT = window.__IELTS_BRO_DICT__ || {};

  // Sort keys by descending length to match longest phrases first
  let sortedKeys = Object.keys(DICT).sort((a, b) => b.length - a.length);

  function updateDict(newDict) {
    DICT = newDict;
    sortedKeys = Object.keys(DICT).sort((a, b) => b.length - a.length);
  }

  // Regex to detect Chinese characters
  const CHINESE_REGEX = /[\u4e00-\u9fa5]/;

  // Cache to avoid translating identical strings repeatedly
  const translationCache = new Map();

  function translateText(text) {
    if (!text || !CHINESE_REGEX.test(text)) {
      return text;
    }

    if (translationCache.has(text)) {
      return translationCache.get(text);
    }

    let result = text;
    for (const key of sortedKeys) {
      if (result.includes(key)) {
        result = result.replaceAll(key, DICT[key]);
      }
    }

    translationCache.set(text, result);
    return result;
  }

  function shouldSkipNode(node) {
    if (!node) return true;
    const parent = node.parentElement;
    if (!parent) return true;

    // Skip script, style, code, audio, video tags
    const tag = parent.tagName ? parent.tagName.toUpperCase() : '';
    if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT', 'TEXTAREA'].includes(tag)) {
      return true;
    }

    // Crucial rule: Never translate IELTS Exam Reading/Listening/Questions content
    // Check if parent has exam question/passage identifiers
    const className = (parent.className && typeof parent.className === 'string') ? parent.className : '';
    if (className.includes('passage-content') || className.includes('article-content') || className.includes('reading-article')) {
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
      // Translate attributes: placeholder, title, aria-label
      for (const attr of ['placeholder', 'title', 'aria-label']) {
        const val = node.getAttribute(attr);
        if (val && CHINESE_REGEX.test(val)) {
          node.setAttribute(attr, translateText(val));
        }
      }

      // Traverse children
      for (let child = node.firstChild; child; child = child.nextSibling) {
        translateNode(child);
      }
    }
  }

  // Observe DOM changes
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

  window.__IELTS_BRO_TRANSLATOR__ = {
    translateText,
    updateDict
  };

  console.log('[IELTS-Bro-Translator] Loaded successfully. Target Language:', TARGET_LANG);
})();
