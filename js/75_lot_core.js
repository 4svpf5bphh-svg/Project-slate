// Project Slate v4.2 — THE LOT: LONG MEMORY
// Real talent names remain canonical throughout Project Slate. The Lot supplies
// fictional in-game personality, relationships, memories and alternate-Hollywood events.

function ensureLotState(st=state){
 st.lot=st.lot||{version:6,profiles:{},relationships:{},pairHistories:{},memories:[],stories:[],history:[],incidentHistory:[],variety:{recent:[]},lastIncidentWeek:0,talentCrises:[],lastTalentCrisisWeek:0};
 st.lot.profiles=st.lot.profiles||{};st.lot.relationships=st.lot.relationships||{};st.lot.pairHistories=st.lot.pairHistories||{};st.lot.memories=st.lot.memories||[];st.lot.stories=st.lot.stories||[];st.lot.history=st.lot.history||[];st.lot.incidentHistory=st.lot.incidentHistory||[];st.lot.variety=st.lot.variety||{recent:[]};st.lot.variety.recent=st.lot.variety.recent||[];st.lot.talentCrises=Array.isArray(st.lot.talentCrises)?st.lot.talentCrises:[];st.lot.lastTalentCrisisWeek=st.lot.lastTalentCrisisWeek||0;
 if((st.lot.version||1)<2)Object.entries(st.lot.profiles).forEach(([id,p])=>{const t=(st.talent||[]).find(x=>x.id===id);if(t&&p)p.alias=t.name});
 if((st.lot.version||1)<3){
  st.lot.stories.forEach(s=>{s.chapters=s.chapters||[];s.phase=s.active?'active':'resolved';s.timesResurfaced=s.timesResurfaced||0;s.lastChapterWeek=s.lastChapterWeek||s.lastWeek||s.startedWeek});
  st.lot.version=3;
 }
 if((st.lot.version||1)<4){
  st.lot.incidentHistory=st.lot.incidentHistory||[];
  Object.values(st.lot.pairHistories||{}).forEach(h=>{h.incidents=h.incidents||[];h.lastIncidentWeek=h.lastIncidentWeek||0});
  st.lot.version=4;
 }
 if((st.lot.version||1)<5){
  st.lot.variety=st.lot.variety||{recent:[]};st.lot.variety.recent=st.lot.variety.recent||[];
  st.lot.incidentHistory.forEach(x=>{if(!x.variety)x.variety=lotIncidentVarietyFromEntry(x)});
  st.lot.variety.recent=st.lot.incidentHistory.slice(0,24).map(x=>x.variety).filter(Boolean);
  st.lot.version=5;
 }
 if((st.lot.version||1)<6){
  st.lot.talentCrises=Array.isArray(st.lot.talentCrises)?st.lot.talentCrises:[];st.lot.lastTalentCrisisWeek=st.lot.lastTalentCrisisWeek||0;st.lot.version=6;
 }
 return st.lot;
}
function lotTalentName(t){return t?.name||'Unknown'}
function lotTraitValue(t,key,base=50,spread=46){
 const r=makeRng(hash((state.seed||1)+'|lot-trait|'+t.id+'|'+key));return Math.round(clamp(base+(r()-.5)*spread,5,98));
}
function ensureLotProfile(t){
 if(!t)return null;const lot=ensureLotState(),old=lot.profiles[t.id];if(old){old.alias=t.name;return old;}
 const professionalBase=t.type==='Actor'?(t.reliability||70):(t.budgetControl||72),fame=t.type==='Actor'?(t.star||55):(t.commercial||55);
 const p={
  talentId:t.id,alias:t.name,createdWeek:state.week,
  traits:{
   professionalism:lotTraitValue(t,'professionalism',professionalBase*.72+20,38),
   ego:lotTraitValue(t,'ego',42+fame*.28,52),
   volatility:lotTraitValue(t,'volatility',48,64),
   loyalty:lotTraitValue(t,'loyalty',56,58),
   competitiveness:lotTraitValue(t,'competitiveness',48+(t.momentum||60)*.22,50),
   eccentricity:lotTraitValue(t,'eccentricity',50,72),
   attention:lotTraitValue(t,'attention',38+fame*.24,60),
   grudge:lotTraitValue(t,'grudge',50,68),
   humour:lotTraitValue(t,'humour',52,66)
  },
  memories:[],storyIds:[]
 };
 lot.profiles[t.id]=p;return p;
}
function lotPersonaLabels(t){
 const p=ensureLotProfile(t),x=p.traits,rows=[
  [x.professionalism,'Meticulous professional'],[x.ego,'Large ego'],[x.volatility,'Combustible'],[x.loyalty,'Fiercely loyal'],
  [x.competitiveness,'Ultra-competitive'],[x.eccentricity,'Gloriously eccentric'],[x.attention,'Born for the camera'],
  [x.grudge,'Never forgets a slight'],[x.humour,'Chaos merchant']
 ].sort((a,b)=>b[0]-a[0]);
 const high=rows.filter(r=>r[0]>=67).slice(0,3).map(r=>r[1]);
 return high.length?high:['Guarded','Professional','Hard to read'];
}
function lotPairKey(a,b){const ids=[typeof a==='string'?a:a?.id,typeof b==='string'?b:b?.id].filter(Boolean).sort();return ids.join('|')}
function lotPairHistory(a,b){
 const key=lotPairKey(a,b);if(!key)return null;const ids=key.split('|'),lot=ensureLotState();
 if(!lot.pairHistories[key])lot.pairHistories[key]={key,a:ids[0],b:ids[1],films:[],awards:[],storyIds:[],incidents:[],reunions:0,lastFilmWeek:0,lastSharedFilmId:null,lastIncidentWeek:0};
 const h=lot.pairHistories[key];h.incidents=h.incidents||[];h.lastIncidentWeek=h.lastIncidentWeek||0;
 return h;
}
function lotPairLastFilm(a,b){return lotPairHistory(a,b)?.films?.[0]||null}
function lotStoryChapter(story,{type='chapter',headline='',detail='',filmId=null,memoryId=null,intensity=1}={}){
 if(!story)return null;story.chapters=story.chapters||[];
 const chapter={week:state.week,type,headline,detail,filmId,memoryId,intensity};story.chapters.unshift(chapter);story.chapters=story.chapters.slice(0,18);story.lastChapterWeek=state.week;return chapter;
}
function lotRelationship(a,b){
 const ta=typeof a==='string'?talentById(a):a,tb=typeof b==='string'?talentById(b):b;if(!ta||!tb||ta.id===tb.id)return null;
 const lot=ensureLotState(),key=lotPairKey(ta,tb);if(lot.relationships[key])return lot.relationships[key];
 const r=makeRng(hash((state.seed||1)+'|lot-rel|'+key)),existing=typeof collaborationScore==='function'?collaborationScore(ta.id,tb.id):0;
 const rel={key,a:ta.id,b:tb.id,affection:Math.round(clamp(48+(r()-.5)*18+existing*.18,0,100)),respect:Math.round(clamp(55+(r()-.5)*20+existing*.28,0,100)),trust:Math.round(clamp(50+(r()-.5)*18,0,100)),tension:Math.round(clamp(12+r()*18-Math.max(0,existing)*.08,0,100)),grudge:0,memories:[],lastWeek:state.week};
 lot.relationships[key]=rel;return rel;
}
function lotRelationshipLabel(rel){
 if(!rel)return 'No history';if(rel.grudge>=60||rel.tension>=78)return 'Hostile';if(rel.tension>=55)return 'Volatile';
 if(rel.affection>=76&&rel.trust>=68)return 'Very close';if(rel.affection>=65)return 'Friendly';if(rel.respect>=72)return 'Strong professional respect';if(rel.grudge>=28)return 'Strained';return 'Neutral';
}
function lotAdjustRelationship(a,b,delta={},memoryId=null,eventWeek=state.week){
 const rel=lotRelationship(a,b);if(!rel)return null;['affection','respect','trust','tension','grudge'].forEach(k=>{if(delta[k])rel[k]=Math.round(clamp((rel[k]||0)+delta[k],0,100))});rel.lastWeek=eventWeek;if(memoryId)rel.memories.unshift(memoryId);rel.memories=rel.memories.slice(0,12);return rel;
}

function lotRelationshipScore(rel){
 if(!rel)return 0;
 return clamp((rel.affection-50)*.10+(rel.trust-50)*.08+(rel.respect-55)*.06-(rel.tension-20)*.10-(rel.grudge||0)*.12,-18,14);
}
function lotAttachedTalentIds(f){
 return [...new Set([f?.directorId,...(f?.cast||[]),...(f?.supportingCastIds||[]),f?.supportingCastId].filter(Boolean))];
}
function lotCastingModifier(t,f){
 const others=lotAttachedTalentIds(f).filter(id=>id!==t.id).map(talentById).filter(Boolean);
 if(!others.length)return {score:0,strongest:null};
 let score=0,strongest=null;
 others.forEach(other=>{
  const rel=lotRelationship(t,other),raw=lotRelationshipScore(rel),history=lotPairHistory(t,other);let delta=clamp(raw*.62,-10,7);
  const shared=history?.films?.length||0,preferred=shared>0&&rel.affection>=76&&rel.trust>=68,oldFeud=shared>0&&(rel.grudge>=60||rel.tension>=78);
  if(preferred)delta+=2.5;if(oldFeud)delta-=3.5;
  score+=delta;
  if(!strongest||Math.abs(delta)>Math.abs(strongest.delta))strongest={id:other.id,name:other.name,delta,label:preferred?'Wanted reunion':oldFeud?'Old feud':lotRelationshipLabel(rel),history,preferred,oldFeud};
 });
 return {score:clamp(score,-18,12),strongest};
}
function lotPackageDynamics(f){
 const ids=lotAttachedTalentIds(f),pairs=[];
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
  const a=talentById(ids[i]),b=talentById(ids[j]);if(!a||!b)continue;
  const rel=lotRelationship(a,b);pairs.push({a,b,rel,score:lotRelationshipScore(rel)});
 }
 if(!pairs.length)return {score:0,chemistry:0,performances:0,stability:0,morale:0,tone:'neutral',strongest:null};
 const avg=pairs.reduce((n,x)=>n+x.score,0)/pairs.length;
 const leads=(f?.cast||[]).map(talentById).filter(Boolean),leadPair=leads.length>=2?pairs.find(x=>(x.a.id===leads[0].id&&x.b.id===leads[1].id)||(x.a.id===leads[1].id&&x.b.id===leads[0].id)):null;
 const directorId=f?.directorId,dirPairs=pairs.filter(x=>x.a.id===directorId||x.b.id===directorId),dirAvg=dirPairs.length?dirPairs.reduce((n,x)=>n+x.score,0)/dirPairs.length:avg;
 const leadScore=leadPair?.score??avg,strongest=pairs.slice().sort((a,b)=>Math.abs(b.score)-Math.abs(a.score))[0]||null;
 const tone=(avg<=-4||strongest?.score<=-8)?'bad':(avg>=4||strongest?.score>=7)?'good':'neutral';
 return {score:+avg.toFixed(2),chemistry:Math.round(clamp(leadScore*.36,-6,5)),performances:Math.round(clamp(dirAvg*.20,-4,3)),stability:Math.round(clamp(avg*.22,-5,4)),morale:Math.round(clamp(avg*.26,-5,5)),tone,strongest};
}
function lotPackageSignal(f){
 const x=lotPackageDynamics(f),p=x.strongest;if(!p||x.tone==='neutral')return null;
 const names=`${p.a.name} and ${p.b.name}`,label=lotRelationshipLabel(p.rel).toLowerCase();
 if(x.tone==='bad')return {tone:'bad',text:`The Lot: ${names} carry a ${label} relationship into this package, creating a real people-risk around chemistry and set stability.`};
 return {tone:'good',text:`The Lot: ${names} bring a ${label} relationship into the package, giving the production some existing trust and chemistry to build on.`};
}

