from pathlib import Path

p=Path("index.html")
s=p.read_text(encoding="utf-8")

def one(old,new,label):
    global s
    n=s.count(old)
    if n!=1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    s=s.replace(old,new,1)

def replace_function(start_token,end_token,new_text,label):
    global s
    a=s.find(start_token)
    if a<0:
        raise SystemExit(f"{label}: start token not found")
    b=s.find(end_token,a)
    if b<0:
        raise SystemExit(f"{label}: end token not found")
    s=s[:a]+new_text+s[b:]

one("<title>Project Slate — Premium Presentation v4.0c.2</title>",
    "<title>Project Slate — Premium Presentation v4.0c.3</title>","title")
one("const VERSION='4.0c.2';","const VERSION='4.0c.3';","version")
one("v4.0c.2-rival-release-strategy","v4.0c.3-awards-competition","audit model label")

old_commit='''function commitAwardsPush(f,level=1){
 const a=ensureAfterlifeState(f);if(a.awardsPush)return showToast('An awards campaign is already active.');
 level=level>=2?2:1;
 const raw=awardsPushCost(f,level),cost=+(raw*(1-awardsCampaignDiscount())).toFixed(2);if(!spend(cost))return;
 a.awardsPush=true;a.awardsPushLevel=level;a.awardsPushBonus=level===2?9:5;a.awardsPushCost=cost;f.investment+=cost;
 addNews(state,`${state.studio.name} is mounting a ${level===2?'full-scale':'focused'} awards campaign for ${f.title}.`,'Awards');save();render();
}'''
new_commit='''function commitAwardsPush(f,level=1){
 const a=ensureAfterlifeState(f);level=level>=2?2:1;
 const current=a.awardsPushLevel||0;
 if(current>=level)return showToast(current>=2?'A full-scale awards campaign is already active.':'A focused awards campaign is already active.');
 const rawTarget=awardsPushCost(f,level),rawCurrent=current?awardsPushCost(f,current):0;
 const cost=+((rawTarget-rawCurrent)*(1-awardsCampaignDiscount())).toFixed(2);if(!spend(cost))return;
 a.awardsPush=true;a.awardsPushLevel=level;a.awardsPushBonus=level===2?9:5;a.awardsPushCost=+((a.awardsPushCost||0)+cost).toFixed(2);f.investment+=cost;
 addNews(state,current===1&&level===2?`${state.studio.name} escalated ${f.title}'s awards campaign to a full-scale push after making the field.`:`${state.studio.name} is mounting a ${level===2?'full-scale':'focused'} awards campaign for ${f.title}.`,'Awards');save();render();
}'''
one(old_commit,new_commit,"player awards campaign escalation")

