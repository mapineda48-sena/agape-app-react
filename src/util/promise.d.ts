export function usePromise<T>(
  cb: T
): T extends (...args: infer A) => Promise<infer R>
  ? [
      { error: unknown; result?: R; previously?: R; isLoading: boolean },
      (...args: A) => void
    ]
  : never;

export function keepInCache<T>(
  cb: T
): T extends (...args: any[]) => Promise<infer R>
  ? () => { error: unknown; result?: R; isLoading: boolean }
  : never;
