from pathlib import Path

p=Path("index.html")
s=p.read_text(encoding="utf-8")

def one(old,new,label):
    global s
    n=s.count(old)
    if n!=1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    s=s.replace(old,new,1)

one("<title>Project Slate — Premium Presentation v4.0b.2</title>",
    "<title>Project Slate — Premium Presentation v4.0b.2.1</title>","title")
one("const VERSION='4.0b.2';","const VERSION='4.0b.2.1';","version")
one("v4.0b.2-capital-allocation","v4.0b.2.1-rough-cut-deadlock-hotfix","audit model label")

old_nav="""function push(screen,detail=null){const y=(typeof window!=='undefined'&&window.scrollY)||0;state.history.push({screen:state.screen,detail:deep(state.detail),scrollY:y});state.screen=screen;state.detail=detail;requestScrollTop();save();render()}
function back(){const p=state.history.pop();if(p){state.screen=p.screen;state.detail=p.detail;requestScrollRestore(p.scrollY||0);save();render()}}
function navTo(screen){state.history=[];state.detail=null;state.screen=screen;requestScrollTop();save();render()}"""
new_nav="""function push(screen,detail=null){const y=(typeof window!=='undefined'&&window.scrollY)||0;state.history.push({screen:state.screen,detail:deep(state.detail),scrollY:y});state.screen=screen;state.detail=detail;requestScrollTop();save();render()}
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
function navTo(screen){state.history=[];state.detail=null;state.screen=screen;requestScrollTop();save();render()}"""
one(old_nav,new_nav,"navigation recovery")

old_calendar="""if(blocker){const f=filmById(blocker.filmId);state.screen='slate';state.detail={type:'film',id:f.id};state.history=[];requestScrollTop();return true}"""
new_calendar="""if(blocker){routeToHardBlocker(blocker,true);return true}"""
one(old_calendar,new_calendar,"calendar blocker routing")

old_continue="""showToast(marketing?"Plan the film's campaign and release before continuing.":post?'Review the rough cut and choose an intervention or lock picture before continuing.':'Resolve the active production decision before continuing.');
   state.screen='slate';state.detail={type:'film',id:f.id};requestScrollTop();save();render();return;"""
new_continue="""showToast(marketing?"Plan the film's campaign and release before continuing.":post?'Review the rough cut and choose an intervention or lock picture before continuing.':'Resolve the active production decision before continuing.');
   routeToHardBlocker(blocker,true);save();render();return;"""
one(old_continue,new_continue,"continue blocker routing")

old_decision="""rebuildDecisions();const d=state.decisions.find(x=>['production','post','marketing','campaign'].includes(x.type));if(d){const f=filmById(d.filmId);state.screen='slate';state.detail={type:'film',id:f.id};state.history=[];requestScrollTop();return true}"""
new_decision="""rebuildDecisions();const d=state.decisions.find(x=>['production','post','marketing','campaign'].includes(x.type));if(d){routeToHardBlocker(d,true);return true}"""
one(old_decision,new_decision,"decision blocker routing")

insert_marker="function filmScreen(id){"
guarded=r'''function postRecoveryUI(f,err){
 const p=f.post||{},runtime=Number.isFinite(p.runtime)?p.runtime:'—';
 let weak='Cut diagnostics unavailable';
 try{const dims=roughDimensions(f),w=dims.at(-1);if(w)weak=w[0]+' · '+Math.round(w[1]);}catch(_){}
 try{console.error('Project Slate post renderer recovered',err)}catch(_){}
 const musicReady=!!f.soundtrack?.committed;
 return '<div class="card dangerline"><div class="badge">POST-PRODUCTION SAFE MODE</div><div class="body" style="margin-top:8px"><strong>The rough-cut screen hit a recoverable display error.</strong><br>Your career and film state are intact. Use the controls below to clear the checkpoint, or use Back / the main navigation normally.</div></div>'+
 '<div class="grid cols2" style="margin-top:12px"><div class="card"><div class="badge">Current runtime</div><div class="kpi">'+runtime+(runtime==='—'?'':' min')+'</div></div><div class="card"><div class="badge">Weakest current area</div><div class="body">'+weak+'</div></div></div>'+
 (!musicReady?'<button id="recoverPostMusic" class="btn block" style="margin-top:12px">Use original score for recovery</button>':'<div class="card goodline" style="margin-top:12px"><strong>Music plan committed</strong><div class="small">Picture lock is available below.</div></div>')+
 '<button id="lockPicture" class="btn primary block" style="margin-top:12px">Lock current cut and continue</button>';
}
function guardedPostUI(f){
 try{return postUI(f)}
 catch(err){return postRecoveryUI(f,err)}
}

'''
one(insert_marker,guarded+insert_marker,"guarded post UI")
one("else if(f.stage==='post')body=postUI(f);","else if(f.stage==='post')body=guardedPostUI(f);","film post guard")

old_lock="""const lockPicture=document.getElementById('lockPicture');if(lockPicture)lockPicture.onclick=()=>lockCut(filmById(currentFilmId));"""
new_lock="""const recoverPostMusic=document.getElementById('recoverPostMusic');if(recoverPostMusic)recoverPostMusic.onclick=()=>{const f=filmById(currentFilmId),p=ensurePostState(f);p.musicDraft={strategy:'original',trackId:null};commitSoundtrack(f)};
 const lockPicture=document.getElementById('lockPicture');if(lockPicture)lockPicture.onclick=()=>lockCut(filmById(currentFilmId));"""
one(old_lock,new_lock,"post recovery binding")

p.write_text(s,encoding="utf-8")
print("Patched Project Slate to v4.0b.2.1 — rough-cut navigation deadlock hotfix.")
