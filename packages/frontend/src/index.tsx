import React from "react";
import ReactDOM from "react-dom/client";
import { sync } from "backend/service/auth";
import "./assets/styles/index.css";

const root = document.getElementById("root") as HTMLElement;

/**
 * https://github.com/facebook/react/issues/24502
 */
const AppMode =
  process.env.NODE_ENV === "development" ? React.Fragment : React.StrictMode;

(async () => {
  await sync;

  const [App, reportWebVitals] = await Promise.all([
    import("./App").then((m) => m.default),
    import("./reportWebVitals").then((m) => m.default),
  ]);

  /**
   * Boot React App
   */
  ReactDOM.createRoot(root).render(
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
  root.remove();
  document.body.append("Something Wrong...");
});
