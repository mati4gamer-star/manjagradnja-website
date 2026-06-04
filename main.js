// Highlight current page link in nav
(function() {
  var page = location.pathname.split('/').pop() || 'index.html';
  // normalise: strip .html so both "radovi" and "radovi.html" work
  var base = page.replace(/\.html$/, '');
  var map = { 'radovi': 'radovi.html', 'usluge': 'usluge.html', 'o-nama': 'o-nama.html', 'kontakt': 'kontakt.html' };
  if (map[base]) {
    document.querySelectorAll('.nav-links a').forEach(function(a) {
      if (a.getAttribute('href') === map[base]) a.classList.add('active');
    });
  }
})();

/* ── HERO SLIDESHOW ───────────────────────────────────────────── */
(function() {
  var slides, dots, current = 0, timer;

  function init() {
    slides = document.querySelectorAll('.hero-slide');
    dots   = document.querySelectorAll('.slide-dot');
    if (!slides.length) return;
    timer = setInterval(function() { goToSlide(current + 1); }, 5500);
  }

  window.goToSlide = function(n) {
    if (!slides) return;
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    clearInterval(timer);
    timer = setInterval(function() { goToSlide(current + 1); }, 5500);
  };
  window.nextSlide = function() { goToSlide(current + 1); };
  window.prevSlide = function() { goToSlide(current - 1); };

  document.addEventListener('DOMContentLoaded', init);
})();

/* ── NAV ──────────────────────────────────────────────────────── */
function toggleMenu() {
  var links = document.getElementById('navLinks');
  var btn   = document.getElementById('burger');
  var nav   = document.getElementById('mainNav');
  links.classList.toggle('open');
  btn.classList.toggle('open');
  nav.classList.toggle('menu-open');
}

// close menu on nav link click
document.querySelectorAll('.nav-links a').forEach(function(a) {
  a.addEventListener('click', function() {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('burger').classList.remove('open');
  });
});

// determine if we are on the home page (dark hero)
var isHomePage = (function() {
  var page = location.pathname.split('/').pop() || '';
  var base = page.replace(/\.html$/, '');
  return base === 'manja-gradnja' || base === '' || base === 'index';
})();

// On non-home pages, nav is always opaque (white bg = dark text needed)
if (!isHomePage) {
  var nav = document.getElementById('mainNav');
  if (nav) nav.classList.add('scrolled');
}

function updateActiveLink() {
  if (!isHomePage) return;
  var sections = ['vrh','galerija','kako-radimo','o-nama','usluge','kontakt'];
  var scrollY  = window.scrollY + 100;
  var active   = sections[0];
  sections.forEach(function(id) {
    var el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) active = id;
  });
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    var href = a.getAttribute('href').replace('#','');
    a.classList.toggle('active', href === active);
  });
}

// scroll shadow + active link
window.addEventListener('scroll', function() {
  document.getElementById('mainNav').classList.toggle('scrolled', !isHomePage || window.scrollY > 60);
  if (isHomePage) updateActiveLink();
});

/* ── GALLERY TABS (legacy) ────────────────────────────────────── */
function switchTab(btn, panelId) {
  document.querySelectorAll('.gallery-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.gallery-panel').forEach(function(p) { p.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');
}

/* ── GALLERY FILTERS (animated) ───────────────────────────────── */
function switchGallery(btn, panelId) {
  var current = document.querySelector('.gallery-panel.active');
  var next = document.getElementById(panelId);
  if (!next || current === next) return;
  document.querySelectorAll('.gallery-filter').forEach(function(f) { f.classList.remove('active'); });
  btn.classList.add('active');
  current.style.opacity = '0';
  current.style.transition = 'opacity .18s ease';
  setTimeout(function() {
    current.classList.remove('active');
    current.style.cssText = '';
    next.classList.add('active');
    next.style.opacity = '0';
    requestAnimationFrame(function() { requestAnimationFrame(function() {
      next.style.transition = 'opacity .28s ease';
      next.style.opacity = '1';
      setTimeout(function() { next.style.cssText = ''; }, 280);
    }); });
  }, 180);
}

/* ── SERVICES TOGGLE ──────────────────────────────────────────── */
function toggleUsluge() {
  var btn    = document.getElementById('uslugeToggle');
  var hidden = document.querySelectorAll('.usluga-card.hidden-card');
  var isOpen = btn.classList.contains('open');
  hidden.forEach(function(card) {
    card.style.display = isOpen ? 'none' : 'block';
  });
  btn.classList.toggle('open');
  btn.innerHTML = isOpen
    ? '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg> Prikaži sve usluge'
    : '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg> Sakrij usluge';
}

/* ── SCROLL PROGRESS ─────────────────────────────────────────── */
var progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', function() {
  var scrolled = window.scrollY;
  var total    = document.body.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrolled / total * 100) + '%';
  // hide scroll cue after first scroll (only on home page)
  var cue = document.querySelector('.scroll-cue');
  if (cue && scrolled > 80) cue.classList.add('hidden');
}, { passive: true });

/* ── REVEAL ON SCROLL ─────────────────────────────────────────── */
var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e, i) {
    if (e.isIntersecting) {
      setTimeout(function() { e.target.classList.add('visible'); }, i * 80);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(function(el) { obs.observe(el); });

/* ── STAGGER SERVICE CARDS ────────────────────────────────────── */
var cardObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      var cards = e.target.querySelectorAll('.usluga-card:not(.hidden-card)');
      cards.forEach(function(card, i) {
        setTimeout(function() { card.classList.add('stagger-in'); }, i * 80);
      });
      cardObs.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });
var grid = document.querySelector('.usluge-grid');
if (grid) cardObs.observe(grid);

