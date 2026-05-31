# Agent Rules

- Do not improvise architecture when a spec exists.
- If something is ambiguous, create a TODO question instead of inventing a new system.
- `game-core` owns gameplay truth.
- Phaser renders and sends commands only.
- All gameplay mutations go through immutable commands.
- Determinism matters more than clever abstractions.
- Keep specs and implementation small, typed, testable, and boring.
