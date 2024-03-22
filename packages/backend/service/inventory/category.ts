import db from "../../lib/models";
import type * as ORM from "../orm";

export function findAll() {
  return db.inventory.category.findAll();
}

export async function deleteCategory(idCategory: number) {
  await db.inventory.category.destroy({ where: { id: idCategory } });
}

export async function createCategory(fullName: string) {
  await db.inventory.category.create({ fullName, isEnabled: true });
}

/**
 * Types
 */
export interface IRecord extends ORM.Record {
  fullName: string;
  isEnabled: boolean;
}

export type IModel = ORM.Model<IRecord>;

export type IData = ORM.Model<IRecord, "id">;
