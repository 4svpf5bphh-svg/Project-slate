// Shared screenplay, packaging, fit and release-planning model

function generateScript(st,week,market=true){
 const r=makeRng(hash(st.seed+'|script-v28|'+week+'|'+st.ids.script)),genre=pick(r,genres),concept=generatedPremise(st,r,genre);
 const s={id:uid('script',st),title:concept.title,genre,logline:concept.logline,synopsis:'',shape:concept.shape,premiseDNA:concept.premiseDNA,price:0,naturalBudget:marketBudgetForGenre(r,genre),
  story:Math.round(48+r()*44),hook:Math.round(45+r()*50),originality:Math.round(43+r()*53),access:Math.round(43+r()*51),difficulty:Math.round(32+r()*61),
  source:'Market',status:market?'market':'development',owner:null,filmStarted:false,developmentSpend:0,available:market,createdWeek:week,bids:0};
 ensureScriptEcosystem(s);s.price=marketScriptPrice(s,r);
 st.scripts.push(s);if(market)st.market.push(s.id);return s;
}
function randomLogline(r,g){return generatedPremise(state,r,g).logline}
function scriptAssessment(s){
 let strength=s.story+s.hook+s.originality;
 if(strength>250)return 'Development considers this unusually strong material with both creative and commercial possibilities.';
 if(s.hook>84)return 'The concept is highly marketable, but the screenplay execution may determine whether it becomes a hit or simply opens well.';
 if(s.story>84)return 'The writing team is especially positive on character and structure, though the concept may need careful positioning.';
 if(s.difficulty>82)return 'Ambitious material with significant production demands. Underfunding this project could be particularly damaging.';
 return 'A viable project with identifiable strengths and risks. The team does not regard the outcome as obvious.';
}
function naturalRange(s){return [Math.round(s.naturalBudget*.85),Math.round(s.naturalBudget*1.15)]}
function defaultCreative(){return {positioning:'balanced',tone:'balanced',rating:'mainstream',emphasis:'balanced'}}
function creativeLabel(f){const c=f.creative||defaultCreative();return `${c.positioning} · ${c.tone} · ${c.rating} · ${c.emphasis}`}
function adjacentGenre(a,b){
 const groups=[['Action Thriller','Crime Thriller'],['Psychological Horror','Crime Thriller'],['Prestige Drama','Crime Thriller'],['Science Fiction','Fantasy'],['Family Adventure','Fantasy'],['Comedy','Family Adventure']];
 return groups.some(g=>g.includes(a)&&g.includes(b));
}
function directorScaleComfort(t){return clamp(6+(t.commercial-50)*.34+(t.budgetControl-50)*.22+t.fee*1.7,7,48)}
function fitContributor(key,delta,positive,negative){
 return {key,delta:+delta.toFixed(2),text:delta>=0?positive:negative};
}
function strongestFitEvidence(breakdown,max=4){
 const items=(breakdown?.contributors||[]).filter(x=>Math.abs(x.delta)>=.75).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));
 const positives=items.filter(x=>x.delta>0),negatives=items.filter(x=>x.delta<0),picked=[];
 if(positives[0])picked.push(positives[0]);if(negatives[0])picked.push(negatives[0]);
 items.forEach(x=>{if(picked.length<max&&!picked.includes(x))picked.push(x)});
 return picked.slice(0,max).map(x=>x.text);
}
function directorProjectFitBreakdown(t,f){
 const sc=scriptById(f.scriptId),c=f.creative||defaultCreative(),contributors=[];let score=58;
 const add=(x)=>{score+=x.delta;contributors.push(x)};
 if(t.genres.includes(f.genre))add(fitContributor('genre',16,`Direct ${f.genre.toLowerCase()} experience is a major positive.`,`Genre experience works against this project.`));
 else if(t.genres.some(g=>adjacentGenre(g,f.genre)))add(fitContributor('genre',4,'Adjacent genre experience provides some useful evidence.',''));
 else add(fitContributor('genre',-12,'',`No meaningful ${f.genre.toLowerCase()} track record is a significant creative risk.`));
 const scale=directorScaleComfort(t);
 if(f.budget>scale*1.25)add(fitContributor('scale',-13,'',`${money(f.budget)} is well above the production scale the studio considers proven for ${t.name}.`));
 else if(f.budget>scale)add(fitContributor('scale',-6,'',`The project is somewhat larger than ${t.name}'s demonstrated comfort zone.`));
 if(sc.difficulty>78&&t.craft<80)add(fitContributor('difficulty',-8,'','The screenplay is unusually difficult relative to the director’s proven craft level.'));
 if(c.positioning==='commercial'){
  const d=(t.commercial-72)*.18;add(fitContributor('commercial',d,'Commercial positioning plays to a strong audience instinct.','Commercial positioning exposes a weaker audience instinct.'));
 }
 if(c.positioning==='prestige'){
  const craft=(t.craft-80)*.20;add(fitContributor('prestigeCraft',craft,'Prestige positioning plays directly to the director’s craft profile.','Prestige positioning asks more of the director’s craft profile than the evidence supports.'));
  if(t.commercial>90)add(fitContributor('prestigeBias',-2,'','The director’s strongest evidence is unusually commercial for this prestige brief.'));
 }
 if(c.emphasis==='performance'){
  const d=(t.actorDirection-78)*.20;add(fitContributor('performance',d,'Performance-first emphasis fits the director’s actor-direction strength.','Performance-first emphasis exposes a weakness in actor direction.'));
 }
 if(c.emphasis==='spectacle'){
  const b=(t.budgetControl-74)*.13;add(fitContributor('budgetControl',b,'Spectacle planning is supported by good budget discipline.','Spectacle emphasis increases execution risk under weaker budget discipline.'));
  const d=(t.commercial-72)*.08;add(fitContributor('spectacleCommercial',d,'Commercial instinct supports the spectacle brief.','The spectacle brief is not strongly supported by commercial instinct.'));
 }
 if(c.tone==='grounded'){
  const d=(t.actorDirection-78)*.08;add(fitContributor('groundedTone',d,'A grounded tone fits the director’s performance instincts.','A grounded tone may expose limitations in performance direction.'));
 }
 if(c.tone==='heightened'){
  const d=(t.commercial-72)*.08;add(fitContributor('heightenedTone',d,'Heightened material fits the director’s audience-facing instincts.','Heightened material is less naturally aligned with the director’s audience-facing instincts.'));
 }
 return {score:clamp(score,18,96),contributors,base:58};
}
function directorProjectFit(t,f){return directorProjectFitBreakdown(t,f).score}

function actorProjectFitBreakdown(t,f){
 const sc=scriptById(f.scriptId),c=f.creative||defaultCreative(),contributors=[];let score=55;
 const add=(x)=>{score+=x.delta;contributors.push(x)};
 if(t.genres.includes(f.genre))add(fitContributor('genre',15,`Credible ${f.genre.toLowerCase()} experience is a major positive.`,`Genre experience works against this project.`));
 else if(t.genres.some(g=>adjacentGenre(g,f.genre)))add(fitContributor('genre',4,'Adjacent genre experience gives the casting team some supporting evidence.',''));
 else add(fitContributor('genre',-11,'',`No direct ${f.genre.toLowerCase()} evidence makes this a meaningful casting gamble.`));
 const craft=(t.acting-76)*.18;add(fitContributor('acting',craft,'Acting craft strengthens the case for the role.','Acting craft is below what this material ideally wants.'));
 if(c.positioning==='prestige'||c.emphasis==='performance'){
  const d=(t.acting-78)*.17;add(fitContributor('performanceBrief',d,'The performance-led brief plays to this actor’s strongest evidence.','The performance-led brief asks more of the actor than the current craft evidence supports.'));
 }
 if(c.positioning==='commercial'){
  const d=(t.star-55)*.06;add(fitContributor('starPower',d,'Star value supports a commercially positioned release.','The actor adds limited pre-release awareness to a commercially positioned film.'));
 }
 if(c.tone==='grounded'&&t.acting<79)add(fitContributor('groundedTone',-5,'','The grounded tone could expose limitations in dramatic precision.'));
 if(c.tone==='heightened'&&t.star>70)add(fitContributor('heightenedTone',3,'Heightened material suits the actor’s screen presence.',''));
 if(sc.difficulty>74&&t.reliability<70)add(fitContributor('reliability',-8,'','Low reliability is a real concern on this demanding production.'));
 if(t.momentum<50)add(fitContributor('momentum',-4,'','Recent market momentum is weak.'));else if(t.momentum>84)add(fitContributor('momentum',3,'Current momentum gives the casting extra market value.',''));
 if(t.fee>Math.max(2,f.budget*.30))add(fitContributor('fee',-5,'',`The fee is heavy relative to a ${money(f.budget)} production budget.`));
 return {score:clamp(score,18,96),contributors,base:55};
}
function actorProjectFit(t,f){return actorProjectFitBreakdown(t,f).score}

function fitBand(score){
 if(score>=82)return {label:'Strong project fit',cls:'good'};
 if(score>=67)return {label:'Plausible fit',cls:'blue'};
 if(score>=52)return {label:'Risky fit',cls:'warn'};
 return {label:'Poor fit',cls:'bad'};
}
function directorFitEvidence(t,f){return strongestFitEvidence(directorProjectFitBreakdown(t,f),4)}
function actorFitEvidence(t,f){return strongestFitEvidence(actorProjectFitBreakdown(t,f),4)}

function packageFitSummary(f){
 if(!f.directorId||f.cast.length<2)return null;
 const d=talentById(f.directorId),actors=f.cast.map(talentById),ds=directorProjectFit(d,f),as=actors.map((a,i)=>typeof actorRoleFit==='function'?actorRoleFit(a,f,`lead${i+1}`):actorProjectFit(a,f));
 return {director:ds,actors:as,average:(ds+as[0]+as[1])/3};
}
function marketingRecommended(f){return Math.max(3,f.budget*.50)}
function marketingLeadInfo(f){
 const rec=marketingRecommended(f),ratio=rec?f.marketing/rec:0;let tier,lead,slots;
 if(ratio<.28){tier='Minimal / grassroots';lead=2;slots=6}
 else if(ratio<.68){tier='Lean campaign';lead=4;slots=5}
 else if(ratio<1.15){tier='Standard campaign';lead=6;slots=4}
 else{tier='Major campaign';lead=9;slots=3}
 if(f.campaign==='event'){lead+=2;slots=Math.max(2,slots-1);tier=tier+' + event build'}
 if(f.campaign==='mystery'){lead=Math.max(2,lead-1)}
 if(typeof marketingExtraLead==='function'){const extra=marketingExtraLead(f);lead+=extra;if(extra>0)slots=Math.max(2,slots-1)}
 return {rec,ratio,tier,lead,slots,earliest:state.week+lead};
}
function validReleaseWeeks(f){const x=marketingLeadInfo(f);return Array.from({length:x.slots},(_,i)=>x.earliest+i)}


// Role-specific casting and professional talent interest.
// Casting roles are deterministic from the screenplay/genre and do not alter save size materially.

