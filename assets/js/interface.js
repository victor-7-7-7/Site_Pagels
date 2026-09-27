(() => {
  'use strict';
  const menuButton = document.getElementById('menuButton');
  const mainNav = document.getElementById('mainNav');
  const navLinks = [...mainNav.querySelectorAll('a[href^="#"]')];
  const mobileQuery = window.matchMedia('(max-width: 700px)');
  const mobileBooking = document.getElementById('mobileBooking');
  const bookingSection = document.getElementById('aula-gratis');
  const navSections = [...document.querySelectorAll('main section[id]')].filter(section => navLinks.some(link => link.hash === '#' + section.id));

  function setMenu(open, returnFocus = false) {
    menuButton.classList.toggle('active', open);
    mainNav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  document.addEventListener('focusin', event => {
    if (!event.target.closest('.site-header') && mainNav.classList.contains('open')) setMenu(false);
  });
  mobileQuery.addEventListener('change', () => setMenu(false));

  let ticking = false;
  function updateScroll() {
    const offset = 155;
    let current = '';
    navSections.forEach(section => {
      if (section.getBoundingClientRect().top <= offset) current = section.id;
    });
    navLinks.forEach(link => {
      const active = link.hash === '#' + current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();

  if ('IntersectionObserver' in window && mobileBooking && bookingSection) {
    new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting;
      mobileBooking.classList.toggle('is-hidden', visible);
      mobileBooking.inert = visible;
      mobileBooking.setAttribute('aria-hidden', String(visible));
    }, { threshold: 0 }).observe(bookingSection);
  }
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
