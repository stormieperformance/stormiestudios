// Theme toggle, hamburger menu, and language switching — shared across every page.
(function () {
  // ---------- Theme toggle ----------
  function setTheme(t) {
    document.body.setAttribute('data-theme', t);
    localStorage.setItem('ss-theme', t);
    document.querySelectorAll('[data-mode-icon]').forEach(function (icon) {
      icon.innerHTML = t === 'b'
        ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
        : '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    });
  }
  document.querySelectorAll('[data-mode-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var current = document.body.getAttribute('data-theme');
      setTheme(current === 'b' ? 'c' : 'b');
    });
  });
  setTheme(localStorage.getItem('ss-theme') === 'b' ? 'b' : 'c');

  // ---------- Hamburger mobile menu ----------
  var hamburger = document.querySelector('[data-hamburger]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ---------- Language switching ----------
  // Shared strings used identically across every page (nav, footer, common CTA).
  var SHARED_I18N = {
    en: {
      nav_work: 'Work', nav_services: 'Who I work with', nav_about: 'About', nav_process: 'What you get',
      nav_cta: 'Request a consultation',
      footer_tagline1: 'Digital studio for sport &amp; fitness brands.',
      footer_tagline2: 'Websites that perform.<br>Professionally managed.',
      footer_nav_title: 'Navigation', footer_nav_services: 'What you get', footer_nav_work: 'Work',
      footer_nav_about: 'About', footer_nav_who: 'Who I work with', footer_nav_faq: 'FAQ', footer_nav_contact: 'Contact',
      footer_company_title: 'Company', footer_company_name: 'Stormie Studios', footer_company_by: 'By Storm Kolmodin',
      footer_company_city: 'Stockholm, Sweden', footer_company_reg: 'Registered business in Sweden',
      footer_legal_title: 'Legal', footer_legal_privacy: 'Privacy Policy', footer_legal_terms: 'Terms &amp; Conditions', footer_legal_cookie: 'Cookie Policy',
      footer_rights: '&copy; 2026 Stormie Studios. All rights reserved.',
      footer_credit: 'Built by Stormie Studios.',
    },
    sv: {
      nav_work: 'Arbete', nav_services: 'Vem jag jobbar med', nav_about: 'Om oss', nav_process: 'Vad ni får',
      nav_cta: 'Boka konsultation',
      footer_tagline1: 'Digital studio för sport- &amp; träningsvarumärken.',
      footer_tagline2: 'Webbplatser som presterar.<br>Professionellt förvaltade.',
      footer_nav_title: 'Navigering', footer_nav_services: 'Vad ni får', footer_nav_work: 'Arbete',
      footer_nav_about: 'Om oss', footer_nav_who: 'Vem jag jobbar med', footer_nav_faq: 'Vanliga frågor', footer_nav_contact: 'Kontakt',
      footer_company_title: 'Företag', footer_company_name: 'Stormie Studios', footer_company_by: 'Av Storm Kolmodin',
      footer_company_city: 'Stockholm, Sverige', footer_company_reg: 'Registrerad verksamhet i Sverige',
      footer_legal_title: 'Juridik', footer_legal_privacy: 'Integritetspolicy', footer_legal_terms: 'Villkor', footer_legal_cookie: 'Cookiepolicy',
      footer_rights: '&copy; 2026 Stormie Studios. Alla rättigheter förbehållna.',
      footer_credit: 'Byggd av Stormie Studios.',
    },
    th: {
      nav_work: 'ผลงาน', nav_services: 'ลูกค้าที่เหมาะกับเรา', nav_about: 'เกี่ยวกับเรา', nav_process: 'สิ่งที่คุณจะได้รับ',
      nav_cta: 'ขอคำปรึกษา',
      footer_tagline1: 'สตูดิโอดิจิทัลสำหรับแบรนด์กีฬาและฟิตเนส',
      footer_tagline2: 'เว็บไซต์ที่ให้ผลลัพธ์<br>ดูแลอย่างมืออาชีพ',
      footer_nav_title: 'เมนู', footer_nav_services: 'สิ่งที่คุณจะได้รับ', footer_nav_work: 'ผลงาน',
      footer_nav_about: 'เกี่ยวกับเรา', footer_nav_who: 'ลูกค้าที่เหมาะกับเรา', footer_nav_faq: 'คำถามที่พบบ่อย', footer_nav_contact: 'ติดต่อเรา',
      footer_company_title: 'บริษัท', footer_company_name: 'Stormie Studios', footer_company_by: 'โดย Storm Kolmodin',
      footer_company_city: 'สตอกโฮล์ม สวีเดน', footer_company_reg: 'จดทะเบียนธุรกิจในสวีเดน',
      footer_legal_title: 'กฎหมาย', footer_legal_privacy: 'นโยบายความเป็นส่วนตัว', footer_legal_terms: 'ข้อกำหนดและเงื่อนไข', footer_legal_cookie: 'นโยบายคุกกี้',
      footer_rights: '&copy; 2026 Stormie Studios สงวนลิขสิทธิ์',
      footer_credit: 'สร้างโดย Stormie Studios',
    },
  };

  function mergedDict(lang) {
    var pageDict = (window.PAGE_I18N && window.PAGE_I18N[lang]) || {};
    return Object.assign({}, SHARED_I18N[lang], pageDict);
  }

  function applyLang(lang) {
    var dict = mergedDict(lang);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.documentElement.setAttribute('lang', lang);
    document.body.classList.toggle('lang-th', lang === 'th');
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    localStorage.setItem('ss-lang', lang);
    if (typeof window.onLangChange === 'function') window.onLangChange(lang);
  }

  document.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.dataset.lang); });
  });

  window.ssApplyLang = applyLang;
  var savedLang = localStorage.getItem('ss-lang') || 'en';
  applyLang(savedLang);
})();
