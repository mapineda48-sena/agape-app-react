import express from "express";
import { glob } from "glob";
import _ from "lodash";
import parseFormData, { isRpcApiKey } from "./connect-middleware";
import path from "path";
import { rpc as endpoint } from "./connect-config";

const rpc: any = {};
const router = express.Router();
router.get(endpoint, (req, res, next) => {
  if (!isRpcApiKey(req)) return next();

  res.json(rpc);
});

export default router;

/**
 * Load Remote Procedure Call
 */
(async function loadRemoteProcedureCall() {
  const extname = path.extname(__filename);
  const paths = await glob("service/**/*" + extname);

  const imports = paths.map(async (filename) => {
    if (filename.includes(".d.")) {
      return;
    }

    const module = await import(path.resolve(filename));

    const exports = Object.entries(module).filter(
      ([, fn]) => typeof fn === "function"
    );

    if (!exports.length) {
      return;
    }

    const service = filename.replace(/[/\\]/g, "/").replace(extname, "");
    const webpackModule = service.replace("service/", "./") + ".js";

    rpc[webpackModule] = {};

    exports.forEach(([exportName, fn]) => {
      const pattern = "/" + service + "/" + exportName;

      router.post(pattern, parseFormData(fn as any));

      rpc[webpackModule][exportName] = pattern;
    });
  });

  await Promise.all(imports);
  console.log(rpc);
})()
  // pass error to main process
  .catch((error) => {
    throw error;
  });
