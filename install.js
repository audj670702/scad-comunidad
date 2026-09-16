// SCaD Comunidad · instalación PWA · v0.3.7
(() => {
  let deferredInstallPrompt = null;
  const button = document.getElementById('installAppButton');
  const modal = document.getElementById('iosTutorialModal');
  const video = document.getElementById('iosTutorialVideo');
  const closeButton = document.getElementById('iosTutorialClose');

  if (!button) return;

  function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
  }

  function isIosDevice() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  }

  function renderInstallOption() {
    const installed = isAppInstalled();
    button.textContent = installed ? 'App instalada' : 'Instalar app';
    button.dataset.installed = installed ? 'true' : 'false';
    button.disabled = installed;
    button.classList.toggle('installed', installed);
    button.setAttribute('aria-label', installed ? 'App instalada' : 'Instalar app');
  }

  function openIosTutorial() {
    if (!modal || !video) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
    video.load();
  }

  function closeIosTutorial() {
    if (!modal || !video) return;
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (video.webkitDisplayingFullscreen && video.webkitExitFullscreen) {
      video.webkitExitFullscreen();
    }
    video.pause();
    video.currentTime = 0;
    modal.hidden = true;
    document.body.style.overflow = '';
    button.focus();
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    renderInstallOption();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    renderInstallOption();
  });

  button.onclick = async () => {
    if (isAppInstalled()) return;

    if (isIosDevice()) {
      openIosTutorial();
      return;
    }

    if (!deferredInstallPrompt) return;

    button.disabled = true;
    button.textContent = 'Instalando...';
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    button.disabled = false;
    renderInstallOption();
  };

  closeButton?.addEventListener('click', closeIosTutorial);
  modal?.addEventListener('click', event => {
    if (event.target === event.currentTarget) closeIosTutorial();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal && !modal.hidden) closeIosTutorial();
  });

  renderInstallOption();
})();