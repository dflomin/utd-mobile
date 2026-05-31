# Status and Stats Components

ModifierSourceComponent:
- modifierSourceId
- modifierDefs

ActiveModifiersComponent:
- modifierInstanceIds
- dirty

DerivedStatsComponent:
- stats map
- dirty
- lastResolvedTick

RuntimeStatusComponent:
- statuses with instanceId, defId, source, appliedAtTick, expiresAtTick, nextTickAt, stackCount, data

Statuses include DOTs, slow, stun, tower disable, shield, reveal, chain marks.
