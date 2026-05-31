# Fixed Tick

Use fixed simulation tick around 20 ticks/sec.

- 1 tick = 50ms
- 20 ticks = 1 second
- rendering may run at 60 FPS independently
- core logic must not use deltaSeconds

Use ticks for cooldowns, DOTs, disables, mana regen, command scheduling, wave timers.
