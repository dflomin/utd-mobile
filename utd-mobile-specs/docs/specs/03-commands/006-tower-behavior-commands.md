# Tower Behavior Commands

SET_TARGETING_MODE:
- towerEntityId
- towerInstanceId
- towerDefId
- targetingMode

TOGGLE_AUTOCAST:
- towerEntityId
- towerInstanceId
- towerDefId
- abilityDefId
- enabled

SET_FAVORITE_SPELL:
- favoriteIndex 0|1|2
- towerEntityId
- towerInstanceId
- towerDefId
- abilityDefId

CAST_FAVORITE_SPELL:
- favoriteIndex 0|1|2

Cast favorite spell uses configured targeting/effects. No arbitrary coordinates for MVP.
