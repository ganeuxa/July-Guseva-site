function initMobileNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  const desktop = window.matchMedia('(min-width: 960px)');
  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  const byId = new Map();
  links.forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) byId.set(section, link);
  });
  if (!byId.size) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.removeAttribute('aria-current'));
        const link = byId.get(entry.target);
        if (link) link.setAttribute('aria-current', 'true');
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  byId.forEach((_link, section) => observer.observe(section));
}

function initContactLinks() {
  const toast = document.querySelector('.contact-toast');
  const modal = document.querySelector('[data-phone-modal]');
  const modalNumber = modal?.querySelector('[data-phone-modal-number]');
  const modalCopy = modal?.querySelector('[data-phone-modal-copy]');
  const modalCloseControls = modal ? Array.from(modal.querySelectorAll('[data-phone-modal-close]')) : [];
  const coarsePointer = window.matchMedia('(pointer: coarse)');
  let toastTimer = null;
  let activePhone = '';
  let lastFocusedElement = null;

  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-1000px';
    document.body.append(textarea);
    textarea.select();

    try {
      return document.execCommand('copy');
    } finally {
      textarea.remove();
    }
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      console.warn('Clipboard copy failed', error);
    }

    try {
      return fallbackCopy(text);
    } catch (error) {
      console.warn('Fallback clipboard copy failed', error);
      return false;
    }
  };

  const showToast = (message) => {
    if (!toast) return;

    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
      window.setTimeout(() => {
        if (!toast.classList.contains('is-visible')) {
          toast.hidden = true;
        }
      }, 200);
    }, 2600);
  };

  const closePhoneModal = () => {
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    document.body.classList.remove('contact-modal-open');
    activePhone = '';

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  const openPhoneModal = (link) => {
    if (!modal || !modalNumber || !modalCopy) return;

    activePhone = link.dataset.contactPhone || link.getAttribute('href')?.replace(/^tel:/, '') || '';
    modalNumber.textContent = link.dataset.phoneDisplay || activePhone;
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('contact-modal-open');
    modalCopy.focus();
  };

  document.addEventListener('click', async (event) => {
    const emailLink = event.target.closest('[data-contact-email]');
    if (emailLink) {
      event.preventDefault();
      const copied = await copyToClipboard(emailLink.dataset.contactEmail);
      if (copied) showToast('Почта скопирована в буфер обмена');
      return;
    }

    const phoneLink = event.target.closest('[data-contact-phone]');
    if (phoneLink && !coarsePointer.matches) {
      event.preventDefault();
      openPhoneModal(phoneLink);
    }
  });

  modalCopy?.addEventListener('click', async () => {
    const copied = await copyToClipboard(activePhone);
    if (!copied) return;

    closePhoneModal();
    showToast('Номер скопирован в буфер обмена');
  });

  modalCloseControls.forEach((control) => {
    control.addEventListener('click', closePhoneModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePhoneModal();
  });
}

initMobileNavigation();
initScrollSpy();
initContactLinks();
