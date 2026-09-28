// Career state construction, persistence and core entity access

function initialState(){
 const seed=(crypto&&crypto.getRandomValues)?crypto.getRandomValues(new Uint32Array(1))[0]:Math.floor(Math.random()*4294967295);
 const st={
  version:VERSION,saveSchema:SAVE_SCHEMA_VERSION,seed,week:1,calendarDay:1,lastWeeklyHeartbeatWeek:1,studio:null,cash:40,difficulty:'normal',uiDifficultyDraft:'normal',developmentUnlocks:{commissionNotified:false,originalNotified:false},reputation:{creative:45,commercial:45,talent:45,financial:50,press:50},
  finance:{bridgeDebt:0,weeklyInterest:.012,totalInterest:0,quote:0},
  screenplayEconomy:{history:[],lastWeek:0,turnarounds:0,lastTurnaroundWeek:0},
  notifications:[],notificationKeys:[],activeNotificationId:null,
  industryTab:'news',uiStudioTab:'desk',uiDeskTab:'briefing',uiLegacyTab:'overview',uiSlateTab:'pipeline',uiReleaseTab:'box',
  uiPeopleFilter:'all',uiPeopleSearch:'',
  collaborations:{},careerThreads:{active:[],history:[],nextId:1,lastUpdatedWeek:0},careerCycle:{phase:'building',startedWeek:1,lastEvaluatedWeek:0,lastTransitionWeek:1,history:[],lastPlanEndWeek:0,lastRecoveryWeek:0,peakRecognition:12},pressMemory:{},executivePersona:{history:[],lastPrimary:null,lastEvaluatedWeek:0},industryMood:{history:[],lastQuarter:0},fastForward:{uses:0,lastFromDay:null,lastToDay:null},challengerState:{launched:false,launchWeek:null,triggerYear:null,triggerRank:null,triggerRecognition:null},industryOpportunities:{lastOfferWeek:0,history:[],accepted:0},emergingTalentState:{lastIntroductionWeek:0,history:[]},corporateState:{status:'private',founderOwnership:100,investorConfidence:62,ipoDeclinedUntil:0,ipoWeek:null,ipoProceeds:0,lastReviewWeek:0,lastOfferWeek:0,lastFundamental:null,lastMarketCap:null,lastSharePrice:null,history:[],quarterly:[],boardPressure:false,streamingPlatform:{status:'none',name:null,model:null,launchWeek:null,launchCost:0,subscribers:0,peakSubscribers:0,lastQuarterSubscribers:0,lastQuarterWeek:0,exclusiveFilmIds:[],history:[],quarterly:[],lifetimeRevenue:0,lifetimeOperatingCost:0,currentQuarterRevenue:0,currentQuarterCost:0,lastWeeklyRevenue:0,lastWeeklyCost:0,lastWeeklyNet:0,lastExclusiveWeek:null,notifiedWeek:0,declinedUntil:0,woundDownWeek:null}},studioHistory:{anniversaries:[],rivalLeadership:[],hallSnapshots:[],retrospectives:[],lastLeadershipChangeWeek:0},industryRipples:[],audienceMarket:null,portraitCache:{},talentWatchlist:[],yearbooks:[],awardsArchive:[],awardsNominationsArchive:[],pendingAwardsNominations:null,awardsCeremonyStep:0,pendingCeremony:null,availabilityWatches:[],studioIdentity:{history:[],lastPrimary:null,lastEvaluatedWeek:0},pendingFilmWraps:[],activeFilmWrapId:null,uiFilmWrapStep:0,studioMomentQueue:[],activeStudioMoment:null,boxOfficeMemory:{leaderId:null,streak:0,lastWeek:0},economy:{lifetimeOverhead:0,lifetimeCatalogue:0,lifetimeAncillary:0,lastWeeklyOverhead:0,lastCatalogueReceipts:0},studioGrowth:{fans:.04,recognition:12,upgrades:{production:0,casting:0,publicity:0,development:0,post:0},history:[]},studioMilestones:{completed:{},history:[],lastCheckedWeek:0,initialized:false},legends:{unlocked:{},history:[],pending:[],initialized:false},activeLegendUnlockId:null,talentDrama:[],
  uiPickerSearch:'',uiPickerSort:'fit',uiPickerAvailable:false,uiStudioNameDraft:'',uiBrandDraft:{theme:'violet',mark:'aperture',wordmark:'modern'},
  screen:'setup',detail:null,history:[],ids:{film:0,script:0,event:0,review:0,notification:0,talent:0,news:0},
  scripts:[],market:[],writers:[],talent:[],rivals:[],films:[],boxOffice:[],news:[],completed:[],decisions:[],
  uiScriptTab:'market',
  uiWriterDrafts:{
   concept:{title:'',genre:'Psychological Horror',logline:'',synopsis:'',audience:'Mainstream Adults',scale:'mid',positioning:'balanced',tone:'balanced',rating:'mainstream',emphasis:'balanced',writerId:null},
   commission:{genre:'Psychological Horror',audience:'Mainstream Adults',brief:'balanced',scale:'mid',writerId:null},
   search:'',sort:'fit'
  },
  simulationAudit:{schema:2,enabled:true,firstWeek:null,lastWeek:0,weekly:[],quarterly:[],flags:[],captures:0,benchmarks:[]},
  productionCapacity:2,lastRotation:1,lastAwardsSeasonResolved:0,careerStarted:false
 };
 buildWorld(st);
 return st;
}
function buildWorld(st){
 st.talent=[];st.writers=writerSeed.map((w,i)=>({id:'W'+(i+1),name:w[0],structure:w[1],character:w[2],dialogue:w[3],commercial:w[4],fee:w[5],genres:w[6],tag:w[7],momentum:55+(i*7)%35,credits:[],relationship:0}));
 actorSeed.forEach((a,i)=>st.talent.push(rosterProfileFromSeed(a,'Actor',i)));
 directorSeed.forEach((d,i)=>st.talent.push(rosterProfileFromSeed(d,'Director',i)));
 ensureBaseFictionalRoster(st);
 scriptSeed.forEach((x,i)=>st.scripts.push({id:'S'+(i+1),title:x[0],genre:x[1],logline:x[2],price:+(x[3]*.72).toFixed(2),naturalBudget:x[4],story:x[5],hook:x[6],originality:x[7],access:x[8],difficulty:x[9],source:'Market',status:'market',owner:null,filmStarted:false,developmentSpend:0,available:true,createdWeek:1,bids:0}));
 st.market=st.scripts.slice(0,7).map(x=>x.id);
 st.rivals=rivalSeed.map((r,i)=>{const p=aiStudioProfile(r[1]),head=rivalHeadProfile(r[0]);return {id:'R'+(i+1),name:r[0],style:r[1],skill:r[2],capacity:r[3],cash:62+i*5,startingCash:62+i*5,films:[],reputation:55+i*3,recognition:44+i*4,fans:.8+i*.28,signature:r[1],debt:0,totalInterest:0,restructures:0,commercialHistory:[],profile:p,head,relationship:0,relationshipHistory:[],scriptWinsAgainstPlayer:0,lastScriptWinAgainstPlayerWeek:0,lastPlayerClashWeek:0}});
 ensureAudienceMarket(st);
 addNews(st,'Trade desks are watching a quiet opening week as several studios begin packaging new projects.');
}
const SAVE_BACKUP_KEY=KEY+'_backup';
const SAVE_META_KEY=KEY+'_meta';
const PERSISTENCE_DB='projectSlatePersistence';
const PERSISTENCE_STORE='careers';
const persistenceRuntime={loadSource:null,loadError:null,saveError:null,recoveryRaw:null,pendingCandidates:[],lastSavedAt:null,storagePersisted:null,idbReady:false};

