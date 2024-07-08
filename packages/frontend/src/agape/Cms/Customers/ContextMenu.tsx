import { deleteCustomer } from "backend/service/customer";
import { useEmitter } from "components/EventEmitter";
import { withPortalToRoot } from "components/Portals";
import { useEffect, useRef } from "react";
import { EVENT_DELETE } from "./event";
import { useDeleteCustomer, useFormCustomers } from "./Form";

export default withPortalToRoot((props: any) => {
  const { remove, x, y, record } = props;
  const menuRef = useRef<HTMLDivElement>(null); // Ref para el menú contextual
  const emitter = useEmitter();
  const showFormCustomers = useFormCustomers();
  const showDeleteCustomer = useDeleteCustomer();

  useEffect(() => {
    const handleMouseDown = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        remove(); // Cierra el menú solo si el clic fue fuera del menú
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [remove]);

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: y,
        left: x,
        backgroundColor: "white",
        border: "1px solid #ccc",
        zIndex: 1000,
        padding: "10px",
      }}
    >
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li
          style={{ cursor: "pointer" }}
          onClick={() => {
            remove();
            showDeleteCustomer({ record });
          }}
        >
          Eliminar
        </li>
        <li
          style={{ cursor: "pointer" }}
          onClick={() => {
            remove();
            showFormCustomers({
              record,
            });
          }}
        >
          Editar
        </li>
      </ul>
    </div>
  );
});
