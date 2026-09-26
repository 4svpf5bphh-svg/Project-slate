// v3.7.6 — Music & Soundtrack
// One contained creative decision in post-production. Music does not consume a
// major post intervention; it must be resolved before picture lock.
const SOUNDTRACK_TRACKS=[
 {id:'teardrop',artist:'Massive Attack',title:'Teardrop',license:.75,familiarity:79,genres:['Psychological Horror','Crime Thriller','Prestige Drama','Science Fiction'],tones:['grounded','balanced'],mood:'Haunting / intimate'},
 {id:'everything-right',artist:'Radiohead',title:'Everything In Its Right Place',license:1.10,familiarity:82,genres:['Science Fiction','Psychological Horror','Prestige Drama'],tones:['grounded','balanced'],mood:'Unsettling / cerebral'},
 {id:'gimme-shelter',artist:'The Rolling Stones',title:'Gimme Shelter',license:1.35,familiarity:91,genres:['Crime Thriller','Action Thriller','Prestige Drama'],tones:['grounded','heightened'],mood:'Danger / momentum'},
 {id:'where-mind',artist:'Pixies',title:'Where Is My Mind?',license:.72,familiarity:84,genres:['Psychological Horror','Comedy','Prestige Drama'],tones:['balanced','heightened'],mood:'Off-kilter / iconic'},
 {id:'running-hill',artist:'Kate Bush',title:'Running Up That Hill',license:1.40,familiarity:92,genres:['Fantasy','Science Fiction','Prestige Drama','Psychological Horror'],tones:['grounded','heightened'],mood:'Yearning / propulsive'},
 {id:'the-chain',artist:'Fleetwood Mac',title:'The Chain',license:1.15,familiarity:90,genres:['Action Thriller','Prestige Drama','Crime Thriller'],tones:['grounded','heightened'],mood:'Defiant / escalating'},
 {id:'sabotage',artist:'Beastie Boys',title:'Sabotage',license:1.00,familiarity:88,genres:['Action Thriller','Comedy','Crime Thriller'],tones:['heightened','balanced'],mood:'Chaotic / kinetic'},
 {id:'midnight-city',artist:'M83',title:'Midnight City',license:.78,familiarity:83,genres:['Science Fiction','Comedy','Family Adventure'],tones:['heightened','balanced'],mood:'Neon / euphoric'},
 {id:'heroes',artist:'David Bowie',title:'Heroes',license:1.45,familiarity:94,genres:['Prestige Drama','Family Adventure','Science Fiction','Fantasy'],tones:['grounded','balanced'],mood:'Earnest / soaring'},
 {id:'paint-black',artist:'The Rolling Stones',title:'Paint It Black',license:1.20,familiarity:93,genres:['Crime Thriller','Psychological Horror','Action Thriller'],tones:['heightened','grounded'],mood:'Dark / relentless'},
 {id:'dog-days',artist:'Florence + The Machine',title:'Dog Days Are Over',license:.92,familiarity:88,genres:['Comedy','Family Adventure','Prestige Drama'],tones:['heightened','balanced'],mood:'Release / uplift'},
 {id:'blue-sky',artist:'Electric Light Orchestra',title:'Mr. Blue Sky',license:.95,familiarity:93,genres:['Comedy','Family Adventure'],tones:['heightened','balanced'],mood:'Bright / playful'},
 {id:'sweet-dreams',artist:'Eurythmics',title:'Sweet Dreams (Are Made of This)',license:1.05,familiarity:94,genres:['Science Fiction','Psychological Horror','Comedy'],tones:['heightened','balanced'],mood:'Stylised / uncanny'},
 {id:'dreams',artist:'Fleetwood Mac',title:'Dreams',license:1.10,familiarity:95,genres:['Prestige Drama','Comedy','Family Adventure'],tones:['grounded','balanced'],mood:'Warm / reflective'},
 {id:'forest',artist:'The Cure',title:'A Forest',license:.58,familiarity:70,genres:['Psychological Horror','Crime Thriller','Fantasy'],tones:['grounded','balanced'],mood:'Cold / atmospheric'},
 {id:'dance-yourself',artist:'LCD Soundsystem',title:'Dance Yrself Clean',license:.68,familiarity:68,genres:['Comedy','Prestige Drama','Crime Thriller'],tones:['balanced','heightened'],mood:'Slow-burn / explosive'},
 {id:'intro',artist:'The xx',title:'Intro',license:.52,familiarity:75,genres:['Prestige Drama','Crime Thriller','Science Fiction'],tones:['grounded','balanced'],mood:'Minimal / cinematic'},
 {id:'electric-feel',artist:'MGMT',title:'Electric Feel',license:.72,familiarity:86,genres:['Comedy','Science Fiction','Family Adventure'],tones:['heightened','balanced'],mood:'Colourful / strange'},
 {id:'immigrant-song',artist:'Led Zeppelin',title:'Immigrant Song',license:1.65,familiarity:96,genres:['Action Thriller','Fantasy','Science Fiction'],tones:['heightened','balanced'],mood:'Mythic / charging'},
 {id:'wicked-game',artist:'Chris Isaak',title:'Wicked Game',license:.88,familiarity:89,genres:['Prestige Drama','Crime Thriller','Psychological Horror'],tones:['grounded','balanced'],mood:'Romantic / haunted'},
 {id:'heart-glass',artist:'Blondie',title:'Heart of Glass',license:.98,familiarity:92,genres:['Comedy','Crime Thriller','Prestige Drama'],tones:['heightened','balanced'],mood:'Cool / ironic'},
 {id:'everybody-rule',artist:'Tears for Fears',title:'Everybody Wants to Rule the World',license:1.18,familiarity:94,genres:['Prestige Drama','Science Fiction','Crime Thriller','Comedy'],tones:['balanced','heightened'],mood:'Nostalgic / uneasy'},
 {id:'house-rising-sun',artist:'The Animals',title:'The House of the Rising Sun',license:.86,familiarity:93,genres:['Crime Thriller','Psychological Horror','Prestige Drama'],tones:['grounded','heightened'],mood:'Doomed / timeless'},
 {id:'you-spin',artist:'Dead or Alive',title:'You Spin Me Round (Like a Record)',license:.72,familiarity:90,genres:['Comedy','Psychological Horror','Science Fiction'],tones:['heightened','balanced'],mood:'Camp / kinetic'},
 {id:'under-pressure',artist:'Queen & David Bowie',title:'Under Pressure',license:1.55,familiarity:97,genres:['Prestige Drama','Family Adventure','Comedy','Science Fiction'],tones:['grounded','balanced'],mood:'Human / escalating'},
 {id:'bad-moon',artist:'Creedence Clearwater Revival',title:'Bad Moon Rising',license:.82,familiarity:92,genres:['Psychological Horror','Crime Thriller','Action Thriller'],tones:['grounded','balanced'],mood:'Foreboding / jaunty'},
 {id:'love-tear',artist:'Joy Division',title:'Love Will Tear Us Apart',license:.70,familiarity:85,genres:['Prestige Drama','Psychological Horror','Crime Thriller'],tones:['grounded','balanced'],mood:'Bleak / romantic'},
 {id:'paper-planes',artist:'M.I.A.',title:'Paper Planes',license:.90,familiarity:89,genres:['Crime Thriller','Comedy','Action Thriller'],tones:['heightened','balanced'],mood:'Rebellious / playful'},
 {id:'young-folks',artist:'Peter Bjorn and John',title:'Young Folks',license:.62,familiarity:82,genres:['Comedy','Prestige Drama','Family Adventure'],tones:['grounded','balanced'],mood:'Warm / offbeat'},
 {id:'personal-jesus',artist:'Depeche Mode',title:'Personal Jesus',license:.92,familiarity:90,genres:['Crime Thriller','Psychological Horror','Science Fiction'],tones:['heightened','grounded'],mood:'Dark / swaggering'}
];
function soundtrackTrack(id){return SOUNDTRACK_TRACKS.find(x=>x.id===id)||null}
function ensureSoundtrackState(f){
 if(!f)return null;
 if(f.soundtrack===undefined)f.soundtrack=null;
 const p=ensurePostState(f);p.musicDraft=p.musicDraft||{strategy:'original',trackId:null};
 return f.soundtrack;
}
function soundtrackOriginalFit(f){
 const c=f.creative||defaultCreative();let v=64;
 if(['Prestige Drama','Fantasy','Science Fiction','Psychological Horror'].includes(f.genre))v+=7;
 if(c.positioning==='prestige')v+=7;if(c.emphasis==='performance')v+=3;if(c.tone==='grounded')v+=2;
 return clamp(v,42,91);
}
function soundtrackTrackFit(f,t){
 if(!t)return 0;const c=f.creative||defaultCreative();let v=43;
 if(t.genres.includes(f.genre))v+=27;else if((f.genre.includes('Thriller')&&t.genres.some(g=>g.includes('Thriller'))))v+=13;
 if(t.tones.includes(c.tone))v+=9;
 if(c.emphasis==='spectacle'&&/kinetic|propulsive|relentless|explosive|soaring/i.test(t.mood))v+=6;
 if(c.positioning==='prestige'&&/intimate|cerebral|reflective|atmospheric|minimal/i.test(t.mood))v+=5;
 const id=ensureFilmIdentity(f),mood=String(t.mood||'');
 if(id.archetype.includes('Performance')||id.archetype.includes('Relationship')){if(/intimate|human|romantic|reflective|warm|yearning/i.test(mood))v+=7}
 if(id.archetype.includes('Kinetic')||id.engine==='momentum'){if(/kinetic|propulsive|charging|relentless|rebellious|explosive/i.test(mood))v+=7}
 if(id.archetype.includes('Unsettling')||id.archetype.includes('Paranoid')){if(/haunting|unsettling|dark|foreboding|bleak|uncanny|cold/i.test(mood))v+=7}
 if(id.archetype.includes('World-Building')||id.archetype.includes('Mythic')){if(/mythic|soaring|timeless|cinematic|euphoric/i.test(mood))v+=6}
 if(id.archetype.includes('Comedy')||id.archetype.includes('Crowd-Pleaser')){if(/playful|bright|offbeat|camp|warm|chaotic/i.test(mood))v+=6}
 const r=makeRng(hash((state.seed||1)+'|music-fit-v314|'+f.id+'|'+t.id));v+=(r()-.5)*10;
 return Math.round(clamp(v,28,96));
}

