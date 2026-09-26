// Project Slate UI: studio

function studioIdentitySummary(){
 const r=state.reputation,entries=[['Creative',r.creative],['Commercial',r.commercial],['Talent',r.talent],['Financial',r.financial]].sort((a,b)=>b[1]-a[1]);
 const completed=playerFilms().filter(f=>f.stage==='complete');
 const genresCount={};completed.forEach(f=>genresCount[f.genre]=(genresCount[f.genre]||0)+1);
 const favourite=Object.entries(genresCount).sort((a,b)=>b[1]-a[1])[0];
 return {lead:entries[0],favourite,completed};
}
function franchisePortfolioHTML(){
 const done=playerFilms().filter(f=>f.stage==='complete'),seen=new Set(),rows=[];
 done.forEach(f=>{const root=franchiseRootId(f);if(seen.has(root))return;seen.add(root);const rootFilm=filmById(root)||f,status=franchiseStatus(rootFilm),ip=ensureIPAsset(rootFilm);rows.push({f:rootFilm,status,ip})});
 rows.sort((a,b)=>b.status.historicalStrength-a.status.historicalStrength);
 if(!rows.length)return '';
 return `<div class="section-title"><h2>IP portfolio</h2><span class="small">Properties can cool, go dormant, fatigue and return</span></div><div class="grid cols2 library-ip-grid">${rows.map(({f,status,ip})=>`<div class="card click ${status.cls==='bad'?'dangerline':status.cls==='good'?'goodline':''}" data-film="${f.id}"><div class="row"><div><strong>${ip.franchiseName}</strong><div class="small">${status.family.length} released film${status.family.length===1?'':'s'} · ${money(status.totalGross)} WW combined</div></div><span class="pill ${status.cls}">${status.label}</span></div><div style="margin-top:8px"><span class="pill">Familiarity ${Math.round(status.familiarity)}</span><span class="pill ${status.fatigue>=50?'bad':status.fatigue>=28?'warn':'good'}">Fatigue ${Math.round(status.fatigue)}</span>${status.cult?'<span class="pill good">Cult value</span>':''}</div><div class="small" style="margin-top:8px">${status.text}</div><div class="small" style="margin-top:6px">${ip.sold?`Future rights owned by ${rivalById(ip.soldTo)?.name||'another studio'}`:`Historical strength ${Math.round(status.historicalStrength)} · ${status.gap} weeks since last release`}</div></div>`).join('')}</div>`;
}
function franchiseHistoryHTML(f){
 const status=franchiseStatus(f),ip=ensureIPAsset(f);
 if(status.family.length<=1)return '';
 return `<div class="section-title"><h2>${ip.franchiseName} history</h2><span class="pill ${status.cls}">${status.label}</span></div><div class="card">${status.family.map((x,i)=>`<div class="listrow click" data-film="${x.id}"><div><strong>${i+1}. ${x.title}</strong><div class="small">${x.franchiseMode?franchiseModeLabel(x.franchiseMode):i===0?'Original film':'Sequel'} · ${x.completeWeek?'W'+x.completeWeek:fmtStage(x.stage)}</div></div><div style="text-align:right"><strong>${x.finalGross?money(x.finalGross):'—'}</strong><div class="small">${x.review?`Audience ${x.review.audience}%`:'Not released'}</div></div></div>`).join('')}</div>`;
}
function franchiseRightsPanel(f){
 const ip=ensureIPAsset(f),opp=franchiseOpportunity(f),status=rightsDevelopmentStatus(f),market=franchiseStatus(f),offer=currentRightsOffer(f),pending=state.pendingRightsSale?.filmId===f.id?state.pendingRightsSale:null,active=franchiseActiveProject(f);
 const sold=ip.sold;
 const options=[];
 if(!sold&&!active&&status.ok){
  options.push(`<button class="btn primary" data-franchise-project="sequel">Develop sequel</button>`);
  if(market.canRevive)options.push(`<button class="btn" data-franchise-project="revival">Legacy revival</button>`);
  if(market.canReboot)options.push(`<button class="btn" data-franchise-project="reboot">Reboot property</button>`);
  if(market.canSpinoff)options.push(`<button class="btn" data-franchise-project="spinoff">Develop spin-off</button>`);
 }
 return `<div class="section-title"><h2>Rights & franchise</h2><span class="pill ${market.cls}">${market.label}</span></div><div class="card ${sold?'dangerline':''}">
 <div class="listrow"><span>Property</span><strong>${ip.franchiseName}</strong></div>
 <div class="listrow"><span>Rights position</span><strong>${sold?`Sold to ${rivalById(ip.soldTo)?.name||'another studio'}`:ip.rightsLabel}</strong></div>
 <div class="listrow"><span>Released films</span><strong>${market.family.length}</strong></div>
 <div class="listrow"><span>Combined worldwide gross</span><strong>${money(market.totalGross)}</strong></div>
 <div class="listrow"><span>Audience familiarity</span><strong>${Math.round(market.familiarity)}</strong></div>
 <div class="listrow"><span>Franchise fatigue</span><strong>${Math.round(market.fatigue)}</strong></div>
 <div class="listrow"><span>Current rights market</span><strong>${sold?money(ip.saleValue||0):active?`${active.title} in development`:offer?`${offer.rv.name} · ${money(offer.offer)}`:'No active buyer'}</strong></div>
 <div class="body" style="margin-top:8px">${market.text} ${opp.text}</div>
 ${pending?`<div class="card attention" style="margin-top:12px"><strong>Confirm franchise rights sale?</strong><div class="body" style="margin-top:6px">${rivalById(pending.buyerId)?.name||'Buyer'} will pay ${money(pending.amount)} for <strong>all future screen rights</strong> to ${ip.franchiseName}. You retain every film already produced and their catalogue income. The buyer receives the right to make all future sequels, revivals, reboots and spin-offs — including follow-ups to sequels you have already made.</div><div class="grid cols2" style="margin-top:10px"><button class="btn" id="cancelRightsSale">Keep franchise rights</button><button class="btn primary" id="confirmRightsSale">Sell future rights · ${money(pending.amount)}</button></div></div>`:''}
 ${options.length?`<div class="grid cols2" style="margin-top:12px">${options.join('')}</div>`:''}
 ${!sold&&!pending?`<button class="btn block" style="margin-top:10px" id="sellFutureRights" ${active||!offer?'disabled':''}>${active?'Rights tied up by active development':offer?`Review ${offer.rv.name} offer · ${money(offer.offer)}`:'No rights offer'}</button>`:''}
 ${!status.ok&&!sold?`<div class="small" style="margin-top:8px">${status.reason}</div>`:''}
 </div>${franchiseHistoryHTML(f)}`;
}
function studioLibraryBody(){
 const done=playerFilms().filter(f=>f.stage==='complete').sort((a,b)=>(b.completeWeek||0)-(a.completeWeek||0));
 if(!done.length)return `<div class="card body">Your library is empty. Completed films will live here permanently with their theatrical history, IP position and catalogue value.</div>`;
 const gross=done.reduce((a,f)=>a+(f.finalGross||0),0),profit=done.reduce((a,f)=>a+((f.studioRevenue||0)-(f.investment||0)),0),afterlife=done.reduce((a,f)=>a+(ensureAfterlifeState(f).totalRevenue||0),0),value=done.reduce((a,f)=>a+(ensureAfterlifeState(f).libraryValue||0),0);
 return `${franchisePortfolioHTML()}<div class="grid cols4 library-summary-grid"><div class="card"><div class="badge">Library titles</div><div class="kpi">${done.length}</div></div><div class="card"><div class="badge">Worldwide gross</div><div class="kpi">${money(gross)}</div></div><div class="card"><div class="badge">Recorded film P/L</div><div class="kpi">${profit>=0?'+':''}${money(profit)}</div></div><div class="card"><div class="badge">Current library value</div><div class="kpi">${money(value)}</div></div></div>
 <div class="card" style="margin-top:12px"><div class="row"><div><strong>Catalogue cash generated</strong><div class="small">Cumulative post-theatrical receipts across the library</div></div><strong>${money(afterlife)}</strong></div></div>
 <div class="section-title"><h2>Film library</h2><span class="small">Every title keeps its theatrical and IP history</span></div>
 <div class="grid library-film-grid">${done.map(f=>{const opp=franchiseOpportunity(f),ip=ensureIPAsset(f),l=ensureLegacyState(f);if(!l.built)buildFilmLegacy(f,{});const pl=(f.studioRevenue||0)-(f.investment||0);return `<div class="card click ${pl>3?'goodline':pl<-3?'dangerline':''}" data-film="${f.id}"><div class="row"><div><strong>${f.title}</strong><div class="small">${f.genre} · completed W${f.completeWeek||'?'}</div></div><strong>${money(f.finalGross||0)} WW</strong></div><div style="margin-top:7px"><span class="pill ${l.outcomeClass==='bad'?'bad':l.outcomeClass==='warn'?'warn':l.outcomeClass==='good'?'good':'blue'}">${l.outcome}</span><span class="pill">Peak ${l.peakRank?'#'+l.peakRank:'—'}</span>${l.weeksAtOne?`<span class="pill good">${l.weeksAtOne} week${l.weeksAtOne===1?'':'s'} #1</span>`:''}</div><div class="small" style="margin-top:7px">Studio result ${pl>=0?'+':''}${money(pl)} · Critics ${f.review?.critics??'—'}% · Audience ${f.review?.audience??'—'}%</div><div style="margin-top:7px"><span class="pill ${opp.cls}">${opp.label}</span><span class="pill">${ip.sold?'Future rights sold':ip.rightsLabel}</span>${ensureAfterlifeState(f).cultStatus?'<span class="pill good">Cult following</span>':''}${typeof streamingDealStatus==='function'&&streamingDealStatus(f)?`<span class="pill blue">Streaming · ${streamingDealStatus(f).deal.platform}</span>`:''}${ensureAfterlifeState(f).wins.length?`<span class="pill good">${ensureAfterlifeState(f).wins.length} award win${ensureAfterlifeState(f).wins.length===1?'':'s'}</span>`:''}</div><div class="small" style="margin-top:7px">Catalogue receipts ${money(ensureAfterlifeState(f).totalRevenue)} · current value ${money(ensureAfterlifeState(f).libraryValue)}</div></div>`}).join('')}</div>`;
}
function studioIdentityBody(){
 const snap=studioIdentitySnapshot(),r=state.reputation,g=ensureStudioGrowth(),mem=ensureStudioIdentity();
 const established=snap.established,top=snap.topGenre;
 return `<div class="identityhero"><div><div class="badge">CURRENT INDUSTRY IDENTITY</div><div class="identityname">${snap.primary.label}</div><div class="body">${snap.primary.desc}</div></div><div class="identityscore"><strong>${Math.round(snap.primary.score)}</strong><span>signal strength</span></div></div>
 ${executivePersonaIdentitySection()}
 <div class="section-title"><h2>Studio branding</h2><span class="small">Presentation only · change whenever you like</span></div>${brandPickerHTML(ensurePlayerBrand())}
 <div class="section-title"><h2>What the business thinks you are</h2><span class="small">Earned from released films — never chosen at setup</span></div>
 ${established.length?`<div class="grid cols3">${established.map(t=>`<div class="card goodline"><div class="row"><strong>${t.label}</strong><span class="pill good">${Math.round(t.score)}</span></div><div class="body" style="margin-top:8px">${t.desc}</div><div class="small" style="margin-top:9px"><strong>Industry effect:</strong> ${t.effect}</div></div>`).join('')}</div>`:`<div class="card body">The studio is still too young for a durable label. After roughly three releases, repeated choices and results begin to create a reputation the market reacts to.</div>`}
 <div class="section-title"><h2>Reputation foundations</h2></div><div class="grid cols4">${[['Creative',r.creative],['Commercial',r.commercial],['Talent',r.talent],['Financial',r.financial]].map(([n,v])=>`<div class="card"><div class="badge">${n}</div><div class="kpi">${Math.round(v)}</div><div class="small">${reputationLabel(v)}</div></div>`).join('')}</div>
 <div class="section-title"><h2>Trade consequences</h2><span class="small">Small advantages that compound rather than flat bonuses</span></div><div class="grid cols3"><div class="card"><strong>Material access</strong><div class="body" style="margin-top:7px">${top&&top.count>=3?`${top.genre} is your strongest lane. Matching material can occasionally arrive as a four-week <strong>First Look</strong> before rivals can bid.`:'Build a repeatable genre or prestige identity and writers may start bringing material to you before the open market.'}</div></div><div class="card"><strong>Talent leverage</strong><div class="body" style="margin-top:7px">${identityHas('filmmaker')||identityHas('talent')?'Your reputation is now strong enough to create modest negotiating goodwill with the right filmmakers or emerging performers.':'Contract leverage still comes mostly from relationships, role fit and the individual project.'}</div></div><div class="card"><strong>Audience expectations</strong><div class="body" style="margin-top:7px">${studioIdentityAwarenessLift({genre:top?.genre||'',budget:snap.avgBudget||0,ipParentId:null,creative:{positioning:'balanced'}})>0?'The studio name itself can now contribute some opening awareness when a film fits the identity audiences recognise.':'The studio name is not yet a meaningful part of why audiences show up.'}</div></div></div>
 <div class="section-title"><h2>Filmography shape</h2><span class="small">${snap.done.length} completed film${snap.done.length===1?'':'s'}</span></div>${snap.genres.length?`<div class="card">${snap.genres.map(x=>`<div class="listrow"><div><strong>${x.genre}</strong><div class="small">Critics ${Math.round(x.avgCritics)}% · Audience ${Math.round(x.avgAudience)}%</div></div><div style="text-align:right"><strong>${x.count}</strong><div class="small">${Math.round(x.share*100)}% of slate</div></div></div>`).join('')}</div>`:`<div class="card body">No released filmography yet.</div>`}
 <div class="section-title"><h2>Identity history</h2></div><div class="card">${mem.history.length?mem.history.slice(0,8).map(x=>`<div class="listrow"><span>Week ${x.week}</span><strong>${x.label}</strong></div>`).join(''):`<div class="body">Your first durable industry identity has not formed yet.</div>`}</div>`;
}
function productionDailiesSnapshot(){
 const films=playerFilms().filter(f=>f.stage==='production').sort((a,b)=>(b.productionWeek||0)-(a.productionWeek||0));
 if(!films.length)return '';
 const rows=films.slice(0,3).map(f=>{const journal=ensureShootJournal(f),latest=journal[journal.length-1],pulse=productionPulseLabel(f);return `<button class="card production-wire-card" data-film="${f.id}"><div class="production-wire-top"><div><span class="badge">FROM PRODUCTION</span><strong>${f.title}</strong></div><span class="pill ${pulse.schedule==='On schedule'?'good':pulse.schedule==='Slightly behind'?'warn':'bad'}">${pulse.schedule}</span></div><p>${latest?.text||productionStatusText(f)}</p><div class="production-wire-foot"><span>Production week ${f.productionWeek||1}</span><b>Open dailies →</b></div></button>`}).join('');
 return `<div class="section-title"><h2>From production</h2><span class="small">Latest passive dailies · no response required</span></div><div class="production-wire-grid">${rows}</div>`;
}
function journalistProfileCard(n){
 const j=journalistProfileById(n?.journalistId);if(!j)return '';const mem=ensurePressMemory()[j.id]||{};
 return `<div class="journalist-card"><div><div class="badge">RECURRING VOICE</div><strong>${j.name}</strong><span>${j.tone} · ${j.beat}</span></div><div class="small">${j.bio}${mem.playerMentions?` ${mem.playerMentions} previous ${state.studio?.name||'studio'} mention${mem.playerMentions===1?'':'s'} recorded in this career.`:''}</div></div>`;
}
function careerThreadsSnapshot(){
 const box=typeof ensureCareerThreads==='function'?ensureCareerThreads():{active:[],history:[]},rows=typeof activeCareerThreads==='function'?activeCareerThreads(4):[],recent=(box.history||[]).slice(0,2);
 const activeHtml=rows.length?`<div class="thread-grid">${rows.map(t=>{const rv=t.rivalId?rivalById(t.rivalId):null,person=rv?.head?.name||null;return `<div class="thread-card ${t.tone||'neutral'}"><div class="thread-rail"></div><div><div class="thread-meta"><span>${t.type==='rivalry'?'RIVALRY':t.type==='relationship'?'RELATIONSHIP':t.type==='finance'?'PRESSURE':t.type==='memory'?'CALLBACK':'NARRATIVE'}</span><small>since W${t.startedWeek}</small></div><strong>${t.title}</strong><div class="body">${t.summary}</div><div class="small thread-detail">${t.detail}</div><div class="thread-foot"><span>${t.progress||'Developing'}</span>${person?`<span>${person} · ${rivalDisposition(rv)}</span>`:''}</div></div></div>`}).join('')}</div>`:`<div class="card thread-empty"><strong>No story has taken hold yet.</strong><div class="small">Rivalries, recurring collaborators, major successes/failures, financial pressure and trade narratives will remain here while they are still alive.</div></div>`;
 return `<div class="section-title"><h2>Active threads</h2><span class="small">${rows.length?`${rows.length} ongoing ${rows.length===1?'story':'stories'}`:'Stories that persist across weeks'}</span></div>${activeHtml}${recent.length?`<div class="thread-resolved"><div class="thread-resolved-head">Recently resolved</div><div class="thread-resolved-list">${recent.map(t=>`<div class="thread-resolved-row"><strong>${t.title}</strong><span>${t.resolution}</span></div>`).join('')}</div></div>`:''}`;
}
function newsArticleScreen(id){
 const n=state.news.find(x=>x.id===id);if(!n)return industryScreen();
 return topbar(n.publication||newsKindLabel(n.kind),`${newsKindLabel(n.kind)} · Week ${n.week}`)+`<main class="screen articlepage"><button class="back articleback" id="backBtn">← Back to news</button>
 <article class="newsarticle"><div class="newsmast"><div class="news-mast-brand">${pressLogoHTML(n.publication||'Screen Trade','lg',true)}</div><div class="newstimestamp">${n.day&&typeof calendarDateLabel==='function'?calendarDateLabel(n.day):'Week '+n.week}</div></div>
 <div class="newssection">${newsKindLabel(n.kind)}</div><h1 class="newsheadline">${n.headline}</h1>${n.deck?`<div class="newsdeck">${n.deck}</div>`:''}<div class="newsbyline">By ${n.byline||'Trade desk'}</div>${n.voiceLabel?`<div class="small" style="margin:-3px 0 11px">${n.voiceLabel}</div>`:''}${journalistProfileCard(n)}
 <div class="articlebody">${(n.body||[n.text]).map(p=>`<p>${p}</p>`).join('')}</div></article>
 </main>${nav()}`;
}
function homeNewsDesk(){
 const stories=state.news.filter(n=>n.kind!=='System').slice(0,6),lead=stories[0],rest=stories.slice(1,5);if(!lead)return '';
 return `<div class="section-title"><h2>Newsroom</h2><button class="btn ghost" data-nav="industry">All stories</button></div>
 <div class="card click newslead" data-news-id="${lead.id}"><div class="row">${pressLogoHTML(lead.publication||'Screen Trade','sm',true)}<span class="small">${lead.day?calendarShortDate(lead.day):'W'+lead.week}</span></div><div class="newsleadhead">${lead.headline}</div>${lead.deck?`<div class="newsleaddeck">${lead.deck}</div>`:''}</div>
 <div class="card newslist">${rest.map(n=>`<div class="listrow click" data-news-id="${n.id}"><div style="min-width:0">${pressLogoHTML(n.publication||'Screen Trade','xs',true)}<strong style="display:block;margin-top:6px">${n.headline}</strong><div class="small">${newsKindLabel(n.kind)}</div></div><span class="small">${n.day?calendarShortDate(n.day):'W'+n.week}</span></div>`).join('')}</div>`;
}
function lateGameOpportunityProgress(kind){
 if(typeof corporateFundamentals!=='function')return null;const f=corporateFundamentals(),year=Math.floor(state.week/52),financial=state.reputation?.financial||0;
 if(kind==='ipo'){const checks=[['Operating history',year,3],['Recognition',f.recognition,72],['Released films',f.released,6],['Studio valuation',f.value,150],['Financial reputation',financial,55]],debtOk=f.debt<15;return {label:'Public markets',subtitle:'Optional IPO',checks,debtOk,debtLabel:'Bridge debt below $15m',ready:typeof ipoEligibility==='function'&&ipoEligibility().ok}}
 const checks=[['Operating history',year,4],['Recognition',f.recognition,80],['Released films',f.released,10],['Catalogue value',f.library,25],['Studio valuation',f.value,250],['Cash reserve',state.cash,62]],debtOk=f.debt<10;return {label:'Owned streaming',subtitle:'Direct-to-consumer platform',checks,debtOk,debtLabel:'Bridge debt below $10m',ready:typeof ownedStreamingLaunchEligibility==='function'&&ownedStreamingLaunchEligibility().ok};
}
function lateGameOpportunityCard(kind){const x=lateGameOpportunityProgress(kind);if(!x)return '';const complete=x.checks.filter(c=>c[1]>=c[2]).length+(x.debtOk?1:0),total=x.checks.length+1,pct=Math.round(complete/total*100);return `<div class="card ${x.ready?'goodline':''}"><div class="row"><div><strong>${x.label}</strong><div class="small">${x.subtitle}</div></div><span class="pill ${x.ready?'good':'blue'}">${x.ready?'READY':pct+'%'}</span></div><div class="milestone-progress" style="margin-top:10px"><span style="width:${pct}%"></span></div><div style="margin-top:9px">${x.checks.map(c=>`<div class="small">${c[1]>=c[2]?'✓':'○'} ${c[0]} · ${c[0].includes('valuation')||c[0].includes('value')||c[0].includes('reserve')?money(c[1]):Math.round(c[1])} / ${c[0].includes('valuation')||c[0].includes('value')||c[0].includes('reserve')?money(c[2]):c[2]}</div>`).join('')}<div class="small">${x.debtOk?'✓':'○'} ${x.debtLabel}</div></div><div class="small" style="margin-top:8px">${x.ready?'The opportunity can now surface through Corporate Strategy.':'This is a future career possibility, not an objective. Remaining private or never launching a platform carries no penalty.'}</div></div>`}
function studioGrowthUI(){
 const g=ensureStudioGrowth(),standing=playerStudioStanding(),rows=[['production','Production Office'],['casting','Casting Network'],['development','Development & Rights'],['post','Post & Music'],['publicity','Publicity & Awards']];
 return `<div class="hero"><div class="badge">Studio standing</div><div class="grid cols3" style="margin-top:10px"><div><div class="kpi">#${standing.rank}</div><div class="small">industry rank</div></div><div><div class="kpi">${Math.round(g.recognition)}</div><div class="small">recognition</div></div><div><div class="kpi" style="font-size:18px">${studioFansLabel(g.fans)}</div><div class="small">audience following</div></div></div></div>
 <div class="section-title"><h2>Departments</h2><span class="small">Build the studio itself — every expansion creates capability and permanent overhead</span></div><div class="grid">${rows.map(([key,label])=>{const level=studioUpgradeLevel(key),next=nextStudioUpgrade(key);return `<div class="card ${!next?'goodline':''}"><div class="row"><div><strong>${label}</strong><div class="small">Level ${level}/2</div></div><span class="pill">${studioUpgradeBenefitLabel(key)}</span></div>${next?`<div class="body" style="margin-top:8px">${next.desc}</div><div class="small" style="margin-top:7px">${money(next.cost)} investment · +${moneyFine(next.overhead)}/week · recognition ${next.recognition} required</div><button class="btn block" style="margin-top:10px" data-studio-upgrade="${key}" ${g.recognition<next.recognition?'disabled':''}>Upgrade to ${next.name}</button>`:`<div class="body" style="margin-top:8px">This department is fully developed.</div>`}</div>`}).join('')}</div>
 <div class="section-title"><h2>Future scale</h2><span class="small">Late-career possibilities are visible before they unlock</span></div><div class="grid cols2">${lateGameOpportunityCard('ipo')}${lateGameOpportunityCard('streaming')}</div>
 <div class="section-title"><h2>Operating footprint</h2><span class="small">Success increases the permanent organisation behind the slate</span></div>${(()=>{const b=studioOverheadBreakdown(),idle=currentIdleCarry();return `<div class="card"><div class="listrow"><span>Operating scale</span><strong>${b.scale.label}</strong></div><div class="small" style="margin:-3px 0 8px">${b.scale.desc}</div><div class="listrow"><span>Corporate operation</span><strong>${moneyFine(b.corporate)}/week</strong></div><div class="listrow"><span>Department overhead</span><strong>${moneyFine(b.departments)}/week</strong></div><div class="listrow"><span>Active slate overhead</span><strong>${moneyFine(b.slate)}/week</strong></div><div class="listrow"><span>Current total overhead</span><strong>${moneyFine(b.total)}/week</strong></div><div class="hr"></div><div class="listrow"><span>Current catalogue receipts</span><strong>${moneyFine(idle.catalogue)}/week</strong></div><div class="listrow"><span>Idle operating position</span><strong class="${idle.net>=0?'goodtext':'badtext'}">${idle.net>=0?'+':''}${moneyFine(idle.net)}/week</strong></div><div class="small" style="margin-top:7px">Idle position compares catalogue receipts with permanent corporate + department costs. Catalogue receipts decay as titles age.</div></div>`})()}`;
}
function milestoneCardHTML(m,compact=false){
 const st=ensureStudioMilestones(),done=st.completed[m.id],p=milestoneProgress(m),mystery=m.hidden&&!done;
 if(mystery)return `<div class="milestone-card locked hidden-milestone ${compact?'compact':''}"><div class="milestone-icon">?</div><div class="milestone-copy"><div class="row"><strong>Hidden milestone</strong><span class="pill">?</span></div><div class="small">A story-driven achievement that reveals itself when you earn it.</div></div></div>`;
 return `<div class="milestone-card ${done?'unlocked':'locked'} ${m.hidden?'hidden-unlocked':''} ${compact?'compact':''}">
  <div class="milestone-icon">${done?'◆':'◇'}</div><div class="milestone-copy"><div class="row"><strong>${m.title}</strong><span class="pill ${done?'good':'blue'}">${done?`+${m.points} Legacy`:p.text}</span></div><div class="small">${m.desc}</div>${!done?`<div class="milestone-progress"><span style="width:${p.pct}%"></span></div>`:`<div class="small milestone-date">${done.day?calendarShortDate(done.day):'Week '+done.week} · ${m.hidden?'Hidden story':m.category}</div>`}</div>
 </div>`;
}
function studioMilestonesBody(){
 const st=ensureStudioMilestones(),points=studioLegacyPoints(),completed=Object.keys(st.completed).filter(id=>milestoneById(id)).length,next=nextStudioMilestones(4),visible=STUDIO_MILESTONES.filter(x=>!x.hidden),hidden=STUDIO_MILESTONES.filter(x=>x.hidden),hiddenUnlocked=hidden.filter(x=>st.completed[x.id]),hiddenRemaining=hidden.length-hiddenUnlocked.length,cats=[...new Set(visible.map(x=>x.category))];
 return `<div class="legacy-hero"><div><div class="badge">STUDIO LEGACY</div><div class="legacy-score">${points}</div><div class="legacy-label">${studioLegacyLabel(points)}</div><div class="body">Milestones are markers of the career you are building — not victory conditions. The studio remains playable indefinitely, and hidden milestones reward unusual stories rather than optimal play.</div></div><div class="legacy-count"><strong>${completed}/${STUDIO_MILESTONES.length}</strong><span>milestones reached</span><div class="small" style="margin-top:5px">${visible.length} visible · ${hidden.length} hidden</div></div></div>
 <div class="section-title"><h2>Closest targets</h2><span class="small">Medium-term goals between annual Awards Nights</span></div><div class="grid cols2">${next.map(x=>milestoneCardHTML(x.m,true)).join('')||'<div class="card body">Every visible milestone has been reached. Hidden stories and the career itself continue.</div>'}</div>
 ${cats.map(cat=>`<div class="section-title"><h2>${cat}</h2><span class="small">${visible.filter(x=>x.category===cat&&st.completed[x.id]).length}/${visible.filter(x=>x.category===cat).length}</span></div><div class="grid cols2">${visible.filter(x=>x.category===cat).map(x=>milestoneCardHTML(x)).join('')}</div>`).join('')}
 <div class="section-title"><h2>Hidden stories</h2><span class="small">${hiddenUnlocked.length} discovered · ${hiddenRemaining} still hidden</span></div><div class="grid cols2">${hiddenUnlocked.map(x=>milestoneCardHTML(x)).join('')}${hiddenRemaining?`<div class="milestone-card locked hidden-milestone"><div class="milestone-icon">?</div><div class="milestone-copy"><strong>${hiddenRemaining} hidden milestone${hiddenRemaining===1?'':'s'} remain</strong><div class="small" style="margin-top:5px">They are intentionally not shown as checklists. They emerge from strange hits, comebacks, polarising films, awards nights and long-tail stories.</div></div></div>`:''}</div>`;
}
function milestonesScreen(){
 return topbar('Studio Milestones',studioLegacyLabel())+`<main class="screen">${backHead('Studio Milestones',`${studioLegacyPoints()} Legacy · no finish line`)}${studioMilestonesBody()}</main>${nav()}`;
}
function studioMilestoneSnapshot(){
 const st=ensureStudioMilestones(),latest=st.history?.[0],next=nextStudioMilestones(2),completed=Object.keys(st.completed).filter(id=>milestoneById(id)).length;
 return `<div class="section-title"><h2>Studio legacy</h2><div style="display:flex;gap:8px"><button class="btn ghost" data-open-legacy="overview">Legacy</button><button class="btn ghost" data-open-legacy="milestones">Milestones</button></div></div>
 <div class="milestone-snapshot"><div><div class="badge">${studioLegacyLabel().toUpperCase()}</div><strong>${studioLegacyPoints()} Legacy</strong><span>${completed}/${STUDIO_MILESTONES.length} milestones</span></div><div>${latest?`<small>Latest unlock</small><strong>${milestoneById(latest.id)?.title||latest.title}</strong>`:next[0]?`<small>Closest target</small><strong>${next[0].m.title}</strong>`:''}</div></div>`;
}

