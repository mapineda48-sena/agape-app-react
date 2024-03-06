import { useState } from "react";
import { rcp } from "./rcp";

export default function Rcp() {
  const [file, set] = useState<File | null | undefined>(null);

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();

        rcp.sayHello("Miguel Pineda", file).then(console.log).catch(console.error);
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
