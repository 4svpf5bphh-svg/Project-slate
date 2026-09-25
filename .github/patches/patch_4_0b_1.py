from pathlib import Path

p=Path("index.html")
s=p.read_text(encoding="utf-8")

def one(old,new,label):
    global s
    n=s.count(old)
    if n!=1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    s=s.replace(old,new,1)

one("<title>Project Slate — Premium Presentation v4.0a.7</title>",
    "<title>Project Slate — Premium Presentation v4.0b.1</title>","title")
one("const VERSION='4.0a.7';","const VERSION='4.0b.1';","version")
one("v4.0a.7-audit-resolution","v4.0b.1-player-progression","audit model label")

# Reprice department overhead and make each tier materially stronger without creating generic stat buffs.
u0=s.index("const STUDIO_UPGRADES={")
u1=s.index("\n};",u0)+3
new_upgrades="""const STUDIO_UPGRADES={
 production:[{name:'Expanded Production Office',cost:5,overhead:.018,recognition:26,desc:'Adds one concurrent production slot with a leaner operating footprint.'},{name:'Full Production Unit',cost:11,overhead:.038,recognition:54,desc:'Adds a second additional production slot and brings the department to full studio scale.'}],
 casting:[{name:'Agency Relationships',cost:2.5,overhead:.009,recognition:20,desc:'Adds an audition slot and materially sharpens scouting.'},{name:'In-house Casting Team',cost:5.5,overhead:.019,recognition:44,desc:'Expands to six audition slots, improves scouting again and makes extra rounds cheaper.'}],
 publicity:[{name:'Awards & Publicity Desk',cost:3,overhead:.011,recognition:24,desc:'Cuts awards-campaign cost by 25% and strengthens campaign execution.'},{name:'Full Publicity Department',cost:7,overhead:.024,recognition:50,desc:'Cuts awards-campaign cost by 45% and gives publicity a major execution lift.'}],
 development:[{name:'Story Department',cost:4.5,overhead:.014,recognition:30,desc:'Keeps one additional screenplay live and adds two weeks to departmental First Look access.'},{name:'Rights & Packaging Unit',cost:9,overhead:.030,recognition:56,desc:'Keeps three additional scripts live versus launch and adds four weeks to First Look access.'}],
 post:[{name:'In-house Editorial Suite',cost:4,overhead:.013,recognition:32,desc:'Surfaces one additional editorial option and expands music-supervisor choice.'},{name:'Post & Music Campus',cost:8.5,overhead:.027,recognition:58,desc:'Surfaces three additional editorial options and expands licensed-song shortlists to eight.'}]
};"""
s=s[:u0]+new_upgrades+s[u1:]

one("function auditionSlotLimit(){return 3+studioUpgradeLevel('casting')}",
    "function auditionSlotLimit(){return [3,4,6][Math.min(2,studioUpgradeLevel('casting'))]}","audition slots")
one("function scoutingPrecisionMultiplier(){return studioUpgradeLevel('casting')===0?1:studioUpgradeLevel('casting')===1?.88:.74}",
    "function scoutingPrecisionMultiplier(){return [1,.82,.64][Math.min(2,studioUpgradeLevel('casting'))]}","casting scouting")
one("function extraAuditionCost(){return studioUpgradeLevel('casting')>=2?.10:.15}",
    "function extraAuditionCost(){return [.15,.11,.07][Math.min(2,studioUpgradeLevel('casting'))]}","extra audition cost")
one("function awardsCampaignDiscount(){return studioUpgradeLevel('publicity')===0?0:studioUpgradeLevel('publicity')===1?.18:.34}",
    "function awardsCampaignDiscount(){return [0,.25,.45][Math.min(2,studioUpgradeLevel('publicity'))]}","publicity discount")
one("function publicityExecutionBonus(){return studioUpgradeLevel('publicity')===0?0:studioUpgradeLevel('publicity')===1?1.5:3}",
    "function publicityExecutionBonus(){return [0,2.5,5][Math.min(2,studioUpgradeLevel('publicity'))]}","publicity execution")
one("function screenplayMarketCapacity(){return 9+studioUpgradeLevel('development')}",
    "function screenplayMarketCapacity(){return [9,10,12][Math.min(2,studioUpgradeLevel('development'))]}","development capacity")
one("function firstLookDepartmentWeeks(){return studioUpgradeLevel('development')}",
    "function firstLookDepartmentWeeks(){return [0,2,4][Math.min(2,studioUpgradeLevel('development'))]}","first look")
one("function postOptionLimit(){return 4+studioUpgradeLevel('post')}",
    "function postOptionLimit(){return [4,5,7][Math.min(2,studioUpgradeLevel('post'))]}","post options")
one("function soundtrackShortlistSize(){return 5+studioUpgradeLevel('post')}",
    "function soundtrackShortlistSize(){return [5,6,8][Math.min(2,studioUpgradeLevel('post'))]}\nfunction totalStudioUpgradeLevels(){const u=ensureStudioGrowth().upgrades;return Object.keys(STUDIO_UPGRADES).reduce((n,k)=>n+(u[k]||0),0)}","soundtrack and upgrade total")

