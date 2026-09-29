// Project Slate UI: slate


function filmPressureBadgesHTML(f){
 const bits=[];
 if(f.stage==='development'){const untested=untestedPrincipalRoles(f);if(untested.length)bits.push('<span class="pill warn">'+untested.length+' lead'+(untested.length===1?'':'s')+' untested</span>')}
 const hostile=typeof lotHostilePackage==='function'?lotHostilePackage(f):null;if(hostile)bits.push('<span class="pill bad">HOSTILE PACKAGE</span>');
 const stories=typeof lotActiveStoriesForFilm==='function'?lotActiveStoriesForFilm(f):[];if(stories.length)bits.push('<span class="pill blue">THE LOT · '+stories.length+' active</span>');
 return bits.length?'<div class="film-pressure-badges">'+bits.join('')+'</div>':'';
}
function lotFilmPressureHTML(f){
 if(typeof lotActiveStoriesForFilm!=='function')return '';
 const stories=lotActiveStoriesForFilm(f),hostile=lotHostilePackage(f),mediation=lotMediationOffer(f);
 if(!stories.length&&!hostile)return '';
 const storyTone=s=>s.type==='friendship'?'good':s.intensity>=3?'bad':'warn';
 let hostileHTML='';
 if(hostile)hostileHTML='<div class="hostile-package-line"><span class="pill bad">HOSTILE PACKAGE</span><strong>'+hostile.a.name+' × '+hostile.b.name+'</strong><span>Grudge '+Math.round(hostile.rel.grudge||0)+' · tension '+Math.round(hostile.rel.tension||0)+'</span></div>';
 const storyHTML=stories.slice(0,3).map(s=>{
  const names=s.participants.map(id=>talentById(id)?.name).filter(Boolean).join(' + '),tone=storyTone(s),label=s.type==='friendship'?'Friendship':s.intensity>=4?'Legendary nonsense':s.intensity>=3?'Escalated':'Active';
  return '<div class="lot-film-story '+tone+'"><div><strong>'+s.headline+'</strong><span>'+names+' · heat '+Math.round(s.heat||0)+'</span></div><span class="pill '+tone+'">'+label+'</span></div>';
 }).join('');
 let med='';
 if(mediation){
  if(mediation.available)med='<div class="lot-mediation"><div><strong>Studio intervention available</strong><span>Bring both sides together before this becomes more expensive than the argument.</span></div><button class="btn" data-lot-mediate="'+mediation.story.id+'">Mediate · '+money(mediation.cost)+'</button></div>';
  else if(mediation.last)med='<div class="lot-mediation result"><div><strong>Last mediation: '+mediation.last.outcome+'</strong><span>'+mediation.last.headline+'</span></div><span class="pill '+(mediation.last.outcome==='backfired'?'bad':mediation.last.outcome==='cooled'?'good':'warn')+'">'+(mediation.exhausted?'No leverage left':'Retry W'+mediation.cooldownUntil)+'</span></div>';
 }
 return '<div class="section-title"><h2>The Lot on this film</h2><span class="small">People stories with real package consequences</span></div><div class="card lot-film-panel '+(hostile?'dangerline':'')+'">'+hostileHTML+'<div class="lot-film-stories">'+storyHTML+'</div>'+med+'</div>';
}

