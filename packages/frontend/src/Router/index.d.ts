import { BrowserHistory } from "history";



export default function Router(props: { history: BrowserHistory }): JSX.Element;

export function useRouter(): App;


interface App {
    auth: (cb: any) => any;
    push: (pathname: string) => any;
    replace: (pathname: string) => any;
    onUpdate: (cb: (state: Page) => void) => () => void;
}