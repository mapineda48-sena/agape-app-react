/**
 * Remote Procedure Call (RPC) Implementation
 *
 * This code demonstrates how to dynamically load and execute modules at runtime using Webpack's require.context method, as per the Webpack Dependency Management guide (https://webpack.js.org/guides/dependency-management/#requirecontext).
 * It implements an RPC system where the module resources are generated and managed dynamically.
 */

// Create a context for all files in the './service' directory, including subdirectories, that end with '.js'
var webpackModule = require.context("../../service", true, /\.js$/);

// Asynchronously load and execute each module when the resource is loaded in the browser
// This will invoke the require function for each file matching the context
exports.service = (async () => {
  webpackModule.keys().forEach(await service());
  await isAuthenticated();
})();

// Backend Server Configuration
// Determines the base URL depending on the environment (production or development)
const baseURL =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000";

// Fetches the available resources for the context created with Webpack and defines the function names
// It creates endpoints for remote procedure calls and returns a function required by the module
async function service() {
  const { default: axio$ } = await import("axios");
  const { default: toForm } = await import("./form/browser");
  const { ApiKey, ApiKeyHeader, rpc } = await import("./config");

  const axios = axio$.create({
    baseURL,
    headers: {
      [ApiKeyHeader]: ApiKey,
    },
  });

  const { data: buffer } = await axios.post(rpc, undefined, {
    responseType: "blob",
  });

  const serviceModule = JSON.parse(await buffer.text());

  return (moduleName) => {
    const module = webpackModule(moduleName);

    Object.entries(serviceModule[moduleName]).map(([exportName, endpoint]) => {
      readOnly(module, exportName, (...args) => {
        return axios
          .post(endpoint, toForm(args), { withCredentials: true })
          .then((res) => res.data);
      });
    });
  };
}

async function isAuthenticated() {
  const { AuthModuluName } = await import("./config");
  const module = webpackModule(AuthModuluName);

  let isAuth = false;

  try {
    isAuth = await module.isAuthenticated();
  } catch (error) {}

  readOnly(module, "isAuth", isAuth);
}

function readOnly(module, key, value) {
  Object.defineProperty(module, key, {
    value,
    enumerable: false,
    configurable: false,
    writable: false,
  });
}
