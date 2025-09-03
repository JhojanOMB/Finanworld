/**
 * main.js - Script completo para FinanWorld
 * - Seguro contra elementos faltantes
 * - Simulador robusto (maneja tasa 0 y validaciones)
 * - Formularios con fallback mailto
 * - Slide-over de contacto y sidebar móvil con overlay + bloqueo de scroll
 * - Carousel con clamping
 */

document.addEventListener('DOMContentLoaded', () => {

  // helper
  const $ = id => document.getElementById(id);

  // --- Footer year ---
  if ($('year')) {
    $('year').textContent = new Date().getFullYear();
  }

  // --- Contact slide-over (panel) ---
  const contactPanel = $('contactPanel');
  const openContactIds = ['openContact', 'openContactHero', 'openContactMobile', 'needDocs'];
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
        if ($('quickFeedback')) $('quickFeedback').classList.remove('hidden');
        this.reset();
      } catch (err) {
        // fallback: abrir mailto
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
    const waBase = 'https://api.whatsapp.com/send?phone=+573000000000&text=';
    const quickText = encodeURIComponent('Hola FinanWorld, quisiera información sobre crédito de libranza. Mi nombre es:');
    if ($('waQuick')) $('waQuick').href = waBase + quickText;
    if ($('waButton')) $('waButton').href = waBase + encodeURIComponent('Hola FinanWorld, quiero información sobre crédito de libranza. Mi nombre es:');
  }
  updateWhatsAppLinks();

  // --- Simulador de crédito ---
  function currencyCOP(n) {
    const num = typeof n === 'string' ? Number(n) : n;
    if (Number.isNaN(num)) return 'COP 0';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(num);
  }

  if ($('calc')) {
    $('calc').addEventListener('click', function () {
      const amount = Number($('amount')?.value) || 0;
      const months = Math.trunc(Number($('months')?.value) || 0);
      const annualRate = Number($('rate')?.value) / 100 || 0;

      if (amount <= 0) { alert('Ingresa un monto válido'); return; }
      if (months <= 0) { alert('Ingresa un número de meses válido'); return; }

      const monthlyRate = annualRate / 12;
      let monthly = 0;

      // Si la tasa es 0, cuota = monto / meses
      if (monthlyRate === 0) {
        monthly = amount / months;
      } else {
        const denom = 1 - Math.pow(1 + monthlyRate, -months);
        if (denom === 0 || !isFinite(denom)) {
          alert('Parámetros inválidos para cálculo. Revisa la tasa y los meses.');
          return;
        }
        monthly = (amount * monthlyRate) / denom;
      }

      const total = monthly * months;
      if ($('monthly')) $('monthly').textContent = currencyCOP(Number(monthly.toFixed(2)));
      if ($('total')) $('total').textContent = currencyCOP(Number(total.toFixed(2)));
      if ($('simResult')) $('simResult').classList.remove('hidden');
    });
  }

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