function filmStudioLegacyScore(f){
 const a=ensureAfterlifeState(f),l=ensureLegacyState(f);if(!l.built)buildFilmLegacy(f,{});
 const profit=Math.max(-20,Math.min(80,studioFilmProfit(f))),gross=Math.min(600,f.finalGross||0),crit=f.review?.critics||0,aud=f.review?.audience||0;
 return gross*.08+profit*.8+crit*.45+aud*.30+(a.wins?.length||0)*10+(a.nominations?.length||0)*2+(l.weeksAtOne||0)*4+(a.cultStatus?12:0);
}
function studioHallOfSlate(limit=4){return completedPlayerFilms().map(f=>({f,score:filmStudioLegacyScore(f)})).sort((a,b)=>b.score-a.score).slice(0,limit)}
function studioLegacyTimeline(limit=14){
 const items=[];
 const st=ensureStudioMilestones();
 (st.history||[]).forEach(x=>{const m=milestoneById(x.id);if(m)items.push({week:x.week||1,day:x.day||null,title:m.title,detail:m.desc,kind:m.hidden?'Hidden milestone':'Milestone'})});
 (state.awardsArchive||[]).forEach(c=>{if(c.playerWins||c.playerNoms)items.push({week:c.season*52,day:null,title:`Year ${c.season} Awards Night`,detail:`${c.playerWins||0} wins from ${c.playerNoms||0} nominations.`,kind:'Awards'})});
 (state.studioIdentity?.history||[]).forEach(x=>items.push({week:x.week||1,day:null,title:x.label,detail:'The Lot began using this identity to describe the studio.',kind:'Identity'}));
 return items.sort((a,b)=>(b.day||b.week*7)-(a.day||a.week*7)).slice(0,limit);
}
function studioLegacyOverviewBody(){
 const done=completedPlayerFilms(),aw=playerAwardTotals(),hall=studioHallOfSlate(),timeline=studioLegacyTimeline(),gross=lifetimePlayerGross(),profits=done.reduce((s,f)=>s+studioFilmProfit(f),0),years=careerYears(),snap=studioIdentitySnapshot();
 const biggest=[...done].sort((a,b)=>(b.finalGross||0)-(a.finalGross||0))[0],bestCrit=[...done].filter(f=>f.review).sort((a,b)=>(b.review?.critics||0)-(a.review?.critics||0))[0],bestAud=[...done].filter(f=>f.review).sort((a,b)=>(b.review?.audience||0)-(a.review?.audience||0))[0];
 return `<div class="legacy-hero legacy-v36"><div><div class="badge">CAREER LEGACY</div><div class="legacy-score">${studioLegacyPoints()}</div><div class="legacy-label">${studioLegacyLabel()}</div><div class="body">${years?`${state.studio.name} is ${years} full year${years===1?'':'s'} into its history.`:'The story is only beginning.'} Legacy records what the studio became; it is not a finish line.</div></div><div class="legacy-count"><strong>${done.length}</strong><span>released films</span><strong style="margin-top:10px">${aw.wins}</strong><span>award wins</span></div></div>
 <div class="grid cols4" style="margin-top:14px"><div class="card"><div class="badge">Lifetime box office</div><div class="kpi">${money(gross)}</div></div><div class="card"><div class="badge">Recorded studio P/L</div><div class="kpi ${profits>=0?'goodtext':'badtext'}">${profits>=0?'+':''}${money(profits)}</div></div><div class="card"><div class="badge">#1 films</div><div class="kpi">${numberOnePlayerFilms()}</div></div><div class="card"><div class="badge">Awards</div><div class="kpi">${aw.wins}/${aw.noms}</div><div class="small">wins / nominations</div></div></div>
 <div class="section-title"><h2>Hall of Slate</h2><span class="small">The films that currently define the studio’s history</span></div><div class="grid cols2">${hall.length?hall.map(({f},i)=>{const a=ensureAfterlifeState(f),l=ensureLegacyState(f);return `<div class="card click ${i===0?'goodline':''}" data-film="${f.id}"><div class="row"><div><span class="badge">#${i+1} LEGACY FILM</span><strong style="display:block;margin-top:4px">${f.title}</strong><div class="small">${f.genre} · ${l.outcome}</div></div><strong>${money(f.finalGross||0)}</strong></div><div style="margin-top:7px"><span class="pill">${f.review?.critics||'—'}% critics</span><span class="pill">${f.review?.audience||'—'}% audience</span>${a.wins.length?`<span class="pill good">${a.wins.length} awards</span>`:''}${a.cultStatus?'<span class="pill blue">Cult following</span>':''}</div></div>`}).join(''):`<div class="card body">Release films to begin building the studio’s Hall of Slate.</div>`}</div>
 <div class="section-title"><h2>Studio records</h2></div><div class="card">${biggest?`<div class="listrow"><span>Biggest worldwide film</span><strong>${biggest.title} · ${money(biggest.finalGross||0)}</strong></div>`:''}${bestCrit?`<div class="listrow"><span>Best reviewed</span><strong>${bestCrit.title} · ${bestCrit.review.critics}%</strong></div>`:''}${bestAud?`<div class="listrow"><span>Audience favourite</span><strong>${bestAud.title} · ${bestAud.review.audience}%</strong></div>`:''}<div class="listrow"><span>Current Lot identity</span><strong>${snap.primary.label}</strong></div><div class="listrow"><span>Legacy standing</span><strong>${studioLegacyLabel()}</strong></div></div>
 <div class="section-title"><h2>Career timeline</h2><span class="small">The moments that survive after individual weeks are forgotten</span></div><div class="legacy-timeline">${timeline.length?timeline.map(x=>`<div class="legacy-event"><div class="legacy-event-mark"></div><div><div class="row"><strong>${x.title}</strong><span class="small">${x.day?calendarShortDate(x.day):'W'+x.week}</span></div><div class="small">${x.kind} · ${x.detail}</div></div></div>`).join(''):`<div class="card body">Major studio landmarks will collect here over time.</div>`}</div>`;
}


// v3.5.1 — The Living Industry: richer Studio Desk, social Pulse, consequences and inbox ergonomics.
function ensureDesk(){
 state.desk=state.desk||{items:[],archive:[],nextId:1,lastGeneratedWeek:0,seenIntro:false};
 normalizeDeskIds(state);
 // Informational Desk traffic is already complete when it arrives. Treat it as
 // resolved-but-unread so it can be archived after reading instead of becoming permanent clutter.
 state.desk.items.forEach(i=>{if(!i.requiresAction&&!i.system&&!(i.choices||[]).length&&i.resolved===false)i.resolved=true});
 state.pulse=state.pulse||{history:[],lastWeek:0};state.pulse.history=state.pulse.history||[];
 if(typeof syncOperationalDeskItems==='function')syncOperationalDeskItems();
 return state.desk;
}
function deskFilm(){return activePlayerFilms().slice().sort((a,b)=>(b.marketing||0)-(a.marketing||0))[0]||playerFilms().slice().sort((a,b)=>(b.releaseWeek||b.completeWeek||0)-(a.releaseWeek||a.completeWeek||0))[0]||null}
function deskRival(){return state.rivals?.slice().sort((a,b)=>(b.recognition||0)-(a.recognition||0))[Math.abs((state.week*7+(state.seed||1)))%Math.max(1,state.rivals.length)]||null}
function deskActionCount(){return ensureDesk().items.filter(x=>!x.resolved&&x.requiresAction).length}
function deskInboxCount(){
 const d=ensureDesk();
 return d.items.filter(x=>(!x.resolved&&x.requiresAction)||(!x.read&&deskSignalScore(x)>=62)).length;
}
function deskIsHardLifecycle(item){
 return !!(item?.system&&/^(prod:|post:|marketing:)/.test(item.notificationKey||''));
}
function deskSignalScore(item){
 if(!item)return 0;
 let score=18;
 if(deskIsHardLifecycle(item)&&!item.resolved)return 100;
 if(item.urgency==='urgent'&&!item.resolved)score=96;
 if(item.requiresAction&&!item.resolved)score=Math.max(score,82);
 const typeBase={finance:72,crisis:76,production:65,pulse:60,talent:58,press:56,system:54,industry:42,gossip:28};
 score=Math.max(score,typeBase[item.type]??45);
 if(item.source==='Studio Legacy')score+=12;
 if(item.impact?.length)score+=Math.min(8,item.impact.length*2);
 if(item.outcome)score+=3;
 if(!item.read)score+=4;
 if(state.week-(item.week||state.week)<=1)score+=2;
 return clamp(Math.round(score),0,100);
}
function deskSignalBand(item){
 if(!item.resolved&&item.requiresAction)return item.urgency==='urgent'||deskIsHardLifecycle(item)?'urgent':'action';
 const score=deskSignalScore(item);
 return score>=76?'major':score>=62?'signal':'brief';
}
function studioUpcomingEvents(limit=4,horizonDays=35){
 ensureCalendarState();
 const now=state.calendarDay,end=now+horizonDays,out=[],seen=new Set();
 const add=(day,label,kind='event',filmId=null)=>{
  if(!Number.isFinite(day)||day<=now||day>end)return;
  const key=`${day}|${label}`;if(seen.has(key))return;seen.add(key);out.push({day,label,kind,filmId});
 };
 // Only show events the studio can actually know in advance.
 // Current blockers are surfaced separately; unscripted discoveries stay hidden until they happen.
 playerFilms().filter(f=>f.stage==='scheduled').forEach(f=>{
  ensureFilmCalendar(f);
  (f.marketingState?.milestones||[]).filter(x=>!x.resolved&&x.day>now).forEach(x=>add(x.day,campaignCheckpointLabel({...x,title:f.title}),'campaign',f.id));
  if(f.releaseDay)add(f.releaseDay,`Release Day · ${f.title}`,'release',f.id);
 });
 playerFilms().filter(f=>f.stage==='production').forEach(f=>{
  if(f.productionEnd)add(weekStartDay(f.productionEnd),`Expected Production Wrap · ${f.title}`,'production',f.id);
 });
 const cinema=playerFilms().filter(f=>f.stage==='cinema').sort((a,b)=>(b.marketing||0)-(a.marketing||0))[0];
 if(cinema){
  let sunday=sundayForWeek(calendarWeekForDay(now));if(sunday<=now)sunday+=7;
  add(sunday,`Weekend Box Office · ${cinema.title}`,'boxOffice',cinema.id);
 }
 return out.sort((a,b)=>a.day-b.day||a.label.localeCompare(b.label)).slice(0,limit);
}
function deskUpcomingHTML(events){
 if(!events.length)return `<div class="card desk-upcoming-empty"><strong>No scheduled checkpoint</strong><div class="small">Nothing the studio can currently know is due in the next five weeks. Unscripted production and industry events stay hidden until they happen.</div></div>`;
 return `<div class="desk-upcoming-list">${events.map((e,i)=>{const days=Math.max(0,e.day-state.calendarDay),when=days===1?'Tomorrow':`In ${days} days`;return `<div class="desk-upcoming-row"><span class="desk-upcoming-index">${i+1}</span><div><strong>${e.label}</strong><div class="small">${when} · ${calendarShortDate(e.day)}</div></div><span class="desk-upcoming-kind">${e.kind==='boxOffice'?'Box office':e.kind==='campaign'?'Campaign':e.kind==='production'?'Production':e.kind==='release'?'Release':'Scheduled'}</span></div>`}).join('')}</div>`;
}
function deskThreadHTML(t){
 const tone=['good','bad','warn','blue'].includes(t.tone)?t.tone:'blue';
 return `<div class="card desk-thread desk-thread-${tone}"><div class="desk-thread-top"><span class="desk-thread-kicker">ACTIVE STORYLINE</span><span class="pill ${tone==='bad'?'bad':tone==='warn'?'warn':tone==='good'?'good':'blue'}">${t.progress||'Developing'}</span></div><strong>${t.title}</strong><div class="small" style="margin-top:6px">${t.summary}</div><div class="desk-thread-detail">${t.detail||''}</div></div>`;
}
function deskDigestHTML(items){
 if(!items.length)return `<div class="card body">No background briefings are waiting.</div>`;
 const groups=new Map();
 items.slice(0,30).forEach(x=>{const key=x.week||state.week;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(x)});
 return `<div class="desk-digest">${[...groups.entries()].slice(0,8).map(([week,rows])=>`<section class="desk-digest-week"><div class="desk-digest-head"><strong>Week ${week}</strong><span>${rows.length} brief${rows.length===1?'':'s'}</span></div>${rows.map(x=>`<div class="desk-digest-row ${x.read?'is-read':'is-unread'}"><button class="desk-digest-toggle" data-desk-toggle="${x.id}"><span class="desk-digest-dot"></span><span class="desk-digest-copy"><b>${x.headline}</b><small>${x.source}</small></span><span class="desk-digest-view">${x.expanded?'Close':'View'}</span></button>${x.expanded?`<div class="desk-digest-detail"><div class="body">${x.body}</div>${x.outcome?`<div class="desk-outcome"><strong>Outcome</strong><div class="small" style="margin-top:4px">${x.outcome}</div>${x.impact?.length?`<div class="desk-impact">${x.impact.map(v=>`<span>${v}</span>`).join('')}</div>`:''}</div>`:''}<div class="desk-actions">${x.destination&&x.system?`<button class="btn ghost" data-desk-open="${x.id}">Open</button>`:''}${x.resolved?`<button class="btn ghost" data-desk-archive="${x.id}">Archive</button>`:''}</div></div>`:''}</div>`).join('')}</section>`).join('')}</div>`;
}
function ensureFilmSocial(f){
 if(!f)return null;
 const m=f.marketingState||{};
 if(!f.socialPulse){
  const stageBase=f.stage==='cinema'?36:f.stage==='scheduled'?28:f.stage==='marketing'?20:f.stage==='post'?14:f.stage==='production'?8:10;
  const actors=packageActors(f),star=actors.reduce((a,t)=>a+(t.star||45),0)/Math.max(1,actors.length);
  f.socialPulse={volume:Math.round(clamp(stageBase+(m.buzz||0)*.25+(f.marketing||0)*.18+Math.max(0,star-55)*.08,5,72)),sentiment:Math.round(clamp(50+(m.sentiment||0)*1.2,24,78)),fandom:Math.round(clamp(18+star*.18+Math.max(0,m.sentiment||0)*.35,12,70)),controversy:6,delta:0,lastWeek:state.week,topics:[],history:[],feed:[],moves:[]};
 }
 const p=f.socialPulse;
 p.topics=p.topics||[];p.history=p.history||[];p.feed=p.feed||[];p.moves=p.moves||[];
 if(p.delta===undefined)p.delta=0;if(p.controversy===undefined)p.controversy=6;
 if(!Number.isFinite(p.likes))p.likes=Math.max(500,Math.round((p.volume||0)*900+(p.fandom||0)*650+Math.max(0,(p.sentiment||50)-45)*650));
 if(!Number.isFinite(p.likesThisWeek))p.likesThisWeek=0;
 return p;
}
function socialTopic(f,topic){const p=ensureFilmSocial(f);if(!p||!topic)return;p.topics=[topic,...p.topics.filter(x=>x!==topic)].slice(0,3)}
function pulseSnapshot(p){return {volume:p.volume,sentiment:p.sentiment,fandom:p.fandom,controversy:p.controversy}}
function pulseMoveChanges(before,after){
 const labels={volume:'Conversation',sentiment:'Sentiment',fandom:'Fandom',controversy:'Controversy'},out=[];
 Object.keys(labels).forEach(k=>{const d=Math.round((after[k]||0)-(before[k]||0));if(Math.abs(d)>=1)out.push(`${labels[k]} ${d>0?'+':''}${d}`)});return out;
}
function recordPulseMove(f,reason,before,after){
 const p=ensureFilmSocial(f),changes=pulseMoveChanges(before,after);if(!changes.length)return;
 p.moves.unshift({week:state.week,day:typeof currentCalendarDay==='function'?currentCalendarDay():null,reason,changes});p.moves=p.moves.slice(0,10);
}
function applyPulseDelta(f,{volume=0,sentiment=0,fandom=0,controversy=0,topic=null}={},reason='Audience reaction'){
 if(!f)return;const p=ensureFilmSocial(f),before=pulseSnapshot(p);
 p.volume=clamp(p.volume+volume,0,100);p.sentiment=clamp(p.sentiment+sentiment,0,100);p.fandom=clamp(p.fandom+fandom,0,100);p.controversy=clamp(p.controversy+controversy,0,100);p.delta+=volume;if(topic)socialTopic(f,topic);
 const likeBurst=Math.max(0,Math.round(Math.max(0,volume)*500+Math.max(0,sentiment)*350+Math.max(0,fandom)*250));
 if(likeBurst){p.likes+=likeBurst;p.likesThisWeek=(p.likesThisWeek||0)+likeBurst}
 recordPulseMove(f,reason,before,pulseSnapshot(p));
}
function deskMarketing(f,{buzz=0,sentiment=0,expectations=0}={}){if(!f)return;const m=ensureMarketingState(f);m.buzz=clamp((m.buzz||0)+buzz,-20,45);m.sentiment=clamp((m.sentiment||0)+sentiment,-20,30);m.expectations=clamp((m.expectations||0)+expectations,-10,45);f.buzz=clamp((f.buzz??50)+buzz,0,100)}
function deskSocial(f,spec={},reason='Studio response'){applyPulseDelta(f,spec,reason)}
function addSocialFeed(f,text,tone='neutral'){
 const p=ensureFilmSocial(f);if(!p||!text)return;
 p.feed=p.feed||[];p.feed.unshift({week:state.week,day:typeof currentCalendarDay==='function'?currentCalendarDay():null,text,tone});p.feed=p.feed.slice(0,6);
}
function organicSocialSignal(f,p,r){
 if(r()>.40)return;
 const actors=(f.cast||[]).map(talentById).filter(Boolean),face=actors.sort((a,b)=>(b.star||0)-(a.star||0))[0],topic=(p.topics||[])[0];
 const positive=p.sentiment>=65,heated=p.controversy>=28,highFan=p.fandom>=62;
 const bank=heated?[
  `I opened the replies to see what people thought about ${f.title}. Mistake.`,
  `At this point the argument around ${f.title} is bigger than the clip everyone is arguing about.`,
  `${topic?`People are fighting about #${topic}. `:''}I am increasingly unsure anyone remembers how this started.`,
  `Every post about ${f.title} now comes with a second, angrier post explaining why the first post is wrong.`
 ]:positive?[
  `${face?`${face.name} is ridiculously watchable in this.`:`Okay, ${f.title} has me.`}`,
  `I keep seeing people say “just go see ${f.title}” and, annoyingly, it is working on me.`,
  `The fan edits have officially become better marketing than the marketing.`,
  `${topic?`#${topic} is the bit people keep coming back to, and I get it.`:`Recommendation posts for ${f.title} are starting to feel genuinely organic.`}`
 ]:highFan?[
  `There may only be twelve of us talking about ${f.title}, but apparently none of us sleep.`,
  `${f.title} has entered the “small audience, alarming commitment” phase.`,
  `The same accounts keep posting about ${f.title}. I respect the stamina.`
 ]:[
  `I have now seen ${f.title} everywhere and still could not tell you what it actually feels like.`,
  `People know the title. I am not convinced they know why they care yet.`,
  `${f.title} chatter currently has strong “yes, that is indeed a movie” energy.`
 ];
 addSocialFeed(f,pick(r,bank),heated?'warn':positive?'good':'neutral');
}
function pulseInterpretation(p){
 if(p.volume>=78&&p.sentiment<40)return {label:'Viral backlash',cls:'bad'};
 if(p.volume>=74&&p.controversy>=45)return {label:'Hot & polarised',cls:'warn'};
 if(p.volume>=68&&p.sentiment>=68)return {label:'Hot & loved',cls:'good'};
 if(p.fandom>=68&&p.volume<58)return {label:'Cult intensity',cls:'good'};
 if(p.sentiment>=70&&p.volume<48)return {label:'Quietly loved',cls:'good'};
 if(p.sentiment<40)return {label:'Fragile',cls:'bad'};
 if(p.controversy>=35)return {label:'Divided',cls:'warn'};
 if(p.volume>=55)return {label:'Broad awareness',cls:'blue'};
 if(p.fandom>=55)return {label:'Building a core',cls:'blue'};
 return {label:'Developing',cls:''};
}
function updateSocialPulseWeek(){
 const rows=[];playerFilms().filter(f=>['production','post','marketing','scheduled','cinema'].includes(f.stage)).forEach(f=>{
  const p=ensureFilmSocial(f),m=f.marketingState||{},before=pulseSnapshot(p),prev=p.volume,stageBase=f.stage==='cinema'?45:f.stage==='scheduled'?34:f.stage==='marketing'?26:f.stage==='post'?18:10;
  const reviewLift=f.review?.audience?((f.review.audience-65)*.28):0;
  const overexposure=Math.max(0,p.volume-72)*.18+Math.max(0,(m.expectations||0)-18)*.10;
  const targetV=clamp(stageBase+(f.marketing||0)*.26+(m.buzz||0)*.68+p.fandom*.055+p.controversy*.20,5,96);
  const targetS=clamp(50+(m.sentiment||0)*1.45+reviewLift-p.controversy*.22-overexposure,10,92);
  const r=makeRng(hash((state.seed||1)+'|social-v4021|'+f.id+'|'+state.week));
  p.volume=Math.round(clamp(p.volume*.78+targetV*.22+(r()-.5)*7,3,100));
  p.sentiment=Math.round(clamp(p.sentiment*.84+targetS*.16+(r()-.5)*6,5,98));
  if(p.sentiment>=72&&r()<.32)p.fandom+=1;else if((p.sentiment<40||overexposure>5)&&r()<.42)p.fandom-=1;
  p.fandom=Math.round(clamp(p.fandom,8,98));
  const controversyDecay=p.controversy>=45?(r()<.45?1:0):(r()<.70?1:0);p.controversy=Math.round(clamp(p.controversy-controversyDecay+(r()<.07?2:0),0,100));
  p.delta=p.volume-prev;p.lastWeek=state.week;
  const stageLike=f.stage==='cinema'?2.15:f.stage==='scheduled'?1.45:f.stage==='marketing'?1.05:f.stage==='post'?0.72:0.45;
  const approval=Math.max(0,p.sentiment-35),likeBase=(p.volume*72+p.fandom*48+approval*42)*stageLike;
  const gained=Math.max(0,Math.round(likeBase*(.88+r()*.24)));p.likes=(p.likes||0)+gained;p.likesThisWeek=gained;
  const after=pulseSnapshot(p),meaningful=pulseMoveChanges(before,after).some(x=>Math.abs(parseInt(x.match(/[+-]?\d+/)?.[0]||0))>=2);
  if(meaningful){const reason=p.controversy>=32?'Ongoing controversy':f.review?.audience?'Audience reaction after release':(m.buzz||0)>=12?'Campaign carryover':'Organic audience movement';recordPulseMove(f,reason,before,after)}
  organicSocialSignal(f,p,r);
  p.history.unshift({week:state.week,volume:p.volume,sentiment:p.sentiment,fandom:p.fandom,controversy:p.controversy,likes:p.likes,likesThisWeek:p.likesThisWeek});p.history=p.history.slice(0,12);rows.push({filmId:f.id,volume:p.volume,sentiment:p.sentiment,likes:p.likes});
 });
 state.pulse.lastWeek=state.week;state.pulse.history.unshift({week:state.week,rows});state.pulse.history=state.pulse.history.slice(0,26);
}
function pushDeskItem(x){
 const d=ensureDesk(),id=d.nextId++;let item={id,week:state.week,day:typeof currentCalendarDay==='function'?currentCalendarDay():null,read:false,expanded:true,resolved:false,archived:false,urgency:'normal',type:'industry',source:'The Lot',choices:[],...x};
 item=lotDeskVoice(item);item.expanded=!!item.requiresAction;
 if(!item.requiresAction&&!(item.choices||[]).length)item.resolved=true;
 d.items.unshift(item);d.items=d.items.slice(0,90);
 if(item.requiresAction&&typeof notify==='function'){
  const deadline=item.expiresWeek?` Respond before the end of Week ${item.expiresWeek}.`:'';
  const n=notify(`desk:${id}`,`Studio Desk: ${item.headline}`,`${item.body}${deadline}`,item.filmId||null,true,item.urgency==='urgent'?'warning':'info',{screen:'studio',detail:null,studioTab:'desk',deskId:id});
  if(n)item.notificationId=n.id;
 }
 return item;
}
function deskRep(key,delta){if(!state.reputation)return;state.reputation[key]=clamp((state.reputation[key]??50)+delta,0,100)}
function deskRelationship(delta,f=deskFilm(),extraId=null){const ids=[extraId,f?.directorId,...(f?.cast||[])].filter(Boolean);[...new Set(ids)].forEach(id=>{const t=talentById(id);if(t)t.relationship=clamp((t.relationship||0)+delta,-30,40)})}
function deskTalentTarget(exclude=[]){return state.talent.filter(t=>t.type==='Actor'&&!t.retired&&!exclude.includes(t.id)).sort((a,b)=>(b.momentum||0)-(a.momentum||0)||(b.star||0)-(a.star||0))[0]||null}
function proactiveTalentPitch(){
 const possibilities=[];
 playerFilms().filter(f=>f.stage==='development'&&!f.paused).forEach(f=>{
  const roles=ensureFilmRoles(f).filter(r=>r.type==='lead'&&!f.roleAssignments[r.id]);
  if(!roles.length)return;
  state.talent.filter(t=>t.type==='Actor'&&!t.retired&&(t.relationship||0)>=10&&!talentUnavailableForFilm(t,f)&&!roleForTalent(f,t.id)&&!agencyWindow(t,f)).forEach(t=>{
   const fit=Math.max(...roles.map(r=>actorRoleFit(t,f,r.id)));
   if(fit>=75)possibilities.push({f,t,fit});
  });
 });
 return possibilities.sort((a,b)=>b.fit-a.fit||(b.t.relationship||0)-(a.t.relationship||0))[0]||null;
}
function deskRecentItems(weeks=8){
 const d=ensureDesk(),all=[...(d.items||[]),...(d.archive||[])];
 return all.filter(x=>state.week-(x.week||0)<weeks);
}
function deskRepeatKey(t,x){return `${t.id}|${x.talentId||x.filmId||x.subject||''}`}
function deskEventFamily(id){
 if(['press-budget','press-release','critic-narrative'].includes(id))return 'press-request';
 if(['star-interview'].includes(id))return 'cast-interview';
 if(['agency-package','talent-pitch','first-look'].includes(id))return 'agency-approach';
 if(['fan-clip','fan-theory','meme-breakout','creator-reaction','character-breakout','soundtrack-trend'].includes(id))return 'social-opportunity';
 if(['social-backlash','spoiler-leak','discourse-split','test-screen'].includes(id))return 'social-problem';
 if(['production-leak','crew-story'].includes(id))return 'production-friction';
 if(['production-rumour','rival-poach','rival-director','executive-gossip'].includes(id))return 'lot-gossip';
 return id;
}
function deskFamilyCooldown(id){
 const family=deskEventFamily(id);
 return ({'cast-interview':18,'press-request':8,'agency-approach':8,'social-opportunity':5,'social-problem':6,'production-friction':7,'lot-gossip':4})[family]||0;
}
function deskCandidateAllowed(t,x){
 const templateCooldown=Math.max(t.cooldown||0,t.id==='star-interview'?20:10);
 if(deskRecentItems(templateCooldown).some(i=>i.templateId===t.id))return false;
 const key=deskRepeatKey(t,x),subjectCooldown=Math.max(t.subjectCooldown||0,t.id==='star-interview'?24:14);
 if(deskRecentItems(subjectCooldown).some(i=>i.repeatKey===key))return false;
 const family=deskEventFamily(t.id),familyCd=deskFamilyCooldown(t.id);
 if(familyCd&&deskRecentItems(familyCd).some(i=>deskEventFamily(i.templateId)===family&&(x.filmId?i.filmId===x.filmId:true)))return false;
 return true;
}
const DESK_TEMPLATES=[
 {id:'press-budget',type:'press',source:'Screen Trade',journalistId:'mara-vance',urgency:'action',when:()=>{const f=deskFilm();return f&&f.budget>=20},make:()=>{const f=deskFilm();return {filmId:f.id,subject:f.title,headline:`Trade reporter asks about the scale of ${f.title}`,body:`A Screen Trade reporter is preparing a piece on escalating production budgets and wants your studio on record about ${f.title}'s ${money(f.budget)} spend.`,choices:[['transparent','Be transparent'],['confident','Project confidence'],['decline','Decline comment']]}}},
 {id:'press-release',type:'press',source:'Aurelia Daily',journalistId:'celia-hart',urgency:'action',when:()=>{const f=deskFilm();return f&&['scheduled','cinema'].includes(f.stage)},make:()=>{const f=deskFilm();return {filmId:f.id,subject:f.title,headline:`Aurelia Daily wants a quote on ${f.title}'s campaign`,body:`The culture desk wants to know whether the studio sees ${f.title} as a broad event or a film that needs time to find its audience.`,choices:[['event','Call it an event'],['measured','Keep expectations measured'],['filmmaker','Put the filmmaker forward']]}}},
 {id:'agency-package',type:'talent',source:'Agency Desk',urgency:'action',when:()=>!!agencyPackagePitchCandidate(),make:()=>{const p=agencyPackagePitchCandidate();if(!p)return null;const names=p.picks.map(x=>x.t.name),parts=p.picks.map(x=>`${x.t.name} for ${x.role}`).join(' and ');return {filmId:p.f.id,talentId:p.picks[0].t.id,talentIds:p.picks.map(x=>x.t.id),agencyId:p.a.id,source:p.a.name,subject:names.join(' + '),headline:`${p.a.name} brings a ${p.picks.length}-client package for ${p.f.title}`,body:`${p.a.name} is proposing ${parts}. The agency will hold a four-week priority conversation with the group if you take the meeting. This is access, not proof of role fit: actors still need screen-test evidence and every contract is negotiated separately.`,choices:[['meet','Hear the package'],['pass','Pass cleanly'],['hardball','Demand exclusivity']]}}},
 {id:'talent-pitch',type:'talent',source:'Talent Desk',urgency:'action',when:()=>!!proactiveTalentPitch(),make:()=>{const p=proactiveTalentPitch();if(!p)return null;const {f,t}=p;return {filmId:f.id,talentId:t.id,source:talentAgency(t).name,subject:t.name,headline:`${t.name} asks to discuss ${f.title}`,body:`After working with your studio, ${t.name} has asked their representatives to seek a conversation about ${f.title}. Their interest is genuine, but the part and terms still need to work. Respond within four weeks.`,choices:[['meet','Invite a conversation'],['read','Send the screenplay'],['pass','Pass with thanks']]}}},
 {id:'production-leak',type:'crisis',source:'Studio Publicity',urgency:'urgent',cooldown:10,when:()=>!!activePlayerFilms().find(x=>x.stage==='production'),make:()=>{const f=activePlayerFilms().find(x=>x.stage==='production');return {filmId:f.id,subject:f.title,headline:`Unapproved ${f.title} set images are circulating`,body:`Low-quality set photographs are moving through fan accounts, revealing more of the production design than publicity intended.`,choices:[['embrace','Release an official image'],['contain','Issue takedowns'],['ignore','Let it burn out']]}}},
 {id:'production-rumour',type:'gossip',source:'Lotline',urgency:'normal',make:()=>{const rv=deskRival();return {subject:rv?.name||'Rival studio',headline:`Rumour: ${rv?.name||'a rival'} may be cooling on an expensive package`,body:`Two people around The Lot say internal enthusiasm has softened. Neither financing nor the creative package has visibly changed, so the report may be premature.`,truth:['true','mixed','false'][state.week%3],choices:[]}}},
 {id:'rival-poach',type:'gossip',source:'Lotline',urgency:'normal',make:()=>{const rv=deskRival(),f=deskFilm();return {filmId:f?.id||null,subject:rv?.name||'Rival studio',headline:`Whisper: ${rv?.name||'a rival'} is circling talent connected to ${f?.title||'your slate'}`,body:`The chatter is specific enough to notice but not strong enough to treat as fact. Agency sources are not confirming active negotiations.`,truth:['false','true','mixed'][(state.week+1)%3],choices:[]}}},
 {id:'finance-question',type:'finance',source:'The Ledger',journalistId:'daniel-mercer',urgency:'action',when:()=>state.finance?.bridgeDebt>0,make:()=>({subject:state.studio.name,headline:'Finance desk asks whether bridge borrowing changes the slate',body:`The Ledger has noticed financing activity around ${state.studio.name}. A reporter wants to know whether liquidity pressure will affect upcoming greenlights.`,choices:[['open','Acknowledge discipline'],['deny','Say the slate is unchanged'],['decline','Decline comment']]})},
 {id:'rival-hit',type:'industry',source:'Screen Trade',urgency:'normal',make:()=>{const rv=deskRival();return {subject:rv?.name||'Rival',headline:`${rv?.name||'A rival studio'} is drawing heat after a strong weekend`,body:`Buyers and agencies are watching whether the studio converts momentum into more aggressive packaging over the next month.`,choices:[]}}},
 {id:'rival-strain',type:'industry',source:'The Ledger',urgency:'normal',make:()=>{const rv=state.rivals?.slice().sort((a,b)=>(a.cash||0)-(b.cash||0))[0];return {subject:rv?.name||'Rival',headline:`Questions grow around ${rv?.name||'a rival'}'s spending pace`,body:`Trade finance desks are comparing the company's active commitments with its estimated liquidity. Nothing public suggests a crisis, but the scrutiny is increasing.`,choices:[]}}},
 {id:'festival-invite',type:'press',source:'Aurelia Film Week',urgency:'action',when:()=>{const f=deskFilm();return f&&['post','scheduled'].includes(f.stage)},make:()=>{const f=deskFilm();return {filmId:f.id,subject:f.title,headline:`Aurelia Film Week asks about an early ${f.title} presentation`,body:`Programmers are interested in a limited first-look presentation. It could add prestige and conversation, but it also gives the industry an earlier read on the film.`,choices:[['accept','Accept interest'],['private','Offer private screening'],['pass','Hold for release']]}}},
 {id:'crew-story',type:'production',source:'Production Office',urgency:'action',when:()=>!!activePlayerFilms().find(x=>x.stage==='production'),make:()=>{const f=activePlayerFilms().find(x=>x.stage==='production');return {filmId:f.id,subject:f.title,headline:`Crew morale on ${f.title} is becoming a talking point`,body:`Long days have created some frustration. There is no stoppage threat, but the mood could become a public story if ignored.`,choices:[['spend','Fund recovery day'],['meet','Meet department heads'],['hold','Stay on schedule']]}}},
 {id:'test-screen',type:'pulse',source:'Pulse',urgency:'action',when:()=>{const f=deskFilm();return f&&['post','scheduled'].includes(f.stage)},make:()=>{const f=deskFilm();return {filmId:f.id,subject:f.title,headline:`Social conversation around ${f.title} is splitting into two camps`,body:`One group wants a broader emotional sell; the most engaged fans are responding to the stranger, more specific parts of the campaign. Publicity can sharpen the positioning now or leave the ambiguity intact.`,choices:[['broad','Broaden the message'],['core','Lean into core fans'],['steady','Keep current positioning']]}}},
 {id:'fan-clip',type:'pulse',source:'Pulse',urgency:'action',when:()=>{const f=deskFilm();return f&&['scheduled','cinema'].includes(f.stage)},make:()=>{const f=deskFilm();return {filmId:f.id,subject:f.title,headline:`A ${f.title} clip is outperforming the paid campaign`,body:`An organic short-form clip has become the most shared piece of material connected to the film this week. The team can amplify it, redirect attention, or avoid looking like the studio is chasing the meme.`,choices:[['boost','Amplify the clip'],['redirect','Redirect to trailer'],['organic','Leave it organic']]}}},
 {id:'writer-call',type:'talent',source:'Writers Guild Desk',urgency:'normal',make:()=>({subject:'Development',headline:'A writer with heat is asking which studios are truly filmmaker-friendly',body:`Representatives are comparing how studios handled notes, rewrites and credit on recent projects. Your development choices are becoming part of the informal reputation market.`,choices:[]})},
 {id:'critic-narrative',type:'press',source:'The Review',journalistId:'ruth-bell',urgency:'action',when:()=>playerFilms().some(f=>f.review),make:()=>{const f=playerFilms().filter(x=>x.review).slice(-1)[0];return {filmId:f.id,subject:f.title,headline:`The Review asks how you read the critical narrative on ${f.title}`,body:`A columnist wants a response to the gap between critical and audience reaction. Your answer will become part of the film's continuing story online as well as in the trade press.`,choices:[['respect','Respect the reviews'],['audience','Point to audiences'],['fight','Push back hard']]}}},
 {id:'catalogue-call',type:'finance',source:'Meridian Capital',urgency:'action',when:()=>playerFilms().some(f=>f.stage==='complete'),make:()=>({subject:'Catalogue',headline:'Investor asks about acquiring a slice of catalogue income',body:`A finance group has informally sounded out the studio about monetising a small portion of future catalogue receipts for cash today. No formal offer is on the table yet.`,choices:[['listen','Hear the proposal'],['decline','Keep the catalogue'],['signal','Signal openness later']]})},
 {id:'rival-director',type:'gossip',source:'Lotline',urgency:'normal',make:()=>{const rv=deskRival();return {subject:rv?.name||'Rival',headline:`Rumour: ${rv?.name||'a rival'} has lost a director over creative control`,body:`The claim is spreading quickly, but the filmmaker remains publicly attached. This is exactly the kind of Lot story that can be true in spirit before it is true in fact.`,truth:['mixed','false','true'][(state.week+2)%3],choices:[]}}},
 {id:'opening-tracking',type:'pulse',source:'Pulse',urgency:'normal',when:()=>{const f=deskFilm();return f&&f.stage==='scheduled'},make:()=>{const f=deskFilm(),p=ensureFilmSocial(f);return {filmId:f.id,subject:f.title,headline:`${f.title} social conversation index reaches ${p.volume}`,body:`Conversation is ${p.volume>=70?'strong':p.volume>=50?'healthy':'soft'} for this point in the campaign. Sentiment is ${p.sentiment>=65?'positive':p.sentiment<42?'fragile':'mixed'}, with fan intensity at ${p.fandom}/100.`,pulseScore:p.volume,choices:[]}}},
 {id:'star-interview',type:'talent',source:'Publicity Office',urgency:'action',cooldown:9,subjectCooldown:16,when:()=>{const f=deskFilm();return !!f?.cast?.length},make:()=>{const f=deskFilm(),actors=(f.cast||[]).map(talentById).filter(Boolean),t=actors[Math.abs(hash(f.id+'|'+state.week))%actors.length];return {filmId:f.id,talentId:t?.id||null,subject:t?.name||f.title,headline:`${t?.name||'A principal cast member'} has been offered a high-profile interview`,body:`The appearance would put personality ahead of the film for one media cycle. It can broaden reach, but it may also shift the campaign away from the material and raise celebrity-driven expectations.`,choices:[['book','Book the interview'],['film','Keep focus on film'],['joint','Pair with filmmaker']]}}},
 {id:'release-date-chatter',type:'industry',source:'Exhibitor Wire',urgency:'normal',make:()=>({subject:'Release calendar',headline:'Exhibitors expect another wave of release-date movement',body:`Several distributors are testing alternative dates. Nothing directly forces your hand, but the calendar around your films may look different within a few weeks.`,choices:[]})},
 {id:'buyers-market',type:'industry',source:'Screen Trade',urgency:'normal',make:()=>({subject:'Development market',headline:'Buyers are moving faster on distinctive packages',body:`Agents say ordinary material is sitting longer while scripts with a clear identity are triggering earlier calls and more pre-emptive conversations.`,choices:[]})},
 {id:'social-backlash',type:'pulse',source:'Pulse',urgency:'urgent',cooldown:10,when:()=>{const f=deskFilm();return f&&f.stage==='scheduled'},make:()=>{const f=deskFilm();return {filmId:f.id,subject:f.title,headline:`A ${f.title} campaign beat is drawing concentrated negative attention`,body:`The overall audience has not turned, but the negative share is rising quickly and a hostile quote-post is spreading outside the core film audience. Publicity wants a decision before the next paid beat.`,choices:[['clarify','Clarify the message'],['pause','Pause paid push'],['ignore','Do not feed it']]}}},
 {id:'executive-gossip',type:'gossip',source:'Lotline',urgency:'normal',make:()=>{const rv=deskRival();return {subject:rv?.name||'Rival',headline:`Lot chatter says ${rv?.name||'a rival'} may reorganise its film group`,body:`The story is based on meeting calendars and a few cancelled lunches — very Lot, very uncertain.`,truth:['false','mixed','true'][state.week%3],choices:[]}}},
 {id:'first-look',type:'talent',source:'Agency Desk',urgency:'action',when:()=>studioIdentityPrimary().label!=='Independent',make:()=>({subject:'Studio identity',headline:`Your studio reputation is opening a first-look conversation`,body:`An agency has offered a short exclusive window on a new package because your recent work fits how they currently describe the studio.`,choices:[['read','Take the first look'],['pass','Pass quickly'],['relationship','Take meeting, no exclusivity']]})},
 // Social-first Desk events. These are deliberately distinct so Pulse can become its own strategic layer rather than another flavour of press interview.
 {id:'fan-theory',type:'pulse',source:'Pulse',urgency:'action',when:()=>{const f=deskFilm();return f&&['post','scheduled'].includes(f.stage)},make:()=>{const f=deskFilm();return {filmId:f.id,subject:f.title,headline:`A fan theory about ${f.title} is escaping the core audience`,body:`A speculative theory built from trailer details is spreading across fan accounts. It is wrong in places, but it is pulling new people into the conversation without paid support.`,choices:[['tease','Tease the theory'],['correct','Quietly correct it'],['silent','Stay completely silent']]}}},
 {id:'meme-breakout',type:'pulse',source:'Pulse',urgency:'action',when:()=>{const f=deskFilm();return f&&['scheduled','cinema'].includes(f.stage)},make:()=>{const f=deskFilm();return {filmId:f.id,subject:f.title,headline:`A ${f.title} reaction image has become a meme format`,body:`The image is now being used in posts that have nothing to do with the movie. That is enormous reach, but brands jumping into the joke too aggressively can kill it.`,choices:[['official','Join the joke once'],['merch','Turn it into campaign creative'],['hands-off','Stay out of it']]}}},
 {id:'creator-reaction',type:'pulse',source:'Pulse',urgency:'action',when:()=>{const f=deskFilm();return f&&f.stage==='scheduled'},make:()=>{const f=deskFilm();return {filmId:f.id,subject:f.title,headline:`A major film creator posts an unexpectedly strong ${f.title} reaction`,body:`The creator's audience is outside your strongest existing demographic and the clip is climbing. Publicity can engage directly, buy adjacent placements, or avoid making an organic endorsement feel transactional.`,choices:[['engage','Engage publicly'],['adjacent','Buy adjacent social spend'],['leave','Leave it organic']]}}},
 {id:'character-breakout',type:'pulse',source:'Pulse',urgency:'action',when:()=>{const f=deskFilm();return f&&['scheduled','cinema'].includes(f.stage)&&f.cast?.length},make:()=>{const f=deskFilm(),actors=(f.cast||[]).map(talentById).filter(Boolean),t=actors[(state.week+1)%actors.length];return {filmId:f.id,talentId:t?.id||null,subject:t?.name||f.title,headline:`Fans are latching onto ${t?.name||'one cast member'} as the face of ${f.title}`,body:`Edits, fancams and quote clips are concentrating around one performer rather than the film as a whole. That can create a powerful entry point, but it may flatten the ensemble campaign.`,choices:[['feature','Feature them more'],['ensemble','Rebalance to ensemble'],['organic','Let fans lead']]}}},
 {id:'soundtrack-trend',type:'pulse',source:'Pulse',urgency:'action',when:()=>{const f=deskFilm();return f&&['scheduled','cinema'].includes(f.stage)&&f.soundtrack?.committed&&['needle','hybrid'].includes(f.soundtrack.strategy)&&f.soundtrack.trackId},make:()=>{const f=deskFilm(),t=soundtrackTrack(f.soundtrack.trackId);return {filmId:f.id,subject:f.title,headline:`${t?.artist||'A soundtrack artist'} is pulling ${f.title} into music feeds`,body:`“${t?.title||'The signature track'}” is being reused in short-form posts outside the official campaign. The trend is still audience-led; pushing it harder could create reach while making the moment feel manufactured.`,choices:[['seed','Seed creator clips'],['release','Release a film edit'],['wait','Leave it audience-led']]}}},
 {id:'spoiler-leak',type:'pulse',source:'Pulse',urgency:'urgent',cooldown:12,when:()=>{const f=deskFilm();return f&&['post','scheduled'].includes(f.stage)},make:()=>{const f=deskFilm();return {filmId:f.id,subject:f.title,headline:`A ${f.title} spoiler claim is beginning to trend`,body:`An account claims to know a major third-act reveal. The post is not yet mainstream, and publicity cannot confirm whether the supposed spoiler is even accurate without drawing more attention to it.`,choices:[['deny','Issue a denial'],['drown','Flood with official material'],['ignore','Do not validate it']]}}},
 {id:'discourse-split',type:'pulse',source:'Pulse',urgency:'action',when:()=>{const f=deskFilm();return f&&['scheduled','cinema'].includes(f.stage)},make:()=>{const f=deskFilm();return {filmId:f.id,subject:f.title,headline:`${f.title} is becoming a culture-war proxy for people who have not seen it`,body:`A fast-growing argument is now only loosely connected to the movie itself. The volume is useful; the sentiment is volatile and could overwhelm ordinary film conversation.`,choices:[['film','Drag conversation back to the film'],['values','State the creative intent'],['silence','Refuse the frame']]}}},
 {id:'fan-campaign',type:'pulse',source:'Pulse',urgency:'normal',when:()=>{const f=deskFilm();return f&&f.stage==='cinema'&&ensureFilmSocial(f).fandom>=55},make:()=>{const f=deskFilm();return {filmId:f.id,subject:f.title,headline:`${f.title} fans organise a coordinated recommendation push`,body:`The campaign is not studio-led. Fans are posting screening times, spoiler-free reactions and personalised recommendations to friends.`,choices:[]}}}
];
function deskTemplatePool(){return DESK_TEMPLATES.filter(t=>!t.when||t.when())}
function generateStudioDeskWeek(){
 const d=ensureDesk();if(!state.studio||d.lastGeneratedWeek>=state.week)return;d.lastGeneratedWeek=state.week;updateSocialPulseWeek();
 const pool=deskTemplatePool();if(!pool.length)return;
 const r=makeRng(hash(state.seed+'|desk-v352|'+state.week)),active=activePlayerFilms().filter(f=>!['complete','shelved'].includes(f.stage)),openActions=d.items.filter(x=>!x.resolved&&x.requiresAction),sinceAction=state.week-(d.lastDecisionGeneratedWeek||0);
 // Desk traffic is deliberately sparse. Pulse still evolves every week in the background.
 let chance=.18+Math.min(3,active.length)*.045+(active.some(f=>['scheduled','cinema'].includes(f.stage))?.045:0);
 if(openActions.length)chance*=.32;
 if(r()>clamp(chance,.18,.36)){expireDeskItems();return}
 const wantAction=!openActions.length&&sinceAction>=3&&r()<.38,recentTypes=deskRecentItems(4).map(x=>x.type),evaluated=[];
 pool.forEach(t=>{try{
  const x=t.make(r);if(!x||!deskCandidateAllowed(t,x))return;const actionable=(x.choices||[]).length>0;
  if(actionable&&!wantAction&&t.urgency!=='urgent')return;
  if(actionable&&sinceAction<3&&t.urgency!=='urgent')return;
  // Random crises remain possible, but are intentionally rare rather than weekly texture.
  if(t.urgency==='urgent'&&r()>.16)return;
  let score=r();if(!actionable)score+=.14;if(wantAction&&actionable)score+=.20;if(recentTypes.includes(t.type))score-=.18;if(t.type==='pulse')score+=.04;
  evaluated.push({t,x,score});
 }catch(e){}});
 if(!evaluated.length){expireDeskItems();return}
 evaluated.sort((a,b)=>b.score-a.score);const {t,x}=evaluated[0],actionable=(x.choices||[]).length>0;
 const item=pushDeskItem({...x,templateId:t.id,repeatKey:deskRepeatKey(t,x),family:deskEventFamily(t.id),type:t.type,source:x.source||t.source,journalistId:x.journalistId||t.journalistId||null,urgency:t.urgency||'normal',requiresAction:actionable,expiresWeek:actionable?state.week+4:null});
 if(actionable)d.lastDecisionGeneratedWeek=state.week;
 expireDeskItems();return item;
}
function expireDeskItems(){const d=ensureDesk();d.items.forEach(x=>{if(!x.resolved&&x.expiresWeek&&state.week>x.expiresWeek){x.resolved=true;x.expired=true;x.expanded=false;x.outcome='The window closed without a studio response.'}})}
function nextUrgentDeskItem(){expireDeskItems();return ensureDesk().items.find(x=>!x.resolved&&x.requiresAction&&x.urgency==='urgent')||null}
function deskFilmForItem(item){return item?.filmId?filmById(item.filmId):(item?.subject?playerFilms().find(x=>x.title===item.subject):null)||deskFilm()}
function deskImpactSnapshot(item){
 const f=deskFilmForItem(item),m=f?ensureMarketingState(f):null,p=f?ensureFilmSocial(f):null,ids=[item?.talentId,f?.directorId,...(f?.cast||[])].filter(Boolean),rels=ids.map(id=>talentById(id)?.relationship||0);
 return {cash:state.cash,reputation:deep(state.reputation||{}),buzz:m?.buzz??0,sentiment:m?.sentiment??0,expectations:m?.expectations??0,volume:p?.volume??0,socialSentiment:p?.sentiment??0,fandom:p?.fandom??0,controversy:p?.controversy??0,relationship:rels.length?rels.reduce((a,b)=>a+b,0)/rels.length:0};
}
function signedDelta(n,dec=0){const v=dec?Number(n.toFixed(dec)):Math.round(n);return `${v>0?'+':''}${v}`}
function deskImpactSummary(before,after){
 const out=[],cash=after.cash-before.cash;if(Math.abs(cash)>.001)out.push(`Cash ${cash>0?'+$':'-$'}${Math.abs(cash).toFixed(2)}m`);
 [['Campaign reach','buzz'],['Campaign tone','sentiment'],['Expectation','expectations'],['Audience conversation','volume'],['Audience sentiment','socialSentiment'],['Fan intensity','fandom'],['Controversy','controversy']].forEach(([label,k])=>{const d=after[k]-before[k];if(Math.abs(d)>=1)out.push(`${label} ${signedDelta(d)}`)});
 const rel=after.relationship-before.relationship;if(Math.abs(rel)>=.5)out.push(`Talent relations ${signedDelta(rel,1)}`);
 const labels={creative:'Creative rep',commercial:'Commercial rep',financial:'Financial rep',press:'Press rep',talent:'Talent rep'};Object.keys(labels).forEach(k=>{const d=(after.reputation?.[k]??50)-(before.reputation?.[k]??50);if(Math.abs(d)>=1)out.push(`${labels[k]} ${signedDelta(d)}`)});
 return out.slice(0,7);
}
const DESK_EFFECTS={
 'press-budget':{
  transparent:{rep:{financial:2,creative:1},social:{sentiment:2,topic:'budget transparency'},outcome:'The candid answer lands as disciplined rather than defensive.'},
  confident:{marketing:{buzz:3,expectations:2},rep:{commercial:1},social:{volume:5,sentiment:1,topic:'studio confidence'},outcome:'The quote strengthens belief in the film, while nudging expectations upward.'},
  decline:{rep:{press:-1},social:{sentiment:-1},outcome:'The piece runs without your voice, leaving others to frame the number.'}
 },
 'press-release':{
  event:{marketing:{buzz:4,expectations:5},rep:{commercial:1},social:{volume:8,sentiment:-2,controversy:2,topic:'event movie'},outcome:'The quote raises reach and expectations sharply. Some audiences read the confidence as hype before the film has earned it.'},
  measured:{marketing:{buzz:1,expectations:-1},rep:{financial:1},social:{sentiment:2},outcome:'The studio avoids overpromising and keeps the narrative controlled.'},
  filmmaker:{relationship:2,rep:{creative:2},social:{sentiment:3,fandom:2,topic:'filmmaker focus'},outcome:'The filmmaker-forward answer plays well with talent and the most engaged film audience.'}
 },
 'agency-package':{
  meet:{rep:{talent:2},outcome:'The agency opens the room and gives the studio a priority look at the package.'},
  hardball:{rep:{talent:-2},outcome:'The agency rejects the exclusivity demand and the relationship cools.'},
  pass:{outcome:'The pass is clean and costs nothing beyond the opportunity.'}
 },
 'talent-pitch':{
  meet:{talentRelationship:2,rep:{talent:1},outcome:'The performer and their representatives welcome the invitation.'},
  read:{talentRelationship:1,outcome:'The screenplay is sent for a considered read; no priority window has been agreed.'},
  pass:{talentRelationship:-1,outcome:'The performer appreciates a clear answer, though the immediate opportunity passes.'}
 },
 'production-leak':{
  embrace:{marketing:{buzz:2},social:{volume:10,sentiment:5,controversy:-2,topic:'official first look'},rep:{press:2},outcome:'A polished official image overwhelms most of the leaked material and turns the leak into a controlled reveal.'},
  contain:{rep:{press:-1},social:{volume:-3,sentiment:-2,controversy:4,topic:'takedown requests'},outcome:'The leak slows, though the takedown effort creates a smaller second wave of chatter.'},
  ignore:{social:{volume:2,sentiment:-4,controversy:3,topic:'set leak'},outcome:'The images remain rough and uncontrolled; the story fades slowly rather than cleanly.'}
 },
 'finance-question':{
  open:{rep:{financial:2},outcome:'The answer is read as sober balance-sheet management.'},
  deny:{rep:{financial:-1},outcome:'The denial holds for now, but finance reporters keep watching the cash position.'},
  decline:{rep:{press:-1},outcome:'The story proceeds without comment.'}
 },
 'festival-invite':{
  accept:{marketing:{buzz:3,expectations:2},social:{volume:4,sentiment:4,fandom:2,topic:'festival first look'},rep:{creative:2},outcome:'Festival interest becomes a prestige signal and gives the film an earlier social story.'},
  private:{rep:{creative:1},social:{sentiment:1},outcome:'A private look preserves control while building quiet advocate interest.'},
  pass:{marketing:{expectations:-1},outcome:'The studio keeps the film protected for its planned campaign.'}
 },
 'crew-story':{
  spend:{cash:.35,requireCash:true,relationship:2,rep:{creative:1},outcome:'A $0.35m schedule adjustment improves morale and lowers the temperature.',fallback:{relationship:1,outcome:'Cash is too tight for the recovery day, so department heads receive direct attention instead.'}},
  meet:{relationship:1,outcome:'The direct conversation helps without materially changing the schedule.'},
  hold:{relationship:-2,outcome:'The production stays on pace, but the mood remains a vulnerability.'}
 },
 'test-screen':{
  broad:{marketing:{buzz:1,sentiment:1},social:{volume:5,sentiment:0,fandom:-5,topic:'broader campaign'},rep:{commercial:1},outcome:'Reach improves, but the campaign loses some of the specific identity that created the strongest fans.'},
  core:{marketing:{buzz:2,sentiment:1,expectations:1},social:{volume:-1,sentiment:4,fandom:6,topic:'core fan campaign'},rep:{creative:1},outcome:'The campaign gets sharper and fan intensity rises, but total conversation narrows as casual audiences fall away.'},
  steady:{social:{sentiment:1},outcome:'The team keeps the current positioning and waits for more signal.'}
 },
 'fan-clip':{
  boost:{cash:.18,social:{volume:12,sentiment:-1,fandom:-1,controversy:2,topic:'viral clip'},marketing:{expectations:3},outcome:'Paid amplification makes the clip much bigger, but some of the audience notices the studio trying to manufacture what had felt organic.'},
  redirect:{social:{volume:5,sentiment:1,topic:'official trailer'},outcome:'The attention is channelled back toward the official trailer and release message.'},
  organic:{social:{volume:7,sentiment:4,fandom:4,topic:'organic clip'},outcome:'The clip keeps spreading without the studio visibly trying to own it.'}
 },
 'critic-narrative':{
  respect:{rep:{creative:2,press:2},social:{sentiment:4,controversy:-2,topic:'measured response'},outcome:'The measured response plays well with critics, filmmakers and the less combative part of the online conversation.'},
  audience:{rep:{commercial:2},social:{volume:4,sentiment:2,fandom:2,topic:'audience response'},outcome:'The studio shifts the story toward audience response without directly attacking critics.'},
  fight:{rep:{press:-3},social:{volume:10,sentiment:-7,controversy:12,topic:'studio vs critics'},outcome:'The quote explodes in reach, but the argument becomes part of the film’s identity and press relations harden.'}
 },
 'catalogue-call':{
  listen:{rep:{financial:1},outcome:'A preliminary finance conversation opens; no rights or revenue are committed.'},
  decline:{rep:{financial:1},outcome:'The studio signals that catalogue income is strategic, not distressed inventory.'},
  signal:{outcome:'The investor keeps the relationship warm for a later window.'}
 },
 'social-backlash':{
  clarify:{cash:.12,social:{volume:2,sentiment:8,controversy:-8,topic:'campaign clarification'},rep:{press:2},outcome:'A fast clarification stabilises sentiment before the hostile framing dominates the campaign.'},
  pause:{social:{volume:-8,sentiment:3,controversy:-5},rep:{press:1},outcome:'The paid push pauses. Reach falls, but the negative cycle cools faster.'},
  ignore:{social:{volume:4,sentiment:-10,controversy:9,topic:'backlash'},outcome:'You avoid feeding the criticism directly, but negative share stays elevated and the argument travels further.'}
 },
 'star-interview':{
  book:{marketing:{buzz:2,expectations:3},social:{volume:8,sentiment:1,fandom:2,controversy:1,topic:'cast interview'},rep:{commercial:1},outcome:'The interview broadens awareness through the performer, but raises celebrity-driven expectations and gives the personality cycle more room to outrun the film.'},
  film:{marketing:{buzz:1},social:{volume:2,sentiment:2,topic:'film-first campaign'},rep:{creative:1},outcome:'The campaign remains centred on the film rather than celebrity coverage.'},
  joint:{relationship:1,social:{volume:5,sentiment:5,fandom:2,topic:'cast + filmmaker'},rep:{creative:2},outcome:'The joint appearance reinforces the film as a creative collaboration and lands warmly online.'}
 },
 'first-look':{
  read:{rep:{talent:2},outcome:'The package enters your private reading window before wider circulation.'},
  relationship:{rep:{talent:1},outcome:'You preserve the relationship without tying up the material.'},
  pass:{outcome:'The quick pass is appreciated; the agency moves on.'}
 },
 'fan-theory':{
  tease:{social:{volume:10,sentiment:1,fandom:6,controversy:5,topic:'fan theory'},marketing:{expectations:3},outcome:'A carefully ambiguous post turbocharges speculation. Fan investment rises, but so does the risk that the audience is now expecting a reveal the film never promised.'},
  correct:{social:{volume:-2,sentiment:2,fandom:-1,controversy:-3},outcome:'The misconception is contained, but some of the free speculation energy disappears with it.'},
  silent:{social:{volume:5,sentiment:4,fandom:5,topic:'fan theory'},outcome:'Silence is interpreted as permission to keep digging; the theory grows organically without becoming an official promise.'}
 },
 'meme-breakout':{
  official:{social:{volume:8,sentiment:6,fandom:3,topic:'meme breakout'},outcome:'One well-judged studio reply lands without overwhelming the joke.'},
  merch:{social:{volume:10,sentiment:-3,fandom:-2,controversy:4,topic:'brand joins meme'},marketing:{buzz:2},outcome:'Reach jumps, but part of the audience decides the studio commercialised the joke too quickly.'},
  'hands-off':{social:{volume:6,sentiment:5,fandom:5,topic:'organic meme'},outcome:'The meme remains audience-owned and keeps travelling on its own terms.'}
 },
 'creator-reaction':{
  engage:{social:{volume:7,sentiment:6,fandom:2,topic:'creator endorsement'},outcome:'The public exchange exposes the film to a new audience without much paid spend.'},
  adjacent:{cash:.22,social:{volume:11,sentiment:-1,fandom:0,controversy:1,topic:'creator-adjacent spend'},marketing:{buzz:2,expectations:2},outcome:'The studio scales the moment quickly, but the endorsement immediately feels more transactional and expectations rise with the spend.'},
  leave:{social:{volume:5,sentiment:5,fandom:3,topic:'organic creator reaction'},outcome:'The endorsement stays independent, preserving credibility while growing more slowly.'}
 },
 'character-breakout':{
  feature:{social:{volume:9,sentiment:1,fandom:3,controversy:2,topic:'breakout character'},marketing:{buzz:2,expectations:2},relationship:1,outcome:'The campaign rides the breakout performer and gets a noticeable reach lift, while increasing the risk that the film becomes identified with one face.'},
  ensemble:{social:{volume:3,sentiment:3,fandom:1,topic:'ensemble campaign'},relationship:2,outcome:'The campaign protects the ensemble identity and talent relationships, but gives up some easy heat.'},
  organic:{social:{volume:6,sentiment:5,fandom:6,topic:'fan favourite'},outcome:'Fans keep building the performer organically, creating strong affinity without an obvious studio push.'}
 },
 'soundtrack-trend':{
  seed:{cash:.15,social:{volume:11,sentiment:-2,fandom:1,controversy:3,topic:'seeded soundtrack trend'},marketing:{buzz:2,expectations:1},outcome:'Paid creator seeding scales the song quickly, but some of the audience notices the studio fingerprints on what had felt organic.'},
  release:{social:{volume:7,sentiment:3,fandom:3,controversy:1,topic:'official soundtrack edit'},marketing:{buzz:1},outcome:'A film-specific music edit gives fans more material without fully taking ownership of the trend.'},
  wait:{social:{volume:3,sentiment:5,fandom:5,controversy:-1,topic:'organic soundtrack trend'},outcome:'The trend grows more slowly, but the song remains something audiences discovered rather than something the studio manufactured.'}
 },
 'spoiler-leak':{
  deny:{social:{volume:12,sentiment:-2,controversy:8,topic:'spoiler denial'},rep:{press:1},outcome:'The denial reaches a much larger audience than the original claim; it reassures some people while validating the story as news.'},
  drown:{cash:.2,social:{volume:8,sentiment:4,controversy:-2,topic:'official material'},marketing:{buzz:2},outcome:'Fresh official material changes the subject for most casual viewers without addressing the spoiler directly.'},
  ignore:{social:{volume:1,sentiment:1,fandom:1,controversy:-3},outcome:'The account never gets an official signal boost and the claim remains mostly inside fan circles.'}
 },
 'discourse-split':{
  film:{social:{volume:-2,sentiment:5,controversy:-7,topic:'back to the movie'},outcome:'New film-focused material gives ordinary audiences something else to talk about and lowers the temperature.'},
  values:{social:{volume:9,sentiment:1,fandom:5,controversy:8,topic:'creative intent'},rep:{creative:2},outcome:'The statement energises supporters and clarifies the film’s intent, but keeps the wider argument alive.'},
  silence:{social:{volume:-4,sentiment:2,controversy:-4},outcome:'The studio refuses the frame. Reach cools, but the film gradually separates from the argument.'}
 }
};
function applyDeskEffectSpec(item,spec,f){
 if(!spec)return 'The decision is noted.';
 if(spec.cash&&spec.requireCash&&state.cash<spec.cash)spec=spec.fallback||{outcome:'The studio cannot fund that response.'};
 else if(spec.cash&&state.cash>=spec.cash)state.cash-=spec.cash;
 Object.entries(spec.rep||{}).forEach(([k,v])=>deskRep(k,v));
 if(spec.social)deskSocial(f,spec.social,item.headline||'Studio response');
 if(spec.marketing)deskMarketing(f,spec.marketing);
 if(spec.relationship)deskRelationship(spec.relationship,f,item.talentId);
 if(spec.talentRelationship&&item.talentId){const t=talentById(item.talentId);if(t)t.relationship=clamp((t.relationship||0)+spec.talentRelationship,-30,40)}
 return spec.outcome||'The decision is noted.';
}
function deskChoiceEffects(item,key){
 if(typeof resolveCorporateDeskChoice==='function'){
  const corporate=resolveCorporateDeskChoice(item,key);if(corporate!==null&&corporate!==undefined)return corporate;
 }
 if(typeof resolveOpportunityDeskChoice==='function'){
  const special=resolveOpportunityDeskChoice(item,key);if(special!==null&&special!==undefined)return special;
 }
 const f=deskFilmForItem(item),spec=DESK_EFFECTS[item.templateId]?.[key];
 return applyDeskEffectSpec(item,spec,f);
}

