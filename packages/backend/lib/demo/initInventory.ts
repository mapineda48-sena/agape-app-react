import category from "./category.json";
import Database from "../models";

export default async function populateData() {
  return Promise.all(
    Object.entries(category).map(async ([category, subcategories]) => {
      const record = await Database.inventory.category.create({
        fullName: category,
        isEnabled: true,
      });

      const categoryId = record.getDataValue("id");

      for (let index = 0; index < subcategories.length; index++) {
        const subcategory = subcategories[index];

        await Database.inventory.subcategory.create({
          fullName: subcategory,
          isEnabled: true,
          categoryId,
        });
      }
    })
  );
}
