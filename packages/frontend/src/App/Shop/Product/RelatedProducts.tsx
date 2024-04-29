import { products } from "App/Shop/Products/demo";
import Slider from "react-slick";
import CardProduct from "./CardProduct";

const settings = {
  infinite: true,
  arrows: false,
  slidesToShow: 4,
  slidesToScroll: 3,
  dots: true,
  className: "agape-carousel-related-product-slick-slide",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 3,
      },
    },
  ],
};

export default function RelatedProducts() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row text-left p-2 pb-3">
          <h4>Related Products</h4>
        </div>
        <Slider {...settings}>
          {products.map((product, index) => (
            <div key={index} className="p-2 pb-3">
              <CardProduct {...product} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
