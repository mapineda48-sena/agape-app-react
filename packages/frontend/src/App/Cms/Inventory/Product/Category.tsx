import { useEffect, useState } from "react";
import { useEmitter } from "App/EventEmitter";
import { Category, getCategories } from "backend/service/inventory/product";
import { EVENT_SET_SUBCATEGORIES } from "./SubCategory";
import Select from "App/Form/Field/Select";

export default function CategorySelect() {
  const emitter = useEmitter();
  const [categories, setCategorties] = useState<Category[]>([]);

  useEffect(() => {
    emitter.hook({ setCategorties });

    getCategories()
      .then(emitter.setCategorties)
      .catch((error) => console.error(error));
  }, [emitter]);

  return (
    <Select.Int
      label="Categoria"
      name="categoryId"
      required
      onChange={(categoryId) => {
        const { subcategories } =
          categories.find((category) => category.id === categoryId) ?? {};

        emitter.emit(EVENT_SET_SUBCATEGORIES, subcategories ?? []);
      }}
    >
      <option value="">Seleccionar</option>
      {categories.map((category, index) => (
        <option key={index} value={category.id}>
          {category.name}
        </option>
      ))}
    </Select.Int>
  );
}