function lotActiveStoriesForFilm(f){
 const ids=new Set(lotAttachedTalentIds(f));
 return ensureLotState().stories.filter(s=>s.active&&s.participants?.length>=2&&s.participants.every(id=>ids.has(id))).sort((a,b)=>(b.heat||0)-(a.heat||0)||(b.intensity||0)-(a.intensity||0));
}
function lotHostilePackage(f){
 const ids=lotAttachedTalentIds(f),pairs=[];
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
  const a=talentById(ids[i]),b=talentById(ids[j]);if(!a||!b)continue;
  const rel=lotRelationship(a,b);
  if(rel.grudge>=60||rel.tension>=78)pairs.push({a,b,rel,severity:(rel.grudge||0)+(rel.tension||0),label:lotRelationshipLabel(rel)});
 }
 return pairs.sort((a,b)=>b.severity-a.severity)[0]||null;
}
function lotCandidateCastingSignal(t,f){
 if(!t||!f)return null;
 const otherIds=lotAttachedTalentIds(f).filter(id=>id!==t.id),otherSet=new Set(otherIds),lot=ensureLotState();
 if(!otherIds.length)return null;
 const story=lot.stories.filter(s=>s.active&&s.participants?.includes(t.id)&&s.participants.some(id=>id!==t.id&&otherSet.has(id))).sort((a,b)=>(b.heat||0)-(a.heat||0))[0];
 if(story){
  const otherId=story.participants.find(id=>id!==t.id&&otherSet.has(id)),other=talentById(otherId),friendly=story.type==='friendship';
  return {tone:friendly?'good':story.intensity>=3?'bad':'warn',label:friendly?'Active friendship':'Active Lot story',text:story.headline,other};
 }
 let strongest=null;
 otherIds.map(talentById).filter(Boolean).forEach(other=>{
  const rel=lotRelationship(t,other),score=lotRelationshipScore(rel),label=lotRelationshipLabel(rel),history=lotPairHistory(t,other);
  if(!strongest||Math.abs(score)>Math.abs(strongest.score))strongest={other,rel,score,label,history};
 });
 if(!strongest)return null;
 const prior=strongest.history?.films?.[0],archived=lot.stories.filter(s=>!s.active&&s.pair===lotPairKey(t,strongest.other)).sort((a,b)=>(b.lastWeek||0)-(a.lastWeek||0))[0];
 if(prior&&(strongest.rel.grudge>=60||strongest.rel.tension>=78))return {tone:'bad',label:'Old feud',text:(archived?.headline||'A difficult history')+' · last shared film '+prior.title,other:strongest.other};
 if(prior&&strongest.rel.affection>=76&&strongest.rel.trust>=68)return {tone:'good',label:'Wanted reunion',text:'Strong shared history with '+strongest.other.name+' · last worked together on '+prior.title,other:strongest.other};
 if(Math.abs(strongest.score)<4)return null;
 const tone=strongest.score<=-7?'bad':strongest.score<0?'warn':'good';
 return {tone,label:strongest.label,text:strongest.label+' with '+strongest.other.name+(prior?' · '+prior.title:'') ,other:strongest.other};
}
function lotInfluenceApproachOffer(t,f,roleId=null){
 if(!t||!f||f.stage!=='development'||t.type!=='Actor'||talentUnavailableForFilm(t,f)||lotAttachedTalentIds(f).includes(t.id))return null;
 const activeWindow=typeof activeAgencyWindow==='function'?activeAgencyWindow(t):null;if(activeWindow&&activeWindow.filmId!==f.id)return null;
 const allies=lotAttachedTalentIds(f).map(talentById).filter(Boolean).map(ally=>{
  const rel=lotRelationship(t,ally),score=lotRelationshipScore(rel),history=lotPairHistory(t,ally);
  const bonus=(rel.affection>=76&&rel.trust>=68?4:0)+(history?.films?.length?Math.min(3,history.films.length):0);
  return {ally,rel,score:score+bonus,history,label:lotRelationshipLabel(rel)};
 }).filter(x=>x.score>=6&&!['Hostile','Volatile'].includes(x.label)).sort((a,b)=>b.score-a.score);
 const best=allies[0];if(!best)return null;
 const rid=roleId||castingTargetRole(f)?.id||'lead1',key=t.id+'|'+rid,used=f.lotInfluenceApproaches?.[key];
 return {talent:t,film:f,roleId:rid,ally:best.ally,relationship:best.label,history:best.history,available:!used,used,
  text:best.history?.films?.length?best.ally.name+' has real shared history with '+t.name+' and can make a credible personal approach.':best.ally.name+' has enough trust with '+t.name+' to make a personal approach.'};
}
function useLotInfluenceApproach(t,f,roleId=null){
 const offer=lotInfluenceApproachOffer(t,f,roleId);if(!offer)return showToast('There is no trusted collaborator available to make that introduction.');
 if(!offer.available)return showToast('You have already used that personal introduction on this role.');
 f.lotInfluenceApproaches=f.lotInfluenceApproaches||{};const key=t.id+'|'+offer.roleId;
 f.lotInfluenceApproaches[key]={week:state.week,allyId:offer.ally.id,talentId:t.id,roleId:offer.roleId};
 if(typeof openAgencyWindow==='function')openAgencyWindow(t,f);
 if(f.castingDeclines?.[auditionKey(t.id,offer.roleId)])delete f.castingDeclines[auditionKey(t.id,offer.roleId)];
 const headline=offer.ally.name+' makes a personal call to '+t.name+' about '+f.title;
 const detail=offer.ally.name+' used their existing relationship to reopen the conversation. It improves access; it does not guarantee the role will be accepted.';
 const mem=lotRemember({type:'influence',participants:[offer.ally.id,t.id],headline,detail,intensity:1,publicEvent:false,filmId:f.id});
 lotAdjustRelationship(offer.ally,t,{trust:1,respect:1},mem.id);
 f.history=f.history||[];f.history.push('Week '+state.week+': '+offer.ally.name+' made a personal approach to '+t.name+' on the studio’s behalf.');
 showToast(offer.ally.name+' has made the call. The conversation is open again.');save();render();return true;
}
function lotCampaignOpportunity(f){
 if(!f||!['marketing','scheduled'].includes(f.stage))return null;const stories=lotActiveStoriesForFilm(f).filter(s=>(s.heat||0)>=42);
 if(!stories.length)return null;
 const story=stories[0],people=story.participants.map(id=>talentById(id)).filter(Boolean),friendly=story.type==='friendship';
 return {story,people,friendly,tone:friendly?'good':story.intensity>=3?'bad':'warn',cost:.25,
  label:friendly?'Sell the chemistry':'Exploit the drama',
  text:friendly?'The campaign can lean into a relationship audiences may find charming. It buys some organic attention, but it also raises expectations around the pairing.':'The campaign can deliberately feed an existing Lot story into publicity. It will buy attention, but controversy and expectation pressure can hurt the release if the film does not deliver.'};
}
function lotCampaignAngleTransaction(f){
 const m=ensureMarketingState(f),opportunity=lotCampaignOpportunity(f),active=!!opportunity&&m.lotAngle==='lean'&&!m.lotAngleApplied;
 return {active,opportunity,cost:active?(opportunity.cost||0):0};
}
function lotCampaignAngleCost(f){return lotCampaignAngleTransaction(f).cost}
function lotApplyCampaignAngle(f){
 const m=ensureMarketingState(f),tx=lotCampaignAngleTransaction(f),o=tx.opportunity;if(!tx.active||!o)return null;
 const s=o.story,intensity=Math.max(1,s.intensity||1),before={buzz:m.buzz,sentiment:m.sentiment,expectations:m.expectations};
 if(o.friendly){m.buzz+=3+Math.min(3,intensity);m.sentiment+=2;m.expectations+=2+Math.min(2,intensity)}
 else{m.buzz+=4+Math.min(4,intensity);m.sentiment-=Math.min(3,Math.max(1,intensity-1));m.expectations+=2+Math.min(4,intensity)}
 m.lotAngleApplied={week:state.week,storyId:s.id,friendly:o.friendly,before,after:{buzz:m.buzz,sentiment:m.sentiment,expectations:m.expectations}};
 s.heat=clamp((s.heat||50)+8,0,100);s.lastWeek=state.week;
 lotStoryChapter(s,{type:'publicity',headline:o.friendly?'The campaign leans into the chemistry':'The studio turns Lot drama into publicity',detail:o.friendly?'The film campaign has started using the relationship as part of its public sell.':'The campaign has made a conscious choice to amplify a volatile off-camera story for attention.',filmId:f.id,intensity:2});
 f.history=f.history||[];f.history.push('Week '+state.week+': campaign used The Lot story "'+s.headline+'" as a publicity angle.');
 return {story:s,cost:tx.cost,buzz:m.buzz-before.buzz,sentiment:m.sentiment-before.sentiment,expectations:m.expectations-before.expectations};
}
function lotMediationOffer(f,storyId=null){
 if(!f||!['development','production'].includes(f.stage))return null;
 const stories=lotActiveStoriesForFilm(f).filter(s=>s.type!=='friendship'),story=storyId?stories.find(s=>s.id===storyId):stories[0];if(!story)return null;
 const attempts=(f.lotMediations?.[story.id]||[]),last=attempts.at(-1)||null,cooldownUntil=last?last.week+3:0;
 const cost=+(.14+(story.intensity||2)*.055+(f.stage==='production'?.04:0)).toFixed(2);
 return {story,cost,attempts,last,available:attempts.length<2&&state.week>=cooldownUntil,cooldownUntil,exhausted:attempts.length>=2};
}
function mediateLotStory(f,storyId){
 const offer=lotMediationOffer(f,storyId);if(!offer)return showToast('There is no active Lot conflict to mediate on this film.');
 if(!offer.available){
  if(offer.exhausted)return showToast('This studio has already used its mediation leverage on this conflict.');
  return showToast('Mediation can be attempted again in Week '+offer.cooldownUntil+'.');
 }
 if(!spend(offer.cost))return false;
 const story=offer.story,aId=story.participants[0],bId=story.participants[1],a=talentById(aId),b=talentById(bId);if(!a||!b)return false;
 const pa=ensureLotProfile(a),pb=ensureLotProfile(b),attemptNo=offer.attempts.length+1;
 const temperament=((pa.traits.professionalism+pb.traits.professionalism+pa.traits.loyalty+pb.traits.loyalty)-(pa.traits.volatility+pb.traits.volatility+pa.traits.grudge+pb.traits.grudge))/400;
 const studioRel=((a.relationship||0)+(b.relationship||0))/2,chance=clamp(.57+temperament*.18+studioRel*.002-(story.intensity||2)*.045,.30,.82);
 const rr=makeRng(hash((state.seed||1)+'|lot-mediate|'+f.id+'|'+story.id+'|'+attemptNo)),roll=rr();
 let outcome,headline,detail,delta,heatDelta,impact;const actorPair=f.directorId!==a.id&&f.directorId!==b.id;
 if(roll<chance){
  outcome='cooled';headline=a.name+' and '+b.name+' agree to cool it';detail=state.studio.name+' put both sides in a room and, against the odds, everybody left with the same number of lawyers they arrived with.';delta={affection:4,trust:6,tension:-20,grudge:-10};heatDelta=-22;impact={morale:3,stability:2,chemistry:actorPair?1:0};
 }else if(roll<chance+.23){
  outcome='contained';headline=a.name+' and '+b.name+' agree to professional distance';detail='Nobody has reconciled, but schedules, trailers and publicity are being separated enough to keep the film moving.';delta={trust:2,tension:-9,grudge:-3};heatDelta=-9;impact={morale:1,stability:1};
 }else{
  outcome='backfired';headline='Mediation makes '+a.name+' vs '+b.name+' worse';detail='The meeting intended to clear the air instead established, with unusual precision, several new reasons for resentment.';delta={trust:-5,tension:11,grudge:7};heatDelta=10;impact={morale:-2,stability:-2,chemistry:actorPair?-1:0};
 }
 const mem=lotRemember({type:'mediation',participants:[a.id,b.id],headline,detail,intensity:outcome==='backfired'?2:1,publicEvent:false,filmId:f.id,storyId:story.id});
 lotAdjustRelationship(a,b,delta,mem.id);story.heat=clamp((story.heat||55)+heatDelta,0,100);story.lastWeek=state.week;story.memoryIds=story.memoryIds||[];story.memoryIds.unshift(mem.id);
 f.lotMediations=f.lotMediations||{};(f.lotMediations[story.id] ||= []).push({week:state.week,outcome,cost:offer.cost,headline,detail});
 if(f.stage==='production'&&typeof applyProductionImpact==='function')applyProductionImpact(f,{...impact,note:'The Lot mediation: '+headline});
 f.history=f.history||[];f.history.push('Week '+state.week+': The Lot mediation — '+headline);
 if(typeof addNews==='function')addNews(state,state.studio.name+' intervened in the '+a.name+' / '+b.name+' conflict around '+f.title+'. '+headline+'.','The Lot');
 showToast(outcome==='cooled'?'Mediation worked. The conflict has cooled.':outcome==='contained'?'The conflict is contained, not resolved.':'Mediation backfired. The relationship is worse.');
 save();render();return true;
}

