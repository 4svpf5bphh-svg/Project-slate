from pathlib import Path

p=Path("index.html")
s=p.read_text(encoding="utf-8")

def one(old,new,label):
    global s
    n=s.count(old)
    if n!=1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    s=s.replace(old,new,1)

one("<title>Project Slate — Premium Presentation v4.0b.1.1</title>",
    "<title>Project Slate — Premium Presentation v4.0b.2</title>","title")
one("const VERSION='4.0b.1.1';","const VERSION='4.0b.2';","version")
one("v4.0b.1.1-trilogy-progress-hotfix","v4.0b.2-capital-allocation","audit model label")

anchor="function studioUpgradeOverhead(){const u=ensureStudioGrowth().upgrades;return Object.keys(STUDIO_UPGRADES).reduce((sum,k)=>sum+STUDIO_UPGRADES[k].slice(0,u[k]||0).reduce((a,x)=>a+x.overhead,0),0)}"
capital=r'''
const CAPITAL_ASSETS={
 lot:{id:'lot',name:'Studio Lot & Soundstages',cost:18,recognition:35,upkeep:.012,value:20,effect:'18% lower active-slate carrying overhead',desc:'Own core stages and production space instead of carrying the full cost through outside facilities.'},
 archive:{id:'archive',name:'Archive & Rights Division',cost:16,recognition:45,upkeep:.010,value:18,effect:'15% stronger recurring catalogue receipts',desc:'Build permanent rights, licensing and archive operations around the films the studio owns.'},
 distribution:{id:'distribution',name:'Distribution Operations',cost:28,recognition:55,upkeep:.018,value:30,effect:'18% lower self-distribution release-operations cost',desc:'Bring more theatrical release operations in-house without changing the revenue share retained at the box office.'}
};
function ensureCapitalAssets(st=state){
 const c=ensureCorporateState(st);c.capitalAssets=c.capitalAssets||{owned:{},history:[]};c.capitalAssets.owned=c.capitalAssets.owned||{};c.capitalAssets.history=c.capitalAssets.history||[];return c.capitalAssets;
}
function capitalAssetOwned(id,st=state){return !!ensureCapitalAssets(st).owned[id]}
function capitalAssetCount(st=state){return Object.keys(ensureCapitalAssets(st).owned||{}).length}
function capitalAssetValue(st=state){return Object.keys(ensureCapitalAssets(st).owned||{}).reduce((n,id)=>n+(CAPITAL_ASSETS[id]?.value||0),0)}
function capitalAssetWeeklyOverhead(st=state){return Object.keys(ensureCapitalAssets(st).owned||{}).reduce((n,id)=>n+(CAPITAL_ASSETS[id]?.upkeep||0),0)}
function capitalSlateMultiplier(){return capitalAssetOwned('lot')?.82:1}
function capitalCatalogueMultiplier(){return capitalAssetOwned('archive')?1.15:1}
function capitalDistributionMultiplier(){return capitalAssetOwned('distribution')?.82:1}
function capitalReserveTarget(extraUpkeep=0){
 const b=studioOverheadBreakdown(),weekly=Math.max(.05,(b.total||0)+Math.max(0,extraUpkeep||0));
 return +Math.max(8,weekly*20+5).toFixed(1);
}
function capitalDeployableCash(){return +Math.max(0,state.cash-capitalReserveTarget()).toFixed(1)}
function capitalAssetEligibility(id){
 ensureFinance();const a=CAPITAL_ASSETS[id],reasons=[];if(!a)return {ok:false,reasons:['Unknown capital asset.']};
 if(capitalAssetOwned(id))reasons.push('Already owned.');
 const recognition=ensureStudioGrowth().recognition||0;if(recognition<a.recognition)reasons.push('Reach '+a.recognition+' Studio Recognition.');
 if((state.finance.bridgeDebt||0)>.5)reasons.push('Repay emergency bridge debt before making a permanent capital investment.');
 const reserve=capitalReserveTarget(a.upkeep),required=+(a.cost+reserve).toFixed(1);
 if(state.cash<required)reasons.push('Hold '+money(required)+' cash so the '+money(a.cost)+' purchase leaves the operating reserve intact.');
 return {ok:reasons.length===0,reasons,reserve,required,asset:a};
}
function buyCapitalAsset(id){
 const e=capitalAssetEligibility(id);if(!e.ok)return showToast(e.reasons[0]||'That capital investment is not available.');
 const a=e.asset,ca=ensureCapitalAssets();state.cash-=a.cost;ca.owned[id]={week:state.week,cost:a.cost};ca.history.unshift({id,week:state.week,cost:a.cost});ca.history=ca.history.slice(0,20);
 state.reputation.financial=clamp((state.reputation.financial||50)+1,15,95);
 addNews(state,state.studio.name+' acquired '+a.name+' for '+money(a.cost)+'. The asset adds '+moneyFine(a.upkeep)+'/week of fixed operating cost in exchange for '+a.effect+'.','Trade Finance');
 notify('capital-asset:'+id,'Capital investment complete',a.name+' is now part of the studio infrastructure.',null,false,'milestone',{screen:'studio',detail:{type:'finance'}});
 if(typeof checkStudioMilestones==='function')checkStudioMilestones();save();render();return true;
}
function capitalAllocationPanel(){
 const recognition=ensureStudioGrowth().recognition||0,count=capitalAssetCount();if(recognition<25&&!count)return '';
 const reserve=capitalReserveTarget(),deployable=capitalDeployableCash();
 let html='<div class="section-title"><h2>Capital allocation</h2><span class="small">Permanent business assets</span></div>';
 html+='<div class="grid cols3"><div class="card"><div class="badge">Operating reserve</div><div class="kpi">'+money(reserve)+'</div><div class="small">Target held back from expansion</div></div><div class="card"><div class="badge">Deployable cash</div><div class="kpi">'+money(deployable)+'</div><div class="small">Cash above the current reserve</div></div><div class="card"><div class="badge">Permanent assets</div><div class="kpi">'+count+'/3</div><div class="small">'+money(capitalAssetValue())+' added studio value</div></div></div>';
 html+='<div class="grid cols3" style="margin-top:12px">';
 Object.values(CAPITAL_ASSETS).forEach(a=>{const owned=capitalAssetOwned(a.id),e=capitalAssetEligibility(a.id),reason=e.reasons[0]||'';html+='<div class="card '+(owned?'goodline':'')+'"><div class="row"><strong>'+a.name+'</strong><span class="pill '+(owned?'good':e.ok?'blue':'')+'">'+(owned?'OWNED':money(a.cost))+'</span></div><div class="body" style="margin-top:8px">'+a.desc+'</div><div class="listrow"><span>Effect</span><strong>'+a.effect+'</strong></div><div class="listrow"><span>Maintenance</span><strong>'+moneyFine(a.upkeep)+'/week</strong></div><div class="listrow"><span>Asset value</span><strong>'+money(a.value)+'</strong></div><div class="small" style="margin-top:8px">'+(owned?'This investment is permanent.':e.ok?'The purchase keeps the current operating reserve intact.':reason)+'</div><button class="btn '+(e.ok?'primary':'')+' block" data-capital-asset="'+a.id+'" style="margin-top:10px" '+(e.ok?'':'disabled')+'>'+(owned?'Owned':e.ok?'Acquire for '+money(a.cost):'Not yet available')+'</button></div>'});
 html+='</div>';return html;
}
function capitalAssetsCorporatePanel(){
 const count=capitalAssetCount();if(!count)return '';
 return '<div class="section-title"><h2>Permanent studio assets</h2><span class="small">'+count+' of 3 acquired</span></div><div class="card">'+Object.values(CAPITAL_ASSETS).filter(a=>capitalAssetOwned(a.id)).map(a=>'<div class="listrow"><div><strong>'+a.name+'</strong><div class="small">'+a.effect+'</div></div><strong>'+money(a.value)+'</strong></div>').join('')+'<div class="listrow"><span>Total capital-asset value</span><strong>'+money(capitalAssetValue())+'</strong></div></div>';
}
'''
one(anchor,anchor+capital,"capital asset system")

