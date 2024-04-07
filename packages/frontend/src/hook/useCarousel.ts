import { useEffect, useMemo, useRef } from "react";
import { Carousel } from "bootstrap";

export default function useCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const carousel = useRef<ICarousel | null>(null);

  const { current } = ref;

  useEffect(() => {
    if (!current) {
      return;
    }

    const instance = (carousel.current = createCarousel(current));

    return () => {
      instance.dispose();
    };
  }, [current]);

  return useMemo(() => {
    return {
      ref,
      getCarousel() {
        return carousel.current;
      },
    };
  }, []);
}

function createCarousel(el: HTMLDivElement): ICarousel {
  const instance: unknown = new Carousel(el) as ICarousel;

  Object.defineProperty(instance, "getCurrentIndex", {
    writable: false,
    configurable: false,
    enumerable: false,
    value: () =>
      Array.from(el.querySelectorAll(".carousel-item")).findIndex((el) =>
        el.classList.contains("active")
      ),
  });

  return instance as ICarousel;
}

interface ICarousel extends Carousel {
  readonly getCurrentIndex: () => number;
}
