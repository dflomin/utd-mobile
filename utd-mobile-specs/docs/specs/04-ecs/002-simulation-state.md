# SimulationState

ECS only represents active simulated entities.

Plain SimulationState owns:
- players/resources/inventories
- blueprint/item/potion stacks and histories
- element investments
- favorite spells
- hero state
- run/wave state
- RNG streams
- command queue/log
- checkpoint metadata
- report aggregates

Suggested:
```ts
type SimulationState = { ecsWorld; players; run; wave; rng; commandQueue; telemetry };
```
