import { useEffect, useRef } from "react";
import clsx from "clsx";
import parse from "html-react-parser";
import { Carousel } from "bootstrap";

const slides = [
  {
    title: "<b>Zay</b> eCommerce",
    subtitle: "Tiny and Perfect eCommerce Template",
    content:
      "Zay Shop is an eCommerce HTML5 CSS template with latest version of Bootstrap 5 (beta 1). This template is 100% free provided by TemplateMo website. Image credits go to Freepik Stories, Unsplash and Icons 8. ",
    image: "./assets/img/banner_img_01.jpg",
  },
  {
    title: "Proident occaecat",
    subtitle: "Aliquip ex ea commodo consequat",
    content:
      "You are permitted to use this Zay CSS template for your commercial websites. You are not permitted to re-distribute the template ZIP file in any kind of template collection websites.",
    image: "./assets/img/banner_img_02.jpg",
  },
  {
    title: "Repr in voluptate",
    subtitle: "Ullamco laboris nisi ut",
    content:
      "We bring you 100% free CSS templates for your websites. If you wish to support TemplateMo, please make a small contribution via PayPal or tell your friends about our website. Thank you.",
    image: "./assets/img/banner_img_03.jpg",
  },
];

export default function CarouselProducts() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const current = new Carousel(ref.current, {
      interval: 1500,
    });

    return () => current.dispose();
  }, []);

  return (
    <div
      ref={ref}
      id="agape-home-carousel"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <ol className="carousel-indicators">
        {slides.map((_, index) => (
          <li
            data-bs-target="#agape-home-carousel"
            data-bs-slide-to={index.toString()}
            aria-label={`Slide ${index + 1}`}
            className={clsx([index === 0 && "active"])}
            aria-current={index === 0}
            key={index}
          />
        ))}
      </ol>
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div key={index} className={clsx(["carousel-item", index === 0 && "active"])}>
            <div className="container">
              <div className="row p-5">
                <div className="mx-auto col-md-8 col-lg-6 order-lg-last">
                  <img className="img-fluid" src={slide.image} alt="" />
                </div>
                <div className="col-lg-6 mb-0 d-flex align-items-center">
                  <div className="text-align-left align-self-center">
                    <h1 className="h1 text-success">{parse(slide.title)}</h1>
                    <h3 className="h2">{slide.subtitle}</h3>
                    <p>{slide.content}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <a
        className="carousel-control-prev text-decoration-none w-auto ps-3"
        href="#agape-home-carousel"
        role="button"
        data-bs-slide="prev"
      >
        <i className="fas fa-chevron-left" />
      </a>
      <a
        className="carousel-control-next text-decoration-none w-auto pe-3"
        href="#agape-home-carousel"
        role="button"
        data-bs-slide="next"
      >
        <i className="fas fa-chevron-right" />
      </a>
    </div>
  );
}
