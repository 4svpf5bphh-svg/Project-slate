from pathlib import Path
import re

p=Path("index.html")
s=p.read_text(encoding="utf-8")

def one(old,new,label):
    global s
    n=s.count(old)
    if n!=1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    s=s.replace(old,new,1)

def replace_function(name,new_src):
    global s
    token=f"function {name}("
    i=s.find(token)
    if i<0:
        raise SystemExit(f"{name}: function not found")
    brace=s.find("{",i)
    depth=0;quote=None;esc=False;j=brace
    while j<len(s):
        c=s[j]
        if quote:
            if esc: esc=False
            elif c=="\\": esc=True
            elif c==quote: quote=None
        else:
            if c in ("'", '"', chr(96)): quote=c
            elif c=="{": depth+=1
            elif c=="}":
                depth-=1
                if depth==0:
                    j+=1
                    break
        j+=1
    if depth!=0:
        raise SystemExit(f"{name}: function boundary not found")
    s=s[:i]+new_src+s[j:]

one("<title>Project Slate — Premium Presentation v4.0b.2.1</title>",
    "<title>Project Slate — Premium Presentation v4.0c.1</title>","title")
one("const VERSION='4.0b.2.1';","const VERSION='4.0c.1';","version")
one("v4.0b.2.1-rough-cut-deadlock-hotfix","v4.0c.1-theatrical-run","audit model label")

marker="function queueWeekendBoxOfficeMoment(worldWeek){"
i=s.find(marker)
if i<0: raise SystemExit("queueWeekendBoxOfficeMoment marker missing")