const ROLE_ARCHETYPES={
 'Action Thriller':[
  ['The Driver','A kinetic lead who must sell competence under pressure.',31,46,.48,.28,.24],
  ['The Pursuer','A forceful counter-lead built around authority and intensity.',34,53,.42,.34,.24],
  ['The Handler','A supporting role that needs authority and reliability more than spectacle.',38,62,.45,.18,.37],
  ['The Wildcard','A high-energy supporting turn that can steal scenes if the performer is specific enough.',24,48,.55,.28,.17]
 ],
 'Psychological Horror':[
  ['The Witness','The emotional centre; fear only works if the performance feels psychologically precise.',25,43,.62,.12,.26],
  ['The Doubter','A grounded counterweight who has to make disbelief feel intelligent rather than passive.',31,54,.56,.14,.30],
  ['The Authority','A supporting presence whose credibility can stabilise an increasingly unreal story.',38,65,.46,.16,.38],
  ['The Disturbance','A smaller but distinctive role requiring specificity and unusual screen presence.',22,50,.61,.24,.15]
 ],
 'Prestige Drama':[
  ['The Anchor','The dramatic centre of gravity; emotional detail matters more than star power.',28,55,.68,.10,.22],
  ['The Counterpoint','A second lead whose chemistry and restraint carry the conflict.',30,60,.64,.12,.24],
  ['The Confidant','A supporting performance that must make limited screen time feel lived-in.',34,68,.66,.08,.26],
  ['The Catalyst','A compact role that changes the story when they enter it.',27,58,.62,.18,.20]
 ],
 'Science Fiction':[
  ['The Explorer','A lead balancing wonder, intelligence and large-scale production demands.',27,48,.48,.27,.25],
  ['The Architect','A cerebral counter-lead who must make exposition feel human.',30,56,.57,.16,.27],
  ['The Commander','A supporting authority figure who helps sell the scale of the world.',38,66,.44,.19,.37],
  ['The Outsider','A distinctive supporting role designed to make the world feel stranger.',23,51,.58,.25,.17]
 ],
 'Comedy':[
  ['The Instigator','A lead who needs timing, charisma and enough warmth to survive bad decisions.',24,46,.49,.34,.17],
  ['The Foil','The counter-lead; reaction, chemistry and precision are as important as jokes.',25,50,.55,.25,.20],
  ['The Scene-Stealer','A supporting role with unusually high upside for a performer with timing.',24,60,.58,.29,.13],
  ['The Straight Face','A supporting counterweight whose restraint gives the rest of the ensemble room.',31,64,.54,.12,.34]
 ],
 'Family Adventure':[
  ['The Adventurer','A lead who needs warmth, momentum and broad audience accessibility.',20,42,.43,.36,.21],
  ['The Guardian','A second lead carrying authority without losing warmth.',30,57,.48,.22,.30],
  ['The Mentor','A supporting role where presence and reliability matter heavily.',40,72,.47,.19,.34],
  ['The Companion','A lively supporting part that benefits from charm more than prestige weight.',20,49,.43,.39,.18]
 ],
 'Crime Thriller':[
  ['The Investigator','A lead demanding control, intelligence and quiet authority.',28,55,.58,.19,.23],
  ['The Operator','A morally flexible counter-lead where charisma and danger have to coexist.',28,54,.51,.29,.20],
  ['The Insider','A supporting role whose credibility is essential to the machinery of the plot.',34,67,.50,.13,.37],
  ['The Liability','A supporting performance built around volatility and specificity.',22,51,.58,.26,.16]
 ],
 'Fantasy':[
  ['The Chosen','A lead carrying mythology, spectacle and emotional accessibility.',20,42,.47,.35,.18],
  ['The Rival','A counter-lead requiring presence and enough craft to sell heightened material.',24,50,.50,.31,.19],
  ['The Elder','A supporting role built around authority, texture and world credibility.',42,78,.50,.16,.34],
  ['The Trickster','A vivid supporting part where charisma and distinctiveness can expand the world.',22,58,.48,.37,.15]
 ]
};
function ensureFilmRoles(f){
 if(!f)return [];
 const templates=ROLE_ARCHETYPES[f.genre]||ROLE_ARCHETYPES['Prestige Drama'];
 if(!Array.isArray(f.roles)||f.roles.length<4){
  const r=makeRng(hash(state.seed+'|roles|'+f.id+'|'+f.title+'|'+f.genre));
  f.roles=templates.map((x,i)=>{
   const [name,desc,min,max,craft,star,reliability]=x;
   const shift=Math.floor((r()-.5)*6);
   return {id:i<2?`lead${i+1}`:`support${i-1}`,index:i,type:i<2?'lead':'support',name,desc,ageMin:Math.max(18,min+shift),ageMax:max+shift,craft,star,reliability};
  });
 }
 f.roleAssignments=f.roleAssignments||{};
 if(!f.roleAssignments.lead1&&f.cast?.[0])f.roleAssignments.lead1=f.cast[0];
 if(!f.roleAssignments.lead2&&f.cast?.[1])f.roleAssignments.lead2=f.cast[1];
 (f.supportingCastIds||[]).forEach((id,i)=>{if(i<2&&!f.roleAssignments[`support${i+1}`])f.roleAssignments[`support${i+1}`]=id});
 // One performer can only occupy one role in a film package. Heal legacy/edge-case duplicates
 // deterministically by keeping the first role in package order.
 const seen=new Set();
 ['lead1','lead2','support1','support2'].forEach(k=>{const id=f.roleAssignments[k];if(!id)return;if(seen.has(id))delete f.roleAssignments[k];else seen.add(id)});
 const l1=f.roleAssignments.lead1||null,l2=f.roleAssignments.lead2||null;
 f.cast=[l1,l2].filter(Boolean);
 f.supportingCastIds=['support1','support2'].map(k=>f.roleAssignments[k]).filter(Boolean);
 f.supportingCastId=f.supportingCastIds[0]||null;
 f.castingTargetRole=f.castingTargetRole||'lead1';
 return f.roles;
}
function roleById(f,id){return ensureFilmRoles(f).find(x=>x.id===id)||ensureFilmRoles(f)[0]}
function castingTargetRole(f){return roleById(f,f.castingTargetRole||'lead1')}
function roleForTalent(f,tid){
 ensureFilmRoles(f);const entry=Object.entries(f.roleAssignments||{}).find(([,id])=>id===tid);return entry?roleById(f,entry[0]):null;
}
function actorRoleFitBreakdown(t,f,roleRef=null){
 const role=typeof roleRef==='number'?ensureFilmRoles(f)[roleRef]:roleRef?roleById(f,roleRef):castingTargetRole(f);
 const base=actorProjectFitBreakdown(t,f),contributors=[...(base.contributors||[])];let score=base.base;
 contributors.forEach(x=>score+=x.delta);
 const add=(x)=>{score+=x.delta;contributors.push(x)};
 const hasAge=Number.isFinite(t.age),age=t.age;
 if(hasAge){
  const inside=age>=role.ageMin&&age<=role.ageMax;
  if(inside)add(fitContributor('roleAge',4,`Fits ${role.name}'s intended ${role.ageMin}–${role.ageMax} screen-age lane.`,`Age alignment works against this role.`));
  else{
   const distance=age<role.ageMin?role.ageMin-age:age-role.ageMax,delta=-Math.min(13,2+distance*.55);
   add(fitContributor('roleAge',delta,'',`Would significantly reframe ${role.name}, currently conceived in the ${role.ageMin}–${role.ageMax} screen-age lane.`));
  }
 }
 const craft=(t.acting||72)-76,star=(t.star||45)-60,rel=(t.reliability||75)-75;
 const craftDelta=craft*role.craft*.20;add(fitContributor('roleCraft',craftDelta,`${role.name} is performance-dependent and the actor’s craft supports the part.`,`${role.name} asks for more performance craft than the actor’s current evidence supports.`));
 const starDelta=star*role.star*.09;add(fitContributor('roleStar',starDelta,`${role.name} benefits from presence and campaign value that this actor can provide.`,`${role.name} wants more screen presence / campaign value than this actor currently brings.`));
 const relDelta=rel*role.reliability*.10;add(fitContributor('roleReliability',relDelta,`Reliability is particularly valuable in ${role.name} and supports the casting case.`,`Reliability is a concern for the demands of ${role.name}.`));
 if(role.type==='support'&&(t.star||0)>90)add(fitContributor('supportScale',-5,'','This star is unusually large for the supporting role and may distort the package.'));
 if(role.type==='support'&&(t.acting||0)>=90)add(fitContributor('supportCraft',2,`Exceptional craft creates scene-stealing upside in ${role.name}.`,''));
 return {score:clamp(score,15,98),contributors,role};
}
function actorRoleFit(t,f,roleRef=null){return actorRoleFitBreakdown(t,f,roleRef).score}

function roleFitEvidence(t,f,roleRef=null){
 return strongestFitEvidence(actorRoleFitBreakdown(t,f,roleRef),4);
}

function auditionKey(tid,roleId){return `${tid}|${roleId}`}
function auditionForRole(f,tid,roleId=null){
 ensureFilmRoles(f);const rid=roleId||castingTargetRole(f).id;
 return f.auditions?.[auditionKey(tid,rid)]||f.auditions?.[tid]||null;
}
function castingRoleAssignment(f,roleId){ensureFilmRoles(f);return f.roleAssignments?.[roleId]||null}
function syncRoleAssignments(f){
 ensureFilmRoles(f);
 const l1=f.roleAssignments.lead1||null,l2=f.roleAssignments.lead2||null;
 f.cast=[l1,l2].filter(Boolean);
 f.supportingCastIds=['support1','support2'].map(k=>f.roleAssignments[k]).filter(Boolean);
 f.supportingCastId=f.supportingCastIds[0]||null;
}
function setCastingTargetRole(f,roleId){
 const role=roleById(f,roleId);if(!role||role.type!=='lead')return;
 f.castingTargetRole=role.id;save();render();
}
function talentProjectInterest(t,f,roleRef=null,mode='select'){
 const role=roleRef&&typeof roleRef==='object'?roleRef:roleById(f,roleRef||castingTargetRole(f).id),fit=actorRoleFit(t,f,role.id),studioRel=t.relationship||0;
 const returning=f.ipParentId&&filmById(f.ipParentId)?.cast?.includes(t.id),option=f.sequelOptions?.includes(t.id),audition=auditionForRole(f,t.id,role.id);
 if(option)return {accept:true,score:100,reason:'Contracted sequel option',fit,roleId:role.id};
 // Agreeing to audition means the performer is genuinely open to this exact role.
 // Contract terms still matter later, but we do not make them randomly refuse the role
 // immediately after voluntarily reading for it.
 if(mode==='select'&&audition)return {accept:true,score:Math.max(76,fit),reason:`Having screen-tested for ${role.name}, the performer remains open to the role.`,fit,roleId:role.id};
 let score=48+(fit-62)*.58+studioRel*.22;
 score+=agencyInterestModifier(t,f);
 if(agencyWindow(t,f))score+=12;
 if((t.discoveryWindowUntil||0)>=state.week&&t.emerging)score+=10;
 score+=(f.creative?.positioning==='prestige'&&t.acting>=88)?5:0;
 score+=(f.creative?.positioning==='commercial'&&t.star>=85)?3:0;
 score+=(returning?9:0);
 score+=(role.type==='lead'?5:-2);
 score-=(t.momentum>=90&&role.type==='support'?9:0);
 score-=(t.star>=92&&f.budget<12?8:0);
 score-=(t.fee>Math.max(2,f.budget*.35)?4:0);
 if(mode==='audition'&&t.star>=88)score-=7; // major stars less willing to read unless project/role really fits
 const r=makeRng(hash(state.seed+`|interest|${f.id}|${t.id}|${role.id}|${mode}|${f.auditionRound||1}`));
 const roll=r()*100,accept=roll<clamp(score,12,96);
 let reason='The performer is open to the project.';
 if(!accept){
  if(fit<54)reason=`The team does not feel ${role.name} is a convincing enough fit.`;
  else if(role.type==='support'&&t.momentum>=86)reason='The representatives are looking for a larger part at this point in the career.';
  else if(t.star>=88&&f.budget<12)reason='The project is currently too small for the performer’s market position.';
  else if(studioRel<0)reason='The existing relationship with the studio is not strong enough to overcome reservations about the part.';
  else if(mode==='audition'&&t.star>=84)reason='The representatives declined to put the performer through an audition process for this role.';
  else if(t.momentum>=82&&role.type==='lead')reason='Recent momentum has raised the bar for the performer’s next lead role; the representatives want more obvious career upside.';
  else if((t.credits||[]).slice(-3).some(c=>c.genre===f.genre))reason='The agent feels this part is too close to the performer’s recent work.';
  else reason='The representatives passed after weighing the role, package, studio relationship and the performer’s current career position.';
 }
 return {accept,score,reason,fit,roleId:role.id};
}
function markTalentDecline(f,t,roleId,reason,mode='role'){
 f.castingDeclines=f.castingDeclines||{};
 f.castingDeclines[auditionKey(t.id,roleId)]={week:state.week,reason,mode};
 addNews(state,`${t.name} has passed on ${roleById(f,roleId).name} in ${f.title}. ${reason}`,'Casting');
}
function talentDeclineForRole(f,tid,roleId=null){const rid=roleId||castingTargetRole(f).id;return f.castingDeclines?.[auditionKey(tid,rid)]||null}
function assignLeadRole(f,roleId,tid){
 ensureFilmRoles(f);const role=roleById(f,roleId),t=talentById(tid);if(!role||role.type!=='lead'||!t)return false;
 const existing=roleForTalent(f,tid);
 if(existing&&existing.id!==role.id){showToast(`${t.name} is already cast as ${existing.name}. Remove them from that role before offering another part.`);return false}
 const decline=talentDeclineForRole(f,tid,role.id);if(decline?.mode==='role')return showToast(`${t.name} has already passed on ${role.name}.`);
 const interest=talentProjectInterest(t,f,role,'select');
 if(!interest.accept){markTalentDecline(f,t,role.id,interest.reason,'role');save();render();return false}
 const previous=f.roleAssignments[role.id];if(previous&&previous!==tid&&f.invitationAttachedTalentId===previous)return showToast(`${talentById(previous)?.name||'The attached performer'} is part of the package and cannot be replaced through normal casting.`);if(previous&&previous!==tid)clearTalentContract(f,previous);
 f.roleAssignments[role.id]=tid;syncRoleAssignments(f);
 const nextLead=ensureFilmRoles(f).find(r=>r.type==='lead'&&r.id!==role.id&&!f.roleAssignments[r.id]);
 f.castingTargetRole=nextLead?.id||role.id;
 f.history=f.history||[];f.history.push(`${typeof calendarDateLabel==='function'?calendarDateLabel():'Week '+state.week}: ${t.name} attached as ${role.name}.`);
 if(nextLead)showToast(`${t.name} is cast as ${role.name}. Now casting ${nextLead.name}.`);
 return true;
}
function rolePackageSummary(f){
 ensureFilmRoles(f);return ensureFilmRoles(f).map(role=>({role,tid:f.roleAssignments[role.id]||null,talent:f.roleAssignments[role.id]?talentById(f.roleAssignments[role.id]):null}));
}


