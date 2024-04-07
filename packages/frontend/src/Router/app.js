import { Suspense } from "react";
import { Action } from "history";
import history from "history/browser";
import { match } from "path-to-regexp";

// Array para almacenar las páginas y sus configuraciones.
const pages = [];
const notFoundIndex = -1;

const initState = {
  Page: () => <Suspense />,
};

// Función que se suscribe a los cambios de la navegación y ejecuta un callback con la página actual.
function onUpdate(cb) {
  // Escuchar los cambios en el historial y ejecutar la callback con la página obtenida.
  const unlisten = history.listen((update) => cb(getPage(update)));

  replace(history.location.pathname);

  // Devolver una función para dejar de escuchar los cambios.
  return unlisten;
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
  if (!state.props) {
    return { Page };
  }

  // Devolver el componente de la página como una función que renderiza el componente con las props.
  return { Page: () => <Page {...props} /> };
}

// Función para definir una ruta y cómo cargar el componente correspondiente.
function use(pattern, import$) {
  const index = pages.length;

  // Agregar la nueva página con su patrón, función de coincidencia y lógica de importación.
  pages.push({
    index,
    match: match(pattern, { sensitive: true }),

    async init(params) {
      await this.import();

      if (!this.getPropsFormServer) {
        return { index };
      }

      try {
        const props = await this.getPropsFormServer(params);
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
      const { default: Component, onProps } = await import$();
      this.Component = Component;
      this.getPropsFormServer = onProps;
    },
  });
}

// Función para cambiar a una nueva ruta con historial de navegación push.
function push(pathname) {
  return find(pathname).then((state) => history.push(pathname, state));
}

// Función para reemplazar la ruta actual en el historial de navegación.
function replace(pathname) {
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

// Objeto app que expone las funciones para ser utilizadas en la aplicación.
const app = {
  use,
  push,
  replace,
  onUpdate,
};

// Exportación del objeto app para su uso en otras partes de la aplicación.
export default app;
