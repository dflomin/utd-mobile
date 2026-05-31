# UTD Mobile Foundation Milestones and Acceptance Criteria

## Scope Lock

This plan is fully based on the extracted specs and is intended for the foundation stage.

Constraints applied:
- All gameplay tuning numbers must live in configuration objects.
- Simulation and gameplay systems must not hardcode tuning values.
- Foundation work may include schema plus placeholder configuration rows for towers, enemies, waves, scaling, and timing.
- Validation is strict fail-fast at startup for required fields and deterministic constraints.
- Acceptance evidence for milestones requires tests and deterministic replay proof.

## Spec Anchors

Primary anchor files:
- utd-mobile-specs/docs/specs/00-meta/001-spec-index.md
- utd-mobile-specs/docs/specs/01-product/001-product-identity.md
- utd-mobile-specs/docs/specs/02-architecture/001-monorepo.md
- utd-mobile-specs/docs/specs/02-architecture/002-game-core-boundary.md
- utd-mobile-specs/docs/specs/02-architecture/005-deterministic-simulation.md
- utd-mobile-specs/docs/specs/02-architecture/006-fixed-tick.md
- utd-mobile-specs/docs/specs/02-architecture/007-rng-streams.md
- utd-mobile-specs/docs/specs/02-architecture/008-fixed-point.md
- utd-mobile-specs/docs/specs/03-commands/001-command-principles.md
- utd-mobile-specs/docs/specs/03-commands/002-base-command.md
- utd-mobile-specs/docs/specs/03-commands/008-validation-cross-cutting.md
- utd-mobile-specs/docs/specs/04-ecs/001-ecs-rules.md
- utd-mobile-specs/docs/specs/04-ecs/002-simulation-state.md
- utd-mobile-specs/docs/specs/04-ecs/010-core-systems.md
- utd-mobile-specs/docs/specs/05-modifiers/001-stat-pipeline.md
- utd-mobile-specs/docs/specs/06-effects/001-effect-system-principles.md
- utd-mobile-specs/docs/specs/07-enemies/003-enemy-counts-waves.md
- utd-mobile-specs/docs/specs/08-simulator/001-simulator-purpose.md
- utd-mobile-specs/docs/specs/09-implementation/001-first-build-target.md
- utd-mobile-specs/docs/specs/09-implementation/003-core-sim-slice.md

## Milestone 1: Monorepo and Package Boundaries

Objective:
Establish the repository skeleton and ownership boundaries so game-core remains authoritative and renderer/backend remain consumers.

Deliverables:
- apps/client-phaser, apps/simulator, apps/backend
- packages/game-core, packages/content-config, packages/shared-types, packages/telemetry, packages/localization
- TypeScript project references and shared lint/test setup
- ADR-style boundary notes: gameplay truth lives in game-core only

Acceptance criteria:
- Build graph resolves with no circular package dependencies.
- game-core has no dependency on Phaser, DOM, Capacitor, or backend modules.
- CI task runs typecheck and tests in all packages.
- Boundary tests fail if forbidden imports are introduced.

Evidence:
- Automated import-boundary checks
- CI logs for workspace typecheck and test pass

## Milestone 2: Deterministic Runtime Kernel

Objective:
Implement fixed-tick deterministic simulation primitives.

Deliverables:
- 20 TPS fixed tick clock and tick scheduler
- Integer or fixed-point math helpers for gameplay logic
- Seeded RNG with independent named streams
- Canonical deterministic state hash function

Acceptance criteria:
- Same seed plus command stream yields identical state hash across repeated runs.
- Different RNG stream usage does not perturb unrelated stream outcomes.
- No gameplay math path depends on floating-point nondeterministic behavior.
- Tick scheduler applies events only on integer tick boundaries.

Evidence:
- Determinism test suite with replay fixtures
- Hash snapshots for at least 1000 ticks over repeated runs

## Milestone 3: Command Contract and Validation Pipeline

Objective:
Make commands the only state mutation path with strict validation.

Deliverables:
- Base command schema with versioning and IDs
- Command queue, dedupe, ordering, and applyAtTick behavior
- Cross-cutting validation: schema, ownership, state preconditions, config preconditions
- Rejection reason model with stable codes

Acceptance criteria:
- No state mutation occurs outside command application systems.
- Duplicate command IDs are safely ignored.
- Invalid commands fail fast with deterministic rejection codes.
- Command processing order is stable and replay-safe.

