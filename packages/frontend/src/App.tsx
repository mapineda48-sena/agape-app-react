import React, { useEffect, useState } from "react";
import Form, { useEmitter } from "./Form";
import Input from "./Form/Input";
import { create, findAll, IRecord } from "backend/service/inventory/category";
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
          <input
            type="text"
            className="form-control"
            id="inputState"
            placeholder="1234 Main St"
          />
        </div>
        <div className="col-md-2" />
        <div className="col-md-4 d-flex align-items-center justify-content-end">
          <AddNewCategory />
        </div>
      </Form>
    </div>
  );
}

function AddNewCategory() {
  const form = useEmitter();

  useEffect(() => {
    return form.onSubmit((payload: any) => {
      create(payload).then(form.refreshCategories).catch(form.failAddCategory);
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
      findAll()
        .then(form.setCategories)
        .catch(form.failLoadCategories);
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
      </tbody>
    </table>
  );
}
