import CarouselProducts from "./CarouselProducts";
import CategoriesTheMonth from "./CategoriesTheMonth";
import FeacturedProduct from "./FeaturedProduct";
import Shop from "..";
import "./index.css";

export default function Home() {
  return (
    <Shop>
      <CarouselProducts />
      <CategoriesTheMonth />
      <FeacturedProduct />
    </Shop>
  );
}
