# Auras and Areas

Tower-to-tower buff auras:
- event-driven/cached because towers do not move
- recalc on tower placement/sale/replacement/upgrade/item/range/global changes

Enemy-affecting auras/areas:
- dynamic runtime area systems with spatial grid queries
- configurable tickInterval and nextTickAt
- damage pulses resolve directly
- debuffs apply short statuses slightly longer than tick interval
