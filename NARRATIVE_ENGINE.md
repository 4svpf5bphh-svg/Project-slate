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

## Deployment

The repository contains a Vercel-compatible serverless endpoint at:

`/api/narrative`

Required environment variable:

`OPENAI_API_KEY`

Optional variables:

- `OPENAI_MODEL` — defaults to `gpt-6-astra`.
- `NARRATIVE_ALLOWED_ORIGINS` — comma-separated allowed browser origins. If omitted, the endpoint accepts same-origin requests and localhost only.

Because the current career is browser-local and there is no portable cloud save yet, the preferred v4.5a setup is to keep the playable game on its existing GitHub Pages origin and deploy only the serverless Narrative API to Vercel. This preserves the current browser storage.

Set the exact GitHub Pages origin in `NARRATIVE_ALLOWED_ORIGINS`, then point the client at the deployed API URL. During development this can be done from the browser console:

`ProjectSlate.setNarrativeEndpoint('https://YOUR-DEPLOYMENT.vercel.app/api/narrative')`

Pass an empty value to return to the default same-origin endpoint.

## Data handling

The server sends only the structured narrative packet needed for the requested prose. The OpenAI Responses request uses `store: false`.

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
