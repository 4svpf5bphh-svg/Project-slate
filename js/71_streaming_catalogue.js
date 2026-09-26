// v3.8.1 — Streaming Rights / Catalogue Strategy
// Completed films can attract explicit streaming-window offers. These are licences,
// not permanent IP sales: the player trades flexibility for upfront cash and/or a
// stronger weekly catalogue tail. Owning a studio streaming service remains a later
// corporate-game unlock rather than part of this contained afterlife pass.

const STREAMING_PLATFORMS=[
 {id:'vista',name:'Vista+',style:'Global event streamer',type:'exclusive',label:'Exclusive streaming window',termWeeks:78,upfrontMult:1.28,revenueMult:.68,bonusBase:.008,genres:['Action Thriller','Science Fiction','Fantasy','Family Adventure'],desc:'Largest guaranteed cheque, but the title is tied up exclusively for eighteen months.'},
 {id:'northlight',name:'Northlight',style:'Prestige subscription service',type:'performance',label:'Performance partnership',termWeeks:52,upfrontMult:.64,revenueMult:1.28,bonusBase:.004,genres:['Prestige Drama','Crime Thriller','Psychological Horror'],desc:'Lower guarantee, but stronger weekly participation if the film keeps finding viewers.'},
 {id:'relay',name:'Relay',style:'Genre and youth platform',type:'nonexclusive',label:'Non-exclusive library licence',termWeeks:39,upfrontMult:.43,revenueMult:1.08,bonusBase:.0025,genres:['Psychological Horror','Comedy','Action Thriller','Science Fiction'],desc:'Smallest upfront fee, preserves flexibility and leaves the film available for broader catalogue activity.'}
];
function streamingPlatform(id){return STREAMING_PLATFORMS.find(x=>x.id===id)||null}
function ensureStreamingState(f){
 const a=ensureAfterlifeState(f);a.streaming=a.streaming||{offers:[],activeDeal:null,history:[],lastOfferWeek:0,nextOfferWeek:null};
 a.streaming.offers=a.streaming.offers||[];a.streaming.history=a.streaming.history||[];return a.streaming;
}
function streamingPlatformFit(f,p){
 let fit=58;if(p.genres.includes(f.genre))fit+=13;
 if(p.id==='vista'){fit+=Math.min(12,(f.finalGross||0)/22);if((f.review?.audience||0)>=82)fit+=4}
 if(p.id==='northlight'){fit+=Math.max(0,(f.review?.critics||0)-70)*.28;if(f.creative?.positioning==='prestige')fit+=6}
 if(p.id==='relay'){fit+=Math.max(0,(f.socialPulse?.fandom||50)-55)*.20;if((f.audienceSegments?.['Genre Fans']||0)>=80)fit+=5}
 const r=makeRng(hash((state.seed||1)+'|stream-fit|'+f.id+'|'+p.id));fit+=(r()-.5)*7;return Math.round(clamp(fit,42,96));
}
function streamingBaseValue(f){
 const a=ensureAfterlifeState(f),strength=afterlifeStrength(f),gross=Math.min(350,f.finalGross||0),library=Math.max(.2,a.libraryValue||refreshAfterlifeValuation(f));
 return clamp(1.35+strength*.055+gross*.028+library*.45,2.2,20);
}
function generateStreamingOffers(f){
 const st=ensureStreamingState(f),base=streamingBaseValue(f),strength=afterlifeStrength(f),cycle=st.lastOfferWeek?st.lastOfferWeek+1:(f.completeWeek||state.week);
 const offers=STREAMING_PLATFORMS.map(p=>{
  const fit=streamingPlatformFit(f,p),r=makeRng(hash((state.seed||1)+'|stream-offer|'+f.id+'|'+p.id+'|'+cycle));
  const fitMult=.88+fit/520,upfront=+clamp(base*p.upfrontMult*fitMult*(.94+r()*.12),.75,28).toFixed(2);
  const weeklyBonus=+clamp(p.bonusBase+strength*.000075+(fit-60)*.00012,.001, .026).toFixed(4);
  return {id:`${p.id}:${state.week}`,platformId:p.id,platform:p.name,type:p.type,label:p.label,style:p.style,termWeeks:p.termWeeks,upfront,weeklyBonus,revenueMult:p.revenueMult,fit,expiresWeek:state.week+4,desc:p.desc};
 });
 st.offers=offers;st.lastOfferWeek=state.week;return offers;
}
function streamingAdjustedWeeklyRevenue(f,base){
 const st=ensureStreamingState(f);if(st.ownedPlatform)return +Math.max(.0005,base*.78).toFixed(4);const d=st.activeDeal;if(!d||state.week>d.endWeek)return base;
 return +Math.max(.0005,base*(d.revenueMult||1)+(d.weeklyBonus||0)).toFixed(4);
}
function streamingBlocksSpotLicensing(f){const st=ensureStreamingState(f),d=st.activeDeal;return !!st.ownedPlatform||!!(d&&state.week<=d.endWeek&&d.type==='exclusive')}
function streamingDealStatus(f){
 const st=ensureStreamingState(f),d=st.activeDeal;if(!d)return null;const p=streamingPlatform(d.platformId);return {deal:d,platform:p,weeksLeft:Math.max(0,d.endWeek-state.week+1)};
}
function streamingDeskItem(f){return ensureDeskStateLite().items.find(x=>x.templateId==='streaming-window'&&x.filmId===f.id&&!x.resolved)||null}
function resolveStreamingDeskItem(f,outcome){const item=streamingDeskItem(f);if(item){item.resolved=true;item.requiresAction=false;item.read=true;item.expanded=false;item.resolvedWeek=state.week;item.outcome=outcome||item.outcome}}
function tickStreamingMarket(f){
 if(!f||f.owner!=='player'||f.stage!=='complete')return;const a=ensureAfterlifeState(f),st=ensureStreamingState(f),age=a.catalogueAge||0;
 if(st.activeDeal&&state.week>st.activeDeal.endWeek){
  const ended=st.activeDeal;st.history.unshift({...ended,status:'completed',completedWeek:state.week});st.history=st.history.slice(0,12);st.activeDeal=null;st.nextOfferWeek=state.week+8;
  addNews(state,`${f.title}'s ${ended.platform} streaming window has ended. The film returns to the open catalogue market.`,'Library');
 }
 if(st.offers.length&&state.week>Math.max(...st.offers.map(x=>x.expiresWeek||0))){
  st.history.unshift({status:'expired',week:state.week,label:'Streaming offers expired'});st.history=st.history.slice(0,12);st.offers=[];st.nextOfferWeek=state.week+26;resolveStreamingDeskItem(f,'The streaming window closed without a deal.');
 }
 if(st.ownedPlatform||st.activeDeal||st.offers.length||age<4)return;
 // Keep the inbox quiet: only one unresolved streaming-rights window is surfaced at a time.
 if(typeof ensureDeskStateLite==='function'&&ensureDeskStateLite().items.some(x=>x.templateId==='streaming-window'&&!x.resolved))return;
 const next=st.nextOfferWeek??((f.completeWeek||state.week)+4);if(state.week<next)return;
 const offers=generateStreamingOffers(f),top=[...offers].sort((a,b)=>b.upfront-a.upfront)[0];
 pushDeskItem({templateId:'streaming-window',filmId:f.id,subject:f.title,source:'Distribution & Library',headline:`Streaming offers arrive for ${f.title}`,body:`${top.platform} leads the guarantees at ${money(top.upfront)}, while other platforms are offering different mixes of exclusivity and long-tail participation. The window closes after Week ${top.expiresWeek}.`,read:false,expanded:true,resolved:false,requiresAction:true,urgency:'action',type:'finance',system:true,expiresWeek:top.expiresWeek,destination:{screen:'slate',detail:{type:'film',id:f.id}}});
 addNews(state,`${f.title} has entered the streaming market with offers from ${offers.map(x=>x.platform).join(', ')}.`,'Library');
}
function acceptStreamingOffer(f,offerId){
 const a=ensureAfterlifeState(f),st=ensureStreamingState(f);if(st.activeDeal)return showToast('This film already has an active streaming deal.');
 const offer=st.offers.find(x=>x.id===offerId);if(!offer)return showToast('That streaming offer is no longer available.');
 const deal={...offer,startWeek:state.week,endWeek:state.week+offer.termWeeks-1,status:'active'};st.activeDeal=deal;st.offers=[];st.nextOfferWeek=null;st.history.unshift({...deal,status:'signed'});st.history=st.history.slice(0,12);
 state.cash+=offer.upfront;a.totalRevenue=+(a.totalRevenue+offer.upfront).toFixed(2);const e=ensureEconomyState();e.lifetimeCatalogue=+(e.lifetimeCatalogue+offer.upfront).toFixed(3);
 resolveStreamingDeskItem(f,`${offer.platform} secured the ${offer.label.toLowerCase()} for ${money(offer.upfront)}.`);
 addNews(state,`${state.studio.name} licensed ${f.title} to ${offer.platform} in a ${offer.termWeeks}-week ${offer.label.toLowerCase()} worth ${money(offer.upfront)} upfront.`,'Library');save();render();
}
function holdStreamingRights(f){
 const st=ensureStreamingState(f);if(!st.offers.length)return;st.history.unshift({status:'held',week:state.week,label:'Rights held off market'});st.history=st.history.slice(0,12);st.offers=[];st.nextOfferWeek=state.week+26;resolveStreamingDeskItem(f,'The studio held the streaming rights for a later market window.');
 addNews(state,`${state.studio.name} has chosen to hold ${f.title}'s streaming rights rather than accept the current offers.`,'Library');save();render();
}
function streamingRightsPanel(f){
 if(!f||f.stage!=='complete')return '';const a=ensureAfterlifeState(f),st=ensureStreamingState(f),status=streamingDealStatus(f),own=typeof ensureOwnedStreamingState==='function'?ensureOwnedStreamingState():null;
 if(st.ownedPlatform){const weeks=Math.max(0,state.week-(st.ownedPlatform.startWeek||state.week));return `<div class="section-title"><h2>Streaming & catalogue</h2><span class="pill good">${st.ownedPlatform.name}</span></div><div class="card goodline"><div class="row"><div><strong>Studio-platform exclusive</strong><div class="small">Streaming on ${st.ownedPlatform.name} since Week ${st.ownedPlatform.startWeek}</div></div><span class="pill">Owned distribution</span></div><div class="small" style="margin-top:8px">The studio has given up an outside streaming guarantee in exchange for using this film to attract and retain its own subscribers. Permanent sequel/remake rights are unaffected.</div>${weeks>=26?`<button id="returnOwnedStreamingRights" class="btn ghost block" style="margin-top:10px">Return streaming rights to open market</button>`:`<div class="small" style="margin-top:9px">Minimum exclusive window: ${26-weeks} weeks remaining.</div>`}</div>`}
 if(status){const d=status.deal;return `<div class="section-title"><h2>Streaming & catalogue</h2><span class="pill good">${d.platform}</span></div><div class="card goodline"><div class="row"><div><strong>${d.label}</strong><div class="small">${d.platform} · through Week ${d.endWeek}</div></div><strong>${money(d.upfront)} upfront</strong></div><div class="listrow"><span>Window remaining</span><strong>${status.weeksLeft} weeks</strong></div><div class="listrow"><span>Catalogue effect</span><strong>${d.type==='exclusive'?'Exclusive access':d.type==='performance'?'Performance participation':'Non-exclusive licence'}</strong></div><div class="small" style="margin-top:8px">Weekly catalogue receipts currently reflect this streaming arrangement. Permanent sequel/remake rights are unaffected.</div></div>`}
 if(st.offers.length){return `<div class="section-title"><h2>Streaming & catalogue</h2><span class="small">Offers expire after Week ${Math.max(...st.offers.map(x=>x.expiresWeek))}</span></div>${own?.status==='active'?`<button class="card goodline block" data-own-streaming-film="${f.id}" style="margin-bottom:10px"><div class="row"><div><strong>Keep it for ${own.name}</strong><div class="small">Decline the outside offers and make this a studio-platform exclusive.</div></div><span class="pill good">Own platform</span></div></button>`:''}<div class="grid">${st.offers.map(o=>`<button class="card streaming-offer ${o.type==='exclusive'?'attention':''}" data-streaming-offer="${o.id}"><div class="row"><div><strong>${o.platform}</strong><div class="small">${o.style}</div></div><span class="pill ${o.fit>=82?'good':o.fit>=70?'blue':'warn'}">Fit ${o.fit}</span></div><div class="body" style="margin-top:8px">${o.label} · ${o.termWeeks} weeks</div><div class="listrow"><span>Upfront guarantee</span><strong>${money(o.upfront)}</strong></div><div class="small">${o.desc}</div></button>`).join('')}</div><button id="holdStreamingRights" class="btn ghost block" style="margin-top:10px">Hold streaming rights · test the market again later</button>`}
 const next=st.nextOfferWeek;return `<div class="section-title"><h2>Streaming & catalogue</h2></div><div class="card"><div class="row"><div><strong>Rights currently open</strong><div class="small">No active streaming window</div></div><span class="pill">Open catalogue</span></div><div class="small" style="margin-top:8px">${next&&next>state.week?`The next streaming market window can reopen around Week ${next}.`:`Platforms will approach once the film has enough post-theatrical data.`} Permanent IP rights remain separate.</div>${own?.status==='active'?`<button class="btn primary block" data-own-streaming-film="${f.id}" style="margin-top:10px">Add to ${own.name}</button>`:''}</div>`;
}
