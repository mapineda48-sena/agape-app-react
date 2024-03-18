import { Sequelize } from "sequelize";
import populateInventory from "./initInventory";
import { waitAuthenticate } from "../util/models";

export async function resetSchema(sequelize: Sequelize) {
  await waitAuthenticate(sequelize);
  await sequelize.dropSchema("public", {});
  await sequelize.createSchema("public", {});
}

export async function populateSchema() {
  await populateInventory();
}
