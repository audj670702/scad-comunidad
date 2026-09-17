// SCaD Comunidad · acceso Panel ADM · v0.3.9
import('./com-mns.js').catch(error => console.error('[SCaD COM MNS LOAD]', error));

(() => {
  const ADM_SYS_MEMBER_ID = '41c765a8-b156-4954-ba1f-a98e7a188a8e';
  const PANEL_URL = 'https://www.scad.mx/com-panel';
  const button = document.getElementById('adminPanelButton');

  if (!button) return;

  function currentMemberId() {
    return String(localStorage.getItem('scad_com_member_id') || '').trim();
  }

  function hasAdminAccess() {
    const memberId = currentMemberId();
    if (memberId === ADM_SYS_MEMBER_ID) return true;

    const roles = Array.isArray(context?.usuario?.roles)
      ? context.usuario.roles
      : [];

    return roles.some(role =>
      String(role || '').trim().toUpperCase() === 'ADM'
    );
  }

  function render() {
    if (!context) return false;
    button.hidden = !hasAdminAccess();
    return true;
  }

  button.addEventListener('click', () => {
    if (!hasAdminAccess()) return;
    const url = new URL(PANEL_URL);
    url.searchParams.set('mensaje', location.href);
    location.assign(url.toString());
  });

  if (!render()) {
    const timer = setInterval(() => {
      if (render()) clearInterval(timer);
    }, 150);

    setTimeout(() => clearInterval(timer), 15000);
  }
})();