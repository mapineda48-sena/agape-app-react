const path = require("path");
const fs = require("fs-extra");
const { glob } = require("glob");
const { toPosix, toServiceEndpoint } = require(".");

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

const makeRcp = require.resolve("./client");

(async () => {
  const old = await glob("service/**/*.js");

  await Promise.all(old.map(async (file) => fs.remove(file)));

  const paths = await glob("service/**/*.ts");

  await Promise.all(paths.map(async (ts) => {
    if (ts.includes(".d")) {
      return;
    }

    const jsData = [placeholder];

    const filename = path.resolve(ts);
    const dirname = path.dirname(filename);
    const client = path.relative(dirname, makeRcp);

    jsData.push(`import makeRcp from "${client}"\n`);

    const module = await import(filename);
    const baseUrl = toServiceEndpoint(toPosix(ts));
    const js = path.resolve(ts).replace(".ts", ".js");

    Object.entries(module).filter(([, value]) => typeof value === "function").forEach(([fn]) => {
      const endpoint = baseUrl + "/" + fn;

      jsData.push(`export const ${fn} = makeRcp("${endpoint}");`);
    })

    return fs.outputFile(js, jsData.join("\n"));
  }));

  await auth();

})().catch((error) => {
  throw error;
});

async function auth() {
  await fs.outputFile("service/auth.js", `
  import makeRcp from "../lib/rpc/client.js"

  export let isAuth = false;

  export const login = makeRcp("/service/auth/login");
  export const isAuthenticated = makeRcp("/service/auth/isAuthenticated");
  export const logout = makeRcp("/service/auth/logout");

  export const sync = isAuthenticated().then(state => {
      isAuth = state
  }).catch(error => { })
  `)
}