function lotApplyIncidentConsequences(a,b,type,intensity,headline){
 if(typeof playerFilms!=='function'||typeof applyProductionImpact!=='function')return;
 const positive=type==='friendship';
 playerFilms().filter(f=>f.stage==='production'&&lotAttachedTalentIds(f).includes(a.id)&&lotAttachedTalentIds(f).includes(b.id)).forEach(f=>{
  const actorPair=f.directorId!==a.id&&f.directorId!==b.id;
  const impact=positive
   ?{chemistry:actorPair?Math.min(3,intensity):1,performances:intensity>=3?1:0,stability:1,morale:Math.min(3,intensity)}
   :{chemistry:actorPair?-Math.min(4,intensity):-1,performances:-Math.min(2,Math.ceil(intensity/2)),stability:-Math.min(3,intensity),morale:-Math.min(4,intensity)};
  applyProductionImpact(f,{...impact,note:`The Lot: ${headline}`});
  f.lotConsequences=f.lotConsequences||[];f.lotConsequences.unshift({week:state.week,headline,type,intensity,participants:[a.id,b.id],impact});f.lotConsequences=f.lotConsequences.slice(0,12);
  f.history=f.history||[];f.history.push(`Week ${state.week}: The Lot — ${headline}`);
 });
}
function lotFilmJournalLine(f){
 const ids=new Set(lotAttachedTalentIds(f)),lot=ensureLotState();
 const stories=lot.stories.filter(s=>s.active&&s.participants?.length>=2&&s.participants.every(id=>ids.has(id))).sort((a,b)=>(b.heat||0)-(a.heat||0));
 const s=stories[0];if(!s)return null;
 const people=s.participants.map(id=>talentById(id)?.name).filter(Boolean).join(' and ');
 if(s.type==='friendship')return `The Lot cameras have picked up genuine off-camera warmth between ${people}; on set, that ease is starting to show in the way they work together.`;
 return `The off-camera story between ${people} has followed the production onto set. The unit is still working, but the tension is now part of the film's day-to-day atmosphere.`;
}

function lotRemember({type='moment',participants=[],headline,detail='',intensity=1,publicEvent=false,filmId=null,storyId=null,week=null,day=null}){
 const eventWeek=week??state.week,eventDay=day??(typeof currentCalendarDay==='function'?currentCalendarDay():null),lot=ensureLotState(),id='LM'+(lot.memories.length+1)+'W'+eventWeek,m={id,week:eventWeek,day:eventDay,type,participants:[...participants],headline,detail,intensity,public:publicEvent,filmId,storyId};
 lot.memories.unshift(m);lot.memories=lot.memories.slice(0,240);
 participants.forEach(tid=>{const t=talentById(tid),p=t?ensureLotProfile(t):null;if(p){p.memories.unshift(id);p.memories=p.memories.slice(0,18)}});
 return m;
}
function lotStory({type='feud',participants=[],headline,summary,detail,intensity=2,durability=20,publicEvent=true,memoryId=null,filmId=null,resurfacedFrom=null,chapterType='incident'}){
 const lot=ensureLotState(),pair=participants.slice().sort().join('|');
 let story=lot.stories.find(x=>x.active&&x.type===type&&x.pair===pair);
 if(!story){
  story={id:'LS'+(lot.stories.length+1),type,pair,participants:[...participants],headline,summary,detail,intensity,durability,heat:55+intensity*10,active:true,phase:'active',startedWeek:state.week,lastWeek:state.week,lastChapterWeek:state.week,memoryIds:[],chapters:[],timesResurfaced:resurfacedFrom?1:0,resurfacedFrom:resurfacedFrom||null,filmIds:filmId?[filmId]:[]};lot.stories.unshift(story);
 }else{
  story.headline=headline;story.summary=summary;story.detail=detail;story.heat=clamp((story.heat||0)+12,0,100);story.lastWeek=state.week;story.phase='active';story.intensity=Math.max(story.intensity||1,intensity);
  if(filmId&&!story.filmIds?.includes(filmId)){story.filmIds=story.filmIds||[];story.filmIds.unshift(filmId)}
 }
 if(memoryId){story.memoryIds=story.memoryIds||[];story.memoryIds.unshift(memoryId)}
 lotStoryChapter(story,{type:chapterType,headline,detail,filmId,memoryId,intensity});
 const hist=participants.length>=2?lotPairHistory(participants[0],participants[1]):null;if(hist&&!hist.storyIds.includes(story.id))hist.storyIds.unshift(story.id);
 participants.forEach(tid=>{const t=talentById(tid),p=t?ensureLotProfile(t):null;if(p&&!p.storyIds.includes(story.id))p.storyIds.unshift(story.id)});
 if(typeof upsertCareerThread==='function')upsertCareerThread({key:'lot:'+story.id,type:'memory',tone:intensity>=4?'bad':intensity>=3?'warn':type==='friendship'?'good':'blue',priority:58+intensity*8,title:headline,summary,detail,progress:resurfacedFrom?'THE LOT · RESURFACED':'THE LOT'});
 if(publicEvent&&typeof pushDeskItem==='function'&&intensity>=2)pushDeskItem({templateId:'lot-story',repeatKey:'lot:'+story.id+':'+state.week,family:'lot',type:intensity>=3?'gossip':'industry',source:'The Lot',urgency:intensity>=4?'urgent':'normal',requiresAction:false,headline,body:summary+(detail?' '+detail:''),choices:[],resolved:true,read:false,expanded:false});
 return story;
}
function lotEligiblePairs(){
 const ids=[...new Set(playerFilms().filter(f=>!['complete','shelved'].includes(f.stage)).flatMap(f=>lotAttachedTalentIds(f)).filter(Boolean))];
 const out=[];for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){const a=talentById(ids[i]),b=talentById(ids[j]);if(a&&b&&!a.retired&&!b.retired)out.push([a,b])}
 return out;
}

