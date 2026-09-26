from pathlib import Path

p=Path("index.html")
s=p.read_text(encoding="utf-8")

def one(old,new,label):
    global s
    n=s.count(old)
    if n!=1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    s=s.replace(old,new,1)

def insert_before(token,block,label):
    global s
    n=s.count(token)
    if n!=1:
        raise SystemExit(f"{label}: expected anchor once, found {n}")
    s=s.replace(token,block+token,1)

one("<title>Project Slate — Premium Presentation v4.0c.1</title>",
    "<title>Project Slate — Premium Presentation v4.0c.2</title>","title")
one("const VERSION='4.0c.1';","const VERSION='4.0c.2';","version")
one("v4.0c.1-theatrical-run","v4.0c.2-rival-release-strategy","audit model label")

# Symmetric release pressure: every film in the same market affects every other film.
one(
"""function boxPressureForWeek(week,genre,excludeId=null){
 const films=state.films.filter(x=>x.owner!=='player'&&x.id!==excludeId&&x.releaseWeek===week&&x.stage!=='complete');
 let p=0;films.forEach(f=>{p+=f.genre===genre?.12:.035});return clamp(p,0,.3);
}""",
"""function boxPressureForWeek(week,genre,excludeId=null){
 const films=state.films.filter(x=>x.id!==excludeId&&x.releaseWeek===week&&x.stage!=='complete'&&x.stage!=='shelved');
 let p=0;films.forEach(f=>{p+=f.genre===genre?.12:.035});return clamp(p,0,.3);
}""",
"box pressure symmetry")

