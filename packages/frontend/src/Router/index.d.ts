interface IRouter {
  (): JSX.Element;
  use: <T extends ComponentType<any>>(
    path: string,
    load: () => Promise<{ default: T }>
  ) => void;
}

function Router(
  BaseUrl?: (props: { children: JSX.Element }) => JSX.Element
): IRouter;

export default Router;

export function useBaseUrl(): (path: string) => void;
