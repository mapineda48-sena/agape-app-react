import { useCallback, useEffect, useState } from "react";

export default function factory(cb) {
  return () => {
    const [state, setState] = useState({});

    const call = useCallback(
      (...args) => setState((state) => ({ ...state, args })),
      [setState]
    );

    const { error, result, previously, args } = state;

    useEffect(() => {
      if (!args) return;

      let set = (state) =>
        setState(({ result }) => ({ ...state, previously: result }));

      cb(...args)
        .then((result) => set && set({ result }))
        .catch((error) => set && set({ error }));

      return () => {
        set = null;
      };
    }, [args]);

    return [{ error, result, previously, isLoading: Boolean(args) }, call];
  };
}

export function usePromise(cb) {
  const [state, setState] = useState({});

  const call = useCallback(
    (...args) => setState((state) => ({ ...state, args })),
    [setState]
  );

  const { error, result, previously, args } = state;

  useEffect(() => {
    if (!args) return;

    let set = (state) =>
      setState(({ result }) => ({ ...state, previously: result }));

    cb(...args)
      .then((result) => set && set({ result }))
      .catch((error) => set && set({ error }));

    return () => {
      set = null;
    };
  }, [args, cb]);

  return [{ error, result, previously, isLoading: Boolean(args) }, call];
}

export function keepInCache(cb) {
  let cache;

  return () => {
    const [state, setState] = useState({
      result: cache,
      isLoading: Boolean(cache),
    });

    useEffect(() => {
      if (cache) return;

      let set = (state) =>
        setState(({ result }) => ({ ...state, previously: result }));

      cb()
        .then((result) => set && set({ result }))
        .catch((error) => set && set({ error }));

      return () => {
        set = null;
      };
    }, []);

    return state;
  };
}
