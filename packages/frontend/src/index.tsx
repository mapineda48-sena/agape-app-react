import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { service } from "backend";

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
  const { default: App } = await import("./Agape");
  const { default: reportWebVitals } = await import("./reportWebVitals");

  /**
   * Boot React App
   */
  root.render(
    <AppMode>
      <App />
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
