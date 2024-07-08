import { getHomeShopProducts, IPropsHome } from "backend/service/public";
import CarouselProducts from "./CarouselProducts";
import CategoriesTheMonth from "./CategoriesTheMonth";
import FeacturedProduct from "./FeaturedProduct";
import Shop from "..";
import "./index.css";

export const OnInit = getHomeShopProducts;

export default function Home(props: IPropsHome) {
  return (
    <Shop>
      <CarouselProducts slides={props.carouselProducts} />
      <CategoriesTheMonth products={props.categoriesTheMonth} />
      <FeacturedProduct products={props.feacturedProducts} />
    </Shop>
  );
}