// Greenlight review: executive-facing summary before irreversible production spend.
function greenlightReviewData(f){
 ensurePackagingState(f);ensureProductionDepth(f);ensureFilmRoles(f);
 const s=ensureScriptEcosystem(scriptById(f.scriptId)),cov=scriptCoverage(s),d=talentById(f.directorId),fit=packageFitSummary(f),castingEvidence=packageCastingEvidence(f),req=supportingCastRequirement(f);
 const natural=s.naturalBudget||f.budget,ratio=f.budget/Math.max(1,natural),depth=productionDepthCost(f),talent=agreedUpfront(f),commitment=f.budget+talent+depth,cashAfter=state.cash-commitment;
 const roleRows=rolePackageSummary(f).filter(x=>x.role.type==='lead'||x.tid).map(x=>({role:x.role,talent:x.talent,evidence:x.talent?castingEvidenceFor(x.talent,f,x.role.id):null}));
 const attached=[d,...roleRows.map(x=>x.talent)].filter(Boolean),unavailable=attached.filter(t=>talentUnavailableForFilm(t,f));
 const strengths=[],risks=[];
 if(cov.readiness==='Packaging-ready')strengths.push('The screenplay is entering production from a strong development position.');
 else if(cov.readiness==='Needs development')risks.push('Coverage still sees unresolved screenplay risk going into production.');
 if(castingEvidence.cls==='good')strengths.push('Both principal roles produced strong screen-test evidence.');
 else if(castingEvidence.tested<2)risks.push('At least one principal role is being greenlit without a screen test. The market profile is known; the role fit is not.');
 else if(castingEvidence.cls==='warn'||castingEvidence.cls==='bad')risks.push('The principal cast produced mixed role-specific evidence before greenlight.');
 if(ratio<.80)risks.push(`The production budget is materially below the screenplay's natural ${money(natural)} scale.`);
 else if(ratio>=.95&&ratio<=1.18)strengths.push('Production funding is close to the screenplay’s natural scale.');
 else if(ratio>1.35)risks.push('The film is funded well above its natural scale, increasing break-even pressure without equivalent creative upside.');
 if(d&&f.budget>directorScaleComfort(d)+5)risks.push(`${d.name} is being asked to operate above the scale where the studio has the strongest evidence.`);
 if(f.effectsApproach==='digital'&&ratio<.92)risks.push('The VFX-forward plan is exposed by the current level of production funding.');
 if(cashAfter<8)risks.push(`Greenlighting leaves only ${money(Math.max(0,cashAfter))} in studio cash before later post and marketing spend.`);
 else if(cashAfter>=20)strengths.push('The studio retains meaningful liquidity after the production commitment.');
 if(req.required&&req.complete)strengths.push(`${req.label} casting is complete for the current production scale.`);
 if(unavailable.length)risks.unshift(`${unavailable.map(t=>t.name).join(', ')} ${unavailable.length===1?'is':'are'} currently unavailable, so greenlight is blocked until the package is repaired.`);
 return {script:s,coverage:cov,director:d,fit,castingEvidence,requirement:req,natural,ratio,depth,talent,commitment,cashAfter,roleRows,unavailable,strengths:strengths.slice(0,4),risks:risks.slice(0,5)};
}
function greenlightRiskLabel(data){
 const n=data.risks.length;
 return n>=4?{label:'High execution exposure',cls:'bad'}:n>=2?{label:'Meaningful execution risk',cls:'warn'}:n===1?{label:'Manageable risk',cls:'blue'}:{label:'Well-aligned package',cls:'good'};
}


// Release-window strategy and public pre-release tracking.
// Tracking is intentionally fallible and uses public-facing campaign signals rather than hidden film quality.

function releaseSeasonFit(genre,week){
 const y=((week-1)%52)+1;
 const bands={
  'Psychological Horror':[[38,45,.055],[1,6,.018]],
  'Family Adventure':[[24,33,.045],[48,52,.055]],
  'Action Thriller':[[20,34,.038],[46,51,.015]],
  'Science Fiction':[[20,34,.045],[46,51,.020]],
  'Fantasy':[[20,34,.040],[47,52,.040]],
  'Prestige Drama':[[41,52,.050],[5,12,.012]],
  'Comedy':[[18,32,.025],[47,52,.018]],
  'Crime Thriller':[[5,18,.020],[34,44,.018]]
 };
 const hits=(bands[genre]||[]).filter(([a,b])=>y>=a&&y<=b);return hits.length?Math.max(...hits.map(x=>x[2])):0;
}
function releaseWindowIntel(f,week){
 const rivals=state.films.filter(x=>x.id!==f.id&&x.releaseWeek===week&&!['complete','shelved'].includes(x.stage));
 const direct=rivals.filter(x=>x.genre===f.genre),event=rivals.filter(x=>(x.budget||0)>=24),season=releaseSeasonFit(f.genre,week);
 const pressure=clamp(direct.length*.12+(rivals.length-direct.length)*.035,0,.30);
 let label='Open field',cls='good',text='No major direct competition is currently dated here.';
 if(direct.length>=2||pressure>=.24){label='Collision course';cls='bad';text=`${direct.map(x=>x.title).join(' and ')||'Multiple releases'} create heavy direct pressure.`}
 else if(direct.length===1){label='Direct contest';cls='warn';text=`${direct[0].title} is targeting the same ${f.genre.toLowerCase()} audience.`}
 else if(event.length){label='Counterprogramming window';cls='blue';text=`The week contains ${event.map(x=>x.title).join(', ')}, but not a direct genre match.`}
 else if(rivals.length){label='Competitive week';cls='blue';text=`${rivals.length} rival release${rivals.length===1?' is':'s are'} currently dated here.`}
 if(season>=.04)text+=` The calendar is naturally favourable for ${f.genre.toLowerCase()}.`;
 return {week,rivals,direct,event,pressure,season,label,cls,text};
}
function releaseWindowOpeningModifier(f){const x=releaseWindowIntel(f,f.releaseWeek);return clamp(x.season,0,.06)}
function trackingPhase(f){
 const m=ensureMarketingState(f),moments=m.publicMoments||[];
 if(moments.some(x=>x.type==='gala'||x.type==='festivalScreening'))return 'Premiere / first reactions';
 if(moments.some(x=>x.type==='publicity'))return 'Publicity tracking';
 if(moments.some(x=>x.type==='trailer'))return 'Post-trailer tracking';
 return 'Initial tracking';
}
function preReleaseTracking(f){
 ensureMarketingState(f);const s=scriptById(f.scriptId),m=f.marketingState,cast=packageActors(f),star=typeof ensembleCampaignStar==='function'?ensembleCampaignStar(f):(cast.length?cast.reduce((a,t)=>a+(t.star||0),0)/cast.length:45);
 const rec=marketingRecommended(f),mEff=Math.log1p(f.marketing||0)/Math.log1p(Math.max(1,rec)),intel=releaseWindowIntel(f,f.releaseWeek||state.week+6);
 const pulse=typeof ensureFilmSocial==='function'?ensureFilmSocial(f):null;
 let awareness=1+star*.058+(s?.hook||65)*.062+mEff*28+(m.buzz||0)+(m.sentiment||0)*.35+(pulse?pulse.volume*.07+pulse.controversy*.02:0);
 if(f.campaign==='event')awareness+=4;if(f.campaign==='mystery')awareness+=1.5;
 awareness+=(typeof studioIdentityAwarenessLift==='function'?studioIdentityAwarenessLift(f):0)+(typeof distributionAwarenessLift==='function'?distributionAwarenessLift(f):0)+(typeof soundtrackReleaseModifiers==='function'?soundtrackReleaseModifiers(f).awareness:0);
 const ratio=f.budget/Math.max(1,s?.naturalBudget||f.budget),scale=.72+Math.sqrt(Math.max(.48,ratio))*.27;
 const seasonal=1+intel.season,distribution=typeof distributionOpeningMultiplier==='function'?distributionOpeningMultiplier(f):1;
 let center=(awareness*.335+(s?.hook||65)*.078+star*.025-9.1)*scale*(1-intel.pressure)*seasonal*distribution;
 const phase=trackingPhase(f),phaseIndex=phase==='Initial tracking'?0:phase==='Post-trailer tracking'?1:phase==='Publicity tracking'?2:3;
 const r=makeRng(hash(state.seed+`|tracking|${f.id}|${phase}|${f.marketingState?.publicMoments?.length||0}`));
 center*=.88+r()*.25;center=clamp(center,.4,75);
 const spread=[.34,.27,.22,.18][phaseIndex],low=Math.max(.2,center*(1-spread)),high=center*(1+spread);
 return {phase,center:+center.toFixed(1),low:+low.toFixed(1),high:+high.toFixed(1),intel};
}
function recordTrackingSnapshot(f,reason=null){
 if(!f||f.stage==='complete'||f.stage==='cinema')return null;
 const m=ensureMarketingState(f),snap=preReleaseTracking(f);m.trackingHistory=m.trackingHistory||[];
 const last=m.trackingHistory[0];if(last&&last.phase===snap.phase&&last.day===currentCalendarDay())return last;
 const out={...snap,reason:reason||snap.phase,day:typeof currentCalendarDay==='function'?currentCalendarDay():null,week:state.week};
 m.trackingHistory.unshift(out);m.trackingHistory=m.trackingHistory.slice(0,8);return out;
}
function trackingVsActual(f,openingDom){
 const hist=f.marketingState?.trackingHistory||[],t=hist[0];if(!t)return null;
 const delta=openingDom-t.center,pct=t.center?delta/t.center:0;
 if(pct>=.25)return {label:'Blew past tracking',cls:'good',text:`The ${money(openingDom)} domestic opening landed well above the last ${money(t.low)}–${money(t.high)} tracking range.`};
 if(pct<=-.25)return {label:'Missed tracking',cls:'bad',text:`The ${money(openingDom)} domestic opening landed materially below the last ${money(t.low)}–${money(t.high)} tracking range.`};
 return {label:'Near tracking',cls:'blue',text:`The opening finished broadly around the last ${money(t.low)}–${money(t.high)} industry tracking range.`};
}
function canMoveReleaseDate(f){
 return f.stage==='scheduled'&&calendarDaysUntil(f.releaseDay||releaseDayForWeek(f.releaseWeek))>=10;
}
function releaseMoveCost(f){
 const m=ensureMarketingState(f),publicCount=(m.publicMoments||[]).length;
 return +(publicCount?Math.min(1.10,.35+publicCount*.16):.15).toFixed(2);
}
function moveScheduledRelease(f,week){
 if(!canMoveReleaseDate(f))return showToast('The release is now too close to move without effectively abandoning the campaign.');
 const valid=validReleaseWeeks(f);if(!valid.includes(week))return showToast('That week no longer fits the committed campaign lead time.');
 if(week===f.releaseWeek)return;
 const m=ensureMarketingState(f),fee=releaseMoveCost(f);if(!spend(fee))return;
 const old=f.releaseWeek,publicCount=(m.publicMoments||[]).length;f.investment+=fee;f.releaseWeek=week;f.releaseDay=releaseDayForWeek(week);
 if(publicCount){m.buzz=clamp(m.buzz-2, -20,40);m.expectations=clamp(m.expectations-1,-10,40)}
 buildMarketingMilestones(f);recordTrackingSnapshot(f,'Release date moved');
 f.history.push(`${calendarDateLabel()}: release moved from Week ${old} to Week ${week}${publicCount?' after the public campaign had begun':''}.`);
 addNews(state,`${state.studio.name} has moved ${f.title} from Week ${old} to Week ${week}, paying ${money(fee)} in ${publicCount?'campaign reset and ':''}rebooking costs.`,'Release Calendar');
 save();render();
}
function maybeRivalReleaseResponse(playerFilm){
 const rivals=state.films.filter(x=>x.owner!=='player'&&x.stage==='scheduled'&&x.releaseWeek===playerFilm.releaseWeek&&x.genre===playerFilm.genre);
 if(!rivals.length)return;
 const tracking=preReleaseTracking(playerFilm),r=makeRng(hash(state.seed+`|date-response|${playerFilm.id}|${playerFilm.releaseWeek}`));
 const target=rivals.sort((a,b)=>(a.budget||0)-(b.budget||0))[0],rv=ensureRivalCharacter(rivalById(target.owner)),rivalry=rivalrySnapshot(rv);
 if(tracking.center<16||r()>.38)return;
 if(rivalry.rank>=2&&r()<(.38+rivalry.rank*.08)){
  recordRivalryEvent(rv,'release-standoff',`${rv.head.name} held ${target.title} against ${playerFilm.title}`,2.2,`release-stand:${target.id}:${playerFilm.id}`,{filmId:playerFilm.id,outcome:'Date held'});
  addNews(state,`${rv.head.name}'s ${rv.name} is holding ${target.title} in Week ${target.releaseWeek} despite ${playerFilm.title}'s tracking. The trade is reading the decision through the studios' ${rivalry.label.toLowerCase()}.`,'Release Calendar');return;
 }
 const delta=r()<.5?-1:1,newWeek=Math.max(state.week+2,target.releaseWeek+delta);
 if(state.films.some(x=>x.owner!=='player'&&x.id!==target.id&&x.releaseWeek===newWeek&&x.genre===target.genre))return;
 const old=target.releaseWeek;target.releaseWeek=newWeek;target.releaseDay=typeof releaseDayForWeek==='function'?releaseDayForWeek(newWeek):null;
 if(rv)recordRivalryEvent(rv,'release-move',`${rv.name} moved ${target.title} away from ${playerFilm.title}`,.65,`release-move:${target.id}:${playerFilm.id}`,{filmId:playerFilm.id,outcome:'Rival moved'});
 addNews(state,`${target.studio} has moved ${target.title} out of Week ${old}, leaving ${playerFilm.title} with less direct ${playerFilm.genre.toLowerCase()} competition.`,'Release Calendar');
}