theatrical=r'''
const THEATRICAL_MOVES={
 support:{id:'support',name:'Support the run',desc:'Put a focused paid push behind the next weekends. Strong audience response makes the spend work harder.'},
 expand:{id:'expand',name:'Expand the footprint',desc:'Lean into demand with a broader theatrical push. Best when the film is already competing near the top of the chart.'},
 pivot:{id:'pivot',name:'Pivot the campaign',desc:'Change what the campaign is selling now that real critics and audiences have shown you what is connecting.'},
 intl:{id:'intl',name:'International push',desc:'Shift the remaining support toward overseas markets. Genre and audience response determine how much room there is to grow.'}
};
function ensureTheatricalRunState(f){
 if(!f)return null;
 f.theatricalRun=f.theatricalRun||{moves:[],createdWeek:state.week};
 f.theatricalRun.moves=Array.isArray(f.theatricalRun.moves)?f.theatricalRun.moves:[];
 return f.theatricalRun;
}
function theatricalMoveLimit(f){return 1+(typeof capitalAssetOwned==='function'&&capitalAssetOwned('distribution')?1:0)}
function theatricalMoveCost(f,id){
 const raw=id==='support'?clamp((f.budget||20)*.025,.35,1.50):id==='expand'?clamp((f.budget||20)*.035,.55,2.00):id==='pivot'?clamp((f.marketing||3)*.12+.20,.30,1.10):clamp((f.budget||20)*.030,.45,1.80);
 return +raw.toFixed(2);
}
function theatricalLatestSettledRow(f){return (f?.weeklyResults||[]).filter(w=>w.settledRank).at(-1)||null}
function theatricalMoveEligibility(f,id){
 const move=THEATRICAL_MOVES[id],t=ensureTheatricalRunState(f),row=theatricalLatestSettledRow(f),reasons=[];
 if(!move||!f||f.owner!=='player'||f.stage!=='cinema')reasons.push('This film is not in an active player theatrical run.');
 if(!row)reasons.push('Wait for the opening weekend to settle first.');
 if(f?.pendingTheatricalFinish)reasons.push('The theatrical run is already closing.');
 if((f?.cinemaWeek||0)>4)reasons.push('The tactical window closes after Theatrical Week 4.');
 const limit=f?theatricalMoveLimit(f):1;
 if((t?.moves?.length||0)>=limit)reasons.push(limit>1?'Both theatrical moves have already been used.':'The studio has already made its theatrical move.');
 if(id==='expand'&&row&&row.settledRank>6&&(f.review?.audience||0)<72)reasons.push('Demand is not strong enough to justify a wider footprint.');
 const cost=f?theatricalMoveCost(f,id):0;
 if(state.cash<cost)reasons.push('The studio does not have enough cash for this move.');
 return {ok:reasons.length===0,reasons,cost,move,row,limit};
}
function theatricalMoveEffectiveness(f,id){
 const audience=f.review?.audience||60,critics=f.review?.critics||60,row=theatricalLatestSettledRow(f),base=clamp((audience-48)/36,.12,1.08);
 if(id==='support')return base;
 if(id==='expand')return clamp(base+(row?.settledRank<=3?.12:row?.settledRank<=6?.04:-.08),.12,1.12);
 if(id==='pivot'){
  const gap=Math.abs(audience-critics),signal=gap>=18?.30:gap>=10?.18:.06;
  return clamp(.32+signal+(audience>=68?.24:audience>=58?.10:0),.20,1.08);
 }
 if(id==='intl'){
  const genre=f.genre||'',travel=genre.includes('Action')||genre.includes('Science')||genre.includes('Fantasy')?1.08:genre.includes('Family')?1:genre.includes('Horror')?.88:genre.includes('Drama')?.68:.78;
  return clamp(base*travel,.16,1.08);
 }
 return base;
}
function theatricalMoveBaseFactors(id){
 if(id==='support')return {dom:[1.11,1.075,1.045,1.025,1.015,1.008],intl:[1.07,1.05,1.03,1.02,1.01,1.005]};
 if(id==='expand')return {dom:[1.16,1.11,1.065,1.035,1.02,1.01],intl:[1.09,1.065,1.04,1.025,1.012,1.006]};
 if(id==='pivot')return {dom:[1.10,1.085,1.06,1.035,1.02,1.01],intl:[1.06,1.05,1.035,1.02,1.01,1.005]};
 return {dom:[1.015,1.012,1.01,1.006,1.003,1],intl:[1.18,1.14,1.10,1.065,1.035,1.02]};
}
function theatricalMoveSummary(f,id,effect){
 const audience=f.review?.audience||0;
 if(id==='support')return audience>=75?'Strong word of mouth gives the added support a credible chance to improve the hold.':audience<55?'The studio can buy visibility, but weak audience response sharply limits what the spend can rescue.':'The extra support should modestly strengthen the remaining run.';
 if(id==='expand')return effect>=.85?'The film has enough demand to make a wider footprint meaningful.':'The expansion adds reach, but underlying demand will decide whether those extra screens pay off.';
 if(id==='pivot'){
  const a=f.review?.audience||0,c=f.review?.critics||0;
  return Math.abs(a-c)>=10?(a>c?'The new campaign leans into the crowd response rather than the critical conversation.':'The new campaign leans into critical approval and a more selective audience sell.'):'The campaign is being sharpened rather than completely reinvented.';
 }
 return effect>=.8?'The genre and audience response give the film a credible opportunity to travel further overseas.':'The international push adds reach, but this material has limited natural overseas upside.';
}
function applyTheatricalMove(f,id){
 const e=theatricalMoveEligibility(f,id);if(!e.ok)return showToast(e.reasons[0]||'That theatrical move is not available.');
 if(!spend(e.cost))return;
 f.investment=(f.investment||0)+e.cost;
 const t=ensureTheatricalRunState(f),start=(f.weeklyResults||[]).length,effect=theatricalMoveEffectiveness(f,id),base=theatricalMoveBaseFactors(id);
 let touched=0;
 for(let n=start;n<(f.weeklyPlan||[]).length;n++){
  const rel=n-start,row=f.weeklyPlan[n];if(!row)continue;
  const df=base.dom[Math.min(rel,base.dom.length-1)]||1,inf=base.intl[Math.min(rel,base.intl.length-1)]||1;
  row.dom=+Math.max(.02,row.dom*(1+(df-1)*effect)).toFixed(4);
  row.intl=+Math.max(.01,row.intl*(1+(inf-1)*effect)).toFixed(4);
  const prevDom=n===start?((f.weeklyResults||[]).at(-1)?.dom||row.dom):f.weeklyPlan[n-1].dom;
  row.drop=n===0?null:+clamp(1-row.dom/Math.max(.01,prevDom),-.25,.92).toFixed(4);
  touched++;
 }
 const summary=theatricalMoveSummary(f,id,effect);
 t.moves.push({id,week:state.week,cost:e.cost,effect:+effect.toFixed(3),fromCinemaWeek:f.cinemaWeek||1,summary});
 f.history=f.history||[];f.history.push('Week '+state.week+': theatrical run — '+e.move.name+' ('+money(e.cost)+').');
 addNews(state,state.studio.name+' has committed '+money(e.cost)+' to '+e.move.name.toLowerCase()+' on '+f.title+'. '+summary,'Your Studio');
 notify('theatrical-move:'+f.id+':'+t.moves.length,f.title+': '+e.move.name,summary,f.id,false,'info');
 save();render();
}
function theatricalRunRead(f){
 const row=theatricalLatestSettledRow(f),aud=f.review?.audience||0;if(!row)return 'The opening weekend is still being counted. Tactical decisions unlock once the market has given you a real result.';
 if(aud<55)return 'Audience response is the limiting factor. You can soften the commercial damage, but more spend cannot manufacture word of mouth.';
 if(row.drop!==null&&row.drop<.28)return 'The hold is excellent. The film has genuine momentum, so an intervention would be exploiting demand rather than trying to rescue it.';
 if(row.drop!==null&&row.drop>.65)return aud>=70?'The drop is steep despite decent audience response. There may still be demand worth defending.':'The run is losing momentum quickly. Any move here is damage control rather than a reset.';
 if(row.settledRank<=3)return 'The film is still in the chart fight. A tactical move could matter if the next weekend is competitive.';
 return 'The run is behaving normally. Holding course is a perfectly valid studio decision.';
}
function theatricalUpcomingCompetition(f){
 const next=state.week+1,rows=state.films.filter(x=>x.id!==f.id&&x.releaseWeek===next&&!['complete','shelved'].includes(x.stage)).sort((a,b)=>(b.budget||0)-(a.budget||0)).slice(0,3);
 return rows;
}
function theatricalInterventionPanel(f){
 const t=ensureTheatricalRunState(f),row=theatricalLatestSettledRow(f),limit=theatricalMoveLimit(f),used=t.moves.length,left=Math.max(0,limit-used),upcoming=theatricalUpcomingCompetition(f);
 const history=used?'<div class="card" style="margin-top:10px">'+t.moves.map(m=>'<div class="listrow"><div><strong>'+THEATRICAL_MOVES[m.id].name+'</strong><div class="small">Week '+m.week+' · '+m.summary+'</div></div><strong>'+money(m.cost)+'</strong></div>').join('')+'</div>':'';
 if(!row)return '<div class="section-title"><h2>Release Room</h2><span class="small">Tactical window opens after the weekend settles</span></div><div class="card body">'+theatricalRunRead(f)+'</div>';
 const closed=f.pendingTheatricalFinish||(f.cinemaWeek||0)>4||left<=0;
 const cards=Object.values(THEATRICAL_MOVES).map(m=>{const e=theatricalMoveEligibility(f,m.id),reason=e.reasons[0]||'',cost=e.cost;return '<div class="card '+(e.ok?'':'')+'"><div class="row"><strong>'+m.name+'</strong><span class="pill">'+money(cost)+'</span></div><div class="small" style="margin-top:7px">'+m.desc+'</div><div class="small" style="margin-top:7px">'+(e.ok?theatricalMoveSummary(f,m.id,theatricalMoveEffectiveness(f,m.id)):reason)+'</div><button class="btn '+(e.ok?'primary':'')+' block" data-theatrical-move="'+m.id+'" data-film-id="'+f.id+'" style="margin-top:10px" '+(e.ok?'':'disabled')+'>'+(e.ok?'Commit move':'Unavailable')+'</button></div>'}).join('');
 return '<div class="section-title"><h2>Release Room</h2><span class="small">'+left+' of '+limit+' tactical move'+(limit===1?'':'s')+' remaining</span></div><div class="card '+(row.drop!==null&&row.drop>.65?'dangerline':row.drop!==null&&row.drop<.28?'goodline':'')+'"><div class="body"><strong>Studio read:</strong> '+theatricalRunRead(f)+'</div>'+(upcoming.length?'<div class="small" style="margin-top:8px"><strong>Next weekend:</strong> '+upcoming.map(x=>x.title+' · '+x.genre).join(' / ')+'</div>':'<div class="small" style="margin-top:8px">No major rival opening is currently dated for next weekend.</div>')+'</div>'+(!closed?'<div class="grid cols2" style="margin-top:10px">'+cards+'</div>':'<div class="card body" style="margin-top:10px">'+(left<=0?'The studio has used its available theatrical move'+(limit>1?'s':'')+'.':'The tactical intervention window has closed for this run.')+'</div>')+history;
}
function theatricalReleaseRoomHTML(films){
 if(!films.length)return '<div class="section-title"><h2>In theatres</h2><span class="small">Live theatrical runs</span></div><div class="card body">You have no films currently in cinemas.</div>';
 const ordered=[...films].sort((a,b)=>(theatricalLatestSettledRow(a)?.settledRank||99)-(theatricalLatestSettledRow(b)?.settledRank||99));
 return '<div class="section-title"><h2>Release Room</h2><span class="small">Follow the run · intervene selectively</span></div>'+ordered.map(f=>{const row=theatricalLatestSettledRow(f),cum=(f.weeklyResults||[]).reduce((a,w)=>a+w.dom+w.intl,0),drop=row?.drop===null?'Opening weekend':row?.drop<0?Math.round(Math.abs(row.drop)*100)+'% growth':row?.drop!==undefined?Math.round(row.drop*100)+'% drop':'Weekend counting',rank=row?.settledRank?'#'+row.settledRank:'Pending',pace=theatricalPace(f);return '<div class="card '+(pace.cls==='good'?'goodline':pace.cls==='bad'?'dangerline':'')+'" style="margin-bottom:14px"><div class="row"><div><strong>'+f.title+'</strong><div class="small">Theatrical Week '+f.cinemaWeek+' · '+distributionLabel(f)+'</div></div><span class="pill '+pace.cls+'">'+pace.label+'</span></div><div class="grid cols4" style="margin-top:10px"><div><div class="badge">Rank</div><strong>'+rank+'</strong></div><div><div class="badge">Latest hold</div><strong>'+drop+'</strong></div><div><div class="badge">Worldwide run</div><strong>'+money(cum)+'</strong></div><div><div class="badge">Audience</div><strong>'+(f.review?.audience??'—')+'%</strong></div></div>'+theatricalInterventionPanel(f)+'<button class="btn block" data-film="'+f.id+'" style="margin-top:10px">Open full film run</button></div>'}).join('');
}

'''
s=s[:i]+theatrical+s[i:]

