import { Sequelize, Model, DataTypes, ModelStatic } from "sequelize";
import * as Integration from "../../../service/inventory/category";
import { toModelName } from "../../util/models";

export const ModelName = toModelName(__filename);

export function define(seq: Sequelize) {
  const category = seq.define<Model<Integration.IModel>>(
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
    },
    {
      //paranoid: true
    }
  );

  return category;
}

/**
 * Types
 */
export type IModel = Model<Integration.IRecord, Integration.IData>;
export type IModelStatic = ModelStatic<IModel>;