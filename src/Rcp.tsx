import { useState } from "react";
import toFormData from "./rcp/formData";
import axios from "axios";

export default function Rcp() {
  const [file, set] = useState<File | null | undefined>(null);

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();

        const formData = toFormData(["Miguel Pineda", file]);

        axios
          .post("http://localhost:5000/rcp/sayHello", formData)
          .then(console.log)
          .catch(console.error);
      }}
    >
      <input
        type="file"
        onChange={(e) => set(e.currentTarget.files?.item(0))}
      />
      <input type="submit" value="Enviar" />
    </form>
  );
}