old_active="""function activeSlateOverhead(){
 const active=activePlayerFilms();
 return active.filter(f=>f.stage==='development'&&!f.paused).length*.025+
  active.filter(f=>f.stage==='development'&&f.paused).reduce((a,f)=>a+heldProjectWeeklyCost(f),0)+
  active.filter(f=>f.stage==='production').length*.055+
  active.filter(f=>['post','marketing','scheduled'].includes(f.stage)).length*.03+
  active.filter(f=>f.stage==='cinema').length*.02;
}"""
new_active="""function activeSlateOverhead(){
 const active=activePlayerFilms();
 const base=active.filter(f=>f.stage==='development'&&!f.paused).length*.025+
  active.filter(f=>f.stage==='development'&&f.paused).reduce((a,f)=>a+heldProjectWeeklyCost(f),0)+
  active.filter(f=>f.stage==='production').length*.055+
  active.filter(f=>['post','marketing','scheduled'].includes(f.stage)).length*.03+
  active.filter(f=>f.stage==='cinema').length*.02;
 return +(base*capitalSlateMultiplier()).toFixed(4);
}"""
one(old_active,new_active,"active slate capital effect")

old_over="""function studioOverheadBreakdown(){
 const scale=studioOperatingScale(),departments=studioUpgradeOverhead(),slate=activeSlateOverhead(),market=typeof corporateWeeklyOverhead==='function'?corporateWeeklyOverhead():0;
 return {scale,baseCorporate:scale.weekly,market,corporate:scale.weekly+market,departments,slate,total:scale.weekly+market+departments+slate};
}"""
new_over="""function studioOverheadBreakdown(){
 const scale=studioOperatingScale(),departments=studioUpgradeOverhead(),assets=capitalAssetWeeklyOverhead(),slate=activeSlateOverhead(),market=typeof corporateWeeklyOverhead==='function'?corporateWeeklyOverhead():0;
 return {scale,baseCorporate:scale.weekly,market,corporate:scale.weekly+market,departments,assets,slate,total:scale.weekly+market+departments+assets+slate};
}"""
one(old_over,new_over,"capital overhead")

