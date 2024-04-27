import { useForm } from "Form";
import { useCallback, useEffect, useState } from "react";

export default function Submit(props: Props) {
  const [disabled, setDisabled] = useState(false);
  const form = useForm();

  const toggle = useCallback(() => setDisabled(state => !state), [])

  useEffect(() => form.onLoading(toggle), [form]);

  return (
    <button {...props} type="submit" disabled={disabled || props.disabled} />
  );
}

type Props = Omit<JSX.IntrinsicElements["button"], "type">;
