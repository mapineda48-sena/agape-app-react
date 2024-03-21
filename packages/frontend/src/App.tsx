import React, { useEffect, useState } from "react";
import Form, { useEmitter } from "./Form";
import Input from "./Form/Input";
import {
  createCategory,
  deleteCategory,
  findAll,
  IRecord,
} from "backend/service/inventory/category";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

export default function Foo() {
  return (
    <div className="container mt-5">
      <Form className="row g-3">
        <h2>Categoria</h2>
        <div className="col-md-6">
          <label htmlFor="inputState" className="form-label">
            Nombre
          </label>
          <Input.Text
            name="fullName"
            className="form-control"
            id="fullName"
            placeholder="1234 Main St"
          />
        </div>
        <div className="col-md-2" />
        <div className="col-md-4 d-flex align-items-center justify-content-end">
          <AddNewCategory />
        </div>
        <Categories />
      </Form>
    </div>
  );
}

function AddNewCategory() {
  const form = useEmitter();

  useEffect(() => {
    return form.onSubmit((payload: any) => {
      createCategory(payload.fullName)
        .then(() => {
          form.merge({ fullName: "" });
          form.refreshCategories();
        })
        .catch(form.failAddCategory);
    });
  }, [form]);

  return (
    <button type="submit" className="btn btn-success">
      Agregar
    </button>
  );
}

function Categories() {
  const form = useEmitter();
  const [state, setState] = useState<IRecord[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => form.on("setCategories", setState), [form]);
  useEffect(() => form.on("failLoadCategories", setError), [form]);

  useEffect(() => {
    const refreshCategories = () => {
      findAll().then(form.setCategories).catch(form.failLoadCategories);
    };

    refreshCategories();

    return form.on("refreshCategories", refreshCategories);
  }, [form]);

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nombre</th>
          <th scope="col">Habilitada</th>
          <th scope="col">Fecha</th>
          <th scope="col">Acción</th>
        </tr>
      </thead>
      <tbody>
        {/* Las filas de la tabla se generarían dinámicamente aquí */}
        {state.map((category, index) => {
          return (
            <tr key={index}>
              <td>{category.id}</td>
              <td>{category.fullName}</td>
              <td>{category.isEnabled ? "Si" : "No"}</td>
              <td>{category.updatedAt.toString()}</td>
              <td>
                <DeleteCategory id={category.id} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function DeleteCategory(props: { id: number }) {
  const form = useEmitter();

  return (
    <button
      onClick={() => {
        deleteCategory(props.id)
          .then(form.refreshCategories)
          .catch(form.failDeleteCategory);
      }}
      type="button"
      className="btn btn-danger"
    >
      <MdDelete />
    </button>
  );
}
