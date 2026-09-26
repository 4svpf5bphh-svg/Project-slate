// Project Slate v4.1a — THE LOT FOUNDATION
// Alternate-Hollywood people simulation. Core talent records retain their reference names;
// The Lot adds fictional counterpart identities and invented in-universe behaviour.

const LOT_ALIAS_OVERRIDES={
 'Christopher Nolan':'Christopher Bolan','Greta Gerwig':'Greta Gerwin','Denis Villeneuve':'Denis Villenard','Jordan Peele':'Jordan Peale',
 'David Fincher':'David Fischer','Steven Spielberg':'Steven Silverberg','Martin Scorsese':'Martin Corsese','James Gunn':'James Gann',
 'Florence Pugh':'Florence Pruitt','Zendaya':'Zendeya','Timothée Chalamet':'Timothée Chalamont','Margot Robbie':'Margot Robins',
 'Ryan Gosling':'Ryan Goss','Emma Stone':'Emma Stowe','Daniel Kaluuya':'Daniel Kaluza','Pedro Pascal':'Pedro Pascale',
 'Anya Taylor-Joy':'Anya Taylor-Roy','Robert Pattinson':'Robert Pattenson','Jenna Ortega':'Jenna Ortego','Cillian Murphy':'Cillian Murray',
 'Denzel Washington':'Denzel Westington','Sylvester Stallone':'Sylvester Stallan','Arnold Schwarzenegger':'Arnold Schwarzman',
 'Bruce Willis':'Bruce Wills','Jason Statham':'Jason Stratham','Chris Pratt':'Chris Bratt','Emily Blunt':'Emily Brant',
 'Andrew Garfield':'Andrew Garford','Adam Driver':'Adam Drayver','Nicole Kidman':'Nicole Kidmore','Megan Fox':'Megan Fawkes'
};

