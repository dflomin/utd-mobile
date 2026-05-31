# Backend Persistence

For multiplayer, backend stores only:
1. latest between-wave checkpoint
2. command stream for current wave
3. connection/session status

No mid-wave full live state persistence for MVP.
