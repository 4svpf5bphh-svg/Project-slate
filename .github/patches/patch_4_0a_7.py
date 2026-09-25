from pathlib import Path

p=Path("index.html")
s=p.read_text(encoding="utf-8")

def one(old,new,label):
    global s
    n=s.count(old)
    if n!=1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    s=s.replace(old,new,1)

one("<title>Project Slate — Premium Presentation v4.0a.6</title>",
    "<title>Project Slate — Premium Presentation v4.0a.7</title>","title")
one("const VERSION='4.0a.6';","const VERSION='4.0a.7';","version")
one("v4.0a.6-ai-finance-normalization","v4.0a.7-audit-resolution","benchmark model")

start=s.index("function simulationBenchmarkIndustrySnapshot(")
end=s.index("function simulationBenchmarkOne(",start)
new_snapshot=r'''function simulationBenchmarkIndustrySnapshot(st=state){
 const ledger=simulationAuditFilmLedger(st).filter(x=>x.owner!=='player'),profits=ledger.map(x=>x.profit).filter(Number.isFinite),invest=ledger.map(x=>x.investment).filter(Number.isFinite),gross=ledger.map(x=>x.gross).filter(Number.isFinite),profiles={standard:0,bomb:0,breakout:0,sleeper:0,frontloaded:0,other:0};ledger.forEach(x=>profiles[x.releaseProfile]===undefined?profiles.other++:profiles[x.releaseProfile]++);
 const actors=(st.talent||[]).filter(t=>t.type==='Actor'&&!t.retired),fees=actors.map(t=>+t.fee||0),rivals=(st.rivals||[]).map(rv=>({status:aiFinancialHealth(rv),cash:rv.cash||0,debt:rv.debt||0,restructures:rv.restructures||0,catalogueRevenue:rv.catalogueRevenue||0,overhead:rv.lifetimeOverhead||0,interest:rv.totalInterest||0})),scripts=simulationAuditScreenplayLedger(st);
 const healthCounts={financialDistress:rivals.filter(r=>r.status==='Financial distress').length,underPressure:rivals.filter(r=>r.status==='Under pressure').length,leveraged:rivals.filter(r=>r.status==='Leveraged').length,stable:rivals.filter(r=>r.status==='Stable').length,financiallyStrong:rivals.filter(r=>r.status==='Financially strong').length,cashRich:rivals.filter(r=>r.status==='Cash-rich').length};
 const expectedProfiles={bomb:0,breakout:0,sleeper:0,frontloaded:0,nonStandard:0};(st.films||[]).filter(f=>f.owner!=='player'&&f.stage==='complete').forEach(f=>{const p=auditReleaseProbability(f);Object.keys(expectedProfiles).forEach(k=>expectedProfiles[k]+=p[k]||0)});Object.keys(expectedProfiles).forEach(k=>expectedProfiles[k]=auditRound(expectedProfiles[k],2));
 const totalProfit=auditRound(profits.reduce((a,b)=>a+b,0)),catalogueRevenue=auditRound(rivals.reduce((a,r)=>a+r.catalogueRevenue,0)),overhead=auditRound(rivals.reduce((a,r)=>a+r.overhead,0)),interest=auditRound(rivals.reduce((a,r)=>a+r.interest,0));
 return {week:st.week,year:Math.ceil(st.week/52),films:ledger.length,totalProfit,avgProfit:auditRound(profits.length?profits.reduce((a,b)=>a+b,0)/profits.length:null),profitable:profits.filter(x=>x>.5).length,profitableRate:auditRound(profits.length?profits.filter(x=>x>.5).length/profits.length:null,4),avgInvestment:auditRound(invest.length?invest.reduce((a,b)=>a+b,0)/invest.length:null),avgGross:auditRound(gross.length?gross.reduce((a,b)=>a+b,0)/gross.length:null),profiles,expectedProfiles,healthCounts,distressed:healthCounts.financialDistress+healthCounts.underPressure,medianCash:auditRound(auditQuantile(rivals.map(r=>r.cash),.5)),medianDebt:auditRound(auditQuantile(rivals.map(r=>r.debt),.5)),restructures:rivals.reduce((a,r)=>a+r.restructures,0),catalogueRevenue,legacyCatalogueRevenue:auditRound((st.rivals||[]).reduce((a,r)=>a+(r.legacyCatalogueRevenue||0),0)),overhead,interest,systemNet:auditRound(totalProfit+catalogueRevenue-overhead-interest),actorFeeMedian:auditRound(auditQuantile(fees,.5)),actorsUnder3:actors.filter(t=>(+t.fee||0)<=3).length,screenplays:{turnaround:{...scripts.turnaround},standard:{...scripts.standard}}};
}
'''
s=s[:start]+new_snapshot+s[end:]