one("return {overhead:b.corporate+b.departments,catalogue,net:catalogue-(b.corporate+b.departments)};",
    "return {overhead:b.corporate+b.departments+(b.assets||0),catalogue,net:catalogue-(b.corporate+b.departments+(b.assets||0))};","idle carry assets")

old_after="""function afterlifeWeeklyRevenue(f){
 const a=ensureAfterlifeState(f),age=Math.max(0,state.week-(f.completeWeek||state.week));
 const decay=Math.exp(-age/46),sequel=state.films.some(x=>x.ipParentId===f.id&&!['complete','shelved'].includes(x.stage))?1.18:1;
 const awards=a.wins.length?1.15:a.nominations.length?1.07:1,cult=a.cultStatus?1.12:1;
 const base=+Math.max(.0005,(afterlifeStrength(f)/100)*.055*decay*sequel*awards*cult).toFixed(4);
 return typeof streamingAdjustedWeeklyRevenue==='function'?streamingAdjustedWeeklyRevenue(f,base):base;
}"""
new_after="""function afterlifeWeeklyRevenue(f){
 const a=ensureAfterlifeState(f),age=Math.max(0,state.week-(f.completeWeek||state.week));
 const decay=Math.exp(-age/46),sequel=state.films.some(x=>x.ipParentId===f.id&&!['complete','shelved'].includes(x.stage))?1.18:1;
 const awards=a.wins.length?1.15:a.nominations.length?1.07:1,cult=a.cultStatus?1.12:1;
 const base=+Math.max(.0005,(afterlifeStrength(f)/100)*.055*decay*sequel*awards*cult).toFixed(4);
 const adjusted=typeof streamingAdjustedWeeklyRevenue==='function'?streamingAdjustedWeeklyRevenue(f,base):base;
 return +(adjusted*capitalCatalogueMultiplier()).toFixed(4);
}"""
one(old_after,new_after,"archive catalogue effect")

