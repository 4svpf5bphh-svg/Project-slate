# Project Slate Architecture

v4.0d.4 modularises the previous single-file build without intentionally changing simulation behaviour.

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
- 80–87_ui_*.js — UI by domain
- 90_bindings.js — DOM actions
- 99_boot.js — route renderer/final bootstrap

## The Lot
The Lot is a first-class people-simulation domain and should live under js/lot/. It owns alternate-Hollywood identities, personality, relationships, memories, incidents and story arcs. Film/casting/Pulse/Desk modules should call its public helpers rather than contain Lot rules themselves.

## Refactor rule
File movement should not change gameplay. New mechanics should arrive in feature commits after the modular baseline.