label_start=s.index("function studioUpgradeBenefitLabel(k){")
label_end=s.index("function studioUpgradeNewsBenefit",label_start)
bt=chr(96)
new_label=(
 "function studioUpgradeBenefitLabel(k){\n"
 " if(k==='production')return "+bt+"${playerProductionCapacity()} production slots"+bt+";\n"
 " if(k==='casting')return "+bt+"${auditionSlotLimit()} audition slots · ${Math.round((1-scoutingPrecisionMultiplier())*100)}% clearer scouting"+bt+";\n"
 " if(k==='publicity')return "+bt+"${Math.round(awardsCampaignDiscount()*100)}% awards saving · +${publicityExecutionBonus()} execution"+bt+";\n"
 " if(k==='development')return "+bt+"${screenplayMarketCapacity()} live scripts · +${firstLookDepartmentWeeks()} First Look weeks"+bt+";\n"
 " if(k==='post')return "+bt+"${postOptionLimit()} edit options · ${soundtrackShortlistSize()} songs"+bt+";\n"
 " return 'Department capability';\n"
 "}\n"
)
s=s[:label_start]+new_label+s[label_end:]

# Recognition is fast early, but harder to convert into elite studio standing.
marker="function registerStudioFilmImpact(f,profit)"
idx=s.index(marker)
recognition_helpers="""function playerRecognitionGainMultiplier(rec){
 rec=Number.isFinite(rec)?rec:ensureStudioGrowth().recognition;
 if(rec>=90)return .18;
 if(rec>=82)return .32;
 if(rec>=70)return .50;
 if(rec>=55)return .72;
 return 1;
}
function playerRecognitionDelta(base,rec){return base>0?base*playerRecognitionGainMultiplier(rec):base}

"""
s=s[:idx]+recognition_helpers+s[idx:]

old_film="function registerStudioFilmImpact(f,profit){const aud=f.review?.audience||60,crit=f.review?.critics||60,gross=f.finalGross||0;if(f.owner==='player'){const g=ensureStudioGrowth();g.fans=Math.max(.02,+(g.fans+Math.max(-.10,gross*.0035*(aud/70)+(aud-70)*.004+(profit>0?.05:-.03))).toFixed(3));g.recognition=clamp(g.recognition+gross*.018+(crit-65)*.025+(profit>5?1.2:profit<-8?-1.2:0),5,100);updateStudioIdentityHistory()}else{const rv=rivalById(f.owner);if(rv){rv.fans=Math.max(.1,+((rv.fans||1)+gross*.0027*(aud/70)+(aud-70)*.003).toFixed(3));rv.recognition=clamp((rv.recognition??rv.reputation??50)+gross*.013+(crit-65)*.018+(profit>5?.8:profit<-8?-.8:0),15,100)}}}"
new_film="""function registerStudioFilmImpact(f,profit){
 const aud=f.review?.audience||60,crit=f.review?.critics||60,gross=f.finalGross||0;
 if(f.owner==='player'){
  const g=ensureStudioGrowth(),baseRecognition=gross*.014+(crit-65)*.020+(profit>5?1:profit<-8?-1.2:0);
  g.fans=Math.max(.02,+(g.fans+Math.max(-.10,gross*.0035*(aud/70)+(aud-70)*.004+(profit>0?.05:-.03))).toFixed(3));
  g.recognition=clamp(g.recognition+playerRecognitionDelta(baseRecognition,g.recognition),5,100);
  updateStudioIdentityHistory();
 }else{
  const rv=rivalById(f.owner);if(rv){rv.fans=Math.max(.1,+((rv.fans||1)+gross*.0027*(aud/70)+(aud-70)*.003).toFixed(3));rv.recognition=clamp((rv.recognition??rv.reputation??50)+gross*.013+(crit-65)*.018+(profit>5?.8:profit<-8?-.8:0),15,100)}
 }
}"""
one(old_film,new_film,"film recognition")

old_award="function registerStudioAwardImpact(f,wins,noms){if(!wins&&!noms)return;if(f.owner==='player'){const g=ensureStudioGrowth();g.recognition=clamp(g.recognition+wins*2.4+noms*.55,5,100);g.fans=+(g.fans+wins*.08+noms*.015).toFixed(3)}else{const rv=rivalById(f.owner);if(rv){rv.recognition=clamp((rv.recognition??rv.reputation??50)+wins*1.8+noms*.4,15,100);rv.fans=+((rv.fans||1)+wins*.05+noms*.01).toFixed(3)}}}"
new_award="""function registerStudioAwardImpact(f,wins,noms){
 if(!wins&&!noms)return;
 if(f.owner==='player'){
  const g=ensureStudioGrowth(),baseRecognition=wins*2+noms*.40;
  g.recognition=clamp(g.recognition+playerRecognitionDelta(baseRecognition,g.recognition),5,100);
  g.fans=+(g.fans+wins*.08+noms*.015).toFixed(3);
 }else{
  const rv=rivalById(f.owner);if(rv){rv.recognition=clamp((rv.recognition??rv.reputation??50)+wins*1.8+noms*.4,15,100);rv.fans=+((rv.fans||1)+wins*.05+noms*.01).toFixed(3)}
 }
}"""
one(old_award,new_award,"award recognition")