function checkPlayerReleaseCompetition(){
 playerFilms().filter(f=>f.stage==='scheduled'&&f.releaseWeek>=state.week).forEach(f=>{
  const intel=releaseWindowIntel(f,f.releaseWeek),sig=intel.direct.map(x=>x.id).sort().join('|');
  const previous=f.releaseCompetitionSignature||'';
  if(sig&&sig!==previous){
   const names=intel.direct.map(x=>`${x.title} (${x.studio})`).join(', ');
   notify(`release-conflict:${f.id}:${sig}`,`${f.title} has new direct competition`,`${names} ${intel.direct.length===1?'is':'are'} now dated against your ${f.genre.toLowerCase()} release.`,f.id,false,'info');
   addNews(state,`${names} ${intel.direct.length===1?'has':'have'} joined Week ${f.releaseWeek}, putting direct ${f.genre.toLowerCase()} competition against ${f.title}.`,'Release Calendar');
  }else if(previous&&!sig){
   addNews(state,`${f.title}'s Week ${f.releaseWeek} has cleared of direct ${f.genre.toLowerCase()} competition after rival schedule movement.`,'Release Calendar');
  }
  f.releaseCompetitionSignature=sig;
 });
}


function ensureIPAsset(f){
 if(!f)return null;
 const s=scriptById(f.scriptId),parent=f.ipParentId?filmById(f.ipParentId):null;
 if(!f.ip){
  const rights=s?.rights||{type:'full',label:'Full screen + sequel rights'};
  f.ip={
   rootFilmId:parent?.ip?.rootFilmId||parent?.id||f.id,
   installment:parent?(parent.ip?.installment||1)+1:1,
   franchiseName:parent?.ip?.franchiseName||parent?.title||f.title,
   rightsType:rights.type||'full',
   rightsLabel:rights.label||'Full screen + sequel rights',
   owner:f.owner,sold:false,soldTo:null,sequelUsed:false,
   franchiseHeat:0,fatigue:parent?Math.max(0,(parent.ip?.fatigue||0)+1):0,
   createdWeek:state.week,lastActivityWeek:state.week
  };
 }
 f.ip.lastActivityWeek=f.ip.lastActivityWeek||f.completeWeek||f.ip.createdWeek||state.week;
 if(f.stage==='complete'){
  const profit=(f.studioRevenue||0)-(f.investment||0),aud=f.review?.audience||60,crit=f.review?.critics||60;
  f.ip.franchiseHeat=clamp((f.finalGross||0)*.055+Math.max(0,profit)*.45+(aud-55)*.42+(crit-55)*.12-(f.ip.fatigue||0)*4,0,100);
 }
 return f.ip;
}
function franchiseRootId(f){return ensureIPAsset(f)?.rootFilmId||f?.id}
function franchiseFamily(f){
 if(!f)return [];
 const root=franchiseRootId(f);
 return state.films.filter(x=>{
  if(x.id===root)return true;
  if(x.ip?.rootFilmId===root)return true;
  const s=scriptById(x.scriptId);return s?.franchiseRootId===root;
 }).sort((a,b)=>(a.completeWeek||a.createdWeek||0)-(b.completeWeek||b.createdWeek||0));
}
function franchiseLatestCompleted(f){
 const done=franchiseFamily(f).filter(x=>x.stage==='complete');
 return done.sort((a,b)=>(b.completeWeek||0)-(a.completeWeek||0))[0]||f;
}
function franchiseActiveProject(f){
 const root=franchiseRootId(f);
 const film=state.films.find(x=>x.id!==f.id&&!['complete','shelved'].includes(x.stage)&&(x.ip?.rootFilmId===root||scriptById(x.scriptId)?.franchiseRootId===root));
 if(film)return {type:'film',id:film.id,title:film.title};
 const script=state.scripts.find(s=>!s.filmStarted&&!s.shelved&&s.franchiseRootId===root&&['writing','owned','development'].includes(s.status));
 return script?{type:'script',id:script.id,title:script.title}:null;
}
function franchiseHistory(f){
 const family=franchiseFamily(f).filter(x=>x.stage==='complete'),latest=franchiseLatestCompleted(f),root=filmById(franchiseRootId(f))||family[0]||f;
 const totalGross=family.reduce((a,x)=>a+(x.finalGross||0),0);
 const totalProfit=family.reduce((a,x)=>a+((x.studioRevenue||0)-(x.investment||0)),0);
 const avgAudience=family.length?family.reduce((a,x)=>a+(x.review?.audience||60),0)/family.length:60;
 const avgCritics=family.length?family.reduce((a,x)=>a+(x.review?.critics||60),0)/family.length:60;
 const awards=family.reduce((a,x)=>a+(ensureAfterlifeState(x)?.wins?.length||0),0);
 const cult=family.some(x=>ensureAfterlifeState(x)?.cultStatus);
 const gap=Math.max(0,state.week-(latest.completeWeek||state.week));
 const latestIP=ensureIPAsset(latest);
 const baseFamiliarity=clamp(totalGross*.018+avgAudience*.15+family.length*3+(cult?8:0)+awards*2.5,0,100);
 const familiarity=clamp(baseFamiliarity*Math.exp(-gap/310),0,100);
 const fatigue=clamp((latestIP?.fatigue||0)*9+Math.max(0,family.length-2)*7-Math.min(28,gap*.12),0,100);
 const historicalStrength=clamp(avgAudience*.42+avgCritics*.15+Math.min(25,totalGross*.035)+Math.max(0,totalProfit)*.11+(cult?7:0)+awards*2.5,0,100);
 return {family,latest,root,totalGross,totalProfit,avgAudience,avgCritics,awards,cult,gap,familiarity,fatigue,historicalStrength};
}
function franchiseStatus(f){
 const h=franchiseHistory(f),active=franchiseActiveProject(f),latestIP=ensureIPAsset(h.latest);
 let label='Cooling property',cls='blue',text='The property remains recognisable, but it is not currently dominating audience attention.';
 if(active){label='In active development';cls='good';text=`${active.title} is currently carrying this property forward.`}
 else if(h.fatigue>=58){label='Franchise fatigue';cls='bad';text='Repeated use has begun to outweigh familiarity. Another conventional sequel carries meaningful audience fatigue risk.'}
 else if(h.gap>=156&&h.historicalStrength>=58){label='Legacy property';cls='good';text='The property has been away long enough for nostalgia and rediscovery to become commercially relevant again.'}
 else if(h.gap>=104){label='Dormant property';cls='warn';text='The property has been out of circulation long enough that a return would need to be sold as an event, revival or reinvention.'}
 else if(h.gap>=52){label='Resting property';cls='blue';text='Audience familiarity remains useful while some franchise fatigue has had time to fade.'}
 else if(h.family.length>=2&&h.historicalStrength>=66){label='Active franchise';cls='good';text='The property still has current audience recognition and enough recent evidence to support continued development.'}
 const canRevive=!active&&h.gap>=78&&h.historicalStrength>=52;
 const canReboot=!active&&(h.gap>=130||h.fatigue>=50)&&(h.family.length>=2||h.historicalStrength>=56);
 const canSpinoff=!active&&h.family.length>=2&&h.historicalStrength>=64&&h.fatigue<72;
 return {...h,label,cls,text,active,canRevive,canReboot,canSpinoff,rightsInterest:clamp(h.historicalStrength*.62+h.familiarity*.28+(h.gap>=104?7:0)-(h.fatigue*.18),0,100)};
}
function franchiseOpportunity(f){
 const ip=ensureIPAsset(f),profit=(f.studioRevenue||0)-(f.investment||0),aud=f.review?.audience||60,segments=f.audienceSegments||{},status=franchiseStatus(f);
 const values=Object.values(segments),passion=values.length?Math.max(...values):aud;
 const score=clamp(ip.franchiseHeat*.44+Math.max(0,profit)*.50+(aud-55)*.32+(passion-60)*.22+status.familiarity*.14-status.fatigue*.16,0,100);
 if(score>=76)return {score,label:'Strong sequel demand',cls:'good',text:'The film has enough commercial and audience momentum to support serious follow-up interest.'};
 if(score>=58)return {score,label:'Credible sequel case',cls:'blue',text:'There is a plausible audience for another film, though the property is not automatic franchise material.'};
 if(score>=40)return {score,label:'Speculative sequel',cls:'warn',text:'A follow-up is possible, but it would need a strong creative reason rather than relying on the previous film alone.'};
 return {score,label:'Weak sequel case',cls:'bad',text:'Current audience and commercial evidence does not create much natural demand for a conventional sequel.'};
}
function rightsDevelopmentStatus(f){
 const ip=ensureIPAsset(f),active=franchiseActiveProject(f);
 if(ip.sold)return {ok:false,reason:`Future screen rights were sold to ${rivalById(ip.soldTo)?.name||'another studio'}.`};
 if(active)return {ok:false,reason:`${active.title} is already carrying this property through development.`};
 if(ip.rightsType==='sequelOption'&&ip.sequelUsed)return {ok:false,reason:'The one sequel option attached to the original rights has already been exercised.'};
 return {ok:true,reason:null};
}
function rightsClearanceCost(f){
 const ip=ensureIPAsset(f);
 return ip.rightsType==='approval'?+(1.0+franchiseOpportunity(f).score*.025).toFixed(2):0;
}
function sequelTitleFor(f){
 const ip=ensureIPAsset(f),n=(ip.installment||1)+1;
 if(n===2)return `${ip.franchiseName}: Chapter Two`;
 if(n===3)return `${ip.franchiseName}: Part III`;
 return `${ip.franchiseName} ${n}`;
}
function franchiseProjectTitle(f,mode){
 const h=franchiseHistory(f),name=ensureIPAsset(h.root).franchiseName,r=makeRng(hash(state.seed+'|franchise-title|'+franchiseRootId(f)+'|'+mode+'|'+state.week));
 let title;
 if(mode==='sequel')title=sequelTitleFor(h.latest);
 else if(mode==='revival')title=`${name}: ${pick(r,['Aftermath','The Return','Resurgence','After Years','Reckoning','New Dawn'])}`;
 else if(mode==='reboot')title=`${name}: ${pick(r,['Reborn','New Blood','Origins','Reimagined','First Light','The Beginning'])}`;
 else title=generatedPremise(state,r,f.genre).title;
 const used=new Set([...(state.scripts||[]).map(x=>x.title),...(state.films||[]).map(x=>x.title)].map(x=>(x||'').toLowerCase()));
 if(!used.has(title.toLowerCase()))return title;
 for(let i=2;i<10;i++){const candidate=`${title} ${i}`;if(!used.has(candidate.toLowerCase()))return candidate}
 return `${title} ${state.week}`;
}
function strongestAudienceName(f){
 const entries=Object.entries(f.audienceSegments||{}).sort((a,b)=>b[1]-a[1]);
 return entries[0]?.[0]||'Mainstream Adults';
}
function sequelWriterFor(f){
 const s=scriptById(f.scriptId),w=writerById(s?.writerId);
 return w||state.writers.slice().sort((a,b)=>writerFit(b,f.genre,'commercial')-writerFit(a,f.genre,'commercial'))[0];
}
function franchiseModeLabel(mode){
 return mode==='revival'?'Legacy revival':mode==='reboot'?'Reboot':mode==='spinoff'?'Spin-off':'Sequel';
}
function franchiseProjectPremium(mode){return mode==='revival'?.35:mode==='reboot'?.55:mode==='spinoff'?.25:0}
function franchiseProjectLogline(f,mode){
 const name=ensureIPAsset(f).franchiseName;
 if(mode==='revival')return `Years after the last chapter, unresolved consequences pull a new generation and familiar faces back into the world of ${name}.`;
 if(mode==='reboot')return `A new interpretation rebuilds the central premise of ${name} for a different generation of characters and audiences.`;
 if(mode==='spinoff')return `A previously secondary corner of the ${name} world becomes the centre of a new story with its own stakes and characters.`;
 return `A new chapter expands the world and unresolved consequences of ${f.title}.`;
}
function developFranchiseProject(f,mode='sequel'){
 if(!f||f.stage!=='complete')return;
 const base=franchiseLatestCompleted(f),status=rightsDevelopmentStatus(base),fs=franchiseStatus(base);
 if(!status.ok)return showToast(status.reason);
 if(mode==='revival'&&!fs.canRevive)return showToast('This property has not been away long enough, or is not strong enough, for a meaningful revival.');
 if(mode==='reboot'&&!fs.canReboot)return showToast('The property does not currently have a credible reboot case.');
 if(mode==='spinoff'&&!fs.canSpinoff)return showToast('The property does not yet have enough world or audience strength to support a spin-off.');
 const ip=ensureIPAsset(base),w=sequelWriterFor(base),clearance=rightsClearanceCost(base),premium=franchiseProjectPremium(mode);
 const writingCost=+(.20+(w?.fee||.7)*.48).toFixed(2),total=clearance+writingCost+premium;
 if(state.cash+1e-9<total)return showToast(`You need about ${money(total)} to clear rights and develop this ${franchiseModeLabel(mode).toLowerCase()}.`);
 if(clearance>0){state.cash-=clearance;addNews(state,`${state.studio.name} paid ${money(clearance)} to satisfy creator-approval terms on ${ip.franchiseName}.`,'Rights')}
 if(premium>0)state.cash-=premium;
 const s=makeCommissionedScript({
  genre:base.genre,brief:mode==='reboot'?'balanced':'commercial',scale:base.budget>=22?'large':base.budget<=9?'contained':'mid',
  audience:strongestAudienceName(base),writerId:w.id,title:franchiseProjectTitle(base,mode),
  logline:franchiseProjectLogline(base,mode),source:'Sequel Development'
 });
 if(!s){state.cash+=clearance+premium;return}
 s.developmentSpend=+((s.developmentSpend||0)+clearance+premium).toFixed(2);s.ipParentFilmId=base.id;s.franchiseRootId=ip.rootFilmId;s.sequelInstallment=franchiseFamily(base).filter(x=>x.stage==='complete').length+1;s.franchiseMode=mode;
 if(mode==='reboot'){s.originality=clamp(s.originality+4,25,98);s.hook=clamp(s.hook+2,25,98)}
 else if(mode==='revival'){s.emotion=clamp((s.emotion||65)+4,25,98);s.hook=clamp(s.hook+Math.round(fs.familiarity*.035),25,98)}
 else if(mode==='spinoff'){s.originality=clamp(s.originality+3,25,98);s.characters=clamp((s.characters||65)+3,25,98);s.hook=clamp(s.hook+1,25,98)}
 else{s.originality=clamp(s.originality-5,25,96);s.hook=clamp(s.hook+Math.round(franchiseOpportunity(base).score*.06),25,98)}
 s.rights=ip.rightsType==='participation'
  ?{type:'participation',label:'Creator participation',detail:'The studio controls the new film, with 3% creator participation on studio receipts.'}
  :{type:'full',label:'Controlled franchise rights',detail:`The studio controls this ${franchiseModeLabel(mode).toLowerCase()} under its retained property rights.`};
 s.ipParticipationPct=ip.rightsType==='participation'?3:0;
 ip.sequelUsed=true;ip.lastActivityWeek=state.week;
 addNews(state,`${state.studio.name} has opened ${franchiseModeLabel(mode).toLowerCase()} development on ${ip.franchiseName}, with ${w.name} writing ${s.title}.`,'Franchise');
 state.screen='develop';state.detail={type:'script',id:s.id};requestScrollTop();save();render();
}
function developSequelFromFilm(f){developFranchiseProject(f,'sequel')}
function rightsSaleValue(f){
 const opp=franchiseOpportunity(f),status=franchiseStatus(f),profit=(f.studioRevenue||0)-(f.investment||0);
 return +clamp(.35+Math.max(0,Math.max(opp.score,status.rightsInterest)-35)*.043+Math.max(0,profit)*.014+status.historicalStrength*.012,.4,7.5).toFixed(1);
}
function currentRightsOffer(f){
 const ip=ensureIPAsset(f),opp=franchiseOpportunity(f),status=franchiseStatus(f);if(ip.sold||franchiseActiveProject(f))return null;
 const demand=Math.max(opp.score,status.rightsInterest);if(demand<46)return null;
 const period=Math.floor(state.week/6),r=makeRng(hash(state.seed+'|rights-offer-v33|'+franchiseRootId(f)+'|'+period)),chance=clamp((demand-42)/70,.06,.58);if(r()>chance)return null;
 const base=rightsSaleValue(f),offers=state.rivals.filter(rv=>aiFinancialHealth(rv)!=='Financial distress').map(rv=>{
  const fit=(rv.profile?.genres||[]).includes(f.genre),builder=rv.style==='Franchise Builder'||rivalSignature(rv).label==='IP Builder';
  const strategic=(fit?1.10:.82)*(builder?1.10:1)*(status.gap>=104?1.05:1),appetite=.76+r()*.26;
  return {rv,offer:+(base*strategic*appetite).toFixed(1)}
 }).filter(x=>x.offer>=.4&&x.rv.cash>x.offer+5);
 offers.sort((a,b)=>b.offer-a.offer);return offers[0]||null;
}
function beginRightsSale(f){const offer=currentRightsOffer(f);if(!offer)return showToast('There is no active buyer for this property right now.');state.pendingRightsSale={filmId:f.id,buyerId:offer.rv.id,amount:offer.offer};save();render()}
function cancelRightsSale(){state.pendingRightsSale=null;save();render()}
function confirmRightsSale(f){
 const p=state.pendingRightsSale;if(!p||p.filmId!==f.id)return showToast('That rights offer is no longer available.');
 const ip=ensureIPAsset(f),buyer=rivalById(p.buyerId),value=p.amount;if(!buyer||ip.sold||franchiseActiveProject(f)||buyer.cash<value+3){state.pendingRightsSale=null;save();render();return showToast('The buyer can no longer complete that offer.')}
 buyer.cash-=value;state.cash+=value;
 franchiseFamily(f).forEach(x=>{const xi=ensureIPAsset(x);xi.sold=true;xi.soldTo=buyer.id;xi.owner=buyer.id;xi.saleValue=value;xi.saleWeek=state.week});
 createRivalFranchiseScript(f,buyer,franchiseStatus(f).gap>=104?'revival':'sequel');
 state.pendingRightsSale=null;
 addNews(state,`${state.studio.name} sold future screen rights to ${ensureIPAsset(f).franchiseName} to ${buyer.name} for ${money(value)}. ${buyer.name} has opened development on the property.`,'Rights');save();render();
}
function createRivalFranchiseScript(f,rv,mode='sequel'){
 const base=franchiseLatestCompleted(f),parentScript=scriptById(base.scriptId),w=writerById(parentScript?.writerId),r=makeRng(hash(state.seed+'|rival-franchise|'+base.id+'|'+rv.id+'|'+mode));
 const s=generateScript(state,state.week,false);
 s.title=franchiseProjectTitle(base,mode);s.genre=base.genre;s.logline=franchiseProjectLogline(base,mode);
 s.source=`${rv.name} Franchise Development`;s.available=false;s.status='owned';s.owner=rv.id;s.filmStarted=false;s.deferredUntil=state.week+3+Math.floor(r()*5);
 s.ipParentFilmId=base.id;s.franchiseRootId=ensureIPAsset(base).rootFilmId;s.sequelInstallment=franchiseFamily(base).filter(x=>x.stage==='complete').length+1;s.franchiseMode=mode;
 s.writerId=w?.id||s.writerId;s.naturalBudget=+clamp(base.budget*(mode==='reboot'?.72:.82+r()*.35),5,44).toFixed(1);
 s.hook=clamp((parentScript?.hook||65)+(mode==='revival'?5:mode==='reboot'?2:4)+Math.round(r()*5),25,98);
 s.access=clamp((parentScript?.access||65)+Math.round(r()*5),25,98);
 if(mode==='reboot')s.originality=clamp((s.originality||65)+5,25,98);
 s.rights={type:'full',label:'Controlled franchise rights',detail:`${rv.name} controls future screen rights to ${ensureIPAsset(base).franchiseName}.`};
 ensureScriptEcosystem(s);return s;
}
function createRivalSequelScript(f,rv){return createRivalFranchiseScript(f,rv,'sequel')}
function sellFutureRights(f){beginRightsSale(f)}
function franchiseCastContinuity(f,parent){
 const old=(parent?.cast||[]),now=(f.cast||[]),returning=now.filter(id=>old.includes(id)).length;
 return {returning,totalOld:old.length,recast:Math.max(0,Math.min(2,old.length)-returning)};
}
function franchiseReleaseContext(f){
 const s=scriptById(f.scriptId);if(!s?.ipParentFilmId)return {awarenessLift:0,audiencePenalty:0,continuity:'Original property',familiarity:0,fatigue:0};
 const parent=filmById(s.ipParentFilmId);if(!parent)return {awarenessLift:0,audiencePenalty:0,continuity:'Franchise film',familiarity:0,fatigue:0};
 const status=franchiseStatus(parent),gap=Math.max(1,state.week-(parent.completeWeek||state.week)),installment=s.sequelInstallment||2,mode=s.franchiseMode||f.franchiseMode||'sequel',continuity=franchiseCastContinuity(f,parent);
 let familiarity=clamp(status.familiarity*.18+(parent.review?.audience||60)*.045+(parent.finalGross||0)*.014,1,17);
 let fatigue=Math.max(0,(installment-2)*2.6+status.fatigue*.075+Math.max(0,18-gap)*.16-(franchiseOpportunity(parent).score>=75?1.5:0));
 let audiencePenalty=fatigue,awarenessLift=familiarity;
 if(mode==='reboot'){awarenessLift*=.62;audiencePenalty=fatigue*.25+(gap<78?3:0)}
 else if(mode==='spinoff'){awarenessLift*=.58;audiencePenalty=fatigue*.38}
 else{
  if(continuity.returning>=2){awarenessLift+=2.4;audiencePenalty=Math.max(0,audiencePenalty-1.5)}
  else if(continuity.returning===1){awarenessLift+=.7;audiencePenalty+=1.0}
  else if(continuity.totalOld>=2){audiencePenalty+=clamp(2.2+status.familiarity*.035,2.2,5.8)}
  if(mode==='revival'&&gap>=78){awarenessLift+=clamp(gap/60,1,3.5);audiencePenalty=Math.max(0,audiencePenalty-1.2)}
 }
 const continuityLabel=mode==='reboot'?'New cast / continuity reset':mode==='spinoff'?'New branch of the property':continuity.returning>=2?'Principal cast reunited':continuity.returning===1?'Partial cast return':'Principal roles recast';
 return {awarenessLift,audiencePenalty,continuity:continuityLabel,familiarity,status:status.label,fatigue,mode};
}
function franchiseAssetValueContribution(f){
 const status=franchiseStatus(f),root=franchiseRootId(f),isRoot=f.id===root;
 if(!isRoot)return clamp(status.historicalStrength*.006+status.familiarity*.004,0,.7);
 return clamp(status.historicalStrength*.018+status.familiarity*.012+(status.canRevive?.45:0)+(status.cult?.35:0),0,2.4);
}
function tickIPWorld(){
 const seen=new Set();
 state.films.filter(f=>f.stage==='complete').forEach(f=>{
  const ip=ensureIPAsset(f);ip.franchiseHeat*=.995;ip.fatigue=Math.max(0,(ip.fatigue||0)-.010);
  const root=ip.rootFilmId;if(seen.has(root))return;seen.add(root);
  const status=franchiseStatus(f),r=makeRng(hash(state.seed+'|dormant-ip|'+root+'|'+Math.floor(state.week/13)));
  const rootFilm=filmById(root)||f,rootIp=ensureIPAsset(rootFilm);
  if(state.week%13===0&&rootFilm.owner==='player'&&!rootIp.sold){
   if(rootIp.lastWorldStatus!==status.label){
    const previous=rootIp.lastWorldStatus;rootIp.lastWorldStatus=status.label;
    if(previous&&['Dormant property','Legacy property','Franchise fatigue'].includes(status.label)){
     notify(`ip-status:${root}:${status.label}`,`${rootIp.franchiseName}: ${status.label}`,status.text,rootFilm.id,false,'info');
     addNews(state,`${rootIp.franchiseName} is now being treated as ${status.label.toLowerCase()} in the rights market. ${status.text}`,'Franchise');
    }
   }
   const offer=currentRightsOffer(rootFilm),period=Math.floor(state.week/6);
   if(offer&&rootIp.lastRightsOfferPeriod!==period){
    rootIp.lastRightsOfferPeriod=period;
    pushDeskItem({
     templateId:'rights-offer',family:'rights-offer',type:'finance',source:offer.rv.name,urgency:'action',
     requiresAction:true,expiresWeek:state.week+4,filmId:rootFilm.id,buyerId:offer.rv.id,amount:offer.offer,
     subject:rootIp.franchiseName,headline:`${offer.rv.name} offers ${money(offer.offer)} for ${rootIp.franchiseName}`,
     body:`${offer.rv.name} is offering ${money(offer.offer)} for all future screen rights to the ${rootIp.franchiseName} property. You keep every film already made and all existing catalogue income. The buyer receives future sequel, revival, reboot and spin-off rights across the franchise.`,
     choices:[['review','Review the offer'],['decline','Decline']]
    });
   }
  }
  if(state.week%13===0&&status.gap>=104&&status.historicalStrength>=58&&r()<.11){
   if(rootFilm.owner==='player'&&!rootIp.sold){
    addNews(state,`${rootIp.franchiseName} is drawing renewed catalogue and development chatter after ${Math.floor(status.gap/52)} years away from cinemas.`,'Franchise');
   }else if(rootFilm.owner!=='player'&&!franchiseActiveProject(rootFilm)){
    const rv=rivalById(rootFilm.owner);if(rv&&aiFinancialHealth(rv)!=='Financial distress'&&r()<.42){
     const mode=status.fatigue>=50?'reboot':'revival',s=createRivalFranchiseScript(rootFilm,rv,mode);s.deferredUntil=state.week+4+Math.floor(r()*6);
     addNews(state,`${rv.name} has reopened ${ensureIPAsset(rootFilm).franchiseName} as a ${franchiseModeLabel(mode).toLowerCase()} after a long period of dormancy.`,'Franchise');
    }
   }
  }
 });
}
function maybeGenerateAISequel(f,rv){
 if(!rv||f.owner==='player'||f.stage!=='complete'||f.aiSequelConsidered)return;
 f.aiSequelConsidered=true;const opp=franchiseOpportunity(f),status=franchiseStatus(f),r=makeRng(hash(state.seed+'|ai-sequel-v33|'+f.id)),demand=Math.max(opp.score,status.historicalStrength*.78);
 if(demand<48||r()>clamp((demand-43)/55,.07,.48))return;
 let mode='sequel';
 if(status.fatigue>=50&&status.canReboot)mode='reboot';
 else if(status.family.length>=2&&status.canSpinoff&&r()<.18)mode='spinoff';
 const s=createRivalFranchiseScript(f,rv,mode);s.deferredUntil=state.week+4+Math.floor(r()*5);
 ensureIPAsset(f).sequelUsed=true;
 addNews(state,`${rv.name} has put a ${franchiseModeLabel(mode).toLowerCase()} to ${ensureIPAsset(f).franchiseName} into early development.`,'Franchise');
}


