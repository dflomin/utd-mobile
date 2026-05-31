# Inventory State Outside ECS

BlueprintInventoryState:
- aggregate stacks for UI/capacity
- individual drop records for reroll/history

Reroll affects last N drop rounds, runtime-configurable, unplaced drops only.

ItemInventoryState:
- stacks plus persistent instances
- hardcoded item effects, no random stats
- instances persist through equip/unequip

PotionInventoryState:
- stacks plus persistent instances
- potion stack key: potionDefId + rarity + statId
