// Project Slate v4.6.3 — stateless Narrative Engine API
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
const ALLOWED_TYPES=new Set(['film_review','project_intelligence']);
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
  res.setHeader('Access-Control-Expose-Headers','Retry-After');
  res.setHeader('Cache-Control','no-store');
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
function projectIntelligenceSchema(){
  return {
    type:'object',
    additionalProperties:false,
    properties:{
      recognized:{type:'boolean'},
      confidence:{type:'string',enum:['high','medium','low']},
      relationship:{type:'string',enum:['original','sequel','continuation','remake','reboot','spinoff','adaptation','ambiguous']},
      property_name:{type:'string'},
      installment_number:{type:'integer',minimum:0,maximum:99},
      legacy_titles:{type:'array',items:{type:'string'},maxItems:6},
      legacy_talent:{type:'array',maxItems:6,items:{type:'object',additionalProperties:false,properties:{name:{type:'string'},association:{type:'string'}},required:['name','association']}},
      established_identity:{type:'array',items:{type:'string'},maxItems:6},
      context_summary:{type:'string'},
      recognition_basis:{type:'string'}
    },
    required:['recognized','confidence','relationship','property_name','installment_number','legacy_titles','legacy_talent','established_identity','context_summary','recognition_basis']
  };
}
function schemaForType(type){return type==='project_intelligence'?projectIntelligenceSchema():reviewSchema()}
function schemaNameForType(type){return type==='project_intelligence'?'project_slate_project_intelligence':'project_slate_film_review'}
function reviewQualityIssues(narrative,packet){
  const text=[narrative?.headline,narrative?.pull_quote,...(narrative?.paragraphs||[])].join(' ').toLowerCase();
  const issues=[];
  const banned=[
    ['internal metric language',/\b(?:technical|structure|chemistry|momentum)\s*(?:score|points?|\(\d)/i],
    ['internal creative-choice label',/protect the original engine|guided control|performance-first/i],
    ['game-world terminology',/lot-level|lot story|system event|production notes/i],
    ['generic AI closing scaffold',/\bultimately\b|\bin the end\b|the final takeaway/i],
    ['star-rating leakage',/four-star badge|\b\d(?:\.\d)?[- ]star badge/i]
  ];
  for(const [label,re] of banned)if(re.test(text))issues.push(label);
  const critics=Number(packet?.verdict?.critics||0),stars=Number(packet?.verdict?.stars||0);
  if(critics>=75||stars>=3.5){
    const severe=[/collapses under/i,/runs out of gas/i,/payoff that never arrives/i,/gone awry/i,/fails to cohere/i,/thin (?:story|premise)/i,/self-importance/i,/waste of/i];
    const hits=severe.filter(re=>re.test(text)).length;
    if(hits>=2)issues.push('overall tone is materially harsher than the strong simulated verdict');
  }else if(critics<50||stars<2.5){
    const rave=[/masterpiece/i,/triumph/i,/essential viewing/i,/one of the year.?s best/i,/near-perfect/i];
    if(rave.filter(re=>re.test(text)).length>=2)issues.push('overall tone is materially softer than the weak simulated verdict');
  }
  return issues;
}
function narrativeInstructions(type){
  if(type==='project_intelligence')return [
    'You are Project Intelligence inside Project Slate, an alternate-reality Hollywood management game.',
    'Your task is conservative recognition of whether a player-created screenplay is clearly intended to connect to a well-known pre-existing film, television, book, game, comic or other entertainment property.',
    'Use broad, well-established public cultural knowledge only. Do not browse, invent obscure continuity, or pretend uncertainty is certainty.',
    'If the title/logline/synopsis do not provide strong evidence of an existing property, set recognized=false, confidence=low, relationship=original, property_name="", installment_number=0, and keep legacy lists empty.',
    'A numbered title such as "Rush Hour 4" can be strong evidence when the underlying property is well known. A merely similar title is not enough.',
    'relationship describes the player concept: sequel, continuation, remake, reboot, spinoff, adaptation, ambiguous, or original.',
    'legacy_talent should contain only a small number of performers or filmmakers strongly and publicly associated with the recognised property. association must be factual and concise, such as "original lead" or "series co-lead".',
    'established_identity should describe broad audience-facing franchise DNA such as genre, central pairing, tone or signature premise. Do not expose hidden game metrics.',
    'Never make legal claims about ownership, licensing, copyright, trademark, permission or whether the player may commercially produce the property. Recognition is creative context, not rights clearance.',
    'Do not invent real-person conduct, opinions, relationships or private facts.',
    'context_summary should be one concise sentence suitable for an in-game executive card.',
    'recognition_basis should be a short factual explanation of what in the supplied title/logline/synopsis triggered the match; do not provide hidden chain-of-thought.'
  ].join('\n');
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
    'The prose must agree with the supplied critic score tier. Satire must never invert the verdict. At 75+ critics or roughly 3.5 stars and above, the review must read clearly positive overall even when the critic is cutting about specific flaws. At 50–74 it may be mixed. Below 50 it should read clearly negative overall. A high score can still contain specific criticism; a low score can still recognise isolated strengths.',
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
    let correction='',lastIssues=[];
    for(let attempt=0;attempt<2;attempt++){
      const prompt='PROJECT SLATE SIMULATION PACKET\n'+serialized+(correction?'\n\nQUALITY-CONTROL REWRITE REQUIRED\n'+correction:'');
      const upstream=await fetch(provider.url,{
        method:'POST',
        headers:{'Authorization':'Bearer '+apiKey,'Content-Type':'application/json'},
        body:JSON.stringify({
          model,
          instructions:narrativeInstructions(type),
          input:[{role:'user',content:prompt}],
          max_output_tokens:type==='project_intelligence'?700:1200,
          reasoning:{effort:'low'},
          temperature:type==='project_intelligence'?.2:.95,
          store:false,
          text:{format:{type:'json_schema',name:schemaNameForType(type),schema:schemaForType(type)}}
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
      if(type==='project_intelligence'){
        if(typeof narrative.recognized!=='boolean'||!Array.isArray(narrative.legacy_talent)||!Array.isArray(narrative.established_identity))return res.status(502).json({ok:false,error:'invalid_project_intelligence_shape'});
        return res.status(200).json({ok:true,narrative,meta:{provider:PROVIDER,model,responseId:data.id||null,qualityRetry:false}});
      }
      if(!Array.isArray(narrative.paragraphs)||narrative.paragraphs.length!==4)return res.status(502).json({ok:false,error:'invalid_review_shape'});
      const issues=reviewQualityIssues(narrative,packet);
      if(!issues.length)return res.status(200).json({ok:true,narrative,meta:{provider:PROVIDER,model,responseId:data.id||null,qualityRetry:attempt>0}});
      lastIssues=issues;
      correction='The previous draft failed quality control for: '+issues.join('; ')+'. Rewrite the entire review. Keep the same simulation verdict and factual packet, preserve the sharp Project Slate voice, remove all listed problems, and do not mention this quality-control instruction.';
    }
    return res.status(502).json({ok:false,error:'review_quality_failed',detail:lastIssues.join('; ')});
  }catch(err){
    return res.status(500).json({ok:false,error:'narrative_request_failed',detail:String(err?.message||err)});
  }
};
