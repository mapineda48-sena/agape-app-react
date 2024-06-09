import Link from "App/Page/Link";

export default function Menu() {
  return (
    <nav
      style={{ position: "sticky", top: 0, zIndex:1 }}
      className="navbar navbar-expand-lg navbar-dark bg-primary"
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          AgapeApp
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" href="/cms">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/cms/product">
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Tienda
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown link
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
