import Shop from "App/Shop";
import AvailableProducts from "./AvailableProducts";
import OurBrands from "App/Shop/About/OurBrands";

export default function Products() {
  return (
    <Shop>
      <AvailableProducts />
      <OurBrands />
    </Shop>
  );
}
