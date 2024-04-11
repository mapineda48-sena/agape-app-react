import path from "path";
import { Sequelize } from "sequelize";
import ms from "ms";

const unlockTime = ms("15s");

/**
 * Consts
 */
const delimiter = "_";
const root = path.resolve("models");
const ext = path.extname(__filename);

export async function sync(sequelize: Sequelize, resetSchema = false) {
  try {
    // Crear la schema de bloqueo
    await sequelize.query('CREATE SCHEMA "lockAgape"');

    console.log(`Worker ${process.pid}: sync database`);

    if (resetSchema) {
      await sequelize.dropSchema("public", {});
      await sequelize.createSchema("public", {});
    }

    // Aquí tu lógica de sincronización o lo que necesites hacer
    await sequelize.sync();

    const unlock = () =>
      sequelize.dropSchema("lockAgape", {}).catch(console.error);
      
    setTimeout(unlock, unlockTime);
  } catch (error) {
    console.log(`Worker ${process.pid}: skip sync database`);
    //skip error
  }
}

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

/**
 * Types
 */
import type { Model } from "sequelize";

export interface IRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IModel<R extends IRecord> = Model<
  Omit<R, "createdAt" | "updatedAt">,
  Omit<R, "createdAt" | "updatedAt" | "id">
>;
