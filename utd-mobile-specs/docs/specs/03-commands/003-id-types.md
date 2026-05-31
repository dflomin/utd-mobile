# Command ID Types

Definition IDs:
- towerDefId, itemDefId, potionDefId, abilityDefId, upgradeDefId
- static config lookup

Instance IDs:
- towerInstanceId, itemInstanceId, potionInstanceId, blueprintStackId
- ownership/save/replay/telemetry

ECS IDs:
- towerEntityId, enemyEntityId
- fast runtime lookup only

Commands acting on runtime owned entities usually include all relevant IDs.