const AWARD_CATEGORIES=[
 {id:'picture',label:'Best Picture'},
 {id:'director',label:'Best Director'},
 {id:'lead',label:'Lead Performance'},
 {id:'support',label:'Supporting Performance'},
 {id:'screenplay',label:'Best Screenplay'},
 {id:'ensemble',label:'Best Ensemble'},
 {id:'craft',label:'Production & Craft'},
 {id:'soundtrack',label:'Best Soundtrack'},
 {id:'audience',label:'Audience Achievement'}
];
function ensureAfterlifeState(f){
 if(!f)return null;
 if(!f.afterlife)f.afterlife={weeklyRevenue:0,totalRevenue:0,libraryValue:0,licensingDeals:[],streaming:{offers:[],activeDeal:null,history:[],lastOfferWeek:0,nextOfferWeek:null},cultStatus:false,awardsPush:false,awardsPushLevel:0,awardsPushBonus:0,awardsPushCost:0,nominations:[],wins:[],catalogueAge:0};
 f.afterlife.licensingDeals=f.afterlife.licensingDeals||[];f.afterlife.streaming=f.afterlife.streaming||{offers:[],activeDeal:null,history:[],lastOfferWeek:0,nextOfferWeek:null};f.afterlife.streaming.offers=f.afterlife.streaming.offers||[];f.afterlife.streaming.history=f.afterlife.streaming.history||[];f.afterlife.nominations=f.afterlife.nominations||[];f.afterlife.wins=f.afterlife.wins||[];
 if(f.afterlife.awardsPushLevel===undefined)f.afterlife.awardsPushLevel=f.afterlife.awardsPush?1:0;
 if(f.afterlife.awardsPushBonus===undefined)f.afterlife.awardsPushBonus=0;
 return f.afterlife;
}
function afterlifeStrength(f){
 const a=ensureAfterlifeState(f),aud=f.review?.audience||60,crit=f.review?.critics||60,profit=(f.studioRevenue||0)-(f.investment||0);
 const vals=Object.values(f.audienceSegments||{}),passion=vals.length?Math.max(...vals):aud;
 const genre=f.audienceSegments?.['Genre Fans']||aud,prestige=f.audienceSegments?.['Prestige / Arthouse']||crit;
 return clamp(aud*.22+crit*.12+Math.max(0,passion-60)*.35+Math.max(0,profit)*.12+(f.finalGross||0)*.012+(genre>=82&&f.finalGross<90?7:0)+(prestige>=82&&crit>=78?5:0)-(a.catalogueAge||0)*.18,10,95);
}
function afterlifeWeeklyRevenue(f){
 const a=ensureAfterlifeState(f),age=Math.max(0,state.week-(f.completeWeek||state.week));
 const decay=Math.exp(-age/46),sequel=state.films.some(x=>x.ipParentId===f.id&&!['complete','shelved'].includes(x.stage))?1.18:1;
 const awards=a.wins.length?1.15:a.nominations.length?1.07:1,cult=a.cultStatus?1.12:1;
 const base=+Math.max(.0005,(afterlifeStrength(f)/100)*.055*decay*sequel*awards*cult).toFixed(4);
 const adjusted=typeof streamingAdjustedWeeklyRevenue==='function'?streamingAdjustedWeeklyRevenue(f,base):base;
 return +(adjusted*capitalCatalogueMultiplier()).toFixed(4);
}
function refreshAfterlifeValuation(f){
 const a=ensureAfterlifeState(f),rev=afterlifeWeeklyRevenue(f),awardLift=(a.wins?.length||0)*.38+(a.nominations?.length||0)*.06,cultLift=a.cultStatus?.85:0,sequelLift=state.films.some(x=>x.ipParentId===f.id&&!['complete','shelved'].includes(x.stage))?.60:0,ipLift=franchiseAssetValueContribution(f);
 a.weeklyRevenue=rev;a.libraryValue=+clamp(rev*34+afterlifeStrength(f)*.018+awardLift+cultLift+sequelLift+ipLift,.15,12).toFixed(1);return a.libraryValue;
}
function updateAfterlifeRevenue(){
 let weeklyTotal=0;
 playerFilms().filter(f=>f.stage==='complete').forEach(f=>{
  const a=ensureAfterlifeState(f);a.catalogueAge=Math.max(0,state.week-(f.completeWeek||state.week));
  if(typeof tickStreamingMarket==='function')tickStreamingMarket(f);
  const rev=afterlifeWeeklyRevenue(f);a.totalRevenue=+(a.totalRevenue+rev).toFixed(2);weeklyTotal+=rev;refreshAfterlifeValuation(f);state.cash+=rev;
  if(!a.cultStatus){
   const g=f.audienceSegments?.['Genre Fans']||0,p=f.audienceSegments?.['Prestige / Arthouse']||0;
   if((g>=86&&a.catalogueAge>=12)||(p>=87&&f.review?.critics>=80&&a.catalogueAge>=16)){a.cultStatus=true;addNews(state,`${f.title} is developing a durable catalogue following, with demand holding beyond the normal post-theatrical window.`,'Library')}
  }
  if(a.catalogueAge>0&&a.catalogueAge%52===0&&!(typeof streamingBlocksSpotLicensing==='function'&&streamingBlocksSpotLicensing(f))){
   const r=makeRng(hash(state.seed+'|license-v30|'+f.id+'|'+a.catalogueAge)),strength=afterlifeStrength(f);
   if(r()<clamp(strength/185,.12,.48)){const value=+clamp(.18+strength*.008+r()*.42,.18,1.25).toFixed(2);state.cash+=value;weeklyTotal+=value;a.totalRevenue=+(a.totalRevenue+value).toFixed(2);a.licensingDeals.unshift({week:state.week,value});addNews(state,`${f.title} has landed a new catalogue licence worth about ${money(value)} after another year in the library.`,'Library')}
  }
 });
 const e=ensureEconomyState();e.lastCatalogueReceipts=weeklyTotal;return weeklyTotal;
}
function awardSupportingTalent(f){
 const ids=(f.supportingCastIds||[f.supportingCastId]).filter(Boolean),support=ids.map(talentById).filter(Boolean).sort((a,b)=>(b.acting||0)-(a.acting||0));
 if(support.length)return support[0];
 const leads=(f.cast||[]).map(talentById).filter(Boolean).sort((a,b)=>(a.star||0)-(b.star||0)||(b.acting||0)-(a.acting||0));
 return leads[0]||null;
}
function awardLeadTalent(f){return (f.cast||[]).map(talentById).filter(Boolean).sort((a,b)=>(b.acting||0)-(a.acting||0))[0]||null}
function awardTalentId(f,cat){
 if(cat==='director')return f.directorId||null;
 if(cat==='lead')return awardLeadTalent(f)?.id||null;
 if(cat==='support')return awardSupportingTalent(f)?.id||null;
 return null;
}
function awardsEligibilityScore(f,cat){
 const s=scriptById(f.scriptId),m=f.metrics||{},crit=f.review?.critics||0,aud=f.review?.audience||0,c=f.creative||defaultCreative(),cast=[...(f.cast||[]),...(f.supportingCastIds||[])].map(talentById).filter(Boolean);
 const avgAct=cast.length?cast.reduce((a,t)=>a+(t.acting||70),0)/cast.length:70,avgRel=cast.length?cast.reduce((a,t)=>a+(t.reliability||70),0)/cast.length:70,support=awardSupportingTalent(f),social=f.socialPulse||{};
 if(cat==='picture')return crit*.24+aud*.12+(m.direction||65)*.16+(m.performances||65)*.17+(s?.originality||60)*.12+(s?.emotion||60)*.10+(c.positioning==='prestige'?7:0);
 if(cat==='director')return (m.direction||65)*.50+(m.technical||65)*.15+(s?.originality||60)*.12+crit*.18+(c.positioning==='prestige'?5:0);
 if(cat==='lead')return (m.performances||65)*.52+(m.chemistry||65)*.10+crit*.16+aud*.10+(s?.characters||60)*.09+Math.max(0,...(f.cast||[]).map(id=>(talentById(id)?.acting||70)-80))*.12;
 if(cat==='support')return (m.performances||65)*.34+(support?.acting||68)*.28+(s?.characters||60)*.12+crit*.14+aud*.07+(m.chemistry||65)*.05;
 if(cat==='screenplay')return (s?.story||60)*.20+(s?.structure||60)*.20+(s?.characters||60)*.17+(s?.originality||60)*.20+(s?.emotion||60)*.13+crit*.10;
 if(cat==='ensemble')return (m.performances||65)*.33+(m.chemistry||65)*.24+avgAct*.20+avgRel*.08+crit*.10+aud*.05;
 if(cat==='audience')return aud*.50+Math.min(20,(f.finalGross||0)*.07)+(s?.access||60)*.10+(social.fandom||50)*.08+(s?.genreFulfillment||60)*.06;
 if(cat==='soundtrack'){
  // Player films use the music decision they actually made. AI films receive a deterministic
  // implied music-craft score so the category remains a fair industry-wide competition.
  if(f.soundtrack?.committed){const st=f.soundtrack,fit=st.fit||60,fam=st.trackFamiliarity||0,strategy=st.strategy||'original';return fit*.52+(m.technical||65)*.10+crit*.12+aud*.08+fam*.035+(strategy==='original'?4:strategy==='hybrid'?3:strategy==='minimal'?1:0)}
  const rr=makeRng(hash((state.seed||1)+'|ai-soundtrack-award|'+f.id)),implied=clamp(54+(m.technical||65)*.20+(m.direction||65)*.10+(s?.originality||60)*.10+(rr()-.5)*16,45,94);
  return implied*.58+crit*.16+aud*.08+(m.technical||65)*.10;
 }
 return (m.technical||65)*.52+(m.direction||65)*.12+(m.stability||65)*.08+crit*.13+Math.min(8,(f.budget||10)*.20);
}
function awardNominationThreshold(cat){return cat==='audience'?61:cat==='craft'||cat==='soundtrack'?62:cat==='support'||cat==='ensemble'?63:65}
function awardsSeasonId(week=state.week){return Math.max(1,Math.floor((week-1)/52)+1)}
function awardsSeasonWeek(week=state.week){return ((Math.max(1,week)-1)%52)+1}
function awardsPushBonus(f){const a=ensureAfterlifeState(f);return a.awardsPushBonus||({0:0,1:5,2:9}[a.awardsPushLevel||0]||0)}
function awardsPushCost(f,level=1){
 const base=clamp(.45+(f.finalGross||0)*.004+(f.review?.critics||60)*.006,.45,1.65),mult=level>=2?1.85:1;
 return +(base*mult).toFixed(2);
}
function commitAwardsPush(f,level=1){
 const a=ensureAfterlifeState(f);level=level>=2?2:1;
 const current=a.awardsPushLevel||0;
 if(current>=level)return showToast(current>=2?'A full-scale awards campaign is already active.':'A focused awards campaign is already active.');
 const rawTarget=awardsPushCost(f,level),rawCurrent=current?awardsPushCost(f,current):0;
 const cost=+((rawTarget-rawCurrent)*(1-awardsCampaignDiscount())).toFixed(2);if(!spend(cost))return;
 a.awardsPush=true;a.awardsPushLevel=level;a.awardsPushBonus=level===2?9:5;a.awardsPushCost=+((a.awardsPushCost||0)+cost).toFixed(2);f.investment+=cost;
 addNews(state,current===1&&level===2?`${state.studio.name} escalated ${f.title}'s awards campaign to a full-scale push after making the field.`:`${state.studio.name} is mounting a ${level===2?'full-scale':'focused'} awards campaign for ${f.title}.`,'Awards');save();render();
}

