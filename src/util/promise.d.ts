export default function toHook<T>(
  cb: T
): T extends (...args: infer A) => Promise<infer R>
  ? () => [
      { error: unknown; result?: R; previously?: R; isLoading: boolean },
      (...args: A) => void
    ]
  : never;

export function usePromise<T>(
  cb: T
): T extends (...args: infer A) => Promise<infer R>
  ? [
      { error: unknown; result?: R; previously?: R; isLoading: boolean },
      (...args: A) => void
    ]
  : never;
