import { Link } from "react-router-dom";
import myImg from "../../img/logo2.png"; /* Logo del conjutno */
import { useUser } from "../../userContext";

export function NavBar() {
  const { setUser: setContextUser } = useUser();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center text-light" to="#">
          <img src={myImg} class="mr-4" alt="Icon" style={{ width: 50, height: 50, borderRadius: 10, }} className="me-2" />
          CONJUNTO RESIDENCIAL TORRES DE SANTA ISABEL
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
          aria-controls="navContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                onClick={() => setContextUser(null)}
                className="btn btn-outline-light"
                to="/"
              >
                Cerrar Sesion
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
