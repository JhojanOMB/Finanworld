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
  new WOW({
    boxClass: 'wow',
    animateClass: 'animate__animated', // necesario con animate.css v4
    offset: 100,
    mobile: true,
    live: true
  }).init();


// Carrusel script
// js/script.js  -> pega esto (IIFE dentro de DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  const container = document.getElementById('carousel');

  if (!track) {
    console.warn('[carousel] No se encontró #carouselTrack. Verifica el id en HTML.');
    return;
  }
  if (!container) {
    console.warn('[carousel] No se encontró #carousel. El script intentará usar el padre de track.');
  }

  const cont = container || track.parentElement;

  // Config (puedes ajustar desde HTML: data-speed en #carousel)
  const SPEED_PX_PER_SEC = Number(cont.dataset.speed) || 60;
  const PAUSE_ON_HOVER = true;
  const RESUME_AFTER_BTN_MS = 700; // reanuda animación después de usar prev/next

  // seguridad: no inicializar dos veces
  if (!track.dataset.loopInitialized) {
    // si track está vacío, no hacemos nada
    if (!track.children.length) {
      console.warn('[carousel] #carouselTrack no tiene items hijos.');
      return;
    }
    // duplicar contenido para crear loop continuo
    track.innerHTML = track.innerHTML + track.innerHTML;
    track.dataset.loopInitialized = "1";
    console.log('[carousel] Contenido duplicado para loop infinito.');
  } else {
    console.log('[carousel] Ya inicializado (dataset.loopInitialized).');
  }

  // Preparar estilos / comportamiento
  try {
    track.style.scrollBehavior = 'auto';
    cont.style.overflow = 'hidden';
    track.style.overflowX = 'hidden';
    // si tenías clases de snap, quitarlas para animación continua
    track.classList.remove('snap-x', 'snap-mandatory');
  } catch (e) {
    console.warn('[carousel] Error aplicando estilos: ', e);
  }

  let raf = null;
  let lastTs = null;
  let running = true;

  function step(ts) {
    if (!lastTs) lastTs = ts;
    const dt = ts - lastTs;
    lastTs = ts;

    // avanzar scroll
    track.scrollLeft += (SPEED_PX_PER_SEC * dt) / 1000;

    // si pasamos la mitad (duplicación), regresamos a la mitad anterior
    const half = track.scrollWidth / 2;
    if (track.scrollLeft >= half) {
      track.scrollLeft -= half;
    }

    if (running) raf = requestAnimationFrame(step);
  }

  function start() {
    if (!running) running = true;
    if (!raf) {
      lastTs = null;
      raf = requestAnimationFrame(step);
    }
  }
  function stop() {
    running = false;
    lastTs = null;
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }

  // pause on hover / touch
  if (PAUSE_ON_HOVER) {
    cont.addEventListener('mouseenter', stop, { passive: true });
    cont.addEventListener('mouseleave', start, { passive: true });
    cont.addEventListener('touchstart', stop, { passive: true });
    cont.addEventListener('touchend', start, { passive: true });
  }

  // Prev / Next buttons (si existen)
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  function scrollByPage(dir = 1) {
    // dir = -1 prev, 1 next
    // scrolla una "página" = ancho del contenedor visible
    const page = cont.clientWidth || window.innerWidth;
    // hacemos smooth y luego reanudamos animación
    stop();
    track.scrollBy({ left: dir * page, behavior: 'smooth' });
    // si la duplicación hace que lleguemos al final, corregimos luego
    setTimeout(() => {
      const half = track.scrollWidth / 2;
      if (track.scrollLeft >= half) track.scrollLeft = track.scrollLeft % half;
    }, 400);
    // reanuda después de un tiempo
    setTimeout(start, RESUME_AFTER_BTN_MS);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollByPage(-1);
    });
    console.log('[carousel] Prev button conectado.');
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollByPage(1);
    });
    console.log('[carousel] Next button conectado.');
  }

  // Ajustes en resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // asegurar que scrollLeft está en rango válido tras resize
      const half = track.scrollWidth / 2;
      if (track.scrollLeft >= half) track.scrollLeft = track.scrollLeft % half;
    }, 120);
  });

  // start
  track.scrollLeft = 0;
  start();
  console.log('[carousel] iniciado con speed:', SPEED_PX_PER_SEC);
});
