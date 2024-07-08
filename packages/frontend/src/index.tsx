import ReactDOM, { hydrateRoot } from "react-dom/client";
import history from "history/browser";
import bootApp from "app";
import reportWebVitals from "util/reportWebVitals";

import "./assets/styles/index.css";
import { root, tryGetProps } from "root";

bootApp(history, tryGetProps())
  .then((App) => {
    render(<App />);
    reportWebVitals();
  })
  .catch((error) => {
    console.error(error);
    root.remove();
    document.body.append("Something Wrong...");
  });

function render(App: JSX.Element) {
  if (process.env.NODE_ENV === "development") {
    ReactDOM.createRoot(root).render(App);
  } else {
    hydrateRoot(root, App);
  }
}