Evidence:
- Unit tests for each validation layer
- Property tests for ordering and idempotency
- Replay tests proving stable accept/reject outcomes

## Milestone 4: ECS Foundation and System Ordering

Objective:
Create minimal ECS structures and deterministic core system execution order.

Deliverables:
- Entity ID allocator and component stores
- SimulationState shape per spec boundaries
- Core system pipeline scaffolding in fixed order
- World serialization for checkpoints and replay

Acceptance criteria:
- System order is explicit and cannot drift by registration timing.
- Serialization-deserialization round trip preserves state hash.
- Component mutations are deterministic under identical input streams.
- ECS runtime supports core entities for towers, enemies, projectiles, inventory placeholders.

Evidence:
- System-order snapshot tests
- State round-trip hash tests
- Deterministic mutation tests on representative entities

## Milestone 5: Configuration Schema Layer (No Final Tuning)

Objective:
Create all foundation configuration objects and schemas needed to tune later without system rewrites.

Deliverables:
- Typed config schemas and registries for towers, enemies, waves, scaling, timing, economy, drops, affixes, effects, modifiers
- Placeholder config rows for each major category
- Startup validator with strict fail-fast checks
- Localization key references in config definitions

Acceptance criteria:
- Every gameplay tuning number is read from configuration, not hardcoded.
- Missing required config keys stop boot with actionable validation output.
- Placeholder rows load and pass schema validation.
- Systems can run with placeholder content without null-path runtime failures.

Evidence:
- Static checks that detect hardcoded numeric constants in protected gameplay paths
- Config validation test suite
- Boot test proving strict validator behavior

## Milestone 6: Core Sim Vertical Slice (Foundation Playable)

Objective:
Wire command, ECS, and config foundations into one deterministic playable simulation slice.

Deliverables:
- Minimal commands: start wave, place tower placeholder, sell placeholder
- Enemy spawn from wave config placeholders
- Timing and density pulled from wave/scaling config placeholders
- Basic targeting and damage loop using effect/modifier placeholders

Acceptance criteria:
- A seeded run can progress through at least one full wave end-to-end.
- Wave density, spawn timing, and scaling are entirely config-driven.
- Tower and enemy placeholders function through same runtime pathways as final content.
- Replay from seed plus command log reproduces identical outcome and state hashes.

Evidence:
- End-to-end deterministic sim test
- Replay proof artifact
- Runtime trace showing config lookups for timing/density/scaling

## Milestone 7: Simulator Harness for Foundation Validation

Objective:
Use headless simulator to validate baseline balancing hooks and replayability.

Deliverables:
- apps/simulator runner for seeded batches
- Basic strategy profiles compatible with placeholder content
- Report output: wave reached, leaks, economy totals, event counters
- Exportable JSON artifacts for tuning review

Acceptance criteria:
- Batch runs are reproducible across identical seed sets.
- Report output includes configuration fingerprints for traceability.
- Simulator catches invalid config relationships before runtime integration.
- Foundation metrics can be generated without Phaser client dependency.

Evidence:
- Batch reproducibility report
- JSON artifacts committed from deterministic runs
- Validation failures demonstrated on intentionally broken config fixtures

## Milestone 8: Foundation Readiness Gate

Objective:
Certify the codebase is ready for real tower and enemy content expansion.

Deliverables:
- Readiness checklist tied to specs
- Risk register for desync, config drift, and validation blind spots
- Baseline developer workflow for adding new config rows safely

Acceptance criteria:
- All prior milestone acceptance tests pass in CI.
- Determinism suite is stable and required for merge.
- Config-only tuning changes do not require system code edits.
- First real tower and enemy definitions can be added by extending config rows only.

Evidence:
- Green CI with required deterministic jobs
- Change demonstration PR: add one new placeholder variant by config-only change
- Signed readiness checklist

## Definition of Done for Foundation Stage

Foundation stage is complete when:
- Determinism is proven via replay tests and state hashes.
- Systems consume config for all tuning parameters.
- Placeholder tower/enemy/wave/scaling/timing definitions execute end-to-end.
- Simulator produces reproducible reports from seeded runs.
- Team can begin real content authoring without changing simulation architecture.

## Out of Scope for This Stage

Not required to complete foundation:
- Full tower roster by element and rarity
- Final enemy catalog and affix balance
- Final monetization tuning
- Full UI polish and content-rich progression

These are downstream milestones once the foundation gate passes.
