export interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
