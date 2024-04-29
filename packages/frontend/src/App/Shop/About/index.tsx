import Banner from "./Banner";
import OurBrands from "./OurBrands";
import OurServices from "./OurServices";
import Shop from "..";
import "./index.css";

export default function About() {
  return (
    <Shop>
      <Banner />
      <OurServices />
      <OurBrands />
    </Shop>
  );
}
