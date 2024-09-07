import React, { useEffect, useState } from 'react';
import { useUser } from '../../../userContext';
import { NavBar } from '../../../Components/Componentes_Propietario/navBar';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import './profile.css';

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [isEditingTelefono, setIsEditingTelefono] = useState(false);
  const [isEditingCorreo, setIsEditingCorreo] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (user) {
      setTelefono(user.Teléfono);
      setCorreo(user.Correo);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // La alerta desaparecerá después de 3 segundos

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:4000/Propietarios/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Teléfono: telefono,
          Correo: correo,
        }),
      });

      if (response.ok) {
        setAlertMessage('Datos actualizados correctamente.');
        setShowAlert(true);
        setIsEditingTelefono(false);
        setIsEditingCorreo(false);
      } else {
        setAlertMessage('Error al actualizar los datos.');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      setAlertMessage('Error al actualizar los datos.');
      setShowAlert(true);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <p>Cargando...</p>
      </div>
    );
  }

  const espacioMoto = Array.isArray(user.espacioMoto) ? user.espacioMoto : [];
  const espacioCarro = Array.isArray(user.espacioCarro) ? user.espacioCarro : [];

  return (
    <>
      <NavBar />
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Mi Perfil</h1>
          <button className="btn btn-secondary" onClick={handleGoBack}>
            Volver
          </button>
        </div>
        <div className="profile-info">
          <p>
            <strong>Nombre:</strong> {user.Nombre}
          </p>
          <p className="profile-field">
            <strong>Teléfono:</strong>
            {isEditingTelefono ? (
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="profile-input"
                onBlur={handleSaveClick}
              />
            ) : (
              <>
                <span>{telefono}</span>
                <FaEdit
                  className="edit-icon"
                  onClick={() => setIsEditingTelefono(true)}
                />
              </>
            )}
          </p>
          <p className="profile-field">
            <strong>Correo:</strong>
            {isEditingCorreo ? (
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="profile-input"
                onBlur={handleSaveClick}
              />
            ) : (
              <>
                <span>{correo}</span>
                <FaEdit
                  className="edit-icon"
                  onClick={() => setIsEditingCorreo(true)}
                />
              </>
            )}
          </p>
          <p>
            <strong>Numero Documento:</strong> {user.NumeroDocumento}
          </p>
          <p>
            <strong>Meses Atrasados:</strong> {user.MesesAtrasados}
          </p>
          <p>
            <strong>Espacios Parqueadero:</strong>
            <div>
              <h3>Moto</h3>
              <ul>
                {espacioMoto.length > 0 ? (
                  espacioMoto.map((espacio, index) => (
                    <li key={index}>
                      <strong>Espacio:</strong> {espacio.NumeroEspacio} - {espacio.TipoEspacio}
                    </li>
                  ))
                ) : (
                  <li>No tienes espacios de moto rentados</li>
                )}
              </ul>
              <h3>Carro</h3>
              <ul>
                {espacioCarro.length > 0 ? (
                  espacioCarro.map((espacio, index) => (
                    <li key={index}>
                      <strong>Espacio:</strong> {espacio.NumeroEspacio} - {espacio.TipoEspacio}
                    </li>
                  ))
                ) : (
                  <li>No tienes espacios de carro rentados</li>
                )}
              </ul>
            </div>
          </p>
          <p>
            <strong>Código Vivienda:</strong> {user.CodigoVivienda}
          </p>
        </div>
      </div>

      {showAlert && (
        <div
          className={`alert ${
            alertMessage.includes("correctamente") ? "alert-success" : "alert-danger"
          } alert-dismissible fade show`}
          role="alert"
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30%",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          {alertMessage}
        </div>
      )}
    </>
  );
};

export default Profile;