function awardsSeasonMomentum(f){
 let m=0,crit=f.review?.critics||60,aud=f.review?.audience||60,box=typeof boxRunStats==='function'?boxRunStats(f):{best:null,weeksAtOne:0};
 if(crit>=90)m+=3;else if(crit>=84)m+=2;else if(crit>=78)m+=1;
 if(aud>=90)m+=1.2;else if(aud>=84)m+=.6;
 if(box.best&&box.best<=3)m+=1;if((box.weeksAtOne||0)>=2)m+=1;
 if(f.releaseProfile?.type==='breakout'||f.releaseProfile?.type==='sleeper')m+=1.5;
 if(f.releaseProfile?.type==='bomb')m-=2;
 const fest=f.marketingState?.festival;
 if(fest?.screened&&fest.result==='strong')m+=1.2;
 else if(fest?.screened&&fest.result==='poor')m-=1;
 const pulse=f.socialPulse||{};
 if((pulse.volume||0)>=72&&(pulse.sentiment||0)>=62)m+=.6;
 return +clamp(m,-3,6).toFixed(2);
}
function awardsMomentumFactor(cat){
 return {picture:1,director:.62,lead:.72,support:.62,screenplay:.58,ensemble:.78,craft:.38,soundtrack:.42,audience:1.08}[cat]??.55;
}
function awardsCompetitiveScore(f,cat,phase='race'){
 const momentum=awardsSeasonMomentum(f)*awardsMomentumFactor(cat),campaign=awardsPushBonus(f);
 return awardsEligibilityScore(f,cat)+momentum+campaign;
}
function awardsCampaignLabel(f){
 const a=ensureAfterlifeState(f);return a.awardsPushLevel>=2?'Full campaign':a.awardsPushLevel===1?'Focused campaign':'No campaign';
}
function awardsMomentumLabel(f){
 const m=awardsSeasonMomentum(f);
 if(m>=4)return {label:'Surging',cls:'good'};
 if(m>=2)return {label:'Strong momentum',cls:'good'};
 if(m>=.5)return {label:'Steady',cls:'blue'};
 if(m<=-1)return {label:'Fading',cls:'bad'};
 return {label:'Mixed',cls:'warn'};
}
function aiAwardsCampaignThreshold(rv){
 if(['Prestige','Indie / Prestige'].includes(rv?.style))return {focused:65,full:74};
 if(['Blockbusters','Franchise Builder','Aggressive Capital'].includes(rv?.style))return {focused:69,full:79};
 if(rv?.style==='Genre Specialist')return {focused:67,full:76};
 return {focused:68,full:77};
}
function aiAwardsBestScore(f){
 return Math.max(...AWARD_CATEGORIES.map(c=>awardsEligibilityScore(f,c.id)+awardsSeasonMomentum(f)*awardsMomentumFactor(c.id)));
}
function aiCommitAwardsPush(f,rv,level=1,reason=''){
 const a=ensureAfterlifeState(f),current=a.awardsPushLevel||0;level=level>=2?2:1;
 if(current>=level)return false;
 const rawTarget=awardsPushCost(f,level),rawCurrent=current?awardsPushCost(f,current):0,cost=+(rawTarget-rawCurrent).toFixed(2),t=aiTreasurySnapshot(rv);
 if(rv.cash-cost<Math.max(4,t.reserve*.80))return false;
 rv.cash-=cost;f.investment=(f.investment||0)+cost;a.awardsPush=true;a.awardsPushLevel=level;a.awardsPushBonus=level===2?9:5;a.awardsPushCost=+((a.awardsPushCost||0)+cost).toFixed(2);
 if(level===2)addNews(state,rv.name+' has committed a full awards campaign to '+f.title+(reason?' after '+reason:'')+'.','Awards Race');
 return true;
}
function processAIAwardsCampaigns(){
 const sw=awardsSeasonWeek(),season=awardsSeasonId();if(sw<42||sw>51)return;
 const start=(season-1)*52+1,end=season*52,nom=awardsNominationRecord(season);
 state.films.filter(f=>f.owner!=='player'&&f.stage==='complete'&&f.completeWeek>=start&&f.completeWeek<=end).forEach(f=>{
  const rv=rivalById(f.owner);if(!rv)return;
  const a=ensureAfterlifeState(f),best=aiAwardsBestScore(f),th=aiAwardsCampaignThreshold(rv),rr=makeRng(hash(state.seed+'|ai-awards-campaign|'+season+'|'+f.id));
  if(!nom){
   if(a.aiAwardsCampaignConsideredSeason===season)return;
   const readiness=sw>=48?1:sw>=45?.82:.58;
   if(rr()>readiness)return;
   a.aiAwardsCampaignConsideredSeason=season;
   if(best>=th.full&&rr()<.72)aiCommitAwardsPush(f,rv,2,'a strong precursor season');
   else if(best>=th.focused)aiCommitAwardsPush(f,rv,1);
  }else{
   const noms=(a.nominations||[]).filter(x=>x.season===season).length;if(!noms)return;
   if((a.awardsPushLevel||0)<2&&a.aiAwardsEscalationSeason!==season&&sw>=50){
    a.aiAwardsEscalationSeason=season;
    const caseScore=best+noms*1.4;
    if(caseScore>=th.full-1&&rr()<clamp(.30+noms*.14,.30,.82))aiCommitAwardsPush(f,rv,2,noms+' nomination'+(noms===1?'':'s'));
   }
  }
 });
}
function awardRacePublicStatus(score,top){
 const gap=Math.max(0,top-score);
 if(gap<=1.5)return {label:'Front-runner',cls:'good'};
 if(gap<=4.5)return {label:'Major contender',cls:'blue'};
 if(gap<=8)return {label:'In the race',cls:'warn'};
 return {label:'Chasing',cls:''};
}
function awardsRaceCategoryRows(season,catId,nom=null){
 const start=(season-1)*52+1,end=Math.min(season*52,state.week);
 let films=state.films.filter(f=>f.stage==='complete'&&f.completeWeek>=start&&f.completeWeek<=end);
 if(nom){
  const field=nom.categories.find(c=>c.id===catId)?.nominees||[],ids=new Set(field.map(x=>x.filmId));films=films.filter(f=>ids.has(f.id));
 }
 const rows=films.map(f=>({f,score:awardsCompetitiveScore(f,catId)})).sort((a,b)=>b.score-a.score);
 const top=rows[0]?.score||0;return rows.slice(0,4).map((x,i)=>({...x,status:awardRacePublicStatus(x.score,top),rank:i+1}));
}
function awardsRaceBoardHTML(current){
 const cats=['picture','director','lead','screenplay','audience'].map(id=>AWARD_CATEGORIES.find(c=>c.id===id)).filter(Boolean),nom=current.nominations||null;
 const has=current.films?.length;
 if(!has)return '';
 return '<div class="section-title"><h2>Awards Race Board</h2><span class="small">'+(nom?'Final field · campaigns can still move Awards Night':'Industry read · hidden voting still carries uncertainty')+'</span></div><div class="grid cols2">'+cats.map(cat=>{
  const rows=awardsRaceCategoryRows(current.season,cat.id,nom);
  return '<div class="card"><div class="row"><strong>'+cat.label+'</strong><span class="pill">'+(nom?'Nominated field':'Race watch')+'</span></div><div style="margin-top:8px">'+(rows.length?rows.slice(0,3).map(x=>{const f=x.f,m=awardsMomentumLabel(f),camp=ensureAfterlifeState(f).awardsPushLevel;return '<div class="listrow"><div><strong>'+x.rank+'. '+awardSubject(f,cat.id)+'</strong><div class="small">'+(f.studio||state.studio.name)+' · '+m.label+(camp?' · '+awardsCampaignLabel(f):'')+'</div></div><span class="pill '+x.status.cls+'">'+x.status.label+'</span></div>'}).join(''):'<div class="small">No credible contenders yet.</div>')+'</div></div>';
 }).join('')+'</div><div class="small" style="margin-top:8px">Race Board labels are an industry read, not a prediction. Final nominations and winners still include voting variance.</div>';
}

