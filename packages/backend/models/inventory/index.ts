import { Sequelize } from "sequelize";
import * as category from "./category";

export function define(seq: Sequelize) {
  category.define(seq);
}

/**
 * Types
 */
export interface IModelStatic {
  category: category.IModelStatic;
}
