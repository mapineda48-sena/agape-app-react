import _ from "lodash";
import * as inventory from "./inventory";
import { waitAuthenticate, defineGet, toPathModel } from "../util/models";
import type { Sequelize, Transaction } from "sequelize";

/**
 * Singleton Database
 */
export interface Database {
  readonly inventory: inventory.IModelStatic;
  readonly sequelize: Sequelize;

  readonly define: (sequelize: Sequelize) => Promise<void>;
  readonly transaction: <T>(autoCallback: AutoCallBack<T>) => Promise<T>;
  readonly withTransaction: <T extends CallBack>(cb: T) => T;
}

const db: unknown = { define: init };
export default db as Database;

/**
 * Define All Proejct Models
 */
export async function init(sequelize: Sequelize) {
  inventory.define(sequelize);

  await waitAuthenticate(sequelize);
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
