// v3.9.1 — Hollywood History
// Long-career memory without adding another management layer: anniversaries,
// evolving studio eras, rival leadership turnover and Hall of Slate snapshots.

const RIVAL_SUCCESSORS={
 'Northstar Studios':[
  {name:'Caleb Monroe',title:'Chief Executive',personality:'Brand Builder',bio:'A polished operator who sees stars, release dates and studio identity as one integrated product.'},
  {name:'Naomi Bell',title:'Chair & CEO',personality:'Portfolio Hawk',bio:'A former finance chief who likes tentpoles, but only when the surrounding slate can absorb the miss.'}
 ],
 'Arcadia Pictures':[
  {name:'Sofia Hart',title:'Chief Executive',personality:'Consensus Builder',bio:'Known for broad commercial packages and unusually patient negotiations with talent.'},
  {name:'Daniel Brooks',title:'President & CEO',personality:'Numbers-first',bio:'A market-reader who trusts clean audience data, controlled budgets and repeatable release corridors.'}
 ],
 'Red Crown':[
  {name:'Mateo Voss',title:'President',personality:'Provocateur',bio:'A genre executive who wants every film to give audiences something they have not already seen three times.'},
  {name:'Kira Stone',title:'Chief Executive',personality:'Counter-programmer',bio:'Built her reputation by finding the weekend everyone else had overlooked.'}
 ],
 'Bluebird Films':[
  {name:'Amelia Moreau',title:'Managing Partner',personality:'Curator',bio:'A filmmaker-first executive who treats the slate as a reputation built one director at a time.'},
  {name:'Julian Reed',title:'Chief Executive',personality:'Prestige Strategist',bio:'An awards-season veteran who prefers patient development and carefully chosen theatrical bets.'}
 ],
 'Ironwood Pictures':[
  {name:'Nadia Hart',title:'Chair & CEO',personality:'Rights Architect',bio:'Obsessed with ownership, sequels and the long commercial life of a property after opening weekend.'},
  {name:'Theo Mercer',title:'Chief Executive',personality:'Franchise Operator',bio:'A disciplined sequel-builder who is willing to reboot aggressively when a property begins to cool.'}
 ],
 'Lantern House':[
  {name:'Mina Sayeed',title:'Managing Partner',personality:'Filmmaker Advocate',bio:'A quiet relationship-builder whose first question is usually whether the director still recognises the movie at the end.'},
  {name:'Rowan Cole',title:'Chief Executive',personality:'Independent Builder',bio:'Keeps costs tight, relationships long and ambitions larger than the company balance sheet suggests.'}
 ],
 'Apex Motion Group':[
  {name:'Gideon Cross',title:'Chair & CEO',personality:'Consolidator',bio:'A scale-obsessed executive who believes the company should own enough premium material that the market has to react to it.'},
  {name:'Simone Vale',title:'Chief Executive',personality:'Expansionist',bio:'Treats every category as a possible growth lane and has the capital to test several at once.'}
 ]
};

