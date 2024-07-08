import { FaBootstrap } from "react-icons/fa";
import { ReactNode } from "react";
import { Protected, useLogOut } from "agape/Login";
import "./index.css";
import Link from "app/Link";
import useDropdown from "hook/useDropdown";

export default function LayoutCms(props: { children: ReactNode }) {
  const logout = useLogOut();
  const dropdown = useDropdown();

  return (
    <Protected>
      <header className="bg-dark p-3 mb-3 border-bottom cms-layout-agape">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <Link
              href="/cms"
              className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none"
            >
              <h2 className="text-white">Agape</h2>
            </Link>
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li>
                <Link
                  href="/"
                  className="text-white nav-link px-2 link-body-emphasis"
                >
                  Tienda
                </Link>
              </li>
              <li>
                <Link
                  href="/cms/inventory"
                  className="text-white nav-link px-2 link-body-emphasis"
                >
                  Inventario
                </Link>
              </li>
              <li>
                <Link
                  href="/cms/customers"
                  className="text-white nav-link px-2 link-body-emphasis"
                >
                  Clientes
                </Link>
              </li>
              <li>
                <Link
                  href="/cms"
                  className="text-white nav-link px-2 link-body-emphasis"
                >
                  Ventas
                </Link>
              </li>
              <li>
                <Link
                  href="/cms"
                  className="text-white nav-link px-2 link-body-emphasis"
                >
                  Configuración
                </Link>
              </li>
            </ul>
            <div ref={dropdown.ref} className="dropdown text-end">
              <a
                href="#"
                className="d-block link-body-emphasis text-decoration-none dropdown-toggle text-white"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://github.com/mdo.png"
                  alt="mdo"
                  width={32}
                  height={32}
                  className="rounded-circle"
                />
              </a>
              <ul className="dropdown-menu text-small" style={{}}>
                <li>
                  <a className="dropdown-item" href="#">
                    Perfil
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <span
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    onClick={logout}
                  >
                    Salir
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      {props.children}
    </Protected>
  );
}
