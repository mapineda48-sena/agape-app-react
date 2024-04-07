import db from "../../lib/models";
import { IProduct } from "../../lib/models/inventory/product";
import Storage from "../../lib/storage";

export async function createProduct(product: NewProduct) {
  const { images, ...dto } = product;

  const imagesTasks = images.map(async (image) => {
    if (typeof image === "string") {
      return image;
    }

    return await Storage.uploadFile(image, image.name);
  });

  await db.inventory.product.create({
    ...dto,
    rating: randomRating(),
    isEnabled: true,
    images: await Promise.all(imagesTasks),
  });
}

export async function getCategories() {
  const categories: unknown = await db.inventory.category.findAll({
    attributes: [["fullName", "name"], "id"],
    include: {
      attributes: [["fullName", "name"], "id"],
      model: db.inventory.subcategory,
      as: "subcategories",
    },
  });

  return categories as Category[];
}

function randomRating() {
  return Math.floor(Math.random() * 6);
}

/**
 * Types
 */

export interface NewProduct extends Omit<IProduct, "images" | "rating"> {
  images: (File | string)[];
}

export interface Category {
  name: string;
  id: number;
  subcategories: Subcategory[];
}

export interface Subcategory {
  name: string;
  id: number;
}
