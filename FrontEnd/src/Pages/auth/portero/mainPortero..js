/* Importación de paquetes necesarios */
import React, { useEffect } from "react"; /* Paquete necesario para manipular el estado del componente de clase MainAdmin */
/* Importación de iconos */
import { NavBar } from "../../../Components/Componentes_Portero/navBar";
import SideBar from "../../../Components/Componentes_Portero/sideBar";
import { useUser } from "../../../userContext";
import { useNavigate } from "react-router-dom";

/* Componente de clase MainAdmin */
export function MainPortero() {
  const { user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/LoginPortero");
    }
  });
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
}
// }

export default MainPortero; /* Sentencia para la exportación del modulo Main al archivo de rutas App.js */
