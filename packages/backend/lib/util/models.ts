import path from "path";
import { Sequelize } from "sequelize";

/**
 * Consts
 */
const delimiter = "_";
const root = path.resolve("lib/models");
const ext = path.extname(__filename);

export async function waitAuthenticate(seq: Sequelize): Promise<void> {
  try {
    await seq.authenticate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const code = error?.original?.code;

    if (code !== "57P03" && code !== "ECONNREFUSED") {
      throw error;
    }

    /**
     * In docker compose maybe database is not ready when try connect
     * try again
     */
    console.log("the database system is starting up");
    await wait(500);
    return waitAuthenticate(seq);
  }
}

export async function wait(time: number) {
  return new Promise((res) => {
    setTimeout(res, time);
  });
}

export function toModelName(str: string) {
  return str
    .replace(root, "")
    .replace(/^[/\\]/, "")
    .replace(/[/\\]/, delimiter)
    .replace(ext, "");
}

export function toPathModel(modelName: string) {
  return modelName.replace(delimiter, ".");
}

export function defineGet(target: unknown, key: string, value: unknown) {
  console.log(`define ${key}`);
  Object.defineProperty(target, key, {
    configurable: false,
    value,
  });
}
