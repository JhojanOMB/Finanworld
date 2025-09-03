document.addEventListener('DOMContentLoaded', () => {

  // helper
  const $ = id => document.getElementById(id);

  // --- Footer year ---
  if ($('year')) {
    $('year').textContent = new Date().getFullYear();
  }

  // --- Contact slide-over (panel) ---
  const contactPanel = $('contactPanel');
  const openContactIds = ['openContact', 'openContactHero', 'openContactMobile', 'needDocs', 'openContactLateral'];
  openContactIds.forEach(id => {
    const btn = $(id);
    if (btn && contactPanel) {
      btn.addEventListener('click', () => {
        contactPanel.classList.remove('hidden');
        // if there's a backdrop element, show it
        const backdrop = $('backdrop');
        if (backdrop) backdrop.classList.remove('hidden');
        // lock scroll
        document.body.classList.add('overflow-hidden');
      });
    }
  });
  if ($('closeContact') && contactPanel) {
    $('closeContact').addEventListener('click', () => {
      contactPanel.classList.add('hidden');
      const backdrop = $('backdrop');
      if (backdrop) backdrop.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  }
  if ($('backdrop') && contactPanel) {
    $('backdrop').addEventListener('click', () => {
      contactPanel.classList.add('hidden');
      $('backdrop').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  }
// --- Quick form submit ---
if ($('quickForm')) {
  $('quickForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = $('qname')?.value.trim() || '';
    const phone = $('qphone')?.value.trim() || '';
    const pension = $('qpension')?.value || '';
    if (!name || !phone) {
      alert('Completa los campos obligatorios.');
      return;
    }

    try {
      await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, pension })
      });

      // ✅ Generar mensaje con datos a WhatsApp
      const waBase = 'https://api.whatsapp.com/send?phone=+573025934518&text=';
      const waMessage = encodeURIComponent(
        `Hola FinanWorld, quisiera información sobre crédito de libranza.\n\n` +
        `Nombre: ${name}\nTeléfono: ${phone}\nPensión: ${pension}`
      );
      window.open(waBase + waMessage, '_blank');

      if ($('quickFeedback')) $('quickFeedback').classList.remove('hidden');
      this.reset();
    } catch (err) {
      const subject = encodeURIComponent('Solicitud de crédito - FinanWorld');
      const body = encodeURIComponent(`Nombre: ${name}\nTeléfono: ${phone}\nPensión: ${pension}`);
      window.location.href = `mailto:contacto@finanworld.com?subject=${subject}&body=${body}`;
    }
  });
}

// --- Contact form submit ---
if ($('contactForm')) {
  $('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const n = $('name')?.value.trim() || '';
    const p = $('phone')?.value.trim() || '';
    const em = $('email')?.value.trim() || '';
    const m = $('message')?.value.trim() || '';
    if (!n || !p) {
      alert('Nombre y teléfono son obligatorios.');
      return;
    }

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: n, phone: p, email: em, message: m })
      });

      // ✅ Generar mensaje con datos a WhatsApp
      const waBase = 'https://api.whatsapp.com/send?phone=+573025934518&text=';
      const waMessage = encodeURIComponent(
        `Hola FinanWorld, me gustaría ponerme en contacto.\n\n` +
        `Nombre: ${n}\nTeléfono: ${p}\nCorreo: ${em}\nMensaje: ${m}`
      );
      window.open(waBase + waMessage, '_blank');

      if ($('contactFeedback')) $('contactFeedback').classList.remove('hidden');
      this.reset();
    } catch (err) {
      const subject = encodeURIComponent('Contacto - FinanWorld');
      const body = encodeURIComponent(`Nombre: ${n}\nTeléfono: ${p}\nCorreo: ${em}\nMensaje: ${m}`);
      window.location.href = `mailto:contacto@finanworld.com?subject=${subject}&body=${body}`;
    }
  });
}

// --- WhatsApp quick links ---
function updateWhatsAppLinks() {
  const waBase = 'https://api.whatsapp.com/send?phone=+573025934518&text=';
  const quickText = encodeURIComponent('Hola FinanWorld, quisiera información sobre crédito de libranza. Mi nombre es:');
  if ($('waQuick')) $('waQuick').href = waBase + quickText;
  if ($('waButton')) $('waButton').href = waBase + encodeURIComponent('Hola FinanWorld, quiero información sobre crédito de libranza. Mi nombre es:');
}
updateWhatsAppLinks();

  // --- Carousel aliados (seguro) ---
  const carousel = $('carousel');
  const prev = $('prev');
  const next = $('next');
  let scrollAmount = 0;
  let scrollStep = 180; // fallback

  if (carousel) {
    const firstChild = carousel.firstElementChild;
    if (firstChild) {
      const w = firstChild.offsetWidth || 160;
      const style = getComputedStyle(firstChild);
      const mr = parseInt(style.marginRight || 0, 10);
      scrollStep = w + (isNaN(mr) ? 0 : mr);
    }
  }

  if (carousel && prev && next) {
    prev.addEventListener('click', () => {
      scrollAmount -= scrollStep;
      if (scrollAmount < 0) scrollAmount = 0;
      carousel.style.transform = `translateX(-${scrollAmount}px)`;
    });
    next.addEventListener('click', () => {
      scrollAmount += scrollStep;
      const maxScroll = Math.max(0, carousel.scrollWidth - carousel.parentElement.offsetWidth);
      if (scrollAmount > maxScroll) scrollAmount = maxScroll;
      carousel.style.transform = `translateX(-${scrollAmount}px)`;
    });
  }

  // --- Mobile sidebar + overlay + bloqueo de scroll ---
  const menuBtn = $('menuBtn');
  const mobileMenu = $('mobileMenu');
  const closeMenu = $('closeMenu');

  // Crea overlay para el menú móvil si no existe
  function ensureMobileOverlay() {
    let ov = $('mobileOverlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'mobileOverlay';
      // estilos inline por si no tienes CSS; tú puedes mover esto a tu CSS:
      ov.style.position = 'fixed';
      ov.style.top = '0';
      ov.style.left = '0';
      ov.style.width = '100%';
      ov.style.height = '100%';
      ov.style.background = 'rgba(0,0,0,0.4)';
      ov.style.zIndex = '40';
      ov.style.opacity = '0';
      ov.style.transition = 'opacity 200ms ease';
      ov.classList.add('hidden');
      document.body.appendChild(ov);
    }
    return ov;
  }

  const mobileOverlay = ensureMobileOverlay();

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.add('translate-x-0');
    if (mobileOverlay) {
      mobileOverlay.classList.remove('hidden');
      // trigger reflow for transition
      void mobileOverlay.offsetWidth;
      mobileOverlay.style.opacity = '1';
    }
    document.body.classList.add('overflow-hidden');
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('translate-x-0');
    mobileMenu.classList.add('translate-x-full');
    if (mobileOverlay) {
      mobileOverlay.style.opacity = '0';
      setTimeout(() => {
        if (mobileOverlay) mobileOverlay.classList.add('hidden');
      }, 200);
    }
    document.body.classList.remove('overflow-hidden');
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', openMobileMenu);
  }
  if (closeMenu && mobileMenu) {
    closeMenu.addEventListener('click', closeMobileMenu);
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // --- Seguridad extra: evitar errores no atrapados ---
  window.addEventListener('unhandledrejection', (ev) => {
    // opcional: log en consola para debugging
    console.warn('Unhandled rejection:', ev.reason);
  });
  window.addEventListener('error', (e) => {
    // opcional: log en consola para debugging
    // console.error('Error capturado:', e.message);
  });

}); // DOMContentLoaded end