function lotIncidentTier(r){
 const x=r();return x<.20?'ordinary':x<.65?'hollywood':x<.96?'absurd':'legendary';
}
const LOT_INCIDENT_LIBRARY=[
 {id:'unlikely-double-act',tier:'ordinary',family:'friendship',tags:['humour','loyalty'],type:'friendship',build:(A,B)=>({headline:A+' and '+B+' are becoming an unlikely double act',summary:'The Lot cameras keep catching '+A+' and '+B+' together between work commitments, and an initially professional relationship is turning into a genuine friendship.',detail:'Nothing is on fire. For The Lot, this qualifies as suspiciously wholesome.',delta:{affection:14,trust:10,respect:6,tension:-8}})},
 {id:'public-backing',tier:'ordinary',family:'friendship',tags:['loyalty','professionalism'],type:'friendship',build:(A,B)=>({headline:A+' publicly backs '+B,summary:'A routine interview turned unexpectedly warm when '+A+' went out of their way to defend '+B+' against a dismissive question.',detail:'The gesture landed because it did not sound like something a publicist had laminated first.',delta:{affection:10,trust:8,respect:12}})},
 {id:'rehearsal-alliance',tier:'ordinary',family:'friendship',tags:['professionalism','loyalty'],type:'friendship',build:(A,B)=>({headline:A+' and '+B+' have quietly become rehearsal allies',summary:'The pair have started arriving early to work through material together without assistants, cameras or an official studio initiative.',detail:'The production has discovered the unnerving possibility that two adults may simply be getting on with their jobs.',delta:{affection:9,trust:11,respect:10,tension:-6}})},
 {id:'lunch-table',tier:'ordinary',family:'friendship',tags:['humour','loyalty'],type:'friendship',build:(A,B)=>({headline:A+' and '+B+' have claimed the same lunch table',summary:'A recurring lunch routine has become one of those tiny set rituals everybody else notices before the people involved do.',detail:'Assistants are now treating the table as reserved despite nobody ever reserving it.',delta:{affection:11,trust:7,respect:4,tension:-5}})},
 {id:'crossword-rivalry',tier:'ordinary',family:'friendly-rivalry',tags:['competitive','humour'],type:'friendship',build:(A,B)=>({headline:A+' and '+B+' have developed a completely unnecessary daily competition',summary:'What began as a harmless between-takes puzzle has become a running contest with scores, disputed rules and witnesses.',detail:'Nobody has admitted keeping a league table. There is absolutely a league table.',delta:{affection:8,respect:8,tension:4}})},
 {id:'wrap-gift-kindness',tier:'ordinary',family:'friendship',tags:['loyalty','professionalism'],type:'friendship',build:(A,B)=>({headline:A+' surprises '+B+' with a genuinely thoughtful gesture',summary:'A low-key gift tied to the current production has softened what had been a strictly professional relationship.',detail:'The Lot attempted to locate an angle. For once, there may not be one.',delta:{affection:12,trust:9,respect:7,tension:-4}})},
 {id:'creative-defence',tier:'ordinary',family:'professional-respect',tags:['professionalism','competitive'],type:'friendship',build:(A,B)=>({headline:A+' goes to bat for '+B+' in a creative meeting',summary:A+' backed '+B+' during a difficult production discussion, turning a routine disagreement into a small but meaningful show of professional trust.',detail:'Nobody hugged. This is still Hollywood.',delta:{affection:6,trust:11,respect:13,tension:-3}})},

 {id:'billing-war',tier:'hollywood',family:'status',tags:['ego','competitive'],build:(A,B)=>({headline:A+' and '+B+' are fighting over billing',summary:'A disagreement about whose name appears first has escalated far beyond the size of the typography involved.',detail:A+"'s representatives call it contractual clarity. "+B+"'s camp calls that description creative.",delta:{affection:-14,tension:24,grudge:10,respect:-4}})},
 {id:'hot-mic',tier:'hollywood',family:'press',tags:['volatile','attention'],build:(A,B)=>({headline:'A hot mic has made '+A+' vs '+B+' very public',summary:'The Lot captured '+A+' making a cutting remark about '+B+"'s working methods after both apparently believed the cameras had stopped.",detail:'They had not.',delta:{affection:-16,trust:-18,tension:28,grudge:15}})},
 {id:'trailer-size',tier:'hollywood',family:'status',tags:['ego','competitive'],build:(A,B)=>({headline:A+' and '+B+' are measuring trailers now',summary:'A routine facilities request has become a dispute about why one vanity trailer appears to be several feet longer than the other.',detail:'Production insists the difference is architectural. Nobody involved believes production.',delta:{affection:-10,tension:21,grudge:9}})},
 {id:'call-sheet-time',tier:'hollywood',family:'professionalism',tags:['ego','volatile'],build:(A,B)=>({headline:A+' and '+B+' have turned call times into a status symbol',summary:'A disagreement over who is expected on set first has become a proxy war about seniority, respect and whose time is apparently more expensive.',detail:'The call sheet now has more diplomacy in it than scheduling.',delta:{affection:-11,respect:-5,tension:23,grudge:8}})},
 {id:'junket-seating',tier:'hollywood',family:'press',tags:['attention','ego'],build:(A,B)=>({headline:'The '+A+'–'+B+' press-junket seating plan has become a negotiation',summary:'Publicists are rearranging chairs, interview pairings and camera positions after both camps objected to the original setup.',detail:'Three seats have moved. Twelve emails have been marked urgent.',delta:{affection:-9,tension:19,grudge:7}})},
 {id:'red-carpet-look',tier:'hollywood',family:'fashion',tags:['attention','competitive'],build:(A,B)=>({headline:A+' and '+B+' have arrived at the same red carpet with suspiciously similar ideas',summary:'Two styling teams independently landed on near-identical looks and neither side is accepting the word coincidence.',detail:'The clothes are fine. The group chats are not.',delta:{affection:-7,tension:18,grudge:6}})},
 {id:'quote-omission',tier:'hollywood',family:'press',tags:['ego','grudge'],build:(A,B)=>({headline:A+' noticed exactly who was missing from '+B+"'s interview answer",summary:'A promotional interview praised almost everybody involved in the film except one conspicuous colleague, and that omission has now become the story.',detail:'Publicists are insisting the answer was edited for time, which has not improved matters.',delta:{affection:-12,trust:-8,tension:22,grudge:13}})},
 {id:'stunt-credit',tier:'hollywood',family:'credit',tags:['competitive','ego'],build:(A,B)=>({headline:A+' and '+B+' disagree over who really sold the big set piece',summary:'Both camps are quietly claiming creative ownership of the same action sequence after early footage drew attention.',detail:'The stunt team, who actually performed the stunt, has elected not to participate in this conversation.',delta:{affection:-10,respect:-4,tension:20,grudge:8}})},
 {id:'awards-spotlight',tier:'hollywood',family:'awards',tags:['competitive','attention'],build:(A,B)=>({headline:A+' and '+B+' are already negotiating the awards-season spotlight',summary:'A perfectly ordinary campaign discussion has become a careful argument about screenings, profiles and whose face appears most prominently in the serious magazines.',detail:'Nobody has used the word campaign. Everybody is campaigning.',delta:{affection:-8,tension:21,grudge:10}})},
 {id:'social-unfollow',tier:'hollywood',family:'press',tags:['attention','grudge'],build:(A,B)=>({headline:'The internet has noticed that '+A+' and '+B+' no longer follow each other',summary:'An online change that may have meant absolutely nothing has now been promoted into evidence by several hours of entertainment coverage.',detail:'Both representatives have declined to clarify, thereby guaranteeing another day of coverage.',delta:{affection:-8,trust:-6,tension:17,grudge:8}})},

 {id:'parking-war',tier:'absurd',family:'territory',tags:['ego','volatile'],cooldown:156,build:(A,B)=>({headline:A+' has declared war over a parking space',summary:'A disagreement over one reserved parking bay has somehow become a full production grievance between '+A+' and '+B+'.',detail:'By lunchtime, somebody had replaced the nameplate. By dinner, there were traffic cones with legal representation.',delta:{affection:-18,tension:30,grudge:22}})},
 {id:'trailer-cold-war',tier:'absurd',family:'territory',tags:['eccentric','grudge'],cooldown:104,build:(A,B)=>({headline:A+' and '+B+' are in a trailer cold war',summary:'The two have stopped communicating directly and are now using assistants to make increasingly petty complaints about noise, furniture and adjacent trailers.',detail:'The current dispute concerns a decorative cactus that may or may not be aggressively positioned.',delta:{affection:-16,trust:-12,tension:34,grudge:20}})},
 {id:'restaurant-ban',tier:'absurd',family:'social',tags:['ego','grudge'],cooldown:104,build:(A,B)=>({headline:A+' has apparently banned '+B+' from a favourite restaurant',summary:'Nobody is entirely clear how a film-industry disagreement resulted in one star persuading a restaurant to refuse the other a table, but The Lot has the receipts.',detail:'The restaurant denies operating an official blacklist. It has also stopped answering questions.',delta:{affection:-20,tension:31,grudge:28}})},
 {id:'coffee-machine-custody',tier:'absurd',family:'property',tags:['eccentric','competitive'],build:(A,B)=>({headline:A+' and '+B+' are now disputing custody of a coffee machine',summary:'A production espresso machine purchased for a shared rehearsal space has somehow become a contested asset.',detail:'The machine has been moved twice and is currently under the protection of an assistant who did not apply for this responsibility.',delta:{affection:-13,tension:27,grudge:15}})},
 {id:'chair-height',tier:'absurd',family:'status',tags:['ego','eccentric'],build:(A,B)=>({headline:'A chair has become the latest front in '+A+' vs '+B,summary:'One customised director-style chair was adjusted several inches higher than the other and the symbolism has not gone unnoticed.',detail:'Facilities has been asked to produce chairs of exactly equal authority.',delta:{affection:-12,tension:28,grudge:17}})},
 {id:'plus-one-summit',tier:'absurd',family:'premiere',tags:['attention','ego'],build:(A,B)=>({headline:A+' and '+B+' have turned a premiere guest list into a summit',summary:'A disagreement over plus-ones, arrival order and who sits where has expanded into a document with revisions.',detail:'The seating plan now has version control.',delta:{affection:-11,trust:-7,tension:29,grudge:13}})},
 {id:'trainer-poaching',tier:'absurd',family:'staff',tags:['competitive','ego'],build:(A,B)=>({headline:A+' has accused '+B+' of poaching a personal trainer',summary:'A scheduling overlap with the same trainer has been interpreted as an aggressive talent acquisition strategy.',detail:'The trainer would reportedly like everyone to remember that this is exercise.',delta:{affection:-15,tension:30,grudge:20}})},
 {id:'wrap-gift-arms-race',tier:'absurd',family:'status',tags:['competitive','attention'],build:(A,B)=>({headline:A+' and '+B+' have started a wrap-gift arms race',summary:'One generous crew gift was answered by something more expensive, which was answered again, and the production is now trapped in escalating gratitude.',detail:'Several crew members are openly hoping the feud survives until wrap.',delta:{affection:-5,respect:4,tension:24,grudge:8}})},
 {id:'golf-cart-border',tier:'absurd',family:'territory',tags:['eccentric','competitive'],build:(A,B)=>({headline:A+' and '+B+' are fighting over golf-cart jurisdiction',summary:'Two production golf carts have acquired unofficial territories, preferred routes and apparently a border.',detail:'A laminated map has appeared. Nobody will admit making it.',delta:{affection:-12,tension:28,grudge:17}})},
 {id:'craft-menu-veto',tier:'absurd',family:'food',tags:['eccentric','ego'],build:(A,B)=>({headline:A+' and '+B+' have split the craft-services menu into rival camps',summary:'A disagreement about catering has escalated into separate menus, separate tables and suspiciously ideological snack choices.',detail:'The hummus has become politically complicated.',delta:{affection:-11,tension:26,grudge:15}})},
 {id:'quiet-zone',tier:'absurd',family:'territory',tags:['eccentric','volatile'],build:(A,B)=>({headline:A+' has established a quiet zone directly beside '+B,summary:'Handwritten silence notices appeared around one work area after complaints about noise from the neighbouring camp.',detail:'Someone has since added smaller signs requesting quiet around the quiet signs.',delta:{affection:-14,trust:-7,tension:31,grudge:18}})},
 {id:'robe-incident',tier:'absurd',family:'fashion',tags:['attention','eccentric'],build:(A,B)=>({headline:A+' and '+B+' have both claimed the same custom robe',summary:'Two nearly identical personalised robes arrived on set and an embroidery error has made ownership unexpectedly philosophical.',detail:'Wardrobe has offered replacements. This reasonable solution was rejected immediately.',delta:{affection:-9,tension:25,grudge:12}})},
 {id:'thermostat-treaty',tier:'absurd',family:'territory',tags:['volatile','eccentric'],build:(A,B)=>({headline:A+' and '+B+' have negotiated a thermostat treaty',summary:'A temperature disagreement between adjoining spaces has produced taped controls, timed access and a written compromise.',detail:'The agreement lasted forty-three minutes.',delta:{affection:-10,tension:29,grudge:14}})},
 {id:'playlist-schism',tier:'absurd',family:'music',tags:['eccentric','competitive'],build:(A,B)=>({headline:A+' and '+B+' have divided the set over a playlist',summary:'Competing music selections between setups have turned into factional warfare involving crew votes and unauthorised speaker relocations.',detail:'The assistant directors have banned democracy from playback decisions.',delta:{affection:-8,tension:27,grudge:11}})},

 {id:'doggate',tier:'legendary',family:'pets',tags:['eccentric','grudge'],unique:true,type:'legendary-feud',build:(A,B,r)=>{const dogs=['Winston','Mabel','Bowie','Pickle','Stanley','Dolly'],dog=dogs[Math.floor(r()*dogs.length)];return {headline:'DOGGATE: '+A+' vs '+B,summary:A+' has accused '+B+' of effectively kidnapping their dog, '+dog+', after a party. '+B+' denies this and maintains that '+dog+' made an independent choice.',detail:'The dog is reportedly happy. The humans are absolutely not. Representatives for both sides have asked The Lot to stop calling it Doggate, guaranteeing that everybody will now call it Doggate.',delta:{affection:-35,trust:-35,tension:48,grudge:55}}}},
 {id:'chairgate',tier:'legendary',family:'property',tags:['eccentric','grudge'],unique:true,type:'legendary-feud',build:(A,B)=>({headline:'CHAIRGATE: nobody will explain how '+A+"'s chair reached the roof",summary:'A personalised set chair belonging to '+A+' has appeared on top of a soundstage after a week of increasingly petty exchanges with '+B+'.',detail:B+' denies involvement. A photograph of the chair at sunrise is already being printed on crew T-shirts.',delta:{affection:-28,trust:-30,tension:45,grudge:46}})},
 {id:'cakegate',tier:'legendary',family:'social',tags:['eccentric','attention'],unique:true,type:'legendary-feud',build:(A,B)=>({headline:'CAKEGATE has consumed the production',summary:'A celebratory cake intended to resemble '+A+' has arrived looking unmistakably more like '+B+', and what should have been a five-minute joke has become a full publicity crisis.',detail:'The bakery has apologised. Nobody asked the bakery to apologise.',delta:{affection:-22,trust:-18,tension:40,grudge:38}})},
 {id:'bungalow-tape-line',tier:'legendary',family:'territory',tags:['ego','competitive'],unique:true,type:'legendary-feud',build:(A,B)=>({headline:A+' and '+B+' have physically divided a studio bungalow',summary:'A double-booking over a prized bungalow ended with coloured tape running through the middle of the room and both camps refusing to surrender their half.',detail:'There are now two coffee tables, two door signs and one deeply tired facilities manager.',delta:{affection:-30,trust:-24,tension:47,grudge:44}})},
 {id:'ice-sculpture-war',tier:'legendary',family:'premiere',tags:['attention','competitive'],unique:true,type:'legendary-feud',build:(A,B)=>({headline:'The '+A+'–'+B+' ice-sculpture war has reached the premiere',summary:'A publicity event somehow ended with competing ice sculptures of the two stars, each commissioned after the other side learned the first one existed.',detail:'One sculpture is taller. This fact has been independently verified and should not matter.',delta:{affection:-24,tension:43,grudge:41}})},
 {id:'limo-standoff',tier:'legendary',family:'premiere',tags:['ego','attention'],unique:true,type:'legendary-feud',build:(A,B)=>({headline:A+' and '+B+' have created a red-carpet limousine standoff',summary:'Two cars arrived simultaneously and neither camp would allow their client to step out second, temporarily freezing an entire premiere arrival line.',detail:'For eleven minutes, Hollywood was defeated by two closed car doors.',delta:{affection:-25,trust:-20,tension:44,grudge:39}})}
];
function lotIncidentContext(a,b){
 const ids=[a.id,b.id],film=playerFilms().find(f=>!['complete','shelved'].includes(f.stage)&&ids.every(id=>lotAttachedTalentIds(f).includes(id)))||null;
 return {film};
}
function lotIncidentTraitWeight(def,a,b){
 const pa=ensureLotProfile(a),pb=ensureLotProfile(b),map={ego:'ego',volatile:'volatility',eccentric:'eccentricity',attention:'attention',competitive:'competitiveness',loyalty:'loyalty',professionalism:'professionalism',humour:'humour',grudge:'grudge'};
 const vals=(def.tags||[]).map(tag=>((pa.traits[map[tag]||tag]||50)+(pb.traits[map[tag]||tag]||50))/2);
 return vals.length?.65+vals.reduce((x,y)=>x+y,0)/vals.length/100:1;
}
const LOT_FAMILY_SETTING={
 friendship:'between-takes life','friendly-rivalry':'between-takes life','professional-respect':'creative work',
 status:'status politics',press:'press circuit',professionalism:'working practices',fashion:'public appearance',credit:'creative credit',awards:'awards campaign',
 territory:'studio facilities',social:'social life',property:'shared property',premiere:'premiere logistics',staff:'entourage',food:'craft services',music:'set atmosphere',pets:'personal life'
};
function lotIncidentVarietyMeta(def,built=null,ctx=null){
 const family=def?.family||'general',type=built?.type||def?.type||'feud';
 let shape=type==='friendship'?'alliance':'status contest';
 if(['press','fashion','awards'].includes(family))shape='publicity distortion';
 else if(['professionalism','credit','professional-respect'].includes(family))shape='professional disagreement';
 else if(['property','territory','staff','food','music','pets'].includes(family))shape='petty escalation';
 else if(family==='social'||family==='premiere')shape='social escalation';
 if(def?.tier==='legendary')shape='legendary escalation';
 return {id:def?.id||'',family,tier:def?.tier||'',setting:LOT_FAMILY_SETTING[family]||'Hollywood life',shape,topic:String(def?.id||family).replace(/-/g,' '),filmId:ctx?.film?.id||null};
}
function lotIncidentVarietyFromEntry(entry){
 if(!entry)return null;
 const def=LOT_INCIDENT_LIBRARY.find(x=>x.id===entry.id);
 return def?lotIncidentVarietyMeta(def,null,{film:entry.filmId?{id:entry.filmId}:null}):{id:entry.id||'',family:entry.family||'general',tier:entry.tier||'',setting:LOT_FAMILY_SETTING[entry.family]||'Hollywood life',shape:'story beat',topic:String(entry.id||entry.family||'incident').replace(/-/g,' '),filmId:entry.filmId||null};
}
function lotVarietyRecent(limit=16){
 const lot=ensureLotState(),rows=(lot.incidentHistory||[]).slice(0,limit).map(x=>x.variety||lotIncidentVarietyFromEntry(x)).filter(Boolean);
 lot.variety.recent=rows.slice(0,24);return rows;
}
function lotNoveltyBrief(a=null,b=null,tier=null){
 const recent=lotVarietyRecent(18),pair=a&&b?lotPairKey(a,b):null,pairRows=pair?ensureLotState().incidentHistory.filter(x=>x.pair===pair).slice(0,8):[];
 const unique=x=>[...new Set(x.filter(Boolean))];
 return {
  desiredTier:tier||null,
  avoidIncidentIds:unique(recent.slice(0,12).map(x=>x.id)),
  avoidFamilies:unique(recent.slice(0,8).map(x=>x.family)),
  avoidSettings:unique(recent.slice(0,7).map(x=>x.setting)),
  avoidShapes:unique(recent.slice(0,6).map(x=>x.shape)),
  avoidTopics:unique(recent.slice(0,12).map(x=>x.topic)),
  pairHistory:unique(pairRows.map(x=>x.id)),
  instruction:'Invent a materially different incident. Do not merely rename a recent object, location or feud while preserving the same joke structure.'
 };
}
function lotIncidentNarrativeSeed(a,b,tier,def,built,ctx){
 const rel=lotRelationship(a,b),variety=lotIncidentVarietyMeta(def,built,ctx);
 return {
  tier,family:def.family,tags:[...(def.tags||[])],setting:variety.setting,shape:variety.shape,topic:variety.topic,
  participants:[a.id,b.id],filmId:ctx?.film?.id||null,
  relationshipBefore:{affection:rel.affection,respect:rel.respect,trust:rel.trust,tension:rel.tension,grudge:rel.grudge},
  consequence:deep(built?.delta||{}),
  novelty:lotNoveltyBrief(a,b,tier)
 };
}
function lotChooseIncident(a,b,tier,r){
 const lot=ensureLotState(),hist=lotPairHistory(a,b),ctx=lotIncidentContext(a,b),now=state.week;
 const tierOrder={ordinary:['ordinary','hollywood'],hollywood:['hollywood','ordinary','absurd'],absurd:['absurd','hollywood','ordinary'],legendary:['legendary','absurd','hollywood']};
 const recentGlobal=lot.incidentHistory.filter(x=>now-x.week<52),recentFamilies=new Set(recentGlobal.slice(0,8).map(x=>x.family));
 const filmHistory=ctx.film?.lotIncidentHistory||[],filmFamilies=new Set(filmHistory.map(x=>x.family));
 function eligibleFor(def,strict=true){
  const uses=lot.incidentHistory.filter(x=>x.id===def.id),last=uses[0],cooldown=def.cooldown??(def.tier==='legendary'?99999:def.tier==='absurd'?78:def.tier==='hollywood'?39:26);
  if(def.unique&&uses.length)return false;
  if(last&&now-last.week<cooldown)return false;
  if((hist.incidents||[]).some(x=>x.id===def.id&&now-x.week<104))return false;
  if((hist.incidents||[]).some(x=>x.family===def.family&&now-x.week<26))return false;
  if(filmHistory.some(x=>x.id===def.id)||filmFamilies.has(def.family))return false;
  if(strict){
   const familyRecent=lot.incidentHistory.find(x=>x.family===def.family);
   if(familyRecent&&now-familyRecent.week<10)return false;
  }
  return true;
 }
 let pool=[];
 for(const candidateTier of (tierOrder[tier]||[tier])){
  const strict=LOT_INCIDENT_LIBRARY.filter(x=>x.tier===candidateTier&&eligibleFor(x,true));
  if(strict.length){pool=strict;break}
 }
 if(!pool.length){
  for(const candidateTier of (tierOrder[tier]||[tier])){
   const relaxed=LOT_INCIDENT_LIBRARY.filter(x=>x.tier===candidateTier&&eligibleFor(x,false));
   if(relaxed.length){pool=relaxed;break}
  }
 }
 if(!pool.length)return {def:null,ctx};
 const recentMeta=lotVarietyRecent(10);
 const weighted=pool.map(def=>{
  const uses=lot.incidentHistory.filter(x=>x.id===def.id),ever=uses.length,lastAge=uses[0]?now-uses[0].week:999,meta=lotIncidentVarietyMeta(def,null,ctx);
  const novelty=ever===0?3.15:ever===1?1.30:0.60;
  const ageBoost=clamp(lastAge/104,.8,1.8);
  const familyPenalty=recentFamilies.has(def.family)?.52:1;
  const settingPenalty=recentMeta.slice(0,5).some(x=>x.setting===meta.setting)?.62:1;
  const shapePenalty=recentMeta.slice(0,4).some(x=>x.shape===meta.shape)?.72:1;
  const topicPenalty=recentMeta.slice(0,10).some(x=>x.topic===meta.topic)?.35:1;
  return {def,w:Math.max(.05,(def.weight||1)*lotIncidentTraitWeight(def,a,b)*novelty*ageBoost*familyPenalty*settingPenalty*shapePenalty*topicPenalty)};
 });
 let total=weighted.reduce((s,x)=>s+x.w,0),roll=r()*total,chosen=weighted[0]?.def||null;
 for(const x of weighted){roll-=x.w;if(roll<=0){chosen=x.def;break}}
 return {def:chosen,ctx};
}
function lotApplyIncident(a,b,tier,r){
 const A=lotTalentName(a),B=lotTalentName(b),rel=lotRelationship(a,b),choice=lotChooseIncident(a,b,tier,r),def=choice.def,ctx=choice.ctx;
 if(!def)return null;
 const built=def.build(A,B,r,ctx)||{},type=built.type||def.type||(tier==='legendary'?'legendary-feud':'feud'),intensity=built.intensity||def.intensity||(tier==='legendary'?4:tier==='absurd'?3:tier==='hollywood'?2:1);
 const headline=built.headline||A+' and '+B+' have become a Lot story',summary=built.summary||'',detail=built.detail||'',delta=built.delta||{},variety=lotIncidentVarietyMeta(def,built,ctx),narrativeSeed=lotIncidentNarrativeSeed(a,b,tier,def,built,ctx);
 const mem=lotRemember({type,participants:[a.id,b.id],headline,detail,intensity,publicEvent:intensity>=2});
 mem.incidentId=def.id;mem.incidentFamily=def.family;mem.incidentSeed=narrativeSeed;
 lotAdjustRelationship(a,b,delta,mem.id);
 const updated=lotRelationship(a,b);
 const story=lotStory({type,participants:[a.id,b.id],headline,summary,detail,intensity,durability:intensity>=4?90:intensity>=3?45:24,publicEvent:intensity>=2,memoryId:mem.id,filmId:ctx.film?.id||null});
 if(story){story.incidentId=def.id;story.incidentFamily=def.family;story.incidentSeed=narrativeSeed}
 const entry={id:def.id,family:def.family,tier,week:state.week,pair:lotPairKey(a,b),filmId:ctx.film?.id||null,headline,variety};
 const lot=ensureLotState(),hist=lotPairHistory(a,b);lot.incidentHistory.unshift(entry);lot.incidentHistory=lot.incidentHistory.slice(0,240);lot.variety.recent=lot.incidentHistory.slice(0,24).map(x=>x.variety||lotIncidentVarietyFromEntry(x)).filter(Boolean);hist.incidents.unshift(entry);hist.incidents=hist.incidents.slice(0,30);hist.lastIncidentWeek=state.week;
 if(ctx.film){ctx.film.lotIncidentHistory=ctx.film.lotIncidentHistory||[];ctx.film.lotIncidentHistory.unshift(entry);ctx.film.lotIncidentHistory=ctx.film.lotIncidentHistory.slice(0,12)}
 lotApplyIncidentConsequences(a,b,type,intensity,headline);
 return {headline,summary,detail,tier,intensity,incidentId:def.id,family:def.family,relationship:updated,variety,narrativeSeed};
}


