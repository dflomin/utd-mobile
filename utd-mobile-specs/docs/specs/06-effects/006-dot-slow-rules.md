# DOT and Slow Rules

DOT:
- key = sourceTowerInstanceId + targetEntityId + dotDefId
- same tower reapplying same DOT refreshes, does not stack
- multiple different towers can apply independent DOTs

Slow:
- same source tower refreshes
- strongest slow is baseline
- additional slows use diminishing returns
- final slow capped at 70%
- exact weights balance-configurable
