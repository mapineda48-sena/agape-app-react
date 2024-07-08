import { IFeacturedProduct } from "backend/service/public";
import { Rating } from "../Product/CardProduct";

export default function FeacturedProduct(props: IProps) {
  return (
    <section className="bg-light">
      <div className="container py-5">
        <div className="row text-center py-3">
          <div className="col-lg-6 m-auto">
            <h1 className="h1">Producto destacado</h1>
            <p>
              Novedades que Marcan Tendencia: ¡Descubre lo Último en Nuestro
              Catálogo!
            </p>
          </div>
        </div>
        <div className="row">
          {props.products.map((item, index) => (
            <div key={index} className="col-12 col-md-4 mb-4">
              <div className="card h-100">
                <a href="shop-single.html">
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.productName}
                  />
                </a>
                <div className="card-body">
                  <ul className="list-unstyled d-flex justify-content-between">
                    <Rating value={item.rating} />
                    <li className="text-muted text-right">${item.price}</li>
                  </ul>
                  <a
                    href="shop-single.html"
                    className="h2 text-decoration-none text-dark"
                  >
                    {item.productName}
                  </a>
                  <p className="card-text">{item.description}</p>
                  <p className="text-muted">Reviews ({item.reviews})</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Types
 */
interface IProps {
  products: IFeacturedProduct[];
}
