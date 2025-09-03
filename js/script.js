  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', ()=> mobileMenu.classList.toggle('hidden'));

  // Contact slide-over
  const contactPanel = document.getElementById('contactPanel');
  const openBtns = [document.getElementById('openContact'), document.getElementById('openContactHero'), document.getElementById('openContactMobile'), document.getElementById('needDocs')];
  openBtns.forEach(b=>{ if(b) b.addEventListener('click', ()=> contactPanel.classList.remove('hidden')) });
  document.getElementById('closeContact').addEventListener('click', ()=> contactPanel.classList.add('hidden'));
  document.getElementById('backdrop').addEventListener('click', ()=> contactPanel.classList.add('hidden'));

  // Quick form submit
  document.getElementById('quickForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const name = document.getElementById('qname').value.trim();
    const phone = document.getElementById('qphone').value.trim();
    if(!name || !phone){ alert('Completa los campos obligatorios.'); return; }
    try{
      await fetch('/api/solicitudes', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name,phone,pension:document.getElementById('qpension').value})});
      document.getElementById('quickFeedback').classList.remove('hidden');
      this.reset();
    }catch(err){
      const subject = encodeURIComponent('Solicitud de crédito - FinanWorld');
      const body = encodeURIComponent(`Nombre: ${name}\nTeléfono: ${phone}`);
      window.location.href = `mailto:contacto@finanworld.com?subject=${subject}&body=${body}`;
    }
  });

  // Contact form
  document.getElementById('contactForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const n = document.getElementById('name').value.trim();
    const p = document.getElementById('phone').value.trim();
    const em = document.getElementById('email').value.trim();
    const m = document.getElementById('message').value.trim();
    
    if(!n || !p){ 
      alert('Nombre y teléfono son obligatorios.'); 
      return; 
    }
    try{
      await fetch('/api/contact', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({name: n, phone: p, email: em, message: m})
      });
      document.getElementById('contactFeedback').classList.remove('hidden');
      this.reset();
    }catch(err){
      // fallback: abrir correo
      const subject = encodeURIComponent('Contacto - FinanWorld');
      const body = encodeURIComponent(`Nombre: ${n}\nTeléfono: ${p}\nCorreo: ${em}\nMensaje: ${m}`);
      window.location.href = `mailto:contacto@finanworld.com?subject=${subject}&body=${body}`;
    }
  });

  // Update WhatsApp quick links
  function updateWhatsAppLinks(){
    const waBase = 'https://api.whatsapp.com/send?phone=+573000000000&text=';
    const quickText = encodeURIComponent('Hola FinanWorld, quisiera información sobre crédito de libranza. Mi nombre es:');
    document.getElementById('waQuick').href = waBase + quickText;
    document.getElementById('waButton').href = waBase + encodeURIComponent('Hola FinanWorld, quiero información sobre crédito de libranza. Mi nombre es:');
  }
  updateWhatsAppLinks();

  // Simulador
  function currencyCOP(n){ return new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP'}).format(n); }
  document.getElementById('calc').addEventListener('click', function(){
    const amount = Number(document.getElementById('amount').value) || 0;
    const months = Number(document.getElementById('months').value);
    const annualRate = Number(document.getElementById('rate').value)/100;
    if(amount <= 0){ alert('Ingresa un monto válido'); return; }
    const monthlyRate = annualRate / 12;
    const monthly = (amount * monthlyRate) / (1 - Math.pow(1+monthlyRate, -months));
    const total = monthly * months;
    document.getElementById('monthly').textContent = currencyCOP(monthly.toFixed(2));
    document.getElementById('total').textContent = currencyCOP(total.toFixed(2));
    document.getElementById('simResult').classList.remove('hidden');
  });

const carousel = document.getElementById('carousel');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
let scrollAmount = 0;
const scrollStep = 180; // ancho de cada aliado + margen

prev.addEventListener('click', ()=> {
  scrollAmount -= scrollStep;
  if(scrollAmount < 0) scrollAmount = 0;
  carousel.style.transform = `translateX(-${scrollAmount}px)`;
});
next.addEventListener('click', ()=> {
  scrollAmount += scrollStep;
  const maxScroll = carousel.scrollWidth - carousel.parentElement.offsetWidth;
  if(scrollAmount > maxScroll) scrollAmount = maxScroll;
  carousel.style.transform = `translateX(-${scrollAmount}px)`;
});