function resolveDeskChoice(id,key){
 const d=ensureDesk(),item=deskItemById(id,d);if(!item||item.resolved)return;const before=deskImpactSnapshot(item);item.read=true;item.expanded=true;item.resolved=true;item.resolvedWeek=state.week;item.choice=key;item.outcome=deskChoiceEffects(item,key);
 if(item.templateId==='agency-package'){
  const ids=[...new Set(((item.talentIds?.length?item.talentIds:[item.talentId])||[]).filter(Boolean))],people=ids.map(talentById).filter(Boolean),f=filmById(item.filmId),a=AGENCIES.find(x=>x.id===item.agencyId)||(people[0]?talentAgency(people[0]):null);
  if(key==='meet'&&f){
   const opened=people.filter(t=>openAgencyWindow(t,f));
   opened.forEach(t=>t.relationship=clamp((t.relationship||0)+2,-30,40));
   if(opened.length)item.outcome=`${a?.name||'The agency'} has opened a four-week priority conversation on ${f.title} for ${opened.map(t=>t.name).join(' and ')}. You have access, not certainty: screen tests and individual contract terms still matter.`;
  }else if(key==='hardball'){
   people.forEach(t=>t.relationship=clamp((t.relationship||0)-2,-30,40));
   item.outcome=`${a?.name||'The agency'} refused to lock the package exclusively to your studio. The clients remain in the market and the relationship has cooled.`;
  }
 }else if(item.templateId==='talent-pitch'&&key==='meet'){
  const t=talentById(item.talentId),f=filmById(item.filmId);
  if(openAgencyWindow(t,f))item.outcome=`${talentAgency(t).name} has opened a priority conversation on ${f.title} through Week ${state.week+4}. ${t.name} is more receptive to a screen test or role offer while the window lasts; availability and terms still apply.`;
 }
 if(typeof recordPressInteraction==='function')recordPressInteraction(item,key);
 if(typeof updateCareerThreads==='function')updateCareerThreads();
 const after=deskImpactSnapshot(item);item.impact=deskImpactSummary(before,after);if(item.templateId!=='rights-offer')addNews(state,`${state.studio.name} responded to ${item.headline.toLowerCase()}. ${item.outcome}`,'Studio Desk');save();render();
}
function markDeskRead(id){const item=deskItemById(id,ensureDesk());if(item){item.read=true;item.expanded=false;const n=state.notifications?.find(n=>n.id===item.notificationId||String(n.deskId)===String(item.id));if(n)n.read=true;save();render()}}
function markAllDeskRead(){const d=ensureDesk();d.items.forEach(x=>{x.read=true;x.expanded=false});(state.notifications||[]).forEach(n=>n.read=true);state.activeNotificationId=null;save();render()}
function archiveReadDeskItems(){const d=ensureDesk(),keep=[],move=[];d.items.forEach(x=>{if(x.read&&x.resolved)move.push(x);else keep.push(x)});d.items=keep;move.forEach(x=>{x.archived=true;d.archive.unshift(x)});d.archive=d.archive.slice(0,120);save();render()}
function toggleDeskItem(id){const item=deskItemById(id,ensureDesk());if(item){item.read=true;item.expanded=!item.expanded;save();render()}}
function archiveDeskItem(id){const d=ensureDesk(),key=String(id),i=d.items.findIndex(x=>String(x.id)===key);if(i<0)return;const [item]=d.items.splice(i,1);item.archived=true;d.archive.unshift(item);save();render()}
function openDeskItemTarget(id){
 const item=deskItemById(id,ensureDesk());if(!item)return;item.read=true;item.expanded=false;
 const t=item.destination||inferNotificationDestination(item.notificationKey||'',item.filmId,item.type,null);
 state.screen=t?.screen||'studio';state.detail=t?.detail||null;if(t?.studioTab)state.uiStudioTab=t.studioTab;if(t?.studioTab==='desk')state.uiDeskTab='briefing';if(t?.legacyTab)state.uiLegacyTab=t.legacyTab;requestScrollTop();save();render();
}
function socialSentimentLabel(v){return v>=75?'Enthusiastic':v>=62?'Positive':v>=48?'Mixed-positive':v>=38?'Divided':'Negative'}
function socialVolumeLabel(v){return v>=82?'Exploding':v>=66?'Very high':v>=50?'High':v>=32?'Moderate':'Low'}
function studioPulseRows(){
 return activePlayerFilms().filter(f=>['production','post','marketing','scheduled','cinema'].includes(f.stage)).slice(0,5).map(f=>{const p=ensureFilmSocial(f);return {f,p,score:p.volume,sentiment:socialSentimentLabel(p.sentiment),volume:socialVolumeLabel(p.volume),trend:p.delta>3?`▲ ${p.delta}`:p.delta<-3?`▼ ${Math.abs(p.delta)}`:'—'}});
}
function studioDeskSnapshot(){
 const d=ensureDesk(),open=d.items.filter(x=>!x.resolved&&x.requiresAction),urgent=open.filter(x=>x.urgency==='urgent'||deskIsHardLifecycle(x)),signals=d.items.filter(x=>!x.read&&!open.includes(x)&&deskSignalScore(x)>=62),briefUnread=d.items.filter(x=>!x.read&&!open.includes(x)&&deskSignalScore(x)<62),focus=[...open,...signals].sort((a,b)=>deskSignalScore(b)-deskSignalScore(a)||(b.week||0)-(a.week||0)),latest=focus[0]||d.items[0];
 const headline=urgent.length?`${urgent.length} urgent ${urgent.length===1?'item':'items'}`:open.length?`${open.length} ${open.length===1?'response':'responses'} waiting`:signals.length?`${signals.length} noteworthy ${signals.length===1?'signal':'signals'}`:briefUnread.length?`${briefUnread.length} background ${briefUnread.length===1?'brief':'briefs'}`:'Desk clear';
 return `<div class="section-title"><h2>Studio Desk</h2><button class="btn ghost" data-studio-tab="desk">Open Desk${open.length?` · ${open.length}`:''}</button></div><div class="card desk-snapshot ${urgent.length?'attention':''}"><span class="desk-dot ${urgent.length?'urgent':''}"></span><div><strong>${headline}</strong><div class="small">${latest?latest.headline:'Press, agencies and The Lot will surface here as the career develops.'}</div></div><button class="btn" data-studio-tab="desk">Review</button></div>`;
}
function deskItemHTML(x){
 const choices=x.choices||[],expanded=x.requiresAction?(!x.read||x.expanded):!!x.expanded,status=!x.requiresAction?'For awareness':x.resolved?(x.expired?'Expired':'Resolved'):'Response needed',weeks=x.expiresWeek?x.expiresWeek-state.week:null,deadline=!x.resolved&&x.expiresWeek?`<span class="small ${weeks<=1?'badtext':''}">Closes after W${x.expiresWeek}${weeks>=0?` · ${weeks===0?'last chance':weeks+'w left'}`:''}</span>`:'',band=deskSignalBand(x);
 return `<div class="card desk-item desk-signal-${band} ${x.urgency==='urgent'?'urgent':x.requiresAction?'action':'info'} ${x.read?'desk-read':''}"><div class="desk-meta"><span class="desk-source">${x.source}</span><span class="pill ${band==='urgent'?'bad':band==='action'?'warn':band==='major'?'blue':''}">${status}</span><span class="small">${x.day&&typeof calendarShortDate==='function'?calendarShortDate(x.day):'W'+x.week}</span>${deadline}</div><div class="desk-headline">${x.headline}</div>${expanded?`<div class="body" style="margin-top:7px">${x.body}</div>${x.type==='gossip'?`<div class="small" style="margin-top:8px">Rumour status: unverified. Lot gossip can be accurate, distorted or wrong.</div>`:''}${!x.resolved&&choices.length?`<div class="desk-choice-grid">${choices.map(c=>`<button class="btn ${x.urgency==='urgent'?'primary':''}" data-desk-choice="${c[0]}" data-desk-id="${x.id}">${c[1]}</button>`).join('')}</div>`:''}${x.outcome?`<div class="desk-outcome"><strong>Outcome</strong><div class="small" style="margin-top:4px">${x.outcome}</div>${x.impact?.length?`<div class="desk-impact">${x.impact.map(v=>`<span>${v}</span>`).join('')}</div>`:''}</div>`:''}`:`<div class="small desk-collapsed-note">${x.read?'Read · ':''}${x.requiresAction&&!x.resolved?'decision still waiting · ':''}details collapsed</div>`}<div class="desk-actions">${!x.read?`<button class="btn ghost" data-desk-read="${x.id}">Mark read</button>`:''}${x.destination&&x.system?`<button class="btn ${x.requiresAction&&!x.resolved?'primary':'ghost'}" data-desk-open="${x.id}">${x.requiresAction&&!x.resolved?'Open action':'Open'}</button>`:''}<button class="btn ghost" data-desk-toggle="${x.id}">${expanded?'Collapse':x.requiresAction&&!x.resolved?'View details':'View'}</button>${x.resolved?`<button class="btn ghost" data-desk-archive="${x.id}">Archive</button>`:''}</div></div>`;
}
function pulseMetricRead(kind,value){
 const bands={
  volume:value>=80?['Viral','hot']:value>=62?['Moving','warm']:value>=42?['Building','cool']:['Quiet','muted'],
  sentiment:value>=72?['Loved','good']:value>=58?['Positive','good']:value>=43?['Mixed','warm']:['Negative','bad'],
  fandom:value>=72?['Devoted','hot']:value>=55?['Invested','cool']:value>=38?['Growing','cool']:['Casual','muted'],
  controversy:value>=60?['Volatile','bad']:value>=38?['Polarised','warm']:value>=20?['Bubbling','cool']:['Low','good']
 };
 return bands[kind]||['Developing','muted'];
}
function pulseSummaryLine(p){
 const read=pulseInterpretation(p),sent=pulseMetricRead('sentiment',p.sentiment)[0],fans=pulseMetricRead('fandom',p.fandom)[0].toLowerCase();
 if(read.label==='Viral backlash')return `Conversation is surging, but the tone has turned negative and is escaping the core audience.`;
 if(read.label==='Hot & loved')return `The film is travelling quickly with unusually positive audience energy.`;
 if(read.label==='Hot & polarised')return `Attention is high and the audience is splitting into clearly opposed camps.`;
 if(read.label==='Cult intensity')return `The audience is smaller, but the people who care are unusually invested.`;
 return `${sent} sentiment with a ${fans} core audience. Conversation is ${p.volume>=62?'moving beyond paid media':p.volume>=42?'starting to build organically':'still relatively quiet'}.`;
}
function compactLikes(n){
 n=Math.max(0,Math.round(Number(n)||0));
 if(n>=1000000)return `${(n/1000000).toFixed(n>=10000000?0:1)}M`;
 if(n>=1000)return `${(n/1000).toFixed(n>=100000?0:1)}K`;
 return String(n);
}
function pulseFilmHTML(x){
 const p=x.p,feed=(p.feed||[]).slice(0,1),read=pulseInterpretation(p),sent=pulseMetricRead('sentiment',p.sentiment),tone=read.cls==='bad'?'bad':read.cls==='warn'?'warn':read.cls==='good'?'good':'cool';
 return `<button class="pulse-social-card pulse-tone-${tone}" data-pulse-film="${x.f.id}"><div class="pulse-card-top"><span class="pulse-brand">PULSE</span><span class="pulse-stage">${fmtStage(x.f.stage)}</span></div><div class="pulse-card-title">${x.f.title}</div><div class="pulse-card-main"><div class="pulse-card-number"><strong>${p.volume}</strong><span>conversation</span><em>${x.trend}</em></div><span class="pulse-status pulse-status-${tone}">${read.label}</span></div><div class="pulse-like-strip"><strong>♥ ${compactLikes(p.likes)}</strong><span>${p.likesThisWeek?`+${compactLikes(p.likesThisWeek)} this week`:'audience likes'}</span></div><div class="pulse-social-summary">${pulseSummaryLine(p)}</div>${feed.length?`<div class="pulse-chatter-preview"><span>◉</span><p>${feed[0].text}</p></div>`:''}<div class="pulse-card-foot"><span>${sent[0]} sentiment</span><b>Open Pulse →</b></div></button>`;
}
function pulseMetricCard(label,value,kind,copy){
 const read=pulseMetricRead(kind,value),tone=read[1];
 return `<div class="pulse-detail-metric pulse-metric-${kind}"><div class="pulse-detail-metric-head"><span>${label}</span><strong>${value}</strong></div><div class="pulse-detail-bar"><i style="width:${clamp(value,0,100)}%"></i></div><div class="pulse-detail-metric-foot"><b class="pulse-word-${tone}">${read[0]}</b><span>${copy}</span></div></div>`;
}
function pulseDetailScreen(id){
 const f=filmById(id);if(!f)return studioScreen();const p=ensureFilmSocial(f),read=pulseInterpretation(p),topics=p.topics||[],moves=(p.moves||[]).slice(0,10),feed=(p.feed||[]).slice(0,10),tone=read.cls==='bad'?'bad':read.cls==='warn'?'warn':read.cls==='good'?'good':'cool';
 return topbar('Pulse',`${f.title} · audience conversation`)+`<main class="screen pulse-detail-screen">${backHead(f.title,'Audience Pulse · live conversation around the film')}
 <section class="pulse-detail-hero pulse-tone-${tone}"><div class="pulse-card-top"><span class="pulse-brand">PULSE</span><span class="pulse-stage">${fmtStage(f.stage)}</span></div><div class="pulse-detail-hero-grid"><div><div class="pulse-detail-score"><strong>${p.volume}</strong><span>conversation</span></div><div class="pulse-detail-status">${read.label}</div></div><p>${pulseSummaryLine(p)}</p></div><div class="pulse-detail-likes"><strong>♥ ${compactLikes(p.likes)}</strong><span>cumulative likes${p.likesThisWeek?` · +${compactLikes(p.likesThisWeek)} this week`:''}</span></div></section>
 <div class="section-title"><h2>Signals</h2><span class="small">Likes are cumulative affection; the four scores describe the shape of the conversation</span></div><div class="pulse-detail-grid">${pulseMetricCard('Conversation',p.volume,'volume','How much people are talking')}${pulseMetricCard('Sentiment',p.sentiment,'sentiment','How positive the tone is')}${pulseMetricCard('Fan intensity',p.fandom,'fandom','How invested the core audience is')}${pulseMetricCard('Controversy',p.controversy,'controversy','How much conflict is driving attention')}</div>
 ${topics.length?`<div class="section-title"><h2>What is sticking</h2><span class="small">Topics the audience keeps returning to</span></div><div class="pulse-topic-cloud">${topics.map(t=>`<span>#${t}</span>`).join('')}</div>`:''}
 <div class="section-title"><h2>Why Pulse moved</h2><span class="small">Recent causes, newest first</span></div><div class="pulse-movement-list">${moves.length?moves.map(m=>`<div class="pulse-movement-row"><div><strong>${m.reason}</strong><span>${m.day&&typeof calendarDateLabel==='function'?calendarDateLabel(m.day):m.week?`Week ${m.week}`:'Recent movement'}</span></div><b>${m.changes.join(' · ')}</b></div>`).join(''):`<div class="card body">No meaningful movement has been recorded yet. Pulse will start building as campaign beats and audience reactions create something worth talking about.</div>`}</div>
 <div class="section-title"><h2>Live chatter</h2><span class="small">A flavour of the conversation, not a literal feed</span></div><div class="pulse-feed-list">${feed.length?feed.map(x=>`<div class="pulse-feed-post pulse-feed-${x.tone||'neutral'}"><div class="pulse-feed-avatar">◉</div><div><strong>${x.tone==='good'?'Positive signal':x.tone==='warn'?'Heated signal':'Audience signal'}</strong><p>${x.text}</p><span>${x.week?`Week ${x.week}`:'This week'}</span></div></div>`).join(''):`<div class="card body">No distinct audience chatter has surfaced yet.</div>`}</div>
 </main>${nav()}`;
}
function deskSubnav(){
 const tab=state.uiDeskTab||'briefing',d=ensureDesk(),open=d.items.filter(x=>!x.resolved&&x.requiresAction).length,threads=ensureCareerThreads().active.length,pulse=studioPulseRows().length,briefs=d.items.filter(x=>!x.read&&deskSignalScore(x)<62&&!(!x.resolved&&x.requiresAction)).length;
 return sectionTabs([['briefing',open?`Briefing · ${open}`:'Briefing'],['threads',threads?`Threads · ${threads}`:'Threads'],['pulse',pulse?`Pulse · ${pulse}`:'Pulse'],['digest',briefs?`Digest · ${briefs}`:'Digest']],tab,'data-desk-tab');
}
function deskBriefingBody(){
 const d=ensureDesk();expireDeskItems();syncOperationalDeskItems();
 const ranked=d.items.slice().sort((a,b)=>deskSignalScore(b)-deskSignalScore(a)||(b.week||0)-(a.week||0)),open=ranked.filter(x=>!x.resolved&&x.requiresAction),signals=ranked.filter(x=>!open.includes(x)&&deskSignalScore(x)>=62),unread=d.items.filter(x=>!x.read),archivable=d.items.filter(x=>x.read&&x.resolved).length,upcoming=studioUpcomingEvents(4,35),active=activePlayerFilms(),standing=playerStudioStanding(),growth=ensureStudioGrowth();
 return `<div class="studio-brand-hero desk-brand-hero"><div>${playerStudioLogoHTML('lg',true)}<div class="small" style="margin-top:10px">Studio command centre · ${studioIdentityPrimary().label}</div></div><div class="grid cols4 studio-brand-stats"><div><div class="kpi">#${standing.rank}</div><div class="small">Industry rank</div></div><div><div class="kpi">${Math.round(growth.recognition)}</div><div class="small">Recognition</div></div><div><div class="kpi">${active.length}</div><div class="small">Active projects</div></div><div><div class="kpi">${money(state.cash)}</div><div class="small">Cash</div></div></div></div>
 ${careerArcCard()}<div class="desk-hero desk-briefing-command"><div class="hero"><div class="badge">THE STUDIO DESK</div><div class="kpi" style="margin-top:5px">${open.length?`${open.length} response${open.length===1?'':'s'} waiting`:'Desk clear'}</div><div class="body" style="margin-top:8px">${open.length?'These are the decisions currently waiting on you. Background information will not block the calendar.':'No player response is currently required. You can move the calendar without clearing routine traffic.'}</div></div><div class="card desk-command-card"><div class="desk-command-grid"><div><span>Needs response</span><strong>${open.length}</strong></div><div><span>Noteworthy</span><strong>${signals.filter(x=>!x.read).length}</strong></div><div><span>Unread total</span><strong>${unread.length}</strong></div></div>${unread.length?`<button class="btn block" id="deskMarkAllRead" style="margin-top:10px">Mark all as read</button>`:''}${archivable?`<button class="btn ghost block" id="deskArchiveRead" style="margin-top:8px">Archive read items</button>`:''}</div></div>
 <div class="section-title"><h2>Up next</h2><span class="small">Major studio checkpoints · next five weeks</span></div>${deskUpcomingHTML(upcoming)}
 <div class="section-title"><h2>Needs a response</h2><span class="small">Urgent crises and lifecycle blockers interrupt Continue; optional calls wait here</span></div><div class="desk-stack">${open.length?open.map(deskItemHTML).join(''):`<div class="card goodline desk-empty"><strong>No response is waiting.</strong><div class="small" style="margin-top:5px">Keep building, releasing or advancing time.</div></div>`}</div>
 <div class="section-title desk-section"><h2>Signals worth knowing</h2><span class="small">Higher-consequence information only</span></div><div class="desk-stack">${signals.length?signals.slice(0,8).map(deskItemHTML).join(''):`<div class="card body">No major signal is competing for your attention right now.</div>`}</div>`;
}
function deskThreadsBody(){
 const box=ensureCareerThreads(),active=activeCareerThreads(6),recent=(box.history||[]).slice(0,12);
 return `<div class="desk-section-hero"><div><div class="badge">ACTIVE THREADS</div><div class="kpi">${active.length} live ${active.length===1?'story':'stories'}</div><div class="body">These are the relationships, rivalries, successes, failures and pressures that persist across weeks. They are the studio's current narrative, not one-off notifications.</div></div></div>
 <div class="section-title"><h2>In play</h2><span class="small">Highest-consequence threads first</span></div><div class="desk-thread-grid desk-thread-grid-full">${active.length?active.map(deskThreadHTML).join(''):`<div class="card body">No persistent thread has taken hold yet. Repeated rival clashes, trusted collaborators, financial pressure and major film outcomes can all become ongoing stories.</div>`}</div>
 <div class="section-title"><h2>Recently resolved</h2><span class="small">Stories that stopped driving the current industry narrative</span></div><div class="card">${recent.length?recent.map(t=>`<div class="listrow"><div><strong>${t.title}</strong><div class="small">${t.resolution||'The story moved on.'}</div></div><span class="small">W${t.resolvedWeek||t.lastUpdatedWeek||'—'}</span></div>`).join(''):`<div class="body">No thread has resolved yet.</div>`}</div>`;
}
function deskPulseBody(){
 const rows=studioPulseRows(),totalLikes=rows.reduce((n,x)=>n+(ensureFilmSocial(x.f).likes||0),0),hot=[...rows].sort((a,b)=>(b.p.volume||0)-(a.p.volume||0))[0];
 return `<div class="desk-section-hero pulse-desk-hero"><div><div class="pulse-brand">PULSE</div><div class="kpi">${rows.length?`${compactLikes(totalLikes)} combined likes`:'Audience signal waiting'}</div><div class="body">Pulse is the public-facing layer of the slate: conversation, sentiment, fan intensity, controversy and cumulative likes. Likes rise when attention is paired with genuine positive engagement; controversy can drive conversation without producing the same affection.</div></div>${hot?`<div class="card pulse-desk-hot"><span class="small">Hottest conversation</span><strong>${hot.f.title}</strong><span>${hot.p.volume} conversation · ♥ ${compactLikes(hot.p.likes)}</span></div>`:''}</div>
 <div class="section-title"><h2>Film Pulse</h2><span class="small">Tap any film for movement history and live chatter</span></div><div class="pulse-board pulse-board-full">${rows.length?rows.map(pulseFilmHTML).join(''):`<div class="card pulse-empty"><span class="pulse-brand">PULSE</span><div class="body" style="margin-top:8px">Audience conversation starts once a film reaches production and becomes more meaningful as campaign material and real audiences arrive.</div></div>`}</div>`;
}
function deskDigestBody(){
 const d=ensureDesk(),ranked=d.items.slice().sort((a,b)=>(b.week||0)-(a.week||0)),open=ranked.filter(x=>!x.resolved&&x.requiresAction),background=ranked.filter(x=>!open.includes(x)&&deskSignalScore(x)<62),unread=background.filter(x=>!x.read),archivable=d.items.filter(x=>x.read&&x.resolved).length;
 return `<div class="desk-section-hero"><div><div class="badge">INDUSTRY DIGEST</div><div class="kpi">${unread.length} unread background ${unread.length===1?'brief':'briefs'}</div><div class="body">Routine trade chatter, gossip and low-consequence context live here. Useful when you want texture; safe to ignore when you want to keep making films.</div></div></div>
 <div class="desk-digest-actions">${unread.length?`<button class="btn" id="deskMarkAllRead2">Mark all read</button>`:''}${archivable?`<button class="btn ghost" id="deskArchiveRead2">Archive read</button>`:''}</div>${deskDigestHTML(background)}`;
}
function studioDeskBody(){
 const tab=state.uiDeskTab||'briefing';
 const body=tab==='threads'?deskThreadsBody():tab==='pulse'?deskPulseBody():tab==='digest'?deskDigestBody():deskBriefingBody();
 return `${deskSubnav()}${body}`;
}
function legendCardHTML(entry){
 const unlocked=legendUnlocked(entry.id),t=unlocked?talentById(entry.id):null,p=legendRequirementProgress(entry),tier=legendTier(entry);
 return `<div class="card legend-card ${unlocked?'unlocked':'locked'} legend-tier-${tier.key}">${unlocked?`<div class="legend-head">${portraitHTML(t,'sm')}<div><div class="legend-status">UNLOCKED · ${entry.type}</div><strong>${entry.seed[0]}</strong><div class="small">${entry.seed[7]}</div></div></div><div style="margin-top:9px"><span class="pill legend-badge">LEGEND</span><span class="pill tier-${tier.key}">${tier.label}</span><span class="pill">Prime archive age ${entry.seed[8]}</span>${t?.retired?'<span class="pill bad">Retired in this universe</span>':busy(t)?`<span class="pill warn">Busy to W${t.busyUntil}</span>`:'<span class="pill good">Live on The Lot</span>'}</div><button class="btn block" style="margin-top:10px" data-talent="${entry.id}">Open career profile</button>`:`<div class="legend-head"><div class="legend-silhouette">✦</div><div><div class="legend-status">LOCKED · ${entry.type}</div><strong>${entry.seed[0]}</strong><div class="small">${entry.seed[7]}</div></div></div><div style="margin-top:9px"><span class="pill tier-${tier.key}">${tier.label}</span><span class="small" style="margin-left:6px">${tier.desc}</span></div><div class="legend-clue"><div class="small"><strong>Archive clue:</strong> ${entry.clue}</div><div class="legend-progress">${p.text}</div><div class="milestone-progress"><span style="width:${p.pct}%"></span></div></div>`}</div>`;
}
function studioLegendsBody(){
 const a=ensureLegendsArchive(),unlocked=LEGEND_ARCHIVE.filter(x=>a.unlocked[x.id]),tiers=['accessible','challenging','storied','mythic'];
 return `<div class="legends-hero"><div class="hero"><div class="badge">THE LEGENDS ARCHIVE</div><div class="kpi" style="margin-top:6px">Cinema history becomes playable</div><div class="body" style="margin-top:8px">Legends are part of the studio's wider Legacy rather than a separate progression track. Unlock difficulty is now explicit: Accessible stories can emerge in a strong career; Mythic stories are deliberately rare, era-defining achievements.</div><div class="small" style="margin-top:9px">Archive ages are representative prime casting ages. Once unlocked, Legends age normally from that point onward in this Project Slate universe.</div></div><div class="legends-count"><strong>${unlocked.length}/${LEGEND_ARCHIVE.length}</strong><span>Legends unlocked</span><div class="small" style="margin-top:8px">${LEGEND_ARCHIVE.filter(x=>x.type==='Actor'&&a.unlocked[x.id]).length}/15 actors · ${LEGEND_ARCHIVE.filter(x=>x.type==='Director'&&a.unlocked[x.id]).length}/5 directors</div></div></div>
 ${tiers.map(key=>{const meta=LEGEND_TIER_META[key],rows=LEGEND_ARCHIVE.filter(x=>legendTier(x).key===key).sort(legendTierSort),n=rows.filter(x=>a.unlocked[x.id]).length;return `<div class="section-title"><h2>${meta.label}</h2><span class="small">${n}/${rows.length} unlocked · ${meta.desc}</span></div><div class="legend-grid">${rows.map(legendCardHTML).join('')}</div>`}).join('')}`;
}

