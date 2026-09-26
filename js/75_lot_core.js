// Project Slate v4.2 — THE LOT: LONG MEMORY
// Real talent names remain canonical throughout Project Slate. The Lot supplies
// fictional in-game personality, relationships, memories and alternate-Hollywood events.

function ensureLotState(st=state){
 st.lot=st.lot||{version:3,profiles:{},relationships:{},pairHistories:{},memories:[],stories:[],history:[],lastIncidentWeek:0};
 st.lot.profiles=st.lot.profiles||{};st.lot.relationships=st.lot.relationships||{};st.lot.pairHistories=st.lot.pairHistories||{};st.lot.memories=st.lot.memories||[];st.lot.stories=st.lot.stories||[];st.lot.history=st.lot.history||[];
 if((st.lot.version||1)<2)Object.entries(st.lot.profiles).forEach(([id,p])=>{const t=(st.talent||[]).find(x=>x.id===id);if(t&&p)p.alias=t.name});
 if((st.lot.version||1)<3){
  st.lot.stories.forEach(s=>{s.chapters=s.chapters||[];s.phase=s.active?'active':'resolved';s.timesResurfaced=s.timesResurfaced||0;s.lastChapterWeek=s.lastChapterWeek||s.lastWeek||s.startedWeek});
  st.lot.version=3;
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
 if(!lot.pairHistories[key])lot.pairHistories[key]={key,a:ids[0],b:ids[1],films:[],awards:[],storyIds:[],reunions:0,lastFilmWeek:0,lastSharedFilmId:null};
 return lot.pairHistories[key];
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
 const x=r();return x<.15?'ordinary':x<.55?'hollywood':x<.90?'absurd':'legendary';
}
function lotApplyIncident(a,b,tier,r){
 const A=lotTalentName(a),B=lotTalentName(b),pa=ensureLotProfile(a),pb=ensureLotProfile(b),rel=lotRelationship(a,b);
 let headline,summary,detail,type='feud',intensity=1,delta={};
 if(tier==='ordinary'){
  if(r()<.5){headline=`${A} and ${B} are becoming an unlikely double act`;summary=`The Lot cameras keep catching ${A} and ${B} together between work commitments, and an initially professional relationship is turning into a genuine friendship.`;detail='Nothing is on fire. For The Lot, this qualifies as suspiciously wholesome.';type='friendship';delta={affection:14,trust:10,respect:6,tension:-8}}
  else{headline=`${A} publicly backs ${B}`;summary=`A routine interview turned unexpectedly warm when ${A} went out of their way to defend ${B}'s work against a dismissive question.`;detail='The gesture landed with the industry because it did not feel rehearsed.';type='friendship';delta={affection:10,trust:8,respect:12}}
 }else if(tier==='hollywood'){
  if(r()<.5){headline=`${A} and ${B} are fighting over billing`;summary=`A disagreement about whose name appears first has escalated far beyond the size of the typography involved.`;detail=`${A}'s representatives call it contractual clarity. ${B}'s camp calls that description “creative”.`;intensity=2;delta={affection:-14,tension:24,grudge:10,respect:-4}}
  else{headline=`A hot mic has made ${A} vs ${B} very public`;summary=`The Lot captured ${A} making a cutting remark about ${B}'s working methods after both apparently believed the cameras had stopped.`;detail='They had not.';intensity=2;delta={affection:-16,trust:-18,tension:28,grudge:15}}
 }else if(tier==='absurd'){
  intensity=3;
  if(r()<.34){headline=`${A} has declared war over a parking space`;summary=`A disagreement over one reserved parking bay has somehow become a full production grievance between ${A} and ${B}.`;detail=`By lunchtime, somebody had replaced the nameplate. By dinner, there were traffic cones with legal representation.`;delta={affection:-18,tension:30,grudge:22}}
  else if(r()<.67){headline=`${A} and ${B} are in a trailer cold war`;summary=`The two have stopped communicating directly and are now using assistants to make increasingly petty complaints about noise, furniture and the precise angle of adjacent trailers.`;detail='The current dispute concerns a decorative cactus that may or may not be “aggressively positioned”.';delta={affection:-16,trust:-12,tension:34,grudge:20}}
  else{headline=`${A} has banned ${B} from a favourite restaurant`;summary=`Nobody is entirely clear how a film-industry disagreement resulted in one star persuading a restaurant to refuse the other a table, but The Lot has the receipts.`;detail='The restaurant has denied operating an official blacklist. It has also stopped answering questions.';delta={affection:-20,tension:31,grudge:28}}
 }else{
  intensity=4;const dogs=['Winston','Mabel','Bowie','Pickle','Stanley','Dolly'],dog=dogs[Math.floor(r()*dogs.length)];
  headline=`DOGGATE: ${A} vs ${B}`;summary=`${A} has accused ${B} of effectively kidnapping their dog, ${dog}, after a party. ${B} denies this and maintains that ${dog} “made an independent choice”.`;detail=`The dog is reportedly happy. The humans are absolutely not. Representatives for both sides have asked The Lot to stop calling it Doggate, guaranteeing that everybody will now call it Doggate.`;delta={affection:-35,trust:-35,tension:48,grudge:55};type='legendary-feud';
 }
 const mem=lotRemember({type,participants:[a.id,b.id],headline,detail,intensity,publicEvent:intensity>=2});
 lotAdjustRelationship(a,b,delta,mem.id);
 const updated=lotRelationship(a,b);
 lotStory({type,participants:[a.id,b.id],headline,summary,detail,intensity,durability:intensity>=4?90:intensity>=3?45:24,publicEvent:intensity>=2,memoryId:mem.id});
 lotApplyIncidentConsequences(a,b,type,intensity,headline);
 return {headline,summary,detail,tier,intensity,relationship:updated};
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
 if(state.week-(lot.lastIncidentWeek||0)<2)return;
 const pairs=lotEligiblePairs();if(!pairs.length)return;
 const r=makeRng(hash((state.seed||1)+'|lot-week|'+state.week));if(r()>.18)return;
 const weighted=pairs.map(pair=>{const [a,b]=pair,pa=ensureLotProfile(a),pb=ensureLotProfile(b),rel=lotRelationship(a,b);const chaos=(pa.traits.volatility+pb.traits.volatility+pa.traits.eccentricity+pb.traits.eccentricity+pa.traits.grudge+pb.traits.grudge)/6;return {pair,score:r()*70+chaos*.3+(rel.tension||0)*.25}}).sort((a,b)=>b.score-a.score);
 const [a,b]=weighted[0].pair,tier=lotIncidentTier(r);lotApplyIncident(a,b,tier,r);lot.lastIncidentWeek=state.week;
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
