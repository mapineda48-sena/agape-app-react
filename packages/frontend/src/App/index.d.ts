import { BrowserHistory } from "history";

export function Server(props: { children: JSX.Element, pathname: string }): JSX.Element;

export default function bootApp(history: BrowserHistory, props: unknown): Promise<() => JSX.Element>;

export function useRouter(): App;


interface App {
    auth: (cb: any) => any;
    push: (pathname: string) => any;
    replace: (pathname: string) => any;
    onUpdate: (cb: (state: Page) => void) => () => void;
    pathname: string;
}