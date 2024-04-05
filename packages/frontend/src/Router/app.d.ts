const app: App;

export default app;

interface App {
  push: (pathname: string) => any;
  replace: (pathname: string) => any;
  onUpdate: (cb: (state: Page) => void) => () => void;
  use: <T extends ComponentType<any>>(
    patten: string,
    load: () => Promise<{ default: T }>
  ) => void;
}
