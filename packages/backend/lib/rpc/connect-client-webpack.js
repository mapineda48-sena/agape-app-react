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
exports.service = (async () => webpackModule.keys().forEach(await service()))();

// Backend Server Configuration
// Determines the base URL depending on the environment (production or development)
const baseURL =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000";

// Fetches the available resources for the context created with Webpack and defines the function names
// It creates endpoints for remote procedure calls and returns a function required by the module
async function service() {
  const { default: axio$ } = await import("axios");
  const { default: toForm } = await import("./connect-client-form");
  const { ApiKey, ApiKeyHeader, rpc } = await import("./connect-config");

  const axios = axio$.create({
    baseURL,
    headers: {
      [ApiKeyHeader]: ApiKey,
    },
  });

  const { data: serviceModule } = await axios.get(rpc);

  return (moduleName) => {
    const module = webpackModule(moduleName);

    Object.entries(serviceModule[moduleName]).map(([exportName, endpoint]) => {
      const fn = (...args) =>
        axios.post(endpoint, toForm(args)).then((res) => res.data);

      Object.defineProperty(module, exportName, {
        value: fn,
        enumerable: false,
        configurable: false,
        writable: false,
      });
    });
  };
}
