import Shop from "agape/Shop";
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
