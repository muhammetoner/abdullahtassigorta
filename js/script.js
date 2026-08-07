document.addEventListener('DOMContentLoaded', () => {

  /* ==================== Header scroll & mobile menu ==================== */
  const header = document.getElementById('siteHeader');
  const menuBtn = document.getElementById('menuBtn');
  const menuIcon = document.getElementById('menuIcon');
  const mobileMenu = document.getElementById('mobileMenu');

  let lockedScrollY = 0;
  const toggleMenu = () => {
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    menuIcon.classList.toggle('fa-bars', !isOpen);
    menuIcon.classList.toggle('fa-xmark', isOpen);

    if (isOpen) {
      lockedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo(0, lockedScrollY);
    }
  };
  menuBtn.addEventListener('click', toggleMenu);
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => { if (mobileMenu.classList.contains('open')) toggleMenu(); });
  });

  const scrollProgress = document.getElementById('scrollProgress');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    toggleBackToTop();
    updateScrollSpy();
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ==================== Scroll reveal ==================== */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ==================== Scrollspy ==================== */
  const sections = ['anasayfa', 'hakkimizda', 'urunler', 'neden-biz', 'iletisim'];
  const navLinks = document.querySelectorAll('.nav-link');
  function updateScrollSpy() {
    let current = sections[0];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 140) current = id;
    }
    navLinks.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ==================== Back to top ==================== */
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ==================== Contact form ==================== */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'adSoyad', check: v => v.trim().length >= 3 },
      { id: 'telefon', check: v => /^[0-9\s()+-]{10,15}$/.test(v.trim()) },
      { id: 'sigortaTuru', check: v => v.trim().length > 0 },
    ];

    fields.forEach(({ id, check }) => {
      const input = document.getElementById(id);
      const errorEl = document.querySelector(`[data-error-for="${id}"]`);
      const ok = check(input.value);
      input.classList.toggle('input-error', !ok);
      if (errorEl) errorEl.classList.toggle('show', !ok);
      if (!ok) valid = false;
    });

    if (!valid) return;

    const adSoyad = document.getElementById('adSoyad').value.trim();
    const telefon = document.getElementById('telefon').value.trim();
    const sigortaTuru = document.getElementById('sigortaTuru').value;
    const mesaj = document.getElementById('mesaj').value.trim();

    const text = `Merhaba Abdullah Taş Sigorta, sigorta teklifi almak istiyorum.%0A%0AAd Soyad: ${encodeURIComponent(adSoyad)}%0ATelefon: ${encodeURIComponent(telefon)}%0ASigorta Türü: ${encodeURIComponent(sigortaTuru)}%0AMesaj: ${encodeURIComponent(mesaj || '-')}`;
    const waUrl = `https://wa.me/905426830586?text=${text}`;

    window.open(waUrl, '_blank', 'noopener');
    formSuccess.classList.remove('hidden');

    form.reset();
    setTimeout(() => formSuccess.classList.add('hidden'), 6000);
  });

  /* ==================== Footer year ==================== */
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  onScroll();
});
