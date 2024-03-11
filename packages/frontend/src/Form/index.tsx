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

const EVENT_ACTION_SUCCESS = Symbol("FORM_EVENT_ACTION_SUCCESS");
const EVENT_ACTION_ERROR = Symbol("FORM_EVENT_ACTION_ERROR");
const EVENT_SET_STATE = Symbol("FORM_EVENT_SET_STATE");

const Context = createContext<any>({});

export default function Form(props: Props) {
  const { action, initState: state = {}, ...core } = props;

  const ref = useRef(useMemo(() => ({ state: {}, emitter: mitt() }), []));
  useMemo(() => (ref.current.state = state as any), [state]);

  useEffect(() => {
    const { emitter } = ref.current;

    return () => {
      emitter.all.clear();
    };
  }, []);

  const { emitter } = ref.current;

  return (
    <Context.Provider value={ref}>
      <form
        {...core}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();

          const {
            current: { state: payload },
          } = ref;

          action(payload)
            .then((res: any) => {
              emitter.emit(EVENT_ACTION_SUCCESS, res);
            })
            .catch((error: any) => {
              emitter.emit(EVENT_ACTION_ERROR, error);
            });
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
    return ref.current.emitter.on(EVENT_SET_STATE, (e: {}) => {
      setState(_.get(e, key) ?? initValue);
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

export function useOnActionSuccess<T>() {
  const ref = useContext(Context);

  const [state, setState] = useState<unknown>();

  useEffect(() => {
    return ref.current.emitter.on(EVENT_ACTION_SUCCESS, (e: unknown) => {
      setState(e);
    });
  }, [ref]);

  return state as undefined | T;
}

export function useOnActionError<T = unknown>() {
  const ref = useContext(Context);

  const [state, setState] = useState<unknown>();

  useEffect(() => {
    return ref.current.emitter.on(EVENT_ACTION_ERROR, (e: unknown) => {
      setState(e);
    });
  }, [ref]);

  return state as undefined | T;
}

export function useEmitter() {
  const ref = useContext(Context);

  return useCallback(
    (event: string, payload: unknown) => {
      ref.current.emitter.emit(event, payload);
    },
    [ref]
  );
}

export function useOnEvent(event: string, cb: any, deps: any = []) {
  const ref = useContext(Context);

  useEffect(() => {
    return ref.current.emitter.on(event, cb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ref, ...deps]);
}

/**
 * Types
 */

interface Props extends Core {
  initState?: unknown;
  action: any;
}

type Core = Omit<JSX.IntrinsicElements["form"], "action">;
