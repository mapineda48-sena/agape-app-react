import { useEmitter } from "Events";
import _ from "lodash";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const initState = {};

const Context = createContext<unknown>(null);

export default function Form(props: Props) {
  const { initState: state = initState, ...core } = props;

  const emitter = useEmitter();
  const ref = useRef(state as {});

  const form = useMemo(() => {
    const EVENT_MERGE_STATE = Symbol("FORM_EVENT_MERGE_STATE");
    const EVENT_SET_STATE = Symbol("FORM_EVENT_SET_STATE");
    const EVENT_SUBMIT = Symbol("FORM_EVENT_SUBMIT");

    const submit = (payload: unknown) => emitter.emit(EVENT_SUBMIT, payload);
    const onSubmit = (cb: () => void) => emitter.on(EVENT_SUBMIT, cb);

    const init = (key: string, value: unknown) => {
      if (!_.has(ref.current, key)) {
        _.set(ref.current, key, value);

        return value;
      }

      _.get(ref.current, key);
    };

    const get = (key: string) => _.get(ref.current, key);

    const set = (state: {}) => {
      ref.current = state;
      emitter.emit(EVENT_SET_STATE);
    };

    const merge = (state: {}) => {
      _.merge(ref.current, state);
      emitter.emit(EVENT_MERGE_STATE, state);
    };

    const onSet = (key: string, initValue: unknown, set: SetKey) => {
      return emitter.on(EVENT_SET_STATE, () => {
        if (!_.has(ref.current, key)) {
          _.set(ref.current, key, initValue);
          set(initValue);

          return;
        }

        const value = _.get(ref.current, key);

        set(value);
      });
    };

    const onMerge = (key: string, set: SetKey) => {
      return emitter.on(EVENT_MERGE_STATE, () => {
        if (!_.has(ref.current, key)) return;

        const value = _.get(ref.current, key);

        set(value);
      });
    };

    const setInput = (key: string, set: SetKey) => {
      return (state: unknown) => {
        _.set(ref.current, key, state);

        set(state);
      };
    };

    return {
      submit,
      get,
      set,
      init,
      merge,
      onSubmit,
      onSet,
      onMerge,
      setInput,
    };
  }, [emitter]);

  useMemo(() => {
    if (ref.current === state) return;

    form.set(state as {});
  }, [form, state]);

  return (
    <Context.Provider value={form}>
      <form
        {...core}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.submit(_.cloneDeep(ref.current));
        }}
      />
    </Context.Provider>
  );
}

export function useInput<T>(key: string, initValue: T) {
  const form = useContext(Context) as IForm<{}>;

  const [state, setState] = useState<T>(() => form.init(key, initValue));

  useEffect(() => form.onSet(key, initValue, setState), [form, initValue, key]);
  useEffect(() => form.onMerge(key, setState), [form, key]);

  const setInput = useMemo(() => form.setInput(key, setState), [form, key]);

  return [state, setInput] as const;
}

export function useForm<S = {}>() {
  return useContext(Context) as IForm<S>;
}

/**
 * Types
 */

interface Props extends Core {
  initState?: unknown;
}

type Core = Omit<JSX.IntrinsicElements["form"], "action">;

export interface IForm<S> {
  submit: (payload: S) => void;
  set: (state: S) => void;
  merge: (state: Partial<S>) => void;

  onSubmit: (cb: (state: S) => void) => () => void;

  get: <T = unknown>(key: string) => T;
  init: <T = unknown>(key: string, value: T) => T;
  onSet: <T>(key: string, value: T, set: (value: T) => void) => () => void;
  onMerge: <T>(key: string, set: (value: T) => void) => () => void;
  setInput: <T>(key: string, set: (state: T) => void) => (state: T) => void;
}

type SetKey = (state?: unknown) => void;
