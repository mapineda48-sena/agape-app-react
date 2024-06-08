import { useEffect, useState } from "react";
import { useEmitter } from "components/EventEmitter";
import { Category, getCategories } from "backend/service/inventory/product";
import {
  EVENT_RESET_SUBCATEGORIES,
  EVENT_SET_SUBCATEGORIES,
} from "./SubCategory";
import Select from "components/Form/Field/Select";
import { useForm } from "components/Form";

export default function CategorySelect() {
  const form = useForm();
  const emitter = useEmitter();
  const [categories, setCategorties] = useState<Category[]>([]);

  useEffect(() => {
    emitter.hook({ setCategorties });

    getCategories()
      .then((res) => {
        const categoryId = form.get("categoryId");

        if (!categoryId) {
          return res;
        }

        const { subcategories } = res.find(
          (category) => category.id === categoryId
        ) ?? { subcategories: [] };

        emitter.emit(EVENT_SET_SUBCATEGORIES, subcategories);

        return res;
      })
      .then(emitter.setCategorties)
      .catch((error) => console.error(error));
  }, [emitter, form]);

  return (
    <Select.Int
      label="Categoria"
      name="categoryId"
      required
      onChange={(categoryId) => {
        const { subcategories } = categories.find(
          (category) => category.id === categoryId
        ) ?? { subcategories: [] };

        console.log({
          categoryId,
          subcategories,
          categories,
        });

        emitter.emit(EVENT_RESET_SUBCATEGORIES, subcategories ?? []);
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
