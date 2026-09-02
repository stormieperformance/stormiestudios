// Theme toggle (dark <-> light), shared across every page
(function () {
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
  var saved = localStorage.getItem('ss-theme');
  setTheme(saved === 'b' ? 'b' : 'c');

  // Language selector — visual only for now; full SV/TH copy isn't wired in yet.
  document.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-lang]').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('[data-lang="' + btn.dataset.lang + '"]').forEach(function (b) { b.classList.add('active'); });
    });
  });

  // Hamburger mobile menu
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
})();
