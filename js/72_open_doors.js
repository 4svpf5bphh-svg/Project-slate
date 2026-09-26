// v3.8.3 — Open Doors
// High-value late-career opportunities plus a slower, more memorable emerging-talent pipeline.

function ensureIndustryOpportunityState(st=state){
 st.industryOpportunities=st.industryOpportunities||{lastOfferWeek:0,history:[],accepted:0};
 st.industryOpportunities.history=st.industryOpportunities.history||[];
 return st.industryOpportunities;
}
function ensureEmergingTalentState(st=state){
 st.emergingTalentState=st.emergingTalentState||{lastIntroductionWeek:0,history:[]};
 st.emergingTalentState.history=st.emergingTalentState.history||[];
 return st.emergingTalentState;
}
function opportunityStanding(){
 const rank=typeof playerStudioStanding==='function'?(playerStudioStanding()?.rank||99):99,g=ensureStudioGrowth(),rep=state.reputation||{};
 return {rank,recognition:g.recognition||0,creative:rep.creative||0,talent:rep.talent||0,commercial:rep.commercial||0};
}
function industryInvitationEligible(){
 if(!state.studio||!state.careerStarted||state.week<53)return false;
 const s=opportunityStanding();
 return s.recognition>=48&&(s.rank<=4||s.creative>=62||s.talent>=62);
}
function invitationScale(r,standing){
 const strength=standing.recognition+(standing.rank<=2?12:0);
 if(strength>=88&&r()<.42)return 'large';
 if(strength>=68&&r()<.72)return 'mid';
 return r()<.28?'contained':'mid';
}
function invitationBudgetForScale(r,genre,scale){
 const base=marketBudgetForGenre(r,genre);
 if(scale==='contained')return +clamp(base*.55,5,13).toFixed(1);
 if(scale==='large')return +clamp(base*1.28,22,45).toFixed(1);
 return +clamp(base*.88,9,28).toFixed(1);
}
function invitationConcept(kind,t,r){
 const genre=pick(r,(t?.genres||genres).filter(Boolean)),concept=generatedPremise(state,r,genre),standing=opportunityStanding(),scale=invitationScale(r,standing),naturalBudget=invitationBudgetForScale(r,genre,scale);
 const qualityLift=Math.max(0,(standing.recognition-48)*.10),asking=+(clamp(.38+naturalBudget*.018+qualityLift*.012+(kind==='package'?(t?.star||50)*.004:(t?.craft||75)*.003),.55,2.8)).toFixed(2);
 const commitment=+(clamp(asking*.88+naturalBudget*.015,.65,3.4)).toFixed(2);
 return {kind,genre,title:concept.title,logline:concept.logline,shape:concept.shape,premiseDNA:concept.premiseDNA,scale,naturalBudget,asking,commitment,talentId:t?.id||null,createdWeek:state.week};
}
function invitationTalent(kind,r){
 const pool=state.talent.filter(t=>!t.retired&&!(t.isLegend&&t.retired));
 if(kind==='passion'){
  const rows=pool.filter(t=>t.type==='Director'&&(t.momentum||0)>=62).sort((a,b)=>((b.craft||0)+(b.momentum||0)*.45)-((a.craft||0)+(a.momentum||0)*.45));
  return pick(r,rows.slice(0,Math.min(12,rows.length))||rows);
 }
 const rows=pool.filter(t=>t.type==='Actor'&&(t.momentum||0)>=62).sort((a,b)=>((b.star||0)*.65+(b.momentum||0)*.45+(b.acting||0)*.25)-((a.star||0)*.65+(a.momentum||0)*.45+(a.acting||0)*.25));
 return pick(r,rows.slice(0,Math.min(16,rows.length))||rows);
}
function maybeGenerateIndustryInvitation(force=false){
 if(!industryInvitationEligible())return false;
 const box=ensureIndustryOpportunityState();
 if((ensureDesk().items||[]).some(x=>!x.resolved&&x.templateId==='industry-invitation'))return false;
 if(!force&&state.week-(box.lastOfferWeek||0)<18)return false;
 const r=makeRng(hash((state.seed||1)+'|industry-invitation-v383|'+state.week));
 if(!force&&r()>.12)return false;
 const standing=opportunityStanding(),kind=(standing.creative>=standing.talent?r()<.62:r()<.38)?'passion':'package',t=invitationTalent(kind,r);if(!t)return false;
 const spec=invitationConcept(kind,t,r),source=kind==='passion'?`${t.name} · filmmaker approach`:talentAgency(t).name;
 const body=kind==='passion'
  ?`${t.name} has brought ${state.studio.name} a ${spec.genre.toLowerCase()} project called ${spec.title} before taking it around The Lot. The pitch is built for roughly ${money(spec.naturalBudget)} and comes with ${t.name} intending to direct. A direct development commitment is estimated at ${money(spec.commitment)}.`
  :`${talentAgency(t).name} is quietly assembling ${spec.title}, a ${spec.genre.toLowerCase()} package built around ${t.name}. The agency is giving ${state.studio.name} the first serious conversation before wider financing starts. The project is sized around ${money(spec.naturalBudget)}.`;
 const choices=kind==='passion'?
  [['commit',`Back development · ${money(spec.commitment)}`],['read','Take a four-week first look'],['pass','Pass']]:
  [['commit',`Take the package · ${money(spec.commitment)}`],['read','Take a four-week first look'],['pass','Pass']];
 const item=pushDeskItem({templateId:'industry-invitation',family:'industry-invitation',type:'talent',source,urgency:'action',requiresAction:true,expiresWeek:state.week+4,subject:spec.title,talentId:t.id,headline:kind==='passion'?`${t.name} brings you a passion project before the market`: `${talentAgency(t).name} brings ${t.name}'s package to you first`,body,choices,invitationSpec:spec});
 box.lastOfferWeek=state.week;box.history.unshift({week:state.week,itemId:item.id,kind,talentId:t.id,title:spec.title,status:'offered'});box.history=box.history.slice(0,30);
 return true;
}
function makeInvitationScript(spec,owned){
 if(!spec)return null;
 const r=makeRng(hash((state.seed||1)+'|invite-script|'+spec.title+'|'+spec.createdWeek)),kind=spec.kind,t=talentById(spec.talentId),boost=kind==='passion'?4:2;
 if(owned&&!spend(spec.commitment))return null;
 const s={id:uid('script',state),title:spec.title,genre:spec.genre,logline:spec.logline,synopsis:'',shape:spec.shape||'',premiseDNA:spec.premiseDNA||null,price:owned?0:spec.asking,naturalBudget:spec.naturalBudget,
  story:Math.round(clamp(62+boost+r()*27,45,95)),hook:Math.round(clamp((kind==='package'?66:58)+r()*28,42,96)),originality:Math.round(clamp((kind==='passion'?69:58)+r()*27,40,97)),access:Math.round(clamp((kind==='package'?66:52)+r()*27,38,96)),difficulty:Math.round(clamp(36+spec.naturalBudget*1.3+r()*18,32,94)),
  source:'Industry Invitation',status:owned?'owned':'market',owner:owned?'player':null,filmStarted:false,developmentSpend:owned?spec.commitment:0,available:!owned,createdWeek:state.week,bids:0,marketState:null,
  invitationType:kind,invitationTalentId:t?.id||null,invitationAttachUntil:state.week+10,invitationDirectorId:kind==='passion'?t?.id:null,invitationActorId:kind==='package'?t?.id:null};
 ensureScriptEcosystem(s);
 s.rights=kind==='passion'?{type:'approval',label:'Filmmaker-led screen rights',detail:'The studio controls the film and first sequel option, while the originating filmmaker retains consultation on major future changes.'}:{type:'participation',label:'Package rights + talent participation',detail:'The studio controls the film property; the originating package carries modest participation if the film succeeds.'};
 if(!owned){s.firstLookUntil=state.week+4+(typeof firstLookDepartmentWeeks==='function'?firstLookDepartmentWeeks():0);s.firstLookReason=kind==='passion'?`${t?.name||'the filmmaker'} bringing the project directly to the studio`:`${talentAgency(t).name}'s package relationship`;state.market.unshift(s.id)}
 state.scripts.push(s);return s;
}
function resolveIndustryInvitation(item,key){
 const spec=item.invitationSpec,t=talentById(item.talentId),box=ensureIndustryOpportunityState();
 if(key==='pass'){
  if(t)adjustTalentRelationship(t,-1,'Studio passed on industry invitation');
  box.history.unshift({week:state.week,kind:spec?.kind,talentId:t?.id,title:spec?.title,status:'passed'});return 'The studio passes cleanly. The project will move on to other buyers without creating a feud.';
 }
 if(key==='read'){
  const s=makeInvitationScript(spec,false);if(!s)return 'The opportunity could not be opened.';
  if(t)adjustTalentRelationship(t,2,'Studio took an early look at invitation');
  box.history.unshift({week:state.week,kind:spec.kind,talentId:t?.id,title:s.title,status:'first-look',scriptId:s.id});
  return `${s.title} is now in Development under an exclusive First Look through Week ${s.firstLookUntil}. You can acquire it at ${money(s.price)} before rivals are allowed into the room.`;
 }
 if(key==='commit'){
  const s=makeInvitationScript(spec,true);if(!s)return `The studio could not cover the ${money(spec?.commitment||0)} development commitment, so the opportunity moves on.`;
  if(t)adjustTalentRelationship(t,5,'Studio backed industry invitation');box.accepted=(box.accepted||0)+1;box.history.unshift({week:state.week,kind:spec.kind,talentId:t?.id,title:s.title,status:'accepted',scriptId:s.id});
  return `${state.studio.name} has taken ${s.title} directly into its owned development slate for ${money(spec.commitment)}.${spec.kind==='passion'?` ${t?.name||'The filmmaker'} remains the intended director for ten weeks.`:` ${t?.name||'The performer'} is attached to the package and will enter film development in a principal lead role if the project moves forward within the attachment window. Contract terms still have to be agreed before greenlight.`}`;
 }
 return null;
}
function emergingTalentCapacity(){return state.talent.filter(t=>t.isRealPerson===false&&/^NG[AD]/.test(t.id||'')&&!t.retired).length}
function maybeIntroduceEmergingTalent(r){
 const box=ensureEmergingTalentState();
 if(state.week<53||emergingTalentCapacity()>=14)return false;
 if(state.week-(box.lastIntroductionWeek||0)<39)return false;
 if(r()>.55)return false;
 const t=addNewGenerationTalent(r);if(!t)return false;
 box.lastIntroductionWeek=state.week;box.history.unshift({week:state.week,talentId:t.id,name:t.name,type:t.type,status:'introduced'});box.history=box.history.slice(0,30);
 const standing=opportunityStanding();
 if(standing.recognition>=38||standing.talent>=54){
  const scout=t.type==='Actor'?`Acting ${Math.round(t.acting)} · Star ${Math.round(t.star)} · ${money(t.fee)} fee`:`Craft ${Math.round(t.craft)} · Commercial ${Math.round(t.commercial)} · ${money(t.fee)} fee`;
  pushDeskItem({templateId:'emerging-talent',family:'emerging-talent',type:'talent',source:'Talent Scout',urgency:'normal',requiresAction:false,expiresWeek:state.week+4,talentId:t.id,subject:t.name,headline:`Your scouts flag ${t.name} before the market catches up`,body:`${t.name}, ${t.age}, has entered the professional market as an emerging ${t.type.toLowerCase()}. ${scout}. Inviting them costs nothing and opens an eight-week relationship advantage; watching simply keeps them on your radar, and passing carries no penalty. The ceiling is deliberately uncertain — this is early access, not a guarantee of stardom.`,choices:[['invite','Invite them · no cost'],['watch','Add to watchlist'],['pass','Pass for now']]});
 }
 return true;
}
function resolveEmergingTalentChoice(item,key){
 const t=talentById(item.talentId);if(!t)return 'The scouting file is no longer active.';
 if(key==='invite'){
  adjustTalentRelationship(t,8,'Early studio scouting meeting');t.discoveryWindowUntil=state.week+8;if(!state.talentWatchlist.includes(t.id))state.talentWatchlist.push(t.id);t.scoutedByStudio=t.scoutedByStudio||state.studio.name;
  return `${t.name} accepts an early studio meeting. For the next eight weeks they are materially more receptive to a role from ${state.studio.name}, and the relationship will remain in their career history.`;
 }
 if(key==='watch'){
  adjustTalentRelationship(t,2,'Studio placed emerging talent on watchlist');if(!state.talentWatchlist.includes(t.id))state.talentWatchlist.push(t.id);
  return `${t.name} has been added to the studio watchlist. You keep the information advantage without making a stronger approach.`;
 }
 if(key==='pass')return `The studio does not pursue ${t.name}. They remain in the live talent market and can still develop elsewhere.`;
 return null;
}
function resolveOpportunityDeskChoice(item,key){
 if(item?.templateId==='industry-invitation')return resolveIndustryInvitation(item,key);
 if(item?.templateId==='emerging-talent')return resolveEmergingTalentChoice(item,key);
 if(item?.templateId==='rights-offer'){
  const f=filmById(item.filmId),buyer=rivalById(item.buyerId);
  if(!f||!buyer)return 'The rights approach is no longer active.';
  if(key==='decline'){
   addNews(state,`${state.studio.name} declined ${buyer.name}'s approach for future screen rights to ${ensureIPAsset(f).franchiseName}. The property remains under studio control.`,'Rights');
   return `The offer is declined. Existing films and all future screen rights remain with ${state.studio.name}.`;
  }
  if(key==='review'){
   if(ensureIPAsset(f).sold||franchiseActiveProject(f)||buyer.cash<(item.amount||0)+3)return 'The offer can no longer be completed on the original terms.';
   state.pendingRightsSale={filmId:f.id,buyerId:buyer.id,amount:item.amount};
   state.screen='slate';state.detail={type:'film',id:f.id};state.history=[];requestScrollTop();
   return `The formal terms are open on ${ensureIPAsset(f).franchiseName}. No sale has occurred yet.`;
  }
 }
 return null;
}
