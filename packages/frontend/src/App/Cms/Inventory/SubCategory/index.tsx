// import React, { useEffect, useState } from "react";
// import Form, { useForm } from "Form";
// import { useEmitter } from "EventEmitter";
// import Input from "Form/Input";
// import {
//   deleteCategory,
//   findAll,
//   ISubcategory,
// } from "backend/service/inventory/subcategory";
// import { MdDelete } from "react-icons/md";

// export default function Foo() {
//   return (
//     <div className="container mt-5">
//       <Form className="row g-3">
//         <h2>Categoria</h2>
//         <div className="col-md-6">
//           <label htmlFor="inputState" className="form-label">
//             Nombre
//           </label>
//           <Input.Text
//             name="fullName"
//             className="form-control"
//             id="fullName"
//             placeholder="1234 Main St"
//           />
//         </div>
//         <div className="col-md-2" />
//         <div className="col-md-4 d-flex align-items-center justify-content-end">
//           <AddNewCategory />
//         </div>
//         <Categories />
//       </Form>
//     </div>
//   );
// }

// function AddNewCategory() {
//   const form = useForm();
//   const emitter = useEmitter();

//   useEffect(() => {
//     return form.onSubmit((payload: any) => {
//       console.log("foo");
//     });
//   }, [emitter, form]);

//   return (
//     <button type="submit" className="btn btn-success">
//       Agregar
//     </button>
//   );
// }

// function Categories() {
//   const [state, setCategories] = useState<ISubcategory[]>([]);
//   const [error, setError] = useState<any>(null);

//   const emitter = useEmitter();

//   useEffect(() => {
//     emitter.hook({ setCategories, setError });

//     const refreshCategories = () => {
//       findAll().then(emitter.setCategories).catch(emitter.setError);
//     };

//     refreshCategories();

//     return emitter.on("refreshCategories", refreshCategories);
//   }, [emitter]);

//   if (!state.length) {
//     return <span>Sin resultados</span>;
//   }

//   return (
//     <table className="table">
//       <thead>
//         <tr>
//           <th scope="col">Categoria ID</th>
//           <th scope="col">ID</th>
//           <th scope="col">Nombre</th>
//           <th scope="col">Habilitada</th>
//           <th scope="col">Fecha</th>
//           <th scope="col">Acción</th>
//         </tr>
//       </thead>
//       <tbody>
//         {/* Las filas de la tabla se generarían dinámicamente aquí */}
//         {state.map((category, index) => {
//           return (
//             <tr key={index}>
//               <td>{category.categoryId}</td>
//               <td>{category.id}</td>
//               <td>{category.fullName}</td>
//               <td>{category.isEnabled ? "Si" : "No"}</td>
//               <td>{category.updatedAt.toString()}</td>
//               <td>
//                 <DeleteCategory id={category.id} />
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// }

// function DeleteCategory(props: { id: number }) {
//   const emitter = useEmitter();

//   return (
//     <button
//       onClick={() => {
//         deleteCategory(props.id)
//           .then(emitter.refreshCategories)
//           .catch((error) => console.error(error));
//       }}
//       type="button"
//       className="btn btn-danger"
//     >
//       <MdDelete />
//     </button>
//   );
// }

export default function Foo() {
  return <div>foo</div>;
}
