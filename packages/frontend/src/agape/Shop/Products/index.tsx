import Shop from "agape/Shop";
import AvailableProducts from "./AvailableProducts";
import OurBrands from "agape/Shop/About/OurBrands";

export default function Products() {
  return (
    <Shop>
      <AvailableProducts />
      <OurBrands />
    </Shop>
  );
}
