import Shop from "App/Shop";
import DetailProduct from "./DetailProduct";
import RelatedProducts from "./RelatedProducts";

export default function Product() {
  return (
    <Shop>
      <DetailProduct />
      <RelatedProducts />
    </Shop>
  );
}
