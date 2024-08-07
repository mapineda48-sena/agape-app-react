import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import Cms from "agape/Cms/Layout";
import { AllProduct, getAllProducts } from "backend/service/inventory/product";
import useModal from "./useProduct";
import { useEmitter } from "components/EventEmitter";
import { useEffect, useState } from "react";
import { IProduct } from "backend/models/inventory/product";
import useDeleteProduct from "./useDeleteProduct";
import { EVENT_CLOSE, EVENT_DELETE, EVENT_UPDATE } from "./event";
import { Rating } from "agape/Shop/Product/CardProduct";
import ActionButtonCms from "../ActionButton";

export const OnInit = getAllProducts;

export default function Product(props: AllProduct) {
  const [state, setState] = useState(props.products);

  const showProductModal = useModal();
  const emitter = useEmitter();

  const deleteProduct = useDeleteProduct();

  useEffect(() => () => emitter.emit(EVENT_CLOSE));

  useEffect(() => {
    return emitter.on(EVENT_UPDATE, (product: IProduct) => {
      setState((state) => {
        const current = state.findIndex((current) => current.id === product.id);

        if (!state[current]) {
          return [product, ...state];
        }

        const next = [...state];
        next[current] = product;

        return next;
      });
    });
  }, [emitter]);

  useEffect(() => {
    return emitter.on(EVENT_DELETE, (id: number) => {
      setState((state) => state.filter((i) => i.id !== id));
    });
  }, [emitter]);

  if (!props.products) {
    return (
      <Cms>
        <span>Error el servidor</span>
      </Cms>
    );
  }

  const ItemsProducts = !state.length ? (
    <div>Sin Productos</div>
  ) : (
    state.map((product, index) => (
      <div
        key={index}
        className="card"
        style={{ width: "18rem", flex: "0 1 22%" }}
      >
        {!product.images.length ? (
          <svg
            className="bd-placeholder-img bd-placeholder-img-lg d-block w-100"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Placeholder: First slide"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#777" />
            <text x="50%" y="50%" fill="#555" dy=".3em" textAnchor="middle">
              Producto sin Imagen
            </text>
          </svg>
        ) : (
          <img
            className="card-img-top"
            src={product?.images[0]}
            alt={product.fullName}
            height={200}
            style={{ objectFit: "contain" }}
          />
        )}

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
        <ActionButtonCms OnCreate={() => showProductModal()} />
        <div
          className="container"
          style={{
            marginTop: "1.5em",
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
