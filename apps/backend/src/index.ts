export type BackendReadiness = {
  readonly mode: 'placeholder';
  readonly notes: readonly string[];
};

export const createBackendReadiness = (): BackendReadiness => ({
  mode: 'placeholder',
  notes: ['TODO: backend foundation is intentionally deferred by the specs.']
});