function legendUnlockScreen(){
 const entry=legendEntryById(state.activeLegendUnlockId);if(!entry)return studioScreen();const t=talentById(entry.id),p=legendRequirementProgress(entry),primary=entry.type==='Actor'?[['Craft',Math.round(t?.acting||0)],['Star Power',Math.round(t?.star||0)],['Archive age',entry.seed[8]]]:[['Craft',Math.round(t?.craft||0)],['Commercial',Math.round(t?.commercial||0)],['Archive age',entry.seed[8]]];
 return `<div class="legend-unlock"><div class="legend-unlock-inner"><div class="legend-unlock-mark">✦</div><div class="badge">A LEGEND ENTERS THE LOT</div><h1>The archive opens</h1><div class="legend-unlock-name">${entry.seed[0]}</div><div class="small">${entry.seed[7]}</div><p class="legend-unlock-copy">${entry.clue} Your studio has now completed that story. ${entry.seed[0]} is no longer confined to the Archive and has joined the live talent market in this Project Slate universe.</p><div class="legend-unlock-stats">${primary.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('')}</div><div class="card" style="text-align:left"><div class="badge">WHY IT UNLOCKED</div><div class="body" style="margin-top:6px">${p.text}</div><div class="small" style="margin-top:8px">From this point onward the Legend behaves like normal talent: availability, relationships, rival offers, career momentum and new Project Slate credits all apply.</div></div><button id="continueLegendUnlock" class="btn primary block" style="margin-top:14px">Welcome ${entry.seed[0]} to The Lot</button></div></div>`;
}

