// Route renderer and initial boot

let lastPremiumRouteKey=null;
function premiumRouteKey(){
 if(state.detail)return `detail:${state.detail.type}:${state.detail.id||state.detail.mode||''}`;
 let sub='';
 if(state.screen==='studio')sub=`:${state.uiStudioTab||'desk'}:${state.uiDeskTab||''}:${state.uiLegacyTab||''}`;
 else if(state.screen==='slate'||state.screen==='films')sub=`:${state.uiSlateTab||'pipeline'}`;
 else if(state.screen==='release'||state.screen==='box')sub=`:${state.uiReleaseTab||'box'}`;
 else if(state.screen==='industry')sub=`:${state.industryTab||'news'}`;
 else if(state.screen==='develop'||state.screen==='scripts')sub=`:${state.uiScriptTab||'market'}`;
 return `screen:${state.screen}${sub}`;
}
function renderMotionClass(next,prev){
 if(!prev)return 'route-enter-first';
 if(prev===next)return '';
 if(/^screen:(filmWrap|legendUnlock|studioMoment|nominations|ceremony)/.test(next))return 'route-enter-signature';
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
 if(['filmWrap','legendUnlock','studioMoment','nominations','ceremony'].includes(state.screen))return 'route-signature';
 if(state.detail)return 'route-detail';
 return `route-${state.screen||'industry'}`;
}

function render(){
 if(state.studio&&typeof ensureCalendarState==='function')ensureCalendarState();
 if(state.screen!=='setup')enforceActiveSignatureRoute();
 if(state.detail?.type==='greenlightReview'){
  const gf=filmById(state.detail.id);
  if(gf&&gf.stage!=='development'){
   if(state.history?.at(-1)?.detail?.type==='film'&&state.history.at(-1).detail.id===gf.id)state.history.pop();
   state.screen='slate';state.detail={type:'film',id:gf.id};requestScrollTop();
  }
 }
 if(!state.studio&&state.screen!=='setup')state.screen='setup';
 if(state.screen!=='setup'&&!state.pendingCeremony&&!state.pendingAwardsNominations&&!state.activeFilmWrapId&&!state.activeStudioMoment&&!state.activeLegendUnlockId&&state.legends?.pending?.length)surfacePendingLegendUnlock();
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
 app.className=state.screen==='setup'?'app-setup':(['filmWrap','legendUnlock','studioMoment','nominations','ceremony'].includes(state.screen)?'app-signature':'');
 app.innerHTML=`<div class="route-frame ${family} ${motion}">${html}</div>`+notificationOverlay();
 applyPlayerBrandTheme();
 if(state.screen==='setup'){
  const studioName=document.getElementById('studioName');
  if(studioName)studioName.oninput=e=>{state.uiStudioNameDraft=e.target.value;const word=document.querySelector('.brand-preview .studio-wordmark');if(word)word.textContent=e.target.value.trim()||'Your Studio'};
  bindBrandControls();
  document.querySelectorAll('[data-difficulty]').forEach(b=>b.onclick=()=>{state.uiDifficultyDraft=b.dataset.difficulty;save();render()});
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
if(state&&state.films){playerFilms().filter(f=>f.stage==='complete').forEach(f=>{ensureAfterlifeState(f);refreshAfterlifeValuation(f);const l=ensureLegacyState(f);if(!l.built)buildFilmLegacy(f,{})})}
// Run retroactive lifecycle checks only after every module-level const/table has initialized.
// This is essential for existing-career reloads: bootstrapStudioMilestones reads STUDIO_MILESTONES.
if(state.studio&&state.careerStarted){bootstrapStudioMilestones();const __audit=ensureSimulationAudit();if(!__audit.weekly.length)recordSimulationAudit('baseline');}
if(state?.talent)state.talent.forEach(ensureTalentMarketEconomy);
if(state.screen!=='setup'){checkLegendsArchive(true);if(!state.pendingCeremony&&!state.pendingAwardsNominations&&!state.activeFilmWrapId&&!state.activeStudioMoment&&!state.activeLegendUnlockId&&state.legends?.pending?.length)surfacePendingLegendUnlock()}
function projectSlateSmokeChecks(){
 const failures=[],required=[
  ['render',typeof render],['bind',typeof bind],['notificationOverlay',typeof notificationOverlay],['scheduleDraftSave',typeof scheduleDraftSave],
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
window.ProjectSlate={reset:resetGame,state:()=>deep(state),smokeTest:projectSlateSmokeChecks,audit:()=>simulationAuditReport(),auditJSON:()=>JSON.stringify(simulationAuditReport(),null,2),captureAudit:()=>{const x=recordSimulationAudit('manual');save();return x},openAudit:()=>{localStorage.setItem('projectSlateAuditMode','1');state.screen='studio';state.detail=null;state.uiStudioTab='audit';save();render()},closeAudit:()=>{localStorage.removeItem('projectSlateAuditMode');if(state.uiStudioTab==='audit')state.uiStudioTab='desk';save();render()},exportAudit:simulationAuditExport,runBenchmark:runSimulationBenchmarkSuite};
if(state.screen!=='setup')enforceActiveSignatureRoute();
if(state.screen!=='setup'&&!state.pendingCeremony&&!state.pendingAwardsNominations&&!state.activeFilmWrapId&&!state.activeStudioMoment&&!state.activeLegendUnlockId&&state.studioMomentQueue?.length)surfacePendingStudioMoment();
const bootCheck=projectSlateSmokeChecks();
if(!bootCheck.ok)projectSlateBootFailure(bootCheck);else{try{render()}catch(e){console.error(e);projectSlateBootFailure(bootCheck,e)}}
