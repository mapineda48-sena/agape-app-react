import express from "express";
import { glob } from "glob";
import _ from "lodash";
import parseFormData from "./connect-middleware";
import path from "path";
import { rpc as endpoint } from "./connect-config";

const rpc = {};
const router = express.Router();
router.get(endpoint, (req, res) => res.json(rpc));

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

    if (!("default" in module)) {
      return;
    }

    const service = filename.replace(extname, "").replace(/[/\\]/g, "/");

    const pattern = "/" + service;

    router.post(pattern, parseFormData(module.default));

    const propPath = service
      .replace(/^service[/\\]/, "")
      .replace(/[/\\]/g, ".");

    _.set(rpc, propPath, pattern);
  });

  await Promise.all(imports);
})()
  // pass error to main process
  .catch((error) => {
    throw error;
  });
