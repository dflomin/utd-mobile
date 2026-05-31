# Derived Stats and Debugging

Entities with stats use cached DerivedStats:
- values
- dirty
- lastResolvedTick

Dirty triggers:
- item equip/unequip
- potion applied
- tower upgraded/leveled
- aura membership changed
- status applied/expired
- hero/global modifier changed
- element investment changed

Debug stat breakdown must show base, flat, percent, multipliers, caps, override, final value, and sources.