function soundtrackOffers(f){
 const recent=playerFilms().filter(x=>x.id!==f.id&&x.soundtrack?.committed).sort((a,b)=>(b.soundtrack?.committedWeek||0)-(a.soundtrack?.committedWeek||0)).slice(0,5);
 const usedTracks=new Set(recent.map(x=>x.soundtrack?.trackId).filter(Boolean)),usedArtists=new Set(recent.map(x=>x.soundtrack?.trackArtist).filter(Boolean));
 const ranked=SOUNDTRACK_TRACKS.map(t=>{
  let fit=soundtrackTrackFit(f,t);if(usedTracks.has(t.id))fit-=18;else if(usedArtists.has(t.artist))fit-=7;
  return {track:t,fit:Math.round(clamp(fit,20,98)),fresh:!usedTracks.has(t.id)};
 }).sort((a,b)=>b.fit-a.fit||b.track.familiarity-a.track.familiarity);
 const limit=typeof soundtrackShortlistSize==='function'?soundtrackShortlistSize():5,out=[],artists=new Set();
 for(const x of ranked){if(out.length>=limit)break;if(artists.has(x.track.artist)&&ranked.some(y=>!artists.has(y.track.artist)&&!out.includes(y)))continue;out.push(x);artists.add(x.track.artist)}
 return out.length>=limit?out:ranked.slice(0,limit);
}

