import db from "../../../lib/models";

export default async function deleteCategory(idCategory: number) {
  await db.inventory.category.destroy({ where: { id: idCategory } });
}
