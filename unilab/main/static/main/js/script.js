// ---------- Header background on scroll ----------
// Smoothed with rAF so the class toggle never fights the scroll event rate.
const header = document.getElementById('siteHeader');
let ticking = false;

function updateHeader() {
  if (window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
  ticking = false;
}

document.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateHeader);
    ticking = true;
  }
}, { passive: true });

updateHeader();

// ---------- Mobile nav toggle ----------
const burger = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

function closeNav() {
  navLinks.classList.remove('open');
  burger.classList.remove('open');
  navBackdrop.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function openNav() {
  navLinks.classList.add('open');
  burger.classList.add('open');
  navBackdrop.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.contains('open');
  isOpen ? closeNav() : openNav();
});

navBackdrop.addEventListener('click', closeNav);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

// ---------- Smooth in-page scrolling ----------
// Native CSS scroll-behavior handles most of this, but we account for the
// fixed header height so sections don't land tucked underneath it.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const headerOffset = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset + 1;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---------- Reveal-on-scroll for cards ----------
// Cards fade/rise in with a gentle stagger as they cross the viewport.
const revealTargets = document.querySelectorAll('.service-card, .dept-card');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const grid = entry.target.closest('.service-grid, .dept-grid');
    const siblings = Array.from(grid.children);
    const index = siblings.indexOf(entry.target);
    entry.target.style.transitionDelay = `${index * 90}ms`;
    entry.target.classList.add('in');
    io.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => io.observe(el));