function soundtrackStrategyInfo(f,strategy,trackId=null){
 const track=soundtrackTrack(trackId),originalFit=soundtrackOriginalFit(f);let fit=originalFit,cost=.12,label='Minimal / source music',desc='Keep music restrained and scene-bound. Cheap, specific and best when the film does not need music to sell scale.';
 if(strategy==='original'){cost=+(.55+Math.min(1.15,f.budget*.024)).toFixed(2);label='Original score';desc='Commission a bespoke score shaped around the finished cut. Strongest for cohesion and critical craft; little pre-existing awareness.'}
 if(strategy==='needle'){fit=track?soundtrackTrackFit(f,track):55;cost=+(.25+(track?.license||0)).toFixed(2);label='Licensed signature song';desc='Build the music identity around a recognisable needle drop. More audience familiarity and campaign utility, but expensive and fit matters.'}
 if(strategy==='hybrid'){const tf=track?soundtrackTrackFit(f,track):55;fit=Math.round(originalFit*.42+tf*.58);cost=+(.62+(track?.license||0)*.82).toFixed(2);label='Hybrid score + signature song';desc='Use an original score for cohesion and one recognisable song as a public-facing musical hook. Highest cost, broadest upside.'}
 if(strategy==='minimal'){fit=58+(f.creative?.tone==='grounded'?10:0)+(f.creative?.positioning==='prestige'?7:0)+(f.genre==='Psychological Horror'?5:0)-(f.creative?.emphasis==='spectacle'?10:0);fit=Math.round(clamp(fit,35,88))}
 const band=fit>=82?{label:'Inspired fit',cls:'good'}:fit>=70?{label:'Strong fit',cls:'blue'}:fit>=58?{label:'Workable',cls:'warn'}:{label:'Creative risk',cls:'bad'};
 return {strategy,track,fit,cost,label,desc,...band};
}
function soundtrackReleaseModifiers(f){
 if(!f?.soundtrack?.committed)return {critics:0,audience:0,awareness:0,legs:0};
 const s=f.soundtrack,fit=s.fit||60,q=(fit-60)/20;let critics=0,audience=0,awareness=0,legs=0;
 if(s.strategy==='original'){critics=q*1.9;audience=q*.7;legs=q*.004}
 if(s.strategy==='needle'){critics=q*.7;audience=q*1.45;awareness=(s.trackFamiliarity||0)/34+q*.6;legs=q*.008}
 if(s.strategy==='hybrid'){critics=q*1.35;audience=q*1.25;awareness=(s.trackFamiliarity||0)/42+q*.45;legs=q*.007}
 if(s.strategy==='minimal'){critics=q*1.55;audience=q*.35;awareness=-.25;legs=q*.003}
 return {critics:clamp(critics,-2.5,3.2),audience:clamp(audience,-2.5,3.5),awareness:clamp(awareness,-.5,4.2),legs:clamp(legs,-.018,.025)};
}
function soundtrackSummary(f){
 if(!f?.soundtrack?.committed)return 'Music plan not yet committed';const s=f.soundtrack,t=s.trackId?soundtrackTrack(s.trackId):null;
 return t?`${s.label} · ${t.artist} — “${t.title}”`:`${s.label}`;
}
function selectSoundtrackStrategy(f,strategy){ensureSoundtrackState(f);const p=ensurePostState(f);p.musicDraft.strategy=strategy;if(!['needle','hybrid'].includes(strategy))p.musicDraft.trackId=null;save();render()}
function selectSoundtrackTrack(f,trackId){ensureSoundtrackState(f);const p=ensurePostState(f);p.musicDraft.trackId=trackId;save();render()}
function commitSoundtrack(f){
 ensureSoundtrackState(f);if(f.soundtrack?.committed)return showToast('The soundtrack plan is already committed.');
 const p=ensurePostState(f),strategy=p.musicDraft?.strategy||'original',needsTrack=['needle','hybrid'].includes(strategy),track=needsTrack?soundtrackTrack(p.musicDraft?.trackId):null;
 if(needsTrack&&!track)return showToast('Choose the signature song first.');
 const info=soundtrackStrategyInfo(f,strategy,track?.id||null);if(!spend(info.cost))return;
 f.investment+=info.cost;f.soundtrack={committed:true,strategy,label:info.label,fit:info.fit,cost:info.cost,trackId:track?.id||null,trackArtist:track?.artist||null,trackTitle:track?.title||null,trackFamiliarity:track?.familiarity||0,committedWeek:state.week};
 f.history.push(`Week ${state.week}: soundtrack committed — ${soundtrackSummary(f)}.`);
 if(info.fit>=82)addNews(state,`${f.title}'s music team has locked ${track?`${track.artist} — “${track.title}” into a ${strategy==='hybrid'?'hybrid score':'licensed-song'} plan`:'an original score'}, with the studio describing the creative fit as unusually strong.`,'Your Studio');
 save();render();
}
function soundtrackPostUI(f){
 ensureSoundtrackState(f);if(f.soundtrack?.committed){const s=f.soundtrack,mods=soundtrackReleaseModifiers(f);return `<div class="section-title"><h2>Music & soundtrack</h2><span class="pill good">Locked</span></div><div class="card goodline"><div class="row"><div><strong>${soundtrackSummary(f)}</strong><div class="small">Creative fit ${Math.round(s.fit)} · ${money(s.cost)} committed</div></div><span class="pill good">Music locked</span></div><div class="small" style="margin-top:8px">The music plan now feeds into finished-film reception and, where relevant, pre-release awareness. It does not consume a major post intervention.</div></div>`}
 const p=ensurePostState(f),draft=p.musicDraft||{strategy:'original',trackId:null},offers=soundtrackOffers(f),strategies=['original','needle','hybrid','minimal'];
 const cards=strategies.map(id=>{const info=soundtrackStrategyInfo(f,id,draft.trackId);return `<button class="card music-strategy selection-card ${draft.strategy===id?'selected-choice':''}" data-music-strategy="${id}" aria-pressed="${draft.strategy===id?'true':'false'}">${draft.strategy===id?'<div class="selected-choice-badge">✓ Selected music strategy</div>':''}<div class="row"><strong>${info.label}</strong><span class="pill ${info.cls}">${info.label==='Original score'?Math.round(info.fit)+' fit':info.label==='Minimal / source music'?Math.round(info.fit)+' fit':info.track?Math.round(info.fit)+' fit':'Choose song'}</span></div><div class="small" style="margin-top:7px">${info.desc}</div><div class="small" style="margin-top:7px"><strong>${money(info.cost)}</strong>${['needle','hybrid'].includes(id)&&!draft.trackId?' + song selection':''}</div></button>`}).join('');
 const songs=['needle','hybrid'].includes(draft.strategy)?`<div class="section-title"><h2>Signature song shortlist</h2><span class="small">${offers.length} deterministic music-supervisor options for this film</span></div><div class="grid">${offers.map(({track,fit})=>`<button class="card selection-card ${draft.trackId===track.id?'selected-choice':''}" data-music-track="${track.id}" aria-pressed="${draft.trackId===track.id?'true':'false'}">${draft.trackId===track.id?'<div class="selected-choice-badge">✓ Selected song</div>':''}<div class="row"><div><strong>${track.artist}</strong><div class="small">“${track.title}” · ${track.mood}</div></div><span class="pill ${fit>=82?'good':fit>=70?'blue':fit>=58?'warn':'bad'}">Fit ${fit}</span></div><div class="small" style="margin-top:7px">Licence ${money(track.license)} · familiarity ${track.familiarity}/100 · ${ensureFilmIdentity(f).texture} film fit</div></button>`).join('')}</div>`:'';
 const preview=soundtrackStrategyInfo(f,draft.strategy,draft.trackId);
 return `<div class="section-title"><h2>Music & soundtrack</h2><span class="small">Required before picture lock · does not use an intervention</span></div><div class="grid cols2">${cards}</div>${songs}<div class="card music-commit-card ${preview.fit>=82?'goodline':''}" style="margin-top:12px"><div class="row"><div><strong>${preview.label}</strong><div class="small">Creative fit ${Math.round(preview.fit)} · ${money(preview.cost)}</div></div><span class="pill ${preview.cls}">${preview.label==='Licensed signature song'||preview.label.startsWith('Hybrid')?(preview.track?`${preview.track.artist} · ${preview.track.title}`:'Song required'):preview.label}</span></div><div class="body" style="margin-top:8px">Music can improve or undermine the finished film depending on fit. Recognisable songs can also add release awareness — but familiarity is not a substitute for creative fit.</div><button id="commitSoundtrack" class="btn primary block" style="margin-top:10px" ${['needle','hybrid'].includes(draft.strategy)&&!draft.trackId?'disabled':''}>Commit music plan · ${money(preview.cost)}</button></div>`;
}
// Observational production story: one entry per shoot week, with no extra
// decisions or stat changes. Entries survive in the completed film's record.
function ensureShootJournal(f){f.shootJournal=Array.isArray(f.shootJournal)?f.shootJournal:[];return f.shootJournal}
function recordProductionDaily(f){
 const journal=ensureShootJournal(f),week=state.week;
 if(journal.some(x=>x.week===week))return;
 const ps=f.productionState||{},m=f.metrics||{},director=talentById(f.directorId),lead=talentById(f.cast?.[0]),support=(f.supportingCastIds||[]).map(talentById).filter(Boolean)[0];
 const d=director?.name||'The director',l=lead?.name||'The lead',pool=[];
 const add=(topic,...lines)=>lines.forEach(text=>pool.push({topic,text}));
 const pw=Math.max(1,f.productionWeek||1),progress=f.productionStart&&f.productionEnd?clamp((state.week-f.productionStart+1)/Math.max(1,f.productionEnd-f.productionStart+1),0,1):.5;
 if(pw<=2)add('start',`${d} is still establishing the rhythm of the unit; the early footage is more about coverage than verdicts.`,`The first blocks are in the can. Editorial is seeing enough to spot texture, but not enough to call the film yet.`,`The shoot is still finding its working tempo. Nothing in the rushes is forcing a studio intervention.`);
 else if(progress>.72)add('finish',`The unit has moved into the back stretch. ${d} is protecting the scenes the cut will need rather than chasing extra coverage.`,`With the finish line in sight, the dailies are becoming more coherent: there is now enough footage to see the film's shape.`,`The production team is starting to talk in terms of what the edit already has, not simply what remains on the call sheet.`);
 else add('middle',`The shoot has settled into its working rhythm; the dailies are beginning to reveal which choices are surviving from page to screen.`,`There is enough footage now for patterns to emerge. The current material feels more like a film than a collection of successful shooting days.`,`Editorial is seeing a consistent visual and performance language across the material coming in this week.`);
 if((ps.schedule||0)>0)add('schedule',`The unit remains ${ps.schedule} week${ps.schedule===1?'':'s'} behind. ${d} is protecting the scenes that cannot be moved.`,`Schedule pressure is visible in the call sheets, but the team is concentrating resources on the sequences that would be hardest to recover later.`,`The lost time has not disappeared; production is trading flexibility for certainty as it tries to make the revised wrap date.`);
 if((ps.morale||65)<54)add('morale','The crew is getting the pages, but the long days are beginning to show in the dailies.','The footage is still usable, though the unit feels tired; small resets are taking longer and the pace between setups has softened.','The strain is less visible on camera than around it. Production morale is becoming part of the risk picture.');
 if((m.chemistry||0)>=78&&lead)add('chemistry',`${l} and the ensemble are finding moments between the scripted beats; the edit may have more to work with than expected.`,`The strongest material this week is relational rather than spectacular — the cast are giving editorial useful reactions and transitions.`,support?`${support.name} is helping the ensemble scenes breathe; the supporting work is giving ${l} more to play against.`:`The cast chemistry is producing usable material around the edges of the scripted scenes.`);
 if((m.performances||0)>=82)add('performance',`Performance footage is arriving with confidence; ${d} is getting usable variation without burning excessive takes.`,`The acting work is holding together across coverage, which gives editorial more freedom than a single 'hero' take would.`,`The dailies are showing consistent character work rather than isolated good scenes.`);
 else if((m.performances||0)<58)add('performance','The performance work remains less convincing than the package suggested.','Editorial is finding fewer clean performance options than hoped; some scenes are depending heavily on the preferred take.','The acting material is uneven enough that later scenes may need to carry more emotional weight than planned.');
 if((m.technical||0)>=82)add('technical','The technical departments are delivering unusually clean material; ambitious setups are arriving without obvious repair work attached.','Camera, lighting and effects work are giving the cut polish before post has had to rescue anything.','The craft departments are buying the film production value on screen rather than merely protecting the schedule.');
 else if((m.technical||0)<58)add('technical','The technical footage is usable, though the team is watching the more ambitious setups closely.','A few setups are arriving with compromises that post may have to disguise rather than enhance.','The technical ceiling is not matching the plan yet; coverage is safe, but the showcase material needs care.');
 if((m.clarity||0)<58)add('clarity','The assembled scenes are raising story-clarity questions that may need pickups or editorial solutions.','Individual scenes are playing, but the connective tissue is less clear when the footage is viewed in sequence.','Editorial is flagging transitions and story geography rather than performances as the current weak point.');
 else if((m.clarity||0)>=80)add('clarity','The material is cutting together cleanly; scene intent is surviving without needing explanatory coverage.','Story geography is reading clearly in the assemblies, which is reducing pressure on later pickups.');
 if((m.stability||0)>=78)add('stability',`${d} is bringing the shoot in steadily; coverage is arriving without major surprises.`,`The unit is producing dependable footage at a predictable rate — not glamorous, but exactly what keeps a production healthy.`,`The production machine is behaving: departments are handing work to one another without creating new fires for the studio.`);
 else if((m.stability||0)<58)add('stability','The shoot is fragile: small disruptions are having an outsized effect on the unit.','The dailies themselves are not collapsing, but the margin for another production problem is getting thin.','Production is still moving, though each interruption is costing more time and focus than it should.');
 const recentText=new Set(journal.slice(-4).map(x=>x.text)),recentTopics=new Set(journal.slice(-2).map(x=>x.topic));
 let choices=pool.filter(x=>!recentText.has(x.text)&&!recentTopics.has(x.topic));
 if(!choices.length)choices=pool.filter(x=>!recentText.has(x.text));
 if(!choices.length)choices=pool.filter(x=>x.topic!==journal.at(-1)?.topic);
 if(!choices.length)choices=pool;
 const r=makeRng(hash(state.seed+'|daily|'+f.id+'|'+week+'|'+(f.productionWeek||1)));
 const topicUse=journal.reduce((a,x)=>(a[x.topic]=(a[x.topic]||0)+1,a),{});
 const minUse=Math.min(...choices.map(x=>topicUse[x.topic]||0));
 const leastUsed=choices.filter(x=>(topicUse[x.topic]||0)===minUse);
 const chosen=leastUsed[Math.floor(r()*leastUsed.length)]||{topic:'steady',text:'Production is progressing without a major studio-level problem. The footage is broadly tracking the intended plan.'};
 const mood=(ps.morale||65)<54||(m.stability||0)<58?'strained':(m.stability||0)>=78?'steady':'mixed';
 journal.push({week,productionWeek:f.productionWeek,text:chosen.text,topic:chosen.topic,mood});
 if(journal.length>24)journal.shift();
}
function priorFilmCallback(f,currentProfit=f.studioRevenue-f.investment){
 if(typeof hollywoodHistoryCallback==='function'){const richer=hollywoodHistoryCallback(f,currentProfit);if(richer)return richer}
 const prior=playerFilms().filter(x=>x.id!==f.id&&x.stage==='complete'&&(x.completeWeek||0)<=(f.completeWeek||state.week)).sort((a,b)=>(b.completeWeek||0)-(a.completeWeek||0));
 const match=prior.find(x=>x.genre===f.genre)||prior[0];if(!match)return null;
 const p=(match.legacy?.profit??(match.studioRevenue-match.investment)),current=currentProfit;
 const connection=match.genre===f.genre?`another ${f.genre.toLowerCase()} release`:'the studio’s recent filmography';
 return {filmId:match.id,title:match.title,text:`Compared with ${match.title}, ${connection}, ${f.title} ${current>=p?'improved':'fell short of'} the studio result by ${money(Math.abs(current-p))}. ${match.title} remains ${p>=0?'a profitable':'a loss-making'} reference point in the catalogue.`};
}
function yearEraLabel(year,films){
 const player=films.filter(f=>f.owner==='player');
 if(!player.length)return 'The Waiting Year';
 const results=player.map(f=>f.legacy?.profit??(f.studioRevenue-f.investment));
 const gains=results.filter(x=>x>2).length,losses=results.filter(x=>x<-.5).length;
 if(gains>=2&&gains>losses)return 'The Breakthrough Year';
 if(losses>=2&&losses>gains)return 'The Rebuilding Year';
 if(player.some(f=>f.finalGross>=150))return 'The Event Year';
 if(player.some(f=>f.review?.critics>=85))return 'The Critics’ Year';
 if(player.length>=3)return 'The Prolific Year';
 return 'The Foundation Year';
}

