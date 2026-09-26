// Player finance and operating-cost helpers

function ensureFinance(){if(!state.finance)state.finance={bridgeDebt:0,weeklyInterest:.012,totalInterest:0}}
function takeBridge(amount=5){
 ensureFinance();amount=Math.max(.5,+amount||5);const owed=amount*1.14;state.cash+=amount;state.finance.bridgeDebt+=owed;
 state.reputation.financial=clamp(state.reputation.financial-1.5,15,95);
 addNews(state,`${state.studio.name} drew ${money(amount)} of emergency finance. ${money(owed)} was added to bridge debt.`,'Studio Finance');
 showToast(`${money(amount)} bridge funding received.`);save();render();
}
function repayBridge(amount=1){
 ensureFinance();const pay=Math.min(+amount||1,state.cash,state.finance.bridgeDebt);if(pay<=0)return showToast('No available cash to repay.');
 state.cash-=pay;state.finance.bridgeDebt-=pay;addNews(state,`${state.studio.name} repaid ${money(pay)} of bridge finance.`,'Studio Finance');save();render();
}
function serviceBridge(){ensureFinance();if(state.finance.bridgeDebt<=0)return 0;const interest=state.finance.bridgeDebt*effectiveBridgeWeeklyInterest();state.finance.bridgeDebt+=interest;state.finance.totalInterest+=interest;return interest}
function payWeeklyOverhead(overhead){
 ensureFinance();
 if(state.cash>=overhead){state.cash-=overhead;return {borrowed:0}}
 const short=overhead-state.cash;state.cash=0;
 const draw=Math.max(.5,Math.ceil(short*4)/4);const owed=draw*1.14;state.finance.bridgeDebt+=owed;state.cash+=Math.max(0,draw-short);
 state.reputation.financial=clamp(state.reputation.financial-1,15,95);
 addNews(state,`Cash reserves could not cover ${money(overhead)} of weekly overhead. An emergency ${money(draw)} bridge draw kept the studio operating.`,'Studio Finance');
 notify(`autobridge:${state.week}`,`Emergency finance used`,`Weekly overhead exceeded available cash, so the studio automatically drew ${money(draw)} of bridge finance. Review the Finance screen before committing more projects.`,null,true,'finance',{screen:'studio',detail:{type:'finance'}});
 return {borrowed:draw};
}
function studioWeeklyOverhead(){return studioOverheadBreakdown().total}

function studioCashRunway(){ensureFinance();const b=studioOverheadBreakdown(),catalogue=typeof currentCatalogueReceipts==='function'?currentCatalogueReceipts():0,interest=Math.max(0,(state.finance.bridgeDebt||0)*effectiveBridgeWeeklyInterest());const netBurn=Math.max(0,b.total+interest-catalogue),weeks=netBurn<=.002?Infinity:state.cash/netBurn;return {weeks,netBurn,overhead:b.total,catalogue,interest,label:!Number.isFinite(weeks)?'Self-funding':weeks<1?'Under 1 week':weeks<10?`${weeks.toFixed(1)} weeks`:`${Math.floor(weeks)}+ weeks`}}
function maybeWarnCashRunway(){
 if(!state.studio)return;ensureFinance();const r=studioCashRunway();
 if(!Number.isFinite(r.weeks)||r.weeks>3.2||r.netBurn<=.002)return;
 if(state.finance.lastRunwayWarningWeek&&state.week-state.finance.lastRunwayWarningWeek<4)return;
 state.finance.lastRunwayWarningWeek=state.week;
 const msg=r.weeks<1.2?`Current cash may not cover another full week of operating burn without new receipts or bridge finance.`:`At the current operating burn, cash reserves cover roughly ${r.weeks.toFixed(1)} weeks before bridge finance may be required.`;
 notify(`runway:${state.week}`,`Cash runway is tightening`,msg,null,false,'finance',{screen:'studio',detail:{type:'finance'}});
 addNews(state,`${state.studio.name} is operating with roughly ${r.weeks.toFixed(1)} weeks of cash runway at the current recurring burn rate.`,'Studio Finance');
}


