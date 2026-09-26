// Studio milestones are a medium-term reward loop, not a win condition.
// They never end the career and currently do not alter simulation balance.

const STUDIO_MILESTONES=[
 // FIRSTS
 {id:'first_release',category:'Firsts',title:'Opening Night',desc:'Release your first film.',points:5,target:1,value:()=>completedPlayerFilms().length,format:v=>`${Math.min(v,1)}/1 film released`},
 {id:'first_profit',category:'Firsts',title:'In the Black',desc:'Finish a film with a positive studio result.',points:5,target:1,value:()=>completedPlayerFilms().filter(f=>studioFilmProfit(f)>0).length,format:v=>`${Math.min(v,1)}/1 profitable film`},
 {id:'first_number_one',category:'Firsts',title:'Top of the Chart',desc:'Have a film officially settle at #1 domestically for a weekend.',points:10,target:1,value:()=>numberOnePlayerFilms(),format:v=>`${Math.min(v,1)}/1 #1 film`},
 {id:'first_nomination',category:'Firsts',title:'On the Ballot',desc:'Earn the studio’s first major awards nomination.',points:10,target:1,value:()=>playerAwardTotals().noms,format:v=>`${Math.min(v,1)}/1 nomination`},
 {id:'first_award',category:'Firsts',title:'Awards Night',desc:'Win the studio’s first major annual award.',points:15,target:1,value:()=>playerAwardTotals().wins,format:v=>`${Math.min(v,1)}/1 win`},

 // BOX OFFICE
 {id:'first_100m',category:'Box Office',title:'Century Club',desc:'Release a film that reaches $100m worldwide.',points:10,target:100,value:()=>maxPlayerGross(),format:v=>`${money(Math.min(v,100))} / $100.0m`},
 {id:'first_250m',category:'Box Office',title:'Quarter-Billion Picture',desc:'Release a film that reaches $250m worldwide.',points:15,target:250,value:()=>maxPlayerGross(),format:v=>`${money(Math.min(v,250))} / $250.0m`},
 {id:'first_500m',category:'Box Office',title:'Global Event',desc:'Release a film that reaches $500m worldwide.',points:25,target:500,value:()=>maxPlayerGross(),format:v=>`${money(Math.min(v,500))} / $500.0m`},
 {id:'lifetime_500m',category:'Box Office',title:'Half-Billion Slate',desc:'Reach $500m in lifetime worldwide box office.',points:10,target:500,value:()=>lifetimePlayerGross(),format:v=>`${money(Math.min(v,500))} / $500.0m`},
 {id:'lifetime_1b',category:'Box Office',title:'Billion-Dollar Studio',desc:'Reach $1bn in lifetime worldwide box office.',points:20,target:1000,value:()=>lifetimePlayerGross(),format:v=>`${money(Math.min(v,1000))} / $1.0bn`},
 {id:'lifetime_2_5b',category:'Box Office',title:'Global Footprint',desc:'Reach $2.5bn in lifetime worldwide box office.',points:30,target:2500,value:()=>lifetimePlayerGross(),format:v=>`${money(Math.min(v,2500))} / $2.5bn`},
 {id:'five_number_ones',category:'Box Office',title:'Own the Weekend',desc:'Release five films that spend at least one weekend at #1 domestically.',points:20,target:5,value:()=>numberOnePlayerFilms(),format:v=>`${Math.min(v,5)}/5 #1 films`},

 // STUDIO BUILDING
 {id:'five_films',category:'Studio',title:'A Real Slate',desc:'Release five films.',points:5,target:5,value:()=>completedPlayerFilms().length,format:v=>`${Math.min(v,5)}/5 releases`},
 {id:'ten_films',category:'Studio',title:'Staying Power',desc:'Release ten films.',points:10,target:10,value:()=>completedPlayerFilms().length,format:v=>`${Math.min(v,10)}/10 releases`},
 {id:'twenty_films',category:'Studio',title:'Deep Catalogue',desc:'Release twenty films.',points:20,target:20,value:()=>completedPlayerFilms().length,format:v=>`${Math.min(v,20)}/20 releases`},
 {id:'five_profitable',category:'Studio',title:'Repeat Business',desc:'Produce five profitable releases.',points:10,target:5,value:()=>profitablePlayerFilms(),format:v=>`${Math.min(v,5)}/5 profitable releases`},
 {id:'ten_profitable',category:'Studio',title:'Bankable Operation',desc:'Produce ten profitable releases.',points:20,target:10,value:()=>profitablePlayerFilms(),format:v=>`${Math.min(v,10)}/10 profitable releases`},
 {id:'three_profit_streak',category:'Studio',title:'Hot Hand',desc:'Put together three profitable releases in a row.',points:10,target:3,value:()=>bestProfitableStreak(),format:v=>`${Math.min(v,3)}/3-film streak`},
 {id:'five_profit_streak',category:'Studio',title:'Machine Room',desc:'Put together five profitable releases in a row.',points:20,target:5,value:()=>bestProfitableStreak(),format:v=>`${Math.min(v,5)}/5-film streak`},
 {id:'top_studio',category:'Studio',title:'Above the Door',desc:'Reach #1 in the Industry Studio Table.',points:20,target:1,value:()=>playerStudioStanding()?.rank===1?1:0,format:v=>v?'#1 reached':`Current rank #${playerStudioStanding()?.rank||'?'}`},
 {id:'recognition_50',category:'Studio',title:'Recognised Name',desc:'Reach 50 studio recognition.',points:10,target:50,value:()=>ensureStudioGrowth().recognition||0,format:v=>`${Math.round(v)}/50 recognition`},
 {id:'recognition_80',category:'Studio',title:'Power Player',desc:'Reach 80 studio recognition.',points:20,target:80,value:()=>ensureStudioGrowth().recognition||0,format:v=>`${Math.round(v)}/80 recognition`},
 {id:'identity_established',category:'Studio',title:'They Know What You Are',desc:'Establish at least one durable studio identity in The Lot.',points:10,target:1,value:()=>studioIdentitySnapshot().established.length,format:v=>v?'Identity established':'No established identity yet'},

 // CRAFT & AUDIENCE
 {id:'critical_90',category:'Craft',title:'Critical Landmark',desc:'Release a film with a 90%+ critics score.',points:10,target:90,value:()=>maxCriticScore(),format:v=>`${Math.min(Math.round(v),90)}/90 critics`},
 {id:'audience_90',category:'Craft',title:'Audience Phenomenon',desc:'Release a film with a 90%+ audience score.',points:10,target:90,value:()=>maxAudienceScore(),format:v=>`${Math.min(Math.round(v),90)}/90 audience`},
 {id:'universal_acclaim',category:'Craft',title:'No Argument',desc:'Release a film with both critics and audience at 85% or better.',points:20,target:1,value:()=>completedPlayerFilms().filter(f=>(f.review?.critics||0)>=85&&(f.review?.audience||0)>=85).length,format:v=>`${Math.min(v,1)}/1 universally acclaimed film`},
 {id:'critical_run',category:'Craft',title:'Critics’ Run',desc:'Release three films scoring at least 80% with critics.',points:20,target:3,value:()=>completedPlayerFilms().filter(f=>(f.review?.critics||0)>=80).length,format:v=>`${Math.min(v,3)}/3 films at 80%+`},
 {id:'audience_run',category:'Craft',title:'Crowd Trust',desc:'Release three films scoring at least 85% with audiences.',points:20,target:3,value:()=>completedPlayerFilms().filter(f=>(f.review?.audience||0)>=85).length,format:v=>`${Math.min(v,3)}/3 films at 85%+`},

 // AWARDS
 {id:'five_awards',category:'Awards',title:'Trophy Cabinet',desc:'Accumulate five major awards wins.',points:20,target:5,value:()=>playerAwardTotals().wins,format:v=>`${Math.min(v,5)}/5 wins`},
 {id:'ten_awards',category:'Awards',title:'Awards Powerhouse',desc:'Accumulate ten major awards wins.',points:30,target:10,value:()=>playerAwardTotals().wins,format:v=>`${Math.min(v,10)}/10 wins`},
 {id:'picture_win',category:'Awards',title:'The Big One',desc:'Win Best Picture.',points:25,target:1,value:()=>playerAwardWinsByCategory('picture'),format:v=>v?'Best Picture won':'No Best Picture win yet'},
 {id:'director_win',category:'Awards',title:'Director’s Night',desc:'Win Best Director.',points:20,target:1,value:()=>playerAwardWinsByCategory('director'),format:v=>v?'Best Director won':'No directing win yet'},
 {id:'performance_win',category:'Awards',title:'Performance of the Year',desc:'Win Lead or Supporting Performance.',points:20,target:1,value:()=>playerAwardWinsByCategories(['lead','support']),format:v=>v?'Performance award won':'No acting win yet'},
 {id:'screenplay_win',category:'Awards',title:'On the Page',desc:'Win Best Screenplay.',points:20,target:1,value:()=>playerAwardWinsByCategory('screenplay'),format:v=>v?'Screenplay award won':'No screenplay win yet'},

 // TALENT & IP
 {id:'first_breakout',category:'Talent & IP',title:'We Found Them',desc:'Have one of your films create a talent breakout story.',points:10,target:1,value:()=>playerBreakoutFilmCount(),format:v=>`${Math.min(v,1)}/1 breakout`},
 {id:'first_franchise',category:'Talent & IP',title:'Second Chapter',desc:'Release the studio’s first sequel, revival, reboot or spin-off.',points:10,target:1,value:()=>playerContinuationCount(),format:v=>`${Math.min(v,1)}/1 continuation released`},
 {id:'trilogy',category:'Talent & IP',title:'Three Chapters Deep',desc:'Release a third instalment in one of your properties.',points:20,target:3,value:()=>maxPlayerFranchiseInstallment(),format:v=>`${Math.min(v,3)}/3 instalments`},

 // LONGEVITY
 {id:'five_years',category:'Longevity',title:'Five Years in Pictures',desc:'Keep the studio operating for five full 52-week years.',points:10,target:5,value:()=>careerYears(),format:v=>`${Math.min(v,5)}/5 years`},
 {id:'ten_years',category:'Longevity',title:'An Institution',desc:'Keep the studio operating for ten full 52-week years.',points:20,target:10,value:()=>careerYears(),format:v=>`${Math.min(v,10)}/10 years`},
 {id:'twenty_years',category:'Longevity',title:'A Generation of Movies',desc:'Keep the studio operating for twenty full 52-week years.',points:35,target:20,value:()=>careerYears(),format:v=>`${Math.min(v,20)}/20 years`},

 // HIDDEN STORIES — titles and descriptions remain concealed until earned.
 {id:'hidden_giant_killer',category:'Hidden',hidden:true,title:'Giant Killer',desc:'Take a film made for $15m or less to #1 domestically and at least $75m worldwide.',points:20,target:1,value:()=>completedPlayerFilms().filter(f=>(f.budget||999)<=15&&boxRunStats(f).weeksAtOne>0&&(f.finalGross||0)>=75).length},
 {id:'hidden_sleeper',category:'Hidden',hidden:true,title:'Where Did That Come From?',desc:'Turn a film made for $12m or less into a $150m worldwide phenomenon.',points:25,target:1,value:()=>completedPlayerFilms().filter(f=>(f.budget||999)<=12&&(f.finalGross||0)>=150).length},
 {id:'hidden_cult_rescue',category:'Hidden',hidden:true,title:'The Long Game',desc:'Have a film that lost money theatrically later develop a cult following.',points:20,target:1,value:()=>completedPlayerFilms().filter(f=>studioFilmProfit(f)<0&&ensureAfterlifeState(f).cultStatus).length},
 {id:'hidden_discourse',category:'Hidden',hidden:true,title:'The Discourse',desc:'Release a film where critics and audiences finish at least 30 points apart.',points:15,target:1,value:()=>completedPlayerFilms().filter(f=>Math.abs((f.review?.critics||0)-(f.review?.audience||0))>=30).length},
 {id:'hidden_perfect_storm',category:'Hidden',hidden:true,title:'Lightning in a Bottle',desc:'Release a $200m+ worldwide film with both critics and audiences at 90% or better.',points:30,target:1,value:()=>completedPlayerFilms().filter(f=>(f.finalGross||0)>=200&&(f.review?.critics||0)>=90&&(f.review?.audience||0)>=90).length},
 {id:'hidden_comeback',category:'Hidden',hidden:true,title:'Reports of Our Death…',desc:'Answer a run of three losing releases with a major profitable hit.',points:25,target:1,value:()=>hasStudioComeback()?1:0},
 {id:'hidden_sweep',category:'Hidden',hidden:true,title:'Sweep the Room',desc:'Win four awards at a single Awards Night.',points:25,target:4,value:()=>bestPlayerAwardsNight(),format:v=>`${Math.min(v,4)}/4 wins in one night`},
 {id:'hidden_clean_sweep',category:'Hidden',hidden:true,title:'They Kept Calling Our Name',desc:'Win six awards at a single Awards Night.',points:35,target:6,value:()=>bestPlayerAwardsNight(),format:v=>`${Math.min(v,6)}/6 wins in one night`},
 {id:'hidden_auteur',category:'Hidden',hidden:true,title:'An Auteur Home',desc:'Release three films with the same director averaging 80%+ with critics.',points:25,target:1,value:()=>hasAuteurTrilogy()?1:0},
 {id:'hidden_star_maker',category:'Hidden',hidden:true,title:'From Breakout to Podium',desc:'Help a performer break out in one of your films and later win a performance award with your studio.',points:30,target:1,value:()=>hasBreakoutToAwardStory()?1:0}
 // v4.0b.1 — LONG CAREER & INFRASTRUCTURE
 ,{id:'thirty_five_films',category:'Studio',title:'Catalogue Company',desc:'Release thirty-five films.',points:25,target:35,value:()=>completedPlayerFilms().length,format:v=>Math.min(v,35)+'/35 releases'},
 {id:'fifty_films',category:'Studio',title:'Studio Era',desc:'Release fifty films.',points:40,target:50,value:()=>completedPlayerFilms().length,format:v=>Math.min(v,50)+'/50 releases'},
 {id:'twenty_five_profitable',category:'Studio',title:'Repeatable Business',desc:'Produce twenty-five profitable releases.',points:30,target:25,value:()=>profitablePlayerFilms(),format:v=>Math.min(v,25)+'/25 profitable releases'},
 {id:'lifetime_5b',category:'Box Office',title:'Five-Billion Library',desc:'Reach $5bn in lifetime worldwide box office.',points:35,target:5000,value:()=>lifetimePlayerGross(),format:v=>money(Math.min(v,5000))+' / $5.0bn'},
 {id:'lifetime_10b',category:'Box Office',title:'Global Institution',desc:'Reach $10bn in lifetime worldwide box office.',points:50,target:10000,value:()=>lifetimePlayerGross(),format:v=>money(Math.min(v,10000))+' / $10.0bn'},
 {id:'first_upgrade',category:'Studio',title:'Build the Company',desc:'Open the studio’s first permanent department upgrade.',points:5,target:1,value:()=>totalStudioUpgradeLevels(),format:v=>Math.min(v,1)+'/1 department level'},
 {id:'five_upgrades',category:'Studio',title:'Working Studio',desc:'Own five permanent department levels across the lot.',points:20,target:5,value:()=>totalStudioUpgradeLevels(),format:v=>Math.min(v,5)+'/5 department levels'},
 {id:'all_upgrades',category:'Studio',title:'Full-Service Studio',desc:'Fully build every permanent studio department.',points:40,target:10,value:()=>totalStudioUpgradeLevels(),format:v=>Math.min(v,10)+'/10 department levels'},

 // v4.0b.2 — CAPITAL ALLOCATION
 ,{id:'first_capital_asset',category:'Studio',title:'Plant the Flag',desc:'Acquire the studio’s first permanent capital asset.',points:10,target:1,value:()=>capitalAssetCount(),format:v=>Math.min(v,1)+'/1 capital asset'},
 {id:'all_capital_assets',category:'Studio',title:'Own the Infrastructure',desc:'Acquire all three permanent studio capital assets.',points:25,target:3,value:()=>capitalAssetCount(),format:v=>Math.min(v,3)+'/3 capital assets'},

];

function careerYears(){return Math.floor((state.week-1)/52)}
function maxPlayerGross(){return Math.max(0,...completedPlayerFilms().map(f=>f.finalGross||0))}
function maxCriticScore(){return Math.max(0,...completedPlayerFilms().map(f=>f.review?.critics||0))}
function maxAudienceScore(){return Math.max(0,...completedPlayerFilms().map(f=>f.review?.audience||0))}
function profitablePlayerFilms(){return completedPlayerFilms().filter(f=>studioFilmProfit(f)>0).length}
function numberOnePlayerFilms(){return completedPlayerFilms().filter(f=>boxRunStats(f).weeksAtOne>0).length}
function playerContinuationCount(){return completedPlayerFilms().filter(f=>f.ipParentId||f.sequelInstallment>1||['reboot','spinoff','revival'].includes(f.franchiseMode)).length}
function maxPlayerFranchiseInstallment(){
 const continuation=completedPlayerFilms().filter(f=>f.ipParentId||f.sequelInstallment>1||['reboot','spinoff','revival'].includes(f.franchiseMode));
 if(!continuation.length)return 0;
 return Math.max(...continuation.map(f=>f.sequelInstallment||f.ip?.installment||2));
}
function playerBreakoutFilmCount(){return completedPlayerFilms().filter(f=>(f.careerStories||[]).some(x=>/breakout|raised their market profile/i.test(x))).length}
function playerAwardWinsByCategory(cat){return completedPlayerFilms().reduce((n,f)=>n+(ensureAfterlifeState(f).wins||[]).filter(x=>x.category===cat).length,0)}
function playerAwardWinsByCategories(cats){return completedPlayerFilms().reduce((n,f)=>n+(ensureAfterlifeState(f).wins||[]).filter(x=>cats.includes(x.category)).length,0)}
function bestPlayerAwardsNight(){return Math.max(0,...(state.awardsArchive||[]).map(c=>c.playerWins||0))}
function hasStudioComeback(){
 const films=completedPlayerFilms().slice().sort((a,b)=>(a.completeDay||a.completeWeek*7)-(b.completeDay||b.completeWeek*7));
 let losses=0;
 for(const f of films){
  const p=studioFilmProfit(f);
  if(p<0)losses++;
  else{
   if(losses>=3&&p>=15)return true;
   losses=0;
  }
 }
 return false;
}
function hasAuteurTrilogy(){
 const by={};
 completedPlayerFilms().forEach(f=>{if(!f.directorId)return;(by[f.directorId] ||= []).push(f)});
 return Object.values(by).some(fs=>fs.length>=3&&fs.sort((a,b)=>(b.review?.critics||0)-(a.review?.critics||0)).slice(0,3).reduce((s,f)=>s+(f.review?.critics||0),0)/3>=80);
}
function hasBreakoutToAwardStory(){
 const breakoutActors=new Set();
 completedPlayerFilms().forEach(f=>{
  const stories=(f.careerStories||[]).join(' | ').toLowerCase();
  if(!/breakout|raised their market profile/.test(stories))return;
  [...(f.cast||[]),...(f.supportingCastIds||[])].forEach(id=>{const t=talentById(id);if(t&&stories.includes(t.name.toLowerCase()))breakoutActors.add(id)});
  if(!breakoutActors.size)[...(f.cast||[]),...(f.supportingCastIds||[])].forEach(id=>breakoutActors.add(id));
 });
 if(!breakoutActors.size)return false;
 return completedPlayerFilms().some(f=>(ensureAfterlifeState(f).wins||[]).some(w=>['lead','support'].includes(w.category))&&[...(f.cast||[]),...(f.supportingCastIds||[])].some(id=>breakoutActors.has(id)));
}

function ensureLegendsArchive(st=state){
 st.legends=st.legends||{unlocked:{},history:[],pending:[],initialized:false};st.legends.unlocked=st.legends.unlocked||{};st.legends.history=st.legends.history||[];st.legends.pending=st.legends.pending||[];return st.legends;
}
function legendUnlocked(id){return !!ensureLegendsArchive().unlocked[id]}
function legendGenreFilms(genres){return completedPlayerFilms().filter(f=>genres.includes(f.genre))}
function legendStrongFilm(f,crit=80,aud=80){return !!f&&(f.review?.critics||0)>=crit&&(f.review?.audience||0)>=aud}
function legendArchiveGate(entry){
 const tier=legendTier(entry).key,unlocked=Object.keys(ensureLegendsArchive().unlocked||{}).length;
 const base={accessible:{films:3,recognition:28},challenging:{films:6,recognition:45},storied:{films:10,recognition:60},mythic:{films:15,recognition:72}}[tier]||{films:6,recognition:45};
 const films=completedPlayerFilms().length,recognition=ensureStudioGrowth().recognition,requiredFilms=Math.max(base.films,3+unlocked*2);
 const done=films>=requiredFilms&&recognition>=base.recognition,pct=Math.min(100,Math.min(films/requiredFilms,recognition/base.recognition)*100);
 return {done,pct,text:Math.min(films,requiredFilms)+'/'+requiredFilms+' career releases · recognition '+Math.round(recognition)+'/'+base.recognition};
}

function legendRequirementProgress(entry){
 const films=completedPlayerFilms(),profit=f=>studioFilmProfit(f),wins=cat=>playerAwardWinsByCategory(cat),perfWins=playerAwardWinsByCategories(['lead','support']);
 let done=false,pct=0,text='Career signal not yet established';
 switch(entry.unlock){
  case 'heath':{const p=perfWins,b=wins('picture');done=p>=2&&b>=1;pct=Math.min(100,Math.min(p/2,b/1)*100);text=`Performance awards ${Math.min(p,2)}/2 · Best Picture ${Math.min(b,1)}/1`;break}
  case 'brandon':{const n=films.filter(f=>f.genre==='Action Thriller'&&legendStrongFilm(f,78,84)&&profit(f)>=8).length;done=n>=1;pct=Math.min(100,n*100);text=`Acclaimed action breakthroughs ${Math.min(n,1)}/1`;break}
  case 'hoffman':{const fs=films.filter(f=>f.genre==='Prestige Drama'),avg=fs.length?fs.reduce((a,f)=>a+(f.review?.critics||0),0)/fs.length:0;done=fs.length>=3&&avg>=85;pct=Math.min(100,Math.min(fs.length/3,avg/85)*100);text=`Prestige releases ${Math.min(fs.length,3)}/3 · critic average ${Math.round(avg)}%`;break}
  case 'rickman':{const n=wins('support');done=n>=2;pct=Math.min(100,n/2*100);text=`Supporting Performance wins ${Math.min(n,2)}/2`;break}
  case 'boseman':{const n=films.filter(f=>(f.finalGross||0)>=150&&(f.review?.audience||0)>=88&&(f.review?.critics||0)>=75).length;done=n>=1;pct=Math.min(100,n*100);text=`Beloved $150m+ event films ${Math.min(n,1)}/1`;break}
  case 'river':{const n=films.filter(f=>(f.budget||0)<=8&&legendStrongFilm(f,86,82)&&profit(f)>0).length;done=n>=1;pct=Math.min(100,n*100);text=`Acclaimed profitable films at $8m or less ${Math.min(n,1)}/1`;break}
  case 'robin':{const c=films.some(f=>f.genre==='Comedy'&&(f.review?.audience||0)>=82&&profit(f)>0),d=films.some(f=>f.genre==='Prestige Drama'&&(f.review?.audience||0)>=82&&profit(f)>0);done=c&&d;pct=(Number(c)+Number(d))/2*100;text=`Audience-loved Comedy ${c?'✓':'—'} · Prestige Drama ${d?'✓':'—'}`;break}
  case 'gandolfini':{const n=films.filter(f=>f.genre==='Crime Thriller'&&(f.review?.critics||0)>=80&&(ensureAfterlifeState(f).wins||[]).some(w=>['lead','support'].includes(w.category))).length;done=n>=1;pct=Math.min(100,n*100);text=`Award-winning crime performances ${Math.min(n,1)}/1`;break}
  case 'carrie':{const n=films.filter(f=>f.genre==='Science Fiction'&&(f.finalGross||0)>=150&&(f.review?.audience||0)>=82).length;done=n>=1;pct=Math.min(100,n*100);text=`$150m+ audience-loved science-fiction hits ${Math.min(n,1)}/1`;break}
  case 'walker':{const action=films.filter(f=>f.genre==='Action Thriller'&&profit(f)>0),cont=action.filter(f=>f.ipParentId||f.sequelInstallment>1||['reboot','spinoff','revival'].includes(f.franchiseMode));done=action.length>=2&&cont.length>=1;pct=Math.min(100,Math.min(action.length/2,cont.length/1)*100);text=`Profitable action films ${Math.min(action.length,2)}/2 · successful continuation ${cont.length?'✓':'—'}`;break}
  case 'dean':{const b=playerBreakoutFilmCount(),c=maxCriticScore();done=b>=2&&c>=90;pct=Math.min(100,Math.min(b/2,c/90)*100);text=`Breakout films ${Math.min(b,2)}/2 · best critic score ${Math.round(c)}%`;break}
  case 'wilder':{const n=films.filter(f=>f.genre==='Comedy'&&legendStrongFilm(f,80,88)&&profit(f)>=5).length;done=n>=1;pct=Math.min(100,n*100);text=`Acclaimed audience-beloved comedy hits ${Math.min(n,1)}/1`;break}
  case 'hurt':{const gs=new Set(films.filter(f=>(f.review?.critics||0)>=82).map(f=>f.genre));done=gs.size>=3;pct=Math.min(100,gs.size/3*100);text=`Genres with an 82%+ critics release ${Math.min(gs.size,3)}/3`;break}
  case 'murphy':{const n=films.filter(f=>(f.budget||0)<=10&&['Comedy','Prestige Drama'].includes(f.genre)&&(f.review?.audience||0)>=87&&profit(f)>=4).length;done=n>=1;pct=Math.min(100,n*100);text=`Modest-scale audience breakouts ${Math.min(n,1)}/1`;break}
  case 'julia':{const e=wins('ensemble'),s=wins('support');done=e>=1&&s>=1;pct=(Math.min(e,1)+Math.min(s,1))/2*100;text=`Ensemble win ${e?'✓':'—'} · Supporting win ${s?'✓':'—'}`;break}
  case 'kubrick':{const fs=films.filter(f=>(f.review?.critics||0)>=90),gs=new Set(fs.map(f=>f.genre));done=fs.length>=3&&gs.size>=3;pct=Math.min(100,Math.min(fs.length/3,gs.size/3)*100);text=`90%+ critic films ${Math.min(fs.length,3)}/3 · genres ${Math.min(gs.size,3)}/3`;break}
  case 'tony':{const fs=films.filter(f=>f.genre==='Action Thriller'&&profit(f)>0),g=Math.max(0,...fs.map(f=>f.finalGross||0));done=fs.length>=3&&g>=120;pct=Math.min(100,Math.min(fs.length/3,g/120)*100);text=`Profitable action films ${Math.min(fs.length,3)}/3 · best gross ${money(g)}`;break}
  case 'lumet':{const fs=legendGenreFilms(['Prestige Drama','Crime Thriller']),avg=fs.length?fs.reduce((a,f)=>a+(f.review?.critics||0),0)/fs.length:0;done=fs.length>=4&&avg>=84;pct=Math.min(100,Math.min(fs.length/4,avg/84)*100);text=`Prestige/crime releases ${Math.min(fs.length,4)}/4 · critic average ${Math.round(avg)}%`;break}
  case 'leone':{const fs=legendGenreFilms(['Crime Thriller','Action Thriller']).filter(f=>profit(f)>0),ones=fs.filter(f=>boxRunStats(f).weeksAtOne>0).length;done=fs.length>=3&&ones>=2;pct=Math.min(100,Math.min(fs.length/3,ones/2)*100);text=`Profitable crime/action films ${Math.min(fs.length,3)}/3 · #1 releases ${Math.min(ones,2)}/2`;break}
  case 'kurosawa':{const d=wins('director'),p=wins('picture');done=d>=2&&p>=1;pct=Math.min(100,Math.min(d/2,p/1)*100);text=`Best Director wins ${Math.min(d,2)}/2 · Best Picture ${Math.min(p,1)}/1`;break}
 }
 const achievementDone=done,achievementPct=pct,achievementText=text,gate=legendArchiveGate(entry);
 done=achievementDone&&gate.done;pct=Math.min(achievementPct,gate.pct);
 if(!gate.done)text=achievementText+' · Archive standing: '+gate.text;
 return {done,pct:clamp(pct,0,100),text};
}
function unlockLegend(entry,retroactive=false){
 const a=ensureLegendsArchive();if(a.unlocked[entry.id])return false;
 const record={id:entry.id,week:state.week,day:typeof currentCalendarDay==='function'?currentCalendarDay():null,retroactive};a.unlocked[entry.id]=record;a.history.unshift(record);a.pending.push(entry.id);a.history=a.history.slice(0,60);
 syncPrivateRealRoster(state);const t=talentById(entry.id);if(t)ensureTalentCareer(t);addNews(state,`${entry.seed[0]} has entered ${state.studio.name}'s Legends Archive and is now active across The Lot.`,'Talent Watch');notify(`legend-unlock:${entry.id}`,`Legend unlocked: ${entry.seed[0]}`,`${legendTier(entry).label} Archive achievement complete. ${entry.seed[0]} is now live on The Lot.`,null,false,'milestone',{screen:'studio',detail:null,studioTab:'legacy',legacyTab:'legends'});return true;
}
function checkLegendsArchive(retroactive=false){
 if(!state.studio||!state.careerStarted)return [];
 const a=ensureLegendsArchive(),out=[];LEGEND_ARCHIVE.forEach(entry=>{if(!a.unlocked[entry.id]&&legendRequirementProgress(entry).done&&unlockLegend(entry,retroactive))out.push(entry.id)});a.initialized=true;
 if(out.length&&!retroactive&&!legendUnlockBlocked()&&!state.activeLegendUnlockId)surfacePendingLegendUnlock();
 return out;
}
function legendUnlockBlocked(){return !!state.pendingCeremony||!!state.pendingAwardsNominations||!!state.activeFilmWrapId||!!state.activeStudioMoment||state.screen==='ceremony'||state.screen==='nominations'||state.screen==='filmWrap'||state.screen==='studioMoment'}
function surfacePendingLegendUnlock(){
 if(legendUnlockBlocked()||state.activeLegendUnlockId)return false;const a=ensureLegendsArchive();
 while(a.pending.length){const id=a.pending.shift();if(!legendUnlocked(id))continue;state.activeLegendUnlockId=id;state.screen='legendUnlock';state.detail=null;state.history=[];requestScrollTop();return true}return false;
}
function enforceActiveSignatureRoute(){
 if(!state.studio||state.screen==='setup')return false;
 if(state.activeLegendUnlockId){
  if(legendUnlocked(state.activeLegendUnlockId)&&legendEntryById(state.activeLegendUnlockId)){state.screen='legendUnlock';state.detail=null;state.history=[];requestScrollTop();return true}
  state.activeLegendUnlockId=null;
 }
 if(state.activeFilmWrapId){
  const f=filmById(state.activeFilmWrapId);
  if(f&&f.owner==='player'){state.screen='filmWrap';state.detail=null;state.history=[];requestScrollTop();return true}
  state.activeFilmWrapId=null;state.uiFilmWrapStep=0;
 }
 if(state.activeStudioMoment){
  state.screen='studioMoment';state.detail=null;state.history=[];requestScrollTop();return true;
 }
 return false;
}
function continueLegendUnlock(){
 state.activeLegendUnlockId=null;
 if(surfacePendingLegendUnlock()){save();render();return}
 if(state.pendingCeremony){state.screen='ceremony';state.detail=null;save();render();return}
 if(state.pendingAwardsNominations){state.screen='nominations';state.detail=null;save();render();return}
 if(surfacePendingFilmWrap()){save();render();return}
 if(surfacePendingStudioMoment()){save();render();return}
 state.screen='studio';state.detail=null;state.uiStudioTab='legacy';state.uiLegacyTab='legends';state.history=[];requestScrollTop();save();render();
}


function ensureStudioMilestones(st=state){
 if(!st.studioMilestones)st.studioMilestones={completed:{},history:[],lastCheckedWeek:0,initialized:false};
 st.studioMilestones.completed=st.studioMilestones.completed||{};st.studioMilestones.history=st.studioMilestones.history||[];
 return st.studioMilestones;
}
function completedPlayerFilms(){return playerFilms().filter(f=>f.stage==='complete')}
function studioFilmProfit(f){return (f.studioRevenue??0)-(f.investment??0)}
function lifetimePlayerGross(){return completedPlayerFilms().reduce((a,f)=>a+(f.finalGross||0),0)}
function bestProfitableStreak(){
 const films=completedPlayerFilms().slice().sort((a,b)=>(a.completeDay||a.completeWeek*7)-(b.completeDay||b.completeWeek*7));let best=0,run=0;
 films.forEach(f=>{if(studioFilmProfit(f)>0){run++;best=Math.max(best,run)}else run=0});return best;
}
function playerAwardTotals(){
 const films=completedPlayerFilms();return films.reduce((a,f)=>{const x=ensureAfterlifeState(f);a.wins+=x.wins?.length||0;a.noms+=x.nominations?.length||0;return a},{wins:0,noms:0});
}
function studioLegacyPoints(){const st=ensureStudioMilestones();return Object.keys(st.completed).reduce((sum,id)=>sum+(STUDIO_MILESTONES.find(x=>x.id===id)?.points||0),0)}
function studioLegacyLabel(points=studioLegacyPoints()){
 if(points>=500)return 'Era-defining studio';
 if(points>=340)return 'Industry institution';
 if(points>=220)return 'Major studio legacy';
 if(points>=120)return 'Established studio';
 if(points>=50)return 'Emerging name';
 return 'Building a legacy';
}
function milestoneProgress(m){
 const value=+m.value()||0,target=m.target||1,done=value>=target;
 return {value,target,done,pct:clamp(value/Math.max(.001,target)*100,0,100),text:m.format?m.format(value):`${Math.min(value,target)}/${target}`};
}
function milestoneById(id){return STUDIO_MILESTONES.find(x=>x.id===id)}
function unlockStudioMilestone(m){
 const st=ensureStudioMilestones();if(st.completed[m.id])return false;
 const entry={id:m.id,week:state.week,day:typeof currentCalendarDay==='function'?currentCalendarDay():null,title:m.title,points:m.points};
 st.completed[m.id]=entry;st.history.unshift(entry);st.history=st.history.slice(0,120);
 notify(`milestone:${m.id}`,`Milestone unlocked · ${m.title}`,`${m.desc} +${m.points} Legacy.`,null,false,'milestone',{screen:'studio',detail:null,studioTab:'legacy',legacyTab:'milestones'});
 addNews(state,`${state.studio.name} reached the studio milestone “${m.title}”: ${m.desc}`,'Your Studio');
 return true;
}
function bootstrapStudioMilestones(){
 if(!state.studio||!state.careerStarted)return [];
 const st=ensureStudioMilestones();if(st.initialized)return [];
 const recognized=[];
 STUDIO_MILESTONES.forEach(m=>{
  if(!st.completed[m.id]&&milestoneProgress(m).done){
   const entry={id:m.id,week:state.week,day:typeof currentCalendarDay==='function'?currentCalendarDay():null,title:m.title,points:m.points,retroactive:true};
   st.completed[m.id]=entry;st.history.push(entry);recognized.push(m.id);
  }
 });
 st.history.sort((a,b)=>(b.day||b.week*7)-(a.day||a.week*7));st.initialized=true;
 if(recognized.length&&completedPlayerFilms().length){
  notify('milestone:legacy-import','Studio legacy recognised',`${recognized.length} milestone${recognized.length===1?'':'s'} from your existing career have been added to the new Milestones record.`,null,false,'milestone',{screen:'studio',detail:null,studioTab:'legacy',legacyTab:'milestones'});
 }
 return recognized;
}
function checkStudioMilestones(){
 if(!state.studio||!state.careerStarted)return [];
 const st=ensureStudioMilestones(),unlocked=[];
 STUDIO_MILESTONES.forEach(m=>{if(!st.completed[m.id]&&milestoneProgress(m).done&&unlockStudioMilestone(m))unlocked.push(m.id)});
 st.lastCheckedWeek=state.week;
 if(unlocked.length&&typeof showToast==='function'){
  if(unlocked.length===1){const m=milestoneById(unlocked[0]);showToast(`Milestone unlocked · ${m?.title||'Studio legacy'} · +${m?.points||0} Legacy`)}
  else showToast(`${unlocked.length} studio milestones unlocked · open Milestones to review`);
 }
 checkLegendsArchive();
 return unlocked;
}
function nextStudioMilestones(limit=4){
 const st=ensureStudioMilestones();
 return STUDIO_MILESTONES.filter(m=>!m.hidden&&!st.completed[m.id]).map(m=>({m,p:milestoneProgress(m)})).sort((a,b)=>b.p.pct-a.p.pct||a.m.points-b.m.points).slice(0,limit);
}


function professionalDramaEligibleTalent(){return state.talent.filter(t=>!t.retired)}
function personalDramaEligibleTalent(){return state.talent.filter(t=>!t.retired&&t.isRealPerson===false)}
function dramaEligibleTalent(){return professionalDramaEligibleTalent()}
function addTalentPersonalEvent(t,label,kind='drama'){ensureTalentCareer(t);t.careerMilestones.unshift({week:state.week,label,kind});t.careerMilestones=t.careerMilestones.slice(0,18)}
function dramaMomentum(t,d,reason){applyMomentumChange(t,d,reason,'drama');repriceTalent(t)}
function dramaPair(r,list){if(list.length<2)return null;const a=pick(r,list),b=pick(r,list.filter(x=>x.id!==a.id));return [a,b]}

