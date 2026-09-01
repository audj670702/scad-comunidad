const modules = {
  programacion: {
    title: 'Programación',
    description: 'Agenda personal de actividades vinculadas con el usuario. La versión productiva cargará únicamente eventos autorizados desde Wix/CMS.',
    rows: [
      ['Próximos eventos', 'Tarjetas por fecha y tipo'],
      ['Filtros', 'Actividad · Grupo · Categoría'],
      ['Detalle', 'Modal con información y acciones'],
      ['Origen de datos', 'Wix/Velo + CMS']
    ]
  },
  mensajeria: {
    title: 'Mensajería',
    description: 'Base para conversaciones entre usuarios, comunicación con administración, avisos del sistema y mensajes dirigidos a grupos.',
    rows: [
      ['Usuario ↔ usuario', 'Conversaciones directas'],
      ['Usuario ↔ administración', 'Bandeja vinculada al panel'],
      ['Sistema → usuario', 'Avisos y notificaciones'],
      ['Administración → grupos', 'Difusión segmentada']
    ]
  },
  capacitacion: {
    title: 'Capacitación',
    description: 'Acceso a contenidos formativos disponibles para la comunidad. La autorización y productos podrán vincularse con Wix Members y Wix Pricing.',
    rows: [
      ['Mis contenidos', 'Accesos vigentes'],
      ['Progreso', 'Estado de contenidos'],
      ['Autorización', 'Wix Members'],
      ['Suscripción', 'Integración Wix Pricing']
    ]
  },
  tv: {
    title: 'TV Comunidad',
    description: 'Selector audiovisual para integrar el canal SCaD TV Digital Internet y un canal propio de la comunidad cuando la implementación lo requiera.',
    rows: [
      ['TVDI 24/7', 'Canal general'],
      ['Canal Comunidad', 'Playlist configurada por cliente'],
      ['Reproducción', 'Vista integrada y expandible'],
      ['Configuración', 'Canales habilitados por comunidad']
    ]
  }
};

const modal = document.getElementById('moduleModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const identityButton = document.getElementById('identityButton');
const identityMenu = document.getElementById('identityMenu');

function openModule(key) {
  const module = modules[key];
  if (!module) return;
  modalTitle.textContent = module.title;
  modalDescription.textContent = module.description;
  modalContent.innerHTML = `
    <span class="prototype-chip">Vista funcional de prototipo</span>
    ${module.rows.map(([label, value]) => `
      <div class="prototype-row">
        <strong>${label}</strong>
        <span>${value}</span>
      </div>
    `).join('')}
  `;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-module]').forEach((button) => {
  button.addEventListener('click', () => openModule(button.dataset.module));
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

identityButton.addEventListener('click', () => {
  const next = identityMenu.hidden;
  identityMenu.hidden = !next;
  identityButton.setAttribute('aria-expanded', String(next));
});

document.addEventListener('click', (event) => {
  if (!identityButton.contains(event.target) && !identityMenu.contains(event.target)) {
    identityMenu.hidden = true;
    identityButton.setAttribute('aria-expanded', 'false');
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
