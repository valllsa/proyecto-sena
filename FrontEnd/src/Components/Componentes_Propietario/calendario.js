import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
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
  const [formErrors, setFormErrors] = useState({
    Nombre: '',
    NumeroDocumento: '',
    Telefono: '',
    CodigoVivienda: '',
    Motivo: ''
  });

  const propietarioActual = formData.NumeroDocumento;

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
        setFormErrors(prev => ({ ...prev, global: "Error al obtener las reservas" }));
      }
    };
    fetchReservas();
  }, []);

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const existingReservation = reservas.some(res => res.Fecha === formattedDate);
    
    if (existingReservation) {
      setFormErrors(prev => ({ ...prev, global: "Este día ya está reservado." }));
      return;
    }
    
    setSelectedDate(formattedDate);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let isValid = true;
    let errorMessage = '';

    if (name === "Nombre" && !/^[a-zA-Z\s]*$/.test(value)) {
      errorMessage = "El nombre solo puede contener letras y espacios.";
      isValid = false;
    }

    if ((name === "NumeroDocumento" || name === "Telefono" || name === "CodigoVivienda") && !/^\d*$/.test(value)) {
      errorMessage = "Este campo solo puede contener números.";
      isValid = false;
    }

    if (name === "Motivo" && !/^[\w\s.,!?]*$/.test(value)) {
      errorMessage = "El motivo solo puede contener letras, números y puntuación básica.";
      isValid = false;
    }

    setFormErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));

    if (isValid) {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const existingReservation = reservas.some(res => res.Fecha === selectedDate);

    if (existingReservation) {
      setFormErrors(prev => ({ ...prev, global: "Este día ya está reservado." }));
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/ReservaSalon', {
        ...formData,
        Fecha: selectedDate,
      });

      setReservas(prevReservas => [...prevReservas, {
        ...response.data,
        Fecha: new Date(response.data.Fecha).toISOString().split('T')[0]
      }]);

      handleModalClose();
      setFormErrors(prev => ({ ...prev, global: "¡Reserva realizada con éxito!" }));
    } catch (error) {
      console.error('Error detallado:', error);
      setFormErrors(prev => ({
        ...prev,
        global: `Error al realizar la reserva: ${error.response?.data.message || 'Por favor, intente de nuevo.'}`
      }));
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const reserva = reservas.find(res => res.Fecha === dateStr);
      if (reserva) {
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
      <div>
        <h3 className="calendario-header">Reservar Salón Comunal</h3>
        {formErrors.global && (
          <div
            className={`alert ${formErrors.global.includes("éxito") ? "alert-success" : "alert-danger"} alert-dismissible fade show`}
            role="alert"
            style={{
              position: "fixed",
              top: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              maxWidth: "500px",
              zIndex: 1050,
              borderRadius: "0.375rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}
          >
            {formErrors.global}
          </div>
        )}
        
        <Calendar
          onChange={handleDateChange}
          tileContent={tileContent}
          tileDisabled={tileDisabled}
        />
      </div>
      <Modal
        show={showModal}
        onHide={handleModalClose}
        centered
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="custom-modal-title">Reserva del Salón para el {selectedDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="Nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="Nombre"
                    placeholder="Ingrese su nombre"
                    value={formData.Nombre}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.Nombre && <div className="error-message">{formErrors.Nombre}</div>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="NumeroDocumento">
                  <Form.Label>Número de Documento</Form.Label>
                  <Form.Control
                    type="text"
                    name="NumeroDocumento"
                    placeholder="Ingrese su documento"
                    value={formData.NumeroDocumento}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.NumeroDocumento && <div className="error-message">{formErrors.NumeroDocumento}</div>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="Telefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="Telefono"
                    placeholder="Ingrese su teléfono"
                    value={formData.Telefono}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.Telefono && <div className="error-message">{formErrors.Telefono}</div>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="CodigoVivienda">
                  <Form.Label>Código de Vivienda</Form.Label>
                  <Form.Control
                    type="text"
                    name="CodigoVivienda"
                    placeholder="Ingrese su código de vivienda"
                    value={formData.CodigoVivienda}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.CodigoVivienda && <div className="error-message">{formErrors.CodigoVivienda}</div>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="HoraInicio">
                  <Form.Label>Hora de Inicio</Form.Label>
                  <Form.Control
                    type="time"
                    name="HoraInicio"
                    value={formData.HoraInicio}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="HoraFin">
                  <Form.Label>Hora de Fin</Form.Label>
                  <Form.Control
                    type="time"
                    name="HoraFin"
                    value={formData.HoraFin}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="Motivo">
              <Form.Label>Motivo de la Reserva</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="Motivo"
                placeholder="Escriba el motivo de la reserva"
                value={formData.Motivo}
                onChange={handleChange}
                required
              />
              {formErrors.Motivo && <div className="error-message">{formErrors.Motivo}</div>}
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit">
                Confirmar Reserva
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Calendario;
