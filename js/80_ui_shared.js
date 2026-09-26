// Project Slate UI: shared

function topAdvanceControl(){
 if(!state.studio)return '';ensureCalendarState();
 const blocker=typeof calendarHardBlocker==='function'?calendarHardBlocker():(rebuildDecisions(),state.decisions.find(x=>x.type==='production'||x.type==='post'||x.type==='marketing')),f=blocker?filmById(blocker.filmId):null,checkpoint=nextCalendarCheckpoint();
 const days=checkpoint?Math.max(0,checkpoint.day-state.calendarDay):0;
 const blockText=blocker?.type==='marketing'?`${f?.title||'Film'} needs a release plan`:blocker?.type==='post'?`${f?.title||'Film'} rough cut is waiting`:`${f?.title||'Production'} needs a decision`;
 const nextText=blocker?blockText:checkpoint?.kind==='quiet'?checkpoint.label:checkpoint&&checkpoint.day>state.calendarDay?`Next: ${checkpoint.label} · ${days===1?'tomorrow':days+' days'} · ${calendarShortDate(checkpoint.day)}`:`${state.decisions.length} decision${state.decisions.length===1?'':'s'} waiting`;
 const button=blocker?.type==='marketing'?'Plan release':blocker?.type==='post'?'Review rough cut':blocker?'Resolve blocker':'Continue →';
 return `<div class="topadvance"><div><strong>${calendarDateLabel()}</strong><span class="small next-event-line" style="margin-left:8px">W${state.week} · ${nextText}</span></div><div class="topadvance-actions">${blocker?'':`<button id="globalAdvanceNextEvent" class="btn ghost" title="Advance to the next campaign, release, box-office or signature event">Event »</button><button id="globalAdvanceNextDecision" class="btn ghost" title="Skip routine signals and advance until the next player decision or signature moment">Decision »</button>`}<button id="globalAdvanceWeek" class="btn ${blocker?'danger':'primary'}">${button}</button></div></div>`;
}
function topbar(title,subtitle=''){
 if(state.studio&&typeof syncOperationalDeskItems==='function')syncOperationalDeskItems();
 const attention=state.studio&&typeof deskInboxCount==='function'?deskInboxCount():0;
 const runway=state.studio&&typeof studioCashRunway==='function'?studioCashRunway():null,runwayText=runway&&runway.weeks<8?`<span class="runway-mini ${runway.weeks<3?'dangertext':''}">${runway.label} runway</span>`:'';
 return `<div class="topbar"><div class="toprow"><div><div class="title">${title}</div>${subtitle?`<div class="small">${subtitle}</div>`:''}</div><div class="topbar-brand">${state.studio?playerStudioLogoHTML('xs',true):`<div class="meta">Living Studio v${VERSION}</div>`}${state.studio?`<div class="topbar-actions"><button id="notificationBell" class="bell" title="Open Studio Desk">⌁${attention?`<span class="bellcount">${attention}</span>`:''}</button><div class="meta"><strong>${money(state.cash)}</strong>${runwayText}</div></div>`:''}</div></div>${state.studio?topAdvanceControl():''}</div>`;
}
function nav(){
 const items=[
  ['studio','◫','Studio'],
  ['slate','▣','Slate'],
  ['develop','✦','Develop'],
  ['release','▥','Release'],
  ['industry','◌','Industry']
 ];
 const deskCount=state.studio&&typeof deskActionCount==='function'?deskActionCount():0;
 return `<nav class="bottomnav">${items.map(i=>`<button class="navbtn ${state.screen===i[0]?'active':''}" data-nav="${i[0]}"><span class="icon">${i[1]}</span>${i[2]}${i[0]==='studio'&&deskCount?`<span class="navbadge">${deskCount}</span>`:''}</button>`).join('')}</nav><button id="globalBackToTop" class="global-back-top" aria-label="Back to top" title="Back to top">↑</button>`;
}
function backHead(title,sub=''){return `<div class="screenhead"><button class="back" id="backBtn">← Back</button><h1>${title}</h1>${sub?`<div class="small">${sub}</div>`:''}</div>`}
function stagePill(f){
 const cls=f.stage==='complete'?'good':f.stage==='cinema'?'blue':f.pendingEvent?'warn':'';
 return `<span class="pill ${cls}">${fmtStage(f.stage)}</span>`;
}
function notificationsScreen(){
 state.screen='studio';state.detail=null;state.uiStudioTab='desk';
 return studioScreen();
}
function brandPickerHTML(brand=ensurePlayerBrand()){
 const b=normalizeBrand(brand,state.uiStudioNameDraft||state.studio?.name||'Studio'),theme=brandTheme(b);
 return `<div class="brand-editor">
  <div class="brand-preview" style="--brand:${theme.accent};--brand2:${theme.accent2};--branddark:${theme.dark}">${studioLogoHTML(state.uiStudioNameDraft||state.studio?.name||'Your Studio',b,'lg',true)}<div class="small">Branding is cosmetic. Your studio identity still emerges only from the films you make.</div></div>
  <div><div class="brand-editor-label">Mark</div><div class="brand-choice-grid">${Object.entries(BRAND_MARKS).map(([id,x])=>`<button class="brand-choice ${b.mark===id?'selected':''}" data-brand-mark="${id}" title="${x.name}"><span>${markSVG(id,'currentColor')}</span><small>${x.name}</small></button>`).join('')}</div></div>
  <div><div class="brand-editor-label">Colour system</div><div class="brand-swatches">${Object.entries(BRAND_THEMES).map(([id,x])=>`<button class="brand-swatch ${b.theme===id?'selected':''}" data-brand-theme="${id}" style="--swatch:${x.accent};--swatch2:${x.accent2}" title="${x.name}"><span></span><small>${x.name}</small></button>`).join('')}</div></div>
  <div><div class="brand-editor-label">Wordmark</div><div class="brand-wordmarks">${Object.entries(BRAND_WORDMARKS).map(([id,x])=>`<button class="btn ${b.wordmark===id?'primary':''}" data-brand-wordmark="${id}"><span class="${x.className}">${x.name}</span></button>`).join('')}</div></div>
 </div>`;
}
function setupScreen(){
 ensurePlayerBrand();
 const diff=difficultyInfo(state.uiDifficultyDraft||'normal'),rivals=(state.rivals||[]).slice(0,6);
 return `<main class="setup-shell">
  <section class="setup-cinematic">
   <div class="setup-mast"><span>AURELIA · YEAR ONE</span><span>v${VERSION}</span></div>
   <div class="setup-wordmark"><span>PROJECT</span><strong>SLATE</strong></div>
   <div class="setup-worldcopy"><div class="badge">A LIVING STUDIO CAREER</div><h1>Welcome to <em>The Lot.</em></h1><p>Six established studios already control stages, agencies and headlines. Scripts have bidders. Stars have leverage. Opening weekends have consequences. Your company is about to become the newest name in the conversation.</p></div>
   <div class="setup-worldbeats"><div><strong>Make the films.</strong><span>Develop, cast, finance, shoot and release a slate that becomes recognisably yours.</span></div><div><strong>Live with the history.</strong><span>Rivals remember. Careers rise and fall. Old films keep shaping the next decision.</span></div><div><strong>Build the institution.</strong><span>What begins as an unknown independent can become one of the powers of The Lot.</span></div></div>
   <div class="setup-rival-title"><span>The studios already here</span><small>You are entering an industry in motion.</small></div>
   <div class="setup-rivals">${rivals.map(r=>`<div class="setup-rival">${studioLogoHTML(r.name,rivalBrand(r),'xs',true)}<div><strong>${r.head?.name||'Studio leadership'}</strong><span>${r.style}</span></div></div>`).join('')}</div>
  </section>
  <section class="setup-create">
   <div class="setup-create-head"><div><div class="badge">FOUND YOUR STUDIO</div><h2>Put your name above the door.</h2><p>The logo is yours. The reputation is not. That gets earned film by film.</p></div><span class="setup-step">01</span></div>
   <div class="setup-block"><label class="setup-label" for="studioName">Studio name</label><input id="studioName" class="field studio-name-field" value="${state.uiStudioNameDraft||''}" placeholder="Robinson Pictures" autocomplete="off"></div>
   <div class="setup-block"><div class="row setup-label-row"><span class="setup-label">Opening runway</span><span class="small">Same world · different starting capital</span></div><div class="grid cols3 setup-difficulty">${Object.values(DIFFICULTY_OPTIONS).map(d=>`<button class="card setup-choice ${state.uiDifficultyDraft===d.id?'selected':''}" data-difficulty="${d.id}"><div class="row"><strong>${d.label}</strong><span class="pill ${d.id==='easy'?'good':d.id==='hard'?'bad':'blue'}">${d.flavour}</span></div><div class="kpi">${money(d.cash)}</div><div class="small">${d.desc}</div></button>`).join('')}</div></div>
   <div class="setup-block"><div class="row setup-label-row"><span class="setup-label">Visual identity</span><span class="small">Change later in Studio → Identity</span></div>${brandPickerHTML()}</div>
   <div class="setup-principle"><strong>You start unknown.</strong><span>${money(diff.cash)} cash · two production slots · no preset creative identity. Difficulty changes starting capital only; the simulation does not secretly soften the industry.</span></div>
   <button id="startCareer" class="btn primary block start-career">Open the studio <span>→</span></button>
  </section>
 </main>`;
}

