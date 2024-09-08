import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Logins.css";
import myImg from "../../../img/logo2.png";
import { useUser } from "../../../userContext";
import Fondo1 from "../../../img/fondo1.png"; // Importación de la imagen de fondo

const LoginPropietario = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const { setUser: setContextUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const enviar = async (e) => {
    e.preventDefault();

    try {
      // Solicitud GET para obtener los datos del usuario
      const response = await axios.get(
        `http://localhost:4000/Propietarios?User=${Username}`
      );

      if (response.data.length > 0) {
        const usuario = response.data[0];

        if (usuario.Pass === Password) {
          setAlertMessage("Inicio de sesión exitoso");
          setShowAlert(true);
          setContextUser(usuario); 
          navigate("/MainPropietario");
        } else {
          setAlertMessage("Contraseña incorrecta");
          setShowAlert(true);
        }
      } else {
        setAlertMessage("Usuario no encontrado");
        setShowAlert(true);
      }
    } catch (error) {
      console.error(error);
      setAlertMessage("Ocurrió un error al intentar iniciar sesión");
      setShowAlert(true);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${Fondo1})`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        filter: "brightness(90%)",  
      }}
    >
      {showAlert && (
        <div
        className={`alert ${alertMessage.includes("éxito") ? "alert-success" : "alert-danger"} alert-dismissible fade show`}
        role="alert"
        style={{
          position: "fixed",
          top: "1rem", // Ajusta esta distancia según tu preferencia
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          maxWidth: "500px",
          zIndex: 1000,
          borderRadius: "0.375rem", // Opcional, para bordes redondeados
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" // Opcional, para sombra
        }}
      >
        {alertMessage}
      </div>
    )}

      <div className="login-box rounded-4">
        <div className="d-flex align-items-center flex-sm-column my-3">
          <div className="w-25">
            <Link to="/" className="text-decoration-none">
              <img src={myImg} alt="Logo" className="logo" />
              <span className="fs-6">Volver al inicio</span>
            </Link>
          </div>
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">LOGIN PROPIETARIO</p>

            <form onSubmit={enviar}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Usuario"
                  name="Username"
                  required
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  name="Pass"
                  required
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Recuerdame</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <button type="submit" className="btn btn-success btn-block">
                    Ingresar
                  </button>
                </div>
              </div>
            </form>

            <p className="mb-1">
              <Link to="/forgot-password">¿Has olvidado tu contraseña?</Link>
            </p>
            <hr className="hr-line" />
            <p className="mb-0">
              ¿No tiene una cuenta?{" "}
              <Link to="/RegisterPropietario" className="text-center">
                Enviar solicitud para creación de cuenta
              </Link>
            </p>
            <p className="mb-0">
              ¿Desea ingresar como <Link to="/LoginPortero">Portero</Link> o{" "}
              <Link to="/LoginAdministrador">Administrador</Link>?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPropietario;
