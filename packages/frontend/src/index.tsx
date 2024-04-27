import ReactDOM, { hydrateRoot } from "react-dom/client";
import history from "history/browser";
import { isAuthenticated } from "backend/service/auth";
import App from "App";
import reportWebVitals from "util/reportWebVitals";

import "./assets/styles/index.css";

const root = document.getElementById("root") as HTMLElement;

(async () => {
  try {
    await isAuthenticated();
  } catch (error) {

  }

  if (process.env.NODE_ENV === "development") {
    ReactDOM.createRoot(root).render(
      <App history={history} />
    );
  } else {
    hydrateRoot(root, <App history={history} />)
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
