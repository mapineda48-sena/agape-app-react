interface Route {
  (): JSX.Element;
  use: (path: string, Component: () => JSX.Element) => void;
}

function InitRoute(
  BaseUrl?: (props: { children: JSX.Element }) => JSX.Element
): Route;

export default InitRoute;

export function useBaseUrl(): (path: string) => void;
