import { getCategories } from "backend/service/public";
import { useEmitter } from "components/EventEmitter";
import useCollapse from "hook/useCollapse";
import { useEffect, useState } from "react";

export default function Categories() {
  const [state, setState] = useState<ICategory[]>([]);
  const emitter = useEmitter();

  useEffect(() => {
    getCategories().then(emitter.setState).catch(console.error);

    return emitter.hook({
      setState,
    });
  }, [emitter]);

  return (
    <ul className="list-unstyled ">
      {state.map((item, index) => (
        <Category key={index} {...item} />
      ))}
    </ul>
  );
}

export function Category(props: ICategory) {
  const collapse = useCollapse<HTMLUListElement>({
    toggle: false,
  });

  return (
    <li className="pb-3">
      <span
        onClick={() => collapse.current?.toggle()}
        className="collapsed d-flex justify-content-between h3 text-decoration-none"
        style={{ cursor: "pointer" }}
      >
        {props.name}
        <i className="fa fa-fw fa-chevron-circle-down mt-1" />
      </span>
      <ul ref={collapse.ref} className="collapse list-unstyled pl-3">
        {props.subcategories.map((item, index) => (
          <li key={index}>
            <span className="text-decoration-none">{item.name}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

interface ICategory {
  id: number;
  name: string;
  subcategories: { id: number; name: string }[];
}
