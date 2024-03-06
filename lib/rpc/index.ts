import express from "express";
import * as glob from "glob";
import _ from "lodash";
import parseFormData from "./formData";

const paths = glob
  .sync("rpc/**/*.ts")
  .map((path) => path.replace(".ts", ""))
  .map((path) => path.replace(/[/\\]/g, "/"));

const rpc = {};

paths
  .map((path) => [toKeyMap(path), "/" + path])
  .forEach(([key, value]) => _.set(rpc, key, value));

/**
 * Express Route
 */

const router = express.Router();

router.get("/rpc", (req, res) => res.json(rpc));

loadRpc(router)

export default router;


/**
 *
 */
function toKeyMap(path: string) {
  return path.replace(/^rpc[/\\]/, "").replace(/[/\\]/g, ".");
}

function loadRpc(router: express.Router) {
  const imports = paths.map((path) => ["../../" + path, "/" + path]);

  const tasks = imports.map(async ([path, pattern]) => {
    return import(path).then((mod: any) =>
      router.post(pattern, parseFormData(mod.default))
    );
  });

  Promise.all(tasks).catch((err) => {
    throw err;
  });
}
