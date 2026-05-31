# Specific Command Validation

BUILD: owns blueprint, stack matches towerDefId, capacity exists, slot exists/empty/allowed, enough gold, element unlocked.
SELL: tower exists, IDs match, player owns, sellable, not queued.
REPLACE: target owned, replacement stack owned, same element unless special, enough cost, inheritance legal.
UPGRADE: upgrade exists/prereqs/element level/gold/upgrade points.
EQUIP: item owned, slot empty, compatible, max slots.
USE_ITEM: item owned/usable/self-only/effect legal.
APPLY_POTION: potion owned, tower owned, compatible.
FAVORITE/CAST: slot valid, tower/ability current, mana/cooldown/disabled checks.
REROLL: currency, eligible recent unplaced drops only.
START/SPEED/PAUSE/RESUME: authority and state checks.
