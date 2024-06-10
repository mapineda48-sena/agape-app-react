import fs from "fs-extra";
import path from "path";
import products from "./data/products.json";
import Database from "../../models";

export default async function populateData() {
  const getImages = await tryGetDemoImages();
  return Promise.all(
    Object.entries(products).map(async ([category, subcategories]) => {
      const category$ = await Database.inventory.category.create({
        fullName: category,
        isEnabled: true,
      });

      for (let index = 0; index < subcategories.length; index++) {
        const subcategory = subcategories[index].SubCategory;

        const subcategory$ = await Database.inventory.subcategory.create({
          fullName: subcategory,
          isEnabled: true,
          categoryId: category$.getDataValue("id"),
        });

        await Promise.all(
          subcategories[index].Products.map((product) =>
            Database.inventory.product.create({
              fullName: product.fullName,
              slogan: product.slogan,
              description: product.description,
              isEnabled: true,
              images: getImages(category, subcategory, product.fullName),
              price: product.price,
              rating: randomRating(),

              categoryId: category$.getDataValue("id"),
              subcategoryId: subcategory$.getDataValue("id"),
            })
          )
        );
      }
    })
  );
}

export function randomRating() {
  return Math.floor(Math.random() * 6);
}

export async function tryGetDemoImages() {
  try {
    const storage = await fs.readJSON(path.resolve(".data/storage.json"));
    return (category: string, subcategory: string, product: string) =>
      storage[category][subcategory][product];
  } catch (e) {
    return () => [];
  }
}
