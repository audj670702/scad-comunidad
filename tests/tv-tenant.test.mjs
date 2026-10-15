import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {tenantKey,acceptTenantContext,communityTvContext} from '../com-tv-tenant.js';
const source=fs.readFileSync(new URL('../com-tv.js',import.meta.url),'utf8');
const company=(code,member='member-1')=>({authenticated:true,memberId:member,eo:{codigoEO:code,nombre:'Empresa '+code},tv:{youtubeId:'J8iuaBiKIsk'}});
function harness(){
 const calls=[];
 const ctx={COMUNIDAD_CHANNEL_NAME:'Canal de la empresa',context:null,selected:'eo',channels:[{}],contextGeneration:0,eoLoading:false,tenantKey,acceptTenantContext,setChannel:c=>calls.push(c),renderEoTransmission:()=>{},setTitle:()=>{},renderChannels:()=>{}};
 vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('export function setTvContext'),source.indexOf('function stepChannel')).replace('export ',''),ctx);
 return {ctx,calls};
}
test('CH00 rejects unauthenticated or incomplete contexts, even with a video',()=>{
 assert.equal(acceptTenantContext({...company('A'),authenticated:false}),null);
 assert.equal(tenantKey({...company('A'),eo:null}),'');
 assert.equal(tenantKey({...company('A'),memberId:''}),'');
});
test('switching companies resets CH00 even when the video URL is identical',()=>{
 const {ctx,calls}=harness();ctx.setTvContext(company('A'));ctx.setTvContext(company('B'));
 assert.equal(ctx.context.eo.codigoEO,'B');assert.deepEqual(calls,['eo','eo']);assert.equal(ctx.contextGeneration,2);
 assert.equal(ctx.channels[0].nombre,'Empresa B');
});
test('logging out clears private context and resets the monitor',()=>{
 const {ctx,calls}=harness();ctx.setTvContext(company('A'));ctx.selected='CH01';ctx.setTvContext(null);
 assert.equal(ctx.context,null);assert.equal(calls.at(-1),'eo');
});
test('changing members in the same company also invalidates prior responses',()=>{
 const {ctx}=harness();ctx.setTvContext(company('A','one'));ctx.setTvContext(company('A','two'));assert.equal(ctx.contextGeneration,2);
});
test('an old pending response or a response from another EO is never applied',async()=>{
 for(const stale of [true,false]){
 let finish;const applied=[];const ctx={loadContext:()=>new Promise(r=>finish=r),eoLoading:false,context:company('A'),selected:'eo',contextGeneration:1,communityVideoKey:'',tenantKey,setTvContext:x=>applied.push(x),setStreamState:()=>{},console:{warn(){}}};
 vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('async function refreshEo'),source.indexOf('function startEoPolling')),ctx);
 const pending=ctx.refreshEo();if(stale)ctx.contextGeneration++;
 finish(stale?company('A'):company('B'));await pending;if(stale)assert.equal(applied.length,0);else assert.deepEqual(applied,[null]);
 }
});

test('COM response keeps the requested member and community name',()=>{
 const c=communityTvContext({ok:true,usuario:{memberId:'one'},eo:{codigoEO:'COM-A',nombreVisible:'Comunidad A'},auth:{Se:true,Eo:true,Us:true},tv:{youtubeId:'J8iuaBiKIsk'}},'one');
 assert.equal(c.memberId,'one');assert.equal(c.eo.nombreMostrar,'Comunidad A');
});
test('COM response cannot substitute another member',()=>{
 assert.equal(communityTvContext({ok:true,usuario:{memberId:'two'},eo:{codigoEO:'COM-A'}},'one'),null);
});
test('a rejected or unassigned COM response never enables CH00',()=>{
 for(const input of [{ok:false,usuario:{},eo:{codigoEO:'A'}},{ok:true,usuario:{},eo:null},{ok:true,usuario:{},eo:{codigoEO:'A'},auth:{Us:false}}])assert.equal(communityTvContext(input,'one'),null);
});
test('legacy COM response binds to the requested member when memberId is omitted',()=>{
 const c=communityTvContext({ok:true,usuario:{nombre:'Usuario'},eo:{_id:'EO-A'}},'one');assert.equal(c.memberId,'one');assert.notEqual(tenantKey(c),'');
});

test('a denied active-community refresh clears the private channel',async()=>{
 const cleared=[];const ctx={loadContext:async()=>{throw Object.assign(new Error('Sin acceso'),{status:403})},eoLoading:false,context:company('A'),selected:'eo',contextGeneration:1,communityVideoKey:'old-video',tenantKey,setTvContext:x=>cleared.push(x),setStreamState:()=>{},console:{warn(){}}};
 vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('async function refreshEo'),source.indexOf('function startEoPolling')),ctx);
 await ctx.refreshEo();assert.deepEqual(cleared,[null]);
});