strategy_block=r'''
const AI_RELEASE_STRATEGY={
 'Blockbusters':{collision:.78,calendar:.30,support:8,cut:20,counter:.14},
 'Broad Commercial':{collision:.56,calendar:.50,support:10,cut:16,counter:.36},
 'Genre Specialist':{collision:.48,calendar:.56,support:9,cut:15,counter:.58},
 'Prestige':{collision:.34,calendar:.72,support:13,cut:12,counter:.34},
 'Franchise Builder':{collision:.72,calendar:.38,support:7,cut:19,counter:.18},
 'Indie / Prestige':{collision:.26,calendar:.82,support:15,cut:10,counter:.48},
 'Aggressive Capital':{collision:.86,calendar:.20,support:5,cut:22,counter:.10}
};
function aiReleaseStrategyProfile(rv){return AI_RELEASE_STRATEGY[rv?.style]||AI_RELEASE_STRATEGY['Broad Commercial']}
function releaseMarketPressureSnapshot(week,f,excludeId=null){
 const competitors=state.films.filter(x=>x.id!==(excludeId||f?.id)&&x.releaseWeek&&Math.abs(x.releaseWeek-week)<=1&&!['complete','shelved'].includes(x.stage));
 let score=0;
 competitors.forEach(x=>{
  const distance=Math.abs(x.releaseWeek-week),proximity=distance===0?1:.34;
  const scale=clamp(.16+(x.budget||15)/90+(x.marketing||0)/55,.16,1.12);
  const genre=x.genre===f?.genre?1.38:1,event=x.campaign==='event'?1.10:1;
  score+=proximity*scale*genre*event;
 });
 const direct=competitors.filter(x=>x.releaseWeek===week),sameGenre=direct.filter(x=>x.genre===f?.genre);
 const largeDifferent=direct.filter(x=>x.genre!==f?.genre&&((x.budget||0)>=32||(x.marketing||0)>=12||x.campaign==='event'));
 return {week,score:+score.toFixed(3),competitors,direct,sameGenre,largeDifferent};
}
function aiReleaseWeekUtility(f,rv,week,originWeek){
 const sp=aiReleaseStrategyProfile(rv),snap=releaseMarketPressureSnapshot(week,f,f.id);
 const sameStudio=state.films.filter(x=>x.id!==f.id&&x.owner===rv.id&&x.releaseWeek&&Math.abs(x.releaseWeek-week)<=1&&!['complete','shelved'].includes(x.stage)).length;
 const delay=Math.max(0,week-originWeek),counter=snap.largeDifferent.length&&!snap.sameGenre.length?sp.counter*.16:0;
 const collisionPenalty=snap.score*(1-sp.collision*.58),slatePenalty=sameStudio*.58,delayPenalty=delay*.055;
 const jitter=(makeRng(hash(state.seed+'|ai-date-score|'+f.id+'|'+week))()-.5)*.025;
 return +(counter-collisionPenalty-slatePenalty-delayPenalty+jitter).toFixed(4);
}
function aiReleasePlanLabel(f,week,snap){
 const rv=rivalById(f.owner),sp=aiReleaseStrategyProfile(rv);
 if(snap.sameGenre.length)return sp.collision>=.70?'Holding an event collision':'Accepting direct competition';
 if(snap.largeDifferent.length&&sp.counter>=.30)return 'Counter-programming';
 if(snap.score<.34)return 'Protected window';
 if(snap.score<.72)return 'Balanced release window';
 return sp.collision>=.70?'Backing the date':'Crowded window';
}
function aiChooseReleaseWeek(f,rv,earliest,span=6){
 const start=Math.max(state.week+1,earliest),rows=[];
 for(let week=start;week<start+span;week++){
  const snap=releaseMarketPressureSnapshot(week,f,f.id),utility=aiReleaseWeekUtility(f,rv,week,start);
  rows.push({week,snap,utility,label:aiReleasePlanLabel(f,week,snap)});
 }
 rows.sort((a,b)=>b.utility-a.utility||a.week-b.week);
 return rows[0];
}
function reviewAIReleaseCalendar(){
 state.films.filter(f=>f.owner!=='player'&&f.stage==='scheduled'&&f.releaseWeek>=state.week+3).forEach(f=>{
  const rv=rivalById(f.owner);if(!rv)return;
  const plan=f.aiReleasePlan||(f.aiReleasePlan={initialWeek:f.releaseWeek,label:'Committed date',revisions:[]});
  plan.revisions=Array.isArray(plan.revisions)?plan.revisions:[];
  if(plan.revisions.length>=1||plan.lastReviewedWeek===state.week)return;
  plan.lastReviewedWeek=state.week;
  const sp=aiReleaseStrategyProfile(rv),currentSnap=releaseMarketPressureSnapshot(f.releaseWeek,f,f.id);
  const currentUtility=aiReleaseWeekUtility(f,rv,f.releaseWeek,f.releaseWeek);
  const threshold=.10+sp.collision*.10;
  if(currentSnap.score<.52+sp.collision*.55)return;
  const choice=aiChooseReleaseWeek(f,rv,f.releaseWeek,5);
  if(choice.week===f.releaseWeek||choice.utility<currentUtility+threshold)return;
  const old=f.releaseWeek;f.releaseWeek=choice.week;
  plan.revisions.push({week:state.week,from:old,to:choice.week,reason:choice.label,oldPressure:currentSnap.score,newPressure:choice.snap.score});
  plan.label=choice.label;plan.pressure=choice.snap.score;
  addNews(state,rv.name+' moved '+f.title+' from Week '+old+' to Week '+choice.week+'. '+choice.label+' now gives the film a cleaner path to market.','Release Calendar');
 });
}
function ensureAITheatricalStrategy(f){
 f.aiTheatricalStrategy=f.aiTheatricalStrategy||{actions:[],createdWeek:state.week};
 f.aiTheatricalStrategy.actions=Array.isArray(f.aiTheatricalStrategy.actions)?f.aiTheatricalStrategy.actions:[];
 return f.aiTheatricalStrategy;
}
function aiRunTravelFactor(f){
 const g=f.genre||'';
 if(g.includes('Action')||g.includes('Science')||g.includes('Fantasy'))return 1.12;
 if(g.includes('Family'))return 1.02;
 if(g.includes('Horror'))return .92;
 if(g.includes('Drama'))return .72;
 return .82;
}
function aiApplyTheatricalMove(f,rv,id,row){
 const t=ensureAITheatricalStrategy(f);if(t.actions.length)return false;
 const treasury=aiTreasurySnapshot(rv),cost=theatricalMoveCost(f,id);
 if(rv.cash-cost<Math.max(4,treasury.reserve*.82))return false;
 const effect=theatricalMoveEffectiveness(f,id),base=theatricalMoveBaseFactors(id),start=(f.weeklyResults||[]).length;
 rv.cash-=cost;f.investment=(f.investment||0)+cost;
 for(let n=start;n<(f.weeklyPlan||[]).length;n++){
  const rel=n-start,w=f.weeklyPlan[n];if(!w)continue;
  const df=base.dom[Math.min(rel,base.dom.length-1)]||1,inf=base.intl[Math.min(rel,base.intl.length-1)]||1;
  w.dom=+Math.max(.02,w.dom*(1+(df-1)*effect)).toFixed(4);
  w.intl=+Math.max(.01,w.intl*(1+(inf-1)*effect)).toFixed(4);
  const prev=n===start?((f.weeklyResults||[]).at(-1)?.dom||w.dom):f.weeklyPlan[n-1].dom;
  w.drop=n===0?null:+clamp(1-w.dom/Math.max(.01,prev),-.25,.92).toFixed(4);
 }
 const name=id==='expand'?'expanded the theatrical footprint':id==='intl'?'shifted extra support into international markets':'put extra support behind the theatrical run';
 const label=id==='expand'?'Expanded footprint':id==='intl'?'International push':'Supported run';
 t.actions.push({id,week:state.week,cost,effect:+effect.toFixed(3),rank:row?.settledRank||null,label});
 t.lastLabel=label;
 addNews(state,rv.name+' '+name+' for '+f.title+' after its settled weekend at #'+(row?.settledRank||'—')+'. The move adds '+money(cost)+' to the studio’s exposure.','Box Office Strategy');
 return true;
}
function aiWindDownWeakRun(f,rv,row){
 const t=ensureAITheatricalStrategy(f);if(t.actions.length)return false;
 const next=(f.weeklyPlan||[])[(f.weeklyResults||[]).length],aud=f.review?.audience||60,drop=row?.drop;
 if((f.cinemaWeek||0)<3||!next)return false;
 const severe=(f.releaseProfile?.type==='bomb'||aud<53)&&((row?.settledRank||99)>=8||(drop!==null&&drop>.64))&&(next.dom+next.intl)<1.6;
 if(!severe)return false;
 f.weeklyPlan=f.weeklyPlan.slice(0,f.weeklyResults.length);
 t.actions.push({id:'winddown',week:state.week,cost:0,rank:row?.settledRank||null,label:'Run winding down'});t.lastLabel='Run winding down';
 addNews(state,rv.name+' will not put additional theatrical support behind '+f.title+' after a weak Week '+f.cinemaWeek+' hold. The run is being allowed to wind down.','Box Office Strategy');
 return true;
}
function processAIRivalTheatricalStrategy(worldWeek,settledRows){
 (settledRows||[]).filter(x=>x.film?.owner!=='player'&&x.film?.stage==='cinema').forEach(({film:f,row})=>{
  const rv=rivalById(f.owner);if(!rv||!row||!row.settledRank)return;
  const t=ensureAITheatricalStrategy(f);if(t.actions.length)return;
  if(aiWindDownWeakRun(f,rv,row))return;
  if((f.cinemaWeek||0)>4)return;
  const sp=aiReleaseStrategyProfile(rv),aud=f.review?.audience||60,crit=f.review?.critics||60,drop=row.drop,rank=row.settledRank;
  let momentum=(aud-60)*.45+Math.max(0,7-rank)*3+(drop===null?0:(.48-drop)*30);
  if(f.releaseProfile?.type==='breakout'||f.releaseProfile?.type==='sleeper')momentum+=9;
  if(f.ipParentId)momentum+=3;
  if(rv.style==='Prestige'||rv.style==='Indie / Prestige')momentum+=(crit-65)*.15;
  if(momentum<sp.support)return;
  const rr=makeRng(hash(state.seed+'|ai-run-move|'+f.id+'|'+worldWeek)),certainty=clamp((momentum-sp.support)/22+.38,.28,.92);
  if(rr()>certainty)return;
  let move='support';
  if(rank<=3&&aud>=71&&['Blockbusters','Broad Commercial','Franchise Builder','Aggressive Capital'].includes(rv.style))move='expand';
  else if(aiRunTravelFactor(f)>=1&&aud>=68&&rank>2)move='intl';
  aiApplyTheatricalMove(f,rv,move,row);
 });
}
function aiReleasePlanHTML(f){
 if(f?.owner==='player'||!f?.aiReleasePlan)return '';
 const p=f.aiReleasePlan,rev=p.revisions?.at(-1),text=rev?('Moved from W'+rev.from+' · '+(p.label||rev.reason)):(p.label||'Committed date');
 return '<div class="small" style="margin-top:5px"><strong>'+text+'</strong></div>';
}

'''
insert_before("function aiFundRelease(f,rv){",strategy_block,"rival release strategy block")

