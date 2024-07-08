import { useEffect, useState } from "react";

export default function Image(props: Props) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (typeof props.src === "string") {
      return setSrc(props.src);
    }

    // Crear una URL temporal para el objeto File
    const url = URL.createObjectURL(props.src);
    setSrc(url);

    // Liberar la URL temporal cuando el componente se desmonte o el archivo cambie
    return () => URL.revokeObjectURL(url);
  }, [props.src]);

  if (!src) {
    return null;
  }

  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...props} src={src} />;
}

interface Props extends Core {
  src: string | File;
  alt: string;
}

type Core = Omit<JSX.IntrinsicElements["img"], "src" | "alt">;
