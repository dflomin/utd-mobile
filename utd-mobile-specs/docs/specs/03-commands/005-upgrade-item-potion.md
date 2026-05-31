# Upgrade, Item, Potion Commands

UPGRADE_TOWER:
- towerEntityId
- towerInstanceId
- towerDefId
- targetUpgradeId

EQUIP_ITEM:
- towerEntityId
- towerInstanceId
- towerDefId
- itemInstanceId
- itemDefId
- itemSlotIndex 0-3

UNEQUIP_ITEM:
- towerEntityId
- towerInstanceId
- towerDefId
- itemSlotIndex

USE_ITEM:
- itemInstanceId
- itemDefId

APPLY_POTION:
- potionInstanceId
- potionDefId
- targetTowerEntityId
- targetTowerInstanceId
- targetTowerDefId
