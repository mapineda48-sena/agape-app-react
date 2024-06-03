import Link from "App/Link";

{
  /* <div className="p-2 pb-3">
<div className="product-wap card rounded-0">
  <div className="card rounded-0"> */
}

export default function CardProduct(props: Props) {
  return (
    <div className="card product-wap rounded-0">
      <div className="card rounded-0">
        <img
          className="card-img rounded-0 img-fluid"
          src={props.image}
          alt="..."
        />
        <div className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
          <ul className="list-unstyled">
            <li>
              <Link href="/product" className="btn btn-success text-white mt-2">
                <i className="far fa-heart" />
              </Link>
            </li>
            <li>
              <Link href="/product" className="btn btn-success text-white mt-2">
                <i className="far fa-eye" />
              </Link>
            </li>
            <li>
              <Link href="/product" className="btn btn-success text-white mt-2">
                <i className="fas fa-cart-plus" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="card-body">
        <Link href="/product" className="h3 text-decoration-none">
          {props.name}
        </Link>
        <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">
          <li>{props.sizes.join("/")}</li>
          <li className="pt-2">
            <span className="product-color-dot color-dot-red float-left rounded-circle ml-1" />
            <span className="product-color-dot color-dot-blue float-left rounded-circle ml-1" />
            <span className="product-color-dot color-dot-black float-left rounded-circle ml-1" />
            <span className="product-color-dot color-dot-light float-left rounded-circle ml-1" />
            <span className="product-color-dot color-dot-green float-left rounded-circle ml-1" />
          </li>
        </ul>
        <Rating value={props.rating} />
        <p className="text-center mb-0">{props.price}</p>
      </div>
    </div>
  );
}

export function Rating(props: { value: number }) {
  const Items: JSX.Element[] = [];

  for (let index = 0; index < 5; index++) {
    if (index < props.value) {
      Items.push(<i key={index} className="text-warning fa fa-star" />);
    } else {
      Items.push(<i key={index} className="text-muted fa fa-star" />);
    }
  }

  return (
    <ul className="list-unstyled d-flex justify-content-center mb-1">
      <li>{Items}</li>
    </ul>
  );
}

/**
 * Types
 */
export interface Props {
  image: string;
  name: string;
  sizes: string[];
  colors: string[];
  rating: number;
  price: string;
}