function studioLegacyAwardsHistoryBody(){
 const archive=state.awardsArchive||[],totals=playerAwardTotals(),seasons=archive.filter(c=>c.playerNoms||c.playerWins);
 return `<div class="legacy-hero"><div><div class="badge">AWARDS HISTORY</div><div class="legacy-score">${totals.wins}</div><div class="legacy-label">career wins</div><div class="body">Awards are one strand of the studio's history rather than a separate collection. Every annual result remains here alongside Milestones, the Legends Archive and Hall of Slate.</div></div><div class="legacy-count"><strong>${totals.noms}</strong><span>nominations</span><strong style="margin-top:10px">${seasons.length}</strong><span>recognised seasons</span></div></div>
 <div class="section-title"><h2>Awards Nights</h2><span class="small">Permanent career record</span></div><div class="grid">${seasons.length?seasons.map(c=>`<div class="card ${c.playerWins?'goodline':''}"><div class="row"><strong>Year ${c.season}</strong><span class="pill ${c.playerWins?'good':'blue'}">${c.playerWins||0} win${c.playerWins===1?'':'s'}</span></div><div class="small" style="margin-top:6px">${c.playerNoms||0} nominations · ${c.categories.filter(cat=>cat.nominees.some(n=>n.owner==='player')).map(cat=>cat.label).join(' · ')||'No player nominees'}</div></div>`).join(''):`<div class="card body">Your Awards Night history will accumulate here as the career develops.</div>`}</div>`;
}
function studioLegacyBody(){
 const tab=state.uiLegacyTab||'overview';
 const tabs=sectionTabs([['overview','Overview'],['history','History'],['milestones','Milestones'],['legends','Legends Archive'],['awards','Awards History']],tab,'data-legacy-tab');
 let body=tab==='history'&&typeof studioHistoryBody==='function'?studioHistoryBody():tab==='milestones'?studioMilestonesBody():tab==='legends'?studioLegendsBody():tab==='awards'?studioLegacyAwardsHistoryBody():studioLegacyOverviewBody();
 return `${tabs}${body}`;
}

