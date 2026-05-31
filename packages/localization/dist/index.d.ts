declare const enUs: {
    readonly 'tower.basic.name': "Arc Tower";
    readonly 'enemy.basic.name': "Training Drone";
    readonly 'wave.basic.name': "Calibration Wave";
    readonly 'ui.lives': "Lives";
    readonly 'ui.gold': "Gold";
    readonly 'ui.wave': "Wave";
    readonly 'ui.hp': "HP";
};
export type LocalizationKey = keyof typeof enUs;
export declare const translate: (key: LocalizationKey) => string;
export {};
//# sourceMappingURL=index.d.ts.map