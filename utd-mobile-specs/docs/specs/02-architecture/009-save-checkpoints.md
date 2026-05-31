# Save Serialization

Use hybrid checkpoints.

- Store full between-wave checkpoint snapshots.
- Also store seed + action log for debugging/replay/desync/simulator comparison.
- Do not rely only on action replay.
- Do not rely only on opaque ECS snapshots.

Best-effort compatibility after patches using config/schema versions.
