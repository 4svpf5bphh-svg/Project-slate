// Project Slate v4.7 — Trade Press
// Deterministic events choose what is news. AI may rewrite a major article, never the underlying facts.

const TRADE_PRESS_VERSION=470;
const TRADE_PRESS_AI_THRESHOLD=78;
const TRADE_PRESS_DESK_THRESHOLD=90;
const TRADE_PRESS_RETRY_LIMIT=2;
const tradePressRuntime={pending:new Map(),retryTimers:new Map(),lifecycleBound:false};

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
 if(typeof window!=='undefined')window.addEventListener('online',()=>resumeTradePressNarrative({force:true}));
 if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')resumeTradePressNarrative()});
}
function bootstrapTradePress(){
 ensureTradePressState();
 (state.news||[]).forEach(n=>{if(n.tradePress?.feature){n.tradePress.version=TRADE_PRESS_VERSION;n.tradePress.local=n.tradePress.local||{headline:n.headline,deck:n.deck,body:(n.body||[n.text]).slice()}}});
 bindTradePressLifecycle();resumeTradePressNarrative();
}
