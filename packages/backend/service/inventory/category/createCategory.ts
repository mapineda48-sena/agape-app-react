import db from "../../../lib/models";

export default async function createCategory(fullName: string) {
  await db.inventory.category.create({ fullName, isEnabled: true });
}
