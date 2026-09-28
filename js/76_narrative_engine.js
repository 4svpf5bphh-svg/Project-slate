// Project Slate v4.5a — Narrative Engine client
// Gameplay remains authoritative. AI prose is optional and always has a local fallback.

const NARRATIVE_SCHEMA_VERSION=1;
const NARRATIVE_DEFAULT_ENDPOINT='https://project-slate-five.vercel.app/api/narrative';
const narrativeRuntime={pending:new Map(),lastError:null,connection:null};

function narrativeNormalizeEndpoint(value){
 let url=String(value||'').trim();if(!url)return null;
 if(!/^https?:\/\//i.test(url))url='https://'+url;
 url=url.replace(/\/+$/,'');
 if(!/\/api\/narrative$/i.test(url))url+='/api/narrative';
 return url;
}
function narrativeEndpoint(){
 const configured=(typeof window!=='undefined'&&window.PROJECT_SLATE_NARRATIVE_ENDPOINT)||localStorage.getItem('projectSlateNarrativeEndpoint');
 if(configured)return narrativeNormalizeEndpoint(configured);
 if(typeof location!=='undefined'&&/\.github\.io$/i.test(location.hostname))return NARRATIVE_DEFAULT_ENDPOINT;
 return '/api/narrative';
}
function setNarrativeEndpointValue(value){
 const normalized=narrativeNormalizeEndpoint(value);
 if(normalized)localStorage.setItem('projectSlateNarrativeEndpoint',normalized);else localStorage.removeItem('projectSlateNarrativeEndpoint');
 narrativeRuntime.connection=null;narrativeRuntime.lastError=null;return narrativeEndpoint();
}
async function testNarrativeConnection(){
 const endpoint=narrativeEndpoint();if(!endpoint){narrativeRuntime.connection={ok:false,error:'No Narrative API endpoint configured.'};return narrativeRuntime.connection}
 try{
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),12000);let res;
  try{res=await fetch(endpoint,{method:'GET',headers:{'Accept':'application/json'},signal:ctrl.signal})}finally{clearTimeout(timer)}
  let data=null;try{data=await res.json()}catch{}
  narrativeRuntime.connection=res.ok&&data?.ok?{ok:true,provider:data.provider||'unknown',model:data.model||'unknown',configured:!!data.configured,endpoint}:{ok:false,error:data?.error||('HTTP '+res.status),endpoint};
 }catch(err){narrativeRuntime.connection={ok:false,error:String(err?.message||err),endpoint}}
 return narrativeRuntime.connection;
}
function narrativeSettingsHTML(){
 const endpoint=narrativeEndpoint(),status=narrativeRuntime.connection;
 const value=narrativeEscapeHTML(endpoint||'');
 const statusHTML=status?.ok
  ?'<div class="narrative-connection '+(status.configured?'ready':'warn')+'"><span class="pill '+(status.configured?'good':'warn')+'">'+(status.configured?'CONNECTED':'KEY MISSING')+'</span><div><strong>'+narrativeEscapeHTML(status.provider)+' · '+narrativeEscapeHTML(status.model)+'</strong><span>'+(status.configured?'Narrative API is ready to generate reviews.':'The API is live, but its provider key is not configured yet.')+'</span></div></div>'
  :status?'<div class="narrative-connection warn"><span class="pill warn">NOT READY</span><div><strong>Connection failed</strong><span>'+narrativeEscapeHTML(status.error||'Unknown error')+'</span></div></div>'
  :'<div class="narrative-connection"><span class="pill blue">OPTIONAL</span><div><strong>'+(endpoint?'Endpoint saved':'No endpoint configured')+'</strong><span>'+(endpoint?'Test the connection to confirm the server and Groq key are ready.':'Project Slate will continue using its local writing until a Narrative API is connected.')+'</span></div></div>';
 return '<div class="section-title"><h2>Narrative Engine</h2><span class="small">AI changes the writing, never the simulation result</span></div><div class="card narrative-settings">'+statusHTML+'<label class="field-label" for="narrativeEndpointInput">Narrative API URL</label><input id="narrativeEndpointInput" class="input" type="url" inputmode="url" placeholder="https://your-project.vercel.app" value="'+value+'"><div class="small" style="margin-top:6px">You can paste either the Vercel project URL or the full /api/narrative URL. No API key belongs in the game.</div><div class="grid cols2" style="margin-top:10px"><button class="btn" id="saveNarrativeEndpoint">Save endpoint</button><button class="btn primary" id="testNarrativeEndpoint" '+(!endpoint?'disabled':'')+'>Test connection</button></div><div class="small" style="margin-top:10px"><strong>Current AI surface:</strong> The Daily Screen main review. If the service is unavailable, the existing local review remains the automatic fallback.</div></div>';
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
   source:sc?.source||'',runtime:post.runtime||post.targetRuntime||null,
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
 const endpoint=narrativeEndpoint();if(!endpoint)throw new Error('narrative_backend_not_configured');
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),30000);
 try{
  const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,packet}),signal:ctrl.signal});
  let data=null;try{data=await res.json()}catch{}
  if(!res.ok||!data?.ok)throw new Error(data?.error||('http_'+res.status));
  return data;
 }finally{clearTimeout(timer)}
}
function aiReviewContent(f){const x=ensureFilmNarrative(f)?.review;return x?.status==='ready'&&validAIReview(x.narrative)?x:null}
function narrativeEscapeHTML(value){return String(value??'').replace(/[&<>\"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch]))}
function reviewDisplayContent(f){
 const ai=aiReviewContent(f),local=f.review||{};
 if(ai)return {headline:narrativeEscapeHTML(ai.narrative.headline),quote:narrativeEscapeHTML(ai.narrative.pull_quote),paragraphs:ai.narrative.paragraphs.map(narrativeEscapeHTML),ai};
 return {headline:local.headline,quote:local.quote,paragraphs:local.paragraphs||[],ai:null};
}
function narrativeReviewStatusHTML(f){
 const x=ensureFilmNarrative(f)?.review,endpoint=narrativeEndpoint();
 if(x?.status==='ready')return '<div class="narrative-status ready"><div><span class="pill good">NARRATIVE ENGINE</span><span>AI-authored review prose · scores and game outcomes remain simulation-owned.</span></div><button class="btn ghost" data-retry-ai-review="'+f.id+'">Rewrite review</button></div>';
 if(x?.status==='pending')return '<div class="narrative-status pending"><span class="pill blue">NARRATIVE ENGINE</span><span>The Daily Screen review is being written. Local review copy remains visible until it arrives.</span></div>';
 if(x?.status==='failed')return '<div class="narrative-status failed"><div><span class="pill warn">LOCAL FALLBACK</span><span>Narrative Engine unavailable. The simulation review is still complete and playable.</span></div><button class="btn ghost" data-retry-ai-review="'+f.id+'">Retry AI review</button></div>';
 if(f?.review&&!endpoint)return '<div class="narrative-status"><div><span class="pill blue">LOCAL REVIEW</span><span>Narrative Engine is optional and not connected yet.</span></div><button class="btn ghost" data-open-narrative-settings>Set up Narrative Engine</button></div>';
 if(f?.review)return '<div class="narrative-status"><div><span class="pill blue">NARRATIVE ENGINE</span><span>Local review currently shown. Generate an AI-written version from the same simulation verdict.</span></div><button class="btn ghost" data-retry-ai-review="'+f.id+'">Generate AI review</button></div>';
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
 if(!f||!aiReviewContent(f))return false;
 const q=ensureReviewRevealState(),x=f.aiNarrative.review,token=x.responseId||x.fingerprint||String(x.generatedWeek||Date.now());
 if(x.lastRevealToken===token||q.some(i=>i.filmId===f.id&&i.token===token)||state.activeReviewReveal?.token===token)return false;
 q.push({filmId:f.id,token,week:state.week});
 return surfacePendingReviewReveal();
}
function surfacePendingReviewReveal(){
 const q=ensureReviewRevealState();
 if(state.activeReviewReveal||reviewRevealBlocked())return false;
 while(q.length){
  const item=q.shift(),f=filmById(item.filmId);
  if(!f||!aiReviewContent(f))continue;
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
  '<div class="review-reveal-grid"><div class="review-reveal-art">'+filmKeyArtHTML(f,'hero')+'</div><div class="review-reveal-copy"><div class="event-super">THE REVIEWS ARE IN</div><div class="review-reveal-film">'+narrativeEscapeHTML(f.title)+'</div><h1>'+narrativeEscapeHTML(d.headline||'The Daily Screen review')+'</h1>'+
  '<div class="review-reveal-scores"><div><span>DAILY SCREEN</span><strong>'+Number(f.review.stars||0).toFixed(1)+' ★</strong></div><div><span>CRITICS</span><strong>'+score+'%</strong></div><div><span>AUDIENCE</span><strong>'+Number(f.review.audience||0)+'%</strong></div></div>'+
  '<blockquote>“'+narrativeEscapeHTML(d.quote||f.review.quote||'')+'”</blockquote>'+
  '<div class="review-reveal-byline">By <strong>'+narrativeEscapeHTML(critic.name||'Staff Critic')+'</strong> · '+narrativeEscapeHTML(critic.title||'Film Critic')+'</div>'+
  '<div class="review-reveal-actions"><button class="btn primary" id="reviewRevealRead">Read the full review</button><button class="btn ghost" id="reviewRevealContinue">Back to release</button></div></div></div>'+
  '<div class="review-reveal-foot">AI writes the copy. Project Slate’s simulation owns the verdict.</div></div></div>';
}
function closeReviewReveal(readFull=false){
 const item=state.activeReviewReveal,f=item?.filmId?filmById(item.filmId):null;
 if(f?.aiNarrative?.review&&item?.token)f.aiNarrative.review.lastRevealToken=item.token;
 state.activeReviewReveal=null;
 if(surfacePendingReviewReveal()){save();render();return}
 if(f){state.screen='release';state.detail=readFull?{type:'review',id:f.id}:{type:'film',id:f.id}}else{state.screen='release';state.detail=null}
 state.history=[];if(typeof requestScrollTop==='function')requestScrollTop();save();render();
}
function queueAIReview(f,{force=false}={}){
 if(!f?.review||f.owner!=='player')return Promise.resolve(null);
 if(typeof simulationBenchmarkActive!=='undefined'&&simulationBenchmarkActive)return Promise.resolve(null);
 if(!narrativeEndpoint())return Promise.resolve(null);
 const store=ensureFilmNarrative(f),packet=narrativeFilmReviewPacket(f),fingerprint=narrativeFingerprint(packet),existing=store.review;
 if(!force&&existing?.status==='ready'&&existing.fingerprint===fingerprint)return Promise.resolve(existing);
 const key='film_review:'+f.id;if(narrativeRuntime.pending.has(key))return narrativeRuntime.pending.get(key);
 store.review={status:'pending',fingerprint,requestedWeek:state.week,lastError:null};
 try{save()}catch{}
 const task=requestNarrative('film_review',packet).then(data=>{
  if(!validAIReview(data.narrative))throw new Error('invalid_review_shape');
  store.review={status:'ready',fingerprint,narrative:data.narrative,provider:data.meta?.provider||null,model:data.meta?.model||null,responseId:data.meta?.responseId||null,generatedWeek:state.week,qualityRetry:!!data.meta?.qualityRetry};
  narrativeRuntime.lastError=null;
  const revealed=queueReviewReveal(f);try{save()}catch{}
  if(typeof render==='function'&&(revealed||(state.detail?.type==='review'&&state.detail?.id===f.id)))render();
  return store.review;
 }).catch(err=>{
  store.review={status:'failed',fingerprint,lastError:String(err?.message||err),failedWeek:state.week};
  narrativeRuntime.lastError=store.review.lastError;try{save()}catch{}
  if(typeof render==='function'&&state.detail?.type==='review'&&state.detail?.id===f.id)render();
  return null;
 }).finally(()=>narrativeRuntime.pending.delete(key));
 narrativeRuntime.pending.set(key,task);return task;
}
function retryAIReview(f){if(!f)return;if(!narrativeEndpoint()){showToast('Set up Narrative Engine under Studio → Business → Narrative.');return}queueAIReview(f,{force:true});render()}
function bootstrapNarrativeEngine(){
 ensureReviewRevealState();
 (state.films||[]).forEach(f=>{const x=f.aiNarrative?.review;if(x?.status==='pending')x.status='failed'});
 if(state.activeReviewReveal&&!filmById(state.activeReviewReveal.filmId))state.activeReviewReveal=null;
}
