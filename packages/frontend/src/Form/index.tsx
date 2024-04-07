import { useEmitter } from "EventEmitter";
import _ from "lodash";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const initState = {};

const Context = createContext<unknown>(null);

export default function Form(props: Props) {
  const { initState: state = initState, merge, onSubmit, ...core } = props;

  const emitter = useEmitter();
  const ref = useRef(state as {});

  const form = useMemo(() => {
    const EVENT_MERGE_STATE = Symbol("FORM_EVENT_MERGE_STATE");
    const EVENT_SET_STATE = Symbol("FORM_EVENT_SET_STATE");
    const EVENT_THEN = Symbol("FORM_EVENT_THEN");
    const EVENT_CATCH = Symbol("FORM_EVENT_CATCH");
    const EVENT_LOADING = Symbol("FORM_EVENT_LOADING");

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
          set(initValue as any);

          return;
        }

        const value = _.get(ref.current, key);

        set(_.clone(value));
      });
    };

    const onMerge = (key: string, set: SetKey) => {
      return emitter.on(EVENT_MERGE_STATE, () => {
        if (!_.has(ref.current, key)) return;

        const value = _.get(ref.current, key);

        set(_.clone(value));
      });
    };

    const setInput = (key: string, setstate: SetKey) => {
      return (state: unknown) =>
        setstate((current) => {
          try {
            const next = typeof state === "function" ? state(current) : state;

            _.set(ref.current, key, next);

            return _.clone(next);
          } catch (error) {
            console.log(error);
            return current;
          }
        });
    };

    const then = (payload: unknown) => emitter.emit(EVENT_THEN, payload);
    const catch$ = (payload: unknown) => emitter.emit(EVENT_CATCH, payload);
    const loading = (state: boolean) => emitter.emit(EVENT_LOADING, state);

    const onThen = (cb: (payload: unknown) => void) =>
      emitter.on(EVENT_THEN, cb);
    const onCatch = (cb: (payload: unknown) => void) =>
      emitter.on(EVENT_CATCH, cb);
    const onLoading = (cb: (payload: boolean) => void) =>
      emitter.on(EVENT_CATCH, cb);

    return {
      get,
      set,
      init,
      merge,
      setInput,
      onSet,
      onMerge,

      then,
      catch: catch$,
      loading,
      onThen,
      onCatch,
      onLoading,
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

          form.loading(true);

          onSubmit(_.cloneDeep(ref.current))
            .then((res) => {
              if (merge) {
                form.merge(res);
              }

              form.then(res);
            })
            .catch(form.catch)
            .finally(() => {
              form.loading(false);
            });
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
  merge?: boolean;
  onSubmit: (...args: any[]) => Promise<any>;
}

type Core = Omit<JSX.IntrinsicElements["form"], "action">;

export interface IForm<S> {
  set: (state: S) => void;
  merge: (state: Partial<S>) => void;
  get: <T = unknown>(key: string) => T;
  init: <T = unknown>(key: string, value: T) => T;
  onSet: <T>(key: string, value: T, set: (value: T) => void) => () => void;
  onMerge: <T>(key: string, set: (value: T) => void) => () => void;
  setInput: <T>(key: string, set: (state: T) => void) => (state: T) => void;

  onThen: (cb: (payload: unknown) => void) => void;
  onCatch: (cb: (payload: unknown) => void) => void;
  onLoading: (cb: (state: boolean) => void) => void;
}

type SetKey = (cb: (state?: unknown) => void) => void;
