import { createContext, useContext, useEffect, useMemo, useState } from "react";
import history from "history/browser";
import pages, { IPage, IState } from "./pages";
import { useEmitter } from "ApplicationEvent";

const Context = createContext((pathname: string) => {
  console.error(`missing context router`);
});

const initState = {
  Page: () => <span>loading...</span>,
};

export default function Router() {
  const [{ Page }, setPage] = useState(initState);
  const emitter = useEmitter();

  const location = useMemo(() => {
    const EVENT_UPDATE = Symbol("EVENT_UPDATE_PAGE");

    const sync = () => {
      emitter.emit(EVENT_UPDATE, {
        pathname: history.location.pathname,
        isReplace: true,
      });
    };

    const push = (pathname: string) => emitter.emit(EVENT_UPDATE, { pathname });

    const onUpdate = (cb: (event: EventUpdate) => void) =>
      emitter.on(EVENT_UPDATE, cb);

    return { sync, push, onUpdate };
  }, [emitter]);

  useEffect(() => {
    return location.onUpdate((event) => {
      const page: IPage = pages.find(
        (page) => page.pathname === event.pathname
      );

      const update = !event.isReplace
        ? (state: IState) => history.push(event.pathname, state)
        : (state: IState) => history.replace(event.pathname, state);

      page.load(null).then(update).catch(update);
    });
  }, [location]);

  useEffect(() => {
    return history.listen(({ location: { state } }) => {
      if (!state) return location.sync();

      const { index, props } = state as IState;
      const { Component: Page } = pages[index];

      if (!props) {
        setPage({ Page });
        return;
      }

      setPage({ Page: () => <Page {...props} /> });
    });
  }, [location]);

  useEffect(() => location.sync(), [location]);

  return (
    <Context.Provider value={location.push}>
      <Page />
    </Context.Provider>
  );
}

export function useLocation() {
  return useContext(Context);
}

/**
 * Types
 */
interface EventUpdate {
  pathname: string;
  isReplace: boolean;
}
