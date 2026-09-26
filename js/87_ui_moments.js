// Project Slate UI: moments

function campaignMomentVisual(m,f){
 const type=m.type||'',isCampaign=['trailer','publicity','gala','festivalDecision','festivalScreening'].includes(type);
 if(!isCampaign)return `<div class="moment-standard-art">${filmKeyArtHTML(f,'mini')}</div>`;
 if(type==='trailer'){
  return `<div class="campaign-event-visual trailer-event"><div class="trailer-frame">${filmKeyArtHTML(f,'hero')}<div class="trailer-screen-copy"><span class="trailer-play">▶</span><div><b>FIRST TRAILER</b><small>${f.title}</small></div></div></div><div class="campaign-event-side"><div class="event-super">TRAILER DROP</div><strong>${momentResultLabel(m.result)}</strong><span>The film has entered public view.</span></div></div>`;
 }
 if(type==='publicity'){
  const faces=[talentById(f.directorId),...packageActors(f)].filter(Boolean).sort((a,b)=>(b.star||b.craft||0)-(a.star||a.craft||0)),face=faces[0];
  const outlets=Object.keys(PRESS_BRANDS).slice(0,6);
  return `<div class="campaign-event-visual publicity-event"><div class="press-wall">${outlets.map(x=>pressLogoHTML(x,'xs',false)).join('')}</div><div class="publicity-feature">${filmKeyArtHTML(f,'mini')}<div><div class="event-super">${m.kicker||'PUBLICITY WEEK'}</div><strong>${face?.name||'The film team'}</strong><span>is carrying the conversation</span></div></div></div>`;
 }
 if(type==='gala'){
  const venue=(m.stats||[]).find(x=>x[0]==='Venue')?.[1]||'World premiere';
  return `<div class="campaign-event-visual gala-event"><div class="premiere-flash flash-a"></div><div class="premiere-flash flash-b"></div><div class="gala-poster">${filmKeyArtHTML(f,'hero')}</div><div class="gala-copy">${studioLogoHTML(f.studio||state.studio.name,brandForStudioName(f.studio||state.studio.name,f.owner),'xs',true)}<div class="event-super">WORLD PREMIERE</div><strong>${venue}</strong><span>Cast, press and first reactions arrive together.</span></div></div>`;
 }
 const selected=type==='festivalDecision',label=selected?'FESTIVAL SELECTION':'FESTIVAL NIGHT';
 return `<div class="campaign-event-visual festival-event"><div class="festival-laurel">❬ <span>${label}</span> ❭</div>${filmKeyArtHTML(f,'mini')}<div><div class="event-super">${label}</div><strong>${momentResultLabel(m.result)}</strong><span>${selected?'The film has a prestige platform.':'The first festival audience has seen the finished film.'}</span></div></div>`;
}
function studioMomentScreen(){
 const m=activeStudioMoment(),f=m?.filmId?filmById(m.filmId):null;if(!m)return studioScreen();
 const tone=momentToneClass(m.tone),stats=m.stats||[],sections=m.sections||[];
 if(m.type==='challengerArrival'){
  const rv=rivalById('RX1');
  return `<div class="moment moment-${tone} moment-type-challengerArrival"><div class="moment-inner"><div class="challenger-arrival-visual"><div class="challenger-monogram">AMG</div><div><div class="event-super">NEW STUDIO</div><strong>${rv?.name||'Apex Motion Group'}</strong><span>${rv?.head?.name||'Evelyn Cross'} · ${rv?.head?.title||'Chair & CEO'}</span></div></div><div class="moment-kicker">${m.kicker||'INDUSTRY ALERT'} · ${m.day&&typeof calendarDateLabel==='function'?calendarDateLabel(m.day):'WEEK '+m.week}</div><h1>${m.title}</h1><div class="moment-result">${momentResultLabel(m.result)}</div><p class="moment-summary">${m.summary||''}</p>${stats.length?`<div class="moment-stats">${stats.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('')}</div>`:''}<div class="moment-sections">${sections.map(s=>`<div class="moment-section"><h3>${s.title}</h3><p>${s.text}</p></div>`).join('')}</div><button id="continueStudioMoment" class="btn primary block moment-continue">Welcome to the competition</button></div></div>`;
 }
 if(m.type==='studioAnniversary'){
  return `<div class="moment moment-${tone} moment-type-studioAnniversary"><div class="moment-inner"><div style="display:flex;justify-content:center;margin-bottom:18px">${state.studio?playerStudioLogoHTML('lg',true):''}</div><div class="moment-kicker">${m.kicker||'STUDIO ANNIVERSARY'} · ${m.day&&typeof calendarDateLabel==='function'?calendarDateLabel(m.day):'WEEK '+m.week}</div><h1>${m.title}</h1><div class="moment-result">${momentResultLabel(m.result)}</div><p class="moment-summary">${m.summary||''}</p>${stats.length?`<div class="moment-stats">${stats.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('')}</div>`:''}<div class="moment-sections">${sections.map(s=>`<div class="moment-section"><h3>${s.title}</h3><p>${s.text}</p></div>`).join('')}</div><button id="continueStudioMoment" class="btn primary block moment-continue">Continue the story</button></div></div>`;
 }
 if(!f)return studioScreen();
 return `<div class="moment moment-${tone} moment-type-${m.type||'general'}"><div class="moment-inner">${campaignMomentVisual(m,f)}<div class="moment-kicker">${m.kicker||'STUDIO MOMENT'} · ${m.day&&typeof calendarDateLabel==='function'?calendarDateLabel(m.day):'WEEK '+m.week}</div><div class="moment-film">${f.title}</div><h1>${m.title}</h1><div class="moment-result">${momentResultLabel(m.result)}</div><p class="moment-summary">${m.summary||''}</p>
 ${stats.length?`<div class="moment-stats">${stats.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('')}</div>`:''}
 <div class="moment-sections">${sections.map(s=>`<div class="moment-section"><h3>${s.title}</h3><p>${s.text}</p></div>`).join('')}</div>
 ${m.choices?.length?`<div class="moment-choices">${m.choices.map(([id,label])=>`<button class="btn ${id===m.choices[0][0]?'primary':''}" data-studio-moment-choice="${id}">${label}</button>`).join('')}</div>`:`<button id="continueStudioMoment" class="btn primary block moment-continue">Continue</button>`}
 </div></div>`;
}
function awardsNominationsScreen(){
 const n=state.pendingAwardsNominations||awardsNominationRecord(awardsSeasonId());if(!n)return studioScreen();
 const playerRows=n.categories.flatMap(cat=>cat.nominees.filter(x=>x.owner==='player').map(x=>({...x,category:cat.label})));
 const nominatedFilms=[...new Set(playerRows.map(x=>x.filmId).filter(Boolean))].map(filmById).filter(Boolean);
 const campaignRows=nominatedFilms.map(f=>{
  const a=ensureAfterlifeState(f),focused=+(awardsPushCost(f,1)*(1-awardsCampaignDiscount())).toFixed(2),full=+(awardsPushCost(f,2)*(1-awardsCampaignDiscount())).toFixed(2),upgrade=+((awardsPushCost(f,2)-awardsPushCost(f,1))*(1-awardsCampaignDiscount())).toFixed(2);
  const count=(a.nominations||[]).filter(x=>x.season===n.season).length||playerRows.filter(x=>x.filmId===f.id).length;
  let actions='';
  if(!a.awardsPush)actions=`<div class="awards-campaign-options"><button class="btn" data-nomination-campaign="${f.id}" data-campaign-level="1"><strong>Focused · ${money(focused)}</strong><span>Disciplined awards support.</span></button><button class="btn primary" data-nomination-campaign="${f.id}" data-campaign-level="2"><strong>Full · ${money(full)}</strong><span>Maximum awards push.</span></button></div>`;
  else if(a.awardsPushLevel===1)actions=`<div class="awards-campaign-options"><button class="btn primary" data-nomination-campaign="${f.id}" data-campaign-level="2"><strong>Escalate to full · ${money(upgrade)}</strong><span>The film made the field. Pay only the difference to push harder for Awards Night.</span></button></div>`;
  else actions=`<div class="small" style="margin-top:8px">Full-scale campaign active · ${money(a.awardsPushCost)} committed.</div>`;
  return `<div class="card awards-nominee-campaign"><div class="row"><div><strong>${f.title}</strong><div class="small">${count} nomination${count===1?'':'s'} · ${awardsMomentumLabel(f).label}</div></div>${a.awardsPush?`<span class="pill good">${awardsCampaignLabel(f)}</span>`:''}</div>${actions}</div>`;
 }).join('');
 const current={season:n.season,films:state.films.filter(f=>f.stage==='complete'&&awardsSeasonId(f.completeWeek||state.week)===n.season),nominations:n};
 return `<div class="ceremony nominations-night"><div class="ceremony-inner"><div class="ceremony-kicker">YEAR ${n.season} · NOMINATIONS DAY</div><h1>The final field is set</h1>${state.studio?playerStudioLogoHTML('sm',true):''}<p class="ceremony-sub">${playerRows.length?`${state.studio.name} has ${playerRows.length} nomination${playerRows.length===1?'':'s'} across the Year ${n.season} Slate Awards.`:`${state.studio.name} is outside the final field this year. Awards Night still belongs to the wider industry.`}</p>
 <div class="nomination-summary"><div><strong>${playerRows.length}</strong><span>Your nominations</span></div><div><strong>${n.categories.reduce((s,c)=>s+c.nominees.length,0)}</strong><span>Total nominations</span></div><div><strong>W${n.season*52}</strong><span>Awards Night · Y${n.season}W52</span></div></div>
 <div class="ceremony-grid">${n.categories.map(cat=>`<div class="awardcard"><div class="awardlabel">${cat.label}</div><div class="nominees">${cat.nominees.length?cat.nominees.map(x=>{const nf=filmById(x.filmId),campaign=nf&&ensureAfterlifeState(nf).awardsPush?` · ${awardsCampaignLabel(nf)}`:'';return `<div class="${x.owner==='player'?'winner':''}">${x.owner==='player'?'YOUR STUDIO · ':''}${x.subject}<span>${x.studio}${campaign}</span></div>`}).join(''):'<div>No nominees</div>'}</div></div>`).join('')}</div>
 ${awardsRaceBoardHTML(current)}
 ${campaignRows?`<div class="section-title" style="margin-top:18px"><h2>Awards campaign</h2><span class="small">Your nominated films can still be pushed before Awards Night</span></div><div class="grid">${campaignRows}</div>`:''}
 <button id="closeNominations" class="btn primary ceremony-continue">Return to the studio</button></div></div>`;
}
function awardsCareerThreadContext(){const t=typeof activeCareerThreads==='function'?activeCareerThreads(1)[0]:null;if(!t)return '';return `<div class="card ceremony-thread-context"><div class="badge">THE STORY AROUND YOUR STUDIO</div><strong>${t.title}</strong><div class="small" style="margin-top:5px">${t.summary}</div></div>`}
function awardsCeremonyScreen(){
 const c=state.pendingCeremony||state.awardsArchive?.[0];if(!c)return studioScreen();
 const cats=c.categories||[],step=clamp(state.awardsCeremonyStep||0,0,Math.max(0,cats.length)),complete=step>=cats.length,current=complete?null:cats[step],previous=cats.slice(0,step);
 if(complete){
  return `<div class="ceremony"><div class="ceremony-inner"><div class="ceremony-kicker">YEAR ${c.season} · AWARDS NIGHT</div><h1>The night is in the books</h1>${state.studio?playerStudioLogoHTML('sm',true):''}<p class="ceremony-sub">${c.playerWins?`${state.studio.name} finishes with ${c.playerWins} win${c.playerWins===1?'':'s'} from ${c.playerNoms} nomination${c.playerNoms===1?'':'s'}.`:`The industry closes Year ${c.season} with a new set of winners and no trophies for ${state.studio.name}.`}</p>
  ${awardsCareerThreadContext()}<div class="ceremony-grid">${cats.map(cat=>{const w=cat.nominees.find(n=>n.filmId===cat.winnerId);return `<div class="awardcard"><div class="awardlabel">${cat.label}</div><div class="awardwinner">🏆 ${w?.subject||'No award'}</div><div class="small">${w?.studio||''}</div></div>`}).join('')}</div>
  <button id="closeCeremony" class="btn primary ceremony-continue">Continue into Year ${c.season+1}</button></div></div>`;
 }
 const winner=current.nominees.find(n=>n.filmId===current.winnerId),playerWin=winner?.owner==='player';
 return `<div class="ceremony"><div class="ceremony-inner"><div class="ceremony-kicker">YEAR ${c.season} · AWARDS NIGHT · ${step+1}/${cats.length}</div><h1>${current.label}</h1><p class="ceremony-sub">${previous.length?`${previous.length} award${previous.length===1?' has':'s have'} already been presented. `:''}${playerWin?`${state.studio.name} has just won.`:'The envelope is open.'}</p>
 <div class="awardcard ceremony-current-award ${playerWin?'player-award-win':''}"><div class="awardlabel">${current.label}</div><div class="awardwinner">🏆 ${winner?.subject||'No award'}</div><div class="small">${winner?.studio||''}</div><div class="nominees">${current.nominees.map(n=>`<div class="${n.filmId===current.winnerId?'winner':''}">${n.filmId===current.winnerId?'WINNER · ':''}${n.subject}<span>${n.studio}</span></div>`).join('')}</div></div>
 ${previous.length?`<div class="section-title" style="margin-top:18px"><h2>Already presented</h2></div><div class="awards-presented">${previous.map(cat=>{const w=cat.nominees.find(n=>n.filmId===cat.winnerId);return `<div><span>${cat.label}</span><strong>${w?.subject||'—'}</strong></div>`}).join('')}</div>`:''}
 <div class="ceremony-choice-row"><button id="viewAllCeremony" class="btn ghost">View all results</button><button id="advanceCeremony" class="btn primary ceremony-continue">${step===cats.length-1?'See final tally':'Next award'}</button></div></div></div>`;
}