function awardBuzzLabel(score){
 if(score>=88)return {label:'Frontrunner',cls:'good'};
 if(score>=80)return {label:'Strong contender',cls:'good'};
 if(score>=72)return {label:'In the mix',cls:'blue'};
 if(score>=65)return {label:'Long shot',cls:'warn'};
 return {label:'Outside the conversation',cls:''};
}
function awardsStudioBody(){
 const current=awardsCurrentSeason(),week=awardsSeasonWeek(),nom=current.nominations,player=current.films.filter(f=>f.owner==='player').sort((a,b)=>awardsEligibilityScore(b,'picture')-awardsEligibilityScore(a,'picture')),archive=state.awardsArchive||[],nominationWeek=(current.season-1)*52+50,ceremonyWeek=current.end;
 const playerNomRows=nom?nom.categories.flatMap(cat=>cat.nominees.filter(n=>n.owner==='player').map(n=>({...n,category:cat.label,categoryId:cat.id}))):[];
 return `<div class="awards-season-hero"><div><div class="badge">YEAR ${current.season} AWARDS SEASON</div><div class="kpi" style="margin-top:5px">${nom?'Nominations locked':week<50?'Race in progress':'Awaiting nominations'}</div><div class="body" style="margin-top:7px">Nominations are announced at career Week ${nominationWeek} (Year ${current.season}, Week 50). Awards Night closes the 52-week year at career Week ${ceremonyWeek} (Year ${current.season}, Week 52). Campaigning can improve a film’s position, but it cannot manufacture a weak contender.</div></div><div class="awards-calendar"><div><strong>W${nominationWeek}</strong><span>Nominations · Y${current.season}W50</span></div><div><strong>W${ceremonyWeek}</strong><span>Awards Night · Y${current.season}W52</span></div></div></div>
 ${nom?`<div class="section-title"><h2>Your nominations</h2><span class="small">${playerNomRows.length} nomination${playerNomRows.length===1?'':'s'}</span></div>${playerNomRows.length?`<div class="grid cols2">${playerNomRows.map(n=>`<div class="card click goodline" data-film="${n.filmId}"><div class="badge">${n.category}</div><strong style="display:block;margin-top:5px">${n.subject}</strong><div class="small" style="margin-top:5px">${n.title}</div></div>`).join('')}</div>`:`<div class="card body">The studio did not make the final field this year. The ceremony still goes ahead — the industry has a life beyond your slate.</div>`}`:''}
 <div class="section-title"><h2>${nom?'Your contenders':'Your awards race'}</h2><span class="small">${player.length?`${player.length} eligible release${player.length===1?'':'s'}`:'No completed releases in this awards year'}</span></div>
 ${player.length?`<div class="grid cols2">${player.map(f=>{const a=ensureAfterlifeState(f),pic=awardBuzzLabel(awardsCompetitiveScore(f,'picture')),dir=awardBuzzLabel(awardsCompetitiveScore(f,'director')),perf=awardBuzzLabel(Math.max(awardsCompetitiveScore(f,'lead'),awardsCompetitiveScore(f,'support'))),scr=awardBuzzLabel(awardsCompetitiveScore(f,'screenplay')),music=awardBuzzLabel(awardsCompetitiveScore(f,'soundtrack')),noms=(a.nominations||[]).filter(x=>x.season===current.season).length;return `<div class="card click ${noms?'goodline':''}" data-film="${f.id}"><div class="row"><div><strong>${f.title}</strong><div class="small">${f.genre} · Critics ${f.review?.critics||'—'}% · Audience ${f.review?.audience||'—'}%</div></div>${noms?`<span class="pill good">${noms} nom${noms===1?'':'s'}</span>`:a.awardsPush?`<span class="pill blue">${a.awardsPushLevel===2?'Full campaign':'Campaigning'}</span>`:''}</div><div class="award-buzz-grid"><span>Picture <b class="${pic.cls==='good'?'goodtext':''}">${pic.label}</b></span><span>Director <b>${dir.label}</b></span><span>Performance <b>${perf.label}</b></span><span>Screenplay <b>${scr.label}</b></span><span>Soundtrack <b>${music.label}</b></span></div></div>`}).join('')}</div>`:`<div class="card body">Awards tracking begins once one of your films completes its theatrical run during the current 52-week year.</div>`}
 ${awardsRaceBoardHTML(current)}\n  <div class="section-title"><h2>Awards history</h2><span class="small">${playerAwardTotals().wins} wins · ${playerAwardTotals().noms} nominations all-time</span></div><div class="grid awards-history-list">${archive.filter(c=>c.playerNoms||c.playerWins).slice(0,8).map(c=>`<div class="card awards-history-card"><div class="awards-history-head"><strong>Year ${c.season}</strong><span class="pill ${c.playerWins?'good':''}">${c.playerWins} win${c.playerWins===1?'':'s'}</span></div><div class="small awards-history-summary">${c.playerNoms} nominations · ${c.categories.filter(cat=>cat.nominees.some(n=>n.owner==='player')).map(cat=>cat.label).join(' · ')||'No player nominees'}</div></div>`).join('')||'<div class="card body">Your first Awards Night will become part of the permanent studio record.</div>'}</div>`;
}