function ensureStudioHistory(st=state){
 st.studioHistory=st.studioHistory||{anniversaries:[],rivalLeadership:[],hallSnapshots:[],retrospectives:[],lastLeadershipChangeWeek:0};
 st.studioHistory.anniversaries=st.studioHistory.anniversaries||[];
 st.studioHistory.rivalLeadership=st.studioHistory.rivalLeadership||[];
 st.studioHistory.hallSnapshots=st.studioHistory.hallSnapshots||[];
 st.studioHistory.retrospectives=st.studioHistory.retrospectives||[];
 st.studioHistory.lastLeadershipChangeWeek=st.studioHistory.lastLeadershipChangeWeek||0;
 return st.studioHistory;
}
function careerYearAtWeek(week){return Math.max(1,Math.ceil(Math.max(1,week||1)/52))}
function careerSpanLabel(startWeek,endWeek=state.week){
 const start=careerYearAtWeek(startWeek),end=careerYearAtWeek(endWeek);
 return start===end?`Year ${start}`:`Years ${start}–${end}`;
}
function studioEraArchive(){
 const mem=ensureStudioIdentity(),changes=[...(mem.history||[])].sort((a,b)=>(a.week||0)-(b.week||0));
 if(!changes.length)return [];
 return changes.map((x,i)=>({
  id:x.id,label:x.label,startWeek:x.week||1,endWeek:i<changes.length-1?Math.max(x.week||1,(changes[i+1].week||1)-1):state.week,current:i===changes.length-1
 })).reverse();
}
function anniversaryOrdinal(n){
 const mod10=n%10,mod100=n%100;return `${n}${mod10===1&&mod100!==11?'st':mod10===2&&mod100!==12?'nd':mod10===3&&mod100!==13?'rd':'th'}`;
}
function anniversarySnapshot(year){
 const cutoff=year*52,done=completedPlayerFilms().filter(f=>(f.completeWeek||0)<=cutoff);
 const gross=done.reduce((s,f)=>s+(f.finalGross||0),0),profit=done.reduce((s,f)=>s+studioFilmProfit(f),0);
 const biggest=[...done].sort((a,b)=>(b.finalGross||0)-(a.finalGross||0))[0]||null;
 const best=[...done].filter(f=>f.review).sort((a,b)=>(b.review?.critics||0)-(a.review?.critics||0))[0]||null;
 const first=[...done].sort((a,b)=>(a.completeWeek||0)-(b.completeWeek||0))[0]||null;
 const awards=(state.awardsArchive||[]).filter(x=>(x.season||0)<=year).reduce((a,x)=>({wins:a.wins+(x.playerWins||0),noms:a.noms+(x.playerNoms||0)}),{wins:0,noms:0});
 const hall=typeof studioHallOfSlate==='function'?studioHallOfSlate(4).map(x=>x.f.id):[];
 const identity=studioIdentitySnapshot().primary;
 return {year,week:state.week,films:done.length,gross,profit,biggest:biggest?{id:biggest.id,title:biggest.title,gross:biggest.finalGross}:null,best:best?{id:best.id,title:best.title,critics:best.review.critics}:null,first:first?{id:first.id,title:first.title}:null,awards,identity:{id:identity.id,label:identity.label},hall};
}
function queueStudioAnniversary(snapshot){
 const years=snapshot.year,profitText=`${snapshot.profit>=0?'+':''}${money(snapshot.profit)}`;
 const sections=[];
 if(snapshot.first&&snapshot.biggest)sections.push({title:'From the first slate to now',text:`${snapshot.first.title} was part of the beginning. ${snapshot.biggest.title} is the biggest worldwide release so far at ${money(snapshot.biggest.gross)}.`});
 if(snapshot.best)sections.push({title:'The film the critics remember',text:`${snapshot.best.title} remains the studio's highest-reviewed release through this point at ${snapshot.best.critics}% with critics.`});
 sections.push({title:'What the Lot calls you now',text:`After ${years} years, the clearest trade shorthand for the studio is “${snapshot.identity.label}.” That label can still change with the next era of films.`});
 queueStudioMoment(null,'studioAnniversary',{kicker:`${anniversaryOrdinal(years)} ANNIVERSARY`,title:`${state.studio.name}: ${years} years on The Lot`,tone:snapshot.profit>=0?'great':'warn',result:`${snapshot.films} FILMS · ${money(snapshot.gross)} WW`,summary:`A career that began as a new production company now has ${snapshot.films} released film${snapshot.films===1?'':'s'}, ${snapshot.awards.wins} award win${snapshot.awards.wins===1?'':'s'} and ${profitText} in recorded theatrical studio P/L.`,stats:[['Released films',String(snapshot.films)],['Worldwide box office',money(snapshot.gross)],['Recorded theatrical P/L',profitText],['Awards',`${snapshot.awards.wins} wins`]],sections});
}
function maybeRecordStudioAnniversary(){
 if(state.week%52!==0)return false;
 const year=Math.floor(state.week/52);if(year<5||year%5!==0)return false;
 const h=ensureStudioHistory();if(h.anniversaries.some(x=>x.year===year))return false;
 const snap=anniversarySnapshot(year);h.anniversaries.unshift(snap);h.anniversaries=h.anniversaries.slice(0,12);
 h.retrospectives.unshift({year,week:state.week,title:`${year} Years in Pictures`,summary:`${state.studio.name} reached its ${anniversaryOrdinal(year)} anniversary with ${snap.films} released films and ${money(snap.gross)} in worldwide box office.`});h.retrospectives=h.retrospectives.slice(0,20);
 addNews(state,`${year} years after opening its doors, ${state.studio.name} has released ${snap.films} films, generated ${money(snap.gross)} worldwide and collected ${snap.awards.wins} major award win${snap.awards.wins===1?'':'s'}.`,'Studio Watch');
 queueStudioAnniversary(snap);return true;
}
function recordHallSnapshot(){
 if(state.week%52!==0||typeof studioHallOfSlate!=='function')return false;
 const year=Math.floor(state.week/52),h=ensureStudioHistory();if(h.hallSnapshots.some(x=>x.year===year))return false;
 const hall=studioHallOfSlate(4).map((x,i)=>({rank:i+1,filmId:x.f.id,title:x.f.title,score:+x.score.toFixed(2)}));
 const prior=h.hallSnapshots[0]?.hall||[];h.hallSnapshots.unshift({year,week:state.week,hall});h.hallSnapshots=h.hallSnapshots.slice(0,30);
 if(year>=3&&hall[0]&&prior[0]&&hall[0].filmId!==prior[0].filmId)addNews(state,`${hall[0].title} has replaced ${prior[0].title} at the top of ${state.studio.name}'s Hall of Slate after the latest year of releases and awards.`,'Studio Watch');
 return true;
}
function rivalRecentProfit(rv,weeks=104){
 return (rv.commercialHistory||[]).filter(x=>state.week-(x.week||state.week)<=weeks).reduce((a,x)=>a+(x.profit||0),0);
}
function rivalHeadTenureWeeks(rv){ensureRivalCharacter(rv);return state.week-(rv.head?.appointedWeek||1)}
function nextRivalHead(rv){
 const used=new Set([rv.head?.name,...ensureStudioHistory().rivalLeadership.filter(x=>x.rivalId===rv.id).map(x=>x.newHead)]);
 const pool=RIVAL_SUCCESSORS[rv.name]||[];return pool.find(x=>!used.has(x.name))||null;
}
function maybeChangeRivalLeadership(){
 if(state.week%52!==0||state.week<208)return false;
 const h=ensureStudioHistory();if(state.week-(h.lastLeadershipChangeWeek||0)<78)return false;
 const year=Math.floor(state.week/52),r=makeRng(hash(`${state.seed}|rival-leadership|${year}`));
 if(r()>.46)return false;
 const candidates=(state.rivals||[]).map(rv=>({rv,next:nextRivalHead(rv),tenure:rivalHeadTenureWeeks(rv),recent:rivalRecentProfit(rv)})).filter(x=>x.next&&x.tenure>=156);
 if(!candidates.length)return false;
 candidates.sort((a,b)=>((b.tenure/52)+(b.recent<0?4:0))-((a.tenure/52)+(a.recent<0?4:0)));
 const pickFrom=candidates.slice(0,Math.min(3,candidates.length)),chosen=pickFrom[Math.floor(r()*pickFrom.length)],rv=chosen.rv,old=rv.head,next=deep(chosen.next);
 next.appointedWeek=state.week;next.predecessor=old?.name||null;rv.head=next;rv.relationship=Math.round((rv.relationship||0)*.55);rv.relationshipHistory.unshift({week:state.week,from:'leadership change',to:rv.relationship,delta:0,reason:`${next.name} succeeded ${old?.name||'the previous leadership team'}`});
 const reason=chosen.recent<-10?'after a difficult commercial run':chosen.tenure>=312?'after the outgoing chief retired following a long tenure':'as the studio enters a new strategic phase';
 h.rivalLeadership.unshift({week:state.week,year,rivalId:rv.id,studio:rv.name,oldHead:old?.name||'Previous leadership',newHead:next.name,title:next.title,personality:next.personality,reason});h.rivalLeadership=h.rivalLeadership.slice(0,30);h.lastLeadershipChangeWeek=state.week;
 addNews(state,`${rv.name} has named ${next.name} ${next.title}, succeeding ${old?.name||'its previous leadership'} ${reason}. The move is expected to reshape how the studio approaches packages and competition on The Lot.`,'Industry');
 return true;
}
function processHollywoodHistoryWeek(){
 if(!state.studio||!state.careerStarted)return;
 ensureStudioHistory();
 if(state.week%52!==0)return;
 recordHallSnapshot();
 maybeRecordStudioAnniversary();
 maybeChangeRivalLeadership();
}
function hollywoodHistoryCallback(f,currentProfit=f.studioRevenue-f.investment){
 const prior=playerFilms().filter(x=>x.id!==f.id&&x.stage==='complete'&&(x.completeWeek||0)<=(f.completeWeek||state.week)).sort((a,b)=>(b.completeWeek||0)-(a.completeWeek||0));
 if(!prior.length)return null;
 const currentWeek=f.completeWeek||state.week,yearsSince=x=>Math.floor(Math.max(0,currentWeek-(x.completeWeek||currentWeek))/52);
 const same=[...prior].filter(x=>x.genre===f.genre).sort((a,b)=>filmStudioLegacyScore(b)-filmStudioLegacyScore(a))[0]||null;
 const biggest=[...prior].sort((a,b)=>(b.finalGross||0)-(a.finalGross||0))[0];
 const bestCrit=[...prior].filter(x=>x.review).sort((a,b)=>(b.review?.critics||0)-(a.review?.critics||0))[0]||null;
 const worst=[...prior].sort((a,b)=>studioFilmProfit(a)-studioFilmProfit(b))[0];
 const first=[...prior].sort((a,b)=>(a.completeWeek||0)-(b.completeWeek||0))[0];
 let match=same,kind='genre';
 if((f.finalGross||0)>(biggest?.finalGross||0)){match=biggest;kind='box office'}
 else if((f.review?.critics||0)>(bestCrit?.review?.critics||0)){match=bestCrit;kind='critical'}
 else if(currentProfit<0&&worst&&studioFilmProfit(worst)<0){match=worst;kind='loss'}
 else if(first&&yearsSince(first)>=5&&Math.abs(currentProfit-studioFilmProfit(same||first))<5){match=first;kind='origin'}
 match=match||prior[0];const y=yearsSince(match),gap=currentProfit-studioFilmProfit(match);
 const lead=y>=3?`${y} years after ${match.title}, `:`Compared with ${match.title}, `;
 const text=kind==='box office'?`${lead}${f.title} has moved beyond the studio's previous box-office benchmark. ${match.title} had stood at ${money(match.finalGross||0)} worldwide; the new film closes at ${money(f.finalGross||0)}.`:
  kind==='critical'?`${lead}${f.title} has become the stronger critical reference point, finishing at ${f.review?.critics||0}% against ${match.review?.critics||0}% for ${match.title}.`:
  kind==='loss'?`${lead}${f.title} adds another difficult commercial chapter. The studio result is ${gap>=0?money(Math.abs(gap))+' better':money(Math.abs(gap))+' worse'} than the loss on ${match.title}.`:
  kind==='origin'?`${lead}${state.studio.name} is no longer the company that released its first film. ${f.title} closes with ${currentProfit>=0?'a '+money(currentProfit)+' profit':'a '+money(Math.abs(currentProfit))+' loss'}, against ${studioFilmProfit(match)>=0?'a '+money(studioFilmProfit(match))+' profit':'a '+money(Math.abs(studioFilmProfit(match)))+' loss'} on ${match.title}.`:
  `${lead}${f.title} ${gap>=0?'improved on':'fell short of'} that ${f.genre.toLowerCase()} studio result by ${money(Math.abs(gap))}.`;
 return {filmId:match.id,title:match.title,kind,text};
}
function studioHistoryBody(){
 const h=ensureStudioHistory(),eras=studioEraArchive(),years=[...(state.yearbooks||[])].sort((a,b)=>b.year-a.year),leadership=h.rivalLeadership||[],snaps=h.hallSnapshots||[];
 const ann=h.anniversaries||[];
 return `<div class="legacy-hero"><div><div class="badge">HOLLYWOOD HISTORY</div><div class="legacy-score">${Math.max(1,Math.floor(state.week/52))}</div><div class="legacy-label">years of studio history</div><div class="body">The Lot now remembers eras, anniversaries, changing rival leadership and which films occupied the Hall of Slate at different points in the career.</div></div><div class="legacy-count"><strong>${ann.length}</strong><span>major anniversaries</span><strong style="margin-top:10px">${leadership.length}</strong><span>rival regime changes</span></div></div>
 <div class="section-title"><h2>Your studio eras</h2><span class="small">Trade identities that defined different runs of films</span></div><div class="grid cols2">${eras.length?eras.map(e=>`<div class="card ${e.current?'goodline':''}"><div class="row"><strong>${e.label}</strong><span class="pill ${e.current?'good':'blue'}">${e.current?'CURRENT':'PAST ERA'}</span></div><div class="small" style="margin-top:7px">${careerSpanLabel(e.startWeek,e.endWeek)} · began W${e.startWeek}</div></div>`).join(''):`<div class="card body">Release enough films for the trades to give the studio a durable identity. Those identities will be preserved here when the next era replaces them.</div>`}</div>
 ${ann.length?`<div class="section-title"><h2>Anniversary retrospectives</h2></div><div class="grid cols2">${ann.map(a=>`<div class="card"><div class="row"><strong>${a.year} Years in Pictures</strong><span class="pill">${a.identity?.label||'Studio era'}</span></div><div class="small" style="margin-top:7px">${a.films} releases · ${money(a.gross)} worldwide · ${a.profit>=0?'+':''}${money(a.profit)} recorded theatrical P/L</div>${a.biggest?`<div class="listrow"><span>Biggest film</span><strong>${a.biggest.title}</strong></div>`:''}${a.best?`<div class="listrow"><span>Critical high</span><strong>${a.best.title} · ${a.best.critics}%</strong></div>`:''}</div>`).join('')}</div>`:''}
 ${snaps.length?`<div class="section-title"><h2>Hall of Slate through the years</h2><span class="small">Who sat at #1 when each year closed</span></div><div class="card">${snaps.slice(0,12).map(s=>`<div class="listrow"><span>Year ${s.year}</span><strong>${s.hall?.[0]?.title||'No inducted film yet'}</strong></div>`).join('')}</div>`:''}
 ${leadership.length?`<div class="section-title"><h2>The Lot changes around you</h2><span class="small">Rival studio leadership history</span></div><div class="card">${leadership.slice(0,12).map(x=>`<div class="listrow"><div><strong>${x.studio}</strong><div class="small">${x.oldHead} → ${x.newHead} · ${x.reason}</div></div><span class="small">Year ${x.year}</span></div>`).join('')}</div>`:''}
 ${years.length?`<div class="section-title"><h2>Year-by-year record</h2></div><div class="grid cols2">${years.slice(0,12).map(y=>`<div class="card"><div class="row"><strong>Year ${y.year} · ${y.era||'Industry year'}</strong><span class="small">W${y.week}</span></div>${y.playerHeadline?`<div class="small" style="margin-top:7px">Your headline: <strong>${y.playerHeadline.title}</strong></div>`:''}${y.biggestGross?`<div class="small" style="margin-top:5px">Industry box-office leader: ${y.biggestGross.title}</div>`:''}</div>`).join('')}</div>`:''}`;
}