competition_block=r'''
function awardsSeasonMomentum(f){
 let m=0,crit=f.review?.critics||60,aud=f.review?.audience||60,box=typeof boxRunStats==='function'?boxRunStats(f):{best:null,weeksAtOne:0};
 if(crit>=90)m+=3;else if(crit>=84)m+=2;else if(crit>=78)m+=1;
 if(aud>=90)m+=1.2;else if(aud>=84)m+=.6;
 if(box.best&&box.best<=3)m+=1;if((box.weeksAtOne||0)>=2)m+=1;
 if(f.releaseProfile?.type==='breakout'||f.releaseProfile?.type==='sleeper')m+=1.5;
 if(f.releaseProfile?.type==='bomb')m-=2;
 const fest=f.marketingState?.festival;
 if(fest?.screened&&fest.result==='strong')m+=1.2;
 else if(fest?.screened&&fest.result==='poor')m-=1;
 const pulse=f.socialPulse||{};
 if((pulse.volume||0)>=72&&(pulse.sentiment||0)>=62)m+=.6;
 return +clamp(m,-3,6).toFixed(2);
}
function awardsMomentumFactor(cat){
 return {picture:1,director:.62,lead:.72,support:.62,screenplay:.58,ensemble:.78,craft:.38,soundtrack:.42,audience:1.08}[cat]??.55;
}
function awardsCompetitiveScore(f,cat,phase='race'){
 const momentum=awardsSeasonMomentum(f)*awardsMomentumFactor(cat),campaign=awardsPushBonus(f);
 return awardsEligibilityScore(f,cat)+momentum+campaign;
}
function awardsCampaignLabel(f){
 const a=ensureAfterlifeState(f);return a.awardsPushLevel>=2?'Full campaign':a.awardsPushLevel===1?'Focused campaign':'No campaign';
}
function awardsMomentumLabel(f){
 const m=awardsSeasonMomentum(f);
 if(m>=4)return {label:'Surging',cls:'good'};
 if(m>=2)return {label:'Strong momentum',cls:'good'};
 if(m>=.5)return {label:'Steady',cls:'blue'};
 if(m<=-1)return {label:'Fading',cls:'bad'};
 return {label:'Mixed',cls:'warn'};
}
function aiAwardsCampaignThreshold(rv){
 if(['Prestige','Indie / Prestige'].includes(rv?.style))return {focused:65,full:74};
 if(['Blockbusters','Franchise Builder','Aggressive Capital'].includes(rv?.style))return {focused:69,full:79};
 if(rv?.style==='Genre Specialist')return {focused:67,full:76};
 return {focused:68,full:77};
}
function aiAwardsBestScore(f){
 return Math.max(...AWARD_CATEGORIES.map(c=>awardsEligibilityScore(f,c.id)+awardsSeasonMomentum(f)*awardsMomentumFactor(c.id)));
}
function aiCommitAwardsPush(f,rv,level=1,reason=''){
 const a=ensureAfterlifeState(f),current=a.awardsPushLevel||0;level=level>=2?2:1;
 if(current>=level)return false;
 const rawTarget=awardsPushCost(f,level),rawCurrent=current?awardsPushCost(f,current):0,cost=+(rawTarget-rawCurrent).toFixed(2),t=aiTreasurySnapshot(rv);
 if(rv.cash-cost<Math.max(4,t.reserve*.80))return false;
 rv.cash-=cost;f.investment=(f.investment||0)+cost;a.awardsPush=true;a.awardsPushLevel=level;a.awardsPushBonus=level===2?9:5;a.awardsPushCost=+((a.awardsPushCost||0)+cost).toFixed(2);
 if(level===2)addNews(state,rv.name+' has committed a full awards campaign to '+f.title+(reason?' after '+reason:'')+'.','Awards Race');
 return true;
}
function processAIAwardsCampaigns(){
 const sw=awardsSeasonWeek(),season=awardsSeasonId();if(sw<42||sw>51)return;
 const start=(season-1)*52+1,end=season*52,nom=awardsNominationRecord(season);
 state.films.filter(f=>f.owner!=='player'&&f.stage==='complete'&&f.completeWeek>=start&&f.completeWeek<=end).forEach(f=>{
  const rv=rivalById(f.owner);if(!rv)return;
  const a=ensureAfterlifeState(f),best=aiAwardsBestScore(f),th=aiAwardsCampaignThreshold(rv),rr=makeRng(hash(state.seed+'|ai-awards-campaign|'+season+'|'+f.id));
  if(!nom){
   if(a.aiAwardsCampaignConsideredSeason===season)return;
   const readiness=sw>=48?1:sw>=45?.82:.58;
   if(rr()>readiness)return;
   a.aiAwardsCampaignConsideredSeason=season;
   if(best>=th.full&&rr()<.72)aiCommitAwardsPush(f,rv,2,'a strong precursor season');
   else if(best>=th.focused)aiCommitAwardsPush(f,rv,1);
  }else{
   const noms=(a.nominations||[]).filter(x=>x.season===season).length;if(!noms)return;
   if((a.awardsPushLevel||0)<2&&a.aiAwardsEscalationSeason!==season&&sw>=50){
    a.aiAwardsEscalationSeason=season;
    const caseScore=best+noms*1.4;
    if(caseScore>=th.full-1&&rr()<clamp(.30+noms*.14,.30,.82))aiCommitAwardsPush(f,rv,2,noms+' nomination'+(noms===1?'':'s'));
   }
  }
 });
}
function awardRacePublicStatus(score,top){
 const gap=Math.max(0,top-score);
 if(gap<=1.5)return {label:'Front-runner',cls:'good'};
 if(gap<=4.5)return {label:'Major contender',cls:'blue'};
 if(gap<=8)return {label:'In the race',cls:'warn'};
 return {label:'Chasing',cls:''};
}
function awardsRaceCategoryRows(season,catId,nom=null){
 const start=(season-1)*52+1,end=Math.min(season*52,state.week);
 let films=state.films.filter(f=>f.stage==='complete'&&f.completeWeek>=start&&f.completeWeek<=end);
 if(nom){
  const field=nom.categories.find(c=>c.id===catId)?.nominees||[],ids=new Set(field.map(x=>x.filmId));films=films.filter(f=>ids.has(f.id));
 }
 const rows=films.map(f=>({f,score:awardsCompetitiveScore(f,catId)})).sort((a,b)=>b.score-a.score);
 const top=rows[0]?.score||0;return rows.slice(0,4).map((x,i)=>({...x,status:awardRacePublicStatus(x.score,top),rank:i+1}));
}
function awardsRaceBoardHTML(current){
 const cats=['picture','director','lead','screenplay','audience'].map(id=>AWARD_CATEGORIES.find(c=>c.id===id)).filter(Boolean),nom=current.nominations||null;
 const has=current.films?.length;
 if(!has)return '';
 return '<div class="section-title"><h2>Awards Race Board</h2><span class="small">'+(nom?'Final field · campaigns can still move Awards Night':'Industry read · hidden voting still carries uncertainty')+'</span></div><div class="grid cols2">'+cats.map(cat=>{
  const rows=awardsRaceCategoryRows(current.season,cat.id,nom);
  return '<div class="card"><div class="row"><strong>'+cat.label+'</strong><span class="pill">'+(nom?'Nominated field':'Race watch')+'</span></div><div style="margin-top:8px">'+(rows.length?rows.slice(0,3).map(x=>{const f=x.f,m=awardsMomentumLabel(f),camp=ensureAfterlifeState(f).awardsPushLevel;return '<div class="listrow"><div><strong>'+x.rank+'. '+awardSubject(f,cat.id)+'</strong><div class="small">'+(f.studio||state.studio.name)+' · '+m.label+(camp?' · '+awardsCampaignLabel(f):'')+'</div></div><span class="pill '+x.status.cls+'">'+x.status.label+'</span></div>'}).join(''):'<div class="small">No credible contenders yet.</div>')+'</div></div>';
 }).join('')+'</div><div class="small" style="margin-top:8px">Race Board labels are an industry read, not a prediction. Final nominations and winners still include voting variance.</div>';
}

'''
anchor="function awardSubject(f,cat){"
if s.count(anchor)!=1:
    raise SystemExit(f"competition block anchor count {s.count(anchor)}")
