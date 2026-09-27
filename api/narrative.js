// Project Slate v4.5a — stateless Narrative Engine API
// Designed for a Vercel deployment. The API key lives only in server environment variables.

const MODEL=process.env.OPENAI_MODEL||'gpt-6-astra';
const OPENAI_URL='https://api.openai.com/v1/responses';
const ALLOWED_TYPES=new Set(['film_review']);
const MAX_BODY_CHARS=60000;

function allowedOrigin(origin){
  if(!origin)return true; // same-origin/server calls may omit Origin
  const configured=(process.env.NARRATIVE_ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
  if(configured.length)return configured.includes(origin);
  return /^https:\/\/4svpf5bphh-svg\.github\.io$/.test(origin)||/^https:\/\/[^/]+\.vercel\.app$/.test(origin)||/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}
function setCors(req,res){
  const origin=req.headers.origin;
  if(origin&&allowedOrigin(origin)){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin')}
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
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
    'Write as the supplied fictional Daily Screen critic. Match their voice tag without turning every paragraph into a gag.',
    'The review should feel like the critic watched this specific finished film. Use the premise, creative choices, strongest and weakest craft signals, performances and any supplied public production context.',
    'If a Lot story is supplied, treat it only as fictional Project Slate context and mention it only when editorially relevant to the finished film or campaign.',
    'The prose must agree with the supplied critic score tier. A high score can still contain specific criticism; a low score can still recognise isolated strengths.',
    'Return exactly four substantial review paragraphs. Do not mention numerical scores inside the prose; the UI displays those separately.',
    'headline should be concise and publication-like. pull_quote should be one memorable sentence taken verbatim from one of the four paragraphs.',
    'editorial_note should be a very short internal description of what facts most shaped the review; it is not shown as part of the article.'
  ].join('\n');
}

module.exports=async function handler(req,res){
  setCors(req,res);
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'method_not_allowed'});
  if(!allowedOrigin(req.headers.origin))return res.status(403).json({ok:false,error:'origin_not_allowed'});
  if(!process.env.OPENAI_API_KEY)return res.status(503).json({ok:false,error:'narrative_not_configured'});

  let body=req.body;
  if(typeof body==='string'){if(body.length>MAX_BODY_CHARS)return res.status(413).json({ok:false,error:'payload_too_large'});try{body=JSON.parse(body)}catch{return res.status(400).json({ok:false,error:'invalid_json'})}}
  const type=body?.type,packet=body?.packet;
  if(!ALLOWED_TYPES.has(type)||!packet)return res.status(400).json({ok:false,error:'unsupported_request'});
  const serialized=JSON.stringify(packet);
  if(serialized.length>MAX_BODY_CHARS)return res.status(413).json({ok:false,error:'payload_too_large'});

  try{
    const upstream=await fetch(OPENAI_URL,{
      method:'POST',
      headers:{'Authorization':'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:MODEL,
        instructions:narrativeInstructions(type),
        input:[{role:'user',content:'PROJECT SLATE SIMULATION PACKET\n'+serialized}],
        max_output_tokens:1600,
        text:{format:{type:'json_schema',name:'project_slate_film_review',strict:true,schema:reviewSchema()}}
      })
    });
    const data=await upstream.json();
    if(!upstream.ok)return res.status(upstream.status>=500?502:400).json({ok:false,error:'openai_error',detail:data?.error?.message||'Request failed'});
    const raw=outputText(data);if(!raw)return res.status(502).json({ok:false,error:'empty_model_response'});
    let narrative;try{narrative=JSON.parse(raw)}catch{return res.status(502).json({ok:false,error:'invalid_model_json'})}
    if(!Array.isArray(narrative.paragraphs)||narrative.paragraphs.length!==4)return res.status(502).json({ok:false,error:'invalid_review_shape'});
    return res.status(200).json({ok:true,narrative,meta:{model:MODEL,responseId:data.id||null}});
  }catch(err){
    return res.status(500).json({ok:false,error:'narrative_request_failed',detail:String(err?.message||err)});
  }
};