// v3.7.4 — cinematic end-of-run synthesis. These helpers do not add a new
// simulation layer: they turn the film's existing production, campaign,
// release, talent, studio-memory and press state into one authored-feeling
// closing story.
function filmWrapRunWeeks(f){return Math.max(1,(f.weeklyResults||[]).length)}
function filmWrapTone(f,l=ensureLegacyState(f)){
 const critics=f.review?.critics||0,audience=f.review?.audience||0;
 if(l.outcomeClass==='bad')return {id:'disaster',label:'A bruising finish'};
 if(l.outcomeClass==='warn')return {id:'complicated',label:'A difficult result'};
 if(critics>=85&&critics>=audience+7)return {id:'prestige',label:'A critical statement'};
 if(audience>=88&&audience>=critics+7)return {id:'audience',label:'An audience film'};
 if(f.releaseProfile?.type==='breakout'||l.profit>=18||l.roi>=.65)return {id:'triumph',label:'A release that changed the room'};
 return {id:'solid',label:'A film with a place in the catalogue'};
}
function filmWrapVerdictHeadline(f,l=ensureLegacyState(f)){
 const t=filmWrapTone(f,l),weeks=filmWrapRunWeeks(f),hold=l.bestHold;
 if(t.id==='disaster')return f.releaseProfile?.type==='bomb'?'The campaign ended. The damage did not.':'A film the studio will have to carry.';
 if(t.id==='complicated')return (f.review?.audience||0)>=78?'Audiences found it. The economics never quite did.':'The run never became the one the studio needed.';
 if(t.id==='prestige')return l.profit>=0?'The kind of film that makes a studio look serious.':'The reviews survived the balance sheet.';
 if(t.id==='audience')return hold!==null&&hold<.30?'Word of mouth did what the campaign could not.':'The audience made the film bigger than the reviews.';
 if(t.id==='triumph')return l.weeksAtOne>=2?`${l.weeksAtOne} weeks on top — and suddenly the studio has leverage.`:'The opening was good. The run became the story.';
 return weeks>=6?'A steady run, a real result, and another film in the studio history.':'A clean finish without the mythology.';
}
function filmWrapVerdictCopy(f,l=ensureLegacyState(f)){
 const t=filmWrapTone(f,l),track=typeof trackingVsActual==='function'?trackingVsActual(f,l.opening):null,crit=f.review?.critics||0,aud=f.review?.audience||0;
 let first='';
 if(t.id==='disaster')first=`The red number is not subtle. ${f.title} closed at ${money(f.finalGross)} worldwide and left ${state.studio.name} with a ${money(Math.abs(l.profit))} loss. What was meant to be a release is now a reference point the next greenlight will have to answer.`;
 else if(t.id==='complicated')first=`This is the annoying kind of result that refuses a clean headline. ${f.title} finished at ${money(f.finalGross)} worldwide and left the studio ${l.profit>=0?'just above water':'in the red'}, while the response remained more interesting than the ledger.`;
 else if(t.id==='prestige')first=`The accountants will eventually stop staring at the gross. Filmmakers may not. ${f.title} finished with ${money(f.finalGross)} worldwide and a ${crit}% critical score, giving ${state.studio.name} a film ambitious people can point to when they ask what the studio actually protects.`;
 else if(t.id==='audience')first=`Critics can keep arguing. Audiences did something more commercially useful: they kept recommending the film. A ${aud}% audience score gave ${f.title} a longer life than the campaign could buy on its own.`;
 else if(t.id==='triumph')first=`After a hit, everybody on The Lot suddenly remembers your phone number. ${f.title} closed at ${money(f.finalGross)} worldwide and returned ${money(l.profit)} to the studio, giving talent, rivals and financiers a fresh result to measure ${state.studio.name} against.`;
 else first=`Not every release becomes lore. Some become evidence. ${f.title} ends at ${money(f.finalGross)} worldwide with ${l.profit>=0?'a '+money(l.profit)+' studio profit':'a '+money(Math.abs(l.profit))+' studio loss'}, and it is now part of what this studio can actually point to rather than promise.`;
 if(track)first+=` ${track.text}`;
 if(l.bestHold!==null&&l.bestHold<.18)first+=` The strongest hold — ${l.bestHold<0?Math.round(Math.abs(l.bestHold)*100)+'% growth':Math.round(l.bestHold*100)+'% down'} — turned staying power into part of the film's identity.`;
 const choice=filmChoiceCallback(f);if(choice)first+=' '+choice;return first;
}
function wrapCapitalise(text=''){const s=String(text||'').trim();return s?s[0].toUpperCase()+s.slice(1):s}
function filmWrapProductionMoment(f){
 const journal=ensureShootJournal(f);if(!journal.length)return null;
 const decisions=journal.filter(x=>x.mood==='decision'),creative=decisions.find(x=>x.topic==='creativeDirection');
 const dramatic=/injury|walk|friction|director|stunt|location|weather|overrun|story|rehears|chemistry/i;
 const chosen=creative||decisions.find(x=>dramatic.test(x.text))||decisions[0]||journal.find(x=>x.mood==='strained')||journal[journal.length-1];
 const lead=chosen.mood==='decision'?`${chosen.text} The choice became part of the film that reached the screen.`:chosen.text;
 return {phase:'PRODUCTION',label:`Production week ${chosen.productionWeek||'—'}`,text:lead,tone:chosen.mood==='strained'?'bad':chosen.mood==='steady'?'good':'neutral'};
}
function filmWrapCampaignMoment(f){
 const m=f.marketingState;if(!m)return null;
 const moments=[...(m.publicMoments||[])];if(!moments.length&&!(m.eventLog||[]).length)return null;
 const weight={viral:9,strong:8,excellent:8,hot:8,poor:8,awkward:7,soft:7,rejected:6,accepted:6,flat:5,mixed:4,solid:3};
 const chosen=moments.sort((a,b)=>(weight[b.result]||1)-(weight[a.result]||1)||(b.day||b.week*7)-(a.day||a.week*7))[0];
 const log=chosen?(m.eventLog||[]).find(x=>x.week===chosen.week)||(m.eventLog||[])[0]:(m.eventLog||[])[0];
 let text=log?.text?wrapCapitalise(log.text):'';
 if(!text&&chosen){
  const map={
   trailer:chosen.result==='viral'?'The first trailer escaped the paid campaign and became a story of its own.':chosen.result==='soft'?'The first trailer landed softly, forcing the campaign to work harder for every point of attention.':'The first trailer gave the film its first real public identity.',
   festivalDecision:chosen.result==='accepted'?'A festival invitation gave the release an early prestige platform.':'The festival route closed before release, leaving the campaign to make its case without that endorsement.',
   festivalScreening:chosen.result==='strong'?'Festival reaction turned early reviews into part of the sell.':chosen.result==='poor'?'The first serious screening created difficult headlines before commercial release.':'The festival screening divided the room and made that split part of the film’s identity.',
   publicity:chosen.result==='viral'||chosen.result==='excellent'?'Publicity produced a moment the paid campaign could not manufacture.':chosen.result==='awkward'||chosen.result==='flat'?'Publicity failed to create the momentum the release team wanted.':'The publicity run kept the film in the conversation without redefining it.',
   gala:chosen.result==='hot'?'Premiere night gave the film one last surge of attention before opening.':'The premiere put the film in the room, but did not completely change expectations.'
  };text=map[chosen.type]||`${chosen.title||'A campaign beat'} became part of the public story before release.`;
 }
 const label=chosen?.day&&typeof calendarShortDate==='function'?calendarShortDate(chosen.day):chosen?.week?`Week ${chosen.week}`:'Campaign';
 const negative=/poor|awkward|soft|flat|rejected/.test(chosen?.result||'');
 const positive=/viral|strong|excellent|hot|accepted/.test(chosen?.result||'');
 return {phase:'CAMPAIGN',label,text,tone:negative?'bad':positive?'good':'neutral'};
}
function filmWrapBoxOfficeMoment(f,l=ensureLegacyState(f)){
 const track=typeof trackingVsActual==='function'?trackingVsActual(f,l.opening):null;
 let label='Opening weekend',text=track?.text||`${f.title} opened to ${money(l.opening)} domestic.`;
 let tone=track?.cls==='bad'?'bad':track?.cls==='good'?'good':'neutral';
 if(l.weeksAtOne>=2){label=`Week ${Math.min(filmWrapRunWeeks(f),l.weeksAtOne+1)}`;text=`${f.title} held the #1 domestic position for ${l.weeksAtOne} consecutive week${l.weeksAtOne===1?'':'s'}. By then, the release had stopped being about opening weekend and started being about staying power.`;tone='good'}
 else if(l.bestHold!==null&&l.bestHold<.20){const w=(f.weeklyResults||[]).findIndex(x=>x.drop===l.bestHold)+1;label=`Theatrical week ${Math.max(2,w)}`;text=l.bestHold<0?`The film grew ${Math.round(Math.abs(l.bestHold)*100)}% domestically from the previous weekend — the rare moment when demand expanded after release.`:`A ${Math.round(l.bestHold*100)}% domestic decline showed that word of mouth was doing real work after the opening.`;tone='good'}
 else if(f.releaseProfile?.type==='bomb'){text=`The ${money(l.opening)} domestic opening landed below what the campaign and investment needed. The rest of the run never found a way to rewrite that first weekend.`;tone='bad'}
 return {phase:'THEATRICAL RUN',label,text,tone};
}
function filmWrapStoryMoments(f){return [filmWrapProductionMoment(f),filmWrapCampaignMoment(f),filmWrapBoxOfficeMoment(f)].filter(Boolean).slice(0,3)}
function filmWrapTalentRole(f,t){
 if(t.type==='Director')return 'Director';
 const r=typeof roleForTalent==='function'?roleForTalent(f,t.id):null;
 if(r?.name)return r.name;
 return (f.supportingCastIds||[f.supportingCastId]).filter(Boolean).includes(t.id)?'Supporting cast':'Principal cast';
}
function filmWrapTalentStoryText(f,x,t){
 const prior=(t.credits||[]).filter(c=>typeof c==='object'&&c.title!==f.title),priorGross=prior.reduce((m,c)=>Math.max(m,c.gross||0),0),careerHigh=(f.finalGross||0)>priorGross&&f.finalGross>=70;
 if(t.type==='Director'){
  if((f.review?.critics||0)>=86)return `${f.title} leaves ${t.name} with more creative authority. A ${f.review.critics}% critical score is the kind of result future packages will cite.`;
  if(careerHigh)return `${f.title} is the biggest Project Slate box-office result attached to ${t.name} so far.`;
  if(x.delta<=-3)return `The film lands as a setback. ${t.name} leaves with less momentum and the next package will carry more scrutiny.`;
  return `${t.name}'s standing moves ${x.delta>0?'forward':'only modestly'}; the film adds another concrete result to the director's studio history.`;
 }
 if((f.review?.audience||0)>=88&&x.delta>=2)return `Audiences came out strongly for the film, and ${t.name} leaves with visibly more leverage for the next role.`;
 if(careerHigh&&x.delta>=0)return `${f.title} becomes ${t.name}'s biggest Project Slate box-office credit so far.`;
 if(x.delta<=-3)return `The result takes some heat out of ${t.name}'s momentum. The next casting conversation will not begin from quite the same place.`;
 if(x.delta>=3)return `${t.name} comes out of the run stronger than they entered it — not transformed, but harder to treat as interchangeable talent.`;
 return `The film changes little about ${t.name}'s market position, but the relationship with ${state.studio.name} now has another shared credit behind it.`;
}
function filmWrapTalentStories(f,l=ensureLegacyState(f)){
 const rows=(l.talentImpacts||[]).map(x=>{const t=talentById(x.id);return t?{...x,t,role:filmWrapTalentRole(f,t),text:filmWrapTalentStoryText(f,x,t)}:null}).filter(Boolean);
 rows.sort((a,b)=>(a.t.type==='Director'?-1:b.t.type==='Director'?1:0)||Math.abs(b.delta)-Math.abs(a.delta));
 return rows.slice(0,4);
}
function filmWrapPreferredJournalist(defaultId){
 if(typeof ensurePressMemory!=='function')return defaultId;
 const mem=ensurePressMemory(),rows=Object.entries(mem).map(([id,x])=>({id,mentions:x?.playerMentions||0,last:x?.lastPlayerWeek||0})).filter(x=>x.mentions>=2&&typeof journalistProfileById==='function'&&journalistProfileById(x.id));
 if(!rows.length)return defaultId;
 rows.forEach(x=>{x.score=x.mentions*2+Math.max(0,18-Math.floor((state.week-x.last)/4))+(x.id===defaultId?3:0)});
 rows.sort((a,b)=>b.score-a.score||b.last-a.last);
 return rows[0].score>=7?rows[0].id:defaultId;
}

