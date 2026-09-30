// Route renderer and initial boot

let lastPremiumRouteKey=null;
function premiumRouteKey(){
 if(state.detail)return `detail:${state.detail.type}:${state.detail.id||state.detail.mode||''}`;
 let sub='';
 if(state.screen==='studio')sub=`:${state.uiStudioTab||'desk'}:${state.uiDeskTab||''}:${state.uiLegacyTab||''}:${state.uiBusinessTab||''}`;
 else if(state.screen==='slate'||state.screen==='films')sub=`:${state.uiSlateTab||'pipeline'}`;
 else if(state.screen==='release'||state.screen==='box')sub=`:${state.uiReleaseTab||'box'}`;
 else if(state.screen==='industry')sub=`:${state.industryTab||'news'}`;
 else if(state.screen==='develop'||state.screen==='scripts')sub=`:${state.uiScriptTab||'market'}`;
 return `screen:${state.screen}${sub}`;
}
function renderMotionClass(next,prev){
 if(!prev)return 'route-enter-first';
 if(prev===next)return '';
 if(/^screen:(filmWrap|legendUnlock|studioMoment|reviewReveal|nominations|ceremony)/.test(next))return 'route-enter-signature';
 if(next.startsWith('detail:'))return 'route-enter-detail';
 if(prev.startsWith('detail:'))return 'route-enter-return';
 return 'route-enter-main';
}
function alignActiveTabs(){
 if(typeof document==='undefined')return;
 requestAnimationFrame(()=>document.querySelectorAll('.industrytabs').forEach(t=>{
  const active=t.querySelector('.btn.primary');if(!active)return;
  const max=Math.max(0,t.scrollWidth-t.clientWidth);if(max<=0){t.scrollLeft=0;return}
  const target=Math.max(0,Math.min(max,active.offsetLeft-(t.clientWidth-active.offsetWidth)/2));
  if(typeof t.scrollTo==='function')t.scrollTo({left:target,behavior:'auto'});else t.scrollLeft=target;
 }));
}

function renderFamilyClass(){
 if(state.screen==='setup')return 'route-setup';
 if(['filmWrap','legendUnlock','studioMoment','reviewReveal','nominations','ceremony'].includes(state.screen))return 'route-signature';
 if(state.detail)return 'route-detail';
 return `route-${state.screen||'industry'}`;
}

