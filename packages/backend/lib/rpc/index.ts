import { glob } from "glob";
import _ from "lodash";
import onRpc, { Middlewares } from "./call";
import { onErrorMiddleware } from "./call/error";
import auth from "./auth/server";
import path from "path";

const extname = path.extname(__filename);

export default async function connectService(secret: string) {
  const { router, authenticate} = auth(secret);

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

    const middlewareModule: Middlewares = [];

    if (!serviceModule.startsWith("/service/public")) {
      middlewareModule.push(authenticate);
    }

    exports.forEach(([exportName, fn]) => {
      const endpoint = path.posix.join(serviceModule, exportName);

      router.post(endpoint, ...middlewareModule, onRpc(fn));
    });
  });

  await Promise.all(tasks);

  router.use(onErrorMiddleware);

  return router;
}

export function toServiceEndpoint(file: string) {
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

export function toPosix(path: string) {
  return path.replace(/\\/g, "/");
}

/**
 * Types
 */
type Export = [string, (...args: unknown[]) => unknown];
