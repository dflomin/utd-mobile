# Monorepo Architecture

Use one TypeScript monorepo.

Recommended structure:
/apps
  client-phaser
  simulator
  backend
/packages
  game-core
  content-config
  shared-types
  telemetry
  localization

Do not split into microservices/packages prematurely beyond these boundaries.
