import { Link, useNavigate } from "react-router-dom";
import myImg from "../../img/logo2.png";
import { useUser } from "../../userContext";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse, faUser, faCar, faChampagneGlasses, faHandshake, faPersonMilitaryPointing, faXmark } from "@fortawesome/free-solid-svg-icons";

library.add(faHouse, faUser, faCar, faChampagneGlasses, faHandshake, faPersonMilitaryPointing, faXmark);

export function NavBar() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const { setUser: setContextUser } = useUser();
  const [currentDropMenu, setCurrentDropMenu] = useState("Acción");

  return (
    <div className="d-flex flex-column justify-content-start h-100">
      <div>
        {/* NavBar */}
        <nav className="navbar navbar-expand-lg navbar-dark py-2 bg-dark">
          <div className="container px-lg-5 d-flex flex-row justify-content-between">
            <div></div>

            <div>
              <img
                src={myImg}
                className="img-fluid"
                alt="Icon"
                style={{ width: 70, height: 70 }}
              />
            </div>

            <div className="btn-group">
              <button
                type="button"
                className="btn btn-outline-light dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {currentDropMenu}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item text-primary"
                    onClick={() => {
                      handleProfileClick();
                      setCurrentDropMenu("Perfil");
                    }}
                  >
                    Perfil
                  </button>
                </li>
                <li>
                  <Link
                    onClick={() => setContextUser(null)}
                    className="dropdown-item text-danger"
                    to="/"
                  >
                    Cerrar Sesión
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}