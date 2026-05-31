# Effect Graph Model

Effects support tree/graph execution.

Example:
Attack hits -> Direct Damage -> onSuccess Apply Burn -> onCrit Chain Damage.

Child triggers may include:
- ON_SUCCESS
- ON_FAIL
- ON_CRIT
- ON_KILL
- ON_STATUS_APPLIED
- ON_PROJECTILE_IMPACT
- ON_EXPIRE

Every chain has triggerChainId, depth, source/target context, deterministic RNG streams.
