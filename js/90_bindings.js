// DOM event wiring

let draftSaveTimer=null;
function scheduleDraftSave(){if(draftSaveTimer)clearTimeout(draftSaveTimer);draftSaveTimer=setTimeout(()=>{draftSaveTimer=null;save()},260)}

function bindBrandControls(){
 const apply=(field,value)=>{
  const nameInput=document.getElementById('studioName');if(nameInput)state.uiStudioNameDraft=nameInput.value;
  if(state.studio){ensurePlayerBrand();state.studio.brand=normalizeBrand({...state.studio.brand,[field]:value},state.studio.name)}
  else{ensurePlayerBrand();state.uiBrandDraft=normalizeBrand({...state.uiBrandDraft,[field]:value},state.uiStudioNameDraft||'Studio')}
  save();render();
 };
 document.querySelectorAll('[data-brand-mark]').forEach(b=>b.onclick=()=>apply('mark',b.dataset.brandMark));
 document.querySelectorAll('[data-brand-theme]').forEach(b=>b.onclick=()=>apply('theme',b.dataset.brandTheme));
 document.querySelectorAll('[data-brand-wordmark]').forEach(b=>b.onclick=()=>apply('wordmark',b.dataset.brandWordmark));
}

function advanceFilmWrapChapter(delta=1){
 const current=Math.max(0,Math.min(4,Number(state.uiFilmWrapStep)||0));
 state.uiFilmWrapStep=Math.max(0,Math.min(4,current+delta));
 requestScrollTop();save();render();
}


let globalBackToTopListenerBound=false;
function syncGlobalBackToTop(){
 if(typeof window==='undefined'||typeof document==='undefined')return;
 const b=document.getElementById('globalBackToTop');if(!b)return;
 const blocked=!!document.querySelector('.pickerbar')||['setup','filmWrap','legendUnlock','studioMoment','nominations','ceremony'].includes(state.screen);
 b.classList.toggle('visible',!blocked&&window.scrollY>420);
}
function bindGlobalBackToTop(){
 const b=document.getElementById('globalBackToTop');
 if(b)b.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
 if(!globalBackToTopListenerBound&&typeof window!=='undefined'){
  window.addEventListener('scroll',syncGlobalBackToTop,{passive:true});globalBackToTopListenerBound=true;
 }
 syncGlobalBackToTop();
}