function slateScreen(){
 const tab=state.uiSlateTab||'pipeline',pf=playerFilms(),active=pf.filter(f=>f.stage!=='complete');
 const groups=[
  ['development','Development',active.filter(f=>f.stage==='development')],
  ['production','Production',active.filter(f=>f.stage==='production')],
  ['finishing','Post & Release',active.filter(f=>['post','marketing','scheduled'].includes(f.stage))],
  ['cinema','In Cinemas',active.filter(f=>f.stage==='cinema')]
 ];
 const tabs=sectionTabs([['pipeline','Pipeline',active.length],['development','Development',groups[0][2].length],['production','Production',groups[1][2].length],['finishing','Post / Release',groups[2][2].length],['cinema','Cinemas',groups[3][2].length]],tab,'data-slate-tab');
 const card=f=>`<div class="card click ${f.pendingEvent||f.marketingState?.pending?'attention':''}" data-film="${f.id}"><div class="film-card-layout">${filmKeyArtHTML(f,'thumb')}<div class="film-card-copy"><div class="row"><div><strong>${f.title}</strong><div class="small">${f.genre} · ${fmtStage(f.stage)}</div></div>${stagePill(f)}</div><div class="body" style="margin-top:8px">${filmSummary(f)}</div>${filmPressureBadgesHTML(f)}</div></div></div>`;
 let body='';
 if(tab==='pipeline'){
  body=groups.map(([id,label,list])=>`<div class="section-title"><h2>${label}</h2><span class="small">${list.length}</span></div>${list.length?`<div class="grid cols2">${list.map(card).join('')}</div>`:`<div class="card body">No films currently at this stage.</div>`}`).join('');
 }else{
  const list=groups.find(x=>x[0]===tab)?.[2]||[];
  body=`<div class="section-title"><h2>${groups.find(x=>x[0]===tab)?.[1]||'Slate'}</h2><span class="small">${list.length} films</span></div><div class="grid cols2">${list.length?list.map(card).join(''):`<div class="card body">Nothing currently in this part of the pipeline.</div>`}</div>`;
 }
 return topbar('Slate','Everything currently moving through your studio')+`<main class="screen">${tabs}${body}<div class="card" style="margin-top:14px"><div class="body">Completed films move into <strong>Studio → Library</strong>. New projects begin in <strong>Develop</strong>.</div></div></main>${nav()}`;
}
function filmsScreen(){return slateScreen()}
function filmTimelineEntries(f){
 const items=[];
 (f.history||[]).forEach((text,i)=>{
  const wm=String(text).match(/Week\s+(\d+)/i),week=wm?+wm[1]:null;
  items.push({sort:week?week*7+i*.01:i*.01,label:text,kind:'production'});
 });
 const m=f.marketingState;
 (m?.publicMoments||[]).forEach(x=>items.push({sort:x.day||x.week*7+4,label:`${x.title}: ${momentResultLabel(x.result)}`,kind:'campaign'}));
 const opening=f.weeklyResults?.find(x=>x.week===1&&x.settledRank);
 if(opening)items.push({sort:(opening.worldWeek||f.releaseWeek||0)*7+6,label:`Opened #${opening.settledRank} domestically to ${money(opening.dom)}; ${money(opening.dom+opening.intl)} worldwide.`,kind:'release'});
 if(f.review)items.push({sort:(f.releaseWeek||0)*7+6.2,label:`Reviews landed at ${f.review.critics}% critics / ${f.review.audience}% audience.`,kind:'reception'});
 if(f.completeWeek)items.push({sort:(f.completeDay||f.completeWeek*7+6)+.5,label:`Theatrical run closed at ${money(f.finalGross||0)} worldwide.`,kind:'legacy'});
 (f.careerStories||[]).forEach((text,i)=>items.push({sort:(f.completeDay||f.completeWeek*7+6)+.6+i*.01,label:text,kind:'career'}));
 const seen=new Set();
 return items.filter(x=>{const k=x.label.toLowerCase();if(seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>b.sort-a.sort).slice(0,24);
}
function filmTimelineHTML(f){
 const items=filmTimelineEntries(f);if(!items.length)return '';
 const icon={production:'▣',campaign:'◉',release:'◆',reception:'★',legacy:'■',career:'▲'};
 return `<div class="section-title"><h2>Film history</h2><span class="small">The story of this production, not just the final numbers</span></div><div class="film-timeline">${items.map(x=>`<div class="film-timeline-row timeline-${x.kind}"><span>${icon[x.kind]||'•'}</span><div>${x.label}</div></div>`).join('')}</div>`;
}

function postRecoveryUI(f,err){
 const p=f.post||{},runtime=Number.isFinite(p.runtime)?p.runtime:'—';
 let weak='Cut diagnostics unavailable';
 try{const dims=roughDimensions(f),w=dims.at(-1);if(w)weak=w[0]+' · '+Math.round(w[1]);}catch(_){}
 try{console.error('Project Slate post renderer recovered',err)}catch(_){}
 const musicReady=!!f.soundtrack?.committed;
 return '<div class="card dangerline"><div class="badge">POST-PRODUCTION SAFE MODE</div><div class="body" style="margin-top:8px"><strong>The rough-cut screen hit a recoverable display error.</strong><br>Your career and film state are intact. Use the controls below to clear the checkpoint, or use Back / the main navigation normally.</div></div>'+
 '<div class="grid cols2" style="margin-top:12px"><div class="card"><div class="badge">Current runtime</div><div class="kpi">'+runtime+(runtime==='—'?'':' min')+'</div></div><div class="card"><div class="badge">Weakest current area</div><div class="body">'+weak+'</div></div></div>'+
 (!musicReady?'<button id="recoverPostMusic" class="btn block" style="margin-top:12px">Use original score for recovery</button>':'<div class="card goodline" style="margin-top:12px"><strong>Music plan committed</strong><div class="small">Picture lock is available below.</div></div>')+
 '<button id="lockPicture" class="btn primary block" style="margin-top:12px">Lock current cut and continue</button>';
}
function guardedPostUI(f){
 try{return postUI(f)}
 catch(err){return postRecoveryUI(f,err)}
}

function filmScreen(id){
 const f=filmById(id),s=scriptById(f.scriptId);
 if(!f)return studioScreen();
 let body='';
 if(f.stage==='development')body=developmentUI(f,s);
 else if(f.stage==='production')body=productionUI(f);
 else if(f.stage==='post')body=guardedPostUI(f);
 else if(f.stage==='marketing')body=marketingUI(f);
 else if(f.stage==='scheduled')body=scheduledUI(f);
 else if(f.stage==='cinema')body=cinemaUI(f);
 else if(f.stage==='complete')body=wrapUI(f);
 return topbar('Film',fmtStage(f.stage))+`<main class="screen">${backHead('Film',`${f.genre} · ${fmtStage(f.stage)}`)}${filmIdentityHero(f)}${lotFilmPressureHTML(f)}${body}${filmTimelineHTML(f)}</main>${nav()}`;
}
function castingReadinessData(f){
 ensurePackagingState(f);const roles=ensureFilmRoles(f).filter(r=>r.type==='lead'),support=supportingCastRequirement(f),ids=packageTalentIds(f);
 const assigned=roles.map(role=>{const talentId=castingRoleAssignment(f,role.id),talent=talentId?talentById(talentId):null,audition=talent?auditionForRole(f,talent.id,role.id):null;return {role,talent,audition}}).filter(x=>x.talent);
 const tested=assigned.filter(x=>x.audition).length,hostile=typeof lotHostilePackage==='function'?lotHostilePackage(f):null,pi=typeof projectIntelligenceCastContext==='function'?projectIntelligenceCastContext(f):null;
 return {roles,assigned,tested,support,ids,agreed:ids.filter(id=>f.contracts?.[id]).length,hostile,pi};
}
function castingTalentEvidenceHTML(f,row,data){
 const t=row.talent,a=row.audition,pills=[];
 if(a)pills.push(`<span class="pill ${a.grade==='A'||a.grade==='A-'?'good':'blue'}">Screen test ${a.grade}</span>`);
 else pills.push('<span class="pill warn">UNTESTED</span>');
 if(data.pi?.returning?.some(n=>String(n).toLowerCase()===String(t.name).toLowerCase()))pills.push('<span class="pill blue">LEGACY RETURN</span>');
 if(data.hostile&&(data.hostile.a?.id===t.id||data.hostile.b?.id===t.id))pills.push('<span class="pill bad">HOSTILE PAIRING</span>');
 const window=typeof agencyWindow==='function'?agencyWindow(t,f):null;if(window)pills.push(`<span class="pill">PRIORITY AGENCY · W${window.expiresWeek}</span>`);
 const intro=Object.values(f.lotInfluenceApproaches||{}).find(x=>x?.talentId===t.id);
 if(intro){const ally=talentById(intro.allyId);pills.push(`<span class="pill">INTRODUCED BY ${ally?.name||'COLLABORATOR'}</span>`)}
 return `<div class="casting-ready-person">${portraitHTML(t,'xs')}<div><strong>${t.name}</strong><span>${row.role.name}</span><div class="casting-ready-pills">${pills.join('')}</div></div></div>`;
}
function castingDealsHTML(f){
 const d=castingReadinessData(f),director=f.directorId?talentById(f.directorId):null,leadRows=d.roles.map(role=>{const id=castingRoleAssignment(f,role.id),talent=id?talentById(id):null,audition=talent?auditionForRole(f,talent.id,role.id):null;return {role,talent,audition}}),support=supportingActors(f),contractsExpected=Math.max(d.ids.length,3+d.support.required),lotLabel=d.hostile?'HOSTILE':typeof lotActiveStoriesForFilm==='function'&&lotActiveStoriesForFilm(f).length?'ACTIVE':'CLEAR';
 const contractPill=t=>t?(f.contracts?.[t.id]?'<span class="pill good">TERMS AGREED</span>':'<span class="pill warn">TERMS OPEN</span>'):'';
 const leadHTML=leadRows.map(row=>{const t=row.talent,a=row.audition,term=t?.id&&f.contracts?.[t.id]?.preAgreed?'GUARANTEED RETURN':f.sequelGuarantees?.includes(t?.id)?'GUARANTEED RETURN':f.sequelOptions?.includes(t?.id)?'SEQUEL OPTION':null;return '<div class="casting-deal-row"><div class="casting-deal-role"><span>'+row.role.name+'</span><small>Principal</small></div>'+(t?portraitHTML(t,'xs'):'<div class="casting-deal-open">OPEN</div>')+'<div class="casting-deal-person"><strong>'+(t?t.name:'Not cast')+'</strong><div class="casting-ready-pills">'+(a?'<span class="pill '+(['Outstanding','Strong'].includes(a.grade)?'good':'blue')+'">Screen test '+a.grade+'</span>':'<span class="pill warn">UNTESTED</span>')+(term?'<span class="pill blue">'+term+'</span>':'')+contractPill(t)+'</div></div></div>'}).join('');
 return '<div class="card casting-readiness '+(d.hostile?'dangerline':d.assigned.length===2?'goodline':'')+'"><div class="casting-readiness-head"><div><div class="badge">CASTING & DEALS</div><strong>'+(d.assigned.length===2&&director?'Package assembled':'Build the package')+'</strong><div class="small">Choose the team here. Screen tests reveal role-specific evidence; contracts decide how much risk stays upfront, on the backend and in future sequels.</div></div><span class="pill '+(d.hostile?'bad':'blue')+'">'+lotLabel+' LOT RISK</span></div>'+
 '<div class="casting-readiness-grid"><div><span>Director</span><b>'+(director?'1/1':'0/1')+'</b></div><div><span>Leads</span><b>'+d.assigned.length+'/2</b></div><div><span>Screen tested</span><b>'+d.tested+'/'+(d.assigned.length||2)+'</b></div><div><span>Supporting</span><b>'+d.support.selected+'/'+(d.support.required||0)+'</b></div><div><span>Contracts</span><b>'+d.agreed+'/'+contractsExpected+'</b></div></div>'+
 '<div class="casting-deal-list"><div class="casting-deal-row"><div class="casting-deal-role"><span>Director</span><small>Creative lead</small></div>'+(director?portraitHTML(director,'xs'):'<div class="casting-deal-open">OPEN</div>')+'<div class="casting-deal-person"><strong>'+(director?director.name:'Not attached')+'</strong><div class="casting-ready-pills">'+contractPill(director)+'</div></div></div>'+leadHTML+
 '<div class="casting-deal-row"><div class="casting-deal-role"><span>Supporting</span><small>'+d.support.label+'</small></div><div class="casting-deal-open">'+support.length+'/'+d.support.required+'</div><div class="casting-deal-person"><strong>'+(support.length?support.map(x=>x.name).join(' · '):d.support.required?'Still open':'Optional')+'</strong><div class="small">'+(d.support.complete?'Ensemble requirement satisfied':'More supporting casting required before greenlight')+'</div></div></div></div>'+
 (d.hostile?'<div class="casting-readiness-risk"><strong>Hostile package:</strong> '+d.hostile.a.name+' × '+d.hostile.b.name+'. This risk follows the package into production unless you mediate or recast.</div>':'')+
 '<div class="grid cols4 casting-deal-actions"><button id="chooseDirector" class="btn">'+(director?'Change director':'Choose director')+'</button><button id="chooseCast" class="btn">Cast leads ('+f.cast.length+'/2)</button><button id="chooseSupportingCast" class="btn '+(!d.support.complete?'attention':'')+'">Supporting ('+support.length+'/'+d.support.max+')</button><button id="reviewContracts" class="btn '+(d.ids.length&&!allContractsAgreed(f)?'attention':'')+'" '+(!director||f.cast.length<2?'disabled':'')+'>Contracts '+d.agreed+'/'+contractsExpected+'</button></div></div>';
}
function castingReadinessHTML(f){return castingDealsHTML(f)}
function developmentUI(f,s){
 ensurePackagingState(f);ensureProductionDepth(f);
 const d=f.directorId?talentById(f.directorId):null,cast=f.cast.map(talentById),support=supportingActors(f),supportReq=supportingCastRequirement(f),range=naturalRange(s),c=f.creative||defaultCreative(),fit=packageFitSummary(f);
 const ids=packageTalentIds(f),agreed=ids.filter(id=>f.contracts[id]).length,totalTerms=ids.length,expectedTerms=Math.max(totalTerms,3+supportReq.required);
 const min=Math.max(2,Math.floor(s.naturalBudget*.5)),max=Math.ceil(s.naturalBudget*1.6),packageFees=agreedUpfront(f),depthCost=productionDepthCost(f),cashAfter=state.cash-f.budget-packageFees-depthCost;
 const choice=(field,value,label,desc)=>{const selected=c[field]===value;return `<button class="card selection-card ${selected?'selected-choice':''}" data-creative-field="${field}" data-creative-value="${value}" aria-pressed="${selected?'true':'false'}" ${f.paused?'disabled':''}>${selected?'<div class="selected-choice-badge">✓ Selected</div>':''}<strong>${label}</strong><div class="small" style="margin-top:5px">${desc}</div></button>`};
 const returningBusy=returningTalentToWatch(f),watch=availabilityWatchForFilm(f);
 if(f.paused){
  return `<div class="hero"><div class="badge">Development on hold</div><div class="quote" style="margin-top:8px">${s.logline}</div><div class="body" style="margin-top:10px">The project stays on your slate without generating packaging decisions. Carrying cost: <strong>${heldProjectCostLabel()}</strong> until development resumes.</div></div>
  ${castingDealsHTML(f)}
  ${returningBusy.length?`<div class="card attention" style="margin-top:12px"><strong>Returning cast unavailable</strong><div class="body" style="margin-top:6px">${returningBusy.map(t=>`${t.name} · busy through W${t.busyUntil}`).join('<br>')}</div>${watch?`<div class="row" style="margin-top:10px"><span class="pill good">Availability watch active</span><button id="cancelAvailabilityWatch" class="btn">Cancel watch</button></div>`:`<button id="watchReturningAvailability" class="btn primary block" style="margin-top:10px">Notify me when returning cast are available</button>`}</div>`:''}
  <button id="toggleHold" class="btn primary block" style="margin-top:14px">Resume Development</button>`;
 }
 const cov=scriptCoverage(s),writer=writerById(s.writerId),producer=producerStrategy(f),effects=effectsApproach(f);
 return `<div class="hero"><div class="quote">${s.logline}</div><div style="margin-top:8px"><span class="pill">Recommended production ${money(range[0])}–${money(range[1])}</span><span class="pill">${writer?.name||'Unknown writer'}</span><span class="pill ${cov.readiness==='Packaging-ready'?'good':'blue'}">${cov.readiness}</span></div></div>
 ${castingDealsHTML(f)}
 <div class="row" style="margin-top:10px;justify-content:flex-end"><button id="toggleHold" class="btn ghost">Hold project</button></div>
 <div class="section-title"><h2>Production budget</h2><span class="small">Recommended ${money(range[0])}–${money(range[1])}</span></div>
 <div class="card"><div class="row"><span>Committed production spend</span><strong id="budgetRead">${money(f.budget)}</strong></div><input id="budgetSlider" class="range" type="range" min="${min}" max="${max}" step="0.5" value="${f.budget}" style="margin-top:14px"><div class="range-labels"><span>${money(min)}</span><span>${money(max)}</span></div><div id="budgetAdvice" class="body" style="margin-top:10px">${budgetAdvice(f.budget,s)}</div><div class="cast-scale-note"><strong>${supportReq.label}</strong><span>${supportReq.required===0?'At this scale a third performer is optional.':supportReq.required===1?'This scale requires one supporting performer in addition to the two leads.':'At event scale the film must carry four principal performers: two leads and two supporting roles.'}</span></div><div id="cashAfter" class="small" style="margin-top:8px">Estimated cash after package + production: ${money(cashAfter)}</div></div>
 <div class="section-title"><h2>Production leadership</h2><span class="small">One producer strategy · explicit trade-off</span></div><div class="grid cols3">${Object.entries(PRODUCER_STRATEGIES).map(([id,p])=>{const selected=f.producerStrategy===id;return `<button class="card selection-card ${selected?'selected-choice':''}" data-producer-strategy="${id}" aria-pressed="${selected?'true':'false'}">${selected?'<div class="selected-choice-badge">✓ Selected</div>':''}<div class="row"><strong>${p.name}</strong><span class="pill">${money(p.cost)}</span></div><div class="small" style="margin-top:7px">${p.desc}</div></button>`}).join('')}</div>
 <div class="section-title"><h2>Effects approach</h2><span class="small">Paid as a percentage of production budget</span></div><div class="grid cols3">${Object.entries(EFFECTS_APPROACHES).map(([id,e])=>{const selected=f.effectsApproach===id;return `<button class="card selection-card ${selected?'selected-choice':''}" data-effects-approach="${id}" aria-pressed="${selected?'true':'false'}">${selected?'<div class="selected-choice-badge">✓ Selected</div>':''}<div class="row"><strong>${e.name}</strong><span class="pill">${Math.round(e.costRate*1000)/10}% · ${money(f.budget*e.costRate)}</span></div><div class="small" style="margin-top:7px">${e.desc}</div></button>`}).join('')}</div>
   ${productionChoiceFeedbackHTML(f)}\n  <div class="section-title"><h2>Creative brief</h2><span class="small">These choices also change which talent fits the project</span></div>
 <div class="small" style="margin-bottom:6px">Positioning</div><div class="grid cols3">${choice('positioning','commercial','Commercial','Maximise accessibility and momentum.')}${choice('positioning','balanced','Balanced','Protect both craft and broad appeal.')}${choice('positioning','prestige','Prestige','Prioritise creative reputation and nuance.')}</div>
 <div class="small" style="margin:12px 0 6px">Tone</div><div class="grid cols3">${choice('tone','grounded','Grounded','Performance and realism first.')}${choice('tone','balanced','Balanced','Stay close to the screenplay’s centre.')}${choice('tone','heightened','Heightened','Push energy, style and genre elements.')}</div>
 <div class="small" style="margin:12px 0 6px">Audience rating</div><div class="grid cols3">${choice('rating','broad','Broad','Wider audience, some creative limits.')}${choice('rating','mainstream','Mainstream','The default middle ground.')}${choice('rating','mature','Mature','Narrower reach, fewer content compromises.')}</div>
 <div class="small" style="margin:12px 0 6px">Production emphasis</div><div class="grid cols3">${choice('emphasis','performance','Performance','Spend creative attention on actors.')}${choice('emphasis','balanced','Balanced','No single department dominates.')}${choice('emphasis','spectacle','Spectacle','Prioritise scale and technical impact.')}</div>
 <div class="card" style="margin-top:12px"><div class="row"><strong>Additional production package</strong><strong>${money(depthCost)}</strong></div><div class="small" style="margin-top:6px">${producer.name} + ${effects.name}${support.length?` + ${support.map(x=>x.name).join(' + ')}`:''}. Supporting performers can lift ensemble work, chemistry and publicity reach; their talent terms are included separately in contracts.</div></div>
 <div class="card" style="margin-top:12px"><div class="body">Putting a film on hold now costs ${heldProjectCostLabel()}. This keeps waiting for talent or cash meaningful without forcing you to abandon a project.</div></div>
 <button id="greenlight" class="btn primary block" style="margin-top:14px" ${!d||cast.length<2||!supportReq.complete||!allContractsAgreed(f)?'disabled':''}>${!supportReq.complete?`Cast ${supportReq.required-supportReq.selected} more supporting performer${supportReq.required-supportReq.selected===1?'':'s'} before greenlight`:d&&cast.length===2&&!allContractsAgreed(f)?'Agree all talent terms before greenlight':'Review Greenlight'}</button>`;
}
function talentFeeRange(t){
 ensureTalentMarketEconomy(t);const heat=(t.momentum||60)>=86?1.12:(t.momentum||60)>=74?1.05:(t.momentum||60)<48?.92:1,mid=(t.fee||.5)*heat,step=mid>=10?2:mid>=4?1:.5;
 const round=v=>Math.max(.1,Math.round(v/step)*step),lo=round(mid*.84),hi=Math.max(lo+step,round(mid*1.18));
 return [lo,hi];
}
function directorScoutingView(t,f){
 const trueFit=directorProjectFit(t,f),confidence=scoutingConfidence(t),spread=(confidence==='High'?7:confidence==='Moderate'?12:19)*scoutingPrecisionMultiplier(),r=makeRng(hash(state.seed+'|director-scout|'+f.id+'|'+t.id)),estimate=clamp(trueFit+(r()-.5)*2*spread,20,96);
 return {estimate,confidence,source:'Scouting'};
}
function castingScoutSignal(t,f,roleId=null){
 const v=t.type==='Director'?directorScoutingView(t,f):actorScoutingView(t,f,roleId),tested=t.type==='Actor'?auditionForRole(f,t.id,roleId||castingTargetRole(f).id):null,score=v.estimate;
 const label=tested?tested.grade+' screen test':score>=80?'Promising scout read':score>=66?'Plausible scout read':score>=52?'Uncertain scout read':'Stretch on paper';
 const cls=tested&&['Outstanding','Strong'].includes(tested.grade)?'good':tested&&tested.grade==='Poor'?'bad':score>=80?'good':score<52?'warn':'blue';
 return {label,cls,confidence:v.confidence,source:tested?'Screen test':'Scouting'};
}
function pickerList(type,f,roleId=null){
 const sort=state.uiPickerSort||'market',availableOnly=!!state.uiPickerAvailable,maxFee=Number(state.uiPickerMaxFee)||0;
 let list=state.talent.filter(t=>t.type===type&&!t.retired);list.forEach(ensureTalentMarketEconomy);
 if(availableOnly)list=list.filter(t=>!talentUnavailableForFilm(t,f));
 if(maxFee>0)list=list.filter(t=>talentFeeRange(t)[0]<=maxFee);
 list.sort((a,b)=>{
  if(sort==='market')return type==='Actor'?actorIndustryShortlistScore(b)-actorIndustryShortlistScore(a):((b.momentum||0)*.45+(b.craft||0)*.35+(b.commercial||0)*.20)-((a.momentum||0)*.45+(a.craft||0)*.35+(a.commercial||0)*.20);
  if(sort==='momentum')return (b.momentum||0)-(a.momentum||0);
  if(sort==='name')return a.name.localeCompare(b.name);
  return 0;
 });
 return list;
}
function pickerControls(type){
 const sort=state.uiPickerSort||'market',fee=Number(state.uiPickerMaxFee)||0;
 return '<div class="talent-filter-panel"><div class="talent-filter-grid compact">'+
 '<label><span>Sort</span><select id="pickerSort" class="select"><option value="market" '+(sort==='market'?'selected':'')+'>Industry shortlist</option><option value="momentum" '+(sort==='momentum'?'selected':'')+'>Career heat</option><option value="name" '+(sort==='name'?'selected':'')+'>Name · A → Z</option></select></label>'+
 '<label><span>Budget range</span><select id="pickerFee" class="select"><option value="0" '+(fee===0?'selected':'')+'>Any likely fee</option><option value="1" '+(fee===1?'selected':'')+'>Likely from $1m or less</option><option value="3" '+(fee===3?'selected':'')+'>Likely from $3m or less</option><option value="5" '+(fee===5?'selected':'')+'>Likely from $5m or less</option><option value="10" '+(fee===10?'selected':'')+'>Likely from $10m or less</option><option value="20" '+(fee===20?'selected':'')+'>Likely from $20m or less</option></select></label>'+
 '</div><div class="talent-filter-foot"><label class="talent-available-toggle"><input id="pickerAvailable" type="checkbox" '+(state.uiPickerAvailable?'checked':'')+'> Available only</label><span class="small">Fit is deliberately not sortable. Screen tests turn scouting uncertainty into evidence.</span><button class="btn ghost" id="pickerResetFilters">Reset filters</button></div></div>';
}
function directorPicker(f){
 const available=pickerList('Director',f),selected=f.directorId?talentById(f.directorId):null;
 return topbar('Choose Director',f.title)+'<main class="screen pickerpad">'+backHead('Director Shortlist','Market knowledge first · exact project fit remains an executive judgement')+
 pickerControls('Director')+
 '<div class="grid">'+available.map(t=>{ensureTalentCareer(t);const scout=castingScoutSignal(t,f),range=talentFeeRange(t),lotSignal=typeof lotCandidateCastingSignal==='function'?lotCandidateCastingSignal(t,f):null;return '<div class="card"><div class="talenthead"><div class="talentidentity">'+portraitHTML(t,'sm')+'<div><strong>'+t.name+'</strong><div class="small">'+t.tag+' · '+t.careerState+'</div><button class="talent-profile-link" data-talent="'+t.id+'">View full profile · Lot history →</button></div></div><div style="text-align:right"><strong>'+money(range[0])+'–'+money(range[1])+'</strong><div class="small">expected negotiation</div></div></div><div style="margin-top:8px"><span class="pill '+scout.cls+'">'+scout.label+'</span><span class="pill">'+scout.confidence+' scouting confidence</span><span class="pill">Career heat '+momentumIndicator(t)+'</span>'+(talentUnavailableForFilm(t,f)?'<span class="pill bad">Unavailable</span>':'')+'</div>'+(lotSignal?'<div class="lot-casting-signal '+lotSignal.tone+'"><strong>'+lotSignal.label+'</strong><span>'+lotSignal.text+'</span></div>':'')+'<div class="body" style="margin-top:8px">'+directorBio(t)+'</div><button class="btn block '+(f.directorId===t.id?'primary':'')+'" style="margin-top:10px" data-attach-director="'+t.id+'" '+(talentUnavailableForFilm(t,f)?'disabled':'')+'>'+(f.directorId===t.id?'Attached':'Attach')+'</button></div>'}).join('')+'</div>'+
 '</main><div class="pickerbar"><div class="pickerbar-inner"><div><strong>'+(selected?selected.name:'No director selected')+'</strong><div class="small">'+(selected?'Attached to '+f.title:'Choose one director, then continue.')+'</div></div><button id="pickerContinue" class="btn primary" '+(selected?'':'disabled')+'>Continue</button></div></div>'+nav();
}
function contractsScreen(f){
 ensurePackagingState(f);const ids=packageTalentIds(f),agreed=ids.filter(id=>f.contracts[id]).length;
 return topbar('Contracts',f.title)+'<main class="screen pickerpad">'+backHead('Talent Terms',agreed+'/'+ids.length+' agreements complete')+
 '<div class="card"><div class="body"><strong>Build the deal rather than choose a preset.</strong> More backend lowers the guaranteed upfront fee, with diminishing returns. Actor franchise terms are separate: an option buys flexibility; a guaranteed return binds the performer to the next sequel if you make one.</div></div>'+
 (supportingCastRequirement(f).complete?'':'<div class="card attention" style="margin-top:12px"><strong>Cast package incomplete</strong><div class="body" style="margin-top:6px">You can negotiate attached talent now, but greenlight stays locked until the ensemble requirement is complete.</div></div>')+
 '<div class="grid contract-negotiation-grid" style="margin-top:12px">'+ids.map(id=>{const t=talentById(id),set=contractOffers(f,t),draft=contractDraftFor(f,id),quote=contractQuote(f,t,draft),current=f.contracts[id],range=talentFeeRange(t),locked=!!draft.locked||!!current?.preAgreed,maxBackend=contractBackendMax(t),future=quote.futureFee?money(quote.futureFee)+(quote.futureBackend?' + '+quote.futureBackend+'% backend':''):quote.franchiseTerm==='exercise-option'?'Pre-agreed on previous film':quote.sequelOption||quote.franchiseTerm==='option'?'Sequel option · legacy return terms':'No future commitment';
  let franchise='';
  if(t.type==='Actor'&&!set.heldSequelOption&&!set.heldGuarantee)franchise='<label class="contract-field"><span>Next-sequel term</span><select class="select" data-contract-franchise="'+id+'"><option value="none" '+(draft.franchiseTerm==='none'?'selected':'')+'>No future term</option><option value="option" '+(draft.franchiseTerm==='option'?'selected':'')+'>Studio sequel option</option><option value="guaranteed" '+(draft.franchiseTerm==='guaranteed'?'selected':'')+'>Guaranteed return</option></select></label>';
  else if(set.heldSequelOption)franchise='<div class="contract-field"><span>Current franchise term</span><strong>Exercising held sequel option</strong></div>';
  else if(set.heldGuarantee)franchise='<div class="contract-field"><span>Current franchise term</span><strong>Guaranteed return · already attached</strong></div>';
  const credit=t.type==='Director'?'<label class="contract-credit"><input type="checkbox" data-contract-credit="'+id+'" '+(draft.producerCredit?'checked':'')+' '+(locked?'disabled':'')+'> Producer credit · reduces upfront, grants extra creative authority</label>':'';
  return '<div class="card contract-negotiation '+(current?'goodline':'')+'"><div class="talenthead"><div class="talentidentity">'+portraitHTML(t,'sm')+'<div><strong>'+t.name+'</strong><div class="small">'+t.type+' · '+relationshipLabel(t.relationship||0)+'</div></div></div><div style="text-align:right"><strong>'+money(range[0])+'–'+money(range[1])+'</strong><div class="small">pre-negotiation range</div></div></div><div class="body" style="margin-top:8px">'+set.note+'</div>'+
  '<div class="contract-builder"><label class="contract-field"><span>Backend · <b id="contractBackendRead-'+id+'">'+quote.backend+'%</b></span><input class="range" type="range" min="0" max="'+maxBackend+'" step="0.5" value="'+draft.backend+'" data-contract-backend="'+id+'" '+(set.heldSequelOption||locked?'disabled':'')+'><small>Higher participation reduces the cash guarantee now, but costs more if the film succeeds.</small></label>'+franchise+credit+'</div>'+
  '<div class="contract-quote"><div><span>Upfront guarantee</span><strong id="contractUpfront-'+id+'">'+money(quote.upfront)+'</strong></div><div><span>Backend</span><strong id="contractBackendQuote-'+id+'">'+quote.backend+'%</strong></div><div><span>Future sequel</span><strong id="contractFuture-'+id+'">'+future+'</strong></div></div>'+
  (locked?'<div class="small contract-locked">These terms were guaranteed on the previous film and are already binding.</div>':'<button class="btn primary block" data-contract-accept="'+id+'" style="margin-top:10px">'+(current?'Update agreement':'Agree terms')+'</button>')+'</div>';
 }).join('')+'</div></main><div class="pickerbar"><div class="pickerbar-inner"><div><strong>'+agreed+'/'+ids.length+' agreements</strong><div class="small">Upfront talent commitment: '+money(agreedUpfront(f))+' · backend exposure '+contractBackendPct(f)+'%</div></div><button id="contractsContinue" class="btn primary" '+(agreed===ids.length?'':'disabled')+'>Return to film</button></div></div>'+nav();
}
function productionPulseLabel(f){
 const ps=f.productionState||{schedule:0,morale:65};
 return {schedule:ps.schedule>1?'Behind schedule':ps.schedule===1?'Slightly behind':'On schedule',morale:ps.morale>=80?'Excellent':ps.morale>=65?'Good':ps.morale>=50?'Mixed':'Strained'};
}
function productionUI(f){
 f.productionState=f.productionState||{schedule:0,morale:65,extraSpend:0,cleanWeeks:0,notes:[]};
 const ev=f.pendingEvent?f.events.find(e=>e.id===f.pendingEvent):null,pulse=productionPulseLabel(f),resolved=f.events.filter(e=>e.resolved).slice(-3),creative=!!ev?.creativeFork;
 return `<div class="grid cols4"><div class="card"><div class="badge">Production week</div><div class="kpi">${f.productionWeek}</div></div><div class="card"><div class="badge">Expected wrap</div><div class="kpi">W${f.productionEnd}</div></div><div class="card"><div class="badge">Schedule</div><div class="kpi" style="font-size:17px">${pulse.schedule}</div></div><div class="card"><div class="badge">Set morale</div><div class="kpi">${pulse.morale}</div></div></div>
 ${ev?`<div class="section-title"><h2>${creative?'Which film are you making?':'Decision required'}</h2><span class="small">${creative?'One creative direction call · no spend attached':''}</span></div><div class="card ${creative?'goodline':'attention'}"><div class="row"><span class="pill ${creative?'blue':'warn'}">${creative?'Dailies discovery':'Production'}</span><span class="small">Week ${f.productionWeek}</span></div><div class="quote" style="margin-top:8px">${ev.title}</div><div class="body" style="margin-top:8px">${ev.text}</div>${ev.why?`<div class="small" style="margin-top:8px"><strong>${creative?'What the director is asking:':'Why this is happening:'}</strong> ${ev.why}</div>`:''}${ev.authorityNote?`<div class="card goodline" style="margin-top:10px"><div class="small"><strong>Producer-credit authority:</strong> ${ev.authorityNote}</div></div>`:''}<div class="grid" style="margin-top:12px">${ev.choices.map(c=>`<button class="btn" data-event-choice="${c[0]}" data-event-id="${ev.id}" ${ev.lockedChoices?.includes(c[0])?'disabled':''}>${c[1]}${ev.lockedChoices?.includes(c[0])?' · director has final say':''}</button>`).join('')}</div></div>`:`<div class="section-title"><h2>Dailies report</h2></div><div class="card ${f.metrics.stability>=76?'goodline':''}"><div class="body">${productionStatusText(f)}</div></div>`}
 ${resolved.length?`<div class="section-title"><h2>Shoot history</h2><span class="small">${f.productionState.cleanWeeks||0} calm weeks</span></div><div class="card">${resolved.map(e=>`<div class="listrow"><div><strong>${e.title}</strong><div class="small">${e.choiceLabel||e.choice||'resolved'}</div></div><span class="small">PW${e.week}</span></div>`).join('')}</div>`:''}
 ${ensureShootJournal(f).length?`<div class="section-title"><h2>From the dailies</h2><span class="small">Observations from the shoot</span></div><div class="card">${ensureShootJournal(f).slice(-4).reverse().map(x=>`<div class="listrow"><div class="body">${x.text}</div><span class="small">PW${x.productionWeek}</span></div>`).join('')}</div>`:''}
 <div class="section-title"><h2>Production package</h2></div><div class="card"><div class="listrow"><span>Producer strategy</span><strong>${producerStrategy(f).name}</strong></div><div class="listrow"><span>Effects approach</span><strong>${effectsApproach(f).name}</strong></div><div class="listrow"><span>Additional package spend</span><strong>${money(f.productionDepthSpend??0)}</strong></div></div>
 <div class="section-title"><h2>Attached talent</h2></div><div class="grid cols2"><div class="card click" data-talent="${f.directorId}"><strong>${talentById(f.directorId).name}</strong><div class="small">Director</div></div>${f.cast.map(id=>`<div class="card click" data-talent="${id}"><strong>${talentById(id).name}</strong><div class="small">Principal cast</div></div>`).join('')}${f.supportingCastId?`<div class="card click" data-talent="${f.supportingCastId}"><strong>${talentById(f.supportingCastId).name}</strong><div class="small">Supporting cast</div></div>`:''}</div>`;
}
function productionStatusText(f){
 const m=f.metrics,ps=f.productionState||{},lines=[];
 if(f.productionWeek===1)return 'Principal photography has started. The studio has too little footage for a confident read.';
 if(m.performances>84)lines.push('Performances are drawing particularly strong notices from the dailies.');
 else if(m.performances<58)lines.push('The performance work remains less convincing than the package suggested.');
 if(m.technical>84)lines.push('The technical departments are delivering unusually polished material.');
 else if(m.technical<58)lines.push('Technical inconsistency is visible in the footage and may create work later.');
 if(m.clarity<58)lines.push('The assembled scenes are raising story-clarity questions that may need pickups or editorial solutions.');
 if(m.stability<58)lines.push('The shoot is fragile: small disruptions are having an outsized effect on the unit.');
 if(ps.schedule>0)lines.push(`The current wrap estimate has slipped by ${ps.schedule} week${ps.schedule===1?'':'s'}.`);
 if(!lines.length)lines.push('Production is progressing without a major studio-level problem. The footage is broadly tracking the intended plan.');
 return lines.slice(0,3).join(' ');
}
function postUI(f){
 const p=ensurePostState(f),rough=makeRoughCut(f),view=postDirectorView(f),actions=availablePostActions(f),remaining=p.maxActions-p.actions.length,discoveries=buildPostDiscoveries(f),selected=actions.find(a=>a.id===p.selectedAction)||null,selectedTargets=selected?postActionTargets(f,selected.id):[];
 const segments=p.testSegments?Object.entries(p.testSegments).sort((a,b)=>b[1]-a[1]):[];
 const sev=d=>d.severity==='critical'?'bad':d.severity==='major'?'warn':d.severity==='minor'?'good':'blue';
 return `<div class="posthero"><div><div class="badge">CUT ${p.cutVersion||1}</div><div class="quote">${postDiscoveryHeadline(f)}</div><div class="small">${p.runtime} minutes · target around ${p.targetRuntime} · ${remaining} major intervention${remaining===1?'':'s'} remaining</div></div><div class="postconfidence"><strong>${f.tested===true?Math.round(f.testScore)+'%':f.tested===false?'UNTESTED':'NO AUDIENCE DATA'}</strong><span>${f.tested===true?'test-screen average':f.tested===false?'studio trusted the cut':'audience evidence'}</span></div></div>
 ${creativeDirectionCard(f,'post')}
 <div class="section-title"><h2>What the cut is telling you</h2><span class="small">Specific problems, not a single quality score</span></div><div class="grid cols2">${discoveries.map(d=>`<div class="card ${d.severity==='critical'?'dangerline':d.severity==='minor'?'goodline':''}"><div class="row"><strong>${d.title}</strong><span class="pill ${sev(d)}">${d.severity}</span></div><div class="body" style="margin-top:8px">${d.text}</div><div class="small" style="margin-top:8px">Likely response: ${availablePostActions(f).find(a=>a.id===d.action)?.label||'Editorial judgement'}</div></div>`).join('')}</div>
 <div class="card ${view.action==='lock'?'goodline':''}" style="margin-top:12px"><div class="badge">Director's view</div><div class="body" style="margin-top:6px">${view.text}</div></div>
 ${p.lastActionResult?`<div class="post-result-card goodline"><div class="badge">CUT ${p.lastActionResult.cutVersion} · LATEST INTERVENTION COMPLETE</div><strong>${p.lastActionResult.label}</strong><div class="small" style="margin-top:6px">Targeted: ${p.lastActionResult.targets.join(' · ')}</div>${p.lastActionResult.resultChanges.length?`<div class="post-result-changes">${p.lastActionResult.resultChanges.map(x=>`<span class="pill good">${x}</span>`).join('')}</div>`:''}</div>`:''}
 ${f.tested===null?`<div class="section-title"><h2>Put it in front of an audience?</h2><span class="small">Optional · $0.45m</span></div><div class="card"><div class="body">A test screening does not change the film. It gives you evidence about which audience segments are connecting before you spend the remaining post budget.</div><div class="grid cols2" style="margin-top:10px"><button id="testScreen" class="btn primary">Run test screening · $0.45m</button><button id="markNoTest" class="btn">Trust the cut</button></div></div>`:
 f.tested===true?`<div class="section-title"><h2>Test-screen evidence</h2><span class="small">Week ${p.testWeek}</span></div><div class="grid">${segments.map(([name,score])=>`<div class="card ${score>=76?'goodline':score<55?'dangerline':''}"><div class="row"><strong>${name}</strong><strong>${Math.round(score)}%</strong></div><div class="screenbar"><span style="width:${score}%"></span></div><div class="small" style="margin-top:5px">${score>=76?'Strong response':score>=62?'Positive / mixed':score>=52?'Mixed':'Weak response'}</div></div>`).join('')}</div>`:
 `<div class="section-title"><h2>Audience research</h2></div><div class="card"><div class="body">You chose not to test. The remaining decisions rely on the cut, the creative team and your own judgement.</div></div>`}
 ${f.directorAuthority?.producerCredit?`<div class="card goodline" style="margin-top:12px"><div class="small"><strong>Producer credit:</strong> ${talentById(f.directorId).name} has enhanced creative authority and may exercise final say on a major intervention.</div></div>`:''}
 <div class="section-title"><h2>Choose what to intervene on</h2><span class="small">Select first, then confirm</span></div>${remaining>0?`<div class="grid cols2">${actions.map(a=>{const targets=postActionTargets(f,a.id);const isSelected=p.selectedAction===a.id;return `<button class="card selection-card post-action-choice ${isSelected?'selected-choice selected-post-action':''} ${view.action===a.id&&!isSelected?'goodline':''}" data-post-select="${a.id}" aria-pressed="${isSelected?'true':'false'}">${isSelected?'<div class="selected-choice-badge">✓ Selected intervention</div>':''}<div class="row"><strong>${a.label}</strong><span class="pill">${money(a.cost)} · ${a.time}w</span></div><div class="small" style="margin-top:6px">${a.desc}</div><div class="post-targets">${targets.map(t=>`<span class="pill ${t.severity==='critical'?'bad':t.severity==='major'?'warn':'blue'}">Targets: ${t.title}</span>`).join('')}</div>${view.action===a.id?'<div class="small" style="margin-top:7px"><strong>Director recommends this</strong></div>':''}</button>`}).join('')}</div>
 ${selected?`<div class="post-confirm-card"><div class="badge">SELECTED INTERVENTION</div><div class="row" style="margin-top:5px"><strong>${selected.label}</strong><span class="pill">${money(selected.cost)} · ${selected.time} week</span></div><div class="body" style="margin-top:8px">${postActionTradeoff(selected.id)}</div><div class="small" style="margin-top:8px"><strong>Problems you are targeting:</strong> ${selectedTargets.map(x=>x.title).join(' · ')}</div><div class="grid cols2" style="margin-top:12px"><button id="cancelPostSelection" class="btn">Choose another intervention</button><button id="confirmPostAction" class="btn primary">Confirm ${selected.label}</button></div></div>`:`<div class="card body post-selection-hint">Nothing has been committed yet. Tap an intervention above to see exactly which cut problems it addresses and what trade-off it carries.</div>`}`:`<div class="card body">The studio has used its two major intervention windows. You can still lock the film as it stands.</div>`}
 ${p.actions.length?`<div class="section-title"><h2>Cut history</h2></div><div class="card">${p.actions.map((a,i)=>`<div class="listrow"><div><strong>Cut ${i+2} · ${a.label}</strong><div class="small">Week ${a.week}${a.targets?.length?` · targeted ${a.targets.join(' / ')}`:''}</div>${a.resultChanges?.length?`<div class="small" style="margin-top:4px">${a.resultChanges.join(' · ')}</div>`:''}</div><span>${money(a.cost)}</span></div>`).join('')}</div>`:''}
 ${soundtrackPostUI(f)}
 <button id="lockPicture" class="btn primary block" style="margin-top:14px">Lock final cut · ${p.runtime} minutes</button>`;
}
function marketingUI(f){
 ensureDistributionState(f);const m=ensureMarketingState(f),rec=marketingRecommended(f),max=Math.max(0,Math.min(state.cash,rec*1.8)),lead=marketingLeadInfo(f),weeks=validReleaseWeeks(f),festival=festivalPotentialLabel(f),dist=distributionPlan(f),lotOpp=typeof lotCampaignOpportunity==='function'?lotCampaignOpportunity(f):null,lotCost=typeof lotCampaignAngleCost==='function'?lotCampaignAngleCost(f):0;
 if(f.releaseWeek!==null&&!weeks.includes(f.releaseWeek))f.releaseWeek=null;
 const extra=publicityCost(f)+launchCost(f)+lotCost,totalPreview=distributionCostPreview(f)+lotCost;
 return `${creativeDirectionCard(f,'marketing')}<div class="section-title"><h2>Campaign positioning</h2></div><div class="grid cols3">
 ${[['authentic','Authentic','Sell the film audiences are actually going to see.'],['event','Event','Build a larger cultural moment; needs more lead time and raises expectations.'],['mystery','Mystery','Reveal less, preserve flexibility and sell curiosity.']].map(c=>{const pv=campaignPositionPreview(f,c[0]);const selected=f.campaign===c[0];return `<button class="card selection-card marketing-choice ${selected?'selected-choice':''}" data-campaign="${c[0]}" aria-pressed="${selected?'true':'false'}">${selected?'<div class="selected-choice-badge">✓ Selected campaign</div>':''}<div class="row"><strong>${c[1]}</strong><span class="pill ${pv.cls}">${pv.label}</span></div><div class="small" style="margin-top:6px">${c[2]}</div><div class="promise-preview">${pv.text}</div></button>`}).join('')}</div>
 <div class="section-title"><h2>Trailer strategy</h2><span class="small">What promise are you making?</span></div><div class="grid cols2">
 ${[['concept','Concept-first'],['character','Character-first'],['spectacle','Spectacle-first'],['star','Star-first']].map(([id,label])=>{const pv=trailerPromisePreview(f,id);const selected=m.trailer===id;return `<button class="card selection-card marketing-choice ${selected?'selected-choice':''}" data-trailer="${id}" aria-pressed="${selected?'true':'false'}">${selected?'<div class="selected-choice-badge">✓ Selected trailer</div>':''}<div class="row"><strong>${label}</strong><span class="pill ${pv.cls}">${pv.label}</span></div><div class="small" style="margin-top:6px">${trailerStrategyText(id)}</div><div class="promise-preview">${pv.text}<strong>${pv.pressure}</strong></div></button>`}).join('')}</div>
 <div class="section-title"><h2>Publicity</h2></div><div class="grid cols2">
 ${[['selective','Selective','Included'],['tour','Full press tour','+$0.70m'],['viral','Digital / viral','+$0.35m'],['prestige','Prestige profiles','+$0.45m']].map(([id,label,cost])=>{const pv=publicityPromisePreview(f,id);const selected=m.publicity===id;return `<button class="card selection-card marketing-choice ${selected?'selected-choice':''}" data-publicity="${id}" aria-pressed="${selected?'true':'false'}">${selected?'<div class="selected-choice-badge">✓ Selected publicity</div>':''}<div class="row"><strong>${label}</strong><span class="pill">${cost}</span></div><div class="row promise-row"><span class="pill ${pv.cls}">${pv.label}</span><span class="small">${pv.variance}</span></div><div class="small" style="margin-top:6px">${publicityText(id)}</div><div class="promise-preview">${pv.text}</div></button>`}).join('')}</div>
 ${lotOpp?`<div class="section-title"><h2>The Lot angle</h2><span class="pill ${lotOpp.tone}">OPTIONAL LEVERAGE</span></div><div class="card lot-campaign-opportunity ${lotOpp.tone==='bad'?'dangerline':lotOpp.tone==='warn'?'attention':'goodline'}"><div class="row"><div><strong>${lotOpp.story.headline}</strong><div class="small">${lotOpp.people.map(x=>x.name).join(' + ')}</div></div><span class="pill ${lotOpp.tone}">Heat ${Math.round(lotOpp.story.heat||0)}</span></div><div class="body" style="margin-top:8px">${lotOpp.text}</div></div><div class="grid cols2"><button class="card selection-card marketing-choice ${m.lotAngle!=='lean'?'selected-choice':''}" data-lot-campaign-angle="private" aria-pressed="${m.lotAngle!=='lean'?'true':'false'}">${m.lotAngle!=='lean'?'<div class="selected-choice-badge">✓ Selected</div>':''}<strong>Keep it out of the campaign</strong><div class="small" style="margin-top:6px">Let the film sell itself. The Lot story can continue organically without the studio deliberately feeding it.</div></button><button class="card selection-card marketing-choice ${m.lotAngle==='lean'?'selected-choice':''}" data-lot-campaign-angle="lean" aria-pressed="${m.lotAngle==='lean'?'true':'false'}">${m.lotAngle==='lean'?'<div class="selected-choice-badge">✓ Selected</div>':''}<div class="row"><strong>${lotOpp.label}</strong><span class="pill">+$0.25m</span></div><div class="small" style="margin-top:6px">${lotOpp.friendly?'More organic attention and positive sentiment, but audiences will expect the chemistry to show up on screen.':'More attention, but also more controversy and expectation pressure. If the movie disappoints, the campaign has made the off-camera story part of the release.'}</div></button></div>`:''}
 <div class="section-title"><h2>Launch strategy</h2><span class="pill ${festival.cls}">${festival.label}</span></div><div class="grid cols3">
 ${[['none','No event','Included'],['gala','Gala premiere','+$0.55m / +1w'],['festival','Festival submission','+$0.25m / +2w']].map(([id,label,cost])=>{const pv=launchPromisePreview(f,id);const selected=m.launch===id;return `<button class="card selection-card marketing-choice ${selected?'selected-choice':''}" data-launch="${id}" aria-pressed="${selected?'true':'false'}">${selected?'<div class="selected-choice-badge">✓ Selected launch</div>':''}<div class="row"><strong>${label}</strong><span class="pill">${cost}</span></div><div class="row promise-row"><span class="pill ${pv.cls}">${pv.label}</span></div><div class="small" style="margin-top:6px">${launchText(id)}</div>${id==='festival'?`<div class="small" style="margin-top:6px">${festival.text}</div>`:''}<div class="promise-preview">${pv.text}</div></button>`}).join('')}</div>
 <div class="section-title"><h2>Distribution</h2><span class="small">Who carries the theatrical risk?</span></div><div class="grid cols3">
 ${Object.values(DISTRIBUTION_OPTIONS).map(d=>{const eligible=d.id!=='platform'||platformReleaseEligible(f),plan=f.distributionStrategy===d.id?distributionPlan(f):null;const selected=f.distributionStrategy===d.id;return `<button class="card selection-card marketing-choice ${selected?'selected-choice':''}" data-distribution="${d.id}" aria-pressed="${selected?'true':'false'}" ${eligible?'':'disabled'}>${selected?'<div class="selected-choice-badge">✓ Selected distribution</div>':''}<div class="row"><strong>${d.name}</strong>${d.id==='partner'&&selected?`<span class="pill blue">${f.distributorName||distributionPartnerName(f)}</span>`:''}</div><div class="small" style="margin-top:7px">${d.desc}</div>${!eligible?'<div class="small" style="margin-top:7px"><strong>Not a natural platform-release candidate.</strong></div>':''}</button>`}).join('')}</div>
 <div class="card ${dist.id==='partner'?'goodline':''}" style="margin-top:10px"><div class="row"><div><strong>${dist.name}</strong><div class="small">Current distribution plan</div></div><strong>${money(dist.opsCost)} release ops</strong></div><div class="body" style="margin-top:7px">${distributionTradeoff(f)}</div><div class="small" style="margin-top:8px">Projected studio theatrical share: ${Math.round(dist.domShare*100)}% domestic / ${Math.round(dist.intlShare*100)}% international.</div></div>
 <div class="section-title"><h2>Marketing spend</h2><span class="small">Recommended ~${money(rec)}</span></div>
 <div class="card"><div class="row"><span>Paid campaign spend</span><strong id="marketingRead">${money(f.marketing)}</strong></div><input id="marketingSlider" class="range" type="range" min="0" max="${max.toFixed(1)}" step="0.25" value="${f.marketing}" style="margin-top:14px"><div class="range-labels"><span>$0.0m</span><span>${money(max)}</span></div><div id="marketingLead" class="body" style="margin-top:10px"><strong>${lead.tier}</strong> · minimum ${lead.lead}-week build · earliest release Week ${lead.earliest}.</div><div class="small" style="margin-top:7px">Publicity / launch extras: ${money(extra)} · ${dist.name.toLowerCase()} release operations: ${money(dist.opsCost)} · estimated studio commitment ${money(totalPreview)}.</div></div>
 <div class="section-title"><h2>Release calendar</h2><span class="small">${weeks.length} viable windows · rival films can create real audience pressure</span></div><div class="grid">${weeks.map(w=>{const intel=releaseWindowIntel(f,w);const selected=f.releaseWeek===w;return `<button class="card selection-card release-window marketing-choice ${selected?'selected-choice':''}" data-release-week="${w}" aria-pressed="${selected?'true':'false'}">${selected?'<div class="selected-choice-badge">✓ Selected release week</div>':''}<div class="row"><div><strong>Week ${w}</strong><div class="small">${releaseWeekDescription(w,f.genre)}</div></div><span class="pill ${intel.cls}">${intel.label}</span></div><div class="small" style="margin-top:7px">${intel.text}</div>${intel.rivals.length?`<div class="release-rivals">${intel.rivals.slice(0,3).map(x=>`<span>${x.title} · ${x.genre}</span>`).join('')}</div>`:''}</button>`}).join('')}</div>
 ${(()=>{const cp=campaignPromiseSummary(f);return `<div class="campaign-promise-card ${cp.cls}"><div><div class="badge">CAMPAIGN PROMISE PREVIEW</div><strong>${cp.label}</strong><div class="body">${cp.text}</div></div><span class="pill ${cp.cls}">${cp.pressure}</span></div>`})()}
 <div class="card" style="margin-top:12px"><div class="body"><strong>The campaign is now a promise.</strong> These labels are the marketing team’s read of what the finished film can credibly support — not a prediction of public reaction. Bigger public moments can increase awareness, but overselling the movie raises the expectation penalty if delivery falls short.</div></div>
 ${state.cash < totalPreview?`<div class="card dangerline" style="margin-top:12px"><div class="body"><strong>Cash warning:</strong> the studio cannot currently fund this complete release plan.</div><button class="btn block" style="margin-top:10px" id="openFinance">Open Finance</button></div>`:''}
 <button id="commitRelease" class="btn primary block" style="margin-top:14px">Commit campaign & release</button>`;
}