function awardSubject(f,cat){
 if(cat==='director')return `${talentById(f.directorId)?.name||'Director'} — ${f.title}`;
 if(cat==='lead'){
  const lead=awardLeadTalent(f);
  return `${lead?.name||'Lead performer'} — ${f.title}`;
 }
 if(cat==='support'){
  const t=awardSupportingTalent(f);return `${t?.name||'Supporting performer'} — ${f.title}`;
 }
 if(cat==='screenplay')return `${writerById(scriptById(f.scriptId)?.writerId)?.name||'Screenplay'} — ${f.title}`;
 if(cat==='ensemble')return `${f.title} ensemble`;
 if(cat==='soundtrack'){
  const st=f.soundtrack,t=st?.trackId&&typeof soundtrackTrack==='function'?soundtrackTrack(st.trackId):null;
  if(t)return `${f.title} — ${t.artist}, “${t.title}”`;
  return `${f.title} — ${st?.strategy==='minimal'?'Music supervision':'Original music'}`;
 }
 return f.title;
}
function ensureAwardsNominationState(st=state){
 st.awardsNominationsArchive=st.awardsNominationsArchive||[];
 if(st.pendingAwardsNominations===undefined)st.pendingAwardsNominations=null;
 return st.awardsNominationsArchive;
}
function awardsNominationRecord(season){
 return ensureAwardsNominationState().find(x=>x.season===season)||null;
}
function buildAwardsNominations(season,cutoffWeek=state.week){
 const start=(season-1)*52+1,end=Math.min(season*52,cutoffWeek),films=state.films.filter(f=>f.stage==='complete'&&f.completeWeek>=start&&f.completeWeek<=end);
 const r=makeRng(hash(state.seed+'|nominations|'+season)),categories=[];
 AWARD_CATEGORIES.forEach(cat=>{
  const ranked=films.map(f=>({f,score:awardsCompetitiveScore(f,cat.id,'nomination')+(r()-.5)*5})).sort((a,b)=>b.score-a.score);
  let nominees=ranked.slice(0,Math.min(5,ranked.length)).filter(x=>x.score>=awardNominationThreshold(cat.id));
  if(!nominees.length&&ranked.length&&ranked[0].score>=58)nominees=[ranked[0]];
  nominees.forEach(x=>{
   const a=ensureAfterlifeState(x.f);
   if(!a.nominations.some(n=>n.season===season&&n.category===cat.id))a.nominations.push({season,category:cat.id,label:cat.label,talentId:awardTalentId(x.f,cat.id)});
  });
  categories.push({id:cat.id,label:cat.label,nominees:nominees.map(x=>({filmId:x.f.id,title:x.f.title,studio:x.f.studio||state.studio.name,owner:x.f.owner,subject:awardSubject(x.f,cat.id),talentId:awardTalentId(x.f,cat.id),score:+x.score.toFixed(1)}))});
 });
 const playerNoms=categories.reduce((n,c)=>n+c.nominees.filter(x=>x.owner==='player').length,0);
 return {season,week:state.week,cutoffWeek:end,categories,playerNoms};
}
function triggerAwardsNominations(catchUp=false){
 ensureAwardsNominationState();
 const seasonWeek=awardsSeasonWeek(state.week);if(seasonWeek!==50&&!(catchUp&&seasonWeek===51))return false;
 const season=awardsSeasonId(state.week);if(awardsNominationRecord(season))return false;
 // Nominations always use the same W49 cutoff even if a resumed/migrated career first wakes in W51.
 const n=buildAwardsNominations(season,season*52-3);state.awardsNominationsArchive.unshift(n);state.awardsNominationsArchive=state.awardsNominationsArchive.slice(0,20);
 state.pendingAwardsNominations=n;state.screen='nominations';state.detail=null;state.history=[];
 addNews(state,n.playerNoms?`${state.studio.name} earns ${n.playerNoms} nomination${n.playerNoms===1?'':'s'} as the Year ${season} awards field is announced.`:`The Year ${season} awards nominations are announced with ${state.studio.name} outside the final field.`,'Awards');
 notify(`awards-nominations:${season}`,`Year ${season} nominations announced`,n.playerNoms?`${state.studio.name} has ${n.playerNoms} nomination${n.playerNoms===1?'':'s'}.`:'The final awards field has been announced.',null,false,'milestone',{screen:'studio',detail:null,studioTab:'awards'});
 if(typeof checkStudioMilestones==='function')checkStudioMilestones();return true;
}
function maybeResolveAwardsNominations(){const w=awardsSeasonWeek(state.week),season=awardsSeasonId(state.week);if(w===50)triggerAwardsNominations(false);else if(w===51&&!awardsNominationRecord(season))triggerAwardsNominations(true)}
function buildAwardsCeremony(season){
 let noms=awardsNominationRecord(season);
 if(!noms){
  const cutoff=Math.min(season*52-3,state.week);noms=buildAwardsNominations(season,cutoff);
  state.awardsNominationsArchive.unshift(noms);state.awardsNominationsArchive=state.awardsNominationsArchive.slice(0,20);
 }
 const start=(season-1)*52+1,end=season*52,films=state.films.filter(f=>f.stage==='complete'&&f.completeWeek>=start&&f.completeWeek<=end),r=makeRng(hash(state.seed+'|ceremony-v36|'+season)),categories=[];
 noms.categories.forEach(cat=>{
  const pool=cat.nominees.map(n=>{const f=filmById(n.filmId);return f?{f,n,score:awardsCompetitiveScore(f,cat.id,'ceremony')+(r()-.5)*10}:null}).filter(Boolean).sort((a,b)=>b.score-a.score);
  const winner=pool[0]||null;
  if(winner){
   const a=ensureAfterlifeState(winner.f);
   if(!a.wins.some(n=>n.season===season&&n.category===cat.id))a.wins.push({season,category:cat.id,label:cat.label,talentId:awardTalentId(winner.f,cat.id)});
  }
  categories.push({id:cat.id,label:cat.label,nominees:cat.nominees,winnerId:winner?.f.id||null,winnerSubject:winner?awardSubject(winner.f,cat.id):null});
 });
 let playerNoms=noms.playerNoms||0,playerWins=0;
 films.forEach(f=>{
  const a=ensureAfterlifeState(f),n=a.nominations.filter(x=>x.season===season),w=a.wins.filter(x=>x.season===season);
  if(f.owner==='player')playerWins+=w.length;
  if(!n.length)return;
  registerStudioAwardImpact(f,w.length,n.length);
  if(f.owner==='player'){
   state.reputation.creative=clamp(state.reputation.creative+(w.length?Math.min(6,w.length*1.5):.5),0,100);
   const d=talentById(f.directorId),lead=(f.cast||[]).map(talentById).filter(Boolean),support=(f.supportingCastIds||[]).map(talentById).filter(Boolean),cast=[...lead,...support];
   if(d){const dw=w.some(x=>x.category==='director'||x.category==='picture');applyMomentumChange(d,dw?4:w.length?2:1,`${f.title}: awards season`,'awards');if(dw)addCareerMilestone(d,`${f.title}: ${w.filter(x=>['director','picture'].includes(x.category)).map(x=>x.label).join(', ')}`,'awards');repriceTalent(d)}
   cast.forEach(t=>{const personalWins=w.filter(x=>awardRecordBelongsToTalent(t,f,x)),personalNoms=n.filter(x=>awardRecordBelongsToTalent(t,f,x));applyMomentumChange(t,personalWins.length?4:personalNoms.length?2:w.length?1:0,`${f.title}: awards season`,'awards');if(personalWins.length)addCareerMilestone(t,`${f.title}: ${personalWins.map(x=>x.label).join(', ')}`,'awards');repriceTalent(t)});
  }
 });
 return {season,week:state.week,categories,playerNoms,playerWins};
}
function triggerAwardsCeremony(){
 const season=Math.floor(state.week/52);if(season<1||state.lastAwardsSeasonResolved>=season)return false;
 const c=buildAwardsCeremony(season);recordAwardsRivalries(c);state.lastAwardsSeasonResolved=season;state.awardsArchive=state.awardsArchive||[];state.awardsArchive.unshift(c);state.awardsArchive=state.awardsArchive.slice(0,20);state.pendingCeremony=c;state.awardsCeremonyStep=0;state.screen='ceremony';state.detail=null;state.history=[];
 addNews(state,`The Year ${season} awards concluded with ${c.playerWins?`${state.studio.name} collecting ${c.playerWins} win${c.playerWins===1?'':'s'} from ${c.playerNoms} nomination${c.playerNoms===1?'':'s'}`:'the industry recognising the year’s strongest films and performances'}.`,'Awards');if(typeof checkStudioMilestones==='function')checkStudioMilestones();return true;
}
function maybeResolveAwardsSeason(){if(state.week%52===0)triggerAwardsCeremony()}
function awardsCurrentSeason(){let season=Math.floor((state.week-1)/52)+1;if(state.week%52===0&&state.lastAwardsSeasonResolved>=season)season+=1;const start=(season-1)*52+1;return {season,start,end:season*52,films:state.films.filter(f=>f.stage==='complete'&&f.completeWeek>=start&&f.completeWeek<=state.week),nominations:awardsNominationRecord(season)}}
function awardsSummaryForFilm(f){const a=ensureAfterlifeState(f);return a.wins.length?`${a.wins.length} award win${a.wins.length===1?'':'s'} · ${a.nominations.length} nomination${a.nominations.length===1?'':'s'}`:a.nominations.length?`${a.nominations.length} award nomination${a.nominations.length===1?'':'s'}`:'No major awards recognition'}

