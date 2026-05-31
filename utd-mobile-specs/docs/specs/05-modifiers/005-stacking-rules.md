# Modifier Stacking Rules

Stack modes:
- STACK
- UNIQUE_BY_SOURCE
- UNIQUE_BY_DEF
- HIGHEST_ONLY
- REFRESH_DURATION
- ADD_STACK_REFRESH_DURATION

Defaults:
- potion bonuses STACK
- item bonuses usually UNIQUE_BY_SOURCE
- hero bonuses UNIQUE_BY_DEF
- aura bonuses HIGHEST_ONLY or UNIQUE_BY_SOURCE
- slows handled by specialized slow rules
- DOTs handled by DOT rules
- crit/proc use caps
