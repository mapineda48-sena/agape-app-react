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

/**
 * 
 * @param local Make sure memo this source
 * @returns emit events proxy
 */
export function useEmitter(local: HookEvent = {}): EmitterProxy {
  const ref = useContext(Context);
  const hook = useRef<LocalEvent>({});

  useEffect(() => {
    console.log("hook events");
    const current = hook.current;
    const emitter = ref.current as Emitter;

    const events = Object.entries(local).map(([event, fn]: any[]) => [
      current[event] ?? (current[event] = Symbol()),
      fn,
    ]);

    if (!events.length) return;

    events.forEach(([e, fn]) => emitter.on(e, fn));

    return () => events.forEach(([e]) => emitter.off(e));
  }, [local, ref]);

  return useMemo(() => {
    const emitter = ref.current as Emitter;

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
  [K: string]: (...args: any[]) => void;
};

type Emitter = ReturnType<typeof mitt>;

type Ref = React.MutableRefObject<unknown>;