function render(){
 if(state.studio&&typeof ensureCalendarState==='function')ensureCalendarState();
 if(state.screen!=='setup'&&typeof surfaceNextSignatureMoment==='function')surfaceNextSignatureMoment();
 if(state.detail?.type==='greenlightReview'){
  const gf=filmById(state.detail.id);
  if(gf&&gf.stage!=='development'){
   if(state.history?.at(-1)?.detail?.type==='film'&&state.history.at(-1).detail.id===gf.id)state.history.pop();
   state.screen='slate';state.detail={type:'film',id:gf.id};requestScrollTop();
  }
 }
 if(!state.studio&&state.screen!=='setup')state.screen='setup';
 let html='';
 if(state.screen==='setup')html=setupScreen();
 else if(state.detail?.type==='script')html=scriptDetail(state.detail.id);
 else if(state.detail?.type==='concept')html=conceptScreen();
 else if(state.detail?.type==='commission')html=commissionScreen();
 else if(state.detail?.type==='writerPicker')html=writerPicker(state.detail.mode);
 else if(state.detail?.type==='writerProfile')html=writerProfile(state.detail.id);
 else if(state.detail?.type==='film')html=filmScreen(state.detail.id);
 else if(state.detail?.type==='greenlightReview')html=greenlightReviewUI(filmById(state.detail.id));
 else if(state.detail?.type==='directorPicker')html=directorPicker(filmById(state.detail.id));
 else if(state.detail?.type==='castingPicker')html=castingPicker(filmById(state.detail.id));
 else if(state.detail?.type==='supportingPicker')html=supportingCastingPicker(filmById(state.detail.id));
 else if(state.detail?.type==='contracts')html=contractsScreen(filmById(state.detail.id));
 else if(state.detail?.type==='talent')html=talentProfile(state.detail.id);
 else if(state.detail?.type==='review')html=reviewScreen(filmById(state.detail.id));
 else if(state.detail?.type==='pulse')html=pulseDetailScreen(state.detail.id);
 else if(state.detail?.type==='finance')html=financeScreen();
 else if(state.detail?.type==='milestones')html=milestonesScreen();
 else if(state.detail?.type==='rival')html=rivalProfile(state.detail.id);
 else if(state.detail?.type==='industryFilm')html=industryFilmProfile(state.detail.id);
 else if(state.detail?.type==='news')html=newsArticleScreen(state.detail.id);
 else if(state.screen==='filmWrap')html=filmWrapMomentScreen();
 else if(state.screen==='legendUnlock')html=legendUnlockScreen();
 else if(state.screen==='studioMoment')html=studioMomentScreen();
 else if(state.screen==='reviewReveal')html=reviewRevealScreen();
 else if(state.screen==='nominations')html=awardsNominationsScreen();
 else if(state.screen==='ceremony')html=awardsCeremonyScreen();
 else if(state.screen==='notifications')html=notificationsScreen();
 else if(state.screen==='studio')html=studioScreen();
 else if(state.screen==='develop'||state.screen==='scripts')html=scriptsScreen();
 else if(state.screen==='slate'||state.screen==='films')html=slateScreen();
 else if(state.screen==='release'||state.screen==='box')html=releaseScreen();
 else html=industryScreen();
 const routeKey=premiumRouteKey(),motion=renderMotionClass(routeKey,lastPremiumRouteKey),family=renderFamilyClass();
 lastPremiumRouteKey=routeKey;
 app.className=state.screen==='setup'?'app-setup':(['filmWrap','legendUnlock','studioMoment','reviewReveal','nominations','ceremony'].includes(state.screen)?'app-signature':'');
 app.innerHTML=`<div class="route-frame ${family} ${motion}">${html}</div>`+notificationOverlay();
 applyPlayerBrandTheme();
 if(state.screen==='setup'){
  const studioName=document.getElementById('studioName');
  if(studioName)studioName.oninput=e=>{state.uiStudioNameDraft=e.target.value;const word=document.querySelector('.brand-preview .studio-wordmark');if(word)word.textContent=e.target.value.trim()||'Your Studio'};
  bindBrandControls();
  document.querySelectorAll('[data-difficulty]').forEach(b=>b.onclick=()=>{state.uiDifficultyDraft=b.dataset.difficulty;save();render()});
   const setupImportCareerBackup=document.getElementById('setupImportCareerBackup');
  if(setupImportCareerBackup)setupImportCareerBackup.onchange=async()=>{
   const file=setupImportCareerBackup.files?.[0];if(!file)return;
   try{await importCareerBackupFile(file);location.reload()}catch(e){showToast(e?.message||'Career backup could not be restored.');setupImportCareerBackup.value=''}
  };
  document.getElementById('startCareer').onclick=()=>{
   const name=document.getElementById('studioName').value.trim();if(!name)return showToast('Enter a studio name.');
   state.uiStudioNameDraft=name;state.difficulty=state.uiDifficultyDraft||'normal';state.cash=difficultyInfo(state.difficulty).cash;state.studio={name,brand:normalizeBrand(state.uiBrandDraft,name)};state.screen='studio';state.careerStarted=true;requestScrollTop();addNews(state,`${name} officially opened for business with ${money(state.cash)} in starting capital.`,'Your Studio');aiStartProjects();recordSimulationAudit('career-start');save();render();
  };
  return;
 }
 bind();
 hydratePortraits();
 applyNavigationScroll();
 alignActiveTabs();
}
if(typeof finalizeStoredCareerLoad==='function')finalizeStoredCareerLoad();
if(state&&state.films){playerFilms().filter(f=>f.stage==='complete').forEach(f=>{ensureAfterlifeState(f);refreshAfterlifeValuation(f);const l=ensureLegacyState(f);if(!l.built)buildFilmLegacy(f,{})})}
// Run retroactive lifecycle checks only after every module-level const/table has initialized.
// This is essential for existing-career reloads: bootstrapStudioMilestones reads STUDIO_MILESTONES.
if(state.studio&&state.careerStarted){bootstrapStudioMilestones();const __audit=ensureSimulationAudit();if(!__audit.weekly.length)recordSimulationAudit('baseline');}
if(state?.talent)state.talent.forEach(ensureTalentMarketEconomy);
if(state?.talent&&typeof bootstrapLot==='function')bootstrapLot();
if(typeof bootstrapNarrativeEngine==='function')bootstrapNarrativeEngine();
if(typeof bootstrapTradePress==='function')bootstrapTradePress();
let persistenceLifecycleBound=false;
function bindPersistenceLifecycle(){
 if(persistenceLifecycleBound)return;persistenceLifecycleBound=true;
 const flush=()=>{try{save()}catch(e){console.error('Project Slate close-save failed',e)}};
 if(typeof window!=='undefined')window.addEventListener('pagehide',flush);
 if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush()});
}
function bootstrapRecoveredCareer(){
 if(state&&state.films)playerFilms().filter(f=>f.stage==='complete').forEach(f=>{ensureAfterlifeState(f);refreshAfterlifeValuation(f);const l=ensureLegacyState(f);if(!l.built)buildFilmLegacy(f,{})});
 if(state.studio&&state.careerStarted){bootstrapStudioMilestones();const a=ensureSimulationAudit();if(!a.weekly.length)recordSimulationAudit('recovered-baseline')}
 if(state?.talent)state.talent.forEach(ensureTalentMarketEconomy);
 if(state?.talent&&typeof bootstrapLot==='function')bootstrapLot();
 if(typeof bootstrapNarrativeEngine==='function')bootstrapNarrativeEngine();
 if(typeof bootstrapTradePress==='function')bootstrapTradePress();
 if(state.screen!=='setup')checkLegendsArchive(true);
}
function projectSlateRecoveryScreen(){
 app.innerHTML=`<main class="screen"><div class="card dangerline"><div class="badge">CAREER RECOVERY</div><h2 style="margin:8px 0">Your saved career was detected, but it could not be loaded safely.</h2><div class="body">Project Slate has preserved the raw save instead of starting a new career over it. Export the recovery file and keep it safe; the stored career has not been intentionally deleted.</div><div class="small" style="margin-top:10px">${persistenceRuntime.loadError||'Unknown migration error'}</div><button class="btn primary block" id="exportRecoveryCareer" style="margin-top:14px">Export recovery file</button></div></main>`;
 const b=document.getElementById('exportRecoveryCareer');if(b)b.onclick=()=>exportRawRecoveryBackup();
}
bindPersistenceLifecycle();
void bootstrapPersistentStorage().then(recovered=>{if(recovered){bootstrapRecoveredCareer();render()}});

