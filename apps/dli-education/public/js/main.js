/* DLI Education — shared behaviour for all three pages */
(function () {
  'use strict';

  /* ---- Mobile nav ---- */
  var navEl = document.querySelector('.nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  var setMenu = function (open) {
    links.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (navEl) {
      // a transformed .nav breaks position:fixed for the drawer, so while the
      // menu is open force the bar back into place and never let it hide.
      navEl.classList.toggle('menu-open', open);
      if (open) navEl.classList.remove('nav-hidden');
    }
  };

  if (toggle && links) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(!links.classList.contains('open'));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && links.classList.contains('open')) setMenu(false);
    });
    // click the dimmed backdrop (anywhere outside the drawer) to close
    document.addEventListener('click', function (e) {
      if (!links.classList.contains('open')) return;
      if (e.target.closest('#navLinks') || e.target.closest('#navToggle')) return;
      setMenu(false);
    });
    // Esc closes
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) setMenu(false);
    });
  }

  /* ---- Nav: hide on scroll-down, show on scroll-up ---- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var lastY = window.pageYOffset || 0;
    var updateNav = function () {
      var cy = window.pageYOffset || 0;
      nav.classList.toggle('scrolled', cy > 20);
      if (!(links && links.classList.contains('open'))) {
        if (cy <= 0) nav.classList.remove('nav-hidden');
        else if (cy > lastY && cy > 140) nav.classList.add('nav-hidden');
        else if (cy < lastY - 4) nav.classList.remove('nav-hidden');
      }
      lastY = cy;
    };
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ---- Year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Reveal on scroll ---- */
  var revs = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revs.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revs.forEach(function (el) { io.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Count-up ---- */
  var nums = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && nums.length) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1400, 1);
          var val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
          el.textContent = val.toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString() + suffix;
        }
        requestAnimationFrame(step);
        nio.unobserve(el);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { nio.observe(el); });
  }

  /* ---- Contact form: inline success, no backend yet ----
     TODO: replace the success block with a fetch() POST to the
     Apps Script endpoint (see APPS_SCRIPT_URL pattern in Tinkerchamps/). */
  var form = document.getElementById('enquiryForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ok = document.getElementById('formSuccess');
      if (ok) ok.hidden = false;
      form.reset();
    });
  }
})();
