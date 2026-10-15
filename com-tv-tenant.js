// Only authenticated SYS contexts with a member and EO may supply CH 00.
export function tenantKey(context){
  const member=String(context?.memberId||'').trim();
  const eo=String(context?.eo?.codigoEO||context?.eo?._id||context?.eo?.id||'').trim();
  return context?.authenticated===true&&member&&eo?JSON.stringify([member,eo]):'';
}
export function acceptTenantContext(context){
  return tenantKey(context)?context:null;
}

export function communityTvContext(data,requestedMember){
  const requested=String(requestedMember||'').trim();
  const returned=String(data?.usuario?.memberId||'').trim();
  if(data?.ok!==true||!requested||!data?.usuario||!data?.eo||(returned&&returned!==requested))return null;
  for(const flag of ['Se','Eo','Us'])if([false,0,'0'].includes(data.auth?.[flag]))return null;
  const normalized={authenticated:true,memberId:returned||requested,eo:{...data.eo,nombreMostrar:data.eo.nombreVisible||data.eo.nombreMostrar||data.eo.nombre},tv:data.tv||null};
  return acceptTenantContext(normalized);
}
