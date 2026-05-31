# Base Command Shape

```ts
type GameCommand<TType extends string, TPayload> = {
  schemaVersion: number;
  commandId: string;
  sessionId: string;
  runId: string;
  playerId: string;
  clientSeq: number;
  clientSentAtMs: number;
  issuedAtLocalTick: number;
  applyAtTick: number;
  type: TType;
  payload: TPayload;
  preStateHash?: string;
  clientStateVersion?: number;
};
```

Packets stay thin. State/config remains authoritative.
