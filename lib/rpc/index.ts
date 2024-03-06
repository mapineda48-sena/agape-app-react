import express from "express";
import * as glob from "glob";
import _ from "lodash";
import parseFormData from "./formData";

const paths = glob
  .sync("rcp/**/*.ts")
  .map((path) => path.replace(".ts", ""))
  .map((path) => path.replace(/[/\\]/g, "/"));

const rcp = {};

paths
  .map((path) => [toKeyMap(path), "/" + path])
  .forEach(([key, value]) => _.set(rcp, key, value));

/**
 * Express Route
 */

const router = express.Router();

router.get("/rcp", (req, res) => res.json(rcp));

loadRcp(router)

export default router;


/**
 *
 */
function toKeyMap(path: string) {
  return path.replace(/^rcp[/\\]/, "").replace(/[/\\]/g, ".");
}

function loadRcp(router: express.Router) {
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