new_queue=r'''function queueWeekendBoxOfficeMoment(worldWeek){
 const allRows=playerFilms().map(f=>({f,row:filmRowAtWorldWeek(f,worldWeek)})).filter(x=>x.row?.settledRank).sort((a,b)=>a.row.settledRank-b.row.settledRank);
 if(!allRows.length)return false;
 allRows.forEach(({f,row})=>{
  const cum=(f.weeklyResults||[]).filter(w=>(w.worldWeek||0)<=worldWeek).reduce((a,w)=>a+w.dom+w.intl,0);
  const hold=row.drop===null?'opening weekend':row.drop<0?Math.round(Math.abs(row.drop)*100)+'% growth':Math.round(row.drop*100)+'% drop';
  notify('boxweek:'+f.id+':'+worldWeek,f.title+': #'+row.settledRank+' · '+hold,money(row.dom+row.intl)+' worldwide this weekend · '+money(cum)+' cumulative. Open Release to follow the run.',f.id,false,'info');
 });
 const rows=allRows.filter(x=>!x.f.pendingTheatricalFinish);if(!rows.length)return false;
 const enriched=rows.map(x=>{const f=x.f,row=x.row,prior=(f.weeklyResults||[]).filter(w=>w.worldWeek<worldWeek&&w.settledRank).sort((a,b)=>b.worldWeek-a.worldWeek)[0],cum=(f.weeklyResults||[]).filter(w=>(w.worldWeek||0)<=worldWeek).reduce((a,w)=>a+w.dom+w.intl,0),priorCum=(f.weeklyResults||[]).filter(w=>(w.worldWeek||0)<worldWeek).reduce((a,w)=>a+w.dom+w.intl,0),opening=(row.week||f.cinemaWeek)===1,milestone=cum>=250&&priorCum<250?250:cum>=100&&priorCum<100?100:null;return {...x,prior,cum,opening,milestone,exceptional:opening||row.drop<0||row.drop>.72||(row.settledRank===1&&prior?.settledRank!==1)||!!milestone}});
 const candidates=enriched.filter(x=>x.exceptional).sort((a,b)=>(b.opening-a.opening)||a.row.settledRank-b.row.settledRank);if(!candidates.length)return false;
 const lead=candidates[0],f=lead.f,row=lead.row,rank=row.settledRank,prior=lead.prior,cum=lead.cum,opening=lead.opening,move=prior?prior.settledRank-rank:0;
 const slate=rows.map(x=>x.f.title+' #'+x.row.settledRank+' · '+money(x.row.dom+x.row.intl)+' WW').join(' · ');
 let title,result,tone='neutral';
 if(opening){title=f.title+' opens at #'+rank;result=rank===1?'#1 DOMESTIC':'OPENING WEEKEND';tone=rank===1?'great':f.releaseProfile?.type==='bomb'?'bad':f.releaseProfile?.type==='breakout'?'great':'neutral'}
 else if(lead.milestone){title=f.title+' crosses '+money(lead.milestone)+' worldwide';result='RUN MILESTONE';tone='great'}
 else if(row.drop<0){title=f.title+' grows in theatres';result='WEEKEND GROWTH';tone='great'}
 else if(row.drop>.72){title=f.title+' suffers a severe weekend drop';result='SHARP DECLINE';tone='bad'}
 else {title=f.title+' takes #1';result='#1 DOMESTIC';tone='great'}
 queueStudioMoment(f,'boxOffice',{kicker:'WEEKEND BOX OFFICE',title,tone,result,summary:opening?'The opening weekend is settled. '+f.title+' takes '+money(row.dom)+' domestic and '+money(row.intl)+' internationally for '+money(row.dom+row.intl)+' worldwide.':row.drop<0?'The run expanded this weekend, with domestic business growing '+Math.round(Math.abs(row.drop)*100)+'%.':row.drop>.72?'The film fell '+Math.round(row.drop*100)+' domestically this weekend and is losing momentum quickly.':lead.milestone?'The theatrical run has reached a meaningful worldwide milestone.':'The film has climbed to the top of the settled domestic chart.',stats:[['Domestic rank','#'+rank],['Rank movement',prior?(move>0?'▲ '+move:move<0?'▼ '+Math.abs(move):'—'):'NEW'],['Worldwide this weekend',money(row.dom+row.intl)],['Worldwide run',money(cum)]],sections:[{title:'Your slate this weekend',text:slate},{title:'What happens next',text:'Routine weekly performance now lives in the Release Room. Full-screen moments are reserved for openings, unusual holds or collapses, chart breakthroughs and major run milestones.'}]});
 return true;
}'''
replace_function("queueWeekendBoxOfficeMoment",new_queue)

