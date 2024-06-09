import clsx from "clsx";
import parse from "html-react-parser";
import useCarousel from "hook/useCarousel";
import { ICarouselProduct } from "backend/service/public";

export default function CarouselProducts({ slides }: IProps) {
  const { ref } = useCarousel();

  return (
    <div
      ref={ref}
      id="agape-home-carousel"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="4000"
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
          <div
            key={index}
            className={clsx(["carousel-item", index === 0 && "active"])}
          >
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

/**
 * Types
 */
interface IProps {
  slides: ICarouselProduct[];
}
