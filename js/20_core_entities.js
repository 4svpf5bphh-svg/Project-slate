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
function load(){
 try{
  const x=JSON.parse(localStorage.getItem(KEY)||'null');
  if(x)return migrateState(x);
 }catch(e){}
 return initialState();
}
state=load();
// Lifecycle bootstrap that depends on later-declared module constants is deferred
// until all modules have initialized (see 80_ui_moments_bind_render.js).
function save(){if(simulationBenchmarkActive)return;state.version=VERSION;state.saveSchema=SAVE_SCHEMA_VERSION;localStorage.setItem(KEY,JSON.stringify(state))}
function resetGame(){localStorage.removeItem(KEY);state=initialState();save();render()}
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
