const enUs = {
  'tower.basic.name': 'Arc Tower',
  'enemy.basic.name': 'Training Drone',
  'wave.basic.name': 'Calibration Wave',
  'ui.lives': 'Lives',
  'ui.gold': 'Gold',
  'ui.wave': 'Wave',
  'ui.hp': 'HP'
} as const;

export type LocalizationKey = keyof typeof enUs;

export const translate = (key: LocalizationKey): string => enUs[key];