function ensureCareerCycle(st=state){
 st.careerCycle=st.careerCycle||{phase:'building',startedWeek:st.week||1,lastEvaluatedWeek:0,lastTransitionWeek:st.week||1,history:[],activePlan:null,lastPlanEndWeek:0,lastRecoveryWeek:0,peakRecognition:12};
 const c=st.careerCycle;c.history=c.history||[];if(c.activePlan===undefined)c.activePlan=null;c.lastPlanEndWeek=c.lastPlanEndWeek||0;c.lastRecoveryWeek=c.lastRecoveryWeek||0;c.peakRecognition=Math.max(c.peakRecognition||0,st.studioGrowth?.recognition||0);return c;
}
function careerRecentFilms(limit=5){return completedPlayerFilms().slice().sort((a,b)=>(b.completeDay||b.completeWeek*7)-(a.completeDay||a.completeWeek*7)).slice(0,limit)}
function careerFormSnapshot(){
 const c=ensureCareerCycle(),recent=careerRecentFilms(5),window=recent.slice(0,4),last3=recent.slice(0,3),recentProfit=window.reduce((n,f)=>n+studioFilmProfit(f),0),losses=last3.filter(f=>studioFilmProfit(f)<-1).length,majorLosses=last3.filter(f=>studioFilmProfit(f)<=-8).length,hits=last3.filter(f=>studioFilmProfit(f)>=10).length,runway=studioCashRunway(),debt=state.finance?.bridgeDebt||0,recognition=ensureStudioGrowth().recognition||0,plan=c.activePlan;
 let id='steady',label='Steady',tone='blue',desc='The studio is operating without a dominant short-term success or recovery narrative.';
 if(recent.length<3){id='building';label='Building';desc='The studio is still establishing enough history for a real career cycle to form.'}
 const pressured=recent.length>=3&&(debt>=8||(Number.isFinite(runway.weeks)&&runway.weeks<3)||(losses>=2&&recentProfit<=-10)||majorLosses>=2);
 if(pressured){id='pressure';label='Under Pressure';tone='bad';desc='Recent results or the balance sheet have become a persistent studio story rather than a one-week warning.'}
 if(plan){id='rebuilding';label='Rebuilding';tone='warn';desc=plan.id==='lean'?'The studio is deliberately running lean while it rebuilds financial room.':'The studio has restructured emergency debt to create time for the slate to recover.'}
 else if(c.lastRecoveryWeek&&state.week-c.lastRecoveryWeek<=26){id='resurgent';label='Resurgent';tone='good';desc='The studio has emerged from a recovery phase and recent results are being read as a comeback.'}
 else if(!pressured&&recent.length>=3&&hits>=2&&recentProfit>=18){id='momentum';label='Running Hot';tone='good';desc='Recent releases have created clear commercial momentum and raised expectations around the next move.'}
 else if(!pressured&&recognition>=72&&recent.length>=5){id='established';label='Established';tone='blue';desc='The studio has enough history and recognition that individual misses matter, but no longer define the whole company.'}
 return {id,label,tone,desc,recent,window,last3,recentProfit,losses,majorLosses,hits,runway,debt,recognition,plan};
}
function updateCareerCycle(force=false){if(!state.studio)return;const c=ensureCareerCycle(),p=c.activePlan;if(p){const healthy=state.week>=p.minEndWeek&&recoveryPlanHealthy(p);if(healthy)finishRecoveryPlan(true,'Recovery conditions met.');else if(state.week>=p.endWeek)finishRecoveryPlan(false,'Recovery window expired.')}const snap=careerFormSnapshot(),prev=c.phase||'building';c.phase=snap.id;c.lastEvaluatedWeek=state.week;c.peakRecognition=Math.max(c.peakRecognition||0,snap.recognition||0);if(force||prev!==snap.id){c.lastTransitionWeek=state.week;c.history.unshift({week:state.week,type:'phase',from:prev,to:snap.id,label:snap.label});c.history=c.history.slice(0,24);if(prev!==snap.id&&['pressure','resurgent','momentum'].includes(snap.id)){const headline=snap.id==='pressure'?`${state.studio.name} has entered a difficult run`:snap.id==='resurgent'?`${state.studio.name} is being talked about as a comeback story`:`${state.studio.name} is running hot`;pushDeskItem({templateId:`career-phase-${snap.id}`,repeatKey:`career-phase-${snap.id}:${state.week}`,family:'career-cycle',type:snap.id==='pressure'?'finance':'industry',source:'Studio Watch',urgency:snap.id==='pressure'?'urgent':'normal',requiresAction:false,headline,body:snap.desc,choices:[],resolved:true,read:false,expanded:false})}}const key='studio-career-cycle',thread=careerThread(key);if(snap.id==='pressure')upsertCareerThread({key,type:'finance',tone:'bad',priority:86,title:'The studio is under pressure',summary:`${snap.losses} losses in the last three releases · ${money(snap.debt)} bridge debt · ${snap.runway.label} runway.`,detail:'This is a career phase, not a Game Over state. A formal recovery plan can trade capacity or financing cost for breathing room, while a strong slate can repair the story organically.',progress:'Under pressure'});else if(snap.id==='rebuilding'){const prog=recoveryPlanProgress();upsertCareerThread({key,type:'finance',tone:'warn',priority:90,title:`${snap.plan.label} is reshaping the studio`,summary:`${prog?.pct||0}% recovery signal · ${money(snap.debt)} bridge debt · ${snap.runway.label} runway.`,detail:snap.plan.desc,progress:`${prog?.elapsed||0}/${prog?.duration||0} weeks`})}else if(snap.id==='resurgent')upsertCareerThread({key,type:'memory',tone:'good',priority:72,title:'The rebuild is becoming a comeback',summary:'The studio has exited formal recovery and the industry is now watching whether the improved financial and release form can hold.',detail:'A resurgence remains temporary evidence, not a permanent buff. New misses can put the company back under pressure; sustained good decisions can turn it into the next era.',progress:`Recovered W${c.lastRecoveryWeek}`});else if(thread)resolveCareerThread(key,'The studio moved out of the recovery cycle and immediate pressure stopped defining the trade narrative.')}
function careerArcCard(){const x=careerFormSnapshot(),tone=x.tone==='bad'?'bad':x.tone==='warn'?'warn':x.tone==='good'?'good':'blue',recent=x.recent.slice(0,4),p=recoveryPlanProgress();return `<div class="career-arc-card card career-arc-${x.tone}"><div class="career-arc-head"><div><div class="badge">CAREER FORM</div><div class="kpi">${x.label}</div></div><span class="pill ${tone}">Year ${careerYears()+1}</span></div><div class="body">${x.desc}</div>${recent.length?`<div class="career-form-strip">${recent.map(f=>{const profit=studioFilmProfit(f),out=filmOutcomeLabel(f,profit);return `<span class="${out.cls}"><b>${f.title}</b><small>${profit>=0?'+':''}${money(profit)}</small></span>`}).join('')}</div>`:''}${p?`<div class="career-recovery-progress"><div class="row"><strong>${x.plan.label}</strong><span>${p.pct}% recovery signal</span></div><div class="milestone-progress"><span style="width:${p.pct}%"></span></div><div class="small">${p.elapsed}/${p.duration} weeks · debt ${money(p.debt)} · ${p.runway.label} runway</div></div>`:x.id==='pressure'?`<button class="btn block" data-studio-tab="finance" style="margin-top:10px">Review recovery options</button>`:''}</div>`}
function recoveryOperatingMultiplier(){return ensureCareerCycle().activePlan?.id==='lean'?.76:1}
function recoveryCapacityPenalty(){return ensureCareerCycle().activePlan?.id==='lean'?1:0}
function effectiveBridgeWeeklyInterest(){ensureFinance();return state.finance.weeklyInterest*(ensureCareerCycle().activePlan?.id==='refinance'?.55:1)}
function recoveryPlanEligibility(id){const c=ensureCareerCycle(),snap=careerFormSnapshot(),reasons=[];if(c.activePlan)reasons.push('A recovery plan is already active.');if(snap.id!=='pressure')reasons.push('Recovery plans unlock only when the studio is genuinely under pressure.');if(c.lastPlanEndWeek&&state.week-c.lastPlanEndWeek<26)reasons.push(`Another formal recovery plan cannot begin until Week ${c.lastPlanEndWeek+26}.`);if(id==='refinance'&&(state.finance?.bridgeDebt||0)<3)reasons.push('At least $3m of bridge debt is required for a debt restructure.');if(id==='lean'&&studioOperatingScale().id==='startup'&&completedPlayerFilms().length<3)reasons.push('The operation is already too lean to restructure further.');return {ok:reasons.length===0,reasons,snapshot:snap}}
function recoveryPlanHealthy(plan=ensureCareerCycle().activePlan){if(!plan)return false;const snap=careerFormSnapshot(),debtTarget=Math.max(2,(plan.startDebt||0)*.55),recent2=careerRecentFilms(2),profit2=recent2.reduce((n,f)=>n+studioFilmProfit(f),0);const runwayHealthy=!Number.isFinite(snap.runway.weeks)||snap.runway.weeks>=6,cashHealthy=state.cash>=Math.max(5,studioOverheadBreakdown().total*8),debtHealthy=(state.finance?.bridgeDebt||0)<=debtTarget,filmHealthy=!recent2.length||profit2>=0;return (runwayHealthy||cashHealthy)&&debtHealthy&&filmHealthy}
function recoveryPlanProgress(){const c=ensureCareerCycle(),p=c.activePlan;if(!p)return null;const snap=careerFormSnapshot(),elapsed=state.week-p.startWeek,duration=Math.max(1,p.endWeek-p.startWeek),debt=state.finance?.bridgeDebt||0,debtTarget=Math.max(2,(p.startDebt||0)*.55),recent2=careerRecentFilms(2),profit2=recent2.reduce((n,f)=>n+studioFilmProfit(f),0);const debtPct=p.startDebt>debtTarget?clamp((p.startDebt-debt)/(p.startDebt-debtTarget)*100,0,100):100,runwayPct=!Number.isFinite(snap.runway.weeks)?100:clamp(snap.runway.weeks/6*100,0,100),filmPct=!recent2.length?55:clamp((profit2+8)/16*100,0,100),pct=Math.round(debtPct*.4+runwayPct*.35+filmPct*.25);return {elapsed,duration,pct,debt,debtTarget,runway:snap.runway,profit2,healthy:recoveryPlanHealthy(p)}}
function finishRecoveryPlan(success,reason=''){const c=ensureCareerCycle(),p=c.activePlan;if(!p)return;c.activePlan=null;c.lastPlanEndWeek=state.week;if(success)c.lastRecoveryWeek=state.week;c.history.unshift({week:state.week,type:'plan-end',plan:p.id,success,reason});c.history=c.history.slice(0,24);const title=success?'The rebuild has restored room to manoeuvre':'The formal recovery window has ended';const body=success?`${state.studio.name} has repaired enough of its balance sheet and recent form to leave formal recovery mode. The next releases will decide whether the improvement becomes a lasting resurgence.`:`The temporary recovery measures have expired. ${state.studio.name} remains playable, but unresolved debt or weak runway is again being carried at normal operating terms.`;pushDeskItem({templateId:'recovery-plan-end',repeatKey:`recovery-plan-end:${state.week}`,family:'career-cycle',type:'finance',source:'Studio Strategy',urgency:success?'normal':'urgent',requiresAction:false,headline:title,body,choices:[],resolved:true,read:false,expanded:false});addNews(state,body,'Studio Watch')}
function startRecoveryPlan(id){const e=recoveryPlanEligibility(id);if(!e.ok)return showToast(e.reasons[0]||'That recovery plan is not available.');const c=ensureCareerCycle(),debt=state.finance?.bridgeDebt||0,plan={id,startWeek:state.week,endWeek:state.week+(id==='lean'?26:39),minEndWeek:state.week+8,startDebt:debt,startCash:state.cash,startScale:studioOperatingScale().id};if(id==='lean'){plan.label='Lean Rebuild';plan.desc='Temporarily consolidate the permanent operation. Fixed corporate and department overhead falls 24%, but the studio loses one simultaneous production slot and pauses expansion spending.';state.reputation.financial=clamp((state.reputation.financial||50)-2,15,95)}else{plan.label='Debt Restructure';plan.desc='Capitalise part of the emergency financing cost in exchange for a lower weekly interest rate while the studio rebuilds.';state.finance.bridgeDebt=+(debt*1.06).toFixed(3);plan.startDebt=state.finance.bridgeDebt;state.reputation.financial=clamp((state.reputation.financial||50)-3,15,95)}c.activePlan=plan;c.history.unshift({week:state.week,type:'plan-start',plan:id});c.history=c.history.slice(0,24);const body=id==='lean'?`${state.studio.name} has entered a 26-week lean rebuild. Fixed corporate and department overhead is reduced by 24%, one production slot is temporarily unavailable, and new department/capital expansion is frozen.`:`${state.studio.name} has restructured its bridge debt. Principal increased 6%, but the weekly interest rate is temporarily reduced from ${(state.finance.weeklyInterest*100).toFixed(1)}% to ${(effectiveBridgeWeeklyInterest()*100).toFixed(2)}% for up to 39 weeks.`;pushDeskItem({templateId:'recovery-plan-start',repeatKey:`recovery-plan-start:${state.week}`,family:'career-cycle',type:'finance',source:'Studio Strategy',urgency:'normal',requiresAction:false,headline:`${plan.label} begins`,body,choices:[],resolved:true,read:false,expanded:false});addNews(state,body,'Trade Finance');updateCareerCycle(true);save();render()}
function recoveryPlanPanel(){const c=ensureCareerCycle(),snap=careerFormSnapshot(),p=recoveryPlanProgress();if(c.activePlan){const plan=c.activePlan,lean=plan.id==='lean';return `<div class="section-title"><h2>Recovery plan</h2><span class="pill warn">ACTIVE</span></div><div class="card recovery-plan-active"><div class="row"><div><strong>${plan.label}</strong><div class="small">Started Week ${plan.startWeek}</div></div><span class="pill warn">${p?.pct||0}% signal</span></div><div class="body" style="margin-top:8px">${plan.desc}</div><div class="milestone-progress" style="margin-top:10px"><span style="width:${p?.pct||0}%"></span></div><div class="grid cols3" style="margin-top:10px"><div><span class="small">Bridge debt</span><strong>${money(state.finance?.bridgeDebt||0)}</strong></div><div><span class="small">Runway</span><strong>${snap.runway.label}</strong></div><div><span class="small">${lean?'Operating relief':'Weekly interest'}</span><strong>${lean?'24% fixed cost':(effectiveBridgeWeeklyInterest()*100).toFixed(2)+'%'}</strong></div></div><div class="small" style="margin-top:9px">The plan can end early after Week ${plan.minEndWeek} if debt, runway and recent film form recover. Otherwise its temporary terms expire in Week ${plan.endWeek}.</div></div>`}const lean=recoveryPlanEligibility('lean'),refi=recoveryPlanEligibility('refinance');if(!lean.ok&&!refi.ok&&snap.id!=='pressure')return '';return `<div class="section-title"><h2>Recovery strategy</h2><span class="small">Optional · no Game Over</span></div><div class="card"><div class="body"><strong>${snap.label}.</strong> ${snap.desc} A formal plan trades something real for breathing room; you can also ignore these options and recover through the slate alone.</div><div class="grid cols2" style="margin-top:12px"><div class="recovery-option"><div class="row"><strong>Lean Rebuild</strong><span class="pill ${lean.ok?'warn':''}">26 weeks</span></div><div class="small">−24% corporate + department overhead · −1 production slot · expansion frozen.</div><button class="btn block ${lean.ok?'primary':''}" data-recovery-plan="lean" style="margin-top:9px" ${lean.ok?'':'disabled'}>${lean.ok?'Begin Lean Rebuild':lean.reasons[0]||'Unavailable'}</button></div><div class="recovery-option"><div class="row"><strong>Debt Restructure</strong><span class="pill ${refi.ok?'warn':''}">Up to 39 weeks</span></div><div class="small">Bridge principal +6% now · weekly interest reduced 45% · financial reputation −3.</div><button class="btn block ${refi.ok?'primary':''}" data-recovery-plan="refinance" style="margin-top:9px" ${refi.ok?'':'disabled'}>${refi.ok?'Restructure Debt':refi.reasons[0]||'Unavailable'}</button></div></div></div>`}
function ensureNotifications(){
 if(!state.notifications)state.notifications=[];
 if(!state.notificationKeys)state.notificationKeys=[];
 if(state.activeNotificationId===undefined)state.activeNotificationId=null;
 if(!state.ids.notification)state.ids.notification=0;
}
function inferNotificationDestination(key,filmId,type,destination){
 if(destination)return destination;
 if(type==='finance'||key.startsWith('autobridge:'))return {screen:'studio',detail:{type:'finance'}};
 if(key.startsWith('script-ready:'))return {screen:'develop',detail:{type:'script',id:key.split(':')[1]}};
 if(filmId){if(key.startsWith('release:'))return {screen:'release',detail:{type:'review',id:filmId}};return {screen:'slate',detail:{type:'film',id:filmId}}}
 return {screen:'notifications',detail:null};
}
function normalizeDeskIds(st=state){
 const d=st.desk||(st.desk={items:[],archive:[],nextId:1,lastGeneratedWeek:0,seenIntro:false});
 d.items=Array.isArray(d.items)?d.items:[];d.archive=Array.isArray(d.archive)?d.archive:[];
 const used=new Set(),all=[...d.items,...d.archive];let next=1;
 all.forEach(item=>{
  const n=Number(item?.id);
  if(Number.isInteger(n)&&n>0&&!used.has(n)){item.id=n;used.add(n);next=Math.max(next,n+1);return}
  while(used.has(next))next++;
  item.id=next;used.add(next);next++;
 });
 let candidate=Number(d.nextId);
 if(!Number.isInteger(candidate)||candidate<1)candidate=next;
 candidate=Math.max(candidate,next);
 while(used.has(candidate))candidate++;
 d.nextId=candidate;
 (st.notifications||[]).forEach(n=>{
  const item=all.find(x=>(x.notificationId&&x.notificationId===n.id)||(x.notificationKey&&x.notificationKey===n.key));
  if(item){n.deskId=item.id;if(n.destination?.deskId!==undefined)n.destination.deskId=item.id}
 });
 return d;
}
function deskItemById(id,d=ensureDeskStateLite()){
 const key=String(id);return d.items.find(x=>String(x.id)===key)||null;
}
function ensureDeskStateLite(st=state){
 st.desk=st.desk||{items:[],archive:[],nextId:1,lastGeneratedWeek:0,seenIntro:false};return normalizeDeskIds(st);
}
function notificationDeskSource(type,key=''){
 if(type==='milestone')return 'Studio Legacy';
 if(type==='finance'||String(key).startsWith('autobridge:'))return 'Finance Office';
 if(String(key).startsWith('prod:')||String(key).startsWith('post:'))return 'Production Office';
 if(String(key).startsWith('marketing:'))return 'Campaign Room';
 return 'Studio Operations';
}
function mirrorNotificationToDesk(n){
 if(!state.studio||n.destination?.deskId)return null;
 // Signature campaign/release moments already surface full-screen; do not mirror them as resolved Desk clutter.
 if(/^(mkt:|release:)/.test(n.key||''))return null;
 const d=ensureDeskStateLite(),existing=d.items.find(i=>i.notificationKey===n.key);if(existing){n.deskId=existing.id;return existing}
 const hard=/^(prod:|post:|marketing:)/.test(n.key||'');
 const item={id:d.nextId++,week:n.week,day:n.day,read:false,expanded:hard,resolved:!hard,archived:false,urgency:n.type==='warning'?'urgent':'normal',type:'system',source:notificationDeskSource(n.type,n.key),choices:[],requiresAction:hard,headline:n.title,body:n.body,filmId:n.filmId||null,notificationKey:n.key,destination:n.destination||null,system:true};
 d.items.unshift(item);d.items=d.items.slice(0,100);n.deskId=item.id;return item;
}
function syncOperationalDeskItems(){
 const d=ensureDeskStateLite();
 d.items.forEach(item=>{
  if(!item.system||item.resolved||!item.notificationKey)return;
  const key=item.notificationKey,f=item.filmId?filmById(item.filmId):null;
  let waiting=false;
  if(key.startsWith('prod:'))waiting=!!(f&&f.stage==='production'&&f.pendingEvent);
  else if(key.startsWith('post:'))waiting=!!(f&&f.stage==='post'&&!ensurePostState(f).firstDecisionMade);
  else if(key.startsWith('marketing:'))waiting=!!(f&&f.stage==='marketing');
  else return;
  if(!waiting){item.resolved=true;item.requiresAction=false;item.read=true;item.expanded=false;item.resolvedWeek=state.week}
 });
}
function notify(key,title,body,filmId=null,requiresAction=false,type='info',destination=null){
 ensureNotifications();if(state.notificationKeys.includes(key))return null;state.notificationKeys.push(key);
 const n={id:uid('notification',state),key,title,body,filmId,requiresAction,type,week:state.week,day:typeof currentCalendarDay==='function'?currentCalendarDay():null,read:false,destination:inferNotificationDestination(key,filmId,type,destination)};
 state.notifications.unshift(n);
 // Notifications remain an internal routing/log mechanism. Studio Desk is the one persistent inbox.
 // Existing Desk-originated items are not duplicated; all other notices are mirrored once.
 const item=mirrorNotificationToDesk(n);
 if(n.destination?.deskId){n.read=true;const existing=state.desk?.items?.find(x=>x.id===n.destination.deskId);if(existing)n.deskId=existing.id}
 // No modal notification overlay is armed here. Hard lifecycle actions stop the calendar,
 // while optional information accumulates in Studio Desk.
 state.activeNotificationId=null;
 return n;
}
function markNotification(id){ensureNotifications();const n=state.notifications.find(x=>x.id===id);if(n)n.read=true;if(state.activeNotificationId===id)state.activeNotificationId=null}
function openNotificationTarget(n){
 if(!n)return;markNotification(n.id);const t=n.destination||inferNotificationDestination(n.key,n.filmId,n.type,null);
 const targetScreen=t.screen||'notifications',targetDetail=t.detail||null;
 const same=state.screen===targetScreen&&JSON.stringify(state.detail||null)===JSON.stringify(targetDetail||null)&&(t.studioTab?state.uiStudioTab===t.studioTab:true)&&(t.legacyTab?state.uiLegacyTab===t.legacyTab:true);
 if(!same){
  const y=(typeof window!=='undefined'&&window.scrollY)||0;
  state.history=state.history||[];
  state.history.push({screen:state.screen,detail:deep(state.detail),scrollY:y});
  state.screen=targetScreen;state.detail=targetDetail;if(t.studioTab)state.uiStudioTab=t.studioTab;if(t.studioTab==='desk')state.uiDeskTab='briefing';if(t.legacyTab)state.uiLegacyTab=t.legacyTab;requestScrollTop();
 }else{if(t.studioTab)state.uiStudioTab=t.studioTab;if(t.studioTab==='desk')state.uiDeskTab='briefing';if(t.legacyTab)state.uiLegacyTab=t.legacyTab}
 if(t.deskId){const item=state.desk?.items?.find(x=>x.id===t.deskId);if(item)item.expanded=true}
 save();render();
}
function notificationOverlay(){
 // Studio Desk is the persistent inbox. Signature moments and hard checkpoints
 // render through their own routes; this hook remains for renderer compatibility.
 return '';
}
function toggleProjectHold(f){
 if(!f||f.stage!=='development')return;
 f.paused=!f.paused;
 f.history.push(`Week ${state.week}: development ${f.paused?'put on hold':'resumed'}.`);
 addNews(state,`${f.title} development ${f.paused?'was placed on hold':'resumed'}.`,'Your Studio');
 rebuildDecisions();save();render();
}
let renderedRouteKey=null,pendingScrollMode=null,pendingScrollRestore=0;
function routeKey(){const d=state.detail||null,phase=d?.type==='film'?(state.films||[]).find(f=>f.id===d.id)?.stage||'':'';return `${state.screen}|${JSON.stringify(d)}|${phase}`}
function requestScrollTop(){pendingScrollMode='top'}
function requestScrollRestore(y){pendingScrollMode='restore';pendingScrollRestore=y||0}
function applyNavigationScroll(){
 if(typeof window==='undefined')return;
 const key=routeKey(),changed=renderedRouteKey!==null&&renderedRouteKey!==key;renderedRouteKey=key;
 if(pendingScrollMode==='restore')setTimeout(()=>window.scrollTo(0,pendingScrollRestore||0),0);
 else if(pendingScrollMode==='top'||changed)setTimeout(()=>window.scrollTo(0,0),0);
 pendingScrollMode=null;pendingScrollRestore=0;
}
function push(screen,detail=null){const y=(typeof window!=='undefined'&&window.scrollY)||0;state.history.push({screen:state.screen,detail:deep(state.detail),scrollY:y});state.screen=screen;state.detail=detail;requestScrollTop();save();render()}
function routeToHardBlocker(blocker,preserveHistory=true){
 const f=blocker?.filmId?filmById(blocker.filmId):null;if(!f)return false;
 const already=state.detail?.type==='film'&&state.detail.id===f.id;
 if(preserveHistory&&!already){
  state.history=state.history||[];
  state.history.push({screen:state.screen,detail:deep(state.detail),scrollY:(typeof window!=='undefined'&&window.scrollY)||0});
  state.history=state.history.slice(-30);
 }
 state.screen='slate';state.detail={type:'film',id:f.id};requestScrollTop();return true;
}
function back(){
 state.history=state.history||[];const p=state.history.pop();
 if(p){state.screen=p.screen;state.detail=p.detail;requestScrollRestore(p.scrollY||0);save();render();return}
 if(state.detail){state.detail=null;requestScrollTop();save();render()}
}
function navTo(screen){state.history=[];state.detail=null;state.screen=screen;requestScrollTop();save();render()}
