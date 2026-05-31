# ECS Rules

Use custom minimal game-specific ECS.

- numeric ECS entity IDs internally
- plain serializable components
- systems own behavior
- config owns static content
- commands are mutation entry point
- no Phaser in game-core
- deterministic ticks/fixed-point gameplay
- avoid deep inheritance/component explosion/runtime scripting
