import { useInput } from "..";

export default function InputText(props: Props) {
  const { name, ...core } = props;

  const [state, setState] = useInput(name, "");

  return (
    <input
      {...core}
      type="text"
      value={state}
      onChange={({ currentTarget }) => setState(currentTarget.value)}
    />
  );
}

interface Props extends Core {
  name: string;
}

type Core = Omit<
  JSX.IntrinsicElements["input"],
  "value" | "name" | "onChange" | "type"
>;