function storedCareerCandidate(key){
 const raw=localStorage.getItem(key);if(!raw)return null;
 const parsed=JSON.parse(raw);if(!parsed||typeof parsed!=='object')return null;
 return {key,raw,parsed};
}
function load(){
 const candidates=[];
 for(const key of [KEY,SAVE_BACKUP_KEY]){
  try{const candidate=storedCareerCandidate(key);if(candidate)candidates.push(candidate)}catch(e){persistenceRuntime.loadError=String(e?.message||e)}
 }
 if(candidates.length){
  persistenceRuntime.pendingCandidates=candidates;
  persistenceRuntime.loadSource='pending';
  return candidates[0].parsed;
 }
 persistenceRuntime.loadSource='new';return initialState();
}
function finalizeStoredCareerLoad(){
 const candidates=persistenceRuntime.pendingCandidates||[];if(!candidates.length)return state;
 const errors=[];
 for(const candidate of candidates){
  try{
   const migrated=migrateState(JSON.parse(candidate.raw));
   if(!migrated)throw new Error('Migration returned no career state.');
   state=migrated;persistenceRuntime.loadSource=candidate.key===KEY?'primary':'backup';persistenceRuntime.loadError=null;persistenceRuntime.recoveryRaw=null;persistenceRuntime.pendingCandidates=[];return state;
  }catch(e){errors.push(String(e?.message||e))}
 }
 persistenceRuntime.loadError=errors.join(' · ')||'Stored career could not be migrated.';
 persistenceRuntime.recoveryRaw=candidates[0]?.raw||null;persistenceRuntime.loadSource='recovery';persistenceRuntime.pendingCandidates=[];
 console.error('Project Slate save migration failed after all modules loaded; preserving raw career for recovery.',persistenceRuntime.loadError);
 state=initialState();return state;
}
state=load();
// Lifecycle bootstrap that depends on later-declared module constants is deferred
// until all modules have initialized.
function persistenceMeta(raw){
 return {savedAt:Date.now(),week:state.week||1,calendarDay:state.calendarDay||1,studio:state.studio?.name||null,careerStarted:!!state.careerStarted,version:VERSION,bytes:raw.length};
}
function openPersistenceDB(){
 return new Promise((resolve,reject)=>{
  if(typeof indexedDB==='undefined')return reject(new Error('IndexedDB unavailable'));
  const req=indexedDB.open(PERSISTENCE_DB,1);
  req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(PERSISTENCE_STORE))db.createObjectStore(PERSISTENCE_STORE)};
  req.onsuccess=()=>{persistenceRuntime.idbReady=true;resolve(req.result)};
  req.onerror=()=>reject(req.error||new Error('IndexedDB open failed'));
 });
}
async function mirrorCareerToIndexedDB(raw,meta){
 try{
  const db=await openPersistenceDB();
  await new Promise((resolve,reject)=>{const tx=db.transaction(PERSISTENCE_STORE,'readwrite');tx.objectStore(PERSISTENCE_STORE).put({raw,meta},KEY);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});
  db.close();
 }catch(e){console.warn('Project Slate IndexedDB mirror failed',e)}
}
async function indexedDBCareer(){
 try{
  const db=await openPersistenceDB(),value=await new Promise((resolve,reject)=>{const tx=db.transaction(PERSISTENCE_STORE,'readonly'),req=tx.objectStore(PERSISTENCE_STORE).get(KEY);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error)});
  db.close();return value;
 }catch(e){return null}
}
function save(){
 if(simulationBenchmarkActive)return true;
 if(persistenceRuntime.loadSource==='pending'||persistenceRuntime.loadSource==='recovery'||persistenceRuntime.recoveryRaw)return false;
 state.version=VERSION;state.saveSchema=SAVE_SCHEMA_VERSION;
 let raw;try{raw=JSON.stringify(state)}catch(e){persistenceRuntime.saveError=String(e?.message||e);console.error('Project Slate could not serialize career',e);return false}
 const meta=persistenceMeta(raw);
 try{
  const prior=localStorage.getItem(KEY);
  if(prior&&prior!==raw)localStorage.setItem(SAVE_BACKUP_KEY,prior);
  else if(!localStorage.getItem(SAVE_BACKUP_KEY))localStorage.setItem(SAVE_BACKUP_KEY,raw);
  localStorage.setItem(KEY,raw);
  localStorage.setItem(SAVE_META_KEY,JSON.stringify(meta));
  persistenceRuntime.lastSavedAt=meta.savedAt;persistenceRuntime.saveError=null;
 }catch(e){persistenceRuntime.saveError=String(e?.message||e);console.error('Project Slate local save failed',e);void mirrorCareerToIndexedDB(raw,meta);return false}
 void mirrorCareerToIndexedDB(raw,meta);return true;
}
function resetGame(){localStorage.removeItem(KEY);localStorage.removeItem(SAVE_BACKUP_KEY);localStorage.removeItem(SAVE_META_KEY);state=initialState();save();render()}
async function bootstrapPersistentStorage(){
 try{
  if(navigator.storage?.persisted){
   let persisted=await navigator.storage.persisted();
   if(!persisted&&navigator.storage.persist)persisted=await navigator.storage.persist();
   persistenceRuntime.storagePersisted=!!persisted;
  }
 }catch(e){persistenceRuntime.storagePersisted=false}
 const shouldRecover=persistenceRuntime.loadSource==='new'||persistenceRuntime.loadSource==='recovery'||!state.careerStarted;
 if(!shouldRecover)return false;
 const mirrored=await indexedDBCareer();if(!mirrored?.raw)return false;
 try{
  const parsed=JSON.parse(mirrored.raw),migrated=migrateState(parsed);
  if(!migrated?.careerStarted)return false;
  state=migrated;persistenceRuntime.loadSource='indexeddb';persistenceRuntime.loadError=null;persistenceRuntime.recoveryRaw=null;
  save();return true;
 }catch(e){persistenceRuntime.loadError=persistenceRuntime.loadError||String(e?.message||e);return false}
}
function careerBackupPayload(){
 return {format:'project-slate-career-backup',formatVersion:1,exportedAt:new Date().toISOString(),gameVersion:VERSION,studio:state.studio?.name||null,week:state.week||1,state:deep(state)};
}
async function exportCareerBackup(){
 save();
 const payload=JSON.stringify(careerBackupPayload(),null,2),safe=(state.studio?.name||'studio').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,32)||'studio';
 const filename=`project-slate-${safe}-week-${state.week||1}.json`;
 try{
  const file=new File([payload],filename,{type:'application/json'});
  if(navigator.canShare?.({files:[file]})&&navigator.share){await navigator.share({files:[file],title:'Project Slate career backup'});return true}
 }catch(e){if(e?.name==='AbortError')return false}
 const blob=new Blob([payload],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);return true;
}
async function importCareerBackupFile(file){
 if(!file)return false;
 const text=await file.text();let parsed;try{parsed=JSON.parse(text)}catch{throw new Error('That file is not valid JSON.')}
 const rawState=parsed?.format==='project-slate-career-backup'?parsed.state:parsed;
 if(!rawState||typeof rawState!=='object'||!Array.isArray(rawState.films)||!Array.isArray(rawState.talent))throw new Error('That is not a Project Slate career backup.');
 const migrated=migrateState(rawState);
 if(!migrated)throw new Error('The career could not be migrated.');
 state=migrated;save();return true;
}
function persistenceStatus(){
 let meta=null;try{meta=JSON.parse(localStorage.getItem(SAVE_META_KEY)||'null')}catch{}
 return {source:persistenceRuntime.loadSource,error:persistenceRuntime.loadError||persistenceRuntime.saveError,lastSavedAt:persistenceRuntime.lastSavedAt||meta?.savedAt||null,meta,storagePersisted:persistenceRuntime.storagePersisted,idbReady:persistenceRuntime.idbReady,recoveryAvailable:!!persistenceRuntime.recoveryRaw};
}
function persistenceSaveNow(){const ok=save();if(ok&&typeof showToast==='function')showToast('Career saved locally and mirrored.');else if(!ok&&typeof showToast==='function')showToast('Local save failed — export a career backup now.');return ok}
function exportRawRecoveryBackup(){
 const raw=persistenceRuntime.recoveryRaw;if(!raw)return false;
 const blob=new Blob([raw],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='project-slate-recovery.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);return true;
}

function addNews(st,text,kind='Industry'){const item=buildNewsItem(st,text,kind);applyJournalistCallback(st,item);recordJournalistCoverage(st,item);st.news.unshift(item);st.news=st.news.slice(0,140);return item}
function playerFilms(){return state.films.filter(f=>f.owner==='player')}
function activePlayerFilms(){return playerFilms().filter(f=>!['complete','shelved'].includes(f.stage))}
function filmById(id){return state.films.find(f=>f.id===id)}
function talentById(id){return state.talent.find(t=>t.id===id)}
function scriptById(id){return state.scripts.find(s=>s.id===id)}
function rivalById(id){return state.rivals.find(r=>r.id===id)}
function busy(t){return !t.retired && t.busyUntil>=state.week}
function spend(v){if(v<=0)return true;if(state.cash+1e-9<v){showToast('Not enough cash.');return false}state.cash-=v;return true}
function earn(v){state.cash+=Math.max(0,v)}