function injectWalkOffEvent(t,f){
 if(!f||f.stage!=='production'||f.pendingEvent)return false;
 const id=uid('event',state),isDir=f.directorId===t.id,e={id,week:f.productionWeek,type:'walkoff',resolved:false,choice:null,talentId:t.id,
  title:`${t.name} walks off the set`,
  text:`A serious on-set dispute has stopped work. ${t.name} has left the unit and representatives are demanding a resolution.`,
  why:'A rare relationship crisis has collided with an active production.',
  choices:[['mediatewalkoff','Bring in mediation · $0.45m'],['holdwalkoff','Pause the unit · $0.8m + 1 week'],['hardlinewalkoff',isDir?'Back the studio and force a creative reset':'Hold the line and rewrite around the dispute']]};
 f.events.push(e);f.pendingEvent=id;
 notify(`walkoff:${f.id}:${id}`,`${f.title}: ${t.name} walks off set`,'A rare talent dispute has stopped production.',f.id,true,'warning');
 return true;
}

function injectProfessionalCreativeEvent(t,f){
 if(!f||f.stage!=='production'||f.pendingEvent)return false;
 const id=uid('event',state),isDir=f.directorId===t.id;
 const e={id,week:f.productionWeek,type:'creativefriction',resolved:false,choice:null,talentId:t.id,
  title:`Creative disagreement on ${f.title}`,
  text:`${t.name} has raised serious concerns about the current production approach. Work can continue, but the disagreement needs a studio response before it begins affecting the unit.`,
  why:isDir?'The director wants more control over how the material is being executed.':'The performer believes the current approach is hurting the role and has asked for changes.',
  choices:[['creativecompromise','Find a compromise · $0.3m'],['creativerehearse','Pause for rehearsal / reset · $0.55m + 1 week'],['creativeholdline','Hold the existing plan']]};
 f.events.push(e);f.pendingEvent=id;
 notify(`creativefriction:${f.id}:${id}`,`${f.title}: creative disagreement`,`${t.name} has raised concerns that need a studio decision.`,f.id,true,'warning');
 return true;
}

function runProfessionalTalentEvent(){
 const eligible=professionalDramaEligibleTalent();if(!eligible.length)return false;
 const r=makeRng(hash(state.seed+'|professional-talent-event|'+state.week));
 if(r()>.032)return false;

 const active=eligible.filter(t=>(t.busyUntil||0)>=state.week);
 if(active.length&&r()<.20){
  const t=pick(r,active),f=state.films.find(x=>x.owner==='player'&&x.stage==='production'&&(x.directorId===t.id||(x.cast||[]).includes(t.id)||(x.supportingCastIds||[x.supportingCastId]).filter(Boolean).includes(t.id)));
  if(f&&injectProfessionalCreativeEvent(t,f)){
   dramaMomentum(t,-1,`${f.title}: creative disagreement`);
   addTalentPersonalEvent(t,`${f.title}: creative disagreement during production`,'professional');
   addNews(state,`${f.title} has hit a creative disagreement involving ${t.name}, with the studio called in to settle the production approach.`,'Production');
   return true;
  }
 }

 const t=pick(r,eligible),roll=r();
 if(roll<.24){
  const jump=3+Math.floor(r()*4);dramaMomentum(t,jump,'Strong demand for new projects');
  addTalentPersonalEvent(t,'Market demand surged after a run of interest','professional');
  addNews(state,`${t.name}'s market is heating up, with competing projects pushing asking terms higher.`,'Talent Watch');
 }else if(roll<.43){
  const fall=-(2+Math.floor(r()*4));dramaMomentum(t,fall,'Market cooled after a quieter stretch');
  addTalentPersonalEvent(t,'Entered a quieter stretch in the market','professional');
  addNews(state,`${t.name} is entering a quieter period after a softer run of offers, creating a potentially cheaper casting window.`,'Talent Watch');
 }else if(roll<.60){
  const leave=3+Math.floor(r()*6);t.busyUntil=Math.max(t.busyUntil||0,state.week+leave);
  t.personalStatus='Career break';t.personalStatusUntil=state.week+leave;
  addTalentPersonalEvent(t,`Stepped back from new commitments through Week ${t.personalStatusUntil}`,'professional');
  addNews(state,`${t.name} is stepping back from new commitments for several weeks, temporarily tightening availability.`,'Talent Watch');
 }else if(roll<.77){
  const other=pick(r,eligible.filter(x=>x.id!==t.id&&x.type!==t.type) || eligible.filter(x=>x.id!==t.id));
  if(other){
   changeCollaboration(t.id,other.id,8);
   addTalentPersonalEvent(t,`Working relationship strengthened with ${other.name}`,'professional');
   addTalentPersonalEvent(other,`Working relationship strengthened with ${t.name}`,'professional');
   addNews(state,`${t.name} and ${other.name} have developed a stronger working relationship, making future packages involving the pair easier to assemble.`,'Talent Watch');
  }
 }else if(roll<.90){
  const old=t.busyUntil||0;
  if(old>state.week+3){
   t.busyUntil=Math.max(state.week+1,old-(2+Math.floor(r()*4)));
   addTalentPersonalEvent(t,`Schedule opened earlier than expected`,'professional');
   addNews(state,`${t.name}'s schedule has opened earlier than expected, creating a new near-term availability window.`,'Casting');
  }else{
   dramaMomentum(t,4,'Strong industry interest');
   addTalentPersonalEvent(t,'Industry interest accelerated','professional');
   addNews(state,`${t.name} is drawing a fresh wave of offers as interest builds around the next project choice.`,'Talent Watch');
  }
 }else{
  const delta=t.type==='Actor'?2:3;dramaMomentum(t,delta,'Career resurgence');
  addTalentPersonalEvent(t,'Career resurgence gathered momentum','comeback');
  addNews(state,`${t.name} is attracting renewed attention after a quieter stretch, with a comeback narrative beginning to form around the next project.`,'Talent Watch');
 }
 return true;
}

function runFictionalPersonalEvent(){
 const e=personalDramaEligibleTalent();if(!e.length)return false;
 const r=makeRng(hash(state.seed+'|fictional-personal-drama|'+state.week)),chance=Math.min(.04,.008+e.length*.0018);
 if(r()>chance)return false;

 const working=e.filter(t=>(t.busyUntil||0)>=state.week);
 if(working.length&&r()<.14){
  const t=pick(r,working),f=state.films.find(x=>x.owner==='player'&&x.stage==='production'&&(x.directorId===t.id||(x.cast||[]).includes(t.id)||(x.supportingCastIds||[x.supportingCastId]).filter(Boolean).includes(t.id)));
  if(f&&injectWalkOffEvent(t,f)){
   dramaMomentum(t,-5,'Walked off an active production');addTalentPersonalEvent(t,`${f.title}: walked off set`,'conflict');
   addNews(state,`${t.name} walked off ${f.title} after an on-set dispute, forcing emergency talks.`,'Industry Drama');return true;
  }
 }

 const roll=r();
 if(roll<.20&&e.length>=2){
  const [a,b]=dramaPair(r,e);changeCollaboration(a.id,b.id,10);dramaMomentum(a,2,`Relationship with ${b.name} became public`);dramaMomentum(b,2,`Relationship with ${a.name} became public`);
  addTalentPersonalEvent(a,`Began a relationship with ${b.name}`,'relationship');addTalentPersonalEvent(b,`Began a relationship with ${a.name}`,'relationship');
  addNews(state,`${a.name} and ${b.name} have become one of the industry's talked-about new couples.`,'Industry Drama');
 }else if(roll<.42&&e.length>=2){
  const [a,b]=dramaPair(r,e);changeCollaboration(a.id,b.id,-18);dramaMomentum(a,-2,`Public feud with ${b.name}`);dramaMomentum(b,-2,`Public feud with ${a.name}`);
  addTalentPersonalEvent(a,`Public feud with ${b.name}`,'conflict');addTalentPersonalEvent(b,`Public feud with ${a.name}`,'conflict');
  addNews(state,`${a.name} and ${b.name} are no longer on speaking terms after an industry feud.`,'Industry Drama');
 }else if(roll<.63){
  const t=pick(r,e);dramaMomentum(t,-8,'Career-damaging scandal');t.relationship=clamp((t.relationship||0)-3,-40,50);addTalentPersonalEvent(t,'Career-damaging scandal','scandal');
  addNews(state,`${t.name} is facing a career scandal, causing a sharp drop in momentum.`,'Industry Drama');
 }else if(roll<.80){
  const t=pick(r,e),leave=6+Math.floor(r()*7);t.busyUntil=Math.max(t.busyUntil||0,state.week+leave);t.personalStatus='Treatment leave';t.personalStatusUntil=state.week+leave;dramaMomentum(t,-3,'Stepped away for treatment');addTalentPersonalEvent(t,`Treatment leave through Week ${t.personalStatusUntil}`,'leave');
  addNews(state,`${t.name} has stepped away from work for treatment and will be unavailable for several weeks.`,'Industry Drama');
 }else{
  const t=pick(r,e);dramaMomentum(t,6,'Unexpected career reset');addTalentPersonalEvent(t,'Unexpected career reset','comeback');
  addNews(state,`${t.name} has returned from a difficult stretch with renewed industry support.`,'Industry Drama');
 }
 return true;
}

function maybeGenerateTalentDrama(){
 if(runProfessionalTalentEvent())return;
 runFictionalPersonalEvent();
}


function writerById(id){return (state.writers||[]).find(w=>w.id===id)}
function scriptRightsText(s){ensureScriptEcosystem(s);return s.rights?.label||'Standard screen rights'}
function ensureScriptEcosystem(s){
 if(!s)return s;
 const r=makeRng(hash(state.seed+'|script-ecosystem|'+s.id));
 if(s.characters===undefined)s.characters=Math.round(clamp(s.story*.68+40*r(),35,96));
 if(s.structure===undefined)s.structure=Math.round(clamp(s.story*.70+38*r(),35,97));
 if(s.emotion===undefined)s.emotion=Math.round(clamp((s.characters*.58+s.story*.20)+28*r(),30,97));
 if(s.genreFulfillment===undefined)s.genreFulfillment=Math.round(clamp((s.hook*.48+s.access*.22)+34*r(),35,97));
 if(!s.writerId){
  const pool=(state.writers||[]).filter(w=>w.genres.includes(s.genre));
  const all=pool.length?pool:state.writers;
  s.writerId=all[Math.floor(r()*all.length)]?.id||null;
 }
 if(!s.rights){
  const roll=r();
  s.rights=roll<.56?{type:'full',label:'Full screen + sequel rights',detail:'The acquiring studio controls the film, sequel and remake rights.'}:
   roll<.76?{type:'participation',label:'Creator participation',detail:'The studio controls the property, but the writer retains 3% participation in future sequels.'}:
   roll<.91?{type:'sequelOption',label:'Film + one sequel option',detail:'The studio controls this film and holds an option on one sequel; later franchise rights would require renegotiation.'}:
   {type:'approval',label:'Creator approval clause',detail:'The studio controls this film, but major sequel/remake use carries a creator-approval condition.'};
 }
 s.rewrites=s.rewrites||[];
 s.coverageVersion=s.coverageVersion||0;
 if(s.status===undefined)s.status=s.available?'market':s.owner?'owned':'development';
 if(s.owner===undefined)s.owner=null;
 if(s.filmStarted===undefined)s.filmStarted=false;
 if(s.developmentSpend===undefined)s.developmentSpend=0;
 return s;
}
function writerFit(w,genre,brief='balanced'){
 if(!w)return 50;
 let v=(w.structure+w.character+w.dialogue+w.commercial)/4;
 if(w.genres.includes(genre))v+=8;
 if(brief==='prestige')v+=(w.character+w.dialogue-150)*.10;
 if(brief==='commercial')v+=(w.structure+w.commercial-150)*.10;
 if(brief==='genre')v+=(w.structure+w.commercial-145)*.08+(w.genres.includes(genre)?3:0);
 return clamp(v,30,98);
}
function scriptMarketAppeal(s){
 ensureScriptEcosystem(s);
 return s.story*.17+s.hook*.23+s.originality*.15+s.access*.14+s.characters*.08+s.structure*.08+s.genreFulfillment*.10-s.price*5-s.difficulty*.025+industryGenreSignal(s.genre)*.42;
}
function scriptHeat(s){
 const appeal=scriptMarketAppeal(s);
 if((s.bids||0)>=3||appeal>=77)return {label:'Hot',cls:'bad',text:'Multiple buyers are circling. Trade expectation is above asking price.'};
 if((s.bids||0)>=1||appeal>=69)return {label:'Active interest',cls:'warn',text:'At least one rival is believed to be considering the material.'};
 return {label:'Quiet',cls:'',text:'No serious bidding pressure is currently visible.'};
}
function coverageLine(label,value,high,low){
 if(value>=84)return {kind:'strength',text:high};
 if(value<=54)return {kind:'concern',text:low};
 return null;
}
function scriptCoverage(s){
 ensureScriptEcosystem(s);
 const lines=[
  coverageLine('structure',s.structure,'The structure reads cleanly and builds with confidence.','The middle/third-act architecture remains the clearest development concern.'),
  coverageLine('characters',s.characters,'The principal roles feel specific enough to attract serious actors.','Character work is currently thinner than the premise deserves.'),
  coverageLine('emotion',s.emotion,'There is credible emotional weight beneath the plot mechanics.','The read understands the story intellectually more than emotionally.'),
  coverageLine('hook',s.hook,'The central hook is immediately legible and easy to pitch.','The concept may be difficult to communicate in a single compelling campaign.'),
  coverageLine('originality',s.originality,'The material has a distinctive identity rather than feeling assembled from familiar beats.','Coverage flags familiarity; execution will need to separate it from comparable films.'),
  coverageLine('access',s.access,'The screenplay looks unusually accessible for its genre and subject.','Accessibility is limited; positioning and audience expectations will matter.'),
  coverageLine('genre',s.genreFulfillment,'The screenplay delivers strongly on the pleasures its genre audience will expect.','Genre fulfilment is inconsistent; core fans may feel the promise is stronger than the payoff.')
 ].filter(Boolean);
 const strengths=lines.filter(x=>x.kind==='strength').slice(0,2),concerns=lines.filter(x=>x.kind==='concern').slice(0,2);
 if(!strengths.length)strengths.push({kind:'strength',text:'Coverage finds several workable elements, but no single creative strength currently dominates the read.'});
 if(!concerns.length)concerns.push({kind:'concern',text:'No obvious structural emergency is identified; the remaining risk is whether the package can fully realise the material.'});
 const readiness=(s.story+s.hook+s.originality+s.access+s.characters+s.structure+s.emotion+s.genreFulfillment)/8;
 return {strengths,concerns,readiness:readiness>=80?'Packaging-ready':readiness>=69?'Promising draft':readiness>=59?'Needs judgement':'Needs development'};
}
function scriptPassOptions(s){
 ensureScriptEcosystem(s);
 const w=writerById(s.writerId),fee=w?.fee||.65;
 return [
  {id:'story',label:'Story / structure pass',cost:+(.18+fee*.24).toFixed(2),desc:'Target structure, clarity and story execution. One week.'},
  {id:'character',label:'Character pass',cost:+(.16+fee*.22).toFixed(2),desc:'Target roles, emotion and performance potential. One week.'},
  {id:'commercial',label:'Commercial pass',cost:+(.18+fee*.24).toFixed(2),desc:'Sharpen hook, accessibility and genre delivery. Can sand away some originality. One week.'},
  {id:'polish',label:'Polish',cost:+(.12+fee*.16).toFixed(2),desc:'A smaller all-round pass. One week.'}
 ];
}
function scriptPassMetricLabels(){return {story:'Story',structure:'Structure',characters:'Characters',emotion:'Emotion',hook:'Hook',access:'Accessibility',genreFulfillment:'Genre delivery',originality:'Originality'}}
function scriptPassResult(s,type,before,beforeCoverage){
 const labels=scriptPassMetricLabels(),afterCoverage=scriptCoverage(s),changes=[];
 Object.keys(labels).forEach(k=>{
  const delta=Math.round((s[k]||0)-(before[k]||0));if(!delta)return;
  changes.push({key:k,label:labels[k],direction:delta>0?'up':'down',band:Math.abs(delta)>=5?'Major movement':Math.abs(delta)>=3?'Clear movement':'Minor movement'});
 });
 changes.sort((a,b)=>({down:0,up:1}[b.direction]-({down:0,up:1}[a.direction]))||({ 'Major movement':3,'Clear movement':2,'Minor movement':1}[b.band]-({ 'Major movement':3,'Clear movement':2,'Minor movement':1}[a.band])));
 const headlines={
  story:'The screenplay has a cleaner spine',
  character:'The roles now carry more dramatic weight',
  commercial:'The pitch has become easier to sell',
  polish:'The draft has tightened across several departments'
 };
 const readinessChanged=beforeCoverage?.readiness!==afterCoverage?.readiness;
 return {headline:headlines[type]||'The new draft is in',readinessBefore:beforeCoverage?.readiness||null,readinessAfter:afterCoverage?.readiness||null,readinessChanged,changes:changes.slice(0,4)};
}
function scriptPassResultText(result){
 if(!result)return '';
 const up=result.changes.filter(x=>x.direction==='up').map(x=>x.label),down=result.changes.filter(x=>x.direction==='down').map(x=>x.label);
 if(result.readinessChanged)return `${result.readinessBefore} → ${result.readinessAfter}. ${up.length?`${up.slice(0,2).join(' and ')} improved most.`:''}`;
 if(up.length&&down.length)return `${up.slice(0,2).join(' and ')} improved, with a trade-off in ${down[0].toLowerCase()}.`;
 if(up.length)return `${up.slice(0,3).join(', ')} moved in the intended direction.`;
 return 'The pass was modest; the screenplay remains close to the previous draft.';
}

function runScriptPass(scriptId,type){
 const s=ensureScriptEcosystem(scriptById(scriptId));
 if(!s||s.owner!=='player'||s.filmStarted)return showToast('That screenplay is not available for development.');
 if(s.rewrites.length>=2)return showToast('This screenplay has already had two major development passes.');
 const opt=scriptPassOptions(s).find(x=>x.id===type);if(!opt)return;
 if(!spend(opt.cost))return;
 const w=writerById(s.writerId),r=makeRng(hash(state.seed+'|rewrite|'+s.id+'|'+type+'|'+s.rewrites.length));
 const beforeCoverage=scriptCoverage(s),before={};Object.keys(scriptPassMetricLabels()).forEach(k=>before[k]=s[k]);
 const gain=(skill,current,scale=6)=>Math.max(0,Math.round((2+r()*scale)*(skill/85)*((110-current)/100)));
 if(type==='story'){s.story=clamp(s.story+gain(w?.structure||78,s.story),20,98);s.structure=clamp(s.structure+gain(w?.structure||78,s.structure,7),20,98);s.access=clamp(s.access+Math.round(r()*3),20,98)}
 if(type==='character'){s.characters=clamp(s.characters+gain(w?.character||78,s.characters,7),20,98);s.emotion=clamp(s.emotion+gain((w?.character||78)*.65+(w?.dialogue||78)*.35,s.emotion,7),20,98);s.story=clamp(s.story+Math.round(r()*3),20,98)}
 if(type==='commercial'){s.hook=clamp(s.hook+gain(w?.commercial||78,s.hook,7),20,98);s.access=clamp(s.access+gain(w?.commercial||78,s.access,6),20,98);s.genreFulfillment=clamp(s.genreFulfillment+gain(w?.structure||78,s.genreFulfillment,5),20,98);if(r()<.45)s.originality=clamp(s.originality-1-Math.round(r()),20,98)}
 if(type==='polish'){['story','structure','characters','emotion','hook','access','genreFulfillment'].forEach(k=>s[k]=clamp(s[k]+Math.round(r()*3),20,98))}
 const result=scriptPassResult(s,type,before,beforeCoverage);
 s.rewrites.push({type,label:opt.label,week:state.week,cost:opt.cost,writerId:s.writerId,result});s.lastRewriteResult=result;s.developmentSpend+=opt.cost;s.coverageVersion++;
 if(w)w.relationship=clamp((w.relationship||0)+1,-30,40);
 addNews(state,`${s.title} completed a ${opt.label.toLowerCase()} with ${w?.name||'its writer'}. ${scriptPassResultText(result)}`,'Development');
 state.screen='develop';state.detail={type:'script',id:s.id};save();advanceWeek();
}
function acquireScriptRights(scriptId,approach='ask'){
 const s=ensureScriptEcosystem(scriptById(scriptId));if(!s||!s.available)return showToast('That screenplay is no longer available.');
 const heat=s.bids||0,quality=scriptMarketAppeal(s),r=makeRng(hash(state.seed+'|bid|'+s.id+'|'+state.week));
 const multipliers={ask:1,competitive:1.28,aggressive:1.58},offer=+(s.price*(multipliers[approach]||1)).toFixed(2);
 let rivalCeiling=s.price*(1+heat*(.10+r()*.055)+Math.max(0,quality-68)*.012);
 if(heat<2)rivalCeiling=s.price*.98;
 if(offer+1e-9<rivalCeiling){
  const candidates=state.rivals.filter(rv=>rv.cash>s.price+5&&aiFinancialHealth(rv)!=='Financial distress');
  const rv=candidates.length?candidates[Math.floor(r()*candidates.length)]:null;
  s.available=false;s.status='owned';s.owner=rv?.id||'external';s.acquisitionCost=+rivalCeiling.toFixed(2);state.market=state.market.filter(id=>id!==s.id);
  if(rv){rv.cash-=s.acquisitionCost;ensureRivalCharacter(rv);rv.scriptWinsAgainstPlayer=(rv.scriptWinsAgainstPlayer||0)+1;rv.lastScriptWinAgainstPlayerWeek=state.week;adjustRivalRelationship(rv,-2,`Outbid ${state.studio.name} for ${s.title}`);addNews(state,`${rv.head.name}'s ${rv.name} won a contested auction for ${s.title} at roughly ${money(s.acquisitionCost)}.`,'Script Market')}
  else addNews(state,`${s.title} left the market after another buyer topped ${state.studio.name}'s offer.`,'Script Market');
  showToast('Another buyer topped your offer.');save();render();return;
 }
 if(!spend(offer))return;
 s.available=false;s.status='owned';s.owner='player';s.acquisitionCost=offer;s.developmentSpend=(s.developmentSpend||0)+offer;state.market=state.market.filter(id=>id!==s.id);
 addNews(state,`${state.studio.name} acquired ${s.title} for ${money(offer)}.`,'Your Studio');
 state.screen='develop';state.detail={type:'script',id:s.id};save();render();
}

function developmentRouteInfo(mode,w=null,d=null){
 if(mode==='market')return {label:'Buy from Market',cost:'Usually $0.2m–$0.9m',time:'Immediate',control:'Lowest control',rights:'Rights package varies',desc:'Finished material. Fastest and normally cheapest, but you inherit the screenplay, price pressure and whatever rights package is attached.'};
 const draft=d||(mode==='concept'?ensureWriterDrafts().concept:ensureWriterDrafts().commission);
 const cost=w?writerCommissionCost(w,mode,draft):null;
 if(mode==='commission')return {label:'Commission',cost:cost?money(cost):'Usually $0.7m–$1.7m',time:'3 weeks',control:'Choose genre, audience, scale & brief',rights:'Usually clean work-for-hire rights',desc:'Pay more to ask for a particular kind of screenplay. You control the strategic brief, but the writer still determines the actual execution.'};
 return {label:'Create Original',cost:cost?money(cost):'Usually $1.3m–$2.6m',time:'4 weeks',control:'Maximum creative control',rights:'Full studio-owned IP',desc:'The studio originates the property, defines its creative DNA and owns the screen/sequel/remake rights outright. Most expensive because you are funding development from zero.'};
}
function routeScaleSurcharge(scale,mode){
 if(mode==='commission')return scale==='large'?.45:scale==='mid'?.18:0;
 return scale==='large'?.58:scale==='mid'?.32:.08;
}
function routeBriefSurcharge(brief){return brief==='prestige'?.10:brief==='commercial'?.08:brief==='genre'?.06:0}
function scriptDevelopmentCost(w,mode,draft){
 const fee=w?.fee||.7,scale=draft?.scale||'mid';
 if(mode==='commission')return +(.35+fee*.62+routeScaleSurcharge(scale,'commission')+routeBriefSurcharge(draft?.brief||'balanced')).toFixed(2);
 return +(.80+fee*.90+routeScaleSurcharge(scale,'concept')).toFixed(2);
}
function commissionRights(r){
 const roll=r();
 return roll<.72?{type:'full',label:'Work-for-hire screen + sequel rights',detail:'The studio commissioned the material and controls the film, sequel and remake rights.'}:
  roll<.90?{type:'participation',label:'Commissioned rights + creator participation',detail:'The studio controls the property, with 3% writer participation in future sequel receipts.'}:
  {type:'approval',label:'Commissioned rights + creator consultation',detail:'The studio controls screen rights, but major sequel/remake development carries a creator consultation clause.'};
}

function makeCommissionedScript({genre,brief,scale,audience,writerId,title=null,logline=null,source='Commission',creativeIntent=null,synopsis=''}) {
 const w=writerById(writerId),r=makeRng(hash(state.seed+'|commission-v3141|'+state.week+'|'+genre+'|'+writerId+'|'+(title||''))),concept=generatedPremise(state,r,genre),customLogline=!!logline?.trim();
 const scaleBudget=scale==='contained'?5+r()*7:scale==='large'?22+r()*15:10+r()*14,fit=writerFit(w,genre,brief),base=48+fit*.34;
 const s={id:uid('script',state),title:title?.trim()||concept.title,genre,logline:logline?.trim()||concept.logline,synopsis:(synopsis||'').trim(),shape:customLogline?null:concept.shape,premiseDNA:customLogline?null:concept.premiseDNA,
  price:0,naturalBudget:+scaleBudget.toFixed(1),story:Math.round(clamp(base+(r()-.5)*18,38,95)),hook:Math.round(clamp(50+(w?.commercial||75)*.32+(r()-.5)*22,38,96)),
  originality:Math.round(clamp(52+r()*38,38,96)),access:Math.round(clamp(47+(w?.commercial||75)*.28+(r()-.5)*22,35,96)),difficulty:Math.round(clamp(35+scaleBudget*1.4+r()*22,30,94)),
  writerId,source,status:'writing',owner:'player',filmStarted:false,available:false,createdWeek:state.week,bids:0,developmentSpend:0,
  commissionBrief:{brief,scale,audience},creativeIntent:creativeIntent||null,dueWeek:state.week+(source==='Original Concept'?4:3)};
 ensureScriptEcosystem(s);
 s.structure=Math.round(clamp(45+(w?.structure||75)*.40+(r()-.5)*18,35,97));s.characters=Math.round(clamp(43+(w?.character||75)*.42+(r()-.5)*18,35,97));
 s.emotion=Math.round(clamp(40+((w?.character||75)*.25+(w?.dialogue||75)*.18)+(r()-.5)*20,30,97));s.genreFulfillment=Math.round(clamp(48+(w?.structure||75)*.24+(w?.commercial||75)*.18+(w?.genres.includes(genre)?7:0)+(r()-.5)*15,35,97));
 if(brief==='prestige'){s.characters=clamp(s.characters+4,20,98);s.emotion=clamp(s.emotion+4,20,98);s.access=clamp(s.access-2,20,98)}
 if(brief==='commercial'){s.hook=clamp(s.hook+4,20,98);s.access=clamp(s.access+4,20,98);s.originality=clamp(s.originality-1,20,98)}
 if(brief==='genre')s.genreFulfillment=clamp(s.genreFulfillment+5,20,98);
 if(source==='Original Concept'){s.originality=clamp(s.originality+2,20,98);s.rights={type:'full',label:'Full studio-owned IP',detail:'The studio originated the property and controls screen, sequel and remake rights outright.'}}
 else if(source==='Commission')s.rights=commissionRights(r);
 let cost;
 if(source==='Sequel Development')cost=+(.20+(w?.fee||.7)*.48).toFixed(2);
 else{const costDraft={scale,brief};cost=scriptDevelopmentCost(w,source==='Original Concept'?'concept':'commission',costDraft)}
 if(!spend(cost))return null;
 s.developmentSpend=cost;state.scripts.push(s);
 const verb=source==='Original Concept'?'put an original property into development':source==='Sequel Development'?'opened sequel development on':'commissioned a screenplay with';
 addNews(state,`${state.studio.name} ${verb} ${w?.name||'a writer'}: ${s.title}. Draft due around Week ${s.dueWeek}.`,'Development');
 return s;
}
function commissionScript(genre,brief,scale,audience,writerId){
 if(!requireDevelopmentRoute('commission'))return;
 const s=makeCommissionedScript({genre,brief,scale,audience,writerId,source:'Commission'});if(!s)return;
 state.uiScriptTab='owned';state.screen='develop';state.detail=null;save();render();
}
function createOriginalConcept(title,genre,logline,synopsis,audience,writerId,scale='mid',positioning='balanced',tone='balanced',rating='mainstream',emphasis='balanced'){
 if(!requireDevelopmentRoute('concept'))return;
 if(!title.trim()||!logline.trim())return showToast('Add a title and logline.');
 const creativeIntent={positioning,tone,rating,emphasis},s=makeCommissionedScript({genre,brief:positioning==='prestige'?'prestige':positioning==='commercial'?'commercial':'balanced',scale,audience,writerId,title,logline,source:'Original Concept',creativeIntent,synopsis});if(!s)return;
 state.uiScriptTab='owned';state.screen='develop';state.detail=null;save();render();
}
function updateWritingProjects(){
 (state.scripts||[]).filter(s=>s.status==='writing'&&s.dueWeek<=state.week).forEach(s=>{
  s.status='owned';s.owner='player';s.available=false;
  const w=writerById(s.writerId);if(w){w.credits=w.credits||[];w.credits.unshift({title:s.title,week:state.week,type:'Script'});w.relationship=clamp((w.relationship||0)+2,-30,40)}
  addNews(state,`${s.title} has delivered a completed draft to ${state.studio.name}.`,'Development');
  notify(`script-ready:${s.id}`,`${s.title}: draft delivered`,`The commissioned screenplay is ready for coverage, rewrites or packaging.`,null,false,'info',{screen:'develop',detail:{type:'script',id:s.id}});
 });
}
function beginOwnedScript(scriptId){
 const s=ensureScriptEcosystem(scriptById(scriptId));
 if(!s||s.owner!=='player'||s.status!=='owned'||s.filmStarted)return showToast('That script cannot enter film development.');
 s.filmStarted=true;s.status='filming';createPlayerFilmFromOwnedScript(s);
}


function ensureWriterDrafts(){
 state.uiWriterDrafts=state.uiWriterDrafts||{};
 state.uiWriterDrafts.concept={title:'',genre:'Psychological Horror',logline:'',synopsis:'',audience:'Mainstream Adults',scale:'mid',positioning:'balanced',tone:'balanced',rating:'mainstream',emphasis:'balanced',writerId:null,...(state.uiWriterDrafts.concept||{})};
 state.uiWriterDrafts.commission={genre:'Psychological Horror',audience:'Mainstream Adults',brief:'balanced',scale:'mid',writerId:null,...(state.uiWriterDrafts.commission||{})};
 state.uiWriterDrafts.search=state.uiWriterDrafts.search||'';
 state.uiWriterDrafts.sort=state.uiWriterDrafts.sort||'fit';
 return state.uiWriterDrafts;
}
function writerProjectFit(w,mode){
 const drafts=ensureWriterDrafts(),d=mode==='concept'?drafts.concept:drafts.commission;
 const brief=mode==='concept'?'balanced':d.brief;
 return writerFit(w,d.genre,brief);
}
function writerCommissionCost(w,mode){const d=mode==='concept'?ensureWriterDrafts().concept:ensureWriterDrafts().commission;return scriptDevelopmentCost(w,mode,d)}
function writerRecommendationTags(w,mode){
 const d=mode==='concept'?ensureWriterDrafts().concept:ensureWriterDrafts().commission,tags=[];
 if(w.genres.includes(d.genre))tags.push('Genre Experience');
 if(w.character>=88)tags.push('Character Specialist');
 if(w.structure>=88)tags.push('Story Architect');
 if(w.dialogue>=88)tags.push('Dialogue Strength');
 if(w.commercial>=88)tags.push('Commercial Specialist');
 if(writerCommissionCost(w,mode)<=(mode==='concept'?1.75:1.05)&&writerProjectFit(w,mode)>=73)tags.push('Best Value');
 if((w.relationship||0)>=12)tags.push('Trusted Writer');
 return tags.slice(0,3);
}
function writerRelationshipLabel(v){
 if(v>=24)return 'Trusted collaborator';
 if(v>=10)return 'Good relationship';
 if(v<=-12)return 'Difficult relationship';
 if(v<=-4)return 'Cool relationship';
 return 'No established relationship';
}


