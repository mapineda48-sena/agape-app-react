import _ from "lodash";
import mitt from "mitt";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const Context = createContext<any>({});

export default function Form(props: Props) {
  const { action, initState = {}, ...core } = props;

  const ref = useRef(useMemo(() => ({ state: {}, emitter: mitt() }), []));
  ref.current.state = initState as {};

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
            .then((res) => {
              emitter.emit("state", res);
            })
            .catch((error) => {
              emitter.emit("error", error);
            });
        }}
      />
    </Context.Provider>
  );
}

export function useInput<T>(key: string) {
  const {
    current: { state: initState, emitter },
  } = useContext(Context);

  const [state, setState] = useState<T>(() => _.get(initState, key));

  useEffect(() => {
    return emitter.on("state", (e: any) => {
      setState(_.get(e, key));
    });
  }, [emitter, key]);

  return [state, setState];
}



/**
 * Types
 */

interface Props extends Core {
  initState?: unknown;
  action: <A extends unknown[], R>(...args: A) => Promise<R>;
}

type Core = Omit<JSX.IntrinsicElements["form"], "action">;