one("f.pressReviews=makeReviewRoundup(f,Math.round(critics),Math.round(audience));\n f.weeklyPlan=run.plan;",
    "f.pressReviews=makeReviewRoundup(f,Math.round(critics),Math.round(audience));\n f.weeklyPlan=run.plan;ensureTheatricalRunState(f);",
    "release run state")

one("const playerCampaigns=playerFilms().filter(f=>['marketing','scheduled','cinema'].includes(f.stage)),inProgress=playerFilms().map(f=>({f,row:filmRowAtWorldWeek(f,state.week)})).filter(x=>x.row&&!x.row.settledRank);",
    "const playerCampaigns=playerFilms().filter(f=>['marketing','scheduled'].includes(f.stage)),inTheatres=playerFilms().filter(f=>f.stage==='cinema'),inProgress=playerFilms().map(f=>({f,row:filmRowAtWorldWeek(f,state.week)})).filter(x=>x.row&&!x.row.settledRank);",
    "release screen film groups")
one("const tabs=sectionTabs([['box','Box Office'],['calendar','Calendar'],['campaigns','Campaigns',playerCampaigns.length]],tab,'data-release-tab');",
    "const tabs=sectionTabs([['box','Box Office'],['theatres','In Theatres',inTheatres.length],['calendar','Calendar'],['campaigns','Campaigns',playerCampaigns.length]],tab,'data-release-tab');",
    "release tabs")
