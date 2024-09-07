import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';
import axios from 'axios';

const Calendario = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: '',
    NumeroDocumento: '',
    Telefono: '',
    CodigoVivienda: '',
    HoraInicio: '',
    HoraFin: '',
    Motivo: ''
  });
  const [reservas, setReservas] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Obtener el Número de Documento del usuario autenticado desde localStorage
  const propietarioActual = localStorage.getItem('NumeroDocumento')?.trim();

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await axios.get('http://localhost:4000/ReservaSalon');
        const formattedReservas = response.data.map(res => ({
          ...res,
          Fecha: new Date(res.Fecha).toISOString().split('T')[0]
        }));
        setReservas(formattedReservas);
      } catch (error) {
        console.error('Error al obtener las reservas', error);
        setAlertMessage("Error al obtener las reservas");
        setShowAlert(true);
      }
    };
    fetchReservas();
  }, []);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const existingReservation = reservas.some(res => res.Fecha === formattedDate);

    if (existingReservation) {
      setAlertMessage("Este día ya está reservado.");
      setShowAlert(true);
      return;
    }

    setSelectedDate(formattedDate);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const existingReservation = reservas.some(res => res.Fecha === selectedDate);

    if (existingReservation) {
      setAlertMessage("Este día ya está reservado.");
      setShowAlert(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/ReservaSalon', {
        ...formData,
        Fecha: selectedDate,
        NumeroDocumento: propietarioActual
      });

      setReservas(prevReservas => [...prevReservas, {
        ...response.data,
        Fecha: new Date(response.data.Fecha).toISOString().split('T')[0]
      }]);

      handleModalClose();
      setAlertMessage("¡Reserva realizada con éxito!");
      setShowAlert(true);
    } catch (error) {
      console.error('Error detallado:', error);
      setAlertMessage(`Error al realizar la reserva: ${error.response?.data.message || 'Por favor, intente de nuevo.'}`);
      setShowAlert(true);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const reserva = reservas.find(res => res.Fecha === dateStr);
      if (reserva) {
        // Asegúrate de que el NumeroDocumento del reserva esté definido
        const colorClass = reserva.NumeroDocumento === propietarioActual ? 'green' : 'red';
        return <div className={`indicator ${colorClass}`}></div>;
      }
    }
    return null;
  };

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const today = new Date();
      return date < today;
    }
    return false;
  };

  return (
    <div>
      <h3 className="calendario-header">Reservar Salón Comunal</h3>
      {showAlert && (
        <div
          className={`alert ${alertMessage.includes("éxito") ? "alert-success" : "alert-danger"} alert-dismissible fade show`}
          role="alert"
          style={{ position: "fixed", top: 0, width: "20%", zIndex: 1000 }}
        >
          {alertMessage}
        </div>
      )}

      <Calendar
        onChange={handleDateChange}
        tileContent={tileContent}
        tileDisabled={tileDisabled}
      />

      {showModal && (
        <div className="calendario-modal-overlay">
          <div className="calendario-modal-content">
            <h2>Reservar para el {selectedDate}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="Nombre">Nombre:</label>
                <input type="text" id="Nombre" name="Nombre" value={formData.Nombre} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="NumeroDocumento">Número de Documento:</label>
                <input type="text" id="NumeroDocumento" name="NumeroDocumento" value={formData.NumeroDocumento} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="Telefono">Teléfono:</label>
                <input type="text" id="Telefono" name="Telefono" value={formData.Telefono} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="CodigoVivienda">Código de Vivienda:</label>
                <input type="text" id="CodigoVivienda" name="CodigoVivienda" value={formData.CodigoVivienda} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="HoraInicio">Hora de Inicio:</label>
                <input type="time" id="HoraInicio" name="HoraInicio" value={formData.HoraInicio} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="HoraFin">Hora de Fin:</label>
                <input type="time" id="HoraFin" name="HoraFin" value={formData.HoraFin} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="Motivo">Motivo:</label>
                <textarea id="Motivo" name="Motivo" value={formData.Motivo} onChange={handleChange} required></textarea>
              </div>

              <button type="submit" className="btn btn-primary">Reservar</button>
              <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
