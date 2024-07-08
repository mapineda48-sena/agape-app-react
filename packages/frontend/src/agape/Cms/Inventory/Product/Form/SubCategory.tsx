import { useEffect, useState } from "react";
import { useEmitter } from "components/EventEmitter";
import { Subcategory } from "backend/service/inventory/product";
import Select from "components/Form/Field/Select";
import { useForm } from "components/Form";

export const EVENT_SET_SUBCATEGORIES = Symbol("EVENT_SET_SUBCATEGORIES");
export const EVENT_RESET_SUBCATEGORIES = Symbol("EVENT_RESET_SUBCATEGORIES");

export default function SubCategorySelect() {
  const emitter = useEmitter();
  const form = useForm();
  const [categories, setCategorties] = useState<Subcategory[]>([]);

  useEffect(() => {
    return emitter.on(EVENT_SET_SUBCATEGORIES, (categories: Subcategory[]) => {
      setCategorties(categories);
    });
  }, [emitter, form]);

  useEffect(() => {
    return emitter.on(EVENT_RESET_SUBCATEGORIES, (categories: Subcategory[]) => {
      form.merge({ subcategoryId: 0 });
      setCategorties(categories);
    });
  }, [emitter, form]);

  return (
    <Select.Int name="subcategoryId" label="Subcategoria" required>
      <option value="">Seleccionar</option>
      {categories.map((category, index) => (
        <option key={index} value={category.id}>
          {category.name}
        </option>
      ))}
    </Select.Int>
  );
}
