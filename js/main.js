(function () {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const toggle = qs('.menu-toggle');
  const nav = qs('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const opened = nav.classList.toggle('is-open');
      document.body.classList.toggle('is-menu-open', opened);
      toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
    qsa('.main-nav a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      document.body.classList.remove('is-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Smooth anchor scroll with sticky header offset so section titles stay visible
  qsa('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = qs(href);
      if (!target) return;
      event.preventDefault();
      const header = qs('.site-header');
      const offset = (header ? header.offsetHeight : 72) + 18;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      if (nav && toggle) {
        nav.classList.remove('is-open');
        document.body.classList.remove('is-menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });


  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  qsa('.reveal').forEach((el) => observer.observe(el));

  const form = qs('#calcForm');
  const monthSave = qs('#monthSave');
  const yearSave = qs('#yearSave');
  const formatRub = (value) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(value));
  const updateCalc = () => {
    if (!form || !monthSave || !yearSave) return;
    const mileage = Number(qs('#mileage').value) || 0;
    const consumption = Number(qs('#consumption').value) || 0;
    const fuelPrice = Number(qs('#fuelPrice').value) || 0;
    const cars = Number(qs('#carsCount').value) || 1;
    const savingRate = Number(qs('#savingRate').value) || 0.22;
    const fuelSpend = (mileage / 100) * consumption * fuelPrice * cars;
    const monthly = fuelSpend * savingRate;
    monthSave.textContent = `${formatRub(monthly)} ₽/мес.`;
    yearSave.textContent = `${formatRub(monthly * 12)} ₽/год`;
  };
  if (form) {
    form.addEventListener('input', updateCalc);
    form.addEventListener('change', updateCalc);
    updateCalc();
  }

  qsa('.lead-form').forEach((leadForm) => {
    leadForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = qs('button[type="submit"]', leadForm);
      if (!button) return;
      const oldText = button.textContent;
      button.textContent = 'Заявка зафиксирована';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = oldText;
        button.disabled = false;
      }, 2600);
    });
  });
})();
