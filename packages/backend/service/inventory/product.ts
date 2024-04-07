import db from "../../lib/models";
import { IProduct } from "../../lib/models/inventory/product";

export async function createProduct(product: NewProduct) {
  const { imageFile, ...dto } = product;

  await db.inventory.product.create({
    ...dto,
    rating: randomRating(),
    images: [],
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
  imageFile?: File;
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
