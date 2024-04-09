const path = require("path");
const fs = require("fs-extra");
const { glob } = require("glob");

const placeholder = `
/**
 * https://webpack.js.org/guides/dependency-management/#requirecontext
 * 
 * According to the documentation provided at Webpack Dependency Management, this file serves as a placeholder, 
 * instructing Webpack to generate a module at the specified path. The purpose of the JavaScript file is to 
 * prevent the backend code from being loaded into the TypeScript files during the frontend build process using 
 * Create React App (CRA). 
 * 
 * The resources exported by the module are dynamically generated at runtime, utilizing the implementation of 
 * Remote Procedure Call (RPC).
 */
`;

(async () => {
  const old = await glob("service/**/*.js");

  await Promise.all(old.map(async (file) => fs.remove(file)));

  const paths = await glob("service/**/*.ts");

  const js = paths.map((ts) =>
    path.resolve(ts).replace(".ts", ".js").replace(".d", "")
  );

  await Promise.all(js.map(async (file) => fs.outputFile(file, placeholder)));
})().catch((error) => {
  throw error;
});