/* ── STAT COUNTER ────────────────────────────────────────────── */
function countUp(el, target, suffix, duration) {
  var start = 0;
  var step  = Math.ceil(target / (duration / 16));
  var timer = setInterval(function() {
    start = Math.min(start + step, target);
    el.textContent = start + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}
var heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  var statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.stat').forEach(function(stat) {
        var num    = stat.querySelector('.stat-num');
        var raw    = num.textContent.trim();
        var suffix = raw.replace(/[0-9]/g, '');
        var value  = parseInt(raw.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(value) && value < 9999) {
          var from = value > 100 ? value - 4 : 0;
          num.textContent = from + suffix;
          setTimeout(function() { countUp(num, value, suffix, 900); }, 200);
        }
      });
      statsObserver.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

/* ── CONTACT FORM ─────────────────────────────────────────────── */
function posaljiUpit() {
  var ime    = document.getElementById('f-ime').value.trim();
  var tel    = document.getElementById('f-tel').value.trim();
  var usluga = document.getElementById('f-usluga').value.trim();
  var poruka = document.getElementById('f-poruka').value.trim();

  if (!ime || !tel) {
    alert('Molimo unesite ime i broj telefona.');
    return;
  }

  var btn = document.querySelector('.btn-submit');
  btn.textContent = 'Šalje se...';
  btn.disabled = true;

  fetch('https://formspree.io/f/xzdqzzza', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ ime: ime, telefon: tel, usluga: usluga, poruka: poruka })
  })
  .then(function(res) {
    if (!res.ok) throw new Error('network');
    document.getElementById('formSuccess').style.display = 'block';
    document.getElementById('f-ime').value    = '';
    document.getElementById('f-tel').value    = '';
    document.getElementById('f-usluga').value = '';
    document.getElementById('f-poruka').value = '';
    btn.textContent = 'Pošalji upit';
    btn.disabled = false;
  })
  .catch(function() {
    alert('Greška pri slanju. Pokušajte ponovo ili nas pozovite na 060 711 9780.');
    btn.textContent = 'Pošalji upit';
    btn.disabled = false;
  });
}

/* ── LIGHTBOX ──────────────────────────────────────────────────── */
(function() {
  var lbItems = [], lbCurrent = 0, touchX = 0, lb = null;

  function init() {
    lb = document.getElementById('lightbox');
    if (!lb) return;

    document.addEventListener('click', function(e) {
      var item = e.target.closest('.gm-item');
      if (!item) return;
      var panel = document.querySelector('.gallery-panel.active');
      if (!panel) return;
      var all = Array.from(panel.querySelectorAll('.gm-item'));
      lbItems = all.map(function(el) {
        var img = el.querySelector('img');
        return { src: img ? img.src : '', alt: img ? (img.alt || '') : '', cat: el.dataset.cat || '', title: el.dataset.title || '' };
      }).filter(function(d) { return d.src; });
      lbCurrent = all.indexOf(item);
      if (lbCurrent < 0) lbCurrent = 0;
      open(lbCurrent);
    });

    lb.addEventListener('click', function(e) { if (e.target === lb) close(); });

    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') nav(-1);
      if (e.key === 'ArrowRight') nav(1);
    });

    lb.addEventListener('touchstart', function(e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function(e) {
      var dx = touchX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 48) nav(dx > 0 ? 1 : -1);
    }, { passive: true });
  }

  function open(idx) {
    lbCurrent = idx; show(idx);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    var img = document.getElementById('lb-img');
    if (img) { setTimeout(function() { img.src = ''; }, 300); }
  }

  function nav(dir) {
    if (!lbItems.length) return;
    lbCurrent = (lbCurrent + dir + lbItems.length) % lbItems.length;
    show(lbCurrent);
  }

  function show(idx) {
    var d = lbItems[idx];
    var img = document.getElementById('lb-img');
    var spin = document.getElementById('lb-spinner');
    var badge = document.getElementById('lb-badge');
    var caption = document.getElementById('lb-caption');
    var count = document.getElementById('lb-count');

    if (img) { img.style.opacity = '0'; img.style.transform = 'scale(.95)'; img.style.transition = 'none'; }
    if (spin) spin.style.display = 'block';

    var tmp = new Image();
    tmp.onload = function() {
      if (spin) spin.style.display = 'none';
      if (img) {
        img.src = d.src; img.alt = d.alt;
        requestAnimationFrame(function() {
          img.style.transition = 'opacity .3s ease, transform .38s cubic-bezier(.22,1,.36,1)';
          img.style.opacity = '1'; img.style.transform = 'scale(1)';
        });
      }
    };
    tmp.onerror = function() { if (spin) spin.style.display = 'none'; };
    tmp.src = d.src;

    if (badge) badge.textContent = d.cat;
    if (caption) caption.textContent = d.title;
    if (count) count.textContent = (idx + 1) + ' / ' + lbItems.length;
  }

  window.closeLightbox = close;
  window.lightboxNav = nav;
  document.addEventListener('DOMContentLoaded', init);
})();

/* ── iOS SINGLE-TAP FIX ─────────────────────────────────────────── */
(function() {
  var moved = false;
  document.addEventListener('touchmove', function() { moved = true; }, {passive: true});
  var sel = 'a.btn-outline, a.btn-primary, a.hero-cta, a.at-cta-link, a.hp-item, a.btn-channel';
  document.querySelectorAll(sel).forEach(function(el) {
    el.addEventListener('touchstart', function() { moved = false; }, {passive: true});
    el.addEventListener('touchend', function(e) {
      if (!moved && this.href) {
        e.preventDefault();
        window.location.href = this.href;
      }
    });
  });
})();