function ensurePackagingState(f){
 if(!f)return;
 f.auditions=f.auditions||{};
 Object.values(f.auditions).forEach(a=>{if(a&&a.sortEstimate===undefined)a.sortEstimate=a.estimate});
 f.auditionRound=f.auditionRound||1;
 f.auditionSlotsUsed=f.auditionSlotsUsed||0;
 f.extraAuditionRounds=f.extraAuditionRounds||0;
 f.contracts=f.contracts||{};
 f.backendPaid=f.backendPaid||0;
 state.collaborations=state.collaborations||{};
 if(typeof ensureProductionDepth==='function')ensureProductionDepth(f);
}
function collaborationKey(a,b){return [a,b].sort().join('|')}
function collaborationScore(a,b){
 if(!a||!b)return 0;
 state.collaborations=state.collaborations||{};
 return state.collaborations[collaborationKey(a,b)]||0;
}
function changeCollaboration(a,b,delta){
 if(!a||!b)return;
 state.collaborations=state.collaborations||{};
 const k=collaborationKey(a,b);
 state.collaborations[k]=clamp((state.collaborations[k]||0)+delta,-30,40);
}
function adjustTalentRelationship(t,delta,reason,filmId=null){
 if(!t||!delta)return 0;
 const before=t.relationship||0,after=clamp(before+delta,-40,50),actual=after-before;
 t.relationship=after;t.relationshipHistory=t.relationshipHistory||[];
 if(actual){
  t.relationshipHistory.unshift({week:state.week,day:typeof currentCalendarDay==='function'?currentCalendarDay():null,delta:actual,before,after,reason,filmId});
  t.relationshipHistory=t.relationshipHistory.slice(0,18);
 }
 return actual;
}
function talentRelationshipRecent(t,limit=5){return (t?.relationshipHistory||[]).slice(0,limit)}
function relationshipLabel(v){
 if(v>=30)return 'Favoured collaborator';
 if(v>=16)return 'Trusted relationship';
 if(v>=6)return 'Positive relationship';
 if(v<=-16)return 'Damaged relationship';
 if(v<=-6)return 'Cool relationship';
 return 'Neutral relationship';
}
function playerTalentCommitment(tid,excludeFilmId=null){
 return playerFilms().find(f=>f.id!==excludeFilmId&&f.stage==='development'&&f.contracts?.[tid]&&packageTalentIds(f).includes(tid))||null;
}
function talentUnavailableForFilm(t,f=null){
 if(!t||t.retired)return true;
 if(busy(t))return true;
 return !!playerTalentCommitment(t.id,f?.id||null);
}
function talentAvailabilityReason(t,f=null){
 if(!t)return 'Talent record unavailable.';
 if(t.retired)return `${t.name} is retired.`;
 if(busy(t))return `${t.name} is already committed through Week ${t.busyUntil}.`;
 const held=playerTalentCommitment(t.id,f?.id||null);
 if(held)return `${t.name} is already under contract on ${held.title}.`;
 return '';
}
function scoutingConfidence(t){
 if(t.star>=75||t.credits.length>=4)return 'High';
 if(t.star>=42||t.acting>=82||t.credits.length>=2)return 'Moderate';
 return 'Low';
}
function actorScoutingView(t,f,roleId=null){
 ensurePackagingState(f);ensureFilmRoles(f);
 const role=roleId?roleById(f,roleId):castingTargetRole(f),trueFit=actorRoleFit(t,f,role.id),aud=auditionForRole(f,t.id,role.id);
 if(aud)return {estimate:aud.estimate,confidence:aud.confidence,source:'Audition',trueFit,roleId:role.id};
 const confidence=scoutingConfidence(t);
 const spread=(confidence==='High'?6:confidence==='Moderate'?11:18)*scoutingPrecisionMultiplier();
 const r=makeRng(hash(state.seed+'|scout|'+f.id+'|'+t.id+'|'+role.id));
 const estimate=clamp(trueFit+(r()-.5)*2*spread,20,95);
 return {estimate,confidence,source:'Scouting',trueFit,roleId:role.id};
}
function auditionGrade(v){
 if(v>=88)return 'Outstanding';
 if(v>=77)return 'Strong';
 if(v>=65)return 'Solid';
 if(v>=52)return 'Mixed';
 return 'Poor';
}
function actorDrawLabel(v){return v>=88?'Marquee draw':v>=76?'Major draw':v>=63?'Recognisable':v>=48?'Some awareness':'Limited draw'}
function actorActingLabel(v){return v>=94?'Elite craft':v>=88?'Acclaimed':v>=80?'Strong':v>=70?'Proven':'Unproven'}
function actorReliabilityLabel(v){return v>=90?'Very reliable':v>=80?'Reliable':v>=67?'Normal reliability':'Production risk'}
function actorPublicRoleSignals(t,f,roleRef=null){
 const role=roleRef&&typeof roleRef==='object'?roleRef:roleById(f,roleRef||castingTargetRole(f).id),out=[];
 if((t.genres||[]).includes(f.genre))out.push(`Established ${f.genre.toLowerCase()} experience.`);
 else if((t.genres||[]).some(g=>adjacentGenre(g,f.genre)))out.push('Some adjacent genre experience, but not a direct precedent.');
 else out.push(`This would be a visible move outside the actor's usual genre lane.`);
 if(Number.isFinite(t.age)){
  if(t.age>=role.ageMin&&t.age<=role.ageMax)out.push(`Naturally sits inside the current screen-age brief for ${role.name}.`);
  else out.push(`Would reframe the current screen-age brief for ${role.name}.`);
 }
 out.push(`${actorReliabilityLabel(t.reliability||70)} on production.`);
 return out.slice(0,3);
}
function castingEvidenceFor(t,f,roleId){
 const aud=auditionForRole(f,t.id,roleId);
 if(!aud)return {label:'Role fit untested',cls:'warn',detail:'No screen test has been run for this specific role.'};
 const cls=['Outstanding','Strong'].includes(aud.grade)?'good':aud.grade==='Solid'?'blue':aud.grade==='Mixed'?'warn':'bad';
 return {label:`${aud.grade} screen test`,cls,detail:aud.note};
}
function packageCastingEvidence(f){
 ensureFilmRoles(f);const leads=['lead1','lead2'].map(id=>({id,t:f.roleAssignments?.[id]?talentById(f.roleAssignments[id]):null})).filter(x=>x.t);
 if(leads.length<2)return {label:'Incomplete cast',cls:'bad',tested:0};
 const evidence=leads.map(x=>castingEvidenceFor(x.t,f,x.id)),tested=evidence.filter(x=>!x.label.startsWith('Role fit')).length,strong=evidence.filter(x=>x.cls==='good').length,weak=evidence.filter(x=>x.cls==='bad'||(x.cls==='warn'&&!x.label.startsWith('Role fit'))).length;
 if(tested===2&&strong===2)return {label:'Strong tested cast',cls:'good',tested};
 if(tested===2&&weak)return {label:'Mixed casting evidence',cls:'warn',tested};
 if(tested===2)return {label:'Tested cast',cls:'blue',tested};
 return {label:'Limited casting evidence',cls:'warn',tested};
}
function auditionActor(f,tid){
 const y=typeof window!=='undefined'?(window.scrollY||0):0;ensurePackagingState(f);ensureFilmRoles(f);
 const t=talentById(tid),role=castingTargetRole(f),key=auditionKey(tid,role.id);
 if(!t||t.type!=='Actor'||talentUnavailableForFilm(t,f))return showToast(talentAvailabilityReason(t,f)||'That actor is not currently available.');
 if(auditionForRole(f,tid,role.id))return showToast(`You already have an screen-test report for ${t.name} as ${role.name}.`);
 const declined=talentDeclineForRole(f,tid,role.id);if(declined)return showToast(`${t.name} has already passed on ${role.name}.`);
 if(f.auditionSlotsUsed>=auditionSlotLimit())return showToast('This audition round is full. Open another round if you want to see more performers.');
 const interest=talentProjectInterest(t,f,role,'audition');
 f.auditionSlotsUsed++;
 if(!interest.accept){
  markTalentDecline(f,t,role.id,interest.reason,'audition');
  addNews(state,`${t.name}'s representatives declined a screen test for ${role.name} in ${f.title}.`,'Casting');
  save();render();if(typeof window!=='undefined')setTimeout(()=>window.scrollTo(0,y),0);return;
 }
 const preAuditionSortEstimate=actorScoutingView(t,f,role.id).estimate,trueFit=actorRoleFit(t,f,role.id),base=scoutingConfidence(t);
 const confidence=base==='Low'?'Moderate':base;
 const spread=confidence==='High'?7:confidence==='Moderate'?10:14;
 const r=makeRng(hash(state.seed+'|audition|'+f.id+'|'+tid+'|'+role.id+'|'+f.auditionRound));
 const estimate=clamp(trueFit+(r()-.5)*2*spread,18,98);
 // Auditions deliberately include room variance. Strong actors can still give flat reads,
 // while a risky candidate can surprise the room.
 const roomNoise=-25+r()*40;
 const spark=clamp(trueFit*.55+t.acting*.30+t.reliability*.10+roomNoise,18,98);
 f.auditions[key]={
  actorId:tid,roleId:role.id,round:f.auditionRound,week:state.week,estimate,sortEstimate:preAuditionSortEstimate,
  confidence,grade:auditionGrade(spark),spark,
  note:spark>=88?`The room changed immediately. ${t.name} found something unusually specific in ${role.name}.`:
       spark>=77?`A persuasive read for ${role.name}, with several choices the casting team believes could carry to screen.`:
       spark>=65?`A competent read for ${role.name}. It supports the casting case, but did not remove the uncertainty around the part.`:
       spark>=52?`The read had usable moments, but ${role.name} never fully settled. The team left with real questions.`:
       `The audition went badly. The room did not believe ${t.name} in ${role.name}, and the report materially weakens the casting case.`
 };
 addNews(state,`${t.name} screen-tested for ${role.name} in ${f.title}. The casting report was ${f.auditions[key].grade.toLowerCase()}.`,'Casting');
 save();render();if(typeof window!=='undefined')setTimeout(()=>window.scrollTo(0,y),0);
}
function extraAuditionRound(f){
 ensurePackagingState(f);
 if(f.auditionSlotsUsed<auditionSlotLimit())return showToast('You still have audition slots in the current round.');
 const blocking=state.decisions?.filter(x=>x.type==='production')||[];
 if(blocking.length)return showToast('Resolve the active production decision before spending a week on more auditions.');
 const extraCost=extraAuditionCost();if(!spend(extraCost))return;
 f.investment+=extraCost;f.auditionRound++;f.auditionSlotsUsed=0;f.extraAuditionRounds++;
 addNews(state,`${f.title} opened an additional screen-test round, costing a week of development time.`,'Casting');
 advanceWeek();
}
function dynamicCastingTags(t,f){
 const role=castingTargetRole(f),aud=auditionForRole(f,t.id,role.id),tags=[];ensureTalentMarketEconomy(t);
 if(f.sequelOptions?.includes(t.id))tags.push('Under Sequel Option');
 if(aud&&['Outstanding','Strong'].includes(aud.grade))tags.push('Screen-Test Standout');
 if(!(t.genres||[]).includes(f.genre)&&aud&&['Outstanding','Strong'].includes(aud.grade))tags.push('Against Type');
 if((t.reliability||0)>=88&&(t.acting||0)>=80)tags.push('Safe Bet');
 if(t.fee<=2.4&&(t.acting||0)>=84&&(t.star||0)<72)tags.push('Value Performer');
 if(t.acting>=82&&t.momentum<55)tags.push('Comeback Candidate');
 if(f.directorId){
  const c=collaborationScore(f.directorId,t.id);
  if(c>=18)tags.push("Director's Choice");else if(c>=10)tags.push('Trusted by Director');
 }
 return [...new Set(tags)].slice(0,2);
}
function contractOffers(f,t){
 ensurePackagingState(f);ensureTalentMarketEconomy(t);
 const c=f.creative||defaultCreative();
 const fit=t.type==='Director'?directorProjectFit(t,f):actorProjectFit(t,f);
 const rel=t.relationship||0;
 const r=makeRng(hash(state.seed+'|contract|'+f.id+'|'+t.id));
 const hot=(t.momentum||60)>84?.08:0;
 const leverage=t.type==='Actor'?(t.star||40)>85?.08:0:(t.commercial||60)>88?.05:0;
 const agencyTerms=agencyMarketLeverage(t,f),agencyAdj=agencyContractMultiplier(t,f);
 const passion=fit>=82&&(c.positioning==='prestige'||c.emphasis==='performance'||t.genres.includes(f.genre))&&r()<(.24+Math.max(0,rel)/120+studioIdentityPassionBonus(t,f));
 const relationAdj=1-clamp(rel,-25,30)*.0022;
 const passionAdj=passion?.84:1;
 const heldSequelOption=t.type==='Actor'&&f.sequelOptions?.includes(t.id);
 const identityAdj=studioIdentityContractMultiplier(t,f);let flat=+(t.fee*(1+hot+leverage)*relationAdj*passionAdj*identityAdj*agencyAdj).toFixed(2);
 if(heldSequelOption){
  const parent=filmById(f.ipParentId),oldBase=parent?.contracts?.[t.id]?.baseFee||t.fee;
  flat=+Math.min(flat,oldBase*1.22).toFixed(2);
 }
 const backend=t.type==='Actor'?((t.star||50)>82?4:2.5):2;
 const optionA=heldSequelOption
  ?{id:'flat',label:'Exercise sequel option',upfront:flat,backend:0,sequelOption:false,producerCredit:false,desc:`${money(flat)} under the option negotiated on the previous film.`}
  :{id:'flat',label:'Flat fee',upfront:flat,backend:0,sequelOption:false,producerCredit:false,desc:`${money(flat)} guaranteed. Cleanest deal with no participation.`};
 const optionB={id:'backend',label:'Lower fee + backend',upfront:+(flat*.64).toFixed(2),backend,sequelOption:false,producerCredit:false,
  desc:`${money(flat*.64)} upfront + ${backend}% of studio receipts. Protects cash now, becomes expensive on a hit.`};
 let optionC;
 if(t.type==='Actor'){
  optionC={id:'sequel',label:'Fee + sequel option',upfront:+(flat*.80).toFixed(2),backend:0,sequelOption:true,producerCredit:false,
   desc:`${money(flat*.80)} upfront and a studio-held sequel option. Useful if this becomes valuable IP.`};
 }else{
  optionC={id:'credit',label:'Fee + producer credit',upfront:+(flat*.84).toFixed(2),backend:0,sequelOption:false,producerCredit:true,
   desc:`${money(flat*.84)} upfront plus producer credit. Slightly cheaper, but gives the director more status on the project.`};
 }
 const identityHelp=identityAdj<.995,agencyNote=agencyContractContext(t,f);const note=passion?`${t.name} appears unusually enthusiastic about the material and is accepting below-market structures.`:
  agencyNote||identityHelp?`${agencyNote||`${state.studio.name}'s current industry identity is giving the studio a little extra leverage on these terms.`}`:
  rel>=16?`Your existing relationship gives the studio some negotiating goodwill.`:
  rel<=-8?`The relationship is cool; the studio has less leverage than usual.`:
  ((t.momentum||60)>84?`${t.name}'s current momentum is strengthening their negotiating position.`:'Terms are broadly in line with the current market.');
 return {options:[optionA,optionB,optionC],note,passion,agency:agencyTerms};
}
function acceptContract(f,tid,offerId){
 ensurePackagingState(f);
 const t=talentById(tid),set=contractOffers(f,t),offer=set.options.find(x=>x.id===offerId);
 if(!offer)return;
 if(talentUnavailableForFilm(t,f)){showToast(talentAvailabilityReason(t,f)||`${t.name} is no longer available.`);return}
 f.contracts[tid]={...offer,talentId:tid,baseFee:t.fee,acceptedWeek:state.week};
 f.history.push(`Week ${state.week}: agreed ${offer.label.toLowerCase()} terms with ${t.name}.`);
 save();render();
}
function clearTalentContract(f,tid){ensurePackagingState(f);delete f.contracts[tid]}
function allContractsAgreed(f){
 ensurePackagingState(f);
 if(!f.directorId||f.cast.length<2)return false;
 if(supportingActors(f).length<requiredSupportingRoles(f))return false;
 return packageTalentIds(f).every(id=>!!f.contracts[id]);
}
function agreedUpfront(f){
 ensurePackagingState(f);
 return packageTalentIds(f).reduce((a,id)=>a+(f.contracts[id]?.upfront??talentById(id)?.fee??0),0);
}
function contractBackendPct(f){
 ensurePackagingState(f);
 return packageTalentIds(f).reduce((a,id)=>a+(f.contracts[id]?.backend||0),0);
}
function updateRelationshipsAfterFilm(f,profit){
 ensurePackagingState(f);
 const d=talentById(f.directorId),actors=packageActors(f),impact=(f.review.critics+f.review.audience)/2;
 const experience=(impact>=80?4:impact>=68?2:impact<52?-3:0)+(f.metrics.stability>=78?1:f.metrics.stability<48?-2:0);
 [d,...actors].forEach(t=>{
  const credit=f.contracts[t.id]?.producerCredit?1:0,delta=experience+credit;
  const reason=impact>=80?`${f.title}: strong finished-film experience`:impact<52?`${f.title}: difficult finished-film experience`:`${f.title}: completed collaboration`;
  adjustTalentRelationship(t,delta,credit?`${reason}; producer credit respected`:reason,f.id);
 });
 const chemistryDelta=f.metrics.chemistry>=86?8:f.metrics.chemistry>=74?4:f.metrics.chemistry<48?-6:1;
 if(actors[0]&&actors[1])changeCollaboration(actors[0].id,actors[1].id,chemistryDelta);
 actors.forEach(a=>{
  const working=f.metrics.performances>=82?4:f.metrics.performances<55?-4:1;
  changeCollaboration(d.id,a.id,working);
 });
 if(f.metrics.chemistry>=86&&actors[0]&&actors[1])addNews(state,`${actors[0].name} and ${actors[1].name} emerged from ${f.title} as a notably strong screen pairing.`,'Talent Watch');
}
function knownCollaborators(t){
 state.collaborations=state.collaborations||{};
 return state.talent.filter(x=>x.id!==t.id).map(x=>({t:x,score:collaborationScore(t.id,x.id)}))
  .filter(x=>Math.abs(x.score)>=6).sort((a,b)=>Math.abs(b.score)-Math.abs(a.score)).slice(0,4);
}


function createPlayerFilmFromOwnedScript(s){
 ensureScriptEcosystem(s);
 const f={id:uid('film',state),owner:'player',studio:state.studio.name,title:s.title,scriptId:s.id,genre:s.genre,stage:'development',paused:false,
  directorId:null,cast:[],supportingCastId:null,supportingCastIds:[],producerStrategy:'lean',effectsApproach:'hybrid',contracts:{},auditions:{},auditionRound:1,auditionSlotsUsed:0,extraAuditionRounds:0,backendPaid:0,ipParentId:s.ipParentFilmId||null,franchiseMode:s.franchiseMode||null,franchiseRootId:s.franchiseRootId||null,sequelInstallment:s.sequelInstallment||null,sequelOptions:s.ipParentFilmId?(filmById(s.ipParentFilmId)?.cast||[]).filter(id=>filmById(s.ipParentFilmId)?.contracts?.[id]?.sequelOption):[],ipParticipationPct:s.ipParticipationPct||0,budget:s.naturalBudget,creative:s.creativeIntent?{...defaultCreative(),...s.creativeIntent}:defaultCreative(),marketing:0,campaign:null,marketingState:null,audienceSegments:null,marketRegisteredRelease:false,marketRegisteredOutcome:false,releaseWeek:null,releaseOps:0,createdWeek:state.week,
  productionStart:null,productionEnd:null,productionWeek:0,events:[],pendingEvent:null,productionState:null,metrics:null,rough:null,post:null,tested:null,testScore:null,
  review:null,cinemaWeek:0,weeklyPlan:[],weeklyResults:[],studioRevenue:0,investment:s.developmentSpend||0,finalGross:0,completeWeek:null,history:[],
  reputationDelta:{creative:0,commercial:0,talent:0}};
 state.films.push(f);
 if(s.invitationDirectorId&&state.week<=(s.invitationAttachUntil||0)){
  const d=talentById(s.invitationDirectorId);if(d&&!d.retired){f.directorId=d.id;f.history.push(`Week ${state.week}: ${d.name} entered development attached from the original industry invitation.`)}
 }
 if(s.invitationActorId&&state.week<=(s.invitationAttachUntil||0)){
  const a=talentById(s.invitationActorId);
  if(a&&!a.retired){
   ensureFilmRoles(f);f.roleAssignments.lead1=a.id;syncRoleAssignments(f);
   f.invitationAttachedTalentId=a.id;f.invitationAttachmentSource='Industry package';
   f.history.push(`Week ${state.week}: ${a.name} entered development attached to the package as a principal lead.`);
   if(typeof openAgencyWindow==='function')openAgencyWindow(a,f);
  }
 }
 addNews(state,`${state.studio.name} moved ${s.title} into film development.`,'Your Studio');
 state.screen='slate';state.detail={type:'film',id:f.id};state.history=[];save();render();
}
function createPlayerFilm(scriptId){const s=scriptById(scriptId);if(s&&s.owner==='player')beginOwnedScript(scriptId);else showToast('Acquire the screenplay rights first.')}

function attachDirector(f,tid){
 ensurePackagingState(f);const t=talentById(tid);
 if(!t||talentUnavailableForFilm(t,f))return showToast(talentAvailabilityReason(t,f)||'That director is not currently available.');
 if(f.directorId&&f.directorId!==tid)clearTalentContract(f,f.directorId);
 f.directorId=tid;f.history.push(`Week ${state.week}: ${t.name} attached as director.`);save();render()
}
function toggleCast(f,tid){
 ensurePackagingState(f);ensureFilmRoles(f);const y=typeof window!=='undefined'?(window.scrollY||0):0,role=castingTargetRole(f);
 const current=f.roleAssignments?.[role.id]||null;
 if(current===tid&&f.invitationAttachedTalentId===tid)return showToast(`${talentById(tid)?.name||'This performer'} is attached to the package and cannot be removed through normal casting.`);
 if(current===tid){delete f.roleAssignments[role.id];clearTalentContract(f,tid);syncRoleAssignments(f)}
 else assignLeadRole(f,role.id,tid);
 save();render();if(typeof window!=='undefined')setTimeout(()=>window.scrollTo(0,y),0);
}
function greenlight(f){
 if(!f)return false;
 // Greenlight must be idempotent. A queued second tap/event after a successful
 // greenlight should never re-run validation against talent who are now busy
 // on this film, nor spend the production cost twice.
 if(f.stage==='production')return true;
 if(f.stage!=='development'){showToast('This project is no longer awaiting a greenlight decision.');return false}
 ensurePackagingState(f);ensureFilmRoles(f);
 if(!f.directorId||f.cast.length<2){showToast('Attach a director and two principal actors first.');return false}
 ensureProductionDepth(f);const req=supportingCastRequirement(f);
 if(!req.complete){showToast(`${req.label} productions require ${req.required} supporting performer${req.required===1?'':'s'} before greenlight.`);return false}
 if(!allContractsAgreed(f)){showToast('Agree terms with every attached director and performer before greenlighting.');return false}
 if(playerFilms().filter(x=>x.stage==='production').length>=playerProductionCapacity()){showToast(`All ${playerProductionCapacity()} production slots are currently occupied.`);return false}
 const d=talentById(f.directorId),cast=f.cast.map(talentById),support=supportingActors(f),attached=[d,...cast,...support].filter(Boolean);
 const unavailable=attached.filter(t=>talentUnavailableForFilm(t,f));
 if(unavailable.length){showToast(`${unavailable.map(t=>t.name).join(', ')} ${unavailable.length===1?'is':'are'} no longer available for this production.`);return false}
 const depthCost=productionDepthCost(f),cost=f.budget+agreedUpfront(f)+depthCost;
 if(!spend(cost))return false;
 f.investment+=cost;f.productionDepthSpend=depthCost;f.stage='production';f.productionStart=state.week;const sc=ensureScriptEcosystem(scriptById(f.scriptId));
 const r=makeRng(hash(state.seed+'|green|'+f.id));
 const length=5+Math.round(sc.difficulty/25);f.productionEnd=state.week+length;f.productionWeek=1;
 const natural=sc.naturalBudget,ratio=f.budget/natural,budgetFactor=ratio<.6?.44:ratio<.8?.66:ratio<.92?.84:ratio<=1.15?1:1+Math.min(.035,(ratio-1.15)*.035);
 const c=f.creative||defaultCreative(),dFit=directorProjectFit(d,f),aFits=cast.map((a,i)=>actorRoleFit(a,f,`lead${i+1}`)),fitAvg=(aFits[0]+aFits[1])/2;
 const actorHistory=collaborationScore(cast[0].id,cast[1].id),directorHistory=(collaborationScore(d.id,cast[0].id)+collaborationScore(d.id,cast[1].id))/2;
 const fitDirection=(dFit-65)*.34+directorHistory*.10,fitPerformance=(fitAvg-65)*.34+directorHistory*.13;
 const act=cast.reduce((a,b)=>a+b.acting,0)/cast.length;
 f.packageFit={director:dFit,actors:aFits,average:(dFit+aFits[0]+aFits[1])/3};f.directorAuthority={producerCredit:!!f.contracts?.[d.id]?.producerCredit,vetoesUsed:0};
 f.metrics={
  direction:clamp((d.craft+(d.genres.includes(f.genre)?4:-5))*budgetFactor+fitDirection+(r()-.5)*10,24,97),
  performances:clamp((act*.64+d.actorDirection*.22+sc.characters*.08+sc.emotion*.06)*budgetFactor+fitPerformance+(r()-.5)*12,24,98),
  technical:clamp((45+d.budgetControl*.26+sc.difficulty*.13)*budgetFactor+(dFit-65)*.10+(r()-.5)*14,20,96),
  pacing:clamp(42+sc.access*.13+sc.structure*.18+(d.commercial-70)*.10+(dFit-65)*.10+(r()-.5)*25,24,95),
  clarity:clamp(sc.story*.47+sc.structure*.28+d.craft*.11+(dFit-65)*.08+(r()-.5)*16,26,97),
  chemistry:clamp(40+act*.25+d.actorDirection*.18+(fitAvg-65)*.22+actorHistory*.28+(r()-.5)*26,22,96),
  stability:clamp(cast.reduce((a,b)=>a+b.reliability,0)/cast.length*.50+d.budgetControl*.28-(Math.max(0,f.budget-directorScaleComfort(d))*.45)+(r()-.5)*12,22,97)
 };
 if(c.positioning==='prestige'){f.metrics.direction+=3;f.metrics.clarity+=2;f.metrics.pacing-=1}
 if(c.positioning==='commercial'){f.metrics.pacing+=3;f.metrics.clarity-=1}
 if(c.tone==='grounded'){f.metrics.direction+=2;f.metrics.performances+=2;f.metrics.technical-=1}
 if(c.tone==='heightened'){f.metrics.technical+=2;f.metrics.pacing+=2;f.metrics.clarity-=1}
 if(c.emphasis==='performance'){f.metrics.performances+=5;f.metrics.technical-=2}
 if(c.emphasis==='spectacle'){f.metrics.technical+=5;f.metrics.performances-=2;if(ratio<.9)f.metrics.technical-=6}
 applyProductionDepthMetrics(f);Object.keys(f.metrics).forEach(k=>f.metrics[k]=clamp(f.metrics[k],20,98));
 f.productionState={schedule:0,morale:clamp(66+(f.metrics.stability-65)*.30+(directorHistory+actorHistory)*.08,35,92),extraSpend:0,cleanWeeks:0,notes:[]};
 recordProductionDaily(f);
 f.events=buildProductionEvents(f,r);ensureProductionCreativeFork(f);
 d.busyUntil=f.productionEnd+1;cast.forEach(a=>a.busyUntil=f.productionEnd+1);support.forEach(a=>a.busyUntil=f.productionEnd+1);
 const band=fitBand(f.packageFit.average);
 addNews(state,`${f.title} entered production under ${d.name}. Internal packaging view: ${band.label.toLowerCase()}.`,'Your Studio');

 // Replace the review route with the live production film page.
 // The previous film-detail history entry is no longer useful after the irreversible transition,
 // so pop it and keep the screen beneath it (normally Slate) as the Back destination.
 if(state.detail?.type==='greenlightReview'&&state.detail.id===f.id&&state.history?.length){
  const previous=state.history.at(-1);
  if(previous?.detail?.type==='film'&&previous.detail.id===f.id)state.history.pop();
 }
 state.screen='slate';state.detail={type:'film',id:f.id};requestScrollTop();
 save();render();return true;
}

function variationPick(f,key,items){
 if(!items?.length)return '';const r=makeRng(hash((state.seed||1)+'|variation-v314|'+(f?.id||'none')+'|'+key));
 return items[Math.floor(r()*items.length)]||items[0];
}
function ensureFilmIdentity(f){
 if(!f)return null;
 if(!f.filmIdentity||f.filmIdentity.version!==314){
  const sc=scriptById(f.scriptId),c=f.creative||defaultCreative(),g=f.genre||sc?.genre||'Drama',m=f.metrics||{},r=makeRng(hash((state.seed||1)+'|film-identity-v314|'+f.id));
  let archetype='Story-First Studio Film';
  if((m.chemistry||0)>=82)archetype='Relationship-Driven Film';
  else if(c.emphasis==='performance'||g==='Prestige Drama')archetype='Performance-Led Drama';
  else if((g.includes('Science')||g==='Fantasy')&&c.emphasis==='spectacle')archetype='World-Building Spectacle';
  else if(g.includes('Action'))archetype='Kinetic Thriller';
  else if(g==='Psychological Horror')archetype='Unsettling Mood Piece';
  else if(g==='Crime Thriller')archetype=c.tone==='grounded'?'Precision Crime Film':'Paranoid Thriller';
  else if(g==='Comedy')archetype=c.tone==='heightened'?'Stylised Comedy':'Character Comedy';
  else if(g==='Family Adventure')archetype='Adventure Crowd-Pleaser';
  else if(g==='Science Fiction')archetype='Cerebral Science Fiction';
  else if(g==='Fantasy')archetype='Mythic Fantasy';
  const texturePools={
   'Action Thriller':['muscular','lean','hard-edged','propulsive','street-level'],
   'Psychological Horror':['claustrophobic','dreamlike','bleak','slow-burn','uncanny'],
   'Prestige Drama':['intimate','observational','austere','emotionally direct','actor-forward'],
   'Science Fiction':['tactile','cerebral','neon-lit','mythic','coldly futuristic'],
   'Comedy':['dry','chaotic','warm','deadpan','fast-talking'],
   'Family Adventure':['storybook','bright','earnest','adventure-forward','playful'],
   'Crime Thriller':['nocturnal','procedural','grimy','paranoid','precision-cut'],
   'Fantasy':['mythic','romantic','dark-fairytale','adventure-forward','otherworldly']
  };
  const texture=pick(r,texturePools[g]||['specific','characterful','cinematic']);
  const engines=[
   c.emphasis==='performance'?'performance':null,c.emphasis==='spectacle'?'spectacle':null,
   (m.pacing||0)>=80?'momentum':null,(m.clarity||0)>=82?'clarity':null,(m.technical||0)>=82?'craft':null,
   (m.chemistry||0)>=80?'chemistry':null,sc?.originality>=82?'originality':null
  ].filter(Boolean);
  const engine=engines.length?pick(r,engines):'story';
  f.filmIdentity={version:314,archetype,texture,engine,createdWeek:state.week};
 }
 const id=f.filmIdentity,m=f.metrics||{};
 const dims=[
  ['performances',m.performances],['direction',m.direction],['technical craft',m.technical],['pacing',m.pacing],['story clarity',m.clarity],['lead chemistry',m.chemistry]
 ].filter(x=>Number.isFinite(x[1])).sort((a,b)=>b[1]-a[1]);
 id.strength=dims[0]?.[0]||id.engine;id.risk=dims.at(-1)?.[0]||'execution';
 return id;
}
function filmIdentityLine(f){
 const id=ensureFilmIdentity(f),sc=scriptById(f.scriptId);if(!id)return '';
 const focus=sc&&typeof scriptFocus==='function'?scriptFocus(sc):'its central premise';
 return `A ${id.texture} ${id.archetype.toLowerCase()} built around ${focus}.`;
}
function filmPressAngle(f,phase='release'){
 if(!f)return '';const id=ensureFilmIdentity(f),d=f.directorId?talentById(f.directorId):null,x=f.creativeDirection;
 const pools={
  production:[
   `${d?.name||'The director'} is shaping the project as a ${id.texture} ${id.archetype.toLowerCase()}, with ${id.strength} emerging as the strongest internal signal.`,
   `Dailies are increasingly defining ${f.title} through ${id.strength}; the production is reading less like a generic ${f.genre.toLowerCase()} and more like a ${id.texture} ${id.archetype.toLowerCase()}.`,
   `${x?`The choice to “${x.label}” is now visible in the footage. `:''}The clearest identity on set is ${id.texture}, ${id.engine}-driven and centred on ${id.strength}.`
  ],
  release:[
   `The campaign is selling a ${id.texture} ${id.archetype.toLowerCase()} rather than the genre label alone${x?`, with the production choice to “${x.label}” now part of the finished film`:''}.`,
   `${f.title}'s finished identity is being described internally as ${id.texture} and ${id.engine}-driven, with ${id.strength} expected to be the element reviewers notice first.`,
   `${x?`Production ultimately chose to “${x.label}.” `:''}That decision leaves the release with a more specific ${id.texture} identity than the original package suggested.`
  ],
  boxoffice:[
   `The release is now testing whether audiences respond to the film's ${id.texture}, ${id.engine}-driven identity beyond the opening campaign.`,
   `Word of mouth is increasingly being shaped by ${id.strength}, the element that most clearly separates ${f.title} from a generic ${f.genre.toLowerCase()} release.`,
   `${f.review?`Reviews have focused on ${id.strength}. `:''}The box-office run is showing how far that specific creative identity travels with a wider audience.`
  ],
  close:[
   `${f.title} leaves the theatrical window with a distinct ${id.texture} identity; ${id.strength} is likely to be the part of the film that survives longest in its catalogue reputation.`,
   `Whatever the commercial result, the finished film is not anonymous: its ${id.texture}, ${id.engine}-driven approach is now part of the studio's creative record.`,
   `${x?`The production choice to “${x.label}” survived all the way to release. `:''}${id.strength[0].toUpperCase()+id.strength.slice(1)} became the clearest signature of the finished film.`
  ]
 };
 return variationPick(f,'press-angle-'+phase,pools[phase]||pools.release);
}
function productionEventFlavor(f,e){
 const id=ensureFilmIdentity(f),key=`production-event-${e.type}`,variants={
  location:[
   ['A key location disappears from the schedule',`The production team has lost access to a location carrying several scenes, forcing the unit to choose between waiting, redesigning or compressing the material.`,`The ${id.texture} visual plan depends more heavily on this location than the shooting schedule can comfortably absorb.`],
   ['A permit change threatens a major sequence',`Local access has been shortened with almost no warning. The scene can still be made, but not exactly as it was boarded.`,`The problem is logistical rather than creative, but the film's ${id.engine}-driven plan gives the unit little slack.`],
   ['The practical location no longer matches the plan',`Changes at the location mean the camera moves and staging prepared in advance will not work as designed.`,`A supposedly routine location day has become a choice about how much of the film's visual identity to protect.`]
  ],
  weather:[
   ['Weather breaks the continuity plan',`Changing conditions have made the exterior material visibly inconsistent with what was already shot.`,`The unit can protect continuity, protect schedule, or accept a rougher visual transition.`],
   ['An exterior day turns into a coverage problem',`Conditions are not dangerous, but they are wrong enough that the planned wide work is becoming unusable.`,`The ${id.texture} look is colliding with a schedule that cannot simply wait forever.`],
   ['Wind and light shut down the planned setup',`The exterior rig can no longer deliver the shots the director intended today.`,`A small weather problem becomes meaningful because this film is leaning on ${id.engine} rather than generic coverage.`]
  ],
  stunt:[
   ['Second unit calls for a safer stunt design',`The stunt team can deliver the dramatic beat, but not with the exact movement and timing currently on the boards.`,`The film's kinetic ambition is pressing against real safety and schedule limits.`],
   ['A set piece has outrun the safety margin',`Rehearsal shows that the planned version asks too much of performers and reset time.`,`The question is whether to spend, redesign or sacrifice part of the spectacle rather than simply “push through.”`],
   ['The action sequence needs to lose a beat',`The stunt coordinator believes one planned beat is making the whole sequence harder and riskier than the finished film needs.`,`The sequence can stay ambitious, but only if the production decides what part of the action actually matters.`]
  ],
  vfx:[
   ['Previs exposes the weak point in the effects plan',`An effects-heavy sequence works conceptually but not at the planned shot length and scale.`,`The film's ${id.texture} identity makes unfinished-looking imagery especially dangerous.`],
   ['The digital extension is not surviving scrutiny',`Early technical work shows the sequence will look noticeably thinner than the surrounding photography unless the approach changes.`,`A film selling ${id.engine} cannot hide a weak technical centrepiece.`],
   ['The biggest image is becoming the hardest one to finish',`The production can see the shot it wants, but the current allocation will not get it there cleanly.`,`The choice is whether to spend into the problem or redesign the image around what the film can execute well.`]
  ],
  rehearsal:[
   ['A crucial emotional beat is not landing',`The scene is technically usable, but the performance turn that motivates what follows is inconsistent across takes.`,`Because ${id.strength==='performances'?'performance is already the film’s strongest signal':'the scene carries structural weight'}, the weakness is becoming difficult to ignore.`],
   ['The lead performance is arriving in two different registers',`Dailies show two plausible versions of the character, but the cut will struggle if production keeps alternating between them.`,`This is less about talent than alignment: the actor, director and film need to agree what kind of performance belongs in this ${id.texture} version.`],
   ['The scene works on paper but not between the actors',`The blocking and dialogue are intact, yet the emotional exchange keeps flattening when the cameras roll.`,`The schedule offers very little rehearsal time to solve something the edit cannot manufacture later.`]
  ],
  star:[
   ['The lead wants the character logic changed',`A principal actor believes the scene asks the character to make a choice the performance has not earned.`,`Star leverage has turned a normal creative note into a studio-level decision.`],
   ['A star request reaches the production office',`One of the leads wants an upcoming scene reshaped to protect the character's point of view.`,`The request could improve the film, or simply pull emphasis toward the most powerful person in the package.`],
   ['The lead pushes for a different version of the scene',`The actor wants the material tilted away from exposition and toward character before shooting begins.`,`The production has to separate a useful creative instinct from ordinary star leverage.`]
  ],
  director:[
   ['The director wants to abandon the planned coverage',`The strongest dailies are coming from a looser approach, and the director wants to stop shooting the sequence the way it was originally designed.`,`The director's instincts are pulling the film further toward its emerging ${id.texture} identity.`],
   ['The director is pushing beyond the greenlight brief',`An upcoming sequence is being reconceived in a way that is bolder but less aligned with the studio's original positioning.`,`This is a genuine authorship question: protect the package you approved or allow the film to become more specific.`],
   ['The director asks for permission to break the plan',`The production has discovered a stronger visual and performance rhythm than the shot list anticipated.`,`The new version may be better, but it also reduces the studio's certainty about pace and accessibility.`]
  ],
  chemistry:[
   ['The leads are creating a different relationship than scripted',`Their scenes have more charge and humour than expected, and the director wants to reshape later material around it.`,`The opportunity is real, but expanding chemistry can change pacing and emphasis elsewhere.`],
   ['The camera has found unexpected chemistry',`Two principal performers are producing stronger connective material than the screenplay gave them.`,`The film can follow what the actors discovered or preserve the original balance.`],
   ['A relationship starts stealing the film',`Scenes between the leads are becoming the dailies everyone talks about, even when they are not the plot-heavy material.`,`The production has discovered an asset that did not exist as clearly on the page.`]
  ],
  opportunity:[
   ['A disciplined shoot buys one creative day',`The unit is ahead enough to spend some of the gain rather than merely banking it.`,`Stability has created a rare production problem with no bad answer: where should the extra capacity go?`],
   ['The schedule has quietly created breathing room',`Several efficient days have left the production with a small pocket of time and contingency.`,`The film can turn operational discipline into extra coverage, savings or a more ambitious creative swing.`],
   ['Production gets an unexpected gift',`The unit is ahead of its internal plan and can choose to preserve the saving or spend it improving the movie.`,`Strong execution has created optionality rather than crisis.`]
  ],
  overrun:[
   ['The line producer says the cushion is gone',`Small overruns have accumulated until the remaining contingency no longer protects the full shooting plan.`,`The film's ambition is now running ahead of the financial room left to execute it.`],
   ['The production is spending tomorrow’s contingency today',`No single disaster caused the problem; repeated expensive days have simply eaten through the buffer.`,`The studio now has to decide which part of the plan matters enough to protect.`],
   ['The budget has stopped forgiving mistakes',`The line producer can still finish the scheduled work, but another difficult week would put the plan under real pressure.`,`The choice is whether to add money, simplify before a crisis, or trust the remaining schedule.`]
  ],
  breakout:[
   ['A supporting performance starts stealing the dailies',`A smaller role is producing some of the film's most alive footage and the director wants to give the performer more room.`,`The opportunity could deepen the movie, but every added beat has to come from somewhere.`],
   ['The supporting player has become impossible to ignore',`What was designed as functional support is turning into one of the film's strongest character threads.`,`Production has discovered a performance asset that development did not price into the package.`],
   ['A minor role suddenly has major energy',`The dailies keep returning to the same supporting performance, and the director wants to reshape upcoming scenes to use it.`,`The question is whether the finished film benefits from following that surprise.`]
  ],
  story:[
   ['A transition is confusing everyone except the writers',`The scene logic still makes sense when explained, but the assembled footage is not communicating the turn cleanly.`,`The production can solve the problem now or leave editorial to manufacture clarity later.`],
   ['The story has developed a hole on camera',`A motivation that read clearly on the page is disappearing between the filmed scenes.`,`This is the kind of structural problem that can become expensive once the sets and actors are gone.`],
   ['A clean script beat has become a muddy screen beat',`The production has discovered that the audience will need more connective tissue than the screenplay originally supplied.`,`The choice is whether to spend shooting time on clarity or preserve momentum and trust post-production.`]
  ],
  injury:[
   ['A minor injury forces the unit to re-plan',`A principal performer is temporarily unavailable for the physical material scheduled today.`,`The injury is not serious, but the production has to decide whether to spend around it, rest the unit or change the shooting order.`],
   ['Physical work takes one performer out of today’s plan',`The production can continue, but not with the scenes and setups it intended to capture.`,`The schedule response matters more than the injury itself.`],
   ['The action schedule loses a performer for the day',`A minor injury has removed one principal actor from the planned physical work.`,`The unit now has to trade money, time or efficiency to keep moving.`]
  ]
 };
 const list=variants[e.type];if(!list?.length)return e;
 const v=variationPick(f,key,list),out=deep(e);out.title=v[0];out.text=v[1];out.why=v[2];out.variantId=hash(f.id+'|'+key+'|'+v[0]);return out;
}

