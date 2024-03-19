import _ from "lodash";
import mitt from "mitt";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const EVENT_MERGE_STATE = Symbol("FORM_EVENT_MERGE_STATE");
const EVENT_SET_STATE = Symbol("FORM_EVENT_SET_STATE");
const EVENT_SUBMIT = Symbol("FORM_EVENT_SUBMIT");

const Context = createContext<any>({});

export default function Form(props: Props) {
  const { initState: state = {}, ...core } = props;

  const ref = useRef(useMemo(() => ({ state: {}, emitter: mitt() }), []));
  useMemo(() => (ref.current.state = state as any), [state]);

  useEffect(() => {
    const { emitter } = ref.current;

    return () => emitter.all.clear();
  }, []);

  const { emitter } = ref.current;

  return (
    <Context.Provider value={ref}>
      <form
        {...core}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();

          emitter.emit(EVENT_SUBMIT, _.cloneDeep(ref.current.state));
        }}
      />
    </Context.Provider>
  );
}

export function useInput<T>(key: string, initValue: T) {
  const ref = useContext(Context);

  const [state, setState] = useState<T>(
    () => _.get(ref.current.state, key) ?? initValue
  );

  useEffect(() => {
    return ref.current.emitter.on(EVENT_SET_STATE, () => {
      setState(_.get(ref.current.state, key) ?? initValue);
    });
  }, [initValue, key, ref]);

  useEffect(() => {
    return ref.current.emitter.on(EVENT_MERGE_STATE, (src: any) => {
      if (!_.has(src, key)) return;

      setState(_.get(src, key));
    });
  }, [initValue, key, ref]);

  const _setState = useCallback(
    (state: T) => {
      _.set(ref.current.state, key, state);
      setState(state);
    },
    [key, ref]
  );

  return [state, _setState] as const;
}

export function useEmitter(): EmitterProxy {
  const ref = useContext(Context);

  return useMemo(() => {
    const { emitter } = ref.current;

    const on = (event: string, cb: () => void) => emitter.on(event, cb);

    const merge = (src: {}) => {
      _.merge(ref.current.state, src);
      emitter.emit(EVENT_MERGE_STATE, src);
    };

    const onSubmit = (cb: () => void) => emitter.on(EVENT_SUBMIT, cb);

    return new Proxy(emitter, {
      get(emitter: Emitter, event) {
        switch (event) {
          case "on":
            return on;
          case "merge":
            return merge;
          case "onSubmit":
            return onSubmit;
          default:
            return (payload: unknown) => emitter.emit(event, payload);
        }
      },
    });
  }, [ref]);
}

/**
 * Types
 */

interface Props extends Core {
  initState?: unknown;
}

type Core = Omit<JSX.IntrinsicElements["form"], "action">;

type EmitterProxy = {
  [K: string]: (...args: unknown[]) => void;
  //on: (event: string, cb: <T>(payload: T) => void) => () => void;
};

type Emitter = ReturnType<typeof mitt>;
