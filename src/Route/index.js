import history from "history/browser";
import { pathToRegexp } from "path-to-regexp";
import { createContext, useContext, useEffect, useState } from "react";

const route = Symbol();

const BaseUrlContext = createContext("");

export default function InitRoute(BaseUrl) {
  const Elements = [];
  const SubRoutes = [];

  function setContext(baseUrl, Component) {
    const Element = () => (
      <BaseUrlContext.Provider value={baseUrl}>
        <Component />
      </BaseUrlContext.Provider>
    );

    if (!BaseUrl) {
      return Element;
    }

    return () => (
      <BaseUrlContext.Provider value={baseUrl}>
        <BaseUrl>
          <Element />
        </BaseUrl>
      </BaseUrlContext.Provider>
    );
  }

  /**
   * @returns Function Component
   */
  function Route() {
    const baseUrl = useContext(BaseUrlContext);

    const [{ path: currentChunk, Component }, setState] = useState({
      Component: () => null,
    });

    useEffect(() => {
      const onChangePathName = ({ location }) => {
        const chunk = removeBaseUrl(baseUrl, location.pathname);

        const Element = Elements.find(({ path }) => path === chunk);

        if (Element) {
          if (currentChunk === chunk) {
            return;
          }

          console.log({ chunk, currentChunk, baseUrl, location, Elements, SubRoutes });

          setState({
            path: chunk,
            Component: setContext(baseUrl, Element.Component),
          });
          return;
        }

        const Nested = SubRoutes.find(({ path }) => chunk.startsWith(path));

        if (!Nested) {
          if (currentChunk === chunk) {
            return;
          }

          console.log({ chunk, currentChunk, baseUrl, location, Elements, SubRoutes });

          setState({ path: chunk, Component: NotFound });
          return;
        }

        if (currentChunk === Nested.path) {
          return;
        }

        console.log({ chunk, currentChunk, baseUrl, location, Elements, SubRoutes });

        setState({
          path: Nested.path,
          Component: setContext(baseUrl + Nested.path, Nested.Component),
        });
      };

      onChangePathName(history);

      return history.listen(onChangePathName);
    }, [baseUrl, currentChunk]);

    return <Component />;
  }

  Route[route] = route;

  Route.use = function push(path, Component) {
    const Nested = route in Component ? SubRoutes : Elements;

    const index = Nested.push({ path, Component });

    return {
      lazy() {
        Nested[index].isLazy = true;
      },
    };
  };

  return Route;
}

export function useBaseUrl() {
  const baseUrl = useContext(BaseUrlContext);

  return (path) => history.push(baseUrl + path);
}

function NotFound() {
  return <div>Not Found</div>;
}

function removeBaseUrl(pattern, pathname) {
  if (!pattern) {
    return pathname;
  }

  const regexp = pathToRegexp(pattern);

  return pathname.replace(pattern, "");
}