function productionRisk(f){
 const s=ensureScriptEcosystem(scriptById(f.scriptId)),d=talentById(f.directorId),cast=f.cast.map(talentById);
 const underfund=Math.max(0,1-f.budget/s.naturalBudget)*35;
 const reliability=100-cast.reduce((a,b)=>a+b.reliability,0)/cast.length;
 return clamp(s.difficulty*.36+underfund+(d.budgetControl<65?8:0)+reliability*.14+(100-f.metrics.stability)*.24,0,100);
}
function weightedProductionPick(pool,r){
 const total=pool.reduce((a,e)=>a+Math.max(.1,e.weight||1),0);let x=r()*total;
 for(const e of pool){x-=Math.max(.1,e.weight||1);if(x<=0)return e}
 return pool.at(-1);
}
function buildProductionEvents(f,r){
 const s=ensureScriptEcosystem(scriptById(f.scriptId)),d=talentById(f.directorId),cast=f.cast.map(talentById),c=f.creative||defaultCreative();
 const avgRel=cast.reduce((a,b)=>a+b.reliability,0)/cast.length,avgStar=cast.reduce((a,b)=>a+b.star,0)/cast.length,ratio=f.budget/s.naturalBudget;
 const pool=[];
 const add=(e)=>pool.push(e);
 add({type:'location',weight:1.0+s.difficulty/90,title:'Location access problem',text:'A key location has become unavailable at short notice.',why:'Location-heavy material and schedule pressure have collided.',choices:[
  ['relocate','Relocate and redesign · $0.5m'],['holdlocation','Hold for the location · $0.8m + 1 week'],['compresslocation','Compress the sequence']]});
 add({type:'weather',weight:.7+s.difficulty/120,title:'Weather closes the set',text:'Conditions have wiped out a planned exterior day.',why:'Exterior work always carries exposure, but this project has little slack.',choices:[
  ['coverweather','Move to coverage · $0.35m'],['waitweather','Wait for conditions · $0.7m + 1 week'],['rushweather','Rush the remaining exterior work']]});
 if(f.genre.includes('Action')||s.difficulty>72)add({type:'stunt',weight:1.4,title:'Stunt design hits a limit',text:'The stunt team believes the planned sequence is too aggressive for the remaining time and resources.',why:'The film’s physical ambition is pressing against schedule and safety margins.',choices:[
  ['restunt','Redesign safely · $0.55m'],['stuntday','Add a stunt day · $0.95m + 1 week'],['cutstunt','Cut the most ambitious beat']]});
 if(f.genre.includes('Science')||f.genre.includes('Fantasy')||c.emphasis==='spectacle')add({type:'vfx',weight:1.5,title:'Effects plan is not holding up',text:'Pre-visualisation shows an effects-heavy sequence will not reach the intended standard.',why:'The film is asking more of its technical plan than the current allocation comfortably supports.',choices:[
  ['vfxmoney','Increase the effects allocation · $1.25m'],['vfxpractical','Redesign around practical elements'],['vfxaccept','Accept the current plan']]});
 if(avgRel<75||f.packageFit?.average<63)add({type:'rehearsal',weight:1.25,title:'A performance is not settling',text:'One of the principal performances is inconsistent in the dailies and the schedule offers little rehearsal time.',why:'Preparation, role fit and schedule pressure are combining.',choices:[
  ['rehearse','Pause for rehearsal · $0.35m'],['reshuffle','Reshuffle the schedule · $0.55m'],['pushperformance','Keep shooting']]});
 if(avgStar>78)add({type:'star',weight:.75,title:'Star requests a change',text:'A principal actor wants a scene reworked around their character before it shoots.',why:'The project carries enough star leverage for creative requests to reach the studio.',choices:[
  ['indulgestar','Approve the rewrite · $0.3m'],['negotiate','Let the director negotiate'],['refusestar','Hold the existing scene']]});
 if(d.commercial<65||f.packageFit?.director<58)add({type:'director',weight:1.15,title:'Director challenges the brief',text:'The director wants to take a major sequence further away from the studio’s stated positioning.',why:'The director’s instincts and the project brief are not perfectly aligned.',choices:[
  ['trustdirector','Trust the director'],['directorcompromise','Find a compromise'],['enforcebrief','Enforce the studio brief']]});
 if(f.metrics.chemistry>78)add({type:'chemistry',weight:1.15,title:'Unexpected chemistry in the dailies',text:'The leads are producing something stronger together than the screenplay predicted.',why:'A genuine on-screen relationship has emerged during production.',choices:[
  ['expandchemistry','Expand their material · $0.45m'],['smallchemistry','Add a few beats'],['keepchemistry','Stay on script']]});
 if(f.metrics.stability>80)add({type:'opportunity',weight:1.05,title:'The shoot gets ahead',text:'The production has unexpectedly created a little time and budget flexibility.',why:'A stable package and disciplined set have created an opportunity rather than a problem.',choices:[
  ['coverageop','Shoot extra coverage · $0.35m'],['bankop','Bank part of the saving'],['creativeop','Give the director a creative day · $0.65m']]});
 if(d.budgetControl<72||ratio<.9)add({type:'overrun',weight:1.4,title:'Contingency is disappearing',text:'The line producer warns that the current approach is burning through contingency faster than planned.',why:'Budget control and the production’s ambition are out of balance.',choices:[
  ['resourceoverrun','Protect the plan · $1.0m'],['simplifyoverrun','Simplify upcoming setups'],['ignoreoverrun','Hold the line']]});
 if(f.metrics.performances>84)add({type:'breakout',weight:.7,title:'A supporting performance breaks out',text:'A supporting player is stealing scenes and the director wants to give the role more space.',why:'The footage has revealed an opportunity nobody could confidently predict in development.',choices:[
  ['expandbreakout','Expand the role · $0.4m'],['keepbreakout','Keep the existing balance'],['trimbreakout','Protect the leads']]});
 if(s.structure<60||f.metrics.clarity<60)add({type:'story',weight:1.2,title:'A story problem is visible on set',text:'As the footage assembles, a transition that worked on the page is proving unclear on screen.',why:'The screenplay’s structural risk is becoming concrete during production.',choices:[
  ['pickupstory','Shoot connective material · $0.6m'],['restagestory','Restage the transition'],['deferstory','Leave it for the edit']]});
 if((f.genre.includes('Action')||s.difficulty>80)&&r()<.36)add({type:'injury',weight:.35,title:'Minor injury disrupts the schedule',text:'A principal performer cannot complete today’s planned work.',why:'Physical production carries a small but real injury risk.',choices:[
  ['injurycover','Shoot around the performer · $0.35m'],['injuryrest','Give the unit a recovery day · $0.75m + 1 week'],['injurypush','Push lighter material through']]});

 const risk=clamp((s.difficulty*.34)+(100-f.metrics.stability)*.32+Math.max(0,.92-ratio)*48+(100-avgRel)*.12,0,100);
 let count=risk>72?3:risk>52?2:risk>31?1:0;
 if(f.metrics.stability>88&&risk<42&&r()<.60)count=0;
 else if(count===0&&r()<.28)count=1;
 const weeks=[];for(let w=2;w<Math.max(3,f.productionEnd-f.productionStart);w++)weeks.push(w);
 for(let i=weeks.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[weeks[i],weeks[j]]=[weeks[j],weeks[i]]}
 const used=new Set(),events=[];
 for(let i=0;i<count&&i<weeks.length&&pool.length;i++){
  let e=weightedProductionPick(pool.filter(x=>!used.has(x.type)),r);if(!e)break;
  used.add(e.type);e=productionEventFlavor(f,e);events.push({id:uid('event',state),week:weeks[i],...deep(e),resolved:false,choice:null})
 }
 events.forEach(e=>{if(f.directorAuthority?.producerCredit&&e.type==='director'){const vr=makeRng(hash(state.seed+'|producer-veto|'+f.id+'|'+e.id));if(vr()<.58){e.lockedChoices=['enforcebrief'];e.authorityNote=`${d.name}'s producer credit gives the director final authority on this creative call.`}}});return events.sort((a,b)=>a.week-b.week);
}
// v3.10 — The Film Story: one authored creative-direction fork per production.
// This is deliberately not a crisis or spend decision. The dailies discover a version
// of the film, and the studio chooses which version to pursue.

function productionCreativeForkSpec(f){
 const d=talentById(f.directorId),lead=talentById(f.cast?.[0]),m=f.metrics||{},genre=f.genre||'',name=d?.name||'The director',star=lead?.name||'The lead',id=ensureFilmIdentity(f);
 const characterLed=(m.chemistry||0)>=76||(m.performances||0)>=82||id.engine==='performance'||id.engine==='chemistry';
 const imageLed=(genre.includes('Action')||genre.includes('Science')||genre==='Fantasy')&&((m.technical||0)>=70||f.creative?.emphasis==='spectacle');
 const uneasy=genre==='Psychological Horror'||genre==='Crime Thriller';
 if(genre==='Comedy'){
  return {
   title:variationPick(f,'fork-comedy-title',['The film is funnier when it stops chasing the plot','The dailies have found a different comic rhythm','The actors are making the pauses as important as the jokes']),
   text:`${name} thinks the strongest comedy is coming from behaviour and timing rather than the scripted punch lines. ${star} is especially good when scenes are allowed to run a little messier.`,
   why:'Production has found two viable comedies: a tighter joke-and-plot machine, or a looser character version with more room for discovery.',
   choices:{
    loosecomedy:{label:'Follow the comic behaviour',outcome:'The film becomes looser, stranger and more character-driven, accepting a little less plot velocity in exchange for personality.',impact:{performances:3,chemistry:3,direction:2,pacing:-2},segmentBias:{'Younger audiences':3,'Prestige / arthouse':2,'Mainstream adults':-1}},
    tightcomedy:{label:'Protect the comic engine',outcome:'The production keeps scenes shorter and jokes closer to the story spine, preserving pace and broad accessibility.',impact:{pacing:4,clarity:3,performances:-1},segmentBias:{'Mainstream adults':4,'Families':2,'Prestige / arthouse':-2}}
   }
  };
 }
 if(genre==='Family Adventure'){
  return {
   title:variationPick(f,'fork-family-title',['The adventure is becoming more sincere than expected','The childlike wonder is working','The film has found its heart in the quieter material']),
   text:`The dailies suggest ${f.title} works best when the adventure feels genuinely wondrous rather than relentlessly busy. ${name} wants to decide whether to lean into that sincerity or keep the film moving as a clean crowd-pleaser.`,
   why:'Either direction can reach families, but one prioritises emotional memory while the other protects pace and spectacle.',
   choices:{
    wonder:{label:'Lean into the wonder',outcome:'The film gives its emotional and discovery beats more space, becoming warmer and more earnest.',impact:{performances:2,direction:3,chemistry:2,pacing:-1},segmentBias:{'Families':5,'Mainstream adults':2,'Younger audiences':1}},
    adventure:{label:'Keep the adventure moving',outcome:'The remaining shoot protects momentum, jokes and forward motion over additional reflective beats.',impact:{pacing:4,technical:2,clarity:2},segmentBias:{'Younger audiences':4,'Families':3,'Prestige / arthouse':-2}}
   }
  };
 }
 if(characterLed){
  return {
   title:variationPick(f,'fork-character-title',['The performances are changing the centre of the film','The actors have found a more intimate movie','The dailies keep pulling attention back to the people']),
   text:`The footage has produced a more human, observational version of the material than the screenplay suggested. ${star} is carrying quieter beats particularly well, and ${name} thinks the film may be better if it follows them.`,
   why:`Nothing has gone wrong. The question is whether to follow the ${id.texture} performance film production has discovered or protect the shape originally greenlit.`,
   choices:{
    followperformances:{label:'Follow what the actors found',outcome:'The film becomes more intimate and performance-led, giving emotional beats more room even if the pace loosens.',impact:{performances:4,chemistry:3,direction:2,pacing:-2},segmentBias:{'Prestige / arthouse':5,'Mainstream adults':-1,'Genre fans':-1}},
    protectengine:{label:'Protect the original engine',outcome:'The film stays tighter and more plot-forward, preserving momentum rather than rebuilding around the performances.',impact:{pacing:4,clarity:2,performances:-1},segmentBias:{'Mainstream adults':3,'Genre fans':3,'Prestige / arthouse':-2}}
   }
  };
 }
 if(imageLed){
  return {
   title:variationPick(f,'fork-image-title',['The visual language is becoming the film','The images are getting ahead of the screenplay','Production has found a bigger cinematic vocabulary']),
   text:`${name} has found a bolder ${id.texture} visual approach in the dailies. The strongest material is larger and more image-driven than the original brief, but leaning into it will make the film less literal and less restrained.`,
   why:'The footage has created a genuine creative opportunity: push the cinematic identity, or keep the story doing the heavy lifting.',
   choices:{
    pushimagery:{label:'Push the visual language',outcome:'The film commits to scale, imagery and cinematic texture, accepting a little less narrative directness.',impact:{technical:4,direction:3,clarity:-2},segmentBias:{'Younger audiences':4,'Genre fans':5,'Mainstream adults':-1}},
    storyfirst:{label:'Keep the story in front',outcome:'The production pulls the imagery back toward the original brief and prioritises clean storytelling over visual escalation.',impact:{clarity:4,pacing:2,technical:-1},segmentBias:{'Mainstream adults':4,'Families':2,'Genre fans':-2}}
   }
  };
 }
 if(uneasy){
  return {
   title:variationPick(f,'fork-uneasy-title',['The film is playing stranger than expected','The ambiguity is becoming the point','The footage is refusing to explain itself']),
   text:`The assembled footage is more ${id.texture} and ambiguous than the script read on the page. ${name} believes the uncertainty is working; the alternative is to make motives and cause-and-effect more explicit while the unit can still shape them.`,
   why:'This is a tone decision, not a repair. Either version can work, but they are different films.',
   choices:{
    embraceambiguity:{label:'Embrace the ambiguity',outcome:'The film becomes stranger and less explanatory, sharpening atmosphere while asking more from the audience.',impact:{direction:4,performances:2,clarity:-3},segmentBias:{'Genre fans':5,'Prestige / arthouse':4,'Mainstream adults':-3,'Families':-4}},
    clarifyintent:{label:'Make the film more explicit',outcome:'The production protects clarity and forward motion, trading some unease for a more accessible read.',impact:{clarity:5,pacing:2,direction:-1},segmentBias:{'Mainstream adults':4,'Families':2,'Genre fans':-2,'Prestige / arthouse':-1}}
   }
  };
 }
 if(id.engine==='momentum'||genre==='Action Thriller'){
  return {
   title:variationPick(f,'fork-momentum-title',['The movie wants to move faster than the script','The action is becoming cleaner and meaner','The dailies have found a ruthless pace']),
   text:`The best footage is direct, physical and unusually lean. ${name} thinks the remaining shoot can either commit to that velocity or restore some of the character and explanation the original screenplay carried.`,
   why:'The question is how much texture to trade for momentum now that production knows speed is one of the film’s strengths.',
   choices:{
    accelerate:{label:'Make it leaner and faster',outcome:'The film strips connective material back and commits to momentum, action and clean dramatic movement.',impact:{pacing:5,technical:2,clarity:-1,performances:-1},segmentBias:{'Younger audiences':4,'Genre fans':4,'Mainstream adults':2}},
    restoretexture:{label:'Keep the character texture',outcome:'The film preserves more explanation and human detail, accepting a slightly slower engine in return.',impact:{performances:3,clarity:3,pacing:-2},segmentBias:{'Mainstream adults':3,'Prestige / arthouse':2,'Genre fans':-1}}
   }
  };
 }
 return {
  title:variationPick(f,'fork-default-title',['The dailies have found a different rhythm','Production has discovered a more specific version of the movie','The footage is asking for a choice the screenplay could not make']),
  text:`${name} thinks the film can now go one of two ways: let its ${id.texture} qualities breathe and trust the material that is emerging, or tighten the remaining shoot around the cleaner, more propulsive version originally planned.`,
  why:'This is the moment production stops merely executing the screenplay and decides what kind of finished film the footage is becoming.',
  choices:{
   breathe:{label:'Let the film breathe',outcome:'The shoot gives performances and atmosphere more space, creating a richer but slightly slower version of the film.',impact:{direction:3,performances:3,chemistry:1,pacing:-2},segmentBias:{'Prestige / arthouse':4,'Mainstream adults':-1}},
   sharpen:{label:'Sharpen the film',outcome:'The remaining shoot prioritises pace, clarity and clean dramatic movement over additional texture.',impact:{pacing:4,clarity:3,direction:-1},segmentBias:{'Mainstream adults':4,'Younger audiences':2,'Prestige / arthouse':-2}}
  }
 };
}

function ensureProductionCreativeFork(f){
 if(!f||f.owner!=='player'||f.stage!=='production'||!Array.isArray(f.events))return null;
 const existing=f.events.find(e=>e.type==='creativefork');if(existing)return existing;
 const total=Math.max(3,(f.productionEnd||state.week)-(f.productionStart||state.week)),current=Math.max(1,f.productionWeek||1);
 const occupied=new Set(f.events.map(e=>e.week)),ideal=clamp(Math.round(total*.55),2,Math.max(2,total-1)),weeks=[];
 for(let w=Math.max(2,current);w<total;w++)if(!occupied.has(w))weeks.push(w);
 if(!weeks.length)return null;
 weeks.sort((a,b)=>Math.abs(a-ideal)-Math.abs(b-ideal)||a-b);
 const spec=productionCreativeForkSpec(f),event={
  id:uid('event',state),week:weeks[0],type:'creativefork',creativeFork:true,resolved:false,choice:null,
  title:spec.title,text:spec.text,why:spec.why,forkChoices:spec.choices,
  choices:Object.entries(spec.choices).map(([id,x])=>[id,x.label])
 };
 f.events.push(event);f.events.sort((a,b)=>a.week-b.week);return event;
}
function creativeDirectionCard(f,phase='post'){
 const x=f?.creativeDirection;if(!x)return '';
 const line=phase==='marketing'?'The campaign now has to decide how honestly to sell the version of the film production actually made.':'This production decision is already baked into the material arriving in the edit.';
 return `<div class="section-title"><h2>The film production chose</h2><span class="small">A creative decision from the dailies</span></div><div class="card goodline"><div class="badge">PRODUCTION DIRECTION</div><strong style="display:block;margin-top:6px">${x.label}</strong><div class="body" style="margin-top:7px">${x.outcome}</div><div class="small" style="margin-top:8px">${line}</div></div>`;
}

function applyProductionImpact(f,{cost=0,week=0,morale=0,direction=0,performances=0,technical=0,pacing=0,clarity=0,chemistry=0,stability=0,saving=0,note=''}) {
 if(cost>0&&!spend(cost))return false;
 if(cost>0){f.investment+=cost;f.productionState.extraSpend=(f.productionState.extraSpend||0)+cost}
 if(saving>0){earn(saving);f.investment=Math.max(0,f.investment-saving)}
 if(week){
  f.productionEnd+=week;f.productionState.schedule+=(week>0?week:0);
  const ids=[f.directorId,...f.cast];ids.forEach(id=>{const t=talentById(id);if(t)t.busyUntil=Math.max(t.busyUntil||0,f.productionEnd+1)})
 }
 const m=f.metrics;m.direction+=direction;m.performances+=performances;m.technical+=technical;m.pacing+=pacing;m.clarity+=clarity;m.chemistry+=chemistry;m.stability+=stability;
 Object.keys(m).forEach(k=>m[k]=clamp(m[k],20,98));
 f.productionState.morale=clamp((f.productionState.morale||65)+morale,20,98);
 if(note)f.productionState.notes.unshift(note);
 return true;
}
function resolveEvent(f,eventId,choice){
 const e=f.events.find(x=>x.id===eventId);if(!e||e.resolved)return;if(e.lockedChoices?.includes(choice))return showToast('The director has final authority on that choice under the producer-credit agreement.');
 let ok=true,note=e.title;
 const impact=(x)=>{ok=applyProductionImpact(f,{...x,note});return ok};
 if(e.type==='creativefork'){
  const fork=e.forkChoices?.[choice];if(!fork)return showToast('Choose a creative direction.');
  impact(fork.impact||{});e.choiceLabel=fork.label;e.outcome=fork.outcome;
  f.creativeDirection={week:state.week,productionWeek:f.productionWeek,label:fork.label,outcome:fork.outcome,segmentBias:deep(fork.segmentBias||{}),sourceTitle:e.title};
 }
 else if(e.type==='location'){if(choice==='relocate')impact({cost:.5,clarity:1,technical:-1,morale:-1});else if(choice==='holdlocation')impact({cost:.8,week:1,stability:3,morale:-2});else impact({technical:-3,pacing:2,stability:-3})}
 else if(e.type==='weather'){if(choice==='coverweather')impact({cost:.35,clarity:2});else if(choice==='waitweather')impact({cost:.7,week:1,technical:2,stability:2});else impact({technical:-4,stability:-3})}
 else if(e.type==='stunt'){if(choice==='restunt')impact({cost:.55,technical:2,stability:4});else if(choice==='stuntday')impact({cost:.95,week:1,technical:5,stability:4});else impact({technical:-2,pacing:1})}
 else if(e.type==='vfx'){if(choice==='vfxmoney')impact({cost:1.25,technical:6});else if(choice==='vfxpractical')impact({direction:2,technical:2,clarity:1});else impact({technical:-6})}
 else if(e.type==='rehearsal'){if(choice==='rehearse')impact({cost:.35,performances:5,morale:3});else if(choice==='reshuffle')impact({cost:.55,stability:5,performances:2});else impact({performances:-5,stability:-3,morale:-3})}
 else if(e.type==='star'){if(choice==='indulgestar')impact({cost:.3,performances:2,pacing:-1,morale:2});else if(choice==='negotiate')impact({direction:1,performances:1});else impact({performances:-2,morale:-4})}
 else if(e.type==='director'){if(choice==='trustdirector')impact({direction:5,clarity:2,pacing:-1,morale:3});else if(choice==='directorcompromise')impact({direction:2,clarity:1});else impact({direction:-4,pacing:2,morale:-4})}
 else if(e.type==='chemistry'){if(choice==='expandchemistry')impact({cost:.45,performances:5,chemistry:4,pacing:-2});else if(choice==='smallchemistry')impact({performances:3,chemistry:2});else impact({performances:-1})}
 else if(e.type==='opportunity'){if(choice==='coverageop')impact({cost:.35,clarity:3});else if(choice==='bankop')impact({saving:.25,stability:1});else impact({cost:.65,direction:3,performances:2,morale:3})}
 else if(e.type==='overrun'){if(choice==='resourceoverrun')impact({cost:1,stability:5,technical:2});else if(choice==='simplifyoverrun')impact({clarity:2,technical:-2,stability:2});else impact({stability:-6,pacing:-2,morale:-2})}
 else if(e.type==='breakout'){if(choice==='expandbreakout')impact({cost:.4,performances:4,pacing:-2});else if(choice==='keepbreakout')impact({performances:1});else impact({performances:-2,pacing:2})}
 else if(e.type==='story'){if(choice==='pickupstory')impact({cost:.6,clarity:5,pacing:-1});else if(choice==='restagestory')impact({direction:2,clarity:3});else impact({clarity:-2})}
 else if(e.type==='injury'){if(choice==='injurycover')impact({cost:.35,stability:2,clarity:-1});else if(choice==='injuryrest')impact({cost:.75,week:1,stability:5,morale:2});else impact({performances:-2,stability:-2})}
 else if(e.type==='walkoff'){const t=talentById(e.talentId);if(choice==='mediatewalkoff'){impact({cost:.45,morale:2,stability:2});if(t)adjustTalentRelationship(t,1,`${f.title}: studio mediated an on-set dispute`,f.id)}else if(choice==='holdwalkoff')impact({cost:.8,week:1,morale:-1,stability:3});else{impact({direction:f.directorId===e.talentId?-4:-1,performances:(f.cast||[]).includes(e.talentId)?-4:-1,stability:-5,morale:-5});if(t)adjustTalentRelationship(t,-4,`${f.title}: studio took a hard line during an on-set dispute`,f.id)}}
 else if(e.type==='creativefriction'){const t=talentById(e.talentId);if(choice==='creativecompromise'){impact({cost:.3,direction:1,performances:1,stability:2,morale:2});if(t)adjustTalentRelationship(t,1,`${f.title}: creative compromise`,f.id)}else if(choice==='creativerehearse'){impact({cost:.55,week:1,performances:3,chemistry:2,stability:1});if(t)adjustTalentRelationship(t,2,`${f.title}: rehearsal/reset backed the talent`,f.id)}else{impact({direction:-1,performances:-2,stability:-3,morale:-3});if(t)adjustTalentRelationship(t,-3,`${f.title}: studio overruled creative concerns`,f.id)}}
 // v1.8 compatibility
 else if(e.type==='smooth'){if(choice==='coverage')impact({cost:.4,clarity:3});else if(choice==='save')impact({saving:.25});else impact({cost:.7,direction:3,performances:2})}
 else if(e.type==='complex'){if(choice==='extra')impact({cost:1.4,technical:6});else if(choice==='simplify')impact({clarity:3,technical:-2});else impact({technical:-7})}
 else if(e.type==='cast'){if(choice==='rehearse')impact({cost:.3,performances:4});else if(choice==='move')impact({cost:.6,stability:5});else impact({performances:-5,stability:-4})}
 else if(e.type==='creative'){if(choice==='trust')impact({direction:5,clarity:2});else if(choice==='compromise')impact({direction:2});else impact({direction:-5,pacing:2})}
 else if(e.type==='budget'){if(choice==='resources')impact({cost:1.1,stability:5,technical:3});else if(choice==='simplify')impact({clarity:2,technical:-2});else impact({stability:-6,pacing:-3})}
 else if(e.type==='safety'){if(choice==='redesign')impact({cost:.5,technical:2,stability:4});else if(choice==='delay')impact({cost:.9,week:1,technical:4,stability:6});else impact({technical:-2,pacing:1})}
 else if(e.type==='supporting'){if(choice==='expandrole')impact({cost:.4,performances:4,pacing:-2});else if(choice==='keeprole')impact({performances:1});else impact({performances:-2,pacing:2})}
 if(!ok)return;
 e.resolved=true;e.choice=choice;f.pendingEvent=null;
 if(e.type==='creativefork'){
  f.history.push(`Week ${state.week}: creative direction — ${e.choiceLabel}. ${e.outcome}`);
  ensureShootJournal(f).push({week:state.week,productionWeek:f.productionWeek,text:`${e.choiceLabel}: ${e.outcome}`,topic:'creativeDirection',mood:'decision'});
 }else{
  f.history.push(`Week ${state.week}: resolved ${e.title}.`);
  ensureShootJournal(f).push({week:state.week,productionWeek:f.productionWeek,text:`${e.title}: ${e.choices.find(x=>x[0]===choice)?.[1]||choice}.`,topic:e.type,mood:'decision'});
 }
 rebuildDecisions();save();render();
}

function commitRelease(f){
 ensureMarketingState(f);
 if(!f.campaign||f.releaseWeek===null)return showToast('Choose a campaign and release week.');
 const allowed=validReleaseWeeks(f);if(!allowed.includes(f.releaseWeek)){f.releaseWeek=null;save();render();return showToast('That date no longer fits the campaign lead time. Choose a valid release week.');}
 ensureDistributionState(f);const plan=distributionPlan(f),ops=plan.opsCost,total=f.marketing+ops+publicityCost(f)+launchCost(f);
 if(!spend(total))return;
 f.releaseOps=ops;f.distributionDeal={...plan,committedWeek:state.week,partnerName:f.distributorName||null};f.investment+=total;f.stage='scheduled';f.campaignStart=state.week;f.campaignStartDay=typeof currentCalendarDay==='function'?currentCalendarDay():null;f.releaseDay=typeof releaseDayForWeek==='function'?releaseDayForWeek(f.releaseWeek):null;
 f.marketingState.committed=true;buildMarketingMilestones(f);recordTrackingSnapshot(f,'Campaign committed');
 f.history.push(`${typeof calendarDateLabel==='function'?calendarDateLabel():'Week '+state.week}: ${marketingLeadInfo(f).tier} committed for ${f.releaseDay&&typeof calendarDateLabel==='function'?calendarDateLabel(f.releaseDay):'Week '+f.releaseWeek}.`);
 addNews(state,f.distributionStrategy==='partner'?`${state.studio.name} has partnered with ${f.distributorName||distributionPartnerName(f)} to release ${f.title} in Week ${f.releaseWeek}.`:f.distributionStrategy==='platform'?`${state.studio.name} will open ${f.title} on a platform rollout in Week ${f.releaseWeek}, expanding if early response supports it.`:`${state.studio.name} will self-distribute ${f.title} in Week ${f.releaseWeek}, retaining the theatrical upside while carrying the full release operation.`,'Press Release');
 maybeRivalReleaseResponse(f);rebuildDecisions();save();render();
}
function releaseFilm(f){
 const s=scriptById(f.scriptId),d=talentById(f.directorId),cast=f.cast.map(talentById),m=f.metrics,r=makeRng(hash(state.seed+'|release|'+f.id)),c=f.creative||defaultCreative();
 const dFit=f.packageFit?.director??directorProjectFit(d,f),aFits=f.packageFit?.actors??cast.map(a=>actorProjectFit(a,f)),fitAvg=(aFits[0]+aFits[1])/2;
 ensureScriptEcosystem(s);
 const postEnding=f.post?.endingStrength??clamp((s.emotion+s.structure+m.clarity)/3,30,95),runtime=f.post?.runtime??f.post?.targetRuntime??105,targetRuntime=f.post?.targetRuntime??runtime;
 const runtimePenalty=Math.max(0,Math.abs(runtime-targetRuntime)-8)*.16;
 const quality=clamp(s.story*.08+s.structure*.055+s.characters*.055+s.emotion*.035+s.originality*.065+m.direction*.155+m.performances*.20+m.technical*.095+m.pacing*.095+m.clarity*.105+postEnding*.035-runtimePenalty,18,97);
 let criticBias=(c.positioning==='prestige'?3:c.positioning==='commercial'?-1:0)+(c.tone==='grounded'?1:0)+(dFit<48?-3:0);
 let audienceBias=(c.positioning==='commercial'?3:c.positioning==='prestige'?-2:0)+(fitAvg<48?-4:fitAvg>82?2:0);
 if(c.rating==='broad')audienceBias+=3;
 if(c.rating==='mature'){audienceBias-=3;if(f.genre.includes('Horror')||f.genre.includes('Crime')||f.genre.includes('Drama'))audienceBias+=4}
 if(c.emphasis==='spectacle'&&(f.genre.includes('Action')||f.genre.includes('Science')||f.genre.includes('Fantasy')))audienceBias+=2;
 const music=soundtrackReleaseModifiers(f);
 let critics=clamp(quality*.75+s.originality*.15+s.story*.10+criticBias+studioIdentityCriticLift(f)+music.critics+(r()-.5)*12,14,98);
 let audience=clamp(m.performances*.17+m.pacing*.13+m.clarity*.12+s.access*.12+s.hook*.105+s.genreFulfillment*.105+s.emotion*.07+m.direction*.105+postEnding*.055+audienceBias+music.audience-runtimePenalty*.7+(r()-.5)*12,16,97);
 const publicCampaign=ensureMarketingState(f),pulse=ensureFilmSocial(f);
 const pulseAudience=(pulse.sentiment-50)*.07+(pulse.fandom-40)*.025-pulse.controversy*.035;
 audience=clamp(audience+publicCampaign.sentiment+pulseAudience-campaignExpectationPenalty(f,audience),12,98);
 const audienceContext=audienceReleaseContext(f,audience),franchiseContext=franchiseReleaseContext(f);audience=clamp(audience-franchiseContext.audiencePenalty,10,98);f.audienceSegments=audienceContext.segments;registerMarketRelease(f);
 const rawStar=cast.reduce((a,b)=>a+b.star,0)/cast.length,momentum=cast.reduce((a,b)=>a+b.momentum,0)/cast.length;
 const effectiveStar=rawStar*clamp(.67+fitAvg/210,.72,1.10);
 const rec=marketingRecommended(f),mEff=Math.log1p(f.marketing)/Math.log1p(rec);
 let awareness=1+effectiveStar*.064+momentum*.026+s.hook*.064+mEff*31+(c.positioning==='commercial'?3:c.positioning==='prestige'?-2:0)+(c.rating==='broad'?2:c.rating==='mature'?-1:0);
 const campaignStrength=clamp(f.marketing/Math.max(1,rec),0,1.25);
 if(f.campaign==='event')awareness+=5*Math.min(1,campaignStrength);
 if(f.campaign==='mystery')awareness+=(1+(r()-.5)*5)*Math.min(1,campaignStrength+.15);
 awareness+=publicCampaign.buzz+pulse.volume*.075+pulse.controversy*.025+audienceContext.openingLift+franchiseContext.awarenessLift+studioIdentityAwarenessLift(f)+distributionAwarenessLift(f)+music.awareness;
 const competitorPressure=boxPressureForWeek(f.releaseWeek,f.genre,f.id)*distributionPressureMultiplier(f);
 const ratio=f.budget/s.naturalBudget,scale=.72+Math.sqrt(Math.max(.48,ratio))*.27;
 let opening=clamp((awareness*.34+s.hook*.08+effectiveStar*.028-9.6)*scale*(1-competitorPressure)*(1+releaseWindowOpeningModifier(f))*distributionOpeningMultiplier(f),.08,88);
 const intlMult=f.genre.includes('Action')||f.genre.includes('Science')||f.genre.includes('Fantasy')?1.38:f.genre.includes('Horror')?1.0:f.genre.includes('Family')?1.13:.72;
 const releaseProfile=releaseOutcomeProfile(f,audience,awareness,r);releaseProfile.legsBias+=distributionLegsBias(f)+music.legs+clamp((pulse.sentiment-50)*.0018+(pulse.fandom-40)*.0012-pulse.controversy*.0014,-.10,.10);const run=buildTheatricalRun(f,opening,audience,audienceContext,r,intlMult,releaseProfile);
 f.releaseProfile=run.profile;
 f.review=makeReview(f,Math.round(critics),Math.round(audience));
 f.pressReviews=makeReviewRoundup(f,Math.round(critics),Math.round(audience));
 f.weeklyPlan=run.plan;ensureTheatricalRunState(f);
 f.weeklyResults=[];f.cinemaWeek=0;f.stage='cinema';addCinemaWeek(f);
 notify(`release:${f.id}`,`${f.title} opens today`,`Reviews and audience reaction are public. The domestic chart and final weekend grosses settle Sunday night.`,f.id,false,'info');
}
function reviewStars(score){return clamp(Math.round((score/20)*2)/2,.5,5)}
function scriptFocus(s){
 const q=s.logline.toLowerCase();
 if(q.includes('lighthouse'))return 'its isolated lighthouse, the impossible radio messages and the grief beneath the supernatural mystery';
 if(q.includes('getaway driver'))return 'the uneasy driver-witness relationship and the pressure of the cross-country chase';
 if(q.includes('estranged siblings'))return 'the sibling relationships and the emotional history embedded in the family home';
 if(q.includes('memory architect'))return 'the stolen-memory premise and the moral cost of the supposedly perfect city';
 if(q.includes('missing-child'))return 'the missing-child mystery and the town’s fractured memories';
 if(q.includes('wedding planners'))return 'the rivalry between its wedding planners and the escalating destination chaos';
 if(q.includes('abandoned railway'))return 'the forgotten railway and the sense of childhood discovery at the centre of the adventure';
 if(q.includes('jury room'))return 'the secret trials hidden inside the courthouse and the paranoia created by that discovery';
 if(q.includes('cartographer'))return 'the mapmaking conceit and the dangerous idea that drawing a place can create it';
 if(q.includes('astronaut'))return 'the impossible connection between its isolated astronauts';
 return `the central idea described by its screenplay — ${s.logline.replace(/\.$/,'').toLowerCase()}`;
}


