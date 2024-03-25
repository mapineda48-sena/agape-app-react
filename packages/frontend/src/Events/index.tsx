import mitt from "mitt";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";

const Context = createContext<Ref>({
  current: null,
});

export default function ApplicationEvent(props: { children: JSX.Element }) {
  const ref = useRef(useMemo(() => mitt(), []));

  useEffect(() => ref.current.all.clear(), []);

  return <Context.Provider value={ref}>{props.children}</Context.Provider>;
}

export function useEmitter(): EmitterProxy {
  const ref = useContext(Context);
  const hook = useRef<LocalEvent>({});

  useEffect(() => {
    const event = hook.current;
    const emitter = ref.current as Emitter;

    return () => Object.values(event).forEach((e) => emitter.off(e));
  }, [ref]);

  return useMemo(() => {
    const emitter = ref.current as Emitter;

    const onHook = (handler: HookEvent) => {
      const events = Object.entries(handler).map(
        ([event, fn]) =>
          [hook.current[event] ?? (hook.current[event] = Symbol()), fn] as const
      );

      events.forEach(([e, fn]) => emitter.on(e, fn));
    };

    const on = (event: string, cb: () => void) => {
      emitter.on(event, cb);

      return () => emitter.off(event, cb);
    };

    return new Proxy(
      {},
      {
        get(_, event: string) {
          switch (event) {
            case "on":
              return on;
            case "emit":
              return emitter.emit;
            case "hook":
              return onHook;
            default:
              return (payload: unknown) =>
                emitter.emit(hook.current[event] ?? event, payload);
          }
        },
      }
    );
  }, [ref]);
}

/**
 * Types
 */

type LocalEvent = {
  [x: string]: symbol;
};

type EmitterProxy = {
  readonly [K: string]: (...args: unknown[]) => void;
};

type HookEvent = {
  [K: string]: (...args: unknown[]) => void;
};

type Emitter = ReturnType<typeof mitt>;

type Ref = React.MutableRefObject<unknown>;
