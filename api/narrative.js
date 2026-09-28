// Project Slate v4.5a — stateless Narrative Engine API
// Designed for a Vercel deployment. The API key lives only in server environment variables.

const PROVIDER=(process.env.NARRATIVE_PROVIDER||'groq').toLowerCase();
const PROVIDERS={
  groq:{
    url:'https://api.groq.com/openai/v1/responses',
    key:()=>process.env.GROQ_API_KEY,
    model:()=>process.env.NARRATIVE_MODEL||process.env.GROQ_MODEL||'openai/gpt-oss-120b'
  },
  openai:{
    url:'https://api.openai.com/v1/responses',
    key:()=>process.env.OPENAI_API_KEY,
    model:()=>process.env.NARRATIVE_MODEL||process.env.OPENAI_MODEL||'gpt-5.6'
  }
};
const provider=PROVIDERS[PROVIDER]||PROVIDERS.groq;
const ALLOWED_TYPES=new Set(['film_review']);
const MAX_BODY_CHARS=60000;

function allowedOrigin(origin,host=''){
  if(!origin)return true; // same-origin/server calls may omit Origin
  const configured=(process.env.NARRATIVE_ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
  if(configured.length)return configured.includes(origin);
  const sameHttps=host&&origin==='https://'+host,sameHttp=host&&origin==='http://'+host;
  const projectSlatePages=origin==='https://4svpf5bphh-svg.github.io';
  return !!(sameHttps||sameHttp||projectSlatePages||/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));
}
function setCors(req,res){
  const origin=req.headers.origin,host=req.headers.host||'';
  if(origin&&allowedOrigin(origin,host)){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin')}
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
}
function outputText(data){
  if(typeof data?.output_text==='string')return data.output_text;
  for(const item of data?.output||[])for(const part of item?.content||[])if(part?.type==='output_text'&&typeof part.text==='string')return part.text;
  return '';
}
function reviewSchema(){
  return {
    type:'object',
    additionalProperties:false,
    properties:{
      headline:{type:'string'},
      pull_quote:{type:'string'},
      paragraphs:{type:'array',items:{type:'string'}},
      editorial_note:{type:'string'}
    },
    required:['headline','pull_quote','paragraphs','editorial_note']
  };
}
function narrativeInstructions(type){
  if(type!=='film_review')return '';
  return [
    'You are writing fictional entertainment journalism inside Project Slate, an alternate-reality Hollywood management game.',
    'Every named real-world performer or filmmaker is a fictionalized game counterpart. Never imply that supplied fictional conduct, relationships, disputes, scandals, health matters or career events happened in real life.',
    'The simulation is authoritative. Never change, second-guess or recalculate the supplied critic score, audience score, star rating, film metrics, production events, relationships, release facts or business outcomes.',
    'Do not invent new major events, crimes, allegations, injuries, substance use, sexual conduct, medical conditions, protected-trait claims, or real-world biographical facts.',
    'Write as the supplied fictional Daily Screen critic. Match their voice tag strongly. The review should be credible film criticism with a sharp entertainment-industry tongue, not polite generic copy.',
    'Project Slate Hollywood is knowingly absurd: stars are exaggerated fictional versions of themselves, executives are vain, awards campaigns are shameless, feuds become marketing assets, and everyone treats this circus with absurd seriousness. Let the critic notice that world without breaking the in-universe fiction.',
    'Aim for a satirical temperature of about 7/10: 1–3 genuinely sharp or funny lines per review, not a joke in every sentence. Punch at Hollywood vanity, prestige posturing, studio excess, campaign nonsense and supplied fictional behaviour rather than inventing misconduct.',
    'The review should feel like the critic watched this specific finished film. Use the premise, creative choices, strongest and weakest craft signals, performances and any supplied public production context. Prefer concrete, memorable observations over phrases like “undeniably the engine”, “technically the film shines”, “seasoned in the art of”, or “ultimately”.',
    'Never expose simulation/debug language. Do not mention internal metric numbers, point scores, hidden attributes, tracking fields, production-note warnings, schema labels, game-state terminology, or phrases such as “technical score”, “structure 61”, “chemistry risk”, “four-star badge”, “momentum”, or “the production notes say”. Convert those inputs into natural criticism instead.',
    'Do not reveal the numeric critic score, audience score, star rating, or internal craft metrics anywhere in the prose. The UI displays those separately.',
    'Internal creative-choice labels are not public copy. Never quote or paraphrase labels such as “protect the original engine”, “guided control”, “performance-first”, or any other decision/menu wording. Describe only the visible artistic consequence.',
    'Budget may be mentioned only as ordinary public-facing trade context when it is editorially useful; never describe it as an internal game variable.',
    'If a Lot story is supplied, treat it only as fictional Project Slate context. When relevant, the critic may weaponise it as a dry aside, callback or industry joke rather than merely summarising it. Refer to the event naturally in-world; never call it a “Lot story”, “lot-level feud”, “lot-level spat”, “system event”, or similar game terminology.',
    'Do not invent personality insults simply because a performer is famous. If ego, volatility or another trait is explicitly supplied, it may colour the fictional counterpart subtly; otherwise keep the bite focused on the performance, campaign, studio or documented Project Slate event.',
    'Do not invent character jobs, names, relationships, plot revelations, or role descriptions that are not explicitly present in the supplied logline, synopsis or other public film text. If character detail is absent, discuss the performer’s work without manufacturing a role.',
    'Avoid generic critic scaffolding such as “Ultimately,” “Technically,” “In the end,” or “The final takeaway?” unless the supplied critic voice genuinely demands it. Prefer a more distinctive closing turn.',
    'The prose must agree with the supplied critic score tier. A high score can still contain specific criticism; a low score can still recognise isolated strengths.',
    'Give each paragraph a job: opening verdict with personality; premise/performances; craft plus weaknesses; closing verdict with the strongest sting or memorable observation.',
    'Vary sentence length. Avoid four evenly balanced essay paragraphs that sound generated. One sentence may be brutally short if the critic voice earns it.',
    'Return exactly four substantial review paragraphs. Do not mention numerical scores inside the prose; the UI displays those separately.',
    'headline should be concise and publication-like. pull_quote should be one memorable sentence taken verbatim from one of the four paragraphs.',
    'editorial_note should be a very short internal description of what facts most shaped the review; it is not shown as part of the article.'
  ].join('\n');
}

module.exports=async function handler(req,res){
  setCors(req,res);
  if(req.method==='OPTIONS')return res.status(204).end();
  if(!allowedOrigin(req.headers.origin,req.headers.host||''))return res.status(403).json({ok:false,error:'origin_not_allowed'});
  const apiKey=provider.key(),model=provider.model();
  if(req.method==='GET')return res.status(200).json({ok:true,service:'project-slate-narrative',provider:PROVIDER,model,configured:!!apiKey});
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'method_not_allowed'});
  if(!apiKey)return res.status(503).json({ok:false,error:'narrative_not_configured',provider:PROVIDER});

  let body=req.body;
  if(typeof body==='string'){if(body.length>MAX_BODY_CHARS)return res.status(413).json({ok:false,error:'payload_too_large'});try{body=JSON.parse(body)}catch{return res.status(400).json({ok:false,error:'invalid_json'})}}
  const type=body?.type,packet=body?.packet;
  if(!ALLOWED_TYPES.has(type)||!packet)return res.status(400).json({ok:false,error:'unsupported_request'});
  const serialized=JSON.stringify(packet);
  if(serialized.length>MAX_BODY_CHARS)return res.status(413).json({ok:false,error:'payload_too_large'});

  try{
    const upstream=await fetch(provider.url,{
      method:'POST',
      headers:{'Authorization':'Bearer '+apiKey,'Content-Type':'application/json'},
      body:JSON.stringify({
        model,
        instructions:narrativeInstructions(type),
        input:[{role:'user',content:'PROJECT SLATE SIMULATION PACKET\n'+serialized}],
        max_output_tokens:1200,
        reasoning:{effort:'low'},
        temperature:.95,
        store:false,
        text:{format:{type:'json_schema',name:'project_slate_film_review',schema:reviewSchema()}}
      })
    });
    const data=await upstream.json();
    if(!upstream.ok){
      const retryAfter=upstream.headers.get('retry-after');
      if(retryAfter)res.setHeader('Retry-After',retryAfter);
      return res.status(upstream.status===429?429:upstream.status>=500?502:400).json({ok:false,error:PROVIDER+'_error',detail:data?.error?.message||'Request failed'});
    }
    const raw=outputText(data);if(!raw)return res.status(502).json({ok:false,error:'empty_model_response'});
    let narrative;try{narrative=JSON.parse(raw)}catch{return res.status(502).json({ok:false,error:'invalid_model_json'})}
    if(!Array.isArray(narrative.paragraphs)||narrative.paragraphs.length!==4)return res.status(502).json({ok:false,error:'invalid_review_shape'});
    return res.status(200).json({ok:true,narrative,meta:{provider:PROVIDER,model,responseId:data.id||null}});
  }catch(err){
    return res.status(500).json({ok:false,error:'narrative_request_failed',detail:String(err?.message||err)});
  }
};