one("<div class=\"section-title\"><h2>Your public slate</h2><span class=\"small\">Marketing, dated films and current releases</span></div>",
    "<div class=\"section-title\"><h2>Your campaigns</h2><span class=\"small\">Marketing and dated films before opening weekend</span></div>",
    "campaign heading")
one("You have no films currently in marketing, scheduled or cinemas.","You have no films currently in marketing or scheduled for release.","campaign empty copy")
pat=r"}else\\{\\s+const leader=chart\\[0\\],market=chart\\.reduce\\(\\(a,x\\)=>a\\+x\\.gross,0\\),playerRows=chart\\.filter\\(x=>x\\.owner==='player'\\);"
repl="""}else if(tab==='theatres'){
   body=theatricalReleaseRoomHTML(inTheatres);
  }else{
   const leader=chart[0],market=chart.reduce((a,x)=>a+x.gross,0),playerRows=chart.filter(x=>x.owner==='player');"""
s,n=re.subn(pat,repl,s,count=1)
if n!=1:
    raise SystemExit(f"in theatres release tab: expected 1 regex match, found {n}")


one("  <div class=\"section-title\"><h2>The box-office race</h2><span class=\"small\">Your run against overlapping releases</span></div>${cinemaComparisonGraph(f)}",
    "  ${theatricalInterventionPanel(f)}\n  <div class=\"section-title\"><h2>The box-office race</h2><span class=\"small\">Your run against overlapping releases</span></div>${cinemaComparisonGraph(f)}",
    "film detail release room")

one("document.querySelectorAll('[data-release-tab]').forEach(b=>b.onclick=()=>{state.uiReleaseTab=b.dataset.releaseTab;save();render()});",
    "document.querySelectorAll('[data-release-tab]').forEach(b=>b.onclick=()=>{state.uiReleaseTab=b.dataset.releaseTab;save();render()});\n document.querySelectorAll('[data-theatrical-move]').forEach(b=>b.onclick=e=>{e.stopPropagation();applyTheatricalMove(filmById(b.dataset.filmId),b.dataset.theatricalMove)});",
    "theatrical move binding")

p.write_text(s,encoding="utf-8")
print("Patched Project Slate to v4.0c.1 — The Theatrical Run.")
