# Project Slate Narrative Engine

## v4.5a scope

The Narrative Engine is an optional prose layer. The simulation remains authoritative.

Current AI surface:
- The Daily Screen main film review.

The simulation still decides:
- critic score;
- audience score;
- star rating;
- film quality metrics;
- box office;
- awards;
- relationships;
- production events;
- campaign results.

If the AI endpoint is unavailable, Project Slate immediately falls back to its existing local review generator. No gameplay system depends on an AI response.

## Current persistence model

Project Slate does not yet have a player-facing/cloud save system.

The current build automatically serializes browser state to localStorage. A completed AI review can therefore remain in that browser career, but v4.5a does not treat this as durable account storage.

The Narrative API is deliberately stateless. Future cloud saves/multiplayer can persist the same `aiNarrative` records without changing the API contract.

## Deployment\n\nCurrent production Narrative API endpoint:\n\n`https://project-slate-five.vercel.app/api/narrative`\n

The repository contains a Vercel-compatible serverless endpoint at:

`/api/narrative`

Default provider: **Groq**, using `openai/gpt-oss-120b`.

Required environment variable for the default setup:

`GROQ_API_KEY`

Recommended environment variables:

- `NARRATIVE_PROVIDER=groq`
- `NARRATIVE_MODEL=openai/gpt-oss-120b`
- `NARRATIVE_ALLOWED_ORIGINS` — optional comma-separated extra browser origins. The Project Slate GitHub Pages origin, same-origin requests and localhost are already allowed.

The server is provider-agnostic. Setting `NARRATIVE_PROVIDER=openai` switches to the OpenAI Responses API instead and reads `OPENAI_API_KEY`; `NARRATIVE_MODEL` can override the model without changing the browser game.

Because the current career is browser-local and there is no portable cloud save yet, the preferred v4.5a setup is to keep the playable game on its existing GitHub Pages origin and deploy only the serverless Narrative API to Vercel. This preserves the current browser storage.

Once the Vercel API is deployed, open Project Slate → Studio → Business → Narrative, paste the Vercel project URL, save it and press **Test connection**. The known Project Slate GitHub Pages origin is already allowed by the API.

The field accepts either `https://YOUR-DEPLOYMENT.vercel.app` or the full `/api/narrative` URL.

## Data handling

The server sends only the structured narrative packet needed for the requested prose. Responses requests use `store: false`. No provider is asked to retain a response for Project Slate's own persistence model.

Real performer/director names in a Project Slate packet are explicitly labelled as fictional alternate-reality counterparts. The prompt instructs the model not to convert fictional Project Slate events into real-world claims.

## Film review contract

The server returns structured JSON containing:

- `headline`
- `pull_quote`
- exactly four `paragraphs`
- `editorial_note`

Only prose is replaced. The UI continues to display the simulation-owned score, stars and audience result.

## Future v4.5 surfaces

The same endpoint can later accept additional content types without becoming stateful:

- trade story;
- Lot/gossip article;
- interview answer;
- rival executive quote;
- Film Wrap narrative;
- awards-season commentary;
- year-end retrospective.


## v4.5c review reveal
AI reviews now pass a deterministic quality-control check for simulation-language leaks and verdict mismatch. A failed draft is rewritten once automatically. When a review completes, Project Slate surfaces a full-screen Daily Screen review drop with headline, pull quote, critic identity, stars, critic score and audience score before the player opens the full article.


## v4.6 — Project Intelligence

Player-created Original Concepts now make one optional Narrative Engine request after funding. The request contains only the title, genre, logline, synopsis and high-level project context. The model returns conservative structured recognition rather than prose.

Recognition can identify a likely sequel, continuation, remake, reboot, spin-off or adaptation and may return a small set of widely associated legacy titles, talent and franchise identity signals. Ambiguous projects are expected to return as original/unrecognised.

A recognised property is never automatically activated. The player explicitly chooses **Use recognised context** or **Treat as original**. Accepted context is then available to later narrative packets and deterministic casting comparison. For example, a recognised legacy property can distinguish a legacy return, partial return or full recast without another AI request.

Project Intelligence is creative context only. It does not alter screenplay quality, box office, talent acceptance, legal ownership, licensing or real-world rights status.

## v4.6 — Narrative Variety Foundation

The Lot now maintains narrative-variety memory across incident ID, family, setting, story shape and topic. Incident selection strongly prefers unseen material, penalises recently used dimensions and will allow a quiet week rather than bypass cooldown rules simply to force an event.

Each deterministic Lot incident also stores a compact narrative seed containing its tier, family, tags, setting, shape, participants, relationship state, deterministic consequence and a dynamic novelty brief. This is the contract for a later generative-Lot layer: the simulation will decide what happened mechanically, while the Narrative Engine invents fresh specific expression without repeating recent subjects or joke structures.


## v4.7 — Trade Press

Trade Press extends the Narrative Engine from film criticism into selective industry journalism.

The deterministic simulation still decides what actually happened. Every ordinary news item is first rendered through Project Slate's authored local press system. Only sufficiently important events are eligible for AI enhancement, and the AI rewrites that existing article rather than creating a second version of the event.

The editorial gate scores event importance, player relevance, subject repetition and recent coverage. Routine greenlights, press releases and minor market moves remain local copy. Normally only one major Trade Press feature may consume an AI request in an in-game week; an exceptional story can permit a second.

Eligible examples include:
- major hits, bombs and unusual theatrical holds;
- consequential studio financial stories;
- contested screenplay outcomes;
- serious production or talent disruptions;
- major franchise / rights moves;
- defining studio-rivalry developments;
- awards and career-turning results;
- important rival-studio outcomes as well as player-studio stories.

The server receives a structured fact packet containing the locked event, publication/byline, relevant film/studio/talent context and a small recent-coverage memory. It must not invent new deals, quotes, scandals, injuries, private conduct or outcomes.

If the Narrative Engine is unavailable, the authored local article remains the finished article. Trade Press never blocks gameplay.

High-importance stories can also surface on the Studio Desk as persistent Trade Press intelligence. Opening the Desk item routes to the same news article; there is no duplicate story.

Project Intelligence remains intentionally limited to player-created Original Concepts.
