// Persistent save normalization and schema migrations

const SAVE_SCHEMA_VERSION=403;
const DIFFICULTY_OPTIONS={
 easy:{id:'easy',label:'Easy',flavour:'Backed',cash:80,desc:'More room to learn the business, recover from misses and finance ambitious packages early.'},
 normal:{id:'normal',label:'Normal',flavour:'Independent',cash:40,desc:'The intended Project Slate balance: enough capital to build, not enough to ignore consequences.'},
 hard:{id:'hard',label:'Hard',flavour:'Scrappy',cash:20,desc:'A thin opening runway. Early acquisitions, overruns and one bad release can force hard financing choices.'}
};
function difficultyInfo(id=state?.difficulty||'normal'){return DIFFICULTY_OPTIONS[id]||DIFFICULTY_OPTIONS.normal}
function inferSaveSchema(version){
 const v=String(version||'');
 if(/^3\.4/.test(v))return 340;
 return 0;
}
function applySaveSchemaMigrations(x,fromVersion){
 let schema=Number.isFinite(x.saveSchema)?x.saveSchema:inferSaveSchema(fromVersion);
 // Older saves are first normalized by migrateState's compatibility layer.
 // v3.4 -> v3.4.1 formalises calendar fields and establishes a schema counter.
 if(schema<341){
  x.calendarDay=Number.isFinite(x.calendarDay)?x.calendarDay:Math.max(1,((x.week||1)-1)*7+1);
  x.lastWeeklyHeartbeatWeek=x.lastWeeklyHeartbeatWeek||x.week||1;
  schema=341;
 }
 if(schema<342){
  x.uiStudioNameDraft=x.uiStudioNameDraft||x.studio?.name||'';
  x.uiBrandDraft=normalizeBrand(x.uiBrandDraft,x.uiStudioNameDraft||x.studio?.name||'Studio');
  if(x.studio)x.studio.brand=normalizeBrand(x.studio.brand||x.uiBrandDraft,x.studio.name);
  schema=342;
 }
 if(schema<343){
  (x.films||[]).forEach(f=>{
   f.supportingCastIds=Array.isArray(f.supportingCastIds)?f.supportingCastIds.filter(Boolean):(f.supportingCastId?[f.supportingCastId]:[]);
   f.supportingCastId=f.supportingCastIds[0]||null;
   if(f.post&&f.post.selectedAction===undefined)f.post.selectedAction=null;
  });
  schema=343;
 }
 if(schema<344){
  (x.films||[]).forEach(f=>{
   f.roleAssignments=f.roleAssignments||{};
   if(f.cast?.[0]&&!f.roleAssignments.lead1)f.roleAssignments.lead1=f.cast[0];
   if(f.cast?.[1]&&!f.roleAssignments.lead2)f.roleAssignments.lead2=f.cast[1];
   (f.supportingCastIds||[]).forEach((id,i)=>{if(i<2&&!f.roleAssignments[`support${i+1}`])f.roleAssignments[`support${i+1}`]=id});
   f.castingTargetRole=f.castingTargetRole||'lead1';
   f.castingDeclines=f.castingDeclines||{};
   if(f.marketingState)f.marketingState.trackingHistory=f.marketingState.trackingHistory||[];
  });
  x.industryRipples=x.industryRipples||[];
  schema=344;
 }
 if(schema<345){
  x.studioMilestones=x.studioMilestones||{completed:{},history:[],lastCheckedWeek:0,initialized:false};if(x.studioMilestones.initialized===undefined)x.studioMilestones.initialized=false;
  (x.talent||[]).forEach(t=>{t.relationshipHistory=t.relationshipHistory||[]});
  schema=345;
 }
 if(schema<350){
  x.desk=x.desk||{items:[],archive:[],nextId:1,lastGeneratedWeek:0,seenIntro:false};
  x.desk.items=x.desk.items||[];x.desk.archive=x.desk.archive||[];x.desk.nextId=x.desk.nextId||1;x.desk.lastGeneratedWeek=x.desk.lastGeneratedWeek||0;
  x.pulse=x.pulse||{history:[],lastWeek:0};
  schema=350;
 }
 if(schema<351){
  x.desk=x.desk||{items:[],archive:[],nextId:1,lastGeneratedWeek:0,seenIntro:false};
  (x.desk.items||[]).forEach(i=>{if(i.expanded===undefined)i.expanded=!i.read});
  (x.films||[]).forEach(f=>{if(f.owner==='player'&&!f.socialPulse)f.socialPulse=null});
  x.pulse=x.pulse||{history:[],lastWeek:0};x.pulse.history=x.pulse.history||[];
  schema=351;
 }
 if(schema<352){
  x.desk=x.desk||{items:[],archive:[],nextId:1,lastGeneratedWeek:0,seenIntro:false};
  x.desk.lastDecisionGeneratedWeek=x.desk.lastDecisionGeneratedWeek||0;
  (x.films||[]).forEach(f=>{
   if(f.socialPulse){f.socialPulse.feed=f.socialPulse.feed||[]}
   if(f.marketingState)f.marketingState.deskMomentKeys=f.marketingState.deskMomentKeys||[];
  });
  schema=352;
 }
 if(schema<360){
  x.awardsNominationsArchive=x.awardsNominationsArchive||[];
  x.pendingAwardsNominations=x.pendingAwardsNominations||null;
  x.awardsCeremonyStep=Number.isFinite(x.awardsCeremonyStep)?x.awardsCeremonyStep:0;
  x.studioMilestones=x.studioMilestones||{completed:{},history:[],lastCheckedWeek:0,initialized:false};
  // Re-run the retroactive milestone import so careers upgrading from v3.5 can earn the expanded v3.6 set.
  x.studioMilestones.initialized=false;
  (x.films||[]).forEach(f=>{
   const a=f.afterlife;
   if(a){
    if(a.awardsPushLevel===undefined)a.awardsPushLevel=a.awardsPush?1:0;
    if(a.awardsPushBonus===undefined)a.awardsPushBonus=0;
   }
  });
  schema=360;
 }
 if(schema<362){
  x.legends=x.legends||{unlocked:{},history:[],pending:[],initialized:false};
  x.legends.unlocked=x.legends.unlocked||{};x.legends.history=x.legends.history||[];x.legends.pending=x.legends.pending||[];
  x.activeLegendUnlockId=x.activeLegendUnlockId||null;
  schema=362;
 }
 if(schema<363){
  x.uiLegacyTab=x.uiLegacyTab||(x.uiStudioTab==='milestones'?'milestones':x.uiStudioTab==='legends'?'legends':'overview');
  if(x.uiStudioTab==='milestones'||x.uiStudioTab==='legends')x.uiStudioTab='legacy';
  schema=363;
 }
 if(schema<364){
  x.careerThreads=x.careerThreads||{active:[],history:[],nextId:1,lastUpdatedWeek:0};
  x.pressMemory=x.pressMemory||{};
  x.fastForward=x.fastForward||{uses:0,lastFromDay:null,lastToDay:null};
  (x.rivals||[]).forEach(ensureRivalCharacter);
  schema=364;
 }
 if(schema<371){x.agencyWindows=x.agencyWindows||{};schema=371}
 if(schema<375){
  x.desk=x.desk||{items:[],archive:[],nextId:1,lastGeneratedWeek:0,seenIntro:false};x.desk.items=x.desk.items||[];x.desk.archive=x.desk.archive||[];x.desk.nextId=x.desk.nextId||1;
  (x.films||[]).forEach(f=>{if(f.post){f.post.firstDecisionMade=f.post.firstDecisionMade===true||(f.post.actions||[]).length>0;if(f.socialPulse){f.socialPulse.moves=f.socialPulse.moves||[]}}});
  // v3.7.5 retires Notifications as a second player-facing inbox. Existing unread notices
  // are carried into Studio Desk once, while underlying notification records remain for compatibility.
  (x.notifications||[]).forEach(n=>{
   if(n.read||n.destination?.deskId||x.desk.items.some(i=>i.notificationKey===n.key))return;
   const hard=/^(prod:|post:|marketing:)/.test(n.key||'');
   const item={id:x.desk.nextId++,week:n.week||x.week,day:n.day||null,read:false,expanded:hard,resolved:!hard,archived:false,urgency:n.type==='warning'?'urgent':'normal',type:'system',source:n.type==='milestone'?'Studio Legacy':n.type==='finance'?'Finance Office':'Studio Operations',choices:[],requiresAction:hard,headline:n.title,body:n.body,filmId:n.filmId||null,notificationKey:n.key,destination:n.destination||null,system:true};
   x.desk.items.unshift(item);n.deskId=item.id;
  });
  x.activeNotificationId=null;if(x.screen==='notifications'){x.screen='studio';x.detail=null;x.uiStudioTab='desk'};
  schema=375;
 }
 if(schema<376){
  x.difficulty=x.difficulty||'normal';x.uiDifficultyDraft=x.uiDifficultyDraft||x.difficulty||'normal';
  x.developmentUnlocks=x.developmentUnlocks||{commissionNotified:false,originalNotified:false};
  (x.films||[]).forEach(f=>{if(f.owner==='player'&&f.soundtrack===undefined)f.soundtrack=null;if(f.post){f.post.musicDraft=f.post.musicDraft||{strategy:'original',trackId:null}}});
  schema=376;
 }
 if(schema<380){
  x.screenplayEconomy=x.screenplayEconomy||{history:[],lastWeek:0,turnarounds:0,lastTurnaroundWeek:0};
  (x.scripts||[]).forEach(sc=>{if(sc&&sc.status==='market'&&sc.available&&sc.marketState===undefined)sc.marketState=null});
  schema=380;
 }
 if(schema<381){
  (x.films||[]).forEach(f=>{
   if(f.afterlife){
    f.afterlife.streaming=f.afterlife.streaming||{offers:[],activeDeal:null,history:[],lastOfferWeek:0,nextOfferWeek:null};
    f.afterlife.streaming.offers=f.afterlife.streaming.offers||[];f.afterlife.streaming.history=f.afterlife.streaming.history||[];
   }
  });
  schema=381;
 }
 if(schema<382){
  x.challengerState=x.challengerState||{launched:false,launchWeek:null,triggerYear:null,triggerRank:null,triggerRecognition:null};
  schema=382;
 }
 if(schema<383){
  x.industryOpportunities=x.industryOpportunities||{lastOfferWeek:0,history:[],accepted:0};
  x.emergingTalentState=x.emergingTalentState||{lastIntroductionWeek:0,history:[]};x.studioHistory=x.studioHistory||{anniversaries:[],rivalLeadership:[],hallSnapshots:[],retrospectives:[],lastLeadershipChangeWeek:0};
  (x.talent||[]).filter(t=>t.isRealPerson===false).forEach(t=>{if(t.emerging===undefined)t.emerging=/^NG[AD]/.test(t.id||'');if(t.introducedWeek===undefined)t.introducedWeek=t.careerStartWeek||1;if(t.discoveryWindowUntil===undefined)t.discoveryWindowUntil=0;if(t.firstMajorBreakStudio===undefined)t.firstMajorBreakStudio=null});
  schema=383;
 }
 if(schema<390){
  ensureBaseFictionalRoster(x);
  schema=390;
 }
 if(schema<391){
  x.studioHistory=x.studioHistory||{anniversaries:[],rivalLeadership:[],hallSnapshots:[],retrospectives:[],lastLeadershipChangeWeek:0};
  schema=391;
 }
 if(schema<392){
  x.studioGrowth=x.studioGrowth||{fans:.04,recognition:12,upgrades:{},history:[]};x.studioGrowth.upgrades=x.studioGrowth.upgrades||{};
  ['production','casting','publicity','development','post'].forEach(k=>{if(x.studioGrowth.upgrades[k]===undefined)x.studioGrowth.upgrades[k]=0});
  schema=392;
 }
 if(schema<393){
  x.corporateState=x.corporateState||{status:'private',founderOwnership:100,investorConfidence:62,ipoDeclinedUntil:0,ipoWeek:null,ipoProceeds:0,lastReviewWeek:0,lastOfferWeek:0,lastFundamental:null,lastMarketCap:null,lastSharePrice:null,history:[],quarterly:[],boardPressure:false};
  schema=393;
 }
 if(schema<394){
  x.corporateState=x.corporateState||{status:'private',founderOwnership:100,investorConfidence:62,history:[],quarterly:[]};
  x.corporateState.streamingPlatform=x.corporateState.streamingPlatform||{status:'none',name:null,model:null,launchWeek:null,launchCost:0,subscribers:0,peakSubscribers:0,lastQuarterSubscribers:0,lastQuarterWeek:0,exclusiveFilmIds:[],history:[],quarterly:[],lifetimeRevenue:0,lifetimeOperatingCost:0,currentQuarterRevenue:0,currentQuarterCost:0,lastWeeklyRevenue:0,lastWeeklyCost:0,lastWeeklyNet:0,lastExclusiveWeek:null,notifiedWeek:0,declinedUntil:0,woundDownWeek:null};
  (x.films||[]).forEach(f=>{if(f.afterlife?.streaming&&f.afterlife.streaming.ownedPlatform===undefined)f.afterlife.streaming.ownedPlatform=null});
  schema=394;
 }

 if(schema<395){
  x.reputation=x.reputation||{creative:45,commercial:45,talent:45,financial:50};if(x.reputation.press===undefined)x.reputation.press=50;
  x.executivePersona=x.executivePersona||{history:[],lastPrimary:null,lastEvaluatedWeek:0};x.executivePersona.history=x.executivePersona.history||[];
  x.industryMood=x.industryMood||{history:[],lastQuarter:0};x.industryMood.history=x.industryMood.history||[];
  x.pressMemory=x.pressMemory||{};Object.values(x.pressMemory).forEach(m=>{if(m.rapport===undefined)m.rapport=0;if(m.interactions===undefined)m.interactions=0;if(m.lastInteractionWeek===undefined)m.lastInteractionWeek=0;m.choiceHistory=m.choiceHistory||[];m.kinds=m.kinds||{}});
  schema=395;
 }


 if(schema<396){
  if(x.desk){
   const redundant=i=>String(i?.templateId||'').startsWith('campaign-')||String(i?.notificationKey||'').startsWith('rights-offer:')||String(i?.notificationKey||'').startsWith('release:')||String(i?.notificationKey||'').startsWith('mkt:');
   x.desk.items=(x.desk.items||[]).filter(i=>!redundant(i));
   x.desk.archive=(x.desk.archive||[]).filter(i=>!redundant(i));
  }
  (x.films||[]).forEach(f=>{if(f.marketingState?.deskMomentKeys)f.marketingState.deskMomentKeys=[]});
  schema=396;
 }


 if(schema<397){
  (x.rivals||[]).forEach(rv=>{
   rv.competitiveHistory=rv.competitiveHistory||[];rv.playerScriptWinsAgainstRival=rv.playerScriptWinsAgainstRival||0;rv.rivalrySinceWeek=rv.rivalrySinceWeek||null;rv.lastRivalryEventWeek=rv.lastRivalryEventWeek||0;rv.lastRivalryLabel=rv.lastRivalryLabel||'Normal competition';
  });
  schema=397;
 }


 if(schema<398){
  (x.films||[]).forEach(f=>{if(!f.filmIdentity)f.filmIdentity=null});
  schema=398;
 }


 if(schema<399){
  x.challengerState=x.challengerState||{launched:false,launchWeek:null,triggerYear:null,triggerRank:null,triggerRecognition:null};
  if(x.challengerState.pressPublished===undefined)x.challengerState.pressPublished=!!(x.desk?.items||[]).some(i=>i.templateId==='challenger-arrival')||!!(x.desk?.archive||[]).some(i=>i.templateId==='challenger-arrival');
  (x.scripts||[]).filter(sc=>sc.source==='Market'&&sc.available&&sc.status==='market'&&!sc.filmStarted&&!sc.premiseDNA).forEach(sc=>{
   const r=makeRng(hash((x.seed||1)+'|premise-upgrade-v3141|'+sc.id)),concept=generatedPremise(x,r,sc.genre);
   sc.logline=concept.logline;sc.shape=concept.shape;sc.premiseDNA=concept.premiseDNA;
  });
  schema=399;
 }


 if(schema<400){
  schema=400;
 }
 if(schema<403){
  x.careerCycle=x.careerCycle||{phase:'building',startedWeek:x.week||1,lastEvaluatedWeek:0,lastTransitionWeek:x.week||1,history:[],lastPlanEndWeek:0,lastRecoveryWeek:0,peakRecognition:x.studioGrowth?.recognition||12};
  schema=403;
 }

 x.saveSchema=schema;
 return x;
}