function sectionTabs(items,current,attr){
 return `<div class="industrytabs">${items.map(([id,label,count])=>`<button class="btn ${current===id?'primary':''}" ${attr}="${id}">${label}${count!==undefined?` ${count}`:''}</button>`).join('')}</div>`;
}
function reputationLabel(v){return v>=75?'Excellent':v>=62?'Strong':v>=50?'Established':v>=38?'Developing':'Weak'}
function filmSummary(f){
 if(f.stage==='development')return f.paused?'On hold · development paused':`${f.directorId?'Director attached':'Director needed'} · ${f.cast.length}/2 principal cast`;
 if(f.stage==='production')return `Production Week ${f.productionWeek} · wraps around Week ${f.productionEnd}${f.pendingEvent?' · decision waiting':''}`;
 if(f.stage==='post'){const p=ensurePostState(f);return `Rough cut · ${p.runtime}m · ${p.actions.length}/${p.maxActions} post interventions${f.tested===true?' · test '+Math.round(f.testScore)+'%':''}`};
 if(f.stage==='marketing')return `Campaign and release date not yet committed`;
 if(f.stage==='scheduled')return `Scheduled for Week ${f.releaseWeek}`;
 if(f.stage==='cinema'){const row=f.weeklyResults.at(-1);return `Theatrical Week ${f.cinemaWeek} · ${money(row.dom+row.intl)} worldwide this week`}
 return '';
}
function budgetAdvice(value,s){const r=value/s.naturalBudget;if(r<.7)return 'Severely underfunded: major compromises are likely.';if(r<.88)return 'Lean: achievable, but execution risk rises noticeably.';if(r<=1.15)return 'Inside the recommended range for this screenplay.';if(r<=1.35)return 'Generous: some added headroom, but diminishing creative returns.';return 'Lavish: break-even rises sharply and extra money adds little guaranteed quality.'}
function releaseWeekDescription(w,genre){
 const comps=state.films.filter(x=>x.owner!=='player'&&x.releaseWeek===w&&!['complete'].includes(x.stage));
 if(!comps.length)return 'No major rival film currently announced.';
 const direct=comps.filter(x=>x.genre===genre);
 if(direct.length)return `${direct.map(x=>x.title).join(', ')} competes directly in ${genre}.`;
 return comps.slice(0,2).map(x=>`${x.title} · ${x.genre}`).join(' / ');
}
