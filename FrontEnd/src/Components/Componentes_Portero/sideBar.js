import { Link } from "react-router-dom";
import Tabla from "./tabla";
import { useState } from "react";

const SideBar = () => {
  const [currentTable, setCurrentTable] = useState("Propietarios");

  return (
    <div className="d-flex h-100">
      <div className="bg-dark text-white p-3" style={{ width: 280 }}>
        <h4 className="text-center">Menú</h4>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link
              onClick={() => setCurrentTable("Propietarios")}
              href="#"
              className={`nav-link ${
                currentTable === "Propietarios" ? "active" : "text-white"
              }`}
            >
              <i className="bi bi-house-door me-2"></i>
              Propietarios
            </Link>
          </li>
          <li className="nav-item">
            <Link
              onClick={() => setCurrentTable("Parqueadero")}
              href="#"
              className={`nav-link ${
                currentTable === "Parqueadero" ? "active" : "text-white"
              }`}
            >
              <i className="bi bi-car-front me-2"></i>
              Parqueadero
            </Link>
          </li>
          <li className="nav-item">
            <Link
              onClick={() => setCurrentTable("Invitados")}
              href="#"
              className={`nav-link ${
                currentTable === "Invitados" ? "active" : "text-white"
              }`}
            >
              <i className="bi bi-person-lines-fill me-2"></i>
              Invitados
            </Link>
          </li>
        </ul>
        <hr />
      </div>
      <div className="flex-grow-1 p-3">
        <Tabla
          item={
            currentTable === "Propietarios"
              ? [
                  "Codigo de vivienda",
                  "Nombre",
                  "Teléfono",
                  "Correo",
                  "Numero de Documento",
                  "Meses Atrasados",
                ]
              : currentTable === "Parqueadero"
              ? ["Numero de Espacio", "Tipo de Espacio", "Estado"]
              : currentTable === "Invitados"
              ? [
                  "Nombre",
                  "Numero de Documento",
                  "Teléfono",
                  "Correo",
                  "Numero de parqueadero",
                  "Costo",
                  "Codigo de Vivienda",
                  "Tiempo",
                  "Acciones",
                ]
              : ["Nombre", "Numero de Documento", "Teléfono", "Correo"]
          }
          apiS={currentTable}
        />
      </div>
    </div>
  );
};

export default SideBar;
