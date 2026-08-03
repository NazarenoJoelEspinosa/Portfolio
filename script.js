document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- SCROLL REVEAL ---------- */
  const revealTargets = document.querySelectorAll('.card, .metric, .process-step, .stack-group');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  } else {
    revealTargets.forEach(el => el.classList.add('reveal'));
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.num[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (prefersReducedMotion) { el.textContent = target; return; }
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => counterObserver.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- PROJECT DATA (para el modal) ---------- */
  const projects = {
    oxigas: {
      img: 'assets/oxigas.jpg',
      sysid: 'SYS-01',
      tag: 'SPA dinámica',
      tagClass: 'tag-site',
      title: 'OxigasWeb',
      desc: 'Ferretería industrial con más de 60 años en el rubro, dedicada a la venta de gases comprimidos (oxígeno, acetileno, argón, CO₂) y herramientas profesionales. El sitio conecta con Supabase para mostrar catálogo y ofertas actualizados en tiempo real, cubre 6 zonas de entrega en el oeste del GBA y permite cotizar directo por WhatsApp.',
      stack: ['React 18', 'Vite', 'Supabase', 'Tailwind CSS'],
      live: 'https://nazarenojoelespinosa.github.io/OxigasWeb/'
    },
    hojaderuta: {
      img: 'assets/hojaderuta.jpg',
      sysid: 'SYS-02',
      tag: 'Mini sistema · Dashboard',
      tagClass: 'tag-system',
      title: 'Hoja de Ruta Oxigas',
      desc: 'Herramienta interna para organizar la distribución diaria de garrafas y gases: carga de pedidos por cliente, repartidor y turno (mañana/tarde), autocompletado de direcciones, e historial de clientes para no repetir datos cada vez.',
      stack: ['React', 'Radix UI', 'Tailwind CSS'],
      live: 'https://hojaderutaoxigas.up.railway.app/'
    },
    alquileres: {
      img: 'assets/alquileres.jpg',
      sysid: 'SYS-03',
      tag: 'Mini sistema · CRUD',
      tagClass: 'tag-system',
      title: 'Control de Alquileres de Cilindros',
      desc: 'Panel para rastrear el alquiler de cilindros: gestiona 167 registros, filtra clientes por nombre y estado de deuda, marca quiénes llevan más de 3 meses debiendo y quiénes están por vencer, y permite exportar reportes a Excel.',
      stack: ['HTML', 'CSS', 'JavaScript'],
      live: 'https://nazarenojoelespinosa.github.io/Control-de-alquileres-de-cilindros/'
    },
    obssesive: {
      img: 'assets/obsessive.jpg',
      sysid: 'SYS-04',
      tag: 'Landing page',
      tagClass: 'tag-site',
      title: 'Obssesive — Estética del auto',
      desc: 'Landing page para un taller de detailing automotor, con reserva de turnos online, presentación de servicios, trabajos realizados y canales de contacto.',
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      live: 'https://nazarenojoelespinosa.github.io/Obssesive.github.io/'
    },
    ciudadela: {
      img: 'assets/ciudadela.jpg',
      sysid: 'SYS-05',
      tag: 'Sitio institucional',
      tagClass: 'tag-site',
      title: 'Ciudadela Norte',
      desc: 'Sitio institucional de un club deportivo con actividades de básquet, natación, pádel y más, con sección para socios e información del buffet, pensado para la comunidad del club.',
      stack: ['HTML', 'CSS', 'Bootstrap 5', 'JavaScript'],
      live: 'https://nazarenojoelespinosa.github.io/CiudadelaNorte/'
    }
  };

  /* ---------- MODAL ---------- */
  const overlay = document.getElementById('modalOverlay');
  const modalImg = document.getElementById('modalImg');
  const modalSysId = document.getElementById('modalSysId');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalStack = document.getElementById('modalStack');
  const modalLive = document.getElementById('modalLive');
  const closeBtn = document.getElementById('modalClose');

  let lastFocused = null;

  const openModal = (id) => {
    const p = projects[id];
    if (!p) return;

    modalImg.src = p.img;
    modalImg.alt = 'Captura de ' + p.title;
    modalSysId.textContent = p.sysid;
    modalTag.textContent = p.tag;
    modalTag.className = 'tag ' + p.tagClass;
    modalTitle.textContent = p.title;
    modalDesc.textContent = p.desc;
    modalStack.innerHTML = p.stack.map(t => `<span class="chip">${t}</span>`).join('');
    modalLive.href = p.live;

    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(btn.dataset.project);
    });
  });

  document.querySelectorAll('.card[data-project]').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.project));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.project);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });
});