const DAILY_SCREEN_CRITICS=[
 {id:'beatrice-shaw',name:'Beatrice Shaw',title:'Chief Film Critic',voice:'acid',tag:'Dry, exacting and suspicious of expensive nonsense.'},
 {id:'nia-mercer',name:'Nia Mercer',title:'Genre Editor',voice:'genre',tag:'Loves committed genre filmmaking and has no patience for timid versions of it.'},
 {id:'julian-cross',name:'Julian Cross',title:'Senior Critic',voice:'cinephile',tag:'Earnest about cinema, occasionally to an almost comic degree.'},
 {id:'tom-bell',name:'Tom Bell',title:'Weekend Critic',voice:'crowd',tag:'Measures movies partly by whether anybody would willingly watch them twice.'}
];
function reviewTier(score){return score>=92?'rave':score>=82?'great':score>=70?'good':score>=55?'mixed':score>=40?'poor':'disaster'}
function dailyScreenCritic(f){
 const genre=f.genre||scriptById(f.scriptId)?.genre||'';
 let pool=DAILY_SCREEN_CRITICS;
 if(/Horror|Science Fiction|Fantasy|Action/.test(genre))pool=[DAILY_SCREEN_CRITICS[1],DAILY_SCREEN_CRITICS[0],DAILY_SCREEN_CRITICS[3]];
 else if(/Prestige|Crime/.test(genre))pool=[DAILY_SCREEN_CRITICS[2],DAILY_SCREEN_CRITICS[0],DAILY_SCREEN_CRITICS[1]];
 else if(/Comedy|Family/.test(genre))pool=[DAILY_SCREEN_CRITICS[3],DAILY_SCREEN_CRITICS[0],DAILY_SCREEN_CRITICS[1]];
 const r=makeRng(hash((state.seed||1)+'|daily-screen-critic-v3142|'+f.id));return pool[Math.floor(r()*pool.length)]||pool[0];
}
function criticOpeningParagraph(f,tier,critic){
 const sc=scriptById(f.scriptId),id=ensureFilmIdentity(f),p=premiseReviewContext(sc),subject=p?.name||sc.title,genre=(f.genre||sc.genre||'film').toLowerCase();
 const pools={
  acid:{
   rave:[`${sc.title} is the irritating sort of film that makes a difficult job look easy. It takes a premise with every opportunity to become expensive nonsense and instead turns ${subject} into the centre of a genuinely ${id.texture} movie.`,`There are films that announce their intelligence every six minutes. ${sc.title} has the better idea: it simply behaves as though the audience has some.`],
   great:[`${sc.title} has money, machinery and several opportunities to embarrass itself. Happily, most of them are declined. What remains is a ${id.texture} ${genre} with an actual pulse.`,`The nicest surprise in ${sc.title} is that someone appears to have asked what the movie is about before asking how large the trailer moment should be.`],
   good:[`${sc.title} is too lively to dismiss and too uneven to canonise. That may not fit comfortably on a poster, but it is considerably more interesting than competence.`,`For long stretches, ${sc.title} remembers that a hook is not the same thing as a movie. When it forgets, you can almost hear the marketing department clearing its throat.`],
   mixed:[`${sc.title} keeps threatening to become the sharper film hiding inside it, then gets distracted by something louder, safer or more expensive.`,`There is a good film in ${sc.title}. Unfortunately, it appears to be sharing a dressing room with two less interesting ones.`],
   poor:[`${sc.title} has a premise, a budget and what appears to be a deep personal objection to putting either to sensible use.`,`The frustrating part of ${sc.title} is that the better film is visible throughout, waving from behind the one that actually reached cinemas.`],
   disaster:[`${sc.title} is less a finished film than a very expensive sequence of decisions nobody managed to stop.`,`At some point during ${sc.title}, the question stops being “will this improve?” and becomes “who had the authority to say no?”`]
  },
  genre:{
   rave:[`${sc.title} understands the first rule of genre filmmaking: if you are going to be ridiculous, frightening, enormous or all three, commit. It commits.`,`This is genre cinema with the good manners to know exactly what kind of movie it is and the bad manners to enjoy itself enormously.`],
   great:[`${sc.title} takes its genre seriously without treating fun as an embarrassing side effect. The result is a ${id.texture} movie with teeth.`,`The film knows when to explain the rules, when to break them and, crucially, when to stop talking and let the movie happen.`],
   good:[`${sc.title} gets more right than wrong, particularly whenever it trusts the pleasures of its own genre instead of apologising for them.`,`There is proper movie energy here: not always elegant, occasionally overcooked, but rarely embarrassed to be a ${genre}.`],
   mixed:[`${sc.title} has all the ingredients for a better genre movie and spends much of its running time arranging them instead of cooking with them.`,`Every time ${sc.title} starts having fun, somebody seems to arrive with a note about restraint.`],
   poor:[`${sc.title} treats genre like a checklist: threat, chase, reveal, noise. What it forgets is the bit where any of those things become exciting.`,`A ${genre} should not feel this embarrassed by its own pulse.`],
   disaster:[`${sc.title} manages the rare trick of making chaos feel administratively organised.`,`The monsters, conspiracies, explosions or nightmares are not the scariest thing here. The edit is.`]
  },
  cinephile:{
   rave:[`${sc.title} is a reminder that studio filmmaking and authorship are not natural enemies. Its ${id.texture} surfaces, performances and rhythms all appear to belong to the same thought.`,`There is a point in ${sc.title} where the premise stops feeling engineered and starts feeling inevitable. Very few studio films get there.`],
   great:[`${sc.title} is not flawless, which is fortunate because perfection would be considerably less interesting. It is, however, specific — visually, emotionally and rhythmically.`,`What distinguishes ${sc.title} is not polish but intention. Even its excesses feel chosen.`],
   good:[`${sc.title} is the work of people making choices rather than merely executing material. Not every choice survives, but the film is alive because they are there.`,`There is more cinema in the best twenty minutes of ${sc.title} than in several technically cleaner films put together.`],
   mixed:[`${sc.title} contains moments of genuine authorship stranded inside a film that keeps retreating toward consensus.`,`The movie's problem is not lack of ideas. It is that too many of them appear to have final cut.`],
   poor:[`${sc.title} gestures toward a point of view without ever accepting the inconvenience of having one.`,`The film keeps reaching for significance, often with both hands, and somehow comes back holding production design.`],
   disaster:[`${sc.title} is what happens when intention becomes indistinguishable from indecision.`,`One hesitates to call ${sc.title} empty; it is crowded with evidence of things that might once have meant something.`]
  },
  crowd:{
   rave:[`${sc.title} is two hours of somebody remembering why people go to the cinema. That sounds obvious. Judging by the competition, it apparently is not.`,`You can analyse ${sc.title} all you like; the simpler truth is that it is a terrific night out and knows it.`],
   great:[`${sc.title} is big, confident and — a word some prestige departments may need explained — entertaining.`,`The film gives you characters to like, scenes to remember and remarkably little time to check your phone.`],
   good:[`${sc.title} has rough edges, but it also has the decency to keep moving and the charm to make most of them forgivable.`,`Not everything works. Enough does, and more importantly, enough is fun.`],
   mixed:[`${sc.title} is the cinematic equivalent of a meal where the starter is excellent, the main course arrives forty minutes late and dessert explodes.`,`There is a decent night out somewhere in ${sc.title}; you just have to sit through the committee meeting in the middle.`],
   poor:[`${sc.title} is long enough to make you wonder whether the villains have a point about ending things early.`,`The film contains several good reasons to buy popcorn and fewer good reasons to stop looking at it.`],
   disaster:[`${sc.title} earns one star for arriving at the cinema and another half-star for eventually leaving it.`,`${sc.title} is the sort of film that makes the exit sign feel like supporting cast.`]
  }
 };
 return variationPick(f,'critic-open-'+critic.id+'-'+tier,pools[critic.voice][tier]);
}
function criticPremiseParagraph(f,tier,critic){
 const sc=scriptById(f.scriptId),p=premiseReviewContext(sc);
 if(!p)return premiseReviewParagraph(f,tier);
 const positive=['rave','great','good'].includes(tier),name=p.name,role=p.role,goal=p.goal,pressure=p.pressure,comp=p.complication,setting=p.setting;
 const pools=positive?[
  `${name}, the ${role} at the centre of all this, has a pleasingly concrete problem: ${goal}. That would be enough plot for most films. ${sc.title} improves matters by letting ${pressure}, while the fact that ${comp} keeps the machinery personal rather than merely busy.`,
  `The premise has been built with more care than the trailer hook suggests. Put ${name}, a ${role}, in ${setting}; make them ${goal}; then let ${pressure}. The useful ingredient is ${comp}, because it means the problem cannot be solved by competence alone.`,
  `${setting} gives the story a strong pressure chamber, but ${name} is what keeps it from becoming tourism with jeopardy. As a ${role}, they must ${goal}; ${pressure}; and ${comp}. The film understands that the last part is the one an audience remembers.`
 ]:[
  `On paper, ${name} is an excellent engine for a movie: a ${role} who must ${goal} in ${setting} while ${pressure}. The film's mistake is treating ${comp} like backstory when it should be the knife.`,
  `There is nothing wrong with the setup. ${name} needs to ${goal}; ${pressure}; and ${comp}. The problem is that ${sc.title} keeps converting specific dramatic pressure into generic movie activity.`,
  `${setting} ought to trap ${name} inside a very particular problem. Instead, the film too often lets ${pressure} become noise, while ${comp} is periodically wheeled back on screen to remind us why we were supposed to care.`
 ];
 let line=variationPick(f,'critic-premise-'+critic.id+'-'+tier,pools);
 if(critic.voice==='acid'&&tier==='disaster')line+=` It is difficult to lose a premise this specific, but ${sc.title} approaches the challenge with admirable determination.`;
 if(critic.voice==='crowd'&&positive)line+=` Better still, you can explain all of that to someone in a pub without needing a whiteboard.`;
 if(critic.voice==='cinephile'&&positive)line+=` Plot, for once, becomes character under pressure rather than simply incident.`;
 return line;
}
function criticCraftParagraph(f,tier,critic){
 const id=ensureFilmIdentity(f),m=f.metrics||{},lead=packageActors(f)[0],director=talentById(f.directorId),strong=id.strength,risk=id.risk,good=['rave','great','good'].includes(tier);
 const names={performances:lead?.name||'the cast',direction:director?.name||'the director','technical craft':'the craft team',pacing:'the edit','story clarity':'the screenplay','lead chemistry':lead?.name||'the leads'};
 const hero=names[strong]||strong,weak=names[risk]||risk;
 const strongPools={
  performances:[`${hero} does the invaluable work of making plot sound like something a human being might actually say.`,`The acting is where the film breathes. ${hero} can sell a look the screenplay spends half a page explaining.`],
  direction:[`${hero} keeps the film on one tonal planet, which is more difficult than the production makes it look.`,`The direction has confidence without constantly pointing at itself in the mirror.`],
  'technical craft':[`The craft is doing more than showing off the budget. Image, sound and design actually tell the same story.`,`Most of the money appears to have made it onto the screen, a sentence shareholders may wish to frame.`],
  pacing:[`The edit has the rare courage to leave a scene after it has worked.`,`The film moves like it has somewhere to be, which immediately puts it ahead of half the release calendar.`],
  'story clarity':[`The screenplay can explain a complicated idea without making the audience feel as though they have accidentally joined a briefing.`,`Clarity is not glamourous, but ${f.title} makes a persuasive case for knowing what is happening.`],
  'lead chemistry':[`The leads have the kind of chemistry that makes functional dialogue look suspiciously like writing.`,`Whenever the central pair share the frame, the movie gains about twenty percent more electricity.`]
 };
 const riskPools={
  performances:[`${weak} is less convincing when the film asks for emotional weight; several scenes arrive wearing importance rather than earning it.`,`The performances do not always appear to have agreed which film they are in.`],
  direction:[`The direction occasionally loses control of the joins. Individual scenes work, then meet each other like strangers at a bus stop.`,`The film has a visual grammar until, without warning, it starts conjugating in somebody else's tense.`],
  'technical craft':[`The seams show whenever the film reaches for scale. One sequence in particular has the unmistakable sheen of “we'll fix it in post” reaching release day intact.`,`Some effects shots appear to have survived quality control by avoiding eye contact.`],
  pacing:[`The middle act does not so much slow down as apply for permanent residency.`,`There is a stretch where urgency takes a lunch break and neglects to tell the film.`],
  'story clarity':[`The plot occasionally mistakes confusion for mystery, which is rather like mistaking a locked door for architecture.`,`Several revelations land with the emotional force of finding the page you accidentally skipped twenty minutes earlier.`],
  'lead chemistry':[`The leads are individually capable and collectively reminiscent of two very good interviews conducted in adjacent rooms.`,`The central relationship generates less heat than several pieces of production equipment.`
  ]
 };
 let line=variationPick(f,'critic-strength-'+critic.id+'-'+strong,strongPools[strong]||strongPools.direction);
 if(!good&&risk&&risk!==strong)line+=` ${variationPick(f,'critic-risk-'+critic.id+'-'+risk,riskPools[risk]||riskPools.pacing)}`;
 else if(good&&risk&&risk!==strong&&tier!=='rave')line+=` The weak spot is ${risk}: ${variationPick(f,'critic-risk-soft-'+critic.id+'-'+risk,riskPools[risk]||riskPools.pacing).replace(/^The /,'the ')}`;
 const choice=filmChoiceCallback(f);if(choice)line+=' '+choice;return line;
}
function criticClosingParagraph(f,tier,critic,critics,audience){
 const sc=scriptById(f.scriptId),id=ensureFilmIdentity(f),dir=f.creativeDirection?.label||null,music=f.soundtrack?.committed?soundtrackSummary(f):null;
 const gap=audience-critics;
 const pools={
  rave:[`${sc.title} is not merely good at what it does; it knows what it is doing. That distinction sounds small until you see how many films never make it.`,`If ${sc.title} has a flaw, it is the deeply inconvenient one of making several safer films look cowardly by comparison.`,`A ${id.texture} film, a clear point of view and no detectable interest in apologising for either. More, please.`],
  great:[`${sc.title} misses perfection and gains personality in the process. A fair trade.`,`There are cleaner films this year. There may not be many with more reason to exist.`,`The film leaves a few bruises on itself, but at least they come from swinging.`],
  good:[`${sc.title} is easy to recommend with qualifications, which is still considerably better than being difficult to remember without them.`,`Not a masterpiece. Not remotely a waste of an evening. Hollywood could build a healthy economy in the space between those two things.`,`It has flaws, but they belong to this movie rather than to a template.`],
  mixed:[`${sc.title} is half a very good movie and half the meeting that prevented it.`,`Three stars feels less like a verdict than a ceasefire between the film's best instincts and its safest ones.`,`The frustration is proportional to the potential. Nobody gets this annoyed at a movie with nothing going for it.`],
  poor:[`${sc.title} is not boring enough to hate and not good enough to defend. A cruel place for any film to live.`,`Somewhere inside this production is the movie everyone thought they were making. It has not yet been located.`,`The credits contain a great many talented people. The film presents this information as a mystery.`],
  disaster:[`One star would be cruel. Two would be dishonest. Fortunately, half-stars exist.`,`There will be worse films made accidentally. ${sc.title} has the unnerving confidence of one that kept making choices.`,`The most suspenseful question is whether the studio will mention this one in next year's retrospective.`]
 };
 let line=variationPick(f,'critic-close-'+critic.id+'-'+tier,pools[tier]);
 if(dir&&['rave','great','good'].includes(tier))line+=` The production decision to “${dir}” is exactly the sort of choice that gives a film fingerprints.`;
 else if(dir&&['poor','disaster'].includes(tier))line+=` The decision to “${dir}” is certainly visible; whether it should have been is another matter.`;
 else if(music&&critic.voice==='crowd')line+=` ${music} at least knows when to turn up and improve the room.`;
 if(Math.abs(gap)>=18)line+=gap>0?` Audiences are likely to be kinder than critics, and for once they may have the more enjoyable argument.`:` Critics may admire this more than ordinary viewers enjoy it — a distinction the box office is under no obligation to respect.`;
 return line;
}
function criticHeadline(f,tier,critic){
 const sc=scriptById(f.scriptId),p=premiseReviewContext(sc),subject=p?.name||f.title;
 const pools={
  acid:{
   rave:['Annoyingly excellent','Someone remembered to make the movie','Expensive, specific and worth it'],
   great:['A blockbuster with a functioning brain','The machinery finally serves the movie','Much better than its budget requires'],
   good:['Good enough to forgive the notes','Personality survives the process','A solid film with visible fingerprints'],
   mixed:['The better movie keeps escaping','Three stars and several unanswered memos','Good instincts, committee damage'],
   poor:['The premise deserved legal representation','A budget in search of supervision','The movie loses an argument with itself'],
   disaster:['An expensive cry for adult supervision','Please locate the person who could say no','The exit sign gives the best performance']
  },
  genre:{
   rave:['This is how you do it','Genre filmmaking with teeth','Big swing, clean hit'],
   great:['Finally, a movie unafraid of being a movie','Commitment beats respectability','The genre delivers'],
   good:['Messy, muscular and mostly worth it','Enough pulse to survive the rough edges','The fun wins on points'],
   mixed:['Too many rules, not enough movie','The good bits keep getting interrupted','Genre by committee'],
   poor:['All ingredients, no appetite','A thriller in theory','The scares/action/fantasy need a pulse'],
   disaster:['Chaos without the useful part','The nightmare is the edit','Even the explosions look tired']
  },
  cinephile:{
   rave:['A studio film with a soul','Form, feeling and a point of view','The rare package that becomes cinema'],
   great:['Specificity wins','A film made of choices','Imperfection with purpose'],
   good:['More interesting than tidy','A point of view with rough edges','The compromises do not win'],
   mixed:['Authorship under negotiation','Two films, one final cut','The idea survives the execution'],
   poor:['Significance without shape','A point of view in quotation marks','Ambition becomes decoration'],
   disaster:['A thesis without a film','Meaning has left the building','All intention, no pulse']
  },
  crowd:{
   rave:['Buy the ticket','A proper night at the movies','Two hours very well spent'],
   great:['Big, fun and actually good','The phone stays in your pocket','This one understands the assignment'],
   good:['Worth the popcorn','Rough edges, good time','More fun than perfect'],
   mixed:['Great trailer, complicated evening','Half a good night out','The middle needs an intermission'],
   poor:['The popcorn deserved better','Longer than the villain’s plan','A good premise serving a sentence'],
   disaster:['The exit sign steals the show','One star for eventually ending','A feature-length queue for nothing']
  }
 };
 return variationPick(f,'critic-headline-'+critic.id+'-'+tier,pools[critic.voice][tier]);
}
function makeReview(f,critics,audience){
 const sc=scriptById(f.scriptId),c=f.creative||defaultCreative(),id=ensureFilmIdentity(f),stars=reviewStars(critics),tier=reviewTier(critics),critic=dailyScreenCritic(f);
 const paragraphs=[
  criticOpeningParagraph(f,tier,critic),
  criticPremiseParagraph(f,tier,critic),
  criticCraftParagraph(f,tier,critic),
  criticClosingParagraph(f,tier,critic,critics,audience)
 ];
 const headline=criticHeadline(f,tier,critic),quote=paragraphs[0];
 return {publication:'The Daily Screen',critic:deep(critic),critics,audience,stars,headline,quote,paragraphs,filmIdentity:deep(id),sourceContext:{title:sc.title,genre:sc.genre,logline:sc.logline,creative:deep(c)}};
}
function capsuleOutletLine(f,o,tier,score,idx){
 const sc=scriptById(f.scriptId),id=ensureFilmIdentity(f),p=premiseReviewContext(sc),subject=p?.name||f.title,lead=packageActors(f)[0],moneyLine=money(f.investment||f.budget||0),genre=(f.genre||sc.genre||'film').toLowerCase();
 const pools={
  industry:{
   rave:[`${moneyLine} very visibly made it onto the screen`,`A package that became an asset rather than an expense`,`The rare greenlight that looks smarter after release`],
   great:[`A marketable film with something to market`,`The spend is substantial; so is the evidence`,`Specific enough to have a commercial afterlife`],
   good:[`A credible return on creative intent`,`The package survives contact with the finished film`,`Money on screen, compromises in view`],
   mixed:[`The hook may travel further than the execution`,`A viable release with a very visible ceiling`,`The numbers will have to finish the argument`],
   poor:[`${moneyLine} buys surprisingly little certainty`,`The package is easier to finance than defend`,`Someone will be explaining this greenlight on Monday`],
   disaster:[`${moneyLine} and still searching for the movie`,`A write-down wearing a premiere suit`,`The P&L may need a trigger warning`]
  },
  craft:{
   rave:[`Someone finally remembered action needs geography`,`Every department appears to have read the same screenplay`,`Craft this precise makes difficulty look accidental`],
   great:[`${id.strength[0].toUpperCase()+id.strength.slice(1)} does the heavy lifting beautifully`,`A ${id.texture} film that looks finished rather than merely completed`,`The craft has opinions`],
   good:[`Strong hands, a few visible seams`,`More texture than gloss`,`The filmmaking keeps rescuing the machinery`],
   mixed:[`Beautiful shots, disputed ownership of the movie`,`The craft is specific; the whole is less certain`,`Several departments make excellent separate films`],
   poor:[`“Fix it in post” appears to have reached post`,`The seams deserve supporting credit`,`Ambition keeps outrunning the render queue`],
   disaster:[`Continuity has entered witness protection`,`The edit should be questioned without counsel`,`A technical post-mortem with opening credits`]
  },
  audience:{
   rave:[`${subject} is about to become somebody's entire personality`,`Ridiculously easy to recommend`,`The kind of movie that creates a group chat on the walk home`],
   great:[`${lead?.name||subject} gives the crowd exactly enough to shout about`,`Big grin, very few apologies`,`The trailer sold fun; the film actually delivered it`],
   good:[`Worth the ticket and most of the snacks`,`A crowd-pleaser with acceptable bruising`,`You will forgive more than you expect`],
   mixed:[`Great bits, suspiciously long gaps between them`,`The trailer may have had better pacing`,`A three-star film begging to be argued about`],
   poor:[`The snacks have the stronger third act`,`A good premise serving community service`,`Hard work for a movie this loud`],
   disaster:[`Two hours you can never stream back`,`The exit sign has tremendous screen presence`,`Even the popcorn seems concerned`]
  },
  auteur:{
   rave:[`The studio system accidentally permits cinema`,`A point of view survives commercial oxygen`,`Form and feeling refuse to file separate paperwork`],
   great:[`Authorship without the usual hostage note`,`A ${id.texture} argument worth having`,`The compromises have the decency to be interesting`],
   good:[`Personality defeats polish on points`,`A film with fingerprints, not merely finish`,`The director wins several important arguments`],
   mixed:[`Authorship interrupted by stakeholder feedback`,`The safer cut keeps haunting the interesting one`,`A point of view with visitation rights`],
   poor:[`Significance has been applied topically`,`Aesthetic intent, dramatic foreclosure`,`The film mistakes solemnity for depth`],
   disaster:[`An auteur theory emergency`,`All subtext, no text`,`The void has coverage`]
  }
 };
 return variationPick(f,`capsule-v3142-${o.focus}-${idx}-${tier}`,pools[o.focus][tier]);
}
function makeReviewRoundup(f,critics,audience){
 const sc=scriptById(f.scriptId),m=f.metrics,r=makeRng(hash(state.seed+'|roundup-v3142|'+f.id));
 const outlets=[
  {name:'The Trade Ledger',critic:'Martin Pike',voice:'Dry-eyed trade analyst',bias:(f.creative?.positioning==='commercial'?2:0),focus:'industry'},
  {name:'Frame & Sound',critic:'Celia Ward',voice:'Craft obsessive',bias:(sc.originality>78?3:-1),focus:'craft'},
  {name:'Popcorn Weekly',critic:'Mick Reyes',voice:'Unapologetic crowd critic',bias:(audience>critics?3:-1),focus:'audience'},
  {name:'Auteur Quarterly',critic:'Odette Shaw',voice:'High-minded cinephile',bias:(f.creative?.positioning==='prestige'?3:0)+(m.direction>82?2:0),focus:'auteur'}
 ];
 return outlets.map((o,idx)=>{
  const score=Math.round(clamp(critics+o.bias+(r()-.5)*14,12,99)),tier=reviewTier(score);
  return {publication:o.name,critic:o.critic,voice:o.voice,score,stars:reviewStars(score),headline:capsuleOutletLine(f,o,tier,score,idx)};
 });
}

function addCinemaWeek(f){
 const row=f.weeklyPlan[f.weeklyResults.length];if(!row)return;
 const actual=deep(row);actual.worldWeek=state.week;f.weeklyResults.push(actual);f.cinemaWeek=f.weeklyResults.length;
 const rev=theatricalStudioRevenue(f,row);f.studioRevenue+=rev;earn(rev);
 if(row.drop!==null){
  if(row.drop<0)addNews(state,`${f.title} grows ${Math.round(Math.abs(row.drop)*100)}% domestically in Week ${f.cinemaWeek}, a rare sign that demand is still expanding.`,'Box Office Alert');
  else if(f.cinemaWeek===2&&row.drop<.24)addNews(state,`${f.title} posts an exceptional second-week hold, with word of mouth becoming the story of the release.`,'Trade Report');
  else if(f.cinemaWeek===2&&row.drop>.68)addNews(state,`${f.title} collapses ${Math.round(row.drop*100)}% domestically in its second week as opening-week demand evaporates.`,'Trade Report');
 }
 if(f.cinemaWeek>=7||row.dom+row.intl<.25)f.pendingTheatricalFinish=true;
}
function finishFilm(f){
 if(f.stage==='complete')return;
 f.stage='complete';f.completeWeek=state.week;f.completeDay=typeof currentCalendarDay==='function'?currentCalendarDay():null;f.finalGross=f.weeklyResults.reduce((a,w)=>a+w.dom+w.intl,0);
 const ancillary=f.finalGross*ancillarySettlementRate();f.ancillarySettlement=ancillary;f.studioRevenue+=ancillary;earn(ancillary);recordAncillarySettlement(ancillary);
 ensurePackagingState(f);
 const backendPct=contractBackendPct(f);
 const backend=backendPct>0?f.studioRevenue*(backendPct/100):0;
 if(backend>0){state.cash-=backend;f.studioRevenue-=backend;f.backendPaid=backend}
 const rightsParticipation=(f.ipParticipationPct||0)>0?f.studioRevenue*((f.ipParticipationPct||0)/100):0;
 if(rightsParticipation>0){state.cash-=rightsParticipation;f.studioRevenue-=rightsParticipation;f.rightsParticipationPaid=rightsParticipation}
 const profit=f.studioRevenue-f.investment;
 ensureIPAsset(f);ensureAfterlifeState(f);refreshAfterlifeValuation(f);registerAudienceOutcome(f,profit);registerStudioFilmImpact(f,profit);
 const d=talentById(f.directorId),cast=packageActors(f),talentBefore={};[d,...cast].filter(Boolean).forEach(t=>talentBefore[t.id]=Math.round(t.momentum||60));
 const impact=(f.review.critics+f.review.audience)/2;
 if(d){const delta=talentFilmMomentumDelta(d,f,profit);applyMomentumChange(d,delta,talentFilmMomentumReason(d,f,delta,profit),'film')}
 cast.forEach(a=>{const delta=talentFilmMomentumDelta(a,f,profit);applyMomentumChange(a,delta,talentFilmMomentumReason(a,f,delta,profit),'film')});
 cast.forEach(a=>{a.star=Math.round(clamp(a.star+(f.finalGross>150?4:f.finalGross>70?2:profit<=-12?-2:profit<0?-1:0),10,97));});
 recordTalentFilmOutcome(f,profit);applyFilmCareerConsequences(f,profit);registerReleaseRipple(f,profit);
 [d,...cast].forEach(t=>{if(t){ensureTalentCareer(t);repriceTalent(t)}});
 state.reputation.creative=clamp(state.reputation.creative+(f.review.critics-65)*.08,20,95);
 state.reputation.commercial=clamp(state.reputation.commercial+(profit>0?2:-2)+(f.finalGross>120?2:0),20,95);
 state.reputation.talent=clamp(state.reputation.talent+(impact>75?2:impact<55?-1:0),20,95);
 updateRelationshipsAfterFilm(f,profit);buildFilmLegacy(f,talentBefore);if(typeof updateCareerCycle==='function')updateCareerCycle();queueFilmWrap(f);if(typeof checkStudioMilestones==='function')checkStudioMilestones();
 state.completed.unshift(f.id);addNews(state,`${f.title} closes its theatrical run at ${money(f.finalGross)} worldwide, leaving ${state.studio.name} with ${profit>=0?'a recorded profit of':'a recorded loss of'} ${money(Math.abs(profit))}.`,'Your Studio');
}
function boxPressureForWeek(week,genre,excludeId=null){
 const films=state.films.filter(x=>x.id!==excludeId&&x.releaseWeek===week&&x.stage!=='complete'&&x.stage!=='shelved');
 let p=0;films.forEach(f=>{p+=f.genre===genre?.12:.035});return clamp(p,0,.3);
}


function postRuntimeTarget(f){
 const c=f.creative||defaultCreative();
 let base=f.genre.includes('Horror')?98:f.genre.includes('Comedy')?102:f.genre.includes('Family')?104:f.genre.includes('Action')?112:f.genre.includes('Science')||f.genre.includes('Fantasy')?118:108;
 if(c.positioning==='prestige')base+=7;if(c.positioning==='commercial')base-=3;
 return base;
}
function ensurePostState(f){
 if(!f)return null;
 const s=ensureScriptEcosystem(scriptById(f.scriptId)),r=makeRng(hash(state.seed+'|post-state|'+f.id));
 if(!f.post){
  const target=postRuntimeTarget(f);
  f.post={
   targetRuntime:target,
   runtime:Math.round(target+(65-f.metrics.pacing)*.34+(65-f.metrics.clarity)*.10+(r()-.5)*16),
   endingStrength:Math.round(clamp(s.emotion*.34+s.structure*.24+f.metrics.clarity*.24+f.metrics.direction*.18+(r()-.5)*15,28,96)),
   actions:[],
   maxActions:2,
   testSegments:null,
   testWeek:null,
   discoveries:[],
   testFinding:null,
   cutVersion:1,
   firstDecisionMade:false
  };
 }
 f.post.actions=f.post.actions||[];f.post.maxActions=f.post.maxActions||2;f.post.discoveries=f.post.discoveries||[];f.post.cutVersion=f.post.cutVersion||1;
 if(f.post.selectedAction===undefined)f.post.selectedAction=null;
 f.post.lastActionResult=f.post.lastActionResult||null;if(f.post.firstDecisionMade===undefined)f.post.firstDecisionMade=(f.post.actions||[]).length>0;
 return f.post;
}
function roughDimensions(f){
 const p=ensurePostState(f),m=f.metrics;
 return [
  ['Performances',m.performances],
  ['Direction',m.direction],
  ['Technical finish',m.technical],
  ['Pacing',m.pacing],
  ['Story clarity',m.clarity],
  ['Lead chemistry',m.chemistry],
  ['Ending',p.endingStrength]
 ].sort((a,b)=>b[1]-a[1]);
}

function postSeverity(score){return score<50?'critical':score<62?'major':score<72?'moderate':'minor'}
function buildPostDiscoveries(f){
 const p=ensurePostState(f),m=f.metrics,s=ensureScriptEcosystem(scriptById(f.scriptId)),c=f.creative||defaultCreative(),list=[];
 const add=(id,title,score,text,action)=>list.push({id,title,score,severity:postSeverity(score),text,action});
 if(m.pacing<76||p.runtime>p.targetRuntime+9)add('pace','The middle is losing momentum',Math.min(m.pacing,86-Math.max(0,p.runtime-p.targetRuntime)),`The assembly begins to drag once the central turn has landed. At ${p.runtime} minutes, scenes that worked individually are stacking into a slower second half.`,((m.pacing<68&&m.clarity<70)||p.runtime>p.targetRuntime+15)?'restructure':'trim');
 if(m.clarity<75)add('clarity','The story is asking audiences to connect too much',m.clarity,'Several transitions make sense on the page but are reading as assumptions in the cut. Motivations are clearest to people already familiar with the screenplay.','clarity');
 if(m.performances<74)add('performance','One of the emotional turns is not landing',m.performances,'The performances are broadly usable, but a key emotional beat is arriving without enough weight to sell the next story turn.','performance');
 if(m.chemistry<67)add('chemistry','The leads are not fully carrying the relationship',m.chemistry,'The edit is struggling to find enough connective tissue between the principal performances. The relationship works scene-to-scene more than across the whole film.','performance');
 if(m.technical<76)add('finish','The finishing work is exposing the seams',m.technical,`Temporary sound, visual effects and transitions are making the film feel less expensive than its ${money(f.budget)} production budget.`, 'vfx');
 if(p.endingStrength<76)add('ending','The ending is not paying off the promise',p.endingStrength,'The final movement resolves the plot, but the emotional and dramatic payoff currently feels smaller than the film building toward it.','ending');
 if(c.positioning==='commercial'&&s.access<62)add('access','The film remains harder to enter than the campaign brief wants',s.access,'The cut is coherent, but it asks for more patience and inference than a broad commercial positioning normally tolerates.','clarity');
 if(!list.length)add('polish','The cut is unusually healthy',82,'There is no obvious structural emergency. The remaining work is about sharpening strengths rather than rescuing a weak department.','vfx');
 p.discoveries=list.sort((a,b)=>a.score-b.score).slice(0,4);return p.discoveries;
}
function postDiscoveryHeadline(f){const d=buildPostDiscoveries(f)[0];return d?.title||'The cut is taking shape'}

