# game-core Boundary

`game-core` owns deterministic gameplay truth.

It includes:
- simulation loop
- ECS/runtime entities
- commands
- combat
- economy
- RNG streams
- content rules
- serialization

It must not depend on Phaser, DOM, Capacitor, backend, or rendering.
