import ReactDOM, { hydrateRoot } from "react-dom/client";
import history from "history/browser";
import { isAuthenticated } from "backend/service/auth";
import bootApp from "App";
import reportWebVitals from "util/reportWebVitals";

import "./assets/styles/index.css";

const root = document.getElementById("root") as HTMLElement;

(async () => {
  try {
    await isAuthenticated();
  } catch (error) {

  }

  const App = await bootApp(history, null);

  if (process.env.NODE_ENV === "development") {
    ReactDOM.createRoot(root).render(
      <App />
    );
  } else {
    hydrateRoot(root, <App />)
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
