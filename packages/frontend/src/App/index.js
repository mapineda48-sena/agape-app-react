import { createContext, useContext, useState, useEffect, Fragment, StrictMode } from "react";
import { Action } from "history";
import { match } from "path-to-regexp";
import { isAuth } from "backend/service/auth";
import EventEmitter from "App/EventEmitter";
import imports from "./pages";

export const routes = imports;

export const Context = createContext(null);

/**
 * Server
 */
export function Server(props) {
    return <Context.Provider value={{ ...props, auth: () => { } }}>
        {props.children}
    </Context.Provider>
}




/**
 * Browser Boot
 */

/**
 * https://github.com/facebook/react/issues/24502
 */
const AppMode =
    process.env.NODE_ENV === "development" ? Fragment : StrictMode;

/**
 * Not found Index
 */
const notFoundIndex = -1;

// Array para almacenar las páginas y sus configuraciones.  
const pages = imports.map(([pattern, import$], index) => {
    return {
        index,
        match: match(pattern, { sensitive: true }),

        async init(params) {
            await this.import();

            if (!this.onPropsPage) {
                return { index };
            }

            try {
                const props = await this.onPropsPage(params);
                return { index, props };
            } catch (error) {
                return { index, props: { error } };
            }
        },

        async import() {
            if (this.Component) {
                return;
            }

            // Importar el componente y una función opcional para obtener props desde el servidor.
            const { default: Component, onPropsPage } = await import$();
            this.Component = Component;
            this.onPropsPage = onPropsPage;
        },
    }
});

export default async function bootApp(history, initProps = null) {
    const initState = {};

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const res = page.match(history.location.pathname);

        if (!res) {
            continue;
        }

        await page.import();
        const { Component, onPropsPage } = page;

        const props = initProps ?? onPropsPage ? await onPropsPage() : {};

        initState.Page = () => <Component {...props} />;
        history.replace(history.location.pathname, { index: i, props });

        break;
    }

    // Función que se suscribe a los cambios de la navegación y ejecuta un callback con la página actual.
    function onUpdate(cb) {
        return history.listen((update) => cb(getPage(update)));
    }

    // Función para obtener la página actual basándose en la ubicación y la acción del historial.
    function getPage({ location: { state }, action }) {
        // Si no hay estado o la acción es Pop, reemplazar la ruta actual en el historial.
        if (!state || action === Action.Pop) {
            replace(history.location.pathname);
        }

        if (!state) {
            return initState;
        }

        const { index, props } = state;

        if (index === notFoundIndex) {
            return { Page: () => <div>Not Found</div> };
        }

        const { Component: Page } = pages[index];

        // Si no hay props, devolver el componente de la página como está.
        if (!props) {
            return { Page };
        }

        // Devolver el componente de la página como una función que renderiza el componente con las props.
        return { Page: () => <Page {...props} /> };
    }

    let last = "/cms";

    function auth(cb) {
        return (arg) => cb(arg).then(() => {
            replace(last)
        })
    }

    function isCMS(pathname) {
        if (pathname.startsWith("/cms") && !isAuth) {
            last = pathname;
            return "/login";
        }

        return pathname;
    }

    // Función para cambiar a una nueva ruta con historial de navegación push.
    function push(pathname) {
        pathname = isCMS(pathname);

        return find(pathname).then((state) => history.push(pathname, state));
    }

    // Función para reemplazar la ruta actual en el historial de navegación.
    function replace(pathname) {
        pathname = isCMS(pathname);

        return find(pathname).then((state) => history.replace(pathname, state));
    }

    // Función para encontrar la configuración de una página basada en la ruta.
    function find(pathname) {
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const res = page.match(pathname);

            if (!res) {
                continue;
            }

            return page.init(res.params);
        }

        return Promise.resolve({ index: notFoundIndex });
    }

    const app = {
        auth,
        push,
        replace,
        onUpdate,
        get pathname() {
            return history.location.pathname
        }
    };

    return () => {
        const [{ Page }, setPage] = useState(initState);

        useEffect(() => app.onUpdate(setPage), []);

        return (
            <AppMode>
                <Context.Provider value={app}>
                    <EventEmitter>
                        <Page />
                    </EventEmitter>
                </Context.Provider>
            </AppMode>
        );
    };
}

export function useRouter() {
    return useContext(Context);
}