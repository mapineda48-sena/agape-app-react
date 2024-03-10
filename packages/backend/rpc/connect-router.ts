import express from "express";
import * as glob from "glob";
import _ from "lodash";
import parseFormData from "./connect-middleware";
import path from "path";

const rpc = {};

const router = express.Router();

router.get("/rpc", (req, res) => res.json(rpc));

loadRpc(router);

export default router;

/**
 * Load Remote Procedure Call
 */
function loadRpc(router: express.Router) {
  const extname = path.extname(__filename);

  const paths = glob
    .sync("rpc/**/*" + extname)
    .filter((path) => !path.includes(".d.") && !path.includes("connect"))
    .map((path) => path.replace(extname, ""))
    .map((path) => path.replace(/[/\\]/g, "/"));

  paths
    .map((path) => [toKeyMap(path), "/" + path])
    .forEach(([key, value]) => _.set(rpc, key, value));

  const imports = paths.map((path) => ["./" + path.replace(/^rpc[/\\]/, ""), "/" + path]);

  const tasks = imports.map(async ([path, pattern]) => {
    return import(path).then(
      (mod: any) =>
        mod.default && router.post(pattern, parseFormData(mod.default))
    );
  });

  Promise.all(tasks).catch((err) => {
    throw err;
  });
}

function toKeyMap(path: string) {
  return path.replace(/^rpc[/\\]/, "").replace(/[/\\]/g, ".");
}
