from pathlib import Path

p=Path("index.html")
s=p.read_text(encoding="utf-8")

def one(old,new,label):
    global s
    n=s.count(old)
    if n!=1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    s=s.replace(old,new,1)

one("<title>Project Slate — Premium Presentation v4.0b.1</title>",
    "<title>Project Slate — Premium Presentation v4.0b.1.1</title>","title")
one("const VERSION='4.0b.1';","const VERSION='4.0b.1.1';","version")
one("v4.0b.1-player-progression","v4.0b.1.1-trilogy-progress-hotfix","audit model label")

one(
"function maxPlayerFranchiseInstallment(){return Math.max(1,...completedPlayerFilms().map(f=>f.sequelInstallment||f.ip?.installment||1))}",
"""function maxPlayerFranchiseInstallment(){
 const continuation=completedPlayerFilms().filter(f=>f.ipParentId||f.sequelInstallment>1||['reboot','spinoff','revival'].includes(f.franchiseMode));
 if(!continuation.length)return 0;
 return Math.max(...continuation.map(f=>f.sequelInstallment||f.ip?.installment||2));
}""",
"trilogy progress"
)

p.write_text(s,encoding="utf-8")
print("Patched Project Slate to v4.0b.1.1 — trilogy milestone hotfix.")
