# Phaser Client Boundary

`client-phaser` renders and handles input.

It must:
- import `game-core`
- render simulation state
- submit commands
- interpolate visuals
- handle particles/audio/UI

It must not own authoritative gameplay state or mutate simulation outside commands.
