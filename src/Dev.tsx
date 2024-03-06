import { useState } from "react";
import { sayHello } from "./rpc";

export default function Rcp() {
  const [file, set] = useState<File | null | undefined>(null);

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();

        sayHello("Miguel Pineda", file as any).then(console.log).catch(console.error);
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
