const app: App;

export default app;

interface App {
  auth: (cb: any) => any;
  push: (pathname: string) => any;
  replace: (pathname: string) => any;
  onUpdate: (cb: (state: Page) => void) => () => void;
}
