import { Sequelize } from "sequelize";
import * as category from "./category";
import * as subcategory from "./subcategory";

export function define(sequelize: Sequelize) {
  category.define(sequelize);
  subcategory.define(sequelize);
}

/**
 * Types
 */
export interface IModelStatic {
  category: category.IModelStatic;
  subcategory: subcategory.IModelStatic;
}
