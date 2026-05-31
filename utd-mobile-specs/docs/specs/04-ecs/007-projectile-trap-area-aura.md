# Projectile, Trap, Area, Aura Components

ProjectileComponent only for real simulated projectiles.

TrapComponent:
- trapDefId
- ownerPlayerId
- triggerRadius
- remainingTriggers optional
- expiresAtTick optional

AreaEffectComponent:
- areaEffectDefId
- ownerPlayerId optional
- radius
- expiresAtTick optional
- tickInterval/nextTickAt optional

AuraSourceComponent:
- auraDefId
- radius
- affects TOWERS|ENEMIES
- targetFilters
- modifierDefs

AuraReceiverComponent:
- activeAuraEntityIds
