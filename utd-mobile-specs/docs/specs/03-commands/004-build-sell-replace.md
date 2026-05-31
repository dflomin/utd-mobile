# Build/Sell/Replace Commands

BUILD_TOWER payload:
- slotId
- blueprintStackId
- towerDefId

SELL_TOWER payload:
- towerEntityId
- towerInstanceId
- towerDefId

REPLACE_TOWER payload:
- targetTowerEntityId
- targetTowerInstanceId
- targetTowerDefId
- replacementBlueprintStackId
- replacementTowerDefId

Replacement must be same element unless special rule allows.