one("return {...base,id,opsCost:+(opsBase*base.opsMult).toFixed(2),domShare:+dom.toFixed(3),intlShare:+intl.toFixed(3),awareness:+awareness.toFixed(2)};",
    "return {...base,id,opsCost:+(opsBase*base.opsMult*(owner==='player'&&id==='self'?capitalDistributionMultiplier():1)).toFixed(2),domShare:+dom.toFixed(3),intlShare:+intl.toFixed(3),awareness:+awareness.toFixed(2)};",
    "distribution operations effect")

one("const streamingAsset=typeof ownedStreamingAssetValue==='function'?ownedStreamingAssetValue(st):0;",
    "const streamingAsset=typeof ownedStreamingAssetValue==='function'?ownedStreamingAssetValue(st):0,capitalAssets=capitalAssetValue(st);",
    "corporate capital assets")
one("+streamingAsset,25,1500);","+streamingAsset+capitalAssets,25,1500);","corporate valuation asset value")
one("streamingAsset:+streamingAsset.toFixed(1),awards,strongIP",
    "streamingAsset:+streamingAsset.toFixed(1),capitalAssets:+capitalAssets.toFixed(1),awards,strongIP",
    "corporate capital asset return")

one("<div class=\"listrow\"><span>Active slate</span><strong>${moneyFine(b.slate)}/week</strong></div><div class=\"listrow\"><span>Catalogue receipts</span>",
    "  <div class=\"listrow\"><span>Active slate</span><strong>${moneyFine(b.slate)}/week</strong></div><div class=\"listrow\"><span>Capital assets</span><strong>${moneyFine(b.assets||0)}/week</strong></div><div class=\"listrow\"><span>Catalogue receipts</span>",
    "finance capital overhead row")
one("<div class=\"section-title\"><h2>Emergency bridge finance</h2></div>",
    "  ${capitalAllocationPanel()}\n  <div class=\"section-title\"><h2>Emergency bridge finance</h2></div>",
    "finance capital allocation panel")
one("${typeof ownedStreamingCorporatePanel==='function'?ownedStreamingCorporatePanel():''}",
    "${typeof ownedStreamingCorporatePanel==='function'?ownedStreamingCorporatePanel():''}\n  ${capitalAssetsCorporatePanel()}",
    "corporate capital panel")
one("document.querySelectorAll('[data-repay]').forEach(b=>b.onclick=()=>repayBridge(+b.dataset.repay||1));",
    "document.querySelectorAll('[data-repay]').forEach(b=>b.onclick=()=>repayBridge(+b.dataset.repay||1));\n document.querySelectorAll('[data-capital-asset]').forEach(b=>b.onclick=()=>buyCapitalAsset(b.dataset.capitalAsset));",
    "capital asset binding")

ms=s.index("const STUDIO_MILESTONES=[")
me=s.index("\n];",ms)
extra="""
 // v4.0b.2 — CAPITAL ALLOCATION
 ,{id:'first_capital_asset',category:'Studio',title:'Plant the Flag',desc:'Acquire the studio’s first permanent capital asset.',points:10,target:1,value:()=>capitalAssetCount(),format:v=>Math.min(v,1)+'/1 capital asset'},
 {id:'all_capital_assets',category:'Studio',title:'Own the Infrastructure',desc:'Acquire all three permanent studio capital assets.',points:25,target:3,value:()=>capitalAssetCount(),format:v=>Math.min(v,3)+'/3 capital assets'},
"""
s=s[:me]+extra+s[me:]

p.write_text(s,encoding="utf-8")
print("Patched Project Slate to v4.0b.2 — Capital Allocation.")