function lotTalentCrisisRisk(t,f){
 const p=ensureLotProfile(t),hostile=lotActiveStoriesForFilm(f).filter(s=>s.type!=='friendship'&&s.participants?.includes(t.id)).sort((a,b)=>(b.heat||0)-(a.heat||0))[0];
 let risk=(p.traits.volatility||50)*.30+(p.traits.ego||50)*.14+(p.traits.grudge||50)*.10+(100-(p.traits.professionalism||50))*.24+(100-(p.traits.loyalty||50))*.14;
 if(hostile)risk+=Math.min(18,(hostile.intensity||2)*3+(hostile.heat||50)*.09);
 if((t.relationship||0)<0)risk+=Math.min(7,Math.abs(t.relationship||0)*.18);
 return {risk:clamp(risk,0,100),hostile};
}
function lotCrisisReplacementCandidate(f,role,departingId){
 const attached=new Set(lotAttachedTalentIds(f));
 const rows=(state.talent||[]).filter(t=>t.type==='Actor'&&!t.retired&&t.id!==departingId&&!attached.has(t.id)&&!talentUnavailableForFilm(t,f)).map(t=>{
  const fit=actorRoleFit(t,f,role.id),score=fit*.56+(t.reliability||60)*.24+(t.acting||60)*.15+(t.star||50)*.05;
  return {t,fit,score};
 }).filter(x=>x.fit>=42).sort((a,b)=>b.score-a.score||(a.t.fee||0)-(b.t.fee||0));
 return rows[0]||null;
}
function lotCrisisReason(t,f,riskInfo){
 const p=ensureLotProfile(t),story=riskInfo.hostile;
 if(story)return {id:'working-breakdown',headline:t.name+' says the current working arrangement on '+f.title+' is untenable',summary:'A live Lot conflict has crossed from off-camera noise into the production itself. '+t.name+"'s representatives want the studio to change the working arrangement before filming continues."};
 if((p.traits.volatility||0)>=72&&(p.traits.professionalism||100)<=58)return {id:'set-standoff',headline:t.name+' has reached a production standoff on '+f.title,summary:'A run of difficult working days has become a formal impasse between the production and '+t.name+"'s team. The film needs a decision, not another holding statement."};
 if((p.traits.ego||0)>=74)return {id:'role-dispute',headline:t.name+' is threatening to leave '+f.title+' over the shape of the role',summary:'A disagreement about the part has hardened into a real production problem. The studio can replace the performer, pause to repair the relationship, or reconfigure the role.'};
 return {id:'availability-collision',headline:t.name+"'s team says "+f.title+' cannot continue on the current schedule',summary:'A fictional scheduling collision inside The Lot has become serious enough that the existing plan no longer holds. The studio must decide how much of the film to protect.'};
}
function lotCreateTalentCrisis(f,t,riskInfo){
 ensureFilmRoles(f);const role=roleForTalent(f,t.id);if(!role)return null;
 const lot=ensureLotState(),reason=lotCrisisReason(t,f,riskInfo),replacement=lotCrisisReplacementCandidate(f,role,t.id);
 const crisis={id:'TC'+(lot.talentCrises.length+1)+'W'+state.week,filmId:f.id,talentId:t.id,roleId:role.id,week:state.week,status:'waiting',reasonId:reason.id,headline:reason.headline,summary:reason.summary,risk:Math.round(riskInfo.risk),replacementId:replacement?.t?.id||null,recastCost:replacement?+(contractOffers(f,replacement.t).flat*1.18).toFixed(2):null,pauseCost:+Math.max(.35,Math.min(1.6,(f.budget||20)*.018)).toFixed(2),rewriteCost:+Math.max(.35,Math.min(1.25,.35+(f.budget||20)*.009)).toFixed(2)};
 lot.talentCrises.unshift(crisis);lot.talentCrises=lot.talentCrises.slice(0,80);lot.lastTalentCrisisWeek=state.week;
 f.talentCrises=Array.isArray(f.talentCrises)?f.talentCrises:[];f.talentCrises.unshift(crisis);f.history=f.history||[];f.history.push('Week '+state.week+': Talent crisis — '+crisis.headline+'.');
 const choices=[];
 if(crisis.replacementId){const rep=talentById(crisis.replacementId);choices.push(['recast','Emergency recast · '+rep.name+' · '+money(crisis.recastCost)])}
 choices.push(['pause','Pause & repair · '+money(crisis.pauseCost)+' · +2 weeks']);
 choices.push(['rewrite','Reconfigure the role · '+money(crisis.rewriteCost)+' · +1 week']);
 if(typeof pushDeskItem==='function')pushDeskItem({templateId:'talent-crisis',repeatKey:'talent-crisis:'+crisis.id,family:'talent-crisis',type:'production',source:'The Lot',urgency:'urgent',requiresAction:true,headline:crisis.headline,body:crisis.summary,choices,filmId:f.id,talentId:t.id,crisisId:crisis.id});
 if(typeof upsertCareerThread==='function')upsertCareerThread({key:'talent-crisis:'+crisis.id,type:'production',tone:'bad',priority:94,filmId:f.id,talentId:t.id,title:crisis.headline,summary:crisis.summary,detail:'This is a simulation-owned production crisis. The studio response will change the film mechanically and remain in its history.',progress:'DECISION REQUIRED'});
 if(typeof addNews==='function')addNews(state,t.name+"'s team and "+state.studio.name+' have hit a production impasse on '+f.title+'. The studio is weighing how to keep the film moving.','The Lot');
 if(typeof applyPulseDelta==='function')applyPulseDelta(f,{volume:5,sentiment:-2,controversy:5,topic:'Production turmoil'},'Talent crisis on The Lot');
 if(typeof addSocialFeed==='function')addSocialFeed(f,'Production chatter spikes as the '+t.name+' situation on '+f.title+' becomes public.','bad');
 return crisis;
}
function lotMaybeTalentCrisis(){
 const lot=ensureLotState();if(state.week-(lot.lastTalentCrisisWeek||0)<24)return false;
 const films=playerFilms().filter(f=>f.stage==='production'&&!(f.talentCrises||[]).some(c=>c.status==='waiting'));
 const candidates=[];
 films.forEach(f=>lotAttachedTalentIds(f).map(talentById).filter(t=>t&&t.type==='Actor').forEach(t=>{const info=lotTalentCrisisRisk(t,f);if(info.risk>=58)candidates.push({f,t,info})}));
 if(!candidates.length)return false;
 candidates.sort((a,b)=>b.info.risk-a.info.risk);
 const top=candidates[0],r=makeRng(hash((state.seed||1)+'|talent-crisis|'+state.week+'|'+top.f.id+'|'+top.t.id)),chance=clamp(.012+(top.info.risk-58)*.0012,.012,.055);
 if(r()>chance)return false;
 return !!lotCreateTalentCrisis(top.f,top.t,top.info);
}
function lotResolveTalentCrisisDeskChoice(item,key){
 if(item?.templateId!=='talent-crisis')return null;
 const f=filmById(item.filmId),t=talentById(item.talentId),crisis=(f?.talentCrises||[]).find(c=>c.id===item.crisisId);
 if(!f||!t||!crisis||crisis.status!=='waiting')return false;
 const role=roleById(f,crisis.roleId);let outcome='';
 if(key==='recast'){
  const replacement=talentById(crisis.replacementId),candidate=replacement&&!talentUnavailableForFilm(replacement,f)?replacement:lotCrisisReplacementCandidate(f,role,t.id)?.t;
  if(!candidate){showToast('No credible emergency replacement is currently available. Choose another response.');return false}
  const cost=candidate.id===crisis.replacementId?crisis.recastCost:+(contractOffers(f,candidate).flat*1.18).toFixed(2);
  if(!applyProductionImpact(f,{cost,week:1,performances:-2,chemistry:-3,stability:-4,morale:-4,note:'Talent crisis: emergency recast after '+t.name+' left the film.'}))return false;
  f.crisisReleasedContracts=f.crisisReleasedContracts||[];if(f.contracts?.[t.id])f.crisisReleasedContracts.push({talentId:t.id,contract:deep(f.contracts[t.id]),week:state.week,reason:crisis.id});
  ensureFilmRoles(f);f.roleAssignments[role.id]=candidate.id;syncRoleAssignments(f);delete f.contracts[t.id];if(f.contractDrafts)delete f.contractDrafts[t.id];
  f.contracts[candidate.id]={id:'crisis-recast',label:'Emergency replacement',upfront:cost,backend:0,sequelOption:false,guaranteedReturn:false,franchiseTerm:'none',producerCredit:false,futureFee:null,futureBackend:0,talentId:candidate.id,baseFee:candidate.fee,acceptedWeek:state.week};
  candidate.busyUntil=Math.max(candidate.busyUntil||0,f.productionEnd+1);adjustTalentRelationship(t,-8,f.title+': left during production',f.id);adjustTalentRelationship(candidate,2,f.title+': stepped into an emergency recast',f.id);
  crisis.replacementId=candidate.id;crisis.recastCost=cost;crisis.departed=true;outcome=candidate.name+' replaces '+t.name+' as '+role.name+'. The film loses one week to the change and absorbs '+money(cost)+' in emergency casting cost.';
  if(typeof addNews==='function')addNews(state,candidate.name+' is replacing '+t.name+' on '+f.title+' after the production impasse.','Casting');
  if(typeof applyPulseDelta==='function')applyPulseDelta(f,{volume:5,sentiment:-2,controversy:4,topic:'Emergency recast'},'Emergency recast');
 }else if(key==='pause'){
  if(!applyProductionImpact(f,{cost:crisis.pauseCost,week:2,performances:1,stability:1,morale:-1,note:'Talent crisis: production paused to repair the working arrangement with '+t.name+'.'}))return false;
  adjustTalentRelationship(t,2,f.title+': studio paused to repair the working relationship',f.id);
  outcome=f.title+' pauses for two weeks while the studio resets the working plan with '+t.name+'. The performer remains in the film.';
  if(typeof addNews==='function')addNews(state,f.title+' has paused for two weeks to reset its working plan with '+t.name+'. The performer remains attached.','Trade Report');
  if(typeof applyPulseDelta==='function')applyPulseDelta(f,{volume:2,sentiment:1,controversy:-2,topic:'Production pause'},'Studio contains talent crisis');
 }else if(key==='rewrite'){
  if(!applyProductionImpact(f,{cost:crisis.rewriteCost,week:1,performances:-2,pacing:1,clarity:2,chemistry:-1,stability:-1,note:'Talent crisis: '+role.name+' was reconfigured to keep '+t.name+' in the film.'}))return false;
  crisis.roleReconfigured=true;outcome='The studio reconfigures '+role.name+' around the dispute. '+t.name+' stays, the film loses one week, and the finished performance carries some compromise risk.';
  if(typeof addNews==='function')addNews(state,f.title+' is reworking '+role.name+' after its production impasse with '+t.name+'. '+t.name+' remains in the film.','Trade Report');
  if(typeof applyPulseDelta==='function')applyPulseDelta(f,{volume:3,sentiment:0,controversy:-1,topic:'Role reworked'},'Studio reconfigures role');
 }else return false;
 crisis.status='resolved';crisis.resolutionChoice=key;crisis.resolvedWeek=state.week;crisis.outcome=outcome;f.history.push('Week '+state.week+': Talent crisis resolved — '+outcome);
 const master=ensureLotState().talentCrises.find(c=>c.id===crisis.id);if(master&&master!==crisis)Object.assign(master,crisis);
 if(typeof upsertCareerThread==='function')upsertCareerThread({key:'talent-crisis:'+crisis.id,type:'production',tone:key==='pause'?'warn':'bad',priority:86,filmId:f.id,talentId:t.id,title:crisis.headline,summary:outcome,detail:'The decision is settled, but the incident remains part of '+f.title+"'s production story until the film is finished.",progress:'RESOLVED · '+(key==='recast'?'EMERGENCY RECAST':key==='pause'?'PAUSE & REPAIR':'ROLE RECONFIGURED')});
 if(typeof addSocialFeed==='function')addSocialFeed(f,outcome,key==='pause'?'neutral':'warn');
 return outcome;
}
function lotResolveFilmCrisisThreads(f){
 (f?.talentCrises||[]).forEach(c=>{if(typeof resolveCareerThread==='function'&&c.status==='resolved')resolveCareerThread('talent-crisis:'+c.id,(c.outcome||'The production adapted.')+' The film is now complete, so the crisis moves into its permanent production history.')});
}

