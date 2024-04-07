import { Sequelize, Transaction } from "sequelize";
import cls from "cls-hooked";
import _ from "lodash";
import * as inventory from "./inventory";
import { waitAuthenticate, defineGet, toPathModel } from "../util/models";

/**
 * Singleton Database
 */
export interface Database {
  readonly inventory: inventory.IModelStatic;
  readonly sequelize: Sequelize;

  readonly Init: (uri: string, resetSchema?: boolean) => Promise<void>;
  readonly transaction: <T>(autoCallback: AutoCallBack<T>) => Promise<T>;
  readonly withTransaction: <T extends CallBack>(cb: T) => T;
}

const db: unknown = { Init: init };
export default db as Database;

/**
 * Define All Proejct Models
 */
export async function init(uri: string, resetSchema = false) {
  /**
   * PostreSQL
   */
  const sequelize = new Sequelize(uri);

  // https://sequelize.org/docs/v6/other-topics/transactions/#automatically-pass-transactions-to-all-queries
  const namespace = cls.createNamespace("agape");
  Sequelize.useCLS(namespace);

  //
  inventory.define(sequelize);

  await waitAuthenticate(sequelize);

  //
  if (resetSchema) {
    await sequelize.dropSchema("public", {});
    await sequelize.createSchema("public", {});
  }

  //
  await sequelize.sync();

  Object.entries(sequelize.models).forEach(([modelName, model]) => {
    const path = toPathModel(modelName);
    _.set(db as {}, path, model);
  });

  defineGet(db, "transaction", (cb: AutoCallBack<unknown>) =>
    sequelize.transaction(cb)
  );

  defineGet(db, "withTransaction", (cb: CallBack) => {
    return (...args: unknown[]) => sequelize.transaction(() => cb(...args));
  });

  defineGet(db, "sequelize", sequelize);

  console.log(db);
}

/**
 * Types
 */
type CallBack = (...args: unknown[]) => PromiseLike<unknown>;
type AutoCallBack<T> = (t: Transaction) => PromiseLike<T>;
