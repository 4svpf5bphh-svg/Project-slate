// Project Slate v4.6.3 — Narrative Engine reliability client
// Gameplay remains authoritative. AI prose is automatic enhancement with resilient local fallback.

const NARRATIVE_SCHEMA_VERSION=1;
const NARRATIVE_DEFAULT_ENDPOINT='https://project-slate-five.vercel.app/api/narrative';
const NARRATIVE_REQUEST_TIMEOUT_MS=70000;
const NARRATIVE_AUTO_RETRY_LIMIT=4;
const narrativeRuntime={pending:new Map(),retryTimers:new Map(),lastError:null,connection:null,lifecycleBound:false};

function narrativeNormalizeEndpoint(value){
 let url=String(value||'').trim();if(!url)return null;
 if(!/^https?:\/\//i.test(url))url='https://'+url;
 url=url.replace(/\/+$/,'');
 if(!/\/api\/narrative$/i.test(url))url+='/api/narrative';
 return url;
}
function narrativeEndpoint(){
 const runtimeOverride=typeof window!=='undefined'&&window.PROJECT_SLATE_NARRATIVE_ENDPOINT;
 if(runtimeOverride)return narrativeNormalizeEndpoint(runtimeOverride);
 if(typeof location!=='undefined'&&/\.github\.io$/i.test(location.hostname))return NARRATIVE_DEFAULT_ENDPOINT;
 if(typeof location!=='undefined'&&/^https?:$/i.test(location.protocol)&&!/^(localhost|127\.0\.0\.1)$/i.test(location.hostname))return '/api/narrative';
 let configured=null;try{configured=localStorage.getItem('projectSlateNarrativeEndpoint')}catch{}
 return narrativeNormalizeEndpoint(configured)||'/api/narrative';
}
function setNarrativeEndpointValue(value){
 const normalized=narrativeNormalizeEndpoint(value);
 try{if(normalized)localStorage.setItem('projectSlateNarrativeEndpoint',normalized);else localStorage.removeItem('projectSlateNarrativeEndpoint')}catch{}
 narrativeRuntime.connection=null;narrativeRuntime.lastError=null;return narrativeEndpoint();
}
async function testNarrativeConnection(){
 const endpoint=narrativeEndpoint();if(!endpoint){narrativeRuntime.connection={ok:false,error:'Narrative service unavailable.',checkedAt:Date.now()};return narrativeRuntime.connection}
 try{
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),12000);let res;
  try{res=await fetch(endpoint,{method:'GET',headers:{'Accept':'application/json'},signal:ctrl.signal,cache:'no-store'})}finally{clearTimeout(timer)}
  let data=null;try{data=await res.json()}catch{}
  narrativeRuntime.connection=res.ok&&data?.ok?{ok:true,provider:data.provider||'unknown',model:data.model||'unknown',configured:!!data.configured,endpoint,checkedAt:Date.now()}:{ok:false,error:data?.error||('HTTP '+res.status),endpoint,checkedAt:Date.now()};
 }catch(err){narrativeRuntime.connection={ok:false,error:String(err?.message||err),endpoint,checkedAt:Date.now()}}
 return narrativeRuntime.connection;
}
function narrativeSettingsHTML(){
 const status=narrativeRuntime.connection;
 const hasFallback=(state.films||[]).some(f=>f.owner==='player'&&f.review&&['retry_wait','degraded'].includes(f.aiNarrative?.review?.status));
 const statusHTML=status?.ok&&status.configured
  ?'<div class="narrative-connection ready"><span class="pill good">AUTOMATIC</span><div><strong>'+narrativeEscapeHTML(status.provider)+' · '+narrativeEscapeHTML(status.model)+'</strong><span>Project Slate connects automatically. Reviews and Project Intelligence are generated without player setup.</span></div></div>'
  :hasFallback||status
   ?'<div class="narrative-connection warn"><span class="pill warn">RECOVERING</span><div><strong>Local fallback is active</strong><span>Gameplay continues normally while Project Slate retries the Narrative Engine automatically.</span></div></div>'
   :'<div class="narrative-connection"><span class="pill blue">AUTOMATIC</span><div><strong>Narrative Engine is managed by Project Slate</strong><span>Connection health is checked silently and temporary failures fall back to local writing.</span></div></div>';
 const diagnostics=(typeof simulationAuditAccess==='function'&&simulationAuditAccess())
  ?'<div class="small" style="margin-top:10px"><strong>Diagnostics:</strong> '+narrativeEscapeHTML(narrativeEndpoint())+' · '+narrativeEscapeHTML(narrativeRuntime.lastError||'no current error')+'</div><button class="btn ghost" id="testNarrativeEndpoint" style="margin-top:8px">Run health check</button>'
  :'';
 return '<div class="section-title"><h2>Narrative Engine</h2><span class="small">Automatic AI enhancement · simulation-safe fallback</span></div><div class="card narrative-settings">'+statusHTML+'<div class="small" style="margin-top:10px">The simulation never waits for AI. Review reveals always fire from the game result; AI prose replaces local copy automatically when available.</div>'+diagnostics+'</div>';
}
function narrativeSleep(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
function narrativeRetryDelayMs(count){return [20000,90000,300000,1200000][Math.max(0,Math.min(3,(count||1)-1))]}
function narrativeRetryKey(kind,id){return kind+':'+id}
function clearNarrativeRetry(kind,id){
 const key=narrativeRetryKey(kind,id),timer=narrativeRuntime.retryTimers.get(key);if(timer)clearTimeout(timer);narrativeRuntime.retryTimers.delete(key);
}
function scheduleNarrativeRetry(kind,id,count){
 clearNarrativeRetry(kind,id);
 const delay=narrativeRetryDelayMs(count),key=narrativeRetryKey(kind,id),nextRetryAt=Date.now()+delay;
 const timer=setTimeout(()=>{
  narrativeRuntime.retryTimers.delete(key);
  if(kind==='film_review'){const f=filmById(id);if(f?.review)void queueAIReview(f,{force:true,automatic:true})}
  else if(kind==='project_intelligence'){const s=scriptById(id);if(s?.source==='Original Concept')void queueProjectIntelligence(s,{force:true,automatic:true})}
 },delay);
 narrativeRuntime.retryTimers.set(key,timer);return nextRetryAt;
}
function narrativeErrorRetryable(err){
 const status=Number(err?.status||0),code=String(err?.code||err?.message||'');
 if(['narrative_not_configured','origin_not_allowed','unsupported_request','invalid_json','invalid_project_intelligence_shape','invalid_review_shape'].includes(code))return false;
 if(code==='review_quality_failed')return true;
 return !status||status===408||status===425||status===429||status>=500||/abort|network|fetch|timeout/i.test(code);
}
function ensureFilmNarrative(f){
 if(!f)return null;
 f.aiNarrative=f.aiNarrative||{version:NARRATIVE_SCHEMA_VERSION};
 if(!f.aiNarrative.version)f.aiNarrative.version=NARRATIVE_SCHEMA_VERSION;
 return f.aiNarrative;
}
function narrativeTalentSummary(id){
 const t=talentById(id);if(!t)return null;
 const p=typeof ensureLotProfile==='function'?ensureLotProfile(t):null;
 return {id:t.id,name:t.name,type:t.type,momentum:Math.round(t.momentum||0),studioRelationship:Math.round(t.relationship||0),lotPersona:p&&typeof lotPersonaLabels==='function'?lotPersonaLabels(t).slice(0,3):[]};
}
function narrativeLotStoriesForFilm(f){
 if(typeof ensureLotState!=='function')return [];
 const attached=new Set(typeof lotAttachedTalentIds==='function'?lotAttachedTalentIds(f):[f.directorId,...(f.cast||[]),...(f.supportingCastIds||[])].filter(Boolean));
 return ensureLotState().stories.filter(s=>{
  if((s.filmIds||[]).includes(f.id))return true;
  return (s.participants||[]).filter(id=>attached.has(id)).length>=2;
 }).sort((a,b)=>(b.active-a.active)||((b.lastWeek||0)-(a.lastWeek||0))).slice(0,4).map(s=>({
  type:s.type,headline:s.headline,summary:s.summary||'',detail:s.detail||'',active:!!s.active,phase:s.phase||null,intensity:s.intensity||1,
  participants:(s.participants||[]).map(id=>talentById(id)?.name).filter(Boolean),
  chapters:(s.chapters||[]).slice(0,3).map(ch=>({type:ch.type,headline:ch.headline,detail:ch.detail||''}))
 }));
}
function validProjectIntelligence(x){
 return !!x&&typeof x.recognized==='boolean'&&typeof x.confidence==='string'&&typeof x.relationship==='string'&&Array.isArray(x.legacy_talent)&&Array.isArray(x.established_identity);
}
function ensureScriptIntelligence(s){
 if(!s)return null;
 s.projectIntelligence=s.projectIntelligence||{status:'idle',accepted:null};
 if(s.projectIntelligence.accepted===undefined)s.projectIntelligence.accepted=null;
 return s.projectIntelligence;
}
function narrativeProjectIntelligencePacket(s){
 return {
  schemaVersion:NARRATIVE_SCHEMA_VERSION,
  contentType:'project_intelligence',
  fictionalUniverseNotice:'This is creative-context recognition for a personal alternate-Hollywood simulation. It is not legal or rights-clearance advice.',
  project:{id:s.id,title:s.title||'',genre:s.genre||'',logline:s.logline||'',synopsis:s.synopsis||'',source:s.source||'',audience:s.commissionBrief?.audience||null}
 };
}
function projectIntelligenceAccepted(s){
 const x=s?.projectIntelligence;
 return x?.status==='ready'&&x.accepted===true&&validProjectIntelligence(x.result)&&x.result.recognized;
}
function projectIntelligencePublicContext(s){
 if(!projectIntelligenceAccepted(s))return null;
 const x=s.projectIntelligence.result;
 return {
  property:x.property_name,relationship:x.relationship,installmentNumber:x.installment_number||0,confidence:x.confidence,
  legacyTitles:(x.legacy_titles||[]).slice(0,6),
  legacyTalent:(x.legacy_talent||[]).slice(0,6),
  establishedIdentity:(x.established_identity||[]).slice(0,6),
  contextSummary:x.context_summary||''
 };
}
function projectIntelligenceCastContext(f){
 const s=f?scriptById(f.scriptId):null,ctx=projectIntelligencePublicContext(s);if(!ctx)return null;
 const attached=[talentById(f.directorId),...(f.cast||[]).map(talentById),...(f.supportingCastIds||[]).map(talentById)].filter(Boolean);
 const legacyActors=(ctx.legacyTalent||[]).filter(x=>/lead|actor|cast|star|performer/i.test(x.association||''));
 const compare=legacyActors.length?legacyActors:(ctx.legacyTalent||[]);
 const key=n=>String(n||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const attachedMap=new Map(attached.map(t=>[key(t.name),t.name])),returning=compare.filter(x=>attachedMap.has(key(x.name))).map(x=>x.name);
 const missing=compare.filter(x=>!attachedMap.has(key(x.name))).map(x=>x.name),castAttached=(f.cast||[]).length+(f.supportingCastIds||[]).length;
 const mode=!castAttached?'unresolved':returning.length===0&&compare.length?'full-recast':returning.length&&missing.length?'partial-return':returning.length?'legacy-return':'new-package';
 return {...ctx,returning,missing,mode};
}
function projectIntelligenceCastSignal(f){
 const x=projectIntelligenceCastContext(f);if(!x)return '';
 const label=x.mode==='full-recast'?'Full legacy recast':x.mode==='partial-return'?'Partial legacy return':x.mode==='legacy-return'?'Legacy return':'Franchise context';
 const detail=x.mode==='full-recast'
  ?'None of the recognised legacy performers are currently in the package. Project Slate will treat this as a deliberate new casting direction.'
  :x.mode==='partial-return'
   ?('Returning: '+x.returning.join(', ')+'. Not returning: '+x.missing.join(', ')+'.')
   :x.mode==='legacy-return'
    ?('Recognised returning talent: '+x.returning.join(', ')+'.')
    :('Legacy associations: '+(x.legacyTalent||[]).map(t=>t.name).join(', ')+'.');
 return '<div class="card project-intel-signal"><div class="row"><div><div class="badge">PROJECT INTELLIGENCE</div><strong>'+narrativeEscapeHTML(label)+'</strong></div><span class="pill blue">'+narrativeEscapeHTML((x.property||'Recognised IP')+' · '+x.relationship)+'</span></div><div class="small" style="margin-top:8px">'+narrativeEscapeHTML(detail)+'</div></div>';
}
function projectIntelligenceHTML(s){
 if(!s||s.source!=='Original Concept')return '';
 const x=ensureScriptIntelligence(s);
 if(x.status==='idle')return '<div class="section-title"><h2>Project Intelligence</h2><span class="small">Optional creative-context check</span></div><div class="card"><div class="body">Check whether this player-created concept clearly connects to an existing film, series, book, game or other known property. Recognition adds narrative context only and never changes screenplay quality.</div><button class="btn block" style="margin-top:10px" data-project-intel-retry="'+s.id+'">Check project context</button></div>';
 if(x.status==='pending')return '<div class="section-title"><h2>Project Intelligence</h2><span class="small">Checking creative context</span></div><div class="card attention"><div class="row"><strong>Looking for an existing-property connection…</strong><span class="pill blue">AI</span></div><div class="small" style="margin-top:7px">The screenplay remains fully playable while this runs.</div></div>';
 if(x.status==='retry_wait')return '<div class="section-title"><h2>Project Intelligence</h2></div><div class="card attention"><div class="row"><strong>Context service temporarily unavailable</strong><span class="pill warn">RETRYING</span></div><div class="small" style="margin-top:7px">Project Slate will retry automatically. The screenplay remains fully playable.</div></div>';
 if(x.status==='degraded')return '<div class="section-title"><h2>Project Intelligence</h2></div><div class="card"><div class="row"><strong>Context check deferred</strong><span class="pill">LOCAL MODE</span></div><div class="small" style="margin-top:7px">Project Slate will try again when the app reconnects or resumes. No gameplay is blocked.</div></div>';
 if(x.status!=='ready'||!validProjectIntelligence(x.result))return '';
 const p=x.result;
 if(!p.recognized)return '<div class="section-title"><h2>Project Intelligence</h2></div><div class="card"><div class="row"><strong>No strong existing-property match</strong><span class="pill">ORIGINAL</span></div><div class="small" style="margin-top:7px">'+narrativeEscapeHTML(p.recognition_basis||'The title and premise did not strongly identify a known property.')+'</div><button class="btn ghost" style="margin-top:10px" data-project-intel-retry="'+s.id+'">Check again</button></div>';
 const confidence=(p.confidence||'low').toUpperCase(),accepted=x.accepted===true,dismissed=x.accepted===false;
 const talent=(p.legacy_talent||[]).map(t=>'<span class="pill">'+narrativeEscapeHTML(t.name)+' · '+narrativeEscapeHTML(t.association)+'</span>').join('');
 const identity=(p.established_identity||[]).map(v=>'<span class="pill blue">'+narrativeEscapeHTML(v)+'</span>').join('');
 const decision=accepted
  ?'<div class="row" style="margin-top:12px"><span class="pill good">CONTEXT ACTIVE</span><button class="btn ghost" data-project-intel-dismiss="'+s.id+'">Treat as original instead</button></div>'
  :dismissed
   ?'<div class="row" style="margin-top:12px"><span class="pill">CONTEXT IGNORED</span><button class="btn" data-project-intel-accept="'+s.id+'">Use recognised context</button></div>'
   :'<div class="grid cols2" style="margin-top:12px"><button class="btn primary" data-project-intel-accept="'+s.id+'">Use '+narrativeEscapeHTML(p.property_name||'franchise')+' context</button><button class="btn" data-project-intel-dismiss="'+s.id+'">Treat as original</button></div>';
 return '<div class="section-title"><h2>Project Intelligence</h2><span class="small">Creative context · not rights clearance</span></div><div class="card project-intelligence '+(accepted?'goodline':'')+'"><div class="row"><div><div class="badge">'+confidence+' CONFIDENCE · '+narrativeEscapeHTML(p.relationship).toUpperCase()+'</div><strong style="display:block;margin-top:5px">'+narrativeEscapeHTML(p.property_name||'Recognised property')+'</strong></div><span class="pill '+(accepted?'good':'warn')+'">'+(accepted?'ACTIVE':'CONFIRM')+'</span></div><div class="body" style="margin-top:9px">'+narrativeEscapeHTML(p.context_summary||'')+'</div>'+(talent?'<div class="small" style="margin-top:10px"><strong>Legacy associations</strong></div><div style="margin-top:5px">'+talent+'</div>':'')+(identity?'<div class="small" style="margin-top:10px"><strong>Established identity</strong></div><div style="margin-top:5px">'+identity+'</div>':'')+'<div class="small" style="margin-top:10px">'+narrativeEscapeHTML(p.recognition_basis||'')+'</div><div class="small" style="margin-top:8px">Project Intelligence provides narrative context only. It does not determine ownership, licensing or production rights.</div>'+decision+'</div>';
}
function queueProjectIntelligence(s,{force=false,automatic=false}={}){
 if(!s||s.source!=='Original Concept'||!narrativeEndpoint())return Promise.resolve(null);
 const store=ensureScriptIntelligence(s),packet=narrativeProjectIntelligencePacket(s),fingerprint=narrativeFingerprint(packet),existing=s.projectIntelligence||store;
 if(!force&&store.status==='ready'&&store.fingerprint===fingerprint)return Promise.resolve(store);
 const key='project_intelligence:'+s.id;if(narrativeRuntime.pending.has(key))return narrativeRuntime.pending.get(key);
 const priorAccepted=store.accepted??null,retryCount=automatic?(existing.retryCount||0):(force?existing.retryCount||0:0);
 clearNarrativeRetry('project_intelligence',s.id);
 s.projectIntelligence={status:'pending',accepted:priorAccepted,fingerprint,requestedWeek:state.week,retryCount};try{save()}catch{};if(typeof render==='function'&&state.detail?.type==='script'&&state.detail?.id===s.id)render()
 const task=requestNarrative('project_intelligence',packet).then(data=>{
  if(!validProjectIntelligence(data.narrative)){const e=new Error('invalid_project_intelligence_shape');e.code='invalid_project_intelligence_shape';throw e}
  s.projectIntelligence={status:'ready',accepted:data.narrative.recognized?priorAccepted:false,fingerprint,result:data.narrative,provider:data.meta?.provider||null,model:data.meta?.model||null,responseId:data.meta?.responseId||null,generatedWeek:state.week,retryCount:0};
  clearNarrativeRetry('project_intelligence',s.id);narrativeRuntime.lastError=null;
  if(data.narrative.recognized&&priorAccepted===null&&typeof notify==='function')notify('project-intel:'+s.id,'Project Intelligence · '+(data.narrative.property_name||s.title),'A possible '+data.narrative.relationship+' connection was recognised. Confirm whether Project Slate should use that context.',null,false,'info',{screen:'develop',detail:{type:'script',id:s.id}});
  try{save()}catch{};if(typeof render==='function'&&state.detail?.type==='script'&&state.detail?.id===s.id)render();return s.projectIntelligence;
 }).catch(err=>{
  const nextCount=(retryCount||0)+1,canRetry=narrativeErrorRetryable(err)&&nextCount<=NARRATIVE_AUTO_RETRY_LIMIT,nextRetryAt=canRetry?scheduleNarrativeRetry('project_intelligence',s.id,nextCount):null;
  s.projectIntelligence={status:canRetry?'retry_wait':'degraded',accepted:priorAccepted,fingerprint,lastError:String(err?.message||err),failedWeek:state.week,retryCount:nextCount,nextRetryAt};
  narrativeRuntime.lastError=s.projectIntelligence.lastError;try{save()}catch{};if(typeof render==='function'&&state.detail?.type==='script'&&state.detail?.id===s.id)render();return null;
 }).finally(()=>narrativeRuntime.pending.delete(key));
 narrativeRuntime.pending.set(key,task);return task;
}
function acceptProjectIntelligence(s){const x=ensureScriptIntelligence(s);if(x?.status!=='ready'||!x.result?.recognized)return;x.accepted=true;save();render()}
function dismissProjectIntelligence(s){const x=ensureScriptIntelligence(s);if(!x)return;x.accepted=false;save();render()}
function retryProjectIntelligence(s){if(!s)return;queueProjectIntelligence(s,{force:true});render()}

function narrativeFilmReviewPacket(f){
 const sc=scriptById(f.scriptId),id=typeof ensureFilmIdentity==='function'?ensureFilmIdentity(f):{},critic=f.review?.critic||{},m=f.metrics||{},post=f.post||{},marketing=typeof ensureMarketingState==='function'?ensureMarketingState(f):f.marketingState||{},tracking=marketing.trackingHistory?.[0]||null;
 const support=typeof supportingActors==='function'?supportingActors(f):[];
 const director=narrativeTalentSummary(f.directorId),actors=[...(f.cast||[]),...support.map(x=>x.id)].map(narrativeTalentSummary).filter(Boolean);
 const studioIdentity=typeof studioIdentityPrimary==='function'?studioIdentityPrimary():null;
 return {
  schemaVersion:NARRATIVE_SCHEMA_VERSION,
  contentType:'film_review',
  fictionalUniverseNotice:'All named talent are fictional alternate-reality Project Slate counterparts. Supplied events are in-game fiction, not real-world claims.',
  publication:{name:f.review?.publication||'The Daily Screen',critic:{name:critic.name||'Staff Critic',title:critic.title||'Film Critic',voice:critic.voice||'general',voiceTag:critic.tag||''}},
  verdict:{critics:f.review?.critics,audience:f.review?.audience,stars:f.review?.stars,tier:typeof reviewTier==='function'?reviewTier(f.review?.critics||0):null},
  film:{
   id:f.id,title:f.title,genre:f.genre,logline:sc?.logline||'',synopsis:sc?.synopsis||'',budget:f.budget,investment:f.investment,
   source:sc?.source||'',runtime:post.runtime||post.targetRuntime||null,projectContext:projectIntelligencePublicContext(sc),
   identity:{archetype:id.archetype||null,texture:id.texture||null,strength:id.strength||null,risk:id.risk||null},
   creative:deep(f.creative||{}),creativeDirection:f.creativeDirection?.label||null
  },
  package:{director,cast:actors},
  craft:{
   direction:Math.round(m.direction||0),performances:Math.round(m.performances||0),technical:Math.round(m.technical||0),pacing:Math.round(m.pacing||0),clarity:Math.round(m.clarity||0),chemistry:Math.round(m.chemistry||0),stability:Math.round(m.stability||0),
   script:{story:Math.round(sc?.story||0),structure:Math.round(sc?.structure||0),characters:Math.round(sc?.characters||0),emotion:Math.round(sc?.emotion||0),originality:Math.round(sc?.originality||0),access:Math.round(sc?.access||0),hook:Math.round(sc?.hook||0),genreFulfillment:Math.round(sc?.genreFulfillment||0)}
  },
  production:{
   selectedHistory:(f.history||[]).slice(-10),
   shootJournal:(f.shootJournal||[]).slice(-6).map(x=>({week:x.week,text:x.text,topic:x.topic||null,mood:x.mood||null})),
   post:{runtime:post.runtime||null,endingStrength:post.endingStrength||null}
  },
  campaign:{type:f.campaign||null,tracking:tracking?{phase:tracking.phase,low:tracking.low,high:tracking.high,center:tracking.center}:null,lotAngle:marketing.lotAngle||null},
  publicLotContext:narrativeLotStoriesForFilm(f),
  studio:{name:state.studio?.name||'Independent Studio',identity:studioIdentity?.label||null,creativeReputation:Math.round(state.reputation?.creative||0),commercialReputation:Math.round(state.reputation?.commercial||0)}
 };
}
function narrativeFingerprint(packet){return String(hash(JSON.stringify(packet)))}
function validAIReview(x){return !!x&&typeof x.headline==='string'&&typeof x.pull_quote==='string'&&Array.isArray(x.paragraphs)&&x.paragraphs.length===4&&x.paragraphs.every(p=>typeof p==='string'&&p.trim())}
async function requestNarrative(type,packet){
 const endpoint=narrativeEndpoint();if(!endpoint){const e=new Error('narrative_backend_not_configured');e.code='narrative_backend_not_configured';throw e}
 let lastError=null;
 for(let attempt=0;attempt<2;attempt++){
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),NARRATIVE_REQUEST_TIMEOUT_MS);
  try{
   const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,packet}),signal:ctrl.signal,cache:'no-store'});
   let data=null;try{data=await res.json()}catch{}
   if(res.ok&&data?.ok)return data;
   const err=new Error(data?.error||('http_'+res.status));err.code=data?.error||('http_'+res.status);err.status=res.status;err.detail=data?.detail||null;lastError=err;
   if(attempt===0&&narrativeErrorRetryable(err)&&err.code!=='review_quality_failed'){await narrativeSleep(res.status===429?10000:3000);continue}
   throw err;
  }catch(err){
   lastError=err;
   if(attempt===0&&narrativeErrorRetryable(err)&&String(err?.code||'')!=='review_quality_failed'){await narrativeSleep(3000);continue}
   throw err;
  }finally{clearTimeout(timer)}
 }
 throw lastError||new Error('narrative_request_failed');
}
function aiReviewContent(f){const x=ensureFilmNarrative(f)?.review;return x?.status==='ready'&&validAIReview(x.narrative)?x:null}
function narrativeEscapeHTML(value){return String(value??'').replace(/[&<>\"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch]))}
function reviewDisplayContent(f){
 const ai=aiReviewContent(f),local=f.review||{};
 if(ai)return {headline:narrativeEscapeHTML(ai.narrative.headline),quote:narrativeEscapeHTML(ai.narrative.pull_quote),paragraphs:ai.narrative.paragraphs.map(narrativeEscapeHTML),ai};
 return {headline:local.headline,quote:local.quote,paragraphs:local.paragraphs||[],ai:null};
}
function narrativeReviewStatusHTML(f){
 const x=ensureFilmNarrative(f)?.review;
 if(x?.status==='ready')return '<div class="narrative-status ready"><span class="pill good">NARRATIVE ENGINE</span><span>AI-authored review prose · scores and outcomes remain simulation-owned.</span></div>';
 if(x?.status==='pending')return '<div class="narrative-status pending"><span class="pill blue">NARRATIVE ENGINE</span><span>AI copy is being written. The local Daily Screen review remains fully available meanwhile.</span></div>';
 if(x?.status==='retry_wait')return '<div class="narrative-status failed"><span class="pill warn">LOCAL COPY</span><span>Narrative Engine is temporarily unavailable. Project Slate is retrying automatically.</span></div>';
 if(x?.status==='degraded')return '<div class="narrative-status"><span class="pill">LOCAL COPY</span><span>The simulation review is complete. AI will retry automatically when the app reconnects or resumes.</span></div>';
 if(f?.review)return '<div class="narrative-status"><span class="pill blue">LOCAL COPY</span><span>Project Slate is preparing the AI-written version automatically.</span></div>';
 return '';
}
function ensureReviewRevealState(){
 state.reviewRevealQueue=Array.isArray(state.reviewRevealQueue)?state.reviewRevealQueue:[];
 if(state.activeReviewReveal===undefined)state.activeReviewReveal=null;
 return state.reviewRevealQueue;
}
function reviewRevealBlocked(){
 return !state.studio||state.screen==='setup'||!!state.pendingCeremony||!!state.pendingAwardsNominations||!!state.activeFilmWrapId||!!state.activeStudioMoment||!!state.activeLegendUnlockId||['ceremony','nominations','filmWrap','studioMoment','legendUnlock'].includes(state.screen);
}
function queueReviewReveal(f){
 if(!f?.review||f.owner!=='player')return false;
 const q=ensureReviewRevealState(),token=f.review.revealToken||(f.review.revealToken='review:'+f.id+':'+(f.releaseWeek||state.week)+':'+(f.review.critics||0)+':'+(f.review.audience||0));
 if(f.review.lastRevealToken===token||q.some(i=>i.filmId===f.id&&i.token===token)||state.activeReviewReveal?.token===token)return false;
 q.push({filmId:f.id,token,week:state.week});
 return surfacePendingReviewReveal();
}
function surfacePendingReviewReveal(){
 const q=ensureReviewRevealState();
 if(state.activeReviewReveal||reviewRevealBlocked())return false;
 while(q.length){
  const item=q.shift(),f=filmById(item.filmId);
  if(!f?.review)continue;
  state.activeReviewReveal=item;state.screen='reviewReveal';state.detail=null;state.history=[];if(typeof requestScrollTop==='function')requestScrollTop();return true;
 }
 return false;
}
function reviewRevealScreen(){
 const item=state.activeReviewReveal,f=item?.filmId?filmById(item.filmId):null;
 if(!f||!f.review)return typeof releaseScreen==='function'?releaseScreen():studioScreen();
 const d=reviewDisplayContent(f),critic=f.review.critic||{},score=f.review.critics||0,tone=score>=80?'great':score<55?'bad':score<70?'warn':'neutral';
 return '<div class="review-reveal review-reveal-'+tone+'"><div class="review-reveal-inner">'+
  '<div class="review-reveal-mast"><div><span>THE</span><strong>DAILY SCREEN</strong></div><small>REVIEW DROP · '+narrativeEscapeHTML(typeof calendarDateLabel==='function'?calendarDateLabel(state.calendarDay):'WEEK '+state.week)+'</small></div>'+
  '<div class="review-reveal-grid"><div class="review-reveal-art">'+filmKeyArtHTML(f,'hero')+'</div><div class="review-reveal-copy"><div class="event-super">THE REVIEWS ARE IN</div><div class="review-reveal-film">'+narrativeEscapeHTML(f.title)+'</div><h1>'+(d.headline||'The Daily Screen review')+'</h1>'+
  '<div class="review-reveal-scores"><div><span>DAILY SCREEN</span><strong>'+Number(f.review.stars||0).toFixed(1)+' ★</strong></div><div><span>CRITICS</span><strong>'+score+'%</strong></div><div><span>AUDIENCE</span><strong>'+Number(f.review.audience||0)+'%</strong></div></div>'+
  '<blockquote>“'+(d.quote||narrativeEscapeHTML(f.review.quote||''))+'”</blockquote>'+
  '<div class="review-reveal-byline">By <strong>'+narrativeEscapeHTML(critic.name||'Staff Critic')+'</strong> · '+narrativeEscapeHTML(critic.title||'Film Critic')+'</div>'+
  '<div class="review-reveal-actions"><button class="btn primary" id="reviewRevealRead">Read the full review</button><button class="btn ghost" id="reviewRevealContinue">Back to release</button></div></div></div>'+
  '<div class="review-reveal-foot">'+(d.ai?'Narrative Engine copy · ':'Local Daily Screen copy · ')+ 'Project Slate’s simulation owns the verdict.</div></div></div>';
}
function closeReviewReveal(readFull=false){
 const item=state.activeReviewReveal,f=item?.filmId?filmById(item.filmId):null;
 if(f?.review&&item?.token)f.review.lastRevealToken=item.token;
 state.activeReviewReveal=null;
 if(surfacePendingReviewReveal()){save();render();return}
 if(f){state.screen='release';state.detail=readFull?{type:'review',id:f.id}:{type:'film',id:f.id}}else{state.screen='release';state.detail=null}
 state.history=[];if(typeof requestScrollTop==='function')requestScrollTop();save();render();
}
function queueAIReview(f,{force=false,automatic=false}={}){
 if(!f?.review||f.owner!=='player')return Promise.resolve(null);
 if(typeof simulationBenchmarkActive!=='undefined'&&simulationBenchmarkActive)return Promise.resolve(null);
 if(!narrativeEndpoint())return Promise.resolve(null);
 const store=ensureFilmNarrative(f),packet=narrativeFilmReviewPacket(f),fingerprint=narrativeFingerprint(packet),existing=store.review,retryCount=automatic?(existing?.retryCount||0):(force?existing?.retryCount||0:0);
 if(!force&&existing?.status==='ready'&&existing.fingerprint===fingerprint)return Promise.resolve(existing);
 const key='film_review:'+f.id;if(narrativeRuntime.pending.has(key))return narrativeRuntime.pending.get(key);
 clearNarrativeRetry('film_review',f.id);
 store.review={status:'pending',fingerprint,requestedWeek:state.week,lastError:null,retryCount};
 try{save()}catch{}
 const task=requestNarrative('film_review',packet).then(data=>{
  if(!validAIReview(data.narrative)){const e=new Error('invalid_review_shape');e.code='invalid_review_shape';throw e}
  store.review={status:'ready',fingerprint,narrative:data.narrative,provider:data.meta?.provider||null,model:data.meta?.model||null,responseId:data.meta?.responseId||null,generatedWeek:state.week,qualityRetry:!!data.meta?.qualityRetry,retryCount:0};
  clearNarrativeRetry('film_review',f.id);narrativeRuntime.lastError=null;try{save()}catch{}
  const visible=(state.detail?.type==='review'&&state.detail?.id===f.id)||state.activeReviewReveal?.filmId===f.id;
  if(typeof render==='function'&&visible)render();
  return store.review;
 }).catch(err=>{
  const nextCount=(retryCount||0)+1,canRetry=narrativeErrorRetryable(err)&&nextCount<=NARRATIVE_AUTO_RETRY_LIMIT,nextRetryAt=canRetry?scheduleNarrativeRetry('film_review',f.id,nextCount):null;
  store.review={status:canRetry?'retry_wait':'degraded',fingerprint,lastError:String(err?.message||err),failedWeek:state.week,retryCount:nextCount,nextRetryAt};
  narrativeRuntime.lastError=store.review.lastError;try{save()}catch{}
  const visible=(state.detail?.type==='review'&&state.detail?.id===f.id)||state.activeReviewReveal?.filmId===f.id;
  if(typeof render==='function'&&visible)render();
  return null;
 }).finally(()=>narrativeRuntime.pending.delete(key));
 narrativeRuntime.pending.set(key,task);return task;
}
function retryAIReview(f){if(!f)return;queueAIReview(f,{force:true});render()}
function resumeNarrativeWork({force=false}={}){
 if(!state?.studio)return;
 const now=Date.now();
 (state.films||[]).filter(f=>f.owner==='player'&&f.review).forEach(f=>{
  const x=f.aiNarrative?.review,activeRelease=f.stage==='cinema'&&(f.cinemaWeek||0)<=1;
  if(x?.status==='ready')return;
  if(x?.status==='pending'&&!narrativeRuntime.pending.has('film_review:'+f.id)){x.status='retry_wait';x.nextRetryAt=now}
  const due=force||!x||!x.nextRetryAt||x.nextRetryAt<=now;
  if(due&&(activeRelease||x?.status==='retry_wait'||x?.status==='degraded'))void queueAIReview(f,{force:true,automatic:true});
 });
 (state.scripts||[]).filter(s=>s.source==='Original Concept'&&s.projectIntelligence).forEach(s=>{
  const x=s.projectIntelligence;if(x.status==='ready')return;
  if(x.status==='pending'&&!narrativeRuntime.pending.has('project_intelligence:'+s.id)){x.status='retry_wait';x.nextRetryAt=now;x.lastError=x.lastError||'Context check was interrupted before completion.'}
  if((force||!x.nextRetryAt||x.nextRetryAt<=now)&&['retry_wait','degraded'].includes(x.status))void queueProjectIntelligence(s,{force:true,automatic:true});
 });
}
function bindNarrativeLifecycle(){
 if(narrativeRuntime.lifecycleBound)return;narrativeRuntime.lifecycleBound=true;
 if(typeof window!=='undefined')window.addEventListener('online',()=>{void testNarrativeConnection();resumeNarrativeWork({force:true})});
 if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){void testNarrativeConnection();resumeNarrativeWork()}});
}
function bootstrapNarrativeEngine(){
 ensureReviewRevealState();bindNarrativeLifecycle();void testNarrativeConnection();
 const now=Date.now();
 (state.films||[]).forEach(f=>{
  const x=f.aiNarrative?.review;if(x?.status==='pending'){x.status='retry_wait';x.nextRetryAt=now;x.lastError=x.lastError||'AI review request was interrupted before completion.'}
  if(f.owner==='player'&&f.review&&f.stage==='cinema'&&(f.cinemaWeek||0)<=1)queueReviewReveal(f);
 });
 (state.scripts||[]).forEach(s=>{const x=s.projectIntelligence;if(x?.status==='pending'){x.status='retry_wait';x.nextRetryAt=now;x.lastError='Context check was interrupted before completion.'}});
 if(state.activeReviewReveal&&!filmById(state.activeReviewReveal.filmId))state.activeReviewReveal=null;
 resumeNarrativeWork();
}
