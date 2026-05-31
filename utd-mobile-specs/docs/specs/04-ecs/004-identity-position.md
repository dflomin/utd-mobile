# Identity and Position Components

IdentityComponent:
- entityKind
- persistentId optional
- defId optional

OwnerComponent:
- playerId
- teamId optional

BuildSlotOccupantComponent:
- slotId
- mapId
- laneGroupId optional

PathPositionComponent:
- laneId
- pathProgress fixed-point
- previousPathProgress

WorldPositionComponent optional cached x/y.
SpatialIndexComponent tracks grid cell IDs.
