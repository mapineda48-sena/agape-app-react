import mitt from "mitt";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";

const Context = createContext<Emitter>(null as any);

export default function EventEmitter(props: { children: JSX.Element }) {
  const emitter = useMemo(mitt, []);

  useEffect(() => () => emitter.all.clear(), [emitter]);

  return <Context.Provider value={emitter}>{props.children}</Context.Provider>;
}

export function useEmitter(): EmitterProxy {
  const emitter = useContext(Context);
  const hook = useRef<LocalEvent>({});

  useEffect(() => {
    const event = hook.current;

    return () => Object.values(event).forEach((e) => emitter.off(e));
  }, [emitter]);

  return useMemo(() => {
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
  }, [emitter]);
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