s=s.replace(anchor,competition_block+anchor,1)

one("awardsEligibilityScore(f,cat.id)+awardsPushBonus(f)+(r()-.5)*5",
    "awardsCompetitiveScore(f,cat.id,'nomination')+(r()-.5)*5",
    "nomination competitive scoring")
one("awardsEligibilityScore(f,cat.id)+awardsPushBonus(f)+(r()-.5)*10",
    "awardsCompetitiveScore(f,cat.id,'ceremony')+(r()-.5)*10",
    "ceremony competitive scoring")

one("maybeWarnCashRunway();maybeResolveAwardsNominations();maybeResolveAwardsSeason();",
    "maybeWarnCashRunway();processAIAwardsCampaigns();maybeResolveAwardsNominations();maybeResolveAwardsSeason();",
    "weekly AI awards campaign tick")

aw0=s.find("function awardsStudioBody(){")
aw1=s.find("function studioScreen(){",aw0)
if aw0<0 or aw1<0:
    raise SystemExit("awardsStudioBody boundary not found")
awards_body=s[aw0:aw1]
for cat in ["picture","director","lead","support","screenplay","soundtrack"]:
    old=f"awardBuzzLabel(awardsEligibilityScore(f,'{cat}'))"
    new=f"awardBuzzLabel(awardsCompetitiveScore(f,'{cat}'))"
    count=awards_body.count(old)
    if count!=1:
        raise SystemExit(f"player awards buzz {cat}: expected 1 awardsStudioBody occurrence, found {count}")
    awards_body=awards_body.replace(old,new,1)
s=s[:aw0]+awards_body+s[aw1:]

one('<div class="section-title"><h2>Awards history</h2>',
    '${awardsRaceBoardHTML(current)}\\n  <div class="section-title"><h2>Awards history</h2>',
    "Awards Race Board insertion")

new_nom_screen=r'''function awardsNominationsScreen(){
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
'''
replace_function("function awardsNominationsScreen(){","function awardsCareerThreadContext()",new_nom_screen,"nominations screen")

p.write_text(s,encoding="utf-8")
print("Patched Project Slate to v4.0c.3 — Awards Competition.")
