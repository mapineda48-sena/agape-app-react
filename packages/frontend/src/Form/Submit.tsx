import { useForm } from "Form";
import { useEffect, useState } from "react";

export default function Submit(props: Props) {
  const [disabled, setDisabled] = useState(false);
  const form = useForm();

  useEffect(() => form.onLoading(setDisabled), [form]);

  return (
    <button {...props} type="submit" disabled={disabled || props.disabled} />
  );
}

type Props = Omit<JSX.IntrinsicElements["button"], "type">;
