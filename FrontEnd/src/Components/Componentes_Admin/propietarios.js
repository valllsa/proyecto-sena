import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
/* Añadir iconos a la libraria */
library.add(faTrash);
library.add(faPenToSquare);
library.add(faSquarePlus);

const Propietario = ({ item, currentRecords, apiS }) => {
  const [accion, setAccion] = useState("");

  const [propietarios, setPropietarios] = useState({
    CodigoVivienda: "",
    Nombre: "",
    Teléfono: "",
    Correo: "",
    EstadoEnvio: "",
    NumeroDocumento: "",
    MesesAtrasados: "",
    EspacioParqueadero: "",
    User: "",
    Pass: "",
    id: "",
  });

  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredRecords, setFilteredRecords] = useState(currentRecords);

  const enviar = async (e) => {
    e.preventDefault();

    try {
      if (accion === "Actualizar") {
        if (propietarios.id) {
          const response = await axios.patch(
            `http://localhost:4000/${apiS}/${propietarios.id}`,
            {
              CodigoVivienda: propietarios.CodigoVivienda,
              Nombre: propietarios.Nombre,
              Teléfono: propietarios.Teléfono,
              Correo: propietarios.Correo,
              EstadoEnvio: propietarios.EstadoEnvio,
              NumeroDocumento: propietarios.NumeroDocumento,
              MesesAtrasados: propietarios.MesesAtrasados,
              EspacioParqueadero: propietarios.EspacioParqueadero,
              User: propietarios.User,
              Pass: propietarios.Pass,
              id: propietarios.id,
            }
          );
          console.log(response.status);
          if (response.status === 200) {
            alert("Registro actualizado exitosamente");
            setPropietarios((prevUsuario) => ({
              ...prevUsuario,
              id: "",
            }));
          }
        }
      } else if (accion === "Eliminar") {
        if (propietarios.id) {
          const response = await axios.delete(
            `http://localhost:4000/${apiS}/${propietarios.id}`
          );
          console.log(response.status);
          if (response.status === 200) {
            alert("Registro eliminado exitosamente exitosamente");
          }
        }
      } else if (accion === "Insertar") {
        const response = await axios.post(`http://localhost:4000/${apiS}`, {
          CodigoVivienda: propietarios.CodigoVivienda,
          Nombre: propietarios.Nombre,
          Teléfono: propietarios.Teléfono,
          Correo: propietarios.Correo,
          EstadoEnvio: propietarios.EstadoEnvio,
          NumeroDocumento: propietarios.NumeroDocumento,
          MesesAtrasados: propietarios.MesesAtrasados,
          EspacioParqueadero: propietarios.EspacioParqueadero,
          User: propietarios.User,
          Pass: propietarios.Pass,
        });
        console.log(response.status);
        if (response.status === 201) {
          alert("Registro exitoso");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al realizar la operación");
    }
  };

   const setCurrentAccion = (accion) => {
     setAccion(() => accion);
     console.log(accion)
   };

  const eliminar = (record) => {
    const confir = window.confirm("¿ Desea eliminar este registro ?");
    if (confir) {
      if (apiS === "Propietarios") {
        setPropietarios((prevSalon) => ({
          ...prevSalon,
          id: record,
        }));
      }
      setAccion(() => "Eliminar");
    }
  };

  const fetchFilteredRecords = async (term) => {
    try {
      if (term) {
        const response = await axios.get(
          `http://localhost:4000/${apiS}?NumeroDocumento=${term}`
        );
        if (response.status === 200) {
          setFilteredRecords(response.data);
        }
      } else {
        setFilteredRecords(currentRecords);
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al filtrar los registros");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredRecords(searchTerm);
  };

  return (
    <>
      <form className="d-flex mb-3" role="search" onSubmit={handleSearch}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          required
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setCurrentAccion("Consultar")}
          className="btn btn-outline-success"
          type="submit"
        >
          Search
        </button>
      </form>
      <table
        id="example2"
        className="table table-bordered table-hover dataTable dtr-inline"
        aria-describedby="example2_info"
      >
        <thead>
          <tr>
            {item.map((item, index) => (
              <th
                className="sorting"
                tabIndex="0"
                aria-controls="example2"
                rowSpan="1"
                colSpan="1"
                aria-label="Rendering engine: activate to sort column ascending"
                key={index}
              >
                {item}
              </th>
            ))}
            <th
              className="sorting"
              tabIndex="0"
              aria-controls="example2"
              rowSpan="1"
              colSpan="1"
              aria-label="Platform(s): activate to sort column ascending"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {accion !== "Consultar"
            ? currentRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.CodigoVivienda}</td>
                  <td>{record.Nombre}</td>
                  <td>{record.Teléfono}</td>
                  <td>{record.Correo}</td>
                  <td>{record.NumeroDocumento}</td>
                  <td>{record.MesesAtrasados}</td>
                  <td>
                    <div className="d-flex flex-row">
                      <div className="mx-2">
                        <form className="p-0" onSubmit={enviar}>
                          <button
                            onClick={() => eliminar(record.id)}
                            type="submit"
                            class="btn btn-danger px-2"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </form>
                      </div>
                      <div className="mx-2">
                        <button
                          type="button"
                          className="btn btn-warning px-2 py-1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => {
                            setPropietarios((prevPropietario) => ({
                              ...prevPropietario,
                              CodigoVivienda: record.CodigoVivienda,
                              Nombre: record.Nombre,
                              Teléfono: record.Teléfono,
                              Correo: record.Correo,
                              NumeroDocumento: record.NumeroDocumento,
                              MesesAtrasados: record.MesesAtrasados,
                              EspacioParqueadero: record.EspacioParqueadero,
                              User: record.User,
                              Pass: record.Pass,
                              id: record.id,
                            }));
                            setCurrentAccion("Actualizar");
                          }}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      </div>
                    </div>
                    <div
                      className="modal fade"
                      id="exampleModal"
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog w-50">
                        <div className="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">
                              {accion} Propietario
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
                              <div className="d-flex flex-row">
                                <div className="me-3">
                                  <div className="mb-3">
                                    <label
                                      htmlFor="exampleInputEmail1"
                                      className="form-label"
                                    >
                                      Nombre del Propietario
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="exampleInputEmail1"
                                      required
                                      value={propietarios.Nombre}
                                      onChange={(e) =>
                                        setPropietarios((prevPropietario) => ({
                                          ...prevPropietario,
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
                                      Teléfono
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="exampleInputPassword1"
                                      required
                                      value={propietarios.Teléfono}
                                      onChange={(e) =>
                                        setPropietarios((prevPropietario) => ({
                                          ...prevPropietario,
                                          Teléfono: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <label
                                      htmlFor="exampleInputPassword1"
                                      className="form-label"
                                    >
                                      Correo
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="exampleInputPassword1"
                                      required
                                      value={propietarios.Correo}
                                      onChange={(e) =>
                                        setPropietarios((prevPropietario) => ({
                                          ...prevPropietario,
                                          Correo: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <label
                                      htmlFor="exampleInputPassword1"
                                      className="form-label"
                                    >
                                      Numero de Documento
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="exampleInputPassword1"
                                      required
                                      value={propietarios.NumeroDocumento}
                                      onChange={(e) =>
                                        setPropietarios((prevPropietario) => ({
                                          ...prevPropietario,
                                          NumeroDocumento: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div className="mb-3">
                                    <label
                                      htmlFor="exampleInputEmail1"
                                      className="form-label"
                                    >
                                      Codigo de Vivienda
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="exampleInputEmail1"
                                      required
                                      value={propietarios.CodigoVivienda}
                                      onChange={(e) =>
                                        setPropietarios((prevPropietario) => ({
                                          ...prevPropietario,
                                          CodigoVivienda: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <label
                                      htmlFor="exampleInputPassword1"
                                      className="form-label"
                                    >
                                      Meses Atrasados
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="exampleInputPassword1"
                                      required
                                      value={propietarios.MesesAtrasados}
                                      onChange={(e) =>
                                        setPropietarios((prevPropietario) => ({
                                          ...prevPropietario,
                                          MesesAtrasados: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <label
                                      htmlFor="exampleInputPassword1"
                                      className="form-label"
                                    >
                                      Espacio de Parqueadero
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="exampleInputPassword1"
                                      required
                                      value={propietarios.EspacioParqueadero}
                                      onChange={(e) =>
                                        setPropietarios((prevPropietario) => ({
                                          ...prevPropietario,
                                          EspacioParqueadero: e.target.value,
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
                                  Nombre de usuario
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={propietarios.User}
                                  onChange={(e) =>
                                    setPropietarios((prevPropietario) => ({
                                      ...prevPropietario,
                                      User: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Contraseña
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={propietarios.Pass}
                                  onChange={(e) =>
                                    setPropietarios((prevPropietario) => ({
                                      ...prevPropietario,
                                      Pass: e.target.value,
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
                                className={
                                  accion === "Actualizar"
                                    ? "btn btn-warning"
                                    : accion === "Insertar"
                                    ? "btn btn-success w-25 m-0"
                                    : null
                                }
                              >
                                {accion}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            : filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.CodigoVivienda}</td>
                  <td>{record.Nombre}</td>
                  <td>{record.Teléfono}</td>
                  <td>{record.Correo}</td>
                  <td>{record.NumeroDocumento}</td>
                  <td>{record.MesesAtrasados}</td>
                  <td>
                    <div className="d-flex flex-row">
                      <div className="mx-2">
                        <form className="p-0" onSubmit={enviar}>
                          <button
                            onClick={() => eliminar(record.id)}
                            type="submit"
                            className="btn btn-danger px-2"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </form>
                      </div>
                      <div className="mx-2">
                        <button
                          type="button"
                          className="btn btn-warning px-2 py-1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => {
                            setPropietarios((prevPropietario) => ({
                              ...prevPropietario,
                              CodigoVivienda: record.CodigoVivienda,
                              Nombre: record.Nombre,
                              Teléfono: record.Teléfono,
                              Correo: record.Correo,
                              NumeroDocumento: record.NumeroDocumento,
                              MesesAtrasados: record.MesesAtrasados,
                              EspacioParqueadero: record.EspacioParqueadero,
                              User: record.User,
                              Pass: record.Pass,
                              id: record.id,
                            }));
                            setCurrentAccion("Actualizar");
                          }}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          <div
            className="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog w-50">
              <div className="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    {accion} Propietario
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
                    <div className="d-flex flex-row">
                      <div className="me-3">
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Nombre del Propietario
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            required
                            value={propietarios.Nombre}
                            onChange={(e) =>
                              setPropietarios((prevPropietario) => ({
                                ...prevPropietario,
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
                            Teléfono
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="exampleInputPassword1"
                            required
                            value={propietarios.Teléfono}
                            onChange={(e) =>
                              setPropietarios((prevPropietario) => ({
                                ...prevPropietario,
                                Teléfono: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputPassword1"
                            className="form-label"
                          >
                            Correo
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputPassword1"
                            required
                            value={propietarios.Correo}
                            onChange={(e) =>
                              setPropietarios((prevPropietario) => ({
                                ...prevPropietario,
                                Correo: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputPassword1"
                            className="form-label"
                          >
                            Numero de Documento
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="exampleInputPassword1"
                            required
                            value={propietarios.NumeroDocumento}
                            onChange={(e) =>
                              setPropietarios((prevPropietario) => ({
                                ...prevPropietario,
                                NumeroDocumento: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Codigo de Vivienda
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            required
                            value={propietarios.CodigoVivienda}
                            onChange={(e) =>
                              setPropietarios((prevPropietario) => ({
                                ...prevPropietario,
                                CodigoVivienda: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputPassword1"
                            className="form-label"
                          >
                            Meses Atrasados
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="exampleInputPassword1"
                            required
                            value={propietarios.MesesAtrasados}
                            onChange={(e) =>
                              setPropietarios((prevPropietario) => ({
                                ...prevPropietario,
                                MesesAtrasados: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputPassword1"
                            className="form-label"
                          >
                            Espacio de Parqueadero
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="exampleInputPassword1"
                            required
                            value={propietarios.EspacioParqueadero}
                            onChange={(e) =>
                              setPropietarios((prevPropietario) => ({
                                ...prevPropietario,
                                EspacioParqueadero: e.target.value,
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
                        Nombre de usuario
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputPassword1"
                        required
                        value={propietarios.User}
                        onChange={(e) =>
                          setPropietarios((prevPropietario) => ({
                            ...prevPropietario,
                            User: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Contraseña
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputPassword1"
                        required
                        value={propietarios.Pass}
                        onChange={(e) =>
                          setPropietarios((prevPropietario) => ({
                            ...prevPropietario,
                            Pass: e.target.value,
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
                      className={
                        accion === "Actualizar"
                          ? "btn btn-warning"
                          : accion === "Insertar"
                          ? "btn btn-success w-25 m-0"
                          : null
                      }
                    >
                      {accion}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="6"></th>
            <th rowSpan="1" colSpan="1">
              <button
                type="button"
                className="btn btn-success p-0 m-0 w-50"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => {
                  setPropietarios((prevReuniones) => ({
                    ...prevReuniones,
                    CodigoVivienda: "",
                    Nombre: "",
                    Teléfono: "",
                    Correo: "",
                    NumeroDocumento: "",
                    MesesAtrasados: "",
                    EspacioParqueadero: "",
                    User: "",
                    Pass: "",
                  }));
                  setCurrentAccion("Insertar");
                }}
              >
                <FontAwesomeIcon icon={faSquarePlus} />
              </button>
            </th>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default Propietario;
