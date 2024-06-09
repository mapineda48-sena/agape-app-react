import CardProduct from "App/Shop/Product/CardProduct";
import { products } from "./demo";
import Categories from "./Categories";

export default function AvailableProducts() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-3">
          <h1 className="h2 pb-4">Categorias</h1>
          <Categories />
        </div>
        <div className="col-lg-9">
          <div className="row">
            <div className="col-md-6">
              <ul className="list-inline shop-top-menu pb-3 pt-1">
                <li className="list-inline-item">
                  <a
                    className="h3 text-dark text-decoration-none mr-3"
                    href="#"
                  >
                    All
                  </a>
                </li>
                <li className="list-inline-item">
                  <a
                    className="h3 text-dark text-decoration-none mr-3"
                    href="#"
                  >
                    Men's
                  </a>
                </li>
                <li className="list-inline-item">
                  <a className="h3 text-dark text-decoration-none" href="#">
                    Women's
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-6 pb-4">
              <div className="d-flex">
                <select className="form-control">
                  <option>Featured</option>
                  <option>A to Z</option>
                  <option>Item</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            {products.map((product, index) => (
              <div key={index} className="mb-2 col-md-4">
                <CardProduct {...product} />
              </div>
            ))}
          </div>
          <div className="row">
            <ul className="pagination pagination-lg justify-content-end">
              <li className="page-item disabled">
                <a
                  className="page-link active rounded-0 mr-3 shadow-sm border-top-0 border-left-0"
                  href="#"
                  tabIndex={-1}
                >
                  1
                </a>
              </li>
              <li className="page-item">
                <a
                  className="page-link rounded-0 mr-3 shadow-sm border-top-0 border-left-0 text-dark"
                  href="#"
                >
                  2
                </a>
              </li>
              <li className="page-item">
                <a
                  className="page-link rounded-0 shadow-sm border-top-0 border-left-0 text-dark"
                  href="#"
                >
                  3
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
