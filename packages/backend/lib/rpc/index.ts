import { glob } from "glob";
import _ from "lodash";
import onRpc, { Middlewares, isRpcApiKey } from "./middleware";
import { onErrorMiddleware } from "./middleware/error";
import auth, { Rpc } from "./middleware/auth";
import path from "path";
import { rpc as endpoint } from "./config";
import debug from "../debug";

const extname = path.extname(__filename);

export default async function connectService(secret: string) {
  const { router, authenticate, rpc } = auth(secret);

  const paths = await glob("service/**/*" + extname);

  const tasks = paths.map(toPosix).map(async (file) => {
    if (file.includes(".d.")) {
      return;
    }

    const exports = await import$(file);

    if (!exports.length) {
      return;
    }

    const serviceModule = toServiceEndpoint(file);
    const webpackModule = toServiceWebpack(file);

    const rpcModule: Rpc = (rpc[webpackModule] = {});

    const middlewareModule: Middlewares = [];

    if (!serviceModule.startsWith("/service/public")) {
      //middlewareModule.push(authenticate);
    }

    exports.forEach(([exportName, fn]) => {
      const endpoint = path.posix.join(serviceModule, exportName);

      router.post(endpoint, ...middlewareModule, onRpc(fn));

      rpcModule[exportName] = endpoint;
    });
  });

  await Promise.all(tasks);

  router.use(onErrorMiddleware);

  const buffer = Buffer.from(JSON.stringify(rpc));

  router.post(endpoint, (req, res, next) => {
    if (!isRpcApiKey(req)) return next();

    res.send(buffer);
  });

  debug.primary(rpc);

  return router;
}

function toServiceEndpoint(file: string) {
  return path.posix.join("/", file.replace(extname, ""));
}

function toServiceWebpack(file: string) {
  return file.replace(/^service/, ".").replace(extname, ".js");
}

async function import$(filename: string) {
  const module = await import(path.resolve(filename));

  return Object.entries(module).filter(
    ([, fn]) => typeof fn === "function"
  ) as Export[];
}

function toPosix(path: string) {
  return path.replace(/\\/g, "/");
}

/**
 * Types
 */
type Export = [string, (...args: unknown[]) => unknown];