function ensureLotState(st=state){
 st.lot=st.lot||{version:1,profiles:{},relationships:{},memories:[],stories:[],history:[],lastIncidentWeek:0};
 st.lot.profiles=st.lot.profiles||{};st.lot.relationships=st.lot.relationships||{};st.lot.memories=st.lot.memories||[];st.lot.stories=st.lot.stories||[];st.lot.history=st.lot.history||[];
 return st.lot;
}
function lotAlterSurname(name,id=''){
 const parts=String(name||'').trim().split(/\s+/);if(parts.length===1){const n=parts[0];return n.length>4?n.slice(0,-2)+(n.at(-2)==='a'?'e':'a')+n.at(-1):n+'a'}
 const surname=parts.pop();let s=surname;
 const swaps=[[/son$/i,'sen'],[/ton$/i,'ten'],[/ing$/i,'in'],[/ley$/i,'lin'],[/man$/i,'mann'],[/er$/i,'ers'],[/ez$/i,'es'],[/a$/i,'o'],[/y$/i,'ie'],[/t$/i,'d'],[/s$/i,'z'],[/n$/i,'m']];
 for(const [re,to] of swaps){if(re.test(s)){s=s.replace(re,to);return [...parts,s].join(' ')}}
 const r=hash('lot-alias|'+id+'|'+surname)%3;
 if(s.length>4)s=r===0?s.slice(0,-1)+'e':r===1?s.slice(0,-1)+'n':s.slice(0,-2)+s.at(-1)+s.at(-2);
 else s=s+'e';
 return [...parts,s].join(' ');
}
function lotTalentName(t){
 if(!t)return 'Unknown';
 if(t.isRealPerson===false)return t.name;
 const real=t.name||'Unknown';
 return LOT_ALIAS_OVERRIDES[real]||lotAlterSurname(real,t.id);
}
function lotTraitValue(t,key,base=50,spread=46){
 const r=makeRng(hash((state.seed||1)+'|lot-trait|'+t.id+'|'+key));return Math.round(clamp(base+(r()-.5)*spread,5,98));
}
function ensureLotProfile(t){
 if(!t)return null;const lot=ensureLotState(),old=lot.profiles[t.id];if(old)return old;
 const professionalBase=t.type==='Actor'?(t.reliability||70):(t.budgetControl||72),fame=t.type==='Actor'?(t.star||55):(t.commercial||55);
 const p={
  talentId:t.id,alias:lotTalentName(t),createdWeek:state.week,
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
function lotAdjustRelationship(a,b,delta={},memoryId=null){
 const rel=lotRelationship(a,b);if(!rel)return null;['affection','respect','trust','tension','grudge'].forEach(k=>{if(delta[k])rel[k]=Math.round(clamp((rel[k]||0)+delta[k],0,100))});rel.lastWeek=state.week;if(memoryId)rel.memories.unshift(memoryId);rel.memories=rel.memories.slice(0,12);return rel;
}
function lotRemember({type='moment',participants=[],headline,detail='',intensity=1,publicEvent=false,filmId=null,storyId=null}){
 const lot=ensureLotState(),id='LM'+(lot.memories.length+1)+'W'+state.week,m={id,week:state.week,day:typeof currentCalendarDay==='function'?currentCalendarDay():null,type,participants:[...participants],headline,detail,intensity,public:publicEvent,filmId,storyId};
 lot.memories.unshift(m);lot.memories=lot.memories.slice(0,240);
 participants.forEach(tid=>{const t=talentById(tid),p=t?ensureLotProfile(t):null;if(p){p.memories.unshift(id);p.memories=p.memories.slice(0,18)}});
 return m;
}
function lotStory({type='feud',participants=[],headline,summary,detail,intensity=2,durability=20,publicEvent=true,memoryId=null}){
 const lot=ensureLotState(),pair=participants.slice().sort().join('|');
 let story=lot.stories.find(x=>x.active&&x.type===type&&x.pair===pair);
 if(!story){story={id:'LS'+(lot.stories.length+1),type,pair,participants:[...participants],headline,summary,detail,intensity,durability,heat:55+intensity*10,active:true,startedWeek:state.week,lastWeek:state.week,memoryIds:[]};lot.stories.unshift(story)}
 else{story.headline=headline;story.summary=summary;story.detail=detail;story.heat=clamp(story.heat+12,0,100);story.lastWeek=state.week}
 if(memoryId)story.memoryIds.unshift(memoryId);
 participants.forEach(tid=>{const t=talentById(tid),p=t?ensureLotProfile(t):null;if(p&&!p.storyIds.includes(story.id))p.storyIds.unshift(story.id)});
 if(typeof upsertCareerThread==='function')upsertCareerThread({key:'lot:'+story.id,type:'memory',tone:intensity>=4?'bad':intensity>=3?'warn':'blue',priority:58+intensity*8,title:headline,summary,detail,progress:'THE LOT'});
 if(publicEvent&&typeof pushDeskItem==='function'&&intensity>=2)pushDeskItem({templateId:'lot-story',repeatKey:'lot:'+story.id+':'+state.week,family:'lot',type:intensity>=3?'gossip':'industry',source:'The Lot',urgency:intensity>=4?'urgent':'normal',requiresAction:false,headline,body:summary+(detail?' '+detail:''),choices:[],resolved:true,read:false,expanded:false});
 return story;
}
function lotEligiblePairs(){
 const ids=[...new Set(playerFilms().filter(f=>!['complete','shelved'].includes(f.stage)).flatMap(f=>[f.directorId,...(f.cast||[])]).filter(Boolean))];
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
 return {headline,summary,detail,tier,intensity,relationship:updated};
}
function lotAgeStories(){
 const lot=ensureLotState();lot.stories.filter(s=>s.active).forEach(s=>{const quiet=state.week-(s.lastWeek||s.startedWeek);if(quiet>4)s.heat=Math.max(0,(s.heat||0)-2);if(quiet>s.durability&&s.heat<28){s.active=false;s.resolvedWeek=state.week;lot.history.unshift(s);if(typeof resolveCareerThread==='function')resolveCareerThread('lot:'+s.id,'The cameras moved on and the story stopped driving the current Hollywood conversation.')}});
 lot.history=lot.history.slice(0,80);
}
function processLotWeek(){
 if(!state.studio)return;const lot=ensureLotState();state.talent.forEach(t=>{if(!t.retired)ensureLotProfile(t)});lotAgeStories();
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
 const lot=ensureLotState(),rows=[];Object.values(lot.relationships).forEach(rel=>{if(rel.a!==t.id&&rel.b!==t.id)return;const other=talentById(rel.a===t.id?rel.b:rel.a);if(other)rows.push({other,rel,label:lotRelationshipLabel(rel),weight:(rel.grudge||0)+(rel.tension||0)+Math.abs((rel.affection||50)-50)})});return rows.sort((a,b)=>b.weight-a.weight).slice(0,limit);
}
function lotTalentPanel(t){
 const p=ensureLotProfile(t),labels=lotPersonaLabels(t),mem=lotRecentMemories(t),rels=lotKnownRelationships(t),stories=lotActiveStoriesForTalent(t);
 return `<div class="section-title"><h2>The Lot</h2><span class="small">Alternate-Hollywood identity · behaviour in this universe is fictional</span></div><div class="card lot-profile"><div class="lot-profile-head"><div><div class="badge">THE LOT IDENTITY</div><div class="lot-alias">${p.alias}</div><div class="small">${t.isRealPerson?`Played in this universe by ${t.name}`:'Original Project Slate talent'}</div></div><span class="pill ${stories.length?'warn':'blue'}">${stories.length?stories.length+' active stor'+(stories.length===1?'y':'ies'):'No active drama'}</span></div><div class="lot-traits">${labels.map(x=>`<span>${x}</span>`).join('')}</div>${rels.length?`<div class="lot-rel-list">${rels.map(x=>`<div class="listrow"><span>${lotTalentName(x.other)}</span><strong>${x.label}</strong></div>`).join('')}</div>`:''}${mem.length?`<div class="lot-memory-list">${mem.map(m=>`<div class="lot-memory"><strong>${m.headline}</strong><span>W${m.week} · ${m.intensity>=4?'Legendary nonsense':m.intensity>=3?'Absurd':m.intensity>=2?'Hollywood drama':'Off-camera life'}</span></div>`).join('')}</div>`:''}</div>`;
}

// Lazily seed profiles after all simulation modules have loaded.
function bootstrapLot(){if(!state?.talent)return;ensureLotState();state.talent.forEach(t=>{if(!t.retired)ensureLotProfile(t)})}
