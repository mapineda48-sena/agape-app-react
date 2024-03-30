import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/index.css";
import { service } from "backend";
import ApplicationEvent from "ApplicationEvent";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

/**
 * https://github.com/facebook/react/issues/24502
 */
const AppMode =
  process.env.NODE_ENV === "development" ? React.Fragment : React.StrictMode;

(async () => {
  await service;
  const { default: App } = await import("./Router/Router");
  const { default: reportWebVitals } = await import("./reportWebVitals");

  //const App = () => <span>Hello</span>

  /**
   * Boot React App
   */
  root.render(
    <AppMode>
      <ApplicationEvent>
        <App />
      </ApplicationEvent>
    </AppMode>
  );

  /**
   * If you want to start measuring performance in your app, pass a function
   * to log results (for example: reportWebVitals(console.log))
   * or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
   */
  reportWebVitals();
})().catch((error) => {
  /**
   * Error Boot React App
   */
  console.error(error);
  root.render(
    <React.StrictMode>
      <span>Ups... Something Wrong</span>
    </React.StrictMode>
  );
});

//import "./Router.v2/pages"
