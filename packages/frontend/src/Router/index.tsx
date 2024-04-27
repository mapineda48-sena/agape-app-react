import {
  Suspense,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import router from "./app";

export const Context = createContext(router.push);

const initState = {
  Page: () => <Suspense />,
};

export default function Router() {
  const [{ Page }, setPage] = useState(initState);

  useEffect(() => router.onUpdate(setPage), []);

  return (
    <Context.Provider value={router.push}>
      <Page />
    </Context.Provider>
  );
}

export function useLocation() {
  return useContext(Context);
}
