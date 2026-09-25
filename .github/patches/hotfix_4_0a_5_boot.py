from pathlib import Path

p=Path("index.html")
s=p.read_text(encoding="utf-8")
bad="  if(!releaseTurnaroundScript.toString().includes('budgetAnchor'))failures.push('turnaround rights rebalance missing');\n"
if s.count(bad)!=1:
    raise SystemExit(f"Expected bad turnaround smoke check once, found {s.count(bad)}")
s=s.replace(bad,"",1)
p.write_text(s,encoding="utf-8")
print("Removed invalid v4.0a.5 turnaround smoke reference.")