if(state.screen!=='setup'){checkLegendsArchive(true);if(typeof surfaceNextSignatureMoment==='function')surfaceNextSignatureMoment()}
function projectSlateSmokeChecks(){
 const failures=[],required=[
  ['render',typeof render],['bind',typeof bind],['notificationOverlay',typeof notificationOverlay],['scheduleDraftSave',typeof scheduleDraftSave],['bootstrapLot',typeof bootstrapLot],['lotPairHistory',typeof lotPairHistory],['lotRegisterFilmOutcome',typeof lotRegisterFilmOutcome],['lotMaybeResurfacePairHistory',typeof lotMaybeResurfacePairHistory],['lotInfluenceApproachOffer',typeof lotInfluenceApproachOffer],['useLotInfluenceApproach',typeof useLotInfluenceApproach],['lotCampaignOpportunity',typeof lotCampaignOpportunity],['lotApplyCampaignAngle',typeof lotApplyCampaignAngle],['agencyInfluenceOffer',typeof agencyInfluenceOffer],['useAgencyInfluence',typeof useAgencyInfluence],['rivalDetenteOffer',typeof rivalDetenteOffer],['attemptRivalDetente',typeof attemptRivalDetente],['publishExecutiveIntel',typeof publishExecutiveIntel],['executiveFilmIntelRows',typeof executiveFilmIntelRows],['executiveFilmIntelHTML',typeof executiveFilmIntelHTML],['studioBusinessBody',typeof studioBusinessBody],['bootstrapNarrativeEngine',typeof bootstrapNarrativeEngine],['bootstrapTradePress',typeof bootstrapTradePress],['tradePressObserveNews',typeof tradePressObserveNews],['queueAITradeStory',typeof queueAITradeStory],['tradePressArticleStatusHTML',typeof tradePressArticleStatusHTML],['startLotPressCycle',typeof startLotPressCycle],['queueAILotPressCycle',typeof queueAILotPressCycle],['lotPressBundleHTML',typeof lotPressBundleHTML],['resolveScriptAuctionDeskItems',typeof resolveScriptAuctionDeskItems],['setAdditionalCastRole',typeof setAdditionalCastRole],['setAdditionalCastingTarget',typeof setAdditionalCastingTarget],['cameoActor',typeof cameoActor],['roleBillingLabel',typeof roleBillingLabel],['billingRoleMultiplier',typeof billingRoleMultiplier],['roleContractMultiplier',typeof roleContractMultiplier],['studioOperationsBody',typeof studioOperationsBody],['pulseStoryHTML',typeof pulseStoryHTML],['lotPressPulseStoryHTML',typeof lotPressPulseStoryHTML],['aiIndustrySupplyPressure',typeof aiIndustrySupplyPressure],['rivalStrategyShift',typeof rivalStrategyShift],['recordFilmNarrativeFact',typeof recordFilmNarrativeFact],['narrativeFilmFacts',typeof narrativeFilmFacts],['narrativeFilmReviewPacket',typeof narrativeFilmReviewPacket],['queueAIReview',typeof queueAIReview],['reviewDisplayContent',typeof reviewDisplayContent],['reviewRevealScreen',typeof reviewRevealScreen],['queueReviewReveal',typeof queueReviewReveal],['surfacePendingReviewReveal',typeof surfacePendingReviewReveal],['closeReviewReveal',typeof closeReviewReveal],['narrativeSettingsHTML',typeof narrativeSettingsHTML],['setNarrativeEndpointValue',typeof setNarrativeEndpointValue],['testNarrativeConnection',typeof testNarrativeConnection],['finalizeStoredCareerLoad',typeof finalizeStoredCareerLoad],['bootstrapPersistentStorage',typeof bootstrapPersistentStorage],['exportCareerBackup',typeof exportCareerBackup],['importCareerBackupFile',typeof importCareerBackupFile],['persistenceStatus',typeof persistenceStatus],
  ['surfacePendingFilmWrap',typeof surfacePendingFilmWrap],['surfacePendingLegendUnlock',typeof surfacePendingLegendUnlock],['enforceActiveSignatureRoute',typeof enforceActiveSignatureRoute],['ensureProductionCreativeFork',typeof ensureProductionCreativeFork],['agencyMarketLeverage',typeof agencyMarketLeverage],['agencyPackagePitchCandidate',typeof agencyPackagePitchCandidate],['agencyContractMultiplier',typeof agencyContractMultiplier],['executivePersonaSnapshot',typeof executivePersonaSnapshot],['industryMoodSnapshot',typeof industryMoodSnapshot],['recordPressInteraction',typeof recordPressInteraction],['pressRoomSnapshot',typeof pressRoomSnapshot],['rivalrySnapshot',typeof rivalrySnapshot],['recordRivalryEvent',typeof recordRivalryEvent],['rivalryProfileHTML',typeof rivalryProfileHTML],['ensureFilmIdentity',typeof ensureFilmIdentity],['productionEventFlavor',typeof productionEventFlavor],['filmPressAngle',typeof filmPressAngle],['premiseReviewParagraph',typeof premiseReviewParagraph],['dailyScreenCritic',typeof dailyScreenCritic],['criticOpeningParagraph',typeof criticOpeningParagraph],['capsuleOutletLine',typeof capsuleOutletLine],['publishStudioMomentAftermath',typeof publishStudioMomentAftermath],['rivalSignature',typeof rivalSignature],['alignActiveTabs',typeof alignActiveTabs]
 ];
 required.forEach(([name,type])=>{if(type!=='function')failures.push(name+' missing')});
 if(!app)failures.push('#app missing');
 if(typeof rivalSignatureIdentity!=='undefined')failures.push('stale rivalSignatureIdentity symbol present');
 try{if(pickerControls('Actor').includes('Project fit'))failures.push('actor fit sort leaked');if(soundtrackShortlistSize()<5)failures.push('music shortlist too small');const qs=(state.talent||[]).filter(t=>t.type==='Actor').map(t=>{ensureTalentMarketEconomy(t);return t.fee});if(qs.length&&Math.max(...qs)<7)failures.push('actor salary range compressed');if(qs.length&&Math.min(...qs)>3.2)failures.push('low-cost actor market missing')}catch(e){failures.push('casting economy smoke failed')}
 try{if(AGENCIES.length<4)failures.push('agency roster missing');const t=(state.talent||[]).find(x=>!x.retired);if(t){const x=agencyMarketLeverage(t);if(!Number.isFinite(x.pressure)||!x.label||!x.relationship)failures.push('agency leverage invalid')}}catch(e){failures.push('agency depth smoke failed')}
 try{const e=executivePersonaSnapshot(),m=industryMoodSnapshot();if(!e.primary?.label||e.signals.length<6)failures.push('executive persona invalid');if(!m.label||!m.financing||!m.talent)failures.push('industry mood invalid');if(Object.keys(PRESS_PERSONALITIES).length<5)failures.push('press personality roster incomplete')}catch(e){failures.push('v3.12 systems smoke failed')}
 try{if(queueStudioMoment.toString().includes('campaignMomentDeskEntry(f,type'))failures.push('campaign moments still duplicated to Desk');if(!resolveOpportunityDeskChoice.toString().includes("templateId==='rights-offer'"))failures.push('actionable rights flow missing')}catch(e){failures.push('v3.12.1 polish smoke failed')}
 try{
  const rv=(state.rivals||[])[0];
  if(state.studio&&rv){const x=rivalrySnapshot(rv);if(!x.label||!Array.isArray(x.events))failures.push('rivalry snapshot invalid')}
  else if(!rivalrySnapshot.toString().includes('Normal competition')||!rivalryProfileHTML.toString().includes('Competitive history'))failures.push('rivalry implementation invalid on setup');
  if(!nav.toString().includes('globalBackToTop'))failures.push('global back-to-top missing');
 }catch(e){failures.push('v3.13 systems smoke failed'+(e?.message?': '+e.message:''))}
 try{const f=(state.films||[]).find(x=>x.owner==='player');if(f){const id=ensureFilmIdentity(f);if(!id?.archetype||!id?.texture)failures.push('film identity invalid')}if(makeReview.toString().includes('Strong moments, mixed results'))failures.push('legacy repetitive review generator active');if(soundtrackOffers.toString().indexOf('usedTracks')<0)failures.push('music freshness missing')}catch(e){failures.push('v3.14 variation smoke failed')}
 try{
  const lot=ensureLotState();if((lot.version||0)<5||!lot.pairHistories||!Array.isArray(lot.incidentHistory)||!lot.variety)failures.push('Lot incident/variety migration missing');
  const t=(state.talent||[]).filter(x=>!x.retired).slice(0,2);if(t.length===2){const h=lotPairHistory(t[0],t[1]);if(!h||!Array.isArray(h.films)||!Array.isArray(h.storyIds))failures.push('Lot pair history invalid')}
   if(!Array.isArray(LOT_INCIDENT_LIBRARY)||LOT_INCIDENT_LIBRARY.length<30)failures.push('Lot incident library too small');
   const dog=LOT_INCIDENT_LIBRARY.find(x=>x.id==='doggate'),parking=LOT_INCIDENT_LIBRARY.find(x=>x.id==='parking-war');
   if(!dog?.unique)failures.push('DOGGATE must remain career-unique');
   if((parking?.cooldown||0)<104)failures.push('parking-war cooldown too short');
 }catch(e){failures.push('v4.2 Lot long-memory smoke failed'+(e?.message?': '+e.message:''))}
 try{
  if(!marketingUI.toString().includes('data-lot-campaign-angle'))failures.push('Lot campaign leverage UI missing');
  if(!talentInfluencePanel.toString().includes('data-agency-influence-talent'))failures.push('agency influence UI missing');
  if(!castingPicker.toString().includes('data-lot-influence-talent'))failures.push('casting personal-introduction UI missing');
  if(!rivalDetenteHTML.toString().includes('data-rival-detente'))failures.push('rival détente UI missing');
  if(!commitRelease.toString().includes('lotApplyCampaignAngle'))failures.push('Lot campaign leverage not applied at commit');
 }catch(e){failures.push('v4.3 Power & Influence smoke failed'+(e?.message?': '+e.message:''))}
 try{
  if(!recordTrackingSnapshot.toString().includes('publishExecutiveIntel'))failures.push('tracking intelligence publish missing');
  if(!releaseFilm.toString().includes("'reviews:'"))failures.push('review intelligence publish missing');
  if(!publishSettledOpeningNews.toString().includes("'opening:'"))failures.push('opening intelligence publish missing');
  if(!deskSignalScore.toString().includes('intel:78'))failures.push('executive intelligence signal priority missing');
  if(!studioScreen.toString().includes("['business','Business']"))failures.push('Studio Business consolidation missing');
 }catch(e){failures.push('v4.4 clarity smoke failed'+(e?.message?': '+e.message:''))}
 try{
  if(!releaseFilm.toString().includes('queueAIReview'))failures.push('AI review release hook missing');
  if(!reviewScreen.toString().includes('reviewDisplayContent'))failures.push('AI review UI integration missing');
  if(!reviewRevealScreen.toString().includes('THE REVIEWS ARE IN'))failures.push('AI review reveal missing');
  if(!narrativeFilmReviewPacket.toString().includes('fictionalUniverseNotice'))failures.push('Narrative packet fiction boundary missing');
  if(!studioBusinessBody.toString().includes("['narrative','Narrative']"))failures.push('Narrative Engine settings tab missing');
  if(!narrativeSettingsHTML.toString().includes('testNarrativeEndpoint'))failures.push('Narrative connection test UI missing');
 }catch(e){failures.push('v4.5a Narrative Engine smoke failed'+(e?.message?': '+e.message:''))}
 try{
  if(!finalizeStoredCareerLoad.toString().includes('migrateState'))failures.push('deferred career migration missing');
  if(!save.toString().includes("loadSource==='recovery'"))failures.push('recovery autosave guard missing');
  if(!save.toString().includes('SAVE_BACKUP_KEY'))failures.push('career backup write missing');
  if(!save.toString().includes('mirrorCareerToIndexedDB'))failures.push('IndexedDB mirror missing');
  if(!studioBusinessBody.toString().includes("['backup','Backup']"))failures.push('Career Backup UI missing');
 }catch(e){failures.push('v4.5b.1 persistence smoke failed'+(e?.message?': '+e.message:''))}

 try{
  if(typeof queueProjectIntelligence!=='function'||typeof projectIntelligenceHTML!=='function'||typeof projectIntelligenceCastContext!=='function')failures.push('Project Intelligence functions missing');
  if(typeof PROJECT_INTELLIGENCE_TEST_BYPASS==='undefined')failures.push('Project Intelligence QA bypass flag missing');
  const conceptAccess=developmentRouteAccess('concept');
  if(PROJECT_INTELLIGENCE_TEST_BYPASS&&!conceptAccess.naturallyUnlocked&&!conceptAccess.testingBypass)failures.push('Project Intelligence QA URL did not unlock test access');
  if(!PROJECT_INTELLIGENCE_TEST_BYPASS&&conceptAccess.testingBypass)failures.push('Project Intelligence test access leaked into normal play');
  if(!createOriginalConcept.toString().includes('queueProjectIntelligence'))failures.push('Project Intelligence original-concept hook missing');
  if(!scriptDetail.toString().includes('projectIntelligenceHTML'))failures.push('Project Intelligence screenplay UI missing');
  if(!castingPicker.toString().includes('projectIntelligenceCastSignal'))failures.push('Project Intelligence casting context missing');
  if(!narrativeFilmReviewPacket.toString().includes('projectContext'))failures.push('Project Intelligence not carried into review packet');
  if(typeof lotNoveltyBrief!=='function'||!lotChooseIncident.toString().includes('settingPenalty')||!lotChooseIncident.toString().includes('shapePenalty'))failures.push('Lot narrative variety weighting missing');
  if(!lotNoveltyBrief.toString().includes('avoidTopics'))failures.push('Lot novelty brief incomplete');
 }catch(e){failures.push('v4.6 Project Intelligence / variety smoke failed'+(e?.message?': '+e.message:''))}

 try{
  const requiredGenres=['Action Comedy','Mystery Thriller','Supernatural Horror','Sports Drama','Romantic Comedy','Superhero','Adventure','Historical Epic'];
  if(genres.length<16||requiredGenres.some(g=>!genres.includes(g)))failures.push('v4.6.2 expanded genre taxonomy missing');
  if(genreProfileAffinity(['Action Thriller','Comedy'],'Action Comedy')<.90)failures.push('v4.6.2 hybrid genre affinity too weak');
  if(!ROLE_ARCHETYPES['Action Comedy']||!SCRIPT_TITLE_BANK['Action Comedy']||!PREMISE_DNA_BANK['Action Comedy'])failures.push('v4.6.2 Action Comedy systems incomplete');
  const gp=generatedPremise(state,makeRng(462),'Action Comedy');if(!gp?.title||!gp?.logline)failures.push('v4.6.2 Action Comedy premise generation failed');
  if(actorSeed.length<118||!actorSeed.some(x=>x[0]==='Jackie Chan')||!actorSeed.some(x=>x[0]==='Chris Tucker'))failures.push('v4.6.2 actor expansion missing');
  if(directorSeed.length<35)failures.push('v4.6.2 director expansion missing');
  if(PORTRAIT_WIKIPEDIA_TITLES['Andrew Scott']!=='Andrew Scott (actor)')failures.push('v4.6.2 Andrew Scott portrait alias missing');
  if(SAVE_SCHEMA_VERSION<404)failures.push('v4.6.2 save migration missing');
 }catch(e){failures.push('v4.6.2 talent / genre expansion smoke failed'+(e?.message?': '+e.message:''))}
 try{
  if(!releaseFilm.toString().includes('queueReviewReveal'))failures.push('v4.6.3 simulation-owned review reveal hook missing');
  if(queueReviewReveal.toString().includes('aiReviewContent(f)'))failures.push('v4.6.3 review reveal still depends on AI');
  if(!surfacePendingReviewReveal.toString().includes("displayMode=aiReviewContent(f)?'ai':'waiting'"))failures.push('v4.6.3 pending reveal fallback path missing');
  if(narrativeReviewStatusHTML.toString().includes('Generate AI review')||narrativeReviewStatusHTML.toString().includes('Retry AI review')||narrativeReviewStatusHTML.toString().includes('Rewrite review'))failures.push('v4.6.3 manual AI review controls still exposed');
  if(!requestNarrative.toString().includes('NARRATIVE_REQUEST_TIMEOUT_MS')||!requestNarrative.toString().includes('narrativeErrorRetryable'))failures.push('v4.6.3 Narrative request recovery missing');
  if(!bootstrapNarrativeEngine.toString().includes('resumeNarrativeWork')||!bindNarrativeLifecycle.toString().includes("addEventListener('online'"))failures.push('v4.6.3 Narrative lifecycle recovery missing');
  if(!narrativeSettingsHTML.toString().includes('AUTOMATIC'))failures.push('v4.6.3 automatic Narrative status UI missing');
 }catch(e){failures.push('v4.6.3 Narrative reliability smoke failed'+(e?.message?': '+e.message:''))}

 try{
  if(NARRATIVE_REQUEST_TIMEOUT_MS>=60000)failures.push('v4.6.4 Narrative timeout exceeds server ceiling');
  if(!surfaceCalendarInterrupt.toString().includes('surfaceNextSignatureMoment'))failures.push('v4.6.4 calendar still has a separate signature priority path');
  if(!render.toString().includes('surfaceNextSignatureMoment'))failures.push('v4.6.4 render still has a separate signature priority path');
  if(!studioOperationsBody.toString().includes('careerArcCard'))failures.push('v4.6.4 Career Form missing from consolidated Operations');
  if(deskBriefingBody.toString().includes('careerArcCard'))failures.push('v4.6.4 Career Form still occupies Desk briefing');
  if(!deskBriefingBody.toString().includes('deskStudioStatusStrip')||!deskBriefingBody.toString().includes('deskScriptMarketPressureHTML'))failures.push('v4.6.4 compact Desk intelligence missing');
  if(!developmentUI.toString().includes('castingDealsHTML'))failures.push('v4.6.4 Casting / package status missing from film page');
  if(!recordProductionDaily.toString().includes('castingGamble'))failures.push('v4.6.4 untested casting callback missing');
  if(!soundtrackPostUI.toString().includes('There is no single correct music plan'))failures.push('v4.6.4 music trade-off explainer missing');
  if(soundtrackPostUI.toString().includes('Creative fit '))failures.push('v4.6.4 raw music fit grading still exposed');
 }catch(e){failures.push('v4.6.4 workflow clarity smoke failed'+(e?.message?': '+e.message:''))}

 try{
  if(!surfacePendingReviewReveal.toString().includes("displayMode='local'"))failures.push('v4.10.2 review reveal is not local-first');
  if(reviewDisplayContent.toString().includes('aiReviewContent'))failures.push('v4.10.2 review display still prefers AI copy');
  if(!queueAIReview.toString().includes("status:'disabled'"))failures.push('v4.10.2 AI review requests are still active');
  if(!reviewRevealScreen.toString().includes('reviewRevealLocalContent'))failures.push('v4.10.2 review reveal is not using Daily Screen copy');
  if(!closeReviewReveal.toString().includes('clearReviewRevealTimer'))failures.push('v4.10.2 review reveal cleanup missing');
 }catch(e){failures.push('v4.10.2 local review reveal smoke failed'+(e?.message?': '+e.message:''))}

 try{
  if(SAVE_SCHEMA_VERSION<405)failures.push('v4.7 Trade Press save migration missing');
  if(typeof tradePressObserveNews!=='function'||typeof queueAITradeStory!=='function'||typeof tradePressImportance!=='function')failures.push('v4.7 Trade Press engine missing');
  if(!addNews.toString().includes('tradePressObserveNews'))failures.push('v4.7 news pipeline is not feeding Trade Press');
  if(!newsArticleScreen.toString().includes('tradePressArticleStatusHTML'))failures.push('v4.7 article Trade Press status missing');
  if(!industryScreen.toString().includes('tradePressCardBadge'))failures.push('v4.7 Industry Trade Press badges missing');
  if(!lotCampaignAngleCost.toString().includes('lotCampaignAngleTransaction')||!lotApplyCampaignAngle.toString().includes('lotCampaignAngleTransaction'))failures.push('v4.7 Lot campaign transaction still split across unrelated logic');
  if(TRADE_PRESS_AI_THRESHOLD<72||TRADE_PRESS_AI_THRESHOLD>90)failures.push('v4.7 Trade Press AI threshold outside intended editorial range');
 }catch(e){failures.push('v4.7 Trade Press smoke failed'+(e?.message?': '+e.message:''))}

 try{
  if(SAVE_SCHEMA_VERSION<406)failures.push('v4.7.1 save migration missing');
  if(typeof castingDealsHTML!=='function'||!developmentUI.toString().includes('castingDealsHTML'))failures.push('v4.7.1 consolidated Casting & Deals missing');
  if(pickerControls.toString().includes('pickerFit')||pickerList.toString().includes("sort==='fit'")||pickerList.toString().includes("sort==='fee'"))failures.push('v4.7.1 casting still exposes solved-fit / cheapest-first sorting');
  if(typeof talentFeeRange!=='function'||typeof castingScoutSignal!=='function')failures.push('v4.7.1 uncertain scouting layer missing');
  if(typeof contractBackendDiscount!=='function'||typeof contractQuote!=='function'||!contractsScreen.toString().includes('data-contract-backend')||!contractsScreen.toString().includes('Guaranteed return'))failures.push('v4.7.1 negotiated contract builder incomplete');
  if(!createPlayerFilmFromOwnedScript.toString().includes('sequelGuarantees')||!createPlayerFilmFromOwnedScript.toString().includes('guaranteed-return'))failures.push('v4.7.1 guaranteed sequel return inheritance missing');
  if(topAdvanceControl.toString().includes('globalAdvanceNextEvent')||topAdvanceControl.toString().includes('globalAdvanceNextDecision')||!topAdvanceControl.toString().includes('globalAdvanceWeek'))failures.push('v4.7.1 single Continue control missing');
  if(typeof surfaceInteractiveDeskInterrupt!=='function'||!continueTime.toString().includes('surfaceInteractiveDeskInterrupt'))failures.push('v4.7.1 Continue does not stop for interactive Desk items');
  if(!deskSubnav.toString().includes("'briefing'")||deskSubnav.toString().includes("'digest'"))failures.push('v4.7.1 Desk still exposes duplicate Digest');
  if(!deskBriefingBody.toString().includes('Needs attention')||!deskBriefingBody.toString().includes('Briefing'))failures.push('v4.7.1 unified Desk inbox missing');
  if(!screenplayMarketCapacity.toString().includes('[5,6,8]'))failures.push('v4.7.1 screenplay market capacity not tightened');
  if(!rotateMarket.toString().includes('lastRotation<3')||!ensureScriptMarketState.toString().includes('7+Math.floor(r()*4)'))failures.push('v4.7.1 screenplay market cadence not tightened');
  if(aiStartProjects.toString().includes('2.6+r()*1.5')||aiStartProjects.toString().includes('Math.min(budget,4.0)'))failures.push('v4.7.1 cheap turnaround production-scale bug remains');
 }catch(e){failures.push('v4.7.1 Friction & Flow smoke failed'+(e?.message?': '+e.message:''))}

 try{
  if(SAVE_SCHEMA_VERSION<407)failures.push('v4.7.2 save migration missing');
  if(!continueTime.toString().includes('released&&surfaceCalendarInterrupt'))failures.push('v4.7.2 release-day review interrupt missing');
  if(contractQuote.toString().includes('upfront*=1.06')||contractQuote.toString().includes('upfront*=1.12')||!contractQuote.toString().includes('upfront*=.95')||!contractQuote.toString().includes('upfront*=.88'))failures.push('v4.7.2 sequel-term economics not reversed');
  if(!deskBriefingBody.toString().includes('unreadBriefing')||!deskBriefingBody.toString().includes('Chronological studio feed'))failures.push('v4.7.2 chronological Desk briefing missing');
  if(deskSubnav.toString().includes('Active Stories')||!deskSubnav.toString().includes("['pulse'")||!deskPulseBody.toString().includes('activeCareerThreads'))failures.push('v4.7.2 story surface not migrated into Pulse');
  if(!industryScreen.toString().includes('latestNews')||!industryScreen.toString().includes('Featured now'))failures.push('v4.7.2 newest-first News flow missing');
  if(!toggleProjectHold.toString().includes('heldFor>=8'))failures.push('v4.7.2 hold-news suppression missing');
  if(typeof lotMaybeTalentCrisis!=='function'||typeof lotResolveTalentCrisisDeskChoice!=='function'||!processLotWeek.toString().includes('lotMaybeTalentCrisis'))failures.push('v4.7.2 talent crisis engine missing');
  if(!filmWrapProductionMoment.toString().includes('talentCrises')||!narrativeFilmReviewPacket.toString().includes('talentCrises'))failures.push('v4.7.2 crisis narrative memory missing');
  if(!narrativeFilmReviewPacket.toString().includes('narrativeReviewHistoryLine'))failures.push('v4.7.2 review history sanitiser missing');
 }catch(e){failures.push('v4.7.2 Narrative & Flow smoke failed'+(e?.message?': '+e.message:''))}

 try{
  if(SAVE_SCHEMA_VERSION<408)failures.push('v4.8 save migration missing');
  const lot48=ensureLotState();if((lot48.version||0)<7||!Array.isArray(lot48.pressCycles))failures.push('v4.8 Lot Press state missing');
  if(!lotApplyIncident.toString().includes('startLotPressCycle')||!lotEvolveActiveStories.toString().includes('startLotPressCycle')||!lotMaybeResurfacePairHistory.toString().includes('startLotPressCycle'))failures.push('v4.8 Lot story press hooks missing');
  if(!startLotPressCycle.toString().includes("skipTradePress:true")||!queueAILotPressCycle.toString().includes("'lot_press_bundle'"))failures.push('v4.8 connected press bundle pipeline missing');
  if(!newsArticleScreen.toString().includes('lotPressBundleHTML')||!industryScreen.toString().includes('lotPressCardBadge')||!deskThreadHTML.toString().includes('lotPressThreadAddon'))failures.push('v4.8 press ecosystem UI integration missing');
  if(!sellScreenplayToRival.toString().includes('resolveScriptAuctionDeskItems')||!syncOperationalDeskItems.toString().includes("templateId==='script-auction'")||!nextInteractiveDeskItem.toString().includes('syncOperationalDeskItems'))failures.push('v4.8 stale screenplay-auction repair missing');
  if(!addNews.toString().includes('skipTradePress'))failures.push('v4.8 dedicated press-cycle news bypass missing');
  if(!addSocialFeed.toString().includes('...(meta||{})'))failures.push('v4.8 Pulse press-cycle identity missing');
 }catch(e){failures.push('v4.8 Lot Press / Desk lifecycle smoke failed'+(e?.message?': '+e.message:''))}

 try{
  if(SAVE_SCHEMA_VERSION<409)failures.push('v4.9 save migration missing');
  const p49=generatedPremise(state,makeRng(4909),'Comedy');if(!['male','female'].includes(p49?.premiseDNA?.leadGender))failures.push('v4.9 generated screenplay lead gender missing');
  const film49=(state.films||[]).find(x=>x.owner==='player');if(film49){const roles49=ensureFilmRoles(film49);if(roles49.length<5||!roles49.some(r=>r.id==='cameo')||roles49.find(r=>r.id==='lead2')?.billing!=='supporting')failures.push('v4.9 film billing role model missing')}
  if(!pickerList.toString().includes("role?.id==='lead1'")||!pickerList.toString().includes('castingLane'))failures.push('v4.9 screenplay lead casting filter missing');
  if(requiredSupportingRoles()!==0||maxSupportingRoles()!==2)failures.push('v4.9 optional Also Starring package invalid');
  if(!supportingCastingPicker.toString().includes('Cameo')||!supportingCastingPicker.toString().includes('data-additional-role-target'))failures.push('v4.9 additional cast picker missing');
  if(!contractQuote.toString().includes('roleContractMultiplier')||billingRoleMultiplier({billing:'supporting'})!==.82||billingRoleMultiplier({billing:'also-starring'})!==.58||billingRoleMultiplier({billing:'cameo'})!==.25||roleContractMultiplier({roleAssignments:{}},{type:'Director'})!==1)failures.push('v4.9 role billing contract economics missing');
  if(narrativeTalentSummary.toString().includes('lotPersona')||lotPressPacket.toString().includes('persona'))failures.push('v4.9 private Lot personality labels still leak to narrative packets');
  if(!newsArticleScreen.toString().includes('lotPressBundleHTML'))failures.push('v4.9 Lot Press article surface regressed');
  if(!awardLeadTalent.toString().includes('lead1')||!awardSupportingTalent.toString().includes('lead2'))failures.push('v4.9 awards billing alignment missing');
 }catch(e){failures.push('v4.9 Casting Package / Narrative Hardening smoke failed'+(e?.message?': '+e.message:''))}

 try{
  if(SAVE_SCHEMA_VERSION<410)failures.push('v4.10 save migration missing');
  if(!studioBusinessBody.toString().includes("['operations','Operations']")||studioBusinessBody.toString().includes("['growth','Growth']"))failures.push('v4.10 Operations consolidation missing');
  if(!studioOperationsBody.toString().includes('Departments')||!studioOperationsBody.toString().includes('Capital allocation')&&!studioOperationsBody.toString().includes('capitalAllocationPanel')||!studioOperationsBody.toString().includes('Treasury'))failures.push('v4.10 Operations content incomplete');
  if(deskSubnav.toString().includes('Active Stories')||!deskSubnav.toString().includes("['pulse'"))failures.push('v4.10 Pulse navigation consolidation missing');
  if(!deskPulseBody.toString().includes('In the conversation')||!deskPulseBody.toString().includes('activeCareerThreads'))failures.push('v4.10 Pulse live-story hub missing');
  if(!lotPressPulseStoryHTML.toString().includes('GOSSIP')||!lotPressPulseStoryHTML.toString().includes('REPRESENTATIVES')||!lotPressPulseStoryHTML.toString().includes('RIVAL ROOM')||!lotPressPulseStoryHTML.toString().includes('THE CROWD'))failures.push('v4.10 connected press bundle not surfaced in Pulse');
  const supply10=aiIndustrySupplyPressure();if(!Number.isFinite(supply10.pressure)||supply10.pressure<0||supply10.pressure>1)failures.push('v4.10 rival supply pressure invalid');
  if(aiStartProjects.toString().includes('pivoting to a lower-cost')||!aiStartProjects.toString().includes('rivalStrategyShift')||!aiStartProjects.toString().includes('supply.pressure'))failures.push('v4.10 rival pipeline / pivot consolidation missing');
  if(rivalCurrentIntent.toString().includes('Reset with discipline'))failures.push('v4.10 repetitive rival intent survived');
  if(!aiFinanceProject.toString().includes('supply.pressure')||!aiWeeklyFinance.toString().includes('lastIndustryRecapitalizationWeek'))failures.push('v4.10 rival economy safeguards missing');
  if(!narrativeFilmReviewPacket.toString().includes('narrativeFacts:narrativeFilmFacts')||narrativeFilmReviewPacket.toString().includes('selectedHistory:')||!narrativeFilmReviewPacket.toString().includes("mood!=='decision'"))failures.push('v4.10 review packet still exposes raw player choices');
  if(!narrativeFilmReviewPacket.toString().includes("creativeDirection:f.creativeDirection?.outcome"))failures.push('v4.10 creative-direction consequence translation missing');
 }catch(e){failures.push('v4.10 Studio & Industry Consolidation smoke failed'+(e?.message?': '+e.message:''))}

 try{
  if(!activeCareerThreads.toString().includes('careerThreadUpdateStamp'))failures.push('v4.10.2 Pulse stories are not date ordered');
  if(!upsertCareerThread.toString().includes("meaningful=['type','tone','title','summary','detail'"))failures.push('v4.10.2 story timestamps still refresh without a real development');
  if(!deskPulseBody.toString().includes('In cinemas now')||!deskPulseBody.toString().includes('newest developments first'))failures.push('v4.10.2 Pulse release/story ordering missing');
  if(criticClosingParagraph.toString().includes('creativeDirection?.label')||criticCraftParagraph.toString().includes('filmChoiceCallback'))failures.push('v4.10.2 Daily Screen still exposes player decision labels');
  if(!narrativeSettingsHTML.toString().includes('Film reviews now stay with the deterministic Daily Screen critic system'))failures.push('v4.10.2 Narrative settings still describe AI reviews');
 }catch(e){failures.push('v4.10.2 Review & Pulse ordering smoke failed'+(e?.message?': '+e.message:''))}

 try{const r=makeRng(3141),p=generatedPremise(state,r,'Action Thriller');if(!p.premiseDNA?.name||!p.logline.includes(p.premiseDNA.name))failures.push('premise DNA generation invalid');if(!makeReviewRoundup.toString().includes('headline:capsuleOutletLine'))failures.push('personality capsules missing');if(!makeReview.toString().includes('criticOpeningParagraph'))failures.push('personality main review missing');if(launchLateGameChallenger.toString().indexOf('addNews(state')>=0)failures.push('Apex news still publishes before reveal')}catch(e){failures.push('v3.14.2 critic personality smoke failed')}
 try{
  if(!buildNewsItem.toString().includes('voicePressStory'))failures.push('press voice pass missing');
  if(!queueStudioMoment.toString().includes('campaignSocialChatter'))failures.push('campaign social voice missing');
  if(!organicSocialSignal.toString().includes('alarming commitment'))failures.push('Pulse voice bank missing');
  if(!pushDeskItem.toString().includes('lotDeskVoice'))failures.push('Desk voice pass missing');
  if(!filmWrapTradeVerdict.toString().includes('filmWrapVoicePolish'))failures.push('Wrap voice pass missing');
 }catch(e){failures.push('v3.14.3 voice smoke failed')}
 try{
  const a=simulationAuditSnapshot(state,false);if(!a.player||!a.talent||!a.rivalSummary||!a.releases)failures.push('audit snapshot incomplete');
  if(recordSimulationAudit.toString().indexOf('slice(-156)')<0)failures.push('audit weekly retention missing');
  if(simulationAuditReport.toString().indexOf('quarterlySamples')<0)failures.push('audit report incomplete');
  if(!window.ProjectSlate?.audit)failures.push('audit API missing');
  if(typeof runSimulationBenchmarkSuite!=='function'||typeof simulationAuditFilmLedger!=='function')failures.push('benchmark audit functions missing');
  if(!advanceAI.toString().includes('aiFinishingCost'))failures.push('AI finishing parity missing');
  if(!aiFundRelease.toString().includes('aiPublicityCost'))failures.push('AI publicity parity missing');
  if(!releaseAIFilm.toString().includes('releaseWindowOpeningModifier'))failures.push('AI release-window parity missing');
  if(!aiWeeklyFinance.toString().includes('aiCatalogueWeeklyRevenue'))failures.push('AI catalogue parity missing');
  if(!aiCatalogueWeeklyRevenue.toString().includes('aiLegacyCatalogueWeeklyRevenue'))failures.push('AI legacy catalogue seed missing');
  if(!aiWeeklyFinance.toString().includes('rv.debt*.0025'))failures.push('AI finance-rate normalization missing');
  if(typeof aiFinanceProject!=='function'||!aiFinanceProject.toString().includes('draw*1.05'))failures.push('AI project-finance premium normalization missing');
  if(!releaseOutcomeProfile.toString().includes('frontloadChance'))failures.push('release profile variance pass missing');
 }catch(e){failures.push('v4.0a simulation audit smoke failed'+(e?.message?': '+e.message:''))}
 try{
  const probe={scripts:[]},r=makeRng(hash('v3.9.7-title-smoke'));for(let i=0;i<32;i++){const genre=genres[i%genres.length],title=uniqueScriptTitle(probe,r,genre);probe.scripts.push({title})}
  const unique=new Set(probe.scripts.map(x=>x.title.toLowerCase())).size,quantified=probe.scripts.filter(x=>/^(No One|Nobody|Someone|Everyone)\b/i.test(x.title)).length;
  if(unique<28)failures.push('title diversity regression');
  if(quantified>1)failures.push('repetitive quantifier titles');
 }catch(e){failures.push('title generator smoke failed')}
 try{
  const probe={desk:{items:[{id:1},{id:1},{id:null}],archive:[{id:'2'}],nextId:1},notifications:[]};normalizeDeskIds(probe);
  const ids=[...probe.desk.items,...probe.desk.archive].map(x=>x.id);
  if(new Set(ids).size!==ids.length||ids.some(x=>!Number.isInteger(x)||x<1)||probe.desk.nextId<=Math.max(...ids))failures.push('desk id repair regression');
 }catch(e){failures.push('desk id smoke failed')}
 return {ok:failures.length===0,version:VERSION,failures};
}
function projectSlateBootFailure(check,error){
 const details=[...(check?.failures||[]),error?.message||''].filter(Boolean);
 app.innerHTML=`<main class="screen"><div class="card dangerline"><div class="badge">PROJECT SLATE · BUILD ${VERSION}</div><h2 style="margin:8px 0">The build could not start.</h2><div class="body">A boot check caught the problem before the app fell to a blank screen.</div><div class="small" style="margin-top:10px">${details.join(' · ')||'Unknown boot error'}</div></div></main>`;
}
window.ProjectSlate={reset:resetGame,state:()=>deep(state),smokeTest:projectSlateSmokeChecks,audit:()=>simulationAuditReport(),auditJSON:()=>JSON.stringify(simulationAuditReport(),null,2),captureAudit:()=>{const x=recordSimulationAudit('manual');save();return x},openAudit:()=>{localStorage.setItem('projectSlateAuditMode','1');state.screen='studio';state.detail=null;state.uiStudioTab='audit';save();render()},closeAudit:()=>{localStorage.removeItem('projectSlateAuditMode');if(state.uiStudioTab==='audit')state.uiStudioTab='desk';save();render()},exportAudit:simulationAuditExport,runBenchmark:runSimulationBenchmarkSuite,narrativeStatus:()=>({endpoint:narrativeEndpoint(),connection:narrativeRuntime.connection,pending:[...narrativeRuntime.pending.keys()],lastError:narrativeRuntime.lastError}),setNarrativeEndpoint:setNarrativeEndpointValue,testNarrativeConnection};
if(state.screen!=='setup'&&typeof surfaceNextSignatureMoment==='function')surfaceNextSignatureMoment();
const bootCheck=projectSlateSmokeChecks();
if(persistenceRuntime.recoveryRaw)projectSlateRecoveryScreen();else if(!bootCheck.ok)projectSlateBootFailure(bootCheck);else{try{render()}catch(e){console.error(e);projectSlateBootFailure(bootCheck,e)}}
