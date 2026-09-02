const modules={
  programacion:{title:'Programación',description:'Agenda personal de actividades y eventos de la comunidad.',rows:[['Próximas actividades','Agenda cronológica'],['Filtros','Tipo · grupo · categoría'],['Detalle','Información del evento'],['Participación','Confirmaciones y avisos']]},
  mensajeria:{title:'Mensajería',description:'Centro de comunicación para conversaciones, avisos y mensajes de la comunidad.',rows:[['Usuario ↔ usuario','Conversaciones directas'],['Usuario ↔ administración','Bandeja COM_Panel'],['Sistema → usuario','Avisos automáticos'],['Administración → grupos','Difusión segmentada']]},
  capacitacion:{title:'Capacitación',description:'Acceso a contenidos formativos habilitados para cada usuario.',rows:[['Mis contenidos','Accesos disponibles'],['Avance','Seguimiento personal'],['Disponibilidad','Según perfil'],['Acceso','Experiencia integrada']]},
  info:{title:'+ Info',description:'Información relevante y útil publicada para los integrantes de la comunidad.',rows:[['Información general','Datos y referencias de la comunidad'],['Documentos','Reglamentos, guías y archivos'],['Directorio','Contactos y responsables'],['Recursos','Enlaces e información de interés']]}
};

const modal=document.getElementById('moduleModal');
const modalTitle=document.getElementById('modalTitle');
const modalDescription=document.getElementById('modalDescription');
const modalContent=document.getElementById('modalContent');
const modalClose=document.getElementById('modalClose');
const identityButton=document.getElementById('identityButton');
const identityMenu=document.getElementById('identityMenu');
const tvChannelSelect=document.getElementById('tvChannelSelect');
const tvMuteButton=document.getElementById('tvMuteButton');
const tvMuteIcon=document.getElementById('tvMuteIcon');
const tvScreenTitle=document.getElementById('tvScreenTitle');
const tvScreenSubtitle=document.getElementById('tvScreenSubtitle');
const tvScreen=document.getElementById('tvScreen');

let tvMuted=true;

function openModule(key){
  const item=modules[key];
  if(!item)return;
  modalTitle.textContent=item.title;
  modalDescription.textContent=item.description;
  modalContent.innerHTML=`<span class="prototype-chip">Vista demostrativa</span>${item.rows.map(([label,value])=>`<div class="prototype-row"><strong>${label}</strong><span>${value}</span></div>`).join('')}`;
  modal.hidden=false;
  document.body.style.overflow='hidden';
}

function openProfile(){
  modalTitle.textContent='Mi perfil';
  modalDescription.textContent='Identidad del usuario dentro de SCaD Comunidad.';
  modalContent.innerHTML=`<div class="profile-card"><span class="avatar">JD</span><div><strong>Usuario Demo</strong><span>Miembro activo · Comunidad Central</span></div></div><div class="prototype-row"><strong>Rol</strong><span>Miembro</span></div><div class="prototype-row"><strong>Comunidad</strong><span>Comunidad Central</span></div><div class="prototype-row"><strong>Estado</strong><span>Activo</span></div>`;
  modal.hidden=false;
  document.body.style.overflow='hidden';
}

function closeModal(){modal.hidden=true;document.body.style.overflow=''}

function setTvChannel(channel){
  const isCommunity=channel==='comunidad';
  tvScreenTitle.textContent=isCommunity?'Canal Comunidad':'TV Digital Internet';
  tvScreenSubtitle.textContent=isCommunity?'Canal propio de la comunidad':'Canal general · 24/7';
  tvScreen.dataset.channel=channel;
}

function toggleTvMute(){
  tvMuted=!tvMuted;
  tvMuteIcon.textContent=tvMuted?'🔇':'🔊';
  tvMuteButton.setAttribute('aria-label',tvMuted?'Activar sonido':'Silenciar');
  tvMuteButton.setAttribute('title',tvMuted?'Activar sonido':'Silenciar');
}

document.querySelectorAll('[data-module]').forEach(button=>button.addEventListener('click',()=>openModule(button.dataset.module)));
document.querySelectorAll('[data-route="perfil"]').forEach(button=>button.addEventListener('click',()=>{identityMenu.hidden=true;identityButton.setAttribute('aria-expanded','false');openProfile()}));
document.querySelectorAll('[data-route="inicio"]').forEach(button=>button.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'})));

modalClose.addEventListener('click',closeModal);
modal.addEventListener('click',event=>{if(event.target===modal)closeModal()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!modal.hidden)closeModal()});

identityButton.addEventListener('click',event=>{event.stopPropagation();const shouldOpen=identityMenu.hidden;identityMenu.hidden=!shouldOpen;identityButton.setAttribute('aria-expanded',String(shouldOpen))});
identityMenu.addEventListener('click',event=>event.stopPropagation());
document.addEventListener('click',()=>{identityMenu.hidden=true;identityButton.setAttribute('aria-expanded','false')});

tvChannelSelect.addEventListener('change',event=>setTvChannel(event.target.value));
tvMuteButton.addEventListener('click',toggleTvMute);
setTvChannel(tvChannelSelect.value);

if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
