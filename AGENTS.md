# AGENTS

## Working rules

- Follow the shipped specs exactly; do not invent architecture when a spec exists.
- Use strict TDD for every change.
- Prefer configuration-first and reusable-code-first implementations.
- Keep non-configuration files at or below 250 lines where practical.
- Prioritize Android mobile game compatibility first; desktop support is secondary.
- Use Phaser for the game engine.
- Add placeholders or TODO questions instead of guessing when specs are incomplete or ambiguous.
- Keep `game-core` authoritative for gameplay; rendering and input stay outside it.
