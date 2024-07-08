import Link from "app/Link";
import { ICategorieTheMonth } from "backend/service/public";

export default function CategoriesTheMonth(props: IProps) {
  return (
    <section className="container py-5">
      <div className="row text-center pt-3">
        <div className="col-lg-6 m-auto">
          <h1 className="h1">Categorías del mes</h1>
          <p>
            Top Ventas del Mes: ¡Aprovecha lo más popular antes de que se
            agoten!
          </p>
        </div>
      </div>
      <div className="row">
        {props.products.map((item, index) => (
          <div key={index} className="col-12 col-md-4 p-5 mt-3">
            <Link href="#">
              <img
                src={item.image}
                className="rounded-circle img-fluid border"
                alt={item.fullName}
              />
            </Link>
            <h5 className="text-center mt-3 mb-3">{item.fullName}</h5>
            <p className="text-center">
              <button className="btn btn-success">Ver</button>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Types
 */
interface IProps {
  products: ICategorieTheMonth[];
}
