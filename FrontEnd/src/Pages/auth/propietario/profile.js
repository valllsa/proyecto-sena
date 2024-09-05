import React, { useEffect, useState } from 'react';
import { useUser } from '../../../userContext';
import { NavBar } from '../../../Components/Componentes_Propietario/navBar';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa'; // Importa el icono de edición
import './profile.css'; // Asegúrate de que el archivo CSS esté importado correctamente

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [isEditingTelefono, setIsEditingTelefono] = useState(false);
  const [isEditingCorreo, setIsEditingCorreo] = useState(false);

  useEffect(() => {
    if (user) {
      setTelefono(user.Teléfono);
      setCorreo(user.Correo);
      setLoading(false);
    }
  }, [user]);

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
        alert('Datos actualizados correctamente.');
        setIsEditingTelefono(false);
        setIsEditingCorreo(false);
      } else {
        alert('Error al actualizar los datos.');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar los datos.');
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <p>Cargando...</p>
      </div>
    );
  }

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
                onBlur={handleSaveClick} // Guarda los cambios cuando el input pierde el foco
              />
            ) : (
              <>
                <span>{correo}</span>
                <FaEdit 
                  className="edit-icon" 
                  onClick={() => setIsEditingCorreo(true)} // Activa la edición al hacer clic en el ícono
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
            <strong>Espacios Parqueadero:</strong> {user.EspacioParqueadero}
          </p>
          <p>
            <strong>Código Vivienda:</strong> {user.CodigoVivienda}
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;