function migrateState(x){
 if(!x)return null;
 const fromVersion=x.version||'legacy';
 x.version=VERSION;
 x.difficulty=x.difficulty||'normal';x.uiDifficultyDraft=x.uiDifficultyDraft||x.difficulty||'normal';x.developmentUnlocks=x.developmentUnlocks||{commissionNotified:false,originalNotified:false};x.screenplayEconomy=x.screenplayEconomy||{history:[],lastWeek:0,turnarounds:0,lastTurnaroundWeek:0};x.challengerState=x.challengerState||{launched:false,launchWeek:null,triggerYear:null,triggerRank:null,triggerRecognition:null};x.industryOpportunities=x.industryOpportunities||{lastOfferWeek:0,history:[],accepted:0};x.emergingTalentState=x.emergingTalentState||{lastIntroductionWeek:0,history:[]};x.corporateState=x.corporateState||{status:'private',founderOwnership:100,investorConfidence:62,ipoDeclinedUntil:0,ipoWeek:null,ipoProceeds:0,lastReviewWeek:0,lastOfferWeek:0,lastFundamental:null,lastMarketCap:null,lastSharePrice:null,history:[],quarterly:[],boardPressure:false};
 x.calendarDay=Number.isFinite(x.calendarDay)?x.calendarDay:Math.max(1,((x.week||1)-1)*7+1);x.lastWeeklyHeartbeatWeek=x.lastWeeklyHeartbeatWeek||x.week||1;x.simulationAudit=x.simulationAudit||{schema:2,enabled:true,firstWeek:null,lastWeek:0,weekly:[],quarterly:[],flags:[],captures:0,benchmarks:[]};x.simulationAudit.benchmarks=Array.isArray(x.simulationAudit.benchmarks)?x.simulationAudit.benchmarks:[];
 x.agencyWindows=x.agencyWindows||{};x.collaborations=x.collaborations||{};x.careerThreads=x.careerThreads||{active:[],history:[],nextId:1,lastUpdatedWeek:0};x.careerCycle=x.careerCycle||{phase:'building',startedWeek:x.week||1,lastEvaluatedWeek:0,lastTransitionWeek:x.week||1,history:[],lastPlanEndWeek:0,lastRecoveryWeek:0,peakRecognition:x.studioGrowth?.recognition||12};x.pressMemory=x.pressMemory||{};x.executivePersona=x.executivePersona||{history:[],lastPrimary:null,lastEvaluatedWeek:0};x.industryMood=x.industryMood||{history:[],lastQuarter:0};x.reputation=x.reputation||{};if(x.reputation.press===undefined)x.reputation.press=50;x.fastForward=x.fastForward||{uses:0,lastFromDay:null,lastToDay:null};x.legends=x.legends||{unlocked:{},history:[],pending:[],initialized:false};x.legends.unlocked=x.legends.unlocked||{};x.legends.history=x.legends.history||[];x.legends.pending=x.legends.pending||[];x.activeLegendUnlockId=x.activeLegendUnlockId||null;syncPrivateRealRoster(x);ensureBaseFictionalRoster(x);ensureAudienceMarket(x);x.lastAwardsSeasonResolved=x.lastAwardsSeasonResolved||0;x.portraitCache=x.portraitCache||{};Object.keys(x.portraitCache).forEach(k=>{const v=x.portraitCache[k];if(v==='__none__')delete x.portraitCache[k];else if(typeof v==='string')x.portraitCache[k]=normalizePortraitSource(v)||v});x.talentWatchlist=x.talentWatchlist||[];x.yearbooks=x.yearbooks||[];x.awardsArchive=x.awardsArchive||[];x.awardsNominationsArchive=x.awardsNominationsArchive||[];x.pendingAwardsNominations=x.pendingAwardsNominations||null;x.awardsCeremonyStep=Number.isFinite(x.awardsCeremonyStep)?x.awardsCeremonyStep:0;x.pendingCeremony=x.pendingCeremony||null;x.availabilityWatches=x.availabilityWatches||[];x.studioIdentity=x.studioIdentity||{history:[],lastPrimary:null,lastEvaluatedWeek:0};ensureStudioIdentity(x);x.pendingFilmWraps=x.pendingFilmWraps||[];x.activeFilmWrapId=x.activeFilmWrapId||null;x.uiFilmWrapStep=Number.isFinite(x.uiFilmWrapStep)?clamp(x.uiFilmWrapStep,0,4):0;x.studioMomentQueue=x.studioMomentQueue||[];x.activeStudioMoment=x.activeStudioMoment||null;x.boxOfficeMemory=x.boxOfficeMemory||{leaderId:null,streak:0,lastWeek:0};ensureEconomyState(x);(x.films||[]).forEach(f=>{
  ensureProductionDepth(f);ensureDistributionState(f);
  const fs=(x.scripts||[]).find(s=>s.id===f.scriptId);
  if(fs?.ipParentFilmId&&!f.ipParentId)f.ipParentId=fs.ipParentFilmId;
  if(fs?.franchiseRootId&&!f.franchiseRootId)f.franchiseRootId=fs.franchiseRootId;
  if(fs?.sequelInstallment&&!f.sequelInstallment)f.sequelInstallment=fs.sequelInstallment;
  if(fs?.franchiseMode&&!f.franchiseMode)f.franchiseMode=fs.franchiseMode;
  if(f.ipParentId&&!f.franchiseMode)f.franchiseMode='sequel';
  if(f.socialPulse)f.socialPulse.moves=f.socialPulse.moves||[];
  if(f.owner==='player'&&f.soundtrack===undefined)f.soundtrack=null;
  if(f.post){f.post.musicDraft=f.post.musicDraft||{strategy:'original',trackId:null};f.post.firstDecisionMade=f.post.firstDecisionMade===true||(f.post.actions||[]).length>0;}
  if(f.stage==='complete')ensureLegacyState(f)
 });x.studioGrowth=x.studioGrowth||{fans:.04,recognition:12,upgrades:{production:0,casting:0,publicity:0},history:[]};ensureStudioGrowth(x);x.talentDrama=x.talentDrama||[];x.ids=x.ids||{};x.ids.talent=x.ids.talent||0;x.ids.news=x.ids.news||0;(x.talent||[]).forEach(ensureTalentCareer);x.news=(x.news||[]).map(n=>normalizeNewsItem(x,n));
 x.writers=x.writers&&x.writers.length?x.writers:writerSeed.map((w,i)=>({id:'W'+(i+1),name:w[0],structure:w[1],character:w[2],dialogue:w[3],commercial:w[4],fee:w[5],genres:w[6],tag:w[7],momentum:55+(i*7)%35,credits:[],relationship:0}));
 x.uiScriptTab=x.uiScriptTab||'market';
 x.uiStudioTab=x.uiStudioTab||'desk';if(x.uiStudioTab==='overview')x.uiStudioTab='desk';x.uiDeskTab=x.uiDeskTab||'briefing';x.uiLegacyTab=x.uiLegacyTab||(x.uiStudioTab==='milestones'?'milestones':x.uiStudioTab==='legends'?'legends':'overview');if(x.uiStudioTab==='milestones'||x.uiStudioTab==='legends')x.uiStudioTab='legacy';x.uiSlateTab=x.uiSlateTab||'pipeline';x.uiReleaseTab=x.uiReleaseTab||'box';
 x.uiPeopleFilter=x.uiPeopleFilter||'all';x.uiPeopleSearch=x.uiPeopleSearch||'';
 x.uiWriterDrafts=x.uiWriterDrafts||{
  concept:{title:'',genre:'Psychological Horror',logline:'',synopsis:'',audience:'Mainstream Adults',scale:'mid',positioning:'balanced',tone:'balanced',rating:'mainstream',emphasis:'balanced',writerId:null},
  commission:{genre:'Psychological Horror',audience:'Mainstream Adults',brief:'balanced',scale:'mid',writerId:null},
  search:'',sort:'fit'
 };
 x.uiWriterDrafts.concept={title:'',genre:'Psychological Horror',logline:'',synopsis:'',audience:'Mainstream Adults',scale:'mid',positioning:'balanced',tone:'balanced',rating:'mainstream',emphasis:'balanced',writerId:null,...(x.uiWriterDrafts.concept||{})};
 x.uiWriterDrafts.commission={genre:'Psychological Horror',audience:'Mainstream Adults',brief:'balanced',scale:'mid',writerId:null,...(x.uiWriterDrafts.commission||{})};
 x.finance=x.finance||{bridgeDebt:0,weeklyInterest:.012,totalInterest:0,quote:0};
 x.notifications=x.notifications||[];x.notificationKeys=x.notificationKeys||[];x.activeNotificationId=x.activeNotificationId??null;
 x.desk=x.desk||{items:[],archive:[],nextId:1,lastGeneratedWeek:0,seenIntro:false};x.desk.items=x.desk.items||[];x.desk.archive=x.desk.archive||[];x.desk.nextId=x.desk.nextId||1;x.desk.lastGeneratedWeek=x.desk.lastGeneratedWeek||0;x.pulse=x.pulse||{history:[],lastWeek:0};
 x.ids=x.ids||{};x.ids.notification=x.ids.notification||0;
 (x.talent||[]).forEach(t=>{if(t.relationship===undefined)t.relationship=0});
 (x.scripts||[]).forEach(s=>{if(s.filmStarted===undefined)s.filmStarted=(x.films||[]).some(f=>f.scriptId===s.id);if(!s.status)s.status=s.available?'market':(s.filmStarted?'filming':'owned');if(s.owner===undefined)s.owner=s.filmStarted&&((x.films||[]).find(f=>f.scriptId===s.id)?.owner==='player')?'player':null;if(s.developmentSpend===undefined)s.developmentSpend=s.filmStarted?0:(s.owner==='player'?(s.price||0):0)});
 (x.rivals||[]).forEach((r,i)=>{r.profile=aiStudioProfile(r.style);r.debt=r.debt||0;r.commercialHistory=r.commercialHistory||[];r.recognition=r.recognition??r.reputation??(44+i*4);r.fans=r.fans??(.8+i*.28);ensureRivalCharacter(r)});
 (x.films||[]).forEach(f=>{
  if(f.owner==='player'){
   f.contracts=f.contracts||{};f.auditions=f.auditions||{};f.auditionRound=f.auditionRound||1;
   f.auditionSlotsUsed=f.auditionSlotsUsed||0;f.extraAuditionRounds=f.extraAuditionRounds||0;f.backendPaid=f.backendPaid||0;
   f.marketingState=f.marketingState||null;f.pressReviews=f.pressReviews||null;
   return;
  }
  // v1.6 AI films paid release costs at greenlight and were dated immediately.
  // Mark those as already funded so migration never charges the same campaign twice.
  if(f.releaseFunded===undefined)f.releaseFunded=f.releaseWeek!==null&&f.releaseWeek!==undefined;
  if(f.metrics===undefined)f.metrics=null;
 });
 refreshLegacyMarketPresentation(x);
 applySaveSchemaMigrations(x,fromVersion);
 return x;
}