function bind(){
 bindBrandControls();
 bindGlobalBackToTop();
 document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>navTo(b.dataset.nav));
 document.querySelectorAll('[data-script]').forEach(b=>b.onclick=()=>push('develop',{type:'script',id:b.dataset.script}));
 document.querySelectorAll('[data-script-tab]').forEach(b=>b.onclick=()=>{state.uiScriptTab=b.dataset.scriptTab;state.detail=null;save();render()});
 document.querySelectorAll('[data-script-bid]').forEach(b=>b.onclick=()=>acquireScriptRights(state.detail.id,b.dataset.scriptBid));
 document.querySelectorAll('[data-script-pass]').forEach(b=>b.onclick=()=>runScriptPass(state.detail.id,b.dataset.scriptPass));
 document.querySelectorAll('[data-film]').forEach(b=>b.onclick=()=>{const f=filmById(b.dataset.film);if(f&&f.owner==='player')push(state.screen,{type:'film',id:f.id})});
 document.querySelectorAll('[data-industry-film]').forEach(b=>b.onclick=()=>push(state.screen,{type:'industryFilm',id:b.dataset.industryFilm}));
 document.querySelectorAll('[data-news-id]').forEach(b=>b.onclick=()=>push(state.screen,{type:'news',id:b.dataset.newsId}));
 document.querySelectorAll('[data-rival]').forEach(b=>b.onclick=()=>push('industry',{type:'rival',id:b.dataset.rival}));
 document.querySelectorAll('[data-industry-tab]').forEach(b=>b.onclick=()=>{state.industryTab=b.dataset.industryTab;save();render()});
 document.querySelectorAll('[data-studio-tab]').forEach(b=>b.onclick=()=>{state.uiStudioTab=b.dataset.studioTab;save();render()});
 document.querySelectorAll('[data-desk-tab]').forEach(b=>b.onclick=()=>{state.uiDeskTab=b.dataset.deskTab;save();render()});
 document.querySelectorAll('[data-legacy-tab]').forEach(b=>b.onclick=()=>{state.uiLegacyTab=b.dataset.legacyTab;save();render()});
 document.querySelectorAll('[data-open-legacy]').forEach(b=>b.onclick=()=>{state.uiStudioTab='legacy';state.uiLegacyTab=b.dataset.openLegacy||'overview';save();render()});
 document.querySelectorAll('[data-desk-choice]').forEach(b=>b.onclick=()=>resolveDeskChoice(b.dataset.deskId,b.dataset.deskChoice));
 document.querySelectorAll('[data-desk-read]').forEach(b=>b.onclick=()=>markDeskRead(b.dataset.deskRead));
 document.querySelectorAll('[data-desk-toggle]').forEach(b=>b.onclick=()=>toggleDeskItem(b.dataset.deskToggle));
 document.querySelectorAll('[data-desk-archive]').forEach(b=>b.onclick=()=>archiveDeskItem(b.dataset.deskArchive));
 const deskMarkAllRead=document.getElementById('deskMarkAllRead');if(deskMarkAllRead)deskMarkAllRead.onclick=markAllDeskRead;
 const deskMarkAllRead2=document.getElementById('deskMarkAllRead2');if(deskMarkAllRead2)deskMarkAllRead2.onclick=markAllDeskRead;
 const deskArchiveRead=document.getElementById('deskArchiveRead');if(deskArchiveRead)deskArchiveRead.onclick=archiveReadDeskItems;
 const deskArchiveRead2=document.getElementById('deskArchiveRead2');if(deskArchiveRead2)deskArchiveRead2.onclick=archiveReadDeskItems;
 document.querySelectorAll('[data-desk-open]').forEach(b=>b.onclick=()=>openDeskItemTarget(b.dataset.deskOpen));
 document.querySelectorAll('[data-studio-upgrade]').forEach(b=>b.onclick=()=>buyStudioUpgrade(b.dataset.studioUpgrade));
 document.querySelectorAll('[data-slate-tab]').forEach(b=>b.onclick=()=>{state.uiSlateTab=b.dataset.slateTab;save();render()});
 document.querySelectorAll('[data-release-tab]').forEach(b=>b.onclick=()=>{state.uiReleaseTab=b.dataset.releaseTab;save();render()});
 document.querySelectorAll('[data-theatrical-move]').forEach(b=>b.onclick=e=>{e.stopPropagation();applyTheatricalMove(filmById(b.dataset.filmId),b.dataset.theatricalMove)});
 document.querySelectorAll('[data-talent]').forEach(b=>b.onclick=e=>{if(e.target.closest('[data-attach-director]')||e.target.closest('[data-toggle-cast]')||e.target.closest('[data-select-support]')||e.target.closest('[data-audition]')||e.target.closest('[data-contract-talent]'))return;push(state.screen,{type:'talent',id:b.dataset.talent})});
 const bb=document.getElementById('backBtn');if(bb)bb.onclick=back;
 document.querySelectorAll('[data-pulse-film]').forEach(b=>b.onclick=()=>push('studio',{type:'pulse',id:b.dataset.pulseFilm}));
 const bell=document.getElementById('notificationBell');if(bell)bell.onclick=()=>{state.history=[];state.screen='studio';state.detail=null;state.uiStudioTab='desk';state.uiDeskTab='briefing';requestScrollTop();save();render()};
 const openFinance=document.getElementById('openFinance');if(openFinance)openFinance.onclick=()=>push('studio',{type:'finance'});
 const captureSimulationAudit=document.getElementById('captureSimulationAudit');if(captureSimulationAudit)captureSimulationAudit.onclick=()=>{recordSimulationAudit('manual');save();render()};
 const exportSimulationAudit=document.getElementById('exportSimulationAudit');if(exportSimulationAudit)exportSimulationAudit.onclick=simulationAuditExport;
 const runSimulationBenchmark=document.getElementById('runSimulationBenchmark');if(runSimulationBenchmark)runSimulationBenchmark.onclick=()=>{runSimulationBenchmark.disabled=true;runSimulationBenchmark.textContent='Running 15 simulated industry-years…';setTimeout(()=>runSimulationBenchmarkSuite(),30)};
 document.querySelectorAll('[data-finance-quote]').forEach(b=>b.onclick=()=>{ensureFinance();state.finance.quote=+b.dataset.financeQuote;save();render()});
 const cancelFinanceQuote=document.getElementById('cancelFinanceQuote');if(cancelFinanceQuote)cancelFinanceQuote.onclick=()=>{state.finance.quote=0;save();render()};
 const confirmFinanceQuote=document.getElementById('confirmFinanceQuote');if(confirmFinanceQuote)confirmFinanceQuote.onclick=()=>{const q=state.finance.quote||0;state.finance.quote=0;if(q)takeBridge(q)};
 document.querySelectorAll('[data-bridge]').forEach(b=>b.onclick=()=>takeBridge(+b.dataset.bridge||5));
 document.querySelectorAll('[data-repay]').forEach(b=>b.onclick=()=>repayBridge(+b.dataset.repay||1));
 document.querySelectorAll('[data-capital-asset]').forEach(b=>b.onclick=()=>buyCapitalAsset(b.dataset.capitalAsset));
 document.querySelectorAll('[data-recovery-plan]').forEach(b=>b.onclick=()=>startRecoveryPlan(b.dataset.recoveryPlan));
 const aw=document.getElementById('advanceWeek');if(aw)aw.onclick=continueTime;
 const ns=document.getElementById('newConcept');if(ns)ns.onclick=()=>push('develop',{type:'concept'});
 const nc=document.getElementById('newCommission');if(nc)nc.onclick=()=>push('develop',{type:'commission'});
 const routeConcept=document.getElementById('routeConcept');if(routeConcept)routeConcept.onclick=()=>push('develop',{type:'concept'});
 const routeCommission=document.getElementById('routeCommission');if(routeCommission)routeCommission.onclick=()=>push('develop',{type:'commission'});
 const ac=document.getElementById('acquireScript');if(ac)ac.onclick=()=>acquireScriptRights(state.detail.id,'ask');
 const beginScriptFilm=document.getElementById('beginScriptFilm');if(beginScriptFilm)beginScriptFilm.onclick=()=>beginOwnedScript(state.detail.id);
 const drafts=ensureWriterDrafts();
 const bindDraft=(id,obj,key)=>{const el=document.getElementById(id);if(!el)return;el.oninput=()=>{obj[key]=el.value;scheduleDraftSave()};el.onchange=()=>{obj[key]=el.value;if(draftSaveTimer){clearTimeout(draftSaveTimer);draftSaveTimer=null}save()}};
 bindDraft('conceptTitle',drafts.concept,'title');bindDraft('conceptGenre',drafts.concept,'genre');bindDraft('conceptLogline',drafts.concept,'logline');bindDraft('conceptSynopsis',drafts.concept,'synopsis');bindDraft('conceptAudience',drafts.concept,'audience');bindDraft('conceptScale',drafts.concept,'scale');bindDraft('conceptPositioning',drafts.concept,'positioning');bindDraft('conceptTone',drafts.concept,'tone');bindDraft('conceptRating',drafts.concept,'rating');bindDraft('conceptEmphasis',drafts.concept,'emphasis');
 bindDraft('commissionGenre',drafts.commission,'genre');bindDraft('commissionAudience',drafts.commission,'audience');bindDraft('commissionBrief',drafts.commission,'brief');bindDraft('commissionScale',drafts.commission,'scale');
 ['conceptGenre','conceptAudience','conceptScale','conceptPositioning','conceptTone','conceptRating','conceptEmphasis','commissionGenre','commissionAudience','commissionBrief','commissionScale'].forEach(id=>{const el=document.getElementById(id);if(el)el.onchange=()=>{const map={conceptGenre:[drafts.concept,'genre'],conceptAudience:[drafts.concept,'audience'],conceptScale:[drafts.concept,'scale'],conceptPositioning:[drafts.concept,'positioning'],conceptTone:[drafts.concept,'tone'],conceptRating:[drafts.concept,'rating'],conceptEmphasis:[drafts.concept,'emphasis'],commissionGenre:[drafts.commission,'genre'],commissionAudience:[drafts.commission,'audience'],commissionBrief:[drafts.commission,'brief'],commissionScale:[drafts.commission,'scale']};const [obj,key]=map[id];obj[key]=el.value;save();render()}});
 const chooseConceptWriter=document.getElementById('chooseConceptWriter');if(chooseConceptWriter)chooseConceptWriter.onclick=()=>push('develop',{type:'writerPicker',mode:'concept'});
 const chooseCommissionWriter=document.getElementById('chooseCommissionWriter');if(chooseCommissionWriter)chooseCommissionWriter.onclick=()=>push('develop',{type:'writerPicker',mode:'commission'});
 const writerSearch=document.getElementById('writerSearch');if(writerSearch)writerSearch.oninput=()=>{drafts.search=writerSearch.value;save();render()};
 const writerSort=document.getElementById('writerSort');if(writerSort)writerSort.onchange=()=>{drafts.sort=writerSort.value;save();render()};
 document.querySelectorAll('[data-writer-select]').forEach(b=>b.onclick=()=>{const mode=state.detail.mode;(mode==='concept'?drafts.concept:drafts.commission).writerId=b.dataset.writerSelect;save();render()});
 document.querySelectorAll('[data-writer-profile]').forEach(b=>b.onclick=e=>{if(e.target.closest('[data-writer-select]'))return;push(state.screen,{type:'writerProfile',id:b.dataset.writerProfile})});
 const writerContinue=document.getElementById('writerContinue');if(writerContinue)writerContinue.onclick=()=>back();
 const cc=document.getElementById('commitConcept');if(cc)cc.onclick=()=>{const d=drafts.concept;createOriginalConcept(d.title,d.genre,d.logline,d.synopsis,d.audience,d.writerId,d.scale,d.positioning,d.tone,d.rating,d.emphasis);drafts.concept={title:'',genre:d.genre,logline:'',synopsis:'',audience:d.audience,scale:d.scale,positioning:d.positioning,tone:d.tone,rating:d.rating,emphasis:d.emphasis,writerId:null};save()};
 const commitCommission=document.getElementById('commitCommission');if(commitCommission)commitCommission.onclick=()=>{const d=drafts.commission;commissionScript(d.genre,d.brief,d.scale,d.audience,d.writerId);drafts.commission={...d,writerId:null};save()};
 const currentFilmId=state.detail&&typeof state.detail==='object'?state.detail.id:state.detail;
 const sd=document.getElementById('chooseDirector');if(sd)sd.onclick=()=>{state.uiPickerSearch='';state.uiPickerSort='fit';push(state.screen,{type:'directorPicker',id:currentFilmId})};
 const sc=document.getElementById('chooseCast');if(sc)sc.onclick=()=>{state.uiPickerSearch='';state.uiPickerSort='fit';push(state.screen,{type:'castingPicker',id:currentFilmId})};
 const ss=document.getElementById('chooseSupportingCast');if(ss)ss.onclick=()=>{state.uiPickerSearch='';state.uiPickerSort='fit';push(state.screen,{type:'supportingPicker',id:currentFilmId})};
 const reviewContracts=document.getElementById('reviewContracts');if(reviewContracts)reviewContracts.onclick=()=>push(state.screen,{type:'contracts',id:currentFilmId});
 document.querySelectorAll('[data-attach-director]').forEach(b=>b.onclick=e=>{e.stopPropagation();const f=filmById(currentFilmId);attachDirector(f,b.dataset.attachDirector)});
 document.querySelectorAll('[data-toggle-cast]').forEach(b=>b.onclick=e=>{e.stopPropagation();const f=filmById(currentFilmId);toggleCast(f,b.dataset.toggleCast)});
 document.querySelectorAll('[data-select-support]').forEach(b=>b.onclick=e=>{e.stopPropagation();setSupportingCast(filmById(currentFilmId),b.dataset.selectSupport)});
 const clearSupportingCastBtn=document.getElementById('clearSupportingCast');if(clearSupportingCastBtn)clearSupportingCastBtn.onclick=()=>clearSupportingCast(filmById(currentFilmId));
 const supportingContinue=document.getElementById('supportingContinue');if(supportingContinue)supportingContinue.onclick=()=>back();
 const reuniteReturningCast=document.getElementById('reuniteReturningCast');if(reuniteReturningCast)reuniteReturningCast.onclick=()=>{const f=filmById(currentFilmId),parent=filmById(f.ipParentId);if(!parent)return;ensureFilmRoles(f);(parent.cast||[]).map(talentById).filter(t=>t&&!talentUnavailableForFilm(t,f)).slice(0,2).forEach((t,i)=>{f.castingTargetRole=`lead${i+1}`;assignLeadRole(f,`lead${i+1}`,t.id)});save();render()};
 document.querySelectorAll('[data-audition]').forEach(b=>b.onclick=e=>{e.stopPropagation();auditionActor(filmById(currentFilmId),b.dataset.audition)});
 const extraAuditions=document.getElementById('extraAuditions');if(extraAuditions)extraAuditions.onclick=()=>extraAuditionRound(filmById(currentFilmId));
 document.querySelectorAll('[data-contract-talent]').forEach(b=>b.onclick=()=>acceptContract(filmById(currentFilmId),b.dataset.contractTalent,b.dataset.contractOffer));
 const contractsContinue=document.getElementById('contractsContinue');if(contractsContinue)contractsContinue.onclick=()=>{state.history=[];state.screen='slate';state.detail={type:'film',id:currentFilmId};save();render()};
 const pickerSort=document.getElementById('pickerSort');if(pickerSort)pickerSort.onchange=()=>{state.uiPickerSort=pickerSort.value;save();render()};
 const pickerFee=document.getElementById('pickerFee');if(pickerFee)pickerFee.onchange=()=>{state.uiPickerMaxFee=+pickerFee.value;save();render()};
 const pickerMomentum=document.getElementById('pickerMomentum');if(pickerMomentum)pickerMomentum.onchange=()=>{state.uiPickerMinMomentum=+pickerMomentum.value;save();render()};
 const pickerFit=document.getElementById('pickerFit');if(pickerFit)pickerFit.onchange=()=>{state.uiPickerMinFit=+pickerFit.value;save();render()};
 const pickerAvailable=document.getElementById('pickerAvailable');if(pickerAvailable)pickerAvailable.onchange=()=>{state.uiPickerAvailable=pickerAvailable.checked;save();render()};
 const pickerResetFilters=document.getElementById('pickerResetFilters');if(pickerResetFilters)pickerResetFilters.onclick=()=>{state.uiPickerSort=null;state.uiPickerMaxFee=0;state.uiPickerMinMomentum=0;state.uiPickerMinFit=0;state.uiPickerAvailable=false;save();render()};
 const pickerContinue=document.getElementById('pickerContinue');if(pickerContinue)pickerContinue.onclick=()=>{state.history=[];state.screen='slate';state.detail={type:'film',id:currentFilmId};save();render()};
 document.querySelectorAll('[data-budget]').forEach(b=>b.onclick=()=>{const f=filmById(currentFilmId);f.budget=+b.dataset.budget;save();render()});
 const budgetSlider=document.getElementById('budgetSlider');if(budgetSlider){budgetSlider.oninput=()=>{const f=filmById(currentFilmId),sc=scriptById(f.scriptId);f.budget=+budgetSlider.value;document.getElementById('budgetRead').textContent=money(f.budget);document.getElementById('budgetAdvice').textContent=budgetAdvice(f.budget,sc);const fees=packageTalentIds(f).reduce((a,id)=>a+(f.contracts[id]?.upfront??talentById(id)?.fee??0),0),depth=productionDepthCost(f);document.getElementById('cashAfter').textContent=`Estimated cash after package + production: ${money(state.cash-f.budget-fees-depth)}`;scheduleDraftSave()};budgetSlider.onchange=()=>{save();render()}};
 document.querySelectorAll('[data-creative-field]').forEach(b=>b.onclick=()=>{const f=filmById(currentFilmId);f.creative=f.creative||defaultCreative();f.creative[b.dataset.creativeField]=b.dataset.creativeValue;save();render()});
 document.querySelectorAll('[data-producer-strategy]').forEach(b=>b.onclick=()=>{const f=filmById(currentFilmId);ensureProductionDepth(f);f.producerStrategy=b.dataset.producerStrategy;save();render()});
 document.querySelectorAll('[data-effects-approach]').forEach(b=>b.onclick=()=>{const f=filmById(currentFilmId);ensureProductionDepth(f);f.effectsApproach=b.dataset.effectsApproach;save();render()});
 const watchReturningAvailability=document.getElementById('watchReturningAvailability');if(watchReturningAvailability)watchReturningAvailability.onclick=()=>{const f=filmById(currentFilmId);watchFilmTalentAvailability(f,returningTalentToWatch(f).map(t=>t.id))};
 const cancelAvailabilityWatchBtn=document.getElementById('cancelAvailabilityWatch');if(cancelAvailabilityWatchBtn)cancelAvailabilityWatchBtn.onclick=()=>cancelAvailabilityWatch(filmById(currentFilmId));
 const hold=document.getElementById('toggleHold');if(hold)hold.onclick=()=>toggleProjectHold(filmById(currentFilmId));
 const gl=document.getElementById('greenlight');if(gl)gl.onclick=()=>push(state.screen,{type:'greenlightReview',id:currentFilmId});
 const confirmGreenlight=document.getElementById('confirmGreenlight');if(confirmGreenlight)confirmGreenlight.onclick=()=>greenlight(filmById(currentFilmId));
 const greenlightBack=document.getElementById('greenlightBack');if(greenlightBack)greenlightBack.onclick=back;
 document.querySelectorAll('[data-casting-role]').forEach(btn=>btn.onclick=()=>setCastingTargetRole(filmById(currentFilmId),btn.dataset.castingRole));
 const developSequel=document.getElementById('developSequel');if(developSequel)developSequel.onclick=()=>developSequelFromFilm(filmById(currentFilmId));
 document.querySelectorAll('[data-franchise-project]').forEach(b=>b.onclick=()=>developFranchiseProject(filmById(currentFilmId),b.dataset.franchiseProject));
 const sellFutureRights=document.getElementById('sellFutureRights');if(sellFutureRights)sellFutureRights.onclick=()=>beginRightsSale(filmById(currentFilmId));
 const cancelRightsSaleBtn=document.getElementById('cancelRightsSale');if(cancelRightsSaleBtn)cancelRightsSaleBtn.onclick=()=>cancelRightsSale();
 const confirmRightsSaleBtn=document.getElementById('confirmRightsSale');if(confirmRightsSaleBtn)confirmRightsSaleBtn.onclick=()=>confirmRightsSale(filmById(currentFilmId));
 const awardsPushFocused=document.getElementById('awardsPushFocused');if(awardsPushFocused)awardsPushFocused.onclick=()=>commitAwardsPush(filmById(currentFilmId),1);const awardsPushFull=document.getElementById('awardsPushFull');if(awardsPushFull)awardsPushFull.onclick=()=>commitAwardsPush(filmById(currentFilmId),2);
 document.querySelectorAll('[data-streaming-offer]').forEach(b=>b.onclick=()=>acceptStreamingOffer(filmById(currentFilmId),b.dataset.streamingOffer));
 document.querySelectorAll('[data-own-streaming-film]').forEach(b=>b.onclick=()=>assignFilmToOwnedPlatform(filmById(b.dataset.ownStreamingFilm||currentFilmId)));
 const returnOwnedStreamingRights=document.getElementById('returnOwnedStreamingRights');if(returnOwnedStreamingRights)returnOwnedStreamingRights.onclick=()=>releaseFilmFromOwnedPlatform(filmById(currentFilmId));
 document.querySelectorAll('[data-launch-streaming-model]').forEach(b=>b.onclick=()=>launchOwnedStreamingPlatform(b.dataset.launchStreamingModel));
 const windDownStreamingPlatform=document.getElementById('windDownStreamingPlatform');if(windDownStreamingPlatform)windDownStreamingPlatform.onclick=()=>windDownOwnedStreamingPlatform();
 const holdStreamingRightsBtn=document.getElementById('holdStreamingRights');if(holdStreamingRightsBtn)holdStreamingRightsBtn.onclick=()=>holdStreamingRights(filmById(currentFilmId));
 document.querySelectorAll('[data-event-choice]').forEach(b=>b.onclick=()=>resolveEvent(filmById(currentFilmId),b.dataset.eventId,b.dataset.eventChoice));
 const ts=document.getElementById('testScreen');if(ts)ts.onclick=()=>runTestScreen(filmById(currentFilmId));
 const markNoTest=document.getElementById('markNoTest');if(markNoTest)markNoTest.onclick=()=>skipTest(filmById(currentFilmId));
 document.querySelectorAll('[data-post-select]').forEach(b=>b.onclick=()=>selectPostAction(filmById(currentFilmId),b.dataset.postSelect));
 const confirmPostAction=document.getElementById('confirmPostAction');if(confirmPostAction)confirmPostAction.onclick=()=>{const f=filmById(currentFilmId),p=ensurePostState(f);if(p.selectedAction)runPostAction(f,p.selectedAction)};
 const cancelPostSelection=document.getElementById('cancelPostSelection');if(cancelPostSelection)cancelPostSelection.onclick=()=>cancelPostActionSelection(filmById(currentFilmId));
 document.querySelectorAll('[data-music-strategy]').forEach(b=>b.onclick=()=>selectSoundtrackStrategy(filmById(currentFilmId),b.dataset.musicStrategy));
 document.querySelectorAll('[data-music-track]').forEach(b=>b.onclick=()=>selectSoundtrackTrack(filmById(currentFilmId),b.dataset.musicTrack));
 const musicCommit=document.getElementById('commitSoundtrack');if(musicCommit)musicCommit.onclick=()=>commitSoundtrack(filmById(currentFilmId));
 const recoverPostMusic=document.getElementById('recoverPostMusic');if(recoverPostMusic)recoverPostMusic.onclick=()=>{const f=filmById(currentFilmId),p=ensurePostState(f);p.musicDraft={strategy:'original',trackId:null};commitSoundtrack(f)};
 const lockPicture=document.getElementById('lockPicture');if(lockPicture)lockPicture.onclick=()=>lockCut(filmById(currentFilmId));
 document.querySelectorAll('[data-campaign]').forEach(b=>b.onclick=()=>{const f=filmById(currentFilmId);f.campaign=b.dataset.campaign;if(f.releaseWeek!==null&&!validReleaseWeeks(f).includes(f.releaseWeek))f.releaseWeek=null;save();render()});
 document.querySelectorAll('[data-trailer]').forEach(b=>b.onclick=()=>{const f=filmById(currentFilmId);ensureMarketingState(f).trailer=b.dataset.trailer;save();render()});
 document.querySelectorAll('[data-publicity]').forEach(b=>b.onclick=()=>{const f=filmById(currentFilmId);ensureMarketingState(f).publicity=b.dataset.publicity;save();render()});
 document.querySelectorAll('[data-nomination-campaign]').forEach(b=>b.onclick=()=>{const f=filmById(b.dataset.nominationCampaign);if(f)commitAwardsPush(f,+b.dataset.campaignLevel||1)});
 document.querySelectorAll('[data-launch]').forEach(b=>b.onclick=()=>{const f=filmById(currentFilmId);ensureMarketingState(f).launch=b.dataset.launch;if(f.releaseWeek!==null&&!validReleaseWeeks(f).includes(f.releaseWeek))f.releaseWeek=null;save();render()});
 document.querySelectorAll('[data-marketing-choice]').forEach(b=>b.onclick=()=>resolveMarketingIntervention(filmById(currentFilmId),b.dataset.marketingChoice));
 const ms=document.getElementById('marketingSlider');if(ms){ms.oninput=()=>{const f=filmById(currentFilmId);f.marketing=+ms.value;const rd=document.getElementById('marketingRead');if(rd)rd.textContent=money(f.marketing);const li=marketingLeadInfo(f),ld=document.getElementById('marketingLead');if(ld)ld.innerHTML=`<strong>${li.tier}</strong> · minimum ${li.lead}-week build · earliest release Week ${li.earliest}.`;scheduleDraftSave()};ms.onchange=()=>{const f=filmById(currentFilmId);if(f.releaseWeek!==null&&!validReleaseWeeks(f).includes(f.releaseWeek))f.releaseWeek=null;save();render()}}
 document.querySelectorAll('[data-distribution]').forEach(b=>b.onclick=()=>setDistributionStrategy(filmById(currentFilmId),b.dataset.distribution));
 document.querySelectorAll('[data-release-week]').forEach(b=>b.onclick=()=>{const f=filmById(currentFilmId);f.releaseWeek=+b.dataset.releaseWeek;save();render()});
 document.querySelectorAll('[data-move-release-week]').forEach(b=>b.onclick=()=>moveScheduledRelease(filmById(currentFilmId),+b.dataset.moveReleaseWeek));
 const cr=document.getElementById('commitRelease');if(cr)cr.onclick=()=>commitRelease(filmById(currentFilmId));
 const rc=document.getElementById('reviewCard');if(rc)rc.onclick=()=>push(state.screen,{type:'review',id:currentFilmId});
 const peopleSearch=document.getElementById('peopleSearch');if(peopleSearch)peopleSearch.oninput=()=>{state.uiPeopleSearch=peopleSearch.value;save();render()};
 const peopleFilter=document.getElementById('peopleFilter');if(peopleFilter)peopleFilter.onchange=()=>{state.uiPeopleFilter=peopleFilter.value;save();render()};
 const toggleTalentWatch=document.getElementById('toggleTalentWatch');if(toggleTalentWatch&&state.detail?.type==='talent'){const t=talentById(state.detail.id);toggleTalentWatch.onclick=()=>setTalentWatch(t.id,!watchedTalent(t))};
 const dismissNotification=document.getElementById('dismissNotification');if(dismissNotification)dismissNotification.onclick=()=>{markNotification(state.activeNotificationId);save();render()};
 const openNotificationTargetBtn=document.getElementById('openNotificationTarget');if(openNotificationTargetBtn)openNotificationTargetBtn.onclick=()=>openNotificationTarget(state.notifications.find(x=>x.id===state.activeNotificationId));
 document.querySelectorAll('[data-notification]').forEach(b=>b.onclick=()=>openNotificationTarget(state.notifications.find(x=>x.id===b.dataset.notification)));
 document.querySelectorAll('[data-studio-moment-choice]').forEach(b=>b.onclick=()=>studioMomentChoice(b.dataset.studioMomentChoice));
 const legendContinue=document.getElementById('continueLegendUnlock');if(legendContinue)legendContinue.onclick=continueLegendUnlock;
 const continueStudioMomentBtn=document.getElementById('continueStudioMoment');if(continueStudioMomentBtn)continueStudioMomentBtn.onclick=()=>continueStudioMoment();
 const globalAdvanceWeek=document.getElementById('globalAdvanceWeek');if(globalAdvanceWeek)globalAdvanceWeek.onclick=()=>continueTime();
 const globalAdvanceNextEvent=document.getElementById('globalAdvanceNextEvent');if(globalAdvanceNextEvent)globalAdvanceNextEvent.onclick=()=>continueToNextEvent();
 const globalAdvanceNextDecision=document.getElementById('globalAdvanceNextDecision');if(globalAdvanceNextDecision)globalAdvanceNextDecision.onclick=()=>continueToNextDecision();
 const closeNominations=document.getElementById('closeNominations');if(closeNominations)closeNominations.onclick=()=>{state.pendingAwardsNominations=null;if(surfacePendingLegendUnlock()){save();render();return}if(surfacePendingFilmWrap()){save();render();return}if(surfacePendingStudioMoment()){save();render();return}state.screen='studio';state.detail=null;state.uiStudioTab='awards';requestScrollTop();save();render()};
 const advanceCeremony=document.getElementById('advanceCeremony');if(advanceCeremony)advanceCeremony.onclick=()=>{state.awardsCeremonyStep=Math.min((state.pendingCeremony?.categories?.length||0),(state.awardsCeremonyStep||0)+1);save();render()};
 const viewAllCeremony=document.getElementById('viewAllCeremony');if(viewAllCeremony)viewAllCeremony.onclick=()=>{state.awardsCeremonyStep=state.pendingCeremony?.categories?.length||0;save();render()};
 const closeCeremony=document.getElementById('closeCeremony');if(closeCeremony)closeCeremony.onclick=()=>{state.pendingCeremony=null;state.awardsCeremonyStep=0;if(surfacePendingLegendUnlock()){save();render();return}if(surfacePendingFilmWrap()){save();render();return}if(surfacePendingStudioMoment()){save();render();return}state.screen='studio';state.detail=null;state.uiStudioTab='awards';requestScrollTop();save();render()};
 const filmWrapNext=document.getElementById('filmWrapNext');if(filmWrapNext)filmWrapNext.onclick=e=>{e?.stopPropagation?.();advanceFilmWrapChapter(1)};
 const filmWrapBack=document.getElementById('filmWrapBack');if(filmWrapBack)filmWrapBack.onclick=e=>{e?.stopPropagation?.();advanceFilmWrapChapter(-1)};
 const filmWrapSkip=document.getElementById('filmWrapSkip');if(filmWrapSkip)filmWrapSkip.onclick=e=>{e?.stopPropagation?.();state.uiFilmWrapStep=4;requestScrollTop();save();render()};
 const closeFilmWrap=document.getElementById('closeFilmWrap');if(closeFilmWrap)closeFilmWrap.onclick=e=>{e?.stopPropagation?.();continueFilmWrap()};
}