function studioScreen(){
 rebuildDecisions();
 let tab=state.uiStudioTab||'desk';if(tab==='overview'){tab='desk';state.uiStudioTab='desk'}
 const tabItems=[['desk',deskActionCount()?`Desk · ${deskActionCount()}`:'Desk'],['awards','Awards'],['legacy','Legacy'],['finance','Finance']];if(typeof corporateVisible==='function'&&corporateVisible())tabItems.push(['corporate','Corporate']);tabItems.push(['library','Library'],['identity','Identity'],['growth','Growth']);if(simulationAuditAccess())tabItems.push(['audit','Audit']);
 const tabs=sectionTabs(tabItems,tab,'data-studio-tab');
 let body='';
 if(tab==='desk')body=studioDeskBody();
 else if(tab==='awards')body=awardsStudioBody();
 else if(tab==='legacy')body=studioLegacyBody();
 else if(tab==='finance'){
  const ob=studioOverheadBreakdown(),idle=currentIdleCarry(),runway=studioCashRunway();
  body=`<div class="grid cols4"><div class="card"><div class="badge">Cash</div><div class="kpi">${money(state.cash)}</div></div><div class="card"><div class="badge">Weekly overhead</div><div class="kpi">${moneyFine(ob.total)}</div></div><div class="card ${runway.weeks<3?'dangerline':runway.weeks<6?'attention':''}"><div class="badge">Operating runway</div><div class="kpi" style="font-size:18px">${runway.label}</div><div class="small">Net recurring burn ${moneyFine(runway.netBurn)}/week</div></div><div class="card"><div class="badge">Bridge debt</div><div class="kpi">${money(state.finance?.bridgeDebt||0)}</div></div></div>
  <div class="section-title"><h2>Weekly operating position</h2><span class="small">Before new film investment</span></div><div class="card"><div class="listrow"><span>Operating scale</span><strong>${ob.scale.label}</strong></div><div class="listrow"><span>Permanent corporate operation</span><strong>${moneyFine(ob.corporate)}</strong></div><div class="listrow"><span>Upgraded departments</span><strong>${moneyFine(ob.departments)}</strong></div><div class="listrow"><span>Active slate</span><strong>${moneyFine(ob.slate)}</strong></div><div class="listrow"><span>Current catalogue receipts</span><strong>+${moneyFine(idle.catalogue)}</strong></div><div class="listrow"><span>Idle carry</span><strong class="${idle.net>=0?'goodtext':'badtext'}">${idle.net>=0?'+':''}${moneyFine(idle.net)}/week</strong></div><div class="small" style="margin-top:8px">A successful studio carries a larger permanent organisation even between productions. Catalogue cash decays rather than funding the company indefinitely.</div></div>
  ${recoveryPlanPanel()}<div class="section-title"><h2>Treasury</h2></div><div class="card ${state.finance?.bridgeDebt>0?'dangerline':''}"><div class="body">${state.finance?.bridgeDebt>0?`Emergency finance remains outstanding. Keep enough cash for production, campaigns and weekly overhead before expanding the slate.`:`The studio has no bridge debt. Cash timing still matters because production and release expenditure peak at different stages.`}</div><button id="openFinance" class="btn block" style="margin-top:10px">Open detailed finance</button></div>`;
 }else if(tab==='corporate'&&typeof studioCorporateBody==='function')body=studioCorporateBody();
 else if(tab==='audit'&&simulationAuditAccess())body=simulationAuditBody();
 else if(tab==='library')body=studioLibraryBody();
 else if(tab==='identity')body=studioIdentityBody();
 else if(tab==='growth')body=studioGrowthUI();
 else {state.uiStudioTab='desk';body=studioDeskBody()}
 return topbar('Studio',`${state.studio.name} · Week ${state.week}`)+`<main class="screen">${tabs}${body}</main>${nav()}`;
}
function financeScreen(){
 ensureFinance();const q=state.finance.quote||0,b=studioOverheadBreakdown(),idle=currentIdleCarry();
 return topbar('Finance','Cash management and emergency funding')+`<main class="screen">${backHead('Studio Finance',`Cash ${money(state.cash)} · ${b.scale.label}`)}
 <div class="grid cols3"><div class="card"><div class="badge">Cash</div><div class="kpi">${money(state.cash)}</div></div><div class="card"><div class="badge">Bridge debt</div><div class="kpi">${money(state.finance.bridgeDebt)}</div></div><div class="card"><div class="badge">Interest accrued</div><div class="kpi">${money(state.finance.totalInterest)}</div></div></div>
 <div class="section-title"><h2>Operating cost base</h2><span class="small">Before new greenlights</span></div><div class="card"><div class="listrow"><span>${b.scale.label}</span><strong>${moneyFine(b.corporate)}/week</strong></div><div class="listrow"><span>Upgraded departments</span><strong>${moneyFine(b.departments)}/week</strong></div>  <div class="listrow"><span>Active slate</span><strong>${moneyFine(b.slate)}/week</strong></div><div class="listrow"><span>Capital assets</span><strong>${moneyFine(b.assets||0)}/week</strong></div><div class="listrow"><span>Catalogue receipts</span><strong>+${moneyFine(idle.catalogue)}/week</strong></div><div class="listrow"><span>Idle carry</span><strong class="${idle.net>=0?'goodtext':'badtext'}">${idle.net>=0?'+':''}${moneyFine(idle.net)}/week</strong></div></div>
   ${capitalAllocationPanel()}
  ${recoveryPlanPanel()}<div class="section-title"><h2>Emergency bridge finance</h2></div><div class="card dangerline"><div class="body">Bridge finance prevents a cash-flow mistake from ending the career, but it is intentionally expensive. Each draw adds a 14% financing premium and outstanding debt accrues ${(state.finance.weeklyInterest*100).toFixed(1)}% interest every week.</div>
 <div class="grid cols3" style="margin-top:12px">${[2.5,5,10].map(v=>`<button class="btn" data-finance-quote="${v}">Review ${money(v)} draw</button>`).join('')}</div>
 ${q?`<div class="card" style="margin-top:12px"><div class="body"><strong>Confirm borrowing?</strong><br>Receive ${money(q)} cash now. ${money(q*1.14)} enters bridge debt immediately. With no repayment, that draw alone becomes about <strong>${money(bridgeDebtProjection(q,4))}</strong> after 4 weeks and <strong>${money(bridgeDebtProjection(q,8))}</strong> after 8 weeks.<br><span class="small"><strong>Nearest possible recovery:</strong> ${bridgeRecoveryContext()} Projection assumes the current rate and no repayment; future film revenue is not guaranteed.</span></div><div class="grid cols2" style="margin-top:10px"><button class="btn" id="cancelFinanceQuote">Cancel</button><button class="btn primary" id="confirmFinanceQuote">Confirm ${money(q)} draw</button></div></div>`:''}</div>
 ${state.finance.bridgeDebt>0?`<div class="section-title"><h2>Repayment</h2></div><div class="card"><div class="body">Repay debt when cash allows. Paying it down reduces future weekly interest.</div><div class="grid cols3" style="margin-top:10px">${[1,5,10].map(v=>`<button class="btn" data-repay="${v}" ${state.cash<=0?'disabled':''}>Repay ${money(Math.min(v,state.finance.bridgeDebt))}</button>`).join('')}</div></div>`:''}
 </main>${nav()}`;
}
