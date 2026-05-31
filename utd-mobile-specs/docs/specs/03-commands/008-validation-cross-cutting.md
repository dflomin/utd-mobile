# Cross-Cutting Command Validation

Validate:
- schema version
- commandId UUID + dedupe
- session/run/player membership
- clientSeq monotonic
- applyAtTick scheduling window
- command allowed in current state
- ownership consistency for all instances
- duplicate-use safety
- paused/game-over/loading/reward restrictions
- config/schema compatibility
- current state/config authoritative for costs/effects/RNG
- occupied item slot rejects for MVP
- multiplayer authority/vote rules for shared actions
