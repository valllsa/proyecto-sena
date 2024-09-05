import React from "react";
/* Importación de iconos */
import { NavBar } from "../../../Components/Componentes_Propietario/navBar";
import SideBar from "../../../Components/Componentes_Propietario/sideBar";

const MainPropietario = () => {
  return (
    <>
      <div className="d-flex flex-column vh-100">
        <div>
          <NavBar />
        </div>
        <div className="h-100">
          <SideBar />
        </div>
      </div>
    </>
  );
};

export default MainPropietario;
