import { useCallback, useEffect, useRef } from "react";
import Image from "./Image";
import clsx from "clsx";
import { useInput } from "App/Form";
import { InputFiles } from "App/Form/Input/File";
import { FaUpload } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import generateUUID from "util/generateUUID";
import useCarousel from "hook/useCarousel";

const carouselId = generateUUID();

const Empty = [
  <div className="carousel-item active" key={0}>
    <svg
      className="bd-placeholder-img bd-placeholder-img-lg d-block w-100"
      width={800}
      height={400}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Placeholder: First slide"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <title>Placeholder</title>
      <rect width="100%" height="100%" fill="#777" />
      <text x="50%" y="50%" fill="#555" dy=".3em">
        Producto sin Imagen
      </text>
    </svg>
  </div>,
];

export default function Images(props: { path: string }) {
  const { ref, getCarousel } = useCarousel();
  const [state, setState] = useInput<File[]>(props.path, []);

  const push = useCallback(
    (files: File[]) => setState((state) => [...state, ...files]),
    [setState]
  );

  const remove = useCallback(() => {
    const carousel = getCarousel();

    if (!carousel) return;

    const index = carousel.getCurrentIndex();

    setState((state) => {
      const next = [...state];

      // El carousel falla cuando se remueve el ultimo elemento, se mueve al primer elemento para evitarlo
      if (index === state.length - 1) carousel.next();

      next.splice(index, 1);

      return next;
    });
  }, [getCarousel, setState]);

  const Slides = !state?.length
    ? Empty
    : state.map((file, index) => (
        <div
          key={index}
          style={{ height: 500 }}
          className={clsx(["carousel-item", index === 0 && "active"])}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            src={file}
            className="img-fluid"
            alt={file.name}
          />
        </div>
      ));

  return (
    <div
      ref={ref}
      id={carouselId}
      className="carousel carousel-dark slide"
      data-bs-ride="carousel"
      style={{ position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          left: ".5em",
          bottom: ".5em",
          zIndex: 1000,
        }}
        className="btn-group"
        role="group"
        aria-label="Basic example"
      >
        <label htmlFor="formFile" className="btn btn-primary">
          <FaUpload />
        </label>
        <InputFiles
          hidden
          onChange={push}
          multiple
          className="form-control"
          id="formFile"
          placeholder=""
        />
        <button
          disabled={!state?.length}
          type="button"
          className="btn btn-primary"
          onClick={remove}
        >
          <MdDelete />
        </button>
      </div>
      <div className="carousel-indicators">
        {Slides.map((file, index) => (
          <button
            key={index}
            type="button"
            data-bs-target={`#${carouselId}`}
            data-bs-slide-to={index}
            className={clsx([index === 0 && "active"])}
            aria-current={index === 0}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="carousel-inner">{Slides}</div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#${carouselId}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#${carouselId}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
