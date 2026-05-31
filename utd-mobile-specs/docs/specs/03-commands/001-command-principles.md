# Command Principles

All gameplay mutations occur through immutable commands.

Commands are deterministic, serializable, replay-safe, multiplayer-safe, simulator-safe, versioned, and tick-scheduled.

Commands represent player intent only. They do not contain combat outcomes.
