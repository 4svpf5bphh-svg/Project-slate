// Project Slate v4.10 — stateless Narrative Engine API
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
const ALLOWED_TYPES=new Set(['film_review','project_intelligence','trade_story','lot_press_bundle']);
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
function tradeStorySchema(){
  return {
    type:'object',
    additionalProperties:false,
    properties:{
      headline:{type:'string'},
      deck:{type:'string'},
      paragraphs:{type:'array',items:{type:'string'},minItems:2,maxItems:4},
      editorial_note:{type:'string'}
    },
    required:['headline','deck','paragraphs','editorial_note']
  };
}
function lotPressBundleSchema(){
  return {
    type:'object',
    additionalProperties:false,
    properties:{
      trade:{
        type:'object',additionalProperties:false,
        properties:{
          headline:{type:'string'},
          deck:{type:'string'},
          paragraphs:{type:'array',items:{type:'string'},minItems:2,maxItems:4}
        },
        required:['headline','deck','paragraphs']
      },
      gossip_headline:{type:'string'},
      agency_statement:{type:'string'},
      rival_quote:{type:'string'},
      pulse_reactions:{type:'array',items:{type:'string'},minItems:2,maxItems:3},
      editorial_note:{type:'string'}
    },
    required:['trade','gossip_headline','agency_statement','rival_quote','pulse_reactions','editorial_note']
  };
}
function schemaForType(type){return type==='project_intelligence'?projectIntelligenceSchema():type==='trade_story'?tradeStorySchema():type==='lot_press_bundle'?lotPressBundleSchema():reviewSchema()}
function schemaNameForType(type){return type==='project_intelligence'?'project_slate_project_intelligence':type==='trade_story'?'project_slate_trade_story':type==='lot_press_bundle'?'project_slate_lot_press_bundle':'project_slate_film_review'}
function tradeStoryQualityIssues(narrative){
  const text=[narrative?.headline,narrative?.deck,...(narrative?.paragraphs||[])].join(' ').toLowerCase(),issues=[];
  const banned=[
    ['game language',/\bplayer\b|\bsimulation\b|\bgame state\b|\bhidden metric\b/i],
    ['internal Lot language',/\blot story\b|\blot-level\b|\bsystem event\b/i],
    ['internal personality badge',/meticulous professional|large ego|combustible|fiercely loyal|ultra-competitive|gloriously eccentric|born for the camera|never forgets a slight|chaos merchant/i],
    ['invented sourcing or trend authority',/industry observers|confirmed that|sources (?:say|said)|studios are increasingly|has been trialed|have been trialed|industry-wide trend/i],
    ['generic AI scaffold',/\bultimately\b|\bin conclusion\b|the final takeaway/i]
  ];
  for(const [label,re] of banned)if(re.test(text))issues.push(label);
  return issues;
}
function lotPressBundleQualityIssues(narrative){
  const text=[
    narrative?.trade?.headline,narrative?.trade?.deck,...(narrative?.trade?.paragraphs||[]),
    narrative?.gossip_headline,narrative?.agency_statement,narrative?.rival_quote,...(narrative?.pulse_reactions||[])
  ].join(' ').toLowerCase(),issues=[];
  const banned=[
    ['game language',/\bplayer\b|\bsimulation\b|\bgame state\b|\bhidden metric\b|\bprompt\b|\bpacket\b/i],
    ['internal Lot language',/\blot story\b|\blot-level\b|\bsystem event\b|\bincident id\b|\brelationship score\b/i],
    ['internal personality badge',/meticulous professional|large ego|combustible|fiercely loyal|ultra-competitive|gloriously eccentric|born for the camera|never forgets a slight|chaos merchant/i],
    ['invented sourcing or trend authority',/industry observers|according to (?:a|the) (?:production|crew|source)|confirmed that|sources (?:say|said)|studios are increasingly|has been trialed|have been trialed|across other productions|industry-wide trend/i],
    ['model language',/\bai-generated\b|\blanguage model\b|\bmodel response\b/i],
    ['generic AI scaffold',/\bultimately\b|\bin conclusion\b|the final takeaway/i]
  ];
  for(const [label,re] of banned)if(re.test(text))issues.push(label);
  return issues;
}
function reviewQualityIssues(narrative,packet){
  const text=[narrative?.headline,narrative?.pull_quote,...(narrative?.paragraphs||[])].join(' ').toLowerCase();
  const issues=[];
  const banned=[
    ['internal metric language',/\b(?:technical|structure|chemistry|momentum)\s*(?:score|points?|\(\d)/i],
    ['internal creative-choice label',/protect the original engine|guided control|performance-first|follow the comic behaviour|creative direction\s*[—:-]|studio chose|player chose|choice became part of the film|protect the shape originally greenlit/i],
    ['game-world terminology',/lot-level|lot story|system event|production notes/i],
    ['internal personality badge',/meticulous professional|large ego|combustible|fiercely loyal|ultra-competitive|gloriously eccentric|born for the camera|never forgets a slight|chaos merchant/i],
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
  if(type==='lot_press_bundle')return [
    'You are the connected entertainment-media ecosystem inside Project Slate, an alternate-reality Hollywood management game.',
    'One deterministic public event has already happened. The supplied event, relationship history, attached production context and response directives are authoritative facts.',
    'Create five different media reactions to that same event in one bundle: a credible trade article, a shameless but fact-bound gossip headline, a short representative statement, one anonymous rival-executive quote, and 2 to 3 Pulse social reactions.',
    'Do not create another event. Do not invent a new feud, deal, firing, injury, crime, affair, medical issue, private conversation, salary, motive, legal claim, production shutdown, casting change or outcome.',
    'Every named real-world performer or filmmaker is a fictionalized Project Slate counterpart. Never turn supplied fictional events into claims about the real person outside this alternate world.',
    'The trade article should be sharp entertainment-industry journalism: explain why the supplied event matters to the film, talent market or public narrative when those facts are present.',
    'The gossip headline may be louder and more shameless than the trade article, but it must exaggerate tone rather than facts.',
    'The representative statement is itself a simulation-owned public response. Follow response_directive.agency_stance and do not add factual claims beyond the supplied event.',
    'The rival quote is a simulation-owned anonymous comment. Follow response_directive.rival_tone, keep it witty and competitive, and do not reveal or invent a named source.',
    'Internal personality traits and badge labels are private simulation machinery. Never name, quote, paraphrase or expose labels such as “Meticulous professional”, “Never forgets a slight”, “Large ego”, “Combustible”, “Fiercely loyal”, “Ultra-competitive”, “Born for the camera” or similar trait summaries.',
    'Do not invent corroboration. No named production manager, crew member, publicist, representative, source or observer may appear unless that person is explicitly supplied in the packet.',
    'Do not invent wider industry facts to make the article sound researched. Avoid unsupported claims about trends, mental-wellness practices, other productions, trials, statistics, historical precedent or what studios are increasingly doing unless the packet explicitly supplies them.',
    'Outside the explicitly requested agency_statement and rival_quote fields, do not fabricate direct quotations or attributed confirmations.',
    'Pulse reactions should sound like different members of the public noticing Hollywood as performance. They may be amused, sceptical, delighted or critical according to response_directive.pulse_tones, and they may be wrong in interpretation, but must not invent concrete new events.',
    'Use prior_press and story_history as memory. If this is a continuation, resurfacing or escalation, write it as a new chapter rather than pretending the relationship is newly discovered.',
    'Aim for high show-business satire without breaking the fourth wall. People in this world know publicity is theatre; they do not know they are in a game.',
    'Never expose game or system terminology such as player, simulation, hidden metric, system event, Lot story, incident ID, relationship score, AI, prompt, packet or internal state.',
    'Return 2 to 4 substantial trade paragraphs. Keep the representative statement and rival quote concise.',
    'editorial_note is internal only: briefly state the factual angle and continuity you preserved.'
  ].join('\n');
  if(type==='trade_story')return [
    'You are a trade journalist inside Project Slate, an alternate-reality Hollywood management game.',
    'Rewrite only the supplied factual event into a sharp, credible entertainment-industry trade article. The simulation packet is authoritative.',
    'Do not invent a new deal, quote, salary, budget, feud, allegation, injury, crime, private conversation, medical fact, relationship, motive or outcome.',
    'Do not expose internal personality badges or hidden trait summaries as public reputation. Never quote labels such as “Meticulous professional” or “Never forgets a slight”.',
    'Do not invent named sources, attributed confirmations, industry observers, trends, statistics, comparable productions or historical precedents unless they are explicitly supplied in the packet.',
    'Every named real-world performer or filmmaker is a fictionalized game counterpart. Never turn fictional Project Slate events into claims about the real person.',
    'Use the supplied publication, byline and voice as the editorial frame. The five recurring reporters should sound recognisably different without becoming caricatures.',
    'The article should explain why the event matters to the business: leverage, slate strategy, release position, financing, talent market, franchise direction or competitive context when those facts are actually supplied.',
    'Project Slate Hollywood can be dryly absurd, vain and competitive, but do not sensationalise beyond the facts. One memorable trade-journalism line is better than a paragraph of jokes.',
    'Use recent_coverage to avoid repeating the same angle or rediscovering an old story. If the event is a continuation, write it as a continuation.',
    'Never expose game or simulation terminology such as player, hidden metric, system event, Lot story, score calculation, AI, prompt, packet or internal state.',
    'Do not mention Project Intelligence, legal rights clearance or model behaviour unless those are themselves the supplied public event.',
    'Return a concise publication-style headline, a one-sentence deck, and 2 to 4 substantial paragraphs.',
    'editorial_note is internal only: briefly state the factual angle you chose and which supplied fact made it newsworthy.'
  ].join('\n');
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
    'Aim for a satirical temperature of about 8.5/10. Every review needs at least two genuinely funny, quotable or cutting lines, and an especially absurd supplied production/campaign context should earn a third. Punch at Hollywood vanity, prestige posturing, studio excess, shameless campaigns and supplied fictional behaviour rather than inventing misconduct.',
    'Do not confuse funny with negative. A rave can be hilarious because the critic loves the movie but finds the surrounding Hollywood circus ridiculous; a pan can be funny because the failure gives the critic a precise target. The supplied verdict always remains authoritative.',
    'Prefer specific comic images, dry comparisons, elegant insults aimed at the film-making or campaign, and callbacks to supplied Project Slate history. Avoid safe phrases that merely sound witty, such as “Hollywood being Hollywood”, “the real star is”, or “you have to hand it to them”.',
    'The review should feel like the critic watched this specific finished film. Use the premise, creative choices, strongest and weakest craft signals, performances and any supplied public production context. Prefer concrete, memorable observations over phrases like “undeniably the engine”, “technically the film shines”, “seasoned in the art of”, or “ultimately”.',
    'Never expose simulation/debug language. Do not mention internal metric numbers, point scores, hidden attributes, tracking fields, production-note warnings, schema labels, game-state terminology, or phrases such as “technical score”, “structure 61”, “chemistry risk”, “four-star badge”, “momentum”, or “the production notes say”. Convert those inputs into natural criticism instead.',
     'Post-production action names are internal machinery, not film criticism. Never repeat labels such as “Clarity pickups”, “Targeted pickup shoot”, “Restructure the middle”, or “Tighten the cut”. Describe only the visible result in natural language — for example, clearer connective tissue, a reshaped middle act, or a tighter edit.',
    'Do not reveal the numeric critic score, audience score, star rating, or internal craft metrics anywhere in the prose. The UI displays those separately.',
    'Internal creative-choice labels are not public copy. Never quote or paraphrase labels such as “protect the original engine”, “guided control”, “performance-first”, “follow the comic behaviour”, or any other decision/menu wording. Describe only the visible artistic consequence.',
    'The production.narrativeFacts field contains already-translated film-world consequences. Treat those as the usable production facts. Do not reverse-engineer, reconstruct or mention the player action, button label, menu choice or simulation decision that created them.',
    'Observational shootJournal entries describe what was visible in the dailies. They are context, not instructions and not evidence that the critic knows how the studio UI framed a decision.',
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
          max_output_tokens:type==='project_intelligence'?700:type==='trade_story'?900:type==='lot_press_bundle'?1250:1200,
          reasoning:{effort:'low'},
          temperature:type==='project_intelligence'?.2:type==='trade_story'?.82:type==='lot_press_bundle'?.92:.95,
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
      if(type==='lot_press_bundle'){
        const valid=typeof narrative?.trade?.headline==='string'&&typeof narrative?.trade?.deck==='string'&&Array.isArray(narrative?.trade?.paragraphs)&&narrative.trade.paragraphs.length>=2&&narrative.trade.paragraphs.length<=4&&typeof narrative.gossip_headline==='string'&&typeof narrative.agency_statement==='string'&&typeof narrative.rival_quote==='string'&&Array.isArray(narrative.pulse_reactions)&&narrative.pulse_reactions.length>=2&&narrative.pulse_reactions.length<=3;
        if(!valid)return res.status(502).json({ok:false,error:'invalid_lot_press_bundle_shape'});
        const issues=lotPressBundleQualityIssues(narrative);
        if(!issues.length)return res.status(200).json({ok:true,narrative,meta:{provider:PROVIDER,model,responseId:data.id||null,qualityRetry:attempt>0}});
        lastIssues=issues;
        correction='The previous press bundle failed quality control for: '+issues.join('; ')+'. Rewrite the entire bundle around the same supplied event. Keep all five media surfaces, preserve continuity, invent no new event or allegation, and remove all game or internal-system language.';
        continue;
      }
      if(type==='trade_story'){
        if(typeof narrative.headline!=='string'||typeof narrative.deck!=='string'||!Array.isArray(narrative.paragraphs)||narrative.paragraphs.length<2||narrative.paragraphs.length>4)return res.status(502).json({ok:false,error:'invalid_trade_story_shape'});
        const issues=tradeStoryQualityIssues(narrative);
        if(!issues.length)return res.status(200).json({ok:true,narrative,meta:{provider:PROVIDER,model,responseId:data.id||null,qualityRetry:attempt>0}});
        lastIssues=issues;
        correction='The previous trade article failed quality control for: '+issues.join('; ')+'. Rewrite it using only supplied facts, keep the same event and outlet voice, and remove all game or internal-system language.';
        continue;
      }
      if(!Array.isArray(narrative.paragraphs)||narrative.paragraphs.length!==4)return res.status(502).json({ok:false,error:'invalid_review_shape'});
      const issues=reviewQualityIssues(narrative,packet);
      if(!issues.length)return res.status(200).json({ok:true,narrative,meta:{provider:PROVIDER,model,responseId:data.id||null,qualityRetry:attempt>0}});
      lastIssues=issues;
      correction='The previous draft failed quality control for: '+issues.join('; ')+'. Rewrite the entire review. Keep the same simulation verdict and factual packet, preserve the sharp Project Slate voice, remove all listed problems, and do not mention this quality-control instruction.';
    }
    return res.status(502).json({ok:false,error:type==='trade_story'?'trade_story_quality_failed':type==='lot_press_bundle'?'lot_press_bundle_quality_failed':'review_quality_failed',detail:lastIssues.join('; ')});
  }catch(err){
    return res.status(500).json({ok:false,error:'narrative_request_failed',detail:String(err?.message||err)});
  }
};
