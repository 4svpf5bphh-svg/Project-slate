from pathlib import Path

p=Path("index.html")
s=p.read_text(encoding="utf-8")

def rep(old,new,label,count=1):
    global s
    n=s.count(old)
    if n!=count:
        raise SystemExit(f"{label}: expected {count} occurrence(s), found {n}")
    s=s.replace(old,new,count)

rep("<title>Project Slate — Premium Presentation v4.0a.5</title>",
    "<title>Project Slate — Premium Presentation v4.0a.6</title>","title")
rep("const VERSION='4.0a.5';","const VERSION='4.0a.6';","version")
rep("v4.0a.5-legacy-catalogue-turnaround","v4.0a.6-ai-finance-normalization","benchmark model")

# AI debt is ordinary studio/project finance, not the player's punitive emergency bridge product.
rep("const interest=rv.debt*.009;",
    "const interest=rv.debt*.0025; // v4.0a.6: ordinary rival financing, ~13.9% effective annual rather than emergency-bridge economics",
    "AI weekly interest")

rep("rv.cash+=draw;rv.debt+=draw*1.12;",
    "rv.cash+=draw;rv.debt+=draw*1.06;",
    "operating facility premium")

rep("""if(rv.debt>0 && rv.cash>t.reserve+12){
   const repay=Math.min(rv.debt,(rv.cash-(t.reserve+10))*.20);
   if(repay>.25){rv.cash-=repay;rv.debt-=repay}
  }""",
    """if(rv.debt>0 && rv.cash>t.reserve+7){
   const repay=Math.min(rv.debt,(rv.cash-(t.reserve+6))*.35);
   if(repay>.25){rv.cash-=repay;rv.debt-=repay}
  }""",
    "weekly deleveraging")

rep("rv.cash+=draw;rv.debt=(rv.debt||0)+draw*1.14;",
    "rv.cash+=draw;rv.debt=(rv.debt||0)+draw*1.05;",
    "project financing premium")

rep("rv.cash+=short;rv.debt+=short*1.10;rv.cash-=total;",
    "rv.cash+=short;rv.debt+=short*1.04;rv.cash-=total;",
    "turnaround financing premium")

rep("if(confidence>=p.borrowQuality-4&&short<=room){rv.cash+=short;rv.debt+=short*1.12}",
    "if(confidence>=p.borrowQuality-4&&short<=room){rv.cash+=short;rv.debt+=short*1.05}",
    "release financing premium")

rep("else{const short=overrun-rv.cash;rv.cash=0;rv.debt+=short*1.14}",
    "else{const short=overrun-rv.cash;rv.cash=0;rv.debt+=short*1.07}",
    "overrun financing premium")

rep("else{const short=finishCost-rv.cash;rv.cash=0;rv.debt+=short*1.10}",
    "else{const short=finishCost-rv.cash;rv.cash=0;rv.debt+=short*1.05}",
    "finishing financing premium")

rep("""if(rv.cash>t.reserve+10){
     const repay=Math.min(rv.debt,Math.max(0,(rv.cash-(t.reserve+8))*.18));
     rv.cash-=repay;rv.debt-=repay;
    }""",
    """if(rv.cash>t.reserve+6){
     const repay=Math.min(rv.debt,Math.max(0,(rv.cash-(t.reserve+5))*.40));
     rv.cash-=repay;rv.debt-=repay;
    }""",
    "release settlement deleveraging")

rep('<div class="listrow"><span>Average 5-year rival overhead</span><strong>${money(bench.avgOverhead||0)}</strong></div><div class="listrow"><span>Turnaround / standard benchmark deals</span>',
    '<div class="listrow"><span>Average 5-year rival overhead</span><strong>${money(bench.avgOverhead||0)}</strong></div><div class="listrow"><span>Average 5-year rival interest</span><strong>${money(bench.avgInterest||0)}</strong></div><div class="listrow"><span>Turnaround / standard benchmark deals</span>',
    "benchmark interest UI")

anchor="if(!aiCatalogueWeeklyRevenue.toString().includes('aiLegacyCatalogueWeeklyRevenue'))failures.push('AI legacy catalogue seed missing');"
insert=anchor+"\n  if(!aiWeeklyFinance.toString().includes('rv.debt*.0025'))failures.push('AI finance-rate normalization missing');\n  if(typeof aiFinanceProject!=='function'||!aiFinanceProject.toString().includes('draw*1.05'))failures.push('AI project-finance premium normalization missing');"
rep(anchor,insert,"finance smoke checks")

# Deliberately keep audit-benchmark-v4005 seed namespace for direct A/B comparability with 4.0a.5.
if "audit-benchmark-v4005" not in s:
    raise SystemExit("Stable v4005 benchmark seed namespace missing")
if "audit-benchmark-v4006" in s:
    raise SystemExit("Benchmark seed namespace changed unexpectedly")

p.write_text(s,encoding="utf-8")
print("Patched Project Slate to v4.0a.6 — AI financing normalization.")