one(
"const rr=makeRng(hash(state.seed+'|aireleaseplan|'+f.id));f.releaseWeek=state.week+lead+Math.floor(rr()*3);",
"""const rr=makeRng(hash(state.seed+'|aireleaseplan|'+f.id)),earliest=state.week+lead;
 const releaseChoice=aiChooseReleaseWeek(f,rv,earliest,6);f.releaseWeek=releaseChoice.week;
 f.aiReleasePlan={initialWeek:f.releaseWeek,label:releaseChoice.label,pressure:releaseChoice.snap.score,revisions:[],lastReviewedWeek:state.week};""",
"AI initial release planning")

one("aiStartProjects();checkPlayerReleaseCompetition();rotateMarket();",
    "aiStartProjects();reviewAIReleaseCalendar();checkPlayerReleaseCompetition();rotateMarket();",
    "weekly calendar review")

one(
"const rows=settleBoxOfficeWeek(week);if(rows.length){publishSettledOpeningNews(week,rows);generateBoxOfficeWeekPress()}",
"const rows=settleBoxOfficeWeek(week);if(rows.length){processAIRivalTheatricalStrategy(week,rows);publishSettledOpeningNews(week,rows);generateBoxOfficeWeekPress()}",
"rival weekend reaction")

# Surface rival intent in the player's live Release Room.
one(
"upcoming.map(x=>x.title+' · '+x.genre).join(' / ')",
"upcoming.map(x=>x.title+' · '+x.genre+(x.owner!=='player'&&x.aiReleasePlan?.label?' · '+x.aiReleasePlan.label:'')).join(' / ')",
"Release Room rival intent")

# Surface rival release planning on calendar cards.
old_calendar="""<div class="small" style="margin-top:7px">${d?d.name+' directing':''}${d&&lead?' · ':''}${lead?lead.name+' starring':''}</div></div></div></div>"""
new_calendar="""<div class="small" style="margin-top:7px">${d?d.name+' directing':''}${d&&lead?' · ':''}${lead?lead.name+' starring':''}</div>${aiReleasePlanHTML(f)}</div></div></div>"""
one(old_calendar,new_calendar,"release calendar rival plan")

p.write_text(s,encoding="utf-8")
print("Patched Project Slate to v4.0c.2 — Rival Release Strategy & Market Competition.")