// Studio development access is earned rather than granted on day one.
function developmentRouteAccess(mode){
 const creative=state.reputation?.creative??45;
 if(mode==='market')return {unlocked:true,label:'Available',need:0,progress:100,text:'Finished screenplays already circulating on The Lot.'};
 if(mode==='commission'){
  const need=55,unlocked=creative>=need;
  return {unlocked,label:unlocked?'Unlocked':`Creative reputation ${need}`,need,progress:clamp((creative-45)/(need-45)*100,0,100),text:unlocked?'Your studio has enough creative credibility to hire writers against a strategic brief.':`Build Creative reputation from ${Math.round(creative)} to ${need} to unlock commissioned screenplays.`};
 }
 const need=70,unlocked=creative>=need;
 return {unlocked,label:unlocked?'Unlocked':`Creative reputation ${need}`,need,progress:clamp((creative-45)/(need-45)*100,0,100),text:unlocked?'The studio can now originate fully owned properties from its own creative brief.':`Build Creative reputation from ${Math.round(creative)} to ${need} to unlock original studio concepts.`};
}
function requireDevelopmentRoute(mode){const a=developmentRouteAccess(mode);if(a.unlocked)return true;showToast(a.text);return false}
function checkDevelopmentUnlocks(){
 if(!state.studio)return;state.developmentUnlocks=state.developmentUnlocks||{commissionNotified:false,originalNotified:false};
 [['commission','commissionNotified','Commissioning unlocked'],['concept','originalNotified','Original development unlocked']].forEach(([mode,key,title])=>{const a=developmentRouteAccess(mode);if(a.unlocked&&!state.developmentUnlocks[key]){state.developmentUnlocks[key]=true;notify(`development-unlock:${mode}`,title,mode==='commission'?'Your Creative reputation is now strong enough to commission screenplays directly from writers.':'Your Creative reputation is now strong enough to originate fully studio-owned screenplay concepts.',null,false,'milestone',{screen:'develop',detail:null});}});
}
