import type { SimulationSummary } from '@utd/shared-types';
export type TelemetryEvent = {
    readonly type: 'damage';
    readonly sourceId: string;
    readonly amount: number;
} | {
    readonly type: 'kill';
} | {
    readonly type: 'leak';
} | {
    readonly type: 'commandAccepted';
    readonly sourceId: string;
} | {
    readonly type: 'commandRejected';
    readonly sourceId: string;
};
export declare const summarizeTelemetry: (options: {
    readonly events: readonly TelemetryEvent[];
    readonly configFingerprint: string;
    readonly commandLogReference: string;
    readonly stateHash: string;
    readonly gold: number;
    readonly lives: number;
    readonly waveReached: number;
}) => SimulationSummary;
//# sourceMappingURL=index.d.ts.map