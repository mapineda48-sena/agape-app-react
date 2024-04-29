import Input from "App/Form/Input";
import { useMemo } from "react";
import generateUUID from "util/generateUUID";
import wrap, { WrapFC } from "util/wrap";

const Res = wrap<FieldInput>(Input, (Type: any) => {
  return ({ label, ...props }: any) => {
    const id = useMemo(generateUUID, []);

    return (
      <>
        <label htmlFor={id} className="form-label">
          {label}
        </label>
        <Type {...props} className="form-control" id={id} />
      </>
    );
  };
});

export default Res;

/**
 * Types
 */
type FieldInput = WrapFC<typeof Input, { label: string }>;
