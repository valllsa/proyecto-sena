import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

library.add(faTrash);
library.add(faPenToSquare);

const ReservaSalon = ({ currentRecords, length, apiS }) => {
  const [accion, setAccion] = useState("");

  const [salonComunal, setSalonComunal] = useState({
    id: "",
    Nombre: "",
    NumeroDocumento: "",
    Telefono: "",
    CodigoVivienda: "",
    HoraInicio: "",
    HoraFin: "",
    Motivo: "",
    Fecha: "",
  });

  const enviar = async (e) => {
    e.preventDefault();
    try {
      if (accion === "Actualizar") {
        if (salonComunal.id) {
          const response = await axios.patch(
            `http://localhost:4000/${apiS}/${salonComunal.id}`,
            {
              id: salonComunal.id,
              Nombre: salonComunal.Nombre,
              NumeroDocumento: salonComunal.NumeroDocumento,
              Telefono: salonComunal.Telefono,
              CodigoVivienda: salonComunal.CodigoVivienda,
              HoraInicio: salonComunal.HoraInicio,
              HoraFin: salonComunal.HoraFin,
              Motivo: salonComunal.Motivo,
              Fecha: salonComunal.Fecha,
            }
          );
          if (response.status === 200) {
            alert("Registro actualizado exitosamente");
            setSalonComunal((prevUsuario) => ({
              ...prevUsuario,
              id: "",
            }));
          }
        }
      } else if (accion === "Eliminar") {
        if (salonComunal.id) {
          const response = await axios.delete(
            `http://localhost:4000/${apiS}/${salonComunal.id}`
          );
          if (response.status === 200) {
            alert("Registro eliminado exitosamente exitosamente");
          }
        }
      } else if (accion === "Insertar") {
        const response1 = await axios.post(
          `http://localhost:4000/ReservaSalon`,
          {
            id: salonComunal.id,
            Nombre: salonComunal.Nombre,
            NumeroDocumento: salonComunal.NumeroDocumento,
            Telefono: salonComunal.Telefono,
            CodigoVivienda: salonComunal.CodigoVivienda,
            HoraInicio: salonComunal.HoraInicio,
            HoraFin: salonComunal.HoraFin,
            Motivo: salonComunal.Motivo,
            Fecha: salonComunal.Fecha,
          }
        );
        if (response1.status === 201) {
          alert("Solicitud aprobada");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al realizar la operación");
    }
  };

  const setCurrentAccion = (accion) => {
    setAccion(() => accion);
  };

  const eliminar = (record) => {
    const confir = window.confirm("¿ Desea eliminar este registro ?");
    if (confir) {
      if (apiS === "ReservaSalon") {
        setSalonComunal((prevSalon) => ({
          ...prevSalon,
          id: record,
        }));
      } 
      setAccion(() => "Eliminar");
    }
  };

  return (
    <div className="accordion" id="accordionExample">
      {length === 0 ? (
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={"#collapse"}
              aria-expanded="false"
              aria-controls={"collapse"}
            >
              No hay solicitudes
            </button>
          </h2>
          <div
            id={"collapse"}
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          ></div>
        </div>
      ) : (
        currentRecords.map((record, index) => (
          <div key={index} class="card mb-3">
            <div class="card-body">
              <div className="d-flex flex-row justify-content-start align-items-center">
                <div className="w-75">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item text-start">
                      <span className="fw-bold">{record.Nombre}</span> de la
                      casa{" "}
                      <span className="fw-bold">{record.CodigoVivienda}</span>{" "}
                      ha rentado el salon comunal
                    </li>
                    <li class="list-group-item text-start">
                      Dia: <span className="fw-bold">{record.Fecha}</span>
                    </li>
                    <li class="list-group-item text-start">
                      Hora de inicio:{" "}
                      <span className="fw-bold">{record.HoraInicio}</span>
                    </li>
                    <li class="list-group-item text-start">
                      Hora de finalización:{" "}
                      <span className="fw-bold">{record.HoraFin}</span>
                    </li>
                  </ul>
                </div>
                <div className="w-25">
                  <form onSubmit={enviar}>
                    <button
                      onClick={() => eliminar(record.id)}
                      type="submit"
                      class="btn btn-danger"
                    >
                      <FontAwesomeIcon icon={faTrash} className="fs-1" />
                    </button>
                  </form>
                </div>
                <div className="w-25">
                  <button
                    type="button"
                    class="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() =>
                      setSalonComunal((prevUsuario) => ({
                        ...prevUsuario,
                        id: record.id,
                        Nombre: record.Nombre,
                        NumeroDocumento: record.NumeroDocumento,
                        Telefono: record.Telefono,
                        CodigoVivienda: record.CodigoVivienda,
                        HoraInicio: record.HoraInicio,
                        HoraFin: record.HoraFin,
                        Motivo: record.Motivo,
                        Fecha: record.Fecha,
                      }))
                    }
                  >
                    <FontAwesomeIcon icon={faPenToSquare} className="fs-1" />
                  </button>
                  {/* Modal de actualización */}
                  <div
                    class="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">
                            {accion} Solicitud de salon comunal
                          </h1>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <form onSubmit={enviar}>
                          <div class="modal-body">
                            <div className="mb-3">
                              <label
                                htmlFor="exampleInputEmail1"
                                className="form-label"
                              >
                                Nombre
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="exampleInputEmail1"
                                required
                                value={salonComunal.Nombre}
                                onChange={(e) =>
                                  setSalonComunal((prevUsuario) => ({
                                    ...prevUsuario,
                                    Nombre: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor="exampleInputPassword1"
                                className="form-label"
                              >
                                Numero de documento
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="exampleInputPassword1"
                                required
                                value={salonComunal.NumeroDocumento}
                                onChange={(e) =>
                                  setSalonComunal((prevUsuario) => ({
                                    ...prevUsuario,
                                    NumeroDocumento: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor="exampleInputPassword1"
                                className="form-label"
                              >
                                Telénofo
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="exampleInputPassword1"
                                required
                                value={salonComunal.Telefono}
                                onChange={(e) =>
                                  setSalonComunal((prevUsuario) => ({
                                    ...prevUsuario,
                                    Telefono: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor="exampleInputPassword1"
                                className="form-label"
                              >
                                Codigo de vivienda
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="exampleInputPassword1"
                                required
                                value={salonComunal.CodigoVivienda}
                                onChange={(e) =>
                                  setSalonComunal((prevUsuario) => ({
                                    ...prevUsuario,
                                    CodigoVivienda: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="mb-3">
                              <div className="d-flex flex-row justify-content-around">
                                <div>
                                  <label
                                    htmlFor="exampleInputPassword1"
                                    className="form-label"
                                  >
                                    Hora de inicio
                                  </label>
                                  <input
                                    type="time"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    required
                                    value={salonComunal.HoraInicio}
                                    onChange={(e) =>
                                      setSalonComunal((prevUsuario) => ({
                                        ...prevUsuario,
                                        HoraInicio: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="exampleInputPassword1"
                                    className="form-label"
                                  >
                                    Hora de finalización
                                  </label>
                                  <input
                                    type="time"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    required
                                    value={salonComunal.HoraFin}
                                    onChange={(e) =>
                                      setSalonComunal((prevUsuario) => ({
                                        ...prevUsuario,
                                        HoraFin: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor="exampleInputPassword1"
                                className="form-label"
                              >
                                Dia
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                id="exampleInputPassword1"
                                required
                                value={salonComunal.Fecha}
                                onChange={(e) =>
                                  setSalonComunal((prevUsuario) => ({
                                    ...prevUsuario,
                                    Fecha: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>
                          <div class="modal-footer">
                            <button
                              type="button"
                              class="btn btn-danger"
                              data-bs-dismiss="modal"
                            >
                              Cerrar
                            </button>
                            <button
                              type="submit"
                              className="btn btn-warning"
                              onClick={() => setCurrentAccion("Actualizar")}
                            >
                              Guardar cambios
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReservaSalon;
