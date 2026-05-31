# Stat Resolution Pipeline

Strict order:
1. base value
2. flat additive modifiers
3. percent additive modifiers
4. multiplicative modifiers
5. caps/floors
6. final overrides
7. runtime clamps/safety checks

Use fixed-point/integer where practical.
Pipeline must be identical in gameplay, simulator, replay, and tests.
