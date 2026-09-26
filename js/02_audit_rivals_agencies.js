// v4.0a — Simulation Audit. Observational only: no function in this block changes game outcomes.
function ensureSimulationAudit(st=state){
 const a=st.simulationAudit||(st.simulationAudit={schema:2,enabled:true,firstWeek:null,lastWeek:0,weekly:[],quarterly:[],flags:[],captures:0,benchmarks:[]});
 a.schema=2;a.enabled=a.enabled!==false;a.weekly=Array.isArray(a.weekly)?a.weekly:[];a.quarterly=Array.isArray(a.quarterly)?a.quarterly:[];a.flags=Array.isArray(a.flags)?a.flags:[];a.benchmarks=Array.isArray(a.benchmarks)?a.benchmarks:[];a.captures=a.captures||0;return a;
}
function auditRound(v,d=2){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function auditQuantile(values,q=.5){
 const a=(values||[]).filter(Number.isFinite).slice().sort((x,y)=>x-y);if(!a.length)return null;if(a.length===1)return a[0];
 const p=(a.length-1)*clamp(q,0,1),lo=Math.floor(p),hi=Math.ceil(p);return a[lo]+(a[hi]-a[lo])*(p-lo);
}
function auditFilmProfit(f){
 if(!f)return 0;if(Number.isFinite(f.legacy?.profit))return f.legacy.profit;if(Number.isFinite(f.estimatedProfit))return f.estimatedProfit;
 if(Number.isFinite(f.finalGross)&&Number.isFinite(f.investment))return f.finalGross*.43-f.investment;return 0;
}
function auditCompletedFilms(st=state,owner=null){return (st.films||[]).filter(f=>f.stage==='complete'&&(owner===null||f.owner===owner))}
function auditReleaseProbability(f){
 const p=f?.releaseProfile||{},b=clamp(Number.isFinite(p.bombChance)?p.bombChance:.055,0,.45),br=clamp(Number.isFinite(p.breakoutChance)?p.breakoutChance:.015,0,.35);
 const sl=clamp(Number.isFinite(p.sleeperChance)?p.sleeperChance:0,0,.25),fr=clamp(Number.isFinite(p.frontloadChance)?p.frontloadChance:0,0,.25);
 const survive=Math.max(0,1-b-br),sleeper=survive*sl,frontloaded=Math.max(0,survive*(1-sl)*fr);
 return {bomb:b,breakout:br,sleeper,frontloaded,nonStandard:clamp(b+br+sleeper+frontloaded,0,1)};
}
function auditPoissonBinomialLowerTail(probabilities,observed){
 const ps=(probabilities||[]).filter(Number.isFinite).map(x=>clamp(x,0,1));if(!ps.length)return 1;const dp=Array(ps.length+1).fill(0);dp[0]=1;
 ps.forEach(p=>{for(let k=ps.length;k>=0;k--){const stay=dp[k]*(1-p),rise=k?dp[k-1]*p:0;dp[k]=stay+rise}});
 let sum=0;for(let k=0;k<=Math.min(observed,ps.length);k++)sum+=dp[k];return clamp(sum,0,1);
}
function simulationAuditReleaseVariance(st=state){
 const films=(st.films||[]).filter(f=>f.stage==='complete'&&f.releaseProfile),probs=films.map(f=>auditReleaseProbability(f).nonStandard),observed=films.filter(f=>(f.releaseProfile?.type||'standard')!=='standard').length;
 const expected=probs.reduce((a,b)=>a+b,0),lowTail=auditPoissonBinomialLowerTail(probs,observed);return {films:films.length,observedNonStandard:observed,expectedNonStandard:auditRound(expected),lowTailProbability:auditRound(lowTail,4)};
}
function simulationAuditFilmLedger(st=state){
 const talent=new Map((st.talent||[]).map(t=>[t.id,t]));
 return (st.films||[]).filter(f=>f.stage==='complete').map(f=>{const sc=(st.scripts||[]).find(x=>x.id===f.scriptId),ai=f.owner!=='player',ids=[f.directorId,...(f.cast||[])].filter(Boolean),currentTalent=ids.reduce((n,id)=>n+(+talent.get(id)?.fee||0),0),legacyFinish=ai&&f.aiFinishingFunded&&!Number.isFinite(f.aiFinishingCost)?+(1.75+(f.budget||0)*.20+(f.marketing||0)*.07).toFixed(2):null,finish=Number.isFinite(f.aiFinishingCost)?f.aiFinishingCost:legacyFinish,prob=auditReleaseProbability(f);
  return {id:f.id,title:f.title,owner:f.owner,studio:f.studio,genre:f.genre,scriptSource:sc?.source||null,turnaround:!!sc?.turnaround||sc?.source==='Turnaround',budget:auditRound(f.budget||0),naturalBudget:auditRound(sc?.naturalBudget||0),marketing:auditRound(f.marketing||0),scriptCost:auditRound(f.scriptCost||0),talentMarketValue:auditRound(f.aiTalentMarketValue??currentTalent),finishingCost:auditRound(finish),finishModel:f.aiFinishModel||(legacyFinish!==null?'legacy-ai-surcharge':ai?'unknown':'player'),releaseOps:auditRound(f.releaseOps||0),publicity:auditRound(f.aiPublicity||0),investment:auditRound(f.investment||0),gross:auditRound(f.finalGross||0),studioRevenue:auditRound(f.studioRevenue||0),profit:auditRound(auditFilmProfit(f)),grossToInvestment:auditRound((f.investment||0)>0?(f.finalGross||0)/f.investment:null),distribution:f.distributionDeal?.id||f.distributionStrategy||null,critics:f.review?.critics??null,audience:f.review?.audience??null,releaseProfile:f.releaseProfile?.type||'standard',expectedNonStandard:auditRound(prob.nonStandard,4),completeWeek:f.completeWeek||null};
 });
}
function simulationAuditScreenplayLedger(st=state){
 const scripts=new Map((st.scripts||[]).map(x=>[x.id,x])),deals=(st.screenplayEconomy?.history||[]).map(h=>{const sc=scripts.get(h.scriptId);return {...h,naturalBudget:auditRound(sc?.naturalBudget||0),source:sc?.source||null,turnaround:!!h.turnaround||!!sc?.turnaround||sc?.source==='Turnaround'}});
 const stats=rows=>{const prices=rows.map(x=>+x.price||0),budgets=rows.map(x=>+x.naturalBudget||0),ratios=rows.map(x=>x.naturalBudget>0?x.price/x.naturalBudget:null).filter(Number.isFinite);return {deals:rows.length,priceMedian:auditRound(auditQuantile(prices,.5)),budgetMedian:auditRound(auditQuantile(budgets,.5)),priceToBudgetMedian:auditRound(auditQuantile(ratios,.5),4)};};
 const turnaround=deals.filter(x=>x.turnaround),standard=deals.filter(x=>!x.turnaround);return {deals:deals.slice(0,80),turnaround:stats(turnaround),standard:stats(standard)};
}
function simulationAuditAISummary(ledger){
 const rows=(ledger||[]).filter(x=>x.owner!=='player'),profits=rows.map(x=>x.profit).filter(Number.isFinite),investments=rows.map(x=>x.investment).filter(Number.isFinite),grosses=rows.map(x=>x.gross).filter(Number.isFinite),finishes=rows.map(x=>x.finishingCost).filter(Number.isFinite),talent=rows.map(x=>x.talentMarketValue).filter(Number.isFinite);
 return {completed:rows.length,totalProfit:auditRound(profits.reduce((a,b)=>a+b,0)),avgProfit:auditRound(profits.length?profits.reduce((a,b)=>a+b,0)/profits.length:null),medianProfit:auditRound(auditQuantile(profits,.5)),profitable:profits.filter(x=>x>.5).length,profitableRate:auditRound(profits.length?profits.filter(x=>x>.5).length/profits.length:null,4),avgInvestment:auditRound(investments.length?investments.reduce((a,b)=>a+b,0)/investments.length:null),avgGross:auditRound(grosses.length?grosses.reduce((a,b)=>a+b,0)/grosses.length:null),avgFinishingCost:auditRound(finishes.length?finishes.reduce((a,b)=>a+b,0)/finishes.length:null),avgTalentMarketValue:auditRound(talent.length?talent.reduce((a,b)=>a+b,0)/talent.length:null),legacyFinishFilms:rows.filter(x=>x.finishModel==='legacy-ai-surcharge').length,parityFinishFilms:rows.filter(x=>x.finishModel==='parity-v4003').length};
}
function simulationAuditSnapshot(st=state,compact=false){
 const pf=(st.films||[]).filter(f=>f.owner==='player'),done=pf.filter(f=>f.stage==='complete'),active=pf.filter(f=>!['complete','shelved'].includes(f.stage)),allDone=(st.films||[]).filter(f=>f.stage==='complete');
 const filmProfits=done.map(auditFilmProfit),grosses=done.map(f=>f.finalGross||0),budgets=done.map(f=>f.budget||0),marketing=done.map(f=>f.marketing||0),critics=done.map(f=>f.review?.critics).filter(Number.isFinite),audiences=done.map(f=>f.review?.audience).filter(Number.isFinite);
 const actors=(st.talent||[]).filter(t=>t.type==='Actor'&&!t.retired),directors=(st.talent||[]).filter(t=>t.type==='Director'&&!t.retired),actorFees=actors.map(t=>+t.fee||0),directorFees=directors.map(t=>+t.fee||0);
 const marketScripts=(st.market||[]).map(id=>(st.scripts||[]).find(s=>s.id===id)).filter(s=>s&&s.available!==false),scriptPrices=marketScripts.map(s=>+s.price||0),naturalBudgets=marketScripts.map(s=>+s.naturalBudget||0),scriptLedger=simulationAuditScreenplayLedger(st);
 const ledger=simulationAuditFilmLedger(st),aiEconomy=simulationAuditAISummary(ledger),releaseVariance=simulationAuditReleaseVariance(st);
 const rivals=(st.rivals||[]).map(rv=>{const films=(st.films||[]).filter(f=>f.owner===rv.id&&f.stage==='complete'),pnl=films.reduce((n,f)=>n+auditFilmProfit(f),0);return {id:rv.id,name:rv.name,cash:auditRound(rv.cash||0),debt:auditRound(rv.debt||0),pnl:auditRound(pnl),completed:films.length,restructures:rv.restructures||0,status:typeof aiFinancialHealth==='function'?aiFinancialHealth(rv):'Unknown',recognition:auditRound(rv.recognition??rv.reputation??0)};});
 const distressed=rivals.filter(r=>/distress|strained/i.test(r.status)).length,rivalCash=rivals.map(r=>r.cash).filter(Number.isFinite),rivalPnl=rivals.map(r=>r.pnl).filter(Number.isFinite);
 const profiles={standard:0,bomb:0,breakout:0,sleeper:0,frontloaded:0,other:0};allDone.forEach(f=>{const k=f.releaseProfile?.type||'standard';profiles[k]===undefined?profiles.other++:profiles[k]++});
 const overhead=st.studio&&typeof studioWeeklyOverhead==='function'?studioWeeklyOverhead():0,catalogue=st.studio&&typeof currentCatalogueReceipts==='function'?currentCatalogueReceipts():0,runway=st.studio&&typeof studioCashRunway==='function'?studioCashRunway():null;
 let rank=null;try{rank=st.studio&&typeof playerStudioStanding==='function'?playerStudioStanding().rank:null}catch(e){}
 const player={cash:auditRound(st.cash||0),debt:auditRound(st.finance?.bridgeDebt||0),interest:auditRound(st.finance?.totalInterest||0),overhead:auditRound(overhead,3),catalogue:auditRound(catalogue,3),runwayWeeks:Number.isFinite(runway?.weeks)?auditRound(runway.weeks):null,active:active.length,completed:done.length,gross:auditRound(grosses.reduce((a,b)=>a+b,0)),profit:auditRound(filmProfits.reduce((a,b)=>a+b,0)),profitable:filmProfits.filter(x=>x>.5).length,losses:filmProfits.filter(x=>x<-.5).length,avgBudget:auditRound(done.length?budgets.reduce((a,b)=>a+b,0)/done.length:0),avgMarketing:auditRound(done.length?marketing.reduce((a,b)=>a+b,0)/done.length:0),avgCritics:auditRound(critics.length?critics.reduce((a,b)=>a+b,0)/critics.length:null),avgAudience:auditRound(audiences.length?audiences.reduce((a,b)=>a+b,0)/audiences.length:null),recognition:auditRound(st.studioGrowth?.recognition||0),fans:auditRound(st.studioGrowth?.fans||0),rank};
 const talent={actors:actors.length,directors:directors.length,retired:(st.talent||[]).filter(t=>t.retired).length,actorFeeP10:auditRound(auditQuantile(actorFees,.1)),actorFeeMedian:auditRound(auditQuantile(actorFees,.5)),actorFeeP90:auditRound(auditQuantile(actorFees,.9)),actorFeeMax:auditRound(actorFees.length?Math.max(...actorFees):null),actorsUnder1_5:actors.filter(t=>(+t.fee||0)<=1.5).length,actorsUnder3:actors.filter(t=>(+t.fee||0)<=3).length,directorFeeMedian:auditRound(auditQuantile(directorFees,.5))};
 const scripts={market:marketScripts.length,priceMedian:auditRound(auditQuantile(scriptPrices,.5)),priceP90:auditRound(auditQuantile(scriptPrices,.9)),naturalBudgetMedian:auditRound(auditQuantile(naturalBudgets,.5)),turnarounds:st.screenplayEconomy?.turnarounds||0,turnaroundDeals:scriptLedger.turnaround.deals,turnaroundPriceMedian:scriptLedger.turnaround.priceMedian,turnaroundBudgetMedian:scriptLedger.turnaround.budgetMedian,turnaroundPriceToBudgetMedian:scriptLedger.turnaround.priceToBudgetMedian,standardDeals:scriptLedger.standard.deals,standardPriceMedian:scriptLedger.standard.priceMedian,standardBudgetMedian:scriptLedger.standard.budgetMedian,standardPriceToBudgetMedian:scriptLedger.standard.priceToBudgetMedian};
 const rivalSummary={count:rivals.length,distressed,medianCash:auditRound(auditQuantile(rivalCash,.5)),medianPnl:auditRound(auditQuantile(rivalPnl,.5)),restructures:rivals.reduce((a,r)=>a+r.restructures,0)};
 const base={week:st.week,year:Math.ceil((st.week||1)/52),day:st.calendarDay||null,player,rivalSummary,aiEconomy,talent,scripts,releases:profiles,releaseVariance};
 if(compact)return base;
 return {...base,rivals,filmLedger:ledger,screenplayLedger:scriptLedger,career:{allCompleted:allDone.length,marketGross:auditRound(allDone.reduce((a,f)=>a+(f.finalGross||0),0)),marketProfit:auditRound(allDone.reduce((a,f)=>a+auditFilmProfit(f),0)),playerBudgetP10:auditRound(auditQuantile(budgets,.1)),playerBudgetP90:auditRound(auditQuantile(budgets,.9)),playerProfitMedian:auditRound(auditQuantile(filmProfits,.5))}};
}
function simulationAuditEvaluate(st=state,snapshot=simulationAuditSnapshot(st,false)){
 const flags=[],add=(key,severity,label,detail)=>flags.push({key,severity,label,detail});
 const p=snapshot.player,t=snapshot.talent,rs=snapshot.rivalSummary,rel=snapshot.releases,totalReleases=Object.values(rel).reduce((a,b)=>a+b,0),ai=snapshot.aiEconomy||{},variance=snapshot.releaseVariance||{};
 if(p.debt>=80)add('player-debt-high','warn','Bridge debt is becoming structural',`${money(p.debt)} outstanding by Year ${snapshot.year}.`);
 if(p.runwayWeeks!==null&&p.runwayWeeks<1.25)add('player-runway-critical','bad','Player cash runway is under 1.25 weeks',`Current recurring burn leaves about ${p.runwayWeeks} weeks of cash.`);
 if(t.actors>=10&&t.actorsUnder3<4)add('cheap-actor-scarcity','warn','Low-cost actor market is thin',`Only ${t.actorsUnder3} active actors are asking $3m or less.`);
 if(t.actorFeeMedian!==null&&t.actorFeeMedian>8)add('actor-fee-inflation','warn','Actor fee median looks inflated',`Median active actor asking price is ${money(t.actorFeeMedian)}.`);
 if(snapshot.rivals.length>=3){const eligible=snapshot.rivals.filter(r=>r.completed>=3);if(eligible.length>=3&&eligible.every(r=>r.pnl>8))add('rivals-uniformly-profitable','warn','AI studio profits are unusually uniform',`${eligible.length} established rivals are all more than $8m profitable.`)}
 if(ai.completed>=12&&ai.avgProfit!==null&&ai.avgProfit<-5&&(ai.profitableRate??1)<.30)add('ai-economy-loss-skew','bad','AI film economics are structurally loss-skewed',`${ai.completed} completed rival films average ${money(ai.avgProfit)} P&L with only ${Math.round((ai.profitableRate||0)*100)}% recording a profit.`);
 if(rs.count&&rs.distressed>=Math.ceil(rs.count*.6))add('rival-distress-cluster','bad','Most rival studios are financially strained',`${rs.distressed} of ${rs.count} rivals are currently strained or distressed.`);
 if(totalReleases>=20){const bombs=(rel.bomb||0)/totalReleases,breakouts=(rel.breakout||0)/totalReleases;if((variance.expectedNonStandard||0)>=2&&variance.observedNonStandard<=Math.floor(variance.expectedNonStandard*.45)&&(variance.lowTailProbability??1)<.08)add('release-variance-low','warn','Release outcomes are clustering more tightly than this portfolio predicts',`${variance.observedNonStandard} non-standard outcomes occurred versus ${variance.expectedNonStandard} expected; lower-tail probability ${Math.round((variance.lowTailProbability||0)*100)}%.`);if(bombs>.30)add('bomb-rate-high','warn','Bomb rate is unusually high',`${Math.round(bombs*100)}% of completed releases are bombs.`);if(breakouts>.20)add('breakout-rate-high','warn','Breakout rate is unusually high',`${Math.round(breakouts*100)}% of completed releases are breakouts.`)}
 if(snapshot.scripts.market>=5&&snapshot.scripts.priceMedian!==null&&snapshot.scripts.naturalBudgetMedian!==null&&snapshot.scripts.priceMedian>snapshot.scripts.naturalBudgetMedian*.28)add('script-price-pressure','warn','Script acquisition prices are eating heavily into production scale',`Median market price ${money(snapshot.scripts.priceMedian)} vs median natural production budget ${money(snapshot.scripts.naturalBudgetMedian)}.`);
 if(snapshot.scripts.turnaroundDeals>=3&&snapshot.scripts.turnaroundPriceToBudgetMedian!==null&&snapshot.scripts.standardPriceToBudgetMedian!==null&&snapshot.scripts.turnaroundPriceToBudgetMedian>snapshot.scripts.standardPriceToBudgetMedian*1.65)add('turnaround-price-premium','warn','Turnaround rights carry a large relative premium',`Median turnaround rights equal ${Math.round(snapshot.scripts.turnaroundPriceToBudgetMedian*100)}% of natural budget versus ${Math.round(snapshot.scripts.standardPriceToBudgetMedian*100)}% for standard deals.`);
 return flags;
}
function recordSimulationAudit(reason='weekly',st=state){
 if(!st?.studio||!st.careerStarted)return null;const a=ensureSimulationAudit(st);if(!a.enabled)return null;
 const snap=simulationAuditSnapshot(st,true);if(a.firstWeek===null)a.firstWeek=st.week;a.lastWeek=st.week;a.captures++;
 const prior=a.weekly[a.weekly.length-1];if(prior?.week===snap.week)a.weekly[a.weekly.length-1]=snap;else a.weekly.push(snap);a.weekly=a.weekly.slice(-156);
 if(reason!=='weekly'||st.week%13===0||!a.quarterly.length){const full=simulationAuditSnapshot(st,false),entry={reason,...full};const q=a.quarterly[a.quarterly.length-1];if(q?.week===entry.week)a.quarterly[a.quarterly.length-1]=entry;else a.quarterly.push(entry);a.quarterly=a.quarterly.slice(-100);const flags=simulationAuditEvaluate(st,full);flags.forEach(f=>{const last=a.flags.find(x=>x.key===f.key);if(!last||st.week-(last.week||0)>=13)a.flags.unshift({...f,week:st.week,year:full.year})});a.flags=a.flags.slice(0,80)}
 return snap;
}
function simulationAuditReport(st=state){
 const a=ensureSimulationAudit(st),current=simulationAuditSnapshot(st,false),flags=simulationAuditEvaluate(st,current),first=a.quarterly[0]||null;
 const trends={actorFeeMedianChange:first?.talent?.actorFeeMedian&&current.talent.actorFeeMedian!==null?auditRound(current.talent.actorFeeMedian-first.talent.actorFeeMedian):null,actorsUnder3Change:first?.talent?.actorsUnder3!==undefined?current.talent.actorsUnder3-first.talent.actorsUnder3:null};
 return {build:VERSION,auditSchema:a.schema,seed:st.seed,difficulty:st.difficulty,week:st.week,year:current.year,current,trends,flags,latestBenchmark:a.benchmarks[0]||null,history:{firstWeek:a.firstWeek,lastWeek:a.lastWeek,weeklySamples:a.weekly.length,quarterlySamples:a.quarterly.length,captures:a.captures,recentQuarterly:a.quarterly.slice(-12),flagHistory:a.flags.slice(0,30),benchmarks:a.benchmarks.slice(0,3)}};
}
function simulationBenchmarkIndustrySnapshot(st=state){
 const ledger=simulationAuditFilmLedger(st).filter(x=>x.owner!=='player'),profits=ledger.map(x=>x.profit).filter(Number.isFinite),invest=ledger.map(x=>x.investment).filter(Number.isFinite),gross=ledger.map(x=>x.gross).filter(Number.isFinite),profiles={standard:0,bomb:0,breakout:0,sleeper:0,frontloaded:0,other:0};ledger.forEach(x=>profiles[x.releaseProfile]===undefined?profiles.other++:profiles[x.releaseProfile]++);
 const actors=(st.talent||[]).filter(t=>t.type==='Actor'&&!t.retired),fees=actors.map(t=>+t.fee||0),rivals=(st.rivals||[]).map(rv=>({status:aiFinancialHealth(rv),cash:rv.cash||0,debt:rv.debt||0,restructures:rv.restructures||0,catalogueRevenue:rv.catalogueRevenue||0,overhead:rv.lifetimeOverhead||0,interest:rv.totalInterest||0})),scripts=simulationAuditScreenplayLedger(st);
 const healthCounts={financialDistress:rivals.filter(r=>r.status==='Financial distress').length,underPressure:rivals.filter(r=>r.status==='Under pressure').length,leveraged:rivals.filter(r=>r.status==='Leveraged').length,stable:rivals.filter(r=>r.status==='Stable').length,financiallyStrong:rivals.filter(r=>r.status==='Financially strong').length,cashRich:rivals.filter(r=>r.status==='Cash-rich').length};
 const expectedProfiles={bomb:0,breakout:0,sleeper:0,frontloaded:0,nonStandard:0};(st.films||[]).filter(f=>f.owner!=='player'&&f.stage==='complete').forEach(f=>{const p=auditReleaseProbability(f);Object.keys(expectedProfiles).forEach(k=>expectedProfiles[k]+=p[k]||0)});Object.keys(expectedProfiles).forEach(k=>expectedProfiles[k]=auditRound(expectedProfiles[k],2));
 const totalProfit=auditRound(profits.reduce((a,b)=>a+b,0)),catalogueRevenue=auditRound(rivals.reduce((a,r)=>a+r.catalogueRevenue,0)),overhead=auditRound(rivals.reduce((a,r)=>a+r.overhead,0)),interest=auditRound(rivals.reduce((a,r)=>a+r.interest,0));
 return {week:st.week,year:Math.ceil(st.week/52),films:ledger.length,totalProfit,avgProfit:auditRound(profits.length?profits.reduce((a,b)=>a+b,0)/profits.length:null),profitable:profits.filter(x=>x>.5).length,profitableRate:auditRound(profits.length?profits.filter(x=>x>.5).length/profits.length:null,4),avgInvestment:auditRound(invest.length?invest.reduce((a,b)=>a+b,0)/invest.length:null),avgGross:auditRound(gross.length?gross.reduce((a,b)=>a+b,0)/gross.length:null),profiles,expectedProfiles,healthCounts,distressed:healthCounts.financialDistress+healthCounts.underPressure,medianCash:auditRound(auditQuantile(rivals.map(r=>r.cash),.5)),medianDebt:auditRound(auditQuantile(rivals.map(r=>r.debt),.5)),restructures:rivals.reduce((a,r)=>a+r.restructures,0),catalogueRevenue,legacyCatalogueRevenue:auditRound((st.rivals||[]).reduce((a,r)=>a+(r.legacyCatalogueRevenue||0),0)),overhead,interest,systemNet:auditRound(totalProfit+catalogueRevenue-overhead-interest),actorFeeMedian:auditRound(auditQuantile(fees,.5)),actorsUnder3:actors.filter(t=>(+t.fee||0)<=3).length,screenplays:{turnaround:{...scripts.turnaround},standard:{...scripts.standard}}};
}
function simulationBenchmarkOne(years=5,seed=40031){
 const bench=initialState();bench.seed=hash(`audit-benchmark-v4005|${seed}`);bench.studio={name:'Audit Lab',brand:normalizeBrand({theme:'violet',mark:'aperture',wordmark:'modern'},'Audit Lab')};bench.careerStarted=true;bench.cash=1000;bench.screen='studio';bench.difficulty='normal';bench.simulationAudit={schema:2,enabled:false,firstWeek:null,lastWeek:0,weekly:[],quarterly:[],flags:[],captures:0,benchmarks:[]};
 state=bench;state.talent.forEach(ensureTalentMarketEconomy);aiStartProjects();const yearly=[],endDay=Math.max(364,Math.floor(years)*364);
 for(let day=2;day<=endDay;day++){state.calendarDay=day;const week=calendarWeekForDay(day);state.week=week;if(calendarWeekdayIndex(day)===0&&week>state.lastWeeklyHeartbeatWeek)runWeeklyHeartbeat(week);processReleaseDay(day);if(calendarWeekdayIndex(day)===6){processBoxOfficeSunday(day);if(week%52===0)yearly.push(simulationBenchmarkIndustrySnapshot(state));}}
 return {seed,years:Math.floor(years),yearly,final:simulationBenchmarkIndustrySnapshot(state)};
}
function simulationBenchmarkAggregate(runs){
 const finals=(runs||[]).map(r=>r.final),films=finals.reduce((a,x)=>a+(x.films||0),0),profit=finals.reduce((a,x)=>a+(x.totalProfit||0),0),profitable=finals.reduce((a,x)=>a+(x.profitable||0),0),profiles={standard:0,bomb:0,breakout:0,sleeper:0,frontloaded:0,other:0},expectedProfiles={bomb:0,breakout:0,sleeper:0,frontloaded:0,nonStandard:0};finals.forEach(x=>{Object.keys(profiles).forEach(k=>profiles[k]+=x.profiles?.[k]||0);Object.keys(expectedProfiles).forEach(k=>expectedProfiles[k]+=x.expectedProfiles?.[k]||0)});
 const weighted=(key)=>films?finals.reduce((a,x)=>a+(x[key]||0)*(x.films||0),0)/films:null,avg=(key)=>auditRound(finals.length?finals.reduce((a,x)=>a+(x[key]||0),0)/finals.length:null);
 const dealAggregate=kind=>{const rows=finals.map(x=>x.screenplays?.[kind]).filter(Boolean),count=rows.reduce((a,x)=>a+(x.deals||0),0);return {deals:count,avgPriceMedian:auditRound(rows.length?rows.reduce((a,x)=>a+(x.priceMedian||0),0)/rows.length:null),avgBudgetMedian:auditRound(rows.length?rows.reduce((a,x)=>a+(x.budgetMedian||0),0)/rows.length:null),avgPriceToBudgetMedian:auditRound(rows.length?rows.reduce((a,x)=>a+(x.priceToBudgetMedian||0),0)/rows.length:null,4)};};
 const avgHealth=key=>auditRound(finals.length?finals.reduce((a,x)=>a+(x.healthCounts?.[key]||0),0)/finals.length:null,2);
 Object.keys(expectedProfiles).forEach(k=>expectedProfiles[k]=auditRound(expectedProfiles[k],2));
 return {runs:finals.length,films,totalProfit:auditRound(profit),avgProfit:auditRound(films?profit/films:null),profitableRate:auditRound(films?profitable/films:null,4),avgInvestment:auditRound(weighted('avgInvestment')),avgGross:auditRound(weighted('avgGross')),profiles,expectedProfiles,standardRate:auditRound(films?(profiles.standard||0)/films:null,4),avgDistressedAtEnd:avg('distressed'),avgFinancialDistressAtEnd:avgHealth('financialDistress'),avgUnderPressureAtEnd:avgHealth('underPressure'),avgLeveragedAtEnd:avgHealth('leveraged'),avgStableAtEnd:avgHealth('stable'),avgFinanciallyStrongAtEnd:avgHealth('financiallyStrong'),avgCashRichAtEnd:avgHealth('cashRich'),avgMedianCash:avg('medianCash'),avgMedianDebt:avg('medianDebt'),avgCatalogueRevenue:avg('catalogueRevenue'),avgLegacyCatalogueRevenue:avg('legacyCatalogueRevenue'),avgOverhead:avg('overhead'),avgInterest:avg('interest'),avgSystemNet:avg('systemNet'),avgActorFeeMedian:avg('actorFeeMedian'),avgActorsUnder3:avg('actorsUnder3'),screenplays:{turnaround:dealAggregate('turnaround'),standard:dealAggregate('standard')}};
}
function runSimulationBenchmarkSuite(){
 if(simulationBenchmarkActive)return null;const original=state;simulationBenchmarkActive=true;let result=null,error=null;
 try{const seeds=[40031,40032,40033],runs=seeds.map(seed=>simulationBenchmarkOne(5,seed));result={model:'v4.0d.4-modular-hardening',createdWeek:original.week,careerSeed:original.seed,yearsPerRun:5,seeds,runs,aggregate:simulationBenchmarkAggregate(runs)};}catch(e){error=e;}finally{state=original;simulationBenchmarkActive=false}
 if(error){console.error(error);showToast(`Benchmark failed: ${error.message||error}`);return null}
 const a=ensureSimulationAudit(state);a.benchmarks.unshift(result);a.benchmarks=a.benchmarks.slice(0,5);save();render();showToast('3 × 5-year AI benchmark complete.');return result;
}
function simulationAuditAccess(){
 try{return new URLSearchParams(location.search).get('audit')==='1'||localStorage.getItem('projectSlateAuditMode')==='1'}catch(e){return false}
}
function simulationAuditExport(){
 const report=simulationAuditReport(),json=JSON.stringify(report,null,2),blob=new Blob([json],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`project-slate-audit-${VERSION}-week-${state.week}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
}
function simulationAuditBody(){
 const report=simulationAuditReport(),x=report.current,p=x.player,t=x.talent,scr=x.scripts,rel=x.releases,a=ensureSimulationAudit(),flags=report.flags,ai=x.aiEconomy||{},variance=x.releaseVariance||{},bench=report.latestBenchmark?.aggregate;
 const rivalRows=x.rivals.map(r=>`<div class="listrow"><span><strong>${r.name}</strong><br><small>${r.status} · ${r.completed} completed</small></span><strong>${money(r.cash)} cash · ${money(r.debt)} debt · ${r.pnl>=0?'+':''}${money(r.pnl)} P&L</strong></div>`).join('');
 const releaseTotal=Object.values(rel).reduce((n,v)=>n+v,0);
 return `<div class="card"><div class="row"><div><div class="badge">INTERNAL DIAGNOSTICS</div><h2 style="margin:7px 0 3px">Simulation Audit · v4.0a</h2><div class="small">The live career is observed without changing outcomes. The benchmark lab below uses a temporary isolated state and restores this career afterwards.</div></div><span class="pill">${a.weekly.length} weekly samples</span></div><div class="row" style="margin-top:12px;gap:8px"><button id="captureSimulationAudit" class="btn">Capture now</button><button id="exportSimulationAudit" class="btn primary">Export JSON</button></div></div>
 <div class="section-title"><h2>Benchmark lab</h2><span class="small">Real engine · 3 seeds × 5 years · AI industry only</span></div><div class="card"><div class="body">Runs the actual weekly AI finance, production, release and box-office engine in an isolated temporary career. Your current save is restored when the benchmark finishes.</div><button id="runSimulationBenchmark" class="btn primary block" style="margin-top:10px">Run 3 × 5-year benchmark</button>${bench?`<div class="hr"></div><div class="listrow"><span>Completed rival films</span><strong>${bench.films}</strong></div><div class="listrow"><span>Average film P&L</span><strong class="${bench.avgProfit>=0?'goodtext':'badtext'}">${bench.avgProfit>=0?'+':''}${money(bench.avgProfit||0)}</strong></div><div class="listrow"><span>Profitable films</span><strong>${Math.round((bench.profitableRate||0)*100)}%</strong></div><div class="listrow"><span>Standard outcomes</span><strong>${Math.round((bench.standardRate||0)*100)}%</strong></div><div class="listrow"><span>Average true financial distress at Year 5</span><strong>${bench.avgFinancialDistressAtEnd??'—'}</strong></div><div class="listrow"><span>Average under pressure at Year 5</span><strong>${bench.avgUnderPressureAtEnd??bench.avgDistressedAtEnd}</strong></div><div class="listrow"><span>Average 5-year system net</span><strong class="${(bench.avgSystemNet||0)>=0?'goodtext':'badtext'}">${(bench.avgSystemNet||0)>=0?'+':''}${money(bench.avgSystemNet||0)}</strong></div><div class="listrow"><span>Frontloaded observed / expected</span><strong>${bench.profiles?.frontloaded||0} / ${bench.expectedProfiles?.frontloaded??'—'}</strong></div><div class="listrow"><span>Average 5-year rival catalogue receipts</span><strong>${money(bench.avgCatalogueRevenue||0)}</strong></div><div class="listrow"><span>Legacy catalogue share</span><strong>${money(bench.avgLegacyCatalogueRevenue||0)}</strong></div><div class="listrow"><span>Average 5-year rival overhead</span><strong>${money(bench.avgOverhead||0)}</strong></div><div class="listrow"><span>Average 5-year rival interest</span><strong>${money(bench.avgInterest||0)}</strong></div><div class="listrow"><span>Turnaround / standard benchmark deals</span><strong>${bench.screenplays?.turnaround?.deals||0} / ${bench.screenplays?.standard?.deals||0}</strong></div>`:`<div class="small" style="margin-top:9px">No benchmark has been run on this build yet.</div>`}</div>
 <div class="section-title"><h2>Player economy</h2><span class="small">Career health, not a score</span></div><div class="grid cols4"><div class="card"><div class="badge">Cash</div><div class="kpi">${money(p.cash)}</div></div><div class="card ${p.debt>=80?'dangerline':''}"><div class="badge">Bridge debt</div><div class="kpi">${money(p.debt)}</div></div><div class="card"><div class="badge">Film P&L</div><div class="kpi ${p.profit>=0?'goodtext':'badtext'}">${p.profit>=0?'+':''}${money(p.profit)}</div></div><div class="card"><div class="badge">Runway</div><div class="kpi" style="font-size:18px">${p.runwayWeeks===null?'Self-funding':p.runwayWeeks+' wks'}</div></div></div>
 <div class="card"><div class="listrow"><span>Completed / active films</span><strong>${p.completed} / ${p.active}</strong></div><div class="listrow"><span>Lifetime film gross</span><strong>${money(p.gross)}</strong></div><div class="listrow"><span>Average production budget</span><strong>${money(p.avgBudget)}</strong></div><div class="listrow"><span>Average marketing</span><strong>${money(p.avgMarketing)}</strong></div><div class="listrow"><span>Weekly overhead / catalogue</span><strong>${moneyFine(p.overhead)} / ${moneyFine(p.catalogue)}</strong></div><div class="listrow"><span>Profitable / loss-making films</span><strong>${p.profitable} / ${p.losses}</strong></div></div>
 <div class="section-title"><h2>Rival economy</h2><span class="small">${ai.completed} completed AI films · average ${ai.avgProfit>=0?'+':''}${money(ai.avgProfit||0)} P&L</span></div><div class="grid cols4"><div class="card"><div class="badge">AI profitable rate</div><div class="kpi">${Math.round((ai.profitableRate||0)*100)}%</div></div><div class="card"><div class="badge">Avg investment</div><div class="kpi" style="font-size:18px">${money(ai.avgInvestment||0)}</div></div><div class="card"><div class="badge">Avg gross</div><div class="kpi" style="font-size:18px">${money(ai.avgGross||0)}</div></div><div class="card"><div class="badge">Legacy finish films</div><div class="kpi">${ai.legacyFinishFilms||0}</div></div></div><div class="card">${rivalRows||'<div class="body">No rival data.</div>'}</div>
 <div class="section-title"><h2>Talent market</h2></div><div class="grid cols4"><div class="card"><div class="badge">Active actors</div><div class="kpi">${t.actors}</div></div><div class="card"><div class="badge">≤ $3m actors</div><div class="kpi">${t.actorsUnder3}</div></div><div class="card"><div class="badge">Median actor fee</div><div class="kpi" style="font-size:18px">${money(t.actorFeeMedian||0)}</div></div><div class="card"><div class="badge">90th percentile</div><div class="kpi" style="font-size:18px">${money(t.actorFeeP90||0)}</div></div></div>
 <div class="section-title"><h2>Release variance</h2><span class="small">${releaseTotal} completed films · ${variance.observedNonStandard||0} non-standard vs ${variance.expectedNonStandard||0} expected</span></div><div class="card"><div class="listrow"><span>Standard</span><strong>${rel.standard}</strong></div><div class="listrow"><span>Bombs</span><strong>${rel.bomb}</strong></div><div class="listrow"><span>Breakouts</span><strong>${rel.breakout}</strong></div><div class="listrow"><span>Sleepers</span><strong>${rel.sleeper}</strong></div><div class="listrow"><span>Front-loaded</span><strong>${rel.frontloaded}</strong></div><div class="listrow"><span>Chance of this few-or-fewer non-standard outcomes</span><strong>${Math.round((variance.lowTailProbability??1)*100)}%</strong></div></div>
 <div class="section-title"><h2>Screenplay market</h2></div><div class="card"><div class="listrow"><span>Live market scripts</span><strong>${scr.market}</strong></div><div class="listrow"><span>Median rights price</span><strong>${money(scr.priceMedian||0)}</strong></div><div class="listrow"><span>Turnaround deals / median price</span><strong>${scr.turnaroundDeals} / ${scr.turnaroundPriceMedian===null?'—':money(scr.turnaroundPriceMedian)}</strong></div><div class="listrow"><span>Turnaround median natural budget</span><strong>${scr.turnaroundBudgetMedian===null?'—':money(scr.turnaroundBudgetMedian)}</strong></div><div class="listrow"><span>Standard deals / median price</span><strong>${scr.standardDeals} / ${scr.standardPriceMedian===null?'—':money(scr.standardPriceMedian)}</strong></div><div class="listrow"><span>Standard median natural budget</span><strong>${scr.standardBudgetMedian===null?'—':money(scr.standardBudgetMedian)}</strong></div></div>
 <div class="section-title"><h2>Diagnostic flags</h2><span class="small">Thresholds identify places to investigate; they are not automatic balance verdicts.</span></div><div class="grid">${flags.length?flags.map(f=>`<div class="card ${f.severity==='bad'?'dangerline':'attention'}"><div class="badge">${f.severity==='bad'?'HIGH':'WATCH'}</div><strong>${f.label}</strong><div class="small" style="margin-top:6px">${f.detail}</div></div>`).join(''):'<div class="card goodline"><div class="body">No audit thresholds are currently firing.</div></div>'}</div>
 <div class="section-title"><h2>Sampling</h2></div><div class="card"><div class="listrow"><span>Detailed rolling window</span><strong>${a.weekly.length} / 156 weeks</strong></div><div class="listrow"><span>Quarterly career snapshots</span><strong>${a.quarterly.length} / 100</strong></div><div class="listrow"><span>Audit captures</span><strong>${a.captures}</strong></div><div class="listrow"><span>Stored benchmarks</span><strong>${a.benchmarks.length} / 5</strong></div><div class="small" style="margin-top:8px">Weekly samples roll off after three years; quarterly snapshots preserve roughly 25 years of long-run history.</div></div>`;
}
function ensureEconomyState(st=state){
 if(!st.economy)st.economy={lifetimeOverhead:0,lifetimeCatalogue:0,lifetimeAncillary:0,lastWeeklyOverhead:0,lastCatalogueReceipts:0};
 return st.economy;
}
function studioScaleScore(st=state){
 const g=ensureStudioGrowth(st),done=(st.films||[]).filter(f=>f.owner==='player'&&f.stage==='complete').length;
 const fanTerm=Math.min(18,Math.sqrt(Math.max(0,g.fans||0))*7);
 return (g.recognition||12)+fanTerm+Math.min(18,done*3.0);
}
function studioOperatingScale(st=state){
 const score=studioScaleScore(st);
 if(score<28)return {id:'startup',label:'Startup operation',score,weekly:.075,desc:'A lean permanent staff with basic legal, finance and distribution administration.'};
 if(score<48)return {id:'independent',label:'Independent studio',score,weekly:.105,desc:'A growing permanent team supporting a larger slate, catalogue and talent network.'};
 if(score<68)return {id:'established',label:'Established studio',score,weekly:.145,desc:'A substantial year-round operation with business affairs, distribution and library administration.'};
 if(score<86)return {id:'major',label:'Major independent',score,weekly:.200,desc:'A large permanent organisation. Success brings access, but also a meaningful fixed cost base.'};
 return {id:'powerhouse',label:'Industry powerhouse',score,weekly:.270,desc:'A heavyweight studio infrastructure that is expensive to leave under-used for long periods.'};
}
function activeSlateOverhead(){
 const active=activePlayerFilms();
 const base=active.filter(f=>f.stage==='development'&&!f.paused).length*.025+
  active.filter(f=>f.stage==='development'&&f.paused).reduce((a,f)=>a+heldProjectWeeklyCost(f),0)+
  active.filter(f=>f.stage==='production').length*.055+
  active.filter(f=>['post','marketing','scheduled'].includes(f.stage)).length*.03+
  active.filter(f=>f.stage==='cinema').length*.02;
 return +(base*capitalSlateMultiplier()).toFixed(4);
}
function studioOverheadBreakdown(){const scale=studioOperatingScale(),relief=recoveryOperatingMultiplier(),departments=studioUpgradeOverhead()*relief,assets=capitalAssetWeeklyOverhead(),slate=activeSlateOverhead(),market=typeof corporateWeeklyOverhead==='function'?corporateWeeklyOverhead():0,baseCorporate=scale.weekly*relief;return {scale,baseCorporate,market,corporate:baseCorporate+market,departments,assets,slate,total:baseCorporate+market+departments+assets+slate,recoveryRelief:relief}}
function currentCatalogueReceipts(){
 return playerFilms().filter(f=>f.stage==='complete').reduce((a,f)=>a+(ensureAfterlifeState(f).weeklyRevenue||0),0);
}
function currentIdleCarry(){
 const b=studioOverheadBreakdown(),catalogue=currentCatalogueReceipts();
 return {overhead:b.corporate+b.departments+(b.assets||0),catalogue,net:catalogue-(b.corporate+b.departments+(b.assets||0))};
}
function recordWeeklyEconomy(overhead,catalogue=0){
 const e=ensureEconomyState();e.lastWeeklyOverhead=overhead;e.lastCatalogueReceipts=catalogue;e.lifetimeOverhead=+(e.lifetimeOverhead+overhead).toFixed(3);e.lifetimeCatalogue=+(e.lifetimeCatalogue+catalogue).toFixed(3);
}
function recordAncillarySettlement(v){const e=ensureEconomyState();e.lifetimeAncillary=+(e.lifetimeAncillary+Math.max(0,v||0)).toFixed(3)}
function ancillarySettlementRate(){return .0225}


function ensureLegacyState(f){
 if(!f)return null;
 if(!f.legacy)f.legacy={built:false,tags:[],talentImpacts:[],summary:'',headline:'',outcome:'',outcomeClass:'',domestic:0,international:0,profit:0,roi:0,peakRank:null,weeksAtOne:0,bestHold:null,opening:0};
 f.legacy.tags=f.legacy.tags||[];f.legacy.talentImpacts=f.legacy.talentImpacts||[];return f.legacy;
}
function filmOutcomeLabel(f,profit){
 const inv=Math.max(1,f.investment||1),roi=profit/inv,profile=f.releaseProfile?.type;
 if(profile==='bomb'||(profit<-12&&roi<-.35))return {label:'Box-office bomb',cls:'bad'};
 if(profit<-6||roi<-.22)return {label:'Commercial flop',cls:'bad'};
 if(profit<-.5)return {label:'Financial disappointment',cls:'warn'};
 if(profit<=2)return {label:'Around break-even',cls:'blue'};
 if(profile==='breakout'||profit>22||roi>.75)return {label:'Breakout hit',cls:'good'};
 if(profit>10||roi>.38)return {label:'Hit',cls:'good'};
 return {label:'Profitable release',cls:'good'};
}
function buildFilmLegacy(f,talentBefore={}){
 const l=ensureLegacyState(f),dom=f.weeklyResults.reduce((a,w)=>a+w.dom,0),intl=f.weeklyResults.reduce((a,w)=>a+w.intl,0),profit=f.studioRevenue-f.investment,stats=boxRunStats(f),outcome=filmOutcomeLabel(f,profit);
 const drops=f.weeklyResults.map(w=>w.drop).filter(x=>x!==null&&x!==undefined),bestHold=drops.length?Math.min(...drops):null,opening=f.weeklyResults[0]?.dom||0;
 const tags=boxOfficeMilestones(f);
 if(f.review?.critics>=85)tags.push('Critical favourite');
 if(f.review?.audience>=88)tags.push('Audience favourite');
 if(profit>15)tags.push('Major studio profit');
 if(profit<-8)tags.push('Major studio loss');
 const people=[talentById(f.directorId),...packageActors(f)].filter(Boolean);
 const impacts=people.map(t=>({id:t.id,name:t.name,type:t.type,before:talentBefore[t.id]??Math.round((t.momentum||60)-(t.momentumDelta||0)),after:Math.round(t.momentum||60),delta:Math.round((t.momentum||60)-(talentBefore[t.id]??(t.momentum||60)))}));
 let summary=`${f.title} finished with ${money(f.finalGross)} worldwide after opening to ${money(opening)} domestic.`;
 if(stats.best){summary+=` It peaked at #${stats.best}`;if(stats.weeksAtOne>0)summary+=` and spent ${stats.weeksAtOne} week${stats.weeksAtOne===1?'':'s'} at #1`;summary+='.'}else if(stats.weeksAtOne>0)summary+=` It spent ${stats.weeksAtOne} week${stats.weeksAtOne===1?'':'s'} at #1.`;
 if(bestHold!==null){if(bestHold<0)summary+=` Its strongest weekend actually grew ${Math.round(Math.abs(bestHold)*100)}%.`;else if(bestHold<.25)summary+=` Its best hold was an excellent ${Math.round(bestHold*100)}% decline.`;else if(bestHold>.67)summary+=` Demand proved front-loaded, with the run suffering a ${Math.round(bestHold*100)}% drop at its weakest point.`}
 summary+=` The studio records ${profit>=0?'a profit of':'a loss of'} ${money(Math.abs(profit))} against ${money(f.investment)} invested. ${distributionLabel(f)} shaped the theatrical economics of the run.`;
 l.built=true;l.tags=[...new Set(tags)];l.talentImpacts=impacts;l.summary=summary;l.callback=priorFilmCallback(f,profit);l.headline=`${outcome.label}: ${f.title} closes at ${money(f.finalGross)} worldwide`;l.outcome=outcome.label;l.outcomeClass=outcome.cls;l.domestic=dom;l.international=intl;l.profit=profit;l.roi=profit/Math.max(1,f.investment||1);l.peakRank=stats.best;l.weeksAtOne=stats.weeksAtOne;l.bestHold=bestHold;l.opening=opening;l.completedWeek=state.week;l.ancillarySettlement=f.ancillarySettlement||0;l.distribution=distributionLabel(f);l.finalCash=state.cash;
 return l;
}
function ensureWrapQueue(st=state){st.pendingFilmWraps=st.pendingFilmWraps||[];return st.pendingFilmWraps}
function queueFilmWrap(f){const q=ensureWrapQueue();if(!q.includes(f.id))q.push(f.id)}
function surfacePendingFilmWrap(){
 if(state.pendingCeremony||state.pendingAwardsNominations||state.activeLegendUnlockId||state.activeStudioMoment||state.screen==='legendUnlock'||state.screen==='studioMoment')return false;
 const q=ensureWrapQueue();while(q.length){const id=q.shift(),f=filmById(id);if(f&&f.owner==='player'&&f.stage==='complete'){state.activeFilmWrapId=id;state.uiFilmWrapStep=0;state.screen='filmWrap';state.detail=null;state.history=[];return true}}
 return false;
}
function continueFilmWrap(){
 const id=state.activeFilmWrapId;state.activeFilmWrapId=null;state.uiFilmWrapStep=0;
 if(state.pendingCeremony){state.screen='ceremony';state.detail=null;save();render();return}
 if(state.pendingAwardsNominations){state.screen='nominations';state.detail=null;save();render();return}
 if(surfacePendingLegendUnlock()){save();render();return}
 if(surfacePendingFilmWrap()){save();render();return}
 if(surfacePendingStudioMoment()){save();render();return}
 state.screen='studio';state.uiStudioTab='library';state.detail=null;state.history=[];requestScrollTop();save();render();
}
function completedFilmLegacyLine(f){const l=ensureLegacyState(f);if(!l.built)buildFilmLegacy(f,{});return `${l.outcome} · peak ${l.peakRank?'#'+l.peakRank:'—'} · ${l.weeksAtOne} week${l.weeksAtOne===1?'':'s'} at #1`}


function ensureStudioMoments(st=state){
 st.studioMomentQueue=st.studioMomentQueue||[];st.activeStudioMoment=st.activeStudioMoment||null;return st.studioMomentQueue;
}
function campaignSocialDelta(type,result){
 const table={
  trailer:{viral:[16,5,4,2,'trailer breakout'],strong:[9,3,2,0,'trailer reaction'],mixed:[5,-1,1,0,'first trailer'],soft:[4,-8,0,4,'soft trailer']},
  festivalDecision:{accepted:[4,3,2,0,'festival selection'],rejected:[2,-2,0,1,'festival miss']},
  festivalScreening:{strong:[10,6,4,0,'festival praise'],mixed:[7,0,2,3,'divided festival reaction'],poor:[8,-10,-1,7,'festival backlash']},
  publicity:{excellent:[11,5,3,0,'press-tour moment'],viral:[15,3,4,2,'digital breakout'],solid:[6,2,1,0,'publicity week'],awkward:[8,-9,-1,8,'awkward interview'],flat:[3,-4,0,1,'flat publicity']},
  gala:{hot:[12,5,3,1,'premiere night'],solid:[7,1,1,0,'world premiere'],flat:[5,-5,-1,2,'premiere photos']}
 };
 const v=table[type]?.[result];return v?{volume:v[0],sentiment:v[1],fandom:v[2],controversy:v[3],topic:v[4]}:null;
}
function campaignMomentVoice(f,type,data={}){
 const result=data.result||'',banks={
  trailer:{
   viral:[`The paid campaign has lost custody of the trailer. People are passing it around because they want to, which is the bit a media budget cannot simply order.`],
   strong:[`The trailer has done the useful thing: made the film feel like something people may choose, not merely something they have now heard of.`],
   mixed:[`The trailer is being seen and politely discussed. Nobody is panicking; nobody is cancelling plans to watch it again either.`],
   soft:[`The trailer is in circulation. Desire has not followed it there. The campaign now has to create a reason to care rather than another reason to recognise the title.`]
  },
  festivalDecision:{
   accepted:[`The film now has a room full of critics and industry people willing to take it seriously. That is an opportunity, not a compliment.`],
   rejected:[`No laurels, no early prestige halo — and, conveniently, no early prestige autopsy either. The campaign gets its clean commercial runway back.`]
  },
  festivalScreening:{
   strong:[`A screening became a narrative. The campaign can now sell something it did not manufacture itself: other people's enthusiasm.`],
   mixed:[`The film has found the dangerous middle ground where everybody has an opinion and almost nobody agrees. That split is now part of the release.`],
   poor:[`The prestige launch has done the commercial campaign the discourtesy of producing actual negative opinions before release.`]
  },
  publicity:{
   excellent:[`The interviews have stopped feeling like obligations and started producing moments people quote back. That is where publicity becomes useful.`],
   viral:[`One piece of the campaign has escaped into ordinary conversation. The studio can amplify it, but it no longer fully owns it.`],
   solid:[`Nobody is calling the week historic. That is fine. The film is clearer, more familiar and easier to talk about than it was seven days ago.`],
   awkward:[`Attention is up. Unfortunately, one awkward clip is doing most of the lifting. The tour has become a story about the tour.`],
   flat:[`The bookings happened, the clips were posted and the conversation largely carried on without them.`]
  },
  gala:{
   hot:[`For one night, the carpet was not just decoration; the film looked like somewhere people wanted to be.`],
   solid:[`The premiere created a sense of occasion without pretending a red carpet can do the movie's job for it.`],
   flat:[`The photographs are immaculate. The conversation is not. The event looked expensive and travelled lightly.`]
  }
 };
 const bank=banks[type]?.[result];
 if(!bank?.length)return data;
 return {...data,summary:pressVoicePick(`campaign-moment|${f.id}|${type}|${result}|${state.week}`,bank)};
}
function campaignSocialChatter(f,type,result){
 const banks={
  trailer:{viral:[`I was not remotely sold on ${f.title} yesterday. I have now watched that trailer four times.`,`The fan edits started before the studio account finished posting the official clips. That feels significant.`],strong:[`Okay, that trailer actually makes ${f.title} look like a movie rather than a release date.`,`I finally understand what ${f.title} is selling. That helped.`],mixed:[`The ${f.title} trailer is fine. I am aware this is not the word the marketing team wanted trending.`,`I watched the trailer, nodded once and returned to my life. Make of that what you will.`],soft:[`That trailer successfully informed me that ${f.title} exists. The case for leaving the house remains pending.`,`I have seen the ${f.title} trailer twice and somehow know less about why I should care.`]},
  festivalDecision:{accepted:[`${f.title} got into the festival. Suddenly everyone who called it “commercial” is using the word “interesting.”`],rejected:[`No festival slot for ${f.title}. The discourse has bravely agreed to wait until there is a film to argue about.`]},
  festivalScreening:{strong:[`Apparently ${f.title} is the one everyone is trying to get into tonight.`,`The “have you seen ${f.title} yet?” messages have begun.`],mixed:[`Half my feed thinks ${f.title} is brilliant. The other half thinks the first half has lost its mind.`,`Nothing sells a festival movie quite like two critics having completely incompatible experiences.`],poor:[`The first ${f.title} reactions are rough enough that the embargo suddenly feels like a character in the story.`,`You can tell the studio wanted festival heat. Technically, there is heat.`]},
  publicity:{excellent:[`That ${f.title} interview was actually charming. Disturbing development for my cynicism.`,`The cast finally said something about ${f.title} that did not sound approved by six people.`],viral:[`The ${f.title} clip has escaped containment. My non-film friends are sending it to me now.`,`Marketing meeting somewhere: “great news, the internet has taken over.”`],solid:[`${f.title} is doing the rounds and, for once, nobody appears to be actively making things worse.`],awkward:[`The interview clip is doing numbers. Unfortunately not for the reason the studio wanted.`,`I would like to formally thank the ${f.title} press tour for giving everyone the same awkward twelve seconds to discuss.`],flat:[`I have now seen three ${f.title} interviews and cannot remember a sentence from any of them.`,`The press tour is technically happening. Emotionally, the internet appears to be elsewhere.`]},
  gala:{hot:[`Okay, the ${f.title} premiere actually looks like an event.`,`Everyone suddenly owns a ticket to the ${f.title} conversation.`],solid:[`Nice carpet, good crowd, film still has to be good tomorrow. Seems fair.`],flat:[`The ${f.title} carpet looks great. Has anyone said anything about the movie?`,`A lot of flashbulbs for surprisingly little conversation.`]}
 };
 return pressVoicePick(`campaign-social|${f.id}|${type}|${result}|${state.week}`,banks[type]?.[result]||[]);
}
function lotDeskVoice(item){
 if(!item||item.voiceVersion>=3143)return item;
 let bank=[];
 if(item.type==='gossip')bank=[
  `Lotline's usual warning applies: two whispers can make a story long before they make a fact.`,
  `The detail is plausible enough to travel and thin enough to evaporate by lunch.`,
  `Nobody is confirming it. That has never stopped The Lot from scheduling the conversation.`
 ];
 else if(item.type==='industry'&&!item.requiresAction)bank=[
  `On The Lot, this is the sort of development that quietly changes who returns whose call first.`,
  `The practical consequence may show up before the public one: meetings get easier for somebody and harder for somebody else.`,
  `Nobody will call this a power shift yet. People will still behave as though it might be one.`
 ];
 else if(item.type==='talent'&&!item.requiresAction)bank=[
  `Representation will translate the story into leverage before the congratulations are finished.`,
  `The next meeting is where this becomes real: role, quote, billing and who gets to say no first.`
 ];
 if(!bank.length)return {...item,voiceVersion:3143};
 const tail=pressVoicePick(`desk-voice|${item.templateId||item.type}|${item.subject||''}|${item.week||state.week}|${item.id||0}`,bank);
 return {...item,body:`${item.body||''}${tail?` ${tail}`:''}`,voiceVersion:3143};
}
function campaignMomentDeskEntry(f,type,data){
 if(!f||!['trailer','festivalDecision','festivalScreening','publicity','gala'].includes(type))return null;
 const m=ensureMarketingState(f);m.deskMomentKeys=m.deskMomentKeys||[];const key=`${type}:${data.day??state.calendarDay??state.week}`;
 if(m.deskMomentKeys.includes(key))return null;m.deskMomentKeys.push(key);m.deskMomentKeys=m.deskMomentKeys.slice(-20);
 // The full-screen Studio Moment is the notification. Keep a persistent Desk record, but mark it read
 // immediately so the player never has to clear the same trailer/premiere/festival beat twice.
 const item=pushDeskItem({templateId:`campaign-${type}`,repeatKey:`campaign-${type}|${f.id}|${key}`,family:'campaign-milestone',filmId:f.id,subject:f.title,type:'campaign',source:'Campaign Room',urgency:'normal',requiresAction:false,headline:data.title||`${f.title}: ${marketingMilestoneLabel(type)}`,body:`${data.summary||'The campaign moved forward.'}${data.result?` Result: ${momentResultLabel(data.result)}.`:''}`,choices:[],resolved:true,expanded:false,read:true});
 return item;
}
function queueStudioMoment(f,type,data={}){
 const q=ensureStudioMoments(),day=typeof currentCalendarDay==='function'?currentCalendarDay():null,entityId=f?.id||'studio',id=`${entityId}:${type}:${day??state.week}:${q.length}`;
 if(q.some(x=>x.id===id))return;
 if(['trailer','festivalDecision','festivalScreening','publicity','gala'].includes(type)){
  data=campaignMomentVoice(f,type,data);
  const p=ensureFilmSocial(f),before={volume:p.volume,sentiment:p.sentiment,fandom:p.fandom,controversy:p.controversy},delta=campaignSocialDelta(type,data.result);
  if(delta){applyPulseDelta(f,delta,`${data.kicker||marketingMilestoneLabel(type)} · ${momentResultLabel(data.result)}`);addSocialFeed(f,campaignSocialChatter(f,type,data.result)||`${data.kicker||marketingMilestoneLabel(type)}: ${data.summary||momentResultLabel(data.result)}`,data.tone==='great'?'good':data.tone==='bad'||data.tone==='warn'?'warn':'neutral')}
  const after=ensureFilmSocial(f),socialStats=[];
  if(after.volume!==before.volume)socialStats.push(['Social conversation',`${after.volume} (${after.volume-before.volume>=0?'+':''}${after.volume-before.volume})`]);
  if(after.sentiment!==before.sentiment)socialStats.push(['Social sentiment',`${after.sentiment} (${after.sentiment-before.sentiment>=0?'+':''}${after.sentiment-before.sentiment})`]);
  data={...data,stats:[...(data.stats||[]),...socialStats.slice(0,2)]};
 }
 q.push({id,filmId:f?.id||null,type,week:state.week,day,...data});
}
function studioMomentBlocked(){return !!state.pendingCeremony||!!state.pendingAwardsNominations||!!state.activeFilmWrapId||!!state.activeLegendUnlockId||state.screen==='ceremony'||state.screen==='nominations'||state.screen==='filmWrap'||state.screen==='legendUnlock'}
function surfacePendingStudioMoment(){
 if(studioMomentBlocked()||state.activeStudioMoment)return false;
 const q=ensureStudioMoments();
 while(q.length){
  const m=q.shift(),f=m.filmId?filmById(m.filmId):null;if(m.filmId&&(!f||f.owner!=='player'))continue;if(!m.filmId&&!['challengerArrival','studioAnniversary','studioIPO','ownedStreamingLaunch','ownedStreamingWindDown'].includes(m.type))continue;
  m.returnScreen=state.screen;m.returnDetail=deep(state.detail);m.returnHistory=deep(state.history||[]);
  state.activeStudioMoment=m;state.screen='studioMoment';state.detail=null;state.history=[];return true;
 }
 return false;
}
function activeStudioMoment(){return state.activeStudioMoment||null}
function momentToneClass(tone){return tone==='great'?'great':tone==='bad'?'bad':tone==='warn'?'warn':'neutral'}
function momentResultLabel(result){return ({viral:'Viral breakout',strong:'Strong response',mixed:'Mixed response',soft:'Soft response',accepted:'Selected',rejected:'Not selected',excellent:'Excellent',awkward:'Awkward',flat:'Flat',solid:'Solid',hot:'Hot premiere',poor:'Poor response'})[result]||String(result||'').replace(/\b\w/g,c=>c.toUpperCase())}
function studioMomentChoice(choice){
 const m=activeStudioMoment();if(!m)return;
 const f=filmById(m.filmId);
 if(m.choiceContext==='marketing'&&f){const ok=resolveMarketingIntervention(f,choice,true);if(ok===false)return}
 m.resolvedChoice=choice;continueStudioMoment();
}

function publishStudioMomentAftermath(m){
 if(!m?.afterDismiss)return;
 if(m.afterDismiss==='challengerArrival'){
  const rv=rivalById('RX1');if(!rv)return;const c=ensureChallengerState();
  if(c.pressPublished)return;c.pressPublished=true;
  addNews(state,`${rv.name} has officially launched with a reported ${money(rv.startingCash||rv.cash)} production war chest, immediately entering premium screenplay and talent conversations across The Lot.`,'Industry Alert');
  addNews(state,`${rv.head.name}, the new ${rv.head.title.toLowerCase()} of ${rv.name}, says the company intends to build a major slate quickly rather than spend years climbing the existing studio hierarchy.`,'Trade Report');
  if(typeof pushDeskItem==='function'&&!ensureDesk().items.some(x=>x.templateId==='challenger-arrival')&&!ensureDesk().archive.some(x=>x.templateId==='challenger-arrival')){
   pushDeskItem({templateId:'challenger-arrival',repeatKey:'challenger-arrival',family:'industry',type:'industry',source:'Screen Trade',urgency:'normal',requiresAction:false,headline:`${rv.name} enters The Lot`,body:`A new studio has launched with roughly ${money(rv.startingCash||rv.cash)} in starting capital. Its arrival follows ${state.studio.name}'s rise to the top of the studio standings.`,choices:[],resolved:true,read:false,expanded:false});
  }
 }
}

function continueStudioMoment(){
 const m=activeStudioMoment();if(!m)return;
 state.activeStudioMoment=null;
 publishStudioMomentAftermath(m);
 if(state.pendingCeremony){state.screen='ceremony';state.detail=null;save();render();return}
 if(state.pendingAwardsNominations){state.screen='nominations';state.detail=null;save();render();return}
 if(surfacePendingLegendUnlock()){save();render();return}
 if(surfacePendingFilmWrap()){save();render();return}
 if(surfacePendingStudioMoment()){save();render();return}
 state.screen=m.returnScreen||'studio';state.detail=m.returnDetail||null;state.history=m.returnHistory||[];save();render();
}

// Rival studio strategy, treasury and finance policy

const RIVAL_HEADS={
 'Northstar Studios':{name:'Andrea Chen',title:'Chair & CEO',personality:'Showman',bio:'An event-film strategist who likes clarity, star power and public confidence. She rarely hides when Northstar is coming for a date.'},
 'Arcadia Pictures':{name:'Marcus Vale',title:'Chief Executive',personality:'Pragmatist',bio:'A disciplined commercial operator who prefers broad audiences, clean economics and deals where both sides can claim a win.'},
 'Red Crown':{name:'Lena Voss',title:'President',personality:'Risk-taker',bio:'A genre obsessive with sharp instincts for counter-programming. Voss would rather make a loud bet than a safe imitation.'},
 'Bluebird Films':{name:'Elias Moreau',title:'Managing Partner',personality:'Patron',bio:'Patient, filmmaker-led and willing to trade scale for credibility. Moreau remembers who treated directors well when they had less leverage.'},
 'Ironwood Pictures':{name:'Tessa Hart',title:'Chair & CEO',personality:'Operator',bio:'Treats franchises as long businesses rather than one-off films. Hart is methodical about rights, release corridors and repeatable talent.'},
 'Lantern House':{name:'Priya Sayeed',title:'Founder',personality:'Filmmaker-first',bio:'Selective and relationship-driven. Sayeed will lose an auction without blinking, but dislikes being used as leverage in someone else’s negotiation.'},
 'Apex Motion Group':{name:'Evelyn Cross',title:'Chair & CEO',personality:'Expansionist',bio:'A finance-trained studio builder hired with a mandate to buy scale quickly. Cross has the money to overpay, the patience to absorb misses, and very little interest in waiting her turn on The Lot.'}
};
function rivalHeadProfile(name){return deep(RIVAL_HEADS[name]||{name:'Studio leadership',title:'Chief Executive',personality:'Private',bio:'The studio keeps its leadership profile deliberately low.'})}
function ensureRivalCharacter(rv){
 if(!rv)return null;rv.head=rv.head||rivalHeadProfile(rv.name);rv.relationship=Number.isFinite(rv.relationship)?rv.relationship:0;rv.relationshipHistory=rv.relationshipHistory||[];
 rv.scriptWinsAgainstPlayer=rv.scriptWinsAgainstPlayer||0;rv.playerScriptWinsAgainstRival=rv.playerScriptWinsAgainstRival||0;rv.lastScriptWinAgainstPlayerWeek=rv.lastScriptWinAgainstPlayerWeek||0;rv.lastPlayerClashWeek=rv.lastPlayerClashWeek||0;
 rv.competitiveHistory=rv.competitiveHistory||[];rv.rivalrySinceWeek=rv.rivalrySinceWeek||null;rv.lastRivalryEventWeek=rv.lastRivalryEventWeek||0;rv.lastRivalryLabel=rv.lastRivalryLabel||'Normal competition';return rv;
}
function rivalDisposition(rv){ensureRivalCharacter(rv);const v=rv.relationship||0;return v>=18?'Warm respect':v>=7?'Respectful':v<=-18?'Hostile':v<=-7?'Frosty':'Competitive'}
function adjustRivalRelationship(rv,delta,reason='Industry interaction'){if(!rv||!delta)return;ensureRivalCharacter(rv);const before=rv.relationship||0;rv.relationship=clamp(before+delta,-40,40);rv.relationshipHistory.unshift({week:state.week,from:before,to:rv.relationship,delta,reason});rv.relationshipHistory=rv.relationshipHistory.slice(0,16)}
function recordRivalryEvent(rv,type,label,weight=1,key=null,meta={}){
 if(!rv)return null;ensureRivalCharacter(rv);const eventKey=key||`${type}:${state.week}:${label}`;
 if(rv.competitiveHistory.some(x=>x.key===eventKey))return null;
 const e={key:eventKey,week:state.week,type,label,weight,filmId:meta.filmId||null,scriptId:meta.scriptId||null,season:meta.season||null,outcome:meta.outcome||null};
 rv.competitiveHistory.unshift(e);rv.competitiveHistory=rv.competitiveHistory.slice(0,40);rv.lastRivalryEventWeek=state.week;if(!rv.rivalrySinceWeek)rv.rivalrySinceWeek=state.week;return e;
}
function rivalryGenreLane(rv){
 const cutoff=state.week-104,player=playerFilms().filter(f=>f.stage==='complete'&&(f.completeWeek||0)>=cutoff),rival=state.films.filter(f=>f.owner===rv.id&&f.stage==='complete'&&(f.completeWeek||0)>=cutoff);
 const pc={},rc={};player.forEach(f=>pc[f.genre]=(pc[f.genre]||0)+1);rival.forEach(f=>rc[f.genre]=(rc[f.genre]||0)+1);
 const rows=genres.map(g=>({genre:g,player:pc[g]||0,rival:rc[g]||0,overlap:Math.min(pc[g]||0,rc[g]||0)})).filter(x=>x.overlap>0).sort((a,b)=>b.overlap-a.overlap);
 return {rows,total:rows.reduce((a,x)=>a+x.overlap,0),top:rows[0]||null};
}
function rivalryRankGap(rv){
 const table=studioStandings(),p=table.find(x=>x.player),r=table.find(x=>x.id===rv.id);return p&&r?Math.abs(p.rank-r.rank):99;
}
function rivalrySnapshot(rv){
 ensureRivalCharacter(rv);const recent=(rv.competitiveHistory||[]).filter(x=>state.week-(x.week||0)<=156);
 let eventScore=0;recent.forEach(x=>{const age=state.week-(x.week||state.week),decay=age<=52?1:age<=104?.65:.38;eventScore+=(x.weight||1)*decay});
 const lane=rivalryGenreLane(rv),rankGap=rivalryRankGap(rv),hostility=Math.max(0,-(rv.relationship||0))*.16;
 const laneScore=Math.min(4,lane.total*.85),rankScore=rankGap<=1?2:rankGap===2?1:0;
 const score=eventScore+laneScore+rankScore+hostility;
 let rank=0,label='Normal competition',tone='blue',desc='The studios share the same market, but there is not yet enough repeated history to call it a rivalry.';
 if(score>=15){rank=3;label='Defining rivalry';tone='bad';desc='Repeated collisions now shape how both studios are discussed, scheduled and judged against each other.'}
 else if(score>=8){rank=2;label=(rv.relationship||0)>=7?'Respectful rivalry':'Active rivalry';tone=(rv.relationship||0)>=7?'good':'warn';desc='This is no longer a one-off clash. The same two studios keep meeting in consequential parts of the business.'}
 else if(score>=4){rank=1;label='Recurring friction';tone='warn';desc='Several recent collisions are beginning to form a recognisable competitive pattern.'}
 const reasons=[];
 const auctions=recent.filter(x=>x.type.startsWith('auction')).length,releases=recent.filter(x=>x.type.startsWith('release')).length,awards=recent.filter(x=>x.type==='awards').length;
 if(auctions)reasons.push(`${auctions} contested screenplay result${auctions===1?'':'s'}`);
 if(releases)reasons.push(`${releases} release-calendar confrontation${releases===1?'':'s'}`);
 if(awards)reasons.push(`${awards} awards-season collision${awards===1?'':'s'}`);
 if(lane.top&&lane.top.overlap>=2)reasons.push(`both studios repeatedly working in ${lane.top.genre}`);
 if(rankGap<=2)reasons.push(`the studios sitting close together in the industry table`);
 if((rv.relationship||0)<=-7)reasons.push(`a ${rivalDisposition(rv).toLowerCase()} executive relationship`);
 return {rank,label,tone,desc,reasons,events:recent,lane,rankGap,score};
}
function rivalryBidPressure(rv){
 const x=rivalrySnapshot(rv);if(x.rank<2)return 1;
 return (rv.relationship||0)<=-7?(x.rank>=3?1.045:1.028):1.015;
}
function rivalryProfileHTML(rv){
 const x=rivalrySnapshot(rv),recent=x.events.slice(0,6);
 return `<div class="section-title"><h2>Competitive history</h2><span class="pill ${x.tone}">${x.label}</span></div><div class="card ${x.rank>=3?'dangerline':x.rank>=2?'attention':''}"><div class="body">${x.desc}</div>${x.reasons.length?`<div class="small" style="margin-top:8px"><strong>Why the trade sees it this way:</strong> ${naturalNames(x.reasons)}.</div>`:''}${recent.length?`<div class="hr"></div>${recent.map(e=>`<div class="listrow"><div><strong>${e.label}</strong><div class="small">${String(e.type).replace(/-/g,' ')} · W${e.week}</div></div>${e.outcome?`<span class="small">${e.outcome}</span>`:''}</div>`).join('')}`:`<div class="small" style="margin-top:8px">No direct competitive history has accumulated yet.</div>`}</div>`;
}
function recordAwardsRivalries(c){
 if(!c?.categories)return;
 const byRival=new Map();
 c.categories.forEach(cat=>{
  const playerIn=cat.nominees.some(n=>n.owner==='player');if(!playerIn)return;
  const winner=cat.nominees.find(n=>n.filmId===cat.winnerId);
  cat.nominees.filter(n=>n.owner!=='player').forEach(n=>{
   const rv=rivalById(n.owner);if(!rv)return;const x=byRival.get(rv.id)||{rv,shared:0,playerWins:0,rivalWins:0};x.shared++;
   if(winner?.owner==='player')x.playerWins++;else if(winner?.owner===rv.id)x.rivalWins++;byRival.set(rv.id,x);
  });
 });
 byRival.forEach(x=>{
  const outcome=x.playerWins>x.rivalWins?`${state.studio.name} had the edge`:x.rivalWins>x.playerWins?`${x.rv.name} had the edge`:'split field';
  recordRivalryEvent(x.rv,'awards',`Shared the Year ${c.season} awards field in ${x.shared} categor${x.shared===1?'y':'ies'}`,Math.min(2.4,.8+x.shared*.28),`awards:${c.season}:${x.rv.id}`,{season:c.season,outcome});
 });
}


function aiStudioProfile(style){
 const profiles={
  'Blockbusters':{risk:.80,cost:.48,marketing:1.12,budget:1.05,reserveFilms:.38,maxExposure:.56,borrowQuality:79,maxDebt:30,genres:['Action Thriller','Science Fiction','Fantasy'],creative:{positioning:'commercial',tone:'heightened',rating:'mainstream',emphasis:'spectacle'},campaign:'event',desc:'Chases scale, stars and opening weekends. Will take real balance-sheet risk, but only for packages it strongly believes in.'},
  'Broad Commercial':{risk:.62,cost:.62,marketing:.90,budget:.98,reserveFilms:.50,maxExposure:.46,borrowQuality:81,maxDebt:22,genres:['Action Thriller','Comedy','Crime Thriller','Family Adventure'],creative:{positioning:'commercial',tone:'balanced',rating:'broad',emphasis:'balanced'},campaign:'authentic',desc:'Prefers accessible concepts, reliable talent and enough liquidity to survive a disappointment.'},
  'Genre Specialist':{risk:.67,cost:.72,marketing:.64,budget:.98,reserveFilms:.46,maxExposure:.42,borrowQuality:77,maxDebt:18,genres:['Psychological Horror','Crime Thriller','Action Thriller'],creative:{positioning:'balanced',tone:'heightened',rating:'mature',emphasis:'balanced'},campaign:'mystery',desc:'Takes frequent contained bets, but avoids staking the company on a single genre release.'},
  'Prestige':{risk:.48,cost:.66,marketing:.54,budget:.99,reserveFilms:.55,maxExposure:.38,borrowQuality:84,maxDebt:16,genres:['Prestige Drama','Crime Thriller','Psychological Horror'],creative:{positioning:'prestige',tone:'grounded',rating:'mature',emphasis:'performance'},campaign:'authentic',desc:'Protects runway aggressively and spends on filmmakers only when the material justifies it.'},
  'Franchise Builder':{risk:.72,cost:.55,marketing:.98,budget:1.02,reserveFilms:.42,maxExposure:.52,borrowQuality:80,maxDebt:26,genres:['Fantasy','Science Fiction','Action Thriller','Family Adventure'],creative:{positioning:'commercial',tone:'heightened',rating:'mainstream',emphasis:'spectacle'},campaign:'event',desc:'Accepts larger commitments for scalable concepts, but will delay a slate rather than overextend repeatedly.'},
  'Indie / Prestige':{risk:.38,cost:.84,marketing:.40,budget:.97,reserveFilms:.62,maxExposure:.31,borrowQuality:86,maxDebt:10,genres:['Prestige Drama','Psychological Horror','Comedy','Crime Thriller'],creative:{positioning:'prestige',tone:'grounded',rating:'mature',emphasis:'performance'},campaign:'authentic',desc:'Keeps a large cash cushion, favours emerging talent and rarely borrows to make a film.'},
  'Aggressive Capital':{risk:.90,cost:.43,marketing:1.16,budget:1.07,reserveFilms:.28,maxExposure:.63,borrowQuality:77,maxDebt:60,genres:['Action Thriller','Science Fiction','Fantasy','Crime Thriller','Family Adventure'],creative:{positioning:'commercial',tone:'heightened',rating:'mainstream',emphasis:'spectacle'},campaign:'event',desc:'Built to acquire scale fast. It will pay premiums for heat, carry several expensive packages at once and tolerate short-term losses — but money cannot rescue a bad creative package.'}
 };
 return deep(profiles[style]||profiles['Broad Commercial']);
}
function aiPreferredGenre(rv,r){
 const p=rv.profile||aiStudioProfile(rv.style);
 return r()<.72?pick(r,p.genres):pick(r,genres);
}
function aiCreativeBrief(rv,genre){
 const c=deep((rv.profile||aiStudioProfile(rv.style)).creative);
 if(genre==='Comedy'||genre==='Family Adventure'){if(c.rating==='mature')c.rating='broad';if(c.tone==='grounded')c.tone='balanced'}
 if(genre==='Psychological Horror'&&c.rating==='broad')c.rating='mature';
 return c;
}
function aiStudioOverhead(rv){
 const active=state.films.filter(f=>f.owner===rv.id&&!['complete','shelved'].includes(f.stage));
 return .10+rv.capacity*.025+active.filter(f=>f.stage==='production').length*.045+active.filter(f=>['scheduled','cinema'].includes(f.stage)).length*.025;
}
function aiTreasurySnapshot(rv){
 rv.profile=rv.profile||aiStudioProfile(rv.style);rv.debt=rv.debt||0;
 const active=state.films.filter(f=>f.owner===rv.id&&!['complete','shelved'].includes(f.stage));
 const avgCompleted=state.films.filter(f=>f.owner===rv.id&&f.stage==='complete').slice(-6);
 const avgInvestment=avgCompleted.length?avgCompleted.reduce((a,f)=>a+(f.investment||0),0)/avgCompleted.length:18;
 const plannedFilm=Math.max(10,avgInvestment);
 const reserve=Math.max(7,plannedFilm*rv.profile.reserveFilms+aiStudioOverhead(rv)*10);
 const available=Math.max(0,rv.cash-reserve);
 const debtRatio=(rv.debt||0)/Math.max(8,rv.cash);
 const nearRelease=active.filter(f=>['scheduled','cinema'].includes(f.stage)).length;
 const production=active.filter(f=>f.stage==='production').length;
 const recent=rv.commercialHistory?.slice(0,3).reduce((a,x)=>a+(x.profit||0),0)||0;
 return {active,plannedFilm,reserve,available,debtRatio,nearRelease,production,recent};
}
function aiFinancialHealth(rv){
 const t=aiTreasurySnapshot(rv),cash=rv.cash||0,debt=rv.debt||0;
 if((cash<4&&debt>20)||(t.debtRatio>2.2&&t.recent<-10))return 'Financial distress';
 if(cash<8||(t.debtRatio>1.25&&t.recent<0)||debt>(rv.profile.maxDebt||20)*1.15)return 'Under pressure';
 if(debt>7||t.debtRatio>.45)return 'Leveraged';
 if(cash>85&&debt<4)return 'Cash-rich';
 if(cash>48&&debt<8)return 'Financially strong';
 return 'Stable';
}
function aiProjectConfidence(rv,s,d,a1,a2,preview){
 const script=(s.story+s.hook+s.originality+s.access)/4;
 const fit=(directorProjectFit(d,preview)+actorProjectFit(a1,preview)+actorProjectFit(a2,preview))/3;
 const genre=rv.profile.genres.includes(s.genre)?5:-3;
 return clamp(script*.48+fit*.42+rv.skill*.10+genre,25,96);
}
function aiFinanceProject(rv,total,confidence){
 const p=rv.profile||aiStudioProfile(rv.style),t=aiTreasurySnapshot(rv),status=aiFinancialHealth(rv);
 if(status==='Financial distress')return false;

 const liquid=Math.max(1,rv.cash);
 const exposure=total/liquid;
 const maxExposure=p.maxExposure*(status==='Under pressure'?.72:status==='Leveraged'?.88:1);
 const reserve=t.reserve*(status==='Under pressure'?1.15:1);

 // Normal greenlight: project fits within both liquidity exposure and post-deal reserve.
 if(exposure<=maxExposure && rv.cash-total>=reserve){
  rv.cash-=total;return true;
 }

 // Exceptionally strong packages may use limited debt, but not repeatedly.
 const canBorrow=confidence>=p.borrowQuality && status!=='Under pressure' && (rv.debt||0)<p.maxDebt;
 if(!canBorrow)return false;

 const targetCashAfter=Math.max(reserve,rv.cash*(1-maxExposure));
 const short=Math.max(0,total+targetCashAfter-rv.cash);
 const borrowingRoom=Math.max(0,p.maxDebt-(rv.debt||0));
 if(short<=0 || short>borrowingRoom)return false;

 const draw=Math.ceil(short*2)/2;
 rv.cash+=draw;rv.debt=(rv.debt||0)+draw*1.05;
 addNews(state,`${rv.name} arranged ${money(draw)} of project financing for a package it views as unusually strong.`,'Trade Finance');
 rv.cash-=total;
 return true;
}
function aiLegacyCatalogueWeeklyRevenue(rv){
 // The six incumbent rivals enter Project Slate as established studios, not Week-1 startups.
 // Seed a modest back-catalogue tail from stature, then let it age while new releases replenish the library.
 // The late-game challenger is genuinely new and therefore receives no inherited catalogue.
 if(typeof LATE_GAME_CHALLENGER!=='undefined'&&rv.id===LATE_GAME_CHALLENGER.id)return 0;
 if(!Number.isFinite(rv.legacyCatalogueBase)){
  const stature=clamp(((rv.recognition||48)-40)/24,0,1);
  rv.legacyCatalogueBase=+(.11+stature*.10).toFixed(4);
 }
 const age=Math.max(0,(state.week||1)-1),floor=.38,decay=floor+(1-floor)*Math.exp(-age/182);
 return +(rv.legacyCatalogueBase*decay).toFixed(4);
}
function aiCatalogueWeeklyRevenue(rv){
 let total=0;
 state.films.filter(f=>f.owner===rv.id&&f.stage==='complete').forEach(f=>{
  const a=ensureAfterlifeState(f);a.catalogueAge=Math.max(0,state.week-(f.completeWeek||state.week));
  const age=a.catalogueAge,decay=Math.exp(-age/46),sequel=state.films.some(x=>x.ipParentId===f.id&&!['complete','shelved'].includes(x.stage))?1.18:1;
  const awards=a.wins.length?1.15:a.nominations.length?1.07:1,cult=a.cultStatus?1.12:1;
  const rev=+Math.max(.0005,(afterlifeStrength(f)/100)*.055*decay*sequel*awards*cult).toFixed(4);total+=rev;
 });
 const legacy=aiLegacyCatalogueWeeklyRevenue(rv);total+=legacy;
 total=+total.toFixed(4);rv.lastCatalogueRevenue=total;rv.legacyCatalogueRevenue=+((rv.legacyCatalogueRevenue||0)+legacy).toFixed(4);rv.catalogueRevenue=+((rv.catalogueRevenue||0)+total).toFixed(4);return total;
}

function aiWeeklyFinance(){
 state.rivals.forEach(rv=>{
  rv.profile=rv.profile||aiStudioProfile(rv.style);rv.debt=rv.debt||0;
  if(rv.debt>0){
   const interest=rv.debt*.0025; // v4.0a.6: ordinary rival financing, ~13.9% effective annual rather than emergency-bridge economics
   rv.debt+=interest;rv.totalInterest=(rv.totalInterest||0)+interest;
  }

  const overhead=aiStudioOverhead(rv);
  rv.cash-=overhead;rv.lifetimeOverhead=+((rv.lifetimeOverhead||0)+overhead).toFixed(4);
  // Completed rival films now earn the same base catalogue tail as completed player films.
  // This does not give AI studios player-only streaming choices or bonus licensing events.
  rv.cash+=aiCatalogueWeeklyRevenue(rv);

  // Operating-credit draws are small and defensive, not a blank cheque for new productions.
  if(rv.cash<1.5){
   const needed=Math.max(0,4-rv.cash);
   const room=Math.max(0,(rv.profile.maxDebt||20)-(rv.debt||0));
   const draw=Math.min(room,Math.ceil(needed*2)/2);
   if(draw>0){
    rv.cash+=draw;rv.debt+=draw*1.06;
    if(draw>=2)addNews(state,`${rv.name} increased its working-capital facility while waiting for upcoming releases.`,'Trade Finance');
   }
  }

  // Repay debt automatically when a studio has a genuinely comfortable cushion.
  const t=aiTreasurySnapshot(rv);
  if(rv.debt>0 && rv.cash>t.reserve+7){
   const repay=Math.min(rv.debt,(rv.cash-(t.reserve+6))*.35);
   if(repay>.25){rv.cash-=repay;rv.debt-=repay}
  }

  // Restructuring is now a true last resort rather than the default state after a few misses.
  const status=aiFinancialHealth(rv);
  if(status==='Financial distress' && rv.debt>(rv.profile.maxDebt||20)*1.35 && rv.cash<3){
   rv.restructures=(rv.restructures||0)+1;
   rv.debt*=.58;rv.cash+=10;rv.capacity=Math.max(1,rv.capacity-1);rv.reputation=clamp(rv.reputation-6,25,90);
   addNews(state,`${rv.name} entered a financial restructuring after failing to restore adequate liquidity. Production capacity has been reduced.`,'Industry Alert');
  }
 });
}
function aiSelectCandidate(list,scoreFn,r){
 if(!list.length)return null;
 const ranked=list.map(x=>({x,score:scoreFn(x)+(r()-.5)*13})).sort((a,b)=>b.score-a.score);
 const pool=ranked.slice(0,Math.min(5,ranked.length));
 return pool[Math.floor(Math.pow(r(),1.55)*pool.length)].x;
}
function aiTradeRange(value){
 const spread=Math.max(2.5,Math.abs(value)*.14+1.5);
 return [value-spread,value+spread];
}
function moneyRange(value){
 const r=aiTradeRange(value),a=r[0],b=r[1];
 const fmt=x=>`${x>=0?'+':'-'}$${Math.abs(x).toFixed(1)}m`;
 return `${fmt(a)} to ${fmt(b)}`;
}


// Representation is stable across saves and roster additions. Agency standing is
// earned through client relationships rather than a second free-floating score.
const AGENCIES=[
 {id:'meridian',name:'Meridian Artists',style:'Prestige-led',focus:'Craft and award-calibre material'},
 {id:'summit',name:'Summit Representation',style:'Commercial',focus:'Audience reach and prominent billing'},
 {id:'harbour',name:'Harbour Talent',style:'Collaborative',focus:'Long-term creative partnerships'},
 {id:'atlas',name:'Atlas Management',style:'Selective',focus:'Well-financed packages and career momentum'}
];
function talentAgency(t){return AGENCIES[hash('agency|'+t.id)%AGENCIES.length]}
function agencyClients(a){return (state.talent||[]).filter(t=>!t.retired&&talentAgency(t).id===a.id)}
function agencyStanding(a){
 const clients=agencyClients(a),warm=clients.filter(t=>(t.relationship||0)>=12).length,cold=clients.filter(t=>(t.relationship||0)<=-12).length;
 return {score:clamp(warm*2-cold*2,-12,12),warm,cold,label:warm>cold?'Warm':cold>warm?'Strained':'Open'};
}
function talentMarketLeverage(t){
 ensureTalentCareer(t);
 const awards=talentAwardCount(t),career=t.careerState||'',mom=t.momentum||60;
 let pressure=(mom-60)*.16;
 if(t.type==='Actor')pressure+=Math.max(0,(t.star||40)-70)*.12;
 else pressure+=Math.max(0,(t.commercial||55)-70)*.08;
 if(career==='Breakout')pressure+=2.5;
 if(['Hot Streak','A-List Prime','Hot Director','Acclaimed Director'].includes(career))pressure+=5;
 if(career==='Comeback')pressure+=2;
 if(['Fading Star','Fading Director'].includes(career))pressure-=4;
 pressure+=awards.wins*1.5+awards.noms*.35;
 return clamp(pressure,-12,28);
}
function agencyMarketLeverage(t,f=null){
 const a=talentAgency(t),standing=agencyStanding(a),pressure=talentMarketLeverage(t),clientRel=t.relationship||0;
 const relationshipEdge=standing.score*.45+clientRel*.10+(f&&agencyWindow(t,f)?4:0),net=pressure-relationshipEdge;
 const label=pressure>=16?'Maximum leverage':pressure>=9?'Hot market':pressure>=4?'Firm market':pressure<=-3?'Soft market':'Normal market';
 const relationship=standing.score>=5?'Preferred buyer':standing.score<=-5?'Strained relationship':standing.score>0?'Warm relationship':standing.score<0?'Cool relationship':'Open relationship';
 return {agency:a,standing,pressure,relationshipEdge,net,label,relationship};
}
function agencyContractMultiplier(t,f){
 const x=agencyMarketLeverage(t,f);
 let mult=1+clamp(x.pressure,-10,24)*.006-clamp(x.standing.score,-12,12)*.004;
 if(f&&agencyWindow(t,f))mult-=.04;
 return clamp(mult,.84,1.22);
}
function agencyContractContext(t,f){
 const x=agencyMarketLeverage(t,f);
 if(f&&agencyWindow(t,f))return `${x.agency.name} is honouring the priority conversation, taking some heat out of the quote.`;
 if(x.pressure>=12)return `${x.agency.name} is pricing recent momentum and market demand into the deal.`;
 if(x.pressure<=-3&&x.standing.score>=0)return `${x.agency.name} sees room to make a practical deal while the client's market is softer.`;
 if(x.standing.score>=5)return `${x.agency.name} currently treats your studio as a preferred buyer and is negotiating accordingly.`;
 if(x.standing.score<=-5)return `${x.agency.name}'s relationship with your studio is strained, so there is little relationship discount in the room.`;
 return '';
}
function agencyInterestModifier(t,f){
 const a=talentAgency(t),standing=agencyStanding(a).score,fit=t.type==='Actor'?actorRoleFit(t,f):directorProjectFit(t,f),market=talentMarketLeverage(t);
 let modifier=standing*.55-clamp(market*.08,-2,3);
 if(a.id==='meridian')modifier+=(f.creative?.positioning==='prestige'?4:0);
 if(a.id==='summit')modifier+=(f.creative?.positioning==='commercial'?4:0);
 if(a.id==='harbour')modifier+=(t.relationship||0)>=12?3:0;
 if(a.id==='atlas')modifier+=f.budget>=25?3:-2;
 return Math.round(modifier+(fit>=82?2:fit<50?-3:0));
}
function agencyWindow(t,f){
 const w=state.agencyWindows?.[t?.id];
 return w&&w.filmId===f?.id&&state.week<=w.expiresWeek&&f.stage==='development'?w:null;
}
function openAgencyWindow(t,f){
 if(!t||!f||f.stage!=='development')return false;
 state.agencyWindows=state.agencyWindows||{};
 state.agencyWindows[t.id]={filmId:f.id,agencyId:talentAgency(t).id,openedWeek:state.week,expiresWeek:state.week+4};
 return true;
}
function agencySnapshot(a){
 const clients=agencyClients(a),standing=agencyStanding(a);
 const windows=Object.entries(state.agencyWindows||{}).filter(([tid,w])=>w?.agencyId===a.id&&state.week<=w.expiresWeek&&filmById(w.filmId)?.stage==='development').map(([talentId,w])=>({talentId,...w}));
 const hot=[...clients].sort((x,y)=>talentMarketLeverage(y)-talentMarketLeverage(x))[0]||null;
 const thread=typeof careerThread==='function'?careerThread(`agency:${a.id}`):null;
 return {agency:a,clients,standing,windows,hot,thread};
}
function agencyPackagePitchCandidate(){
 const films=playerFilms().filter(f=>f.stage==='development'&&!f.paused);
 let best=null;
 films.forEach(f=>{
  const roles=ensureFilmRoles(f),openLeads=roles.filter(r=>r.type==='lead'&&!f.roleAssignments?.[r.id]);
  AGENCIES.forEach(a=>{
   const clients=agencyClients(a),picks=[],used=new Set();
   if(!f.directorId){
    const directors=clients.filter(t=>t.type==='Director'&&!t.retired&&!talentUnavailableForFilm(t,f)&&!agencyWindow(t,f))
     .map(t=>({t,role:'Director',score:directorProjectFit(t,f)*.70+(t.craft||70)*.20+(t.momentum||60)*.10}))
     .sort((x,y)=>y.score-x.score);
    if(directors[0]){picks.push(directors[0]);used.add(directors[0].t.id)}
   }
   openLeads.forEach(role=>{
    const actors=clients.filter(t=>t.type==='Actor'&&!t.retired&&!used.has(t.id)&&!talentUnavailableForFilm(t,f)&&!roleForTalent(f,t.id)&&!agencyWindow(t,f))
     .map(t=>({t,role:role.name,score:actorRoleFit(t,f,role.id)*.68+actorIndustryShortlistScore(t)*.32}))
     .sort((x,y)=>y.score-x.score);
    if(actors[0]){picks.push(actors[0]);used.add(actors[0].t.id)}
   });
   if(picks.length<2)return;
   const chosen=picks.slice(0,2),score=chosen.reduce((n,x)=>n+x.score,0)/chosen.length+agencyStanding(a).score*.30;
   if(!best||score>best.score)best={a,f,picks:chosen,score};
  });
 });
 return best;
}

// Late-career world reaction: a new capital-rich challenger can enter once the player has clearly become the studio to beat.

const LATE_GAME_CHALLENGER={
 id:'RX1',name:'Apex Motion Group',style:'Aggressive Capital',skill:87,capacity:3,cash:350,recognition:78,fans:5.4,reputation:72
};
function ensureChallengerState(st=state){
 st.challengerState=st.challengerState||{launched:false,launchWeek:null,triggerYear:null,triggerRank:null,triggerRecognition:null,pressPublished:false};if(st.challengerState.pressPublished===undefined)st.challengerState.pressPublished=false;
 return st.challengerState;
}
function lateGameChallengerEligible(){
 if(!state.studio||!state.careerStarted)return false;
 const c=ensureChallengerState();if(c.launched||state.rivals.some(r=>r.id===LATE_GAME_CHALLENGER.id))return false;
 if(state.week<156||state.week%52!==0)return false;
 const standing=playerStudioStanding(),growth=ensureStudioGrowth(),done=completedPlayerFilms().length;
 return !!standing&&standing.rank===1&&(growth.recognition||0)>=72&&done>=6;
}
function launchLateGameChallenger(){
 if(!lateGameChallengerEligible())return false;
 const c=ensureChallengerState(),s=LATE_GAME_CHALLENGER,p=aiStudioProfile(s.style),rv={
  id:s.id,name:s.name,style:s.style,skill:s.skill,capacity:s.capacity,cash:s.cash,startingCash:s.cash,films:[],reputation:s.reputation,recognition:s.recognition,fans:s.fans,signature:s.style,debt:0,totalInterest:0,lifetimeOverhead:0,catalogueRevenue:0,lastCatalogueRevenue:0,restructures:0,commercialHistory:[],profile:p,head:rivalHeadProfile(s.name),relationship:-2,relationshipHistory:[],scriptWinsAgainstPlayer:0,lastScriptWinAgainstPlayerWeek:0,lastPlayerClashWeek:0
 };
 state.rivals.push(rv);c.launched=true;c.launchWeek=state.week;c.triggerYear=Math.ceil(state.week/52);c.triggerRank=1;c.triggerRecognition=Math.round(ensureStudioGrowth().recognition||0);
 queueStudioMoment(null,'challengerArrival',{kicker:'A NEW POWER ENTERS THE LOT',title:`${s.name} has arrived`,tone:'warn',result:'$350M WAR CHEST',afterDismiss:'challengerArrival',summary:`The industry has reacted to a new order. After ${state.studio.name} finished the year at #1, a heavily financed entrant has been built to compete immediately for scripts, stars and release dates.`,stats:[['Starting capital',money(s.cash)],['Production capacity',`${s.capacity} films`],['Chief executive',rv.head.name]],sections:[{title:'Why now',text:`${state.studio.name} is no longer the newcomer trying to be taken seriously. Its rise has helped convince outside capital that there is room to challenge the established hierarchy.`},{title:'What makes Apex dangerous',text:'Apex can carry expensive development, bid aggressively and survive misses that would hurt a smaller company. It still uses the same film-quality rules as everyone else: it can overpay, miscast, pick the wrong material and fail.'}]});
 return true;
}
function maybeLaunchLateGameChallenger(){return launchLateGameChallenger()}
