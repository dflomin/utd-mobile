# Hook Lifecycle

Hook behaviors:
- MUTATE
- CANCEL
- REPLACE
- REACT

Lifecycle:
BEFORE_EVENT mutation hooks -> cancel/replacement hooks -> event resolves -> after/reactive hooks.

Rules:
- numeric priority ordering
- highest-priority replacement/cancel wins
- once cancelled/replaced, remaining same-phase hooks usually stop
- reactive hooks run only if resolved result allows
- telemetry records original, mutations, winner, final result