# Legends remain achievement-based, but the Archive now expects a body of work as unlocks accumulate.
legend_marker="function legendRequirementProgress(entry){"
li=s.index(legend_marker)
gate="""function legendArchiveGate(entry){
 const tier=legendTier(entry).key,unlocked=Object.keys(ensureLegendsArchive().unlocked||{}).length;
 const base={accessible:{films:3,recognition:28},challenging:{films:6,recognition:45},storied:{films:10,recognition:60},mythic:{films:15,recognition:72}}[tier]||{films:6,recognition:45};
 const films=completedPlayerFilms().length,recognition=ensureStudioGrowth().recognition,requiredFilms=Math.max(base.films,3+unlocked*2);
 const done=films>=requiredFilms&&recognition>=base.recognition,pct=Math.min(100,Math.min(films/requiredFilms,recognition/base.recognition)*100);
 return {done,pct,text:${Math.min(films,requiredFilms)}/${requiredFilms} career releases · recognition ${Math.round(recognition)}/${base.recognition}`};
}

""".replace("${","${")
s=s[:li]+gate+s[li:]

old_return=" return {done,pct:clamp(pct,0,100),text};\n}"
new_return=""" const achievementDone=done,achievementPct=pct,achievementText=text,gate=legendArchiveGate(entry);
 done=achievementDone&&gate.done;pct=Math.min(achievementPct,gate.pct);
 if(!gate.done)text=${achievementText} · Archive standing: ${gate.text}`;
 return {done,pct:clamp(pct,0,100),text};
}""".replace("${","${")
one(old_return,new_return,"legend gate integration")

# Extend the milestone runway and explicitly reward building the studio itself.
ms=s.index("const STUDIO_MILESTONES=[")
me=s.index("\n];",ms)
extra="""
 // v4.0b.1 — LONG CAREER & INFRASTRUCTURE
 {id:'thirty_five_films',category:'Studio',title:'Catalogue Company',desc:'Release thirty-five films.',points:25,target:35,value:()=>completedPlayerFilms().length,format:v=>${Math.min(v,35)}/35 releases`},
 {id:'fifty_films',category:'Studio',title:'Studio Era',desc:'Release fifty films.',points:40,target:50,value:()=>completedPlayerFilms().length,format:v=>${Math.min(v,50)}/50 releases`},
 {id:'twenty_five_profitable',category:'Studio',title:'Repeatable Business',desc:'Produce twenty-five profitable releases.',points:30,target:25,value:()=>profitablePlayerFilms(),format:v=>${Math.min(v,25)}/25 profitable releases`},
 {id:'lifetime_5b',category:'Box Office',title:'Five-Billion Library',desc:'Reach $5bn in lifetime worldwide box office.',points:35,target:5000,value:()=>lifetimePlayerGross(),format:v=>${money(Math.min(v,5000))} / $5.0bn`},
 {id:'lifetime_10b',category:'Box Office',title:'Global Institution',desc:'Reach $10bn in lifetime worldwide box office.',points:50,target:10000,value:()=>lifetimePlayerGross(),format:v=>${money(Math.min(v,10000))} / $10.0bn`},
 {id:'year_five',category:'Legacy',title:'Five Years on the Lot',desc:'Reach the studio’s fifth operating year.',points:15,target:5,value:()=>Math.ceil(state.week/52),format:v=>${Math.min(v,5)}/5 years`},
 {id:'year_ten',category:'Legacy',title:'A Decade of Pictures',desc:'Reach the studio’s tenth operating year.',points:35,target:10,value:()=>Math.ceil(state.week/52),format:v=>${Math.min(v,10)}/10 years`},
 {id:'first_upgrade',category:'Studio',title:'Build the Company',desc:'Open the studio’s first permanent department upgrade.',points:5,target:1,value:()=>totalStudioUpgradeLevels(),format:v=>${Math.min(v,1)}/1 department level`},
 {id:'five_upgrades',category:'Studio',title:'Working Studio',desc:'Own five permanent department levels across the lot.',points:20,target:5,value:()=>totalStudioUpgradeLevels(),format:v=>${Math.min(v,5)}/5 department levels`},
 {id:'all_upgrades',category:'Studio',title:'Full-Service Studio',desc:'Fully build every permanent studio department.',points:40,target:10,value:()=>totalStudioUpgradeLevels(),format:v=>${Math.min(v,10)}/10 department levels`},
""".replace("${","${")
s=s[:me]+extra+s[me:]

p.write_text(s,encoding="utf-8")
print("Patched Project Slate to v4.0b.1 — Career Progression.")
