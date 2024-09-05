import { Link } from "react-router-dom";
import Tabla from "./tabla";
import { useState } from "react";

const SideBar = () => {
  const [currentTable, setCurrentTable] = useState("Parqueadero");

  return (
    <>
      <div className="d-flex flex-row h-100">
        <div>
          <div
            className="d-flex flex-column p-3 text-white bg-dark h-100"
            style={{ width: 280 }}
          >
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item">
                <Link
                  onClick={() => setCurrentTable("Parqueadero")}
                  className={
                    currentTable === "Parqueadero"
                      ? "nav-link active"
                      : "nav-link text-white"
                  }
                >
                  Parqueadero
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setCurrentTable("SalonComunal")}
                  className={
                    currentTable === "SalonComunal"
                      ? "nav-link active"
                      : "nav-link text-white"
                  }
                >
                  Salon Comunal
                </Link>
              </li> 
            </ul>
            <hr />
          </div>
        </div>
        <Tabla apiS={currentTable} />
      </div>
    </>
  );
};

export default SideBar;
