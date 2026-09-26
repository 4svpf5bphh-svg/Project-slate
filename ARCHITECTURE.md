# Project Slate Architecture

v4.0d.4 modularised the previous single-file build without intentionally changing simulation behaviour. v4.1a added The Lot foundation; v4.1b made its relationships and stories affect casting and production while keeping real talent names canonical; v4.1c surfaced those pressures directly in casting and film workflows; v4.1d makes rival intent legible and applies the next casting/Industry UX cleanup. v4.2 adds persistent pair history, story chapters, resurfacing, cross-studio film memory and awards callbacks so relationships can span years and careers.

## Runtime order
- 00_bootstrap_data.js — build/version, seed data, foundational constants
- 01_roster_visual_world.js — roster, legends, visual/world helpers, talent market
- 02_audit_rivals_agencies.js — audit, rival strategy, agencies, AI studio policy
- 10_state_migrations.js — save normalization/schema migration
- 20_core_entities.js — state construction/core entity access
- 25_finance_notifications.js — finance, operating costs, Desk/notification routing
- 40_screenplay_casting_release.js — screenplay, packaging, casting, release planning
- 45_music_production_story.js — music, production story, film-wrap narrative
- 50_simulation_pipeline.js — milestones, infrastructure, production/post/marketing/box office/threads
- 70_screenplay_economy.js — competitive script market
- 71_streaming_catalogue.js — post-theatrical rights/catalogue
- 72_open_doors.js — late-career opportunities/emerging talent
- 73_hollywood_history.js — eras, anniversaries, Hall of Slate
- 74_corporate.js — late-game corporate systems
- 75_lot_core.js — alternate-Hollywood identities, personality, relationships, memories and incidents
- 80–87_ui_*.js — UI by domain
- 90_bindings.js — DOM actions
- 99_boot.js — route renderer/final bootstrap

## The Lot
The Lot is a first-class people-simulation domain and should live under js/lot/. It owns fictional in-game personality, relationships, memories, incidents and story arcs while the core roster's real talent names remain canonical. Film/casting/Pulse/Desk modules should call its public helpers rather than contain Lot rules themselves. From v4.1b, those helpers may supply bounded package-interest, chemistry, morale and stability effects so people stories create gameplay consequences without overwhelming the film-making loop. v4.1c also exposes active Lot stories on project surfaces, flags hostile packages and allows optional, limited mediation without turning people drama into a mandatory decision queue.

## Refactor rule
File movement should not change gameplay. New mechanics should arrive in feature commits after the modular baseline.
