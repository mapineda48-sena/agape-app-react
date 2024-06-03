import { Sequelize, DataTypes } from "sequelize";
import { toModelName, IModel, IRecord } from "../../lib/models";
import { ModelName as Category } from "./category";
import { ModelName as SubCategory } from "./subcategory";

export const ModelName = toModelName(__filename);

export function define(seq: Sequelize) {
  const product = seq.define<IModel<IProduct>>(
    ModelName,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      isEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      images: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      rating: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2), // 10 dígitos en total, 2 de ellos después del punto decimal
        allowNull: false,
      },
    },
    {
      //paranoid: true
    }
  );

  const category = seq.models[Category];
  const subcategory = seq.models[SubCategory];

  category.hasOne(product, {
    foreignKey: "categoryId",
    onDelete: 'RESTRICT',
  });

  subcategory.hasOne(product, {
    foreignKey: "subcategoryId",
    onDelete: 'RESTRICT',
  });

  product.belongsTo(category, { foreignKey: "categoryId" });
  product.belongsTo(subcategory, { foreignKey: "subcategoryId" });

  return product;
}

/**
 * Types
 */
export type IModelStatic = ReturnType<typeof define>;

export interface IProduct extends IRecord {
  fullName: string;
  isEnabled: boolean;

  images: string[];
  rating: number;
  price: number;
}
