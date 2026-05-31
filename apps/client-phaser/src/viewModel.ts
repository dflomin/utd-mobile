import { createBuildTowerCommand, createRenderSnapshot } from '@utd/game-core';
import { translate } from '@utd/localization';

type Point = { readonly x: number; readonly y: number };
export type HudRow = { readonly label: string; readonly value: string };

export const createClientViewModel = (): { readonly path: readonly Point[]; readonly hudRows: readonly HudRow[] } => {
  const snapshot = createRenderSnapshot();
  return {
    path: snapshot.path,
    hudRows: [
      { label: translate('ui.lives'), value: String(snapshot.hud.lives) },
      { label: translate('ui.gold'), value: String(snapshot.hud.gold) },
      { label: translate('ui.wave'), value: String(snapshot.hud.wave) },
      { label: translate('ui.hp'), value: snapshot.hud.hpLabel }
    ]
  };
};

export const createSubmitBuildCommand = (submit: (command: unknown) => void) => {
  return () => submit(createBuildTowerCommand());
};
