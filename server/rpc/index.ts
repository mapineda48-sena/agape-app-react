import express from "express";
import * as glob from "glob";
import _ from "lodash";
import formidable from "formidable";
import os from "os";
import parseFormData from "./parseFormData";

const paths = glob
  .sync("rcp/**/*.ts")
  .map((path) => path.replace(".ts", ""))
  .map((path) => path.replace(/[/\\]/g, "/"));

const rcp = {};

paths
  .map((path) => [toKeyMap(path), "/" + path])
  .forEach(([key, value]) => _.set(rcp, key, value));

//console.log(paths, rcp);

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

const tmpDir = os.tmpdir();

function loadRcp(router: express.Router) {
  const imports = paths.map((path) => ["../../" + path, "/" + path]);

  const tasks = imports.map(async ([path, pattern]) => {
    return import(path).then((mod: any) =>
      router.post(pattern, (req, res, next) => {
        const form = formidable({ uploadDir: tmpDir });

        form.parse(req, (err, fields, files) => {
          if (err) {
            next(err);
            return;
          }

          const args = parseFormData(fields, files);

          const payload = mod.default(...args);

          res.json(payload);
        });
      })
    );
  });

  Promise.all(tasks).catch((err) => {
    throw err;
  });
}
