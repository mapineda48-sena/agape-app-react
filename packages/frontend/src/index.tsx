import ReactDOM, { hydrateRoot } from "react-dom/client";
import history from "history/browser";
import bootApp from "App";
import reportWebVitals from "util/reportWebVitals";

import "./assets/styles/index.css";
import { root, tryGetProps } from "root";

(async () => {
  const App = await bootApp(history, tryGetProps());

  if (process.env.NODE_ENV === "development") {
    ReactDOM.createRoot(root).render(<App />);
  } else {
    hydrateRoot(root, <App />);
  }

  reportWebVitals();
})().catch((error) => {
  /**
   * Error Boot React App
   */
  console.error(error);
  root.remove();
  document.body.append("Something Wrong...");
});