function makeRoughCut(f){
 const p=ensurePostState(f),arr=roughDimensions(f),best=arr[0],weak=arr.at(-1),second=arr.at(-2),lines=[];
 lines.push(best[1]>84?`${best[0]} is drawing exceptional internal praise.`:`${best[0]} is currently one of the stronger elements.`);
 lines.push(weak[1]<50?`${weak[0]} is a serious problem in the present cut.`:weak[1]<64?`${weak[0]} is the clearest weakness at this stage.`:`${weak[0]} remains the least convincing element.`);
 if(second[1]<60)lines.push(`${second[0]} is also creating concern, so one post-production fix may not solve everything.`);
 if(p.runtime>p.targetRuntime+14)lines.push(`The rough cut runs ${p.runtime} minutes against an internal target around ${p.targetRuntime}; length is contributing to pacing pressure.`);
 else if(p.runtime<p.targetRuntime-12)lines.push(`At ${p.runtime} minutes the film is lean, but some transitions may not have enough room to breathe.`);
 else lines.push(`The ${p.runtime}-minute runtime is broadly within the expected range for the film.`);
 const discoveries=buildPostDiscoveries(f);f.rough={best,weak,second,lines,discoveries};
 return f.rough;
}
function postDirectorView(f){
 const d=talentById(f.directorId),arr=roughDimensions(f),weak=arr.at(-1)[0],p=ensurePostState(f);
 if(d.craft>=88&&(f.creative?.positioning==='prestige'||d.commercial<62)&&arr.at(-1)[1]>=62)return {action:'lock',text:`${d.name} believes the current imperfections are part of the film's character and would lock the cut.`};
 if(weak==='Pacing'||p.runtime>p.targetRuntime+12)return {action:'trim',text:`${d.name} supports a tighter edit before picture lock.`};
 if(weak==='Story clarity')return {action:'clarity',text:`${d.name} wants targeted pickups to make the story read more cleanly.`};
 if(weak==='Technical finish')return {action:'vfx',text:`${d.name} wants another technical polish pass.`};
 if(weak==='Performances'||weak==='Lead chemistry')return {action:'performance',text:`${d.name} believes a focused performance pickup could materially help.`};
 if(weak==='Ending')return {action:'ending',text:`${d.name} is concerned the ending is not paying off the film strongly enough.`};
 return {action:'lock',text:`${d.name} is broadly comfortable with the current cut.`};
}
function segmentTestScores(f){
 const s=ensureScriptEcosystem(scriptById(f.scriptId)),m=f.metrics,p=ensurePostState(f),c=f.creative||defaultCreative(),cast=f.cast.map(talentById);
 const star=cast.reduce((a,b)=>a+b.star,0)/cast.length,r=makeRng(hash(state.seed+'|segments|'+f.id+'|'+state.week));
 const noise=()=> (r()-.5)*9;
 const maturePenalty=c.rating==='mature'?-11:0,broadBoost=c.rating==='broad'?5:0,bias=f.creativeDirection?.segmentBias||{};
 return {
  'Mainstream adults':clamp(m.performances*.18+m.pacing*.19+m.clarity*.19+s.access*.18+s.hook*.10+p.endingStrength*.16+(bias['Mainstream adults']||0)+noise(),25,96),
  'Younger audiences':clamp(star*.14+s.hook*.19+m.pacing*.20+m.technical*.19+s.access*.12+p.endingStrength*.10+(bias['Younger audiences']||0)+noise(),22,96),
  'Families':clamp(s.access*.25+m.clarity*.22+m.pacing*.14+p.endingStrength*.13+s.emotion*.13+broadBoost+maturePenalty+(bias['Families']||0)+noise(),15,96),
  'Genre fans':clamp(s.genreFulfillment*.28+s.hook*.17+m.technical*.16+m.direction*.15+p.endingStrength*.12+(c.tone==='heightened'?4:0)+(bias['Genre fans']||0)+noise(),20,98),
  'Prestige / arthouse':clamp(m.performances*.22+m.direction*.21+s.originality*.18+s.emotion*.16+p.endingStrength*.13+(c.positioning==='prestige'?5:0)+(bias['Prestige / arthouse']||0)+noise(),20,98)
 };
}
function runTestScreen(f){
 if(f.tested===true)return showToast('This film has already been test screened.');
 if(!spend(.45))return;
 f.investment+=.45;f.tested=true;ensurePostState(f);
 f.post.testSegments=segmentTestScores(f);f.post.testWeek=state.week;
 const vals=Object.values(f.post.testSegments);f.testScore=vals.reduce((a,b)=>a+b,0)/vals.length;
 const ordered=Object.entries(f.post.testSegments).sort((a,b)=>b[1]-a[1]),best=ordered[0],weak=ordered.at(-1),spread=best[1]-weak[1];
 f.post.testFinding={best,weak,spread,overall:f.testScore};
 queueStudioMoment(f,'testScreening',{kicker:'AUDIENCE RESEARCH',title:`${f.title} meets its first audience`,tone:f.testScore>=76?'great':f.testScore<56?'bad':'neutral',result:f.testScore>=76?'strong':f.testScore<56?'soft':'mixed',summary:f.testScore>=76?'The screening found a genuinely enthusiastic audience.':f.testScore<56?'The room exposed problems the internal team can no longer dismiss.':'The screening produced useful evidence without a clean consensus.',stats:[['Overall',`${Math.round(f.testScore)}%`],['Strongest',`${best[0]} · ${Math.round(best[1])}%`],['Weakest',`${weak[0]} · ${Math.round(weak[1])}%`]],sections:[{title:'What the room told you',text:spread>=24?`Response is sharply segmented: ${best[0]} connected strongly while ${weak[0]} struggled. The film may have a clearer niche than the studio expected.`:`Responses are relatively consistent across audience groups, which makes the overall result more trustworthy.`},{title:'What changes now',text:'The numbers do not automatically change the film. They give you evidence for the remaining post-production decisions — or a reason to trust the cut as it is.'}]});
 surfacePendingStudioMoment();save();render();
}
function skipTest(f){f.tested=false;save();render()}
function availablePostActions(f){
 const p=ensurePostState(f),m=f.metrics,arr=[];
 const add=(x)=>{if(!arr.some(a=>a.id===x.id)&&!p.actions.some(a=>a.id===x.id))arr.push(x)};
 if(m.pacing<72||p.runtime>p.targetRuntime+8)add({id:'trim',label:'Tighten the cut',cost:.25,time:1,desc:'Remove repetition and compress transitions. Cheap and effective for pace, but a hard trim can sacrifice performance texture.'});
 if((m.pacing<68&&m.clarity<70)||p.runtime>p.targetRuntime+15)add({id:'restructure',label:'Restructure the middle',cost:.65,time:1,desc:'A deeper editorial rebuild: move scenes, collapse beats and reshape the second act without new photography.'});
 if(m.clarity<74)add({id:'clarity',label:'Clarity pickups',cost:.8,time:1,desc:'Shoot connective material to clarify motivations and cause-and-effect.'});
 if(m.performances<74||m.chemistry<63)add({id:'performance',label:'Performance pickups',cost:1.15,time:1,desc:'Bring principals back for a focused performance pass.'});
 if(m.technical<76||f.creative?.emphasis==='spectacle')add({id:'vfx',label:'Technical polish',cost:1.3,time:1,desc:'Spend another week on VFX, sound and finishing work.'});
 if(p.endingStrength<74)add({id:'ending',label:'Rework the ending',cost:2.2,time:1,desc:'The expensive option: reshape or partially reshoot the final movement. High upside, some creative risk.'});
 if(arr.length<3)add({id:'trim',label:'Tighten the cut',cost:.25,time:1,desc:'A restrained editorial pass aimed at pace and efficiency.'});
 if(arr.length<3)add({id:'vfx',label:'Technical polish',cost:1.3,time:1,desc:'Improve finishing detail even if it is not the film’s primary weakness.'});
 const priority=buildPostDiscoveries(f).map(d=>d.action);arr.sort((a,b)=>{const ai=priority.indexOf(a.id),bi=priority.indexOf(b.id);return (ai<0?99:ai)-(bi<0?99:bi)});return arr.slice(0,typeof postOptionLimit==='function'?postOptionLimit():4);
}
function canSpendPostWeek(){
 rebuildDecisions();
 const blocking=state.decisions.filter(x=>x.type==='production');
 if(blocking.length){showToast('Resolve the active production decision before committing a week to post-production.');return false}
 return true;
}
function postActionTargets(f,type){
 const hits=buildPostDiscoveries(f).filter(d=>d.action===type);
 return hits.length?hits:[{id:'polish',title:'General finishing opportunity',severity:'minor',text:'This intervention is not responding to a crisis; it is an attempt to sharpen the film further.',action:type}];
}
function postActionTradeoff(type){
 return {
  trim:'Likely effect: faster pace and a shorter cut. Risk: some performance texture can be lost.',
  restructure:'Likely effect: clearer, faster middle section. Risk: editorial changes can slightly disturb the director’s original shape.',
  clarity:'Likely effect: clearer motivation and cause-and-effect. Risk: pickups add a little runtime and can soften pace.',
  performance:'Likely effect: stronger emotional beats and lead chemistry. Cost is higher because principal cast return to set.',
  vfx:'Likely effect: stronger finishing, sound and visual polish. It mainly helps technical execution rather than story.',
  ending:'Likely effect: a stronger final payoff and clearer resolution. Highest cost and greatest creative risk.'
 }[type]||'A focused post-production intervention with both upside and opportunity cost.';
}
function selectPostAction(f,type){
 const p=ensurePostState(f),action=availablePostActions(f).find(x=>x.id===type);
 if(!action)return;
 p.selectedAction=type;save();render();
}
function cancelPostActionSelection(f){const p=ensurePostState(f);p.selectedAction=null;save();render()}
function postMetricSnapshot(f){
 const p=ensurePostState(f);return {pacing:f.metrics.pacing,clarity:f.metrics.clarity,performances:f.metrics.performances,chemistry:f.metrics.chemistry,technical:f.metrics.technical,direction:f.metrics.direction,runtime:p.runtime,ending:p.endingStrength};
}
function postResultSummary(before,after,type){
 const labels={pacing:'Pacing',clarity:'Clarity',performances:'Performances',chemistry:'Chemistry',technical:'Technical finish',direction:'Direction',runtime:'Runtime',ending:'Ending'};
 const changes=[];
 Object.keys(labels).forEach(k=>{
  const delta=(after[k]||0)-(before[k]||0);if(Math.abs(delta)<.5)return;
  if(k==='runtime')changes.push(`${labels[k]} ${Math.abs(Math.round(delta))} min ${delta<0?'shorter':'longer'}`);
  else changes.push(`${labels[k]} ${delta>0?'improved':'softened'}`);
 });
 return changes.slice(0,4);
}
function runPostAction(f,type){
 const p=ensurePostState(f);
 if(p.actions.length>=p.maxActions)return showToast('You have already made two major post-production interventions.');
 const action=availablePostActions(f).find(x=>x.id===type);if(!action)return;const targets=postActionTargets(f,type).map(x=>x.title),before=postMetricSnapshot(f),directorView=postDirectorView(f);if(f.directorAuthority?.producerCredit&&!f.directorAuthority.postVetoUsed&&directorView.action!=='lock'&&type!==directorView.action){const vr=makeRng(hash(state.seed+'|post-veto|'+f.id+'|'+state.week));if(vr()<.45){f.directorAuthority.postVetoUsed=true;save();render();return showToast(`${talentById(f.directorId).name} has final authority on this intervention under the producer-credit agreement.`)}}
 if(!canSpendPostWeek())return;
 if(!spend(action.cost))return;
 f.investment+=action.cost;
 const d=talentById(f.directorId),view=postDirectorView(f),r=makeRng(hash(state.seed+'|post-action|'+f.id+'|'+type+'|'+p.actions.length));
 if(type==='trim'){f.metrics.pacing+=5;f.metrics.clarity+=1;f.metrics.performances-=1;p.runtime-=Math.round(6+r()*5)}
 if(type==='restructure'){f.metrics.pacing+=4;f.metrics.clarity+=4;f.metrics.direction+=(r()<.22?-1:1);p.runtime-=Math.round(2+r()*5)}
 if(type==='clarity'){f.metrics.clarity+=6;f.metrics.pacing-=1;p.runtime+=2}
 if(type==='performance'){f.metrics.performances+=5;f.metrics.chemistry+=2;p.runtime+=1}
 if(type==='vfx'){f.metrics.technical+=6}
 if(type==='ending'){p.endingStrength=clamp(p.endingStrength+5+Math.round(r()*5),20,99);f.metrics.clarity+=3;f.metrics.direction+=(r()<.25?-2:1)}
 Object.keys(f.metrics).forEach(k=>f.metrics[k]=clamp(f.metrics[k],20,99));
 if(view.action!==type&&view.action!=='lock'&&(d.relationship||0)>-20)adjustTalentRelationship(d,-1,`${f.title}: studio chose a different post intervention`,f.id);
 else if(view.action===type)adjustTalentRelationship(d,1,`${f.title}: studio backed the director's preferred post intervention`,f.id);
 const after=postMetricSnapshot(f),resultChanges=postResultSummary(before,after,type);
 p.actions.push({id:type,label:action.label,week:state.week,cost:action.cost,targets,resultChanges});p.firstDecisionMade=true;p.cutVersion=(p.cutVersion||1)+1;
 p.lastActionResult={label:action.label,targets,resultChanges,cutVersion:p.cutVersion};p.selectedAction=null;
 f.history.push(`Week ${state.week}: post-production — ${action.label}.`);
 makeRoughCut(f);save();
 advanceWeek();
}
function lockCut(f){
 ensurePostState(f);ensureSoundtrackState(f);
 if(!f.soundtrack?.committed)return showToast('Choose and commit the film’s music plan before picture lock.');
 f.stage='marketing';f.history.push(`Week ${state.week}: picture locked at ${f.post.runtime} minutes.`);
 notify(`marketing:${f.id}`,`${f.title}: release planning required`,'Picture is locked. Set the campaign, distribution strategy and release date before advancing the calendar.',f.id,true,'warning');
 // Release planning is a major lifecycle hand-off, not background admin. Surface it immediately and
 // then keep it as a hard calendar checkpoint until the player commits a release plan.
 queueStudioMoment(f,'releasePlanning',{kicker:'PICTURE LOCKED',title:`${f.title} is ready to go to market`,tone:'neutral',result:'RELEASE PLANNING',summary:'The film is finished. The next decision is how to position it, how much to spend, and when to release it.',stats:[['Final runtime',`${f.post.runtime} min`],['Stage','Marketing'],['Calendar','Paused for release planning']],sections:[{title:'What happens now',text:'Choose the trailer approach, publicity plan, launch strategy, distribution route and release date. Time will not move again until that plan is committed.'},{title:'Why the calendar is paused',text:'A finished film should never lose campaign weeks because release planning was missed. This is now a mandatory studio checkpoint.'}]});
 rebuildDecisions();
 if(surfacePendingStudioMoment()){save();render();return}
 save();render();
}


function ensureMarketingState(f){
 if(!f)return null;
 if(!f.marketingState){
  f.marketingState={
   trailer:'concept',publicity:'selective',launch:'none',
   buzz:0,expectations:0,sentiment:0,milestones:[],pending:null,
   interventionUsed:false,trailerResult:null,publicityResult:null,
   festival:null,premiere:null,advancePress:null,committed:false,eventLog:[],publicMoments:[]
  };
 }
 const m=f.marketingState;
 m.milestones=m.milestones||[];m.eventLog=m.eventLog||[];m.publicMoments=m.publicMoments||[];
 if(m.buzz===undefined)m.buzz=0;
 if(m.expectations===undefined)m.expectations=0;
 if(m.sentiment===undefined)m.sentiment=0;
 return m;
}
function publicityCost(f){
 const m=ensureMarketingState(f);
 return m.publicity==='tour'?.70:m.publicity==='viral'?.35:m.publicity==='prestige'?.45:0;
}
function launchCost(f){
 const m=ensureMarketingState(f);
 return m.launch==='festival'?.25:m.launch==='gala'?.55:0;
}
function marketingExtraLead(f){
 const m=ensureMarketingState(f);
 return m.launch==='festival'?2:m.launch==='gala'?1:0;
}
function marketingPublicStatus(f){
 const m=ensureMarketingState(f);
 const heat=m.buzz>=16?'Very hot':m.buzz>=9?'Hot':m.buzz>=4?'Building':m.buzz<=-3?'Soft':'Quiet';
 const sentiment=m.sentiment>=6?'Excellent':m.sentiment>=2?'Positive':m.sentiment<=-5?'Negative':m.sentiment<=-2?'Mixed / negative':'Mixed';
 const pressure=m.expectations>=14?'Very high':m.expectations>=8?'High':m.expectations>=3?'Moderate':'Low';
 return {heat,sentiment,pressure};
}
function festivalPotential(f){
 const s=ensureScriptEcosystem(scriptById(f.scriptId)),d=talentById(f.directorId),m=f.metrics,c=f.creative||defaultCreative(),p=f.post||{};
 return clamp(s.originality*.17+s.emotion*.10+s.characters*.10+m.performances*.18+m.direction*.17+d.craft*.12+(p.endingStrength||65)*.08+(c.positioning==='prestige'?8:0)-(c.positioning==='commercial'?2:0)+publicityExecutionBonus(),20,98);
}
function festivalPotentialLabel(f){
 const v=festivalPotential(f);
 if(v>=79)return {label:'Strong festival profile',cls:'good',text:'The material, filmmaker and finished cut look credible for a serious festival launch.'};
 if(v>=67)return {label:'Plausible festival route',cls:'blue',text:'The film has enough creative profile to justify a submission, but acceptance is far from certain.'};
 if(v>=56)return {label:'Outside chance',cls:'warn',text:'A festival play would be speculative and may simply cost time.'};
 return {label:'Poor festival fit',cls:'bad',text:'The film is unlikely to benefit from building its release around festival selection.'};
}
function promiseFitBand(score){
 if(score>=82)return {label:'Natural promise',cls:'good',text:'The finished film appears well equipped to support this sell.'};
 if(score>=70)return {label:'Credible promise',cls:'blue',text:'The campaign can make this promise without obviously fighting the film.'};
 if(score>=58)return {label:'Stretch',cls:'warn',text:'There is upside here, but the campaign would be leaning beyond the film’s clearest strengths.'};
 return {label:'Mismatch risk',cls:'bad',text:'This approach risks selling an experience the finished film may struggle to deliver.'};
}
function trailerPromisePreview(f,type){
 const score=trailerPromiseScore(f,type),band=promiseFitBand(score);
 const pressure=type==='spectacle'||type==='star'?'Raises expectations quickly':type==='concept'?'Keeps expectations comparatively controlled':'Performance response will matter heavily';
 return {...band,score,pressure};
}
function publicityPromisePreview(f,type){
 if(type==='selective')return {label:'Low-variance',cls:'blue',text:'Controlled access is unlikely to transform awareness, but it creates little downside.',variance:'Low variance'};
 const cast=packageActors(f),d=talentById(f.directorId),star=cast.length?cast.reduce((a,b)=>a+(b.star||0),0)/cast.length:45,rel=cast.length?cast.reduce((a,b)=>a+(b.reliability||70),0)/cast.length:70;
 let score=65,variance='Moderate variance';
 if(type==='tour')score=star*.28+rel*.22+(d?.actorDirection||70)*.12+f.metrics.performances*.20+f.metrics.chemistry*.18;
 else if(type==='viral'){score=star*.18+f.metrics.chemistry*.16+scriptById(f.scriptId).hook*.24+21;variance='High variance'}
 else if(type==='prestige')score=festivalPotential(f)*.64+(d?.craft||70)*.18+scriptById(f.scriptId).originality*.18;
 const band=promiseFitBand(score);
 const text=type==='viral'?`${band.text} Digital-first work has the widest outcome spread.`:type==='tour'?`${band.text} Cast warmth, star value and reliability will shape the result.`:`${band.text} Serious profiles work best when the film, filmmaker and craft can sustain scrutiny.`;
 return {...band,score,text,variance};
}
function campaignPositionPreview(f,type){
 const m=ensureMarketingState(f),trailer=trailerPromisePreview(f,m.trailer);
 if(type==='event'){
  const good=trailer.score>=72&&f.marketing>=marketingRecommended(f)*.8;
  return good?{label:'Supportable event sell',cls:'good',text:'The package has enough campaign material to justify a larger public promise, though expectation pressure will rise.'}:{label:'Event overreach risk',cls:'warn',text:'The current film/campaign package may struggle to sustain an event-sized promise.'};
 }
 if(type==='mystery')return {label:'Flexible promise',cls:'blue',text:'Holding material back lowers immediate clarity but gives the campaign more room to pivot around audience reaction.'};
 return {label:'Expectation-safe',cls:'good',text:'Authentic positioning keeps the campaign closely aligned with what the finished film appears to be.'};
}
function launchPromisePreview(f,type){
 if(type==='none')return {label:'Controlled',cls:'blue',text:'No single launch event will dramatically raise expectations before opening.'};
 if(type==='festival'){const p=festivalPotential(f),b=promiseFitBand(p);return {...b,label:p>=78?'Strong festival case':p>=64?'Plausible festival case':'Festival risk',text:p>=78?'The film has credible prestige ingredients for a major festival platform.':p>=64?'The submission is defensible, but acceptance and reception remain uncertain.':'The film currently looks like a difficult festival sell; rejection or flat response is a real possibility.'}}
 const p=(f.metrics.performances*.30+f.metrics.chemistry*.20+ensembleCampaignStar(f)*.25+(f.review?.audience||65)*.0+65*.25),b=promiseFitBand(p);
 return {...b,label:p>=75?'Premiere-friendly package':p>=62?'Workable gala':'Gala expectation risk',text:`${b.text} A gala buys attention immediately and therefore increases opening-week pressure.`};
}
function campaignPromiseSummary(f){
 const m=ensureMarketingState(f),pos=campaignPositionPreview(f,f.campaign||'authentic'),tr=trailerPromisePreview(f,m.trailer),pub=publicityPromisePreview(f,m.publicity),launch=launchPromisePreview(f,m.launch);
 const rank={bad:0,warn:1,blue:2,good:3},all=[pos,tr,pub,launch],weak=all.sort((a,b)=>rank[a.cls]-rank[b.cls])[0];
 const pressure=(f.campaign==='event'?2:0)+(m.trailer==='spectacle'||m.trailer==='star'?2:0)+(m.launch==='gala'?2:0)+(m.publicity==='viral'?1:0);
 return {label:weak.cls==='bad'?'Campaign-film mismatch':weak.cls==='warn'?'Stretching the promise':pressure>=5?'High-expectation campaign':'Campaign broadly aligned',cls:weak.cls==='bad'?'bad':weak.cls==='warn'?'warn':pressure>=5?'warn':'good',text:weak.text,pressure:pressure>=5?'High expectation pressure':pressure>=3?'Moderate expectation pressure':'Controlled expectations'};
}

function trailerPromiseScore(f,type=null){
 const m=f.metrics,s=ensureScriptEcosystem(scriptById(f.scriptId)),p=f.post||ensurePostState(f),t=type||ensureMarketingState(f).trailer;
 if(t==='character')return clamp(m.performances*.42+s.characters*.28+s.emotion*.20+m.chemistry*.10,20,98);
 if(t==='spectacle')return clamp(m.technical*.42+m.direction*.20+s.genreFulfillment*.23+s.hook*.15,20,98);
 if(t==='star'){
  const cast=f.cast.map(talentById),star=cast.reduce((a,b)=>a+b.star,0)/cast.length;
  return clamp(star*.42+m.performances*.31+s.characters*.14+s.hook*.13,20,98);
 }
 return clamp(s.hook*.33+m.clarity*.24+s.structure*.15+s.originality*.14+(p.endingStrength||65)*.14,20,98);
}
function trailerStrategyText(type){
 return ({
  concept:'Sell the concept and central premise. Usually the safest way to align expectations with the film.',
  character:'Lead with performances, relationships and emotion. Strong for performance-led films.',
  spectacle:'Lead with scale, images and technical moments. Powerful when the film can genuinely deliver them.',
  star:'Make the cast the campaign. Buys attention from star power but places more pressure on the performances.'
 })[type]||'';
}
function publicityText(type){
 return ({
  selective:'Selective interviews and controlled access. Cheap, flexible and unlikely to transform awareness.',
  tour:'Full press tour using the director and principal cast. Expensive, but reliable if the talent and film are likeable.',
  viral:'Digital-first campaign built around clips, social moments and experimentation. Cheaper and much less predictable.',
  prestige:'Long-lead profiles, craft interviews and serious-film positioning. Best suited to prestige and auteur releases.'
 })[type]||'';
}
function launchText(type){
 return ({
  none:'No dedicated launch event. Preserve flexibility and let the normal campaign do the work.',
  gala:'Stage a high-profile premiere one week before release. Buys attention and raises expectations.',
  festival:'Submit to a major festival. Adds two weeks to the build and acceptance is not guaranteed.'
 })[type]||'';
}
function marketingMilestoneLabel(type){
 return ({trailer:'Trailer launch',festivalDecision:'Festival decision',festivalScreening:'Festival screening',publicity:'Publicity push',gala:'World premiere'})[type]||type;
}
function buildMarketingMilestones(f){
 const m=ensureMarketingState(f),start=f.campaignStart,release=f.releaseWeek,milestones=[];
 const startDay=typeof currentCalendarDay==='function'?currentCalendarDay():Math.max(1,(state.week-1)*7+1);
 const releaseDay=typeof releaseDayForWeek==='function'?releaseDayForWeek(release):Math.max(startDay+1,release*7-2);
 const add=(id,type,day)=>{day=Math.max(startDay+1,Math.min(releaseDay-1,day));milestones.push({id,type,day,week:typeof calendarWeekForDay==='function'?calendarWeekForDay(day):Math.max(start,Math.ceil(day/7)),resolved:false})};
 add('trailer','trailer',Math.max(startDay+1,releaseDay-21));
 if(m.launch==='festival')add('festivalDecision','festivalDecision',Math.max(startDay+1,releaseDay-28));
 if(m.publicity!=='selective')add('publicity','publicity',Math.max(startDay+2,releaseDay-10));
 if(m.launch==='gala')add('gala','gala',Math.max(startDay+2,releaseDay-3));
 m.milestones=milestones.sort((a,b)=>(a.day||a.week*7)-(b.day||b.week*7));
}
function campaignSpendStrength(f){return clamp(f.marketing/Math.max(1,marketingRecommended(f)),0,1.4)}
function campaignMilestoneNews(f,text,kind='Press Release'){
 addNews(state,`${f.title}: ${text}`,kind);
 ensureMarketingState(f).eventLog.unshift({week:state.week,day:typeof currentCalendarDay==='function'?currentCalendarDay():null,text});
}
function maybeCreateMarketingIntervention(f,kind,result){
 const m=ensureMarketingState(f);if(m.interventionUsed||m.pending)return;
 if(kind==='trailer'&&result==='viral'){
  m.pending={type:'viralTrailer',title:'The trailer is breaking out',text:'The first trailer is spreading beyond the paid campaign. You can pour fuel on the moment or protect the existing positioning.'};
  notify(`mkt:${f.id}:viral`,`${f.title}: trailer breakout`,'The trailer is unexpectedly hot. Decide whether to lean into the viral moment.',f.id,true,'info');
 }else if(kind==='trailer'&&result==='soft'){
  m.pending={type:'softTrailer',title:'Trailer response is soft',text:'The trailer has not created the intended excitement. There is still time to recut the campaign or change emphasis.'};
  notify(`mkt:${f.id}:soft`,`${f.title}: soft trailer response`,'The first trailer underperformed. A campaign decision is available.',f.id,true,'warning');
 }else if(kind==='festival'&&result==='strong'){
  m.pending={type:'festivalPraise',title:'Festival notices are strong',text:'Early reviews are giving the film a credible prestige narrative. You can pivot the campaign toward those notices or preserve the original positioning.'};
  notify(`mkt:${f.id}:festival`,`${f.title}: strong festival notices`,'The festival screening generated strong early press. Decide how much to foreground it.',f.id,true,'info');
 }
}

function campaignVenue(f){
 const r=makeRng(hash(state.seed+'|premiere-city|'+f.id));
 const prestige=(f.creative?.positioning==='prestige');
 const pools=prestige?['London · Leicester Square','New York · Lincoln Center','Los Angeles · Academy Museum']:(f.genre.includes('Action')||f.genre.includes('Science')||f.genre.includes('Fantasy'))?['Los Angeles · TCL Chinese Theatre','London · Leicester Square','New York · Times Square']:['London · Leicester Square','Los Angeles · Academy Museum','New York · Lincoln Center'];
 return pick(r,pools);
}
function campaignDeltaStats(before,m){return [['Campaign reach',`${m.buzz-before.buzz>=0?'+':''}${m.buzz-before.buzz}`],['Campaign tone',`${m.sentiment-before.sentiment>=0?'+':''}${m.sentiment-before.sentiment}`],['Expectation',`${m.expectations-before.expectations>=0?'+':''}${m.expectations-before.expectations}`]]}
function rememberPublicMoment(f,type,result,title){const m=ensureMarketingState(f);m.publicMoments.unshift({week:state.week,day:typeof currentCalendarDay==='function'?currentCalendarDay():null,type,result,title});m.publicMoments=m.publicMoments.slice(0,12)}
function trailerMomentSections(f,result,promise){
 const m=ensureMarketingState(f),strategy=trailerStrategyText(m.trailer),match=promise>=80?'The material chosen for the trailer is one of the film’s real strengths.':promise>=66?'The sell is broadly supported by the finished film.':'The campaign is leaning on material the finished film may struggle to sustain.';
 return [{title:'The cut',text:`${m.trailer[0].toUpperCase()+m.trailer.slice(1)}-first positioning. ${strategy}`},{title:'Expectation risk',text:`${match} ${m.expectations>=10?'Public expectation is now running high enough that the film will need to deliver on the promise.':'The campaign still has room to build without becoming dangerously overhyped.'}`}];
}

function resolveTrailerMilestone(f){
 const m=ensureMarketingState(f),r=makeRng(hash(state.seed+'|trailer|'+f.id+'|'+state.week)),promise=trailerPromiseScore(f),spend=campaignSpendStrength(f),before={buzz:m.buzz,sentiment:m.sentiment,expectations:m.expectations};
 const base=(promise-62)*.16+(spend-.7)*5+(r()-.5)*7;
 const result=base>=7?'viral':base>=2?'strong':base>=-2?'mixed':'soft';
 const buzz=result==='viral'?11:result==='strong'?7:result==='mixed'?3:-2;
 const sent=result==='viral'?4:result==='strong'?2:result==='mixed'?0:-3;
 let expectation=result==='viral'?9:result==='strong'?6:result==='mixed'?3:1;
 if(m.trailer==='spectacle'||m.trailer==='star')expectation+=2;if(m.trailer==='concept')expectation=Math.max(0,expectation-1);
 m.buzz+=buzz;m.sentiment+=sent;m.expectations+=expectation;m.trailerResult={result,promise,week:state.week};
 const text=result==='viral'?`the ${m.trailer}-led trailer has broken out online and become a genuine conversation piece.`:result==='strong'?`the first trailer landed well and materially strengthened pre-release interest.`:result==='mixed'?`the first trailer drew a respectable but unspectacular response.`:`the first trailer landed softly and is not converting the campaign spend into much excitement.`;
 campaignMilestoneNews(f,text,result==='soft'?'Trade Report':'Press Release');maybeCreateMarketingIntervention(f,'trailer',result);rememberPublicMoment(f,'trailer',result,'First trailer');recordTrackingSnapshot(f,'First trailer');
 queueStudioMoment(f,'trailer',{kicker:'TRAILER DROP',title:`${f.title} is finally public`,tone:result==='viral'||result==='strong'?'great':result==='soft'?'bad':'neutral',result,summary:result==='viral'?'The trailer has escaped the paid campaign and become its own story.':result==='strong'?'The first trailer has done exactly what the studio needed: attention is building without obvious backlash.':result==='mixed'?'The trailer is in circulation, but it has not yet given the campaign a defining story.':'The first public look has landed weakly and the campaign now has a problem to solve.',stats:campaignDeltaStats(before,m),sections:trailerMomentSections(f,result,promise),choiceContext:m.pending?'marketing':null,choices:m.pending?.type==='viralTrailer'?[['amplify','Pour fuel on it · $0.35m'],['protect','Keep the campaign controlled']]:m.pending?.type==='softTrailer'?[['recut','Cut a new trailer · $0.45m'],['double','Back the original sell · $0.30m'],['accept','Take the hit and move on']]:null});
}
function resolveFestivalDecision(f){
 const m=ensureMarketingState(f),r=makeRng(hash(state.seed+'|festival-accept|'+f.id)),pot=festivalPotential(f),accepted=r()<clamp((pot-45)/62,.08,.82);
 m.festival={accepted,potential:pot,decisionWeek:state.week,screened:false,result:null};
 if(accepted){const releaseDay=typeof releaseDayForWeek==='function'?releaseDayForWeek(f.releaseWeek):f.releaseWeek*7-2,screenDay=Math.max((typeof currentCalendarDay==='function'?currentCalendarDay():state.week*7)+2,releaseDay-14),screenWeek=typeof calendarWeekForDay==='function'?calendarWeekForDay(screenDay):Math.ceil(screenDay/7);m.milestones.push({id:'festivalScreening',type:'festivalScreening',day:screenDay,week:screenWeek,resolved:false});m.milestones.sort((a,b)=>(a.day||a.week*7)-(b.day||b.week*7));campaignMilestoneNews(f,`the film has been selected for a major festival screening on ${typeof calendarDateLabel==='function'?calendarDateLabel(screenDay):'Week '+screenWeek}.`,'Trade Report')}
 else campaignMilestoneNews(f,'the festival submission was not selected. The studio now has a longer campaign runway without the hoped-for prestige launch.','Trade Report');
 rememberPublicMoment(f,'festivalDecision',accepted?'accepted':'rejected','Festival selection');recordTrackingSnapshot(f,'Festival selection');
 queueStudioMoment(f,'festivalDecision',{kicker:'FESTIVAL SELECTION',title:accepted?`${f.title} gets the call`:`${f.title} misses the festival cut`,tone:accepted?'great':'warn',result:accepted?'accepted':'rejected',summary:accepted?`The film has been selected for a major festival screening on ${calendarDateLabel(m.milestones.find(x=>x.type==='festivalScreening')?.day)}. The campaign now has a live prestige opportunity.`:'The submission was passed over. The campaign loses the hoped-for festival platform, but avoids the risk of weak early reviews.',stats:[['Festival profile',`${Math.round(pot)}`],['Release week',`W${f.releaseWeek}`],['Campaign reach',marketingPublicStatus(f).heat]],sections:[{title:accepted?'What selection changes':'What rejection changes',text:accepted?'Selection gives the film a credible reason for critics and industry press to pay attention before the commercial release. The screening itself can still help or hurt.':'The studio regains a cleaner commercial runway. There is no prestige boost, but there are also no advance reviews defining the film before release.'}]});
}
function resolveFestivalScreening(f){
 const m=ensureMarketingState(f),r=makeRng(hash(state.seed+'|festival-screen|'+f.id)),score=festivalPotential(f)+(r()-.5)*14,before={buzz:m.buzz,sentiment:m.sentiment,expectations:m.expectations};
 const result=score>=80?'strong':score>=66?'mixed':'poor';m.festival.screened=true;m.festival.result=result;m.festival.screenWeek=state.week;
 if(result==='strong'){m.buzz+=8;m.sentiment+=5;m.expectations+=5;m.advancePress='Strong festival notices';campaignMilestoneNews(f,'festival reviews are notably strong, creating real prestige conversation.','Trade Report')}
 else if(result==='mixed'){m.buzz+=3;m.sentiment+=1;m.expectations+=2;m.advancePress='Mixed-positive festival notices';campaignMilestoneNews(f,'festival reaction is mixed-positive: clear admirers, but no consensus breakout.','Trade Report')}
 else{m.buzz-=1;m.sentiment-=4;m.advancePress='Weak festival notices';campaignMilestoneNews(f,'festival reaction is disappointing, creating difficult early headlines before commercial release.','Trade Report')}
 maybeCreateMarketingIntervention(f,'festival',result);rememberPublicMoment(f,'festivalScreening',result,'Festival screening');recordTrackingSnapshot(f,'Festival screening');
 const strongest=f.metrics.performances>=f.metrics.direction?'performances':'direction';
 queueStudioMoment(f,'festivalScreening',{kicker:'FESTIVAL NIGHT',title:`The first verdict on ${f.title}`,tone:result==='strong'?'great':result==='poor'?'bad':'neutral',result,summary:result==='strong'?`The screening has created the kind of early critical narrative prestige campaigns are built around.`:result==='mixed'?`The room found admirers, but the film has not emerged with a clean consensus.`:`The first serious public screening has produced difficult notices before release.`,stats:campaignDeltaStats(before,m),sections:[{title:'Inside the room',text:result==='strong'?`The strongest conversation is around the film’s ${strongest}; the reception feels specific rather than generic hype.`:result==='mixed'?'Some critics are defending the film enthusiastically while others are questioning its pacing and payoff. That split may become part of the film’s identity.':'The screening exposed the same weaknesses the campaign hoped early prestige attention would overlook.'},{title:'Campaign consequence',text:m.pending?'The strong notices create a choice: rebuild the campaign around critical approval, or keep the existing sell intact.':result==='poor'?'The commercial campaign now has to work against negative advance conversation rather than simply generate awareness.':'The festival has added texture to the campaign without completely redefining it.'}],choiceContext:m.pending?'marketing':null,choices:m.pending?[['reviews','Put the reviews front and centre · $0.25m'],['protect','Keep the original positioning']]:null});
}
function resolvePublicityMilestone(f){
 const m=ensureMarketingState(f),cast=packageActors(f),d=talentById(f.directorId),r=makeRng(hash(state.seed+'|publicity|'+f.id+'|'+state.week)),before={buzz:m.buzz,sentiment:m.sentiment,expectations:m.expectations};
 const star=cast.reduce((a,b)=>a+b.star,0)/cast.length,rel=cast.reduce((a,b)=>a+b.reliability,0)/cast.length;let result='solid',buzz=0,sent=0,expect=0;
 if(m.publicity==='tour'){const score=star*.28+rel*.22+d.actorDirection*.12+f.metrics.performances*.20+f.metrics.chemistry*.18+(r()-.5)*14;result=score>=79?'excellent':score<61?'awkward':'solid';buzz=result==='excellent'?7:result==='solid'?4:0;sent=result==='excellent'?4:result==='solid'?2:-3;expect=result==='excellent'?4:2}
 else if(m.publicity==='viral'){const score=star*.18+f.metrics.chemistry*.16+scriptById(f.scriptId).hook*.24+r()*42;result=score>=82?'viral':score<55?'flat':'solid';buzz=result==='viral'?10:result==='solid'?4:-1;sent=result==='viral'?3:result==='solid'?1:-1;expect=result==='viral'?6:2}
 else if(m.publicity==='prestige'){const score=festivalPotential(f)*.64+d.craft*.18+scriptById(f.scriptId).originality*.18+(r()-.5)*10;result=score>=78?'excellent':score<62?'flat':'solid';buzz=result==='excellent'?6:result==='solid'?3:0;sent=result==='excellent'?4:result==='solid'?2:0;expect=result==='excellent'?3:1}
 m.buzz+=buzz;m.sentiment+=sent;m.expectations+=expect;m.publicityResult={result,week:state.week};
 campaignMilestoneNews(f,result==='excellent'||result==='viral'?'the publicity push is generating unusually strong coverage and shareable moments.':result==='awkward'?'the press tour has produced several awkward headlines and has done little to help the film.':result==='flat'?'the publicity effort is struggling to create a story beyond the paid campaign.':'the publicity push is doing useful, steady work without becoming a major event.',result==='awkward'?'Trade Report':'Press Release');
 const face=[d,...cast].sort((a,b)=>(b.star||b.craft||0)-(a.star||a.craft||0))[0];rememberPublicMoment(f,'publicity',result,'Publicity week');recordTrackingSnapshot(f,'Publicity week');
 queueStudioMoment(f,'publicity',{kicker:m.publicity==='tour'?'PUBLICITY WEEK':m.publicity==='viral'?'DIGITAL CAMPAIGN':'PROFILE CIRCUIT',title:result==='excellent'||result==='viral'?`${f.title} finds a story beyond the ads`:result==='awkward'||result==='flat'?`${f.title} struggles to own the conversation`:`${f.title} works the circuit`,tone:result==='excellent'||result==='viral'?'great':result==='awkward'||result==='flat'?'warn':'neutral',result,summary:result==='excellent'||result==='viral'?`The campaign has produced coverage people are sharing without the studio having to buy every impression.`:result==='awkward'?`The press tour has generated attention, but not the kind the studio wanted.`:result==='flat'?`The publicity spend is producing coverage without much evidence that audiences care.`:`The publicity plan is doing steady, useful work without becoming the story of the release.`,stats:campaignDeltaStats(before,m),sections:[{title:'Who is carrying the campaign',text:`${face?.name||'The film team'} is drawing the most attention from the current publicity run. The value is not just visibility — it is whether the coverage gives audiences a reason to remember the film.`},{title:'What it means',text:m.expectations>=12?'The film is now entering dangerous expectation territory. Publicity is working, but the finished movie will have to justify the attention.':'The campaign is adding familiarity without yet creating unsustainable hype.'}]});
}
function resolveGalaMilestone(f){
 const m=ensureMarketingState(f),r=makeRng(hash(state.seed+'|gala|'+f.id)),cast=packageActors(f),star=cast.reduce((a,b)=>a+b.star,0)/cast.length,before={buzz:m.buzz,sentiment:m.sentiment,expectations:m.expectations};
 const score=star*.35+f.metrics.technical*.14+f.metrics.performances*.18+f.metrics.direction*.13+(r()-.5)*18,result=score>=76?'hot':score<58?'flat':'solid',venue=campaignVenue(f);
 m.premiere={result,week:state.week,venue};
 if(result==='hot'){m.buzz+=7;m.sentiment+=3;m.expectations+=5;campaignMilestoneNews(f,'the premiere landed as a genuine event, with strong social chatter and enthusiastic first reactions.','Press Release')}
 else if(result==='solid'){m.buzz+=4;m.sentiment+=1;m.expectations+=3;campaignMilestoneNews(f,'the premiere generated healthy attention without changing the film’s trajectory dramatically.','Press Release')}
 else{m.buzz+=1;m.expectations+=2;campaignMilestoneNews(f,'the expensive premiere produced plenty of photographs but little meaningful momentum.','Trade Report')}
 rememberPublicMoment(f,'gala',result,'World premiere');recordTrackingSnapshot(f,'World premiere');
 queueStudioMoment(f,'gala',{kicker:'WORLD PREMIERE',title:`${f.title} steps onto the carpet`,tone:result==='hot'?'great':result==='flat'?'warn':'neutral',result,summary:result==='hot'?`The premiere has landed as a real cultural event rather than an expensive photo call.`:result==='solid'?`The night did its job: the film looks important, the coverage is healthy and release week has a little more energy.`:`The room looked expensive, but the wider conversation never really arrived.`,stats:[['Venue',venue],...campaignDeltaStats(before,m)],sections:[{title:'The room',text:result==='hot'?`Arrival coverage, cast attention and first-reaction chatter all aligned. The film leaves ${venue.split(' · ')[0]} hotter than it entered.`:result==='flat'?`The event delivered photographs and controlled access, but very little organic conversation survived beyond the carpet.`:`The premiere generated a credible sense of occasion without overwhelming the rest of the campaign.`},{title:'Release-week pressure',text:m.expectations>=14?'Expectations are now extremely high. A strong opening is likely; the danger is whether audience reaction can sustain it.':'The premiere has increased awareness without completely exhausting the film’s room to surprise people.'}]});
}
function updateMarketingCampaign(f,throughDay=null){
 const m=ensureMarketingState(f);if(!m.committed)return;
 if(typeof ensureFilmCalendar==='function')ensureFilmCalendar(f);
 const day=throughDay??(typeof currentCalendarDay==='function'?currentCalendarDay():state.week*7);
 m.milestones.filter(x=>!x.resolved&&((x.day??x.week*7)<=day)).forEach(x=>{
  if(x.type==='trailer')resolveTrailerMilestone(f);
  else if(x.type==='festivalDecision')resolveFestivalDecision(f);
  else if(x.type==='festivalScreening')resolveFestivalScreening(f);
  else if(x.type==='publicity')resolvePublicityMilestone(f);
  else if(x.type==='gala')resolveGalaMilestone(f);
  x.resolved=true;
 });
}
function resolveMarketingIntervention(f,choice,suppressRender=false){
 const m=ensureMarketingState(f),p=m.pending;if(!p)return;
 let cost=0;
 if(p.type==='viralTrailer'){
  if(choice==='amplify'){cost=.35;m.buzz+=5;m.expectations+=4;campaignMilestoneNews(f,'the studio increased digital spend to amplify the trailer breakout.','Press Release')}
  else{m.sentiment+=1;campaignMilestoneNews(f,'the studio resisted chasing the viral moment and kept the existing campaign intact.','Trade Report')}
 }else if(p.type==='softTrailer'){
  if(choice==='recut'){cost=.45;m.buzz+=4;m.sentiment+=3;m.expectations+=1;campaignMilestoneNews(f,'a replacement trailer shifted the campaign emphasis and steadied the response.','Press Release')}
  else if(choice==='double'){cost=.30;m.buzz+=3;m.expectations+=5;m.sentiment-=1;campaignMilestoneNews(f,'the studio doubled down on the original sell despite the soft first response.','Trade Report')}
  else{m.expectations=Math.max(0,m.expectations-1);campaignMilestoneNews(f,'the studio accepted the soft trailer response and preserved the remaining campaign budget.','Trade Report')}
 }else if(p.type==='festivalPraise'){
  if(choice==='reviews'){cost=.25;m.buzz+=4;m.expectations+=3;m.sentiment+=2;campaignMilestoneNews(f,'festival pull-quotes and critical notices are now front and centre in the campaign.','Press Release')}
  else{m.sentiment+=1;campaignMilestoneNews(f,'the studio kept the festival praise as supporting evidence rather than repositioning the release.','Trade Report')}
 }
 if(cost>0){
  if(!spend(cost))return false;
  f.investment+=cost;
 }
 m.interventionUsed=true;m.pending=null;save();if(!suppressRender)render();return true;
}
function campaignExpectationPenalty(f,delivery){
 const m=ensureMarketingState(f),promise=trailerPromiseScore(f,m.trailer);
 const earned=Math.max(0,(promise-60)*.20)+Math.max(0,(delivery-65)*.10);
 return Math.max(0,m.expectations-earned)*.42;
}
function campaignSummaryText(f){
 const m=ensureMarketingState(f),s=marketingPublicStatus(f),parts=[];
 if(m.trailerResult)parts.push(`Trailer: ${m.trailerResult.result}`);
 if(m.festival?.screened)parts.push(`Festival: ${m.festival.result}`);
 if(m.publicityResult)parts.push(`Publicity: ${m.publicityResult.result}`);
 if(m.premiere)parts.push(`Premiere: ${m.premiere.result}`);
 return parts.length?parts.join(' · '):`${s.heat} public heat`;
}
function aiCampaignPulse(f){
 if(f.owner==='player'||f.aiCampaignPublicized)return;
 const weeks=(f.releaseWeek||999)-state.week;if(weeks>3||weeks<1)return;
 const r=makeRng(hash(state.seed+'|ai-campaign|'+f.id));
 if(r()>.32)return;
 f.aiCampaignPublicized=true;
 const angle=f.campaign==='event'?'launches an event-scale campaign':f.campaign==='mystery'?'leans into a deliberately cryptic trailer':'releases its first full trailer';
 addNews(state,`${f.studio} ${angle} for ${f.title}, due in Week ${f.releaseWeek}.`,'Press Release');
}


