import { useInput } from "..";

export default function InputText(props: Props) {
  const { name, password, ...core } = props;

  const [state, setState] = useInput(name, "");

  return (
    <input
      {...core}
      type={password ? "password" : "text"}
      value={state}
      onChange={({ currentTarget }) => setState(currentTarget.value)}
    />
  );
}

interface Props extends Core {
  name: string;
  password?: boolean
}

type Core = Omit<
  JSX.IntrinsicElements["input"],
  "value" | "name" | "onChange" | "type"
>;
