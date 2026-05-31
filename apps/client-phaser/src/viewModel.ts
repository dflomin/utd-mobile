export type HudRow = { readonly label: string; readonly value: string };

export const createClientViewModel = () => ({
  path: [] as { x: number; y: number }[],
  hudRows: [] as HudRow[]
});

export const createSubmitBuildCommand = (_submit: (command: unknown) => void) => {
  return () => undefined;
};
