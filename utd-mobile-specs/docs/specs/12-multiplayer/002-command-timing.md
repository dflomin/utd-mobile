# Multiplayer Command Timing

Use deterministic command scheduling with small fixed input delay.

- Commands are stamped for future simulation tick.
- All clients apply command on same tick.
- At 20 TPS, 4-6 tick delay = ~200-300ms.
- Solo can apply commands instantly.
- If latency/desync risk too high, auto-pause/resync.