function aiScriptScore(rv,s){
 ensureScriptEcosystem(s);
 const p=rv.profile||aiStudioProfile(rv.style),genre=p.genres.includes(s.genre)?8:-4;
 let creative;
 if(rv.style.includes('Prestige'))creative=s.story*.22+s.characters*.15+s.emotion*.13+s.originality*.20+s.structure*.12+s.hook*.08-s.difficulty*.04;
 else if(rv.style==='Genre Specialist')creative=s.hook*.21+s.genreFulfillment*.18+s.story*.16+s.originality*.14+s.structure*.12+s.access*.10-s.difficulty*.035;
 else if(rv.style==='Indie / Prestige')creative=s.story*.20+s.characters*.15+s.emotion*.13+s.originality*.18+s.structure*.11+s.hook*.09-s.difficulty*.03;
 else creative=s.hook*.22+s.access*.17+s.structure*.13+s.story*.14+s.genreFulfillment*.12+s.originality*.09-s.difficulty*.03;
 const baseCap={'Psychological Horror':11,'Prestige Drama':13,'Crime Thriller':16,'Comedy':17,'Family Adventure':23,'Action Thriller':28,'Science Fiction':31,'Fantasy':29}[s.genre]||20;
 const conceptLift=clamp(((s.hook+s.access)-120)/80,-.12,.22),styleScale=rv.style==='Indie / Prestige'?.68:rv.style==='Prestige'?.80:rv.style==='Genre Specialist'?.82:1,target=baseCap*styleScale*(1+conceptLift);
 const scalePenalty=Math.max(0,s.naturalBudget-target)*1.05;
 return creative+genre-scalePenalty-s.price*3.2+industryGenreSignal(s.genre)*.65;
}
function aiFinanceTurnaround(rv,total,confidence){
 const t=aiTreasurySnapshot(rv),status=aiFinancialHealth(rv);
 if(status==='Financial distress')return false;
 const floor=Math.max(2.5,t.reserve*.20);
 if(total/Math.max(1,rv.cash)<=.70 && rv.cash-total>=floor){rv.cash-=total;return true}
 const room=Math.max(0,(rv.profile.maxDebt||20)-(rv.debt||0)),short=Math.max(0,total+floor-rv.cash);
 if(total<=10&&short>0&&short<=Math.min(status==='Stable'?8:6,room)){rv.cash+=short;rv.debt+=short*1.04;rv.cash-=total;addNews(state,`${rv.name} used a small co-financing facility to restart its production pipeline.`,'Trade Finance');return true}
 return aiFinanceProject(rv,total,confidence);
}
function aiStartProjects(){
 const r=makeRng(hash(state.seed+'|ai|'+state.week));
 state.rivals.forEach(rv=>{
  rv.profile=rv.profile||aiStudioProfile(rv.style);rv.debt=rv.debt||0;
  const pipeline=state.films.filter(f=>f.owner===rv.id&&!['complete','shelved'].includes(f.stage));
  const pressure=aiFinancialHealth(rv),treasury=aiTreasurySnapshot(rv),idleWeeks=state.week-(rv.lastGreenlightWeek||1);
  const turnaround=treasury.production===0&&((idleWeeks>=5&&['Under pressure','Leveraged'].includes(pressure))||(idleWeeks>=9&&['Stable','Financially strong','Cash-rich'].includes(pressure)));
  const chanceByHealth={'Financial distress':.01,'Under pressure':.10,'Leveraged':.24,'Stable':.36,'Financially strong':.43,'Cash-rich':.48};
  let startChance=(chanceByHealth[pressure]??.28)+(rv.profile.risk-.5)*.08;
  if(treasury.production>=rv.capacity)startChance=0;
  if(treasury.production===0&&treasury.available>treasury.plannedFilm*.35)startChance+=.10;
  if(idleWeeks>=6&&pressure!=='Financial distress')startChance=Math.max(startChance,.58);
  if(turnaround)startChance=Math.max(startChance,.78);
  if(idleWeeks>=10&&['Stable','Financially strong','Cash-rich'].includes(pressure))startChance=Math.max(startChance,.82);
  if(idleWeeks>=14&&treasury.production===0&&['Stable','Financially strong','Cash-rich'].includes(pressure))startChance=1;
  if(idleWeeks>=14&&turnaround)startChance=Math.max(startChance,.90);
  if(treasury.nearRelease>2&&treasury.available<treasury.plannedFilm*.22)startChance*=.72;
  if(pipeline.length>=rv.capacity+5&&treasury.production>0)return;
  if(r()>startChance)return;

  let s=null,scriptCost=0;
  const wanted=aiPreferredGenre(rv,r),ownedScripts=state.scripts.filter(x=>x.owner===rv.id&&!x.filmStarted&&x.status==='owned'&&!x.shelved&&(!x.deferredUntil||x.deferredUntil<=state.week));
  const marketOptions=state.market.map(scriptById).filter(x=>x&&x.available&&!scriptFirstLookActive(x)&&!(typeof ensureScriptMarketState==='function'&&(ensureScriptMarketState(x).auctionClosesWeek||ensureScriptMarketState(x).playerBid)));
  if(turnaround){
   const c=generateScript(state,state.week,false);
   c.source=`${rv.name} Turnaround Development`;c.available=false;c.status='owned';c.owner=rv.id;
   c.genre=rv.profile.genres.includes(c.genre)?c.genre:wanted;
   c.naturalBudget=+(2.6+r()*1.5).toFixed(1);ensureScriptEcosystem(c);
   s=c;scriptCost=+(.28+r()*.34).toFixed(2);
   if(idleWeeks>=10)addNews(state,`${rv.name} is pivoting to a lower-cost ${c.genre.toLowerCase()} project after a quiet stretch in its production pipeline.`,'Trade Report');
  }else if(ownedScripts.length){
   ownedScripts.sort((a,b)=>aiScriptScore(rv,b)-aiScriptScore(rv,a));s=ownedScripts[0];scriptCost=0;
  }else if(marketOptions.length&&r()<.42){
   const scored=marketOptions.map(x=>({x,score:aiScriptScore(rv,x)+(r()-.5)*(14-rv.skill*.08)})).sort((a,b)=>b.score-a.score);
   s=scored[0].x;scriptCost=s.price;
  }else{
   const candidates=[];
   for(let n=0;n<5;n++){
    const c=generateScript(state,state.week,false);c.source=`${rv.name} Development`;c.available=false;c.status='owned';c.owner=rv.id;ensureScriptEcosystem(c);
    if(!rv.profile.genres.includes(c.genre)&&r()<.72)c.genre=wanted;
    if(rv.style==='Indie / Prestige')c.naturalBudget=+Math.min(c.naturalBudget,5+r()*7).toFixed(1);
    else if(rv.style==='Prestige')c.naturalBudget=+Math.min(c.naturalBudget,7+r()*8).toFixed(1);
    else if(rv.style==='Genre Specialist')c.naturalBudget=+Math.min(c.naturalBudget,7+r()*10).toFixed(1);
    candidates.push(c);
   }
   candidates.sort((a,b)=>aiScriptScore(rv,b)-aiScriptScore(rv,a));s=candidates[0];
   candidates.slice(1).forEach(c=>{c.shelved=true});
   scriptCost=+(.38+r()*.52).toFixed(2);
  }

  ensureScriptEcosystem(s);
  const sunkRightsCost=(s.owner===rv.id&&s.acquisitionCost)?s.acquisitionCost:0;
  const natural=s.naturalBudget;
  let budget=natural*rv.profile.budget*(.88+r()*.22);
  if(pressure==='Leveraged')budget*=.92;
  if(pressure==='Under pressure')budget*=.74;
  if(pressure==='Financial distress')budget*=.60;
  if(turnaround)budget=Math.min(budget,4.0);
  budget=+clamp(budget,3,48).toFixed(1);

  const creative=aiCreativeBrief(rv,s.genre);
  const preview={scriptId:s.id,genre:s.genre,budget,creative};
  let directors=state.talent.filter(t=>t.type==='Director'&&!t.retired&&!busy(t)&&!playerTalentCommitment(t.id));
  if(turnaround)directors=[...directors].sort((a,b)=>a.fee-b.fee).slice(0,Math.min(8,directors.length));
  const d=aiSelectCandidate(directors,t=>{
    const fit=directorProjectFit(t,preview),costPenalty=t.fee*(5.5+rv.profile.cost*4);
    const prestige=(rv.style.includes('Prestige')?t.craft*.07:t.commercial*.035);
    return fit+prestige-costPenalty;
  },r);
  if(!d)return;

  let actors=state.talent.filter(t=>t.type==='Actor'&&!t.retired&&!busy(t)&&!playerTalentCommitment(t.id));
  if(turnaround)actors=[...actors].sort((a,b)=>a.fee-b.fee).slice(0,Math.min(16,actors.length));
  const parentCast=s.ipParentFilmId?(filmById(s.ipParentFilmId)?.cast||[]):[],continuityMode=s.franchiseMode||'sequel';
  const a1=aiSelectCandidate(actors,t=>{
    const fit=actorProjectFit(t,preview),starBias=creative.positioning==='commercial'?t.star*.055:t.acting*.045;
    const continuity=parentCast.includes(t.id)&&!['reboot','spinoff'].includes(continuityMode)?11:0;
    return fit+starBias+continuity-t.fee*(5+rv.profile.cost*4.5);
  },r);
  if(!a1)return;
  const a2=aiSelectCandidate(actors.filter(a=>a.id!==a1.id),t=>{
    const fit=actorProjectFit(t,preview),starBias=creative.positioning==='commercial'?t.star*.04:t.acting*.055;
    const continuity=parentCast.includes(t.id)&&!['reboot','spinoff'].includes(continuityMode)?9:0;
    return fit+starBias+continuity-t.fee*(5.5+rv.profile.cost*4.5);
  },r);
  if(!a2)return;

  const rec=Math.max(3,budget*.50);
  let marketing=rec*rv.profile.marketing*(.78+r()*.32);
  if(pressure==='Leveraged')marketing*=.90;
  if(pressure==='Under pressure')marketing*=.64;
  if(pressure==='Financial distress')marketing*=.42;
  marketing=+Math.max(.6,marketing).toFixed(1);
  const releaseOps=+(Math.max(1,budget*.045)+marketing*.035).toFixed(1);
  const productionCommit=+(scriptCost+budget+d.fee+a1.fee+a2.fee).toFixed(2);
  const confidence=aiProjectConfidence(rv,s,d,a1,a2,preview);

  const financed=turnaround?aiFinanceTurnaround(rv,productionCommit,confidence):aiFinanceProject(rv,productionCommit,confidence);
  if(!financed){
   s.financeFails=(s.financeFails||0)+1;s.deferredUntil=state.week+(s.financeFails>=2?6:3);
   if(s.financeFails>=2&&s.owner===rv.id&&!s.filmStarted){
    if(typeof maybeListTurnaround==='function'){if(!maybeListTurnaround(s,rv,'the financing package failed twice'))s.shelved=true}else s.shelved=true;
   }
   addNews(state,`${rv.name} has deferred a planned ${s.genre.toLowerCase()} package rather than repeatedly overextend. The studio will consider other material in the meantime.`,'Trade Finance');
   return;
  }

  s.filmStarted=true;s.status='filming';s.owner=rv.id;
  if(state.market.includes(s.id)){
   s.available=false;s.status='filming';s.owner=rv.id;s.filmStarted=true;s.bids=(s.bids||0)+1;state.market=state.market.filter(id=>id!==s.id);
   if(typeof ensureScriptMarketState==='function')ensureScriptMarketState(s).status='sold';
   if(typeof screenplayRecordSale==='function')screenplayRecordSale(s,rv.id,scriptCost,'direct-ai');
   addNews(state,`${rv.name} acquired ${s.title} from the open script market for about ${money(scriptCost)}.`,'Script Market');
  }

  const f={id:uid('film',state),owner:rv.id,studio:rv.name,title:s.title,genre:s.genre,scriptId:s.id,directorId:d.id,cast:[a1.id,a2.id],ipParentId:s.ipParentFilmId||null,franchiseMode:s.franchiseMode||null,franchiseRootId:s.franchiseRootId||null,sequelInstallment:s.sequelInstallment||null,
   stage:'production',creative,budget,marketing:marketing,campaign:rv.profile.campaign,releaseOps,productionStart:state.week,
   releaseWeek:null,productionEnd:null,aiQuality:0,aiStar:0,aiFit:null,metrics:null,releaseFunded:false,cinemaWeek:0,weeklyPlan:[],weeklyResults:[],
   studioRevenue:0,investment:productionCommit+sunkRightsCost,review:null,finalGross:0,estimatedProfit:0,scriptCost:scriptCost+sunkRightsCost,aiTalentMarketValue:+(d.fee+a1.fee+a2.fee).toFixed(2),aiGreenlightCost:productionCommit,aiFinanceModel:'v4.0a.3',aiFinancialFinalized:false};
  f.distributionStrategy=aiDistributionStrategy(rv,f);if(f.distributionStrategy==='partner')f.distributorName=distributionPartnerName(f);

  const dFit=directorProjectFit(d,f),aFits=[actorProjectFit(a1,f),actorProjectFit(a2,f)],fitAvg=(dFit+aFits[0]+aFits[1])/3;
  const ratio=budget/natural,budgetFactor=ratio<.6?.44:ratio<.8?.66:ratio<.92?.84:ratio<=1.15?1:1+Math.min(.035,(ratio-1.15)*.035);
  const actorFitAvg=(aFits[0]+aFits[1])/2,avgAct=(a1.acting+a2.acting)/2;
  const fitDirection=(dFit-65)*.34,fitPerformance=(actorFitAvg-65)*.34;
  f.metrics={
   direction:clamp((d.craft+(d.genres.includes(f.genre)?4:-5))*budgetFactor+fitDirection+(r()-.5)*10,24,97),
   performances:clamp((avgAct*.70+d.actorDirection*.25)*budgetFactor+fitPerformance+(r()-.5)*12,24,98),
   technical:clamp((45+d.budgetControl*.26+s.difficulty*.13)*budgetFactor+(dFit-65)*.10+(r()-.5)*14,20,96),
   pacing:clamp(58+s.access*.19+(d.commercial-70)*.10+(dFit-65)*.10+(r()-.5)*27,24,95),
   clarity:clamp(s.story*.75+d.craft*.11+(dFit-65)*.08+(r()-.5)*16,26,97),
   chemistry:clamp(40+avgAct*.25+d.actorDirection*.18+(actorFitAvg-65)*.22+(r()-.5)*26,22,96),
   stability:clamp(((a1.reliability+a2.reliability)/2)*.50+d.budgetControl*.28-(Math.max(0,budget-directorScaleComfort(d))*.45)+(r()-.5)*12,22,97)
  };
  if(creative.positioning==='prestige'){f.metrics.direction+=3;f.metrics.clarity+=2;f.metrics.pacing-=1}
  if(creative.positioning==='commercial'){f.metrics.pacing+=3;f.metrics.clarity-=1}
  if(creative.tone==='grounded'){f.metrics.direction+=2;f.metrics.performances+=2;f.metrics.technical-=1}
  if(creative.tone==='heightened'){f.metrics.technical+=2;f.metrics.pacing+=2;f.metrics.clarity-=1}
  if(creative.emphasis==='performance'){f.metrics.performances+=5;f.metrics.technical-=2}
  if(creative.emphasis==='spectacle'){f.metrics.technical+=5;f.metrics.performances-=2;if(ratio<.9)f.metrics.technical-=6}
  Object.keys(f.metrics).forEach(k=>f.metrics[k]=clamp(f.metrics[k],20,98));
  f.aiQuality=clamp(s.story*.15+s.originality*.09+f.metrics.direction*.17+f.metrics.performances*.22+f.metrics.technical*.11+f.metrics.pacing*.12+f.metrics.clarity*.14,18,97);
  f.aiStar=clamp(((a1.star+a2.star)/2)*clamp(.67+actorFitAvg/210,.72,1.10),18,98);
  f.aiFit={director:dFit,actors:aFits,average:fitAvg};

  const duration=5+Math.round(s.difficulty/27)+(budget>32?1:0);
  f.productionEnd=state.week+duration;
  f.releaseWeek=null;

  d.busyUntil=f.productionEnd+1;a1.busyUntil=f.productionEnd+1;a2.busyUntil=f.productionEnd+1;
  state.films.push(f);rv.films.push(f.id);rv.lastGreenlightWeek=state.week;
  addNews(state,`${rv.name} greenlit ${f.title} with ${d.name} directing and ${a1.name} starring.`,'Press Release');
 });
}
function aiPublicityCost(f){
 // Match the scale of equivalent player publicity + launch choices rather than charging an AI-only percentage of production budget.
 if(f?.campaign==='event')return 1.25;
 if(f?.campaign==='authentic')return .70;
 if(f?.campaign==='mystery')return .35;
 return .55;
}


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

function aiFundRelease(f,rv){
 if(f.releaseFunded)return true;
 const p=rv.profile||aiStudioProfile(rv.style),confidence=clamp((f.aiQuality||60)*.58+(f.aiFit?.average||60)*.24+(scriptById(f.scriptId).hook||60)*.18,20,96);
 ensureDistributionState(f);let marketing=f.marketing||0;f.marketing=marketing;let plan=distributionPlan(f,rv),ops=plan.opsCost,publicity=aiPublicityCost(f),total=marketing+ops+publicity;
 const reserve=Math.max(4,aiStudioOverhead(rv)*6);
 if(rv.cash-total<reserve){
  const affordable=Math.max(.6,rv.cash-reserve-Math.max(1,f.budget*.045));
  if(affordable<marketing){marketing=+Math.max(.6,affordable).toFixed(1);f.marketing=marketing;plan=distributionPlan(f,rv);ops=plan.opsCost;total=marketing+ops+publicity}
 }
 if(rv.cash<total){
  const room=Math.max(0,(p.maxDebt||20)-(rv.debt||0)),short=total-rv.cash+2;
  if(confidence>=p.borrowQuality-4&&short<=room){rv.cash+=short;rv.debt+=short*1.05}
 }
 if(rv.cash<total){
  marketing=.6;f.marketing=marketing;plan=distributionPlan(f,rv);ops=plan.opsCost;publicity=+Math.max(.25,aiPublicityCost(f)*.55).toFixed(2);total=marketing+ops+publicity;
 }
 if(rv.cash<total)return false;
 rv.cash-=total;f.marketing=marketing;f.releaseOps=ops;f.distributionDeal={...plan,committedWeek:state.week};f.aiPublicity=publicity;f.investment+=total;f.releaseFunded=true;
 const rec=Math.max(3,f.budget*.50),leadRatio=marketing/Math.max(1,rec);
 let lead=leadRatio<.28?2:leadRatio<.68?4:leadRatio<1.15?6:9;
 if(f.campaign==='event')lead+=2;if(f.campaign==='mystery')lead=Math.max(2,lead-1);
 const rr=makeRng(hash(state.seed+'|aireleaseplan|'+f.id)),earliest=state.week+lead;
 const releaseChoice=aiChooseReleaseWeek(f,rv,earliest,6);f.releaseWeek=releaseChoice.week;
 f.aiReleasePlan={initialWeek:f.releaseWeek,label:releaseChoice.label,pressure:releaseChoice.snap.score,revisions:[],lastReviewedWeek:state.week};
 return true;
}
function aiFinishingCost(f){
 // Player picture lock requires music/finishing spend, but not the previous AI-only 20%-of-budget surcharge.
 return +(.55+Math.min(1.15,(f?.budget||0)*.024)).toFixed(2);
}

function advanceAI(){
 const r=makeRng(hash(state.seed+'|aitick|'+state.week));
 state.films.filter(f=>f.owner!=='player').forEach(f=>{
  const rv=rivalById(f.owner);
  if(f.stage==='production'&&state.week>=f.productionEnd){
   if(!f.aiOverrunFinalized){
    const d=talentById(f.directorId),s=scriptById(f.scriptId);
    const raw=(s.difficulty-(d?.budgetControl||72))*.0025+(r()-.54)*.10;
    const overrun=+Math.max(-f.budget*.025,Math.min(f.budget*.11,f.budget*raw)).toFixed(2);
    if(overrun>0){
     if(rv.cash>=overrun)rv.cash-=overrun;
     else{const short=overrun-rv.cash;rv.cash=0;rv.debt+=short*1.07}
     f.investment+=overrun;
     if(overrun>1.2)addNews(state,`${f.studio}'s ${f.title} wrapped after an estimated ${money(overrun)} production overrun.`,'Trade Report');
    }else if(overrun<0){
     const saving=Math.abs(overrun);f.investment=Math.max(0,f.investment-saving);rv.cash+=saving*.35;
    }
    f.aiOverrunFinalized=true;
   }
   if(!f.aiFinishingFunded){
    const finishCost=aiFinishingCost(f);if(rv.cash>=finishCost)rv.cash-=finishCost;else{const short=finishCost-rv.cash;rv.cash=0;rv.debt+=short*1.05}f.investment+=finishCost;f.aiFinishingCost=finishCost;f.aiFinishModel='parity-v4003';f.aiFinishingFunded=true;
   }
   if(f.metrics){
    const swing=(r()-.5)*12;f.metrics.direction=clamp(f.metrics.direction+swing*.35,20,98);f.metrics.performances=clamp(f.metrics.performances+swing*.45,20,98);f.metrics.technical=clamp(f.metrics.technical+swing*.30,20,98);
    const ss=scriptById(f.scriptId);f.aiQuality=clamp(ss.story*.15+ss.originality*.09+f.metrics.direction*.17+f.metrics.performances*.22+f.metrics.technical*.11+f.metrics.pacing*.12+f.metrics.clarity*.14,18,97);
   }
   if(aiFundRelease(f,rv)){
    f.stage='scheduled';
    addNews(state,`${f.studio} dated ${f.title} for Week ${f.releaseWeek} after committing its release campaign.`,'Release Calendar');
   }
  }
  // Scheduled releases and theatrical weekends are advanced by the daily calendar so every studio settles the same weekend together.
 });
}
function releaseAIFilm(f){
 const r=makeRng(hash(state.seed+'|airelease|'+f.id)),s=scriptById(f.scriptId),d=talentById(f.directorId),cast=(f.cast||[]).map(talentById).filter(Boolean),m=f.metrics;
 const c=f.creative||defaultCreative(),dFit=f.aiFit?.director??directorProjectFit(d,f),aFits=f.aiFit?.actors??cast.map(a=>actorProjectFit(a,f)),fitAvg=(aFits[0]+aFits[1])/2;
 const fallback=f.aiQuality||68,mm=m||{direction:fallback,performances:fallback,technical:fallback,pacing:fallback,clarity:fallback,chemistry:fallback,stability:68};
 const quality=clamp(s.story*.15+s.originality*.09+mm.direction*.17+mm.performances*.22+mm.technical*.11+mm.pacing*.12+mm.clarity*.14,18,97);
 let criticBias=(c.positioning==='prestige'?3:c.positioning==='commercial'?-1:0)+(c.tone==='grounded'?1:0)+(dFit<48?-3:0);
 let audienceBias=(c.positioning==='commercial'?3:c.positioning==='prestige'?-2:0)+(fitAvg<48?-4:fitAvg>82?2:0);
 if(c.rating==='broad')audienceBias+=3;
 if(c.rating==='mature'){audienceBias-=3;if(f.genre.includes('Horror')||f.genre.includes('Crime')||f.genre.includes('Drama'))audienceBias+=4}
 if(c.emphasis==='spectacle'&&(f.genre.includes('Action')||f.genre.includes('Science')||f.genre.includes('Fantasy')))audienceBias+=2;
 let critics=clamp(quality*.75+s.originality*.15+s.story*.10+criticBias+(r()-.5)*12,14,98);
 let audience=clamp(mm.performances*.20+mm.pacing*.17+mm.clarity*.17+s.access*.15+s.hook*.13+mm.direction*.18+audienceBias+(r()-.5)*12,16,97);
 const audienceContext=audienceReleaseContext(f,audience),franchiseContext=franchiseReleaseContext(f);audience=clamp(audience-franchiseContext.audiencePenalty,10,98);f.audienceSegments=audienceContext.segments;registerMarketRelease(f);
 const rawStar=cast.reduce((a,b)=>a+b.star,0)/cast.length,momentum=cast.reduce((a,b)=>a+b.momentum,0)/cast.length;
 const effectiveStar=rawStar*clamp(.67+fitAvg/210,.72,1.10),rec=Math.max(3,f.budget*.50),mEff=Math.log1p(f.marketing)/Math.log1p(rec);
 let awareness=1+effectiveStar*.064+momentum*.026+s.hook*.064+mEff*31+(c.positioning==='commercial'?3:c.positioning==='prestige'?-2:0)+(c.rating==='broad'?2:c.rating==='mature'?-1:0);
 const campaignStrength=clamp(f.marketing/Math.max(1,rec),0,1.25);
 if(f.campaign==='event')awareness+=5*Math.min(1,campaignStrength);
 if(f.campaign==='mystery')awareness+=(1+(r()-.5)*5)*Math.min(1,campaignStrength+.15);
 if(f.campaign==='event'&&campaignStrength>.55&&audience<72)audience-=Math.min(11,(72-audience)*.43*campaignStrength);
 awareness+=audienceContext.openingLift+franchiseContext.awarenessLift+distributionAwarenessLift(f);
 const pressure=boxPressureForWeek(f.releaseWeek,f.genre,f.id)*distributionPressureMultiplier(f),ratio=f.budget/s.naturalBudget,scale=.72+Math.sqrt(Math.max(.48,ratio))*.27;
 let opening=clamp((awareness*.34+s.hook*.08+effectiveStar*.028-9.6)*scale*(1-pressure)*(1+releaseWindowOpeningModifier(f))*distributionOpeningMultiplier(f),.08,88);
 const intlMult=f.genre.includes('Action')||f.genre.includes('Science')||f.genre.includes('Fantasy')?1.38:f.genre.includes('Horror')?1.0:f.genre.includes('Family')?1.13:.72;
 const releaseProfile=releaseOutcomeProfile(f,audience,awareness,r);releaseProfile.legsBias+=distributionLegsBias(f);const run=buildTheatricalRun(f,opening,audience,audienceContext,r,intlMult,releaseProfile);
 f.releaseProfile=run.profile;f.weeklyPlan=run.plan;f.review={critics:Math.round(critics),audience:Math.round(audience)};
 f.aiQuality=quality;f.stage='cinema';f.weeklyResults=[];f.cinemaWeek=0;addAICinemaWeek(f);
}
function finishAIFilm(f){
 if(f.aiFinancialFinalized)return;
 f.stage='complete';f.completeWeek=state.week;f.completeDay=typeof currentCalendarDay==='function'?currentCalendarDay():null;f.finalGross=f.weeklyResults.reduce((a,w)=>a+w.dom+w.intl,0);
 const theatrical=f.weeklyResults.reduce((a,w)=>a+theatricalStudioRevenue(f,w),0);
 const post=f.finalGross*ancillarySettlementRate();
 f.ancillarySettlement=post;f.studioRevenue=theatrical+post;f.estimatedProfit=f.studioRevenue-f.investment;f.aiFinancialFinalized=true;
 const rv=rivalById(f.owner);
 if(rv){
  rv.cash+=f.studioRevenue;
  rv.commercialHistory=rv.commercialHistory||[];
  rv.commercialHistory.unshift({filmId:f.id,week:state.week,profit:f.estimatedProfit,gross:f.finalGross});
  if(rv.debt>0){
   const t=aiTreasurySnapshot(rv);
   if(rv.cash>t.reserve+6){
     const repay=Math.min(rv.debt,Math.max(0,(rv.cash-(t.reserve+5))*.40));
     rv.cash-=repay;rv.debt-=repay;
    }
  }
 }
 ensureIPAsset(f);ensureAfterlifeState(f);registerAudienceOutcome(f,f.estimatedProfit);registerStudioFilmImpact(f,f.estimatedProfit);maybeGenerateAISequel(f,rv);
 const result=f.estimatedProfit>15?'a major profit':f.estimatedProfit>3?'a profit':f.estimatedProfit>.5?'a minor profit':f.estimatedProfit>-.5?'roughly break-even':f.estimatedProfit>-4?'a minor loss':f.estimatedProfit>-15?'a loss':'a major loss';
 addNews(state,`${f.studio}'s ${f.title} closes at ${money(f.finalGross)} worldwide, an estimated ${result}.`,'Trade Report');
}
function addAICinemaWeek(f){
 const row=f.weeklyPlan[f.weeklyResults.length];if(!row){finishAIFilm(f);return}
 const actual=deep(row);actual.worldWeek=state.week;f.weeklyResults.push(actual);f.cinemaWeek=f.weeklyResults.length;
 if(f.cinemaWeek>=7||row.dom+row.intl<.35)f.pendingTheatricalFinish=true;
}


function ageAndCareers(){advanceTalentCareers()}

function addNewTalent(r){
 const type=r()<.75?'Actor':'Director',name=pick(r,firstNames)+' '+pick(r,lastNames),id=(type==='Actor'?'A':'D')+(state.talent.length+1);
 if(type==='Actor')state.talent.push({id,type,name,isRealPerson:false,realCredits:[],acting:Math.round(64+r()*25),star:Math.round(12+r()*28),momentum:Math.round(45+r()*35),reliability:Math.round(55+r()*35),fee:+(.2+r()*1.2).toFixed(2),genres:[pick(r,genres),pick(r,genres)],tag:'Newcomer',age:20+Math.floor(r()*12),busyUntil:0,retired:false,credits:[],relationship:0,careerState:'Newcomer'});
 else state.talent.push({id,type,name,isRealPerson:false,realCredits:[],craft:Math.round(68+r()*22),commercial:Math.round(52+r()*35),budgetControl:Math.round(55+r()*35),actorDirection:Math.round(60+r()*34),fee:+(.4+r()*1.6).toFixed(2),genres:[pick(r,genres),pick(r,genres)],tag:'New Director',age:28+Math.floor(r()*15),busyUntil:0,retired:false,credits:[],relationship:0,careerState:'Newcomer'});
 addNews(state,`${name} has begun attracting industry attention as a new ${type.toLowerCase()}.`);
}

function rotateMarket(){
 if(state.week-state.lastRotation<4)return;
 state.lastRotation=state.week;
 const r=makeRng(hash(state.seed+'|market|'+state.week));
 const visible=state.market.map(scriptById).filter(Boolean);
 visible.forEach(s=>{
  ensureScriptEcosystem(s);const appeal=scriptMarketAppeal(s);
  if(appeal>69&&r()<.46)s.bids=clamp((s.bids||0)+1,0,4);
  else if((s.bids||0)>0&&r()<.30)s.bids=Math.max(0,s.bids-1);
 });
 if(visible.length>5){const removable=visible.filter(x=>!scriptFirstLookActive(x));if(removable.length){const remove=pick(r,removable);remove.available=false;state.market=state.market.filter(id=>id!==remove.id);addNews(state,`${remove.title} left the open script market.`)}}
 const n=1+(r()<.35?1:0);for(let i=0;i<n;i++){const s=generateScript(state,state.week,true);const first=maybeGrantFirstLook(s);addNews(state,first?`${s.title} is being shown to ${state.studio.name} on an exclusive first-look basis.`:`New screenplay ${s.title} entered the market.`,'Development')}
}
function updatePlayerFilms(){
 playerFilms().forEach(f=>{
  if(f.stage==='production'){
   f.productionState=f.productionState||{schedule:0,morale:65,extraSpend:0,cleanWeeks:0,notes:[]};
   f.productionWeek=state.week-f.productionStart+1;
   ensureProductionCreativeFork(f);
   recordProductionDaily(f);
   const ev=f.events.find(e=>e.week===f.productionWeek&&!e.resolved);
   if(ev){const prev=f.pendingEvent;f.pendingEvent=ev.id;if(prev!==ev.id)notify(`prod:${f.id}:${ev.id}`,ev.creativeFork?`${f.title}: creative direction`:`${f.title}: production decision`,ev.title,f.id,true,ev.creativeFork?'info':'warning');}
   else if(!f.pendingEvent)f.productionState.cleanWeeks=(f.productionState.cleanWeeks||0)+1;
   if(state.week>=f.productionEnd&&!f.pendingEvent){f.stage='post';ensurePostState(f);makeRoughCut(f);addNews(state,`${f.title} wrapped principal photography.`,'Your Studio');notify(`post:${f.id}`,`${f.title}: rough cut ready`,'Post-production is waiting for your screening and picture-lock decisions.',f.id,true,'info')}
  }
 });
}
function rebuildDecisions(){
 const d=[];
 playerFilms().forEach(f=>{
  if(f.stage==='development'&&f.paused)return;
  if(f.stage==='development'&&!f.directorId)d.push({filmId:f.id,type:'development',text:'Director not attached'});
  else if(f.stage==='development'&&f.cast.length<2)d.push({filmId:f.id,type:'casting',text:'Principal cast incomplete'});
  else if(f.stage==='development'&&f.directorId&&f.cast.length===2&&!allContractsAgreed(f))d.push({filmId:f.id,type:'contracts',text:'Talent terms need to be agreed'});
  else if(f.stage==='development'&&f.directorId&&f.cast.length===2)d.push({filmId:f.id,type:'greenlight',text:'Ready for greenlight review'});
  if(f.stage==='production'&&f.pendingEvent){const e=f.events.find(x=>x.id===f.pendingEvent);d.push({filmId:f.id,type:'production',text:e?e.title:'Production decision'})}
  if(f.stage==='post'){
   const p=ensurePostState(f),remaining=p.maxActions-p.actions.length;
   d.push({filmId:f.id,type:'post',text:`Rough cut ready · ${remaining} major post intervention${remaining===1?'':'s'} available`});
  }
  if(f.stage==='marketing')d.push({filmId:f.id,type:'marketing',text:'Campaign and release date required'});
  if(f.stage==='scheduled'&&f.marketingState?.pending)d.push({filmId:f.id,type:'campaign',text:f.marketingState.pending.title});
 });
 state.decisions=d;
}
function generateIndustryPress(){
 const r=makeRng(hash(state.seed+'|press|'+state.week));
 const upcoming=state.films.filter(f=>['scheduled','production'].includes(f.stage)&&f.releaseWeek&&f.releaseWeek>state.week&&f.releaseWeek-state.week<=5);
 upcoming.forEach(f=>{
  if(f.pressAnnounced||r()>.24)return;f.pressAnnounced=true;
  const d=f.directorId?talentById(f.directorId):null,lead=f.cast&&f.cast.length?talentById(f.cast[0]):null;
  const who=[d?d.name:null,lead?lead.name:null].filter(Boolean).join(' and ');
  addNews(state,`${f.studio||state.studio.name} unveils a first look at ${f.title}${who?' with '+who:''}, ahead of its Week ${f.releaseWeek} release.`,'Press Release');
 });
 const hot=state.talent.filter(t=>t.type==='Actor'&&!t.retired&&t.momentum>=88).sort((a,b)=>b.momentum-a.momentum)[0];
 if(hot&&r()<.12)addNews(state,`${hot.name} is becoming one of the industry’s most sought-after performers after a sustained run of strong momentum.`,'Talent Watch');
 const big=state.films.filter(f=>f.stage==='production'&&f.budget>=32);
 if(big.length&&r()<.15){const f=pick(r,big);addNews(state,`${f.studio||state.studio.name} says production on ${f.title} remains on course despite its ${money(f.budget)} scale.`,'Press Release')}
 state.films.filter(f=>f.owner!=='player'&&f.stage==='scheduled').forEach(aiCampaignPulse);
}

function advanceWeek(){return continueTime()}

