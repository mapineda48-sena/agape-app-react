import db from "../../../lib/models";

export default function findAll() {
  return db.inventory.category.findAll();
}
