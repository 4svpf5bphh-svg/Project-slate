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
