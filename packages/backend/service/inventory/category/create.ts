import db from "../../../lib/models";
import type { IData } from ".";

export default async function create(record: IData) {
  return db.inventory.category.create(record);
}
