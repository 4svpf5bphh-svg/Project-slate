// Project Slate v3.8 — Screenplay Economy
// Makes the script market a persistent competitive space: named rival interest,
// live auctions, player bids that survive across weeks, and turnaround material.

function ensureScreenplayEconomy(st=state){
 st.screenplayEconomy=st.screenplayEconomy||{history:[],lastWeek:0,turnarounds:0};
 st.screenplayEconomy.history=st.screenplayEconomy.history||[];
 st.screenplayEconomy.turnarounds=st.screenplayEconomy.turnarounds||0;
 return st.screenplayEconomy;
}
function ensureScriptMarketState(s){
 if(!s)return null;ensureScriptEcosystem(s);
 if(!s.marketState){
  const r=makeRng(hash((state.seed||1)+'|market-state|'+s.id));
  s.marketState={listedWeek:s.turnaround?.listedWeek||s.createdWeek||state.week,lastInterestWeek:0,interested:[],rivalBids:{},playerBid:0,playerBidWeek:null,auctionClosesWeek:null,status:'open',lastOutbidNotice:0,announcedAuction:false,marketAgeLimit:10+Math.floor(r()*5)};
 }
 const m=s.marketState;m.interested=Array.isArray(m.interested)?m.interested:[];m.rivalBids=m.rivalBids||{};m.playerBid=Number(m.playerBid)||0;m.marketAgeLimit=m.marketAgeLimit||12;return m;
}
function screenplayRivalInterest(s,rv){
 const health=aiFinancialHealth(rv),treasury=aiTreasurySnapshot(rv);if(health==='Financial distress'||treasury.available<(s.price||.4)+2)return null;
 const rr=makeRng(hash((state.seed||1)+'|script-interest|'+s.id+'|'+rv.id+'|'+(s.marketState?.listedWeek||s.createdWeek||1)));
 const score=aiScriptScore(rv,s)+(rr()-.5)*5,threshold=health==='Under pressure'?76:health==='Leveraged'?73:70;
 if(score<threshold)return null;
 const mult=clamp((1.03+Math.max(0,score-threshold)*.018+(rv.profile?.risk||.5)*.12+rr()*.06)*rivalryBidPressure(rv),1.03,1.92);
 const ceiling=+((s.price||.4)*mult).toFixed(2),intent=score>=86||mult>=1.58?'Aggressive':score>=77||mult>=1.34?'Serious':'Watching';
 return {rivalId:rv.id,score:+score.toFixed(1),intent,ceiling};
}
function screenplayInterestRank(x){return x.intent==='Aggressive'?3:x.intent==='Serious'?2:1}
function refreshScriptMarketInterest(s,announce=false,allowStart=false){
 if(!s||!s.available||s.status!=='market')return ensureScriptMarketState(s);
 const m=ensureScriptMarketState(s);
 if(scriptFirstLookActive(s)){m.interested=[];m.rivalBids={};m.lastInterestWeek=state.week;return m}
 if(m.lastInterestWeek===state.week&&m.interested.length)return m;
 const rows=(state.rivals||[]).map(rv=>screenplayRivalInterest(s,rv)).filter(Boolean).sort((a,b)=>screenplayInterestRank(b)-screenplayInterestRank(a)||b.score-a.score).slice(0,4);
 m.interested=rows;m.lastInterestWeek=state.week;
 const serious=rows.filter(x=>screenplayInterestRank(x)>=2),hot=rows.filter(x=>x.intent==='Aggressive');
 if(allowStart&&!m.auctionClosesWeek&&(serious.length>=2||hot.length>=1||(serious.length>=1&&rows.length>=2&&scriptMarketAppeal(s)>=68)||(rows.length>=3&&scriptMarketAppeal(s)>=72))){
  m.auctionClosesWeek=state.week+2;
  if(announce&&!m.announcedAuction){
   m.announcedAuction=true;
   const names=naturalNames(rows.slice(0,3).map(x=>rivalById(x.rivalId)?.name).filter(Boolean));
   addNews(state,`${s.title} has moved into a competitive screenplay sale${names?` with ${names} among the interested studios`:''}. Best-and-final bids are expected by Week ${m.auctionClosesWeek}.`,'Script Market');
  }
 }
 if(m.auctionClosesWeek){
  rows.forEach((x,i)=>{
   const prior=Number(m.rivalBids[x.rivalId])||0,seed=makeRng(hash((state.seed||1)+'|rival-bid-open|'+s.id+'|'+x.rivalId));
   const opening=Math.min(x.ceiling,+((s.price||.4)*(1.02+i*.015+seed()*.06)).toFixed(2));
   m.rivalBids[x.rivalId]=Math.max(prior,opening);
  });
 }
 return m;
}
function screenplayMarketLeader(s){
 const m=refreshScriptMarketInterest(s,false);let leader={type:'none',id:null,name:'No bid',bid:0};
 Object.entries(m.rivalBids||{}).forEach(([id,bid])=>{if(+bid>leader.bid){const rv=rivalById(id);leader={type:'rival',id,name:rv?.name||'Rival studio',bid:+bid}}});
 if((m.playerBid||0)>=leader.bid&&m.playerBid>0)leader={type:'player',id:'player',name:state.studio?.name||'Your studio',bid:m.playerBid};
 return leader;
}
function screenplayTradeRange(s){
 const m=refreshScriptMarketInterest(s,false),ask=s.price||.4,serious=m.interested.filter(x=>screenplayInterestRank(x)>=2),top=m.interested[0];
 if(!top)return [ask,ask];
 const lo=+(Math.max(ask,ask*(1+.06*serious.length))).toFixed(2),hi=+(Math.max(lo,Math.min(top.ceiling,ask*(1.18+.14*serious.length)))).toFixed(2);return [lo,hi];
}
function screenplayMarketSnapshot(s){
 const m=refreshScriptMarketInterest(s,false),leader=screenplayMarketLeader(s),range=screenplayTradeRange(s),playerBid=m.playerBid||0;
 return {m,leader,range,interested:m.interested||[],auction:!!m.auctionClosesWeek&&m.status==='open',closesWeek:m.auctionClosesWeek||null,playerBid,playerLeading:leader.type==='player',outbid:playerBid>0&&leader.type==='rival'};
}
function screenplayHasMeaningfulCompetition(snap){return !!(snap?.auction||snap?.interested?.some(x=>screenplayInterestRank(x)>=2)||(snap?.interested?.length||0)>=2)}
function scriptHeat(s){
 if(!s)return {label:'Quiet',cls:'',text:'No serious bidding pressure is currently visible.'};
 const snap=screenplayMarketSnapshot(s),count=snap.interested.length;
 if(scriptFirstLookActive(s))return {label:'First Look',cls:'good',text:`Rival studios are locked out through Week ${s.firstLookUntil}.`};
 if(s.turnaround)return {label:snap.auction?'Turnaround auction':'Turnaround',cls:snap.auction?'warn':'blue',text:snap.auction?'A discounted rival-developed property has attracted a live bidding room.':'Previously developed material is available after its former studio stepped away.'};
 if(snap.auction)return {label:'Auction',cls:'bad',text:`${count} interested studio${count===1?'':'s'} · bids close Week ${snap.closesWeek}.`};
 if(count>=2)return {label:'Active interest',cls:'warn',text:`${count} studios are tracking the material.`};
 if(count===1)return {label:'One buyer circling',cls:'warn',text:`${rivalById(snap.interested[0].rivalId)?.name||'A rival'} is watching the rights.`};
 return {label:'Quiet',cls:'',text:'No serious bidding pressure is currently visible.'};
}
function screenplayMarketCardMeta(s){
 const snap=screenplayMarketSnapshot(s),bits=[];
 if(s.turnaround)bits.push(`<span class="pill blue">Turnaround · ${s.turnaround.priorStudioName}</span>`);
 if(snap.interested.length)bits.push(`<span class="pill ${snap.auction?'bad':'warn'}">${snap.interested.length} buyer${snap.interested.length===1?'':'s'} circling</span>`);
 if(snap.auction)bits.push(`<span class="pill">Closes W${snap.closesWeek}</span>`);
 if(snap.playerBid)bits.push(`<span class="pill ${snap.playerLeading?'good':'bad'}">${snap.playerLeading?'Your bid leads':'You are outbid'} · ${money(snap.playerBid)}</span>`);
 return bits.join('');
}
function screenplayBuyerRoomHTML(s){
 const snap=screenplayMarketSnapshot(s);
 if(scriptFirstLookActive(s))return '';
 const rows=snap.interested;
 if(!rows.length)return `<div class="screenplay-room quiet"><div class="screenplay-room-head"><div><div class="badge">THE ROOM</div><strong>No serious rival buyer is showing yet.</strong></div><span class="pill">Quiet market</span></div><div class="small">That can change as genre demand, studio cash and rival slates move.</div></div>`;
 return `<div class="screenplay-room"><div class="screenplay-room-head"><div><div class="badge">THE ROOM</div><strong>${snap.auction?'A live sale is forming':'Studios are circling'}</strong></div>${snap.auction?`<span class="pill bad">Best & final · W${snap.closesWeek}</span>`:`<span class="pill warn">${rows.length} interested</span>`}</div><div class="screenplay-buyers">${rows.map(x=>{const rv=rivalById(x.rivalId);ensureRivalCharacter(rv);const bid=Number(snap.m.rivalBids?.[x.rivalId])||0;return `<div><span>${rv?.head?.name||'Studio executive'} · ${rv?.name||'Rival'}</span><strong>${x.intent}</strong><small>${bid?`Current bid around ${money(bid)}`:'No formal bid yet'}</small></div>`}).join('')}</div>${snap.auction?`<div class="screenplay-trade-estimate"><span>Trade closing estimate</span><strong>${money(snap.range[0])}–${money(snap.range[1])}</strong><small>This is market intelligence, not knowledge of a rival's maximum.</small></div>`:''}${snap.playerBid?`<div class="screenplay-player-bid ${snap.playerLeading?'leading':'outbid'}"><span>Your offer</span><strong>${money(snap.playerBid)}</strong><small>${snap.playerLeading?'You currently lead the room.':'A rival is currently ahead of you.'}</small></div>`:''}</div>`;
}
function screenplayTurnaroundHTML(s){
 if(!s?.turnaround)return '';
 const t=s.turnaround,rv=rivalById(t.priorStudioId);return `<div class="card turnaround-card"><div class="row"><div><div class="badge">TURNAROUND</div><strong>${t.priorStudioName} walked away</strong></div><span class="pill blue">Second chance</span></div><div class="body" style="margin-top:8px">${t.reason}. The screenplay is back on The Lot at a discount after roughly ${money(t.priorDevelopmentValue||0)} of rights, rewrites and development work was already committed.</div><div class="small" style="margin-top:8px">${rv?.head?.name?`${rv.head.name}'s studio no longer controls it. `:''}The existing rights package transfers as shown below. A turnaround is a warning flag, not proof that the material is bad.</div></div>`;
}
function screenplayRecentDealsHTML(){
 const rows=(ensureScreenplayEconomy().history||[]).slice(0,6);if(!rows.length)return '';
 return `<div class="section-title"><h2>Recent rights deals</h2><span class="small">What material is actually clearing for on The Lot</span></div><div class="card screenplay-deals">${rows.map(x=>`<div class="listrow"><div><strong>${x.title}</strong><div class="small">${x.turnaround?'Turnaround · ':''}${x.kind==='auction'?'Auction':'Direct sale'} · W${x.week}</div></div><div style="text-align:right"><strong>${money(x.price)}</strong><div class="small">${x.buyer}</div></div></div>`).join('')}</div>`;
}
function screenplayOfferForApproach(s,approach='ask'){
 const snap=screenplayMarketSnapshot(s),ask=s.price||.4,leader=snap.leader.bid||ask,range=snap.range;
 if(approach==='aggressive')return +Math.max(ask*1.48,leader+ask*.18,range[1]*1.06).toFixed(2);
 if(approach==='competitive')return +Math.max(ask*1.18,leader+ask*.08,range[0]).toFixed(2);
 return +Math.max(ask,snap.playerBid||0).toFixed(2);
}
function screenplayMarketActionHTML(s){
 const snap=screenplayMarketSnapshot(s);
 if(scriptFirstLookActive(s))return `<div class="card goodline"><div class="row"><strong>Exclusive First Look</strong><span class="pill good">Through Week ${s.firstLookUntil}</span></div><div class="body" style="margin-top:7px">The material has been brought to ${state.studio.name} first because of your ${s.firstLookReason||'studio track record'}. Rival studios cannot bid until the window expires.</div></div><button id="acquireScript" class="btn primary block" style="margin-top:14px">Acquire rights · ${money(s.price)}</button>`;
 if(!screenplayHasMeaningfulCompetition(snap))return `<button id="acquireScript" class="btn primary block" style="margin-top:14px">Acquire rights · ${money(s.price)}</button>`;
 const ask=screenplayOfferForApproach(s,'ask'),competitive=screenplayOfferForApproach(s,'competitive'),aggressive=screenplayOfferForApproach(s,'aggressive');
 return `<div class="section-title"><h2>${snap.playerBid?'Your position':'Contested rights'}</h2><span class="small">${snap.auction?`Best-and-final bids close Week ${snap.closesWeek}`:'The seller is testing competing interest'}</span></div><div class="grid cols3"><button class="card" data-script-bid="ask"><strong>${snap.playerBid?'Hold / re-enter':'Disciplined'}</strong><div class="small">${money(ask)} · protects the downside</div></button><button class="card" data-script-bid="competitive"><strong>Competitive</strong><div class="small">${money(competitive)} · challenge the current room</div></button><button class="card goodline" data-script-bid="aggressive"><strong>Pre-empt</strong><div class="small">${money(aggressive)} · try to take it off the table</div></button></div><div class="small" style="margin-top:8px">You only pay if you win. A pre-empt can be accepted immediately; otherwise the offer remains live until the sale closes.</div>`;
}
function screenplayRecordSale(s,buyerId,price,kind='auction'){
 const e=ensureScreenplayEconomy(),buyer=buyerId==='player'?state.studio?.name:rivalById(buyerId)?.name||'External buyer';
 e.history.unshift({week:state.week,scriptId:s.id,title:s.title,buyerId,buyer,price,kind,turnaround:!!s.turnaround});e.history=e.history.slice(0,80);
}
function acquireScreenplayForPlayer(s,price,kind='market'){
 if(state.cash+1e-9<price)return false;state.cash-=price;s.available=false;s.status='owned';s.owner='player';s.acquisitionCost=price;s.developmentSpend=(s.developmentSpend||0)+price;state.market=state.market.filter(id=>id!==s.id);if(s.marketState)s.marketState.status='sold';
 screenplayRecordSale(s,'player',price,kind);addNews(state,`${state.studio.name} acquired ${s.title} for ${money(price)}${s.turnaround?' in turnaround':''}.`,'Your Studio');
 const d=state.desk;if(d){d.items.filter(x=>x.scriptId===s.id&&x.templateId==='script-auction').forEach(x=>{x.resolved=true;x.requiresAction=false;x.read=true;x.expanded=false;x.resolvedWeek=state.week})}
 return true;
}
function sellScreenplayToRival(s,rv,price,kind='auction'){
 if(!rv)return false;price=+price.toFixed(2);if(rv.cash<price)price=Math.max(.1,Math.min(price,rv.cash*.22));rv.cash=Math.max(0,rv.cash-price);s.available=false;s.status='owned';s.owner=rv.id;s.acquisitionCost=price;state.market=state.market.filter(id=>id!==s.id);if(s.marketState)s.marketState.status='sold';
 screenplayRecordSale(s,rv.id,price,kind);ensureRivalCharacter(rv);
 const m=s.marketState||{},contested=(m.playerBid||0)>0;if(contested){rv.scriptWinsAgainstPlayer=(rv.scriptWinsAgainstPlayer||0)+1;rv.lastScriptWinAgainstPlayerWeek=state.week;adjustRivalRelationship(rv,-2,`Won ${s.title} after a screenplay auction`);recordRivalryEvent(rv,'auction-loss',`${rv.name} beat ${state.studio.name} to ${s.title}`,2.4,`auction:${s.id}:${rv.id}`,{scriptId:s.id,outcome:'Rival win'})}
 addNews(state,`${rv.head.name}'s ${rv.name} acquired ${s.title} for roughly ${money(price)}${contested?`, beating ${state.studio.name} in the final bidding`:''}.`,'Script Market');
 if(contested)pushDeskItem({templateId:'script-auction-result',scriptId:s.id,subject:s.title,source:'Rights Desk',headline:`${s.title} goes to ${rv.name}`,body:`The screenplay closed at roughly ${money(price)}. ${state.studio.name}'s final offer was ${money(m.playerBid||0)}.`,read:false,expanded:true,resolved:true,requiresAction:false,type:'development',system:true,destination:{screen:'develop',detail:{type:'script',id:s.id}}});
 return true;
}
function acquireScriptRights(scriptId,approach='ask'){
 const s=ensureScriptEcosystem(scriptById(scriptId));if(!s||!s.available||s.status!=='market')return showToast('That screenplay is no longer available.');
 const snap=screenplayMarketSnapshot(s);
 if(scriptFirstLookActive(s)||!screenplayHasMeaningfulCompetition(snap)){
  if(!spend(0))return;const price=s.price;if(!acquireScreenplayForPlayer(s,price,'direct'))return showToast('Not enough cash.');state.screen='develop';state.detail={type:'script',id:s.id};save();render();return;
 }
 const offer=screenplayOfferForApproach(s,approach);if(state.cash+1e-9<offer)return showToast(`You need ${money(offer)} available to make that offer.`);
 const m=snap.m,hadBid=m.playerBid>0;m.playerBid=offer;m.playerBidWeek=state.week;if(!m.auctionClosesWeek)m.auctionClosesWeek=state.week+2;
 const topCeiling=Math.max(0,...snap.interested.map(x=>x.ceiling));
 if(approach==='aggressive'&&offer>=topCeiling*1.03){
  if(!acquireScreenplayForPlayer(s,offer,'pre-empt'))return showToast('Not enough cash.');showToast('The seller accepted your pre-emptive offer.');state.screen='develop';state.detail={type:'script',id:s.id};save();render();return;
 }
 const lead=screenplayMarketLeader(s),isLead=lead.type==='player';
 addNews(state,`${state.studio.name} ${hadBid?'raised':'submitted'} an offer of ${money(offer)} for ${s.title}. ${isLead?'The studio currently leads the room.':`${lead.name} remains ahead.`}`,'Script Market');
 showToast(isLead?'Your offer currently leads.':'Your offer is in, but a rival still leads.');save();render();
}
function screenplayAdvanceRivalBids(s){
 const snap=screenplayMarketSnapshot(s),m=snap.m;if(!snap.auction)return;
 const player=m.playerBid||0;
 snap.interested.forEach(x=>{
  const current=Number(m.rivalBids[x.rivalId])||s.price,rr=makeRng(hash((state.seed||1)+'|rival-bid-step|'+s.id+'|'+x.rivalId+'|'+state.week));let next=current;
  if(player>current&&x.ceiling>current)next=Math.min(x.ceiling,Math.max(current,player+(s.price||.4)*(.035+rr()*.045)));
  else if(!player&&rr()<.45)next=Math.min(x.ceiling,current+(s.price||.4)*(.025+rr()*.045));
  m.rivalBids[x.rivalId]=+next.toFixed(2);
 });
 const lead=screenplayMarketLeader(s);
 if(m.playerBid>0&&lead.type==='rival'&&lead.bid>(m.lastOutbidNotice||0)+.001){
  m.lastOutbidNotice=lead.bid;
  const d=ensureDeskStateLite(),existing=d.items.find(x=>x.templateId==='script-auction'&&x.scriptId===s.id&&!x.resolved);
  const body=`${lead.name} has moved ahead at roughly ${money(lead.bid)}. Your ${money(m.playerBid)} offer remains live. Bidding closes in Week ${m.auctionClosesWeek}.`;
  if(existing){existing.headline=`You have been outbid on ${s.title}`;existing.body=body;existing.expiresWeek=m.auctionClosesWeek;existing.read=false;existing.expanded=true}
  else pushDeskItem({templateId:'script-auction',scriptId:s.id,subject:s.title,source:'Rights Desk',headline:`You have been outbid on ${s.title}`,body,read:false,expanded:true,resolved:false,requiresAction:true,urgency:'action',type:'development',system:true,expiresWeek:m.auctionClosesWeek,destination:{screen:'develop',detail:{type:'script',id:s.id}}});
 }
}
function settleScriptAuction(s){
 const snap=screenplayMarketSnapshot(s),m=snap.m;if(!snap.auction||m.auctionClosesWeek>state.week||!s.available)return false;
 // At the deadline, serious rivals are assumed to move close to their private ceiling.
 snap.interested.forEach(x=>{const rr=makeRng(hash((state.seed||1)+'|script-final|'+s.id+'|'+x.rivalId+'|'+state.week));const final=Math.min(x.ceiling,Math.max(Number(m.rivalBids[x.rivalId])||0,x.ceiling*(.88+rr()*.12)));m.rivalBids[x.rivalId]=+final.toFixed(2)});
 const rivalLeader=Object.entries(m.rivalBids).map(([id,bid])=>({rv:rivalById(id),bid:+bid})).filter(x=>x.rv).sort((a,b)=>b.bid-a.bid)[0]||null;
 if(m.playerBid>0&&(!rivalLeader||m.playerBid>=rivalLeader.bid)){
  if(acquireScreenplayForPlayer(s,m.playerBid,'auction')){if(rivalLeader){ensureRivalCharacter(rivalLeader.rv);rivalLeader.rv.playerScriptWinsAgainstRival=(rivalLeader.rv.playerScriptWinsAgainstRival||0)+1;recordRivalryEvent(rivalLeader.rv,'auction-win',`${state.studio.name} beat ${rivalLeader.rv.name} to ${s.title}`,2.1,`auction:${s.id}:${rivalLeader.rv.id}`,{scriptId:s.id,outcome:'Your win'})}pushDeskItem({templateId:'script-auction-result',scriptId:s.id,subject:s.title,source:'Rights Desk',headline:`You won ${s.title}`,body:`Best-and-final bidding closed with ${state.studio.name} acquiring the screenplay for ${money(m.playerBid)}.`,read:false,expanded:true,resolved:true,requiresAction:false,type:'development',system:true,destination:{screen:'develop',detail:{type:'script',id:s.id}}});return true}
  // An unfunded winning bid collapses; seller takes the strongest financed rival.
  if(rivalLeader){addNews(state,`${state.studio.name}'s winning ${money(m.playerBid)} offer for ${s.title} could not be funded at closing.`,'Script Market');return sellScreenplayToRival(s,rivalLeader.rv,rivalLeader.bid,'auction')}
 }
 if(rivalLeader)return sellScreenplayToRival(s,rivalLeader.rv,rivalLeader.bid,'auction');
 m.auctionClosesWeek=null;m.rivalBids={};return false;
}
function maybeListTurnaround(s,rv,reason='The package could not be financed on acceptable terms'){
 if(!s||!rv||s.owner!==rv.id||s.filmStarted||s.turnaround||s.franchiseMode)return false;
 const econ=ensureScreenplayEconomy();if(econ.lastTurnaroundWeek&&state.week-econ.lastTurnaroundWeek<13)return false;
 const rr=makeRng(hash((state.seed||1)+'|turnaround-v381|'+s.id+'|'+state.week));
 // Turnaround is discounted, not a fire-sale giveaway. A rival may have already paid for rights,
 // rewrites, packaging and months of development before abandoning the project.
 const natural=Math.max(3,s.naturalBudget||12),baseRights=Math.max(s.acquisitionCost||0,s.developmentSpend||0,s.price||0,.25),scaleCarry=clamp(natural*.035,.18,1.35),devCarry=.22+rr()*.55;
 const prior=+(baseRights+scaleCarry+devCarry).toFixed(2),budgetAnchor=clamp(natural*(.012+rr()*.010),.12,.78),askCap=clamp(natural*.028,.18,1.20),transferDiscount=.20+rr()*.12;
 // v4.0a.5: turnaround is an opportunity created by a prior studio exiting the project.
 // Rights should normally be cheaper relative to the film's natural production scale than a fresh market acquisition.
 const ask=+clamp(Math.min(prior*transferDiscount,budgetAnchor),.12,askCap).toFixed(2);
 s.turnaround={priorStudioId:rv.id,priorStudioName:rv.name,reason,listedWeek:state.week,priorDevelopmentValue:prior};s.source='Turnaround';s.owner=null;s.status='market';s.available=true;s.shelved=false;s.deferredUntil=null;s.price=ask;s.bids=0;s.marketState=null;s.firstLookUntil=null;s.firstLookReason=null;if(!state.market.includes(s.id))state.market.unshift(s.id);
 econ.turnarounds++;econ.lastTurnaroundWeek=state.week;ensureScriptMarketState(s);refreshScriptMarketInterest(s,false);
 addNews(state,`${rv.name} has put ${s.title} into turnaround after ${reason.toLowerCase()}. The developed screenplay is now available at ${money(ask)}.`,'Script Market');return true;
}
function processScreenplayMarketWeek(){
 const econ=ensureScreenplayEconomy();if(!state.studio||econ.lastWeek>=state.week)return;econ.lastWeek=state.week;
 state.market.map(scriptById).filter(s=>s&&s.available&&s.status==='market').forEach(s=>{refreshScriptMarketInterest(s,true,true);screenplayAdvanceRivalBids(s);settleScriptAuction(s)});
}
// Override the old four-week market rotation without throwing away live player bids or auctions.
function rotateMarket(){
 if(state.week-state.lastRotation<4)return;
 state.lastRotation=state.week;const r=makeRng(hash(state.seed+'|market-v38|'+state.week));
 const visible=state.market.map(scriptById).filter(Boolean);
 const cap=typeof screenplayMarketCapacity==='function'?screenplayMarketCapacity():9;
 if(visible.length>cap){
  const removable=visible.filter(x=>{const m=ensureScriptMarketState(x),age=state.week-(m.listedWeek||state.week);return x.available&&!scriptFirstLookActive(x)&&!m.playerBid&&!m.auctionClosesWeek&&(!x.turnaround||age>=8)}).sort((a,b)=>(ensureScriptMarketState(a).listedWeek||0)-(ensureScriptMarketState(b).listedWeek||0));
  let excess=Math.max(1,visible.length-cap);while(excess>0&&removable.length){const remove=removable.shift();remove.available=false;remove.marketState.status='withdrawn';state.market=state.market.filter(id=>id!==remove.id);addNews(state,remove.turnaround?`${remove.title}'s turnaround window closed without a deal.`:`${remove.title} was withdrawn after failing to find a buyer.`,'Script Market');excess--}
 }
 const n=1+(r()<.38?1:0);for(let i=0;i<n;i++){const s=generateScript(state,state.week,true);s.marketState=null;ensureScriptMarketState(s);const first=maybeGrantFirstLook(s);refreshScriptMarketInterest(s,false,true);addNews(state,first?`${s.title} is being shown to ${state.studio.name} on an exclusive first-look basis.`:`New screenplay ${s.title} entered the market.`,'Development')}
}