function currentBoxChart(){
 const settledWeeks=[...new Set(state.films.flatMap(f=>(f.weeklyResults||[]).filter(w=>w.settledRank).map(w=>w.worldWeek)))].sort((a,b)=>b-a);
 const week=settledWeeks.includes(state.week)?state.week:(settledWeeks[0]||state.week);
 const active=state.films.map(f=>({f,row:filmRowAtWorldWeek(f,week)})).filter(x=>x.row?.settledRank).map(({f,row})=>{
  const cum=(f.weeklyResults||[]).filter(w=>w.worldWeek<=week).reduce((a,w)=>a+w.dom+w.intl,0),stats=boxRunStats(f),rank=row.settledRank;
  const prior=(f.weeklyResults||[]).filter(w=>w.worldWeek<week&&w.settledRank).sort((a,b)=>b.worldWeek-a.worldWeek)[0];
  return {id:f.id,title:f.title,studio:f.studio||state.studio.name,owner:f.owner,week:row.week||f.cinemaWeek,gross:row.dom,world:row.dom+row.intl,cumulative:cum,drop:row.drop,genre:f.genre,previousRank:prior?.settledRank||null,bestRank:stats.best,weeksAtOne:stats.weeksAtOne,releaseType:f.releaseProfile?.type||'standard',rank};
 }).sort((a,b)=>a.rank-b.rank||b.gross-a.gross);
 return active.map(x=>({...x,change:x.previousRank?x.previousRank-x.rank:0,chartWeek:week}));
}


const CALENDAR_BASE_MS=Date.UTC(2026,0,5); // Monday 5 January 2026
const CALENDAR_DAY_MS=86400000;
const CALENDAR_WEEKDAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const CALENDAR_MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function ensureCalendarState(st=state){
 if(!Number.isFinite(st.calendarDay))st.calendarDay=Math.max(1,((st.week||1)-1)*7+1);
 st.lastWeeklyHeartbeatWeek=st.lastWeeklyHeartbeatWeek||st.week||1;
 if(st.studio&&!st.boxOfficeHistorySettledV34&&typeof settleBoxOfficeWeek==='function')repairHistoricalBoxOffice(st);
 return st;
}
function repairHistoricalBoxOffice(st=state){
 const weeks=[...new Set((st.films||[]).flatMap(f=>(f.weeklyResults||[]).map(w=>w.worldWeek).filter(Boolean)))].sort((a,b)=>a-b);
 weeks.forEach(w=>settleBoxOfficeWeek(w));
 (st.films||[]).filter(f=>f.stage==='complete'&&f.owner==='player'&&f.legacy?.built).forEach(f=>{const impacts=deep(f.legacy.talentImpacts||[]);buildFilmLegacy(f,{});if(impacts.length)f.legacy.talentImpacts=impacts});
 st.boxOfficeHistorySettledV34=true;
}
function currentCalendarDay(){ensureCalendarState();return state.calendarDay}
function calendarWeekForDay(day){return Math.floor((Math.max(1,day)-1)/7)+1}
function calendarWeekdayIndex(day){return (Math.max(1,day)-1)%7}
function calendarDateObject(day){return new Date(CALENDAR_BASE_MS+(Math.max(1,day)-1)*CALENDAR_DAY_MS)}
function calendarDateLabel(day=currentCalendarDay()){
 const d=calendarDateObject(day);return `${CALENDAR_WEEKDAYS[calendarWeekdayIndex(day)]} ${d.getUTCDate()} ${CALENDAR_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
function calendarShortDate(day=currentCalendarDay()){
 const d=calendarDateObject(day);return `${CALENDAR_WEEKDAYS[calendarWeekdayIndex(day)]} ${d.getUTCDate()} ${CALENDAR_MONTHS[d.getUTCMonth()]}`;
}
function weekStartDay(week){return Math.max(1,(week-1)*7+1)}
function weekEndDay(week){return Math.max(7,week*7)}
function releaseDayForWeek(week){return weekStartDay(week)+4} // Friday
function sundayForWeek(week){return weekEndDay(week)}
function calendarDaysUntil(day){return Math.max(0,day-currentCalendarDay())}
function milestoneDefaultDay(f,x){
 const releaseDay=releaseDayForWeek(f.releaseWeek||state.week),start=Math.max(1,f.campaignStart?(weekStartDay(f.campaignStart)):currentCalendarDay());
 if(x.type==='trailer')return Math.max(start+1,releaseDay-21);
 if(x.type==='festivalDecision')return Math.max(start+1,releaseDay-28);
 if(x.type==='festivalScreening')return Math.max(start+2,releaseDay-14);
 if(x.type==='publicity')return Math.max(start+2,releaseDay-10);
 if(x.type==='gala')return Math.max(start+2,releaseDay-3);
 return Math.max(start+1,weekStartDay(x.week||state.week));
}
function ensureFilmCalendar(f){
 ensureCalendarState();if(!f)return f;
 if(f.releaseWeek&&!f.releaseDay)f.releaseDay=releaseDayForWeek(f.releaseWeek);
 if(f.marketingState?.milestones?.length&&f.releaseWeek){
  let bump=0;
  f.marketingState.milestones.forEach(x=>{
   if(!x.day){let target=milestoneDefaultDay(f,x);if(!x.resolved&&target<=state.calendarDay)target=state.calendarDay+1+(bump++);x.day=target}
   x.week=calendarWeekForDay(x.day);
  });
  f.marketingState.milestones.sort((a,b)=>(a.day||0)-(b.day||0));
 }
 return f;
}
function nextPlayerCampaignEvent(afterDay=currentCalendarDay(),limit=Infinity){
 let next=null;
 playerFilms().filter(f=>f.stage==='scheduled').forEach(f=>{
  ensureFilmCalendar(f);
  (f.marketingState?.milestones||[]).filter(x=>!x.resolved&&x.day>afterDay&&x.day<=limit).forEach(x=>{
   if(!next||x.day<next.day)next={day:x.day,type:x.type,filmId:f.id,title:f.title};
  });
 });
 return next;
}
function nextPlayerCampaignDay(afterDay=currentCalendarDay(),limit=Infinity){return nextPlayerCampaignEvent(afterDay,limit)?.day??null}
function campaignCheckpointLabel(x){
 const type={trailer:'Trailer Drop',publicity:'Publicity Event',gala:'World Premiere',festivalDecision:'Festival Selection',festivalScreening:'Festival Screening'}[x?.type]||'Campaign Event';
 return x?.title?`${type} · ${x.title}`:type;
}
function nextPlayerReleaseDay(afterDay=currentCalendarDay(),limit=Infinity){
 let next=null;playerFilms().filter(f=>f.stage==='scheduled'&&f.releaseWeek).forEach(f=>{ensureFilmCalendar(f);if(f.releaseDay>afterDay&&f.releaseDay<=limit&&(next===null||f.releaseDay<next))next=f.releaseDay});return next;
}
function nextPlayerWeekendDay(afterDay=currentCalendarDay(),limit=Infinity){
 let next=null;
 playerFilms().forEach(f=>{
  let week=null;
  if(f.stage==='cinema')week=calendarWeekForDay(afterDay);
  else if(f.stage==='scheduled'&&f.releaseWeek>=calendarWeekForDay(afterDay))week=f.releaseWeek;
  if(week){let d=sundayForWeek(week);if(d<=afterDay)d+=7;if(d<=limit&&(next===null||d<next))next=d}
 });
 return next;
}
function nextCalendarCheckpoint(){
 ensureCalendarState();rebuildDecisions();
 const blocker=calendarHardBlocker(),bf=blocker?filmById(blocker.filmId):null;
 if(blocker){const label=blocker.type==='post'?'Rough Cut Review':blocker.type==='marketing'?'Release Planning':'Production Decision';return {day:state.calendarDay,label:`${label}${bf?` · ${bf.title}`:''}`,kind:'blocker'}}
 const cap=state.calendarDay+7,candidates=[];
 const campaign=nextPlayerCampaignEvent(state.calendarDay,cap);if(campaign)candidates.push({day:campaign.day,label:campaignCheckpointLabel(campaign),kind:'campaign',filmId:campaign.filmId});
 const weekend=nextPlayerWeekendDay(state.calendarDay,cap);
 if(weekend){
  const cinema=playerFilms().filter(f=>f.stage==='cinema'||(f.stage==='scheduled'&&f.releaseWeek===calendarWeekForDay(weekend))).sort((a,b)=>(b.marketing||0)-(a.marketing||0))[0];
  candidates.push({day:weekend,label:`Weekend Box Office${cinema?` · ${cinema.title}`:''}`,kind:'boxOffice',filmId:cinema?.id||null});
 }
 if(!candidates.length)return {day:cap,label:'No scheduled player event in the next 7 days',kind:'quiet'};
 candidates.sort((a,b)=>a.day-b.day);return candidates[0];
}
function ensureCareerThreads(st=state){
 st.careerThreads=st.careerThreads||{active:[],history:[],nextId:1,lastUpdatedWeek:0};st.careerThreads.active=st.careerThreads.active||[];st.careerThreads.history=st.careerThreads.history||[];st.careerThreads.nextId=st.careerThreads.nextId||1;return st.careerThreads;
}
function careerThread(key){return ensureCareerThreads().active.find(x=>x.key===key)||null}
function upsertCareerThread(spec){
 const box=ensureCareerThreads(),existing=box.active.find(x=>x.key===spec.key);
 if(existing){Object.assign(existing,spec,{id:existing.id,key:existing.key,startedWeek:existing.startedWeek,lastUpdatedWeek:state.week});return existing}
 const item={id:'THREAD'+box.nextId++,startedWeek:state.week,lastUpdatedWeek:state.week,tone:'neutral',priority:50,...spec};box.active.unshift(item);box.active.sort((a,b)=>(b.priority||0)-(a.priority||0)||(b.lastUpdatedWeek||0)-(a.lastUpdatedWeek||0));box.active=box.active.slice(0,6);return item;
}
function resolveCareerThread(key,resolution){
 const box=ensureCareerThreads(),i=box.active.findIndex(x=>x.key===key);if(i<0)return;const [item]=box.active.splice(i,1);item.resolvedWeek=state.week;item.resolution=resolution||'The story moved on.';box.history.unshift(item);box.history=box.history.slice(0,40);
}
function rivalReleaseClashes(){
 const out=[];playerFilms().filter(f=>f.releaseWeek&&['scheduled','cinema'].includes(f.stage)&&f.releaseWeek>=state.week-1).forEach(p=>{
  state.films.filter(x=>x.owner!=='player'&&x.releaseWeek===p.releaseWeek&&['scheduled','cinema'].includes(x.stage)).forEach(ai=>{const rv=rivalById(ai.owner);if(rv)out.push({player:p,rivalFilm:ai,rival:rv,week:p.releaseWeek})});
 });return out;
}
function trustedCollaboratorThreadCandidate(){
 const studio=state.studio?.name;return state.talent.filter(t=>!t.retired&&(t.relationship||0)>=14&&(t.credits||[]).filter(c=>typeof c==='object'&&c.studio===studio).length>=2).map(t=>({t,credits:(t.credits||[]).filter(c=>typeof c==='object'&&c.studio===studio)})).sort((a,b)=>(b.t.relationship||0)-(a.t.relationship||0)||b.credits.length-a.credits.length)[0]||null;
}
function updateCareerThreads(){
 const box=ensureCareerThreads();if(!state.studio)return;const seen=new Set();
 // A live release-date confrontation is the clearest rival story in the calendar.
 const clashes=rivalReleaseClashes();const byRival=new Map();clashes.forEach(c=>{if(!byRival.has(c.rival.id))byRival.set(c.rival.id,c)});
 byRival.forEach(c=>{const rv=ensureRivalCharacter(c.rival);rv.lastPlayerClashWeek=state.week;const key=`rival-date:${rv.id}`;if(!careerThread(key)){adjustRivalRelationship(rv,-1,`Dated ${c.rivalFilm.title} against ${c.player.title}`);recordRivalryEvent(rv,'release-clash',`${c.rivalFilm.title} dated directly against ${c.player.title}`,2.8,`release-clash:${c.rivalFilm.id}:${c.player.id}`,{filmId:c.player.id,outcome:`Week ${c.week}`})}seen.add(key);upsertCareerThread({key,type:'rivalry',tone:'warn',priority:88,rivalId:rv.id,title:`${rv.head.name} has dated against you`,summary:`${rv.name}'s ${c.rivalFilm.title} is opening in Week ${c.week}, directly against ${c.player.title}.`,detail:`${rv.head.personality} ${rv.head.title.toLowerCase()} ${rv.head.name} has chosen the same corridor. The films will share audience attention, exhibitor space and the trade narrative until the weekend settles.`,progress:`W${c.week} showdown`})});
 // Repeated auction defeats become a persistent competitive thread rather than disposable news.
 state.rivals.forEach(rv=>{ensureRivalCharacter(rv);const key=`auction-rivalry:${rv.id}`,recent=(rv.lastScriptWinAgainstPlayerWeek||0)&&state.week-(rv.lastScriptWinAgainstPlayerWeek||0)<=52;if((rv.scriptWinsAgainstPlayer||0)>=2&&recent){seen.add(key);upsertCareerThread({key,type:'rivalry',tone:'bad',priority:72,rivalId:rv.id,title:`${rv.head.name} keeps beating you to material`,summary:`${rv.name} has outbid you ${rv.scriptWinsAgainstPlayer} times in contested screenplay deals.`,detail:`What began as normal competition is becoming a recognisable pattern on The Lot. Future auctions against ${rv.head.name} will carry history even when the numbers look routine.`,progress:`${rv.scriptWinsAgainstPlayer} auction losses`})}else if(careerThread(key)&&!recent)resolveCareerThread(key,'A full year passed without another auction defeat to the same studio, and the rivalry cooled.')});

 state.rivals.forEach(rv=>{
  ensureRivalCharacter(rv);const x=rivalrySnapshot(rv),key=`rivalry-core:${rv.id}`;
  if(x.rank>=2){
   seen.add(key);upsertCareerThread({key,type:'rivalry',tone:x.rank>=3?'bad':x.tone,priority:x.rank>=3?90:80,rivalId:rv.id,title:x.rank>=3?`${rv.head.name} has become the rival your studio is measured against`:`The ${rv.name} rivalry is becoming a pattern`,summary:x.reasons.length?`${naturalNames(x.reasons.slice(0,3))} have turned routine competition into ${x.label.toLowerCase()}.`:x.desc,detail:`${x.desc} This remains emergent: a long quiet period, different strategic lanes or warmer dealings can cool the rivalry again.`,progress:x.label});
   if(rv.lastRivalryLabel!==x.label){
    const prior=rv.lastRivalryLabel;rv.lastRivalryLabel=x.label;
    if(prior&&prior!=='Normal competition'&&x.rank>=3)addNews(state,`${rv.head.name}'s ${rv.name} and ${state.studio.name} are increasingly being framed as a defining studio rivalry after repeated collisions across the business.`,'Studio Watch');
    else if(x.rank===2)addNews(state,`${rv.name} and ${state.studio.name} are no longer meeting by accident. The trade now sees an active rivalry taking shape between the two companies.`,'Studio Watch');
   }
  }else{
   if(careerThread(key)&&state.week-(rv.lastRivalryEventWeek||0)>39)resolveCareerThread(key,'The studios stopped colliding often enough for the rivalry to define the current story.');
   if(x.rank<2)rv.lastRivalryLabel=x.label;
  }
 });

 // Strong repeat collaborations should feel like an ongoing relationship, not a number on a profile.
 const collab=trustedCollaboratorThreadCandidate();if(collab){const t=collab.t,key=`collaborator:${t.id}`,latest=collab.credits[0];seen.add(key);upsertCareerThread({key,type:'relationship',tone:'good',priority:62,talentId:t.id,title:`${t.name} is becoming part of the studio's story`,summary:`${collab.credits.length} credits with ${state.studio.name} and a ${relationshipLabel(t.relationship||0).toLowerCase()} working relationship.`,detail:`The relationship now has memory. Agents, journalists and future collaborators can read ${latest?.title||'the recent work'} as part of a continuing partnership rather than a one-off booking.`,progress:`Relationship ${Math.round(t.relationship||0)}`})}
 // Representation now carries forward as an active story instead of resetting after each Desk item.
 AGENCIES.forEach(a=>{
  const snap=agencySnapshot(a),st=snap.standing,key=`agency:${a.id}`;
  if(st.score<=-4&&st.cold>=2){
   seen.add(key);upsertCareerThread({key,type:'agency',tone:'bad',priority:74,title:`${a.name} is becoming a difficult room`,summary:`${st.cold} clients now have strained relationships with ${state.studio.name}; calls and terms are getting less forgiving.`,detail:`This is no longer one awkward negotiation. ${a.name} is reading a pattern across its client list, and future approaches will arrive with less goodwill until some of those relationships are repaired.`,progress:`${st.cold} strained clients`});
  }else if(snap.windows.length>=2){
   const names=snap.windows.map(w=>talentById(w.talentId)?.name).filter(Boolean);seen.add(key);upsertCareerThread({key,type:'agency',tone:'blue',priority:66,title:`${a.name} has a live package in the room`,summary:`${names.join(' and ')} are inside active priority conversations with your studio.`,detail:'The agency is temporarily treating the project as a joined-up conversation rather than separate cold calls. The window improves access but does not guarantee casting evidence or contract terms.',progress:`${snap.windows.length} priority conversations`});
  }else if(st.score>=4&&st.warm>=2){
   seen.add(key);upsertCareerThread({key,type:'agency',tone:'good',priority:58,title:`${a.name} is treating you as a preferred buyer`,summary:`${st.warm} clients have strong relationships with ${state.studio.name}, giving the agency reasons to bring you calls early.`,detail:'There is no permanent agency loyalty. The advantage exists because multiple clients have had good experiences with the studio, and poor handling can unwind it.',progress:`${st.warm} warm clients`});
  }else if(careerThread(key))resolveCareerThread(key,'The agency relationship returned to a more ordinary, deal-by-deal footing.');
 });
 // Financial pressure persists until the underlying balance-sheet problem is actually solved.
 const runway=studioCashRunway();const financeKey='studio-financial-pressure';if((state.finance?.bridgeDebt||0)>6||runway.weeks<4){seen.add(financeKey);upsertCareerThread({key:financeKey,type:'finance',tone:'bad',priority:82,title:'The balance sheet is becoming part of the story',summary:`Cash runway is ${runway.label}${state.finance?.bridgeDebt?` with ${money(state.finance.bridgeDebt)} of bridge debt`:''}.`,detail:'This is no longer a single finance alert. Agents, distributors and trade reporters will increasingly interpret new commitments through the studio’s liquidity position.',progress:`${runway.label} runway`})}
 else if(careerThread(financeKey)&&runway.weeks>=8&&(state.finance?.bridgeDebt||0)<1)resolveCareerThread(financeKey,'Liquidity recovered and the financing story cooled.');
 // Exceptional successes and failures should remain part of the current conversation for a while.
 const recentDone=playerFilms().filter(f=>f.stage==='complete'&&state.week-(f.completeWeek||0)<=78).map(f=>({f,profit:(f.studioRevenue||0)-(f.investment||0)}));
 const scar=[...recentDone].sort((a,b)=>a.profit-b.profit)[0];if(scar&&scar.profit<=-10){const f=scar.f,key=`film-scar:${f.id}`;seen.add(key);upsertCareerThread({key,type:'memory',tone:'bad',priority:68,filmId:f.id,title:`${f.title} is still following the studio`,summary:`The film lost roughly ${money(Math.abs(scar.profit))}, and the trade still uses it as context for new spending decisions.`,detail:'A bad result does not disappear when the theatrical run ends. Finance reporters, agents and rivals now have a concrete failure to cite when the studio takes another expensive swing.',progress:`${state.week-(f.completeWeek||state.week)} weeks ago`})}
 const hit=[...recentDone].sort((a,b)=>b.profit-a.profit)[0];if(hit&&hit.profit>=18){const f=hit.f,key=`film-hit:${f.id}`;seen.add(key);upsertCareerThread({key,type:'memory',tone:'good',priority:64,filmId:f.id,title:`${f.title} changed your leverage`,summary:`A roughly ${money(hit.profit)} studio profit has become part of how talent, press and rivals read ${state.studio.name}.`,detail:'The hit is still doing work after release: it strengthens the studio’s credibility when committing to another film and gives journalists an obvious benchmark for the next one.',progress:`${state.week-(f.completeWeek||state.week)} weeks ago`})}
 [...box.active].filter(t=>t.key.startsWith('film-scar:')||t.key.startsWith('film-hit:')).forEach(t=>{if(!seen.has(t.key))resolveCareerThread(t.key,'The film remains part of studio history, but it is no longer driving the current trade narrative.')});
 // An established identity becomes a continuing press narrative.
 const identity=studioIdentityPrimary();const eraKey='studio-era';if(identity&&identity.id!=='emerging'&&identity.label!=='Independent Studio'&&studioIdentitySnapshot().done.length>=3){seen.add(eraKey);upsertCareerThread({key:eraKey,type:'identity',tone:'blue',priority:54,title:`The trades are calling this your ${identity.label.toLowerCase()} era`,summary:`Repeated choices have made “${identity.label}” the clearest shorthand for ${state.studio.name}.`,detail:'The label is not permanent. A different run of films can reinforce it, complicate it or replace it, and journalists will refer back to the era when judging future moves.',progress:`Signal ${Math.round(identity.score)}`})}
 // Resolve date-clash threads after the confrontation passes. Auction threads deliberately persist until a long quiet spell.
 [...box.active].forEach(t=>{if(t.key.startsWith('rival-date:')&&!seen.has(t.key))resolveCareerThread(t.key,'The shared release corridor has passed and the rivalry moves into the record.');if(t.key.startsWith('collaborator:')&&!seen.has(t.key))resolveCareerThread(t.key,'The working relationship cooled or stopped being active enough to define the current studio story.');if(t.key==='studio-era'&&!seen.has(t.key))resolveCareerThread(t.key,'The studio’s recent slate no longer supports one dominant trade label.')});
 box.lastUpdatedWeek=state.week;
}
function activeCareerThreads(limit=4){return ensureCareerThreads().active.slice().sort((a,b)=>(b.priority||0)-(a.priority||0)||(b.lastUpdatedWeek||0)-(a.lastUpdatedWeek||0)).slice(0,limit)}
function nextMeaningfulCalendarEventLimit(){
 ensureCalendarState();const horizon=state.calendarDay+84,candidates=[];const c=nextPlayerCampaignEvent(state.calendarDay,horizon);if(c)candidates.push(c.day);const r=nextPlayerReleaseDay(state.calendarDay,horizon);if(r)candidates.push(r);const w=nextPlayerWeekendDay(state.calendarDay,horizon);if(w)candidates.push(w);playerFilms().filter(f=>f.stage==='production').forEach(f=>{(f.events||[]).filter(e=>!e.resolved).forEach(e=>{const week=(f.productionStart||state.week)+(e.week||1)-1,day=weekStartDay(week);if(day>state.calendarDay&&day<=horizon)candidates.push(day)});if(f.productionEnd){const d=weekStartDay(f.productionEnd);if(d>state.calendarDay&&d<=horizon)candidates.push(d)}});playerFilms().filter(f=>f.stage==='post'&&!f.calendarPostStopSeen).forEach(()=>candidates.push(state.calendarDay+1));return candidates.length?Math.min(...candidates):horizon;
}
function continueToNextEvent(){
 ensureCalendarState();const blocker=calendarHardBlocker();if(blocker)return continueTime();const from=state.calendarDay,hardLimit=Math.min(from+84,nextMeaningfulCalendarEventLimit()+14);state.fastForward=state.fastForward||{uses:0,lastFromDay:null,lastToDay:null};
 for(let day=from+1;day<=hardLimit;day++){
  state.calendarDay=day;const week=calendarWeekForDay(day);state.week=week;
  if(calendarWeekdayIndex(day)===0&&week>state.lastWeeklyHeartbeatWeek){runWeeklyHeartbeat(week);if(surfaceCalendarInterrupt()){state.fastForward.uses++;state.fastForward.lastFromDay=from;state.fastForward.lastToDay=day;save();render();return}}
  const campaignHit=processCampaignDay(day);if(campaignHit&&surfaceCalendarInterrupt()){state.fastForward.uses++;state.fastForward.lastFromDay=from;state.fastForward.lastToDay=day;save();render();return}
  const released=processReleaseDay(day);if(released&&surfaceCalendarInterrupt()){state.fastForward.uses++;state.fastForward.lastFromDay=from;state.fastForward.lastToDay=day;save();render();return}
  if(calendarWeekdayIndex(day)===6){const box=processBoxOfficeSunday(day);if(surfaceCalendarInterrupt()||box){state.fastForward.uses++;state.fastForward.lastFromDay=from;state.fastForward.lastToDay=day;save();render();return}}
 }
 state.fastForward.uses++;state.fastForward.lastFromDay=from;state.fastForward.lastToDay=state.calendarDay;save();render();
}


function surfaceDecisionInterrupt(){
 if(enforceActiveSignatureRoute())return true;
 if(state.pendingCeremony){state.screen='ceremony';state.detail=null;state.history=[];return true}
 if(state.pendingAwardsNominations){state.screen='nominations';state.detail=null;state.history=[];return true}
 if(surfacePendingLegendUnlock())return true;if(surfacePendingFilmWrap())return true;if(surfacePendingStudioMoment())return true;
 if(typeof ensureDesk==='function'){const item=ensureDesk().items.find(x=>!x.resolved&&x.requiresAction);if(item){state.screen='studio';state.uiStudioTab='desk';state.uiDeskTab='briefing';state.detail=null;state.history=[];requestScrollTop();return true}}
 rebuildDecisions();const d=state.decisions.find(x=>['production','post','marketing','campaign'].includes(x.type));if(d){routeToHardBlocker(d,true);return true}
 return false;
}
function continueToNextDecision(){
 ensureCalendarState();const blocker=calendarHardBlocker();if(blocker)return continueTime();const from=state.calendarDay,hardLimit=from+168;state.fastForward=state.fastForward||{uses:0,lastFromDay:null,lastToDay:null};
 for(let day=from+1;day<=hardLimit;day++){
  state.calendarDay=day;const week=calendarWeekForDay(day);state.week=week;
  if(calendarWeekdayIndex(day)===0&&week>state.lastWeeklyHeartbeatWeek){runWeeklyHeartbeat(week);if(surfaceDecisionInterrupt()){state.fastForward.uses++;state.fastForward.lastFromDay=from;state.fastForward.lastToDay=day;save();render();return}}
  processCampaignDay(day);if(surfaceDecisionInterrupt()){state.fastForward.uses++;state.fastForward.lastFromDay=from;state.fastForward.lastToDay=day;save();render();return}
  processReleaseDay(day);if(surfaceDecisionInterrupt()){state.fastForward.uses++;state.fastForward.lastFromDay=from;state.fastForward.lastToDay=day;save();render();return}
  if(calendarWeekdayIndex(day)===6){processBoxOfficeSunday(day);if(surfaceDecisionInterrupt()){state.fastForward.uses++;state.fastForward.lastFromDay=from;state.fastForward.lastToDay=day;save();render();return}}
 }
 state.fastForward.uses++;state.fastForward.lastFromDay=from;state.fastForward.lastToDay=state.calendarDay;save();render();
}

function runWeeklyHeartbeat(targetWeek){
 ensureCalendarState();if(targetWeek<=state.lastWeeklyHeartbeatWeek)return;
 state.week=targetWeek;state.lastWeeklyHeartbeatWeek=targetWeek;
 Object.entries(state.agencyWindows||{}).forEach(([id,w])=>{if(targetWeek>w.expiresWeek||filmById(w.filmId)?.stage!=='development')delete state.agencyWindows[id]});
 const interest=serviceBridge(),streamingReceipts=typeof collectOwnedStreamingWeeklyRevenue==='function'?collectOwnedStreamingWeeklyRevenue():0,overhead=studioWeeklyOverhead(),finance=payWeeklyOverhead(overhead);
 tickAudienceMarket();tickIPWorld();const catalogueReceipts=updateAfterlifeRevenue();recordWeeklyEconomy(overhead,catalogueReceipts);maybeWarnCashRunway();processAIAwardsCampaigns();maybeResolveAwardsNominations();maybeResolveAwardsSeason();
 aiWeeklyFinance();updateWritingProjects();updatePlayerFilms();advanceAI();if(typeof processScreenplayMarketWeek==='function')processScreenplayMarketWeek();if(typeof maybeLaunchLateGameChallenger==='function')maybeLaunchLateGameChallenger();if(typeof maybeGenerateIndustryInvitation==='function')maybeGenerateIndustryInvitation();aiStartProjects();reviewAIReleaseCalendar();checkPlayerReleaseCompetition();rotateMarket();if(state.week%13===0){updateStudioIdentityHistory();updateExecutivePersonaHistory();captureIndustryMoodQuarter()}ageAndCareers();checkAvailabilityWatches();maybeGenerateTalentDrama();generateIndustryPress();maybeGenerateTrendNews();maybeGenerateIndustryYearbook();if(typeof processHollywoodHistoryWeek==='function')processHollywoodHistoryWeek();if(typeof processCorporateWeek==='function')processCorporateWeek();generateStudioDeskWeek();updateCareerCycle();updateCareerThreads();checkStudioMilestones();checkDevelopmentUnlocks();rebuildDecisions();
 if(interest>.01&&state.week%4===0)addNews(state,`${money(interest)} of bridge-finance interest accrued this week. The running cost of emergency borrowing is now becoming a material part of studio cash flow.`,'Studio Finance');
 if(overhead>=.16&&finance.borrowed===0&&state.week%13===0)addNews(state,`${state.studio.name} is carrying ${moneyFine(overhead)} in weekly operating and slate overhead as the company scales.`,'Studio Finance');
 recordSimulationAudit('weekly');
}
function processCampaignDay(day){
 let touched=false;playerFilms().filter(f=>f.stage==='scheduled').forEach(f=>{ensureFilmCalendar(f);const before=(f.marketingState?.milestones||[]).filter(x=>x.resolved).length;updateMarketingCampaign(f,day);const after=(f.marketingState?.milestones||[]).filter(x=>x.resolved).length;if(after>before)touched=true});return touched;
}
function processReleaseDay(day){
 if(calendarWeekdayIndex(day)!==4)return false;const week=calendarWeekForDay(day);let player=false;
 state.films.filter(f=>f.stage==='scheduled'&&f.releaseWeek<=week).sort((a,b)=>a.id.localeCompare(b.id)).forEach(f=>{
  ensureFilmCalendar(f);
  if(f.owner==='player'){
   if(f.marketingState?.pending){f.marketingState.pending=null;addNews(state,`${f.title}'s unresolved campaign opportunity expired as the film reached release day.`,'Trade Report')}
   releaseFilm(f);player=true;
  }else releaseAIFilm(f);
 });
 return player;
}

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
 return '<div class="section-title"><h2>Release Room</h2><span class="small">'+left+' of '+limit+' tactical move'+(limit===1?'':'s')+' remaining</span></div><div class="card '+(row.drop!==null&&row.drop>.65?'dangerline':row.drop!==null&&row.drop<.28?'goodline':'')+'"><div class="body"><strong>Studio read:</strong> '+theatricalRunRead(f)+'</div>'+(upcoming.length?'<div class="small" style="margin-top:8px"><strong>Next weekend:</strong> '+upcoming.map(x=>x.title+' · '+x.genre+(x.owner!=='player'&&x.aiReleasePlan?.label?' · '+x.aiReleasePlan.label:'')).join(' / ')+'</div>':'<div class="small" style="margin-top:8px">No major rival opening is currently dated for next weekend.</div>')+'</div>'+(!closed?'<div class="grid cols2" style="margin-top:10px">'+cards+'</div>':'<div class="card body" style="margin-top:10px">'+(left<=0?'The studio has used its available theatrical move'+(limit>1?'s':'')+'.':'The tactical intervention window has closed for this run.')+'</div>')+history;
}
function theatricalReleaseRoomHTML(films){
 if(!films.length)return '<div class="section-title"><h2>In theatres</h2><span class="small">Live theatrical runs</span></div><div class="card body">You have no films currently in cinemas.</div>';
 const ordered=[...films].sort((a,b)=>(theatricalLatestSettledRow(a)?.settledRank||99)-(theatricalLatestSettledRow(b)?.settledRank||99));
 return '<div class="section-title"><h2>Release Room</h2><span class="small">Follow the run · intervene selectively</span></div>'+ordered.map(f=>{const row=theatricalLatestSettledRow(f),cum=(f.weeklyResults||[]).reduce((a,w)=>a+w.dom+w.intl,0),drop=row?.drop===null?'Opening weekend':row?.drop<0?Math.round(Math.abs(row.drop)*100)+'% growth':row?.drop!==undefined?Math.round(row.drop*100)+'% drop':'Weekend counting',rank=row?.settledRank?'#'+row.settledRank:'Pending',pace=theatricalPace(f);return '<div class="card '+(pace.cls==='good'?'goodline':pace.cls==='bad'?'dangerline':'')+'" style="margin-bottom:14px"><div class="row"><div><strong>'+f.title+'</strong><div class="small">Theatrical Week '+f.cinemaWeek+' · '+distributionLabel(f)+'</div></div><span class="pill '+pace.cls+'">'+pace.label+'</span></div><div class="grid cols4" style="margin-top:10px"><div><div class="badge">Rank</div><strong>'+rank+'</strong></div><div><div class="badge">Latest hold</div><strong>'+drop+'</strong></div><div><div class="badge">Worldwide run</div><strong>'+money(cum)+'</strong></div><div><div class="badge">Audience</div><strong>'+(f.review?.audience??'—')+'%</strong></div></div>'+theatricalInterventionPanel(f)+'<button class="btn block" data-film="'+f.id+'" style="margin-top:10px">Open full film run</button></div>'}).join('');
}

function queueWeekendBoxOfficeMoment(worldWeek){
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
}
function finalizeTheatricalWeek(){
 state.films.filter(f=>f.stage==='cinema'&&f.pendingTheatricalFinish).forEach(f=>{f.pendingTheatricalFinish=false;if(f.owner==='player')finishFilm(f);else finishAIFilm(f)});
}
function publishSettledOpeningNews(worldWeek,rows){
 rows.filter(x=>(x.row.week||1)===1).forEach(({film:f,row})=>{
  const ww=row.dom+row.intl,rank=row.settledRank;
  const track=trackingVsActual(f,row.dom);
  addNews(state,`${f.title} opens at #${rank} domestically with ${money(row.dom)}, taking ${money(ww)} worldwide across its opening weekend.${track?` ${track.text}`:''}`,'Box Office');
  if(f.releaseProfile?.type==='bomb')addNews(state,`${f.title} has suffered a disastrous opening weekend, landing far below the level implied by its campaign and investment.`,'Box Office Alert');
  else if(f.releaseProfile?.type==='breakout')addNews(state,`${f.title} has broken above pre-release tracking and is immediately being treated as a breakout.`,'Box Office Alert');
  else if(row.dom>35)addNews(state,`${f.title} delivers one of the stronger domestic openings of the season.`,'Box Office Alert');
  else if(f.review?.audience>=88)addNews(state,`Exceptional early audience scores put ${f.title} on sleeper-hit watch after its opening weekend.`,'Trade Report');
 });
}
function processBoxOfficeSunday(day){
 if(calendarWeekdayIndex(day)!==6)return false;const week=calendarWeekForDay(day);
 state.films.filter(f=>f.stage==='cinema').forEach(f=>{if(!filmRowAtWorldWeek(f,week)){if(f.owner==='player')addCinemaWeek(f);else addAICinemaWeek(f)}});
 const rows=settleBoxOfficeWeek(week);if(rows.length){processAIRivalTheatricalStrategy(week,rows);publishSettledOpeningNews(week,rows);generateBoxOfficeWeekPress()}
 const playerMoment=queueWeekendBoxOfficeMoment(week);finalizeTheatricalWeek();return playerMoment;
}
function calendarHardBlocker(){
 rebuildDecisions();
 return state.decisions.find(x=>x.type==='production'||(x.type==='post'&&!ensurePostState(filmById(x.filmId)).firstDecisionMade)||x.type==='marketing')||null;
}
function surfaceCalendarInterrupt(){
 if(enforceActiveSignatureRoute())return true;
 if(state.pendingCeremony){state.screen='ceremony';state.detail=null;state.history=[];return true}
 if(state.pendingAwardsNominations){state.screen='nominations';state.detail=null;state.history=[];return true}
 if(surfacePendingLegendUnlock())return true;
 if(surfacePendingFilmWrap())return true;
 if(surfacePendingStudioMoment())return true;
 if(typeof nextUrgentDeskItem==='function'){const urgent=nextUrgentDeskItem();if(urgent){state.screen='studio';state.uiStudioTab='desk';state.uiDeskTab='briefing';state.detail=null;state.history=[];requestScrollTop();return true}}
 const blocker=calendarHardBlocker();
 if(blocker){routeToHardBlocker(blocker,true);return true}
 return false;
}
function continueTime(){
 ensureCalendarState();const blocker=calendarHardBlocker();
 if(blocker){
  const f=filmById(blocker.filmId),marketing=blocker.type==='marketing',post=blocker.type==='post';
  showToast(marketing?"Plan the film's campaign and release before continuing.":post?'Review the rough cut and choose an intervention or lock picture before continuing.':'Resolve the active production decision before continuing.');
   routeToHardBlocker(blocker,true);save();render();return;
 }
 const start=state.calendarDay,cap=start+7;
 for(let day=start+1;day<=cap;day++){
  state.calendarDay=day;const week=calendarWeekForDay(day);state.week=week;
  if(calendarWeekdayIndex(day)===0&&week>state.lastWeeklyHeartbeatWeek){runWeeklyHeartbeat(week);if(surfaceCalendarInterrupt()){save();render();return}}
  const campaignHit=processCampaignDay(day);if(campaignHit&&surfaceCalendarInterrupt()){save();render();return}
  processReleaseDay(day);
  if(calendarWeekdayIndex(day)===6){const box=processBoxOfficeSunday(day);if(surfaceCalendarInterrupt()){save();render();return}if(box){save();render();return}}
 }
 save();render();
}
function advanceWeek(){return continueTime()}
