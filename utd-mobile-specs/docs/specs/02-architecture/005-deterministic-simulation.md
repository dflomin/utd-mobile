# Deterministic Simulation

Core simulation must be fully deterministic from seed + command stream.

Requirements:
- fixed tick loop at ~20 TPS
- integer ticks for all gameplay timers
- fixed-point/integer gameplay math where practical
- separate RNG streams
- commands scheduled to ticks
- reproducible simulator/replay/debug behavior