function filmWrapVoicePolish(id,f,l,quote){
 const banks={
  'daniel-mercer':l.outcomeClass==='bad'?[`Hits make everyone a philosopher; misses make them accountants.`,`The most expensive word in Hollywood is “almost.” The ledger does not recognise it.`]:[`A hit can make any strategy look inevitable after the fact.`,`Nobody banks identity, but a recognisable hit makes the next cheque easier to explain.`],
  'ruth-bell':[`A percentage is a useful summary and a terrible memory.`,`Awards campaigns love consensus. Interesting films are not always so cooperative.`],
  'imani-kerr':[`Agents do not frame grosses on the wall. They frame leverage.`,`The useful career question is not who got praised. It is who gets to say no more often now.`],
  'mara-vance':[`Studios love calling every release a chapter. Most are footnotes. This one at least changes the next sentence.`,`The Lot has a short memory for slogans and a long one for patterns.`]
 };
 const opener=pressVoicePick(`wrap-voice|${f.id}|${id}|${l.outcomeClass}`,banks[id]||banks['mara-vance']);
 return opener?`${opener} ${quote}`:quote;
}
function filmWrapTradeVerdict(f,l=ensureLegacyState(f)){
 const critics=f.review?.critics||0,audience=f.review?.audience||0,studioIdentity=typeof studioIdentityPrimary==='function'?studioIdentityPrimary():null,filmId=ensureFilmIdentity(f);
 let id='mara-vance';
 if(l.outcomeClass==='bad'||f.releaseProfile?.type==='breakout'||l.profit>=18||f.finalGross>=150)id='daniel-mercer';
 else if(critics>=84&&critics>=audience)id='ruth-bell';
 else if((l.talentImpacts||[]).some(x=>Math.abs(x.delta)>=4))id='imani-kerr';
 id=filmWrapPreferredJournalist(id);
 const j=typeof journalistProfileById==='function'?journalistProfileById(id):null;
 const specific=f.creativeDirection?`The choice to “${f.creativeDirection.label}” survived into the finished film.`:`The finished film's clearest signature is ${filmId.strength}.`;
 let pool=[];
 if(id==='daniel-mercer'&&l.outcomeClass==='bad')pool=[
  `The number that follows this studio is the ${money(Math.abs(l.profit))} loss, but the useful lesson is more specific: ${f.title} was a ${filmId.texture} film whose ${filmId.risk} never travelled as well as the package needed.`,
  `${f.title} did not fail because audiences suddenly stopped buying ${f.genre.toLowerCase()} films. It failed as this particular ${filmId.texture} version of one, at this investment level.`,
  `The loss matters. So does the fact that the film had an identity. The next greenlight has to preserve the specificity and fix the ${filmId.risk}.`
 ];
 else if(id==='daniel-mercer')pool=[
  `${f.title} has given ${state.studio.name} a new commercial reference point: ${money(f.finalGross)} worldwide for a ${filmId.texture} ${filmId.archetype.toLowerCase()}, not a generic piece of product.`,
  l.bestHold!==null&&l.bestHold<.25?`The opening gave ${f.title} a number; the hold proved people were responding to the film rather than only the campaign. ${specific}`:`The useful part of ${money(f.finalGross)} worldwide is knowing what audiences were actually buying: ${filmId.strength}, delivered through a ${filmId.texture} package.`,
  `This result becomes leverage because the film is describable. Buyers now know what ${state.studio.name} made, not just how much it grossed.`
 ];
 else if(id==='ruth-bell')pool=[
  `The interesting thing about ${f.title} is not the score. It is that ${filmId.strength} and the film's ${filmId.texture} identity survived the machinery of production and release.`,
  `${specific} That gives ${f.title} a stronger afterlife than a review percentage alone can measure.`,
  l.profit<0?`The balance sheet will call this a disappointment. I would ask whether ${state.studio.name} now has the courage to make another film this specific without repeating its ${filmId.risk}.`:`A good review is temporary. A film with a recognisable internal logic is the thing people return to.`
 ];
 else if(id==='imani-kerr')pool=[
  `The career story is not only who got hotter after ${f.title}; it is which performers now look inseparable from the film's ${filmId.texture} identity.`,
  `${f.title} gave its people something more useful than exposure: a specific piece of work agents can point to when explaining what they do differently from everyone else.`,
  `${specific} The talent involved now carry that creative decision into their next negotiations as part of the credit.`
 ];
 else pool=[
  studioIdentity&&studioIdentity.label&&studioIdentity.label!=='Independent Studio'?`${f.title} makes the ${studioIdentity.label.toLowerCase()} label harder to dismiss because the film itself has a distinct ${filmId.texture} identity.`:`One result does not define a studio, but a film this specific becomes evidence. ${specific}`,
  `The Lot remembers films through shorthand. For ${f.title}, that shorthand may be “${filmId.texture}, ${filmId.engine}-driven, strongest on ${filmId.strength}.” That is more useful than simply calling it a hit or a miss.`,
  `${specific} The next film will be judged partly by whether ${state.studio.name} repeats that instinct, rejects it or finds an entirely different one.`
 ];
 let quote=variationPick(f,'wrap-trade-'+id,pool);
 const pm=typeof ensurePressMemory==='function'?ensurePressMemory()[id]:null;
 if(pm?.playerMentions>=3&&Math.abs(hash(f.id+'|press-memory|'+id))%3===0){
  quote=variationPick(f,'wrap-memory-prefix-'+id,[`I've covered ${state.studio.name} often enough to know this will not be read in isolation. `,`This studio now has enough history that every result arrives with context. `,`There is a pattern behind this release, and the trade will remember it. `])+quote;
 }
 quote=filmWrapVoicePolish(id,f,l,quote);
 return {journalist:j||{name:'Mara Vance',publication:'Screen Trade',beat:'Studios & strategy',tone:'Trade analyst'},quote};
}