start=s.index("function simulationBenchmarkAggregate(")
end=s.index("function runSimulationBenchmarkSuite(",start)
new_aggregate=r'''function simulationBenchmarkAggregate(runs){
 const finals=(runs||[]).map(r=>r.final),films=finals.reduce((a,x)=>a+(x.films||0),0),profit=finals.reduce((a,x)=>a+(x.totalProfit||0),0),profitable=finals.reduce((a,x)=>a+(x.profitable||0),0),profiles={standard:0,bomb:0,breakout:0,sleeper:0,frontloaded:0,other:0},expectedProfiles={bomb:0,breakout:0,sleeper:0,frontloaded:0,nonStandard:0};finals.forEach(x=>{Object.keys(profiles).forEach(k=>profiles[k]+=x.profiles?.[k]||0);Object.keys(expectedProfiles).forEach(k=>expectedProfiles[k]+=x.expectedProfiles?.[k]||0)});
 const weighted=(key)=>films?finals.reduce((a,x)=>a+(x[key]||0)*(x.films||0),0)/films:null,avg=(key)=>auditRound(finals.length?finals.reduce((a,x)=>a+(x[key]||0),0)/finals.length:null);
 const dealAggregate=kind=>{const rows=finals.map(x=>x.screenplays?.[kind]).filter(Boolean),count=rows.reduce((a,x)=>a+(x.deals||0),0);return {deals:count,avgPriceMedian:auditRound(rows.length?rows.reduce((a,x)=>a+(x.priceMedian||0),0)/rows.length:null),avgBudgetMedian:auditRound(rows.length?rows.reduce((a,x)=>a+(x.budgetMedian||0),0)/rows.length:null),avgPriceToBudgetMedian:auditRound(rows.length?rows.reduce((a,x)=>a+(x.priceToBudgetMedian||0),0)/rows.length:null,4)};};
 const avgHealth=key=>auditRound(finals.length?finals.reduce((a,x)=>a+(x.healthCounts?.[key]||0),0)/finals.length:null,2);
 Object.keys(expectedProfiles).forEach(k=>expectedProfiles[k]=auditRound(expectedProfiles[k],2));
 return {runs:finals.length,films,totalProfit:auditRound(profit),avgProfit:auditRound(films?profit/films:null),profitableRate:auditRound(films?profitable/films:null,4),avgInvestment:auditRound(weighted('avgInvestment')),avgGross:auditRound(weighted('avgGross')),profiles,expectedProfiles,standardRate:auditRound(films?(profiles.standard||0)/films:null,4),avgDistressedAtEnd:avg('distressed'),avgFinancialDistressAtEnd:avgHealth('financialDistress'),avgUnderPressureAtEnd:avgHealth('underPressure'),avgLeveragedAtEnd:avgHealth('leveraged'),avgStableAtEnd:avgHealth('stable'),avgFinanciallyStrongAtEnd:avgHealth('financiallyStrong'),avgCashRichAtEnd:avgHealth('cashRich'),avgMedianCash:avg('medianCash'),avgMedianDebt:avg('medianDebt'),avgCatalogueRevenue:avg('catalogueRevenue'),avgLegacyCatalogueRevenue:avg('legacyCatalogueRevenue'),avgOverhead:avg('overhead'),avgInterest:avg('interest'),avgSystemNet:avg('systemNet'),avgActorFeeMedian:avg('actorFeeMedian'),avgActorsUnder3:avg('actorsUnder3'),screenplays:{turnaround:dealAggregate('turnaround'),standard:dealAggregate('standard')}};
}
'''
s=s[:start]+new_aggregate+s[end:]

old="<div class=\"listrow\"><span>Average distressed rivals at Year 5</span><strong>${bench.avgDistressedAtEnd}</strong></div><div class=\"listrow\"><span>Average 5-year rival catalogue receipts</span>"
new="<div class=\"listrow\"><span>Average true financial distress at Year 5</span><strong>${bench.avgFinancialDistressAtEnd??'—'}</strong></div><div class=\"listrow\"><span>Average under pressure at Year 5</span><strong>${bench.avgUnderPressureAtEnd??bench.avgDistressedAtEnd}</strong></div><div class=\"listrow\"><span>Average 5-year system net</span><strong class=\"${(bench.avgSystemNet||0)>=0?'goodtext':'badtext'}\">${(bench.avgSystemNet||0)>=0?'+':''}${money(bench.avgSystemNet||0)}</strong></div><div class=\"listrow\"><span>Frontloaded observed / expected</span><strong>${bench.profiles?.frontloaded||0} / ${bench.expectedProfiles?.frontloaded??'—'}</strong></div><div class=\"listrow\"><span>Average 5-year rival catalogue receipts</span>"
one(old,new,"benchmark UI diagnostics")

# Keep the exact same benchmark random stream as 4.0a.6 for instrumentation-only comparison.
if "audit-benchmark-v4005" not in s:
    raise SystemExit("stable benchmark seed namespace missing")
if "audit-benchmark-v4006" in s or "audit-benchmark-v4007" in s:
    raise SystemExit("benchmark seed namespace changed unexpectedly")

p.write_text(s,encoding="utf-8")
print("Patched Project Slate to v4.0a.7 audit resolution; simulation rules unchanged.")
