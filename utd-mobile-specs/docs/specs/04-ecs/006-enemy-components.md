# Enemy Components

EnemyComponent:
- enemyDefId
- waveNumber
- spawnBatchId
- enemyTags
- armorType

HealthComponent:
- currentHp
- maxHp
- shieldHp optional

MovementComponent:
- baseSpeed
- currentSpeed
- reachedEnd

EnemyAffixComponent:
- affixIds

EnemyRewardComponent:
- goldOnKill
- xpValue
- canDropItems
- canDropPotions
- bonusDropWeight

LeakDamageComponent:
- livesLostOnLeak
- damagesLives false for bonus waves
