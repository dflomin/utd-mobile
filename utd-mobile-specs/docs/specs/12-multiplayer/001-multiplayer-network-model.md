# Multiplayer Network Model

Use deterministic command-stream multiplayer.

Clients send player commands, not combat results.
Clients do not send damage, enemy deaths, gold gained, projectile hits.
Each client runs deterministic game-core locally and gets same results from same seed + command stream.
