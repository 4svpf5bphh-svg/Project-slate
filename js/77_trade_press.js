// Project Slate v4.8 — Trade Press + connected Lot Press ecosystem
// Deterministic events choose what is news. AI may rewrite a major article, never the underlying facts.

const TRADE_PRESS_VERSION=480;
const LOT_PRESS_VERSION=480;
const LOT_PRESS_RETRY_LIMIT=2;
const TRADE_PRESS_AI_THRESHOLD=78;
const TRADE_PRESS_DESK_THRESHOLD=90;
const TRADE_PRESS_RETRY_LIMIT=2;
const tradePressRuntime={pending:new Map(),retryTimers:new Map(),lifecycleBound:false};
const lotPressRuntime={pending:new Map(),retryTimers:new Map()};

function ensureTradePressState(st=state){
 st.tradePress=st.tradePress||{version:TRADE_PRESS_VERSION,recent:[],aiUsage:{week:0,count:0},lastFeatureWeek:0};
 st.tradePress.version=TRADE_PRESS_VERSION;
 st.tradePress.recent=Array.isArray(st.tradePress.recent)?st.tradePress.recent:[];
 st.tradePress.aiUsage=st.tradePress.aiUsage||{week:0,count:0};
 return st.tradePress;
}
function tradePressFamily(item){
 const k=String(item?.kind||''),t=String(item?.text||'').toLowerCase();
 if(/box office|sleeper|opening|second-week|worldwide|breakout|collapses/.test(t)||/Box Office/.test(k))return 'box-office';
 if(/award/.test(k.toLowerCase())||/nomination|ceremony|awards/.test(t))return 'awards';
 if(/finance/.test(k.toLowerCase())||/debt|cash runway|co-financ|overhead|loss|profit/.test(t))return 'finance';
 if(/Script Market|Development/.test(k)||/screenplay|auction|outbid|acquired/.test(t))return 'development';
 if(/Casting|Talent|Industry Drama/.test(k)||/cast|screen.test|walked off|agents|performer/.test(t))return 'talent';
 if(/Production/.test(k)||/production|wrapped principal|overrun/.test(t))return 'production';
 if(/Rights|Franchise|Library/.test(k)||/rights|franchise|sequel|reboot|spinoff/.test(t))return 'rights';
 if(/Release Calendar|Press Release/.test(k)||/dated .*week|first look|campaign/.test(t))return 'release';
 if(/Studio Watch/.test(k)||/rivalry|running hot|comeback|under pressure/.test(t))return 'studio';
 return 'industry';
}
function tradePressSubject(st,item){
 const text=[item?.text,item?.headline].filter(Boolean).join(' ');
 const film=typeof pressMatchFilm==='function'?pressMatchFilm(st,text):null;
 const script=typeof pressMatchScript==='function'?pressMatchScript(st,text):null;
 const talent=typeof pressMatchTalent==='function'?pressMatchTalent(st,text):null;
 const rival=typeof pressMatchRival==='function'?pressMatchRival(st,text):null;
 if(film)return {key:'film:'+film.id,type:'film',id:film.id,name:film.title,film,script,talent,rival};
 if(script)return {key:'script:'+script.id,type:'script',id:script.id,name:script.title,film,script,talent,rival};
 if(talent)return {key:'talent:'+talent.id,type:'talent',id:talent.id,name:talent.name,film,script,talent,rival};
 if(rival)return {key:'rival:'+rival.id,type:'studio',id:rival.id,name:rival.name,film,script,talent,rival};
 return {key:'studio:'+(st.studio?.name||'industry'),type:'studio',id:null,name:st.studio?.name||'Industry',film,script,talent,rival};
}
function tradePressBaseScore(kind){
 const map={
  'Industry Alert':94,'Box Office Alert':88,'Industry Drama':84,'Awards':82,'Rights':80,'Franchise':80,
  'Studio Watch':78,'Trade Finance':76,'Studio Finance':76,'Trade Report':74,'Box Office':72,
  'Script Market':68,'Casting':62,'Production':62,'Talent Watch':60,'Release Calendar':56,
  'Press Release':52,'Your Studio':56,'Market Watch':54,'Development':48,'Industry':46
 };
 return map[kind]??50;
}
function tradePressImportance(st,item){
 const text=String(item?.text||''),lower=text.toLowerCase(),subject=tradePressSubject(st,item),family=tradePressFamily(item),tp=ensureTradePressState(st);
 let score=tradePressBaseScore(item?.kind);
 if(typeof newsTouchesPlayer==='function'&&newsTouchesPlayer(st,item))score+=8;
 if(subject.rival)score+=3;
 const boosts=[
  [/walked off|disastrous|major loss|major profit|defining studio rivalry|career scandal/,16],
  [/breakout|outbid|won a contested|top.*offer|recorded loss|recorded profit|exceptional second-week|collapses \d+%/,13],
  [/greenlit|acquired|production overrun|restructured|rights sale|legacy revival|reboot|spinoff/,8],
  [/#1|stronger domestic opening|sleeper-hit|hot streak|comeback/,7]
 ];
 boosts.forEach(([re,v])=>{if(re.test(lower))score+=v});
 const recent=tp.recent||[],same=recent.find(x=>x.subjectKey===subject.key&&x.family===family&&st.week-(x.week||0)<=10);
 if(same)score-=22;
 else if(recent.some(x=>x.family===family&&st.week-(x.week||0)<=2))score-=6;
 return {score:clamp(Math.round(score),0,100),family,subject,player:typeof newsTouchesPlayer==='function'?newsTouchesPlayer(st,item):false};
}
function tradePressAIAllowance(st,score){
 const tp=ensureTradePressState(st),u=tp.aiUsage;
 if(u.week!==st.week){u.week=st.week;u.count=0}
 const cap=score>=94?2:1;
 if(u.count>=cap)return false;
 u.count++;return true;
}
function tradePressRecord(st,item,meta){
 const tp=ensureTradePressState(st);
 const entry={week:st.week,newsId:item.id,family:meta.family,subjectKey:meta.subject.key,headline:item.headline,score:meta.score,player:meta.player};
 tp.recent.unshift(entry);tp.recent=tp.recent.slice(0,80);if(meta.score>=TRADE_PRESS_AI_THRESHOLD)tp.lastFeatureWeek=st.week;
}
function tradePressStoryContext(st,item,meta){
 const live=tradePressSubject(st,item),s=live,film=live.film,script=live.script,talent=live.talent,rival=live.rival;
 return {
  event:{kind:item.kind,fact:item.text,importance:meta.score,week:st.week},
  publication:{name:item.publication,byline:item.byline,voice:item.voiceLabel||null},
  local_copy:{headline:item.tradePress?.local?.headline||item.headline,deck:item.tradePress?.local?.deck||item.deck,paragraphs:item.tradePress?.local?.body||item.body||[]},
  subject:{
   type:s.type,name:s.name,
   film:film?{title:film.title,genre:film.genre,stage:film.stage,studio:film.owner==='player'?st.studio?.name:(film.studio||rivalById(film.owner)?.name||null),budget:film.budget||null,releaseWeek:film.releaseWeek||null,critics:film.review?.critics??null,audience:film.review?.audience??null,worldwideGross:film.finalGross||null}:null,
   screenplay:script?{title:script.title,genre:script.genre,source:script.source||null,askingPrice:script.price||script.acquisitionCost||null}:null,
   talent:talent?{name:talent.name,type:talent.type,tag:talent.tag||null}:null,
   rival:rival?{name:rival.name,style:rival.style,executive:rival.head?.name||null,intent:typeof rivalCurrentIntent==='function'?rivalCurrentIntent(rival).label:null}:null
  },
  player_studio:st.studio?{name:st.studio.name,recognition:Math.round(st.studioGrowth?.recognition||0),careerForm:typeof careerFormSnapshot==='function'?careerFormSnapshot().label:null}:null,
  recent_coverage:(ensureTradePressState(st).recent||[]).filter(x=>x.newsId!==item.id&&(x.family===meta.family||x.subjectKey===meta.subject.key)).slice(0,4).map(x=>({week:x.week,headline:x.headline,family:x.family})),
  rules:{facts_are_locked:true,do_not_invent_events:true,fictionalized_real_people:true}
 };
}
function validAITradeStory(x){return !!x&&typeof x.headline==='string'&&typeof x.deck==='string'&&Array.isArray(x.paragraphs)&&x.paragraphs.length>=2&&x.paragraphs.length<=4&&typeof x.editorial_note==='string'}
function tradePressRetryKey(id){return 'trade_story:'+id}
function clearTradePressRetry(id){
 const key=tradePressRetryKey(id),timer=tradePressRuntime.retryTimers.get(key);if(timer)clearTimeout(timer);tradePressRuntime.retryTimers.delete(key);
}
function scheduleTradePressRetry(item,count){
 clearTradePressRetry(item.id);
 const delay=typeof narrativeRetryDelayMs==='function'?narrativeRetryDelayMs(count):[90000,300000][Math.min(1,Math.max(0,count-1))];
 const key=tradePressRetryKey(item.id),nextRetryAt=Date.now()+delay;
 const timer=setTimeout(()=>{tradePressRuntime.retryTimers.delete(key);void queueAITradeStory(item,{force:true,automatic:true})},delay);
 tradePressRuntime.retryTimers.set(key,timer);return nextRetryAt;
}
function tradePressDeskSignal(item,meta){
 if(!state.studio||item.tradePress?.deskNotified)return;
 if(!((meta.player&&meta.score>=TRADE_PRESS_DESK_THRESHOLD)||meta.score>=96))return;
 item.tradePress.deskNotified=true;
 if(typeof notify==='function')notify('tradepress:'+item.id,'Trade press · '+item.headline,item.deck||item.text,meta.subject.film?.id||null,false,'intel',{screen:'industry',detail:{type:'news',id:item.id}});
}
function queueAITradeStory(item,{force=false,automatic=false}={}){
 if(!item?.tradePress?.feature||typeof requestNarrative!=='function'||!narrativeEndpoint())return Promise.resolve(null);
 const tp=item.tradePress;
 if(!force&&tp.status==='ready'&&validAITradeStory(tp.ai))return Promise.resolve(tp);
 const key=tradePressRetryKey(item.id);if(tradePressRuntime.pending.has(key))return tradePressRuntime.pending.get(key);
 clearTradePressRetry(item.id);
 const retryCount=automatic?(tp.retryCount||0):(force?tp.retryCount||0:0),packet=tradePressStoryContext(state,item,tp.meta);
 tp.status='pending';tp.retryCount=retryCount;tp.requestedWeek=state.week;try{save()}catch{}
 const task=requestNarrative('trade_story',packet).then(data=>{
  if(!validAITradeStory(data.narrative)){const e=new Error('invalid_trade_story_shape');e.code='invalid_trade_story_shape';throw e}
  const n=data.narrative;tp.status='ready';tp.ai=n;tp.provider=data.meta?.provider||null;tp.model=data.meta?.model||null;tp.responseId=data.meta?.responseId||null;tp.generatedWeek=state.week;tp.retryCount=0;tp.nextRetryAt=null;
  item.headline=narrativeEscapeHTML(n.headline);item.deck=narrativeEscapeHTML(n.deck);item.body=n.paragraphs.map(narrativeEscapeHTML);item.pressVersion=TRADE_PRESS_VERSION;
  clearTradePressRetry(item.id);try{save()}catch{}
  if(typeof render==='function'&&state.detail?.type==='news'&&state.detail?.id===item.id)render();
  return tp;
 }).catch(err=>{
  const next=(retryCount||0)+1,canRetry=typeof narrativeErrorRetryable==='function'&&narrativeErrorRetryable(err)&&next<=TRADE_PRESS_RETRY_LIMIT;
  tp.status=canRetry?'retry_wait':'local';tp.retryCount=next;tp.lastError=String(err?.message||err);tp.nextRetryAt=canRetry?scheduleTradePressRetry(item,next):null;try{save()}catch{}
  if(typeof render==='function'&&state.detail?.type==='news'&&state.detail?.id===item.id)render();return null;
 }).finally(()=>tradePressRuntime.pending.delete(key));
 tradePressRuntime.pending.set(key,task);return task;
}
function tradePressObserveNews(st,item){
 if(!item||!st?.careerStarted||item.tradePress?.observed)return item;
 const meta=tradePressImportance(st,item);
 if(meta.score<68)return item;
 const storedMeta={score:meta.score,family:meta.family,player:meta.player,subject:{key:meta.subject.key,type:meta.subject.type,id:meta.subject.id,name:meta.subject.name}};
 item.tradePress={version:TRADE_PRESS_VERSION,observed:true,feature:true,status:'local',score:meta.score,family:meta.family,subjectKey:meta.subject.key,meta:storedMeta,
  local:{headline:item.headline,deck:item.deck,body:Array.isArray(item.body)?item.body.slice():[item.text]}};
 tradePressRecord(st,item,meta);tradePressDeskSignal(item,meta);
 if(meta.score>=TRADE_PRESS_AI_THRESHOLD&&tradePressAIAllowance(st,meta.score)){item.tradePress.status='queued';void queueAITradeStory(item)}
 return item;
}
function tradePressArticleStatusHTML(item){
 const x=item?.tradePress;if(!x?.feature)return '';
 const score=x.score||0,importance=score>=92?'MAJOR TRADE STORY':score>=82?'TRADE FEATURE':'TRADE WATCH';
 const status=x.status==='ready'?'<span class="pill good">FILED</span>':x.status==='pending'||x.status==='queued'?'<span class="pill blue">COPY FILING</span>':x.status==='retry_wait'?'<span class="pill warn">DESK COPY · UPDATE PENDING</span>':'<span class="pill">DESK COPY</span>';
 return '<div class="trade-press-status"><span class="badge">'+importance+'</span>'+status+'</div>';
}
function tradePressCardBadge(item){
 const x=item?.tradePress;if(!x?.feature)return '';
 return '<span class="pill '+(x.score>=92?'warn':'blue')+'">'+(x.score>=92?'MAJOR TRADE':'TRADE PRESS')+'</span>';
}

function lotPressCycleById(id){
 return typeof ensureLotState==='function'?(ensureLotState().pressCycles||[]).find(x=>x.id===id)||null:null;
}
function lotPressCycleForNews(item){return item?.lotPress?.cycleId?lotPressCycleById(item.lotPress.cycleId):null}
function lotPressStoryForCycle(cycle){return cycle&&typeof ensureLotState==='function'?ensureLotState().stories.find(x=>x.id===cycle.storyId)||null:null}
function lotPressEscape(value){return typeof narrativeEscapeHTML==='function'?narrativeEscapeHTML(value):String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function lotPressParticipantNames(story){
 return (story?.participants||[]).map(id=>typeof talentById==='function'?talentById(id):null).filter(Boolean).map(t=>t.name);
}
function lotPressLocalBundle(story,{filmId=null,chapterType='incident'}={}){
 const names=lotPressParticipantNames(story),a=names[0]||'One star',b=names[1]||'another',film=filmId&&typeof filmById==='function'?filmById(filmId):null,title=film?.title||null;
 const positive=story?.type==='friendship',intensity=Math.max(1,story?.intensity||1),place=title?' around '+title:' across the Lot';
 const headline=story?.headline||((positive?a+' and '+b+' find common ground':a+' and '+b+' add another uncomfortable chapter')+place);
 const deck=positive
  ?(title?headline+' has become a useful piece of off-camera chemistry around the production.':headline+' is becoming part of both careers rather than a one-week anecdote.')
  :(title?headline+' is now part of the industry conversation surrounding the production.':headline+' has moved from private friction into a public industry narrative.');
 const tradeParagraphs=positive
  ?[
    (a+' and '+b+' are giving Hollywood the rarest kind of material: a relationship that appears to be making the work easier rather than the publicity harder.')+(title?' The timing matters because both are currently tied to '+title+'.':''),
    'The significance is less the friendliness itself than the continuity. What might once have been a disposable behind-the-scenes anecdote is now being read as part of how the pair work together.',
    chapterType==='resurfacing'?'The industry is treating the reunion as a continuation of an old working history, not a newly discovered friendship.':'For agents and producers, that sort of dependable chemistry can quietly become leverage when future packages are assembled.'
   ]
  :[
    (a+' and '+b+' have supplied the trade with another chapter in a relationship that is refusing to stay background scenery.')+(title?' Because both are attached to '+title+', the story now sits beside the production rather than outside it.':''),
    'There is no new deal or formal rupture attached to the episode. The business significance is the accumulation: every public chapter changes how future rooms read the pairing and how much attention ordinary decisions attract.',
    chapterType==='resurfacing'?'The important word is again. The history had cooled; it has not been erased.':'Hollywood can tolerate almost any amount of friction provided everyone keeps turning up. The press, naturally, has no such restraint.'
   ];
 const gossip=positive
  ?(a+' + '+b+': Hollywood discovers workplace friendship and immediately tries to monetise it')
  :(a+' vs '+b+': the subplot nobody put in the shooting script');
 const agency=positive
  ?('Representatives for '+a+' and '+b+' are keeping the temperature low, describing the relationship as a productive working connection and leaving the rest to the work.')
  :('Representatives for '+a+' and '+b+' are declining to feed the spectacle, stressing that the professional focus remains on '+(title||'the work')+'.');
 const rival=positive
  ?('“Good for them. Give it a month and somebody will package the friendship,” one rival executive joked.')
  :('“If everyone is still doing the job, it is a story for you people and a scheduling note for us,” one rival executive said, not sounding especially disappointed by the coverage.');
 const pulse=positive
  ?[
    'Apparently two famous people getting along now counts as premium behind-the-scenes content. I am, regrettably, invested.',
    title?'If the chemistry is this good off camera, '+title+' suddenly has my attention.':'Hollywood found one healthy working relationship and turned on every camera.',
    'No scandal? In this economy? Refreshing.'
   ]
  :[
    title?title+' has not even finished its journey and the press tour has somehow developed a B-plot.':'The Lot has produced another argument with better coverage than most film releases.',
    'Everyone involved says it is about the work, which is Hollywood for “please stop asking while absolutely continuing to ask.”',
    intensity>=4?'This has moved past gossip and into “somebody is definitely keeping receipts” territory.':'I do not need them to be friends. I do need the next interview to be awkward.'
   ];
 return {trade:{headline,deck,paragraphs:tradeParagraphs.slice(0,3)},gossip_headline:gossip,agency_statement:agency,rival_quote:rival,pulse_reactions:pulse.slice(0,3),editorial_note:'Local deterministic press bundle for '+chapterType+'.'};
}
function lotPressResponseDirective(story){
 const positive=story?.type==='friendship',intensity=Math.max(1,story?.intensity||1);
 return {
  agency_stance:positive?'warm, professional, deliberately unshowy':'contain the story, keep the focus on the work, deny no supplied fact',
  rival_tone:positive?'dryly amused at Hollywood trying to package chemistry':intensity>=4?'cutting and delighted by a competitor distraction':'wry, competitive and slightly amused',
  pulse_tones:positive?['amused','warm','self-aware about publicity']:['amused','sceptical',intensity>=4?'concerned':'hungry for awkwardness']
 };
}
function lotPressPacket(cycle,item){
 const story=lotPressStoryForCycle(cycle),lot=typeof ensureLotState==='function'?ensureLotState():null,film=cycle?.filmId&&typeof filmById==='function'?filmById(cycle.filmId):null,names=lotPressParticipantNames(story);
 const participants=(story?.participants||[]).map(id=>{
  const t=typeof talentById==='function'?talentById(id):null;
  return t?{name:t.name,type:t.type}:null;
 }).filter(Boolean);
 return {
  contentType:'lot_press_bundle',
  fictionalUniverseNotice:'All named talent are fictional alternate-reality Project Slate counterparts. The supplied event is in-game fiction, not a real-world claim.',
  event:{headline:cycle.headline,summary:cycle.summary||'',detail:cycle.detail||'',week:cycle.week,chapterType:cycle.chapterType,importance:cycle.importance},
  publication:{name:item?.publication||'Screen Trade',byline:item?.byline||'Trade desk',voice:item?.voiceLabel||null},
  participants,
  production:film?{title:film.title,genre:film.genre,stage:film.stage}:null,
  continuity:{
   storyType:story?.type||'industry',
   active:!!story?.active,
   startedWeek:story?.startedWeek||cycle.week,
   timesResurfaced:story?.timesResurfaced||0,
   story_history:(story?.chapters||[]).filter(ch=>ch.week<=cycle.week).slice(0,6).map(ch=>({week:ch.week,type:ch.type,headline:ch.headline,detail:ch.detail||''})),
   prior_press:(lot?.pressCycles||[]).filter(x=>x.storyId===cycle.storyId&&x.id!==cycle.id&&x.week<=cycle.week).slice(0,4).map(x=>({week:x.week,headline:x.headline,chapterType:x.chapterType,gossip:x.bundle?.gossip_headline||x.local?.gossip_headline||''}))
  },
  response_directive:lotPressResponseDirective(story),
  rules:{single_existing_event:true,no_new_facts:true,fictionalized_real_people:true,names}
 };
}
function validAILotPressBundle(x){
 return !!x&&typeof x?.trade?.headline==='string'&&typeof x?.trade?.deck==='string'&&Array.isArray(x?.trade?.paragraphs)&&x.trade.paragraphs.length>=2&&x.trade.paragraphs.length<=4&&typeof x.gossip_headline==='string'&&typeof x.agency_statement==='string'&&typeof x.rival_quote==='string'&&Array.isArray(x.pulse_reactions)&&x.pulse_reactions.length>=2&&x.pulse_reactions.length<=3;
}
function lotPressRetryKey(id){return 'lot_press_bundle:'+id}
function clearLotPressRetry(id){
 const key=lotPressRetryKey(id),timer=lotPressRuntime.retryTimers.get(key);if(timer)clearTimeout(timer);lotPressRuntime.retryTimers.delete(key);
}
function scheduleLotPressRetry(cycle,count){
 clearLotPressRetry(cycle.id);
 const delay=typeof narrativeRetryDelayMs==='function'?narrativeRetryDelayMs(count):[90000,300000][Math.min(1,Math.max(0,count-1))],nextRetryAt=Date.now()+delay,key=lotPressRetryKey(cycle.id);
 const timer=setTimeout(()=>{lotPressRuntime.retryTimers.delete(key);void queueAILotPressCycle(cycle,{force:true,automatic:true})},delay);
 lotPressRuntime.retryTimers.set(key,timer);return nextRetryAt;
}
function applyLotPressBundleToSurfaces(cycle,bundle){
 if(!cycle||!bundle)return;cycle.bundle=bundle;
 const item=(state.news||[]).find(n=>n.id===cycle.newsId);
 if(item){
  item.headline=bundle.trade.headline;item.deck=bundle.trade.deck;item.body=bundle.trade.paragraphs.slice();item.lotPress=item.lotPress||{};item.lotPress.cycleId=cycle.id;item.lotPress.version=LOT_PRESS_VERSION;
 }
 const story=lotPressStoryForCycle(cycle),film=cycle.filmId&&typeof filmById==='function'?filmById(cycle.filmId):null;
 if(story&&typeof upsertCareerThread==='function')upsertCareerThread({key:'lot:'+story.id,type:'memory',tone:story.type==='friendship'?'good':(story.intensity||1)>=4?'bad':'warn',priority:58+(story.intensity||1)*8,title:story.headline,summary:story.summary||bundle.trade.deck,detail:bundle.trade.deck,progress:'THE LOT · PRESS CYCLE'});
 if(film?.socialPulse){
  const feed=(film.socialPulse.feed||[]).find(x=>x.lotPressCycleId===cycle.id);if(feed)feed.text=bundle.pulse_reactions[0];
 }
}
function queueAILotPressCycle(cycle,{force=false,automatic=false}={}){
 if(!cycle||typeof requestNarrative!=='function'||!narrativeEndpoint())return Promise.resolve(null);
 if(!force&&cycle.status==='ready'&&validAILotPressBundle(cycle.bundle))return Promise.resolve(cycle);
 const key=lotPressRetryKey(cycle.id);if(lotPressRuntime.pending.has(key))return lotPressRuntime.pending.get(key);
 clearLotPressRetry(cycle.id);
 const item=(state.news||[]).find(n=>n.id===cycle.newsId),retryCount=automatic?(cycle.retryCount||0):(force?cycle.retryCount||0:0),packet=lotPressPacket(cycle,item);
 cycle.status='pending';cycle.retryCount=retryCount;cycle.requestedWeek=state.week;try{save()}catch{}
 const task=requestNarrative('lot_press_bundle',packet).then(data=>{
  if(!validAILotPressBundle(data.narrative)){const e=new Error('invalid_lot_press_bundle_shape');e.code='invalid_lot_press_bundle_shape';throw e}
  cycle.status='ready';cycle.provider=data.meta?.provider||null;cycle.model=data.meta?.model||null;cycle.responseId=data.meta?.responseId||null;cycle.generatedWeek=state.week;cycle.retryCount=0;cycle.nextRetryAt=null;
  applyLotPressBundleToSurfaces(cycle,data.narrative);clearLotPressRetry(cycle.id);try{save()}catch{}
  if(typeof render==='function'&&(state.detail?.type==='news'&&state.detail?.id===cycle.newsId||state.uiDeskTab==='threads'))render();
  return cycle;
 }).catch(err=>{
  const next=(retryCount||0)+1,canRetry=typeof narrativeErrorRetryable==='function'&&narrativeErrorRetryable(err)&&next<=LOT_PRESS_RETRY_LIMIT;
  cycle.status=canRetry?'retry_wait':'local';cycle.retryCount=next;cycle.lastError=String(err?.message||err);cycle.nextRetryAt=canRetry?scheduleLotPressRetry(cycle,next):null;try{save()}catch{};return null;
 }).finally(()=>lotPressRuntime.pending.delete(key));
 lotPressRuntime.pending.set(key,task);return task;
}
function startLotPressCycle(story,{memoryId=null,filmId=null,chapterType='incident',incidentId=null,importance=72}={}){
 if(!story||typeof ensureLotState!=='function')return null;const lot=ensureLotState();
 const existing=(lot.pressCycles||[]).find(x=>x.storyId===story.id&&((memoryId&&x.memoryId===memoryId)||(!memoryId&&x.week===state.week&&x.chapterType===chapterType&&x.headline===story.headline)));if(existing)return existing;
 const local=lotPressLocalBundle(story,{filmId,chapterType}),id='LPC'+(++lot.pressCycleSeq)+'W'+state.week,cycle={id,version:LOT_PRESS_VERSION,storyId:story.id,memoryId,filmId,incidentId,chapterType,week:state.week,importance:clamp(Math.round(importance||72),0,100),headline:story.headline,summary:story.summary||'',detail:story.detail||'',status:'local',local,bundle:local,retryCount:0};
 const fact=(story.headline||local.trade.headline)+(story.detail?' '+story.detail:'');
 const item=typeof addNews==='function'?addNews(state,fact,'Industry Drama',{skipTradePress:true}):null;
 if(item){
  cycle.newsId=item.id;item.headline=local.trade.headline;item.deck=local.trade.deck;item.body=local.trade.paragraphs.slice();item.lotPress={version:LOT_PRESS_VERSION,cycleId:id,storyId:story.id,importance:cycle.importance};
 }
 lot.pressCycles.unshift(cycle);lot.pressCycles=lot.pressCycles.slice(0,120);story.pressCycleIds=Array.isArray(story.pressCycleIds)?story.pressCycleIds:[];story.pressCycleIds.unshift(id);story.pressCycleIds=story.pressCycleIds.slice(0,18);
 applyLotPressBundleToSurfaces(cycle,local);
 const film=filmId&&typeof filmById==='function'?filmById(filmId):null,positive=story.type==='friendship',intensity=Math.max(1,story.intensity||1);
 if(film&&typeof applyPulseDelta==='function')applyPulseDelta(film,{volume:Math.min(7,2+intensity),sentiment:positive?Math.min(3,intensity):-Math.min(3,Math.ceil(intensity/2)),fandom:positive?1:0,controversy:positive?0:Math.min(6,1+intensity),topic:positive?'Lot chemistry':'Lot friction'},'The Lot press cycle');
 if(film&&typeof addSocialFeed==='function')addSocialFeed(film,local.pulse_reactions[0],positive?'good':'warn',{lotPressCycleId:id});
 if(typeof narrativeEndpoint==='function'&&narrativeEndpoint()){cycle.status='queued';void queueAILotPressCycle(cycle)}
 return cycle;
}
function lotPressBundleHTML(item){
 const cycle=lotPressCycleForNews(item);if(!cycle)return '';const bundle=cycle.bundle||cycle.local;if(!bundle)return '';
 const stateLabel=cycle.status==='ready'?'CONNECTED COPY':cycle.status==='pending'||cycle.status==='queued'?'FILING':'LOCAL DESK COPY';
 return '<section class="lot-press-ecosystem"><div class="section-title"><h2>Same story, different rooms</h2><span class="small">One event · connected coverage · '+lotPressEscape(stateLabel)+'</span></div>'+
  '<div class="grid cols2">'+
   '<div class="card"><div class="badge">GOSSIP WIRE</div><div class="quote" style="margin-top:7px">'+lotPressEscape(bundle.gossip_headline)+'</div></div>'+
   '<div class="card"><div class="badge">REPRESENTATIVE RESPONSE</div><div class="body" style="margin-top:7px">'+lotPressEscape(bundle.agency_statement)+'</div></div>'+
   '<div class="card"><div class="badge">RIVAL ROOM</div><div class="body" style="margin-top:7px">'+lotPressEscape(bundle.rival_quote)+'</div></div>'+
   '<div class="card"><div class="badge">PULSE</div><div style="margin-top:7px">'+(bundle.pulse_reactions||[]).map(x=>'<div class="small" style="margin-top:6px">◉ '+lotPressEscape(x)+'</div>').join('')+'</div></div>'+
  '</div></section>';
}
function lotPressCardBadge(item){return item?.lotPress?.cycleId?'<span class="pill warn">LOT PRESS</span>':''}
function lotPressThreadAddon(thread){
 if(!thread?.key?.startsWith('lot:'))return '';const storyId=thread.key.slice(4),lot=typeof ensureLotState==='function'?ensureLotState():null,cycle=(lot?.pressCycles||[]).find(x=>x.storyId===storyId);if(!cycle)return '';
 const b=cycle.bundle||cycle.local;return b?'<div class="small" style="margin-top:7px"><strong>Latest press cycle:</strong> '+lotPressEscape(b.gossip_headline||b.trade?.headline||cycle.headline)+'</div>':'';
}
function resumeLotPressNarrative({force=false}={}){
 if(typeof ensureLotState!=='function'||!state?.studio)return;const now=Date.now();
 (ensureLotState().pressCycles||[]).forEach(cycle=>{
  if(cycle.status==='ready')return;
  if(cycle.status==='pending'&&!lotPressRuntime.pending.has(lotPressRetryKey(cycle.id))){cycle.status='retry_wait';cycle.nextRetryAt=now}
  if((force||!cycle.nextRetryAt||cycle.nextRetryAt<=now)&&['queued','pending','retry_wait'].includes(cycle.status))void queueAILotPressCycle(cycle,{force:true,automatic:true});
 });
}

function resumeTradePressNarrative({force=false}={}){
 if(!state?.studio)return;const now=Date.now();
 (state.news||[]).filter(n=>n.tradePress?.feature).forEach(item=>{
  const x=item.tradePress;if(x.status==='ready'||!x.meta)return;
  if(x.status==='pending'&&!tradePressRuntime.pending.has(tradePressRetryKey(item.id))){x.status='retry_wait';x.nextRetryAt=now}
  if((force||!x.nextRetryAt||x.nextRetryAt<=now)&&['queued','pending','retry_wait'].includes(x.status))void queueAITradeStory(item,{force:true,automatic:true});
 });
}
function bindTradePressLifecycle(){
 if(tradePressRuntime.lifecycleBound)return;tradePressRuntime.lifecycleBound=true;
 if(typeof window!=='undefined')window.addEventListener('online',()=>{resumeTradePressNarrative({force:true});resumeLotPressNarrative({force:true})});
 if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){resumeTradePressNarrative();resumeLotPressNarrative()}});
}
function bootstrapTradePress(){
 ensureTradePressState();
 (state.news||[]).forEach(n=>{if(n.tradePress?.feature){n.tradePress.version=TRADE_PRESS_VERSION;n.tradePress.local=n.tradePress.local||{headline:n.headline,deck:n.deck,body:(n.body||[n.text]).slice()}}});
 bindTradePressLifecycle();resumeTradePressNarrative();resumeLotPressNarrative();
}
