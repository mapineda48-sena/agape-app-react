import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Cms from "App/Cms";
import { AllProduct, getAllProducts } from "backend/service/inventory/product";
import useModal from "./useProduct";
import { useEmitter } from "components/EventEmitter";
import { useEffect, useState } from "react";
import { IProduct } from "backend/models/inventory/product";
import useDeleteProduct from "./useDeleteProduct";
import { EVENT_DELETE, EVENT_UPDATE } from "./event";
import { Rating } from "App/Shop/Product/CardProduct";

export const OnInit = getAllProducts;

export default function Product(props: AllProduct) {
  //console.log(props);

  const [state, setState] = useState(props.products);

  const showProductModal = useModal();
  const emitter = useEmitter();

  const deleteProduct = useDeleteProduct();

  useEffect(() => {
    emitter.on(EVENT_UPDATE, (product: IProduct) => {
      setState((state) => {
        const current = state.findIndex((current) => current.id === product.id);

        if (!state[current]) {
          return [...state, product];
        }

        const next = [...state];
        next[current] = product;

        return next;
      });
    });

    emitter.on(EVENT_DELETE, (id: number) => {
      setState((state) => state.filter((i) => i.id !== id));
    });
  }, [emitter]);

  const ItemsProducts = !state.length ? (
    <div>Sin Productos</div>
  ) : (
    state.map((product, index) => (
      <div
        key={index}
        className="card"
        style={{ width: "18rem", flex: "0 1 22%" }}
      >
        <img
          className="card-img-top"
          src={product?.images[0]}
          alt={product.fullName}
        />
        <div className="card-body">
          <p className="card-text">{product.fullName}</p>
          <p className="card-text">{product.price}</p>
          <Rating value={product.rating} />
          <div className="btn-group" role="group" aria-label="Basic example">
            <button
              onClick={() => showProductModal(product)}
              type="button"
              className="btn btn-secondary"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => deleteProduct({ id: product.id })}
              type="button"
              className="btn btn-danger"
            >
              <MdDelete />
            </button>
          </div>
        </div>
      </div>
    ))
  );

  return (
    <Cms>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="btn-group" role="group" aria-label="Basic example">
            <button
              onClick={() => showProductModal()}
              type="button"
              className="btn btn-primary"
            >
              Crear
            </button>
            <button type="button" className="btn btn-primary">
              Buscar
            </button>
          </div>
        </div>
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "25px",
            justifyContent: "flex-start",
          }}
        >
          {ItemsProducts}
        </div>
      </div>
    </Cms>
  );
}