function filmWrapLegacySignals(f,l=ensureLegacyState(f)){
 const a=ensureAfterlifeState(f),fr=franchiseStatus(f),identity=typeof studioIdentityPrimary==='function'?studioIdentityPrimary():null;
 let awards='Not yet on the board';
 if(typeof awardsEligibilityScore==='function'&&typeof awardBuzzLabel==='function')awards=awardBuzzLabel(awardsEligibilityScore(f,'picture')).label+' for Picture';
 else if((f.review?.critics||0)>=84)awards='Credible awards profile';
 const rights=ensureIPAsset(f);
 const music=f.soundtrack?.committed?{label:'Music',value:f.soundtrack.trackTitle?`${f.soundtrack.trackArtist} — ${f.soundtrack.trackTitle}`:f.soundtrack.label,detail:`${f.soundtrack.label} · creative fit ${Math.round(f.soundtrack.fit||0)}`}:{label:'Music',value:'No committed music plan',detail:'The film reached release without a recorded soundtrack strategy.'};
 return [
  {label:'Franchise',value:fr.label,detail:`Audience familiarity ${Math.round(fr.familiarity)}`},
  {label:'Awards',value:awards,detail:(f.review?.critics||0)>=80?'Critical response keeps the door open.':'The film will need a specific campaign case.'},
  music,
  {label:'Studio identity',value:identity?.label||'Still emerging',detail:identity&&identity.label!=='Independent Studio'?'This film now sits inside that trade narrative.':'The slate is still resisting one simple label.'},
  {label:'Archive',value:money(a.libraryValue)+' opening value',detail:rights.sold?'Future rights sold':rights.rightsLabel}
 ];
}