function lotRegisterFilmOutcome(f,profit=0){
 if(!f||f.lotFilmMemoryRecorded)return;const ids=lotAttachedTalentIds(f).filter(id=>talentById(id));if(ids.length<2){f.lotFilmMemoryRecorded=true;return}
 const actors=new Set([...(f.cast||[]),...(f.supportingCastIds||[]),f.supportingCastId].filter(Boolean)),m=f.metrics||{},lot=ensureLotState(),eventWeek=f.completeWeek||state.week;
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
  const a=talentById(ids[i]),b=talentById(ids[j]),hist=lotPairHistory(a,b),prior=hist.films[0]||null;
  const actorPair=actors.has(a.id)&&actors.has(b.id),score=Math.round(actorPair?((m.chemistry||65)*.62+(m.performances||65)*.38):((m.performances||65)*.58+(m.stability||65)*.42));
  let tone='neutral',delta={respect:3,trust:2,tension:-2},phrase='a solid shared credit';
  if(score>=82){tone='good';delta={affection:4,respect:9,trust:7,tension:-6,grudge:-3};phrase='a notably strong collaboration'}
  else if(score<=54){tone='bad';delta={affection:-3,respect:-3,trust:-7,tension:13,grudge:6};phrase='a difficult working experience'}
  const headline=prior?(a.name+' and '+b.name+' add another chapter with '+f.title):(a.name+' and '+b.name+' leave '+f.title+' with '+phrase);
  const detail=(prior?'Their previous shared credit was '+prior.title+'. ':'')+(tone==='good'?'The finished film strengthened the sense that this pairing works.':tone==='bad'?'The finished film leaves fresh friction attached to their working history.':'The film adds another ordinary professional reference point to the relationship.');
  const mem=lotRemember({type:'film-history',participants:[a.id,b.id],headline,detail,intensity:tone==='neutral'?1:2,publicEvent:false,filmId:f.id,week:eventWeek});
  lotAdjustRelationship(a,b,delta,mem.id,eventWeek);
  hist.films.unshift({filmId:f.id,title:f.title,week:eventWeek,owner:f.owner,score,tone,profit:+(profit||0).toFixed(2)});hist.films=hist.films.slice(0,12);hist.lastFilmWeek=eventWeek;hist.lastSharedFilmId=f.id;if(prior)hist.reunions=(hist.reunions||0)+1;
  const active=lot.stories.filter(s=>s.active&&s.pair===hist.key);active.forEach(s=>{lotStoryChapter(s,{type:'film-outcome',headline,detail,filmId:f.id,memoryId:mem.id,intensity:tone==='neutral'?1:2});s.lastWeek=state.week;if(tone==='good'&&s.type==='friendship')s.heat=clamp((s.heat||50)+8,0,100);if(tone==='bad'&&s.type!=='friendship')s.heat=clamp((s.heat||50)+10,0,100)});
 }
 f.lotFilmMemoryRecorded=true;
}
function lotRegisterAwardsOutcome(f,wins=[],nominations=[]){
 if(!f||(!wins.length&&!nominations.length))return;const season=wins[0]?.season||nominations[0]?.season||Math.floor(state.week/52),done=f.lotAwardsMemorySeasons||[];
 if(done.includes(season))return;
 const ids=lotAttachedTalentIds(f).filter(id=>talentById(id));if(ids.length<2)return;
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
  const a=talentById(ids[i]),b=talentById(ids[j]),hist=lotPairHistory(a,b),won=wins.length>0,headline=won?(f.title+' gives '+a.name+' and '+b.name+' another shared awards chapter'):(a.name+' and '+b.name+' share awards-season recognition for '+f.title);
  const detail=won?(wins.map(x=>x.label).join(', ')+' adds prestige to a collaboration already on both careers.'):(nominations.length+' nomination'+(nominations.length===1?'':'s')+' keep the film in the industry conversation.');
  const eventWeek=Math.max(f.completeWeek||1,season*52),mem=lotRemember({type:'awards-history',participants:[a.id,b.id],headline,detail,intensity:won?2:1,publicEvent:false,filmId:f.id,week:eventWeek});
  lotAdjustRelationship(a,b,won?{respect:Math.min(5,2+wins.length),trust:1}:{respect:1},mem.id,eventWeek);
  hist.awards.unshift({filmId:f.id,title:f.title,week:eventWeek,season,wins:wins.length,nominations:nominations.length});hist.awards=hist.awards.slice(0,10);
  ensureLotState().stories.filter(s=>s.active&&s.pair===hist.key).forEach(s=>lotStoryChapter(s,{type:'awards',headline,detail,filmId:f.id,memoryId:mem.id,intensity:won?2:1}));
 }
 f.lotAwardsMemorySeasons=[season,...done].slice(0,10);
}
function lotMaybeResurfacePairHistory(){
 playerFilms().filter(f=>['development','production'].includes(f.stage)).forEach(f=>{
  f.lotLongMemoryChecked=f.lotLongMemoryChecked||{};const ids=lotAttachedTalentIds(f);
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
   const a=talentById(ids[i]),b=talentById(ids[j]);if(!a||!b)continue;const key=lotPairKey(a,b);if(f.lotLongMemoryChecked[key])continue;f.lotLongMemoryChecked[key]=true;
   const hist=lotPairHistory(a,b),prior=hist.films.find(x=>x.filmId!==f.id),lot=ensureLotState(),archived=lot.stories.filter(s=>!s.active&&s.pair===key).sort((x,y)=>(y.resolvedWeek||y.lastWeek||0)-(x.resolvedWeek||x.lastWeek||0))[0];
   if(!prior&&!archived)continue;if(lot.stories.some(s=>s.active&&s.pair===key))continue;
   const rel=lotRelationship(a,b),positive=rel.affection>=72&&rel.trust>=64,negative=rel.grudge>=35||rel.tension>=55;if(!positive&&!negative&&!archived)continue;
   const oldType=archived?.type||null,type=negative?(oldType==='legendary-feud'?'legendary-feud':'feud'):'friendship',intensity=negative?Math.max(2,Math.min(4,archived?.intensity||2)):1;
   const headline=negative?('Old wounds between '+a.name+' and '+b.name+' follow them onto '+f.title):(a.name+' and '+b.name+' are reuniting on '+f.title);
   const summary=negative?('A relationship the industry thought had cooled is relevant again now that '+a.name+' and '+b.name+' are sharing a package.'):('Their previous work together has turned the new package into a reunion rather than a first meeting.');
   const detail=archived?('The callback is '+archived.headline+'.'):prior?('Their last shared film was '+prior.title+'.'):'The Lot remembers the history even if the cameras had moved on.';
   const mem=lotRemember({type:'resurfacing',participants:[a.id,b.id],headline,detail,intensity,publicEvent:false,filmId:f.id,storyId:archived?.id||null});
   lotAdjustRelationship(a,b,negative?{tension:6,grudge:3}:{affection:4,trust:3},mem.id);
   const story=lotStory({type,participants:[a.id,b.id],headline,summary,detail,intensity,durability:negative?42:28,publicEvent:false,memoryId:mem.id,filmId:f.id,resurfacedFrom:archived?.id||null,chapterType:'resurfacing'});
   story.timesResurfaced=Math.max(1,story.timesResurfaced||0);
  }
 });
}
function lotEvolveActiveStories(){
 const lot=ensureLotState();
 lot.stories.filter(s=>s.active&&state.week-(s.lastChapterWeek||s.lastWeek||s.startedWeek)>=5).forEach(s=>{
  const shared=playerFilms().find(f=>['development','production'].includes(f.stage)&&s.participants.every(id=>lotAttachedTalentIds(f).includes(id)));if(!shared)return;
  const rr=makeRng(hash((state.seed||1)+'|lot-evolve|'+s.id+'|'+state.week));if(rr()>.22)return;
  const a=talentById(s.participants[0]),b=talentById(s.participants[1]);if(!a||!b)return;let headline,summary,detail,delta,intensity=Math.max(1,s.intensity||1);
  if(s.type==='friendship'){
   headline=a.name+' and '+b.name+' are becoming a genuine off-camera alliance';summary='What started as easy chemistry now looks like a relationship that may outlast the current job.';detail='Assistants have stopped pretending the shared lunches are scheduling coincidences.';delta={affection:7,trust:6,respect:3,tension:-5};
  }else{
   headline=a.name+' vs '+b.name+' finds another front on '+shared.title;summary='The original argument has acquired another chapter instead of disappearing.';detail='Nobody has formally escalated anything. Everyone has somehow escalated everything.';delta={affection:-4,trust:-5,tension:10,grudge:5};intensity=Math.max(2,intensity);
  }
  const mem=lotRemember({type:'story-chapter',participants:[a.id,b.id],headline,detail,intensity,publicEvent:false,filmId:shared.id,storyId:s.id});lotAdjustRelationship(a,b,delta,mem.id);
  lotStory({type:s.type,participants:[a.id,b.id],headline,summary,detail,intensity,durability:s.durability||30,publicEvent:false,memoryId:mem.id,filmId:shared.id,chapterType:'escalation'});
  if(shared.stage==='production'&&s.type!=='friendship')lotApplyIncidentConsequences(a,b,s.type,Math.min(2,intensity),headline);
 });
}
function lotAgeStories(){
 const lot=ensureLotState();lot.stories.filter(s=>s.active).forEach(s=>{const quiet=state.week-(s.lastWeek||s.startedWeek);if(quiet>4){s.phase='cooling';s.heat=Math.max(0,(s.heat||0)-2)}if(quiet>s.durability&&s.heat<28){s.active=false;s.phase='resolved';s.resolvedWeek=state.week;lotStoryChapter(s,{type:'resolved',headline:'The story cools off',detail:'The cameras moved on, but the relationship and its history remain.',intensity:1});if(!lot.history.some(x=>x.id===s.id))lot.history.unshift(s);if(typeof resolveCareerThread==='function')resolveCareerThread('lot:'+s.id,'The cameras moved on, but the relationship remains part of both careers.')}});
 lot.history=lot.history.slice(0,120);
}
function processLotWeek(){
 if(!state.studio)return;const lot=ensureLotState();state.talent.forEach(t=>{if(!t.retired)ensureLotProfile(t)});lotAgeStories();lotMaybeResurfacePairHistory();lotEvolveActiveStories();
 if(lotMaybeTalentCrisis())return;
 if(state.week-(lot.lastIncidentWeek||0)<2)return;
 const pairs=lotEligiblePairs();if(!pairs.length)return;
 const r=makeRng(hash((state.seed||1)+'|lot-week|'+state.week));if(r()>.18)return;
 const rested=pairs.filter(([a,b])=>{const h=lotPairHistory(a,b),age=h.lastIncidentWeek?state.week-h.lastIncidentWeek:999,active=lot.stories.some(s=>s.active&&s.pair===h.key);return age>=8&&!active});
 const candidates=rested.length?rested:pairs.filter(([a,b])=>{const h=lotPairHistory(a,b);return !h.lastIncidentWeek||state.week-h.lastIncidentWeek>=5});
 const pool=candidates.length?candidates:pairs;
 const weighted=pool.map(pair=>{
  const [a,b]=pair,pa=ensureLotProfile(a),pb=ensureLotProfile(b),rel=lotRelationship(a,b),hist=lotPairHistory(a,b);
  const chaos=(pa.traits.volatility+pb.traits.volatility+pa.traits.eccentricity+pb.traits.eccentricity+pa.traits.grudge+pb.traits.grudge)/6;
  const age=hist.lastIncidentWeek?state.week-hist.lastIncidentWeek:52,recentPenalty=age<26?(26-age)*1.6:0,activePenalty=lot.stories.some(s=>s.active&&s.pair===hist.key)?24:0;
  return {pair,score:r()*70+chaos*.3+(rel.tension||0)*.25-recentPenalty-activePenalty};
 }).sort((a,b)=>b.score-a.score);
 const [a,b]=weighted[0].pair,tier=lotIncidentTier(r),incident=lotApplyIncident(a,b,tier,r);if(incident)lot.lastIncidentWeek=state.week;
}
function lotRecentMemories(t,limit=5){
 const p=ensureLotProfile(t),lot=ensureLotState(),set=new Set(p.memories||[]);return lot.memories.filter(m=>set.has(m.id)).slice(0,limit);
}
function lotActiveStoriesForTalent(t){
 const p=ensureLotProfile(t),lot=ensureLotState(),ids=new Set(p.storyIds||[]);return lot.stories.filter(s=>s.active&&ids.has(s.id));
}
function lotKnownRelationships(t,limit=5){
 const lot=ensureLotState(),rows=[];Object.values(lot.relationships).forEach(rel=>{if(rel.a!==t.id&&rel.b!==t.id)return;const other=talentById(rel.a===t.id?rel.b:rel.a);if(other){const history=lotPairHistory(t,other);rows.push({other,rel,history,label:lotRelationshipLabel(rel),weight:(rel.grudge||0)+(rel.tension||0)+Math.abs((rel.affection||50)-50)+(history.films.length*4)})}});return rows.sort((a,b)=>b.weight-a.weight).slice(0,limit);
}
function lotStoryHistoryForTalent(t,limit=6){
 const lot=ensureLotState();return lot.stories.filter(s=>s.participants?.includes(t.id)).sort((a,b)=>(b.active-a.active)||((b.lastWeek||b.resolvedWeek||0)-(a.lastWeek||a.resolvedWeek||0))).slice(0,limit);
}
function lotTalentPanel(t){
 const p=ensureLotProfile(t),labels=lotPersonaLabels(t),mem=lotRecentMemories(t),rels=lotKnownRelationships(t),stories=lotActiveStoriesForTalent(t),history=lotStoryHistoryForTalent(t);
 return `<div class="section-title"><h2>The Lot</h2><span class="small">Fictional in-game personality, relationships and alternate-Hollywood behaviour</span></div><div class="card lot-profile"><div class="lot-profile-head"><div><div class="badge">THE LOT</div><div class="lot-alias">${t.name}</div><div class="small">Real talent name · all simulated behaviour and events are fictional to this Project Slate career</div></div><span class="pill ${stories.length?'warn':'blue'}">${stories.length?stories.length+' active stor'+(stories.length===1?'y':'ies'):'No active drama'}</span></div><div class="lot-traits">${labels.map(x=>`<span>${x}</span>`).join('')}</div>${rels.length?`<div class="lot-rel-list">${rels.map(x=>`<div class="listrow"><span>${x.other.name}<small>${x.history.films.length?' · '+x.history.films.length+' shared film'+(x.history.films.length===1?'':'s'):''}</small></span><strong>${x.label}</strong></div>`).join('')}</div>`:''}${history.length?`<div class="lot-story-history"><div class="lot-history-title">Story history</div>${history.map(s=>`<div class="lot-history-row"><div><strong>${s.headline}</strong><span>${s.active?(s.phase==='cooling'?'Cooling':'Active'):'Resolved W'+(s.resolvedWeek||s.lastWeek)} · ${s.chapters?.length||0} chapter${(s.chapters?.length||0)===1?'':'s'}${s.timesResurfaced?' · resurfaced '+s.timesResurfaced+'×':''}</span></div><span class="pill ${s.active?(s.type==='friendship'?'good':s.intensity>=3?'bad':'warn'):'blue'}">${s.active?'LIVE':'HISTORY'}</span></div>`).join('')}</div>`:''}${mem.length?`<div class="lot-memory-list">${mem.map(m=>`<div class="lot-memory"><strong>${m.headline}</strong><span>W${m.week} · ${m.type==='film-history'?'Shared film':m.type==='awards-history'?'Awards':m.type==='resurfacing'?'Resurfaced':m.intensity>=4?'Legendary nonsense':m.intensity>=3?'Absurd':m.intensity>=2?'Hollywood drama':'Off-camera life'}</span></div>`).join('')}</div>`:''}</div>`;
}

// Lazily seed profiles after all simulation modules have loaded.
function bootstrapLot(){
 if(!state?.talent)return;ensureLotState();state.talent.forEach(t=>{if(!t.retired)ensureLotProfile(t)});
 (state.films||[]).filter(f=>f.stage==='complete').sort((a,b)=>(a.completeWeek||0)-(b.completeWeek||0)).forEach(f=>{
  if(!f.lotFilmMemoryRecorded){
   const profit=f.owner==='player'?((f.studioRevenue||0)-(f.investment||0)):(f.estimatedProfit||0);
   lotRegisterFilmOutcome(f,profit);
  }
  if(typeof ensureAfterlifeState==='function'){
   const a=ensureAfterlifeState(f),wins=a.wins||[],noms=a.nominations||[];if(wins.length||noms.length)lotRegisterAwardsOutcome(f,wins,noms);
  }
 });
}
